import type { APIGuildForumTag } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';

/**
 * Represents metadata of a thread channel on Discord.
 *
 * @typeParam Omitted - Specify the propeties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class ForumTag<Omitted extends keyof APIGuildForumTag | '' = ''> extends Structure<APIGuildForumTag, Omitted> {
	public get id() {
		return this[kData].id;
	}

	public get name() {
		return this[kData].name;
	}

	public get moderated() {
		return this[kData].moderated;
	}

	public get emojiId() {
		return this[kData].emoji_id;
	}

	public get emojiName() {
		return this[kData].emoji_name;
	}

	public get emoji() {
		return this.emojiName ?? `<:_:${this.emojiId}>`;
	}
}
