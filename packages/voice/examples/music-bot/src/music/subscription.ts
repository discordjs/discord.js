import {
	AudioPlayer,
	AudioPlayerStatus,
	AudioResource,
	createAudioPlayer,
	entersState,
	VoiceConnection,
	VoiceConnectionDisconnectReason,
	VoiceConnectionStatus,
} from '@discordjs/voice';
import type { Track } from './track';
import { promisify } from 'node:util';

const wait = promisify(setTimeout);

/**
 * A MusicSubscription exists for each active VoiceConnection. Each subscription has its own audio player and queue,
 * and it also attaches logic to the audio player and voice connection for error handling and reconnection logic.
 */
export class MusicSubscription {
	public readonly voiceConnection: VoiceConnection;
	public readonly audioPlayer: AudioPlayer;
	public queue: Track[];
	public queueLock = false;
	public readyLock = false;

	public constructor(voiceConnection: VoiceConnection) {
		this.voiceConnection = voiceConnection;
		this.audioPlayer = createAudioPlayer();
		this.queue = [];

		this.voiceConnection.on(
			'stateChange',
			async (_: any, newState: { status: any; reason: any; closeCode: number }) => {
				if (newState.status === VoiceConnectionStatus.Disconnected) {
					if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
						/**
						 * If the WebSocket closed with a 4014 code, this means that we should not manually attempt to reconnect,
						 * but there is a chance the connection will recover itself if the reason of the disconnect was due to
						 * switching voice channels. This is also the same code for the bot being kicked from the voice channel,
						 * so we allow 5 seconds to figure out which scenario it is. If the bot has been kicked, we should destroy
						 * the voice connection.
						 */
						try {
							await entersState(this.voiceConnection, VoiceConnectionStatus.Connecting, 5_000);
							// Probably moved voice channel
						} catch {
							this.voiceConnection.destroy();
							// Probably removed from voice channel
						}
					} else if (this.voiceConnection.rejoinAttempts < 5) {
						/**
						 * The disconnect in this case is recoverable, and we also have <5 repeated attempts so we will reconnect.
						 */
						await wait((this.voiceConnection.rejoinAttempts + 1) * 5_000);
						this.voiceConnection.rejoin();
					} else {
						/**
						 * The disconnect in this case may be recoverable, but we have no more remaining attempts - destroy.
						 */
						this.voiceConnection.destroy();
					}
				} else if (newState.status === VoiceConnectionStatus.Destroyed) {
					/**
					 * Once destroyed, stop the subscription.
					 */
					this.stop();
				} else if (
					!this.readyLock &&
					(newState.status === VoiceConnectionStatus.Connecting || newState.status === VoiceConnectionStatus.Signalling)
				) {
					/**
					 * In the Signalling or Connecting states, we set a 20 second time limit for the connection to become ready
					 * before destroying the voice connection. This stops the voice connection permanently existing in one of these
					 * states.
					 */
					this.readyLock = true;
					try {
						await entersState(this.voiceConnection, VoiceConnectionStatus.Ready, 20_000);
					} catch {
						if (this.voiceConnection.state.status !== VoiceConnectionStatus.Destroyed) this.voiceConnection.destroy();
					} finally {
						this.readyLock = false;
					}
				}
			},
		);

		// Configure audio player
		this.audioPlayer.on(
			'stateChange',
			(oldState: { status: any; resource: any }, newState: { status: any; resource: any }) => {
				if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
					// If the Idle state is entered from a non-Idle state, it means that an audio resource has finished playing.
					// The queue is then processed to start playing the next track, if one is available.
					(oldState.resource as AudioResource<Track>).metadata.onFinish();
					void this.processQueue();
				} else if (newState.status === AudioPlayerStatus.Playing) {
					// If the Playing state has been entered, then a new track has started playback.
					(newState.resource as AudioResource<Track>).metadata.onStart();
				}
			},
		);

		this.audioPlayer.on('error', (error: { resource: any }) =>
			(error.resource as AudioResource<Track>).metadata.onError(error),
		);

		voiceConnection.subscribe(this.audioPlayer);
	}

	/**
	 * Adds a new Track to the queue.
	 *
	 * @param track The track to add to the queue
	 */
	public enqueue(track: Track) {
		this.queue.push(track);
		void this.processQueue();
	}

	/**
	 * Stops audio playback and empties the queue.
	 */
	public stop() {
		this.queueLock = true;
		this.queue = [];
		this.audioPlayer.stop(true);
	}

	/**
	 * Attempts to play a Track from the queue.
	 */
	private async processQueue(): Promise<void> {
		// If the queue is locked (already being processed), is empty, or the audio player is already playing something, return
		if (this.queueLock || this.audioPlayer.state.status !== AudioPlayerStatus.Idle || this.queue.length === 0) {
			return;
		}
		// Lock the queue to guarantee safe access
		this.queueLock = true;

		// Take the first item from the queue. This is guaranteed to exist due to the non-empty check above.
		const nextTrack = this.queue.shift()!;
		try {
			// Attempt to convert the Track into an AudioResource (i.e. start streaming the video)
			const resource = await nextTrack.createAudioResource();
			this.audioPlayer.play(resource);
			this.queueLock = false;
		} catch (error) {
			// If an error occurred, try the next item of the queue instead
			nextTrack.onError(error as Error);
			this.queueLock = false;
			return this.processQueue();
		}
	}
}
