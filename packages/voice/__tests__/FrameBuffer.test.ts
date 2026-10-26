import { Buffer } from 'node:buffer';
import { describe, expect, test } from 'vitest';
import { createNACK } from '../src/networking/rtcp';
import { FrameBuffer, type BufferedPacket } from '../src/receive/FrameBuffer';

function packet(sequence: number, timestamp: number, marker = false): BufferedPacket {
	return { sequence: sequence & 0xffff, timestamp, marker, payloadType: 101, retransmitted: false, payload: Buffer.from([sequence & 0xff]) };
}

function harness(maxWaitMs = 300) {
	let clock = 0;
	const frames: number[][] = [];
	const nacks: number[][] = [];
	const buffer = new FrameBuffer({
		maxWaitMs,
		now: () => clock,
		onFrame: (packets) => frames.push(packets.map((item) => item.sequence)),
		onNack: (sequences) => nacks.push(sequences),
	});
	return { buffer, frames, nacks, advance: (ms: number) => (clock += ms) };
}

describe('FrameBuffer', () => {
	test('in-order frames after the first marker (a mid-frame join drops the partial frame)', () => {
		const { buffer, frames } = harness();
		for (const item of [packet(10, 1), packet(11, 1, true), packet(12, 2), packet(13, 2), packet(14, 2, true), packet(15, 3, true)])
			buffer.push(item);
		expect(frames).toEqual([[12, 13, 14], [15]]);
	});

	test('reordered packets are put in place', () => {
		const { buffer, frames, nacks } = harness();
		buffer.push(packet(1, 1, true));
		for (const sequence of [2, 4, 3]) buffer.push(packet(sequence, 2, sequence === 4));
		expect(frames).toEqual([[2, 3, 4]]);
		expect(nacks).toEqual([[3]]); // asked once while 3 was missing
	});

	test('a retransmission fills the gap; a NACK is not repeated within 100 ms', () => {
		const { buffer, frames, nacks, advance } = harness();
		buffer.push(packet(1, 1, true));
		buffer.push(packet(2, 2));
		buffer.push(packet(4, 2));
		buffer.push(packet(5, 2, true));
		expect(nacks).toEqual([[3]]);
		advance(50);
		buffer.tick();
		buffer.push(packet(6, 3, true));
		expect(nacks).toEqual([[3]]);
		buffer.push({ ...packet(3, 2), retransmitted: true });
		expect(frames).toEqual([
			[2, 3, 4, 5],
			[6],
		]);
	});

	test('a frame that never completes is given up after maxWaitMs, the next one goes out', () => {
		const { buffer, frames, advance } = harness(300);
		buffer.push(packet(1, 1, true));
		buffer.push(packet(2, 2));
		buffer.push(packet(4, 2, true)); // 3 lost
		buffer.push(packet(5, 3));
		buffer.push(packet(6, 3, true));
		expect(frames).toEqual([]);
		advance(299);
		buffer.tick();
		expect(frames).toEqual([]);
		advance(2);
		buffer.tick();
		expect(frames).toEqual([[5, 6]]);
		buffer.push(packet(3, 2)); // a late retransmission of the given-up frame is ignored
		expect(frames).toEqual([[5, 6]]);
	});

	test('sequence numbers wrap around', () => {
		const { buffer, frames } = harness();
		buffer.push(packet(65_533, 1, true));
		for (const sequence of [65_534, 65_535, 0, 1]) buffer.push(packet(sequence, 2, sequence === 1));
		expect(frames).toEqual([[65_534, 65_535, 0, 1]]);
	});

	test('a frame without a marker ends where the next timestamp starts', () => {
		const { buffer, frames } = harness();
		buffer.push(packet(1, 1, true));
		buffer.push(packet(2, 2));
		buffer.push(packet(3, 3, true));
		expect(frames).toEqual([[2], [3]]);
	});
});

describe('createNACK', () => {
	test('one FCI entry per run of 17, bitmask for the following ones', () => {
		const nack = createNACK(0x01020304, [100, 101, 103, 117, 118]);
		expect(nack[0]).toBe(0x81);
		expect(nack[1]).toBe(205);
		expect(nack.readUInt16BE(2)).toBe(2 + 2); // 2 entries
		expect(nack.readUInt32BE(8)).toBe(0x01020304);
		// 100 with 101 (bit 0) and 103 (bit 2); 117 is 17 after 100, so it starts the second entry, with 118 (bit 0).
		expect(nack.readUInt16BE(12)).toBe(100);
		expect(nack.readUInt16BE(14)).toBe((1 << 0) | (1 << 2));
		expect(nack.readUInt16BE(16)).toBe(117);
		expect(nack.readUInt16BE(18)).toBe(1 << 0);
	});
});

describe('createREMB', () => {
	test('length, identifier, exponent/mantissa and SSRCs as libwebrtc writes them', async () => {
		const { createREMB } = await import('../src/networking/rtcp');
		const remb = createREMB(0x11, [0xaa, 0xbb], 8_000_000);
		expect(remb.length).toBe(28);
		expect(remb[0]).toBe(0x8f);
		expect(remb[1]).toBe(206);
		expect(remb.readUInt16BE(2)).toBe(remb.length / 4 - 1); // 6 = 7 words minus one
		expect(remb.readUInt32BE(8)).toBe(0);
		expect(remb.toString('ascii', 12, 16)).toBe('REMB');
		expect(remb[16]).toBe(2);
		const exponent = remb[17]! >> 2;
		const mantissa = ((remb[17]! & 0x03) << 16) | (remb[18]! << 8) | remb[19]!;
		expect(mantissa * 2 ** exponent).toBeLessThanOrEqual(8_000_000);
		expect(mantissa * 2 ** exponent).toBeGreaterThan(7_900_000);
		expect(remb.readUInt32BE(24)).toBe(0xbb);
	});
});
