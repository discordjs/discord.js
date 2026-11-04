import type { APIApplicationIdentityProfileMediaDynamicField } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents a custom media stat in an application identity profile.
 *
 * @typeParam Omitted - Specify properties removed from raw data through `DataTemplate`.
 * @remarks `value` contains an `ApplicationIdentityProfileMedia` substructure. It remains raw for an extending class
 * to instantiate and expose, and is preserved in `toJSON()`.
 */
export class ApplicationIdentityProfileMediaDynamicField<
	Omitted extends keyof APIApplicationIdentityProfileMediaDynamicField | '' = '',
> extends Structure<APIApplicationIdentityProfileMediaDynamicField, Omitted> {
	/** The template used to remove properties from the raw media stat. */
	public static override readonly DataTemplate: Partial<APIApplicationIdentityProfileMediaDynamicField> = {};

	/**
	 * @param data - The raw media stat received from the API.
	 */
	public constructor(data: Partialize<APIApplicationIdentityProfileMediaDynamicField, Omitted>) {
		super(data);
	}

	/**
	 * The dynamic field type, identifying a media field.
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
}
