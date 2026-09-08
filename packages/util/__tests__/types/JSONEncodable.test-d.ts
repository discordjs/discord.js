import { expectTypeOf } from 'vitest';
import { isJSONEncodable, type JSONEncodable } from '../../src/index.js';

declare const unknownObj: unknown;

if (isJSONEncodable(unknownObj)) {
	expectTypeOf(unknownObj).toEqualTypeOf<JSONEncodable<unknown>>();
	expectTypeOf(unknownObj.toJSON()).toEqualTypeOf<unknown>();
}
