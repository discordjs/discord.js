// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { DeclarationReference, type Component } from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference.js';
import { ApiItemKind, Navigation, Meaning } from '../items/ApiItem.js';
import { ApiPropertyItem, type IApiPropertyItemOptions } from '../items/ApiPropertyItem.js';

/**
 * Constructor options for {@link ApiPropertySignature}.
 *
 * @public
 */
export interface IApiPropertySignatureOptions extends IApiPropertyItemOptions {}

/**
 * Represents a TypeScript property declaration that belongs to an `ApiInterface`.
 *
 * @remarks
 *
 * This is part of the {@link ApiModel} hierarchy of classes, which are serializable representations of
 * API declarations.
 *
 * `ApiPropertySignature` represents a TypeScript declaration such as the `width` and `height` members in this example:
 *
 * ```ts
 * export interface IWidget {
 *   readonly width: number;
 *   height: number;
 * }
 * ```
 *
 * Compare with {@link ApiProperty}, which represents a property belonging to a class.
 * For example, a class property can be `static` but an interface property cannot.
 * @public
 */
export class ApiPropertySignature extends ApiPropertyItem {
	public constructor(options: IApiPropertySignatureOptions) {
		super(options);
	}

	public static getContainerKey(name: string): string {
		return `${name}|${ApiItemKind.PropertySignature}`;
	}

	/**
	 * @override
	 */
	public override get kind(): ApiItemKind {
		return ApiItemKind.PropertySignature;
	}

	/**
	 * @override
	 */
	public override get containerKey(): string {
		return ApiPropertySignature.getContainerKey(this.name);
	}

	/**
	 * @beta @override
	 */
	public override buildCanonicalReference(): DeclarationReference {
		const nameComponent: Component = DeclarationReference.parseComponent(this.name);
		return (this.parent ? this.parent.canonicalReference : DeclarationReference.empty())
			.addNavigationStep(Navigation.Members as any, nameComponent)
			.withMeaning(Meaning.Member as any);
	}
}
