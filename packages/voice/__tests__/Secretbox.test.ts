import { test, expect, vitest } from 'vitest';
import { methods } from '../src/util/Secretbox';

async function wait(ms: number) {
	/* eslint-disable no-promise-executor-return */
	return new Promise((resolve) => setTimeout(resolve, ms));
}

vitest.mock('@stablelib/xchacha20poly1305');

test('Does not throw error with a package installed', async () => {
	// The async loop in Secretbox will not have finished importing unless we wait
	await wait(100);

	expect(() => methods.crypto_aead_xchacha20poly1305_ietf_decrypt()).not.toThrowError();
});
