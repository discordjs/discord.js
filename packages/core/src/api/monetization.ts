/* eslint-disable jsdoc/check-param-names */

import { makeURLSearchParams, type RequestData, type REST } from '@discordjs/rest';
import {
	Routes,
	type RESTGetAPIEntitlementsQuery,
	type RESTGetAPIEntitlementResult,
	type RESTGetAPIEntitlementsResult,
	type RESTGetAPISKUsResult,
	type RESTGetAPISKUSubscriptionResult,
	type RESTGetAPISKUSubscriptionsQuery,
	type RESTGetAPISKUSubscriptionsResult,
	type RESTPostAPIEntitlementJSONBody,
	type RESTPostAPIEntitlementResult,
	type Snowflake,
} from 'discord-api-types/v10';

export class MonetizationAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Fetches the SKUs for an application.
	 *
	 * @see {@link https://discord.com/developers/docs/resources/sku#list-skus}
	 * @param applicationId - The application id to fetch SKUs for
	 * @param options - The options for fetching the SKUs.
	 */
	public async getSKUs(applicationId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.skus(applicationId), { signal }) as Promise<RESTGetAPISKUsResult>;
	}

	/**
	 * Fetches subscriptions for an SKU.
	 *
	 * @see {@link https://discord.com/developers/docs/resources/subscription#list-sku-subscriptions}
	 * @param skuId - The SKU id to fetch subscriptions for
	 * @param query - The query options for fetching subscriptions
	 * @param options - The options for fetching subscriptions
	 */
	public async getSKUSubscriptions(
		skuId: Snowflake,
		query: RESTGetAPISKUSubscriptionsQuery = {},
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.get(Routes.skuSubscriptions(skuId), {
			signal,
			query: makeURLSearchParams(query),
		}) as Promise<RESTGetAPISKUSubscriptionsResult>;
	}

	/**
	 * Fetches a subscription for an SKU.
	 *
	 * @see {@link https://discord.com/developers/docs/resources/subscription#get-sku-subscription}
	 * @param skuId - The SKU id to fetch subscription for
	 * @param subscriptionId - The subscription id to fetch
	 * @param options - The options for fetching the subscription
	 */
	public async getSKUSubscription(
		skuId: Snowflake,
		subscriptionId: Snowflake,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.get(Routes.skuSubscription(skuId, subscriptionId), {
			signal,
		}) as Promise<RESTGetAPISKUSubscriptionResult>;
	}

	/**
	 * Fetches the entitlements for an application.
	 *
	 * @see {@link https://discord.com/developers/docs/resources/entitlement#list-entitlements}
	 * @param applicationId - The application id to fetch entitlements for
	 * @param query - The query options for fetching entitlements
	 * @param options - The options for fetching entitlements
	 */
	public async getEntitlements(
		applicationId: Snowflake,
		query: RESTGetAPIEntitlementsQuery = {},
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.get(Routes.entitlements(applicationId), {
			signal,
			query: makeURLSearchParams(query),
		}) as Promise<RESTGetAPIEntitlementsResult>;
	}

	/**
	 * Fetches an entitlement for an application.
	 *
	 * @see {@link https://discord.com/developers/docs/resources/entitlement#get-entitlement}
	 * @param applicationId - The application id to fetch the entitlement for
	 * @param entitlementId - The entitlement id to fetch
	 * @param options - The options for fetching the entitlement
	 */
	public async getEntitlement(
		applicationId: Snowflake,
		entitlementId: Snowflake,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.get(Routes.entitlement(applicationId, entitlementId), {
			signal,
		}) as Promise<RESTGetAPIEntitlementResult>;
	}

	/**
	 * Creates a test entitlement for an application's SKU.
	 *
	 * @see {@link https://discord.com/developers/docs/resources/entitlement#create-test-entitlement}
	 * @param applicationId - The application id to create the entitlement for
	 * @param body - The data for creating the entitlement
	 * @param options - The options for creating the entitlement
	 */
	public async createTestEntitlement(
		applicationId: Snowflake,
		body: RESTPostAPIEntitlementJSONBody,
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
	 * @see {@link https://discord.com/developers/docs/resources/entitlement#delete-test-entitlement}
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
	 * @see {@link https://discord.com/developers/docs/resources/entitlement#consume-an-entitlement}
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
