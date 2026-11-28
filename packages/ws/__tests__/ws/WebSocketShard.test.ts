import { once } from 'node:events';
import { createServer, type IncomingMessage, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { setTimeout as sleep } from 'node:timers/promises';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { WebSocketManager, WebSocketShardEvents, WebSocketShardStatus } from '../../src/index.js';
import { mockGatewayInformation } from '../gateway.mock.js';

let server: Server;
let requests: IncomingMessage[];

// Stands in for the gateway. It has no upgrade listener, so it gets connection attempts as plain requests
beforeEach(async () => {
	requests = [];
	server = createServer();
	server.on('request', (request) => requests.push(request));
	server.listen(0, '127.0.0.1');
	await once(server, 'listening');
});

afterEach(async () => {
	server.close();
	server.closeAllConnections();
	await once(server, 'close');
});

function connect() {
	const { port } = server.address() as AddressInfo;
	const manager = new WebSocketManager({
		token: 'A-Very-Fake-Token',
		intents: 0,
	});

	// This never resolves, the gateway doesn't let the shard get ready in any of the tests
	void manager.connect({
		gatewayInformation: { ...mockGatewayInformation, url: `ws://127.0.0.1:${port}` },
	});

	return manager;
}

describe('destroy() keeps a shard from reconnecting after its connection closed', () => {
	// Refuse every connection: the shard tries again 500ms after each one
	beforeEach(() => {
		server.on('request', (_request, response) => response.writeHead(502).end());
	});

	test('when called during the delay before the reconnection', async () => {
		const manager = connect();

		// Let the shard reconnect once, and wait for that connection to be refused as well
		await once(manager, WebSocketShardEvents.Closed);
		await once(manager, WebSocketShardEvents.Closed);
		expect(requests).toHaveLength(2);

		// Halfway through the delay, the shard is idle
		await sleep(250);
		const statuses = await manager.fetchStatus();
		expect(statuses.get(0)).toBe(WebSocketShardStatus.Idle);

		await manager.destroy();

		// The next reconnection was due 250ms from here
		await sleep(500);
		expect(requests).toHaveLength(2);
	});

	test('when called from a listener of the closed event', async () => {
		const manager = connect();

		// This runs before the shard starts the destroy that ends with the reconnection
		manager.once(WebSocketShardEvents.Closed, () => void manager.destroy());
		await once(manager, WebSocketShardEvents.Closed);

		// The reconnection was due 500ms from here
		await sleep(750);
		expect(requests).toHaveLength(1);
	});
});

test('destroy() while a shard is connecting closes the connection', async () => {
	// The gateway never answers here, which keeps the connection in its opening handshake
	const manager = connect();
	await once(server, 'request');

	await manager.destroy();

	await vi.waitFor(() => expect(requests[0]!.destroyed).toBe(true));
});
