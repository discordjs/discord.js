import type { Buffer } from 'node:buffer';
import { once } from 'node:events';
import type { AddressInfo } from 'node:net';
import { setTimeout as sleep } from 'node:timers/promises';
import { GatewayOpcodes } from 'discord-api-types/v10';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { WebSocketServer, type WebSocket } from 'ws';
import { WebSocketManager } from '../../src/index.js';
import { mockGatewayInformation } from '../gateway.mock.js';

let server: WebSocketServer;
let connections: number;
let identifies: number;

// A stand-in for the gateway that says hello but never answers IDENTIFY with READY
beforeEach(async () => {
	connections = 0;
	identifies = 0;
	server = new WebSocketServer({ host: '127.0.0.1', port: 0 });
	server.on('connection', (socket: WebSocket) => {
		connections++;
		socket.on('message', (data: Buffer) => {
			const payload = JSON.parse(data.toString('utf8'));
			if (payload.op === GatewayOpcodes.Identify) {
				identifies++;
				server.emit('identify');
			}
		});
		// eslint-disable-next-line id-length
		socket.send(JSON.stringify({ op: GatewayOpcodes.Hello, d: { heartbeat_interval: 60_000 } }));
	});
	await once(server, 'listening');
});

afterEach(async () => {
	for (const client of server.clients) {
		client.terminate();
	}

	await new Promise((resolve) => {
		server.close(resolve);
	});
});

test('destroy() while waiting for READY resolves and does not reconnect', async () => {
	const { port } = server.address() as AddressInfo;
	const manager = new WebSocketManager({
		token: 'A-Very-Fake-Token',
		intents: 0,
		// Identify right away instead of waiting out the 5s identify window
		buildIdentifyThrottler: () => ({ waitForIdentify: async () => {} }),
	});

	const identified = once(server, 'identify');
	void manager.connect({
		gatewayInformation: { ...mockGatewayInformation, url: `ws://127.0.0.1:${port}` },
	});
	await identified;

	const destroyed = async () => {
		await manager.destroy();
		return 'resolved' as const;
	};

	const timedOut = async () => {
		await sleep(2_000);
		return 'timed out' as const;
	};

	await expect(Promise.race([destroyed(), timedOut()])).resolves.toBe('resolved');

	// Give a would-be recovery reconnect (500ms delay) time to happen
	await sleep(1_000);

	expect(connections).toBe(1);
	expect(identifies).toBe(1);
	expect(server.clients.size).toBe(0);
});

test('a READY timeout still reconnects and identifies again', async () => {
	const { port } = server.address() as AddressInfo;
	const manager = new WebSocketManager({
		token: 'A-Very-Fake-Token',
		intents: 0,
		// Identify right away instead of waiting out the 5s identify window
		buildIdentifyThrottler: () => ({ waitForIdentify: async () => {} }),
		readyTimeout: 200,
	});

	void manager.connect({
		gatewayInformation: { ...mockGatewayInformation, url: `ws://127.0.0.1:${port}` },
	});

	await once(server, 'identify');
	// The timeout closes the connection and the shard reconnects after its 500ms delay
	await once(server, 'identify');

	expect(connections).toBe(2);
	expect(identifies).toBe(2);

	await manager.destroy();
});
