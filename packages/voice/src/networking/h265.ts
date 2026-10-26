import { Buffer } from 'node:buffer';

/**
 * H265 RTP depacketization (RFC 7798, as libwebrtc's VideoRtpDepacketizerH265 does it).
 *
 * @remarks
 * Same sender layout as H264 (libdave rewrites every start code to the 4-byte form for every codec): each NAL
 * unit keeps its 2-byte header unencrypted and the DAVE trailer rides at the end of the last NAL unit. Rebuilding
 * the frame as `00 00 00 01` + NAL unit for every NAL unit of the packets — single NAL units, AP aggregates and
 * FU fragments — reproduces exactly the bytes the sender encrypted; the decrypted result is a plain Annex-B
 * bitstream decoders accept.
 */

const START_CODE = Buffer.from([0, 0, 0, 1]);

/**
 * The NAL unit type of an H265 NAL header: the first 6 bits after the forbidden bit.
 */
const nalTypeOf = (headerByte: number) => (headerByte >> 1) & 0x3f;

const AGGREGATION_PACKET = 48;
const FRAGMENTATION_UNIT = 49;

/**
 * Reassembles the RTP payloads of one H265 frame (in sequence order) into an Annex-B frame.
 *
 * @param payloads - The RTP payloads of the frame, in sequence order
 * @returns The Annex-B frame, or undefined when the payloads are malformed or a fragment is missing
 */
export function depacketizeH265Frame(payloads: Buffer[]): Buffer | undefined {
	const out: Buffer[] = [];
	let inFragment = false;
	for (const payload of payloads) {
		if (payload.length < 2) return;
		const nalType = nalTypeOf(payload[0]!);
		if (nalType < AGGREGATION_PACKET) {
			// Single NAL unit packet.
			if (inFragment) return; // an FU was cut short
			out.push(START_CODE, payload);
		} else if (nalType === AGGREGATION_PACKET) {
			if (inFragment) return;
			// 2-byte NAL header, then [NAL size (2 bytes)][NAL unit] pairs (no DONL: WebRTC senders don't use it).
			let offset = 2;
			while (offset < payload.length) {
				if (offset + 2 > payload.length) return;
				const size = payload.readUInt16BE(offset);
				offset += 2;
				if (size === 0 || offset + size > payload.length) return;
				out.push(START_CODE, payload.subarray(offset, offset + size));
				offset += size;
			}
		} else if (nalType === FRAGMENTATION_UNIT) {
			if (payload.length < 3) return;
			const indicator = payload[0]!;
			const header = payload[2]!;
			const start = Boolean(header & 0x80);
			const end = Boolean(header & 0x40);
			if (start) {
				if (inFragment) return;
				// The original NAL header: F and LayerId bits from the FU indicator, the type from the FU header.
				out.push(START_CODE, Buffer.from([(indicator & 0x81) | ((header & 0x3f) << 1), payload[1]!]));
				inFragment = true;
			} else if (!inFragment) {
				return; // a middle or end fragment without its start (lost packet)
			}

			out.push(payload.subarray(3));
			if (end) inFragment = false;
		} else {
			// PACI (50) and beyond are not used by WebRTC senders.
			return;
		}
	}

	if (inFragment || out.length === 0) return;
	return Buffer.concat(out);
}

/**
 * Whether an Annex-B H265 frame can start a decode: it carries a random-access NAL unit (IDR or CRA; libwebrtc's
 * H265 encoder marks keyframes IDR_W_RADL/IDR_N_LP, CRA where streams start mid-GOP).
 *
 * @param frame - An Annex-B frame (4- or 3-byte start codes)
 */
export function h265FrameIsKeyframe(frame: Buffer): boolean {
	for (let index = 0; index + 3 < frame.length; index++) {
		if (frame[index] === 0 && frame[index + 1] === 0 && frame[index + 2] === 1) {
			const type = nalTypeOf(frame[index + 3]!);
			if (type >= 16 && type <= 21) return true; // BLA, IDR, CRA
			index += 2;
		}
	}

	return false;
}
