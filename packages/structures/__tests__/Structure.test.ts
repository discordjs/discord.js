import { describe, test, expect, beforeEach } from 'vitest';
import { DataTemplatePropertyName, OptimizeDataPropertyName, Structure } from '../src/Structure.js';
import { kData, kPatch } from '../src/utils/symbols.js';

describe('Base Structure', () => {
	const data = { test: true, patched: false, removed: true };
	let struct: Structure<typeof data>;
	beforeEach(() => {
		// @ts-expect-error Structure constructor is protected
		struct = new Structure(data);
		// @ts-expect-error Structure.DataTemplate is protected
		Structure.DataTemplate = {};
	});

	test('Data reference is not identical (clone via Object.assign)', () => {
		expect(struct[kData]).not.toBe(data);
		expect(struct[kData]).toEqual(data);
	});

	test('Remove properties via template (constructor)', () => {
		// @ts-expect-error Structure.DataTemplate is protected
		Structure.DataTemplate = { set removed(_) {} };
		// @ts-expect-error Structure constructor is protected
		const templatedStruct: Structure<typeof data> = new Structure(data);
		expect(templatedStruct[kData].removed).toBe(undefined);
		// Setters still exist and pass "in" test unfortunately
		expect('removed' in templatedStruct[kData]).toBe(true);
		expect(templatedStruct[kData]).toEqual({ test: true, patched: false });
	});

	test('patch clones data and updates in place', () => {
		const dataBefore = struct[kData];
		const patched = struct[kPatch]({ patched: true });
		expect(patched[kData].patched).toBe(true);
		// Patch in place
		expect(struct[kData]).toBe(patched[kData]);
		// Clones
		expect(dataBefore.patched).toBe(false);
		expect(dataBefore).not.toBe(patched[kData]);
	});

	test('Remove properties via template ([kPatch])', () => {
		// @ts-expect-error Structure.DataTemplate is protected
		Structure.DataTemplate = { set removed(_) {} };
		// @ts-expect-error Structure constructor is protected
		const templatedStruct: Structure<typeof data> = new Structure(data);
		templatedStruct[kPatch]({ removed: false });
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

	test("XPropertyName variable matches the actual property's names", () => {
		expect(Structure[DataTemplatePropertyName]).toStrictEqual({});
		expect(struct[OptimizeDataPropertyName]).toBeTypeOf('function');
	});
});
