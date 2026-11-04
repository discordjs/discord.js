import type { APIApplicationIdentityProfile } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents game data stored on an application identity.
 *
 * @typeParam Omitted - Specify properties removed from raw data through `DataTemplate`.
 * @remarks `data` contains an `ApplicationIdentityProfileData` substructure. It remains raw for an extending class to
 * instantiate and expose. Arbitrary game-defined `metadata` also remains raw. Both fields are preserved in `toJSON()`.
 */
export class ApplicationIdentityProfile<
	Omitted extends keyof APIApplicationIdentityProfile | '' = '',
> extends Structure<APIApplicationIdentityProfile, Omitted> {
	/** The template used to remove properties from the raw profile data. */
	public static override readonly DataTemplate: Partial<APIApplicationIdentityProfile> = {};

	/**
	 * @param data - The raw application identity profile received from the API.
	 */
	public constructor(data: Partialize<APIApplicationIdentityProfile, Omitted>) {
		super(data);
	}

	/** The user's username in the external system. */
	public get username() {
		return this[kData].username;
	}
}
