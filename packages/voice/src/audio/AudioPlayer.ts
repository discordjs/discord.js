/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
import { TypedEmitter } from 'tiny-typed-emitter';
import { AudioPlayerError } from './AudioPlayerError';
import type { AudioResource } from './AudioResource';
import { PlayerSubscription } from './PlayerSubscription';
import { addAudioPlayer, deleteAudioPlayer } from '../DataStore';
import { VoiceConnection, VoiceConnectionStatus } from '../VoiceConnection';
import { Awaited, noop } from '../util/util';

// The Opus "silent" frame
export const SILENCE_FRAME = Buffer.from([0xf8, 0xff, 0xfe]);

/**
 * Describes the behavior of the player when an audio packet is played but there are no available
 * voice connections to play to.
 */
export enum NoSubscriberBehavior {
	/**
	 * Pauses playing the stream until a voice connection becomes available.
	 */
	Pause = 'pause',

	/**
	 * Continues to play through the resource regardless.
	 */
	Play = 'play',

	/**
	 * The player stops and enters the Idle state.
	 */
	Stop = 'stop',
}

export enum AudioPlayerStatus {
	/**
	 * When there is currently no resource for the player to be playing.
	 */
	Idle = 'idle',

	/**
	 * When the player is waiting for an audio resource to become readable before transitioning to Playing.
	 */
	Buffering = 'buffering',

	/**
	 * When the player has been manually paused.
	 */
	Paused = 'paused',

	/**
	 * When the player is actively playing an audio resource.
	 */
	Playing = 'playing',

	/**
	 * When the player has paused itself. Only possible with the "pause" no subscriber behavior.
	 */
	AutoPaused = 'autopaused',
}

/**
 * Options that can be passed when creating an audio player, used to specify its behavior.
 */
export interface CreateAudioPlayerOptions {
	debug?: boolean;
	behaviors?: {
		noSubscriber?: NoSubscriberBehavior;
		maxMissedFrames?: number;
	};
}

/**
 * The state that an AudioPlayer is in when it has no resource to play. This is the starting state.
 */
export interface AudioPlayerIdleState {
	status: AudioPlayerStatus.Idle;
}

/**
 * The state that an AudioPlayer is in when it is waiting for a resource to become readable. Once this
 * happens, the AudioPlayer will enter the Playing state. If the resource ends/errors before this, then
 * it will re-enter the Idle state.
 */
export interface AudioPlayerBufferingState {
	status: AudioPlayerStatus.Buffering;
	/**
	 * The resource that the AudioPlayer is waiting for
	 */
	resource: AudioResource;
	onReadableCallback: () => void;
	onFailureCallback: () => void;
	onStreamError: (error: Error) => void;
}

/**
 * The state that an AudioPlayer is in when it is actively playing an AudioResource. When playback ends,
 * it will enter the Idle state.
 */
export interface AudioPlayerPlayingState {
	status: AudioPlayerStatus.Playing;
	/**
	 * The number of consecutive times that the audio resource has been unable to provide an Opus frame.
	 */
	missedFrames: number;

	/**
	 * The playback duration in milliseconds of the current audio resource. This includes filler silence packets
	 * that have been played when the resource was buffering.
	 */
	playbackDuration: number;

	/**
	 * The resource that is being played.
	 */
	resource: AudioResource;

	onStreamError: (error: Error) => void;
}

/**
 * The state that an AudioPlayer is in when it has either been explicitly paused by the user, or done
 * automatically by the AudioPlayer itself if there are no available subscribers.
 */
export interface AudioPlayerPausedState {
	status: AudioPlayerStatus.Paused | AudioPlayerStatus.AutoPaused;
	/**
	 * How many silence packets still need to be played to avoid audio interpolation due to the stream suddenly pausing.
	 */
	silencePacketsRemaining: number;

	/**
	 * The playback duration in milliseconds of the current audio resource. This includes filler silence packets
	 * that have been played when the resource was buffering.
	 */
	playbackDuration: number;

	/**
	 * The current resource of the audio player.
	 */
	resource: AudioResource;

	onStreamError: (error: Error) => void;
}

/**
 * The various states that the player can be in.
 */
export type AudioPlayerState =
	| AudioPlayerIdleState
	| AudioPlayerBufferingState
	| AudioPlayerPlayingState
	| AudioPlayerPausedState;

export type AudioPlayerEvents = {
	error: (error: AudioPlayerError) => Awaited<void>;
	debug: (message: string) => Awaited<void>;
	stateChange: (oldState: AudioPlayerState, newState: AudioPlayerState) => Awaited<void>;
	subscribe: (subscription: PlayerSubscription) => Awaited<void>;
	unsubscribe: (subscription: PlayerSubscription) => Awaited<void>;
} & {
	[status in AudioPlayerStatus]: (
		oldState: AudioPlayerState,
		newState: AudioPlayerState & { status: status },
	) => Awaited<void>;
};

/**
 * Stringifies an AudioPlayerState instance.
 *
 * @param state - The state to stringify
 */
function stringifyState(state: AudioPlayerState) {
	return JSON.stringify({
		...state,
		resource: Reflect.has(state, 'resource'),
		stepTimeout: Reflect.has(state, 'stepTimeout'),
	});
}

/**
 * Used to play audio resources (i.e. tracks, streams) to voice connections.
 *
 * @remarks
 * Audio players are designed to be re-used - even if a resource has finished playing, the player itself
 * can still be used.
 *
 * The AudioPlayer drives the timing of playback, and therefore is unaffected by voice connections
 * becoming unavailable. Its behavior in these scenarios can be configured.
 */
export class AudioPlayer extends TypedEmitter<AudioPlayerEvents> {
	/**
	 * The state that the AudioPlayer is in.
	 */
	private _state: AudioPlayerState;

	/**
	 * A list of VoiceConnections that are registered to this AudioPlayer. The player will attempt to play audio
	 * to the streams in this list.
	 */
	private readonly subscribers: PlayerSubscription[] = [];

	/**
	 * The behavior that the player should follow when it enters certain situations.
	 */
	private readonly behaviors: {
		noSubscriber: NoSubscriberBehavior;
		maxMissedFrames: number;
	};

	/**
	 * The debug logger function, if debugging is enabled.
	 */
	private readonly debug: null | ((message: string) => void);

	/**
	 * Creates a new AudioPlayer.
	 */
	public constructor(options: CreateAudioPlayerOptions = {}) {
		super();
		this._state = { status: AudioPlayerStatus.Idle };
		this.behaviors = {
			noSubscriber: NoSubscriberBehavior.Pause,
			maxMissedFrames: 5,
			...options.behaviors,
		};
		this.debug = options.debug === false ? null : (message: string) => this.emit('debug', message);
	}

	/**
	 * A list of subscribed voice connections that can currently receive audio to play.
	 */
	public get playable() {
		return this.subscribers
			.filter(({ connection }) => connection.state.status === VoiceConnectionStatus.Ready)
			.map(({ connection }) => connection);
	}

	/**
	 * Subscribes a VoiceConnection to the audio player's play list. If the VoiceConnection is already subscribed,
	 * then the existing subscription is used.
	 *
	 * @remarks
	 * This method should not be directly called. Instead, use VoiceConnection#subscribe.
	 *
	 * @param connection - The connection to subscribe
	 *
	 * @returns The new subscription if the voice connection is not yet subscribed, otherwise the existing subscription
	 */
	// @ts-ignore
	private subscribe(connection: VoiceConnection) {
		const existingSubscription = this.subscribers.find((subscription) => subscription.connection === connection);
		if (!existingSubscription) {
			const subscription = new PlayerSubscription(connection, this);
			this.subscribers.push(subscription);
			setImmediate(() => this.emit('subscribe', subscription));
			return subscription;
		}
		return existingSubscription;
	}

	/**
	 * Unsubscribes a subscription - i.e. removes a voice connection from the play list of the audio player.
	 *
	 * @remarks
	 * This method should not be directly called. Instead, use PlayerSubscription#unsubscribe.
	 *
	 * @param subscription - The subscription to remove
	 *
	 * @returns Whether or not the subscription existed on the player and was removed
	 */
	// @ts-ignore
	private unsubscribe(subscription: PlayerSubscription) {
		const index = this.subscribers.indexOf(subscription);
		const exists = index !== -1;
		if (exists) {
			this.subscribers.splice(index, 1);
			subscription.connection.setSpeaking(false);
			this.emit('unsubscribe', subscription);
		}
		return exists;
	}

	/**
	 * The state that the player is in.
	 */
	public get state() {
		return this._state;
	}

	/**
	 * Sets a new state for the player, performing clean-up operations where necessary.
	 */
	public set state(newState: AudioPlayerState) {
		const oldState = this._state;
		const newResource = Reflect.get(newState, 'resource') as AudioResource | undefined;

		if (oldState.status !== AudioPlayerStatus.Idle && oldState.resource !== newResource) {
			oldState.resource.playStream.on('error', noop);
			oldState.resource.playStream.off('error', oldState.onStreamError);
			oldState.resource.audioPlayer = undefined;
			oldState.resource.playStream.destroy();
			oldState.resource.playStream.read(); // required to ensure buffered data is drained, prevents memory leak
		}

		// When leaving the Buffering state (or buffering a new resource), then remove the event listeners from it
		if (
			oldState.status === AudioPlayerStatus.Buffering &&
			(newState.status !== AudioPlayerStatus.Buffering || newState.resource !== oldState.resource)
		) {
			oldState.resource.playStream.off('end', oldState.onFailureCallback);
			oldState.resource.playStream.off('close', oldState.onFailureCallback);
			oldState.resource.playStream.off('finish', oldState.onFailureCallback);
			oldState.resource.playStream.off('readable', oldState.onReadableCallback);
		}

		// transitioning into an idle should ensure that connections stop speaking
		if (newState.status === AudioPlayerStatus.Idle) {
			this._signalStopSpeaking();
			deleteAudioPlayer(this);
		}

		// attach to the global audio player timer
		if (newResource) {
			addAudioPlayer(this);
		}

		// playing -> playing state changes should still transition if a resource changed (seems like it would be useful!)
		const didChangeResources =
			oldState.status !== AudioPlayerStatus.Idle &&
			newState.status === AudioPlayerStatus.Playing &&
			oldState.resource !== newState.resource;

		this._state = newState;

		this.emit('stateChange', oldState, this._state);
		if (oldState.status !== newState.status || didChangeResources) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			this.emit(newState.status, oldState, this._state as any);
		}
		this.debug?.(`state change:\nfrom ${stringifyState(oldState)}\nto ${stringifyState(newState)}`);
	}

	/**
	 * Plays a new resource on the player. If the player is already playing a resource, the existing resource is destroyed
	 * (it cannot be reused, even in another player) and is replaced with the new resource.
	 *
	 * @remarks
	 * The player will transition to the Playing state once playback begins, and will return to the Idle state once
	 * playback is ended.
	 *
	 * If the player was previously playing a resource and this method is called, the player will not transition to the
	 * Idle state during the swap over.
	 *
	 * @param resource - The resource to play
	 *
	 * @throws Will throw if attempting to play an audio resource that has already ended, or is being played by another player
	 */
	public play<T>(resource: AudioResource<T>) {
		if (resource.ended) {
			throw new Error('Cannot play a resource that has already ended.');
		}

		if (resource.audioPlayer) {
			if (resource.audioPlayer === this) {
				return;
			}
			throw new Error('Resource is already being played by another audio player.');
		}
		resource.audioPlayer = this;

		// Attach error listeners to the stream that will propagate the error and then return to the Idle
		// state if the resource is still being used.
		const onStreamError = (error: Error) => {
			if (this.state.status !== AudioPlayerStatus.Idle) {
				/**
				 * Emitted when there is an error emitted from the audio resource played by the audio player
				 *
				 * @event AudioPlayer#error
				 * @type {AudioPlayerError}
				 */
				this.emit('error', new AudioPlayerError(error, this.state.resource));
			}

			if (this.state.status !== AudioPlayerStatus.Idle && this.state.resource === resource) {
				this.state = {
					status: AudioPlayerStatus.Idle,
				};
			}
		};

		resource.playStream.once('error', onStreamError);

		if (resource.started) {
			this.state = {
				status: AudioPlayerStatus.Playing,
				missedFrames: 0,
				playbackDuration: 0,
				resource,
				onStreamError,
			};
		} else {
			const onReadableCallback = () => {
				if (this.state.status === AudioPlayerStatus.Buffering && this.state.resource === resource) {
					this.state = {
						status: AudioPlayerStatus.Playing,
						missedFrames: 0,
						playbackDuration: 0,
						resource,
						onStreamError,
					};
				}
			};

			const onFailureCallback = () => {
				if (this.state.status === AudioPlayerStatus.Buffering && this.state.resource === resource) {
					this.state = {
						status: AudioPlayerStatus.Idle,
					};
				}
			};

			resource.playStream.once('readable', onReadableCallback);

			resource.playStream.once('end', onFailureCallback);
			resource.playStream.once('close', onFailureCallback);
			resource.playStream.once('finish', onFailureCallback);

			this.state = {
				status: AudioPlayerStatus.Buffering,
				resource,
				onReadableCallback,
				onFailureCallback,
				onStreamError,
			};
		}
	}

	/**
	 * Pauses playback of the current resource, if any.
	 *
	 * @param interpolateSilence - If true, the player will play 5 packets of silence after pausing to prevent audio glitches
	 *
	 * @returns `true` if the player was successfully paused, otherwise `false`
	 */
	public pause(interpolateSilence = true) {
		if (this.state.status !== AudioPlayerStatus.Playing) return false;
		this.state = {
			...this.state,
			status: AudioPlayerStatus.Paused,
			silencePacketsRemaining: interpolateSilence ? 5 : 0,
		};
		return true;
	}

	/**
	 * Unpauses playback of the current resource, if any.
	 *
	 * @returns `true` if the player was successfully unpaused, otherwise `false`
	 */
	public unpause() {
		if (this.state.status !== AudioPlayerStatus.Paused) return false;
		this.state = {
			...this.state,
			status: AudioPlayerStatus.Playing,
			missedFrames: 0,
		};
		return true;
	}

	/**
	 * Stops playback of the current resource and destroys the resource. The player will either transition to the Idle state,
	 * or remain in its current state until the silence padding frames of the resource have been played.
	 *
	 * @param force - If true, will force the player to enter the Idle state even if the resource has silence padding frames
	 *
	 * @returns `true` if the player will come to a stop, otherwise `false`
	 */
	public stop(force = false) {
		if (this.state.status === AudioPlayerStatus.Idle) return false;
		if (force || this.state.resource.silencePaddingFrames === 0) {
			this.state = {
				status: AudioPlayerStatus.Idle,
			};
		} else if (this.state.resource.silenceRemaining === -1) {
			this.state.resource.silenceRemaining = this.state.resource.silencePaddingFrames;
		}
		return true;
	}

	/**
	 * Checks whether the underlying resource (if any) is playable (readable)
	 *
	 * @returns `true` if the resource is playable, otherwise `false`
	 */
	public checkPlayable() {
		const state = this._state;
		if (state.status === AudioPlayerStatus.Idle || state.status === AudioPlayerStatus.Buffering) return false;

		// If the stream has been destroyed or is no longer readable, then transition to the Idle state.
		if (!state.resource.readable) {
			this.state = {
				status: AudioPlayerStatus.Idle,
			};
			return false;
		}
		return true;
	}

	/**
	 * Called roughly every 20ms by the global audio player timer. Dispatches any audio packets that are buffered
	 * by the active connections of this audio player.
	 */
	// @ts-ignore
	private _stepDispatch() {
		const state = this._state;

		// Guard against the Idle state
		if (state.status === AudioPlayerStatus.Idle || state.status === AudioPlayerStatus.Buffering) return;

		// Dispatch any audio packets that were prepared in the previous cycle
		this.playable.forEach((connection) => connection.dispatchAudio());
	}

	/**
	 * Called roughly every 20ms by the global audio player timer. Attempts to read an audio packet from the
	 * underlying resource of the stream, and then has all the active connections of the audio player prepare it
	 * (encrypt it, append header data) so that it is ready to play at the start of the next cycle.
	 */
	// @ts-ignore
	private _stepPrepare() {
		const state = this._state;

		// Guard against the Idle state
		if (state.status === AudioPlayerStatus.Idle || state.status === AudioPlayerStatus.Buffering) return;

		// List of connections that can receive the packet
		const playable = this.playable;

		/* If the player was previously in the AutoPaused state, check to see whether there are newly available
		   connections, allowing us to transition out of the AutoPaused state back into the Playing state */
		if (state.status === AudioPlayerStatus.AutoPaused && playable.length > 0) {
			this.state = {
				...state,
				status: AudioPlayerStatus.Playing,
				missedFrames: 0,
			};
		}

		/* If the player is (auto)paused, check to see whether silence packets should be played and
		   set a timeout to begin the next cycle, ending the current cycle here. */
		if (state.status === AudioPlayerStatus.Paused || state.status === AudioPlayerStatus.AutoPaused) {
			if (state.silencePacketsRemaining > 0) {
				state.silencePacketsRemaining--;
				this._preparePacket(SILENCE_FRAME, playable, state);
				if (state.silencePacketsRemaining === 0) {
					this._signalStopSpeaking();
				}
			}
			return;
		}

		// If there are no available connections in this cycle, observe the configured "no subscriber" behavior.
		if (playable.length === 0) {
			if (this.behaviors.noSubscriber === NoSubscriberBehavior.Pause) {
				this.state = {
					...state,
					status: AudioPlayerStatus.AutoPaused,
					silencePacketsRemaining: 5,
				};
				return;
			} else if (this.behaviors.noSubscriber === NoSubscriberBehavior.Stop) {
				this.stop(true);
			}
		}

		/**
		 * Attempt to read an Opus packet from the resource. If there isn't an available packet,
		 * play a silence packet. If there are 5 consecutive cycles with failed reads, then the
		 * playback will end.
		 */
		const packet: Buffer | null = state.resource.read();

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (state.status === AudioPlayerStatus.Playing) {
			if (packet) {
				this._preparePacket(packet, playable, state);
				state.missedFrames = 0;
			} else {
				this._preparePacket(SILENCE_FRAME, playable, state);
				state.missedFrames++;
				if (state.missedFrames >= this.behaviors.maxMissedFrames) {
					this.stop();
				}
			}
		}
	}

	/**
	 * Signals to all the subscribed connections that they should send a packet to Discord indicating
	 * they are no longer speaking. Called once playback of a resource ends.
	 */
	private _signalStopSpeaking() {
		return this.subscribers.forEach(({ connection }) => connection.setSpeaking(false));
	}

	/**
	 * Instructs the given connections to each prepare this packet to be played at the start of the
	 * next cycle.
	 *
	 * @param packet - The Opus packet to be prepared by each receiver
	 * @param receivers - The connections that should play this packet
	 */
	private _preparePacket(
		packet: Buffer,
		receivers: VoiceConnection[],
		state: AudioPlayerPlayingState | AudioPlayerPausedState,
	) {
		state.playbackDuration += 20;
		receivers.forEach((connection) => connection.prepareAudioPacket(packet));
	}
}

/**
 * Creates a new AudioPlayer to be used.
 */
export function createAudioPlayer(options?: CreateAudioPlayerOptions) {
	return new AudioPlayer(options);
}
