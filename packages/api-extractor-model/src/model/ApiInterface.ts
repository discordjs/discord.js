// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { DeclarationReference, type Component } from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference.js';
import { ApiDeclaredItem, type IApiDeclaredItemOptions, type IApiDeclaredItemJson } from '../items/ApiDeclaredItem.js';
import { ApiItemKind, Navigation, Meaning } from '../items/ApiItem.js';
import {
	type IApiExportedMixinJson,
	type IApiExportedMixinOptions,
	ApiExportedMixin,
} from '../mixins/ApiExportedMixin.js';
import {
	ApiItemContainerMixin,
	type IApiItemContainerMixinOptions,
	type IApiItemContainerJson,
} from '../mixins/ApiItemContainerMixin.js';
import { type IApiNameMixinOptions, ApiNameMixin, type IApiNameMixinJson } from '../mixins/ApiNameMixin.js';
import {
	type IApiReleaseTagMixinOptions,
	ApiReleaseTagMixin,
	type IApiReleaseTagMixinJson,
} from '../mixins/ApiReleaseTagMixin.js';
import {
	type IApiTypeParameterListMixinOptions,
	type IApiTypeParameterListMixinJson,
	ApiTypeParameterListMixin,
} from '../mixins/ApiTypeParameterListMixin.js';
import type { IExcerptTokenRangeWithTypeParameters } from './ApiClass.js';
import type { DeserializerContext } from './DeserializerContext.js';
import { HeritageType } from './HeritageType.js';

/**
 * Constructor options for {@link ApiInterface}.
 *
 * @public
 */
export interface IApiInterfaceOptions
	extends IApiItemContainerMixinOptions,
		IApiNameMixinOptions,
		IApiTypeParameterListMixinOptions,
		IApiReleaseTagMixinOptions,
		IApiDeclaredItemOptions,
		IApiExportedMixinOptions {
	extendsTokenRanges: IExcerptTokenRangeWithTypeParameters[];
}

export interface IApiInterfaceJson
	extends IApiItemContainerJson,
		IApiNameMixinJson,
		IApiTypeParameterListMixinJson,
		IApiReleaseTagMixinJson,
		IApiDeclaredItemJson,
		IApiExportedMixinJson {
	extendsTokenRanges: IExcerptTokenRangeWithTypeParameters[];
}

/**
 * Represents a TypeScript class declaration.
 *
 * @remarks
 *
 * This is part of the {@link ApiModel} hierarchy of classes, which are serializable representations of
 * API declarations.
 *
 * `ApiInterface` represents a TypeScript declaration such as this:
 *
 * ```ts
 * export interface X extends Y {
 * }
 * ```
 * @public
 */
export class ApiInterface extends ApiItemContainerMixin(
	ApiNameMixin(ApiTypeParameterListMixin(ApiReleaseTagMixin(ApiExportedMixin(ApiDeclaredItem)))),
) {
	private readonly _extendsTypes: HeritageType[] = [];

	public constructor(options: IApiInterfaceOptions) {
		super(options);

		for (const extendsTokenRange of options.extendsTokenRanges) {
			this._extendsTypes.push(new HeritageType(this.buildExcerpt(extendsTokenRange), extendsTokenRange.typeParameters));
		}
	}

	public static getContainerKey(name: string): string {
		return `${name}|${ApiItemKind.Interface}`;
	}

	/**
	 * @override
	 */
	public static override onDeserializeInto(
		options: Partial<IApiInterfaceOptions>,
		context: DeserializerContext,
		jsonObject: IApiInterfaceJson,
	): void {
		super.onDeserializeInto(options, context, jsonObject);

		options.extendsTokenRanges = jsonObject.extendsTokenRanges;
	}

	/**
	 * @override
	 */
	public override get kind(): ApiItemKind {
		return ApiItemKind.Interface;
	}

	/**
	 * @override
	 */
	public override get containerKey(): string {
		return ApiInterface.getContainerKey(this.name);
	}

	/**
	 * The list of base interfaces that this interface inherits from using the `extends` keyword.
	 */
	public get extendsTypes(): readonly HeritageType[] {
		return this._extendsTypes;
	}

	/**
	 * @override
	 */
	public override serializeInto(jsonObject: Partial<IApiInterfaceJson>): void {
		super.serializeInto(jsonObject);

		jsonObject.extendsTokenRanges = this.extendsTypes.map((x) => ({
			...x.excerpt.tokenRange,
			typeParameters: x.typeParameters ?? [],
		}));
	}

	/**
	 * @beta @override
	 */
	public override buildCanonicalReference(): DeclarationReference {
		const nameComponent: Component = DeclarationReference.parseComponent(this.name);
		const navigation: Navigation = this.isExported ? Navigation.Exports : Navigation.Locals;
		return (this.parent ? this.parent.canonicalReference : DeclarationReference.empty())
			.addNavigationStep(navigation as any, nameComponent)
			.withMeaning(Meaning.Interface as any);
	}
}
