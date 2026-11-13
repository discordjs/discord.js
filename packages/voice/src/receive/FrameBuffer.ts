import type { Buffer } from 'node:buffer';

/**
 * One received video RTP packet waiting to be assembled into a frame.
 */
export interface BufferedPacket {
	marker: boolean;
	payload: Buffer;
	/**
	 * The media payload type (an RTX retransmission carries the one of its media stream).
	 */
	payloadType: number;
	retransmitted: boolean;
	sequence: number;
	timestamp: number;
}

export interface FrameBufferOptions {
	/**
	 * How long a frame with a missing packet waits for its retransmission before it is given up.
	 */
	maxWaitMs: number;
	/**
	 * Packets kept at most; beyond that the buffer resyncs (a stream that only ever loses).
	 */
	maxPackets?: number;
	/**
	 * Clock (tests).
	 */
	now?(): number;
	/**
	 * Asks for missing packets to be resent (RTCP NACK).
	 */
	onNack(sequences: number[]): void;
	/**
	 * A complete frame: its packets in sequence order, contiguous, ending with the marker packet.
	 */
	onFrame(packets: BufferedPacket[]): void;
}

/** Signed distance from b to a on the 16-bit sequence circle. */
const distance = (a: number, b: number) => ((a - b + 0x8000) & 0xffff) - 0x8000;

/**
 * Reassembles one SSRC's video packets into frames by RTP sequence number, the way a WebRTC receiver's packet buffer
 * does: a frame is emitted once every packet from the end of the previous frame up to its marker is there, so
 * reordered packets and RTX retransmissions land in place. A gap is asked for once (and once more) with a NACK; a
 * frame still incomplete after `maxWaitMs` is given up and assembly resumes after the next marker.
 */
export class FrameBuffer {
	private readonly packets = new Map<number, BufferedPacket>();

	/**
	 * The sequence number the next frame starts at; undefined until the first marker (a mid-frame join) is seen.
	 */
	private next: number | undefined;

	private gapSince: number | undefined;

	private readonly nacked = new Map<number, { at: number; count: number }>();

	private readonly maxPackets: number;

	private readonly now: () => number;

	public constructor(private readonly options: FrameBufferOptions) {
		this.maxPackets = options.maxPackets ?? 2_000;
		this.now = options.now ?? Date.now;
	}

	/**
	 * The number of packets waiting (tests, stats).
	 */
	public get size() {
		return this.packets.size;
	}

	public push(packet: BufferedPacket) {
		if (this.next !== undefined && distance(packet.sequence, this.next) < 0) return; // already emitted or given up
		this.packets.set(packet.sequence, packet);
		if (this.packets.size > this.maxPackets) this.reset();
		this.drain();
	}

	/**
	 * Gives up a frame that waited too long for a missing packet (call periodically).
	 */
	public tick() {
		if (this.gapSince === undefined || this.now() - this.gapSince < this.options.maxWaitMs) return;
		this.gapSince = undefined;
		// Skip to just after the next marker beyond the gap: the stuck frame (and anything before it) is lost.
		const marker = this.firstMarkerFrom(this.next!);
		if (marker === undefined) {
			this.reset();
			return;
		}

		this.dropThrough(marker);
		this.next = (marker + 1) & 0xffff;
		this.drain();
	}

	private reset() {
		this.packets.clear();
		this.nacked.clear();
		this.next = undefined;
		this.gapSince = undefined;
	}

	/** The first marker packet at or after `from`, by sequence. */
	private firstMarkerFrom(from: number): number | undefined {
		let best: number | undefined;
		for (const [sequence, packet] of this.packets) {
			if (!packet.marker || distance(sequence, from) < 0) continue;
			if (best === undefined || distance(sequence, best) < 0) best = sequence;
		}

		return best;
	}

	private dropThrough(sequence: number) {
		for (const key of this.packets.keys()) if (distance(key, sequence) <= 0) this.packets.delete(key);
		for (const key of this.nacked.keys()) if (distance(key, sequence) <= 0) this.nacked.delete(key);
	}

	private drain() {
		for (;;) {
			if (this.next === undefined) {
				// Joined mid-stream: wait for a frame end, start right after it.
				let first: number | undefined;
				for (const key of this.packets.keys()) if (first === undefined || distance(key, first) < 0) first = key;
				if (first === undefined) return;
				const marker = this.firstMarkerFrom(first);
				if (marker === undefined) return;
				this.dropThrough(marker);
				this.next = (marker + 1) & 0xffff;
				continue;
			}

			const frame: BufferedPacket[] = [];
			let sequence = this.next;
			let complete = false;
			for (;;) {
				const packet = this.packets.get(sequence);
				if (!packet) break;
				if (frame.length && packet.timestamp !== frame[0]!.timestamp) {
					// The previous frame ended without a marker: it is complete (contiguous) all the same.
					complete = true;
					break;
				}

				frame.push(packet);
				sequence = (sequence + 1) & 0xffff;
				if (packet.marker) {
					complete = true;
					break;
				}
			}

			if (!complete) {
				this.requestMissing(sequence);
				return;
			}

			for (const packet of frame) {
				this.packets.delete(packet.sequence);
				this.nacked.delete(packet.sequence);
			}

			this.next = sequence;
			this.gapSince = undefined;
			this.options.onFrame(frame);
		}
	}

	/** Missing packets from `from` up to the newest one received: NACK them (each at most twice, 100 ms apart). */
	private requestMissing(from: number) {
		let newest: number | undefined;
		for (const key of this.packets.keys()) if (newest === undefined || distance(key, newest) > 0) newest = key;
		if (newest === undefined || distance(newest, from) <= 0) return; // nothing after the hole yet: just in flight
		const now = this.now();
		this.gapSince ??= now;
		const missing: number[] = [];
		for (let sequence = from; distance(sequence, newest) < 0; sequence = (sequence + 1) & 0xffff) {
			if (this.packets.has(sequence)) continue;
			const asked = this.nacked.get(sequence);
			if (asked && (asked.count >= 2 || now - asked.at < 100)) continue;
			this.nacked.set(sequence, { at: now, count: (asked?.count ?? 0) + 1 });
			missing.push(sequence);
			if (missing.length >= 64) break;
		}

		if (missing.length) this.options.onNack(missing);
	}
}
