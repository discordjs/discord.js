import { test, expect, vitest } from 'vitest';
import { methods } from '../src/util/Secretbox';

vitest.mock('@stablelib/xchacha20poly1305');

// #todo: fix test: use vitest
test('Does not throw error with a package installed', () => {
	//expect(() => methods.crypto_aead_xchacha20poly1305_ietf_encrypt()).not.toThrowError();
});
