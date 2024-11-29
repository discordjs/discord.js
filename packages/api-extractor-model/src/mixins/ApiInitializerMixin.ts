// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { InternalError } from '@rushstack/node-core-library';
import { ApiDeclaredItem } from '../items/ApiDeclaredItem.js';
import type { ApiItem, IApiItemJson, IApiItemConstructor, IApiItemOptions } from '../items/ApiItem.js';
import type { DeserializerContext } from '../model/DeserializerContext.js';
import type { IExcerptTokenRange, Excerpt } from './Excerpt.js';

/**
 * Constructor options for {@link (IApiInitializerMixinOptions:interface)}.
 *
 * @public
 */
export interface IApiInitializerMixinOptions extends IApiItemOptions {
	initializerTokenRange?: IExcerptTokenRange | undefined;
}

export interface IApiInitializerMixinJson extends IApiItemJson {
	initializerTokenRange?: IExcerptTokenRange;
}

const _initializerExcerpt: unique symbol = Symbol('ApiInitializerMixin._initializerExcerpt');

/**
 * The mixin base class for API items that can have an initializer.
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

export interface ApiInitializerMixin extends ApiItem {
	/**
	 * An {@link Excerpt} that describes the item's initializer.
	 */
	readonly initializerExcerpt?: Excerpt | undefined;

	/**
	 * @override
	 */
	serializeInto(jsonObject: Partial<IApiInitializerMixinJson>): void;
}

/**
 * Mixin function for {@link (ApiInitializerMixin:interface)}.
 *
 * @param baseClass - The base class to be extended
 * @returns A child class that extends baseClass, adding the {@link (ApiInitializerMixin:interface)} functionality.
 * @public
 */
export function ApiInitializerMixin<TBaseClass extends IApiItemConstructor>(
	baseClass: TBaseClass,
): TBaseClass & (new (...args: any[]) => ApiInitializerMixin) {
	class MixedClass extends baseClass implements ApiInitializerMixin {
		public [_initializerExcerpt]?: Excerpt;

		public constructor(...args: any[]) {
			super(...args);

			const options: IApiInitializerMixinOptions = args[0];

			if (this instanceof ApiDeclaredItem) {
				if (options.initializerTokenRange) {
					this[_initializerExcerpt] = this.buildExcerpt(options.initializerTokenRange);
				}
			} else {
				throw new InternalError('ApiInitializerMixin expects a base class that inherits from ApiDeclaredItem');
			}
		}

		/**
		 * @override
		 */
		public static override onDeserializeInto(
			options: Partial<IApiInitializerMixinOptions>,
			context: DeserializerContext,
			jsonObject: IApiInitializerMixinJson,
		): void {
			baseClass.onDeserializeInto(options, context, jsonObject);

			options.initializerTokenRange = jsonObject.initializerTokenRange;
		}

		public get initializerExcerpt(): Excerpt | undefined {
			return this[_initializerExcerpt];
		}

		/**
		 * @override
		 */
		public override serializeInto(jsonObject: Partial<IApiInitializerMixinJson>): void {
			super.serializeInto(jsonObject);

			// Note that JSON does not support the "undefined" value, so we simply omit the field entirely if it is undefined
			if (this.initializerExcerpt) {
				jsonObject.initializerTokenRange = this.initializerExcerpt.tokenRange;
			}
		}
	}

	return MixedClass;
}

/**
 * Static members for {@link (ApiInitializerMixin:interface)}.
 *
 * @public
 */
export namespace ApiInitializerMixin {
	/**
	 * A type guard that tests whether the specified `ApiItem` subclass extends the `ApiInitializerMixin` mixin.
	 *
	 * @remarks
	 *
	 * The JavaScript `instanceof` operator cannot be used to test for mixin inheritance, because each invocation of
	 * the mixin function produces a different subclass.  (This could be mitigated by `Symbol.hasInstance`, however
	 * the TypeScript type system cannot invoke a runtime test.)
	 */
	export function isBaseClassOf(apiItem: ApiItem): apiItem is ApiInitializerMixin {
		return apiItem.hasOwnProperty(_initializerExcerpt);
	}
}
