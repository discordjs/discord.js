// Type definitions for discord.js 11.5.0
// Project: https://github.com/discordjs/discord.js
// Definitions by:
//   acdenisSK <acdenissk69@gmail.com> (https://github.com/acdenisSK)
//   Zack Campbell <zajrik@gmail.com> (https://github.com/zajrik)
// License: MIT

declare module 'discord.js' {
	import { EventEmitter } from 'events';
	import { Stream, Readable as ReadableStream } from 'stream';
	import { ChildProcess } from 'child_process';

	export const version: string;

//#region Classes

	class Attachment {
		constructor(file: BufferResolvable | Stream, name?: string);
		private _attach(file: BufferResolvable | Stream, name: string): void;

		public readonly attachment: BufferResolvable | Stream;
		public readonly name: string;
		public setAttachment(file: BufferResolvable | Stream, name: string): this;
		public setFile(attachment: BufferResolvable | Stream): this;
		public setName(name: string): this;
	}

	class AudioPlayer extends EventEmitter {
		constructor(voiceConnection: VoiceConnection);
		public readonly dispatcher: StreamDispatcher;
		public opusEncoder: object;
		public prism: object;
		public readonly transcoder: object;
		public voiceConnection: VoiceConnection;
		public setBitrate(value: number | 'auto'): void;
	}

	class BaseOpus {
		constructor(options?: { bitrate?: number, fec?: boolean, plp?: number });
		public bitrate: number;
		public options: object;
	}

	export class CategoryChannel extends GuildChannel {
		public readonly children: Collection<Snowflake, GuildChannel>;
	}

	export class Channel {
		constructor(client: Client, data: object);
		public readonly client: Client;
		public readonly createdAt: Date;
		public readonly createdTimestamp: number;
		public id: Snowflake;
		public type: 'dm' | 'group' | 'text' | 'voice' | 'category' | 'news' | 'store';
		public delete(): Promise<Channel>;
	}

	export class Client extends EventEmitter {
		constructor(options?: ClientOptions);
		private _intervals: Set<NodeJS.Timer>;
		private _pingTimestamp: number;
		private _timeouts: Set<NodeJS.Timer>;
		private actions: object;
		private dataManager: object;
		private manager: ClientManager;
		private resolver: ClientDataResolver;
		private rest: object;
		private voice: ClientVoiceManager;
		private ws: object;
		private _eval(script: string): any;
		private _pong(startTime: number): void;
		private _setPresence(id: Snowflake, presence: object): void;
		private _validateOptions(options?: ClientOptions): void;

		public broadcasts: VoiceBroadcast[];
		public readonly browser: boolean;
		public channels: Collection<Snowflake, Channel>;
		public readonly emojis: Collection<Snowflake, Emoji>;
		public guilds: Collection<Snowflake, Guild>;
		public options: ClientOptions;
		public readonly ping: number;
		public pings: number[];
		public presences: Collection<Snowflake, Presence>;
		public readyAt: Date;
		public readonly readyTimestamp: number;
		public shard: ShardClientUtil;
		public readonly status: number;
		public token: string;
		public readonly uptime: number;
		public user: ClientUser;
		public users: Collection<Snowflake, User>;
		public readonly voiceConnections: Collection<Snowflake, VoiceConnection>;
		public clearInterval(interval: NodeJS.Timer): void;
		public clearTimeout(timeout: NodeJS.Timer): void;
		public createVoiceBroadcast(): VoiceBroadcast;
		public destroy(): Promise<void>;
		public fetchApplication(id?: Snowflake): Promise<OAuth2Application>;
		public fetchInvite(invite: InviteResolvable): Promise<Invite>;
		public fetchUser(id: Snowflake, cache?: boolean): Promise<User>;
		public fetchVoiceRegions(): Promise<Collection<string, VoiceRegion>>;
		public fetchWebhook(id: Snowflake, token?: string): Promise<Webhook>;
		public generateInvite(permissions?: PermissionResolvable): Promise<string>;
		public login(token?: string): Promise<string>;
		public setInterval(fn: Function, delay: number, ...args: any[]): NodeJS.Timer;
		public setTimeout(fn: Function, delay: number, ...args: any[]): NodeJS.Timer;
		public sweepMessages(lifetime?: number): number;
		public syncGuilds(guilds?: Guild[] | Collection<Snowflake, Guild>): void;

		public on(event: 'channelCreate', listener: (channel: Channel) => void): this;
		public on(event: 'channelDelete', listener: (channel: Channel) => void): this;
		public on(event: 'channelPinsUpdate', listener: (channel: Channel, time: Date) => void): this;
		public on(event: 'channelUpdate', listener: (oldChannel: Channel, newChannel: Channel) => void): this;
		public on(event: 'clientUserGuildSettingsUpdate', listener: (clientUserGuildSettings: ClientUserGuildSettings) => void): this;
		public on(event: 'clientUserSettingsUpdate', listener: (clientUserSettings: ClientUserSettings) => void): this;
		public on(event: 'debug', listener: (info: string) => void): this;
		public on(event: 'disconnect', listener: (event: any) => void): this;
		public on(event: 'emojiCreate', listener: (emoji: Emoji) => void): this;
		public on(event: 'emojiDelete', listener: (emoji: Emoji) => void): this;
		public on(event: 'emojiUpdate', listener: (oldEmoji: Emoji, newEmoji: Emoji) => void): this;
		public on(event: 'error', listener: (error: Error) => void): this;
		public on(event: 'guildBanAdd', listener: (guild: Guild, user: User) => void): this;
		public on(event: 'guildBanRemove', listener: (guild: Guild, user: User) => void): this;
		public on(event: 'guildCreate', listener: (guild: Guild) => void): this;
		public on(event: 'guildDelete', listener: (guild: Guild) => void): this;
		public on(event: 'guildMemberAdd', listener: (member: GuildMember) => void): this;
		public on(event: 'guildMemberAvailable', listener: (member: GuildMember) => void): this;
		public on(event: 'guildMemberRemove', listener: (member: GuildMember) => void): this;
		public on(event: 'guildMembersChunk', listener: (members: GuildMember[], guild: Guild) => void): this;
		public on(event: 'guildMemberSpeaking', listener: (member: GuildMember, speaking: boolean) => void): this;
		public on(event: 'guildMemberUpdate', listener: (oldMember: GuildMember, newMember: GuildMember) => void): this;
		public on(event: 'guildUnavailable', listener: (guild: Guild) => void): this;
		public on(event: 'guildUpdate', listener: (oldGuild: Guild, newGuild: Guild) => void): this;
		public on(event: 'guildIntegrationsUpdate', listener: (guild: Guild) => void): this;
		public on(event: 'message', listener: (message: Message) => void): this;
		public on(event: 'messageDelete', listener: (message: Message) => void): this;
		public on(event: 'messageDeleteBulk', listener: (messages: Collection<Snowflake, Message>) => void): this;
		public on(event: 'messageReactionAdd', listener: (messageReaction: MessageReaction, user: User) => void): this;
		public on(event: 'messageReactionRemove', listener: (messageReaction: MessageReaction, user: User) => void): this;
		public on(event: 'messageReactionRemoveAll', listener: (message: Message) => void): this;
		public on(event: 'messageUpdate', listener: (oldMessage: Message, newMessage: Message) => void): this;
		public on(event: 'presenceUpdate', listener: (oldMember: GuildMember, newMember: GuildMember) => void): this;
		public on(event: 'rateLimit', listener: (rateLimit: RateLimitInfo) => void): this;
		public on(event: 'ready', listener: () => void): this;
		public on(event: 'reconnecting', listener: () => void): this;
		public on(event: 'resume', listener: (replayed: number) => void): this;
		public on(event: 'roleCreate', listener: (role: Role) => void): this;
		public on(event: 'roleDelete', listener: (role: Role) => void): this;
		public on(event: 'roleUpdate', listener: (oldRole: Role, newRole: Role) => void): this;
		public on(event: 'typingStart', listener: (channel: Channel, user: User) => void): this;
		public on(event: 'typingStop', listener: (channel: Channel, user: User) => void): this;
		public on(event: 'userNoteUpdate', listener: (user: UserResolvable, oldNote: string, newNote: string) => void): this;
		public on(event: 'userUpdate', listener: (oldUser: User, newUser: User) => void): this;
		public on(event: 'voiceStateUpdate', listener: (oldMember: GuildMember, newMember: GuildMember) => void): this;
		public on(event: 'warn', listener: (info: string) => void): this;
		public on(event: 'webhookUpdate', listener: (channel: TextChannel) => void): this;
		public on(event: string, listener: Function): this;

		public once(event: 'channelCreate', listener: (channel: Channel) => void): this;
		public once(event: 'channelDelete', listener: (channel: Channel) => void): this;
		public once(event: 'channelPinsUpdate', listener: (channel: Channel, time: Date) => void): this;
		public once(event: 'channelUpdate', listener: (oldChannel: Channel, newChannel: Channel) => void): this;
		public once(event: 'clientUserGuildSettingsUpdate', listener: (clientUserGuildSettings: ClientUserGuildSettings) => void): this;
		public once(event: 'clientUserSettingsUpdate', listener: (clientUserSettings: ClientUserSettings) => void): this;
		public once(event: 'debug', listener: (info: string) => void): this;
		public once(event: 'disconnect', listener: (event: any) => void): this;
		public once(event: 'emojiCreate', listener: (emoji: Emoji) => void): this;
		public once(event: 'emojiDelete', listener: (emoji: Emoji) => void): this;
		public once(event: 'emojiUpdate', listener: (oldEmoji: Emoji, newEmoji: Emoji) => void): this;
		public once(event: 'error', listener: (error: Error) => void): this;
		public once(event: 'guildBanAdd', listener: (guild: Guild, user: User) => void): this;
		public once(event: 'guildBanRemove', listener: (guild: Guild, user: User) => void): this;
		public once(event: 'guildCreate', listener: (guild: Guild) => void): this;
		public once(event: 'guildDelete', listener: (guild: Guild) => void): this;
		public once(event: 'guildMemberAdd', listener: (member: GuildMember) => void): this;
		public once(event: 'guildMemberAvailable', listener: (member: GuildMember) => void): this;
		public once(event: 'guildMemberRemove', listener: (member: GuildMember) => void): this;
		public once(event: 'guildMembersChunk', listener: (members: GuildMember[], guild: Guild) => void): this;
		public once(event: 'guildMemberSpeaking', listener: (member: GuildMember, speaking: boolean) => void): this;
		public once(event: 'guildMemberUpdate', listener: (oldMember: GuildMember, newMember: GuildMember) => void): this;
		public once(event: 'guildUnavailable', listener: (guild: Guild) => void): this;
		public once(event: 'guildUpdate', listener: (oldGuild: Guild, newGuild: Guild) => void): this;
		public once(event: 'guildIntegrationsUpdate', listener: (guild: Guild) => void): this;
		public once(event: 'message', listener: (message: Message) => void): this;
		public once(event: 'messageDelete', listener: (message: Message) => void): this;
		public once(event: 'messageDeleteBulk', listener: (messages: Collection<Snowflake, Message>) => void): this;
		public once(event: 'messageReactionAdd', listener: (messageReaction: MessageReaction, user: User) => void): this;
		public once(event: 'messageReactionRemove', listener: (messageReaction: MessageReaction, user: User) => void): this;
		public once(event: 'messageReactionRemoveAll', listener: (message: Message) => void): this;
		public once(event: 'messageUpdate', listener: (oldMessage: Message, newMessage: Message) => void): this;
		public once(event: 'presenceUpdate', listener: (oldMember: GuildMember, newMember: GuildMember) => void): this;
		public once(event: 'rateLimit', listener: (rateLimit: RateLimitInfo) => void): this;
		public once(event: 'ready', listener: () => void): this;
		public once(event: 'reconnecting', listener: () => void): this;
		public once(event: 'resume', listener: (replayed: number) => void): this;
		public once(event: 'roleCreate', listener: (role: Role) => void): this;
		public once(event: 'roleDelete', listener: (role: Role) => void): this;
		public once(event: 'roleUpdate', listener: (oldRole: Role, newRole: Role) => void): this;
		public once(event: 'typingStart', listener: (channel: Channel, user: User) => void): this;
		public once(event: 'typingStop', listener: (channel: Channel, user: User) => void): this;
		public once(event: 'userNoteUpdate', listener: (user: UserResolvable, oldNote: string, newNote: string) => void): this;
		public once(event: 'userUpdate', listener: (oldUser: User, newUser: User) => void): this;
		public once(event: 'voiceStateUpdate', listener: (oldMember: GuildMember, newMember: GuildMember) => void): this;
		public once(event: 'warn', listener: (info: string) => void): this;
		public once(event: 'webhookUpdate', listener: (channel: TextChannel) => void): this;
		public once(event: string, listener: Function): this;
	}

	class ClientDataResolver {
		constructor(client: Client);
		public resolveBase64(data: Base64Resolvable): string;
		public resolveChannel(channel: ChannelResolvable): Channel;
		public resolveChannelID(channel: ChannelResolvable): Snowflake;
		public resolveColor(color: ColorResolvable): number;
		public resolveEmojiIdentifier(emoji: EmojiIdentifierResolvable): string;
		public resolveFile(resource: BufferResolvable | Stream): Promise<Buffer>;
		public resolveGuild(guild: GuildResolvable): Guild;
		public resolveGuildMember(guild: GuildResolvable, user: UserResolvable): GuildMember;
		public resolveImage(imge: BufferResolvable | Base64Resolvable): Promise<string>;
		public resolveInviteCode(data: InviteResolvable): string;
		public resolveString(data: StringResolvable): string;
		public resolveUser(user: UserResolvable): User;
		public resolveUserID(user: UserResolvable): Snowflake;

		public static resolveColor(color: ColorResolvable): number;
	}

	class ClientManager {
		constructor(client: Client);
		public client: Client;
		public heartbeatInterval: number;
		public status: number;
		public connectToWebSocket(token: string, resolve: Function, reject: Function): void;
	}

	export class ClientUser extends User {
		public blocked: Collection<Snowflake, User>;
		public email: string;
		public friends: Collection<Snowflake, User>;
		public guildSettings: Collection<Snowflake, ClientUserGuildSettings>;
		public mfaEnabled: boolean;
		public mobile: boolean;
		public notes: Collection<Snowflake, string>;
		public premium: boolean;
		public settings: ClientUserSettings;
		public verified: boolean;
		public acceptInvite(invite: Invite | string): Promise<Guild>;
		public addFriend(user?: UserResolvable): Promise<User>;
		public createGroupDM(recipients: GroupDMRecipientOptions[]): Promise<GroupDMChannel>;
		public createGuild(name: string, region: string, icon?: BufferResolvable | Base64Resolvable): Promise<Guild>;
		public fetchMentions(options?: { limit?: number; roles?: boolean, everyone?: boolean; guild?: Guild | Snowflake }): Promise<Message[]>;
		public removeFriend(user?: UserResolvable): Promise<User>;
		public setActivity(name: string | null, options?: { url?: string, type?: ActivityType | number }): Promise<Presence>;
		public setAFK(afk: boolean): Promise<ClientUser>;
		public setAvatar(avatar: BufferResolvable | Base64Resolvable): Promise<ClientUser>;
		public setEmail(email: string, password: string): Promise<ClientUser>;
		public setGame(game: string | null, streamingURL?: string): Promise<ClientUser>;
		public setPassword(newPassword: string, oldPassword: string): Promise<ClientUser>;
		public setPresence(data: PresenceData): Promise<ClientUser>;
		public setStatus(status: PresenceStatus): Promise<ClientUser>;
		public setUsername(username: string, password?: string): Promise<ClientUser>;
	}

	class ClientUserChannelOverride {
		constructor(user: User, data: object);
		private patch(data: object): void;

		public messageNotifications: GuildChannelMessageNotifications;
		public muted: boolean;
	}

	class ClientUserGuildSettings {
		constructor(data: object, guild: Guild);
		private patch(data: object): void;

		public channelOverrides: Collection<Snowflake, ClientUserChannelOverride>;
		public readonly client: Client;
		public guildID: Snowflake;
		public messageNotifications: GuildChannelMessageNotifications;
		public mobilePush: boolean;
		public muted: boolean;
		public suppressEveryone: boolean;
		public update(name: string, value: any): Promise<object>;
	}

	export class ClientUserSettings {
		constructor(user: User, data: object);
		private patch(data: object): void;

		public convertEmoticons: boolean;
		public defaultGuildsRestricted: boolean;
		public detectPlatformAccounts: boolean;
		public developerMode: boolean;
		public enableTTSCommand: boolean;
		public explicitContentFilter: 'DISABLED' | 'NON_FRIENDS' | 'FRIENDS_AND_NON_FRIENDS' | string;
		public friendsSources: { all: boolean, mutualGuilds: boolean, mutualFriends: boolean };
		public guildsPositions: Snowflake[];
		public inlineAttachmentMedia: boolean;
		public inlineEmbedMedia: boolean;
		public locale: string;
		public messageDisplayCompact: boolean;
		public renderReactions: boolean;
		public restrictedGuilds: Snowflake[];
		public showCurrentGame: boolean;
		public status: PresenceStatus;
		public theme: string;
		public addRestrictedGuild(guild: Guild): Promise<Guild>;
		public removeRestrictedGuild(guild: Guild): Promise<Guild>;
		public setGuildPosition(guild: Guild, position: number, relative?: boolean): Promise<Guild>;
		public update(name: string, value: any): Promise<object>;
	}

	class ClientVoiceManager {
		constructor(client: Client);
		public client: Client;
		public connections: Collection<Snowflake, VoiceConnection>;
		public joinChannel(channel: VoiceChannel): Promise<VoiceConnection>;
	}

	export class Collection<K, V> extends Map<K, V> {
		private _array: V[];
		private _keyArray: K[];

		public array(): V[];
		public clone(): Collection<K, V>;
		public concat(...collections: Collection<K, V>[]): Collection<K, V>;
		public deleteAll(): Promise<V>[];
		public equals(collection: Collection<any, any>): boolean;
		public every(fn: (value: V, key: K, collection: Collection<K, V>) => boolean, thisArg?: any): boolean;
		public exists(prop: keyof V, value: any): boolean;
		public filter(fn: (value: V, key: K, collection: Collection<K, V>) => boolean, thisArg?: any): Collection<K, V>;
		public filterArray(fn: (value: V, key: K, collection: Collection<K, V>) => boolean, thisArg?: any): V[];
		public find(prop: keyof V, value: any): V;
		public find(fn: (value: V, key: K, collection: Collection<K, V>) => boolean): V;
		public findAll(prop: keyof V, value: any): V[];
		public findKey(prop: keyof V, value: any): K;
		public findKey(fn: (value: V, key: K, collection: Collection<K, V>) => boolean): K;
		public first(): V;
		public first(count: number): V[];
		public firstKey(): K;
		public firstKey(count: number): K[];
		public keyArray(): K[];
		public last(): V;
		public last(count: number): V[];
		public lastKey(): K;
		public lastKey(count: number): K[];
		public map<T>(fn: (value: V, key: K, collection: Collection<K, V>) => T, thisArg?: any): T[];
		public partition(fn: (value: V, key: K, collection: Collection<K, V>) => boolean, thisArg?: any): [Collection<K, V>, Collection<K, V>];
		public random(): V;
		public random(count: number): V[];
		public randomKey(): K;
		public randomKey(count: number): K[];
		public reduce<T>(fn: (accumulator: any, value: V, key: K, collection: Collection<K, V>) => T, initialValue?: any): T;
		public some(fn: (value: V, key: K, collection: Collection<K, V>) => boolean, thisArg?: any): boolean;
		public sort(compareFunction?: (a: V, b: V, c?: K, d?: K) => number): Collection<K, V>;
		public sweep(fn: (value: V, key: K, collection: Collection<K, V>) => boolean, thisArg?: any): number;
		public tap(fn: (value: V, key: K, map: Collection<K, V>) => void, thisArg?: any): Collection<K, V>;
	}

	abstract class Collector<K, V> extends EventEmitter {
		constructor(client: Client, filter: CollectorFilter, options?: CollectorOptions);
		private _timeout: NodeJS.Timer;
		private _handle(...args: any[]): void;

		public readonly client: Client;
		public collected: Collection<K, V>;
		public ended: boolean;
		public filter: CollectorFilter;
		public readonly next: Promise<V>;
		public options: CollectorOptions;
		public stop(reason?: string): void;

		protected listener: Function;
		public abstract cleanup(): void;
		public abstract handle(...args: any[]): CollectorHandler<K, V>;
		public abstract postCheck(...args: any[]): string | null;

		public on(event: 'collect', listener: (element: V, collector: Collector<K, V>) => void): this;
		public on(event: 'end', listener: (collected: Collection<K, V>, reason: string) => void): this;
		public on(event: string, listener: Function): this;

		public once(event: 'collect', listener: (element: V, collector: Collector<K, V>) => void): this;
		public once(event: 'end', listener: (collected: Collection<K, V>, reason: string) => void): this;
		public once(event: string, listener: Function): this;
	}

	class DiscordAPIError extends Error {
		constructor(error: object);
		private static flattenErrors(obj: object, key: string): string[];

		public code: number;
		public method: string;
		public path: string;
	}

	export class DMChannel extends TextBasedChannel(Channel) {
		constructor(client: Client, data: object);
		public lastMessageID: Snowflake;
		public messages: Collection<Snowflake, Message>;
		public recipient: User;
		public toString(): string;
	}

	export class Emoji {
		constructor(guild: Guild, data: object);
		public animated: boolean;
		public readonly client: Client;
		public readonly createdAt: Date;
		public readonly createdTimestamp: number;
		public readonly deletable: boolean;
		public guild: Guild;
		public id: Snowflake;
		public readonly identifier: string;
		public managed: boolean;
		public name: string;
		public requiresColons: boolean;
		public readonly roles: Collection<Snowflake, Role>;
		public readonly url: string;
		public addRestrictedRole(role: Role): Promise<Emoji>;
		public addRestrictedRoles(roles: Role[]): Promise<Emoji>;
		public edit(data: EmojiEditData, reason?: string): Promise<Emoji>;
		public equals(other: Emoji | object): boolean;
		public fetchAuthor(): Promise<User>;
		public removeRestrictedRole(role: Role): Promise<Emoji>;
		public removeRestrictedRoles(roles: Role[]): Promise<Emoji>;
		public setName(name: string, reason?: string): Promise<Emoji>;
		public toString(): string;
	}

	export class Game {
		constructor(data: object, presence: Presence);
		public applicationID: string;
		public assets: RichPresenceAssets;
		public details: string;
		public name: string;
		public readonly streaming: boolean;
		public party: {
			id: string;
			size: [number, number];
		};
		public state: string;
		public timestamps: {
			start: Date;
			end: Date;
		};
		public readonly flags: string[];
		public type: number;
		public url: string;
		public equals(game: Game): boolean;
		public toString(): string;
		private _flags: string[];
		private syncID: string;
	}

	export class GroupDMChannel extends TextBasedChannel(Channel) {
		constructor(client: Client, data: object);
		public applicationID: string;
		public icon: string;
		public lastMessageID: string;
		public managed: boolean;
		public messages: Collection<Snowflake, Message>;
		public name: string;
		public nicks: Collection<Snowflake, string>;
		public readonly owner: User;
		public ownerID: string;
		public recipients: Collection<Snowflake, User>;
		public addUser(accessTokenOrID: UserResolvable | string, nick?: string): Promise<GroupDMChannel>;
		public equals(channel: GroupDMChannel): boolean;
		public setIcon(icon: Base64Resolvable | BufferResolvable): Promise<GroupDMChannel>;
		public toString(): string;
	}

	export class Guild {
		constructor(client: Client, data: object);
		private readonly _sortedRoles: Collection<Snowflake, Role>;
		private _sortedChannels(type: string): Collection<Snowflake, GuildChannel>;
		private _sortPositionWithID(collection: Collection<any, any>): Collection<any, any>;

		protected setup(data: any): void;

		public readonly afkChannel: VoiceChannel;
		public afkChannelID: string;
		public afkTimeout: number;
		public applicationID: string;
		public available: boolean;
		public channels: Collection<Snowflake, GuildChannel>;
		public defaultMessageNotifications: DefaultMessageNotifications | number;
		public readonly client: Client;
		public readonly createdAt: Date;
		public readonly createdTimestamp: number;
		public readonly defaultChannel: TextChannel;
		public readonly defaultRole: Role;
		public embedEnabled: boolean;
		public emojis: Collection<Snowflake, Emoji>;
		public explicitContentFilter: number;
		public features: string[];
		public icon: string;
		public readonly iconURL: string;
		public id: Snowflake;
		public readonly joinedAt: Date;
		public joinedTimestamp: number;
		public large: boolean;
		public readonly me: GuildMember;
		public memberCount: number;
		public members: Collection<Snowflake, GuildMember>;
		public readonly messageNotifications: MessageNotifications;
		public readonly mobilePush: boolean;
		public readonly muted: boolean;
		public name: string;
		public readonly nameAcronym: string;
		public readonly owner: GuildMember;
		public ownerID: string;
		public readonly position: number;
		public presences: Collection<Snowflake, Presence>;
		public region: string;
		public roles: Collection<Snowflake, Role>;
		public splash: string;
		public readonly splashURL: string;
		public readonly suppressEveryone: boolean;
		public readonly systemChannel: GuildChannel;
		public systemChannelID: Snowflake;
		public readonly verified: boolean;
		public verificationLevel: number;
		public readonly voiceConnection: VoiceConnection;
		public acknowledge(): Promise<Guild>;
		public addMember(user: UserResolvable, options: AddGuildMemberOptions): Promise<GuildMember>;
		public allowDMs(allow: boolean): Promise<Guild>;
		public ban(user: UserResolvable, options?: BanOptions | number | string): Promise<GuildMember | User | string>;
		public createChannel(name: string, options?: ChannelData): Promise<CategoryChannel | TextChannel | VoiceChannel>;
		public createChannel(name: string, type?: 'category' | 'text' | 'voice' | 'news' | 'store', permissionOverwrites?: PermissionOverwrites[] | ChannelCreationOverwrites[], reason?: string): Promise<CategoryChannel | TextChannel | VoiceChannel>;
		public createEmoji(attachment: BufferResolvable | Base64Resolvable, name: string, roles?: Collection<Snowflake, Role> | Role[], reason?: string): Promise<Emoji>;
		public createRole(data?: RoleData, reason?: string): Promise<Role>;
		public delete(): Promise<Guild>;
		public deleteEmoji(emoji: Emoji | string, reason?: string): Promise<void>;
		public edit(data: GuildEditData, reason?: string): Promise<Guild>;
		public equals(guild: Guild): boolean;
		public fetchAuditLogs(options?: GuildAuditLogsFetchOptions): Promise<GuildAuditLogs>;
		public fetchBan(user: UserResolvable): Promise<BanInfo>;
		public fetchBans(withReasons?: false): Promise<Collection<Snowflake, User>>;
		public fetchBans(withReasons: true): Promise<Collection<Snowflake, BanInfo>>;
		public fetchBans(withReasons: boolean): Promise<Collection<Snowflake, BanInfo | User>>;
		public fetchEmbed(): Promise<GuildEmbedData>;
		public fetchInvites(): Promise<Collection<Snowflake, Invite>>;
		public fetchMember(user: UserResolvable, cache?: boolean): Promise<GuildMember>;
		public fetchMembers(query?: string, limit?: number): Promise<Guild>;
		public fetchVanityCode(): Promise<string>;
		public fetchVoiceRegions(): Promise<Collection<string, VoiceRegion>>;
		public fetchWebhooks(): Promise<Collection<Snowflake, Webhook>>;
		public leave(): Promise<Guild>;
		public member(user: UserResolvable): GuildMember;
		public pruneMembers(days: number, dry?: boolean, reason?: string): Promise<number>;
		public search(options?: MessageSearchOptions): Promise<MessageSearchResult>;
		public setAFKChannel(afkChannel: ChannelResolvable, reason?: string): Promise<Guild>;
		public setAFKTimeout(afkTimeout: number, reason?: string): Promise<Guild>;
		public setChannelPosition(channel: string | GuildChannel, position: number, relative?: boolean): Promise<Guild>;
		public setChannelPositions(channelPositions: ChannelPosition[]): Promise<Guild>;
		public setDefaultMessageNotifications(defaultMessageNotifications: DefaultMessageNotifications, reason: string): Promise<Guild>;
		public setEmbed(embed: GuildEmbedData, reason?: string): Promise<Guild>;
		public setExplicitContentFilter(explicitContentFilter: number, reason?: string): Promise<Guild>;
		public setIcon(icon: Base64Resolvable, reason?: string): Promise<Guild>;
		public setName(name: string, reason?: string): Promise<Guild>;
		public setOwner(owner: GuildMemberResolvable, reason?: string): Promise<Guild>;
		public setPosition(position: number, relative?: boolean): Promise<Guild>;
		public setRegion(region: string, reason?: string): Promise<Guild>;
		public setRolePosition(role: string | Role, position: number, relative?: boolean): Promise<Guild>;
		public setSplash(splash: Base64Resolvable, reason?: string): Promise<Guild>;
		public setSystemChannel(systemChannel: ChannelResolvable, reason?: string): Promise<Guild>;
		public setVerificationLevel(verificationLevel: number, reason?: string): Promise<Guild>;
		public sync(): void;
		public toString(): string;
		public unban(user: UserResolvable, reason?: string): Promise<User>;
	}

	export class GuildAuditLogs {
		constructor(guild: Guild, data: object);
		private webhooks: Collection<Snowflake, Webhook>;

		public entries: Collection<Snowflake, GuildAuditLogsEntry>;

		public static Actions: GuildAuditLogsActions;
		public static Targets: GuildAuditLogsTargets;
		public static Entry: typeof GuildAuditLogsEntry;
		public static actionType(action: number): GuildAuditLogsActionType;
		public static build(...args: any[]): Promise<GuildAuditLogs>;
		public static targetType(target: number): GuildAuditLogsTarget;
	}

	class GuildAuditLogsEntry {
		constructor(logs: GuildAuditLogs, guild: Guild, data: object);
		public action: GuildAuditLogsAction;
		public actionType: GuildAuditLogsActionType;
		public changes: AuditLogChange[];
		public readonly createdAt: Date;
		public readonly createdTimestamp: number;
		public executor: User;
		public extra: object | Role | GuildMember;
		public id: Snowflake;
		public reason: string;
		public target: Guild | User | Role | Emoji | Invite | Webhook;
		public targetType: GuildAuditLogsTarget;
	}

	export class GuildChannel extends Channel {
		constructor(guild: Guild, data: object);
		public readonly calculatedPosition: number;
		public readonly deletable: boolean;
		public guild: Guild;
		public readonly manageable: boolean;
		public readonly messageNotifications: GuildChannelMessageNotifications;
		public readonly muted: boolean;
		public name: string;
		public readonly parent: CategoryChannel;
		public parentID: Snowflake;
		public permissionOverwrites: Collection<Snowflake, PermissionOverwrites>;
		public position: number;
		public clone(name?: string, withPermissions?: boolean, withTopic?: boolean, reason?: string): Promise<GuildChannel>;
		public createInvite(options?: InviteOptions, reason?: string): Promise<Invite>;
		public delete(reason?: string): Promise<GuildChannel>;
		public edit(data: ChannelData, reason?: string): Promise<GuildChannel>;
		public equals(channel: GuildChannel): boolean;
		public fetchInvites(): Promise<Collection<string, Invite>>;
		public lockPermissions(): Promise<GuildChannel>;
		public memberPermissions(member: GuildMemberResolvable): Permissions | null;
		public overwritePermissions(userOrRole: RoleResolvable | UserResolvable, options: PermissionOverwriteOptions, reason?: string): Promise<void>;
		public permissionsFor(memberOrRole: GuildMemberResolvable | RoleResolvable): Permissions | null;
		public replacePermissionOverwrites(options?: { overwrites?: (PermissionOverwrites | ChannelCreationOverwrites)[] | Collection<Snowflake, ChannelCreationOverwrites>, reason?: string }): Promise<GuildChannel>;
		public rolePermissions(role: RoleResolvable): Permissions;
		public setName(name: string, reason?: string): Promise<GuildChannel>;
		public setParent(parent: ChannelResolvable, reason?: string): Promise<GuildChannel>;
		public setPosition(position: number, relative?: boolean): Promise<GuildChannel>;
		public setTopic(topic: string, reason?: string): Promise<GuildChannel>;
		public toString(): string;
	}

	export class GuildMember extends PartialTextBasedChannel() {
		constructor(guild: Guild, data: object);
		public readonly bannable: boolean;
		public readonly client: Client;
		public readonly colorRole: Role;
		public readonly deaf: boolean;
		public readonly displayColor: number;
		public readonly displayHexColor: string;
		public readonly displayName: string;
		public guild: Guild;
		public readonly highestRole: Role;
		public readonly hoistRole: Role;
		public readonly id: Snowflake;
		public readonly joinedAt: Date;
		public joinedTimestamp: number;
		public readonly kickable: boolean;
		public lastMessageID: string;
		public readonly mute: boolean;
		public nickname: string;
		public readonly manageable: boolean;
		public readonly permissions: Permissions;
		public readonly presence: Presence;
		public readonly roles: Collection<Snowflake, Role>;
		public selfDeaf: boolean;
		public selfMute: boolean;
		public serverDeaf: boolean;
		public serverMute: boolean;
		public speaking: boolean;
		public user: User;
		public readonly voiceChannel: VoiceChannel;
		public voiceChannelID: string;
		public voiceSessionID: string;
		public addRole(role: Role | Snowflake, reason?: string): Promise<GuildMember>;
		public addRoles(roles: Collection<Snowflake, Role> | Role[] | Snowflake[], reason?: string): Promise<GuildMember>;
		public ban(options?: BanOptions | number | string): Promise<GuildMember>;
		public createDM(): Promise<DMChannel>;
		public deleteDM(): Promise<DMChannel>;
		public edit(data: GuildMemberEditData, reason?: string): Promise<GuildMember>;
		public hasPermission(permission: PermissionResolvable, explicit?: boolean, checkAdmin?: boolean, checkOwner?: boolean): boolean;
		public hasPermissions(permission: PermissionResolvable, explicit?: boolean): boolean;
		public kick(reason?: string): Promise<GuildMember>;
		public missingPermissions(permissions: PermissionResolvable, explicit?: boolean): PermissionResolvable;
		public permissionsIn(channel: ChannelResolvable): Permissions;
		public removeRole(role: Role | Snowflake, reason?: string): Promise<GuildMember>;
		public removeRoles(roles: Collection<Snowflake, Role> | Role[] | Snowflake[], reason?: string): Promise<GuildMember>;
		public setDeaf(deaf: boolean, reason?: string): Promise<GuildMember>;
		public setMute(mute: boolean, reason?: string): Promise<GuildMember>;
		public setNickname(nickname: string, reason?: string): Promise<GuildMember>;
		public setRoles(roles: Collection<Snowflake, Role> | Role[] | Snowflake[], reason?: string): Promise<GuildMember>;
		public setVoiceChannel(voiceChannel: ChannelResolvable | null): Promise<GuildMember>;
		public toString(): string;
	}

	export class Invite {
		constructor(client: Client, data: object);
		public channel: GuildChannel | PartialGuildChannel;
		public readonly client: Client;
		public code: string;
		public readonly createdAt: Date;
		public createdTimestamp: number;
		public readonly expiresAt: Date;
		public readonly expiresTimestamp: number;
		public guild: Guild | PartialGuild;
		public inviter: User;
		public maxAge: number;
		public maxUses: number;
		public memberCount: number;
		public presenceCount: number;
		public temporary: boolean;
		public textChannelCount: number;
		public readonly url: string;
		public uses: number;
		public voiceChannelCount: number;
		public delete(reason?: string): Promise<Invite>;
		public toString(): string;
	}

	export class Message {
		constructor(channel: TextChannel | DMChannel | GroupDMChannel, data: object, client: Client);
		private _edits: Message[];
		private patch(data: object): void;

		public attachments: Collection<Snowflake, MessageAttachment>;
		public author: User;
		public channel: TextChannel | DMChannel | GroupDMChannel;
		public readonly cleanContent: string;
		public readonly client: Client;
		public content: string;
		public readonly createdAt: Date;
		public createdTimestamp: number;
		public readonly deletable: boolean;
		public readonly editable: boolean;
		public readonly editedAt: Date;
		public editedTimestamp: number;
		public readonly edits: Message[];
		public embeds: MessageEmbed[];
		public readonly guild: Guild;
		public hit: boolean;
		public id: Snowflake;
		public member: GuildMember;
		public mentions: MessageMentions;
		public nonce: string;
		public readonly pinnable: boolean;
		public pinned: boolean;
		public reactions: Collection<Snowflake, MessageReaction>;
		public system: boolean;
		public tts: boolean;
		public type: string;
		public readonly url: string;
		public webhookID: Snowflake;
		public acknowledge(): Promise<Message>;
		public awaitReactions(filter: CollectorFilter, options?: AwaitReactionsOptions): Promise<Collection<Snowflake, MessageReaction>>;
		public clearReactions(): Promise<Message>;
		public createReactionCollector(filter: CollectorFilter, options?: ReactionCollectorOptions): ReactionCollector;
		public delete(timeout?: number): Promise<Message>;
		public edit(content: StringResolvable, options?: MessageEditOptions | RichEmbed): Promise<Message>;
		public editCode(lang: string, content: StringResolvable): Promise<Message>;
		public equals(message: Message, rawData: object): boolean;
		public fetchWebhook(): Promise<Webhook>;
		public isMemberMentioned(member: GuildMember | User): boolean;
		public isMentioned(data: GuildChannel | User | Role | Snowflake): boolean;
		public pin(): Promise<Message>;
		public react(emoji: string | Emoji | ReactionEmoji): Promise<MessageReaction>;
		public reply(content?: StringResolvable, options?: MessageOptions): Promise<Message | Message[]>;
		public reply(options?: MessageOptions): Promise<Message | Message[]>;
		public toString(): string;
		public unpin(): Promise<Message>;
	}

	export class MessageAttachment {
		constructor(message: Message, data: object);
		public readonly client: Client;
		public filename: string;
		public filesize: number;
		public height: number;
		public id: Snowflake;
		public message: Message;
		public proxyURL: string;
		public url: string;
		public width: number;
	}

	export class MessageCollector extends Collector<Snowflake, Message> {
		constructor(channel: TextChannel | DMChannel | GroupDMChannel, filter: CollectorFilter, options?: MessageCollectorOptions);
		public channel: Channel;
		public options: MessageCollectorOptions;
		public received: number;

		public cleanup(): void;
		public handle(message: Message): CollectorHandler<Snowflake, Message>;
		public postCheck(): string;
	}

	export class MessageEmbed {
		constructor(message: Message, data: object);
		public author: MessageEmbedAuthor;
		public readonly client: Client;
		public color: number;
		public readonly createdAt: Date;
		public timestamp: number;
		public description: string;
		public fields: MessageEmbedField[];
		public footer: MessageEmbedFooter;
		public readonly hexColor: string;
		public image: MessageEmbedImage;
		public message: Message;
		public provider: MessageEmbedProvider;
		public thumbnail: MessageEmbedThumbnail;
		public title: string;
		public type: string;
		public url: string;
		public video: MessageEmbedVideo;
	}

	export class MessageEmbedAuthor {
		constructor(embed: MessageEmbed, data: object);
		public embed: MessageEmbed;
		public iconURL: string;
		public name: string;
		public url: string;
	}

	export class MessageEmbedField {
		constructor(embed: MessageEmbed, data: object);
		public embed: MessageEmbed;
		public inline: boolean;
		public name: string;
		public value: string;
	}

	export class MessageEmbedFooter {
		constructor(embed: MessageEmbed, data: object);
		public embed: MessageEmbed;
		public iconURL: string;
		public proxyIconURL: string;
		public text: string;
	}

	export class MessageEmbedImage {
		constructor(embed: MessageEmbed, data: object);
		public embed: MessageEmbed;
		public height: number;
		public proxyURL: string;
		public url: string;
		public width: number;
	}

	export class MessageEmbedProvider {
		constructor(embed: MessageEmbed, data: object);
		public embed: MessageEmbed;
		public name: string;
		public url: string;
	}

	export class MessageEmbedThumbnail {
		constructor(embed: MessageEmbed, data: object);
		public embed: MessageEmbed;
		public height: number;
		public proxyURL: string;
		public url: string;
		public width: number;
	}

	export class MessageEmbedVideo {
		constructor(embed: MessageEmbed, data: object);
		public embed: MessageEmbed;
		public height: number;
		public url: string;
		public width: number;
	}

	export class MessageMentions {
		private _channels: Collection<Snowflake, GuildChannel>;
		private _client: Client;
		private _content: Message;
		private _guild: Guild;
		private _members: Collection<Snowflake, GuildMember>;

		public readonly channels: Collection<Snowflake, TextChannel>;
		public everyone: boolean;
		public readonly members: Collection<Snowflake, GuildMember>;
		public roles: Collection<Snowflake, Role>;
		public users: Collection<Snowflake, User>;

		public static CHANNELS_PATTERN: RegExp;
		public static EVERYONE_PATTERN: RegExp;
		public static ROLES_PATTERN: RegExp;
		public static USERS_PATTERN: RegExp;
	}

	export class MessageReaction {
		constructor(message: Message, emoji: object, count: number, me: boolean);
		public count: number;
		public readonly emoji: Emoji | ReactionEmoji;
		public me: boolean;
		public message: Message;
		public users: Collection<string, User>;
		public fetchUsers(limit?: number, options?: { after?: number; before?: number }): Promise<Collection<Snowflake, User>>;
		public remove(user?: UserResolvable): Promise<MessageReaction>;
	}

	export class NewsChannel extends TextChannel {
		constructor(guild: Guild, data: object);
		public rateLimitPerUser: 0;
	}

	export class OAuth2Application {
		constructor(client: Client, data: object);
		public bot: object;
		public botPublic: boolean;
		public botRequireCodeGrant: boolean;
		public readonly client: Client;
		public readonly createdAt: Date;
		public readonly createdTimestamp: number;
		public description: string;
		public flags: number;
		public icon: string;
		public iconURL: string;
		public id: Snowflake;
		public name: string;
		public owner: User;
		public redirectURIs: string[];
		public rpcApplicationState: boolean;
		public rpcOrigins: string[];
		public secret: string;
		public reset(): OAuth2Application;
		public toString(): string;
	}

	export class PartialGuild {
		constructor(client: Client, data: object);
		public readonly client: Client;
		public icon: string;
		public id: Snowflake;
		public name: string;
		public splash: string;
	}

	export class PartialGuildChannel {
		constructor(client: Client, data: object);
		public readonly client: Client;
		public id: Snowflake;
		public name: string;
		public type: string;
	}

	export class PermissionOverwrites {
		constructor(guildChannel: GuildChannel, data: object);
		public allow: number;
		public allowed: Permissions;
		public channel: GuildChannel;
		public denied: Permissions;
		public deny: number;
		public id: Snowflake;
		public type: string;
		public delete(reason?: string): Promise<PermissionOverwrites>;
	}

	export class Permissions {
		constructor(permissions: PermissionResolvable);
		constructor(member: GuildMember, permissions: PermissionResolvable);
		private readonly raw: number;

		public bitfield: number;
		public member: GuildMember;
		public add(...permissions: PermissionResolvable[]): this;
		public freeze(): this;
		public has(permission: PermissionResolvable, checkAdmin?: boolean): boolean;
		public hasPermission(permission: PermissionResolvable, explicit?: boolean): boolean;
		public hasPermissions(permissions: PermissionResolvable, explicit?: boolean): boolean;
		public missing(permissions: PermissionResolvable, checkAdmin?: boolean): PermissionResolvable;
		public missingPermissions(permissions: PermissionResolvable, checkAdmin?: boolean): PermissionResolvable;
		public remove(...permissions: PermissionResolvable[]): this;
		public serialize(checkAdmin?: boolean): PermissionObject;
		public toArray(checkAdmin?: boolean): PermissionString[];
		public valueOf(): number;

		public static ALL: number;
		public static DEFAULT: number;
		public static FLAGS: PermissionFlags;
		public static resolve(permission: PermissionResolvable): number;
	}

	export class Presence {
		constructor(data: object, client: Client);
		public readonly client: Client;
		public game: Game;
		public status: PresenceStatusData;
		public clientStatus: ClientPresenceStatusData;
		public equals(presence: Presence): boolean;
	}

	export class ReactionCollector extends Collector<Snowflake, MessageReaction> {
		constructor(message: Message, filter: CollectorFilter, options?: ReactionCollectorOptions);
		public message: Message;
		public options: ReactionCollectorOptions;
		public total: number;
		public users: Collection<Snowflake, User>;

		public cleanup(): void;
		public handle(reaction: MessageReaction): CollectorHandler<Snowflake, MessageReaction>;
		public postCheck(reaction: MessageReaction, user: User): string;
	}

	export class ReactionEmoji {
		constructor(reaction: MessageReaction, name: string, id: string);
		public id: Snowflake;
		public readonly identifier: string;
		public name: string;
		public reaction: MessageReaction;
		public toString(): string;
	}

	class RequestHandler {
		constructor(restManager: object);
		public readonly globalLimit: boolean;
		public queue: object[];
		public restManager: object;
		public handle(): void;
		public push(request: object): void;
	}

	export class RichEmbed {
		constructor(data?: RichEmbedOptions | MessageEmbed);
		private _apiTransform(): object;

		public author?: { name: string; url?: string; icon_url?: string; };
		public color?: number;
		public description?: string;
		public fields?: { name: string; value: string; inline?: boolean; }[];
		public file?: Attachment | string | FileOptions;
		public files?: Array<Attachment | string | FileOptions>;
		public footer?: { text?: string; icon_url?: string; };
		public image?: { url: string; proxy_url?: string; height?: number; width?: number; };
		public readonly length: number;
		public thumbnail?: { url: string; height?: number; width?: number; };
		public timestamp?: Date;
		public title?: string;
		public url?: string;
		public addBlankField(inline?: boolean): this;
		public addField(name: StringResolvable, value: StringResolvable, inline?: boolean): this;
		public attachFile(file: Attachment | FileOptions | string): this;
		public attachFiles(file: Array<Attachment | FileOptions | string>): this;
		public setAuthor(name: StringResolvable, icon?: string, url?: string): this;
		public setColor(color: ColorResolvable): this;
		public setDescription(description: StringResolvable): this;
		public setFooter(text: StringResolvable, icon?: string): this;
		public setImage(url: string): this;
		public setThumbnail(url: string): this;
		public setTimestamp(timestamp?: Date | number): this;
		public setTitle(title: StringResolvable): this;
		public setURL(url: string): this;
	}

	export class RichPresenceAssets {
		constructor(game: Game, assets: object);
		public largeImage: Snowflake;
		public largeText: string;
		public smallImage: Snowflake;
		public smallText: string;
		public readonly smallImageURL: string;
		public readonly largeImageURL: string;
	}

	export class Role {
		constructor(guild: Guild, data: object);
		public readonly calculatedPosition: number;
		public readonly client: Client;
		public color: number;
		public readonly createdAt: Date;
		public readonly createdTimestamp: number;
		public readonly editable: boolean;
		public guild: Guild;
		public readonly hexColor: string;
		public hoist: boolean;
		public id: Snowflake;
		public managed: boolean;
		public readonly members: Collection<Snowflake, GuildMember>;
		public mentionable: boolean;
		public name: string;
		public permissions: number;
		public position: number;
		public comparePositionTo(role: Role): number;
		public delete(reason?: string): Promise<Role>;
		public edit(data: RoleData, reason?: string): Promise<Role>;
		public equals(role: Role): boolean;
		public hasPermission(permission: PermissionResolvable, explicit?: boolean, checkAdmin?: boolean): boolean;
		public hasPermissions(permissions: PermissionResolvable, explicit?: boolean): boolean;
		public serialize(): PermissionObject;
		public setColor(color: string | number, reason?: string): Promise<Role>;
		public setHoist(hoist: boolean, reason?: string): Promise<Role>;
		public setMentionable(mentionable: boolean, reason?: string): Promise<Role>;
		public setName(name: string, reason?: string): Promise<Role>;
		public setPermissions(permissions: PermissionResolvable, reason?: string): Promise<Role>;
		public setPosition(position: number, relative?: boolean): Promise<Role>;
		public toString(): string;

		public static comparePositions(role1: Role, role2: Role): number;
	}

	class SecretKey {
		constructor(key: Uint8Array);
		public key: Uint8Array;
	}

	class SequentialRequestHandler extends RequestHandler {
		constructor(restManager: object, endpoint: string);
		public busy: boolean;
		public endpoint: string;
		public readonly globalLimit: boolean;
		public queue: object[];
		public restManager: object;
		public timeDifference: number;
		public execute(item: object): Promise<object | Error>;
		public handle(): void;
		public push(request: object): void;
	}

	export class Shard extends EventEmitter {
		constructor(manager: ShardingManager, id: number, args?: string[]);
		private _exitListener: Function;
		private _handleExit(respawn?: boolean): void;
		private _handleMessage(message: any): void;

		public env: object;
		public id: string;
		public manager: ShardingManager;
		public process: ChildProcess;
		public readonly: boolean;
		public eval(script: string): Promise<any>;
		public fetchClientValue(prop: string): Promise<any>;
		public kill(): void;
		public respawn(delay?: number): Promise<ChildProcess>;
		public spawn(args?: string[], execArgv?: string[]): Promise<ChildProcess>;
		public send(message: any): Promise<Shard>;

		public on(event: 'death', listener: () => void): this;
		public on(event: 'disconnect', listener: () => void): this;
		public on(event: 'message', listener: (message: any) => void): this;
		public on(event: 'ready', listener: () => void): this;
		public on(event: 'reconnecting', listener: () => void): this;
		public on(event: string, listener: Function): this;

		public once(event: 'death', listener: () => void): this;
		public once(event: 'disconnect', listener: () => void): this;
		public once(event: 'message', listener: (message: any) => void): this;
		public once(event: 'ready', listener: () => void): this;
		public once(event: 'reconnecting', listener: () => void): this;
		public once(event: string, listener: Function): this;
	}

	export class ShardClientUtil {
		constructor(client: Client);
		private _handleMessage(message: any): void;
		private _respond(type: string, message: any): void;

		public readonly count: number;
		public readonly id: number;
		public broadcastEval(script: string): Promise<any[]>;
		public fetchClientValues(prop: string): Promise<any[]>;
		public send(message: any): Promise<void>;

		public static singleton(client: Client): ShardClientUtil;
	}

	export class ShardingManager extends EventEmitter {
		constructor(file: string, options?: {
			totalShards?: number | 'auto';
			respawn?: boolean;
			shardArgs?: string[];
			token?: string;
		});
		private _spawn(amount: number, delay: number): Promise<Collection<number, Shard>>;

		public execArgv: string[];
		public file: string;
		public respawn: boolean;
		public shardArgs: string[];
		public shards: Collection<number, Shard>;
		public token: string;
		public totalShards: number | string;
		public broadcast(message: any): Promise<Shard[]>;
		public broadcastEval(script: string): Promise<any[]>;
		public createShard(id: number): Promise<Shard>;
		public fetchClientValues(prop: string): Promise<any[]>;
		public respawnAll(shardDelay?: number, respawnDelay?: number, waitForReady?: true, currentShardIndex?: number): Promise<Collection<number, Shard>>;
		public spawn(amount?: number, delay?: number): Promise<Collection<number, Shard>>;

		public on(event: 'launch', listener: (shard: Shard) => void): this;
		public on(event: 'message', listener: (shard: Shard, message: any) => void): this;
		public on(event: string, listener: Function): this;

		public once(event: 'launch', listener: (shard: Shard) => void): this;
		public once(event: 'message', listener: (shard: Shard, message: any) => void): this;
		public once(event: string, listener: Function): this;
	}

	export class SnowflakeUtil {
		public static deconstruct(snowflake: Snowflake): DeconstructedSnowflake;
		public static generate(timestamp?: number | Date): Snowflake;
	}

	export class StoreChannel extends GuildChannel {
		constructor(guild: Guild, data: object);
		public nsfw: boolean;
	}

	export class StreamDispatcher extends VolumeInterface {
		constructor(player: AudioPlayer, stream: NodeJS.ReadableStream, streamOptions: StreamOptions);
		public destroyed: boolean;
		public readonly passes: number;
		public paused: boolean;
		public player: AudioPlayer;
		public stream: ReadableStream | VoiceBroadcast;
		public readonly time: number;
		public readonly totalStreamTime: number;
		public end(reason?: string): void;
		public pause(): void;
		public resume(): void;
		public setBitrate(bitrate: number | 'auto'): void;
	}

	export class TextChannel extends TextBasedChannel(GuildChannel) {
		constructor(guild: Guild, data: object);
		public lastMessageID: string;
		public readonly members: Collection<Snowflake, GuildMember>;
		public messages: Collection<Snowflake, Message>;
		public nsfw: boolean;
		public topic: string;
		public setRateLimitPerUser(rateLimitPerUser: number, reason?: string): Promise<TextChannel>;
		public createWebhook(name: string, avatar: BufferResolvable, reason?: string): Promise<Webhook>;
		public fetchWebhooks(): Promise<Collection<Snowflake, Webhook>>;
		public setNSFW(nsfw: boolean, reason: string): Promise<this>;
	}

	export class User extends PartialTextBasedChannel() {
		constructor(client: Client, data: object);
		public avatar: string;
		public readonly avatarURL: string;
		public bot: boolean;
		public readonly client: Client;
		public readonly createdAt: Date;
		public readonly createdTimestamp: number;
		public readonly defaultAvatarURL: string;
		public discriminator: string;
		public readonly displayAvatarURL: string;
		public readonly dmChannel: DMChannel;
		public id: Snowflake;
		public lastMessageID: string;
		public readonly note: string;
		public readonly presence: Presence;
		public readonly tag: string;
		public username: string;
		public addFriend(): Promise<User>;
		public block(): Promise<User>;
		public createDM(): Promise<DMChannel>;
		public deleteDM(): Promise<DMChannel>;
		public equals(user: User): boolean;
		public fetchProfile(): Promise<UserProfile>;
		public removeFriend(): Promise<User>;
		public setNote(note: string): Promise<User>;
		public toString(): string;
		public typingDurationIn(channel: ChannelResolvable): number;
		public typingIn(channel: ChannelResolvable): boolean;
		public typingSinceIn(channel: ChannelResolvable): Date;
		public unblock(): Promise<User>;
	}

	export class UserConnection {
		constructor(user: User, data: object);
		public id: string;
		public integrations: object[];
		public name: string;
		public revoked: boolean;
		public type: string;
		public user: User;
	}

	export class UserProfile {
		constructor(user: User, data: object);
		public readonly client: Client;
		public connections: Collection<string, UserConnection>;
		public mutualGuilds: Collection<Snowflake, Guild>;
		public premium: boolean;
		public premiumSince: Date;
		public user: User;
	}

	export class Util {
		public static arraysEqual(a: any[], b: any[]): boolean;
		public static cloneObject(obj: object): object;
		public static convertToBuffer(ab: ArrayBuffer | string): Buffer;
		public static delayFor(ms: number): Promise<void>;
		public static escapeMarkdown(text: string, onlyCodeBlock?: boolean, onlyInlineCode?: boolean): string;
		public static fetchRecommendedShards(token: string, guildsPerShard?: number): Promise<number>;
		public static makeError(obj: { name: string, message: string, stack: string }): Error;
		public static makePlainError(err: Error): object;
		public static mergeDefault(def: object, given: object): object;
		public static moveElementInArray(array: any[], element: any, newIndex: number, offset?: boolean): number;
		public static parseEmoji(text: string): { animated: boolean; name: string; id: string; };
		public static splitMessage(text: string, options?: SplitOptions): string | string[];
		public static str2ab(str: string): ArrayBuffer;
	}

	export class VoiceBroadcast extends EventEmitter {
		constructor(client: Client);
		public readonly client: Client;
		public currentTranscoder: object;
		public readonly dispatchers: StreamDispatcher[];
		public prism: object;
		public destroy(): void;
		public end(): void;
		public pause(): void;
		public playArbitraryInput(input: string, options?: StreamOptions): VoiceBroadcast;
		public playConvertedStream(stream: ReadableStream, options?: StreamOptions): VoiceBroadcast;
		public playFile(file: string, options?: StreamOptions): StreamDispatcher;
		public playOpusStream(stream: ReadableStream, options?: StreamOptions): StreamDispatcher;
		public playStream(stream: ReadableStream, options?: StreamOptions): VoiceBroadcast;
		public resume(): void;

		public on(event: string, listener: Function): this;
		public on(event: 'end', listener: () => void): this;
		public on(event: 'error', listener: (error: Error) => void): this;
		public on(event: 'subscribe', listener: (dispatcher: StreamDispatcher) => void): this;
		public on(event: 'unsubscribe', listener: (dispatcher: StreamDispatcher) => void): this;
		public on(event: 'warn', listener: (warning: string | Error) => void): this;
		public on(event: string, listener: Function): this;

		public once(event: 'end', listener: () => void): this;
		public once(event: 'error', listener: (error: Error) => void): this;
		public once(event: 'subscribe', listener: (dispatcher: StreamDispatcher) => void): this;
		public once(event: 'unsubscribe', listener: (dispatcher: StreamDispatcher) => void): this;
		public once(event: 'warn', listener: (warning: string | Error) => void): this;
		public once(event: string, listener: Function): this;
	}

	export class VoiceChannel extends GuildChannel {
		constructor(guild: Guild, data: object);
		public bitrate: number;
		public readonly connection: VoiceConnection;
		public readonly full: boolean;
		public readonly joinable: boolean;
		public members: Collection<Snowflake, GuildMember>;
		public readonly speakable: boolean;
		public userLimit: number;
		public join(): Promise<VoiceConnection>;
		public leave(): void;
		public setBitrate(bitrate: number, reason?: string): Promise<VoiceChannel>;
		public setUserLimit(userLimit: number, reason?: string): Promise<VoiceChannel>;
	}

	export class VoiceConnection extends EventEmitter {
		constructor(voiceManager: ClientVoiceManager, channel: VoiceChannel);
		private authentication: object;
		private sockets: object;
		private ssrcMap: Map<number, boolean>;
		private authenticate(): void;
		private authenticateFailed(reason: string): void;
		private checkAuthenticated(): void;
		private cleanup(): void;
		private connect(): void;
		private onReady(data: object): void;
		private onSessionDescription(mode: string, secret: string): void;
		private onSpeaking(data: object): void;
		private reconnect(token: string, endpoint: string): void;
		private setSpeaking(value: boolean): void;
		private updateChannel(channel: VoiceChannel): void;

		public channel: VoiceChannel;
		public readonly client: Client;
		public readonly dispatcher: StreamDispatcher;
		public player: AudioPlayer;
		public prism: object;
		public receivers: VoiceReceiver[];
		public speaking: boolean;
		public status: number;
		public voiceManager: ClientVoiceManager;
		public createReceiver(): VoiceReceiver;
		public disconnect(): void;
		public playArbitraryInput(input: string, options?: StreamOptions): StreamDispatcher;
		public playBroadcast(broadcast: VoiceBroadcast, options?: StreamOptions): StreamDispatcher;
		public playConvertedStream(stream: ReadableStream, options?: StreamOptions): StreamDispatcher;
		public playFile(file: string, options?: StreamOptions): StreamDispatcher;
		public playOpusStream(steam: ReadableStream, options?: StreamOptions): StreamDispatcher;
		public playStream(stream: ReadableStream, options?: StreamOptions): StreamDispatcher;
		public sendVoiceStateUpdate(options: object): void;
		public setSessionID(sessionID: string): void;
		public setTokenAndEndpoint(token: string, endpoint: string): void;

		public on(event: 'authenticated', listener: () => void): this;
		public on(event: 'debug', listener: (message: string) => void): this;
		public on(event: 'disconnect', listener: (error: Error) => void): this;
		public on(event: 'error', listener: (error: Error) => void): this;
		public on(event: 'failed', listener: (error: Error) => void): this;
		public on(event: 'newSession', listener: () => void): this;
		public on(event: 'ready', listener: () => void): this;
		public on(event: 'reconnecting', listener: () => void): this;
		public on(event: 'speaking', listener: (user: User, speaking: boolean) => void): this;
		public on(event: 'warn', listener: (warning: string | Error) => void): this;
		public on(event: string, listener: Function): this;

		public once(event: 'authenticated', listener: () => void): this;
		public once(event: 'debug', listener: (message: string) => void): this;
		public once(event: 'disconnect', listener: (error: Error) => void): this;
		public once(event: 'error', listener: (error: Error) => void): this;
		public once(event: 'failed', listener: (error: Error) => void): this;
		public once(event: 'newSession', listener: () => void): this;
		public once(event: 'ready', listener: () => void): this;
		public once(event: 'reconnecting', listener: () => void): this;
		public once(event: 'speaking', listener: (user: User, speaking: boolean) => void): this;
		public once(event: 'warn', listener: (warning: string | Error) => void): this;
		public once(event: string, listener: Function): this;
	}

	class VoiceConnectionUDPClient extends EventEmitter {
		constructor(voiceConnection: VoiceConnection);
		public discordAddress: string;
		public readonly discordPort: number;
		public localAddress: string;
		public localPort: string;
		public socket: any;
		public voiceConnection: VoiceConnection;
		public findEndpointAddress(): Promise<string>;
		public send(packet: object): Promise<object>;
	}

	export class VoiceReceiver extends EventEmitter {
		constructor(connection: VoiceConnection);
		private stoppedSpeaking(user: User): void;

		public destroyed: boolean;
		public voiceConnection: VoiceConnection;
		public createOpusStream(user: UserResolvable): ReadableStream;
		public createPCMStream(user: UserResolvable): ReadableStream;
		public destroy(): void;
		public recreate(): void;

		public on(event: 'opus', listener: (user: User, buffer: Buffer) => void): this;
		public on(event: 'pcm', listener: (user: User, buffer: Buffer) => void): this;
		public on(event: 'warn', listener: (reason: string, message: string) => void): this;
		public on(event: string, listener: Function): this;

		public once(event: 'opus', listener: (user: User, buffer: Buffer) => void): this;
		public once(event: 'pcm', listener: (user: User, buffer: Buffer) => void): this;
		public once(event: 'warn', listener: (reason: string, message: string) => void): this;
		public once(event: string, listener: Function): this;
	}

	export class VoiceRegion {
		constructor(data: object);
		public custom: boolean;
		public deprecated: boolean;
		public id: string;
		public name: string;
		public optimal: boolean;
		public sampleHostname: string;
		public vip: boolean;
	}

	class VoiceWebsocket extends EventEmitter {
		constructor(voiceConnection: VoiceConnection);
		public attempts: number;
		public readonly client: Client;
		public voiceConnection: VoiceConnection;
		public ws: any;
		public clearHeartbeat(): void;
		public connect(): void;
		public onClose(): void;
		public onError(error: Error): void;
		public onMessage(event: any): void;
		public onOpen(): void;
		public onPacket(packet: object): void;
		public reset(): void;
		public send(data: string): Promise<string>;
		public sendHeartbeat(): void;
		public sendPacket(packet: object): Promise<string>;
		public setHeartbeat(interval: number): void;

		public on(event: 'ready', listener: (packet: object) => void): this;
		public on(event: 'sessionDescription', listener: (encryptionMode: string, secretKey: SecretKey) => void): this;
		public on(event: 'speaking', listener: (data: object) => void): this;
		public on(event: 'unknownPacket', listener: (packet: object) => void): this;
		public on(event: 'warn', listener: (warn: string) => void): this;
		public on(event: string, listener: Function): this;

		public once(event: 'ready', listener: (packet: object) => void): this;
		public once(event: 'sessionDescription', listener: (encryptionMode: string, secretKey: SecretKey) => void): this;
		public once(event: 'speaking', listener: (data: object) => void): this;
		public once(event: 'unknownPacket', listener: (packet: object) => void): this;
		public once(event: 'warn', listener: (warn: string) => void): this;
		public once(event: string, listener: Function): this;
	}

	export class VolumeInterface extends EventEmitter {
		constructor(object?: { volume: number })
		public readonly volume: number;
		public readonly volumeDecibels: number;
		public readonly volumeLogarithmic: number;
		public setVolume(volume: number): void;
		public setVolumeDecibels(db: number): void;
		public setVolumeLogarithmic(value: number): void;

		public on(event: 'debug', listener: (information: string) => void): this;
		public on(event: 'end', listener: (reason: string) => void): this;
		public on(event: 'error', listener: (err: Error) => void): this;
		public on(event: 'speaking', listener: (value: boolean) => void): this;
		public on(event: 'start', listener: () => void): this;
		public on(event: 'volumeChange', listener: (oldVolume: number, newVolume: number) => void): this;
		public on(event: string, listener: Function): this;

		public once(event: 'debug', listener: (information: string) => void): this;
		public once(event: 'end', listener: (reason: string) => void): this;
		public once(event: 'error', listener: (err: Error) => void): this;
		public once(event: 'speaking', listener: (value: boolean) => void): this;
		public once(event: 'start', listener: () => void): this;
		public once(event: 'volumeChange', listener: (oldVolume: number, newVolume: number) => void): this;
		public once(event: string, listener: Function): this;
	}

	export class Webhook {
		constructor(client: Client, dataOrID: object | string, token: string);
		public avatar: string;
		public channelID: string;
		public readonly client: Client;
		public guildID: string;
		public id: Snowflake;
		public name: string;
		public owner: User | object;
		public token: string;
		public delete(reason?: string): Promise<void>;
		public edit(name: string, avatar: BufferResolvable): Promise<Webhook>;
		public send(content?: StringResolvable, options?: WebhookMessageOptions | RichEmbed | Attachment): Promise<Message | Message[]>;
		public send(options?: WebhookMessageOptions | RichEmbed | Attachment): Promise<Message | Message[]>;
		public sendCode(lang: string, content: StringResolvable, options?: WebhookMessageOptions): Promise<Message | Message[]>;
		public sendFile(attachment: BufferResolvable, name?: string, content?: StringResolvable, options?: WebhookMessageOptions): Promise<Message>;
		public sendMessage(content?: StringResolvable, options?: WebhookMessageOptions): Promise<Message | Message[]>;
		public sendMessage(options?: WebhookMessageOptions): Promise<Message | Message[]>;
		public sendSlackMessage(body: object): Promise<void>;
	}

	export class WebhookClient extends Webhook {
		constructor(id: string, token: string, options?: ClientOptions);
		private _intervals: Set<NodeJS.Timer>;
		private _timeouts: Set<NodeJS.Timer>;
		private resolver: ClientDataResolver;
		private rest: object;

		public options: ClientOptions;
		public clearInterval(interval: NodeJS.Timer): void;
		public clearTimeout(timeout: NodeJS.Timer): void;
		public destroy(): void;
		public setInterval(fn: Function, delay: number, ...args: any[]): NodeJS.Timer;
		public setTimeout(fn: Function, delay: number, ...args: any[]): NodeJS.Timer;
	}

//#endregion

//#region Mixins

	// Model the TextBasedChannel mixin system, allowing application of these fields
	// to the classes that use these methods without having to manually add them
	// to each of those classes

	type Constructable<T> = new (...args: any[]) => T;
	const PartialTextBasedChannel: <T>(Base?: Constructable<T>) => Constructable<T & PartialTextBasedChannelFields>;
	const TextBasedChannel: <T>(Base?: Constructable<T>) => Constructable<T & TextBasedChannelFields>;

	type PartialTextBasedChannelFields = {
		lastMessage: Message;
		acknowledge(): Promise<DMChannel | GroupDMChannel | TextChannel>;
		send(content?: StringResolvable, options?: MessageOptions | RichEmbed | Attachment): Promise<Message | Message[]>;
		send(options?: MessageOptions | RichEmbed | Attachment): Promise<Message | Message[]>;
		sendCode(lang: string, content: StringResolvable, options?: MessageOptions): Promise<Message | Message[]>;
		sendEmbed(embed: RichEmbed | RichEmbedOptions, content?: string, options?: MessageOptions): Promise<Message>;
		sendEmbed(embed: RichEmbed | RichEmbedOptions, options?: MessageOptions): Promise<Message>;
		sendFile(attachment: BufferResolvable, name?: string, content?: StringResolvable, options?: MessageOptions): Promise<Message>;
		sendMessage(content?: string, options?: MessageOptions): Promise<Message | Message[]>;
		sendMessage(options?: MessageOptions): Promise<Message | Message[]>;
	};

	type TextBasedChannelFields = {
		lastPinTimestamp: number;
		readonly lastPinAt: Date;
		typing: boolean;
		typingCount: number;
		awaitMessages(filter: CollectorFilter, options?: AwaitMessagesOptions): Promise<Collection<string, Message>>;
		bulkDelete(messages: Collection<string, Message> | Message[] | Snowflake[] | number, filterOld?: boolean): Promise<Collection<string, Message>>;
		createCollector(filter: CollectorFilter, options?: MessageCollectorOptions): MessageCollector;
		createMessageCollector(filter: CollectorFilter, options?: MessageCollectorOptions): MessageCollector;
		fetchMessage(messageID: string): Promise<Message>;
		fetchMessages(options?: ChannelLogsQueryOptions): Promise<Collection<string, Message>>;
		fetchPinnedMessages(): Promise<Collection<string, Message>>;
		search(options?: MessageSearchOptions): Promise<MessageSearchResult>;
		startTyping(count?: number): void;
		stopTyping(force?: boolean): void;
	} & PartialTextBasedChannelFields;

//#endregion

//#region Typedefs

	type ActivityType = 'PLAYING'
		| 'STREAMING'
		| 'LISTENING'
		| 'WATCHING';

	type AddGuildMemberOptions = {
		accessToken: String;
		nick?: string;
		roles?: Collection<string, Role> | Role[] | string[];
		mute?: boolean;
		deaf?: boolean;
	};

	type AuditLogChange = {
		key: string;
		old?: any;
		new?: any;
	};

	type AwaitMessagesOptions = MessageCollectorOptions & { errors?: string[] };

	type AwaitReactionsOptions = ReactionCollectorOptions & { errors?: string[] };

	type BanInfo = {
		user: User;
		reason: string | null;
	};

	type BanOptions = {
		days?: number;
		reason?: string;
	};

	type Base64Resolvable = Buffer | Base64String;

	type Base64String = string;

	type BufferResolvable = Buffer | string;

	type ChannelCreationOverwrites = {
		allow?: PermissionResolvable;
		deny?: PermissionResolvable;
		allowed?: PermissionResolvable;
		denied?: PermissionResolvable;
		id: RoleResolvable | UserResolvable;
	};

	type ChannelData = {
		type?: 'category' | 'text' | 'voice' | 'news' | 'store';
		name?: string;
		position?: number;
		topic?: string;
		nsfw?: boolean;
		bitrate?: number;
		userLimit?: number;
		parent?: ChannelResolvable;
		permissionOverwrites?: PermissionOverwrites[] | ChannelCreationOverwrites[];
		rateLimitPerUser?: number;
	};

	type ChannelLogsQueryOptions = {
		limit?: number
		before?: Snowflake
		after?: Snowflake
		around?: Snowflake
	};

	type ChannelPosition = {
		channel: ChannelResolvable;
		position: number;
	};

	type ChannelResolvable = Channel | Guild | Message | Snowflake;

	type ClientOptions = {
		apiRequestMethod?: string;
		shardId?: number;
		shardCount?: number;
		messageCacheMaxSize?: number;
		messageCacheLifetime?: number;
		messageSweepInterval?: number;
		fetchAllMembers?: boolean;
		disableEveryone?: boolean;
		sync?: boolean;
		restWsBridgeTimeout?: number;
		restTimeOffset?: number;
		retryLimit?: number;
		disabledEvents?: WSEventType[];
		ws?: WebSocketOptions;
		http?: HTTPOptions;
	};

	type CollectorHandler<K, V> = { key: K, value: V };
	type CollectorFilter = (...args: any[]) => boolean;
	type CollectorOptions = { time?: number };

	type ColorResolvable = ('DEFAULT'
		| 'WHITE'
		| 'AQUA'
		| 'GREEN'
		| 'BLUE'
		| 'PURPLE'
		| 'LUMINOUS_VIVID_PINK'
		| 'GOLD'
		| 'ORANGE'
		| 'RED'
		| 'GREY'
		| 'DARKER_GREY'
		| 'NAVY'
		| 'DARK_AQUA'
		| 'DARK_GREEN'
		| 'DARK_BLUE'
		| 'DARK_PURPLE'
		| ' DARK_VIVID_PINK'
		| 'DARK_GOLD'
		| 'DARK_ORANGE'
		| 'DARK_RED'
		| 'DARK_GREY'
		| 'LIGHT_GREY'
		| 'DARK_NAVY'
		| 'RANDOM')
		| [number, number, number]
		| number
		| string;

	type DeconstructedSnowflake = {
		timestamp: number;
		date: Date;
		workerID: number;
		processID: number;
		increment: number;
		binary: string;
	};

	type DefaultMessageNotifications = 'ALL'
		| 'MENTIONS';

	type EmojiEditData = {
		name?: string;
		roles?: Collection<Snowflake, Role> | Role[] | Snowflake[];
	};

	type EmojiIdentifierResolvable = string | Emoji | ReactionEmoji;

	type FileOptions = {
		attachment: BufferResolvable;
		name?: string;
	};

	type GroupDMRecipientOptions = {
		user?: UserResolvable | Snowflake;
		accessToken?: string;
		nick?: string;
	};

	type GuildAuditLogsAction = keyof GuildAuditLogsActions;

	type GuildAuditLogsActions = {
		ALL?: null;
		GUILD_UPDATE?: number;
		CHANNEL_CREATE?: number;
		CHANNEL_UPDATE?: number;
		CHANNEL_DELETE?: number;
		CHANNEL_OVERWRITE_CREATE?: number;
		CHANNEL_OVERWRITE_UPDATE?: number;
		CHANNEL_OVERWRITE_DELETE?: number;
		MEMBER_KICK?: number;
		MEMBER_PRUNE?: number;
		MEMBER_BAN_ADD?: number;
		MEMBER_BAN_REMOVE?: number;
		MEMBER_UPDATE?: number;
		MEMBER_ROLE_UPDATE?: number;
		ROLE_CREATE?: number;
		ROLE_UPDATE?: number;
		ROLE_DELETE?: number;
		INVITE_CREATE?: number;
		INVITE_UPDATE?: number;
		INVITE_DELETE?: number;
		WEBHOOK_CREATE?: number;
		WEBHOOK_UPDATE?: number;
		WEBHOOK_DELETE?: number;
		EMOJI_CREATE?: number;
		EMOJI_UPDATE?: number;
		EMOJI_DELETE?: number;
		MESSAGE_DELETE?: number;
	};

	type GuildAuditLogsActionType = 'CREATE'
		| 'DELETE'
		| 'UPDATE'
		| 'ALL';

	type GuildAuditLogsFetchOptions = {
		before?: Snowflake | GuildAuditLogsEntry;
		after?: Snowflake | GuildAuditLogsEntry;
		limit?: number;
		user?: UserResolvable;
		type?: string | number;
	};

	type GuildAuditLogsTarget = keyof GuildAuditLogsTargets;

	type GuildAuditLogsTargets = {
		ALL?: string;
		GUILD?: string;
		CHANNEL?: string;
		USER?: string;
		ROLE?: string;
		INVITE?: string;
		WEBHOOK?: string;
		EMOJI?: string;
		MESSAGE?: string;
	};

	type GuildChannelMessageNotifications = MessageNotifications
		& 'INHERIT';

	type GuildEditData = {
		name?: string;
		region?: string;
		verificationLevel?: number;
		explicitContentFilter?: number;
		afkChannel?: ChannelResolvable;
		systemChannel?: ChannelResolvable;
		afkTimeout?: number;
		icon?: Base64Resolvable;
		owner?: GuildMemberResolvable;
		splash?: Base64Resolvable;
	};

	type GuildEmbedData = {
		enabled: boolean;
		channel: ChannelResolvable;
	};

	type GuildMemberEditData = {
		nick?: string;
		roles?: Collection<Snowflake, Role> | Role[] | Snowflake[];
		mute?: boolean;
		deaf?: boolean;
		channel?: ChannelResolvable | null;
	};

	type GuildMemberResolvable = GuildMember | User;

	type GuildResolvable = Guild | Snowflake;

	type HTTPOptions = {
		version?: number;
		host?: string;
		cdn?: string;
	};

	type InviteOptions = {
		temporary?: boolean;
		maxAge?: number;
		maxUses?: number;
		unique?: boolean;
	};

	type InviteResolvable = string;

	type MessageCollectorOptions = CollectorOptions & {
		max?: number;
		maxMatches?: number;
	};

	type MessageEditOptions = {
		embed?: RichEmbedOptions;
		code?: string | boolean;
	};

	type MessageNotifications = 'EVERYTHING'
		| 'MENTIONS'
		| 'NOTHING';

	type MessageOptions = {
		tts?: boolean;
		nonce?: string;
		embed?: RichEmbed | RichEmbedOptions,
		disableEveryone?: boolean;
		file?: FileOptions | string;
		files?: (FileOptions | BufferResolvable | Attachment)[];
		code?: string | boolean;
		split?: boolean | SplitOptions;
		reply?: UserResolvable;
	};

	type MessageSearchOptions = {
		content?: string;
		maxID?: Snowflake;
		minID?: Snowflake;
		has?: 'link'
		| 'embed'
		| 'file'
		| 'video'
		| 'image'
		| 'sound'
		| '-link'
		| '-embed'
		| '-file'
		| '-video'
		| '-image'
		| '-sound';
		channel?: ChannelResolvable;
		author?: UserResolvable;
		authorType?: 'user'
		| 'bot'
		| 'webhook'
		| '-user'
		| '-bot'
		| '-webhook';
		sortBy?: 'relevant' | 'recent';
		sortOrder?: 'asc' | 'desc';
		contextSize?: number;
		limit?: number;
		offset?: number;
		mentions?: UserResolvable;
		mentionsEveryone?: boolean;
		linkHostname?: string;
		embedProvider?: string;
		embedType?: 'image' | 'video' | 'url' | 'rich';
		attachmentFilename?: string;
		attachmentExtension?: string;
		before?: Date;
		after?: Date;
		during?: Date;
		nsfw?: boolean;
	};

	type MessageSearchResult = {
		totalResults: number;
		messages: Message[][];
	};

	type ActivityFlags = {
		INSTANCE?: number;
		JOIN?: number;
		SPECTATE?: number;
		JOIN_REQUEST?: number;
		SYNC?: number;
		PLAY?: number;
	};

	type PermissionFlags = {
		ADMINISTRATOR?: number;
		CREATE_INSTANT_INVITE?: number;
		KICK_MEMBERS?: number;
		BAN_MEMBERS?: number;
		MANAGE_CHANNELS?: number;
		MANAGE_GUILD?: number;
		ADD_REACTIONS?: number;
		VIEW_AUDIT_LOG?: number;
		PRIORITY_SPEAKER?: number;
		VIEW_CHANNEL?: number;
		READ_MESSAGES?: number;
		SEND_MESSAGES?: number;
		SEND_TTS_MESSAGES?: number;
		MANAGE_MESSAGES?: number;
		EMBED_LINKS?: number;
		ATTACH_FILES?: number;
		READ_MESSAGE_HISTORY?: number;
		MENTION_EVERYONE?: number;
		USE_EXTERNAL_EMOJIS?: number;
		EXTERNAL_EMOJIS?: number;
		CONNECT?: number;
		SPEAK?: number;
		MUTE_MEMBERS?: number;
		DEAFEN_MEMBERS?: number;
		MOVE_MEMBERS?: number;
		USE_VAD?: number;
		CHANGE_NICKNAME?: number;
		MANAGE_NICKNAMES?: number;
		MANAGE_ROLES?: number;
		MANAGE_ROLES_OR_PERMISSIONS?: number;
		MANAGE_WEBHOOKS?: number;
		MANAGE_EMOJIS?: number;
	};

	type PermissionObject = {
		ADMINISTRATOR?: boolean;
		CREATE_INSTANT_INVITE?: boolean;
		KICK_MEMBERS?: boolean;
		BAN_MEMBERS?: boolean;
		MANAGE_CHANNELS?: boolean;
		MANAGE_GUILD?: boolean;
		ADD_REACTIONS?: boolean;
		VIEW_AUDIT_LOG?: boolean;
		PRIORITY_SPEAKER?: boolean;
		VIEW_CHANNEL?: boolean;
		READ_MESSAGES?: boolean;
		SEND_MESSAGES?: boolean;
		SEND_TTS_MESSAGES?: boolean;
		MANAGE_MESSAGES?: boolean;
		EMBED_LINKS?: boolean;
		ATTACH_FILES?: boolean;
		READ_MESSAGE_HISTORY?: boolean;
		MENTION_EVERYONE?: boolean;
		USE_EXTERNAL_EMOJIS?: boolean;
		EXTERNAL_EMOJIS?: boolean;
		CONNECT?: boolean;
		SPEAK?: boolean;
		MUTE_MEMBERS?: boolean;
		DEAFEN_MEMBERS?: boolean;
		MOVE_MEMBERS?: boolean;
		USE_VAD?: boolean;
		CHANGE_NICKNAME?: boolean;
		MANAGE_NICKNAMES?: boolean;
		MANAGE_ROLES?: boolean;
		MANAGE_ROLES_OR_PERMISSIONS?: boolean;
		MANAGE_WEBHOOKS?: boolean;
		MANAGE_EMOJIS?: boolean;
	};

	type PermissionString = 'ADMINISTRATOR'
		| 'CREATE_INSTANT_INVITE'
		| 'KICK_MEMBERS'
		| 'BAN_MEMBERS'
		| 'MANAGE_CHANNELS'
		| 'MANAGE_GUILD'
		| 'ADD_REACTIONS'
		| 'VIEW_AUDIT_LOG'
		| 'PRIORITY_SPEAKER'
		| 'VIEW_CHANNEL'
		| 'READ_MESSAGES'
		| 'SEND_MESSAGES'
		| 'SEND_TTS_MESSAGES'
		| 'MANAGE_MESSAGES'
		| 'EMBED_LINKS'
		| 'ATTACH_FILES'
		| 'READ_MESSAGE_HISTORY'
		| 'MENTION_EVERYONE'
		| 'USE_EXTERNAL_EMOJIS'
		| 'EXTERNAL_EMOJIS'
		| 'CONNECT'
		| 'SPEAK'
		| 'MUTE_MEMBERS'
		| 'DEAFEN_MEMBERS'
		| 'MOVE_MEMBERS'
		| 'USE_VAD'
		| 'CHANGE_NICKNAME'
		| 'MANAGE_NICKNAMES'
		| 'MANAGE_ROLES'
		| 'MANAGE_ROLES_OR_PERMISSIONS'
		| 'MANAGE_WEBHOOKS'
		| 'MANAGE_EMOJIS';

	type PermissionOverwriteOptions = PermissionObject;

	interface RecursiveArray<T> extends Array<T | RecursiveArray<T>> { }

	type PermissionResolvable = RecursiveArray<Permissions | PermissionString | number> | Permissions | PermissionString | number;

	type PresenceData = {
		status?: PresenceStatus;
		afk?: boolean;
		game?: {
			name?: string;
			url?: string;
			type?: ActivityType;
		} | null;
	};

	type ClientPresenceStatus = 'online' | 'idle' | 'dnd';

	type PresenceStatus = ClientPresenceStatus | 'invisible';
	type PresenceStatusData = ClientPresenceStatus | 'offline';

	type ClientPresenceStatusData = {
		web?: ClientPresenceStatus;
		mobile?: ClientPresenceStatus;
		desktop?: ClientPresenceStatus;
	};

	type RateLimitInfo = {
		limit: number;
		timeDifference: number;
		method: string;
		path: string;
	};

	type ReactionCollectorOptions = CollectorOptions & {
		max?: number;
		maxEmojis?: number;
		maxUsers?: number;
	};

	type RichEmbedOptions = {
		title?: string;
		description?: string;
		url?: string;
		timestamp?: Date;
		color?: number | string;
		fields?: { name: string; value: string; inline?: boolean; }[];
		file?: Attachment | string | FileOptions;
		author?: { name: string; url?: string; icon_url?: string; };
		thumbnail?: { url: string; height?: number; width?: number; };
		image?: { url: string; proxy_url?: string; height?: number; width?: number; };
		video?: { url: string; height: number; width: number; };
		footer?: { text?: string; icon_url?: string; };
	};

	type RoleData = {
		name?: string;
		color?: ColorResolvable;
		hoist?: boolean;
		position?: number;
		permissions?: PermissionResolvable;
		mentionable?: boolean;
	};

	type RoleResolvable = Role | string;

	type Snowflake = string;

	type SplitOptions = {
		maxLength?: number;
		char?: string;
		prepend?: string;
		append?: string;
	};

	type Status = number;

	type StreamOptions = {
		seek?: number;
		volume?: number;
		passes?: number;
		bitrate?: number | 'auto';
	};

	type StringResolvable = string | string[] | any;

	type UserResolvable = User | Snowflake | Message | Guild | GuildMember;

	type VoiceStatus = number;

	type WebhookMessageOptions = {
		username?: string;
		avatarURL?: string;
		tts?: boolean;
		nonce?: string;
		embeds?: (RichEmbed | object)[];
		disableEveryone?: boolean;
		file?: FileOptions | BufferResolvable | Attachment;
		files?: (FileOptions | BufferResolvable | Attachment)[];
		code?: string | boolean;
		split?: boolean | SplitOptions;
	};

	type WebSocketOptions = {
		large_threshold?: number;
		compress?: boolean;
	};

	type WSEventType = 'READY'
		| 'RESUMED'
		| 'GUILD_SYNC'
		| 'GUILD_CREATE'
		| 'GUILD_DELETE'
		| 'GUILD_UPDATE'
		| 'GUILD_MEMBER_ADD'
		| 'GUILD_MEMBER_REMOVE'
		| 'GUILD_MEMBER_UPDATE'
		| 'GUILD_MEMBERS_CHUNK'
		| 'GUILD_INTEGRATIONS_UPDATE'
		| 'GUILD_ROLE_CREATE'
		| 'GUILD_ROLE_DELETE'
		| 'GUILD_ROLE_UPDATE'
		| 'GUILD_BAN_ADD'
		| 'GUILD_BAN_REMOVE'
		| 'CHANNEL_CREATE'
		| 'CHANNEL_DELETE'
		| 'CHANNEL_UPDATE'
		| 'CHANNEL_PINS_UPDATE'
		| 'MESSAGE_CREATE'
		| 'MESSAGE_DELETE'
		| 'MESSAGE_UPDATE'
		| 'MESSAGE_DELETE_BULK'
		| 'MESSAGE_REACTION_ADD'
		| 'MESSAGE_REACTION_REMOVE'
		| 'MESSAGE_REACTION_REMOVE_ALL'
		| 'USER_UPDATE'
		| 'USER_NOTE_UPDATE'
		| 'USER_SETTINGS_UPDATE'
		| 'USER_GUILD_SETTINGS_UPDATE'
		| 'PRESENCE_UPDATE'
		| 'VOICE_STATE_UPDATE'
		| 'TYPING_START'
		| 'VOICE_SERVER_UPDATE'
		| 'WEBHOOKS_UPDATE'
		| 'RELATIONSHIP_ADD'
		| 'RELATIONSHIP_REMOVE';

//#endregion
}
