// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import type { Excerpt, IExcerptTokenRange } from '../mixins/Excerpt.js';

/**
 * Represents a type referenced via an "extends" or "implements" heritage clause for a TypeScript class
 * or interface.
 *
 * @remarks
 *
 * For example, consider this declaration:
 *
 * ```ts
 * export class Widget extends Controls.WidgetBase implements Controls.IWidget, IDisposable {
 *   // . . .
 * }
 * ```
 *
 * The heritage types are `Controls.WidgetBase`, `Controls.IWidget`, and `IDisposable`.
 * @public
 */
export class HeritageType {
	/**
	 * An excerpt corresponding to the referenced type.
	 *
	 * @remarks
	 *
	 * For example, consider this declaration:
	 *
	 * ```ts
	 * export class Widget extends Controls.WidgetBase implements Controls.IWidget, IDisposable {
	 *   // . . .
	 * }
	 * ```
	 *
	 * The excerpt might be `Controls.WidgetBase`, `Controls.IWidget`, or `IDisposable`.
	 */
	public readonly excerpt: Excerpt;

	public readonly typeParameters?: IExcerptTokenRange[];

	public constructor(excerpt: Excerpt, typeParameters: IExcerptTokenRange[]) {
		this.excerpt = excerpt;
		this.typeParameters = typeParameters;
	}
}
