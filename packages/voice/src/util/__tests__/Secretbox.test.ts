import { methods } from '../Secretbox';
jest.mock(
	'tweetnacl',
	() => ({
		secretbox: {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			open() {},
		},
	}),
	{ virtual: true },
);

test('Does not throw error with a package installed', () => {
	// @ts-expect-error
	expect(() => methods.open()).not.toThrowError();
});
