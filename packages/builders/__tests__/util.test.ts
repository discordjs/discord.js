import { describe, test, expect } from 'vitest';
import { enableValidators, disableValidators, isValidationEnabled } from '../src/index.js';

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
