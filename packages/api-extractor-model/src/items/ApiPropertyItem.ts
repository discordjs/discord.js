// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { type IApiNameMixinOptions, ApiNameMixin } from '../mixins/ApiNameMixin.js';
import { ApiOptionalMixin, type IApiOptionalMixinOptions } from '../mixins/ApiOptionalMixin.js';
import { ApiReadonlyMixin, type IApiReadonlyMixinOptions } from '../mixins/ApiReadonlyMixin.js';
import { ApiReleaseTagMixin, type IApiReleaseTagMixinOptions } from '../mixins/ApiReleaseTagMixin.js';
import type { Excerpt, IExcerptTokenRange } from '../mixins/Excerpt.js';
import type { DeserializerContext } from '../model/DeserializerContext.js';
import { type IApiDeclaredItemOptions, ApiDeclaredItem, type IApiDeclaredItemJson } from './ApiDeclaredItem.js';

/**
 * Constructor options for {@link ApiPropertyItem}.
 *
 * @public
 */
export interface IApiPropertyItemOptions
	extends IApiNameMixinOptions,
		IApiReleaseTagMixinOptions,
		IApiOptionalMixinOptions,
		IApiReadonlyMixinOptions,
		IApiDeclaredItemOptions {
	propertyTypeTokenRange: IExcerptTokenRange;
}

export interface IApiPropertyItemJson extends IApiDeclaredItemJson {
	propertyTypeTokenRange: IExcerptTokenRange;
}

/**
 * The abstract base class for {@link ApiProperty} and {@link ApiPropertySignature}.
 *
 * @public
 */
export class ApiPropertyItem extends ApiNameMixin(
	ApiReleaseTagMixin(ApiOptionalMixin(ApiReadonlyMixin(ApiDeclaredItem))),
) {
	/**
	 * An {@link Excerpt} that describes the type of the property.
	 */
	public readonly propertyTypeExcerpt: Excerpt;

	public constructor(options: IApiPropertyItemOptions) {
		super(options);

		this.propertyTypeExcerpt = this.buildExcerpt(options.propertyTypeTokenRange);
	}

	/**
	 * @override
	 */
	public static override onDeserializeInto(
		options: Partial<IApiPropertyItemOptions>,
		context: DeserializerContext,
		jsonObject: IApiPropertyItemJson,
	): void {
		super.onDeserializeInto(options, context, jsonObject);

		options.propertyTypeTokenRange = jsonObject.propertyTypeTokenRange;
	}

	/**
	 * Returns true if this property should be documented as an event.
	 *
	 * @remarks
	 * The `@eventProperty` TSDoc modifier can be added to readonly properties to indicate that they return an
	 * event object that event handlers can be attached to.  The event-handling API is implementation-defined, but
	 * typically the return type would be a class with members such as `addHandler()` and `removeHandler()`.
	 * The documentation should display such properties under an "Events" heading instead of the
	 * usual "Properties" heading.
	 */
	public get isEventProperty(): boolean {
		if (this.tsdocComment) {
			return this.tsdocComment.modifierTagSet.isEventProperty();
		}

		return false;
	}

	/**
	 * @override
	 */
	public override serializeInto(jsonObject: Partial<IApiPropertyItemJson>): void {
		super.serializeInto(jsonObject);

		jsonObject.propertyTypeTokenRange = this.propertyTypeExcerpt.tokenRange;
	}
}
