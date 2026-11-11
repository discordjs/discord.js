import { Buffer } from 'node:buffer';
import { once } from 'node:events';
import { createServer, type AddressInfo, type Server, type Socket } from 'node:net';
import type * as Net from 'node:net';
import { RPCCommands, RPCEvents } from 'discord-api-types/v10';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { RPCClient } from '../src/client.js';

const state = vi.hoisted(() => ({
	port: 0,
	sockets: [] as Socket[],
	connections: [] as Socket[],
	errors: [] as Error[],
}));

vi.mock('node:fs/promises', () => ({ default: { access: vi.fn(async () => {}) } }));
vi.mock('node:net', async (importOriginal) => {
	const net = await importOriginal<typeof Net>();
	class ObservedSocket extends net.Socket {
		public constructor() {
			super();
			state.sockets.push(this);
			// Observe real socket errors without allowing a regression to terminate the test runner.
			this.on('error', (error) => state.errors.push(error));
		}
	}
	return {
		...net,
		Socket: ObservedSocket,
		createConnection: () => {
			const socket = new ObservedSocket();
			state.connections.push(socket);
			return socket.connect(state.port, '127.0.0.1');
		},
	};
});

describe('IPC cancellation during open with real sockets', () => {
	let server: Server;
	const accepted = new Set<Socket>();
	const opcodes: number[] = [];

	beforeEach(async () => {
		state.sockets.length = 0;
		state.connections.length = 0;
		state.errors.length = 0;
		opcodes.length = 0;
		server = createServer((socket) => {
			accepted.add(socket);
			socket.once('close', () => accepted.delete(socket));
			let pending: Buffer = Buffer.alloc(0);
			socket.on('data', (chunk: Buffer) => {
				pending = Buffer.concat([pending, chunk]);
				while (pending.length >= 8) {
					const length = pending.readUInt32LE(4);
					if (pending.length < 8 + length) break;
					const opcode = pending.readUInt32LE(0);
					opcodes.push(opcode);
					pending = pending.subarray(8 + length);
					if (opcode === 0) {
						const payload = Buffer.from(JSON.stringify({ cmd: RPCCommands.Dispatch, evt: RPCEvents.Ready, data: {} }));
						const header = Buffer.alloc(8);
						header.writeUInt32LE(1, 0);
						header.writeUInt32LE(payload.length, 4);
						socket.write(Buffer.concat([header, payload]));
					}
				}
			});
		});
		server.listen(0, '127.0.0.1');
		await once(server, 'listening');
		state.port = (server.address() as AddressInfo).port;
	});

	afterEach(async () => {
		for (const socket of [...state.sockets, ...accepted]) socket.destroy();
		await new Promise<void>((resolve) => {
			server.close(() => resolve());
		});
	});

	test.each(['client abort', 'transport abort', 'transport close'])(
		'stops setup after synchronous %s in an open listener',
		async (action) => {
			const client = new RPCClient();
			const controller = new AbortController();
			const reason = new Error('cancel from open');
			let closing: Promise<unknown> | undefined;
			client.transport.on('error', () => {});
			client.transport.once('open', () => {
				if (action === 'transport close') closing = client.transport.close();
				else controller.abort(reason);
			});

			const connecting =
				action === 'client abort'
					? client.connect({ signal: controller.signal })
					: client.transport.connect({ signal: controller.signal });
			if (action === 'transport close') await expect(connecting).rejects.toBeInstanceOf(Error);
			else await expect(connecting).rejects.toBe(reason);
			await closing;
			await new Promise<void>((resolve) => {
				setImmediate(resolve);
			});

			expect(state.connections).toHaveLength(1);
			expect(state.connections[0]!.destroyed).toBe(true);
			expect(state.errors).toEqual([]);
			expect(opcodes).not.toContain(0);
			expect(client.ready).toBe(false);
		},
	);

	test('keeps an immediate retry ready after cancellation in an open listener', async () => {
		const client = new RPCClient();
		const controller = new AbortController();
		const reason = new Error('cancel first open');
		client.transport.on('error', () => {});
		client.transport.once('open', () => controller.abort(reason));
		await expect(client.connect({ signal: controller.signal })).rejects.toBe(reason);
		const previous = state.connections[0]!;

		await client.connect({ signal: AbortSignal.timeout(1_000) });
		expect(state.connections).toHaveLength(2);
		const current = state.connections[1]!;
		previous.emit('close', false);
		await new Promise<void>((resolve) => {
			setImmediate(resolve);
		});

		expect(previous.destroyed).toBe(true);
		expect(current.destroyed).toBe(false);
		expect(client.ready).toBe(true);
		expect(state.errors).toEqual([]);
		expect(opcodes).toEqual([0]);
	});
});
