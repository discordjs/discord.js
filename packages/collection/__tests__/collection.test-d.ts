import { expectTypeOf, test } from 'vitest';
import { Collection, type ReadonlyCollection } from '../src/index.js';

test('ReadonlyCollection#tap preserves the readonly type', () => {
	const readonly: ReadonlyCollection<string, number> = new Collection([['a', 1]]);

	expectTypeOf(readonly.tap(() => {})).toEqualTypeOf<ReadonlyCollection<string, number>>();
	expectTypeOf(readonly.tap(() => {}, null)).toEqualTypeOf<ReadonlyCollection<string, number>>();
});

test('ReadonlyCollection#each preserves the readonly type', () => {
	const readonly: ReadonlyCollection<string, number> = new Collection([['a', 1]]);

	expectTypeOf(readonly.each(() => {})).toEqualTypeOf<ReadonlyCollection<string, number>>();
	expectTypeOf(readonly.each(() => {}, null)).toEqualTypeOf<ReadonlyCollection<string, number>>();
});
