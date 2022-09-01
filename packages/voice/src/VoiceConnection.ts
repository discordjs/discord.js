/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable jsdoc/check-param-names */
/* eslint-disable @typescript-eslint/method-signature-style */
import type { Buffer } from 'node:buffer';
import { EventEmitter } from 'node:events';
import type { GatewayVoiceServerUpdateDispatchData, GatewayVoiceStateUpdateDispatchData } from 'discord-api-types/v10';
import type { JoinConfig } from './DataStore';
import {
	getVoiceConnection,
	createJoinVoiceChannelPayload,
	trackVoiceConnection,
	untrackVoiceConnection,
} from './DataStore.js';
import type { AudioPlayer } from './audio/AudioPlayer';
import type { PlayerSubscription } from './audio/PlayerSubscription';
import type { VoiceWebSocket, VoiceUDPSocket } from './networking';
import type { NetworkingState } from './networking/Networking';
import { Networking, NetworkingStatusCode } from './networking/Networking.js';
import { VoiceReceiver } from './receive/index.js';
import type { DiscordGatewayAdapterImplementerMethods } from './util/adapter';
import { noop } from './util/util.js';
import type { CreateVoiceConnectionOptions } from '.';

/**
 * The various status codes a voice connection can hold at any one time.
 */
export enum VoiceConnectionStatus {
	/**
	 * The `VOICE_SERVER_UPDATE` and `VOICE_STATE_UPDATE` packets have been received, now attempting to establish a voice connection.
	 */
	Connecting = 'connecting',

	/**
	 * The voice connection has been destroyed and untracked, it cannot be reused.
	 */
	Destroyed = 'destroyed',

	/**
	 * The voice connection has either been severed or not established.
	 */
	Disconnected = 'disconnected',

	/**
	 * A voice connection has been established, and is ready to be used.
	 */
	Ready = 'ready',

	/**
	 * Sending a packet to the main Discord gateway to indicate we want to change our voice state.
	 */
	Signalling = 'signalling',
}

/**
 * The state that a VoiceConnection will be in when it is waiting to receive a VOICE_SERVER_UPDATE and
 * VOICE_STATE_UPDATE packet from Discord, provided by the adapter.
 */
export interface VoiceConnectionSignallingState {
	adapter: DiscordGatewayAdapterImplementerMethods;
	status: VoiceConnectionStatus.Signalling;
	subscription?: PlayerSubscription | undefined;
}

/**
 * The reasons a voice connection can be in the disconnected state.
 */
export enum VoiceConnectionDisconnectReason {
	/**
	 * When the WebSocket connection has been closed.
	 */
	WebSocketClose,

	/**
	 * When the adapter was unable to send a message requested by the VoiceConnection.
	 */
	AdapterUnavailable,

	/**
	 * When a VOICE_SERVER_UPDATE packet is received with a null endpoint, causing the connection to be severed.
	 */
	EndpointRemoved,

	/**
	 * When a manual disconnect was requested.
	 */
	Manual,
}

/**
 * The state that a VoiceConnection will be in when it is not connected to a Discord voice server nor is
 * it attempting to connect. You can manually attempt to reconnect using VoiceConnection#reconnect.
 */
export interface VoiceConnectionDisconnectedBaseState {
	adapter: DiscordGatewayAdapterImplementerMethods;
	status: VoiceConnectionStatus.Disconnected;
	subscription?: PlayerSubscription | undefined;
}

/**
 * The state that a VoiceConnection will be in when it is not connected to a Discord voice server nor is
 * it attempting to connect. You can manually attempt to reconnect using VoiceConnection#reconnect.
 */
export interface VoiceConnectionDisconnectedOtherState extends VoiceConnectionDisconnectedBaseState {
	reason: Exclude<VoiceConnectionDisconnectReason, VoiceConnectionDisconnectReason.WebSocketClose>;
}

/**
 * The state that a VoiceConnection will be in when its WebSocket connection was closed.
 * You can manually attempt to reconnect using VoiceConnection#reconnect.
 */
export interface VoiceConnectionDisconnectedWebSocketState extends VoiceConnectionDisconnectedBaseState {
	/**
	 * The close code of the WebSocket connection to the Discord voice server.
	 */
	closeCode: number;

	reason: VoiceConnectionDisconnectReason.WebSocketClose;
}

/**
 * The states that a VoiceConnection can be in when it is not connected to a Discord voice server nor is
 * it attempting to connect. You can manually attempt to connect using VoiceConnection#reconnect.
 */
export type VoiceConnectionDisconnectedState =
	| VoiceConnectionDisconnectedOtherState
	| VoiceConnectionDisconnectedWebSocketState;

/**
 * The state that a VoiceConnection will be in when it is establishing a connection to a Discord
 * voice server.
 */
export interface VoiceConnectionConnectingState {
	adapter: DiscordGatewayAdapterImplementerMethods;
	networking: Networking;
	status: VoiceConnectionStatus.Connecting;
	subscription?: PlayerSubscription | undefined;
}

/**
 * The state that a VoiceConnection will be in when it has an active connection to a Discord
 * voice server.
 */
export interface VoiceConnectionReadyState {
	adapter: DiscordGatewayAdapterImplementerMethods;
	networking: Networking;
	status: VoiceConnectionStatus.Ready;
	subscription?: PlayerSubscription | undefined;
}

/**
 * The state that a VoiceConnection will be in when it has been permanently been destroyed by the
 * user and untracked by the library. It cannot be reconnected, instead, a new VoiceConnection
 * needs to be established.
 */
export interface VoiceConnectionDestroyedState {
	status: VoiceConnectionStatus.Destroyed;
}

/**
 * The various states that a voice connection can be in.
 */
export type VoiceConnectionState =
	| VoiceConnectionConnectingState
	| VoiceConnectionDestroyedState
	| VoiceConnectionDisconnectedState
	| VoiceConnectionReadyState
	| VoiceConnectionSignallingState;

export interface VoiceConnection extends EventEmitter {
	/**
	 * Emitted when there is an error emitted from the voice connection
	 *
	 * @eventProperty
	 */
	on(event: 'error', listener: (error: Error) => void): this;
	/**
	 * Emitted debugging information about the voice connection
	 *
	 * @eventProperty
	 */
	on(event: 'debug', listener: (message: string) => void): this;
	/**
	 * Emitted when the state of the voice connection changes
	 *
	 * @eventProperty
	 */
	on(event: 'stateChange', listener: (oldState: VoiceConnectionState, newState: VoiceConnectionState) => void): this;
	/**
	 * Emitted when the state of the voice connection changes to a specific status
	 *
	 * @eventProperty
	 */
	on<T extends VoiceConnectionStatus>(
		event: T,
		listener: (oldState: VoiceConnectionState, newState: VoiceConnectionState & { status: T }) => void,
	): this;
}

/**
 * A connection to the voice server of a Guild, can be used to play audio in voice channels.
 */
export class VoiceConnection extends EventEmitter {
	/**
	 * The number of consecutive rejoin attempts. Initially 0, and increments for each rejoin.
	 * When a connection is successfully established, it resets to 0.
	 */
	public rejoinAttempts: number;

	/**
	 * The state of the voice connection.
	 */
	private _state: VoiceConnectionState;

	/**
	 * A configuration storing all the data needed to reconnect to a Guild's voice server.
	 *
	 * @internal
	 */
	public readonly joinConfig: JoinConfig;

	/**
	 * The two packets needed to successfully establish a voice connection. They are received
	 * from the main Discord gateway after signalling to change the voice state.
	 */
	private readonly packets: {
		server: GatewayVoiceServerUpdateDispatchData | undefined;
		state: GatewayVoiceStateUpdateDispatchData | undefined;
	};

	/**
	 * The receiver of this voice connection. You should join the voice channel with `selfDeaf` set
	 * to false for this feature to work properly.
	 */
	public readonly receiver: VoiceReceiver;

	/**
	 * The debug logger function, if debugging is enabled.
	 */
	private readonly debug: ((message: string) => void) | null;

	/**
	 * Creates a new voice connection.
	 *
	 * @param joinConfig - The data required to establish the voice connection
	 * @param options - The options used to create this voice connection
	 */
	public constructor(joinConfig: JoinConfig, { debug, adapterCreator }: CreateVoiceConnectionOptions) {
		super();

		this.debug = debug ? (message: string) => this.emit('debug', message) : null;
		this.rejoinAttempts = 0;

		this.receiver = new VoiceReceiver(this);

		this.onNetworkingClose = this.onNetworkingClose.bind(this);
		this.onNetworkingStateChange = this.onNetworkingStateChange.bind(this);
		this.onNetworkingError = this.onNetworkingError.bind(this);
		this.onNetworkingDebug = this.onNetworkingDebug.bind(this);

		const adapter = adapterCreator({
			onVoiceServerUpdate: (data) => this.addServerPacket(data),
			onVoiceStateUpdate: (data) => this.addStatePacket(data),
			destroy: () => this.destroy(false),
		});

		this._state = { status: VoiceConnectionStatus.Signalling, adapter };

		this.packets = {
			server: undefined,
			state: undefined,
		};

		this.joinConfig = joinConfig;
	}

	/**
	 * The current state of the voice connection.
	 */
	public get state() {
		return this._state;
	}

	/**
	 * Updates the state of the voice connection, performing clean-up operations where necessary.
	 */
	public set state(newState: VoiceConnectionState) {
		const oldState = this._state;
		const oldNetworking = Reflect.get(oldState, 'networking') as Networking | undefined;
		const newNetworking = Reflect.get(newState, 'networking') as Networking | undefined;

		const oldSubscription = Reflect.get(oldState, 'subscription') as PlayerSubscription | undefined;
		const newSubscription = Reflect.get(newState, 'subscription') as PlayerSubscription | undefined;

		if (oldNetworking !== newNetworking) {
			if (oldNetworking) {
				oldNetworking.on('error', noop);
				oldNetworking.off('debug', this.onNetworkingDebug);
				oldNetworking.off('error', this.onNetworkingError);
				oldNetworking.off('close', this.onNetworkingClose);
				oldNetworking.off('stateChange', this.onNetworkingStateChange);
				oldNetworking.destroy();
			}

			if (newNetworking) this.updateReceiveBindings(newNetworking.state, oldNetworking?.state);
		}

		if (newState.status === VoiceConnectionStatus.Ready) {
			this.rejoinAttempts = 0;
		} else if (newState.status === VoiceConnectionStatus.Destroyed) {
			for (const stream of this.receiver.subscriptions.values()) {
				if (!stream.destroyed) stream.destroy();
			}
		}

		// If destroyed, the adapter can also be destroyed so it can be cleaned up by the user
		if (oldState.status !== VoiceConnectionStatus.Destroyed && newState.status === VoiceConnectionStatus.Destroyed) {
			oldState.adapter.destroy();
		}

		this._state = newState;

		if (oldSubscription && oldSubscription !== newSubscription) {
			oldSubscription.unsubscribe();
		}

		this.emit('stateChange', oldState, newState);
		if (oldState.status !== newState.status) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			this.emit(newState.status, oldState, newState as any);
		}
	}

	/**
	 * Registers a `VOICE_SERVER_UPDATE` packet to the voice connection. This will cause it to reconnect using the
	 * new data provided in the packet.
	 *
	 * @param packet - The received `VOICE_SERVER_UPDATE` packet
	 */
	private addServerPacket(packet: GatewayVoiceServerUpdateDispatchData) {
		this.packets.server = packet;
		if (packet.endpoint) {
			this.configureNetworking();
		} else if (this.state.status !== VoiceConnectionStatus.Destroyed) {
			this.state = {
				...this.state,
				status: VoiceConnectionStatus.Disconnected,
				reason: VoiceConnectionDisconnectReason.EndpointRemoved,
			};
		}
	}

	/**
	 * Registers a `VOICE_STATE_UPDATE` packet to the voice connection. Most importantly, it stores the id of the
	 * channel that the client is connected to.
	 *
	 * @param packet - The received `VOICE_STATE_UPDATE` packet
	 */
	private addStatePacket(packet: GatewayVoiceStateUpdateDispatchData) {
		this.packets.state = packet;

		if (typeof packet.self_deaf !== 'undefined') this.joinConfig.selfDeaf = packet.self_deaf;
		if (typeof packet.self_mute !== 'undefined') this.joinConfig.selfMute = packet.self_mute;
		if (packet.channel_id) this.joinConfig.channelId = packet.channel_id;
		/*
			the channel_id being null doesn't necessarily mean it was intended for the client to leave the voice channel
			as it may have disconnected due to network failure. This will be gracefully handled once the voice websocket
			dies, and then it is up to the user to decide how they wish to handle this.
		*/
	}

	/**
	 * Called when the networking state changes, and the new ws/udp packet/message handlers need to be rebound
	 * to the new instances.
	 *
	 * @param newState - The new networking state
	 * @param oldState - The old networking state, if there is one
	 */
	private updateReceiveBindings(newState: NetworkingState, oldState?: NetworkingState) {
		const oldWs = Reflect.get(oldState ?? {}, 'ws') as VoiceWebSocket | undefined;
		const newWs = Reflect.get(newState, 'ws') as VoiceWebSocket | undefined;
		const oldUdp = Reflect.get(oldState ?? {}, 'udp') as VoiceUDPSocket | undefined;
		const newUdp = Reflect.get(newState, 'udp') as VoiceUDPSocket | undefined;

		if (oldWs !== newWs) {
			oldWs?.off('packet', this.receiver.onWsPacket);
			newWs?.on('packet', this.receiver.onWsPacket);
		}

		if (oldUdp !== newUdp) {
			oldUdp?.off('message', this.receiver.onUdpMessage);
			newUdp?.on('message', this.receiver.onUdpMessage);
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		this.receiver.connectionData = Reflect.get(newState, 'connectionData') ?? {};
	}

	/**
	 * Attempts to configure a networking instance for this voice connection using the received packets.
	 * Both packets are required, and any existing networking instance will be destroyed.
	 *
	 * @remarks
	 * This is called when the voice server of the connection changes, e.g. if the bot is moved into a
	 * different channel in the same guild but has a different voice server. In this instance, the connection
	 * needs to be re-established to the new voice server.
	 *
	 * The connection will transition to the Connecting state when this is called.
	 */
	public configureNetworking() {
		const { server, state } = this.packets;
		if (!server || !state || this.state.status === VoiceConnectionStatus.Destroyed || !server.endpoint) return;

		const networking = new Networking(
			{
				endpoint: server.endpoint,
				serverId: server.guild_id,
				token: server.token,
				sessionId: state.session_id,
				userId: state.user_id,
			},
			Boolean(this.debug),
		);

		networking.once('close', this.onNetworkingClose);
		networking.on('stateChange', this.onNetworkingStateChange);
		networking.on('error', this.onNetworkingError);
		networking.on('debug', this.onNetworkingDebug);

		this.state = {
			...this.state,
			status: VoiceConnectionStatus.Connecting,
			networking,
		};
	}

	/**
	 * Called when the networking instance for this connection closes. If the close code is 4014 (do not reconnect),
	 * the voice connection will transition to the Disconnected state which will store the close code. You can
	 * decide whether or not to reconnect when this occurs by listening for the state change and calling reconnect().
	 *
	 * @remarks
	 * If the close code was anything other than 4014, it is likely that the closing was not intended, and so the
	 * VoiceConnection will signal to Discord that it would like to rejoin the channel. This automatically attempts
	 * to re-establish the connection. This would be seen as a transition from the Ready state to the Signalling state.
	 * @param code - The close code
	 */
	private onNetworkingClose(code: number) {
		if (this.state.status === VoiceConnectionStatus.Destroyed) return;
		// If networking closes, try to connect to the voice channel again.
		if (code === 4_014) {
			// Disconnected - networking is already destroyed here
			this.state = {
				...this.state,
				status: VoiceConnectionStatus.Disconnected,
				reason: VoiceConnectionDisconnectReason.WebSocketClose,
				closeCode: code,
			};
		} else {
			this.state = {
				...this.state,
				status: VoiceConnectionStatus.Signalling,
			};
			this.rejoinAttempts++;
			if (!this.state.adapter.sendPayload(createJoinVoiceChannelPayload(this.joinConfig))) {
				this.state = {
					...this.state,
					status: VoiceConnectionStatus.Disconnected,
					reason: VoiceConnectionDisconnectReason.AdapterUnavailable,
				};
			}
		}
	}

	/**
	 * Called when the state of the networking instance changes. This is used to derive the state of the voice connection.
	 *
	 * @param oldState - The previous state
	 * @param newState - The new state
	 */
	private onNetworkingStateChange(oldState: NetworkingState, newState: NetworkingState) {
		this.updateReceiveBindings(newState, oldState);
		if (oldState.code === newState.code) return;
		if (this.state.status !== VoiceConnectionStatus.Connecting && this.state.status !== VoiceConnectionStatus.Ready)
			return;

		if (newState.code === NetworkingStatusCode.Ready) {
			this.state = {
				...this.state,
				status: VoiceConnectionStatus.Ready,
			};
		} else if (newState.code !== NetworkingStatusCode.Closed) {
			this.state = {
				...this.state,
				status: VoiceConnectionStatus.Connecting,
			};
		}
	}

	/**
	 * Propagates errors from the underlying network instance.
	 *
	 * @param error - The error to propagate
	 */
	private onNetworkingError(error: Error) {
		this.emit('error', error);
	}

	/**
	 * Propagates debug messages from the underlying network instance.
	 *
	 * @param message - The debug message to propagate
	 */
	private onNetworkingDebug(message: string) {
		this.debug?.(`[NW] ${message}`);
	}

	/**
	 * Prepares an audio packet for dispatch.
	 *
	 * @param buffer - The Opus packet to prepare
	 */
	public prepareAudioPacket(buffer: Buffer) {
		const state = this.state;
		if (state.status !== VoiceConnectionStatus.Ready) return;
		return state.networking.prepareAudioPacket(buffer);
	}

	/**
	 * Dispatches the previously prepared audio packet (if any)
	 */
	public dispatchAudio() {
		const state = this.state;
		if (state.status !== VoiceConnectionStatus.Ready) return;
		return state.networking.dispatchAudio();
	}

	/**
	 * Prepares an audio packet and dispatches it immediately.
	 *
	 * @param buffer - The Opus packet to play
	 */
	public playOpusPacket(buffer: Buffer) {
		const state = this.state;
		if (state.status !== VoiceConnectionStatus.Ready) return;
		state.networking.prepareAudioPacket(buffer);
		return state.networking.dispatchAudio();
	}

	/**
	 * Destroys the VoiceConnection, preventing it from connecting to voice again.
	 * This method should be called when you no longer require the VoiceConnection to
	 * prevent memory leaks.
	 *
	 * @param adapterAvailable - Whether the adapter can be used
	 */
	public destroy(adapterAvailable = true) {
		if (this.state.status === VoiceConnectionStatus.Destroyed) {
			throw new Error('Cannot destroy VoiceConnection - it has already been destroyed');
		}

		if (getVoiceConnection(this.joinConfig.guildId, this.joinConfig.group) === this) {
			untrackVoiceConnection(this);
		}

		if (adapterAvailable) {
			this.state.adapter.sendPayload(createJoinVoiceChannelPayload({ ...this.joinConfig, channelId: null }));
		}

		this.state = {
			status: VoiceConnectionStatus.Destroyed,
		};
	}

	/**
	 * Disconnects the VoiceConnection, allowing the possibility of rejoining later on.
	 *
	 * @returns `true` if the connection was successfully disconnected
	 */
	public disconnect() {
		if (
			this.state.status === VoiceConnectionStatus.Destroyed ||
			this.state.status === VoiceConnectionStatus.Signalling
		) {
			return false;
		}

		this.joinConfig.channelId = null;
		if (!this.state.adapter.sendPayload(createJoinVoiceChannelPayload(this.joinConfig))) {
			this.state = {
				adapter: this.state.adapter,
				subscription: this.state.subscription,
				status: VoiceConnectionStatus.Disconnected,
				reason: VoiceConnectionDisconnectReason.AdapterUnavailable,
			};
			return false;
		}

		this.state = {
			adapter: this.state.adapter,
			reason: VoiceConnectionDisconnectReason.Manual,
			status: VoiceConnectionStatus.Disconnected,
		};
		return true;
	}

	/**
	 * Attempts to rejoin (better explanation soon:tm:)
	 *
	 * @remarks
	 * Calling this method successfully will automatically increment the `rejoinAttempts` counter,
	 * which you can use to inform whether or not you'd like to keep attempting to reconnect your
	 * voice connection.
	 *
	 * A state transition from Disconnected to Signalling will be observed when this is called.
	 */
	public rejoin(joinConfig?: Omit<JoinConfig, 'group' | 'guildId'>) {
		if (this.state.status === VoiceConnectionStatus.Destroyed) {
			return false;
		}

		const notReady = this.state.status !== VoiceConnectionStatus.Ready;

		if (notReady) this.rejoinAttempts++;
		Object.assign(this.joinConfig, joinConfig);
		if (this.state.adapter.sendPayload(createJoinVoiceChannelPayload(this.joinConfig))) {
			if (notReady) {
				this.state = {
					...this.state,
					status: VoiceConnectionStatus.Signalling,
				};
			}

			return true;
		}

		this.state = {
			adapter: this.state.adapter,
			subscription: this.state.subscription,
			status: VoiceConnectionStatus.Disconnected,
			reason: VoiceConnectionDisconnectReason.AdapterUnavailable,
		};
		return false;
	}

	/**
	 * Updates the speaking status of the voice connection. This is used when audio players are done playing audio,
	 * and need to signal that the connection is no longer playing audio.
	 *
	 * @param enabled - Whether or not to show as speaking
	 */
	public setSpeaking(enabled: boolean) {
		if (this.state.status !== VoiceConnectionStatus.Ready) return false;
		this.state.networking.setSpeaking(enabled);
	}

	/**
	 * Subscribes to an audio player, allowing the player to play audio on this voice connection.
	 *
	 * @param player - The audio player to subscribe to
	 * @returns The created subscription
	 */
	public subscribe(player: AudioPlayer) {
		if (this.state.status === VoiceConnectionStatus.Destroyed) return;

		// eslint-disable-next-line @typescript-eslint/dot-notation
		const subscription = player['subscribe'](this);

		this.state = {
			...this.state,
			subscription,
		};

		return subscription;
	}

	/**
	 * The latest ping (in milliseconds) for the WebSocket connection and audio playback for this voice
	 * connection, if this data is available.
	 *
	 * @remarks
	 * For this data to be available, the VoiceConnection must be in the Ready state, and its underlying
	 * WebSocket connection and UDP socket must have had at least one ping-pong exchange.
	 */
	public get ping() {
		if (
			this.state.status === VoiceConnectionStatus.Ready &&
			this.state.networking.state.code === NetworkingStatusCode.Ready
		) {
			return {
				ws: this.state.networking.state.ws.ping,
				udp: this.state.networking.state.udp.ping,
			};
		}

		return {
			ws: undefined,
			udp: undefined,
		};
	}

	/**
	 * Called when a subscription of this voice connection to an audio player is removed.
	 *
	 * @param subscription - The removed subscription
	 */
	protected onSubscriptionRemoved(subscription: PlayerSubscription) {
		if (this.state.status !== VoiceConnectionStatus.Destroyed && this.state.subscription === subscription) {
			this.state = {
				...this.state,
				subscription: undefined,
			};
		}
	}
}

/**
 * Creates a new voice connection.
 *
 * @param joinConfig - The data required to establish the voice connection
 * @param options - The options to use when joining the voice channel
 */
export function createVoiceConnection(joinConfig: JoinConfig, options: CreateVoiceConnectionOptions) {
	const payload = createJoinVoiceChannelPayload(joinConfig);
	const existing = getVoiceConnection(joinConfig.guildId, joinConfig.group);
	if (existing && existing.state.status !== VoiceConnectionStatus.Destroyed) {
		if (existing.state.status === VoiceConnectionStatus.Disconnected) {
			existing.rejoin({
				channelId: joinConfig.channelId,
				selfDeaf: joinConfig.selfDeaf,
				selfMute: joinConfig.selfMute,
			});
		} else if (!existing.state.adapter.sendPayload(payload)) {
			existing.state = {
				...existing.state,
				status: VoiceConnectionStatus.Disconnected,
				reason: VoiceConnectionDisconnectReason.AdapterUnavailable,
			};
		}

		return existing;
	}

	const voiceConnection = new VoiceConnection(joinConfig, options);
	trackVoiceConnection(voiceConnection);
	if (
		voiceConnection.state.status !== VoiceConnectionStatus.Destroyed &&
		!voiceConnection.state.adapter.sendPayload(payload)
	) {
		voiceConnection.state = {
			...voiceConnection.state,
			status: VoiceConnectionStatus.Disconnected,
			reason: VoiceConnectionDisconnectReason.AdapterUnavailable,
		};
	}

	return voiceConnection;
}
