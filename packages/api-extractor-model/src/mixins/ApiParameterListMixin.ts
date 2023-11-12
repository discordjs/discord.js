// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { InternalError } from '@rushstack/node-core-library';
import { ApiDeclaredItem } from '../items/ApiDeclaredItem.js';
import type { ApiItem, IApiItemJson, IApiItemConstructor, IApiItemOptions } from '../items/ApiItem.js';
import type { DeserializerContext } from '../model/DeserializerContext.js';
import { Parameter } from '../model/Parameter.js';
import type { IExcerptTokenRange } from './Excerpt.js';

/**
 * Represents parameter information that is part of {@link IApiParameterListMixinOptions}
 *
 * @public
 */
export interface IApiParameterOptions {
	isOptional: boolean;
	isRest: boolean;
	parameterName: string;
	parameterTypeTokenRange: IExcerptTokenRange;
}

/**
 * Constructor options for {@link (ApiParameterListMixin:interface)}.
 *
 * @public
 */
export interface IApiParameterListMixinOptions extends IApiItemOptions {
	overloadIndex: number;
	parameters: IApiParameterOptions[];
}

export interface IApiParameterListJson extends IApiItemJson {
	overloadIndex: number;
	parameters: IApiParameterOptions[];
}

const _overloadIndex: unique symbol = Symbol('ApiParameterListMixin._overloadIndex');
const _parameters: unique symbol = Symbol('ApiParameterListMixin._parameters');

/**
 * The mixin base class for API items that can have function parameters (but not necessarily a return value).
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

export interface ApiParameterListMixin extends ApiItem {
	/**
	 * When a function has multiple overloaded declarations, this one-based integer index can be used to uniquely
	 * identify them.
	 *
	 * @remarks
	 *
	 * Consider this overloaded declaration:
	 *
	 * ```ts
	 * export namespace Versioning {
	 *   // TSDoc: Versioning.(addVersions:1)
	 *   export function addVersions(x: number, y: number): number;
	 *
	 *   // TSDoc: Versioning.(addVersions:2)
	 *   export function addVersions(x: string, y: string): string;
	 *
	 *   // (implementation)
	 *   export function addVersions(x: number|string, y: number|string): number|string {
	 *     // . . .
	 *   }
	 * }
	 * ```
	 *
	 * In the above example, there are two overloaded declarations.  The overload using numbers will have
	 * `overloadIndex = 1`.  The overload using strings will have `overloadIndex = 2`.  The third declaration that
	 * accepts all possible inputs is considered part of the implementation, and is not processed by API Extractor.
	 */
	readonly overloadIndex: number;

	/**
	 * The function parameters.
	 */
	readonly parameters: readonly Parameter[];

	serializeInto(jsonObject: Partial<IApiItemJson>): void;
}

/**
 * Mixin function for {@link (ApiParameterListMixin:interface)}.
 *
 * @param baseClass - The base class to be extended
 * @returns A child class that extends baseClass, adding the {@link (ApiParameterListMixin:interface)} functionality.
 * @public
 */
export function ApiParameterListMixin<TBaseClass extends IApiItemConstructor>(
	baseClass: TBaseClass,
): TBaseClass & (new (...args: any[]) => ApiParameterListMixin) {
	class MixedClass extends baseClass implements ApiParameterListMixin {
		public readonly [_overloadIndex]: number;

		public readonly [_parameters]: Parameter[];

		public constructor(...args: any[]) {
			super(...args);

			const options: IApiParameterListMixinOptions = args[0];
			this[_overloadIndex] = options.overloadIndex;

			this[_parameters] = [];

			if (this instanceof ApiDeclaredItem) {
				if (options.parameters) {
					for (const parameterOptions of options.parameters) {
						const parameter: Parameter = new Parameter({
							name: parameterOptions.parameterName,
							parameterTypeExcerpt: this.buildExcerpt(parameterOptions.parameterTypeTokenRange),
							// Prior to ApiJsonSchemaVersion.V_1005 this input will be undefined
							isOptional: Boolean(parameterOptions.isOptional),
							isRest: Boolean(parameterOptions.isRest),
							parent: this,
						});

						this[_parameters].push(parameter);
					}
				}
			} else {
				throw new InternalError('ApiReturnTypeMixin expects a base class that inherits from ApiDeclaredItem');
			}
		}

		/**
		 * @override
		 */
		public static override onDeserializeInto(
			options: Partial<IApiParameterListMixinOptions>,
			context: DeserializerContext,
			jsonObject: IApiParameterListJson,
		): void {
			baseClass.onDeserializeInto(options, context, jsonObject);

			options.overloadIndex = jsonObject.overloadIndex;
			options.parameters = jsonObject.parameters || [];
		}

		public get overloadIndex(): number {
			return this[_overloadIndex];
		}

		public get parameters(): readonly Parameter[] {
			return this[_parameters];
		}

		/**
		 * @override
		 */
		public override serializeInto(jsonObject: Partial<IApiParameterListJson>): void {
			super.serializeInto(jsonObject);

			jsonObject.overloadIndex = this.overloadIndex;

			const parameterObjects: IApiParameterOptions[] = [];
			for (const parameter of this.parameters) {
				parameterObjects.push({
					parameterName: parameter.name,
					parameterTypeTokenRange: parameter.parameterTypeExcerpt.tokenRange,
					isOptional: parameter.isOptional,
					isRest: parameter.isRest,
				});
			}

			jsonObject.parameters = parameterObjects;
		}
	}

	return MixedClass;
}

/**
 * Static members for {@link (ApiParameterListMixin:interface)}.
 *
 * @public
 */
export namespace ApiParameterListMixin {
	/**
	 * A type guard that tests whether the specified `ApiItem` subclass extends the `ApiParameterListMixin` mixin.
	 *
	 * @remarks
	 *
	 * The JavaScript `instanceof` operator cannot be used to test for mixin inheritance, because each invocation of
	 * the mixin function produces a different subclass.  (This could be mitigated by `Symbol.hasInstance`, however
	 * the TypeScript type system cannot invoke a runtime test.)
	 */
	export function isBaseClassOf(apiItem: ApiItem): apiItem is ApiParameterListMixin {
		return apiItem.hasOwnProperty(_parameters);
	}
}
