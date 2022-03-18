import { ChannelType } from 'discord-api-types/v10';
import { z, ZodLiteral } from 'zod';

// Only allow valid channel types to be used. (This can't be dynamic because const enums are erased at runtime)
const allowedChannelTypes = [
	ChannelType.GuildText,
	ChannelType.GuildVoice,
	ChannelType.GuildCategory,
	ChannelType.GuildNews,
	ChannelType.GuildStore,
	ChannelType.GuildNewsThread,
	ChannelType.GuildPublicThread,
	ChannelType.GuildPrivateThread,
	ChannelType.GuildStageVoice,
] as const;

export type ApplicationCommandOptionAllowedChannelTypes = typeof allowedChannelTypes[number];

const channelTypesPredicate = z.array(
	z.union(
		allowedChannelTypes.map((type) => z.literal(type)) as [
			ZodLiteral<ChannelType>,
			ZodLiteral<ChannelType>,
			...ZodLiteral<ChannelType>[]
		],
	),
);

export class ApplicationCommandOptionChannelTypesMixin {
	public readonly channel_types?: ApplicationCommandOptionAllowedChannelTypes[];

	/**
	 * Adds channel types to this option
	 *
	 * @param channelTypes The channel types to add
	 */
	public addChannelTypes(...channelTypes: ApplicationCommandOptionAllowedChannelTypes[]) {
		if (this.channel_types === undefined) {
			Reflect.set(this, 'channel_types', []);
		}

		channelTypesPredicate.parse(channelTypes);

		this.channel_types!.push(...channelTypes);

		return this;
	}
}
