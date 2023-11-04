// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { InternalError } from '@rushstack/node-core-library';
import { ApiDeclaredItem } from '../items/ApiDeclaredItem.js';
import type { ApiItem, IApiItemJson, IApiItemConstructor, IApiItemOptions } from '../items/ApiItem.js';
import type { DeserializerContext } from '../model/DeserializerContext.js';
import { TypeParameter } from '../model/TypeParameter.js';
import type { Excerpt, IExcerptTokenRange } from './Excerpt.js';

/**
 * Represents parameter information that is part of {@link IApiTypeParameterListMixinOptions}
 *
 * @public
 */
export interface IApiTypeParameterOptions {
	constraintTokenRange: IExcerptTokenRange;
	defaultTypeTokenRange: IExcerptTokenRange;
	typeParameterName: string;
}

/**
 * Constructor options for {@link (ApiTypeParameterListMixin:interface)}.
 *
 * @public
 */
export interface IApiTypeParameterListMixinOptions extends IApiItemOptions {
	typeParameters: IApiTypeParameterOptions[];
}

export interface IApiTypeParameterListMixinJson extends IApiItemJson {
	typeParameters: IApiTypeParameterOptions[];
}

const _typeParameters: unique symbol = Symbol('ApiTypeParameterListMixin._typeParameters');

/**
 * The mixin base class for API items that can have type parameters.
 *
 * @remarks
 *
 * This is part of the {@link ApiModel} hierarchy of classes, which are serializable representations of
 * API declarations.  The non-abstract classes (e.g. `ApiClass`, `ApiEnum`, `ApiInterface`, etc.) use
 * TypeScript "mixin" functions (e.g. `ApiDeclaredItem`, `ApiItemContainerMixin`, etc.) to add various
 * features that cannot be represented as a normal inheritance chain (since TypeScript does not allow a child class
 * to extend more than one base class).  The "mixin" is a TypeScript merged declaration with three components:
 * the function that generates a subclass, an interface that describes the members of the subclass, and
 * a namespace containing static members of the class.
 * @public
 */

export interface ApiTypeParameterListMixin extends ApiItem {
	serializeInto(jsonObject: Partial<IApiItemJson>): void;

	/**
	 * The type parameters.
	 */
	readonly typeParameters: readonly TypeParameter[];
}

/**
 * Mixin function for {@link (ApiTypeParameterListMixin:interface)}.
 *
 * @param baseClass - The base class to be extended
 * @returns A child class that extends baseClass, adding the {@link (ApiTypeParameterListMixin:interface)}
 * functionality.
 * @public
 */
export function ApiTypeParameterListMixin<TBaseClass extends IApiItemConstructor>(
	baseClass: TBaseClass,
): TBaseClass & (new (...args: any[]) => ApiTypeParameterListMixin) {
	class MixedClass extends baseClass implements ApiTypeParameterListMixin {
		public readonly [_typeParameters]: TypeParameter[];

		public constructor(...args: any[]) {
			super(...args);

			const options: IApiTypeParameterListMixinOptions = args[0];

			this[_typeParameters] = [];

			if (this instanceof ApiDeclaredItem) {
				if (options.typeParameters) {
					for (const typeParameterOptions of options.typeParameters) {
						const defaultTypeExcerpt: Excerpt = this.buildExcerpt(typeParameterOptions.defaultTypeTokenRange);
						const typeParameter: TypeParameter = new TypeParameter({
							name: typeParameterOptions.typeParameterName,
							constraintExcerpt: this.buildExcerpt(typeParameterOptions.constraintTokenRange),
							defaultTypeExcerpt,
							isOptional: !defaultTypeExcerpt.isEmpty,
							parent: this,
						});

						this[_typeParameters].push(typeParameter);
					}
				}
			} else {
				throw new InternalError('ApiTypeParameterListMixin expects a base class that inherits from ApiDeclaredItem');
			}
		}

		/**
		 * @override
		 */
		public static override onDeserializeInto(
			options: Partial<IApiTypeParameterListMixinOptions>,
			context: DeserializerContext,
			jsonObject: IApiTypeParameterListMixinJson,
		): void {
			baseClass.onDeserializeInto(options, context, jsonObject);

			options.typeParameters = jsonObject.typeParameters || [];
		}

		public get typeParameters(): readonly TypeParameter[] {
			return this[_typeParameters];
		}

		/**
		 * @override
		 */
		public override serializeInto(jsonObject: Partial<IApiTypeParameterListMixinJson>): void {
			super.serializeInto(jsonObject);

			const typeParameterObjects: IApiTypeParameterOptions[] = [];
			for (const typeParameter of this.typeParameters) {
				typeParameterObjects.push({
					typeParameterName: typeParameter.name,
					constraintTokenRange: typeParameter.constraintExcerpt.tokenRange,
					defaultTypeTokenRange: typeParameter.defaultTypeExcerpt.tokenRange,
				});
			}

			if (typeParameterObjects.length > 0) {
				jsonObject.typeParameters = typeParameterObjects;
			}
		}
	}

	return MixedClass;
}

/**
 * Static members for {@link (ApiTypeParameterListMixin:interface)}.
 *
 * @public
 */
export namespace ApiTypeParameterListMixin {
	/**
	 * A type guard that tests whether the specified `ApiItem` subclass extends the `ApiParameterListMixin` mixin.
	 *
	 * @remarks
	 *
	 * The JavaScript `instanceof` operator cannot be used to test for mixin inheritance, because each invocation of
	 * the mixin function produces a different subclass.  (This could be mitigated by `Symbol.hasInstance`, however
	 * the TypeScript type system cannot invoke a runtime test.)
	 */
	export function isBaseClassOf(apiItem: ApiItem): apiItem is ApiTypeParameterListMixin {
		return apiItem.hasOwnProperty(_typeParameters);
	}
}
