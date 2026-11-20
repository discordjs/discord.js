import { DiscordSnowflake } from '@sapphire/snowflake';
import {
	ChannelType,
	GatewayDispatchEvents,
	GuildDefaultMessageNotifications,
	GuildExplicitContentFilter,
	GuildMFALevel,
	GuildNSFWLevel,
	GuildPremiumTier,
	GuildSystemChannelFlags,
	GuildVerificationLevel,
	MessageReferenceType,
	MessageType,
	PermissionFlagsBits,
	RESTJSONErrorCodes,
	type APIApplication,
	type APIBan,
	type APIChannel,
	type APIGuild,
	type APIGuildMember,
	type APIMessage,
	type APIRole,
	type APIUser,
	type ApplicationFlags,
	type GatewayGuildCreateDispatchData,
	type GatewayMessageCreateDispatchData,
	type GuildMemberFlags,
	type MessageFlags,
	type RESTPostAPIChannelMessageJSONBody,
	type RESTPostAPIGuildChannelJSONBody,
	type RESTPostAPIGuildRoleJSONBody,
	type RoleFlags,
	type Snowflake,
} from 'discord-api-types/v10';
import { DiscordError } from '../errors.js';
import { MemoryStore } from '../store/MemoryStore.js';
import type { Store } from '../store/Store.js';
import { resolveId, type IdResolvable } from '../util.js';
import { Bus, type WorldEvent } from './Bus.js';
import { Clock } from './Clock.js';
import { ChannelHandle, GuildHandle, MemberHandle, MessageHandle, RoleHandle, UserHandle } from './handles.js';
import { PrivilegedIntents, intentFor } from './intents.js';

export type GuildRecord = Omit<APIGuild, 'roles'>;

export type MemberRecord = Omit<APIGuildMember, 'user'> & { user_id: Snowflake };

export interface BanRecord {
	reason: string | null;
	user_id: Snowflake;
}

export type MessageRecord = Omit<APIMessage, 'author' | 'mentions'> & {
	author_id: Snowflake;
	mention_ids: Snowflake[];
};

const keys = {
	application: 'application',
	user: (id: Snowflake) => `user:${id}`,
	guildIndex: 'index:guild:',
	guild: (id: Snowflake) => `guild:${id}`,
	role: (guildId: Snowflake, id = '') => `guild:${guildId}:role:${id}`,
	member: (guildId: Snowflake, id = '') => `guild:${guildId}:member:${id}`,
	ban: (guildId: Snowflake, id = '') => `guild:${guildId}:ban:${id}`,
	guildChannel: (guildId: Snowflake, id = '') => `guild:${guildId}:channel:${id}`,
	channel: (id: Snowflake) => `channel:${id}`,
	message: (channelId: Snowflake, id = '') => `channel:${channelId}:message:${id}`,
};

const userMention = /<@!?(?<id>\d{17,20})>/g;
const roleMention = /<@&(?<id>\d{17,20})>/g;

const defaultEveryonePermissions = [
	PermissionFlagsBits.CreateInstantInvite,
	PermissionFlagsBits.ChangeNickname,
	PermissionFlagsBits.ViewChannel,
	PermissionFlagsBits.SendMessages,
	PermissionFlagsBits.SendMessagesInThreads,
	PermissionFlagsBits.CreatePublicThreads,
	PermissionFlagsBits.CreatePrivateThreads,
	PermissionFlagsBits.EmbedLinks,
	PermissionFlagsBits.AttachFiles,
	PermissionFlagsBits.AddReactions,
	PermissionFlagsBits.UseExternalEmojis,
	PermissionFlagsBits.UseExternalStickers,
	PermissionFlagsBits.ReadMessageHistory,
	PermissionFlagsBits.UseApplicationCommands,
	PermissionFlagsBits.Connect,
	PermissionFlagsBits.Speak,
	PermissionFlagsBits.Stream,
	PermissionFlagsBits.UseVAD,
]
	.reduce((all, permission) => all | permission, 0n)
	.toString();

export interface CreatedAtOption {
	createdAt?: Date | number;
}

export interface WorldOptions {
	/**
	 * Fields of the application the bot belongs to
	 */
	application?: Partial<APIApplication>;
	/**
	 * Fields of the bot user
	 */
	botUser?: Partial<APIUser>;
	/**
	 * The privileged intents the application is approved for
	 *
	 * @defaultValue All of them
	 */
	privilegedIntents?: number;
	/**
	 * The number of shards the bot must connect with
	 *
	 * @defaultValue `1`
	 */
	shardCount?: number;
	/**
	 * Where the world keeps its records
	 *
	 * @defaultValue A new {@link MemoryStore}
	 */
	store?: Store;
	/**
	 * The bot token clients must authenticate with
	 *
	 * @defaultValue `'bot-token'`
	 */
	token?: string;
}

export interface CreateUserOptions extends CreatedAtOption, Partial<APIUser> {}

export interface CreateGuildOptions extends CreatedAtOption, Partial<Omit<GuildRecord, 'owner_id'>> {
	name: string;
	ownerId?: IdResolvable;
}

export type CreateChannelOptions = CreatedAtOption & RESTPostAPIGuildChannelJSONBody & { id?: Snowflake };

export type CreateRoleOptions = CreatedAtOption & RESTPostAPIGuildRoleJSONBody & { id?: Snowflake };

export interface AddMemberOptions extends Partial<Omit<MemberRecord, 'user_id'>> {
	joinedAt?: Date | number;
}

export type UpdateMemberOptions = Partial<
	Pick<MemberRecord, 'avatar' | 'communication_disabled_until' | 'deaf' | 'flags' | 'mute' | 'nick' | 'roles'>
>;

export interface AddBanOptions {
	deleteMessageSeconds?: number;
	reason?: string | null;
}

export type CreateMessageOptions = CreatedAtOption &
	RESTPostAPIChannelMessageJSONBody & {
		/**
		 * @defaultValue The bot user
		 */
		author?: IdResolvable;
		id?: Snowflake;
		type?: MessageType;
	};

/**
 * The single in-memory model of everything the fake Discord knows about.
 */
export class World {
	/**
	 * Where the world keeps its records
	 */
	public readonly store: Store;

	/**
	 * Where mutations publish the dispatches they imply
	 */
	public readonly bus = new Bus();

	/**
	 * The world's notion of the current time
	 */
	public readonly clock = new Clock();

	/**
	 * The bot token clients must authenticate with
	 */
	public readonly token: string;

	/**
	 * The number of shards the bot must connect with
	 */
	public readonly shardCount: number;

	/**
	 * The privileged intents the application is approved for
	 */
	public readonly privilegedIntents: number;

	/**
	 * The id of the bot user
	 */
	public readonly botUserId: Snowflake;

	public constructor(options: WorldOptions = {}) {
		this.store = options.store ?? new MemoryStore();
		this.token = options.token ?? 'bot-token';
		this.shardCount = options.shardCount ?? 1;
		this.privilegedIntents = options.privilegedIntents ?? PrivilegedIntents;

		const bot = this.createUser({ username: 'Test Bot', bot: true, ...options.botUser });
		this.botUserId = bot.id;

		this.store.put<APIApplication>(keys.application, {
			id: this.snowflake(),
			name: 'Test Bot',
			icon: null,
			description: '',
			bot_public: true,
			bot_require_code_grant: false,
			summary: '',
			verify_key: '0'.repeat(64),
			team: null,
			flags: 0 as ApplicationFlags,
			flags_new: '0',
			...options.application,
			bot: bot.data,
		});
	}

	/**
	 * Generates a snowflake for the given time
	 *
	 * @param time - When the snowflake was created, defaulting to the world's current time
	 */
	public snowflake(time: Date | number = this.clock.now()): Snowflake {
		return DiscordSnowflake.generate({ timestamp: Number(time) }).toString();
	}

	/**
	 * Formats a time as an ISO 8601 timestamp, the way Discord sends them
	 *
	 * @param time - The time, defaulting to the world's current time
	 */
	public timestamp(time: Date | number = this.clock.now()): string {
		return new Date(time).toISOString();
	}

	public get application(): APIApplication {
		return this.store.get<APIApplication>(keys.application)!;
	}

	public get botUser(): UserHandle {
		return new UserHandle(this, this.botUserId);
	}

	public createUser(options: CreateUserOptions = {}): UserHandle {
		const { createdAt, ...fields } = options;
		const id = fields.id ?? this.snowflake(createdAt);
		this.store.put<APIUser>(keys.user(id), {
			username: `user${this.store.increment('users')}`,
			discriminator: '0',
			global_name: null,
			avatar: null,
			...fields,
			id,
		});

		return new UserHandle(this, id);
	}

	public user(user: IdResolvable): UserHandle {
		return new UserHandle(this, this.requireUser(resolveId(user)).id);
	}

	public getUser(id: Snowflake): APIUser | undefined {
		return this.store.get<APIUser>(keys.user(id));
	}

	public requireUser(id: Snowflake): APIUser {
		const user = this.getUser(id);
		if (!user) throw new DiscordError(RESTJSONErrorCodes.UnknownUser, 'Unknown User', 404);
		return user;
	}

	/**
	 * Creates a guild owned by a user, with the bot already added to it
	 *
	 * @remarks
	 * This is world setup only: bots can no longer create guilds, so no client can reach it.
	 */
	public createGuild(options: CreateGuildOptions): GuildHandle {
		const { createdAt, ownerId, ...fields } = options;
		const time = createdAt ?? this.clock.now();
		const id = fields.id ?? this.snowflake(time);
		const owner = ownerId ? this.requireUser(resolveId(ownerId)) : this.createUser({ createdAt: time }).data;
		if (owner.bot) throw new Error(`Bots cannot own guilds, but ${owner.id} is a bot`);

		this.store.put<GuildRecord>(keys.guild(id), {
			icon: null,
			splash: null,
			discovery_splash: null,
			afk_channel_id: null,
			afk_timeout: 300,
			verification_level: GuildVerificationLevel.None,
			default_message_notifications: GuildDefaultMessageNotifications.OnlyMentions,
			explicit_content_filter: GuildExplicitContentFilter.Disabled,
			emojis: [],
			features: [],
			mfa_level: GuildMFALevel.None,
			application_id: null,
			system_channel_id: null,
			system_channel_flags: GuildSystemChannelFlags.SuppressJoinNotificationReplies,
			rules_channel_id: null,
			vanity_url_code: null,
			description: null,
			banner: null,
			premium_tier: GuildPremiumTier.None,
			premium_subscription_count: 0,
			preferred_locale: 'en-US' as GuildRecord['preferred_locale'],
			public_updates_channel_id: null,
			nsfw_level: GuildNSFWLevel.Default,
			stickers: [],
			premium_progress_bar_enabled: false,
			hub_type: null,
			safety_alerts_channel_id: null,
			incidents_data: null,
			...fields,
			id,
			owner_id: owner.id,
		});
		this.store.put(keys.guildIndex + id, id);

		this.store.put<APIRole>(keys.role(id, id), {
			id,
			name: '@everyone',
			color: 0,
			colors: { primary_color: 0, secondary_color: null, tertiary_color: null },
			hoist: false,
			position: 0,
			permissions: defaultEveryonePermissions,
			managed: false,
			mentionable: false,
			flags: 0 as RoleFlags,
		});

		for (const userId of [owner.id, this.botUserId]) {
			this.#putMember(id, userId, { joined_at: this.timestamp(time) });
		}

		this.#publish(GatewayDispatchEvents.GuildCreate, this.guildCreatePayload(id), id);
		return new GuildHandle(this, id);
	}

	public guild(guild: IdResolvable): GuildHandle {
		return new GuildHandle(this, this.requireGuild(resolveId(guild)).id);
	}

	public guilds(): GuildHandle[] {
		return this.store.list<Snowflake>(keys.guildIndex).map(([, id]) => new GuildHandle(this, id));
	}

	public getGuild(id: Snowflake): APIGuild | undefined {
		const record = this.store.get<GuildRecord>(keys.guild(id));
		return record && { ...record, roles: this.listRoles(id) };
	}

	public requireGuild(id: Snowflake): APIGuild {
		const guild = this.getGuild(id);
		if (!guild) throw new DiscordError(RESTJSONErrorCodes.UnknownGuild, 'Unknown Guild', 404);
		return guild;
	}

	public guildCreatePayload(id: Snowflake): GatewayGuildCreateDispatchData {
		const guild = this.requireGuild(id);
		const members = this.listMembers(id);
		const channels = this.listChannels(id) as GatewayGuildCreateDispatchData['channels'];

		return {
			...guild,
			joined_at: members.find((member) => member.user.id === this.botUserId)?.joined_at ?? this.timestamp(),
			large: members.length > 250,
			unavailable: false,
			member_count: members.length,
			voice_states: [],
			members,
			channels,
			threads: [],
			presences: [],
			stage_instances: [],
			guild_scheduled_events: [],
			soundboard_sounds: [],
		};
	}

	public createRole(guild: IdResolvable, options: CreateRoleOptions = {}): RoleHandle {
		const guildId = this.requireGuild(resolveId(guild)).id;
		const { createdAt, id: explicitId, ...body } = options;
		const id = explicitId ?? this.snowflake(createdAt);
		const color = body.color ?? body.colors?.primary_color ?? 0;
		const role: APIRole = {
			id,
			name: body.name ?? 'new role',
			color,
			colors: {
				primary_color: color,
				secondary_color: body.colors?.secondary_color ?? null,
				tertiary_color: body.colors?.tertiary_color ?? null,
			},
			hoist: body.hoist ?? false,
			icon: body.icon ?? null,
			unicode_emoji: body.unicode_emoji ?? null,
			position: this.store.list(keys.role(guildId)).length,
			permissions: body.permissions ?? defaultEveryonePermissions,
			managed: false,
			mentionable: body.mentionable ?? false,
			flags: 0 as RoleFlags,
		};

		this.store.put(keys.role(guildId, id), role);
		this.#publish(GatewayDispatchEvents.GuildRoleCreate, { guild_id: guildId, role }, guildId);
		return new RoleHandle(this, guildId, id);
	}

	public getRole(guildId: Snowflake, id: Snowflake): APIRole | undefined {
		return this.store.get<APIRole>(keys.role(guildId, id));
	}

	public requireRole(guildId: Snowflake, id: Snowflake): APIRole {
		const role = this.getRole(guildId, id);
		if (!role) throw new DiscordError(RESTJSONErrorCodes.UnknownRole, 'Unknown Role', 404);
		return role;
	}

	public listRoles(guildId: Snowflake): APIRole[] {
		return this.store.list<APIRole>(keys.role(guildId)).map(([, role]) => role);
	}

	public createChannel(guild: IdResolvable, options: CreateChannelOptions): ChannelHandle {
		const guildId = this.requireGuild(resolveId(guild)).id;
		const { createdAt, id: explicitId, ...body } = options;
		const id = explicitId ?? this.snowflake(createdAt);
		const channel = {
			type: ChannelType.GuildText,
			position: this.store.list(keys.guildChannel(guildId)).length,
			nsfw: false,
			parent_id: null,
			topic: null,
			rate_limit_per_user: 0,
			last_message_id: null,
			flags: 0,
			...body,
			permission_overwrites: (body.permission_overwrites ?? []).map((overwrite) => ({
				id: overwrite.id,
				type: overwrite.type,
				allow: overwrite.allow ?? '0',
				deny: overwrite.deny ?? '0',
			})),
			id,
			guild_id: guildId,
		} as APIChannel;

		this.store.put(keys.channel(id), channel);
		this.store.put(keys.guildChannel(guildId, id), id);
		this.#publish(GatewayDispatchEvents.ChannelCreate, channel as never, guildId);
		return new ChannelHandle(this, id);
	}

	public channel(channel: IdResolvable): ChannelHandle {
		return new ChannelHandle(this, this.requireChannel(resolveId(channel)).id);
	}

	public getChannel(id: Snowflake): APIChannel | undefined {
		return this.store.get<APIChannel>(keys.channel(id));
	}

	public requireChannel(id: Snowflake): APIChannel {
		const channel = this.getChannel(id);
		if (!channel) throw new DiscordError(RESTJSONErrorCodes.UnknownChannel, 'Unknown Channel', 404);
		return channel;
	}

	public listChannels(guildId: Snowflake): APIChannel[] {
		return this.store
			.list<Snowflake>(keys.guildChannel(guildId))
			.map(([, id]) => this.getChannel(id))
			.filter((channel) => channel !== undefined);
	}

	public addMember(guild: IdResolvable, user: IdResolvable, options: AddMemberOptions = {}): MemberHandle {
		const guildId = this.requireGuild(resolveId(guild)).id;
		const userId = this.requireUser(resolveId(user)).id;
		if (this.store.get(keys.member(guildId, userId))) return new MemberHandle(this, guildId, userId);

		const { joinedAt, ...fields } = options;
		this.#putMember(guildId, userId, { ...fields, joined_at: fields.joined_at ?? this.timestamp(joinedAt) });
		this.#publish(
			GatewayDispatchEvents.GuildMemberAdd,
			{ ...this.requireMember(guildId, userId), guild_id: guildId },
			guildId,
		);

		return new MemberHandle(this, guildId, userId);
	}

	public updateMember(guild: IdResolvable, user: IdResolvable, options: UpdateMemberOptions): MemberHandle {
		const guildId = resolveId(guild);
		const userId = resolveId(user);
		const { user: _user, ...current } = this.requireMember(guildId, userId);

		this.store.put<MemberRecord>(keys.member(guildId, userId), { ...current, ...options, user_id: userId });
		this.#publish(
			GatewayDispatchEvents.GuildMemberUpdate,
			{ avatar: null, banner: null, ...this.requireMember(guildId, userId), guild_id: guildId },
			guildId,
		);

		return new MemberHandle(this, guildId, userId);
	}

	public removeMember(guild: IdResolvable, user: IdResolvable): void {
		const guildId = resolveId(guild);
		const { user: removed } = this.requireMember(guildId, resolveId(user));

		this.store.delete(keys.member(guildId, removed.id));
		this.#publish(GatewayDispatchEvents.GuildMemberRemove, { guild_id: guildId, user: removed }, guildId);
	}

	public member(guild: IdResolvable, user: IdResolvable): MemberHandle {
		const member = this.requireMember(resolveId(guild), resolveId(user));
		return new MemberHandle(this, resolveId(guild), member.user.id);
	}

	public getMember(guildId: Snowflake, userId: Snowflake): APIGuildMember | undefined {
		const record = this.store.get<MemberRecord>(keys.member(guildId, userId));
		return record && this.#hydrateMember(record);
	}

	public requireMember(guildId: Snowflake, userId: Snowflake): APIGuildMember {
		this.requireGuild(guildId);
		const member = this.getMember(guildId, userId);
		if (!member) throw new DiscordError(RESTJSONErrorCodes.UnknownMember, 'Unknown Member', 404);
		return member;
	}

	public listMembers(guildId: Snowflake): APIGuildMember[] {
		return this.store.list<MemberRecord>(keys.member(guildId)).map(([, record]) => this.#hydrateMember(record));
	}

	#putMember(guildId: Snowflake, userId: Snowflake, fields: Partial<MemberRecord> & { joined_at: string }) {
		this.store.put<MemberRecord>(keys.member(guildId, userId), {
			roles: [],
			deaf: false,
			mute: false,
			flags: 0 as GuildMemberFlags,
			...fields,
			user_id: userId,
		});
	}

	#hydrateMember({ user_id, ...record }: MemberRecord): APIGuildMember {
		return { ...record, user: this.requireUser(user_id) };
	}

	/**
	 * Bans a user from a guild, removing them if they are a member and deleting their recent messages if asked to
	 */
	public addBan(guild: IdResolvable, user: IdResolvable, options: AddBanOptions = {}): APIBan {
		const guildId = this.requireGuild(resolveId(guild)).id;
		const banned = this.requireUser(resolveId(user));

		this.store.put<BanRecord>(keys.ban(guildId, banned.id), { user_id: banned.id, reason: options.reason ?? null });
		this.#publish(GatewayDispatchEvents.GuildBanAdd, { guild_id: guildId, user: banned }, guildId);

		if (this.getMember(guildId, banned.id)) this.removeMember(guildId, banned.id);
		if (options.deleteMessageSeconds) this.#deleteRecentMessages(guildId, banned.id, options.deleteMessageSeconds);

		return this.getBan(guildId, banned.id)!;
	}

	public removeBan(guild: IdResolvable, user: IdResolvable): void {
		const guildId = this.requireGuild(resolveId(guild)).id;
		const ban = this.getBan(guildId, resolveId(user));
		if (!ban) throw new DiscordError(RESTJSONErrorCodes.UnknownBan, 'Unknown Ban', 404);

		this.store.delete(keys.ban(guildId, ban.user.id));
		this.#publish(GatewayDispatchEvents.GuildBanRemove, { guild_id: guildId, user: ban.user }, guildId);
	}

	public getBan(guildId: Snowflake, userId: Snowflake): APIBan | undefined {
		const record = this.store.get<BanRecord>(keys.ban(guildId, userId));
		return record && { reason: record.reason, user: this.requireUser(record.user_id) };
	}

	public listBans(guildId: Snowflake): APIBan[] {
		return this.store
			.list<BanRecord>(keys.ban(guildId))
			.map(([, record]) => ({ reason: record.reason, user: this.requireUser(record.user_id) }));
	}

	#deleteRecentMessages(guildId: Snowflake, userId: Snowflake, seconds: number) {
		const cutoff = this.clock.now() - seconds * 1_000;
		for (const channel of this.listChannels(guildId)) {
			const ids = this.store
				.list<MessageRecord>(keys.message(channel.id))
				.filter(([, record]) => record.author_id === userId && Date.parse(record.timestamp) >= cutoff)
				.map(([, record]) => record.id);

			if (ids.length === 1) {
				this.deleteMessage(channel.id, ids[0]!);
			} else if (ids.length > 1) {
				for (const id of ids) this.store.delete(keys.message(channel.id, id));
				this.#publish(
					GatewayDispatchEvents.MessageDeleteBulk,
					{ ids, channel_id: channel.id, guild_id: guildId },
					guildId,
				);
			}
		}
	}

	public createMessage(channel: IdResolvable, options: CreateMessageOptions): MessageHandle {
		const target = this.requireChannel(resolveId(channel));
		const guildId = 'guild_id' in target ? (target.guild_id ?? null) : null;
		const { author, createdAt, id: explicitId, type, ...body } = options;
		const time = createdAt ?? this.clock.now();
		const id = explicitId ?? this.snowflake(time);
		const authorId = author ? this.requireUser(resolveId(author)).id : this.botUserId;
		const content = body.content ?? '';

		const mentionIds = [...new Set([...content.matchAll(userMention)].map((match) => match.groups!.id!))].filter(
			(userId) => this.getUser(userId),
		);
		const mentionRoles = [...new Set([...content.matchAll(roleMention)].map((match) => match.groups!.id!))].filter(
			(roleId) => guildId && this.getRole(guildId, roleId),
		);

		const record: MessageRecord = {
			id,
			channel_id: target.id,
			author_id: authorId,
			content,
			timestamp: this.timestamp(time),
			edited_timestamp: null,
			tts: body.tts ?? false,
			mention_everyone: /@(?:everyone|here)/.test(content),
			mention_ids: mentionIds,
			mention_roles: mentionRoles,
			attachments: [],
			embeds: body.embeds ?? [],
			pinned: false,
			type: type ?? (body.message_reference ? MessageType.Reply : MessageType.Default),
			flags: body.flags ?? (0 as MessageFlags),
			components: (body.components ?? []) as NonNullable<MessageRecord['components']>,
			...(body.nonce === undefined ? {} : { nonce: body.nonce }),
			...(body.message_reference
				? {
						message_reference: {
							type: MessageReferenceType.Default,
							message_id: body.message_reference.message_id,
							channel_id: body.message_reference.channel_id ?? target.id,
							...(guildId ? { guild_id: body.message_reference.guild_id ?? guildId } : {}),
						},
					}
				: {}),
		};

		this.store.put(keys.message(target.id, id), record);
		this.store.put(keys.channel(target.id), { ...target, last_message_id: id });

		const message = this.getMessage(target.id, id)!;
		const payload: GatewayMessageCreateDispatchData = guildId
			? {
					...message,
					guild_id: guildId,
					...this.#partialMember(guildId, authorId),
					mentions: message.mentions.map((user) => ({ ...user, ...this.#partialMember(guildId, user.id) })),
				}
			: message;

		this.#publish(GatewayDispatchEvents.MessageCreate, payload, guildId);
		return new MessageHandle(this, target.id, id);
	}

	public deleteMessage(channel: IdResolvable, message: IdResolvable): void {
		const target = this.requireChannel(resolveId(channel));
		const { id } = this.requireMessage(target.id, resolveId(message));
		const guildId = 'guild_id' in target ? (target.guild_id ?? null) : null;

		this.store.delete(keys.message(target.id, id));
		this.#publish(
			GatewayDispatchEvents.MessageDelete,
			{ id, channel_id: target.id, ...(guildId ? { guild_id: guildId } : {}) },
			guildId,
		);
	}

	public getMessage(channelId: Snowflake, id: Snowflake): APIMessage | undefined {
		const record = this.store.get<MessageRecord>(keys.message(channelId, id));
		return record && this.#hydrateMessage(record);
	}

	public requireMessage(channelId: Snowflake, id: Snowflake): APIMessage {
		const message = this.getMessage(channelId, id);
		if (!message) throw new DiscordError(RESTJSONErrorCodes.UnknownMessage, 'Unknown Message', 404);
		return message;
	}

	public listMessages(channelId: Snowflake): APIMessage[] {
		return this.store.list<MessageRecord>(keys.message(channelId)).map(([, record]) => this.#hydrateMessage(record));
	}

	#hydrateMessage({ author_id, mention_ids, ...record }: MessageRecord): APIMessage {
		return {
			...record,
			author: this.requireUser(author_id),
			mentions: mention_ids.map((id) => this.getUser(id)).filter((user) => user !== undefined),
		};
	}

	#partialMember(guildId: Snowflake, userId: Snowflake): { member?: Omit<APIGuildMember, 'user'> } {
		const member = this.getMember(guildId, userId);
		if (!member) return {};

		const { user: _user, ...partial } = member;
		return { member: partial };
	}

	#publish<Event extends WorldEvent['t']>(
		event: Event,
		data: Extract<WorldEvent, { t: Event }>['d'],
		guildId: Snowflake | null,
	): void {
		// eslint-disable-next-line id-length
		this.bus.publish({ t: event, d: data, guildId, intent: intentFor(event, guildId) } as WorldEvent);
	}
}
