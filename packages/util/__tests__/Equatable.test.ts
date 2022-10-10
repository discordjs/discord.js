import { describe, test, expect } from 'vitest';
import { isEquatable } from '../src/index.js';

describe('isEquatable', () => {
	test('returns true if the object is equatable', () => {
		expect(isEquatable({ equals: () => true })).toBeTruthy();
	});

	test('returns false if the object is not equatable', () => {
		expect(isEquatable({})).toBeFalsy();
		expect(isEquatable(null)).toBeFalsy();
		expect(isEquatable(undefined)).toBeFalsy();
		expect(isEquatable(1)).toBeFalsy();
		expect(isEquatable('')).toBeFalsy();
		expect(isEquatable([])).toBeFalsy();
		expect(isEquatable(() => {})).toBeFalsy();
	});
});
