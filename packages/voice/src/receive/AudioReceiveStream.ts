import type { Buffer } from 'node:buffer';
import process from 'node:process';
import { Readable, type ReadableOptions } from 'node:stream';
import { SILENCE_FRAME } from '../audio/AudioPlayer';

/**
 * The different behaviors an audio receive stream can have for deciding when to end.
 */
export enum EndBehaviorType {
	/**
	 * The stream will only end when manually destroyed.
	 */
	Manual,

	/**
	 * The stream will end after a given time period of silence/no audio packets.
	 */
	AfterSilence,

	/**
	 * The stream will end after a given time period of no audio packets.
	 */
	AfterInactivity,
}

export type EndBehavior =
	| {
			behavior: EndBehaviorType.AfterInactivity | EndBehaviorType.AfterSilence;
			duration: number;
	  }
	| {
			behavior: EndBehaviorType.Manual;
	  };

export interface AudioReceiveStreamOptions extends ReadableOptions {
	end: EndBehavior;
}

/**
 * An audio packet containing encoded Opus payload data and key RTP Header metadata.
 */
export class AudioPacket {
	/**
	 * Encoded Opus payload data.
	 */
	public readonly payload: Buffer;

	/**
	 * RTP sequence number of this packet (16-bit, wraps at 65535).
	 */
	public readonly sequence: number;

	/**
	 * RTP synchronization source identifier for this packet (32-bit).
	 * A change in SSRC indicates a new RTP stream, so any associated
	 * decoder should be reset.
	 */
	public readonly ssrc: number;

	/**
	 * RTP timestamp of this packet (32-bit, wraps at 2^32 - 1, 48kHz clock).
	 */
	public readonly timestamp: number;

	/**
	 * Construct a new AudioPacket.
	 *
	 * @param payload - Opus payload
	 * @param sequence - RTP Sequence Number
	 * @param timestamp - RTP Timestamp
	 * @param ssrc - RTP Synchronization Source Identifier
	 */
	public constructor(payload: Buffer, sequence: number, timestamp: number, ssrc: number) {
		this.payload = payload;
		this.sequence = sequence;
		this.timestamp = timestamp;
		this.ssrc = ssrc;
	}
}

export function createDefaultAudioReceiveStreamOptions(): AudioReceiveStreamOptions {
	return {
		end: {
			behavior: EndBehaviorType.Manual,
		},
	};
}

/**
 * A readable stream of Opus packets received from a specific entity
 * in a Discord voice connection.
 */
export class AudioReceiveStream extends Readable {
	/**
	 * The end behavior of the receive stream.
	 */
	public readonly end: EndBehavior;

	private endTimeout?: NodeJS.Timeout;

	public constructor(options: AudioReceiveStreamOptions) {
		const { end, ...rest } = options;

		super({
			...rest,
			objectMode: true,
		});

		this.end = end;
	}

	public override push(packet: AudioPacket | null) {
		if (
			packet &&
			(this.end.behavior === EndBehaviorType.AfterInactivity ||
				(this.end.behavior === EndBehaviorType.AfterSilence &&
					(packet.payload.compare(SILENCE_FRAME) !== 0 || this.endTimeout === undefined)))
		) {
			this.renewEndTimeout(this.end);
		}

		if (packet === null) {
			// null marks EOF for stream
			process.nextTick(() => this.destroy());
		}

		return super.push(packet);
	}

	private renewEndTimeout(end: EndBehavior & { duration: number }) {
		if (this.endTimeout) {
			clearTimeout(this.endTimeout);
		}

		this.endTimeout = setTimeout(() => this.push(null), end.duration);
	}

	public override _read() {}
}
