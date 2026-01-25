import type { APIAutoModerationRuleTriggerMetadata, AutoModerationRuleTriggerType } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents an auto moderation rule trigger metadata on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class AutoModerationRuleTriggerMetadata<
	Omitted extends keyof APIAutoModerationRuleTriggerMetadata | '' = '',
> extends Structure<APIAutoModerationRuleTriggerMetadata, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each auto moderation rule trigger metadata
	 */
	public static override DataTemplate: Partial<APIAutoModerationRuleTriggerMetadata> = {};

	/**
	 * @param data - The raw data received from the API for the auto moderation rule trigger metadata
	 */
	public constructor(data: Partialize<APIAutoModerationRuleTriggerMetadata, Omitted>) {
		super(data);
	}

	/**
	 * Substrings which will be searched for in content (Maximum of 1000)
	 *
	 * A keyword can be a phrase which contains multiple words.
	 *
	 * Wildcard symbols can be used to customize how each keyword will be matched. Each keyword must be 60 characters or less.
	 *
	 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-keyword-matching-strategies | Keyword matching strategies}
	 *
	 * Associated trigger types: {@link AutoModerationRuleTriggerType.Keyword}, {@link AutoModerationRuleTriggerType.MemberProfile}
	 */
	public get keywordFilter() {
		return this[kData].keyword_filter;
	}

	/**
	 * Regular expression patterns which will be matched against content (Maximum of 10)
	 *
	 * Only Rust flavored regex is currently supported, which can be tested in online editors such as {@link https://rustexp.lpil.uk/ | Rustexp}.
	 *
	 * Each regex pattern must be 260 characters or less.
	 *
	 * Associated trigger types: {@link AutoModerationRuleTriggerType.Keyword}, {@link AutoModerationRuleTriggerType.MemberProfile}
	 */
	public get regexPatterns() {
		return this[kData].regex_patterns;
	}

	/**
	 * The internally pre-defined wordsets which will be searched for in content
	 *
	 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-keyword-preset-types | Keyword preset types}
	 *
	 * Associated trigger types: {@link AutoModerationRuleTriggerType.KeywordPreset}
	 */
	public get presets() {
		return this[kData].presets;
	}

	/**
	 * Substrings which should not trigger the rule (Maximum of 100 or 1000).
	 *
	 * Wildcard symbols can be used to customize how each keyword will be matched (see Keyword matching strategies).
	 *
	 * Each `allow_list` keyword can be a phrase which contains multiple words.
	 *
	 * Rules with `KEYWORD` triggerType accept a maximum of 100 keywords.
	 *
	 * Rules with `KEYWORD_PRESET` triggerType accept a maximum of 1000 keywords.
	 *
	 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-trigger-types | triggerType}
	 * @see {@link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-keyword-matching-strategies | Keyword matching strategies}
	 *
	 * Associated trigger types: {@link AutoModerationRuleTriggerType.Keyword}, {@link AutoModerationRuleTriggerType.KeywordPreset}, {@link AutoModerationRuleTriggerType.MemberProfile}
	 */
	public get allowList() {
		return this[kData].allow_list;
	}

	/**
	 * Total number of unique role and user mentions allowed per message (Maximum of 50)
	 *
	 * Associated trigger types: {@link AutoModerationRuleTriggerType.MentionSpam}
	 */
	public get mentionTotalLimit() {
		return this[kData].mention_total_limit;
	}

	/**
	 * Whether to automatically detect mention raids
	 *
	 * Associated trigger types: {@link AutoModerationRuleTriggerType.MentionSpam}
	 */
	public get mentionRaidProtectionEnabled() {
		return this[kData].mention_raid_protection_enabled;
	}
}
