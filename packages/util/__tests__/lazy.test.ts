/**
 * Copyright 2020 The Sapphire Community and its contributors
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://github.com/sapphiredev/utilities/blob/main/LICENSE.md.
 */

import { describe, test, expect, vi } from 'vitest';
import { lazy } from '../src/index.js';

describe('lazy', () => {
	test('GIVEN string callback THEN returns the same', () => {
		const callback = vi.fn(() => 'Lorem Ipsum');

		const lazyStoredValue = lazy(callback);

		expect(lazyStoredValue()).toEqual('Lorem Ipsum');
	});

	test('GIVEN string callback with cached value THEN returns the same', () => {
		const callback = vi.fn(() => 'Lorem Ipsum');

		const lazyStoredValue = lazy(callback);

		lazyStoredValue();
		const cachedValue = lazyStoredValue();

		expect(callback).toHaveBeenCalledOnce();
		expect(cachedValue).toEqual('Lorem Ipsum');
	});

	test('GIVEN undefined callback with cached value THEN returns the same', () => {
		const callback = vi.fn<() => string | undefined>(() => undefined);

		const lazyStoredValue = lazy(callback);

		lazyStoredValue();
		const cachedValue = lazyStoredValue();

		expect(callback).toHaveBeenCalledOnce();
		expect(cachedValue).toBeUndefined();
	});

	test('GIVEN null callback with cached value THEN returns the same', () => {
		const callback = vi.fn(() => null);

		const lazyStoredValue = lazy(callback);

		lazyStoredValue();
		const cachedValue = lazyStoredValue();

		expect(callback).toHaveBeenCalledOnce();
		expect(cachedValue).toBeNull();
	});
});

test('retries initialization after a synchronous failure', () => {
	const error = new Error('transient initialization failure');
	const callback = vi
		.fn<() => string>()
		.mockImplementationOnce(() => {
			throw error;
		})
		.mockReturnValue('ready');
	const value = lazy(callback);
	expect(value).toThrow(error);
	expect(value()).toBe('ready');
	expect(value()).toBe('ready');
	expect(callback).toHaveBeenCalledTimes(2);
});
