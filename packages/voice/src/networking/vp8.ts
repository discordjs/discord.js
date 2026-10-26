import { Buffer } from 'node:buffer';

/**
 * VP8 and VP9 RTP depacketization.
 *
 * @remarks
 * The payload descriptor at the start of every packet is transport metadata; the encoded frame is the concatenation
 * of what follows it. DAVE encrypts that frame as a whole (libdave: VP8 keeps its first byte unencrypted, 10 for a
 * keyframe; VP9 encrypts everything, its descriptor being outside the frame), so stripping the descriptors and
 * joining the packets of a frame gives exactly the bytes the sender encrypted.
 */

/**
 * The length of a VP8 payload descriptor (RFC 7741 section 4.2), or -1 when malformed.
 *
 * @param payload - One RTP payload
 */
export function vp8DescriptorLength(payload: Buffer): number {
	if (payload.length < 1) return -1;
	let offset = 1;
	if (payload[0]! & 0x80) {
		// X: the extension byte follows.
		if (payload.length < 2) return -1;
		const extension = payload[1]!;
		offset = 2;
		if (extension & 0x80) {
			// I: PictureID, 7 or 15 bits (M bit).
			if (offset >= payload.length) return -1;
			offset += payload[offset]! & 0x80 ? 2 : 1;
		}

		if (extension & 0x40) offset++; // L: TL0PICIDX
		if (extension & 0x30) offset++; // T or K: TID / KEYIDX
	}

	return offset <= payload.length ? offset : -1;
}

/**
 * Reassembles the RTP payloads of one VP8 frame (in sequence order) into the encoded frame.
 *
 * @param payloads - The RTP payloads of the frame, in sequence order
 * @returns The frame, or undefined when a descriptor is malformed or the frame does not start with S=1, PID=0
 */
export function depacketizeVp8Frame(payloads: Buffer[]): Buffer | undefined {
	const parts: Buffer[] = [];
	for (const [index, payload] of payloads.entries()) {
		const length = vp8DescriptorLength(payload);
		if (length < 0) return;
		// The first packet of a frame starts partition 0: S set, PID 0.
		if (index === 0 && ((payload[0]! & 0x10) === 0 || (payload[0]! & 0x07) !== 0)) return;
		parts.push(payload.subarray(length));
	}

	const frame = Buffer.concat(parts);
	return frame.length ? frame : undefined;
}

/**
 * Whether a VP8 frame is a keyframe (frame tag bit 0, the inverse key frame flag, is 0).
 *
 * @param frame - An encoded VP8 frame
 */
export function vp8FrameIsKeyframe(frame: Buffer): boolean {
	return frame.length > 0 && (frame[0]! & 0x01) === 0;
}

/**
 * The length of a VP9 payload descriptor (draft-ietf-payload-vp9, as libwebrtc parses it), or -1 when malformed.
 *
 * @param payload - One RTP payload
 */
export function vp9DescriptorLength(payload: Buffer): number {
	if (payload.length < 1) return -1;
	const first = payload[0]!;
	const pictureId = Boolean(first & 0x80);
	const interPicture = Boolean(first & 0x40);
	const layerIndices = Boolean(first & 0x20);
	const flexible = Boolean(first & 0x10);
	const scalability = Boolean(first & 0x02);
	let offset = 1;
	const need = (count: number) => offset + count <= payload.length;
	if (pictureId) {
		if (!need(1)) return -1;
		offset += payload[offset]! & 0x80 ? 2 : 1;
	}

	if (layerIndices) {
		offset++; // TID | U | SID | D
		if (!flexible) offset++; // TL0PICIDX
	}

	if (flexible && interPicture) {
		// Up to 3 reference indices, each with N (another follows) in bit 0.
		for (let index = 0; index < 3; index++) {
			if (!need(1)) return -1;
			const pDiff = payload[offset++]!;
			if ((pDiff & 0x01) === 0) break;
		}
	}

	if (scalability) {
		if (!need(1)) return -1;
		const ss = payload[offset++]!;
		const spatialLayers = (ss >> 5) + 1;
		if (ss & 0x10) offset += 4 * spatialLayers; // Y: width and height per layer
		if (ss & 0x08) {
			// G: picture group description.
			if (!need(1)) return -1;
			const groups = payload[offset++]!;
			for (let index = 0; index < groups; index++) {
				if (!need(1)) return -1;
				const references = (payload[offset++]! >> 2) & 0x03;
				offset += references;
			}
		}
	}

	return offset <= payload.length ? offset : -1;
}

/**
 * Reassembles the RTP payloads of one VP9 frame (in sequence order) into the encoded frame.
 *
 * @param payloads - The RTP payloads of the frame, in sequence order
 * @returns The frame, or undefined when a descriptor is malformed or the frame does not start with B set
 */
export function depacketizeVp9Frame(payloads: Buffer[]): Buffer | undefined {
	const parts: Buffer[] = [];
	for (const [index, payload] of payloads.entries()) {
		const length = vp9DescriptorLength(payload);
		if (length < 0) return;
		if (index === 0 && (payload[0]! & 0x08) === 0) return; // B: beginning of a frame
		parts.push(payload.subarray(length));
	}

	const frame = Buffer.concat(parts);
	return frame.length ? frame : undefined;
}
