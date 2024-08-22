import { expectType } from 'tsd';
import { isJSONEncodable, type JSONEncodable } from '../../src/index.js';

declare const unknownObj: unknown;

if (isJSONEncodable(unknownObj)) {
	expectType<JSONEncodable<unknown>>(unknownObj);
	expectType<unknown>(unknownObj.toJSON());
}
