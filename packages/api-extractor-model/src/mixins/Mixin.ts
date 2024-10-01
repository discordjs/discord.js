// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

/**
 * This abstraction is used by the mixin pattern.
 * It describes a class constructor.
 *
 * @public
 */
export type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * This abstraction is used by the mixin pattern.
 * It describes the "static side" of a class.
 *
 * @public
 */
export type PropertiesOf<T> = { [K in keyof T]: T[K] };
