import { Blob } from 'node:buffer';
import { test, expect } from 'vitest';
import { resolveBody, parseHeader } from '../src/lib/utils/utils';

test('GIVEN string parseHeader returns string', () => {
	const header = 'application/json';

	expect(parseHeader(header)).toEqual(header);
});

test('GIVEN string[] parseHeader returns string', () => {
	const header = ['application/json', 'wait sorry I meant text/html'];

	expect(parseHeader(header)).toEqual(header.join(';'));
});

test('GIVEN undefined parseHeader return undefined', () => {
	expect(parseHeader(undefined)).toBeUndefined();
});

test('resolveBody', async () => {
	await expect(resolveBody(null)).resolves.toEqual(null);
	await expect(resolveBody(undefined)).resolves.toEqual(null);
	await expect(resolveBody('Hello')).resolves.toEqual('Hello');
	await expect(resolveBody(new Uint8Array([1, 2, 3]))).resolves.toStrictEqual(new Uint8Array([1, 2, 3]));
	// ArrayBuffers gets resolved to Uint8Array
	await expect(resolveBody(new ArrayBuffer(8))).resolves.toStrictEqual(new Uint8Array(new ArrayBuffer(8)));

	const urlSearchParams = new URLSearchParams([['a', 'b']]);
	await expect(resolveBody(urlSearchParams)).resolves.toEqual(urlSearchParams.toString());

	const dataView = new DataView(new ArrayBuffer(8));
	await expect(resolveBody(dataView)).resolves.toStrictEqual(new Uint8Array(new ArrayBuffer(8)));

	const blob = new Blob(['hello']);
	await expect(resolveBody(blob)).resolves.toStrictEqual(new Uint8Array(await blob.arrayBuffer()));

	const iterable: Iterable<Uint8Array> = {
		*[Symbol.iterator]() {
			for (let i = 0; i < 3; i++) {
				yield new Uint8Array([1, 2, 3]);
			}
		},
	};
	await expect(resolveBody(iterable)).resolves.toStrictEqual(new Uint8Array([1, 2, 3, 1, 2, 3, 1, 2, 3]));

	const asyncIterable: AsyncIterable<Uint8Array> = {
		[Symbol.asyncIterator]() {
			let i = 0;
			return {
				next() {
					if (i < 3) {
						i++;
						return Promise.resolve({ value: new Uint8Array([1, 2, 3]), done: false });
					}

					return Promise.resolve({ value: undefined, done: true });
				},
			};
		},
	};
	await expect(resolveBody(asyncIterable)).resolves.toStrictEqual(Buffer.from([1, 2, 3, 1, 2, 3, 1, 2, 3]));

	// unknown type
	// @ts-expect-error This test is ensuring that this throws
	await expect(resolveBody(true)).rejects.toThrow(TypeError);
});
