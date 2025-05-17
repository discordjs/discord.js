import type { APIGuildForumTag } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';

/**
 * Represents metadata of a thread channel on Discord.
 *
 * @typeParam Omitted - Specify the propeties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class ForumTag<Omitted extends keyof APIGuildForumTag | '' = ''> extends Structure<APIGuildForumTag, Omitted> {
	/**
	 * The id of the tag.
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The name of the tag.
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * Whether this tag can only be added to or removed from threads by a member with the {@link discord-api-types/v10!PermissionFlagsBits.ManageThreads} permission.
	 */
	public get moderated() {
		return this[kData].moderated;
	}

	/**
	 * The id of a guild's custom emoji.
	 */
	public get emojiId() {
		return this[kData].emoji_id;
	}

	/**
	 * The unicode character of the emoji.
	 */
	public get emojiName() {
		return this[kData].emoji_name;
	}

	/**
	 * The textual representation of this tag's emoji. Either a unicode character or a guild emoji mention.
	 */
	public get emoji() {
		return this.emojiName ?? `<:_:${this.emojiId}>`;
	}
}
