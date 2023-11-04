// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { DeclarationReference, type Component } from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference.js';
import { type IApiDeclaredItemOptions, ApiDeclaredItem } from '../items/ApiDeclaredItem.js';
import { ApiItemKind, Navigation, Meaning } from '../items/ApiItem.js';
import { type IApiAbstractMixinOptions, ApiAbstractMixin } from '../mixins/ApiAbstractMixin.js';
import { type IApiNameMixinOptions, ApiNameMixin } from '../mixins/ApiNameMixin.js';
import { ApiOptionalMixin, type IApiOptionalMixinOptions } from '../mixins/ApiOptionalMixin.js';
import { type IApiParameterListMixinOptions, ApiParameterListMixin } from '../mixins/ApiParameterListMixin.js';
import { ApiProtectedMixin, type IApiProtectedMixinOptions } from '../mixins/ApiProtectedMixin.js';
import { type IApiReleaseTagMixinOptions, ApiReleaseTagMixin } from '../mixins/ApiReleaseTagMixin.js';
import { ApiReturnTypeMixin, type IApiReturnTypeMixinOptions } from '../mixins/ApiReturnTypeMixin.js';
import { ApiStaticMixin, type IApiStaticMixinOptions } from '../mixins/ApiStaticMixin.js';
import {
	ApiTypeParameterListMixin,
	type IApiTypeParameterListMixinOptions,
} from '../mixins/ApiTypeParameterListMixin.js';

/**
 * Constructor options for {@link ApiMethod}.
 *
 * @public
 */
export interface IApiMethodOptions
	extends IApiNameMixinOptions,
		IApiAbstractMixinOptions,
		IApiOptionalMixinOptions,
		IApiParameterListMixinOptions,
		IApiProtectedMixinOptions,
		IApiReleaseTagMixinOptions,
		IApiReturnTypeMixinOptions,
		IApiStaticMixinOptions,
		IApiTypeParameterListMixinOptions,
		IApiDeclaredItemOptions {}

/**
 * Represents a TypeScript member function declaration that belongs to an `ApiClass`.
 *
 * @remarks
 *
 * This is part of the {@link ApiModel} hierarchy of classes, which are serializable representations of
 * API declarations.
 *
 * `ApiMethod` represents a TypeScript declaration such as the `render` member function in this example:
 *
 * ```ts
 * export class Widget {
 *   public render(): void { }
 * }
 * ```
 *
 * Compare with {@link ApiMethodSignature}, which represents a method belonging to an interface.
 * For example, a class method can be `static` but an interface method cannot.
 * @public
 */
export class ApiMethod extends ApiNameMixin(
	ApiAbstractMixin(
		ApiOptionalMixin(
			ApiParameterListMixin(
				ApiProtectedMixin(
					ApiReleaseTagMixin(ApiReturnTypeMixin(ApiStaticMixin(ApiTypeParameterListMixin(ApiDeclaredItem)))),
				),
			),
		),
	),
) {
	public constructor(options: IApiMethodOptions) {
		super(options);
	}

	public static getContainerKey(name: string, isStatic: boolean, overloadIndex: number): string {
		if (isStatic) {
			return `${name}|${ApiItemKind.Method}|static|${overloadIndex}`;
		} else {
			return `${name}|${ApiItemKind.Method}|instance|${overloadIndex}`;
		}
	}

	/**
	 * @override
	 */
	public override get kind(): ApiItemKind {
		return ApiItemKind.Method;
	}

	/**
	 * @override
	 */
	public override get containerKey(): string {
		return ApiMethod.getContainerKey(this.name, this.isStatic, this.overloadIndex);
	}

	/**
	 * @beta @override
	 */
	public override buildCanonicalReference(): DeclarationReference {
		const nameComponent: Component = DeclarationReference.parseComponent(this.name);
		return (this.parent ? this.parent.canonicalReference : DeclarationReference.empty())
			.addNavigationStep((this.isStatic ? Navigation.Exports : Navigation.Members) as any, nameComponent)
			.withMeaning(Meaning.Member as any)
			.withOverloadIndex(this.overloadIndex);
	}
}
