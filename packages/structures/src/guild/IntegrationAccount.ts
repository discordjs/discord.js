import { DiscordSnowflake } from '@sapphire/snowflake';
import type { APIIntegrationAccount } from 'discord-api-types/v10';
import { Structure } from '../Structure';
import { kData } from '../utils/symbols';
import { isIdSet } from '../utils/type-guards';
import type { Partialize } from '../utils/types';

/**
 * Represents an integration's account on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class IntegrationAccount<Omitted extends keyof APIIntegrationAccount | '' = ''> extends Structure<
	APIIntegrationAccount,
	Omitted
> {
	/**
	 * @param data - The raw data from the API for the integration account.
	 */
	public constructor(data: Partialize<APIIntegrationAccount, Omitted>) {
		super(data);
	}

	/**
	 * The id of the account.
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The name of the account.
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * The timestamp the account was created at.
	 */
	public get createdTimestamp() {
		return isIdSet(this.id) ? DiscordSnowflake.timestampFrom(this.id) : null;
	}

	/**
	 * The time the account was created at.
	 */
	public get createdAt() {
		const createdTimestamp = this.createdTimestamp;
		return createdTimestamp ? new Date(createdTimestamp) : null;
	}
}
