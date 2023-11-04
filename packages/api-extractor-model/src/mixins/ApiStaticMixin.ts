// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import type { ApiItem, IApiItemJson, IApiItemConstructor, IApiItemOptions } from '../items/ApiItem.js';
import type { DeserializerContext } from '../model/DeserializerContext.js';

/**
 * Constructor options for {@link (IApiStaticMixinOptions:interface)}.
 *
 * @public
 */
export interface IApiStaticMixinOptions extends IApiItemOptions {
	isStatic: boolean;
}

export interface IApiStaticMixinJson extends IApiItemJson {
	isStatic: boolean;
}

const _isStatic: unique symbol = Symbol('ApiStaticMixin._isStatic');

/**
 * The mixin base class for API items that can have the TypeScript `static` keyword applied to them.
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

export interface ApiStaticMixin extends ApiItem {
	/**
	 * Whether the declaration has the TypeScript `static` keyword.
	 */
	readonly isStatic: boolean;

	/**
	 * @override
	 */
	serializeInto(jsonObject: Partial<IApiItemJson>): void;
}

/**
 * Mixin function for {@link (ApiStaticMixin:interface)}.
 *
 * @param baseClass - The base class to be extended
 * @returns A child class that extends baseClass, adding the {@link (ApiStaticMixin:interface)} functionality.
 * @public
 */
export function ApiStaticMixin<TBaseClass extends IApiItemConstructor>(
	baseClass: TBaseClass,
): TBaseClass & (new (...args: any[]) => ApiStaticMixin) {
	class MixedClass extends baseClass implements ApiStaticMixin {
		public [_isStatic]: boolean;

		public constructor(...args: any[]) {
			super(...args);

			const options: IApiStaticMixinOptions = args[0];
			this[_isStatic] = options.isStatic;
		}

		/**
		 * @override
		 */
		public static override onDeserializeInto(
			options: Partial<IApiStaticMixinOptions>,
			context: DeserializerContext,
			jsonObject: IApiStaticMixinJson,
		): void {
			baseClass.onDeserializeInto(options, context, jsonObject);

			options.isStatic = jsonObject.isStatic;
		}

		public get isStatic(): boolean {
			return this[_isStatic];
		}

		/**
		 * @override
		 */
		public override serializeInto(jsonObject: Partial<IApiStaticMixinJson>): void {
			super.serializeInto(jsonObject);

			jsonObject.isStatic = this.isStatic;
		}
	}

	return MixedClass;
}

/**
 * Static members for {@link (ApiStaticMixin:interface)}.
 *
 * @public
 */
export namespace ApiStaticMixin {
	/**
	 * A type guard that tests whether the specified `ApiItem` subclass extends the `ApiStaticMixin` mixin.
	 *
	 * @remarks
	 *
	 * The JavaScript `instanceof` operator cannot be used to test for mixin inheritance, because each invocation of
	 * the mixin function produces a different subclass.  (This could be mitigated by `Symbol.hasInstance`, however
	 * the TypeScript type system cannot invoke a runtime test.)
	 */
	export function isBaseClassOf(apiItem: ApiItem): apiItem is ApiStaticMixin {
		return apiItem.hasOwnProperty(_isStatic);
	}
}
