import { Buffer } from 'node:buffer';
import { describe, expect, test } from 'vitest';
import { createPLI, createReceiverReport, isRTCPPacket } from '../src/networking/rtcp';

describe('RTCP helpers', () => {
	test('createPLI produces a valid PSFB PLI packet', () => {
		const ssrc = 0x12_34_56_78;
		const pli = createPLI(ssrc);

		expect(pli.length).toEqual(12);
		// Version 2, no padding, FMT 1 (PLI)
		expect(pli[0]).toEqual(0x81);
		// Payload-specific feedback (206)
		expect(pli[1]).toEqual(206);
		// Length in 32-bit words minus one
		expect(pli.readUInt16BE(2)).toEqual(2);
		// Sender SSRC 0
		expect(pli.readUInt32BE(4)).toEqual(0);
		// Media SSRC
		expect(pli.readUInt32BE(8)).toEqual(ssrc);
	});

	test('createPLI supports a custom sender SSRC', () => {
		const pli = createPLI(1, 99);
		expect(pli.readUInt32BE(4)).toEqual(99);
		expect(pli.readUInt32BE(8)).toEqual(1);
	});

	test('isRTCPPacket detects RTCP and RTP packets', () => {
		const rtcp = Buffer.from([0x81, 201, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]);
		const rtcpCompatible = Buffer.from([0x81, 74, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
		const rtp = Buffer.from([0x80, 120, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]);
		const short = Buffer.from([0x80, 120]);

		expect(isRTCPPacket(rtcp)).toEqual(true);
		expect(isRTCPPacket(rtcpCompatible)).toEqual(true);
		expect(isRTCPPacket(rtp)).toEqual(false);
		expect(isRTCPPacket(short)).toEqual(false);
	});

	test('createReceiverReport produces valid receiver report blocks', () => {
		const report = createReceiverReport(99, [
			{ ssrc: 1, extHighestSequence: 0x1_00_10 },
			{ ssrc: 2, extHighestSequence: 5 },
		]);

		// 8-byte header + two 24-byte report blocks
		expect(report.length).toEqual(56);
		// Version 2, no padding, 2 report blocks
		expect(report[0]).toEqual(0x82);
		// Receiver Report (201)
		expect(report[1]).toEqual(201);
		// Length in 32-bit words minus one: (8 header bytes + 2 × 24 block bytes) / 4 − 1
		expect(report.readUInt16BE(2)).toEqual(13);
		// Sender SSRC
		expect(report.readUInt32BE(4)).toEqual(99);
		// First block: SSRC, zero fraction/cumulative lost, extended highest sequence
		expect(report.readUInt32BE(8)).toEqual(1);
		expect(report[12]).toEqual(0);
		expect(report.readUInt32BE(16)).toEqual(0x1_00_10);
		// Second block
		expect(report.readUInt32BE(32)).toEqual(2);
		expect(report.readUInt32BE(40)).toEqual(5);
	});
});
