import { DiscordSnowflake } from '@sapphire/snowflake';
import type { APISubscription, SubscriptionStatus } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import {
	kData,
	kCurrentPeriodStartTimestamp,
	kCurrentPeriodEndTimestamp,
	kCanceledTimestamp,
} from '../utils/symbols.js';
import { isIdSet } from '../utils/type-guards.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents any subscription on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class Subscription<
	Omitted extends keyof APISubscription | '' = 'canceled_at' | 'current_period_end' | 'current_period_start',
> extends Structure<APISubscription, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each subscription
	 */
	public static override readonly DataTemplate: Partial<APISubscription> = {
		set current_period_start(_: string) {},
		set current_period_end(_: string) {},
		set canceled_at(_: string) {},
	};

	protected [kCurrentPeriodStartTimestamp]: number | null = null;

	protected [kCurrentPeriodEndTimestamp]: number | null = null;

	protected [kCanceledTimestamp]: number | null = null;

	/**
	 * @param data - The raw data received from the API for the subscription
	 */
	public constructor(data: Partialize<APISubscription, Omitted>) {
		super(data);
		this.optimizeData(data);
	}

	/**
	 * {@inheritDoc Structure.optimizeData}
	 */
	protected override optimizeData(data: Partial<APISubscription>) {
		const currentPeriodStartTimestamp = data.current_period_start;
		const currentPeriodEndTimestamp = data.current_period_end;
		const canceledTimestamp = data.canceled_at;

		if (currentPeriodStartTimestamp) {
			this[kCurrentPeriodStartTimestamp] = Date.parse(currentPeriodStartTimestamp);
		}

		if (currentPeriodEndTimestamp) {
			this[kCurrentPeriodEndTimestamp] = Date.parse(currentPeriodEndTimestamp);
		}

		if (canceledTimestamp) {
			this[kCanceledTimestamp] = Date.parse(canceledTimestamp);
		}
	}

	/**
	 * The subscription's id
	 *
	 * @remarks The start of a subscription is determined by its id. When the subscription renews, its current period is updated.
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * Id of the user who is subscribed
	 */
	public get userId() {
		return this[kData].user_id;
	}

	/**
	 * List of SKUs subscribed to
	 */
	public get skuIds() {
		return this[kData].sku_ids;
	}

	/**
	 * List of entitlements granted for this subscription
	 */
	public get entitlementIds() {
		return this[kData].entitlement_ids;
	}

	/**
	 * List of SKUs that this user will be subscribed to at renewal
	 */
	public get renewalSkuIds() {
		return this[kData].renewal_sku_ids;
	}

	/**
	 * Timestamp of start of the current subscription period
	 */
	public get currentPeriodStartTimestamp() {
		return this[kCurrentPeriodStartTimestamp];
	}

	/**
	 * The time at which the current subscription period will start
	 */
	public get currentPeriodStartAt() {
		const startTimestamp = this.currentPeriodStartTimestamp;
		return startTimestamp ? new Date(startTimestamp) : null;
	}

	/**
	 * Timestamp of end of the current subscription period
	 */
	public get currentPeriodEndTimestamp() {
		return this[kCurrentPeriodEndTimestamp];
	}

	/**
	 * The time at which the current subscription period will end
	 */
	public get currentPeriodEndsAt() {
		const endTimestamp = this.currentPeriodEndTimestamp;
		return endTimestamp ? new Date(endTimestamp) : null;
	}

	/**
	 * The {@link SubscriptionStatus} of the current subscription
	 */
	public get status() {
		return this[kData].status;
	}

	/**
	 * Timestamp when the subscription was canceled
	 */
	public get canceledTimestamp() {
		return this[kCanceledTimestamp];
	}

	/**
	 * The time when the subscription was canceled
	 *
	 * @remarks If the user cancels the subscription, the subscription will enter the {@link SubscriptionStatus.Ending} status and the `canceled_at` timestamp will reflect the time of the cancellation.
	 */
	public get canceledAt() {
		const canceledTimestamp = this.canceledTimestamp;
		return canceledTimestamp ? new Date(canceledTimestamp) : null;
	}

	/**
	 * ISO3166-1 alpha-2 country code of the payment source used to purchase the subscription. Missing unless queried with a private OAuth scope.
	 */
	public get country() {
		return this[kData].country;
	}

	/**
	 * The timestamp the subscription was created at
	 */
	public get createdTimestamp() {
		return isIdSet(this.id) ? DiscordSnowflake.timestampFrom(this.id) : null;
	}

	/**
	 * The time the subscription was created at
	 */
	public get createdAt() {
		const createdTimestamp = this.createdTimestamp;
		return createdTimestamp ? new Date(createdTimestamp) : null;
	}
}
