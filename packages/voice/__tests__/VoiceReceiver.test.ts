/* eslint-disable id-length */
/* eslint-disable @typescript-eslint/dot-notation */
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

describe('VoiceReceiver', () => {
	let voiceConnection: VoiceConnection;
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
	])('onUdpMessage: decrypt from %s', async (_testName, RTP_PACKET) => {
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

	test.each([
		['Desktop', RTP_PACKET_DESKTOP, 10_217, 4_157_324_497],
		['Chrome', RTP_PACKET_CHROME, 18_143, 660_155_095],
		['Android', RTP_PACKET_ANDROID, 14_800, 3_763_991_879],
	])('onUdpMessage: RTP header metadata from %s', async (_testName, RTP_PACKET, expectedSeq, expectedTs) => {
		receiver['decrypt'] = vitest.fn().mockImplementationOnce(() => RTP_PACKET.decrypted);

		const spy = vitest.spyOn(receiver.ssrcMap, 'get');
		spy.mockImplementation(() => ({
			audioSSRC: RTP_PACKET.ssrc,
			userId: '123',
		}));

		const stream = receiver.subscribe('123');

		receiver['onUdpMessage'](RTP_PACKET.packet);
		await nextTick();
		const packet = stream.read();
		expect(packet.sequence).toEqual(expectedSeq);
		expect(packet.timestamp).toEqual(expectedTs);
		expect(packet.ssrc).toEqual(RTP_PACKET.ssrc);
	});

	test('onUdpMessage: AudioPacket is backwards compatible', async () => {
		receiver['decrypt'] = vitest.fn().mockImplementationOnce(() => RTP_PACKET_DESKTOP.decrypted);

		const spy = vitest.spyOn(receiver.ssrcMap, 'get');
		spy.mockImplementation(() => ({
			audioSSRC: RTP_PACKET_DESKTOP.ssrc,
			userId: '123',
		}));

		const stream = receiver.subscribe('123');

		receiver['onUdpMessage'](RTP_PACKET_DESKTOP.packet);
		await nextTick();
		const packet = stream.read();
		expect(Buffer.isBuffer(packet)).toBe(true);
		expect(packet).toEqual(RTP_PACKET_DESKTOP.opusFrame);
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
		test('decrypt: aead_xchacha20_poly1305_rtpsize', () => {
			const nonceSpace = Buffer.alloc(24);

			const decrypted = receiver['decrypt'](
				XCHACHA20_SAMPLE.encrypted,
				'aead_xchacha20_poly1305_rtpsize',
				nonceSpace,
				XCHACHA20_SAMPLE.key,
			);

			const expectedNonce = Buffer.concat([
				XCHACHA20_SAMPLE.encrypted.subarray(XCHACHA20_SAMPLE.encrypted.length - 4),
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
