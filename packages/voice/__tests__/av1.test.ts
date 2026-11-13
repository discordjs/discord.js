import { Buffer } from 'node:buffer';
import { describe, expect, test } from 'vitest';
import { depacketizeAv1Frame, depacketizeAv1FrameNormalized, type Av1Obu } from '../src/networking/av1';

function readLeb(buf: Buffer, at: number) {
	let value = 0;
	let shift = 0;
	let position0 = at;
	for (;;) {
		const byte = buf[position0++]!;
		value += (byte & 0x7f) * 2 ** shift;
		if ((byte & 0x80) === 0) return { value, next: position0 };
		shift += 7;
	}
}

/**
 * Emits RTP payloads for a sender-layout frame the way libwebrtc's
 * RtpPacketizerAv1 does: an aggregation header per packet, leb128 size
 * prefixes for all but the last OBU element of a packet, and the OBU's own
 * size field stripped from the element bytes.
 */
function packetizeSenderFrame(frame: Buffer, maxPayload: number): Buffer[] {
	// Parse the sender-layout frame into OBUs (headers/sizes present except
	// for the final sizeless OBU).
	const obus: { header: number; payload: Buffer }[] = [];
	let position = 0;
	while (position < frame.length) {
		const header = frame[position++]!;
		const hasExtension = Boolean(header & 0b100);
		const hasSize = Boolean(header & 0b10);
		if (hasExtension) position++;
		let payload: Buffer;
		if (hasSize) {
			const size = readLeb(frame, position);
			position = size.next;
			payload = frame.subarray(position, position + size.value);
			position += size.value;
		} else {
			payload = frame.subarray(position);
			position = frame.length;
		}

		obus.push({ header, payload });
	}

	// Build OBU element byte streams (header without size bit + payload).
	const elements = obus.map((obu) => ({
		header: obu.header & ~0b10,
		payload: obu.payload,
		size: 1 + obu.payload.length,
	}));

	const payloads: Buffer[] = [];
	let current: Buffer[] = [];
	let currentSize = 0;
	let emittedElements = 0;

	const flush = (endsWithFragment: boolean) => {
		const numElements = current.length;
		const aggregation = (numElements <= 3 ? numElements << 4 : 0) | (endsWithFragment ? 0x40 : 0);
		const parts: Buffer[] = [Buffer.from([aggregation])];
		for (let index = 0; index < current.length; index++) {
			if (index < current.length - 1 || numElements > 3) {
				parts.push(writeLeb(current[index]!.length));
			}

			parts.push(current[index]!);
		}

		payloads.push(Buffer.concat(parts));
		current = [];
		currentSize = 0;
	};

	for (const element of elements) {
		if (currentSize + element.size > maxPayload && current.length > 0) {
			flush(false);
			emittedElements = 0;
		}

		// (Fragmentation across packets is not simulated; maxPayload is chosen
		// large enough in tests.)
		current.push(Buffer.concat([Buffer.from([element.header]), element.payload]));
		currentSize += element.size;
		emittedElements++;
	}

	if (current.length > 0) flush(false);

	return payloads;
}

function writeLeb(value: number): Buffer {
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

function senderFrameFromObus(obus: Pick<Av1Obu, 'header' | 'payload'>[]): Buffer {
	const parts: Buffer[] = [];
	for (let index = 0; index < obus.length; index++) {
		const isLast = index === obus.length - 1;
		parts.push(Buffer.from([isLast ? obus[index]!.header & ~0b10 : obus[index]!.header | 0b10]));
		if (!isLast) parts.push(writeLeb(obus[index]!.payload.length));
		parts.push(obus[index]!.payload);
	}

	return Buffer.concat(parts);
}

describe('AV1 depacketization', () => {
	test('reassembles a single-packet frame exactly', () => {
		const frame = senderFrameFromObus([
			{ header: 0x0a, payload: Buffer.from([1, 2, 3, 4]) },
			{ header: 0x2a, payload: Buffer.alloc(64, 0xaa) },
		]);
		const payloads = packetizeSenderFrame(frame, 1_200);
		expect(payloads).toHaveLength(1);
		expect(depacketizeAv1Frame(payloads)).toEqual(frame);
	});

	test('reassembles a multi-packet frame exactly', () => {
		const frame = senderFrameFromObus([
			{ header: 0x0a, payload: Buffer.from([...Array.from({ length: 40 }).keys()]) },
			{ header: 0x2a, payload: Buffer.alloc(1_500, 0x5a) },
		]);
		const payloads = packetizeSenderFrame(frame, 700);
		expect(payloads.length).toBeGreaterThan(1);
		expect(depacketizeAv1Frame(payloads)).toEqual(frame);
	});

	test('keeps the DAVE trailer inside the sizeless final OBU', () => {
		const trailer = Buffer.concat([
			Buffer.alloc(8, 0xcc),
			Buffer.from([0x18, 0x00, 0x02, 0x1f, 0x01, 0x10, 0xfa, 0xfa]),
		]);
		const frame = senderFrameFromObus([
			{ header: 0x0a, payload: Buffer.from([9, 9]) },
			{ header: 0x2a, payload: Buffer.concat([Buffer.alloc(50, 0x33), trailer]) },
		]);
		const payloads = packetizeSenderFrame(frame, 1_200);
		const assembled = depacketizeAv1Frame(payloads)!;
		expect(assembled).toEqual(frame);
		expect(assembled.subarray(assembled.length - 2)).toEqual(Buffer.from([0xfa, 0xfa]));
	});

	test('normalizes every OBU with a size field', () => {
		// Aggregation header 0x22: W=2 - element 1 has a size prefix (2),
		// element 2 extends to the end of the payload.
		const normalized = depacketizeAv1FrameNormalized([
			Buffer.from([0x22, 0x02, 0x08, 0x03, 0x28, 0x01, 0x02, 0x03, 0x04]),
		])!;
		// Two OBUs: [0a 03] and [2a 01 02 03 4] - both with S bit and size.
		expect(normalized).toEqual(Buffer.from([0x0a, 0x01, 0x03, 0x2a, 0x04, 1, 2, 3, 4]));
	});

	test('rejects malformed continuation chains', () => {
		expect(depacketizeAv1Frame([Buffer.from([0x80, 0x2a, 1])])).toBeUndefined();
		expect(depacketizeAv1Frame([Buffer.from([0x40, 0x2a, 1])])).toBeUndefined();
	});

	test('rejects size prefixes exceeding the payload', () => {
		expect(depacketizeAv1Frame([Buffer.from([0x22, 0x20, 0x2a])])).toBeUndefined();
	});
});
