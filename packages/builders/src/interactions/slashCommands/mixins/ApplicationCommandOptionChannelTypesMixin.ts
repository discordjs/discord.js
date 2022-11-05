import { s } from '@sapphire/shapeshift';
import { ChannelType, type APIApplicationCommandChannelOption } from 'discord-api-types/v10';

// Only allow valid channel types to be used. (This can't be dynamic because const enums are erased at runtime)
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

export type ApplicationCommandOptionAllowedChannelTypes = typeof allowedChannelTypes[number];

const channelTypesPredicate = s.array(s.union(...allowedChannelTypes.map((type) => s.literal(type))));

export class ApplicationCommandOptionChannelTypesMixin {
	public readonly data: Partial<APIApplicationCommandChannelOption> = {};

	/**
	 * Adds channel types to this option
	 *
	 * @param channelTypes - The channel types to add
	 */
	public addChannelTypes(...channelTypes: ApplicationCommandOptionAllowedChannelTypes[]) {
		if (this.data.channel_types === undefined) {
			Reflect.set(this.data, 'channel_types', []);
		}

		this.data.channel_types!.push(...channelTypesPredicate.parse(channelTypes));

		return this;
	}
}
