import { methods } from '../src/util/Secretbox.js';

jest.mock('tweetnacl');

test('Does not throw error with a package installed', () => {
	// @ts-expect-error unknown type
	expect(() => methods.open()).not.toThrowError();
});
