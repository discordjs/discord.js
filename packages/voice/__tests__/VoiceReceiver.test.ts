/* eslint-disable id-length */
/* eslint-disable @typescript-eslint/dot-notation */
import { Buffer } from 'node:buffer';
import { once } from 'node:events';
import process from 'node:process';
import { VoiceOpcodes } from 'discord-api-types/voice/v4';
import { RTP_PACKET_DESKTOP, RTP_PACKET_CHROME, RTP_PACKET_ANDROID } from '../__mocks__/rtp';
import { VoiceConnection as _VoiceConnection, VoiceConnectionStatus } from '../src/VoiceConnection';
import { VoiceReceiver } from '../src/receive/VoiceReceiver';
import { methods } from '../src/util/Secretbox';

jest.mock('../src/VoiceConnection');
jest.mock('../src/receive/SSRCMap');

const openSpy = jest.spyOn(methods, 'open');

openSpy.mockImplementation((buffer) => buffer);

const VoiceConnection = _VoiceConnection as unknown as jest.Mocked<typeof _VoiceConnection>;

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
	])('onUdpMessage: %s', async (testName, RTP_PACKET) => {
		receiver['decrypt'] = jest.fn().mockImplementationOnce(() => RTP_PACKET.decrypted);

		const spy = jest.spyOn(receiver.ssrcMap, 'get');
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
		receiver['decrypt'] = jest.fn().mockImplementationOnce(() => null);

		const spy = jest.spyOn(receiver.ssrcMap, 'get');
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
		const spy = jest.spyOn(receiver.ssrcMap, 'get');
		spy.mockImplementation(() => ({
			audioSSRC: RTP_PACKET_DESKTOP.ssrc,
			userId: '123',
		}));

		const stream = receiver.subscribe('123');
		expect(receiver.subscribe('123')).toEqual(stream);
	});

	describe('onWsPacket', () => {
		test('CLIENT_DISCONNECT packet', () => {
			const spy = jest.spyOn(receiver.ssrcMap, 'delete');
			receiver['onWsPacket']({
				op: VoiceOpcodes.ClientDisconnect,
				d: {
					user_id: '123abc',
				},
			});
			expect(spy).toHaveBeenCalledWith('123abc');
		});

		test('SPEAKING packet', () => {
			const spy = jest.spyOn(receiver.ssrcMap, 'update');
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

		test('CLIENT_CONNECT packet', () => {
			const spy = jest.spyOn(receiver.ssrcMap, 'update');
			receiver['onWsPacket']({
				op: VoiceOpcodes.ClientConnect,
				d: {
					audio_ssrc: 123,
					video_ssrc: 43,
					user_id: '123abc',
				},
			});
			expect(spy).toHaveBeenCalledWith({
				audioSSRC: 123,
				videoSSRC: 43,
				userId: '123abc',
			});
			receiver['onWsPacket']({
				op: VoiceOpcodes.ClientConnect,
				d: {
					audio_ssrc: 123,
					video_ssrc: 0,
					user_id: '123abc',
				},
			});
			expect(spy).toHaveBeenCalledWith({
				audioSSRC: 123,
				videoSSRC: undefined,
				userId: '123abc',
			});
		});
	});

	describe('decrypt', () => {
		const secretKey = new Uint8Array([1, 2, 3, 4]);

		beforeEach(() => {
			openSpy.mockClear();
		});

		test('decrypt: xsalsa20_poly1305_lite', () => {
			// Arrange
			const buffer = range(1, 32);
			const nonce = Buffer.alloc(4);

			// Act
			const decrypted = receiver['decrypt'](buffer, 'xsalsa20_poly1305_lite', nonce, secretKey);

			// Assert
			expect(nonce.equals(range(29, 32))).toEqual(true);
			expect(decrypted!.equals(range(13, 28))).toEqual(true);
		});

		test('decrypt: xsalsa20_poly1305_suffix', () => {
			// Arrange
			const buffer = range(1, 64);
			const nonce = Buffer.alloc(24);

			// Act
			const decrypted = receiver['decrypt'](buffer, 'xsalsa20_poly1305_suffix', nonce, secretKey);

			// Assert
			expect(nonce.equals(range(41, 64))).toEqual(true);
			expect(decrypted!.equals(range(13, 40))).toEqual(true);
		});

		test('decrypt: xsalsa20_poly1305', () => {
			// Arrange
			const buffer = range(1, 64);
			const nonce = Buffer.alloc(12);

			// Act
			const decrypted = receiver['decrypt'](buffer, 'xsalsa20_poly1305', nonce, secretKey);

			// Assert
			expect(nonce.equals(range(1, 12))).toEqual(true);
			expect(decrypted!.equals(range(13, 64))).toEqual(true);
		});
	});
});
