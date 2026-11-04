import type { APIUserApplicationIdentity } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents an external application identity associated with a Discord user.
 *
 * @typeParam Omitted - Specify properties removed from raw data through `DataTemplate`.
 */
export class UserApplicationIdentity<Omitted extends keyof APIUserApplicationIdentity | '' = ''> extends Structure<
	APIUserApplicationIdentity,
	Omitted
> {
	/** The template used to remove properties from the raw user application identity. */
	public static override readonly DataTemplate: Partial<APIUserApplicationIdentity> = {};

	/**
	 * @param data - The raw user application identity received from the API.
	 */
	public constructor(data: Partialize<APIUserApplicationIdentity, Omitted>) {
		super(data);
	}

	/** The Discord user ID. */
	public get userId() {
		return this[kData].user_id;
	}

	/** The external account provider type. */
	public get providerType() {
		return this[kData].provider_type;
	}

	/** The provider-specific identifier, if present. */
	public get providerId() {
		return this[kData].provider_id;
	}

	/** The user's ID in the external system. */
	public get providerIssuedUserId() {
		return this[kData].provider_issued_user_id;
	}
}
