import { EventEmitter } from 'node:events';

/**
 * The known data for a user in a Discord voice connection.
 */
export interface VoiceUserData {
	/**
	 * The SSRC of the user's audio stream.
	 */
	audioSSRC: number;

	/**
	 * The SSRC of the user's video stream (if one exists)
	 * Cannot be 0. If undefined, the user has no video stream.
	 */
	videoSSRC?: number;

	/**
	 * The Discord user id of the user.
	 */
	userId: string;
}

/**
 * Maps audio SSRCs to data of users in voice connections.
 */
export class SSRCMap extends EventEmitter {
	/**
	 * The underlying map.
	 */
	private readonly map: Map<number, VoiceUserData>;

	public constructor() {
		super();
		this.map = new Map();
	}

	/**
	 * Updates the map with new user data
	 *
	 * @param data The data to update with
	 */
	public update(data: VoiceUserData) {
		const existing = this.map.get(data.audioSSRC);

		const newValue = {
			...this.map.get(data.audioSSRC),
			...data,
		};

		this.map.set(data.audioSSRC, newValue);
		if (!existing) this.emit('create', newValue);
		this.emit('update', existing, newValue);
	}

	/**
	 * Gets the stored voice data of a user.
	 *
	 * @param target The target, either their user id or audio SSRC
	 */
	public get(target: number | string) {
		if (typeof target === 'number') {
			return this.map.get(target);
		}

		for (const data of this.map.values()) {
			if (data.userId === target) {
				return data;
			}
		}

		return undefined;
	}

	/**
	 * Deletes the stored voice data about a user.
	 *
	 * @param target The target of the delete operation, either their audio SSRC or user id
	 *
	 * @returns The data that was deleted, if any
	 */
	public delete(target: number | string) {
		if (typeof target === 'number') {
			const existing = this.map.get(target);
			if (existing) {
				this.map.delete(target);
				this.emit('delete', existing);
			}
			return existing;
		}

		for (const [audioSSRC, data] of this.map.entries()) {
			if (data.userId === target) {
				this.map.delete(audioSSRC);
				this.emit('delete', data);
				return data;
			}
		}

		return undefined;
	}
}
