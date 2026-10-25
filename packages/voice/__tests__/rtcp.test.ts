import { Buffer } from 'node:buffer';
import { describe, expect, test } from 'vitest';
import { createPLI, isRTCPPacket } from '../src/networking/rtcp';

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
});
