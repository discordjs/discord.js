import { ChannelType } from 'discord-api-types/v10';
import { z } from 'zod';
import { normalizeArray, type RestOrArray } from '../../../util/normalizeArray';
import { parse } from '../../../util/validation.js';

/**
 * The allowed channel types used for a channel option in a slash command builder.
 *
 * @privateRemarks This can't be dynamic because const enums are erased at runtime.
 * @internal
 */
const allowedChannelTypes = [
	ChannelType.GuildText,
	ChannelType.GuildVoice,
	ChannelType.GuildCategory,
	ChannelType.GuildAnnouncement,
	ChannelType.AnnouncementThread,
	ChannelType.PublicThread,
	ChannelType.PrivateThread,
	ChannelType.GuildStageVoice,
	ChannelType.GuildForum,
	ChannelType.GuildMedia,
] as const;

/**
 * The type of allowed channel types used for a channel option.
 */
export type ApplicationCommandOptionAllowedChannelTypes = (typeof allowedChannelTypes)[number];

const channelTypesPredicate = z.array(
	z.union([
		z.literal(allowedChannelTypes[0]),
		z.literal(allowedChannelTypes[1]),
		...allowedChannelTypes.slice(2).map((type) => z.literal(type)),
	]),
);

/**
 * This mixin holds channel type symbols used for options.
 */
export class ApplicationCommandOptionChannelTypesMixin {
	/**
	 * The channel types of this option.
	 */
	public readonly channel_types?: ApplicationCommandOptionAllowedChannelTypes[];

	/**
	 * Adds channel types to this option.
	 *
	 * @param channelTypes - The channel types
	 */
	public addChannelTypes(...channelTypes: RestOrArray<ApplicationCommandOptionAllowedChannelTypes>) {
		if (this.channel_types === undefined) {
			Reflect.set(this, 'channel_types', []);
		}

		this.channel_types!.push(...parse(channelTypesPredicate, normalizeArray(channelTypes)));

		return this;
	}
}
