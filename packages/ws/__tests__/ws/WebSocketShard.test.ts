import { Buffer } from 'node:buffer';
import { once } from 'node:events';
import { createServer } from 'node:http';
import { expect, test, vi } from 'vitest';
import { WebSocketServer } from 'ws';
import {
	WebSocketShard,
	WebSocketShardStatus,
	WebSocketShardEvents,
	WebSocketShardDestroyRecovery,
	type IContextFetchingStrategy,
} from '../../src/index.js';

// A local gateway keeps READY pending after IDENTIFY, allowing destroy() to race the wait.
test('destroying while waiting for READY closes the shard without reconnecting', async () => {
	const server = createServer();
	const gateway = new WebSocketServer({ server });
	let connections = 0;
	gateway.on('connection', (socket) => {
		connections++;
		// eslint-disable-next-line id-length
		socket.send(JSON.stringify({ op: 10, d: { heartbeat_interval: 41_250 } }));
		socket.on('message', (data) => {
			if (!Buffer.isBuffer(data)) throw new Error('Expected a Buffer payload');
			const payload: { op: number } = JSON.parse(data.toString('utf8'));
			if (payload.op === 1) socket.send(JSON.stringify({ op: 11 }));
		});
	});

	try {
		server.listen(0, '127.0.0.1');
		await once(server, 'listening');
		const address = server.address();
		if (!address || typeof address === 'string') throw new Error('Expected a TCP port');
		let identify: () => void;
		const identified = new Promise<void>((resolve) => {
			identify = resolve;
		});
		gateway.on('connection', (socket) =>
			socket.on('message', (data) => {
				if (!Buffer.isBuffer(data)) throw new Error('Expected a Buffer payload');
				if (JSON.parse(data.toString('utf8')).op === 2) identify();
			}),
		);
		const strategy = {
			options: {
				version: '10',
				encoding: 'json',
				compression: null,
				useIdentifyCompression: false,
				gatewayInformation: { url: `ws://127.0.0.1:${address.port}` },
				shardCount: 1,
				helloTimeout: 1_000,
				readyTimeout: 1_000,
				token: 'fake',
				intents: 0,
				capabilities: 0,
				identifyProperties: { os: 'test', browser: 'test', device: 'test' },
			},
			retrieveSessionInfo: vi.fn(() => null),
			updateSessionInfo: vi.fn(),
			waitForIdentify: vi.fn(async () => {}),
		} as unknown as IContextFetchingStrategy;
		const shard = new WebSocketShard(strategy, 0);
		const connect = shard.connect();
		await identified;
		await expect(
			Promise.race([
				shard.destroy(),
				new Promise((resolve) => {
					setTimeout(() => {
						resolve('timed out');
					}, 200);
				}),
			]),
		).resolves.toBeUndefined();
		expect(shard.status).toBe(WebSocketShardStatus.Idle);
		await new Promise((resolve) => {
			setTimeout(() => {
				resolve(undefined);
			}, 600);
		});
		expect(connections).toBe(1);
		// An aborted initial connect need not complete, but should not reject unhandled.
		void connect;
	} finally {
		for (const socket of gateway.clients) socket.terminate();
		await new Promise<void>((resolve) => {
			gateway.close(() => {
				resolve();
			});
		});
		await new Promise<void>((resolve, reject) => {
			server.close((error) => {
				if (error) reject(error);
				else resolve();
			});
		});
	}
});

test('a READY timeout still requests reconnection', async () => {
	const strategy = { options: {} } as IContextFetchingStrategy;
	const shard = new WebSocketShard(strategy, 0);
	const destroy = vi.spyOn(shard, 'destroy').mockResolvedValue();

	// eslint-disable-next-line @typescript-eslint/dot-notation
	await expect(shard['waitForEvent'](WebSocketShardEvents.Ready, 10)).resolves.toEqual({ ok: false });
	expect(destroy).toHaveBeenCalledWith(expect.objectContaining({ recover: WebSocketShardDestroyRecovery.Reconnect }));
});
