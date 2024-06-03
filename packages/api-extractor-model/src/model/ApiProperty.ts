// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { DeclarationReference, type Component } from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference.js';
import { ApiItemKind, Navigation, Meaning } from '../items/ApiItem.js';
import { ApiPropertyItem, type IApiPropertyItemOptions } from '../items/ApiPropertyItem.js';
import { ApiAbstractMixin, type IApiAbstractMixinOptions } from '../mixins/ApiAbstractMixin.js';
import { ApiInitializerMixin, type IApiInitializerMixinOptions } from '../mixins/ApiInitializerMixin.js';
import { ApiProtectedMixin, type IApiProtectedMixinOptions } from '../mixins/ApiProtectedMixin.js';
import { ApiStaticMixin, type IApiStaticMixinOptions } from '../mixins/ApiStaticMixin.js';

/**
 * Constructor options for {@link ApiProperty}.
 *
 * @public
 */
export interface IApiPropertyOptions
	extends IApiPropertyItemOptions,
		IApiAbstractMixinOptions,
		IApiProtectedMixinOptions,
		IApiStaticMixinOptions,
		IApiInitializerMixinOptions {}

/**
 * Represents a TypeScript property declaration that belongs to an `ApiClass`.
 *
 * @remarks
 *
 * This is part of the {@link ApiModel} hierarchy of classes, which are serializable representations of
 * API declarations.
 *
 * `ApiProperty` represents a TypeScript declaration such as the `width` and `height` members in this example:
 *
 * ```ts
 * export class Widget {
 *   public width: number = 100;
 *
 *   public get height(): number {
 *     if (this.isSquashed()) {
 *       return 0;
 *     } else {
 *       return this.clientArea.height;
 *     }
 *   }
 * }
 * ```
 *
 * Note that member variables are also considered to be properties.
 *
 * If the property has both a getter function and setter function, they will be represented by a single `ApiProperty`
 * and must have a single documentation comment.
 *
 * Compare with {@link ApiPropertySignature}, which represents a property belonging to an interface.
 * For example, a class property can be `static` but an interface property cannot.
 * @public
 */
export class ApiProperty extends ApiAbstractMixin(
	ApiProtectedMixin(ApiStaticMixin(ApiInitializerMixin(ApiPropertyItem))),
) {
	public constructor(options: IApiPropertyOptions) {
		super(options);
	}

	public static getContainerKey(name: string, isStatic: boolean): string {
		if (isStatic) {
			return `${name}|${ApiItemKind.Property}|static`;
		} else {
			return `${name}|${ApiItemKind.Property}|instance`;
		}
	}

	/**
	 * @override
	 */
	public override get kind(): ApiItemKind {
		return ApiItemKind.Property;
	}

	/**
	 * @override
	 */
	public override get containerKey(): string {
		return ApiProperty.getContainerKey(this.name, this.isStatic);
	}

	/**
	 * @beta @override
	 */
	public override buildCanonicalReference(): DeclarationReference {
		const nameComponent: Component = DeclarationReference.parseComponent(this.name);
		return (this.parent ? this.parent.canonicalReference : DeclarationReference.empty())
			.addNavigationStep((this.isStatic ? Navigation.Exports : Navigation.Members) as any, nameComponent)
			.withMeaning(Meaning.Member as any);
	}
}
