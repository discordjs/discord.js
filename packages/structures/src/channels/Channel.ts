import { DiscordSnowflake } from '@sapphire/snowflake';
import type {
	TextChannelType,
	ThreadChannelType,
	APIChannel,
	APIPartialChannel,
	ChannelType,
	GuildChannelType,
} from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { APIThreadChannel } from '../utils/types';
import type { ChannelPermissionMixin } from './mixins/ChannelPermissionMixin.js';
import type { DMChannelMixin } from './mixins/DMChannelMixin.js';
import type { GuildChannelMixin } from './mixins/GuildChannelMixin.js';
import type { TextChannelMixin } from './mixins/TextChannelMixin.js';
import type { ThreadChannelMixin } from './mixins/ThreadChannelMixin.js';
import type { ThreadOnlyChannelMixin } from './mixins/ThreadOnlyChannelMixin.js';
import type { VoiceChannelMixin } from './mixins/VoiceChannelMixin.js';

export type PartialChannel = Channel<'unknown', Exclude<keyof APIChannel, keyof APIPartialChannel>>;

/**
 * @internal
 */
export type ChannelDataType<Type extends ChannelType | 'unknown'> = Type extends 'unknown'
	? APIChannel
	: Type extends ChannelType.AnnouncementThread | ChannelType.PrivateThread | ChannelType.PublicThread
		? APIThreadChannel
		: Extract<APIChannel, { type: Type }>; // TODO: remove special handling once dtypes PR for thread channel types releases

/**
 * Represents any channel on Discord.
 *
 * @typeParam Type - Specify the type of the channel being constructed for more accurate data types
 * @typeParam Omitted - Specify the propeties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks While this class can be directly constructed for any channel type, this class is not intended to be used directly,
 * preferring instead to create class that extend this class with the appropriate mixins for each channel type.
 */
export class Channel<
	Type extends ChannelType | 'unknown' = 'unknown',
	Omitted extends keyof ChannelDataType<Type> | '' = '',
> extends Structure<ChannelDataType<Type>, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each Channel.
	 *
	 * @remarks This template is only guaranteed to apply to channels constructed directly via `new Channel()`.
	 * Use the appropriate subclass template to remove data from that channel type.
	 */
	public static override DataTemplate: Partial<APIChannel> = {};

	public constructor(
		/**
		 * The raw data received from the API for the channel
		 */
		data: Omit<ChannelDataType<Type>, Omitted>,
	) {
		super(data as ChannelDataType<Type>);
	}

	/**
	 * {@inheritDoc Structure._patch}
	 */
	public override _patch(data: Partial<ChannelDataType<Type>>) {
		return super._patch(data);
	}

	/**
	 * The id of the channel
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The type of the channel
	 */
	public get type() {
		// This cast can be incorrect when type is omitted and if the wrong type of channel was constructed
		return this[kData].type as Type extends 'unknown' ? number : Type;
	}

	/**
	 * The name of the channel, null for DMs
	 *
	 * @privateRemarks The type of `name` can be narrowed in Guild Channels and DM channels to string and null respectively,
	 * respecting Omit behaviors
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * The flags that are applied to the channel.
	 *
	 * @privateRemarks The type of `flags` can be narrowed in Guild Channels and DMChannel to ChannelFlags, and in GroupDM channel
	 * to null, respecting Omit behaviors
	 */
	public get flags() {
		return this[kData].flags;
	}

	/**
	 * The timestamp the channel was created at
	 */
	public get createdTimestamp() {
		return typeof this.id === 'string' ? DiscordSnowflake.timestampFrom(this.id) : null;
	}

	/**
	 * The time the channel was created at
	 */
	public get createdAt() {
		const createdTimestamp = this.createdTimestamp;
		return createdTimestamp ? new Date(createdTimestamp) : null;
	}

	// TODO: Make these type guards once the mixins are written
	/**
	 * Indicates whether this channel is a thread channel
	 *
	 * @privateRemarks Overriden to `true` on `ThreadChannelMixin`
	 */
	public isThread(): this is ThreadChannelMixin<Extract<Type, ThreadChannelType>> {
		return false;
	}

	/**
	 * Indicates whether this channel can contain messages
	 *
	 * @privateRemarks Overriden to `true` on `TextChannelMixin`
	 */
	public isTextBased(): this is TextChannelMixin<Extract<Type, TextChannelType>> {
		return false;
	}

	/**
	 * Indiciates whether this channel is in a guild
	 *
	 * @privateRemarks Overriden to `true` on `GuildChannelMixin`
	 */
	public isGuildBased(): this is GuildChannelMixin<Extract<Type, GuildChannelType>> {
		return false;
	}

	/**
	 * Indicates whether this channel is a DM or DM Group
	 *
	 * @privateRemarks Overriden to `true` on `DMChannelMixin`
	 */
	public isDMBased(): this is DMChannelMixin<Extract<Type, ChannelType.DM | ChannelType.GroupDM>> {
		return false;
	}

	/**
	 * Indicates whether this channel has voice connection capabilities
	 *
	 * @privateRemarks Overriden to `true` on `VoiceChannelMixin`
	 */
	public isVoiceBased(): this is VoiceChannelMixin<
		Extract<Type, ChannelType.GuildStageVoice | ChannelType.GuildVoice>
	> {
		return false;
	}

	/**
	 * Indicates whether this channel only allows thread creation
	 *
	 * @privateRemarks Overriden to `true` on `ThreadOnlyChannelMixin`
	 */
	public isThreadOnly(): this is ThreadOnlyChannelMixin<
		Extract<Type, ChannelType.GuildForum | ChannelType.GuildMedia>
	> {
		return false;
	}

	/**
	 * Indicates whether this channel can have permission overwrites
	 *
	 * @privateRemarks Overriden to `true` on `ChannelPermissionsMixin`
	 */
	public isPermissionCapabale(): this is ChannelPermissionMixin<
		Extract<Type, Exclude<GuildChannelType, ChannelType.GuildDirectory | ThreadChannelType>>
	> {
		return false;
	}

	/**
	 * Indicates whether this channel can have webhooks
	 *
	 * @privateRemarks Overriden to `true` on `ChannelWebhooksMixin`
	 */
	public isWebhookCapable() {
		return false;
	}
}
