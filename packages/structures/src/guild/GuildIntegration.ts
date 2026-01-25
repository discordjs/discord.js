import { DiscordSnowflake } from '@sapphire/snowflake';
import type { APIGuildIntegration } from 'discord-api-types/v10';
import { Structure } from '../Structure';
import { dateToDiscordISOTimestamp } from '../utils/optimization';
import { kData, kSyncedAt } from '../utils/symbols';
import { isIdSet } from '../utils/type-guards';
import type { Partialize } from '../utils/types';

/**
 * Represents a guild integration on Discord..
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks Intentionally does not export `scopes`, so extending classes can map the array to `OAuth2Scopes[]`.
 * @remarks has substructures `User`, `IntegrationAccount`, and `Application`, which needs to be instantiated and stored by any extending classes using it.
 */
export class GuildIntegration<Omitted extends keyof APIGuildIntegration | '' = 'synced_at'> extends Structure<
	APIGuildIntegration,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each `GuildIntegration`
	 *
	 * @remarks This template has defaults, if you want to remove additional data and keep the defaults,
	 * use `Object.defineProperties`.
	 */
	public static override readonly DataTemplate: Partial<APIGuildIntegration> = {
		set synced_at(_: string) {},
	};

	protected [kSyncedAt]: number | null = null;

	/**
	 * @param data - The raw data from the API for the guild integration.
	 */
	public constructor(data: Partialize<APIGuildIntegration, Omitted>) {
		super(data);
		this.optimizeData(data);
	}

	/**
	 * The id of the integration.
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The name of the integration.
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * The integration type.
	 */
	public get type() {
		return this[kData].type;
	}

	/**
	 * Whether the integration is enabled.
	 */
	public get enabled() {
		return this[kData].enabled;
	}

	/**
	 * Whether the integration is syncing.
	 *
	 * @remarks This field is not provided for `discord` bot integration.
	 */
	public get syncing() {
		return this[kData].syncing;
	}

	/**
	 * The date at which this integration was last synced at.
	 */
	public get syncedAt() {
		const timestamp = this.syncedTimestamp;
		return timestamp ? new Date(timestamp) : null;
	}

	/**
	 * The timestamp at which this integration was last synced at.
	 */
	public get syncedTimestamp() {
		return this[kSyncedAt];
	}

	/**
	 * ID that this integration uses for "subscribers".
	 *
	 * @remarks This field is not provided for `discord` bot integration.
	 */
	public get roleId() {
		return this[kData].role_id;
	}

	/**
	 * Whether emoticons should be synced for this integration. (`twitch` only currently.)
	 *
	 * @remarks This field is not provided for `discord` bot integration.
	 */
	public get enableEmoticons() {
		return this[kData].enable_emoticons;
	}

	/**
	 * The behavior of expiring subscribers.
	 *
	 * @remarks This field is not provided for `discord` bot integration.
	 * @see {@link https://discord.com/developers/docs/resources/guild#integration-object-integration-expire-behaviors}
	 */
	public get expireBehavior() {
		return this[kData].expire_behavior;
	}

	/**
	 * The grace period (in days) before expiring subscribers
	 *
	 * @remarks This field is not provided for `discord` bot integration.
	 */
	public get expireGracePeriod() {
		return this[kData].expire_grace_period;
	}

	/**
	 * How many subscribers this integration has.
	 *
	 * @remarks This field is not provided for `discord` bot integration.
	 */
	public get subscriberCount() {
		return this[kData].subscriber_count;
	}

	/**
	 * Whether the integration has been revoked.
	 *
	 * @remarks This field is not provided for `discord` bot integration.
	 */
	public get revoked() {
		return this[kData].revoked;
	}

	/**
	 * The timestamp the integration was created at.
	 */
	public get createdTimestamp() {
		return isIdSet(this.id) ? DiscordSnowflake.timestampFrom(this.id) : null;
	}

	/**
	 * The time the integration was created at.
	 */
	public get createdAt() {
		const createdTimestamp = this.createdTimestamp;
		return createdTimestamp ? new Date(createdTimestamp) : null;
	}

	/**
	 * {@inheritDoc Structure.optimizeData}
	 */
	protected override optimizeData(data: Partial<APIGuildIntegration>) {
		if (data.synced_at) {
			this[kSyncedAt] = Date.parse(data.synced_at);
		}
	}

	/**
	 *
	 * {@inheritDoc Structure.toJSON}
	 */
	public override toJSON() {
		const clone = super.toJSON();

		const syncedAt = this[kSyncedAt];

		if (syncedAt) {
			clone.synced_at = dateToDiscordISOTimestamp(new Date(syncedAt));
		}

		return clone;
	}
}
