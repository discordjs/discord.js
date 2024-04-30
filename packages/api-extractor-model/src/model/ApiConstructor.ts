// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { DeclarationReference } from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference.js';
import { type IApiDeclaredItemOptions, ApiDeclaredItem } from '../items/ApiDeclaredItem.js';
import { ApiItemKind, Navigation, Meaning } from '../items/ApiItem.js';
import { type IApiParameterListMixinOptions, ApiParameterListMixin } from '../mixins/ApiParameterListMixin.js';
import { ApiProtectedMixin, type IApiProtectedMixinOptions } from '../mixins/ApiProtectedMixin.js';
import { type IApiReleaseTagMixinOptions, ApiReleaseTagMixin } from '../mixins/ApiReleaseTagMixin.js';

/**
 * Constructor options for {@link ApiConstructor}.
 *
 * @public
 */
export interface IApiConstructorOptions
	extends IApiParameterListMixinOptions,
		IApiProtectedMixinOptions,
		IApiReleaseTagMixinOptions,
		IApiDeclaredItemOptions {}

/**
 * Represents a TypeScript class constructor declaration that belongs to an `ApiClass`.
 *
 * @remarks
 *
 * This is part of the {@link ApiModel} hierarchy of classes, which are serializable representations of
 * API declarations.
 *
 * `ApiConstructor` represents a declaration using the `constructor` keyword such as in this example:
 *
 * ```ts
 * export class Vector {
 *   public x: number;
 *   public y: number;
 *
 *   // A class constructor:
 *   public constructor(x: number, y: number) {
 *     this.x = x;
 *     this.y = y;
 *   }
 * }
 * ```
 *
 * Compare with {@link ApiConstructSignature}, which describes the construct signature for a class constructor.
 * @public
 */
export class ApiConstructor extends ApiParameterListMixin(ApiProtectedMixin(ApiReleaseTagMixin(ApiDeclaredItem))) {
	public constructor(options: IApiConstructorOptions) {
		super(options);
	}

	public static getContainerKey(overloadIndex: number): string {
		return `|${ApiItemKind.Constructor}|${overloadIndex}`;
	}

	/**
	 * @override
	 */
	public override get kind(): ApiItemKind {
		return ApiItemKind.Constructor;
	}

	/**
	 * @override
	 */
	public override get containerKey(): string {
		return ApiConstructor.getContainerKey(this.overloadIndex);
	}

	/**
	 * @beta @override
	 */
	public override buildCanonicalReference(): DeclarationReference {
		const parent: DeclarationReference = this.parent
			? this.parent.canonicalReference
			: // .withMeaning() requires some kind of component
				DeclarationReference.empty().addNavigationStep(Navigation.Members as any, '(parent)');
		return parent.withMeaning(Meaning.Constructor as any).withOverloadIndex(this.overloadIndex);
	}
}
