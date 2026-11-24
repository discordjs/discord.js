import { describe, test, expect } from 'vitest';
import { isJSONEncodable, isFileBodyEncodable, isRawFileEncodable, type JSONEncodable } from '../src/index.js';

class Encodable implements JSONEncodable<Record<string, never>> {
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
		expect(isJSONEncodable(null)).toBeFalsy();
		expect(isJSONEncodable(undefined)).toBeFalsy();
		expect(isJSONEncodable(1)).toBeFalsy();
		expect(isJSONEncodable('')).toBeFalsy();
		expect(isJSONEncodable([])).toBeFalsy();
		expect(isJSONEncodable(() => {})).toBeFalsy();
	});
});

describe('encodable method guards', () => {
	test.each([null, undefined, true, 0, 'method', {}])('rejects non-callable methods: %s', (value) => {
		expect(isJSONEncodable({ toJSON: value })).toBe(false);
		expect(isFileBodyEncodable({ toFileBody: value })).toBe(false);
		expect(isRawFileEncodable({ toJSON: () => ({}), getRawFile: value })).toBe(false);
		expect(isRawFileEncodable({ toJSON: value, getRawFile: () => ({}) })).toBe(false);
	});
	test('accepts callable methods on a prototype', () => {
		class Attachment {
			toJSON() {
				return {};
			}
			toFileBody() {
				return { body: {}, files: [] };
			}
			getRawFile() {
				return {};
			}
		}
		const attachment = new Attachment();
		expect(isJSONEncodable(attachment)).toBe(true);
		expect(isFileBodyEncodable(attachment)).toBe(true);
		expect(isRawFileEncodable(attachment)).toBe(true);
	});
});
