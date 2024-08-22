/* eslint-disable @typescript-eslint/dot-notation */
import type { VoiceConnection } from '../VoiceConnection';
import type { AudioPlayer } from './AudioPlayer';

/**
 * Represents a subscription of a voice connection to an audio player, allowing
 * the audio player to play audio on the voice connection.
 */
export class PlayerSubscription {
	/**
	 * The voice connection of this subscription.
	 */
	public readonly connection: VoiceConnection;

	/**
	 * The audio player of this subscription.
	 */
	public readonly player: AudioPlayer;

	public constructor(connection: VoiceConnection, player: AudioPlayer) {
		this.connection = connection;
		this.player = player;
	}

	/**
	 * Unsubscribes the connection from the audio player, meaning that the
	 * audio player cannot stream audio to it until a new subscription is made.
	 */
	public unsubscribe() {
		this.connection['onSubscriptionRemoved'](this);
		this.player['unsubscribe'](this);
	}
}
