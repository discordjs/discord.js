import type { Buffer } from 'node:buffer';
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

	public constructor({ end, ...options }: AudioReceiveStreamOptions) {
		super({
			...options,
			objectMode: true,
		});

		this.end = end;
	}

	public override push(buffer: Buffer | null) {
		if (
			buffer &&
			(this.end.behavior === EndBehaviorType.AfterInactivity ||
				(this.end.behavior === EndBehaviorType.AfterSilence &&
					(buffer.compare(SILENCE_FRAME) !== 0 || typeof this.endTimeout === 'undefined')))
		) {
			this.renewEndTimeout(this.end);
		}

		return super.push(buffer);
	}

	private renewEndTimeout(end: EndBehavior & { duration: number }) {
		if (this.endTimeout) {
			clearTimeout(this.endTimeout);
		}

		this.endTimeout = setTimeout(() => this.push(null), end.duration);
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	public override _read() {}
}
