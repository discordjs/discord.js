// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import type { ApiItem, IApiItemJson, IApiItemConstructor, IApiItemOptions } from '../items/ApiItem.js';
import type { DeserializerContext } from '../model/DeserializerContext.js';

/**
 * Constructor options for {@link (IApiNameMixinOptions:interface)}.
 *
 * @public
 */
export interface IApiNameMixinOptions extends IApiItemOptions {
	name: string;
}

export interface IApiNameMixinJson extends IApiItemJson {
	name: string;
}

const _name: unique symbol = Symbol('ApiNameMixin._name');

/**
 * The mixin base class for API items that have a name.  For example, a class has a name, but a class constructor
 * does not.
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

export interface ApiNameMixin extends ApiItem {
	/**
	 * The exported name of this API item.
	 *
	 * @remarks
	 * Note that due tue type aliasing, the exported name may be different from the locally declared name.
	 */
	readonly name: string;

	/**
	 * @override
	 */
	serializeInto(jsonObject: Partial<IApiItemJson>): void;
}

/**
 * Mixin function for {@link (ApiNameMixin:interface)}.
 *
 * @param baseClass - The base class to be extended
 * @returns A child class that extends baseClass, adding the {@link (ApiNameMixin:interface)} functionality.
 * @public
 */
export function ApiNameMixin<TBaseClass extends IApiItemConstructor>(
	baseClass: TBaseClass,
): TBaseClass & (new (...args: any[]) => ApiNameMixin) {
	class MixedClass extends baseClass implements ApiNameMixin {
		public readonly [_name]: string;

		public constructor(...args: any[]) {
			super(...args);

			const options: IApiNameMixinOptions = args[0];
			this[_name] = options.name;
		}

		/**
		 * @override
		 */
		public static override onDeserializeInto(
			options: Partial<IApiNameMixinOptions>,
			context: DeserializerContext,
			jsonObject: IApiNameMixinJson,
		): void {
			baseClass.onDeserializeInto(options, context, jsonObject);

			options.name = jsonObject.name;
		}

		public get name(): string {
			return this[_name];
		}

		/**
		 * @override
		 */
		public override get displayName(): string {
			return this[_name];
		}

		/**
		 * @override
		 */
		public override serializeInto(jsonObject: Partial<IApiNameMixinJson>): void {
			super.serializeInto(jsonObject);

			jsonObject.name = this.name;
		}
	}

	return MixedClass;
}

/**
 * Static members for {@link (ApiNameMixin:interface)}.
 *
 * @public
 */
export namespace ApiNameMixin {
	/**
	 * A type guard that tests whether the specified `ApiItem` subclass extends the `ApiNameMixin` mixin.
	 *
	 * @remarks
	 *
	 * The JavaScript `instanceof` operator cannot be used to test for mixin inheritance, because each invocation of
	 * the mixin function produces a different subclass.  (This could be mitigated by `Symbol.hasInstance`, however
	 * the TypeScript type system cannot invoke a runtime test.)
	 */
	export function isBaseClassOf(apiItem: ApiItem): apiItem is ApiNameMixin {
		return apiItem.hasOwnProperty(_name);
	}
}
