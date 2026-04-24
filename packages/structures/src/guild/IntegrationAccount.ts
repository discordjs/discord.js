import type { APIIntegrationAccount } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

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
	 * The template used for removing data from the raw data stored for each integration account.
	 */
	public static override readonly DataTemplate: Partial<APIIntegrationAccount> = {};

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
}
