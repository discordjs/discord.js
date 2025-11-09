/* eslint-disable unicorn/consistent-function-scoping */
import { describe, test, expect } from 'vitest';
import type { GetRateLimitOffsetFunction, GetRetryBackoffFunction, GetTimeoutFunction } from '../src/index.js';
import { makeURLSearchParams } from '../src/index.js';
import { normalizeRateLimitOffset, normalizeRetryBackoff, normalizeTimeout } from '../src/lib/utils/utils.js';

describe('makeURLSearchParams', () => {
	test('GIVEN undefined THEN returns empty URLSearchParams', () => {
		const params = makeURLSearchParams();

		expect([...params.entries()]).toEqual([]);
	});

	test('GIVEN empty object THEN returns empty URLSearchParams', () => {
		const params = makeURLSearchParams({});

		expect([...params.entries()]).toEqual([]);
	});

	test('GIVEN a record of strings THEN returns URLSearchParams with strings', () => {
		const params = makeURLSearchParams({ foo: 'bar', hello: 'world' });

		expect([...params.entries()]).toEqual([
			['foo', 'bar'],
			['hello', 'world'],
		]);
	});

	test('GIVEN a record of strings with nullish values THEN returns URLSearchParams without nullish values', () => {
		const params = makeURLSearchParams({ foo: 'bar', hello: null, one: undefined });

		expect([...params.entries()]).toEqual([['foo', 'bar']]);
	});

	test('GIVEN a record of non-string values THEN returns URLSearchParams with string values', () => {
		const params = makeURLSearchParams({ life: 42, big: 100n, bool: true });

		expect([...params.entries()]).toEqual([
			['life', '42'],
			['big', '100'],
			['bool', 'true'],
		]);
	});

	describe('objects', () => {
		test('GIVEN a record of date values THEN URLSearchParams with ISO string values', () => {
			const params = makeURLSearchParams({ before: new Date('2022-04-04T15:43:05.108Z'), after: new Date(Number.NaN) });

			expect([...params.entries()]).toEqual([['before', '2022-04-04T15:43:05.108Z']]);
		});

		test('GIVEN a record of plain object values THEN returns empty URLSearchParams', () => {
			const params = makeURLSearchParams({ foo: {}, hello: { happy: true } });

			expect([...params.entries()]).toEqual([]);
		});

		test('GIVEN a record of objects with overridden toString THEN returns non-empty URLSearchParams', () => {
			const params = makeURLSearchParams({ foo: { toString: () => 'bar' } });

			expect([...params.entries()]).toEqual([['foo', 'bar']]);
		});
	});

	describe('types', () => {
		interface TestInput {
			foo: string;
		}

		test("GIVEN object without index signature THEN TypeScript doesn't raise a type error", () => {
			// Previously, `makeURLSearchParams` used `Record<string, unknown>` as an input, but that meant that it
			// couldn't accept most interfaces, since they don't have an index signature. This test is to make sure
			// non-Records can be used without casting.

			const input = { foo: 'bar' } as TestInput;
			const params = makeURLSearchParams(input);

			expect([...params.entries()]).toEqual([['foo', 'bar']]);
		});

		test("GIVEN readonly object on a non-readonly generic type THEN TypeScript doesn't raise a type error", () => {
			// While `Readonly<T>` type was always accepted in `makeURLSearchParams`, this test is to ensure that we can
			// use the generic type and accept `Readonly<T>` rather than only [possibly] mutable `T`.

			const input = Object.freeze({ foo: 'bar' } as TestInput);
			const params = makeURLSearchParams<TestInput>(input);

			expect([...params.entries()]).toEqual([['foo', 'bar']]);
		});
	});
});

describe('option normalization functions', () => {
	describe('rate limit offset', () => {
		const func: GetRateLimitOffsetFunction = (route) => {
			if (route === '/negative') return -150;
			if (route === '/high') return 150;
			return 50;
		};

		test('offset as number', () => {
			expect(normalizeRateLimitOffset(-150, '/negative')).toEqual(0);
			expect(normalizeRateLimitOffset(150, '/high')).toEqual(150);
			expect(normalizeRateLimitOffset(50, '/normal')).toEqual(50);
		});

		test('offset as function', () => {
			expect(normalizeRateLimitOffset(func, '/negative')).toEqual(0);
			expect(normalizeRateLimitOffset(func, '/high')).toEqual(150);
			expect(normalizeRateLimitOffset(func, '/normal')).toEqual(50);
		});
	});

	describe('retry backoff', () => {
		const body = {
			content: 'yo',
		};
		const func: GetRetryBackoffFunction = (_route, statusCode, retryCount) => {
			if (statusCode === null) return 0;
			if (statusCode === 502) return 50;
			if (retryCount === 0) return 0;
			if (retryCount === 1) return 150;
			if (retryCount === 2) return 500;
			return null;
		};

		test('retry backoff as number', () => {
			expect(normalizeRetryBackoff(0, '/test', null, 0, body)).toEqual(0);
			expect(normalizeRetryBackoff(0, '/test', null, 1, body)).toEqual(0);
			expect(normalizeRetryBackoff(0, '/test', null, 2, body)).toEqual(0);
			expect(normalizeRetryBackoff(50, '/test', null, 0, body)).toEqual(50);
			expect(normalizeRetryBackoff(50, '/test', null, 1, body)).toEqual(100);
			expect(normalizeRetryBackoff(50, '/test', null, 2, body)).toEqual(200);
		});

		test('retry backoff as function', () => {
			expect(normalizeRetryBackoff(func, '/test', null, 0, body)).toEqual(0);
			expect(normalizeRetryBackoff(func, '/test', 502, 0, body)).toEqual(50);
			expect(normalizeRetryBackoff(func, '/test', 500, 0, body)).toEqual(0);
			expect(normalizeRetryBackoff(func, '/test', 500, 1, body)).toEqual(150);
			expect(normalizeRetryBackoff(func, '/test', 500, 2, body)).toEqual(500);
			expect(normalizeRetryBackoff(func, '/test', 500, 3, body)).toEqual(null);
		});
	});

	describe('timeout', () => {
		const body1 = {
			attachments: [{ id: 1 }],
		};
		const body2 = {
			content: 'yo',
		};
		const func: GetTimeoutFunction = (route, body) => {
			if (
				typeof body === 'object' &&
				body &&
				'attachments' in body &&
				Array.isArray(body.attachments) &&
				body.attachments.length
			) {
				return 1_000;
			}

			if (route === '/negative') return -150;
			if (route === '/high') return 150;
			return 50;
		};

		test('timeout as number', () => {
			expect(normalizeTimeout(-150, '/negative', body1)).toEqual(0);
			expect(normalizeTimeout(150, '/high', body1)).toEqual(150);
			expect(normalizeTimeout(50, '/normal', body1)).toEqual(50);
		});

		test('timeout as function', () => {
			expect(normalizeTimeout(func, '/negative', body1)).toEqual(1_000);
			expect(normalizeTimeout(func, '/negative', body2)).toEqual(0);
			expect(normalizeTimeout(func, '/high', body2)).toEqual(150);
			expect(normalizeTimeout(func, '/normal', body2)).toEqual(50);
		});
	});
});
