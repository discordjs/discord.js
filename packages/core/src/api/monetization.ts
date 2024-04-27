/* eslint-disable jsdoc/check-param-names */

import { makeURLSearchParams, type RequestData, type REST } from '@discordjs/rest';
import {
	Routes,
	type RESTGetAPIEntitlementsQuery,
	type RESTGetAPIEntitlementsResult,
	type RESTGetAPISKUsResult,
	type RESTPostAPIEntitlementBody,
	type RESTPostAPIEntitlementResult,
	type Snowflake,
} from 'discord-api-types/v10';

export class MonetizationAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Fetches the SKUs for an application.
	 *
	 * @see {@link https://discord.com/developers/docs/monetization/skus#list-skus}
	 * @param options - The options for fetching the SKUs.
	 */
	public async getSKUs(applicationId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.skus(applicationId), { signal }) as Promise<RESTGetAPISKUsResult>;
	}

	/**
	 * Fetches the entitlements for an application.
	 *
	 * @see {@link https://discord.com/developers/docs/monetization/entitlements#list-entitlements}
	 * @param applicationId - The application id to fetch entitlements for
	 * @param query - The query options for fetching entitlements
	 * @param options - The options for fetching entitlements
	 */
	public async getEntitlements(
		applicationId: Snowflake,
		query: RESTGetAPIEntitlementsQuery,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.get(Routes.entitlements(applicationId), {
			signal,
			query: makeURLSearchParams(query),
		}) as Promise<RESTGetAPIEntitlementsResult>;
	}

	/**
	 * Creates a test entitlement for an application's SKU.
	 *
	 * @see {@link https://discord.com/developers/docs/monetization/entitlements#create-test-entitlement}
	 * @param applicationId - The application id to create the entitlement for
	 * @param body - The data for creating the entitlement
	 * @param options - The options for creating the entitlement
	 */
	public async createTestEntitlement(
		applicationId: Snowflake,
		body: RESTPostAPIEntitlementBody,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.post(Routes.entitlements(applicationId), {
			body,
			signal,
		}) as Promise<RESTPostAPIEntitlementResult>;
	}

	/**
	 * Deletes a test entitlement for an application's SKU.
	 *
	 * @see {@link https://discord.com/developers/docs/monetization/entitlements#delete-test-entitlement}
	 * @param applicationId - The application id to delete the entitlement for
	 * @param entitlementId - The entitlement id to delete
	 * @param options - The options for deleting the entitlement
	 */
	public async deleteTestEntitlement(
		applicationId: Snowflake,
		entitlementId: Snowflake,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		await this.rest.delete(Routes.entitlement(applicationId, entitlementId), { signal });
	}

	/**
	 * Marks a given entitlement for the user as consumed. Only available for One-Time Purchase consumable SKUs.
	 *
	 * @see {@link https://discord.com/developers/docs/monetization/entitlements#consume-an-entitlement}
	 * @param applicationId - The application id to consume the entitlement for
	 * @param entitlementId - The entitlement id to consume
	 * @param options - The options for consuming the entitlement
	 */
	public async consumeEntitlement(
		applicationId: Snowflake,
		entitlementId: Snowflake,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		await this.rest.post(Routes.consumeEntitlement(applicationId, entitlementId), { signal });
	}
}
