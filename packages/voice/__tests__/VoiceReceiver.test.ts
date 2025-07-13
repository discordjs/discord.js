/* eslint-disable id-length */
/* eslint-disable @typescript-eslint/dot-notation */
// @ts-nocheck
import { Buffer } from 'node:buffer';
import { once } from 'node:events';
import process from 'node:process';
import { VoiceOpcodes } from 'discord-api-types/voice/v8';
import { describe, test, expect, vitest, beforeEach } from 'vitest';
import {
	RTP_PACKET_DESKTOP,
	RTP_PACKET_CHROME,
	RTP_PACKET_ANDROID,
	XCHACHA20_SAMPLE,
	AES256GCM_SAMPLE,
} from '../__mocks__/rtp';
import { VoiceConnection, VoiceConnectionStatus } from '../src/VoiceConnection';
import { VoiceReceiver } from '../src/receive/VoiceReceiver';
import { methods } from '../src/util/Secretbox';

vitest.mock('../src/VoiceConnection', async (importOriginal) => {
	// eslint-disable-next-line @typescript-eslint/consistent-type-imports
	const actual = await importOriginal<typeof import('../src/VoiceConnection')>();
	return {
		...actual,
		VoiceConnection: vitest.fn(),
	};
});

vitest.mock('../src/receive/SSRCMap');

async function nextTick() {
	// eslint-disable-next-line no-promise-executor-return
	return new Promise((resolve) => process.nextTick(resolve));
}

function* rangeIter(start: number, end: number) {
	for (let i = start; i <= end; i++) {
		yield i;
	}
}

function range(start: number, end: number) {
	return Buffer.from([...rangeIter(start, end)]);
}

describe('VoiceReceiver', () => {
	let voiceConnection: _VoiceConnection;
	let receiver: VoiceReceiver;

	beforeEach(() => {
		voiceConnection = new VoiceConnection({} as any, {} as any);
		voiceConnection.state = {
			status: VoiceConnectionStatus.Signalling,
		} as any;
		receiver = new VoiceReceiver(voiceConnection);
		receiver['connectionData'] = {
			encryptionMode: 'dummy',
			nonceBuffer: Buffer.alloc(0),
			secretKey: Buffer.alloc(0),
		};
	});

	test.each([
		['RTP Packet Desktop', RTP_PACKET_DESKTOP],
		['RTP Packet Chrome', RTP_PACKET_CHROME],
		['RTP Packet Android', RTP_PACKET_ANDROID],
	])('onUdpMessage: decrypt from %s', async (testName, RTP_PACKET) => {
		receiver['decrypt'] = vitest.fn().mockImplementationOnce(() => RTP_PACKET.decrypted);

		const spy = vitest.spyOn(receiver.ssrcMap, 'get');
		spy.mockImplementation(() => ({
			audioSSRC: RTP_PACKET.ssrc,
			userId: '123',
		}));

		const stream = receiver.subscribe('123');

		receiver['onUdpMessage'](RTP_PACKET.packet);
		await nextTick();
		expect(stream.read()).toEqual(RTP_PACKET.opusFrame);
	});

	test('onUdpMessage: <8 bytes packet', () => {
		expect(() => receiver['onUdpMessage'](Buffer.alloc(4))).not.toThrow();
	});

	test('onUdpMessage: destroys stream on decrypt failure', async () => {
		receiver['decrypt'] = vitest.fn().mockImplementationOnce(() => null);

		const spy = vitest.spyOn(receiver.ssrcMap, 'get');
		spy.mockImplementation(() => ({
			audioSSRC: RTP_PACKET_DESKTOP.ssrc,
			userId: '123',
		}));

		const stream = receiver.subscribe('123');

		const errorEvent = once(stream, 'error');

		receiver['onUdpMessage'](RTP_PACKET_DESKTOP.packet);
		await nextTick();
		await expect(errorEvent).resolves.toMatchObject([expect.any(Error)]);
		expect(receiver.subscriptions.size).toEqual(0);
	});

	test('subscribe: only allows one subscribe stream per SSRC', () => {
		const spy = vitest.spyOn(receiver.ssrcMap, 'get');
		spy.mockImplementation(() => ({
			audioSSRC: RTP_PACKET_DESKTOP.ssrc,
			userId: '123',
		}));

		const stream = receiver.subscribe('123');
		expect(receiver.subscribe('123')).toEqual(stream);
	});

	describe('onWsPacket', () => {
		test('CLIENT_DISCONNECT packet', () => {
			const spy = vitest.spyOn(receiver.ssrcMap, 'delete');
			receiver['onWsPacket']({
				op: VoiceOpcodes.ClientDisconnect,
				d: {
					user_id: '123abc',
				},
			});
			expect(spy).toHaveBeenCalledWith('123abc');
		});

		test('SPEAKING packet', () => {
			const spy = vitest.spyOn(receiver.ssrcMap, 'update');
			receiver['onWsPacket']({
				op: VoiceOpcodes.Speaking,
				d: {
					ssrc: 123,
					user_id: '123abc',
					speaking: 1,
				},
			});
			expect(spy).toHaveBeenCalledWith({
				audioSSRC: 123,
				userId: '123abc',
			});
		});
	});

	describe('decrypt', () => {
		const secretKey = new Uint8Array([1, 2, 3, 4]);

		test('decrypt: aead_xchacha20_poly1305_rtpsize', () => {
			const nonceSpace = Buffer.alloc(24);

			const decrypted = receiver['decrypt'](
				XCHACHA20_SAMPLE.encrypted,
				'aead_xchacha20_poly1305_rtpsize',
				nonceSpace,
				XCHACHA20_SAMPLE.key,
			);

			const expectedNonce = Buffer.concat([
				XCHACHA20_SAMPLE.encrypted.slice(XCHACHA20_SAMPLE.encrypted.length - 4),
				Buffer.alloc(20),
			]);

			expect(nonceSpace.equals(expectedNonce)).toEqual(true);
			expect(decrypted.equals(XCHACHA20_SAMPLE.decrypted)).toEqual(true);
		});

		test('decrypt: aead_aes256gcm_rtpsize', () => {
			const nonceSpace = Buffer.alloc(12);

			const decrypted = receiver['decrypt'](
				AES256GCM_SAMPLE.encrypted,
				'aead_aes256_gcm_rtpsize',
				nonceSpace,
				AES256GCM_SAMPLE.key,
			);

			const expectedNonce = Buffer.concat([
				AES256GCM_SAMPLE.encrypted.subarray(AES256GCM_SAMPLE.encrypted.length - 4),
				Buffer.alloc(8),
			]);

			expect(nonceSpace.equals(expectedNonce)).toEqual(true);
			expect(decrypted.equals(AES256GCM_SAMPLE.decrypted)).toEqual(true);
		});
	});
});
