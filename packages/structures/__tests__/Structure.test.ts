import { describe, test, expect } from 'vitest';
import { Structure } from '../src/Structure.js';
import { data as kData } from '../src/utils/symbols.js';

describe('Base Structure', () => {
	const data = { test: true, patched: false };
	// @ts-expect-error Structure constructor is protected
	const struct: Structure<typeof data> = new Structure(data);

	test('Data reference is identical (no shallow clone at base level)', () => {
		expect(struct[kData]).toBe(data);
		expect(struct[kData]).toEqual(data);
	});

	test('toJSON shallow clones but retains data equality', () => {
		expect(struct.toJSON()).not.toBe(data);
		expect(struct[kData]).toEqual(data);
	});
});
