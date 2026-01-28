import type { APIAutoModerationRule } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents an auto moderation rule on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has substructure `TriggerMetadata` which needs to be instantiated and stored by an extending class using it
 * @remarks intentionally does not export `exemptRoles` and `exemptChannels` so that extending classes can resolve `Snowflake[]` to `Role[]` and `Channel[]`, respectively
 */
export class AutoModerationRule<Omitted extends keyof APIAutoModerationRule | '' = ''> extends Structure<
	APIAutoModerationRule,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each auto moderation rule
	 */
	public static override DataTemplate: Partial<APIAutoModerationRule> = {};

	/**
	 * @param data - The raw data received from the API for the auto moderation rule
	 */
	public constructor(data: Partialize<APIAutoModerationRule, Omitted>) {
		super(data);
	}

	/**
	 * The id of this rule
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The id of the guild which this rule belongs to
	 */
	public get guildId() {
		return this[kData].guild_id;
	}

	/**
	 * The rule name
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * The user who first created this rule
	 */
	public get creatorId() {
		return this[kData].creator_id;
	}

	/**
	 * The rule event type
	 *
	 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-event-types}
	 */
	public get eventType() {
		return this[kData].event_type;
	}

	/**
	 * The rule trigger type
	 *
	 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-trigger-types}
	 */
	public get triggerType() {
		return this[kData].trigger_type;
	}

	/**
	 * Whether the rule is enabled
	 */
	public get enabled() {
		return this[kData].enabled;
	}
}
