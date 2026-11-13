/* eslint-disable id-length */
import { Buffer } from 'node:buffer';
import crypto from 'node:crypto';
import process from 'node:process';
import { describe, test, expect, vitest, beforeEach } from 'vitest';
import { NetworkingStatusCode } from '../src/networking/Networking';
import { createPLI } from '../src/networking/rtcp';
import { VideoGatewayOpcodes } from '../src/networking/video';
import { VideoReceiver } from '../src/receive/VideoReceiver';
import type { VideoRtpPacket } from '../src/receive/VideoReceiveStream';
import { VoiceConnection, VoiceConnectionStatus } from '../src/VoiceConnection';

vitest.mock('../src/VoiceConnection', async (importOriginal) => {
	// eslint-disable-next-line @typescript-eslint/consistent-type-imports
	const actual = await importOriginal<typeof import('../src/VoiceConnection')>();
	return {
		...actual,
		VoiceConnection: vitest.fn(),
	};
});

const USER_ID = '123456789012345678';
const VIDEO_SSRC = 424_242;
const RTX_SSRC = 424_243;

/**
 * Encrypts a payload into a Discord-style AEAD RTP packet.
 */
function encryptPacket(options: {
	marker?: boolean;
	payload: Buffer;
	payloadType?: number;
	sequence?: number;
	ssrc: number;
	timestamp?: number;
}) {
	const { ssrc, payload, payloadType = 101, sequence = 100, timestamp = 9_000, marker = false } = options;
	const key = Buffer.alloc(32, 7);
	const header = Buffer.alloc(12);
	header[0] = 0x80;
	header[1] = (marker ? 0x80 : 0) | payloadType;
	header.writeUInt16BE(sequence, 2);
	header.writeUInt32BE(timestamp, 4);
	header.writeUInt32BE(ssrc, 8);

	const nonce = Buffer.alloc(12);
	nonce.writeUInt32BE(1, 0);

	const cipher = crypto.createCipheriv('aes-256-gcm', key, nonce);
	cipher.setAAD(header);
	const encrypted = Buffer.concat([cipher.update(payload), cipher.final(), cipher.getAuthTag()]);

	return { packet: Buffer.concat([header, encrypted, nonce.subarray(0, 4)]), key };
}

async function nextTick() {
	// eslint-disable-next-line no-promise-executor-return
	return new Promise((resolve) => process.nextTick(resolve));
}

function makeVideoPayload(streams: unknown[], userId = USER_ID) {
	return { op: VideoGatewayOpcodes.Video, d: { user_id: userId, streams } };
}

describe('VideoReceiver', () => {
	let receiver: VideoReceiver;
	let sendRTCP: ReturnType<typeof vitest.fn>;
	let sendMediaSinkWants: ReturnType<typeof vitest.fn>;

	beforeEach(() => {
		const vc = new VoiceConnection({} as never, {} as never);
		sendRTCP = vitest.fn();
		sendMediaSinkWants = vitest.fn();
		vc.receiver = { ssrcMap: new Map() } as any;
		vc.state = {
			status: VoiceConnectionStatus.Ready,
			networking: {
				sendRTCP,
				sendMediaSinkWants,
				state: { code: NetworkingStatusCode.Ready, dave: undefined },
			},
		} as never;

		receiver = new VideoReceiver(vc);
		receiver['connectionData'] = {
			encryptionMode: 'aead_aes256_gcm_rtpsize',
			nonceBuffer: Buffer.alloc(12),
			secretKey: Buffer.alloc(32, 7),
		};
	});

	test('op 12 updates the stream map and emits a video event', () => {
		const listener = vitest.fn();
		receiver.on('video', listener);

		receiver.onWsPacket(
			makeVideoPayload([{ type: 'video', ssrc: VIDEO_SSRC, rtx_ssrc: RTX_SSRC, active: true, quality: 100 }]) as any,
		);

		expect(listener).toHaveBeenCalledExactlyOnceWith(
			USER_ID,
			expect.arrayContaining([expect.objectContaining({ userId: USER_ID, ssrc: VIDEO_SSRC, rtxSSRC: RTX_SSRC })]),
		);
		expect(receiver.activeStreams.get(USER_ID)).toHaveLength(1);
	});

	test('op 12 with inactive streams removes existing mappings', () => {
		receiver.onWsPacket(
			makeVideoPayload([{ type: 'video', ssrc: VIDEO_SSRC, rtx_ssrc: RTX_SSRC, active: true }]) as any,
		);
		expect(receiver.activeStreams.get(USER_ID)).toHaveLength(1);

		receiver.onWsPacket(makeVideoPayload([{ type: 'video', ssrc: VIDEO_SSRC, active: false }]) as any);
		expect(receiver.activeStreams.get(USER_ID)).toBeUndefined();
	});

	test('client disconnect removes mappings', () => {
		receiver.onWsPacket(makeVideoPayload([{ type: 'video', ssrc: VIDEO_SSRC, active: true }]) as any);
		receiver.onWsPacket({ op: 13, d: { user_id: USER_ID } } as any);

		expect(receiver.activeStreams.size).toEqual(0);
	});

	test('subscribe sends PLIs for known streams', () => {
		receiver.onWsPacket(
			makeVideoPayload([{ type: 'video', ssrc: VIDEO_SSRC, rtx_ssrc: RTX_SSRC, active: true }]) as any,
		);

		receiver.subscribe(USER_ID);
		expect(sendRTCP).toHaveBeenCalledExactlyOnceWith(createPLI(VIDEO_SSRC));
	});

	test('decrypts video RTP packets for subscribed users', async () => {
		receiver.onWsPacket(makeVideoPayload([{ type: 'video', ssrc: VIDEO_SSRC, active: true }]) as any);
		const stream = receiver.subscribe(USER_ID);

		const payload = Buffer.from([0x67, 0x42, 0xc0, 0x1f, 0xda, 0x01]); // fake NAL
		const { packet } = encryptPacket({ ssrc: VIDEO_SSRC, payload, sequence: 555, timestamp: 4_242, marker: true });

		const packets: VideoRtpPacket[] = [];
		stream.on('data', (data: VideoRtpPacket) => packets.push(data));

		receiver.onUdpMessage(packet);
		await nextTick();

		expect(packets).toHaveLength(1);
		expect(packets[0]).toMatchObject({
			ssrc: VIDEO_SSRC,
			sequence: 555,
			timestamp: 4_242,
			payloadType: 101,
			marker: true,
		});
		expect(packets[0]!.payload.equals(payload)).toEqual(true);
	});

	test('recovers original packets from RTX retransmissions', async () => {
		receiver.onWsPacket(
			makeVideoPayload([{ type: 'video', ssrc: VIDEO_SSRC, rtx_ssrc: RTX_SSRC, active: true }]) as any,
		);
		const stream = receiver.subscribe(USER_ID);

		const originalPayload = Buffer.from([0x61, 0xaa, 0xbb, 0xcc]);
		const rtxPayload = Buffer.concat([Buffer.from([0x02, 0x2b]), originalPayload]); // OSN = 555
		const { packet } = encryptPacket({ ssrc: RTX_SSRC, payload: rtxPayload, sequence: 7, timestamp: 4_242 });

		const packets: VideoRtpPacket[] = [];
		stream.on('data', (data: VideoRtpPacket) => packets.push(data));

		receiver.onUdpMessage(packet);
		await nextTick();

		expect(packets).toHaveLength(1);
		expect(packets[0]).toMatchObject({ ssrc: VIDEO_SSRC, sequence: 555, retransmitted: true });
		expect(packets[0]!.payload.equals(originalPayload)).toEqual(true);
	});

	test('assembleFrames: H264 FU-A packets become one Annex-B frame, a lost packet is NACKed and recovered from RTX', async () => {
		receiver.onWsPacket(
			makeVideoPayload([{ type: 'video', ssrc: VIDEO_SSRC, rtx_ssrc: RTX_SSRC, active: true }]) as any,
		);
		const stream = receiver.subscribe(USER_ID, { assembleFrames: true });
		const frames: VideoRtpPacket[] = [];
		stream.on('data', (data: VideoRtpPacket) => frames.push(data));

		const send = (
			ssrc: number,
			payload: Buffer,
			sequence: number,
			timestamp: number,
			marker = false,
			payloadType = 101,
		) => receiver.onUdpMessage(encryptPacket({ ssrc, payload, sequence, timestamp, marker, payloadType }).packet);
		// The frame before: its marker tells the buffer where the next frame starts (itself dropped: after a mid-stream
		// join the first frame may be partial).
		send(VIDEO_SSRC, Buffer.from([0x41, 0x01]), 9, 1_000, true);
		// An IDR (0x65) in three FU-A fragments (indicator 0x7c = NRI 3, type 28); the middle one is lost.
		const nal = Buffer.from([0x65, ...Array.from({ length: 9 }, (_, index) => index + 1)]);
		send(VIDEO_SSRC, Buffer.from([0x7c, 0x85, ...nal.subarray(1, 4)]), 10, 2_000);
		send(VIDEO_SSRC, Buffer.from([0x7c, 0x45, ...nal.subarray(7)]), 12, 2_000, true);
		await nextTick();
		expect(frames).toHaveLength(0);
		expect(sendRTCP).toHaveBeenCalledWith(expect.objectContaining({ 1: 205 })); // RTPFB: generic NACK
		const nack: Buffer = sendRTCP.mock.calls.at(-1)![0];
		expect(nack.readUInt32BE(8)).toBe(VIDEO_SSRC);
		expect(nack.readUInt16BE(12)).toBe(11);

		// The retransmission: RTX payload type 102 with the original sequence number first.
		send(RTX_SSRC, Buffer.from([0x00, 0x0b, 0x7c, 0x05, ...nal.subarray(4, 7)]), 500, 2_000, false, 102);
		await nextTick();
		expect(frames).toHaveLength(1);
		expect(frames[0]).toMatchObject({
			timestamp: 2_000,
			payloadType: 101,
			retransmitted: true,
			firstSequence: 10,
			sequence: 12,
		});
		expect(frames[0]!.payload.equals(Buffer.concat([Buffer.from([0, 0, 0, 1]), nal]))).toBe(true);
	});

	test('bootstraps unmapped video SSRCs via the sequential SSRC allocation', async () => {
		// audio ssrc 111 -> user (from opcode 5 speaking)
		(receiver.voiceConnection.receiver as any).ssrcMap.set(111, { userId: USER_ID, audioSSRC: 111 });

		const listener = vitest.fn();
		receiver.on('video', listener);

		const stream = receiver.subscribe(USER_ID);
		const packets: VideoRtpPacket[] = [];
		stream.on('data', (data: VideoRtpPacket) => packets.push(data));

		const payload = Buffer.from([0x12, 0xab]);
		// video ssrc 112 = audio 111 + 1, payload type 101 (H264)
		const { packet } = encryptPacket({ ssrc: 112, payload, payloadType: 101, sequence: 1 });
		receiver['connectionData']!.encryptionMode = 'aead_aes256_gcm_rtpsize';
		receiver.onUdpMessage(packet);
		await nextTick();

		expect(listener).toHaveBeenCalled();
		expect(receiver.activeStreams.get(USER_ID)).toHaveLength(1);
		expect(packets).toHaveLength(1);
		expect(packets[0]).toMatchObject({ ssrc: 112, retransmitted: false });
		expect(packets[0]!.payload.equals(payload)).toEqual(true);
	});

	test('ignores RTCP packets and unknown SSRCs', () => {
		receiver.onWsPacket(makeVideoPayload([{ type: 'video', ssrc: VIDEO_SSRC, active: true }]) as any);
		const stream = receiver.subscribe(USER_ID);
		const dataListener = vitest.fn();
		stream.on('data', dataListener);

		const rtcp = Buffer.from([0x81, 201, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]);
		receiver.onUdpMessage(rtcp);

		const { packet } = encryptPacket({ ssrc: 999, payload: Buffer.from([1, 2, 3]) });
		receiver.onUdpMessage(packet);

		expect(dataListener).not.toHaveBeenCalled();
	});
});
