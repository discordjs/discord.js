import { describe, test, expect } from 'vitest';
import {
	isJSONEncodable,
	isEquatable,
	ActionRowBuilder,
	enableValidators,
	disableValidators,
	isValidationEnabled,
} from '../src/index';

describe('isEquatable', () => {
	test('returns true if the object is equatable', () => {
		expect(isEquatable({ equals: () => true })).toBeTruthy();
	});

	test('returns false if the object is not equatable', () => {
		expect(isEquatable({})).toBeFalsy();
	});
});

describe('isJSONEncodable', () => {
	test('returns true if the object is JSON encodable', () => {
		expect(isJSONEncodable({ toJSON: () => ({}) })).toBeTruthy();
		expect(isJSONEncodable(new ActionRowBuilder())).toBeTruthy();
	});

	test('returns false if the object is not JSON encodable', () => {
		expect(isJSONEncodable({})).toBeFalsy();
	});
});

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
