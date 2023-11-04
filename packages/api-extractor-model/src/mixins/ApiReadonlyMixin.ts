// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import type { ApiItem, IApiItemJson, IApiItemConstructor, IApiItemOptions } from '../items/ApiItem.js';
import type { DeserializerContext } from '../model/DeserializerContext.js';

/**
 * Constructor options for {@link (ApiReadonlyMixin:interface)}.
 *
 * @public
 */
export interface IApiReadonlyMixinOptions extends IApiItemOptions {
	isReadonly: boolean;
}

export interface IApiReadonlyMixinJson extends IApiItemJson {
	isReadonly: boolean;
}

const _isReadonly: unique symbol = Symbol('ApiReadonlyMixin._isReadonly');

/**
 * The mixin base class for API items that cannot be modified after instantiation.
 * Examples such as the readonly modifier and only having a getter but no setter.
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

export interface ApiReadonlyMixin extends ApiItem {
	/**
	 * Indicates that the API item's value cannot be assigned by an external consumer.
	 *
	 * @remarks
	 * Examples of API items that would be considered "read only" by API Extractor:
	 *
	 * - A class or interface's property that has the `readonly` modifier.
	 *
	 * - A variable that has the `const` modifier.
	 *
	 * - A property or variable whose TSDoc comment includes the `@readonly` tag.
	 *
	 * - A property declaration with a getter but no setter.
	 *
	 * Note that if the `readonly` keyword appears in a type annotation, this does not
	 * guarantee that that the API item will be considered readonly. For example:
	 *
	 * ```ts
	 * declare class C {
	 *   // isReadonly=false in this case, because C.x is assignable
	 *   public x: readonly string[];
	 * }
	 * ```
	 */
	readonly isReadonly: boolean;

	serializeInto(jsonObject: Partial<IApiItemJson>): void;
}

/**
 * Mixin function for {@link (ApiReadonlyMixin:interface)}.
 *
 * @param baseClass - The base class to be extended
 * @returns A child class that extends baseClass, adding the {@link (ApiReadonlyMixin:interface)}
 * functionality.
 * @public
 */
export function ApiReadonlyMixin<TBaseClass extends IApiItemConstructor>(
	baseClass: TBaseClass,
): TBaseClass & (new (...args: any[]) => ApiReadonlyMixin) {
	class MixedClass extends baseClass implements ApiReadonlyMixin {
		public [_isReadonly]: boolean;

		public constructor(...args: any[]) {
			super(...args);

			const options: IApiReadonlyMixinOptions = args[0];
			this[_isReadonly] = options.isReadonly;
		}

		/**
		 * @override
		 */
		public static override onDeserializeInto(
			options: Partial<IApiReadonlyMixinOptions>,
			context: DeserializerContext,
			jsonObject: IApiReadonlyMixinJson,
		): void {
			baseClass.onDeserializeInto(options, context, jsonObject);

			options.isReadonly = jsonObject.isReadonly || false;
		}

		public get isReadonly(): boolean {
			return this[_isReadonly];
		}

		/**
		 * @override
		 */
		public override serializeInto(jsonObject: Partial<IApiReadonlyMixinJson>): void {
			super.serializeInto(jsonObject);

			jsonObject.isReadonly = this.isReadonly;
		}
	}

	return MixedClass;
}

/**
 * Static members for {@link (ApiReadonlyMixin:interface)}.
 *
 * @public
 */
export namespace ApiReadonlyMixin {
	/**
	 * A type guard that tests whether the specified `ApiItem` subclass extends the `ApiReadonlyMixin` mixin.
	 *
	 * @remarks
	 *
	 * The JavaScript `instanceof` operator cannot be used to test for mixin inheritance, because each invocation of
	 * the mixin function produces a different subclass.  (This could be mitigated by `Symbol.hasInstance`, however
	 * the TypeScript type system cannot invoke a runtime test.)
	 */
	export function isBaseClassOf(apiItem: ApiItem): apiItem is ApiReadonlyMixin {
		return apiItem.hasOwnProperty(_isReadonly);
	}
}
