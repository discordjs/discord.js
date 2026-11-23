import { expectTypeOf, test } from 'vitest';
import { isJSONEncodable, type JSONEncodable } from '../../src/index.js';

declare const unknownObj: unknown;

test('isJSONEncodable narrows to JSONEncodable', () => {
	if (isJSONEncodable(unknownObj)) {
		expectTypeOf(unknownObj).toEqualTypeOf<JSONEncodable<unknown>>();
		expectTypeOf(unknownObj.toJSON()).toEqualTypeOf<unknown>();
	}
});
