import { describe, test, expect } from 'vitest';
import { makeURLSearchParams } from '../src/index.js';

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
});
