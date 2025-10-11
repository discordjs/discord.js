import { Buffer } from 'node:buffer';

interface Methods {
	crypto_aead_xchacha20poly1305_ietf_decrypt(
		cipherText: Buffer,
		additionalData: Buffer,
		nonce: Buffer,
		key: Uint8Array,
	): Buffer;
	crypto_aead_xchacha20poly1305_ietf_encrypt(
		plaintext: Buffer,
		additionalData: Buffer,
		nonce: Buffer,
		key: Uint8Array,
	): Buffer;
}

const libs = {
	'sodium-native': (sodium: any): Methods => ({
		crypto_aead_xchacha20poly1305_ietf_decrypt: (
			cipherText: Buffer,
			additionalData: Buffer,
			nonce: Buffer,
			key: Uint8Array,
		) => {
			const message = Buffer.alloc(cipherText.length - sodium.crypto_aead_xchacha20poly1305_ietf_ABYTES);
			sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(message, null, cipherText, additionalData, nonce, key);
			return message;
		},
		crypto_aead_xchacha20poly1305_ietf_encrypt: (
			plaintext: Buffer,
			additionalData: Buffer,
			nonce: Buffer,
			key: Uint8Array,
		) => {
			const cipherText = Buffer.alloc(plaintext.length + sodium.crypto_aead_xchacha20poly1305_ietf_ABYTES);
			sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(cipherText, plaintext, additionalData, null, nonce, key);
			return cipherText;
		},
	}),
	sodium: (sodium: any): Methods => ({
		crypto_aead_xchacha20poly1305_ietf_decrypt: (
			cipherText: Buffer,
			additionalData: Buffer,
			nonce: Buffer,
			key: Uint8Array,
		) => sodium.api.crypto_aead_xchacha20poly1305_ietf_decrypt(cipherText, additionalData, null, nonce, key),
		crypto_aead_xchacha20poly1305_ietf_encrypt: (
			plaintext: Buffer,
			additionalData: Buffer,
			nonce: Buffer,
			key: Uint8Array,
		) => sodium.api.crypto_aead_xchacha20poly1305_ietf_encrypt(plaintext, additionalData, null, nonce, key),
	}),
	'libsodium-wrappers': (sodium: any): Methods => ({
		crypto_aead_xchacha20poly1305_ietf_decrypt: (
			cipherText: Buffer,
			additionalData: Buffer,
			nonce: Buffer,
			key: Uint8Array,
		) => sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(null, cipherText, additionalData, nonce, key),
		crypto_aead_xchacha20poly1305_ietf_encrypt: (
			plaintext: Buffer,
			additionalData: Buffer,
			nonce: Buffer,
			key: Uint8Array,
		) => sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(plaintext, additionalData, null, nonce, key),
	}),
	'@stablelib/xchacha20poly1305': (stablelib: any): Methods => ({
		crypto_aead_xchacha20poly1305_ietf_decrypt(plaintext, additionalData, nonce, key) {
			const crypto = new stablelib.XChaCha20Poly1305(key);
			return crypto.open(nonce, plaintext, additionalData);
		},
		crypto_aead_xchacha20poly1305_ietf_encrypt(cipherText, additionalData, nonce, key) {
			const crypto = new stablelib.XChaCha20Poly1305(key);
			return crypto.seal(nonce, cipherText, additionalData);
		},
	}),
	'@noble/ciphers/chacha': (noble: any): Methods => ({
		crypto_aead_xchacha20poly1305_ietf_decrypt(cipherText, additionalData, nonce, key) {
			const chacha = noble.xchacha20poly1305(key, nonce, additionalData);
			return chacha.decrypt(cipherText);
		},
		crypto_aead_xchacha20poly1305_ietf_encrypt(plaintext, additionalData, nonce, key) {
			const chacha = noble.xchacha20poly1305(key, nonce, additionalData);
			return chacha.encrypt(plaintext);
		},
	}),
} as const;

const fallbackError = () => {
	throw new Error(
		`Cannot play audio as no valid encryption package is installed.
- Install one of:
  - sodium
  - libsodium-wrappers
  - @stablelib/xchacha20poly1305
  - @noble/ciphers.
- Use the generateDependencyReport() function for more information.\n`,
	);
};

const methods: Methods = {
	crypto_aead_xchacha20poly1305_ietf_encrypt: fallbackError,
	crypto_aead_xchacha20poly1305_ietf_decrypt: fallbackError,
};

// eslint-disable-next-line no-async-promise-executor
export const secretboxLoadPromise = new Promise<void>(async (resolve) => {
	for (const libName of Object.keys(libs) as (keyof typeof libs)[]) {
		try {
			const lib = await import(libName);

			if (libName === 'libsodium-wrappers' && lib.ready) {
				await lib.ready;
			}

			Object.assign(methods, libs[libName](lib));

			break;
		} catch {}
	}

	resolve();
});

export { methods };
