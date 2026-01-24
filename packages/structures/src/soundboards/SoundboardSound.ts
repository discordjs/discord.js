import { DiscordSnowflake } from '@sapphire/snowflake';
import type { APISoundboardSound } from 'discord-api-types/v10';
import { Structure } from '../Structure';
import { kData } from '../utils/symbols';
import { isIdSet } from '../utils/type-guards';
import type { Partialize } from '../utils/types';

/**
 * Represents any soundboard sound on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has substructure `User` which needs to be instantiated and stored by an extending class using it
 */
export class SoundboardSound<Omitted extends keyof APISoundboardSound | '' = ''> extends Structure<
	APISoundboardSound,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each soundboard sound.
	 */
	public static override readonly DataTemplate: Partial<APISoundboardSound> = {};

	/**
	 * @param data - The raw data received from the API for the soundboard sound
	 */
	public constructor(data: Partialize<APISoundboardSound, Omitted>) {
		super(data);
	}

	/**
	 * The name of this sound
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * The id of this sound
	 */
	public get soundId() {
		return this[kData].sound_id;
	}

	/**
	 * The volume of this sound, from 0 to 1
	 */
	public get volume() {
		return this[kData].volume;
	}

	/**
	 * The id of this sound's custom emoji
	 */
	public get emojiId() {
		return this[kData].emoji_id;
	}

	/**
	 * The unicode character of this sound's standard emoji
	 */
	public get emojiName() {
		return this[kData].emoji_name;
	}

	/**
	 * The id of the guild this sound is in
	 */
	public get guildId() {
		return this[kData].guild_id;
	}

	/**
	 * Whether this sound can be used, may be false due to loss of server boosts
	 */
	public get available() {
		return this[kData].available;
	}

	/**
	 * The timestamp this sound was created at
	 */
	public get createdTimestamp() {
		return isIdSet(this[kData].sound_id) && isIdSet(this[kData].guild_id)
			? DiscordSnowflake.timestampFrom(this[kData].sound_id)
			: null;
	}

	/**
	 * The time this sound was created at
	 */
	public get createdAt() {
		const createdTimestamp = this.createdTimestamp;

		return createdTimestamp ? new Date(createdTimestamp) : null;
	}
}
