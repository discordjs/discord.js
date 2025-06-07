import { Buffer } from 'node:buffer';
import { EventEmitter } from 'node:events';
import type { VoiceDavePrepareEpochData, VoiceDavePrepareTransitionData } from 'discord-api-types/voice/v8';
import { SILENCE_FRAME } from '../audio/AudioPlayer';
import { DAVESessionError, DAVESessionErrorKind } from './DAVESessionError';

let Davey: any = null;

/**
 * The amount of seconds that a previous transition should be valid for.
 */
const TRANSITION_EXPIRY = 10;

/**
 * The arbitrary amount of seconds to allow passthrough for mid-downgrade.
 * Generally, transitions should not even last this long, but should be more than enough to cover it.
 */
const TRANSITION_EXPIRY_PENDING_DOWNGRADE = 120;

/**
 * The amount of packets to allow decryption failure for until we deem the transition bad and re-initialize.
 * Usually 4 packets on a good connection may slip past when entering a new session.
 * After re-initializing, 5-24 packets may fail to decrypt after.
 */
export const DEFAULT_DECRYPTION_FAILURE_TOLERANCE = 36;

// eslint-disable-next-line no-async-promise-executor
export const daveLoadPromise = new Promise<void>(async (resolve) => {
	try {
		const lib = await import('@snazzah/davey');
		Davey = lib;
	} catch {}

	resolve();
});

interface TransitionResult {
	success: boolean;
	transitionId: number;
}

/**
 * The maximum DAVE protocol version supported.
 */
export function getMaxProtocolVersion(): number | null {
	return Davey?.DAVE_PROTOCOL_VERSION;
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
	 * The channel ID represented by this session.
	 */
	public channelId: string;

	/**
	 * The user ID represented by this session.
	 */
	public userId: string;

	/**
	 * The protocol version being used.
	 */
	public protocolVersion: number;

	/**
	 * The last transition ID executed.
	 */
	public lastTransitionId?: number | undefined;

	/**
	 * The pending transition.
	 */
	private pendingTransition?: VoiceDavePrepareTransitionData | undefined;

	/**
	 * Whether this session was downgraded previously.
	 */
	private downgraded = false;

	/**
	 * The amount of consecutive failures encountered when decrypting.
	 */
	private consecutiveFailures = 0;

	/**
	 * Whether this session is currently re-initializing due to an invalid transition.
	 */
	public reinitializing = false;

	/**
	 * The underlying DAVE Session of this wrapper.
	 */
	public session: any;

	public constructor(protocolVersion: number, userId: string, channelId: string) {
		if (Davey === null)
			throw new Error(
				`Cannot utilize the DAVE protocol as the @snazzah/davey package has not been installed.
- Use the generateDependencyReport() function for more information.\n`,
			);

		super();

		this.protocolVersion = protocolVersion;
		this.userId = userId;
		this.channelId = channelId;
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

			this.emit('keyPackage', this.session.getSerializedKeyPackage());
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
		this.pendingTransition = data;

		// When the included transition ID is 0, the transition is for (re)initialization and it can be executed immediately.
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
		if (!this.pendingTransition) return;
		let transitioned = false;
		if (transitionId === this.pendingTransition.transition_id) {
			const oldVersion = this.protocolVersion;
			this.protocolVersion = this.pendingTransition.protocol_version;

			// Handle upgrades & defer downgrades
			if (oldVersion !== this.protocolVersion && this.protocolVersion === 0) {
				this.downgraded = true;
				this.emit('debug', 'Session downgraded');
			} else if (transitionId > 0 && this.downgraded) {
				this.downgraded = false;
				this.session?.setPassthroughMode(true, 10);
				this.emit('debug', 'Session upgraded');
			}

			// In the future we'd want to signal to the DAVESession to transition also, but it only supports v1 at this time
			transitioned = true;
			this.reinitializing = false;
			this.lastTransitionId = transitionId;
			this.emit('debug', `Transition executed (v${oldVersion} -> v${this.protocolVersion}, id: ${transitionId})`);
		}

		this.pendingTransition = undefined;
		return transitioned;
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
	 * @param transitionId - The transition ID to invalidate
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
		const optype = payload.readUInt8(0);
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
	 * @returns The transaction ID and whether it was successful
	 */
	public processCommit(payload: Buffer): TransitionResult {
		const transitionId = payload.readUInt16BE(0);
		try {
			this.session.processCommit(payload.subarray(2));
			if (transitionId === 0) {
				this.reinitializing = false;
				this.lastTransitionId = transitionId;
			} else this.pendingTransition = { transition_id: transitionId, protocol_version: this.protocolVersion };
			this.emit('debug', `MLS commit processed (transition id: ${transitionId})`);
			return { transitionId, success: true };
		} catch (error) {
			this.emit('error', new DAVESessionError(error as Error, DAVESessionErrorKind.Commit, transitionId));
			this.recoverFromInvalidTransition(transitionId);
			return { transitionId, success: false };
		}
	}

	/**
	 * Processes a welcome from the MLS group.
	 *
	 * @param payload - The payload
	 * @returns The transaction ID and whether it was successful
	 */
	public processWelcome(payload: Buffer): TransitionResult {
		const transitionId = payload.readUInt16BE(0);
		try {
			this.session.processWelcome(payload.subarray(2));
			if (transitionId === 0) {
				this.reinitializing = false;
				this.lastTransitionId = transitionId;
			} else this.pendingTransition = { transition_id: transitionId, protocol_version: this.protocolVersion };
			this.emit('debug', `MLS welcome processed (transition id: ${transitionId})`);
			return { transitionId, success: true };
		} catch (error) {
			this.emit('error', new DAVESessionError(error as Error, DAVESessionErrorKind.Welcome, transitionId));
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
		if (packet.equals(SILENCE_FRAME) || this.protocolVersion === 0 || !this.session?.ready) return packet;
		return this.session.encryptOpus(packet);
	}

	/**
	 * Decrypt a packet using end-to-end encryption.
	 *
	 * @param packet - The packet to decrypt
	 * @param userId - The user ID that sent the packet
	 * @returns The decrypted packet, or `null` if the decryption failed but should be ignored
	 */
	public decrypt(packet: Buffer, userId: string) {
		const canDecrypt = this?.session.ready && (this.protocolVersion !== 0 || this.session?.canPassthrough(userId));
		if (packet.equals(SILENCE_FRAME) || !canDecrypt) return packet;
		try {
			const buffer = this.session.decrypt(userId, Davey.MediaType.AUDIO, packet);
			this.consecutiveFailures = 0;
			return buffer;
		} catch (error) {
			if (!this.reinitializing && !this.pendingTransition) {
				this.consecutiveFailures++;
				this.emit('debug', `Failed to decrypt a packet (${this.consecutiveFailures} consecutive fails)`);
				if (this.consecutiveFailures > DEFAULT_DECRYPTION_FAILURE_TOLERANCE) {
					if (this.lastTransitionId) this.recoverFromInvalidTransition(this.lastTransitionId);
					else throw error;
				}
			} else if (this.reinitializing) {
				this.emit('debug', 'Failed to decrypt a packet (reinitializing session)');
			} else if (this.pendingTransition) {
				this.emit(
					'debug',
					`Failed to decrypt a packet (pending transition ${this.pendingTransition.transition_id} to v${this.pendingTransition.protocol_version})`,
				);
			}
		}

		return null;
	}

	/**
	 * Resets the session.
	 */
	public destroy() {
		try {
			this.session.reset();
		} catch {}
	}
}
