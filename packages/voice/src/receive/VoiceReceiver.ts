/* eslint-disable jsdoc/check-param-names */

import { Buffer } from 'node:buffer';
import crypto from 'node:crypto';
import type { VoiceReceivePayload } from 'discord-api-types/voice/v8';
import { VoiceOpcodes } from 'discord-api-types/voice/v8';
import { VoiceConnectionStatus, type VoiceConnection } from '../VoiceConnection';
import { NetworkingStatusCode, type ConnectionData } from '../networking/Networking';
import { methods } from '../util/Secretbox';
import {
	AudioReceiveStream,
	createDefaultAudioReceiveStreamOptions,
	type AudioReceiveStreamOptions,
} from './AudioReceiveStream';
import { SSRCMap } from './SSRCMap';
import { SpeakingMap } from './SpeakingMap';

const HEADER_EXTENSION_BYTE = Buffer.from([0xbe, 0xde]);
const UNPADDED_NONCE_LENGTH = 4;
const AUTH_TAG_LENGTH = 16;

/**
 * Attaches to a VoiceConnection, allowing you to receive audio packets from other
 * users that are speaking.
 *
 * @beta
 */
export class VoiceReceiver {
	/**
	 * The attached connection of this receiver.
	 */
	public readonly voiceConnection;

	/**
	 * Maps SSRCs to Discord user ids.
	 */
	public readonly ssrcMap: SSRCMap;

	/**
	 * The current audio subscriptions of this receiver.
	 */
	public readonly subscriptions: Map<string, AudioReceiveStream>;

	/**
	 * The connection data of the receiver.
	 *
	 * @internal
	 */
	public connectionData: Partial<ConnectionData>;

	/**
	 * The speaking map of the receiver.
	 */
	public readonly speaking: SpeakingMap;

	public constructor(voiceConnection: VoiceConnection) {
		this.voiceConnection = voiceConnection;
		this.ssrcMap = new SSRCMap();
		this.speaking = new SpeakingMap();
		this.subscriptions = new Map();
		this.connectionData = {};

		this.onWsPacket = this.onWsPacket.bind(this);
		this.onUdpMessage = this.onUdpMessage.bind(this);
	}

	/**
	 * Called when a packet is received on the attached connection's WebSocket.
	 *
	 * @param packet - The received packet
	 * @internal
	 */
	public onWsPacket(packet: VoiceReceivePayload) {
		if (packet.op === VoiceOpcodes.ClientDisconnect) {
			this.ssrcMap.delete(packet.d.user_id);
		} else if (packet.op === VoiceOpcodes.Speaking) {
			this.ssrcMap.update({ userId: packet.d.user_id, audioSSRC: packet.d.ssrc });
		}
	}

	private decrypt(buffer: Buffer, mode: string, nonce: Buffer, secretKey: Uint8Array) {
		// Copy the last 4 bytes of unpadded nonce to the padding of (12 - 4) or (24 - 4) bytes
		buffer.copy(nonce, 0, buffer.length - UNPADDED_NONCE_LENGTH);

		let headerSize = 12;
		const first = buffer.readUint8();
		if ((first >> 4) & 0x01) headerSize += 4;

		// The unencrypted RTP header contains 12 bytes, HEADER_EXTENSION and the extension size
		const header = buffer.subarray(0, headerSize);

		// Encrypted contains the extension, if any, the opus packet, and the auth tag
		const encrypted = buffer.subarray(headerSize, buffer.length - AUTH_TAG_LENGTH - UNPADDED_NONCE_LENGTH);
		const authTag = buffer.subarray(
			buffer.length - AUTH_TAG_LENGTH - UNPADDED_NONCE_LENGTH,
			buffer.length - UNPADDED_NONCE_LENGTH,
		);

		switch (mode) {
			case 'aead_aes256_gcm_rtpsize': {
				const decipheriv = crypto.createDecipheriv('aes-256-gcm', secretKey, nonce);
				decipheriv.setAAD(header);
				decipheriv.setAuthTag(authTag);

				return Buffer.concat([decipheriv.update(encrypted), decipheriv.final()]);
			}

			case 'aead_xchacha20_poly1305_rtpsize': {
				// Combined mode expects authtag in the encrypted message
				return Buffer.from(
					methods.crypto_aead_xchacha20poly1305_ietf_decrypt(
						Buffer.concat([encrypted, authTag]),
						header,
						nonce,
						secretKey,
					),
				);
			}

			default: {
				throw new RangeError(`Unsupported decryption method: ${mode}`);
			}
		}
	}

	/**
	 * Parses an audio packet, decrypting it to yield an Opus packet.
	 *
	 * @param buffer - The buffer to parse
	 * @param mode - The encryption mode
	 * @param nonce - The nonce buffer used by the connection for encryption
	 * @param secretKey - The secret key used by the connection for encryption
	 * @param userId - The user id that sent the packet
	 * @returns The parsed Opus packet
	 */
	private parsePacket(buffer: Buffer, mode: string, nonce: Buffer, secretKey: Uint8Array, userId: string) {
		let packet: Buffer = this.decrypt(buffer, mode, nonce, secretKey);
		if (!packet) throw new Error('Failed to parse packet');

		// Strip decrypted RTP Header Extension if present
		// The header is only indicated in the original data, so compare with buffer first
		if (buffer.subarray(12, 14).compare(HEADER_EXTENSION_BYTE) === 0) {
			const headerExtensionLength = buffer.subarray(14).readUInt16BE();
			packet = packet.subarray(4 * headerExtensionLength);
		}

		// Decrypt packet if in a DAVE session.
		if (
			this.voiceConnection.state.status === VoiceConnectionStatus.Ready &&
			(this.voiceConnection.state.networking.state.code === NetworkingStatusCode.Ready ||
				this.voiceConnection.state.networking.state.code === NetworkingStatusCode.Resuming)
		) {
			const daveSession = this.voiceConnection.state.networking.state.dave;
			if (daveSession) packet = daveSession.decrypt(packet, userId)!;
		}

		return packet;
	}

	/**
	 * Called when the UDP socket of the attached connection receives a message.
	 *
	 * @param msg - The received message
	 * @internal
	 */
	public onUdpMessage(msg: Buffer) {
		if (msg.length <= 8) return;
		const ssrc = msg.readUInt32BE(8);

		const userData = this.ssrcMap.get(ssrc);
		if (!userData) return;

		this.speaking.onPacket(userData.userId);

		const stream = this.subscriptions.get(userData.userId);
		if (!stream) return;

		if (this.connectionData.encryptionMode && this.connectionData.nonceBuffer && this.connectionData.secretKey) {
			try {
				const packet = this.parsePacket(
					msg,
					this.connectionData.encryptionMode,
					this.connectionData.nonceBuffer,
					this.connectionData.secretKey,
					userData.userId,
				);
				if (packet) stream.push(packet);
			} catch (error) {
				stream.destroy(error as Error);
			}
		}
	}

	/**
	 * Creates a subscription for the given user id.
	 *
	 * @param target - The id of the user to subscribe to
	 * @returns A readable stream of Opus packets received from the target
	 */
	public subscribe(userId: string, options?: Partial<AudioReceiveStreamOptions>) {
		const existing = this.subscriptions.get(userId);
		if (existing) return existing;

		const stream = new AudioReceiveStream({
			...createDefaultAudioReceiveStreamOptions(),
			...options,
		});

		stream.once('close', () => this.subscriptions.delete(userId));
		this.subscriptions.set(userId, stream);
		return stream;
	}
}
