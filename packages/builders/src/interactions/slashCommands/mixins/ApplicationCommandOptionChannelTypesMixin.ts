import { s } from '@sapphire/shapeshift';
import { ChannelType } from 'discord-api-types/v10';

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
] as const;

/**
 * The type of allowed channel types used for a channel option.
 */
export type ApplicationCommandOptionAllowedChannelTypes = (typeof allowedChannelTypes)[number];

const channelTypesPredicate = s.array(s.union(...allowedChannelTypes.map((type) => s.literal(type))));

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
	public addChannelTypes(...channelTypes: ApplicationCommandOptionAllowedChannelTypes[]) {
		if (this.channel_types === undefined) {
			Reflect.set(this, 'channel_types', []);
		}

		this.channel_types!.push(...channelTypesPredicate.parse(channelTypes));

		return this;
	}
}
