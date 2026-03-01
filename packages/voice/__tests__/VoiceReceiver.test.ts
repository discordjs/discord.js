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
		const packet = stream.read();
		expect(packet.payload).toEqual(RTP_PACKET.opusFrame);
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

	test('onUdpMessage: AudioPacket has payload and header fields', async () => {
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
		expect(Buffer.isBuffer(packet.payload)).toBe(true);
		expect(packet.payload).toEqual(RTP_PACKET_DESKTOP.opusFrame);
		expect(typeof packet.sequence).toBe('number');
		expect(typeof packet.timestamp).toBe('number');
		expect(typeof packet.ssrc).toBe('number');
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

	describe('parsePacket', () => {
		test('parsePacket: aead_xchacha20_poly1305_rtpsize', () => {
			const nonceSpace = Buffer.alloc(24);

			const packet = receiver['parsePacket'](
				XCHACHA20_SAMPLE.encrypted,
				'aead_xchacha20_poly1305_rtpsize',
				nonceSpace,
				XCHACHA20_SAMPLE.key,
				'123',
				48_921,
			);

			const expectedNonce = Buffer.concat([
				XCHACHA20_SAMPLE.encrypted.subarray(XCHACHA20_SAMPLE.encrypted.length - 4),
				Buffer.alloc(20),
			]);

			expect(nonceSpace.equals(expectedNonce)).toEqual(true);
			// Extension data (8 bytes) should be stripped from the 61-byte decrypted payload
			expect(packet!.payload).toHaveLength(53);
			expect(packet!.payload.equals(XCHACHA20_SAMPLE.decrypted.subarray(8))).toEqual(true);
			expect(packet!.sequence).toEqual(22_118);
			expect(packet!.timestamp).toEqual(3_220_386_864);
			expect(packet!.ssrc).toEqual(48_921);
		});

		test('parsePacket: aead_aes256gcm_rtpsize', () => {
			const nonceSpace = Buffer.alloc(12);

			const packet = receiver['parsePacket'](
				AES256GCM_SAMPLE.encrypted,
				'aead_aes256_gcm_rtpsize',
				nonceSpace,
				AES256GCM_SAMPLE.key,
				'123',
				50_615,
			);

			const expectedNonce = Buffer.concat([
				AES256GCM_SAMPLE.encrypted.subarray(AES256GCM_SAMPLE.encrypted.length - 4),
				Buffer.alloc(8),
			]);

			expect(nonceSpace.equals(expectedNonce)).toEqual(true);
			// No extension (X=0), so decrypted payload is the opus frame directly
			expect(packet!.payload.equals(AES256GCM_SAMPLE.decrypted)).toEqual(true);
			expect(packet!.sequence).toEqual(41_884);
			expect(packet!.timestamp).toEqual(2_668_332_016);
			expect(packet!.ssrc).toEqual(50_615);
		});
	});
});
