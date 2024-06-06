import { expectType } from 'tsd';
import { isEquatable, type Equatable } from '../../src/index.js';

declare const unknownObj: unknown;

if (isEquatable(unknownObj)) {
	expectType<Equatable<unknown>>(unknownObj);
	expectType<boolean>(unknownObj.equals(unknownObj));
}
