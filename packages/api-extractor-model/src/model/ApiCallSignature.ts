// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { DeclarationReference } from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference.js';
import { type IApiDeclaredItemOptions, ApiDeclaredItem } from '../items/ApiDeclaredItem.js';
import { ApiItemKind, Navigation, Meaning } from '../items/ApiItem.js';
import { type IApiParameterListMixinOptions, ApiParameterListMixin } from '../mixins/ApiParameterListMixin.js';
import { type IApiReleaseTagMixinOptions, ApiReleaseTagMixin } from '../mixins/ApiReleaseTagMixin.js';
import { type IApiReturnTypeMixinOptions, ApiReturnTypeMixin } from '../mixins/ApiReturnTypeMixin.js';
import {
	type IApiTypeParameterListMixinOptions,
	ApiTypeParameterListMixin,
} from '../mixins/ApiTypeParameterListMixin.js';

/**
 * Constructor options for {@link ApiCallSignature}.
 *
 * @public
 */
export interface IApiCallSignatureOptions
	extends IApiTypeParameterListMixinOptions,
		IApiParameterListMixinOptions,
		IApiReleaseTagMixinOptions,
		IApiReturnTypeMixinOptions,
		IApiDeclaredItemOptions {}

/**
 * Represents a TypeScript function call signature.
 *
 * @remarks
 *
 * This is part of the {@link ApiModel} hierarchy of classes, which are serializable representations of
 * API declarations.
 *
 * `ApiCallSignature` represents a TypeScript declaration such as `(x: number, y: number): number`
 * in this example:
 *
 * ```ts
 * export interface IChooser {
 *   // A call signature:
 *   (x: number, y: number): number;
 *
 *   // Another overload for this call signature:
 *   (x: string, y: string): string;
 * }
 *
 * function chooseFirst<T>(x: T, y: T): T {
 *   return x;
 * }
 *
 * let chooser: IChooser = chooseFirst;
 * ```
 * @public
 */
export class ApiCallSignature extends ApiTypeParameterListMixin(
	ApiParameterListMixin(ApiReleaseTagMixin(ApiReturnTypeMixin(ApiDeclaredItem))),
) {
	public constructor(options: IApiCallSignatureOptions) {
		super(options);
	}

	public static getContainerKey(overloadIndex: number): string {
		return `|${ApiItemKind.CallSignature}|${overloadIndex}`;
	}

	/**
	 * @override
	 */
	public override get kind(): ApiItemKind {
		return ApiItemKind.CallSignature;
	}

	/**
	 * @override
	 */
	public override get containerKey(): string {
		return ApiCallSignature.getContainerKey(this.overloadIndex);
	}

	/**
	 * @beta @override
	 */
	public override buildCanonicalReference(): DeclarationReference {
		const parent: DeclarationReference = this.parent
			? this.parent.canonicalReference
			: // .withMeaning() requires some kind of component
				DeclarationReference.empty().addNavigationStep(Navigation.Members as any, '(parent)');
		return parent.withMeaning(Meaning.CallSignature as any).withOverloadIndex(this.overloadIndex);
	}
}
