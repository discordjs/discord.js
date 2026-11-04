import type { APIApplicationIdentity } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents an external account associated with an application identity.
 *
 * @typeParam Omitted - Specify properties removed from raw data through `DataTemplate`.
 */
export class ApplicationIdentity<Omitted extends keyof APIApplicationIdentity | '' = ''> extends Structure<
	APIApplicationIdentity,
	Omitted
> {
	/** The template used to remove properties from the raw identity data. */
	public static override readonly DataTemplate: Partial<APIApplicationIdentity> = {};

	/**
	 * @param data - The raw application identity received from the API.
	 */
	public constructor(data: Partialize<APIApplicationIdentity, Omitted>) {
		super(data);
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
