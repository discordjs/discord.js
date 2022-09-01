/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type EventEmitter from 'node:events';
import { once } from 'node:events';
import { setTimeout } from 'node:timers';
import { VoiceOpcodes } from 'discord-api-types/voice/v4';
import WS from 'jest-websocket-mock';
import { VoiceWebSocket } from '../src/networking/VoiceWebSocket.js';

beforeEach(() => {
	WS.clean();
});

async function onceIgnoreError<T extends EventEmitter>(target: T, event: string) {
	return new Promise((resolve) => {
		target.on(event, resolve);
	});
}

async function onceOrThrow<T extends EventEmitter>(target: T, event: string, after: number) {
	return new Promise((resolve, reject) => {
		target.on(event, resolve);
		setTimeout(() => reject(new Error('Time up')), after);
	});
}

// TODO: Fix voice tests

describe.skip('VoiceWebSocket: packet parsing', () => {
	test('Parses and emits packets', async () => {
		const endpoint = 'ws://localhost:1234';
		const server = new WS(endpoint, { jsonProtocol: true });
		const ws = new VoiceWebSocket(endpoint, false);
		await server.connected;
		const dummy = { value: 3 };
		const rcv = once(ws, 'packet');
		server.send(dummy);
		await expect(rcv).resolves.toEqual([dummy]);
	});

	test('Recovers from invalid packets', async () => {
		const endpoint = 'ws://localhost:1234';
		const server = new WS(endpoint);
		const ws = new VoiceWebSocket(endpoint, false);
		await server.connected;

		let rcv = once(ws, 'packet');
		server.send('asdf');
		await expect(rcv).rejects.toThrowError();

		const dummy = { op: 1_234 };
		rcv = once(ws, 'packet');
		server.send(JSON.stringify(dummy));
		await expect(rcv).resolves.toEqual([dummy]);
	});
});

describe.skip('VoiceWebSocket: event propagation', () => {
	test('open', async () => {
		const endpoint = 'ws://localhost:1234';
		const server = new WS(endpoint);
		const ws = new VoiceWebSocket(endpoint, false);
		const rcv = once(ws, 'open');
		await server.connected;
		await expect(rcv).resolves.toBeTruthy();
	});

	test('close (clean)', async () => {
		const endpoint = 'ws://localhost:1234';
		const server = new WS(endpoint);
		const ws = new VoiceWebSocket(endpoint, false);
		await server.connected;
		const rcv = once(ws, 'close');
		server.close();
		await expect(rcv).resolves.toBeTruthy();
	});

	test('close (error)', async () => {
		const endpoint = 'ws://localhost:1234';
		const server = new WS(endpoint);
		const ws = new VoiceWebSocket(endpoint, false);
		await server.connected;
		const rcvError = once(ws, 'error');
		const rcvClose = onceIgnoreError(ws, 'close');
		server.error();
		await expect(rcvError).resolves.toBeTruthy();
		await expect(rcvClose).resolves.toBeTruthy();
	});
});

describe.skip('VoiceWebSocket: heartbeating', () => {
	test('Normal heartbeat flow', async () => {
		const endpoint = 'ws://localhost:1234';
		const server = new WS(endpoint, { jsonProtocol: true });
		const ws = new VoiceWebSocket(endpoint, false);
		await server.connected;
		const rcv = onceOrThrow(ws, 'close', 750);
		ws.setHeartbeatInterval(50);
		for (let index = 0; index < 10; index++) {
			const packet: any = await server.nextMessage;
			expect(packet).toMatchObject({
				op: VoiceOpcodes.Heartbeat,
			});
			server.send({
				op: VoiceOpcodes.HeartbeatAck,
				// eslint-disable-next-line id-length
				d: packet.d,
			});
			expect(ws.ping).toBeGreaterThanOrEqual(0);
		}

		ws.setHeartbeatInterval(-1);
		await expect(rcv).rejects.toThrowError();
	});

	test('Closes when no ack is received', async () => {
		const endpoint = 'ws://localhost:1234';
		const server = new WS(endpoint, { jsonProtocol: true });
		const ws = new VoiceWebSocket(endpoint, false);
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		ws.on('error', () => {});
		await server.connected;
		const rcv = onceIgnoreError(ws, 'close');
		ws.setHeartbeatInterval(50);
		await expect(rcv).resolves.toBeTruthy();
		expect(ws.ping).toBeUndefined();
		expect(server.messages.length).toEqual(3);
	});
});
