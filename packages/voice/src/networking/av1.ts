import { Buffer } from 'node:buffer';

/**
 * Utilities for AV1 RTP depacketization (RFC 9494, libwebrtc-compatible).
 */

/**
 * A single OBU element reassembled from RTP payloads.
 */
export interface Av1Obu {
	/**
	 * The OBU extension byte, when present.
	 */
	extension?: number;
	/**
	 * The OBU header byte as it appeared on the wire (size bit cleared by packetizers).
	 */
	header: number;
	/**
	 * The OBU payload bytes (without header, extension or size).
	 */
	payload: Buffer;
}

const OBU_HAS_EXTENSION_MASK = 0b0000_0100;
const OBU_HAS_SIZE_MASK = 0b0000_0010;

function readLeb128(buffer: Buffer, offset: number): { next: number, value: number; } | undefined {
	let value = 0;
	let shift = 0;
	let position = offset;
	for (;;) {
		if (position >= buffer.length || shift > 31) return;
		const byte = buffer[position++]!;
		value += (byte & 0x7f) * 2 ** shift;
		if ((byte & 0x80) === 0) return { value, next: position };
		shift += 7;
	}
}

function writeLeb128(value: number): Buffer {
	const bytes: number[] = [];
	let remaining = value;
	do {
		let byte = remaining & 0x7f;
		remaining >>>= 7;
		if (remaining > 0) byte |= 0x80;
		bytes.push(byte);
	} while (remaining > 0);

	return Buffer.from(bytes);
}

/**
 * Parses the RTP payloads of one AV1 frame into its OBU elements, following
 * the same algorithm as libwebrtc's VideoRtpDepacketizerAv1::ParseObus.
 *
 * @remarks
 * Each payload starts with an aggregation header:
 * - Z (0x80): the payload starts with a continuation of the previous OBU
 * - Y (0x40): the payload ends with an OBU fragment continued next payload
 * - W (0x30): the number of OBU elements in the payload when nonzero and at
 *   most 3; the last element then has no leb128 size prefix. When zero, every
 *   element carries a leb128 size prefix.
 * @param payloads - The RTP payloads of the frame, in sequence order
 * @returns The OBU elements, or undefined when the payloads are malformed
 */
export function parseAv1Obus(payloads: Buffer[]): Av1Obu[] | undefined {
	if (payloads.length === 0) return;

	const obus: Av1Obu[] = [];
	let expectContinues = false;

	for (const payload of payloads) {
		if (payload.length === 0) return;
		const aggregation = payload[0]!;
		const continues = Boolean(aggregation & 0x80);
		const endsWithFragment = Boolean(aggregation & 0x40);
		const numObus = (aggregation & 0x30) >> 4;

		if (continues !== expectContinues) return;

		let position = 1;
		if (payload.length === 1) {
			// Payload with just an aggregation header: valid only as a single,
			// empty OBU element announcement.
			if (numObus !== 1) return;
			if (!continues) obus.push({ header: 0, payload: Buffer.alloc(0) });
			expectContinues = endsWithFragment;
			continue;
		}

		for (let obuIndex = 1; position < payload.length; obuIndex++) {
			let fragmentSize: number;
			const hasSizePrefix = obuIndex !== numObus;
			if (hasSizePrefix) {
				const size = readLeb128(payload, position);
				if (!size || size.value > payload.length - size.next) return;
				position = size.next;
				fragmentSize = size.value;
			} else {
				fragmentSize = payload.length - position;
			}

			const fragment = payload.subarray(position, position + fragmentSize);
			position += fragmentSize;

			if (continues && obuIndex === 1) {
				// Continuation fragment: append to the previous OBU payload.
				const previous = obus[obus.length - 1];
				if (!previous) return;
				previous.payload = Buffer.concat([previous.payload, fragment]);
			} else if (fragmentSize > 0 || !continues) {
				if (fragment.length === 0) return;
				obus.push({ header: fragment[0]!, payload: Buffer.from(fragment.subarray(1)) });
			} else {
				return;
			}
		}

		expectContinues = endsWithFragment;
	}

	if (expectContinues) return;
	return obus;
}

/**
 * Serializes OBU elements back into a frame.
 *
 * @param obus - The OBU elements
 * @param senderLayout - When true, reproduces the exact byte layout DAVE
 * encrypted on the sender: every OBU except the last carries its size field,
 * and the last OBU is sizeless so the DAVE trailer rides in its payload.
 * When false, emits the normalized layout receivers hand to decoders: every
 * OBU carries a canonical size field.
 */
export function serializeAv1Obus(obus: Av1Obu[], senderLayout: boolean): Buffer | undefined {
	if (obus.length === 0) return;

	const parts: Buffer[] = [];
	for (let index = 0; index < obus.length; index++) {
		const obu = obus[index]!;
		const isLast = index === obus.length - 1;
		const hasExtension = Boolean(obu.header & OBU_HAS_EXTENSION_MASK);
		if (hasExtension && obu.extension === undefined) return;

		// The wire OBU headers carry the payload without its size; the size is
		// restored from the element lengths known to the depacketizer.
		if (senderLayout && isLast) {
			const header = Buffer.from([obu.header & ~OBU_HAS_SIZE_MASK]);
			parts.push(header, ...(hasExtension ? [Buffer.from([obu.extension!])] : []), obu.payload);
		} else {
			const header = Buffer.from([obu.header | OBU_HAS_SIZE_MASK]);
			parts.push(
				header,
				...(hasExtension ? [Buffer.from([obu.extension!])] : []),
				writeLeb128(obu.payload.length),
				obu.payload,
			);
		}
	}

	return Buffer.concat(parts);
}

/**
 * An OBU element with the validation results of {@link validateAv1Obus}.
 */
export interface ValidatedAv1Obu extends Av1Obu {
	/**
	 * Whether the OBU carried an inline size field on the wire.
	 */
	inlineSize?: boolean;
}

/**
 * Validates the parsed OBU elements, mirroring
 * VideoRtpDepacketizerAv1::CalculateObuSizes: when a wire OBU unexpectedly
 * carries its own size field, it must match the reassembled payload length.
 * The extension byte and inline size are split off the payload in place.
 */
export function validateAv1Obus(obus: ValidatedAv1Obu[]): boolean {
	for (const obu of obus) {
		if (obu.header & OBU_HAS_SIZE_MASK) {
			// The packetizer clears the size bit of emitted OBU headers; a set
			// size bit with a matching inline size is still acceptable.
			const inlineSize = readLeb128(obu.payload, 0);
			if (!inlineSize) return false;
			if (inlineSize.value !== obu.payload.length - inlineSize.next) return false;
			obu.payload = obu.payload.subarray(inlineSize.next);
			obu.inlineSize = true;
		}

		if (obu.header & OBU_HAS_EXTENSION_MASK) {
			if (obu.payload.length === 0) return false;
			obu.extension = obu.payload[0]!;
			obu.payload = obu.payload.subarray(1);
		}

		if (obu.payload.length === 0 && obus.length > 1) return false;
	}

	return true;
}

/**
 * Reassembles the RTP payloads of one AV1 frame into the exact frame bytes the
 * sender produced before packetization.
 *
 * @remarks
 * Implements the AV1 RTP depacketization of libwebrtc (RFC 9494 aggregation
 * headers with leb128 element sizes) and reconstructs the sender-side layout
 * DAVE authenticated: OBU headers and canonical size fields are restored, and
 * the final OBU is left sizeless so the DAVE trailer stays inside its payload.
 * @param payloads - The RTP payloads of the frame, in order
 * @returns The assembled frame, or undefined when the payloads are malformed
 */
export function depacketizeAv1Frame(payloads: Buffer[]): Buffer | undefined {
	const obus = parseAv1Obus(payloads);
	if (!obus || !validateAv1Obus(obus)) return;
	return serializeAv1Obus(obus, true) ?? undefined;
}

/**
 * Reassembles the RTP payloads of one AV1 frame into the normalized OBU
 * bitstream decoders expect (every OBU with a canonical size field).
 *
 * @param payloads - The RTP payloads of the frame, in order
 * @returns The assembled frame, or undefined when the payloads are malformed
 */
export function depacketizeAv1FrameNormalized(payloads: Buffer[]): Buffer | undefined {
	const obus = parseAv1Obus(payloads);
	if (!obus || !validateAv1Obus(obus)) return;
	return serializeAv1Obus(obus, false) ?? undefined;
}
