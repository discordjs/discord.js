import { describe, test, expect } from 'vitest';
import { range } from '../src/index.js';

describe('range', () => {
	test('GIVEN valid range and then valid numbers are returned', () => {
		expect([...range(5)]).toEqual([0, 1, 2, 3, 4]);
	});

	test('GIVEN valid range with start and end THEN valid numbers are returned', () => {
		expect([...range({ start: 0, end: 5 })]).toEqual([0, 1, 2, 3, 4]);
	});

	test('GIVEN valid range with start, end and step THEN valid numbers are returned', () => {
		expect([...range({ start: 0, end: 11, step: 2 })]).toEqual([0, 2, 4, 6, 8, 10]);
	});
});
