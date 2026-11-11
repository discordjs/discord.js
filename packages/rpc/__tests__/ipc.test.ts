import { Buffer } from 'node:buffer';
import { getEventListeners } from 'node:events';
import { createConnection } from 'node:net';
import { RPCCommands, RPCEvents } from 'discord-api-types/v10';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { RPCClient } from '../src/client.js';
import { encode, IPCTransport } from '../src/ipc.js';

vi.mock('node:fs/promises', () => ({ default: { access: vi.fn(async () => {}) } }));
vi.mock('node:net', async () => {
	const { EventEmitter } = await import('node:events');
	class Socket extends EventEmitter {
		public pending = true;
		public destroyed = false;
		public reads: Buffer[] = [];
		public writes: Buffer[] = [];
		public finishConnect = () => {};
		public read() {
			return this.reads.shift() ?? null;
		}
		public write(data: Buffer) {
			this.writes.push(data);
			return true;
		}
		public pause() {
			return this;
		}
		public end() {
			return this;
		}
		public destroy(error?: Error) {
			if (this.destroyed) return this;
			this.destroyed = true;
			this.pending = false;
			queueMicrotask(() => {
				if (error) this.emit('error', error);
				this.emit('close', false);
			});
			return this;
		}
	}
	return {
		Socket,
		createConnection: vi.fn((_path: string, connectListener?: () => void) => {
			const socket = new Socket();
			if (connectListener) socket.once('connect', connectListener);
			socket.finishConnect = () => {
				if (socket.destroyed) return;
				socket.pending = false;
				socket.emit('connect');
			};
			return socket;
		}),
	};
});

interface TestSocket {
	pending: boolean;
	destroyed: boolean;
	reads: Buffer[];
	writes: Buffer[];
	finishConnect(): void;
	destroy(error?: Error): unknown;
	emit(event: string, ...args: unknown[]): boolean;
	listenerCount(event: string): number;
}
interface TestTransport {
	socket: TestSocket;
	working: { buffer: Buffer };
	decode(): void;
}
const internals = (transport: IPCTransport) => transport as unknown as TestTransport;
const serverFrame = (op: number, data: unknown) => {
	const payload = Buffer.from(JSON.stringify(data));
	const header = Buffer.alloc(8);
	header.writeUInt32LE(op, 0);
	header.writeUInt32LE(payload.length, 4);
	return Buffer.concat([header, payload]);
};
const message = (nonce: string) => ({ cmd: RPCCommands.Dispatch, evt: RPCEvents.Ready, data: {}, nonce });
const tick = () =>
	new Promise<void>((resolve) => {
		setImmediate(resolve);
	});
const delay = () =>
	new Promise<void>((resolve) => {
		setTimeout(resolve, 10);
	});
const created = () => vi.mocked(createConnection).mock.results.at(-1)!.value as TestSocket;
const transports: IPCTransport[] = [];
const fixture = () => {
	const transport = new IPCTransport({ clientId: '1234' } as RPCClient);
	transports.push(transport);
	const socket = internals(transport).socket;
	socket.pending = false;
	const messages: unknown[] = [];
	transport.on('message', (data) => {
		messages.push(data);
	});
	return { transport, socket, messages };
};
async function feed(transport: IPCTransport, data: Buffer) {
	internals(transport).socket.reads.push(data);
	await internals(transport).decode();
}

beforeEach(() => vi.clearAllMocks());
afterEach(() => {
	for (const transport of transports.splice(0)) internals(transport).socket.destroy();
});

describe('IPC framing', () => {
	test.each([1, 4, 7])('buffers a header split after byte %i', async (split) => {
		const { transport, messages } = fixture();
		const frame = serverFrame(1, message('one'));
		await feed(transport, frame.subarray(0, split));
		expect(messages).toEqual([]);
		await feed(transport, frame.subarray(split));
		expect(messages).toEqual([message('one')]);
	});

	test('buffers an incomplete payload until its declared length arrives', async () => {
		const { transport, messages } = fixture();
		const frame = serverFrame(1, message('one'));
		await feed(transport, frame.subarray(0, frame.length - 2));
		expect(messages).toEqual([]);
		await feed(transport, frame.subarray(frame.length - 2));
		expect(messages).toEqual([message('one')]);
	});

	test('dispatches every coalesced frame and replies to Ping', async () => {
		const { transport, socket, messages } = fixture();
		await feed(
			transport,
			Buffer.concat([serverFrame(1, message('one')), encode(3, 'ping'), serverFrame(1, message('two'))]),
		);
		expect(messages).toEqual([message('one'), message('two')]);
		expect(socket.writes).toEqual([encode(4, 'ping')]);
	});

	test('retains the incomplete next frame after dispatching a complete one', async () => {
		const { transport, messages } = fixture();
		const second = serverFrame(1, message('two'));
		await feed(transport, Buffer.concat([serverFrame(1, message('one')), second.subarray(0, 5)]));
		expect(messages).toEqual([message('one')]);
		expect(internals(transport).working.buffer).toEqual(second.subarray(0, 5));
		await feed(transport, second.subarray(5));
		expect(messages).toEqual([message('one'), message('two')]);
	});

	test('closes on malformed JSON in a complete frame', async () => {
		const { transport, socket } = fixture();
		const frame = Buffer.alloc(9);
		frame.writeUInt32LE(1, 0);
		frame.writeUInt32LE(1, 4);
		frame.write('{', 8);
		await feed(transport, frame);
		expect(socket.destroyed).toBe(true);
	});

	test('releases the socket on a Close opcode and stops dispatching', async () => {
		const { transport, socket, messages } = fixture();
		const onClose = vi.fn();
		transport.on('close', onClose);
		await feed(transport, Buffer.concat([encode(2, {}), serverFrame(1, message('late'))]));
		expect(socket.destroyed).toBe(true);
		expect(messages).toEqual([]);
		expect(onClose).toHaveBeenCalledOnce();
		expect(internals(transport).working.buffer).toHaveLength(0);
	});
});

describe('IPC cancellation and close', () => {
	test('rejects promptly and destroys a socket while connecting', async () => {
		const client = new RPCClient();
		transports.push(client.transport);
		const controller = new AbortController();
		const reason = new Error('cancel connection');
		let settled = false;
		const connect = async () => {
			try {
				await client.connect({ signal: controller.signal });
				return undefined;
			} catch (error) {
				return error;
			} finally {
				settled = true;
			}
		};
		const result = connect();
		await tick();
		const socket = created();
		controller.abort(reason);
		await delay();
		try {
			expect(settled).toBe(true);
			expect(socket.destroyed).toBe(true);
			expect(socket.listenerCount('connect')).toBe(0);
			expect(client.listenerCount(RPCEvents.Ready)).toBe(0);
			expect(client.transport.listenerCount('close')).toBe(0);
		} finally {
			socket.finishConnect();
			await result;
			socket.destroy();
		}
		expect(await result).toBe(reason);
	});

	test('does not start a connection with an already aborted signal', async () => {
		const client = new RPCClient();
		transports.push(client.transport);
		const reason = new Error('already cancelled');
		const connection = expect(client.connect({ signal: AbortSignal.abort(reason) })).rejects.toBe(reason);
		await tick();
		try {
			expect(createConnection).not.toHaveBeenCalled();
		} finally {
			if (vi.mocked(createConnection).mock.results.length) created().finishConnect();
			await tick();
			client.emit(RPCEvents.Ready, {} as never);
			await connection;
		}
	});

	test('keeps a retried connection ready when an aborted attempt rejects late', async () => {
		const client = new RPCClient();
		transports.push(client.transport);
		const staleTransport = Promise.withResolvers<undefined>();
		vi.spyOn(client.transport, 'connect').mockReturnValueOnce(staleTransport.promise).mockResolvedValueOnce(undefined);
		const controller = new AbortController();
		const reason = new Error('cancel first attempt');
		const cancelled = expect(client.connect({ signal: controller.signal })).rejects.toBe(reason);
		controller.abort(reason);
		await cancelled;

		const retry = client.connect();
		await client.transport.emit('message', message('retry'));
		await retry;
		expect(client.ready).toBe(true);

		staleTransport.reject(new Error('late transport failure'));
		await tick();

		expect(client.ready).toBe(true);
		expect(client.transport.listenerCount('close')).toBe(1);
		expect(getEventListeners(controller.signal, 'abort')).toHaveLength(0);
	});

	test('ignores a cancelled socket closing after a retry is ready', async () => {
		const client = new RPCClient();
		transports.push(client.transport);
		const controller = new AbortController();
		const reason = new Error('cancel before ready');
		const cancelled = expect(client.connect({ signal: controller.signal })).rejects.toBe(reason);
		await tick();
		const previous = created();
		previous.finishConnect();
		await tick();
		// A real socket can emit close after the cancelled connection promise settles.
		vi.spyOn(previous, 'destroy').mockImplementation(() => {
			previous.destroyed = true;
			return previous;
		});

		controller.abort(reason);
		await cancelled;
		expect(getEventListeners(controller.signal, 'abort')).toHaveLength(0);
		const retry = client.connect();
		await tick();
		const current = created();
		current.finishConnect();
		await tick();
		await client.transport.emit('message', message('retry'));
		await retry;

		previous.emit('close', false);
		await tick();

		expect(client.ready).toBe(true);
		expect(current.destroyed).toBe(false);
	});

	test('transport close cancels a pending connection without trying another path', async () => {
		const transport = new IPCTransport({ clientId: '1234' } as RPCClient);
		transports.push(transport);
		const result = expect(transport.connect()).rejects.toBeInstanceOf(Error);
		await tick();
		const socket = created();
		const close = transport.close();
		await delay();
		try {
			expect(socket.destroyed).toBe(true);
			expect(createConnection).toHaveBeenCalledOnce();
		} finally {
			socket.finishConnect();
			transport.emit('close', new Error('cleanup'));
			await close;
			await result;
			socket.destroy();
		}
	});

	test('does not bind an established connection to the completed login signal', async () => {
		const client = new RPCClient();
		transports.push(client.transport);
		const controller = new AbortController();
		const connection = client.connect({ signal: controller.signal });
		await tick();
		const socket = created();
		socket.finishConnect();
		await tick();
		await client.transport.emit('message', message('ready'));
		await connection;
		controller.abort(new Error('login deadline after ready'));
		await tick();
		expect(socket.destroyed).toBe(false);
		expect(client.ready).toBe(true);
		expect(getEventListeners(controller.signal, 'abort')).toHaveLength(0);
	});

	test('destroys the socket and removes close listeners on a close timeout', async () => {
		const { transport, socket } = fixture();
		const controller = new AbortController();
		const reason = new Error('close timeout');
		const result = expect(transport.close({ signal: controller.signal })).rejects.toBe(reason);
		controller.abort(reason);
		await result;
		expect(socket.destroyed).toBe(true);
		expect(transport.listenerCount('close')).toBe(0);
		expect(getEventListeners(controller.signal, 'abort')).toHaveLength(0);
	});

	test('handles an already aborted close signal without sending another frame', async () => {
		const { transport, socket } = fixture();
		const reason = new Error('already expired');
		const signal = AbortSignal.abort(reason);
		const close = expect(transport.close({ signal })).rejects.toBe(reason);
		await tick();
		try {
			expect(socket.destroyed).toBe(true);
			expect(socket.writes).toEqual([]);
			expect(getEventListeners(signal, 'abort')).toHaveLength(0);
		} finally {
			transport.emit('close', new Error('cleanup'));
			await close;
		}
	});
});
