import { Buffer } from 'node:buffer';

/**
 * RTCP packet types (RFC 3550 / RFC 4585) as they appear in the
 * payload type byte of a packet, once the RTP/RTCP bit is masked off.
 */
export const enum RtcpPayloadType {
	ReceiverReport = 201,
	SenderReport = 200,
	SourceDescription = 202,
	Bye = 203,
	App = 204,
	/**
	 * Transport layer feedback (NACK etc.) in the 64-95 RTP-compatible range.
	 */
	TransportFeedback = 74,
	/**
	 * Payload specific feedback (PLI, FIR) in the 64-95 RTP-compatible range.
	 */
	PayloadFeedback = 78,
}

/**
 * Checks whether a UDP packet looks like an RTCP packet rather than an RTP packet.
 *
 * @param buffer - The packet to check
 */
export function isRTCPPacket(buffer: Buffer): boolean {
	if (buffer.length < 8) return false;
	const packetType = buffer[1]! & 0x7f;
	// RTCP packets have version 2 and either explicit RTCP payload types (200-204)
	// or RTP-compatible feedback types mapped into 72-76 (RFC 5761 section 4).
	if (buffer[0]! >> 6 !== 2) return false;
	return (packetType >= 200 && packetType <= 204) || (packetType >= 72 && packetType <= 79);
}

/**
 * The RTCP payload type byte for payload-specific feedback (PSFB) messages.
 */
const PSFB = 206;

/**
 * The feedback message type (FMT) for a picture loss indication.
 */
const PLI_FMT = 1;

/**
 * Creates an RTCP picture loss indication (PLI) packet (RFC 4585).
 *
 * @remarks
 * Discord's SFU responds to PLIs by asking the sender to produce a new keyframe.
 * Receivers of H.264/VP8 video need to send these, otherwise the stream cannot
 * be decoded after joining or after packet loss.
 * @param mediaSsrc - The SSRC of the video stream to request a keyframe for
 * @param senderSsrc - Our own SSRC to use in the packet, 0 works with Discord
 */
export function createPLI(mediaSsrc: number, senderSsrc = 0): Buffer {
	const buffer = Buffer.alloc(12);
	buffer[0] = 0x80 | PLI_FMT;
	buffer[1] = PSFB;
	// Length of the packet in 32-bit words minus one, excluding this header
	buffer.writeUInt16BE(2, 2);
	buffer.writeUInt32BE(senderSsrc, 4);
	buffer.writeUInt32BE(mediaSsrc, 8);
	return buffer;
}

/**
 * The RTCP payload type byte for transport-layer feedback (RTPFB) messages.
 */
const RTPFB = 205;

/**
 * Creates an RTCP generic NACK (RFC 4585 section 6.2.1) asking for lost packets of a media stream to be resent
 * (Discord's SFU answers on the stream's RTX SSRC).
 *
 * @param mediaSsrc - The SSRC of the video stream the packets were lost from
 * @param sequences - The missing RTP sequence numbers
 * @param senderSsrc - Our own SSRC to use in the packet, 0 works with Discord
 */
export function createNACK(mediaSsrc: number, sequences: number[], senderSsrc = 0): Buffer {
	// One FCI entry per run: a packet id and a bitmask of the 16 sequence numbers after it.
	const sorted = [...new Set(sequences.map((sequence) => sequence & 0xffff))].sort(
		(a, b) => ((a - sequences[0]! + 0x8000) & 0xffff) - ((b - sequences[0]! + 0x8000) & 0xffff),
	);
	const entries: { bitmask: number; pid: number }[] = [];
	for (const sequence of sorted) {
		const last = entries.at(-1);
		const delta = last ? (sequence - last.pid + 0x10000) & 0xffff : 0;
		if (last && delta >= 1 && delta <= 16) last.bitmask |= 1 << (delta - 1);
		else entries.push({ pid: sequence, bitmask: 0 });
	}

	const buffer = Buffer.alloc(12 + 4 * entries.length);
	buffer[0] = 0x80 | 1; // V=2, FMT=1 (generic NACK)
	buffer[1] = RTPFB;
	buffer.writeUInt16BE(2 + entries.length, 2); // length in 32-bit words minus one
	buffer.writeUInt32BE(senderSsrc >>> 0, 4);
	buffer.writeUInt32BE(mediaSsrc >>> 0, 8);
	for (const [index, entry] of entries.entries()) {
		buffer.writeUInt16BE(entry.pid, 12 + 4 * index);
		buffer.writeUInt16BE(entry.bitmask, 14 + 4 * index);
	}

	return buffer;
}
