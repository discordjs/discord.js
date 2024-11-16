import { test, expect, vitest } from 'vitest';
import { methods } from '../src/util/Secretbox';

vitest.mock('tweetnacl');

test('Does not throw error with a package installed', () => {
	// @ts-expect-error We are testing
	expect(() => methods.open()).toThrow(TypeError);
});
