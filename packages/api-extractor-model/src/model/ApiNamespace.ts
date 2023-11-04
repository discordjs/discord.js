// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { DeclarationReference, type Component } from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference.js';
import { type IApiDeclaredItemOptions, ApiDeclaredItem } from '../items/ApiDeclaredItem.js';
import { ApiItemKind, Navigation, Meaning } from '../items/ApiItem.js';
import { type IApiExportedMixinOptions, ApiExportedMixin } from '../mixins/ApiExportedMixin.js';
import { ApiItemContainerMixin, type IApiItemContainerMixinOptions } from '../mixins/ApiItemContainerMixin.js';
import { type IApiNameMixinOptions, ApiNameMixin } from '../mixins/ApiNameMixin.js';
import { ApiReleaseTagMixin, type IApiReleaseTagMixinOptions } from '../mixins/ApiReleaseTagMixin.js';

/**
 * Constructor options for {@link ApiClass}.
 *
 * @public
 */
export interface IApiNamespaceOptions
	extends IApiItemContainerMixinOptions,
		IApiNameMixinOptions,
		IApiReleaseTagMixinOptions,
		IApiDeclaredItemOptions,
		IApiExportedMixinOptions {}

/**
 * Represents a TypeScript namespace declaration.
 *
 * @remarks
 *
 * This is part of the {@link ApiModel} hierarchy of classes, which are serializable representations of
 * API declarations.
 *
 * `ApiNamespace` represents a TypeScript declaration such `X` or `Y` in this example:
 *
 * ```ts
 * export namespace X {
 *   export namespace Y {
 *     export interface IWidget {
 *       render(): void;
 *     }
 *   }
 * }
 * ```
 * @public
 */
export class ApiNamespace extends ApiItemContainerMixin(
	ApiNameMixin(ApiReleaseTagMixin(ApiExportedMixin(ApiDeclaredItem))),
) {
	public constructor(options: IApiNamespaceOptions) {
		super(options);
	}

	public static getContainerKey(name: string): string {
		return `${name}|${ApiItemKind.Namespace}`;
	}

	/**
	 * @override
	 */
	public override get kind(): ApiItemKind {
		return ApiItemKind.Namespace;
	}

	/**
	 * @override
	 */
	public override get containerKey(): string {
		return ApiNamespace.getContainerKey(this.name);
	}

	/**
	 * @beta @override
	 */
	public override buildCanonicalReference(): DeclarationReference {
		const nameComponent: Component = DeclarationReference.parseComponent(this.name);
		const navigation: Navigation = this.isExported ? Navigation.Exports : Navigation.Locals;
		return (this.parent ? this.parent.canonicalReference : DeclarationReference.empty())
			.addNavigationStep(navigation as any, nameComponent)
			.withMeaning(Meaning.Namespace as any);
	}
}
