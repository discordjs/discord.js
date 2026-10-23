import { expectTypeOf } from 'vitest';
import { isEquatable, type Equatable } from '../../src/index.js';

declare const unknownObj: unknown;

if (isEquatable(unknownObj)) {
	expectTypeOf(unknownObj).toEqualTypeOf<Equatable<unknown>>();
	expectTypeOf(unknownObj.equals(unknownObj)).toEqualTypeOf<boolean>();
}
