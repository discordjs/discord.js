import type { APIMessageRoleSubscriptionData } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents metadata about the role subscription causing a message.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export abstract class RoleSubscriptionData<
	Omitted extends keyof APIMessageRoleSubscriptionData | '' = '',
> extends Structure<APIMessageRoleSubscriptionData, Omitted> {
	/**
	 * @param data - The raw data received from the API for the connection
	 */
	public constructor(data: Partialize<APIMessageRoleSubscriptionData, Omitted>) {
		super(data);
	}

	/**
	 * The id of the SKU and listing the user is subscribed to
	 */
	public get roleSubscriptionListingId() {
		return this[kData].role_subscription_listing_id;
	}

	/**
	 * The name of the tier the user is subscribed to
	 */
	public get tierName() {
		return this[kData].tier_name;
	}

	/**
	 * The number of months the user has been subscribed for
	 */
	public get totalMonthsSubscribed() {
		return this[kData].total_months_subscribed;
	}

	/**
	 * Whether this notification is for a renewal
	 */
	public get isRenewal() {
		return this[kData].is_renewal;
	}
}
