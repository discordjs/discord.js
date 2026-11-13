import { Buffer } from 'node:buffer';
import { randomBytes } from 'node:crypto';
import { describe, expect, test } from 'vitest';
import { depacketizeH264Frame, h264FrameIsKeyframe } from '../src/networking/h264';
import { depacketizeH265Frame, h265FrameIsKeyframe } from '../src/networking/h265';
import { depacketizeVp8Frame, depacketizeVp9Frame, vp8FrameIsKeyframe } from '../src/networking/vp8';

/**
 * Random bytes without 00 00 0x runs, as an encoder's emulation prevention (and libdave's retry) guarantees.
 */
function noStartCodes(length: number): Buffer {
	const bytes = randomBytes(length);
	for (let index = 2; index < bytes.length; index++) {
		if (bytes[index - 2] === 0 && bytes[index - 1] === 0 && bytes[index]! <= 3) bytes[index] = 0x80;
	}

	return bytes;
}

/**
 * A DAVE-shaped trailer (tag, nonce, ranges, size, 0xFAFA) as it rides at the end of the frame.
 */
const trailer = () => Buffer.concat([randomBytes(8), Buffer.from([0x05, 0x00, 0x02, 0x0e]), Buffer.from([0xfa, 0xfa])]);

/**
 * NAL units → the sender-layout frame libdave encrypts: every start code 4 bytes, the trailer in the last NAL.
 */
function senderFrame(nals: Buffer[]): Buffer {
	return Buffer.concat(nals.flatMap((nal) => [Buffer.from([0, 0, 0, 1]), nal]));
}

/**
 * RTP payloads of a frame as libwebrtc's RtpPacketizerH264 (packetization mode 1) emits them: consecutive small NAL
 * units aggregated into STAP-A, NAL units larger than the payload limit split into FU-A, the rest single.
 */
function packetizeH264(nals: Buffer[], maxPayload: number): Buffer[] {
	const out: Buffer[] = [];
	let index = 0;
	while (index < nals.length) {
		const nal = nals[index]!;
		if (nal.length > maxPayload) {
			const header = nal[0]!;
			const body = nal.subarray(1);
			const chunk = maxPayload - 2;
			for (let offset = 0; offset < body.length; offset += chunk) {
				const start = offset === 0 ? 0x80 : 0;
				const end = offset + chunk >= body.length ? 0x40 : 0;
				out.push(
					Buffer.concat([
						Buffer.from([(header & 0xe0) | 28, start | end | (header & 0x1f)]),
						body.subarray(offset, offset + chunk),
					]),
				);
			}

			index++;
			continue;
		}

		// Aggregate following NAL units while they fit.
		const group: Buffer[] = [nal];
		let size = 1 + 2 + nal.length;
		while (index + group.length < nals.length) {
			const next = nals[index + group.length]!;
			if (next.length > maxPayload || size + 2 + next.length > maxPayload) break;
			group.push(next);
			size += 2 + next.length;
		}

		if (group.length === 1) out.push(nal);
		else {
			const parts = [Buffer.from([(group[0]![0]! & 0xe0) | 24])];
			for (const member of group) {
				const length = Buffer.alloc(2);
				length.writeUInt16BE(member.length);
				parts.push(length, member);
			}

			out.push(Buffer.concat(parts));
		}

		index += group.length;
	}

	return out;
}

describe('H264 depacketizer', () => {
	const sps = Buffer.concat([Buffer.from([0x67]), noStartCodes(20)]);
	const pps = Buffer.concat([Buffer.from([0x68]), noStartCodes(5)]);
	const idr = Buffer.concat([Buffer.from([0x65]), noStartCodes(4_000), trailer()]);
	const slice = Buffer.concat([Buffer.from([0x41]), noStartCodes(300), trailer()]);

	test('a keyframe (STAP-A SPS+PPS, FU-A IDR) rebuilds byte-exact', () => {
		const nals = [sps, pps, idr];
		const frame = depacketizeH264Frame(packetizeH264(nals, 1_200));
		expect(frame).toEqual(senderFrame(nals));
		expect(h264FrameIsKeyframe(frame!)).toBe(true);
	});

	test('a delta frame (single NAL unit) rebuilds byte-exact', () => {
		const frame = depacketizeH264Frame(packetizeH264([slice], 1_200));
		expect(frame).toEqual(senderFrame([slice]));
		expect(h264FrameIsKeyframe(frame!)).toBe(false);
	});

	test("an FU-A without its start or end fails the frame (a lost middle fragment is the receiver's sequence check)", () => {
		const packets = packetizeH264([idr], 1_200);
		expect(depacketizeH264Frame(packets.slice(1))).toBeUndefined();
		expect(depacketizeH264Frame(packets.slice(0, -1))).toBeUndefined();
	});
});

/**
 * An H265 NAL header (2 bytes): forbidden bit 0, the type, a small layer id, TID 1.
 */
const h265Header = (type: number) => Buffer.from([(type << 1) | 0x01, 0x01]);

/**
 * RTP payloads of a frame as libwebrtc's RtpPacketizerH265 emits them: consecutive small NAL units aggregated
 * into an AP, NAL units larger than the payload limit split into FUs, the rest single.
 */
function packetizeH265(nals: Buffer[], maxPayload: number): Buffer[] {
	const out: Buffer[] = [];
	let index = 0;
	while (index < nals.length) {
		const nal = nals[index]!;
		if (nal.length > maxPayload) {
			const header = nal.subarray(0, 2);
			const body = nal.subarray(2);
			const chunk = maxPayload - 3;
			for (let offset = 0; offset < body.length; offset += chunk) {
				const start = offset === 0 ? 0x80 : 0;
				const end = offset + chunk >= body.length ? 0x40 : 0;
				out.push(
					Buffer.concat([
						h265Header(49),
						Buffer.from([start | end | ((header[0]! >> 1) & 0x3f)]),
						body.subarray(offset, offset + chunk),
					]),
				);
			}

			index++;
			continue;
		}

		// Aggregate following NAL units while they fit (2-byte NAL header + 2-byte size each).
		const group: Buffer[] = [nal];
		let size = 2 + 2 + nal.length;
		while (index + group.length < nals.length) {
			const next = nals[index + group.length]!;
			if (next.length > maxPayload || size + 2 + next.length > maxPayload) break;
			group.push(next);
			size += 2 + next.length;
		}

		if (group.length === 1) out.push(nal);
		else {
			const parts = [h265Header(48)];
			for (const member of group) {
				const length = Buffer.alloc(2);
				length.writeUInt16BE(member.length);
				parts.push(length, member);
			}

			out.push(Buffer.concat(parts));
		}

		index += group.length;
	}

	return out;
}

describe('H265 depacketizer', () => {
	const vps = Buffer.concat([h265Header(32), noStartCodes(20)]);
	const sps = Buffer.concat([h265Header(33), noStartCodes(25)]);
	const pps = Buffer.concat([h265Header(34), noStartCodes(5)]);
	const idr = Buffer.concat([h265Header(19), noStartCodes(4_000), trailer()]);
	const slice = Buffer.concat([h265Header(1), noStartCodes(300), trailer()]);

	test('a keyframe (AP VPS+SPS+PPS, FU IDR) rebuilds byte-exact', () => {
		const nals = [vps, sps, pps, idr];
		const frame = depacketizeH265Frame(packetizeH265(nals, 1_200));
		expect(frame).toEqual(senderFrame(nals));
		expect(h265FrameIsKeyframe(frame!)).toBe(true);
	});

	test('a delta frame (single NAL unit) rebuilds byte-exact', () => {
		const frame = depacketizeH265Frame(packetizeH265([slice], 1_200));
		expect(frame).toEqual(senderFrame([slice]));
		expect(h265FrameIsKeyframe(frame!)).toBe(false);
	});

	test('an FU without its start or end fails the frame', () => {
		const packets = packetizeH265([idr], 1_200);
		expect(depacketizeH265Frame(packets.slice(1))).toBeUndefined();
		expect(depacketizeH265Frame(packets.slice(0, -1))).toBeUndefined();
	});

	test('an AP with a zero NAL size fails the frame', () => {
		const ap = Buffer.concat([h265Header(48), Buffer.from([0, 0])]);
		expect(depacketizeH265Frame([ap])).toBeUndefined();
	});
});

/**
 * RTP payloads of a VP8 frame: X with a 15-bit PictureID, S + PID 0 on the first packet.
 */
function packetizeVp8(frame: Buffer, maxPayload: number, pictureId: number): Buffer[] {
	const out: Buffer[] = [];
	const chunk = maxPayload - 4;
	for (let offset = 0; offset < frame.length; offset += chunk) {
		const descriptor = Buffer.from([
			0x80 | (offset === 0 ? 0x10 : 0),
			0x80,
			0x80 | ((pictureId >> 8) & 0x7f),
			pictureId & 0xff,
		]);
		out.push(Buffer.concat([descriptor, frame.subarray(offset, offset + chunk)]));
	}

	return out;
}

/**
 * RTP payloads of a VP9 frame: I (15-bit PictureID), B on the first, E on the last, V (one 1280x720 layer) on a keyframe.
 */
function packetizeVp9(frame: Buffer, maxPayload: number, keyframe: boolean): Buffer[] {
	const out: Buffer[] = [];
	const ss = Buffer.from([0x10, 0x05, 0x00, 0x02, 0xd0]); // N_S=0, Y=1: width 1280, height 720
	const chunk = maxPayload - 3 - ss.length;
	for (let offset = 0; offset < frame.length; offset += chunk) {
		const first = offset === 0;
		const last = offset + chunk >= frame.length;
		const flags =
			0x80 | (keyframe ? 0 : 0x40) | (first ? 0x08 : 0) | (last ? 0x04 : 0) | (first && keyframe ? 0x02 : 0);
		const parts = [Buffer.from([flags, 0x81, 0x23])];
		if (first && keyframe) parts.push(ss);
		parts.push(frame.subarray(offset, offset + chunk));
		out.push(Buffer.concat(parts));
	}

	return out;
}

describe('VP8 and VP9 depacketizers', () => {
	test('a VP8 keyframe rebuilds byte-exact', () => {
		const frame = Buffer.concat([Buffer.from([0x50, 0x2a, 0x01, 0x9d, 0x01, 0x2a]), randomBytes(5_000), trailer()]);
		const rebuilt = depacketizeVp8Frame(packetizeVp8(frame, 1_200, 0x1234));
		expect(rebuilt).toEqual(frame);
		expect(vp8FrameIsKeyframe(rebuilt!)).toBe(true);
	});

	test('a VP8 frame not starting at partition 0 is refused', () => {
		const packets = packetizeVp8(randomBytes(3_000), 1_200, 7);
		expect(depacketizeVp8Frame(packets.slice(1))).toBeUndefined();
	});

	test('VP9 keyframe and delta frame rebuild byte-exact', () => {
		const key = Buffer.concat([randomBytes(6_000), trailer()]);
		const delta = Buffer.concat([randomBytes(900), trailer()]);
		expect(depacketizeVp9Frame(packetizeVp9(key, 1_200, true))).toEqual(key);
		expect(depacketizeVp9Frame(packetizeVp9(delta, 1_200, false))).toEqual(delta);
	});
});
