import type { JSONEncodable } from '@discordjs/util';
import type { APIMessageReference, MessageReferenceType, Snowflake } from 'discord-api-types/v10';
import { validate } from '../util/validation.js';
import { messageReferencePredicate } from './Assertions.js';

export interface MessageReferenceBuilderData extends Omit<APIMessageReference, 'message_id'> {
	message_id: Snowflake;
}

/**
 * A builder that creates API-compatible JSON data for message references.
 */
export class MessageReferenceBuilder implements JSONEncodable<MessageReferenceBuilderData> {
	private readonly data: Partial<MessageReferenceBuilderData>;

	/**
	 * Creates new allowed mention builder from API data.
	 *
	 * @param data - The API data to create this attachment with
	 */
	public constructor(data: Partial<MessageReferenceBuilderData> = {}) {
		this.data = structuredClone(data);
	}

	/**
	 * Sets the types of message reference this represents
	 *
	 * @param type - The type of message reference
	 */
	public setType(type: MessageReferenceType): this {
		this.data.type = type;
		return this;
	}

	/**
	 * Clear the type of message reference this represents
	 */
	public clearType(): this {
		this.data.type = undefined;
		return this;
	}

	/**
	 * Sets the id of the message being referenced
	 *
	 * @param messageId - The id of the message being referenced
	 */
	public setMessageId(messageId: Snowflake): this {
		this.data.message_id = messageId;
		return this;
	}

	/**
	 * Sets the id of the channel being referenced
	 *
	 * @param channelId - The id of the channel being referenced
	 */
	public setChannelId(channelId: Snowflake): this {
		this.data.channel_id = channelId;
		return this;
	}

	/**
	 * Clear the id of the channel being referenced
	 */
	public clearChannelId(): this {
		this.data.channel_id = undefined;
		return this;
	}

	/**
	 * Sets the id of the guild being referenced
	 *
	 * @param guildId - The id of the guild being referenced
	 */
	public setGuildId(guildId: Snowflake): this {
		this.data.guild_id = guildId;
		return this;
	}

	/**
	 * Clear the id of the guild being referenced
	 */
	public clearGuildId(): this {
		this.data.guild_id = undefined;
		return this;
	}

	/**
	 * Serializes this builder to API-compatible JSON data.
	 *
	 * Note that by disabling validation, there is no guarantee that the resulting object will be valid.
	 *
	 * @param validationOverride - Force validation to run/not run regardless of your global preference
	 */
	public toJSON(validationOverride?: boolean): MessageReferenceBuilderData {
		const clone = structuredClone(this.data);
		validate(messageReferencePredicate, clone, validationOverride);

		return clone as MessageReferenceBuilderData;
	}
}
