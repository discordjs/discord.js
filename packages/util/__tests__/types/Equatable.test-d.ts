import { expectTypeOf, test } from 'vitest';
import { isEquatable, type Equatable } from '../../src/index.js';

declare const unknownObj: unknown;

test('isEquatable narrows to Equatable', () => {
	if (isEquatable(unknownObj)) {
		expectTypeOf(unknownObj).toEqualTypeOf<Equatable<unknown>>();
		expectTypeOf(unknownObj.equals(unknownObj)).toEqualTypeOf<boolean>();
	}
});
