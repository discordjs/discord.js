import type {
	APIAutoModerationActionMetadata,
	AutoModerationActionType,
	AutoModerationRuleTriggerType,
} from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';

/**
 * Represents an auto moderation action metadata on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class AutoModerationActionMetadata<
	Omitted extends keyof APIAutoModerationActionMetadata | '' = '',
> extends Structure<APIAutoModerationActionMetadata, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each auto moderation action metadata
	 */
	public static override DataTemplate: Partial<APIAutoModerationActionMetadata> = {};

	/**
	 * @param data - The raw data received from the API for the auto moderation action metadata
	 */
	public constructor(data: Partialize<APIAutoModerationActionMetadata, Omitted>) {
		super(data);
	}

	/**
	 * Channel to which user content should be logged. This must be an existing channel
	 *
	 * Associated action types: {@link AutoModerationActionType.SendAlertMessage}
	 */
	public get channelId() {
		return this[kData].channel_id;
	}

	/**
	 * Timeout duration in seconds. Maximum of 2419200 seconds (4 weeks).
	 *
	 * A `TIMEOUT` action can only be set up for {@link AutoModerationRuleTriggerType.Keyword} and {@link AutoModerationRuleTriggerType.MentionSpam}.
	 *
	 * The `MODERATE_MEMBERS` permission is required to use {@link AutoModerationActionType.Timeout} actions.
	 *
	 * Associated action types: {@link AutoModerationActionType.Timeout}
	 */
	public get durationSeconds() {
		return this[kData].duration_seconds;
	}

	/**
	 * Additional explanation that will be shown to members whenever their message is blocked. Maximum of 150 characters
	 *
	 * Associated action types: {@link AutoModerationActionType.BlockMessage}
	 */
	public get customMessage() {
		return this[kData].custom_message;
	}
}
