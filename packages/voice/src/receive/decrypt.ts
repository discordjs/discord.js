import { Buffer } from 'node:buffer';
import crypto from 'node:crypto';
import { methods } from '../util/Secretbox';

const UNPADDED_NONCE_LENGTH = 4;
const AUTH_TAG_LENGTH = 16;

/**
 * One-byte RTP header extension identifier (RFC 8285).
 */
export const HEADER_EXTENSION_BYTE = Buffer.from([0xbe, 0xde]);

/**
 * Computes the size of the unencrypted RTP header for a packet using the
 * "rtp_size" encryption modes. The unencrypted header consists of the fixed
 * RTP header (12 bytes), the CSRC identifiers, and the extension preamble
 * (4 bytes) when present, mirroring SRTP's notion of the unencrypted header.
 *
 * @param buffer - The encrypted packet
 */
export function unencryptedHeaderSize(buffer: Buffer): number {
	const first = buffer.readUint8();
	const cc = first & 0x0f; // CSRC Count field
	let headerSize = 12 + 4 * cc;
	if ((first >> 4) & 0x01) headerSize += 4; // extension header (profile ID + length)

	return headerSize;
}

/**
 * Decrypts the payload of an RTP packet encrypted with one of Discord's AEAD
 * transport encryption modes.
 *
 * @remarks
 * The 4-byte nonce is appended at the end of the packet, after the auth tag.
 * @param buffer - The encrypted packet (header + ciphertext + auth tag + nonce)
 * @param mode - The encryption mode in use
 * @param nonce - A scratch buffer (at least 4 bytes) used to hold the nonce
 * @param secretKey - The transport secret key of the connection
 * @param headerSize - The size of the unencrypted RTP header, computed from the packet if omitted
 * @returns The decrypted packet (possibly still containing the RTP header extension body)
 */
export function decryptRtpPayload(
	buffer: Buffer,
	mode: string,
	nonce: Buffer,
	secretKey: Uint8Array,
	headerSize = unencryptedHeaderSize(buffer),
): Buffer {
	// Copy the last 4 bytes of unpadded nonce to the padding of (12 - 4) or (24 - 4) bytes
	buffer.copy(nonce, 0, buffer.length - UNPADDED_NONCE_LENGTH);

	// The unencrypted RTP header
	const header = buffer.subarray(0, headerSize);

	// Encrypted contains the extension, if any, the payload, and the auth tag
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
 * Strips RTP padding from a decrypted packet (RFC 3550 5.1).
 *
 * @param packet - The decrypted packet
 * @param original - The original (encrypted) packet, used to read the padding flag
 * @returns The packet without padding
 */
export function stripRtpPadding(packet: Buffer, original: Buffer): Buffer {
	const hasPadding = original[0] && Boolean(original[0] & 0b100000);
	if (!hasPadding) return packet;

	const paddingAmount = packet[packet.length - 1]!;
	if (paddingAmount < packet.length) {
		return packet.subarray(0, packet.length - paddingAmount);
	}

	return packet;
}

/**
 * Strips the (decrypted) RTP header extension body from a decrypted packet, if
 * the original packet contained one.
 *
 * @param packet - The decrypted packet
 * @param original - The original (encrypted) packet, used to detect the extension
 * @returns The packet without the extension body
 */
export function stripExtensionBody(packet: Buffer, original: Buffer): Buffer {
	const first = original.readUint8();
	if (!((first >> 4) & 0x01)) return packet;

	// The extension header follows the fixed header and the CSRC identifiers
	const extensionHeaderOffset = 12 + 4 * (first & 0x0f);
	const headerExtensionLength = original.readUInt16BE(extensionHeaderOffset + 2);
	return packet.subarray(4 * headerExtensionLength);
}
