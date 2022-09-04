import { describe, test, expect } from 'vitest';
import { isJSONEncodable, type JSONEncodable } from '../src/index.js';

class Encodable implements JSONEncodable<{}> {
	public toJSON() {
		return {};
	}
}

describe('isJSONEncodable', () => {
	test('returns true if the object is JSON encodable', () => {
		expect(isJSONEncodable({ toJSON: () => ({}) })).toBeTruthy();
		expect(isJSONEncodable(new Encodable())).toBeTruthy();
	});

	test('returns false if the object is not JSON encodable', () => {
		expect(isJSONEncodable({})).toBeFalsy();
	});
});
