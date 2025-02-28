import type { JSONEncodable } from '@discordjs/util';
import type { APIEmbed, RESTPostAPIChannelMessageJSONBody } from 'discord-api-types/v10';
import { validate } from '../util/validation.js';
import { messagePredicate } from './Assertions.js';
import { AttachmentBuilder } from './Attachment.js';

export interface MessageBuilderData extends Partial<Omit<APIEmbed, 'attachments' | 'poll'>> {
	allowed_mentions: AllowedMentionBuilder[];
	attachments: AttachmentBuilder[];
	// TODO https://github.com/discordjs/discord.js/pull/10324
	poll?: any;
}

export class MessageBuilder implements JSONEncodable<RESTPostAPIChannelMessageJSONBody> {
	private readonly data: MessageBuilderData;

	/**
	 * Creates new attachment builder from API data.
	 *
	 * @param data - The API data to create this attachment with
	 */
	public constructor(data: Partial<RESTPostAPIChannelMessageJSONBody> = {}) {
		this.data = {
			...structuredClone(data),
			allowed_mentions: data.allowed_mentions?.map((mention) => new AllowedMentionBuilder(mention)) ?? [],
			attachments: data.attachments?.map((attachment) => new AttachmentBuilder(attachment)) ?? [],
			poll: data.poll,
		};
	}

	/**
	 * Serializes this builder to API-compatible JSON data.
	 *
	 * Note that by disabling validation, there is no guarantee that the resulting object will be valid.
	 *
	 * @param validationOverride - Force validation to run/not run regardless of your global preference
	 */
	public toJSON(validationOverride?: boolean): RESTPostAPIChannelMessageJSONBody {
		const clone = structuredClone(this.data);
		validate(messagePredicate, clone, validationOverride);

		return clone as RESTPostAPIChannelMessageJSONBody;
	}
}
