// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { DeclarationReference, type Component } from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference.js';
import { ApiDeclaredItem, type IApiDeclaredItemOptions } from '../items/ApiDeclaredItem.js';
import { ApiItemKind, Navigation, Meaning } from '../items/ApiItem.js';
import { ApiInitializerMixin, type IApiInitializerMixinOptions } from '../mixins/ApiInitializerMixin.js';
import { type IApiNameMixinOptions, ApiNameMixin } from '../mixins/ApiNameMixin.js';
import { ApiReleaseTagMixin, type IApiReleaseTagMixinOptions } from '../mixins/ApiReleaseTagMixin.js';

/**
 * Constructor options for {@link ApiEnumMember}.
 *
 * @public
 */
export interface IApiEnumMemberOptions
	extends IApiNameMixinOptions,
		IApiReleaseTagMixinOptions,
		IApiDeclaredItemOptions,
		IApiInitializerMixinOptions {}

/**
 * Options for customizing the sort order of {@link ApiEnum} members.
 *
 * @privateRemarks
 * This enum is currently only used by the `@microsoft/api-extractor` package; it is declared here
 * because we anticipate that if more options are added in the future, their sorting will be implemented
 * by the `@microsoft/api-extractor-model` package.
 *
 * See https://github.com/microsoft/rushstack/issues/918 for details.
 * @public
 */
export enum EnumMemberOrder {
	/**
	 * `ApiEnumMember` items are sorted according to their {@link ApiItem.getSortKey}.  The order is
	 * basically alphabetical by identifier name, but otherwise unspecified to allow for cosmetic improvements.
	 *
	 * This is the default behavior.
	 */
	ByName = 'by-name',

	/**
	 * `ApiEnumMember` items preserve the original order of the declarations in the source file.
	 * (This disables the automatic sorting that is normally applied based on {@link ApiItem.getSortKey}.)
	 */
	Preserve = 'preserve',
}

/**
 * Represents a member of a TypeScript enum declaration.
 *
 * @remarks
 *
 * This is part of the {@link ApiModel} hierarchy of classes, which are serializable representations of
 * API declarations.
 *
 * `ApiEnumMember` represents an enum member such as `Small = 100` in the example below:
 *
 * ```ts
 * export enum FontSizes {
 *   Small = 100,
 *   Medium = 200,
 *   Large = 300
 * }
 * ```
 * @public
 */
export class ApiEnumMember extends ApiNameMixin(ApiReleaseTagMixin(ApiInitializerMixin(ApiDeclaredItem))) {
	public constructor(options: IApiEnumMemberOptions) {
		super(options);
	}

	public static getContainerKey(name: string): string {
		// No prefix needed, because ApiEnumMember is the only possible member of an ApiEnum
		return name;
	}

	/**
	 * @override
	 */
	public override get kind(): ApiItemKind {
		return ApiItemKind.EnumMember;
	}

	/**
	 * @override
	 */
	public override get containerKey(): string {
		return ApiEnumMember.getContainerKey(this.name);
	}

	/**
	 * @beta @override
	 */
	public override buildCanonicalReference(): DeclarationReference {
		const nameComponent: Component = DeclarationReference.parseComponent(this.name);
		return (this.parent ? this.parent.canonicalReference : DeclarationReference.empty())
			.addNavigationStep(Navigation.Exports as any, nameComponent)
			.withMeaning(Meaning.Member as any);
	}
}
