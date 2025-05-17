import { describe, test, expect } from 'vitest';
import { kData } from '../src/utils/symbols.js';
import type { APIData } from './mixinClasses.js';
import { Base, Mixed, MixedWithExtended } from './mixinClasses.js';

describe('Mixin function', () => {
	const data: APIData = {
		id: '1',
		property1: 23,
	};

	test('Mixed class has all getters', () => {
		const instance = new Mixed(data);
		expect(instance.id).toBe(data.id);
		expect(instance.property1).toBe(data.property1);
		expect(instance.property2).toBe(data.property2);
	});

	test('Mixed class has all methods', () => {
		const instance = new Mixed(data);
		expect(instance.getId()).toBe(data.id);
		expect(instance.getProperty1()).toBe(data.property1);
		expect(instance.getProperty2()).toBe(data.property2);
		expect(instance.getProperties()).toEqual({
			property1: data.property1,
			property2: data.property2,
		});
	});

	test('Mixed with extended class has all getters', () => {
		const instance = new MixedWithExtended(data);
		expect(instance.id).toBe(data.id);
		expect(instance.property1).toBe(data.property1);
		expect(instance.property2).toBe(data.property2);
		expect(instance.isExtended).toBe(true);
	});

	test('Mixed with extended class has all methods', () => {
		const instance = new MixedWithExtended(data);
		expect(instance.getId()).toBe(data.id);
		expect(instance.getProperty1()).toBe(data.property1);
		expect(instance.getProperty2()).toBe(data.property2);
		expect(instance.getProperties()).toEqual({
			property1: data.property1,
			property2: data.property2,
		});
	});

	test('Mixed class calls construct methods on construct', () => {
		const instance1 = new Mixed(data);
		const instance2 = new MixedWithExtended(data);
		expect(instance1.constructCalled).toBe(true);
		expect(instance2.constructCalled).toBe(true);
	});

	test('Mixed class respects mixin data optimizations', () => {
		expect(typeof Object.getOwnPropertyDescriptor(Mixed.DataTemplate, 'mixinOptimize')?.set).toBe('function');
		const missingOptimizedInstance = new Mixed(data);
		const alreadyOptimizedInstance = new Mixed({ ...data, mixinOptimize: 'true', baseOptimize: 'true' });
		const baseOptimizedInstance = new Base({ ...data, mixinOptimize: 'true', baseOptimize: 'true' });

		expect(missingOptimizedInstance.baseOptimize).toBe(null);
		expect(missingOptimizedInstance.mixinOptimize).toBe(null);
		// Setters pass this
		expect('baseOptimize' in missingOptimizedInstance[kData]).toBe(true);
		expect('mixinOptimize' in missingOptimizedInstance[kData]).toBe(true);
		expect(missingOptimizedInstance[kData].baseOptimize).toBeUndefined();
		expect(missingOptimizedInstance[kData].mixinOptimize).toBeUndefined();

		expect(alreadyOptimizedInstance.baseOptimize).toBe(true);
		expect(alreadyOptimizedInstance.mixinOptimize).toBe(true);
		// Setters pass this
		expect('baseOptimize' in alreadyOptimizedInstance[kData]).toBe(true);
		expect('mixinOptimize' in alreadyOptimizedInstance[kData]).toBe(true);
		expect(alreadyOptimizedInstance[kData].baseOptimize).toBeUndefined();
		expect(alreadyOptimizedInstance[kData].mixinOptimize).toBeUndefined();
		expect(alreadyOptimizedInstance.toJSON()).toEqual({ ...data, mixinOptimize: 'true', baseOptimize: 'true' });

		alreadyOptimizedInstance._patch({ mixinOptimize: '', baseOptimize: '' });

		expect(alreadyOptimizedInstance.baseOptimize).toBe(false);
		expect(alreadyOptimizedInstance.mixinOptimize).toBe(false);
		// Setters pass this
		expect('baseOptimize' in alreadyOptimizedInstance[kData]).toBe(true);
		expect('mixinOptimize' in alreadyOptimizedInstance[kData]).toBe(true);
		expect(alreadyOptimizedInstance[kData].baseOptimize).toBeUndefined();
		expect(alreadyOptimizedInstance[kData].mixinOptimize).toBeUndefined();

		// Ensure mixin optimizations don't happen on base (ie overwritten DataTemplate)
		expect(baseOptimizedInstance.baseOptimize).toBe(true);
		expect('mixinOptimize' in baseOptimizedInstance).toBe(false);
		// Setters pass this
		expect('baseOptimize' in baseOptimizedInstance[kData]).toBe(true);
		expect('mixinOptimize' in baseOptimizedInstance[kData]).toBe(true);
		expect(baseOptimizedInstance[kData].baseOptimize).toBeUndefined();
		expect(baseOptimizedInstance[kData].mixinOptimize).toBe('true');
	});
});
