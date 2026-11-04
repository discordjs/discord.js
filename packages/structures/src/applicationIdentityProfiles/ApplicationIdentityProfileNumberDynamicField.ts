import type { APIApplicationIdentityProfileNumberDynamicField } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents a custom numeric stat in an application identity profile.
 *
 * @typeParam Omitted - Specify properties removed from raw data through `DataTemplate`.
 */
export class ApplicationIdentityProfileNumberDynamicField<
	Omitted extends keyof APIApplicationIdentityProfileNumberDynamicField | '' = '',
> extends Structure<APIApplicationIdentityProfileNumberDynamicField, Omitted> {
	/** The template used to remove properties from the raw numeric stat. */
	public static override readonly DataTemplate: Partial<APIApplicationIdentityProfileNumberDynamicField> = {};

	/**
	 * @param data - The raw numeric stat received from the API.
	 */
	public constructor(data: Partialize<APIApplicationIdentityProfileNumberDynamicField, Omitted>) {
		super(data);
	}

	/**
	 * The dynamic field type, identifying a number field.
	 *
	 * @see {@link https://docs.discord.com/developers/resources/application-identity-profile#dynamic-field-object-dynamic-field-types}
	 */
	public get type() {
		return this[kData].type;
	}

	/** The data key used in the widget editor. */
	public get name() {
		return this[kData].name;
	}

	/** The numeric value. */
	public get value() {
		return this[kData].value;
	}
}
