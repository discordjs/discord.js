import { DiscordSnowflake } from '@sapphire/snowflake';
import type { APIChannel, APIPartialChannel, ChannelType } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';

export type PartialChannel = Channel<'unknown', Exclude<keyof APIChannel, keyof APIPartialChannel>>;

/**
 * @internal
 */
export type ChannelDataType<Type extends ChannelType | 'unknown'> = Type extends 'unknown'
	? APIChannel
	: Extract<APIChannel, { type: Type }>;

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
	public isThread() {
		return false;
	}

	/**
	 * Indicates whether this channel can contain messages
	 *
	 * @privateRemarks Overriden to `true` on `TextChannelMixin`
	 */
	public iSTextBased() {
		return false;
	}

	/**
	 * Indiciates whether this channel is in a guild
	 *
	 * @privateRemarks Overriden to `true` on `GuildChannelMixin`
	 */
	public isGuildBased() {
		return false;
	}

	/**
	 * Indicates whether this channel is a DM or DM Group
	 *
	 * @privateRemarks Overriden to `true` on `DMChannelMixin`
	 */
	public isDMBased() {
		return false;
	}

	/**
	 * Indicates whether this channel has voice connection capabilities
	 *
	 * @privateRemarks Overriden to `true` on `VoiceChannelMixin`
	 */
	public isVoiceBased() {
		return false;
	}

	/**
	 * Indicates whether this channel only allows thread creation
	 *
	 * @privateRemarks Overriden to `true` on `ThreadOnlyChannelMixin`
	 */
	public isThreadOnly() {
		return false;
	}

	/**
	 * Indicates whether this channel can have permission overwrites
	 *
	 * @privateRemarks Overriden to `true` on `ChannelPermissionsMixin`
	 */
	public isPermissionCapabale() {
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
