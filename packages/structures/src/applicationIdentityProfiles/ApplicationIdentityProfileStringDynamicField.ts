import type { APIApplicationIdentityProfileStringDynamicField } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents a custom text stat in an application identity profile.
 *
 * @typeParam Omitted - Specify properties removed from raw data through `DataTemplate`.
 */
export class ApplicationIdentityProfileStringDynamicField<
	Omitted extends keyof APIApplicationIdentityProfileStringDynamicField | '' = '',
> extends Structure<APIApplicationIdentityProfileStringDynamicField, Omitted> {
	/** The template used to remove properties from the raw text stat. */
	public static override readonly DataTemplate: Partial<APIApplicationIdentityProfileStringDynamicField> = {};

	/**
	 * @param data - The raw text stat received from the API.
	 */
	public constructor(data: Partialize<APIApplicationIdentityProfileStringDynamicField, Omitted>) {
		super(data);
	}

	/**
	 * The dynamic field type, identifying a string field.
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

	/** The text value. */
	public get value() {
		return this[kData].value;
	}
}
