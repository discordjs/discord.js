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
});
