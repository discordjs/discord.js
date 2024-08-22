import { describe, test, expect } from 'vitest';
import { enableValidators, disableValidators, isValidationEnabled, normalizeArray } from '../src/index.js';

describe('validation', () => {
	test('enables validation', () => {
		enableValidators();
		expect(isValidationEnabled()).toBeTruthy();
	});

	test('disables validation', () => {
		disableValidators();
		expect(isValidationEnabled()).toBeFalsy();
	});
});

describe('normalizeArray', () => {
	test('normalizes an array or array (when input is an array)', () => {
		expect(normalizeArray([[1, 2, 3]])).toEqual([1, 2, 3]);
	});

	test('normalizes an array (when input is rest parameter)', () => {
		expect(normalizeArray([1, 2, 3])).toEqual([1, 2, 3]);
	});

	test('always returns a clone', () => {
		const arr = [1, 2, 3];
		expect(normalizeArray([arr])).toEqual(arr);
		expect(normalizeArray([arr])).not.toBe(arr);
	});
});
