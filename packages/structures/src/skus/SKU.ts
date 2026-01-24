import type { SKUFlags, APISKU } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { SKUFlagsBitField } from '../bitfields/SKUFlagsBitField.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents any SKU (stock-keeping units) on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class SKU<Omitted extends keyof APISKU | '' = ''> extends Structure<APISKU, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each SKU
	 */
	public static override readonly DataTemplate: Partial<APISKU> = {};

	/**
	 * @param data - The raw data received from the API for the SKU
	 */
	public constructor(data: Partialize<APISKU, Omitted>) {
		super(data);
	}

	/**
	 * Id of the SKU
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * Type of SKU
	 *
	 * @see {@link https://discord.com/developers/docs/resources/sku#sku-object-sku-types}
	 */
	public get type() {
		return this[kData].type;
	}

	/**
	 * Id of the parent application
	 */
	public get applicationId() {
		return this[kData].application_id;
	}

	/**
	 * Customer-facing name of your premium offering
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * System-generated URL slug based on the SKU's name
	 */
	public get slug() {
		return this[kData].slug;
	}

	/**
	 * SKU flags combined as a bitfield
	 */
	public get flags() {
		const flags = this[kData].flags;

		return flags ? new SKUFlagsBitField(this[kData].flags as SKUFlags) : null;
	}
}
