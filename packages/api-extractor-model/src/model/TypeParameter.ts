// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import type * as tsdoc from '@microsoft/tsdoc';
import { ApiDocumentedItem } from '../items/ApiDocumentedItem.js';
import type { ApiTypeParameterListMixin } from '../mixins/ApiTypeParameterListMixin.js';
import type { Excerpt } from '../mixins/Excerpt.js';

/**
 * Constructor options for {@link TypeParameter}.
 *
 * @public
 */
export interface ITypeParameterOptions {
	constraintExcerpt: Excerpt;
	defaultTypeExcerpt: Excerpt;
	isOptional: boolean;
	name: string;
	parent: ApiTypeParameterListMixin;
}

/**
 * Represents a named type parameter for a generic declaration.
 *
 * @remarks
 *
 * `TypeParameter` represents a TypeScript declaration such as `T` in this example:
 *
 * ```ts
 * interface IIdentifier {
 *     getCode(): string;
 * }
 *
 * class BarCode implements IIdentifier {
 *     private _value: number;
 *     public getCode(): string { return this._value.toString(); }
 * }
 *
 * class Book<TIdentifier extends IIdentifier = BarCode> {
 *     public identifier: TIdentifier;
 * }
 * ```
 *
 * `TypeParameter` objects belong to the {@link (ApiTypeParameterListMixin:interface).typeParameters} collection.
 * @public
 */
export class TypeParameter {
	/**
	 * An {@link Excerpt} that describes the base constraint of the type parameter.
	 *
	 * @remarks
	 * In the example below, the `constraintExcerpt` would correspond to the `IIdentifier` subexpression:
	 *
	 * ```ts
	 * class Book<TIdentifier extends IIdentifier = BarCode> {
	 *     public identifier: TIdentifier;
	 * }
	 * ```
	 */
	public readonly constraintExcerpt: Excerpt;

	/**
	 * An {@link Excerpt} that describes the default type of the type parameter.
	 *
	 * @remarks
	 * In the example below, the `defaultTypeExcerpt` would correspond to the `BarCode` subexpression:
	 *
	 * ```ts
	 * class Book<TIdentifier extends IIdentifier = BarCode> {
	 *     public identifier: TIdentifier;
	 * }
	 * ```
	 */
	public readonly defaultTypeExcerpt: Excerpt;

	/**
	 * The parameter name.
	 */
	public name: string;

	/**
	 * Whether the type parameter is optional. True IFF there exists a `defaultTypeExcerpt`.
	 */
	public isOptional: boolean;

	private readonly _parent: ApiTypeParameterListMixin;

	public constructor(options: ITypeParameterOptions) {
		this.name = options.name;
		this.constraintExcerpt = options.constraintExcerpt;
		this.defaultTypeExcerpt = options.defaultTypeExcerpt;
		this.isOptional = options.isOptional;
		this._parent = options.parent;
	}

	/**
	 * Returns the `@typeParam` documentation for this parameter, if present.
	 */
	public get tsdocTypeParamBlock(): tsdoc.DocParamBlock | undefined {
		if (this._parent instanceof ApiDocumentedItem && this._parent.tsdocComment) {
			return this._parent.tsdocComment.typeParams.tryGetBlockByName(this.name);
		}

		return undefined;
	}
}
