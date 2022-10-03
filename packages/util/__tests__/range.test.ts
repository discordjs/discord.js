import { describe, test, expect } from 'vitest';
import { range } from '../src/index.js';

describe('range', () => {
	test('GIVEN valid range THEN valid array is returned', () => {
		expect(range(0, 5)).toEqual([0, 1, 2, 3, 4, 5]);
	});

	test('GIVEN valid range with step THEN valid array is returned', () => {
		expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8, 10]);
	});
});
