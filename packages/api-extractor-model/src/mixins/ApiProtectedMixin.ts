// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import type { ApiItem, IApiItemJson, IApiItemConstructor, IApiItemOptions } from '../items/ApiItem.js';
import type { DeserializerContext } from '../model/DeserializerContext.js';

/**
 * Constructor options for {@link (IApiProtectedMixinOptions:interface)}.
 *
 * @public
 */
export interface IApiProtectedMixinOptions extends IApiItemOptions {
	isProtected: boolean;
}

export interface IApiProtectedMixinJson extends IApiItemJson {
	isProtected: boolean;
}

const _isProtected: unique symbol = Symbol('ApiProtectedMixin._isProtected');

/**
 * The mixin base class for API items that can have the TypeScript `protected` keyword applied to them.
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

export interface ApiProtectedMixin extends ApiItem {
	/**
	 * Whether the declaration has the TypeScript `protected` keyword.
	 */
	readonly isProtected: boolean;

	/**
	 * @override
	 */
	serializeInto(jsonObject: Partial<IApiItemJson>): void;
}

/**
 * Mixin function for {@link (ApiProtectedMixin:interface)}.
 *
 * @param baseClass - The base class to be extended
 * @returns A child class that extends baseClass, adding the {@link (ApiProtectedMixin:interface)} functionality.
 * @public
 */
export function ApiProtectedMixin<TBaseClass extends IApiItemConstructor>(
	baseClass: TBaseClass,
): TBaseClass & (new (...args: any[]) => ApiProtectedMixin) {
	class MixedClass extends baseClass implements ApiProtectedMixin {
		public [_isProtected]: boolean;

		public constructor(...args: any[]) {
			super(...args);

			const options: IApiProtectedMixinOptions = args[0];
			this[_isProtected] = options.isProtected;
		}

		/**
		 * @override
		 */
		public static override onDeserializeInto(
			options: Partial<IApiProtectedMixinOptions>,
			context: DeserializerContext,
			jsonObject: IApiProtectedMixinJson,
		): void {
			baseClass.onDeserializeInto(options, context, jsonObject);

			options.isProtected = jsonObject.isProtected;
		}

		public get isProtected(): boolean {
			return this[_isProtected];
		}

		/**
		 * @override
		 */
		public override serializeInto(jsonObject: Partial<IApiProtectedMixinJson>): void {
			super.serializeInto(jsonObject);

			jsonObject.isProtected = this.isProtected;
		}
	}

	return MixedClass;
}

/**
 * Static members for {@link (ApiProtectedMixin:interface)}.
 *
 * @public
 */
export namespace ApiProtectedMixin {
	/**
	 * A type guard that tests whether the specified `ApiItem` subclass extends the `ApiProtectedMixin` mixin.
	 *
	 * @remarks
	 *
	 * The JavaScript `instanceof` operator cannot be used to test for mixin inheritance, because each invocation of
	 * the mixin function produces a different subclass.  (This could be mitigated by `Symbol.hasInstance`, however
	 * the TypeScript type system cannot invoke a runtime test.)
	 */
	export function isBaseClassOf(apiItem: ApiItem): apiItem is ApiProtectedMixin {
		return apiItem.hasOwnProperty(_isProtected);
	}
}
