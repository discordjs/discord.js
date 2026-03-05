/* eslint-disable jsdoc/check-param-names */
/* eslint-disable id-length */
/* eslint-disable @typescript-eslint/unbound-method */
import { Buffer } from 'node:buffer';
import crypto from 'node:crypto';
import { EventEmitter } from 'node:events';
import type { VoiceReceivePayload, VoiceSpeakingFlags } from 'discord-api-types/voice/v8';
import { VoiceEncryptionMode, VoiceOpcodes } from 'discord-api-types/voice/v8';
import type { CloseEvent } from 'ws';
import * as secretbox from '../util/Secretbox';
import { noop } from '../util/util';
import { DAVESession, getMaxProtocolVersion } from './DAVESession';
import { VoiceUDPSocket } from './VoiceUDPSocket';
import type { BinaryWebSocketMessage } from './VoiceWebSocket';
import { VoiceWebSocket } from './VoiceWebSocket';

// The number of audio channels required by Discord
const CHANNELS = 2;
const TIMESTAMP_INC = (48_000 / 100) * CHANNELS;
const MAX_NONCE_SIZE = 2 ** 32 - 1;

export const SUPPORTED_ENCRYPTION_MODES: VoiceEncryptionMode[] = [VoiceEncryptionMode.AeadXChaCha20Poly1305RtpSize];

// Just in case there's some system that doesn't come with aes-256-gcm, conditionally add it as supported
if (crypto.getCiphers().includes('aes-256-gcm')) {
	SUPPORTED_ENCRYPTION_MODES.unshift(VoiceEncryptionMode.AeadAes256GcmRtpSize);
}

/**
 * The different statuses that a networking instance can hold. The order
 * of the states between OpeningWs and Ready is chronological (first the
 * instance enters OpeningWs, then it enters Identifying etc.)
 */
export enum NetworkingStatusCode {
	OpeningWs,
	Identifying,
	UdpHandshaking,
	SelectingProtocol,
	Ready,
	Resuming,
	Closed,
}

/**
 * The initial Networking state. Instances will be in this state when a WebSocket connection to a Discord
 * voice gateway is being opened.
 */
export interface NetworkingOpeningWsState {
	code: NetworkingStatusCode.OpeningWs;
	connectionOptions: ConnectionOptions;
	ws: VoiceWebSocket;
}

/**
 * The state that a Networking instance will be in when it is attempting to authorize itself.
 */
export interface NetworkingIdentifyingState {
	code: NetworkingStatusCode.Identifying;
	connectionOptions: ConnectionOptions;
	ws: VoiceWebSocket;
}

/**
 * The state that a Networking instance will be in when opening a UDP connection to the IP and port provided
 * by Discord, as well as performing IP discovery.
 */
export interface NetworkingUdpHandshakingState {
	code: NetworkingStatusCode.UdpHandshaking;
	connectionData: Pick<ConnectionData, 'connectedClients' | 'ssrc'>;
	connectionOptions: ConnectionOptions;
	udp: VoiceUDPSocket;
	ws: VoiceWebSocket;
}

/**
 * The state that a Networking instance will be in when selecting an encryption protocol for audio packets.
 */
export interface NetworkingSelectingProtocolState {
	code: NetworkingStatusCode.SelectingProtocol;
	connectionData: Pick<ConnectionData, 'connectedClients' | 'ssrc'>;
	connectionOptions: ConnectionOptions;
	udp: VoiceUDPSocket;
	ws: VoiceWebSocket;
}

/**
 * The state that a Networking instance will be in when it has a fully established connection to a Discord
 * voice server.
 */
export interface NetworkingReadyState {
	code: NetworkingStatusCode.Ready;
	connectionData: ConnectionData;
	connectionOptions: ConnectionOptions;
	dave?: DAVESession | undefined;
	preparedPacket?: Buffer | undefined;
	udp: VoiceUDPSocket;
	ws: VoiceWebSocket;
}

/**
 * The state that a Networking instance will be in when its connection has been dropped unexpectedly, and it
 * is attempting to resume an existing session.
 */
export interface NetworkingResumingState {
	code: NetworkingStatusCode.Resuming;
	connectionData: ConnectionData;
	connectionOptions: ConnectionOptions;
	dave?: DAVESession | undefined;
	preparedPacket?: Buffer | undefined;
	udp: VoiceUDPSocket;
	ws: VoiceWebSocket;
}

/**
 * The state that a Networking instance will be in when it has been destroyed. It cannot be recovered from this
 * state.
 */
export interface NetworkingClosedState {
	code: NetworkingStatusCode.Closed;
}

/**
 * The various states that a networking instance can be in.
 */
export type NetworkingState =
	| NetworkingClosedState
	| NetworkingIdentifyingState
	| NetworkingOpeningWsState
	| NetworkingReadyState
	| NetworkingResumingState
	| NetworkingSelectingProtocolState
	| NetworkingUdpHandshakingState;

/**
 * Details required to connect to the Discord voice gateway. These details
 * are first received on the main bot gateway, in the form of VOICE_SERVER_UPDATE
 * and VOICE_STATE_UPDATE packets.
 */
export interface ConnectionOptions {
	channelId: string;
	endpoint: string;
	serverId: string;
	sessionId: string;
	token: string;
	userId: string;
}

/**
 * Information about the current connection, e.g. which encryption mode is to be used on
 * the connection, timing information for playback of streams.
 */
export interface ConnectionData {
	connectedClients: Set<string>;
	encryptionMode: string;
	nonce: number;
	nonceBuffer: Buffer;
	packetsPlayed: number;
	secretKey: Uint8Array;
	sequence: number;
	speaking: boolean;
	ssrc: number;
	timestamp: number;
}

/**
 * Options for networking that dictate behavior.
 */
export interface NetworkingOptions {
	daveEncryption?: boolean | undefined;
	debug?: boolean | undefined;
	decryptionFailureTolerance?: number | undefined;
}

/**
 * An empty buffer that is reused in packet encryption by many different networking instances.
 */
const nonce = Buffer.alloc(24);

export interface Networking extends EventEmitter {
	/**
	 * Debug event for Networking.
	 *
	 * @eventProperty
	 */
	on(event: 'debug', listener: (message: string) => void): this;
	on(event: 'error', listener: (error: Error) => void): this;
	on(event: 'stateChange', listener: (oldState: NetworkingState, newState: NetworkingState) => void): this;
	on(event: 'close', listener: (code: number) => void): this;
	on(event: 'transitioned', listener: (transitionId: number) => void): this;
}

/**
 * Stringifies a NetworkingState.
 *
 * @param state - The state to stringify
 */
function stringifyState(state: NetworkingState) {
	return JSON.stringify({
		...state,
		ws: Reflect.has(state, 'ws'),
		udp: Reflect.has(state, 'udp'),
	});
}

/**
 * Chooses an encryption mode from a list of given options. Chooses the most preferred option.
 *
 * @param options - The available encryption options
 */
function chooseEncryptionMode(options: VoiceEncryptionMode[]): VoiceEncryptionMode {
	const option = options.find((option) => SUPPORTED_ENCRYPTION_MODES.includes(option));
	if (!option) {
		// This should only ever happen if the gateway does not give us any encryption modes we support.
		throw new Error(`No compatible encryption modes. Available include: ${options.join(', ')}`);
	}

	return option;
}

/**
 * Returns a random number that is in the range of n bits.
 *
 * @param numberOfBits - The number of bits
 */
function randomNBit(numberOfBits: number) {
	return Math.floor(Math.random() * 2 ** numberOfBits);
}

/**
 * Manages the networking required to maintain a voice connection and dispatch audio packets
 */
export class Networking extends EventEmitter {
	private _state: NetworkingState;

	/**
	 * The debug logger function, if debugging is enabled.
	 */
	private readonly debug: ((message: string) => void) | null;

	/**
	 * The options used to create this Networking instance.
	 */
	private readonly options: NetworkingOptions;

	/**
	 * Creates a new Networking instance.
	 */
	public constructor(connectionOptions: ConnectionOptions, options: NetworkingOptions) {
		super();

		this.onWsOpen = this.onWsOpen.bind(this);
		this.onChildError = this.onChildError.bind(this);
		this.onWsPacket = this.onWsPacket.bind(this);
		this.onWsBinary = this.onWsBinary.bind(this);
		this.onWsClose = this.onWsClose.bind(this);
		this.onWsDebug = this.onWsDebug.bind(this);
		this.onUdpDebug = this.onUdpDebug.bind(this);
		this.onUdpClose = this.onUdpClose.bind(this);
		this.onDaveDebug = this.onDaveDebug.bind(this);
		this.onDaveKeyPackage = this.onDaveKeyPackage.bind(this);
		this.onDaveInvalidateTransition = this.onDaveInvalidateTransition.bind(this);

		this.debug = options?.debug ? (message: string) => this.emit('debug', message) : null;

		this._state = {
			code: NetworkingStatusCode.OpeningWs,
			ws: this.createWebSocket(connectionOptions.endpoint),
			connectionOptions,
		};
		this.options = options;
	}

	/**
	 * Destroys the Networking instance, transitioning it into the Closed state.
	 */
	public destroy() {
		this.state = {
			code: NetworkingStatusCode.Closed,
		};
	}

	/**
	 * The current state of the networking instance.
	 *
	 * @remarks
	 * The setter will perform clean-up operations where necessary.
	 */
	public get state(): NetworkingState {
		return this._state;
	}

	public set state(newState: NetworkingState) {
		const oldWs = Reflect.get(this._state, 'ws') as VoiceWebSocket | undefined;
		const newWs = Reflect.get(newState, 'ws') as VoiceWebSocket | undefined;
		if (oldWs && oldWs !== newWs) {
			// The old WebSocket is being freed - remove all handlers from it
			oldWs.off('debug', this.onWsDebug);
			oldWs.on('error', noop);
			oldWs.off('error', this.onChildError);
			oldWs.off('open', this.onWsOpen);
			oldWs.off('packet', this.onWsPacket);
			oldWs.off('binary', this.onWsBinary);
			oldWs.off('close', this.onWsClose);
			oldWs.destroy();
		}

		const oldUdp = Reflect.get(this._state, 'udp') as VoiceUDPSocket | undefined;
		const newUdp = Reflect.get(newState, 'udp') as VoiceUDPSocket | undefined;

		if (oldUdp && oldUdp !== newUdp) {
			oldUdp.on('error', noop);
			oldUdp.off('error', this.onChildError);
			oldUdp.off('close', this.onUdpClose);
			oldUdp.off('debug', this.onUdpDebug);
			oldUdp.destroy();
		}

		const oldDave = Reflect.get(this._state, 'dave') as DAVESession | undefined;
		const newDave = Reflect.get(newState, 'dave') as DAVESession | undefined;

		if (oldDave && oldDave !== newDave) {
			oldDave.off('error', this.onChildError);
			oldDave.off('debug', this.onDaveDebug);
			oldDave.off('keyPackage', this.onDaveKeyPackage);
			oldDave.off('invalidateTransition', this.onDaveInvalidateTransition);
			oldDave.destroy();
		}

		const oldState = this._state;
		this._state = newState;
		this.emit('stateChange', oldState, newState);

		this.debug?.(`state change:\nfrom ${stringifyState(oldState)}\nto ${stringifyState(newState)}`);
	}

	/**
	 * Creates a new WebSocket to a Discord Voice gateway.
	 *
	 * @param endpoint - The endpoint to connect to
	 * @param lastSequence - The last sequence to set for this WebSocket
	 */
	private createWebSocket(endpoint: string, lastSequence?: number) {
		const ws = new VoiceWebSocket(`wss://${endpoint}?v=8`, Boolean(this.debug));

		if (lastSequence !== undefined) {
			ws.sequence = lastSequence;
		}

		ws.on('error', this.onChildError);
		ws.once('open', this.onWsOpen);
		ws.on('packet', this.onWsPacket);
		ws.on('binary', this.onWsBinary);
		ws.once('close', this.onWsClose);
		ws.on('debug', this.onWsDebug);

		return ws;
	}

	/**
	 * Creates a new DAVE session for this voice connection if we can create one.
	 *
	 * @param protocolVersion - The protocol version to use
	 */
	private createDaveSession(protocolVersion: number) {
		if (
			this.options.daveEncryption === false ||
			(this.state.code !== NetworkingStatusCode.SelectingProtocol &&
				this.state.code !== NetworkingStatusCode.Ready &&
				this.state.code !== NetworkingStatusCode.Resuming)
		) {
			return;
		}

		const session = new DAVESession(
			protocolVersion,
			this.state.connectionOptions.userId,
			this.state.connectionOptions.channelId,
			{
				decryptionFailureTolerance: this.options.decryptionFailureTolerance,
			},
		);

		session.on('error', this.onChildError);
		session.on('debug', this.onDaveDebug);
		session.on('keyPackage', this.onDaveKeyPackage);
		session.on('invalidateTransition', this.onDaveInvalidateTransition);
		session.reinit();

		return session;
	}

	/**
	 * Propagates errors from the children VoiceWebSocket, VoiceUDPSocket and DAVESession.
	 *
	 * @param error - The error that was emitted by a child
	 */
	private onChildError(error: Error) {
		this.emit('error', error);
	}

	/**
	 * Called when the WebSocket opens. Depending on the state that the instance is in,
	 * it will either identify with a new session, or it will attempt to resume an existing session.
	 */
	private onWsOpen() {
		if (this.state.code === NetworkingStatusCode.OpeningWs) {
			this.state.ws.sendPacket({
				op: VoiceOpcodes.Identify,
				d: {
					server_id: this.state.connectionOptions.serverId,
					user_id: this.state.connectionOptions.userId,
					session_id: this.state.connectionOptions.sessionId,
					token: this.state.connectionOptions.token,
					max_dave_protocol_version: this.options.daveEncryption === false ? 0 : getMaxProtocolVersion(),
				},
			});
			this.state = {
				...this.state,
				code: NetworkingStatusCode.Identifying,
			};
		} else if (this.state.code === NetworkingStatusCode.Resuming) {
			this.state.ws.sendPacket({
				op: VoiceOpcodes.Resume,
				d: {
					server_id: this.state.connectionOptions.serverId,
					session_id: this.state.connectionOptions.sessionId,
					token: this.state.connectionOptions.token,
					seq_ack: this.state.ws.sequence,
				},
			});
		}
	}

	/**
	 * Called when the WebSocket closes. Based on the reason for closing (given by the code parameter),
	 * the instance will either attempt to resume, or enter the closed state and emit a 'close' event
	 * with the close code, allowing the user to decide whether or not they would like to reconnect.
	 *
	 * @param code - The close code
	 */
	private onWsClose({ code }: CloseEvent) {
		const canResume = code === 4_015 || code < 4_000;
		if (canResume && this.state.code === NetworkingStatusCode.Ready) {
			const lastSequence = this.state.ws.sequence;
			this.state = {
				...this.state,
				code: NetworkingStatusCode.Resuming,
				ws: this.createWebSocket(this.state.connectionOptions.endpoint, lastSequence),
			};
		} else if (this.state.code !== NetworkingStatusCode.Closed) {
			this.destroy();
			this.emit('close', code);
		}
	}

	/**
	 * Called when the UDP socket has closed itself if it has stopped receiving replies from Discord.
	 */
	private onUdpClose() {
		if (this.state.code === NetworkingStatusCode.Ready) {
			const lastSequence = this.state.ws.sequence;
			this.state = {
				...this.state,
				code: NetworkingStatusCode.Resuming,
				ws: this.createWebSocket(this.state.connectionOptions.endpoint, lastSequence),
			};
		}
	}

	/**
	 * Called when a packet is received on the connection's WebSocket.
	 *
	 * @param packet - The received packet
	 */
	private onWsPacket(packet: VoiceReceivePayload) {
		if (packet.op === VoiceOpcodes.Hello && this.state.code !== NetworkingStatusCode.Closed) {
			this.state.ws.setHeartbeatInterval(packet.d.heartbeat_interval);
		} else if (packet.op === VoiceOpcodes.Ready && this.state.code === NetworkingStatusCode.Identifying) {
			const { ip, port, ssrc, modes } = packet.d;

			const udp = new VoiceUDPSocket({ ip, port });
			udp.on('error', this.onChildError);
			udp.on('debug', this.onUdpDebug);
			udp.once('close', this.onUdpClose);
			udp
				.performIPDiscovery(ssrc)
				// eslint-disable-next-line promise/prefer-await-to-then
				.then((localConfig) => {
					if (this.state.code !== NetworkingStatusCode.UdpHandshaking) return;
					this.state.ws.sendPacket({
						op: VoiceOpcodes.SelectProtocol,
						d: {
							protocol: 'udp',
							data: {
								address: localConfig.ip,
								port: localConfig.port,
								mode: chooseEncryptionMode(modes),
							},
						},
					});
					this.state = {
						...this.state,
						code: NetworkingStatusCode.SelectingProtocol,
					};
				})
				// eslint-disable-next-line promise/prefer-await-to-then, promise/prefer-await-to-callbacks
				.catch((error: Error) => this.emit('error', error));

			this.state = {
				...this.state,
				code: NetworkingStatusCode.UdpHandshaking,
				udp,
				connectionData: {
					ssrc,
					connectedClients: new Set(),
				},
			};
		} else if (
			packet.op === VoiceOpcodes.SessionDescription &&
			this.state.code === NetworkingStatusCode.SelectingProtocol
		) {
			const { mode: encryptionMode, secret_key: secretKey, dave_protocol_version: daveProtocolVersion } = packet.d;
			this.state = {
				...this.state,
				code: NetworkingStatusCode.Ready,
				dave: this.createDaveSession(daveProtocolVersion),
				connectionData: {
					...this.state.connectionData,
					encryptionMode,
					secretKey: new Uint8Array(secretKey),
					sequence: randomNBit(16),
					timestamp: randomNBit(32),
					nonce: 0,
					nonceBuffer: encryptionMode === 'aead_aes256_gcm_rtpsize' ? Buffer.alloc(12) : Buffer.alloc(24),
					speaking: false,
					packetsPlayed: 0,
				},
			};
		} else if (packet.op === VoiceOpcodes.Resumed && this.state.code === NetworkingStatusCode.Resuming) {
			this.state = {
				...this.state,
				code: NetworkingStatusCode.Ready,
			};
			this.state.connectionData.speaking = false;
		} else if (
			(packet.op === VoiceOpcodes.ClientsConnect || packet.op === VoiceOpcodes.ClientDisconnect) &&
			(this.state.code === NetworkingStatusCode.Ready ||
				this.state.code === NetworkingStatusCode.UdpHandshaking ||
				this.state.code === NetworkingStatusCode.SelectingProtocol ||
				this.state.code === NetworkingStatusCode.Resuming)
		) {
			const { connectionData } = this.state;
			if (packet.op === VoiceOpcodes.ClientsConnect)
				for (const id of packet.d.user_ids) connectionData.connectedClients.add(id);
			else {
				connectionData.connectedClients.delete(packet.d.user_id);
			}
		} else if (
			(this.state.code === NetworkingStatusCode.Ready || this.state.code === NetworkingStatusCode.Resuming) &&
			this.state.dave
		) {
			if (packet.op === VoiceOpcodes.DavePrepareTransition) {
				const sendReady = this.state.dave.prepareTransition(packet.d);
				if (sendReady)
					this.state.ws.sendPacket({
						op: VoiceOpcodes.DaveTransitionReady,
						d: { transition_id: packet.d.transition_id },
					});
				if (packet.d.transition_id === 0) {
					this.emit('transitioned', 0);
				}
			} else if (packet.op === VoiceOpcodes.DaveExecuteTransition) {
				const transitioned = this.state.dave.executeTransition(packet.d.transition_id);
				if (transitioned) this.emit('transitioned', packet.d.transition_id);
			} else if (packet.op === VoiceOpcodes.DavePrepareEpoch) this.state.dave.prepareEpoch(packet.d);
		}
	}

	/**
	 * Called when a binary message is received on the connection's WebSocket.
	 *
	 * @param message - The received message
	 */
	private onWsBinary(message: BinaryWebSocketMessage) {
		if (this.state.code === NetworkingStatusCode.Ready && this.state.dave) {
			if (message.op === VoiceOpcodes.DaveMlsExternalSender) {
				this.state.dave.setExternalSender(message.payload);
			} else if (message.op === VoiceOpcodes.DaveMlsProposals) {
				const payload = this.state.dave.processProposals(message.payload, this.state.connectionData.connectedClients);
				if (payload) this.state.ws.sendBinaryMessage(VoiceOpcodes.DaveMlsCommitWelcome, payload);
			} else if (message.op === VoiceOpcodes.DaveMlsAnnounceCommitTransition) {
				const { transitionId, success } = this.state.dave.processCommit(message.payload);
				if (success) {
					if (transitionId === 0) this.emit('transitioned', transitionId);
					else
						this.state.ws.sendPacket({
							op: VoiceOpcodes.DaveTransitionReady,
							d: { transition_id: transitionId },
						});
				}
			} else if (message.op === VoiceOpcodes.DaveMlsWelcome) {
				const { transitionId, success } = this.state.dave.processWelcome(message.payload);
				if (success) {
					if (transitionId === 0) this.emit('transitioned', transitionId);
					else
						this.state.ws.sendPacket({
							op: VoiceOpcodes.DaveTransitionReady,
							d: { transition_id: transitionId },
						});
				}
			}
		}
	}

	/**
	 * Called when a new key package is ready to be sent to the voice server.
	 *
	 * @param keyPackage - The new key package
	 */
	private onDaveKeyPackage(keyPackage: Buffer) {
		if (this.state.code === NetworkingStatusCode.SelectingProtocol || this.state.code === NetworkingStatusCode.Ready)
			this.state.ws.sendBinaryMessage(VoiceOpcodes.DaveMlsKeyPackage, keyPackage);
	}

	/**
	 * Called when the DAVE session wants to invalidate their transition and re-initialize.
	 *
	 * @param transitionId - The transition to invalidate
	 */
	private onDaveInvalidateTransition(transitionId: number) {
		if (this.state.code === NetworkingStatusCode.SelectingProtocol || this.state.code === NetworkingStatusCode.Ready)
			this.state.ws.sendPacket({
				op: VoiceOpcodes.DaveMlsInvalidCommitWelcome,
				d: { transition_id: transitionId },
			});
	}

	/**
	 * Propagates debug messages from the child WebSocket.
	 *
	 * @param message - The emitted debug message
	 */
	private onWsDebug(message: string) {
		this.debug?.(`[WS] ${message}`);
	}

	/**
	 * Propagates debug messages from the child UDPSocket.
	 *
	 * @param message - The emitted debug message
	 */
	private onUdpDebug(message: string) {
		this.debug?.(`[UDP] ${message}`);
	}

	/**
	 * Propagates debug messages from the child DAVESession.
	 *
	 * @param message - The emitted debug message
	 */
	private onDaveDebug(message: string) {
		this.debug?.(`[DAVE] ${message}`);
	}

	/**
	 * Prepares an Opus packet for playback. This includes attaching metadata to it and encrypting it.
	 * It will be stored within the instance, and can be played by dispatchAudio()
	 *
	 * @remarks
	 * Calling this method while there is already a prepared audio packet that has not yet been dispatched
	 * will overwrite the existing audio packet. This should be avoided.
	 * @param opusPacket - The Opus packet to encrypt
	 * @returns The audio packet that was prepared
	 */
	public prepareAudioPacket(opusPacket: Buffer) {
		const state = this.state;
		if (state.code !== NetworkingStatusCode.Ready) return;
		state.preparedPacket = this.createAudioPacket(opusPacket, state.connectionData, state.dave);
		return state.preparedPacket;
	}

	/**
	 * Dispatches the audio packet previously prepared by prepareAudioPacket(opusPacket). The audio packet
	 * is consumed and cannot be dispatched again.
	 */
	public dispatchAudio() {
		const state = this.state;
		if (state.code !== NetworkingStatusCode.Ready) return false;
		if (state.preparedPacket !== undefined) {
			this.playAudioPacket(state.preparedPacket);
			state.preparedPacket = undefined;
			return true;
		}

		return false;
	}

	/**
	 * Plays an audio packet, updating timing metadata used for playback.
	 *
	 * @param audioPacket - The audio packet to play
	 */
	private playAudioPacket(audioPacket: Buffer) {
		const state = this.state;
		if (state.code !== NetworkingStatusCode.Ready) return;
		const { connectionData } = state;
		connectionData.packetsPlayed++;
		connectionData.sequence++;
		connectionData.timestamp += TIMESTAMP_INC;
		if (connectionData.sequence >= 2 ** 16) connectionData.sequence = 0;
		if (connectionData.timestamp >= 2 ** 32) connectionData.timestamp = 0;
		this.setSpeaking(true);
		state.udp.send(audioPacket);
	}

	/**
	 * Sends a packet to the voice gateway indicating that the client has start/stopped sending
	 * audio.
	 *
	 * @param speaking - Whether or not the client should be shown as speaking
	 */
	public setSpeaking(speaking: boolean) {
		const state = this.state;
		if (state.code !== NetworkingStatusCode.Ready) return;
		if (state.connectionData.speaking === speaking) return;
		state.connectionData.speaking = speaking;
		state.ws.sendPacket({
			op: VoiceOpcodes.Speaking,
			d: {
				speaking: (speaking ? 1 : 0) as VoiceSpeakingFlags,
				delay: 0,
				ssrc: state.connectionData.ssrc,
			},
		});
	}

	/**
	 * Creates a new audio packet from an Opus packet. This involves encrypting the packet,
	 * then prepending a header that includes metadata.
	 *
	 * @param opusPacket - The Opus packet to prepare
	 * @param connectionData - The current connection data of the instance
	 * @param daveSession - The DAVE session to use for encryption
	 */
	private createAudioPacket(opusPacket: Buffer, connectionData: ConnectionData, daveSession?: DAVESession) {
		const rtpHeader = Buffer.alloc(12);
		rtpHeader[0] = 0x80;
		rtpHeader[1] = 0x78;

		const { sequence, timestamp, ssrc } = connectionData;

		rtpHeader.writeUIntBE(sequence, 2, 2);
		rtpHeader.writeUIntBE(timestamp, 4, 4);
		rtpHeader.writeUIntBE(ssrc, 8, 4);

		rtpHeader.copy(nonce, 0, 0, 12);
		return Buffer.concat([rtpHeader, ...this.encryptOpusPacket(opusPacket, connectionData, rtpHeader, daveSession)]);
	}

	/**
	 * Encrypts an Opus packet using the format agreed upon by the instance and Discord.
	 *
	 * @param opusPacket - The Opus packet to encrypt
	 * @param connectionData - The current connection data of the instance
	 * @param daveSession - The DAVE session to use for encryption
	 */
	private encryptOpusPacket(
		opusPacket: Buffer,
		connectionData: ConnectionData,
		additionalData: Buffer,
		daveSession?: DAVESession,
	) {
		const { secretKey, encryptionMode } = connectionData;

		const packet = daveSession?.encrypt(opusPacket) ?? opusPacket;

		// Both supported encryption methods want the nonce to be an incremental integer
		connectionData.nonce++;
		if (connectionData.nonce > MAX_NONCE_SIZE) connectionData.nonce = 0;
		connectionData.nonceBuffer.writeUInt32BE(connectionData.nonce, 0);

		// 4 extra bytes of padding on the end of the encrypted packet
		const noncePadding = connectionData.nonceBuffer.subarray(0, 4);

		let encrypted;
		switch (encryptionMode) {
			case 'aead_aes256_gcm_rtpsize': {
				const cipher = crypto.createCipheriv('aes-256-gcm', secretKey, connectionData.nonceBuffer);
				cipher.setAAD(additionalData);

				encrypted = Buffer.concat([cipher.update(packet), cipher.final(), cipher.getAuthTag()]);

				return [encrypted, noncePadding];
			}

			case 'aead_xchacha20_poly1305_rtpsize': {
				encrypted = secretbox.methods.crypto_aead_xchacha20poly1305_ietf_encrypt(
					packet,
					additionalData,
					connectionData.nonceBuffer,
					secretKey,
				);

				return [encrypted, noncePadding];
			}

			default: {
				// This should never happen. Our encryption mode is chosen from a list given to us by the gateway and checked with the ones we support.
				throw new RangeError(`Unsupported encryption method: ${encryptionMode}`);
			}
		}
	}
}
