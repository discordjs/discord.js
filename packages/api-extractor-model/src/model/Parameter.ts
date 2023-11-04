// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import type * as tsdoc from '@microsoft/tsdoc';
import { ApiDocumentedItem } from '../items/ApiDocumentedItem.js';
import type { ApiParameterListMixin } from '../mixins/ApiParameterListMixin.js';
import type { Excerpt } from '../mixins/Excerpt.js';

/**
 * Constructor options for {@link Parameter}.
 *
 * @public
 */
export interface IParameterOptions {
	isOptional: boolean;
	isRest: boolean;
	name: string;
	parameterTypeExcerpt: Excerpt;
	parent: ApiParameterListMixin;
}

/**
 * Represents a named parameter for a function-like declaration.
 *
 * @remarks
 *
 * `Parameter` represents a TypeScript declaration such as `x: number` in this example:
 *
 * ```ts
 * export function add(x: number, y: number): number {
 *   return x + y;
 * }
 * ```
 *
 * `Parameter` objects belong to the {@link (ApiParameterListMixin:interface).parameters} collection.
 * @public
 */
export class Parameter {
	/**
	 * An {@link Excerpt} that describes the type of the parameter.
	 */
	public readonly parameterTypeExcerpt: Excerpt;

	/**
	 * The parameter name.
	 */
	public name: string;

	/**
	 * Whether the parameter is optional.
	 */
	public isOptional: boolean;

	/**
	 * Whether the parameter is a rest parameter
	 */
	public isRest: boolean;

	private readonly _parent: ApiParameterListMixin;

	public constructor(options: IParameterOptions) {
		this.name = options.name;
		this.parameterTypeExcerpt = options.parameterTypeExcerpt;
		this.isOptional = options.isOptional;
		this.isRest = options.isRest;
		this._parent = options.parent;
	}

	/**
	 * Returns the `@param` documentation for this parameter, if present.
	 */
	public get tsdocParamBlock(): tsdoc.DocParamBlock | undefined {
		if (this._parent instanceof ApiDocumentedItem && this._parent.tsdocComment) {
			return this._parent.tsdocComment.params.tryGetBlockByName(this.name);
		}

		return undefined;
	}
}
