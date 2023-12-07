import { describe, test, expect, beforeEach } from 'vitest';
import { Structure } from '../src/Structure.js';
import { data as kData } from '../src/utils/symbols.js';

describe('Base Structure', () => {
	const data = { test: true, patched: false, removed: true };
	let struct: Structure<typeof data>;
	beforeEach(() => {
		// @ts-expect-error Structure constructor is protected
		struct = new Structure(data);
	});

	test('Data reference is not identical (clone via Object.assign)', () => {
		expect(struct[kData]).not.toBe(data);
		expect(struct[kData]).toEqual(data);
	});

	test('Remove properties via template (constructor)', () => {
		// @ts-expect-error Structure constructor is protected
		const templatedStruct: Structure<typeof data> = new Structure(data, { template: { set removed(_) {} } });
		expect(templatedStruct[kData].removed).toBe(undefined);
		// Setters still exist and pass "in" test unfortunately
		expect('removed' in templatedStruct[kData]).toBe(true);
		expect(templatedStruct[kData]).toEqual({ test: true, patched: false });
	});

	test('patch clones data and updates in place', () => {
		const dataBefore = struct[kData];
		// @ts-expect-error Structure#_patch is protected
		const patched = struct._patch({ patched: true });
		expect(patched[kData].patched).toBe(true);
		// Patch in place
		expect(struct[kData]).toBe(patched[kData]);
		// Clones
		expect(dataBefore.patched).toBe(false);
		expect(dataBefore).not.toBe(patched[kData]);
	});

	test('Remove properties via template (_patch)', () => {
		// @ts-expect-error Structure constructor is protected
		const templatedStruct: Structure<typeof data> = new Structure(data, { template: { set removed(_) {} } });
		// @ts-expect-error Structure#patch is protected
		templatedStruct._patch({ removed: false }, { template: { set removed(_) {} } });
		expect(templatedStruct[kData].removed).toBe(undefined);
		// Setters still exist and pass "in" test unfortunately
		expect('removed' in templatedStruct[kData]).toBe(true);
		expect(templatedStruct[kData]).toEqual({ test: true, patched: false });
	});

	test('toJSON clones but retains data equality', () => {
		const json = struct.toJSON();
		expect(json).not.toBe(data);
		expect(json).not.toBe(struct[kData]);
		expect(struct[kData]).toEqual(json);
	});
});
