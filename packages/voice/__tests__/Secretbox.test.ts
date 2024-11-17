import { test, expect, vitest } from 'vitest';
import { methods, secretboxLoadPromise } from '../src/util/Secretbox';

vitest.mock('@noble/ciphers/chacha');

// TODO: what is this even testing exactly?
test.skip('Does not throw error with a package installed', async () => {
	// The async loop in Secretbox will not have finished importing unless we wait
	await secretboxLoadPromise;

	expect(() => methods.crypto_aead_xchacha20poly1305_ietf_decrypt()).not.toThrowError();
});
