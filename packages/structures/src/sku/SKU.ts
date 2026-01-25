import { DiscordSnowflake } from '@sapphire/snowflake';
import type { APISKU, SKUFlags } from 'discord-api-types/v10';
import { Structure } from '../Structure';
import { SKUFlagsBitField } from '../bitfields';
import { kData } from '../utils/symbols';
import { isIdSet } from '../utils/type-guards';
import type { Partialize } from '../utils/types';

/**
 * Represents a premium application's SKU.
 *
 *  @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class SKU<Omitted extends keyof APISKU | '' = ''> extends Structure<APISKU, Omitted> {
	/**
	 * @param data - The raw data received from the API for the SKU.
	 */
	public constructor(data: Partialize<APISKU, Omitted>) {
		super(data);
	}

	/**
	 * The id of the SKU.
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The type of SKU.
	 */
	public get type() {
		return this[kData].type;
	}

	/**
	 * The parent application's id.
	 */
	public get applicationId() {
		return this[kData].application_id;
	}

	/**
	 * Customer-facing name of the premium offering.
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * System-generated URL slug based on the SKU's name.
	 */
	public get slug() {
		return this[kData].slug;
	}

	/**
	 * The flags of the SKU combined as a bitfield.
	 *
	 * @see {@link https://en.wikipedia.org/wiki/Bit_field}
	 */
	public get flags() {
		const flags = this[kData].flags;
		return flags ? new SKUFlagsBitField(flags as SKUFlags) : null;
	}

	/**
	 * The timestamp this SKU was created at
	 */
	public get createdTimestamp() {
		return isIdSet(this.id) ? DiscordSnowflake.timestampFrom(this.id) : null;
	}

	/**
	 * The time the SKU was created at
	 */
	public get createdAt() {
		const createdTimestamp = this.createdTimestamp;
		return createdTimestamp ? new Date(createdTimestamp) : null;
	}
}
