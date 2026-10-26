import { Buffer } from 'node:buffer';

/**
 * H264 RTP depacketization (RFC 6184, as libwebrtc's VideoRtpDepacketizerH264 does it).
 *
 * @remarks
 * DAVE encrypts the Annex-B frame the encoder produced, after libdave rewrote every start code to the 4-byte form
 * ("because WebRTC will convert all start codes to 4-byte on the receiver side", libdave codec_utils.cpp): each NAL
 * unit keeps its header (and, for slices, the bytes up to the PPS id) unencrypted, and the DAVE trailer rides at the
 * end of the last NAL unit. Rebuilding the frame as `00 00 00 01` + NAL unit for every NAL unit of the packets —
 * single NAL units, STAP-A aggregates and FU-A fragments — reproduces exactly the bytes the sender encrypted. The
 * decrypted result is a plain Annex-B bitstream decoders accept.
 */

const START_CODE = Buffer.from([0, 0, 0, 1]);

const NAL_TYPE_MASK = 0x1f;
const STAP_A = 24;
const FU_A = 28;

/**
 * Reassembles the RTP payloads of one H264 frame (in sequence order) into an Annex-B frame.
 *
 * @param payloads - The RTP payloads of the frame, in sequence order
 * @returns The Annex-B frame, or undefined when the payloads are malformed or a fragment is missing
 */
export function depacketizeH264Frame(payloads: Buffer[]): Buffer | undefined {
	const out: Buffer[] = [];
	let inFragment = false;
	for (const payload of payloads) {
		if (payload.length < 1) return;
		const nalType = payload[0]! & NAL_TYPE_MASK;
		if (nalType >= 1 && nalType <= 23) {
			// Single NAL unit packet.
			if (inFragment) return; // an FU-A was cut short
			out.push(START_CODE, payload);
		} else if (nalType === STAP_A) {
			if (inFragment) return;
			let offset = 1;
			while (offset < payload.length) {
				if (offset + 2 > payload.length) return;
				const size = payload.readUInt16BE(offset);
				offset += 2;
				if (size === 0 || offset + size > payload.length) return;
				out.push(START_CODE, payload.subarray(offset, offset + size));
				offset += size;
			}
		} else if (nalType === FU_A) {
			if (payload.length < 2) return;
			const indicator = payload[0]!;
			const header = payload[1]!;
			const start = Boolean(header & 0x80);
			const end = Boolean(header & 0x40);
			if (start) {
				if (inFragment) return;
				// The original NAL header: F and NRI from the FU indicator, the type from the FU header.
				out.push(START_CODE, Buffer.from([(indicator & 0xe0) | (header & NAL_TYPE_MASK)]));
				inFragment = true;
			} else if (!inFragment) {
				return; // a middle or end fragment without its start (lost packet)
			}

			out.push(payload.subarray(2));
			if (end) inFragment = false;
		} else {
			// STAP-B, MTAP and FU-B are not used by WebRTC senders.
			return;
		}
	}

	if (inFragment || out.length === 0) return;
	return Buffer.concat(out);
}

/**
 * Whether an Annex-B H264 frame can start a decode: it carries an IDR slice (NAL type 5).
 *
 * @param frame - An Annex-B frame (4- or 3-byte start codes)
 */
export function h264FrameIsKeyframe(frame: Buffer): boolean {
	for (let index = 0; index + 3 < frame.length; index++) {
		if (frame[index] === 0 && frame[index + 1] === 0 && frame[index + 2] === 1) {
			if ((frame[index + 3]! & NAL_TYPE_MASK) === 5) return true;
			index += 2;
		}
	}

	return false;
}
