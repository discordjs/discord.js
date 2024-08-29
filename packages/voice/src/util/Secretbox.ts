import { Buffer } from 'node:buffer';

interface Methods {
	close(opusPacket: Buffer, nonce: Buffer, secretKey: Uint8Array): Buffer;
	open(buffer: Buffer, nonce: Buffer, secretKey: Uint8Array): Buffer | null;
	random(bytes: number, nonce: Buffer): Buffer;

	crypto_aead_xchacha20poly1305_ietf_encrypt(
		plaintext: Buffer,
		additionalData: Buffer,
		nonce: Buffer,
		key: ArrayBufferLike,
	): Buffer;
	crypto_aead_xchacha20poly1305_ietf_decrypt(
		cipherText: Buffer,
		additionalData: Buffer,
		nonce: Buffer,
		key: ArrayBufferLike,
	): Buffer;
}

const libs = {
	'sodium-native': (sodium: any): Methods => ({
		open: (buffer: Buffer, nonce: Buffer, secretKey: Uint8Array) => {
			if (buffer) {
				const output = Buffer.allocUnsafe(buffer.length - sodium.crypto_box_MACBYTES);
				if (sodium.crypto_secretbox_open_easy(output, buffer, nonce, secretKey)) return output;
			}

			return null;
		},
		close: (opusPacket: Buffer, nonce: Buffer, secretKey: Uint8Array) => {
			const output = Buffer.allocUnsafe(opusPacket.length + sodium.crypto_box_MACBYTES);
			sodium.crypto_secretbox_easy(output, opusPacket, nonce, secretKey);
			return output;
		},
		random: (num: number, buffer: Buffer = Buffer.allocUnsafe(num)) => {
			sodium.randombytes_buf(buffer);
			return buffer;
		},

		crypto_aead_xchacha20poly1305_ietf_encrypt: (
			plaintext: Buffer,
			additionalData: Buffer,
			nonce: Buffer,
			key: ArrayBufferLike,
		) => {
			const cipherText = Buffer.alloc(plaintext.length + sodium.crypto_aead_xchacha20poly1305_ietf_ABYTES);
			sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(cipherText, plaintext, additionalData, null, nonce, key);
			return cipherText;
		},
		crypto_aead_xchacha20poly1305_ietf_decrypt: (
			cipherText: Buffer,
			additionalData: Buffer,
			nonce: Buffer,
			key: ArrayBufferLike,
		) => {
			const message = Buffer.alloc(cipherText.length - sodium.crypto_aead_xchacha20poly1305_ietf_ABYTES);
			sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(message, null, cipherText, additionalData, nonce, key);
			return message;
		},
	}),
	sodium: (sodium: any): Methods => ({
		open: sodium.api.crypto_secretbox_open_easy,
		close: sodium.api.crypto_secretbox_easy,
		random: (num: number, buffer: Buffer = Buffer.allocUnsafe(num)) => {
			sodium.api.randombytes_buf(buffer);
			return buffer;
		},

		crypto_aead_xchacha20poly1305_ietf_encrypt: (
			plaintext: Buffer,
			additionalData: Buffer,
			nonce: Buffer,
			key: ArrayBufferLike,
		) => {
			return sodium.api.crypto_aead_xchacha20poly1305_ietf_encrypt(plaintext, additionalData, null, nonce, key);
		},
		crypto_aead_xchacha20poly1305_ietf_decrypt: (
			cipherText: Buffer,
			additionalData: Buffer,
			nonce: Buffer,
			key: ArrayBufferLike,
		) => {
			return sodium.api.crypto_aead_xchacha20poly1305_ietf_decrypt(cipherText, additionalData, null, nonce, key);
		},
	}),
	'libsodium-wrappers': (sodium: any): Methods => ({
		open: sodium.crypto_secretbox_open_easy,
		close: sodium.crypto_secretbox_easy,
		random: sodium.randombytes_buf,

		crypto_aead_xchacha20poly1305_ietf_encrypt: (
			plaintext: Buffer,
			additionalData: Buffer,
			nonce: Buffer,
			key: ArrayBufferLike,
		) => {
			return sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(plaintext, additionalData, null, nonce, key);
		},
		crypto_aead_xchacha20poly1305_ietf_decrypt: (
			cipherText: Buffer,
			additionalData: Buffer,
			nonce: Buffer,
			key: ArrayBufferLike,
		) => {
			return sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(null, cipherText, additionalData, nonce, key);
		},
	}),
	'@stablelib/xchacha20poly1305': (stablelib: any): Methods => ({
		// functions below don't actually exist i just need them here until i remove open/close/random since they arent needed anymore
		open: stablelib.open,
		close: stablelib.secretbox,
		random: stablelib.randomBytes,

		crypto_aead_xchacha20poly1305_ietf_encrypt(cipherText, additionalData, nonce, key) {
			const crypto = new stablelib.XChaCha20Poly1305(key);
			return crypto.seal(nonce, cipherText, additionalData);
		},
		crypto_aead_xchacha20poly1305_ietf_decrypt(plaintext, additionalData, nonce, key) {
			const crypto = new stablelib.XChaCha20Poly1305(key);
			return crypto.open(nonce, plaintext, additionalData);
		},
	}),
} as const;

const fallbackError = () => {
	throw new Error(
		`Cannot play audio as no valid encryption package is installed.
- Install sodium, libsodium-wrappers, or @stablelib/xchacha20poly1305.
- Use the generateDependencyReport() function for more information.\n`,
	);
};

const methods: Methods = {
	open: fallbackError,
	close: fallbackError,
	random: fallbackError,

	crypto_aead_xchacha20poly1305_ietf_encrypt: fallbackError,
	crypto_aead_xchacha20poly1305_ietf_decrypt: fallbackError,
};

void (async () => {
	for (const libName of Object.keys(libs) as (keyof typeof libs)[]) {
		try {
			// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
			const lib = await import(libName);
			if (libName === 'libsodium-wrappers' && lib.ready) await lib.ready;
			Object.assign(methods, libs[libName](lib));
			break;
		} catch (e) {
			console.log(e);
		}
	}
})();

export { methods };
