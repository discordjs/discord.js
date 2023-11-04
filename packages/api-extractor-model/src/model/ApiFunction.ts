// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { DeclarationReference, type Component } from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference.js';
import { type IApiDeclaredItemOptions, ApiDeclaredItem } from '../items/ApiDeclaredItem.js';
import { ApiItemKind, Navigation, Meaning } from '../items/ApiItem.js';
import { type IApiExportedMixinOptions, ApiExportedMixin } from '../mixins/ApiExportedMixin.js';
import { type IApiNameMixinOptions, ApiNameMixin } from '../mixins/ApiNameMixin.js';
import { type IApiParameterListMixinOptions, ApiParameterListMixin } from '../mixins/ApiParameterListMixin.js';
import { type IApiReleaseTagMixinOptions, ApiReleaseTagMixin } from '../mixins/ApiReleaseTagMixin.js';
import { type IApiReturnTypeMixinOptions, ApiReturnTypeMixin } from '../mixins/ApiReturnTypeMixin.js';
import {
	type IApiTypeParameterListMixinOptions,
	ApiTypeParameterListMixin,
} from '../mixins/ApiTypeParameterListMixin.js';

/**
 * Constructor options for {@link ApiFunction}.
 *
 * @public
 */
export interface IApiFunctionOptions
	extends IApiNameMixinOptions,
		IApiTypeParameterListMixinOptions,
		IApiParameterListMixinOptions,
		IApiReleaseTagMixinOptions,
		IApiReturnTypeMixinOptions,
		IApiDeclaredItemOptions,
		IApiExportedMixinOptions {}

/**
 * Represents a TypeScript function declaration.
 *
 * @remarks
 *
 * This is part of the {@link ApiModel} hierarchy of classes, which are serializable representations of
 * API declarations.
 *
 * `ApiFunction` represents a TypeScript declaration such as this example:
 *
 * ```ts
 * export function getAverage(x: number, y: number): number {
 *   return (x + y) / 2.0;
 * }
 * ```
 *
 * Functions are exported by an entry point module or by a namespace.  Compare with {@link ApiMethod}, which
 * represents a function that is a member of a class.
 * @public
 */
export class ApiFunction extends ApiNameMixin(
	ApiTypeParameterListMixin(
		ApiParameterListMixin(ApiReleaseTagMixin(ApiReturnTypeMixin(ApiExportedMixin(ApiDeclaredItem)))),
	),
) {
	public constructor(options: IApiFunctionOptions) {
		super(options);
	}

	public static getContainerKey(name: string, overloadIndex: number): string {
		return `${name}|${ApiItemKind.Function}|${overloadIndex}`;
	}

	/**
	 * @override
	 */
	public override get kind(): ApiItemKind {
		return ApiItemKind.Function;
	}

	/**
	 * @override
	 */
	public override get containerKey(): string {
		return ApiFunction.getContainerKey(this.name, this.overloadIndex);
	}

	/**
	 * @beta @override
	 */
	public override buildCanonicalReference(): DeclarationReference {
		const nameComponent: Component = DeclarationReference.parseComponent(this.name);
		const navigation: Navigation = this.isExported ? Navigation.Exports : Navigation.Locals;
		return (this.parent ? this.parent.canonicalReference : DeclarationReference.empty())
			.addNavigationStep(navigation as any, nameComponent)
			.withMeaning(Meaning.Function as any)
			.withOverloadIndex(this.overloadIndex);
	}
}
