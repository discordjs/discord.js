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
import { ApiInitializerMixin, type IApiInitializerMixinOptions } from '../mixins/ApiInitializerMixin.js';
import { type IApiNameMixinOptions, ApiNameMixin } from '../mixins/ApiNameMixin.js';
import { ApiReadonlyMixin, type IApiReadonlyMixinOptions } from '../mixins/ApiReadonlyMixin.js';
import { ApiReleaseTagMixin, type IApiReleaseTagMixinOptions } from '../mixins/ApiReleaseTagMixin.js';
import type { IExcerptTokenRange, Excerpt } from '../mixins/Excerpt.js';
import type { DeserializerContext } from './DeserializerContext.js';

/**
 * Constructor options for {@link ApiVariable}.
 *
 * @public
 */
export interface IApiVariableOptions
	extends IApiNameMixinOptions,
		IApiReleaseTagMixinOptions,
		IApiReadonlyMixinOptions,
		IApiDeclaredItemOptions,
		IApiInitializerMixinOptions,
		IApiExportedMixinOptions {
	variableTypeTokenRange: IExcerptTokenRange;
}

export interface IApiVariableJson extends IApiDeclaredItemJson, IApiExportedMixinJson {
	variableTypeTokenRange: IExcerptTokenRange;
}

/**
 * Represents a TypeScript variable declaration.
 *
 * @remarks
 *
 * This is part of the {@link ApiModel} hierarchy of classes, which are serializable representations of
 * API declarations.
 *
 * `ApiVariable` represents an exported `const` or `let` object such as these examples:
 *
 * ```ts
 * // A variable declaration
 * export let verboseLogging: boolean;
 *
 * // A constant variable declaration with an initializer
 * export const canvas: IWidget = createCanvas();
 * ```
 * @public
 */
export class ApiVariable extends ApiNameMixin(
	ApiReleaseTagMixin(ApiReadonlyMixin(ApiInitializerMixin(ApiExportedMixin(ApiDeclaredItem)))),
) {
	/**
	 * An {@link Excerpt} that describes the type of the variable.
	 */
	public readonly variableTypeExcerpt: Excerpt;

	public constructor(options: IApiVariableOptions) {
		super(options);

		this.variableTypeExcerpt = this.buildExcerpt(options.variableTypeTokenRange);
	}

	/**
	 * @override
	 */
	public static override onDeserializeInto(
		options: Partial<IApiVariableOptions>,
		context: DeserializerContext,
		jsonObject: IApiVariableJson,
	): void {
		super.onDeserializeInto(options, context, jsonObject);

		options.variableTypeTokenRange = jsonObject.variableTypeTokenRange;
	}

	public static getContainerKey(name: string): string {
		return `${name}|${ApiItemKind.Variable}`;
	}

	/**
	 * @override
	 */
	public override get kind(): ApiItemKind {
		return ApiItemKind.Variable;
	}

	/**
	 * @override
	 */
	public override get containerKey(): string {
		return ApiVariable.getContainerKey(this.name);
	}

	/**
	 * @override
	 */
	public override serializeInto(jsonObject: Partial<IApiVariableJson>): void {
		super.serializeInto(jsonObject);

		jsonObject.variableTypeTokenRange = this.variableTypeExcerpt.tokenRange;
	}

	/**
	 * @beta @override
	 */
	public override buildCanonicalReference(): DeclarationReference {
		const nameComponent: Component = DeclarationReference.parseComponent(this.name);
		const navigation: Navigation = this.isExported ? Navigation.Exports : Navigation.Locals;
		return (this.parent ? this.parent.canonicalReference : DeclarationReference.empty())
			.addNavigationStep(navigation as any, nameComponent)
			.withMeaning(Meaning.Variable as any);
	}
}
