// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { DeclarationReference, type Component } from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference.js';
import { type IApiDeclaredItemOptions, ApiDeclaredItem } from '../items/ApiDeclaredItem.js';
import { ApiItemKind, Navigation, Meaning } from '../items/ApiItem.js';
import { type IApiNameMixinOptions, ApiNameMixin } from '../mixins/ApiNameMixin.js';
import { type IApiParameterListMixinOptions, ApiParameterListMixin } from '../mixins/ApiParameterListMixin.js';
import { type IApiReleaseTagMixinOptions, ApiReleaseTagMixin } from '../mixins/ApiReleaseTagMixin.js';

/**
 * Constructor options for {@link ApiEvent}.
 *
 * @public
 */
export interface IApiEventOptions
	extends IApiNameMixinOptions,
		IApiParameterListMixinOptions,
		IApiReleaseTagMixinOptions,
		IApiDeclaredItemOptions {}

/**
 * Represents a TypeScript event declaration that belongs to an `ApiClass`.
 *
 * @remarks
 *
 * This is part of the {@link ApiModel} hierarchy of classes, which are serializable representations of
 * API declarations.
 *
 * `ApiEvent` represents a emittable event such as the `ready` event in this example:
 *
 * ```ts
 * export class Cliet extends EventEmitter {
 *   on(event: 'ready', ...args: [Client]): this { }
 * }
 * ```
 * @public
 */
export class ApiEvent extends ApiNameMixin(ApiParameterListMixin(ApiReleaseTagMixin(ApiDeclaredItem))) {
	public constructor(options: IApiEventOptions) {
		super(options);
	}

	public static getContainerKey(name: string, overloadIndex: number): string {
		return `${name}|${ApiItemKind.Event}|${overloadIndex}`;
	}

	/**
	 * @override
	 */
	public override get kind(): ApiItemKind {
		return ApiItemKind.Event;
	}

	/**
	 * @override
	 */
	public override get containerKey(): string {
		return ApiEvent.getContainerKey(this.name, this.overloadIndex);
	}

	/**
	 * @beta @override
	 */
	public override buildCanonicalReference(): DeclarationReference {
		const nameComponent: Component = DeclarationReference.parseComponent(this.name);
		return (this.parent ? this.parent.canonicalReference : DeclarationReference.empty())
			.addNavigationStep(Navigation.Members as any, nameComponent)
			.withMeaning(Meaning.Member as any)
			.withOverloadIndex(this.overloadIndex);
	}
}
