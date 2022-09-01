/* eslint-disable @typescript-eslint/method-signature-style, @typescript-eslint/unified-signatures */
import { EventEmitter } from 'node:events';
import { clearTimeout, setTimeout } from 'node:timers';

export interface SpeakingMap extends EventEmitter {
	/**
	 * Emitted when a user starts speaking.
	 *
	 * @eventProperty
	 */
	on(event: 'start', listener: (userId: string) => void): this;

	/**
	 * Emitted when a user ends speaking.
	 *
	 * @eventProperty
	 */
	on(event: 'end', listener: (userId: string) => void): this;
}

/**
 * Tracks the speaking states of users in a voice channel.
 */
export class SpeakingMap extends EventEmitter {
	/**
	 * The delay after a packet is received from a user until they're marked as not speaking anymore.
	 */
	public static readonly DELAY = 100;

	/**
	 * The currently speaking users, mapped to the milliseconds since UNIX epoch at which they started speaking.
	 */
	public readonly users: Map<string, number>;

	private readonly speakingTimeouts: Map<string, NodeJS.Timeout>;

	public constructor() {
		super();
		this.users = new Map();
		this.speakingTimeouts = new Map();
	}

	public onPacket(userId: string) {
		const timeout = this.speakingTimeouts.get(userId);
		if (timeout) {
			clearTimeout(timeout);
		} else {
			this.users.set(userId, Date.now());
			this.emit('start', userId);
		}

		this.startTimeout(userId);
	}

	private startTimeout(userId: string) {
		this.speakingTimeouts.set(
			userId,
			setTimeout(() => {
				this.emit('end', userId);
				this.speakingTimeouts.delete(userId);
				this.users.delete(userId);
			}, SpeakingMap.DELAY),
		);
	}
}
