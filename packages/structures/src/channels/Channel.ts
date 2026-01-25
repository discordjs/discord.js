import { DiscordSnowflake } from '@sapphire/snowflake';
import type { APIChannel, APIPartialChannel, ChannelType, ChannelFlags } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { ChannelFlagsBitField } from '../bitfields/ChannelFlagsBitField.js';
import { kData } from '../utils/symbols.js';
import { isIdSet } from '../utils/type-guards.js';
import type { Partialize } from '../utils/types.js';
import type { ChannelPermissionMixin } from './mixins/ChannelPermissionMixin.js';
import type { ChannelWebhookMixin } from './mixins/ChannelWebhookMixin.js';
import type { DMChannelMixin } from './mixins/DMChannelMixin.js';
import type { GuildChannelMixin } from './mixins/GuildChannelMixin.js';
import type { TextChannelMixin } from './mixins/TextChannelMixin.js';
import type { ThreadChannelMixin } from './mixins/ThreadChannelMixin.js';
import type { ThreadOnlyChannelMixin } from './mixins/ThreadOnlyChannelMixin.js';
import type { VoiceChannelMixin } from './mixins/VoiceChannelMixin.js';

export type PartialChannel = Channel<ChannelType, Exclude<keyof APIChannel, keyof APIPartialChannel>>;

/**
 * The data stored by a {@link Channel} structure based on its {@link (Channel:class)."type"} property.
 */
export type ChannelDataType<Type extends ChannelType | 'unknown'> = Type extends ChannelType
	? Extract<APIChannel, { type: Type }>
	: APIPartialChannel;

/**
 * Represents any channel on Discord.
 *
 * @typeParam Type - Specify the type of the channel being constructed for more accurate data types
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks Although this class _can_ be instantiated directly for any channel type,
 * it's intended to be subclassed with the appropriate mixins for each channel type.
 */
export class Channel<
	Type extends ChannelType | 'unknown' = ChannelType,
	Omitted extends keyof ChannelDataType<Type> | '' = '',
> extends Structure<ChannelDataType<Type>, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each Channel.
	 *
	 * @remarks This template is only guaranteed to apply to channels constructed directly via `new Channel()`.
	 * Use the appropriate subclass template to remove data from that channel type.
	 */
	public static override readonly DataTemplate: Partial<APIChannel> = {};

	/**
	 * @param data - The raw data received from the API for the channel
	 */
	public constructor(data: Partialize<ChannelDataType<Type>, Omitted>) {
		super(data as ChannelDataType<Type>);
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
		return 'flags' in this[kData] && typeof this[kData].flags === 'number'
			? new ChannelFlagsBitField(this[kData].flags as ChannelFlags)
			: null;
	}

	/**
	 * The timestamp the channel was created at
	 */
	public get createdTimestamp() {
		return isIdSet(this.id) ? DiscordSnowflake.timestampFrom(this.id) : null;
	}

	/**
	 * The time the channel was created at
	 */
	public get createdAt() {
		const createdTimestamp = this.createdTimestamp;
		return createdTimestamp ? new Date(createdTimestamp) : null;
	}

	/**
	 * Indicates whether this channel is a thread channel
	 *
	 * @privateRemarks Overridden to `true` on `ThreadChannelMixin`
	 */
	public isThread(): this is ThreadChannelMixin & this {
		return false;
	}

	/**
	 * Indicates whether this channel can contain messages
	 *
	 * @privateRemarks Overridden to `true` on `TextChannelMixin`
	 */
	public isTextBased(): this is TextChannelMixin & this {
		return false;
	}

	/**
	 * Indicates whether this channel is in a guild
	 *
	 * @privateRemarks Overridden to `true` on `GuildChannelMixin`
	 */
	public isGuildBased(): this is GuildChannelMixin & this {
		return false;
	}

	/**
	 * Indicates whether this channel is a DM or DM Group
	 *
	 * @privateRemarks Overridden to `true` on `DMChannelMixin`
	 */
	public isDMBased(): this is DMChannelMixin & this {
		return false;
	}

	/**
	 * Indicates whether this channel has voice connection capabilities
	 *
	 * @privateRemarks Overridden to `true` on `VoiceChannelMixin`
	 */
	public isVoiceBased(): this is VoiceChannelMixin & this {
		return false;
	}

	/**
	 * Indicates whether this channel only allows thread creation
	 *
	 * @privateRemarks Overridden to `true` on `ThreadOnlyChannelMixin`
	 */
	public isThreadOnly(): this is ThreadOnlyChannelMixin & this {
		return false;
	}

	/**
	 * Indicates whether this channel can have permission overwrites
	 *
	 * @privateRemarks Overridden to `true` on `ChannelPermissionsMixin`
	 */
	public isPermissionCapable(): this is ChannelPermissionMixin & this {
		return false;
	}

	/**
	 * Indicates whether this channel can have webhooks
	 *
	 * @privateRemarks Overridden to `true` on `ChannelWebhooksMixin`
	 */
	public isWebhookCapable(): this is ChannelWebhookMixin & this {
		return false;
	}
}
