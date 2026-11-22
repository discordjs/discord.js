import { describe, test, expect } from 'vitest';
import { z } from 'zod';
import {
	enableValidators,
	disableValidators,
	isValidationEnabled,
	normalizeArray,
	ValidationError,
} from '../src/index.js';
import { validate } from '../src/util/validation.js';

describe('validation', () => {
	test('enables validation', () => {
		enableValidators();
		expect(isValidationEnabled()).toBeTruthy();
	});

	test('disables validation', () => {
		disableValidators();
		expect(isValidationEnabled()).toBeFalsy();
	});

	test('validation error', () => {
		try {
			validate(z.never(), 1, true);
			throw new Error('validation should have failed');
		} catch (error) {
			expect(error).toBeInstanceOf(ValidationError);
			expect((error as ValidationError).message).toBe('✖ Invalid input: expected never, received number');
			expect((error as ValidationError).cause).toBeInstanceOf(z.ZodError);
		}
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
