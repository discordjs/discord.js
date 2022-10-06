import { expectType } from 'tsd';
import type { Equatable } from '../../dist';
import { isEquatable } from '../../src/index.js';

declare const unknownObj: unknown;

if (isEquatable(unknownObj)) {
	expectType<Equatable<unknown>>(unknownObj);
	expectType<boolean>(unknownObj.equals(unknownObj));
}
