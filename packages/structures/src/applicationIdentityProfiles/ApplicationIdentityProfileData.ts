import type { APIApplicationIdentityProfileData } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents the game stats in an application identity profile.
 *
 * @typeParam Omitted - Specify properties removed from raw data through `DataTemplate`.
 * @remarks `primary` contains an `ApplicationIdentityProfilePrimaryData` substructure. `dynamic` contains an array of
 * `ApplicationIdentityProfileStringDynamicField`, `ApplicationIdentityProfileNumberDynamicField`, or
 * `ApplicationIdentityProfileMediaDynamicField` substructures. They remain raw for an extending class to instantiate
 * and expose, and are preserved in `toJSON()`.
 */
export class ApplicationIdentityProfileData<
	Omitted extends keyof APIApplicationIdentityProfileData | '' = '',
> extends Structure<APIApplicationIdentityProfileData, Omitted> {
	/** The template used to remove properties from the raw game stats. */
	public static override readonly DataTemplate: Partial<APIApplicationIdentityProfileData> = {};

	/**
	 * @param data - The raw profile game stats received from the API.
	 */
	public constructor(data: Partialize<APIApplicationIdentityProfileData, Omitted>) {
		super(data);
	}
}
