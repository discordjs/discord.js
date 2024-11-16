// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { DeclarationReference } from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference.js';
import { type IApiDeclaredItemOptions, ApiDeclaredItem } from '../items/ApiDeclaredItem.js';
import { ApiItemKind, Navigation, Meaning } from '../items/ApiItem.js';
import { type IApiParameterListMixinOptions, ApiParameterListMixin } from '../mixins/ApiParameterListMixin.js';
import { type IApiReleaseTagMixinOptions, ApiReleaseTagMixin } from '../mixins/ApiReleaseTagMixin.js';
import { type IApiReturnTypeMixinOptions, ApiReturnTypeMixin } from '../mixins/ApiReturnTypeMixin.js';
import {
	ApiTypeParameterListMixin,
	type IApiTypeParameterListMixinOptions,
} from '../mixins/ApiTypeParameterListMixin.js';

/**
 * Constructor options for {@link ApiConstructor}.
 *
 * @public
 */
export interface IApiConstructSignatureOptions
	extends IApiTypeParameterListMixinOptions,
		IApiParameterListMixinOptions,
		IApiReleaseTagMixinOptions,
		IApiReturnTypeMixinOptions,
		IApiDeclaredItemOptions {}

/**
 * Represents a TypeScript construct signature that belongs to an `ApiInterface`.
 *
 * @remarks
 *
 * This is part of the {@link ApiModel} hierarchy of classes, which are serializable representations of
 * API declarations.
 *
 * `ApiConstructSignature` represents a construct signature using the `new` keyword such as in this example:
 *
 * ```ts
 * export interface IVector {
 *   x: number;
 *   y: number;
 * }
 *
 * export interface IVectorConstructor {
 *   // A construct signature:
 *   new(x: number, y: number): IVector;
 * }
 *
 * export function createVector(vectorConstructor: IVectorConstructor,
 *   x: number, y: number): IVector {
 *   return new vectorConstructor(x, y);
 * }
 *
 * class Vector implements IVector {
 *   public x: number;
 *   public y: number;
 *   public constructor(x: number, y: number) {
 *     this.x = x;
 *     this.y = y;
 *   }
 * }
 *
 * let vector: Vector = createVector(Vector, 1, 2);
 * ```
 *
 * Compare with {@link ApiConstructor}, which describes the class constructor itself.
 * @public
 */
export class ApiConstructSignature extends ApiTypeParameterListMixin(
	ApiParameterListMixin(ApiReleaseTagMixin(ApiReturnTypeMixin(ApiDeclaredItem))),
) {
	public constructor(options: IApiConstructSignatureOptions) {
		super(options);
	}

	public static getContainerKey(overloadIndex: number): string {
		return `|${ApiItemKind.ConstructSignature}|${overloadIndex}`;
	}

	/**
	 * @override
	 */
	public override get kind(): ApiItemKind {
		return ApiItemKind.ConstructSignature;
	}

	/**
	 * @override
	 */
	public override get containerKey(): string {
		return ApiConstructSignature.getContainerKey(this.overloadIndex);
	}

	/**
	 * @beta @override
	 */
	public override buildCanonicalReference(): DeclarationReference {
		const parent: DeclarationReference = this.parent
			? this.parent.canonicalReference
			: // .withMeaning() requires some kind of component
				DeclarationReference.empty().addNavigationStep(Navigation.Members as any, '(parent)');
		return parent.withMeaning(Meaning.ConstructSignature as any).withOverloadIndex(this.overloadIndex);
	}
}
