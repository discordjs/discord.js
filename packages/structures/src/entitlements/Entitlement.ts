import { DiscordSnowflake } from '@sapphire/snowflake';
import type { APIEntitlement } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { dateToDiscordISOTimestamp } from '../utils/optimization.js';
import { kData, kStartsTimestamp, kEndsTimestamp } from '../utils/symbols.js';
import { isIdSet } from '../utils/type-guards.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents any entitlement on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class Entitlement<Omitted extends keyof APIEntitlement | '' = ''> extends Structure<APIEntitlement, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each entitlement
	 */
	public static override readonly DataTemplate: Partial<APIEntitlement> = {};

	protected [kStartsTimestamp]: number | null = null;

	protected [kEndsTimestamp]: number | null = null;

	/**
	 * @param data - The raw data received from the API for the entitlement
	 */
	public constructor(data: Partialize<APIEntitlement, Omitted>) {
		super(data);
		this.optimizeData(data);
	}

	/**
	 * {@inheritDoc Structure.optimizeData}
	 */
	protected override optimizeData(data: Partial<APIEntitlement>) {
		const clone = super.toJSON();
		
		if (data.starts_at) {
			this[kStartsTimestamp] = Date.parse(data.starts_at);
		}

		if (data.ends_at) {
			this[kEndsTimestamp] = Date.parse(data.ends_at);
		}
		
		return clone;
	}

	/**
	 * The id of the entitlement
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The id of the SKU
	 */
	public get skuId() {
		return this[kData].sku_id;
	}

	/**
	 * The id of the parent application
	 */
	public get applicationId() {
		return this[kData].application_id;
	}

	/**
	 * The id of the user that is granted access to the entitlement's SKU
	 */
	public get userId() {
		return this[kData].user_id;
	}

	/**
	 * Type of entitlement
	 *
	 * @see https://discord.com/developers/docs/resources/entitlement#entitlement-object-entitlement-types
	 */
	public get type() {
		return this[kData].type;
	}

	/**
	 * Whether the entitlement was deleted
	 */
	public get deleted() {
		return this[kData].deleted;
	}

	/**
	 * Start date at which the entitlement is valid
	 */
	public get startsAt() {
		const timestamp = this.startsTimestamp;
		return timestamp ? new Date(timestamp) : null;
	}

	/**
	 * Timestamp of the start date at which the entitlement is valid
	 */
	public get startsTimestamp() {
		return this[kStartsTimestamp];
	}

	/**
	 * End date at which the entitlement is valid
	 */
	public get endsAt() {
		const timestamp = this.endsTimestamp;
		return timestamp ? new Date(timestamp) : null;
	}

	/**
	 * Timestamp of the end date at which the entitlement is valid
	 */
	public get endsTimestamp() {
		return this[kEndsTimestamp];
	}

	/**
	 * Id of the guild that is granted access to the entitlement's SKU
	 */
	public get guildId() {
		return this[kData].guild_id;
	}

	/**
	 * For consumable items, whether or not the entitlement has been consumed
	 */
	public get consumed() {
		return this[kData].consumed;
	}

	/**
	 * The timestamp the entitlement was created at
	 */
	public get createdTimestamp() {
		return isIdSet(this.id) ? DiscordSnowflake.timestampFrom(this.id) : null;
	}

	/**
	 * The time the entitlement was created at
	 */
	public get createdAt() {
		const createdTimestamp = this.createdTimestamp;
		return createdTimestamp ? new Date(createdTimestamp) : null;
	}
	
	/**
	 * {@inheritDoc Structure.toJSON}
	 */
	public override toJSON() {
		const clone = super.toJSON();
		
		const startsAtTimestamp = this[kStartsTimestamp];
		const endsAtTimestamp = this[kEndsTimestamp];
		
		if (startsAtTimestamp) {
			clone.starts_at = dateToDiscordISOTimestamp(new Date(startsAtTimestamp));
		}
		
		if (endsAtTimestamp) {
			clone.ends_at = dateToDiscordISOTimestamp(new Date(endsAtTimestamp));
		}

		return clone;
	}
}
