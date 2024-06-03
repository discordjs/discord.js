// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { DeclarationReference, type Component } from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference.js';
import { ApiDeclaredItem, type IApiDeclaredItemOptions, type IApiDeclaredItemJson } from '../items/ApiDeclaredItem.js';
import { ApiItemKind, Navigation, Meaning } from '../items/ApiItem.js';
import {
	ApiAbstractMixin,
	type IApiAbstractMixinJson,
	type IApiAbstractMixinOptions,
} from '../mixins/ApiAbstractMixin.js';
import {
	type IApiExportedMixinJson,
	type IApiExportedMixinOptions,
	ApiExportedMixin,
} from '../mixins/ApiExportedMixin.js';
import { ApiItemContainerMixin, type IApiItemContainerMixinOptions } from '../mixins/ApiItemContainerMixin.js';
import { type IApiNameMixinOptions, ApiNameMixin } from '../mixins/ApiNameMixin.js';
import { ApiReleaseTagMixin, type IApiReleaseTagMixinOptions } from '../mixins/ApiReleaseTagMixin.js';
import {
	ApiTypeParameterListMixin,
	type IApiTypeParameterListMixinOptions,
	type IApiTypeParameterListMixinJson,
} from '../mixins/ApiTypeParameterListMixin.js';
import type { IExcerptTokenRange } from '../mixins/Excerpt.js';
import type { DeserializerContext } from './DeserializerContext.js';
import { HeritageType } from './HeritageType.js';

/**
 * Constructor options for {@link ApiClass}.
 *
 * @public
 */
export interface IApiClassOptions
	extends IApiItemContainerMixinOptions,
		IApiNameMixinOptions,
		IApiAbstractMixinOptions,
		IApiReleaseTagMixinOptions,
		IApiDeclaredItemOptions,
		IApiTypeParameterListMixinOptions,
		IApiExportedMixinOptions {
	extendsTokenRange: IExcerptTokenRangeWithTypeParameters | undefined;
	implementsTokenRanges: IExcerptTokenRangeWithTypeParameters[];
}

export interface IExcerptTokenRangeWithTypeParameters extends IExcerptTokenRange {
	typeParameters: IExcerptTokenRange[];
}

export interface IApiClassJson
	extends IApiDeclaredItemJson,
		IApiAbstractMixinJson,
		IApiTypeParameterListMixinJson,
		IApiExportedMixinJson {
	extendsTokenRange?: IExcerptTokenRangeWithTypeParameters | undefined;
	implementsTokenRanges: IExcerptTokenRangeWithTypeParameters[];
}

/**
 * Represents a TypeScript class declaration.
 *
 * @remarks
 *
 * This is part of the {@link ApiModel} hierarchy of classes, which are serializable representations of
 * API declarations.
 *
 * `ApiClass` represents a TypeScript declaration such as this:
 *
 * ```ts
 * export class X { }
 * ```
 * @public
 */
export class ApiClass extends ApiItemContainerMixin(
	ApiNameMixin(ApiAbstractMixin(ApiTypeParameterListMixin(ApiReleaseTagMixin(ApiExportedMixin(ApiDeclaredItem))))),
) {
	/**
	 * The base class that this class inherits from (using the `extends` keyword), or undefined if there is no base class.
	 */
	public readonly extendsType: HeritageType | undefined;

	private readonly _implementsTypes: HeritageType[] = [];

	public constructor(options: IApiClassOptions) {
		super(options);

		if (options.extendsTokenRange) {
			this.extendsType = new HeritageType(
				this.buildExcerpt(options.extendsTokenRange),
				options.extendsTokenRange.typeParameters,
			);
		} else {
			this.extendsType = undefined;
		}

		for (const implementsTokenRange of options.implementsTokenRanges) {
			this._implementsTypes.push(
				new HeritageType(this.buildExcerpt(implementsTokenRange), implementsTokenRange.typeParameters),
			);
		}
	}

	public static getContainerKey(name: string): string {
		return `${name}|${ApiItemKind.Class}`;
	}

	/**
	 * @override
	 */
	public static override onDeserializeInto(
		options: Partial<IApiClassOptions>,
		context: DeserializerContext,
		jsonObject: IApiClassJson,
	): void {
		super.onDeserializeInto(options, context, jsonObject);

		options.extendsTokenRange = jsonObject.extendsTokenRange;
		options.implementsTokenRanges = jsonObject.implementsTokenRanges;
	}

	/**
	 * @override
	 */
	public override get kind(): ApiItemKind {
		return ApiItemKind.Class;
	}

	/**
	 * @override
	 */
	public override get containerKey(): string {
		return ApiClass.getContainerKey(this.name);
	}

	/**
	 * The list of interfaces that this class implements using the `implements` keyword.
	 */
	public get implementsTypes(): readonly HeritageType[] {
		return this._implementsTypes;
	}

	/**
	 * @override
	 */
	public override serializeInto(jsonObject: Partial<IApiClassJson>): void {
		super.serializeInto(jsonObject);

		// Note that JSON does not support the "undefined" value, so we simply omit the field entirely if it is undefined
		if (this.extendsType) {
			jsonObject.extendsTokenRange = {
				...this.extendsType.excerpt.tokenRange,
				typeParameters: this.extendsType.typeParameters ?? [],
			};
		}

		jsonObject.implementsTokenRanges = this.implementsTypes.map((x) => ({
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
			.withMeaning(Meaning.Class as any);
	}
}
