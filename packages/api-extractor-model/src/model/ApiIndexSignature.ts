// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { DeclarationReference } from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference.js';
import { type IApiDeclaredItemOptions, ApiDeclaredItem } from '../items/ApiDeclaredItem.js';
import { ApiItemKind, Navigation, Meaning } from '../items/ApiItem.js';
import { type IApiParameterListMixinOptions, ApiParameterListMixin } from '../mixins/ApiParameterListMixin.js';
import { type IApiReadonlyMixinOptions, ApiReadonlyMixin } from '../mixins/ApiReadonlyMixin.js';
import { type IApiReleaseTagMixinOptions, ApiReleaseTagMixin } from '../mixins/ApiReleaseTagMixin.js';
import { type IApiReturnTypeMixinOptions, ApiReturnTypeMixin } from '../mixins/ApiReturnTypeMixin.js';

/**
 * Constructor options for {@link ApiIndexSignature}.
 *
 * @public
 */
export interface IApiIndexSignatureOptions
	extends IApiParameterListMixinOptions,
		IApiReleaseTagMixinOptions,
		IApiReturnTypeMixinOptions,
		IApiReadonlyMixinOptions,
		IApiDeclaredItemOptions {}

/**
 * Represents a TypeScript index signature.
 *
 * @remarks
 *
 * This is part of the {@link ApiModel} hierarchy of classes, which are serializable representations of
 * API declarations.
 *
 * `ApiIndexSignature` represents a TypeScript declaration such as `[x: number]: number` in this example:
 *
 * ```ts
 * export interface INumberTable {
 *   // An index signature
 *   [value: number]: number;
 *
 *   // An overloaded index signature
 *   [name: string]: number;
 * }
 * ```
 * @public
 */
export class ApiIndexSignature extends ApiParameterListMixin(
	ApiReleaseTagMixin(ApiReturnTypeMixin(ApiReadonlyMixin(ApiDeclaredItem))),
) {
	public constructor(options: IApiIndexSignatureOptions) {
		super(options);
	}

	public static getContainerKey(overloadIndex: number): string {
		return `|${ApiItemKind.IndexSignature}|${overloadIndex}`;
	}

	/**
	 * @override
	 */
	public override get kind(): ApiItemKind {
		return ApiItemKind.IndexSignature;
	}

	/**
	 * @override
	 */
	public override get containerKey(): string {
		return ApiIndexSignature.getContainerKey(this.overloadIndex);
	}

	/**
	 * @beta @override
	 */
	public override buildCanonicalReference(): DeclarationReference {
		const parent: DeclarationReference = this.parent
			? this.parent.canonicalReference
			: // .withMeaning() requires some kind of component
				DeclarationReference.empty().addNavigationStep(Navigation.Members as any, '(parent)');
		return parent.withMeaning(Meaning.IndexSignature as any).withOverloadIndex(this.overloadIndex);
	}
}
