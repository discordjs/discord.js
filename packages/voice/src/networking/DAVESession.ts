import { Buffer } from 'node:buffer';
import { EventEmitter } from 'node:events';
import Davey from '@snazzah/davey';
import type { VoiceDavePrepareEpochData, VoiceDavePrepareTransitionData } from 'discord-api-types/voice/v8';
import { SILENCE_FRAME } from '../audio/AudioPlayer';

interface SessionMethods {
	canPassthrough(userId: string): boolean;
	decrypt(userId: string, mediaType: 0 | 1, packet: Buffer): Buffer;
	encryptOpus(packet: Buffer): Buffer;
	getSerializedKeyPackage(): Buffer;
	getVerificationCode(userId: string): Promise<string>;
	processCommit(commit: Buffer): void;
	processProposals(optype: 0 | 1, proposals: Buffer, recognizedUserIds?: string[]): ProposalsResult;
	processWelcome(welcome: Buffer): void;
	ready: boolean;
	reinit(protocolVersion: number, userId: string, channelId: string): void;
	reset(): void;
	setExternalSender(externalSender: Buffer): void;
	setPassthroughMode(passthrough: boolean, expiry: number): void;
	voicePrivacyCode: string;
}

interface ProposalsResult {
	commit?: Buffer;
	welcome?: Buffer;
}

/**
 * The amount of seconds that a previous transition should be valid for.
 */
const TRANSITION_EXPIRY = 10;

/**
 * The arbitrary amount of seconds to allow passthrough for mid-downgrade.
 * Generally, transitions last about 3 seconds maximum, but this should cover for when connections are delayed.
 */
const TRANSITION_EXPIRY_PENDING_DOWNGRADE = 24;

/**
 * The amount of packets to allow decryption failure for until we deem the transition bad and re-initialize.
 * Usually 4 packets on a good connection may slip past when entering a new session.
 * After re-initializing, 5-24 packets may fail to decrypt after.
 */
export const DEFAULT_DECRYPTION_FAILURE_TOLERANCE = 36;

interface TransitionResult {
	success: boolean;
	transitionId: number;
}
/**
 * Options that dictate the session behavior.
 */
export interface DAVESessionOptions {
	decryptionFailureTolerance?: number | undefined;
}

/**
 * The maximum DAVE protocol version supported.
 */
export function getMaxProtocolVersion(): number | null {
	return Davey.DAVE_PROTOCOL_VERSION;
}

export interface DAVESession extends EventEmitter {
	on(event: 'error', listener: (error: Error) => void): this;
	on(event: 'debug', listener: (message: string) => void): this;
	on(event: 'keyPackage', listener: (message: Buffer) => void): this;
	on(event: 'invalidateTransition', listener: (transitionId: number) => void): this;
}

/**
 * Manages the DAVE protocol group session.
 */
export class DAVESession extends EventEmitter {
	/**
	 * The channel id represented by this session.
	 */
	public channelId: string;

	/**
	 * The user id represented by this session.
	 */
	public userId: string;

	/**
	 * The protocol version being used.
	 */
	public protocolVersion: number;

	/**
	 * The last transition id executed.
	 */
	public lastTransitionId?: number | undefined;

	/**
	 * The pending transitions, mapped by their ID and the protocol version.
	 */
	private pendingTransitions = new Map<number, number>();

	/**
	 * Whether this session was downgraded previously.
	 */
	private downgraded = false;

	/**
	 * The amount of consecutive failures encountered when decrypting.
	 */
	private consecutiveFailures = 0;

	/**
	 * The amount of consecutive failures needed to attempt to recover.
	 */
	private readonly failureTolerance: number;

	/**
	 * Whether this session is currently re-initializing due to an invalid transition.
	 */
	public reinitializing = false;

	/**
	 * The underlying DAVE Session of this wrapper.
	 */
	public session: SessionMethods | undefined;

	public constructor(protocolVersion: number, userId: string, channelId: string, options: DAVESessionOptions) {
		super();

		this.protocolVersion = protocolVersion;
		this.userId = userId;
		this.channelId = channelId;
		this.failureTolerance = options.decryptionFailureTolerance ?? DEFAULT_DECRYPTION_FAILURE_TOLERANCE;
	}

	/**
	 * The current voice privacy code of the session. Will be `null` if there is no session.
	 */
	public get voicePrivacyCode(): string | null {
		if (this.protocolVersion === 0 || !this.session?.voicePrivacyCode) {
			return null;
		}

		return this.session.voicePrivacyCode;
	}

	/**
	 * Gets the verification code for a user in the session.
	 *
	 * @throws Will throw if there is not an active session or the user id provided is invalid or not in the session.
	 */
	public async getVerificationCode(userId: string): Promise<string> {
		if (!this.session) throw new Error('Session not available');
		return this.session.getVerificationCode(userId);
	}

	/**
	 * Re-initializes (or initializes) the underlying session.
	 */
	public reinit() {
		if (this.protocolVersion > 0) {
			if (this.session) {
				this.session.reinit(this.protocolVersion, this.userId, this.channelId);
				this.emit('debug', `Session reinitialized for protocol version ${this.protocolVersion}`);
			} else {
				this.session = new Davey.DAVESession(this.protocolVersion, this.userId, this.channelId);
				this.emit('debug', `Session initialized for protocol version ${this.protocolVersion}`);
			}

			this.emit('keyPackage', this.session!.getSerializedKeyPackage());
		} else if (this.session) {
			this.session.reset();
			this.session.setPassthroughMode(true, TRANSITION_EXPIRY);
			this.emit('debug', 'Session reset');
		}
	}

	/**
	 * Set the external sender for this session.
	 *
	 * @param externalSender - The external sender
	 */
	public setExternalSender(externalSender: Buffer) {
		if (!this.session) throw new Error('No session available');
		this.session.setExternalSender(externalSender);
		this.emit('debug', 'Set MLS external sender');
	}

	/**
	 * Prepare for a transition.
	 *
	 * @param data - The transition data
	 * @returns Whether we should signal to the voice server that we are ready
	 */
	public prepareTransition(data: VoiceDavePrepareTransitionData) {
		this.emit('debug', `Preparing for transition (${data.transition_id}, v${data.protocol_version})`);
		this.pendingTransitions.set(data.transition_id, data.protocol_version);

		// When the included transition id is 0, the transition is for (re)initialization and it can be executed immediately.
		if (data.transition_id === 0) {
			this.executeTransition(data.transition_id);
		} else {
			if (data.protocol_version === 0) this.session?.setPassthroughMode(true, TRANSITION_EXPIRY_PENDING_DOWNGRADE);
			return true;
		}

		return false;
	}

	/**
	 * Execute a transition.
	 *
	 * @param transitionId - The transition id to execute on
	 */
	public executeTransition(transitionId: number) {
		this.emit('debug', `Executing transition (${transitionId})`);
		if (!this.pendingTransitions.has(transitionId)) {
			this.emit('debug', `Received execute transition, but we don't have a pending transition for ${transitionId}`);
			return false;
		}

		const oldVersion = this.protocolVersion;
		this.protocolVersion = this.pendingTransitions.get(transitionId)!;

		// Handle upgrades & defer downgrades
		if (oldVersion !== this.protocolVersion && this.protocolVersion === 0) {
			this.downgraded = true;
			this.emit('debug', 'Session downgraded');
		} else if (transitionId > 0 && this.downgraded) {
			this.downgraded = false;
			this.session?.setPassthroughMode(true, TRANSITION_EXPIRY);
			this.emit('debug', 'Session upgraded');
		}

		// In the future we'd want to signal to the DAVESession to transition also, but it only supports v1 at this time
		this.reinitializing = false;
		this.lastTransitionId = transitionId;
		this.emit('debug', `Transition executed (v${oldVersion} -> v${this.protocolVersion}, id: ${transitionId})`);

		this.pendingTransitions.delete(transitionId);
		return true;
	}

	/**
	 * Prepare for a new epoch.
	 *
	 * @param data - The epoch data
	 */
	public prepareEpoch(data: VoiceDavePrepareEpochData) {
		this.emit('debug', `Preparing for epoch (${data.epoch})`);
		if (data.epoch === 1) {
			this.protocolVersion = data.protocol_version;
			this.reinit();
		}
	}

	/**
	 * Recover from an invalid transition by re-initializing.
	 *
	 * @param transitionId - The transition id to invalidate
	 */
	public recoverFromInvalidTransition(transitionId: number) {
		if (this.reinitializing) return;
		this.emit('debug', `Invalidating transition ${transitionId}`);
		this.reinitializing = true;
		this.consecutiveFailures = 0;
		this.emit('invalidateTransition', transitionId);
		this.reinit();
	}

	/**
	 * Processes proposals from the MLS group.
	 *
	 * @param payload - The binary message payload
	 * @param connectedClients - The set of connected client IDs
	 * @returns The payload to send back to the voice server, if there is one
	 */
	public processProposals(payload: Buffer, connectedClients: Set<string>): Buffer | undefined {
		if (!this.session) throw new Error('No session available');
		const optype = payload.readUInt8(0) as 0 | 1;
		const { commit, welcome } = this.session.processProposals(
			optype,
			payload.subarray(1),
			Array.from(connectedClients),
		);
		this.emit('debug', 'MLS proposals processed');
		if (!commit) return;
		return welcome ? Buffer.concat([commit, welcome]) : commit;
	}

	/**
	 * Processes a commit from the MLS group.
	 *
	 * @param payload - The payload
	 * @returns The transaction id and whether it was successful
	 */
	public processCommit(payload: Buffer): TransitionResult {
		if (!this.session) throw new Error('No session available');
		const transitionId = payload.readUInt16BE(0);
		try {
			this.session.processCommit(payload.subarray(2));
			if (transitionId === 0) {
				this.reinitializing = false;
				this.lastTransitionId = transitionId;
			} else {
				this.pendingTransitions.set(transitionId, this.protocolVersion);
			}

			this.emit('debug', `MLS commit processed (transition id: ${transitionId})`);
			return { transitionId, success: true };
		} catch (error) {
			this.emit('debug', `MLS commit errored from transition ${transitionId}: ${error}`);
			this.recoverFromInvalidTransition(transitionId);
			return { transitionId, success: false };
		}
	}

	/**
	 * Processes a welcome from the MLS group.
	 *
	 * @param payload - The payload
	 * @returns The transaction id and whether it was successful
	 */
	public processWelcome(payload: Buffer): TransitionResult {
		if (!this.session) throw new Error('No session available');
		const transitionId = payload.readUInt16BE(0);
		try {
			this.session.processWelcome(payload.subarray(2));
			if (transitionId === 0) {
				this.reinitializing = false;
				this.lastTransitionId = transitionId;
			} else {
				this.pendingTransitions.set(transitionId, this.protocolVersion);
			}

			this.emit('debug', `MLS welcome processed (transition id: ${transitionId})`);
			return { transitionId, success: true };
		} catch (error) {
			this.emit('debug', `MLS welcome errored from transition ${transitionId}: ${error}`);
			this.recoverFromInvalidTransition(transitionId);
			return { transitionId, success: false };
		}
	}

	/**
	 * Encrypt a packet using end-to-end encryption.
	 *
	 * @param packet - The packet to encrypt
	 */
	public encrypt(packet: Buffer) {
		if (this.protocolVersion === 0 || !this.session?.ready || packet.equals(SILENCE_FRAME)) return packet;
		return this.session.encryptOpus(packet);
	}

	/**
	 * Decrypt a packet using end-to-end encryption.
	 *
	 * @param packet - The packet to decrypt
	 * @param userId - The user id that sent the packet
	 * @returns The decrypted packet, or `null` if the decryption failed but should be ignored
	 */
	public decrypt(packet: Buffer, userId: string) {
		const canDecrypt = this.session?.ready && (this.protocolVersion !== 0 || this.session?.canPassthrough(userId));
		if (packet.equals(SILENCE_FRAME) || !canDecrypt || !this.session) return packet;
		try {
			// @ts-expect-error - const enum is exported and works (todo: drop const modifier on Davey end)
			const buffer = this.session.decrypt(userId, Davey.MediaType.AUDIO, packet);
			this.consecutiveFailures = 0;
			return buffer;
		} catch (error) {
			if (!this.reinitializing && this.pendingTransitions.size === 0) {
				this.consecutiveFailures++;
				this.emit('debug', `Failed to decrypt a packet (${this.consecutiveFailures} consecutive fails)`);
				if (this.consecutiveFailures > this.failureTolerance) {
					if (this.lastTransitionId) this.recoverFromInvalidTransition(this.lastTransitionId);
					else throw error;
				}
			} else if (this.reinitializing) {
				this.emit('debug', 'Failed to decrypt a packet (reinitializing session)');
			} else if (this.pendingTransitions.size > 0) {
				this.emit('debug', `Failed to decrypt a packet (${this.pendingTransitions.size} pending transition[s])`);
			}
		}

		return null;
	}

	/**
	 * Resets the session.
	 */
	public destroy() {
		try {
			this.session?.reset();
		} catch {}
	}
}
