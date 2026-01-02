import type { APIRoleTags } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents tags for a role.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class RoleTags<Omitted extends keyof APIRoleTags | '' = ''> extends Structure<APIRoleTags, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each RoleTags
	 */
	public static override readonly DataTemplate: Partial<APIRoleTags> = {};

	/**
	 * @param data - The raw data received from the API for the role tags
	 */
	public constructor(data: Partialize<APIRoleTags, Omitted>) {
		super(data);
	}

	/**
	 * The id of the bot this role belongs to
	 */
	public get botId() {
		return this[kData].bot_id;
	}

	/**
	 * The id of the integration this role belongs to
	 */
	public get integrationId() {
		return this[kData].integration_id;
	}

	/**
	 * Whether this is the guild's premium subscriber role
	 */
	public get premiumSubscriber() {
		return this[kData].premium_subscriber !== undefined;
	}

	/**
	 * The id of this role's subscription sku and listing
	 */
	public get subscriptionListingId() {
		return this[kData].subscription_listing_id;
	}

	/**
	 * Whether this role is available for purchase
	 */
	public get availableForPurchase() {
		return this[kData].available_for_purchase !== undefined;
	}

	/**
	 * Whether this role is a guild's linked role
	 */
	public get guildConnections() {
		return this[kData].guild_connections !== undefined;
	}
}
