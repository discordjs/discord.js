declare module 'discord.js' {
	import { EventEmitter } from 'events';
	import { Stream, Readable, Writable } from 'stream';
	import { ChildProcess } from 'child_process';
	import { PathLike } from 'fs';
	import * as WebSocket from 'ws';

	export const version: string;

//#region Classes

	export class Activity {
		constructor(presence: Presence, data?: object);
		public applicationID: Snowflake | null;
		public assets: RichPresenceAssets | null;
		public details: string | null;
		public name: string;
		public party: {
			id: string | null;
			size: [number, number];
		} | null;
		public state: string | null;
		public timestamps: {
			start: Date | null;
			end: Date | null;
		} | null;
		public type: ActivityType;
		public url: string | null;
		public equals(activity: Activity): boolean;
	}

	export class ActivityFlags extends BitField<ActivityFlagsString> {
		public static FLAGS: Record<ActivityFlagsString, number>;
		public static resolve(bit?: BitFieldResolvable<ActivityFlagsString>): number;
	}

	export class APIMessage {
		constructor(target: MessageTarget, options: MessageOptions | WebhookMessageOptions);
		public data: object | null;
		public readonly isUser: boolean;
		public readonly isWebhook: boolean;
		public files: object[] | null;
		public options: MessageOptions | WebhookMessageOptions;
		public target: MessageTarget;

		public static create(
			target: MessageTarget,
			content?: StringResolvable,
			options?: MessageOptions | WebhookMessageOptions | MessageAdditions,
			extra?: MessageOptions | WebhookMessageOptions
		): APIMessage;
		public static partitionMessageAdditions(items: (MessageEmbed | MessageAttachment)[]): [MessageEmbed[], MessageAttachment[]];
		public static resolveFile(fileLike: BufferResolvable | Stream | FileOptions | MessageAttachment): Promise<object>;
		public static transformOptions(
			content: StringResolvable,
			options: MessageOptions | WebhookMessageOptions | MessageAdditions,
			extra?: MessageOptions | WebhookMessageOptions,
			isWebhook?: boolean
		): MessageOptions | WebhookMessageOptions;

		public makeContent(): string | string[] | undefined;
		public resolve(): Promise<this>;
		public resolveData(): this;
		public resolveFiles(): Promise<this>;
		public split(): APIMessage[];
	}

	export class Base {
		constructor(client: Client);
		public readonly client: Client;
		public toJSON(...props: { [key: string]: boolean | string }[]): object;
		public valueOf(): string;
	}

	export class BaseClient extends EventEmitter {
		constructor(options?: ClientOptions);
		private _timeouts: Set<NodeJS.Timer>;
		private _intervals: Set<NodeJS.Timer>;
		private _immediates: Set<NodeJS.Immediate>;
		private readonly api: object;
		private rest: object;

		public options: ClientOptions;
		public clearInterval(interval: NodeJS.Timer): void;
		public clearTimeout(timeout: NodeJS.Timer): void;
		public clearImmediate(timeout: NodeJS.Immediate): void;
		public destroy(): void;
		public setInterval(fn: Function, delay: number, ...args: any[]): NodeJS.Timer;
		public setTimeout(fn: Function, delay: number, ...args: any[]): NodeJS.Timer;
		public setImmediate(fn: Function, delay: number, ...args: any[]): NodeJS.Immediate;
		public toJSON(...props: { [key: string]: boolean | string }[]): object;
	}

	class BroadcastDispatcher extends VolumeMixin(StreamDispatcher) {
		public broadcast: VoiceBroadcast;
	}

	export class BitField<S extends string> {
		constructor(bits?: BitFieldResolvable<S>);
		public bitfield: number;
		public add(...bits: BitFieldResolvable<S>[]): BitField<S>;
		public equals(bit: BitFieldResolvable<S>): boolean;
		public freeze(): Readonly<BitField<S>>;
		public has(bit: BitFieldResolvable<S>): boolean;
		public missing(bits: BitFieldResolvable<S>, ...hasParams: any[]): S[];
		public remove(...bits: BitFieldResolvable<S>[]): BitField<S>;
		public serialize(...hasParams: BitFieldResolvable<S>[]): Record<S, boolean>;
		public toArray(): S[];
		public toJSON(): number;
		public valueOf(): number;
		public [Symbol.iterator](): Iterator<S>;
		public static FLAGS: object;
		public static resolve(bit?: BitFieldResolvable<any>): number;
	}

	export class CategoryChannel extends GuildChannel {
		public readonly children: Collection<Snowflake, GuildChannel>;
	}

	export class Channel extends Base {
		constructor(client: Client, data?: object);
		public readonly createdAt: Date;
		public readonly createdTimestamp: number;
		public deleted: boolean;
		public id: Snowflake;
		public type: 'dm' | 'text' | 'voice' | 'category' | 'news' | 'store' | 'unknown';
		public delete(reason?: string): Promise<Channel>;
		public fetch(): Promise<Channel>;
		public toString(): string;
	}

	export class Client extends BaseClient {
		constructor(options?: ClientOptions);
		private actions: object;
		private _eval(script: string): any;
		private _validateOptions(options?: ClientOptions): void;

		public channels: ChannelStore;
		public readonly emojis: GuildEmojiStore;
		public guilds: GuildStore;
		public readyAt: Date | null;
		public readonly readyTimestamp: number | null;
		public shard: ShardClientUtil | null;
		public token: string | null;
		public readonly uptime: number | null;
		public user: ClientUser | null;
		public users: UserStore;
		public voice: ClientVoiceManager | null;
		public ws: WebSocketManager;
		public destroy(): void;
		public fetchApplication(): Promise<ClientApplication>;
		public fetchInvite(invite: InviteResolvable): Promise<Invite>;
		public fetchVoiceRegions(): Promise<Collection<string, VoiceRegion>>;
		public fetchWebhook(id: Snowflake, token?: string): Promise<Webhook>;
		public generateInvite(permissions?: PermissionResolvable): Promise<string>;
		public login(token?: string): Promise<string>;
		public sweepMessages(lifetime?: number): number;
		public toJSON(): object;

		public on(event: 'channelCreate' | 'channelDelete', listener: (channel: Channel) => void): this;
		public on(event: 'channelPinsUpdate', listener: (channel: Channel, time: Date) => void): this;
		public on(event: 'channelUpdate', listener: (oldChannel: Channel, newChannel: Channel) => void): this;
		public on(event: 'debug' | 'warn', listener: (info: string) => void): this;
		public on(event: 'disconnect', listener: (event: any, shardID: number) => void): this;
		public on(event: 'emojiCreate' | 'emojiDelete', listener: (emoji: GuildEmoji) => void): this;
		public on(event: 'emojiUpdate', listener: (oldEmoji: GuildEmoji, newEmoji: GuildEmoji) => void): this;
		public on(event: 'error', listener: (error: Error) => void): this;
		public on(event: 'guildBanAdd' | 'guildBanRemove', listener: (guild: Guild, user: User) => void): this;
		public on(event: 'guildCreate' | 'guildDelete' | 'guildUnavailable', listener: (guild: Guild) => void): this;
		public on(event: 'guildMemberAdd' | 'guildMemberAvailable' | 'guildMemberRemove', listener: (member: GuildMember) => void): this;
		public on(event: 'guildMembersChunk', listener: (members: Collection<Snowflake, GuildMember>, guild: Guild) => void): this;
		public on(event: 'guildMemberSpeaking', listener: (member: GuildMember, speaking: Readonly<Speaking>) => void): this;
		public on(event: 'guildMemberUpdate', listener: (oldMember: GuildMember, newMember: GuildMember) => void): this;
		public on(event: 'guildUpdate', listener: (oldGuild: Guild, newGuild: Guild) => void): this;
		public on(event: 'guildIntegrationsUpdate', listener: (guild: Guild) => void): this;
		public on(event: 'message' | 'messageDelete' | 'messageReactionRemoveAll', listener: (message: Message) => void): this;
		public on(event: 'messageDeleteBulk', listener: (messages: Collection<Snowflake, Message>) => void): this;
		public on(event: 'messageReactionAdd' | 'messageReactionRemove', listener: (messageReaction: MessageReaction, user: User) => void): this;
		public on(event: 'messageUpdate', listener: (oldMessage: Message, newMessage: Message) => void): this;
		public on(event: 'presenceUpdate', listener: (oldPresence: Presence | undefined, newPresence: Presence) => void): this;
		public on(event: 'rateLimit', listener: (rateLimitData: RateLimitData) => void): this;
		public on(event: 'ready', listener: () => void): this;
		public on(event: 'resume', listener: (replayed: number, shardID: number) => void): this;
		public on(event: 'roleCreate' | 'roleDelete', listener: (role: Role) => void): this;
		public on(event: 'roleUpdate', listener: (oldRole: Role, newRole: Role) => void): this;
		public on(event: 'typingStart' | 'typingStop', listener: (channel: Channel, user: User) => void): this;
		public on(event: 'userUpdate', listener: (oldUser: User, newUser: User) => void): this;
		public on(event: 'voiceStateUpdate', listener: (oldState: VoiceState | undefined, newState: VoiceState) => void): this;
		public on(event: 'webhookUpdate', listener: (channel: TextChannel) => void): this;
		public on(event: 'invalidated', listener: () => void): this;
		public on(event: 'shardDisconnected', listener: (event: CloseEvent, id: number) => void): this;
		public on(event: 'shardError', listener: (error: Error, id: number) => void): this;
		public on(event: 'shardReconnecting', listener: (id: number) => void): this;
		public on(event: 'shardReady', listener: (id: number) => void): this;
		public on(event: 'shardResumed', listener: (id: number) => void): this;
		public on(event: string, listener: Function): this;

		public once(event: 'channelCreate' | 'channelDelete', listener: (channel: Channel) => void): this;
		public once(event: 'channelPinsUpdate', listener: (channel: Channel, time: Date) => void): this;
		public once(event: 'channelUpdate', listener: (oldChannel: Channel, newChannel: Channel) => void): this;
		public once(event: 'debug' | 'warn', listener: (info: string) => void): this;
		public once(event: 'disconnect', listener: (event: any, shardID: number) => void): this;
		public once(event: 'emojiCreate' | 'emojiDelete', listener: (emoji: GuildEmoji) => void): this;
		public once(event: 'emojiUpdate', listener: (oldEmoji: GuildEmoji, newEmoji: GuildEmoji) => void): this;
		public once(event: 'error', listener: (error: Error) => void): this;
		public once(event: 'guildBanAdd' | 'guildBanRemove', listener: (guild: Guild, user: User) => void): this;
		public once(event: 'guildCreate' | 'guildDelete' | 'guildUnavailable', listener: (guild: Guild) => void): this;
		public once(event: 'guildMemberAdd' | 'guildMemberAvailable' | 'guildMemberRemove', listener: (member: GuildMember) => void): this;
		public once(event: 'guildMembersChunk', listener: (members: Collection<Snowflake, GuildMember>, guild: Guild) => void): this;
		public once(event: 'guildMemberSpeaking', listener: (member: GuildMember, speaking: Readonly<Speaking>) => void): this;
		public once(event: 'guildMemberUpdate', listener: (oldMember: GuildMember, newMember: GuildMember) => void): this;
		public once(event: 'guildUpdate', listener: (oldGuild: Guild, newGuild: Guild) => void): this;
		public once(event: 'guildIntegrationsUpdate', listener: (guild: Guild) => void): this;
		public once(event: 'message' | 'messageDelete' | 'messageReactionRemoveAll', listener: (message: Message) => void): this;
		public once(event: 'messageDeleteBulk', listener: (messages: Collection<Snowflake, Message>) => void): this;
		public once(event: 'messageReactionAdd' | 'messageReactionRemove', listener: (messageReaction: MessageReaction, user: User) => void): this;
		public once(event: 'messageUpdate', listener: (oldMessage: Message, newMessage: Message) => void): this;
		public once(event: 'presenceUpdate', listener: (oldPresence: Presence | undefined, newPresence: Presence) => void): this;
		public once(event: 'rateLimit', listener: (rateLimitData: RateLimitData) => void): this;
		public once(event: 'ready', listener: () => void): this;
		public once(event: 'resume', listener: (replayed: number, shardID: number) => void): this;
		public once(event: 'roleCreate' | 'roleDelete', listener: (role: Role) => void): this;
		public once(event: 'roleUpdate', listener: (oldRole: Role, newRole: Role) => void): this;
		public once(event: 'typingStart' | 'typingStop', listener: (channel: Channel, user: User) => void): this;
		public once(event: 'userUpdate', listener: (oldUser: User, newUser: User) => void): this;
		public once(event: 'voiceStateUpdate', listener: (oldState: VoiceState | undefined, newState: VoiceState) => void): this;
		public once(event: 'webhookUpdate', listener: (channel: TextChannel) => void): this;
		public once(event: 'invalidated', listener: () => void): this;
		public once(event: 'shardDisconnected', listener: (event: CloseEvent, id: number) => void): this;
		public once(event: 'shardError', listener: (error: Error, id: number) => void): this;
		public once(event: 'shardReconnecting', listener: (id: number) => void): this;
		public once(event: 'shardReady', listener: (id: number) => void): this;
		public once(event: 'shardResumed', listener: (id: number) => void): this;
		public once(event: string, listener: Function): this;
	}

	export class ClientVoiceManager {
		constructor(client: Client);
		public readonly client: Client;
		public connections: Collection<Snowflake, VoiceConnection>;
		public broadcasts: VoiceBroadcast[];

		private joinChannel(channel: VoiceChannel): Promise<VoiceConnection>;

		public createBroadcast(): VoiceBroadcast;
	}

	export class ClientApplication extends Base {
		constructor(client: Client, data: object);
		public botPublic: boolean | null;
		public botRequireCodeGrant: boolean | null;
		public cover: string | null;
		public readonly createdAt: Date;
		public readonly createdTimestamp: number;
		public description: string;
		public icon: string;
		public id: Snowflake;
		public name: string;
		public owner: User | Team | null;
		public rpcOrigins: string[];
		public coverImage(options?: AvatarOptions): string;
		public fetchAssets(): Promise<ClientApplicationAsset>;
		public iconURL(options?: AvatarOptions): string;
		public toJSON(): object;
		public toString(): string;
	}

	export class Team extends Base {
		constructor(client: Client, data: object);
		public id: Snowflake;
		public name: string;
		public icon: string | null;
		public ownerID: Snowflake | null;
		public members: Collection<Snowflake, TeamMember>;

		public readonly owner: TeamMember;
		public readonly createdAt: Date;
		public readonly createdTimestamp: number;

		public iconURL(options?: AvatarOptions): string;
		public toJSON(): object;
		public toString(): string;
	}

	export class TeamMember extends Base {
		constructor(team: Team, data: object);
		public team: Team;
		public readonly id: Snowflake;
		public permissions: string[];
		public membershipState: MembershipStates;
		public user: User;

		public toString(): string;
	}

	export interface ActivityOptions {
		name?: string;
		url?: string;
		type?: ActivityType | number;
		shardID?: number | number[];
	}

	export class ClientUser extends User {
		public mfaEnabled: boolean;
		public verified: boolean;
		public setActivity(options?: ActivityOptions): Promise<Presence>;
		public setActivity(name: string, options?: ActivityOptions): Promise<Presence>;
		public setAFK(afk: boolean): Promise<Presence>;
		public setAvatar(avatar: BufferResolvable | Base64Resolvable): Promise<ClientUser>;
		public setPresence(data: PresenceData): Promise<Presence>;
		public setStatus(status: PresenceStatusData, shardID?: number | number[]): Promise<Presence>;
		public setUsername(username: string): Promise<ClientUser>;
	}

	export class Collection<K, V> extends Map<K, V> {
		private _array: V[];
		private _keyArray: K[];

		public array(): V[];
		public clone(): Collection<K, V>;
		public concat(...collections: Collection<K, V>[]): Collection<K, V>;
		public each(fn: (value: V, key: K, collection: Collection<K, V>) => void, thisArg?: any): Collection<K, V>;
		public equals(collection: Collection<any, any>): boolean;
		public every(fn: (value: V, key: K, collection: Collection<K, V>) => boolean, thisArg?: any): boolean;
		public filter(fn: (value: V, key: K, collection: Collection<K, V>) => boolean, thisArg?: any): Collection<K, V>;
		public find(fn: (value: V, key: K, collection: Collection<K, V>) => boolean, thisArg?: any): V | undefined;
		public findKey(fn: (value: V, key: K, collection: Collection<K, V>) => boolean, thisArg?: any): K | undefined;
		public first(): V | undefined;
		public first(count: number): V[];
		public firstKey(): K | undefined;
		public firstKey(count: number): K[];
		public keyArray(): K[];
		public last(): V | undefined;
		public last(count: number): V[];
		public lastKey(): K | undefined;
		public lastKey(count: number): K[];
		public map<T>(fn: (value: V, key: K, collection: Collection<K, V>) => T, thisArg?: any): T[];
		public partition(fn: (value: V, key: K, collection: Collection<K, V>) => boolean, thisArg?: any): [Collection<K, V>, Collection<K, V>];
		public random(): V | undefined;
		public random(count: number): V[];
		public randomKey(): K | undefined;
		public randomKey(count: number): K[];
		public reduce<T>(fn: (accumulator: T, value: V, key: K, collection: Collection<K, V>) => T, initialValue?: T): T;
		public some(fn: (value: V, key: K, collection: Collection<K, V>) => boolean, thisArg?: any): boolean;
		public sort(compareFunction?: (a: V, b: V, c?: K, d?: K) => number): Collection<K, V>;
		public sweep(fn: (value: V, key: K, collection: Collection<K, V>) => boolean, thisArg?: any): number;
		public tap(fn: (collection: Collection<K, V>) => void, thisArg?: any): Collection<K, V>;
		public toJSON(): object;
	}

	export abstract class Collector<K, V> extends EventEmitter {
		constructor(client: Client, filter: CollectorFilter, options?: CollectorOptions);
		private _timeout: NodeJS.Timer | null;
		private _idletimeout: NodeJS.Timer | null;

		public readonly client: Client;
		public collected: Collection<K, V>;
		public ended: boolean;
		public filter: CollectorFilter;
		public readonly next: Promise<V>;
		public options: CollectorOptions;
		public checkEnd(): void;
		public handleCollect(...args: any[]): void;
		public handleDispose(...args: any[]): void;
		public stop(reason?: string): void;
		public [Symbol.asyncIterator](): AsyncIterableIterator<V>;
		public toJSON(): object;

		protected listener: Function;
		public abstract collect(...args: any[]): K;
		public abstract dispose(...args: any[]): K;
		public abstract endReason(): void;

		public on(event: 'collect', listener: (...args: any[]) => void): this;
		public on(event: 'dispose', listener: (...args: any[]) => void): this;
		public on(event: 'end', listener: (collected: Collection<K, V>, reason: string) => void): this;

		public once(event: 'collect', listener: (...args: any[]) => void): this;
		public once(event: 'dispose', listener: (...args: any[]) => void): this;
		public once(event: 'end', listener: (collected: Collection<K, V>, reason: string) => void): this;
	}

	type AllowedImageFormat = 'webp' | 'png' | 'jpg' | 'gif';

	export interface Constants {
		Package: {
			name: string;
			version: string;
			description: string;
			author: string;
			license: string;
			main: PathLike;
			types: PathLike;
			homepage: string;
			keywords: string[];
			bugs: { url: string };
			repository: { type: string, url: string };
			browser: { [key: string]: boolean };
			scripts: { [key: string]: string };
			engines: { [key: string]: string };
			dependencies: { [key: string]: string };
			peerDependencies: { [key: string]: string };
			devDependencies: { [key: string]: string };
			[key: string]: any;
		};
		browser: boolean;
		DefaultOptions: ClientOptions;
		UserAgent: string | null;
		Endpoints: {
			botGateway: string;
			invite: (root: string, code: string) => string;
			CDN: (root: string) => {
				Asset: (name: string) => string;
				DefaultAvatar: (id: string | number) => string;
				Emoji: (emojiID: string, format: 'png' | 'gif') => string;
				Avatar: (userID: string | number, hash: string, format: 'default' | AllowedImageFormat, size: number) => string;
				Banner: (guildID: string | number, hash: string, format: AllowedImageFormat, size: number) => string;
				Icon: (userID: string | number, hash: string, format: 'default' | AllowedImageFormat, size: number) => string;
				AppIcon: (userID: string | number, hash: string, format: AllowedImageFormat, size: number) => string;
				AppAsset: (userID: string | number, hash: string, format: AllowedImageFormat, size: number) => string;
				GDMIcon: (userID: string | number, hash: string, format: AllowedImageFormat, size: number) => string;
				Splash: (userID: string | number, hash: string, format: AllowedImageFormat, size: number) => string;
				TeamIcon: (teamID: string | number, hash: string, format: AllowedImageFormat, size: number) => string;
			};
		};
		WSCodes: {
			1000: 'WS_CLOSE_REQUESTED';
			4004: 'TOKEN_INVALID';
			4010: 'SHARDING_INVALID';
			4011: 'SHARDING_REQUIRED';
		};
		Events: {
			RATE_LIMIT: 'rateLimit';
			CLIENT_READY: 'ready';
			RESUMED: 'resumed';
			GUILD_CREATE: 'guildCreate';
			GUILD_DELETE: 'guildDelete';
			GUILD_UPDATE: 'guildUpdate';
			GUILD_UNAVAILABLE: 'guildUnavailable';
			GUILD_MEMBER_ADD: 'guildMemberAdd';
			GUILD_MEMBER_REMOVE: 'guildMemberRemove';
			GUILD_MEMBER_UPDATE: 'guildMemberUpdate';
			GUILD_MEMBER_AVAILABLE: 'guildMemberAvailable';
			GUILD_MEMBER_SPEAKING: 'guildMemberSpeaking';
			GUILD_MEMBERS_CHUNK: 'guildMembersChunk';
			GUILD_INTEGRATIONS_UPDATE: 'guildIntegrationsUpdate';
			GUILD_ROLE_CREATE: 'roleCreate';
			GUILD_ROLE_DELETE: 'roleDelete';
			GUILD_ROLE_UPDATE: 'roleUpdate';
			GUILD_EMOJI_CREATE: 'emojiCreate';
			GUILD_EMOJI_DELETE: 'emojiDelete';
			GUILD_EMOJI_UPDATE: 'emojiUpdate';
			GUILD_BAN_ADD: 'guildBanAdd';
			GUILD_BAN_REMOVE: 'guildBanRemove';
			CHANNEL_CREATE: 'channelCreate';
			CHANNEL_DELETE: 'channelDelete';
			CHANNEL_UPDATE: 'channelUpdate';
			CHANNEL_PINS_UPDATE: 'channelPinsUpdate';
			MESSAGE_CREATE: 'message';
			MESSAGE_DELETE: 'messageDelete';
			MESSAGE_UPDATE: 'messageUpdate';
			MESSAGE_BULK_DELETE: 'messageDeleteBulk';
			MESSAGE_REACTION_ADD: 'messageReactionAdd';
			MESSAGE_REACTION_REMOVE: 'messageReactionRemove';
			MESSAGE_REACTION_REMOVE_ALL: 'messageReactionRemoveAll';
			USER_UPDATE: 'userUpdate';
			PRESENCE_UPDATE: 'presenceUpdate';
			VOICE_STATE_UPDATE: 'voiceStateUpdate';
			VOICE_BROADCAST_SUBSCRIBE: 'subscribe';
			VOICE_BROADCAST_UNSUBSCRIBE: 'unsubscribe';
			TYPING_START: 'typingStart';
			WEBHOOKS_UPDATE: 'webhookUpdate';
			DISCONNECT: 'disconnect';
			RECONNECTING: 'reconnecting';
			ERROR: 'error';
			WARN: 'warn';
			DEBUG: 'debug';
			SHARD_DISCONNECTED: 'shardDisconnected';
			SHARD_ERROR: 'shardError';
			SHARD_RECONNECTING: 'shardReconnecting';
			SHARD_READY: 'shardReady';
			SHARD_RESUMED: 'shardResumed';
			INVALIDATED: 'invalidated';
			RAW: 'raw';
		};
		ShardEvents: {
			CLOSE: 'close';
			DESTROYED: 'destroyed';
			INVALID_SESSION: 'invalidSession';
			READY: 'ready';
			RESUMED: 'resumed';
		};
		PartialTypes: {
			[K in PartialType]: K;
		};
		WSEvents: {
			[K in WSEventType]: K;
		};
		Colors: {
			DEFAULT: 0x000000;
			WHITE: 0xFFFFFF;
			AQUA: 0x1ABC9C;
			GREEN: 0x2ECC71;
			BLUE: 0x3498DB;
			YELLOW: 0xFFFF00;
			PURPLE: 0x9B59B6;
			LUMINOUS_VIVID_PINK: 0xE91E63;
			GOLD: 0xF1C40F;
			ORANGE: 0xE67E22;
			RED: 0xE74C3C;
			GREY: 0x95A5A6;
			NAVY: 0x34495E;
			DARK_AQUA: 0x11806A;
			DARK_GREEN: 0x1F8B4C;
			DARK_BLUE: 0x206694;
			DARK_PURPLE: 0x71368A;
			DARK_VIVID_PINK: 0xAD1457;
			DARK_GOLD: 0xC27C0E;
			DARK_ORANGE: 0xA84300;
			DARK_RED: 0x992D22;
			DARK_GREY: 0x979C9F;
			DARKER_GREY: 0x7F8C8D;
			LIGHT_GREY: 0xBCC0C0;
			DARK_NAVY: 0x2C3E50;
			BLURPLE: 0x7289DA;
			GREYPLE: 0x99AAB5;
			DARK_BUT_NOT_BLACK: 0x2C2F33;
			NOT_QUITE_BLACK: 0x23272A;
		};
		Status: {
			READY: 0;
			CONNECTING: 1;
			RECONNECTING: 2;
			IDLE: 3;
			NEARLY: 4;
			DISCONNECTED: 5;
		};
		OPCodes: {
			DISPATCH: 0;
			HEARTBEAT: 1;
			IDENTIFY: 2;
			STATUS_UPDATE: 3;
			VOICE_STATE_UPDATE: 4;
			VOICE_GUILD_PING: 5;
			RESUME: 6;
			RECONNECT: 7;
			REQUEST_GUILD_MEMBERS: 8;
			INVALID_SESSION: 9;
			HELLO: 10;
			HEARTBEAT_ACK: 11;
		};
		APIErrors: {
			UNKNOWN_ACCOUNT: 10001;
			UNKNOWN_APPLICATION: 10002;
			UNKNOWN_CHANNEL: 10003;
			UNKNOWN_GUILD: 10004;
			UNKNOWN_INTEGRATION: 10005;
			UNKNOWN_INVITE: 10006;
			UNKNOWN_MEMBER: 10007;
			UNKNOWN_MESSAGE: 10008;
			UNKNOWN_OVERWRITE: 10009;
			UNKNOWN_PROVIDER: 10010;
			UNKNOWN_ROLE: 10011;
			UNKNOWN_TOKEN: 10012;
			UNKNOWN_USER: 10013;
			UNKNOWN_EMOJI: 10014;
			UNKNOWN_WEBHOOK: 10015;
			BOT_PROHIBITED_ENDPOINT: 20001;
			BOT_ONLY_ENDPOINT: 20002;
			MAXIMUM_GUILDS: 30001;
			MAXIMUM_FRIENDS: 30002;
			MAXIMUM_PINS: 30003;
			MAXIMUM_ROLES: 30005;
			MAXIMUM_REACTIONS: 30010;
			UNAUTHORIZED: 40001;
			MISSING_ACCESS: 50001;
			INVALID_ACCOUNT_TYPE: 50002;
			CANNOT_EXECUTE_ON_DM: 50003;
			EMBED_DISABLED: 50004;
			CANNOT_EDIT_MESSAGE_BY_OTHER: 50005;
			CANNOT_SEND_EMPTY_MESSAGE: 50006;
			CANNOT_MESSAGE_USER: 50007;
			CANNOT_SEND_MESSAGES_IN_VOICE_CHANNEL: 50008;
			CHANNEL_VERIFICATION_LEVEL_TOO_HIGH: 50009;
			OAUTH2_APPLICATION_BOT_ABSENT: 50010;
			MAXIMUM_OAUTH2_APPLICATIONS: 50011;
			INVALID_OAUTH_STATE: 50012;
			MISSING_PERMISSIONS: 50013;
			INVALID_AUTHENTICATION_TOKEN: 50014;
			NOTE_TOO_LONG: 50015;
			INVALID_BULK_DELETE_QUANTITY: 50016;
			CANNOT_PIN_MESSAGE_IN_OTHER_CHANNEL: 50019;
			CANNOT_EXECUTE_ON_SYSTEM_MESSAGE: 50021;
			BULK_DELETE_MESSAGE_TOO_OLD: 50034;
			INVITE_ACCEPTED_TO_GUILD_NOT_CONTAINING_BOT: 50036;
			REACTION_BLOCKED: 90001;
		};
		VoiceStatus: {
			CONNECTED: 0;
			CONNECTING: 1;
			AUTHENTICATING: 2;
			RECONNECTING: 3;
			DISCONNECTED: 4;
		};
		VoiceOPCodes: {
			IDENTIFY: 0;
			SELECT_PROTOCOL: 1;
			READY: 2;
			HEARTBEAT: 3;
			SESSION_DESCRIPTION: 4;
			SPEAKING: 5;
			HELLO: 8;
			CLIENT_CONNECT: 12;
			CLIENT_DISCONNECT: 13;
		};
		ChannelTypes: {
			TEXT: 0;
			DM: 1;
			VOICE: 2;
			GROUP: 3;
			CATEGORY: 4;
			NEWS: 5;
			STORE: 6;
		};
		ClientApplicationAssetTypes: {
			SMALL: 1;
			BIG: 2;
		};
		MessageTypes: MessageType[];
		ActivityTypes: ActivityType[];
		DefaultMessageNotifications: DefaultMessageNotifications[];
		MembershipStates: 'INVITED' | 'ACCEPTED';
	}

	export class DataResolver {
		public static resolveBase64(data: Base64Resolvable): string;
		public static resolveFile(resource: BufferResolvable | Stream): Promise<Buffer>;
		public static resolveImage(resource: BufferResolvable | Base64Resolvable): Promise<string>;
		public static resolveInviteCode(data: InviteResolvable): string;
	}

	export class DiscordAPIError extends Error {
		constructor(path: string, error: object, method: string, httpStatus: number);
		private static flattenErrors(obj: object, key: string): string[];

		public code: number;
		public method: string;
		public path: string;
		public httpStatus: number;
	}

	export class DMChannel extends TextBasedChannel(Channel) {
		constructor(client: Client, data?: object);
		public messages: MessageStore;
		public recipient: User;
		public readonly partial: boolean;
	}

	export class Emoji extends Base {
		constructor(client: Client, emoji: object);
		public animated: boolean;
		public readonly createdAt: Date;
		public readonly createdTimestamp: number;
		public readonly deletable: boolean;
		public id: Snowflake;
		public name: string;
		public readonly identifier: string;
		public readonly url: string;
		public toJSON(): object;
		public toString(): string;
	}

	export class Guild extends Base {
		constructor(client: Client, data: object);
		private _sortedRoles(): Collection<Snowflake, Role>;
		private _sortedChannels(channel: Channel): Collection<Snowflake, GuildChannel>;
		private _memberSpeakUpdate(user: Snowflake, speaking: boolean): void;

		public readonly afkChannel: VoiceChannel;
		public afkChannelID: Snowflake;
		public afkTimeout: number;
		public applicationID: Snowflake;
		public available: boolean;
		public banner: string | null;
		public channels: GuildChannelStore;
		public readonly createdAt: Date;
		public readonly createdTimestamp: number;
		public defaultMessageNotifications: DefaultMessageNotifications | number;
		public deleted: boolean;
		public description: string | null;
		public embedChannel: GuildChannel | null;
		public embedChannelID: Snowflake | null;
		public embedEnabled: boolean;
		public emojis: GuildEmojiStore;
		public explicitContentFilter: number;
		public features: GuildFeatures[];
		public icon: string | null;
		public id: Snowflake;
		public readonly joinedAt: Date;
		public joinedTimestamp: number;
		public large: boolean;
		public maximumMembers: number | null;
		public maximumPresences: number | null;
		public readonly me: GuildMember | null;
		public memberCount: number;
		public members: GuildMemberStore;
		public mfaLevel: number;
		public name: string;
		public readonly nameAcronym: string;
		public readonly owner: GuildMember | null;
		public ownerID: Snowflake;
		public premiumSubscriptionCount: number | null;
		public premiumTier: PremiumTier;
		public presences: PresenceStore;
		public region: string;
		public roles: RoleStore;
		public readonly shard: WebSocketShard;
		public shardID: number;
		public splash: string | null;
		public readonly systemChannel: TextChannel | null;
		public systemChannelID: Snowflake | null;
		public vanityURLCode: string | null;
		public verificationLevel: number;
		public readonly verified: boolean;
		public readonly voice: VoiceState | null;
		public readonly voiceStates: VoiceStateStore;
		public readonly widgetChannel: TextChannel | null;
		public widgetChannelID: Snowflake | null;
		public widgetEnabled: boolean | null;
		public addMember(user: UserResolvable, options: AddGuildMemberOptions): Promise<GuildMember>;
		public bannerURL(options?: AvatarOptions): string | null;
		public createIntegration(data: IntegrationData, reason?: string): Promise<Guild>;
		public delete(): Promise<Guild>;
		public edit(data: GuildEditData, reason?: string): Promise<Guild>;
		public equals(guild: Guild): boolean;
		public fetch(): Promise<Guild>;
		public fetchAuditLogs(options?: GuildAuditLogsFetchOptions): Promise<GuildAuditLogs>;
		public fetchBans(): Promise<Collection<Snowflake, { user: User, reason: string }>>;
		public fetchEmbed(): Promise<GuildEmbedData>;
		public fetchIntegrations(): Promise<Collection<string, Integration>>;
		public fetchInvites(): Promise<Collection<string, Invite>>;
		public fetchVanityCode(): Promise<string>;
		public fetchVoiceRegions(): Promise<Collection<string, VoiceRegion>>;
		public fetchWebhooks(): Promise<Collection<Snowflake, Webhook>>;
		public iconURL(options?: AvatarOptions): string | null;
		public leave(): Promise<Guild>;
		public member(user: UserResolvable): GuildMember | null;
		public setAFKChannel(afkChannel: ChannelResolvable | null, reason?: string): Promise<Guild>;
		public setAFKTimeout(afkTimeout: number, reason?: string): Promise<Guild>;
		public setBanner(banner: Base64Resolvable | null, reason?: string): Promise<Guild>;
		public setChannelPositions(channelPositions: ChannelPosition[]): Promise<Guild>;
		public setDefaultMessageNotifications(defaultMessageNotifications: DefaultMessageNotifications | number, reason?: string): Promise<Guild>;
		public setEmbed(embed: GuildEmbedData, reason?: string): Promise<Guild>;
		public setExplicitContentFilter(explicitContentFilter: number, reason?: string): Promise<Guild>;
		public setIcon(icon: Base64Resolvable | null, reason?: string): Promise<Guild>;
		public setName(name: string, reason?: string): Promise<Guild>;
		public setOwner(owner: GuildMemberResolvable, reason?: string): Promise<Guild>;
		public setRegion(region: string, reason?: string): Promise<Guild>;
		public setRolePositions(rolePositions: RolePosition[]): Promise<Guild>;
		public setSplash(splash: Base64Resolvable | null, reason?: string): Promise<Guild>;
		public setSystemChannel(systemChannel: ChannelResolvable | null, reason?: string): Promise<Guild>;
		public setVerificationLevel(verificationLevel: number, reason?: string): Promise<Guild>;
		public splashURL(options?: AvatarOptions): string | null;
		public toJSON(): object;
		public toString(): string;
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
		public toJSON(): object;
	}

	class GuildAuditLogsEntry {
		constructor(logs: GuildAuditLogs, guild: Guild, data: object);
		public action: GuildAuditLogsAction;
		public actionType: GuildAuditLogsActionType;
		public changes: AuditLogChange[] | null;
		public readonly createdAt: Date;
		public readonly createdTimestamp: number;
		public executor: User;
		public extra: object | Role | GuildMember | null;
		public id: Snowflake;
		public reason: string | null;
		public target: Guild | User | Role | GuildEmoji | Invite | Webhook;
		public targetType: GuildAuditLogsTarget;
		public toJSON(): object;
	}

	export class GuildChannel extends Channel {
		constructor(guild: Guild, data?: object);
		private memberPermissions(member: GuildMember): Readonly<Permissions>;
		private rolePermissions(role: Role): Readonly<Permissions>;

		public readonly calculatedPosition: number;
		public readonly deletable: boolean;
		public guild: Guild;
		public readonly manageable: boolean;
		public name: string;
		public readonly parent: CategoryChannel | null;
		public parentID: Snowflake;
		public permissionOverwrites: Collection<Snowflake, PermissionOverwrites>;
		public readonly permissionsLocked: boolean | null;
		public readonly position: number;
		public rawPosition: number;
		public readonly viewable: boolean;
		public clone(options?: GuildChannelCloneOptions): Promise<GuildChannel>;
		public createInvite(options?: InviteOptions): Promise<Invite>;
		public createOverwrite(userOrRole: RoleResolvable | UserResolvable, options: PermissionOverwriteOption, reason?: string): Promise<GuildChannel>;
		public edit(data: ChannelData, reason?: string): Promise<GuildChannel>;
		public equals(channel: GuildChannel): boolean;
		public fetchInvites(): Promise<Collection<string, Invite>>;
		public lockPermissions(): Promise<GuildChannel>;
		public overwritePermissions(options?: { permissionOverwrites?: OverwriteResolvable[] | Collection<Snowflake, OverwriteResolvable>, reason?: string }): Promise<GuildChannel>;
		public permissionsFor(memberOrRole: GuildMemberResolvable | RoleResolvable): Readonly<Permissions> | null;
		public setName(name: string, reason?: string): Promise<GuildChannel>;
		public setParent(channel: GuildChannel | Snowflake, options?: { lockPermissions?: boolean, reason?: string }): Promise<GuildChannel>;
		public setPosition(position: number, options?: { relative?: boolean, reason?: string }): Promise<GuildChannel>;
		public setTopic(topic: string, reason?: string): Promise<GuildChannel>;
		public updateOverwrite(userOrRole: RoleResolvable | UserResolvable, options: PermissionOverwriteOption, reason?: string): Promise<GuildChannel>;
	}

	export class StoreChannel extends GuildChannel {
		constructor(guild: Guild, data?: object);
		public nsfw: boolean;
	}

	export class GuildEmoji extends Emoji {
		constructor(client: Client, data: object, guild: Guild);
		private _roles: string[];

		public available: boolean;
		public deleted: boolean;
		public guild: Guild;
		public managed: boolean;
		public requiresColons: boolean;
		public roles: GuildEmojiRoleStore;
		public delete(reason?: string): Promise<GuildEmoji>;
		public edit(data: GuildEmojiEditData, reason?: string): Promise<GuildEmoji>;
		public equals(other: GuildEmoji | object): boolean;
		public fetchAuthor(): Promise<User>;
		public setName(name: string, reason?: string): Promise<GuildEmoji>;
	}

	export class GuildMember extends PartialTextBasedChannel(Base) {
		constructor(client: Client, data: object, guild: Guild);
		public readonly bannable: boolean;
		public deleted: boolean;
		public readonly displayColor: number;
		public readonly displayHexColor: string;
		public readonly displayName: string;
		public guild: Guild;
		public readonly id: Snowflake;
		public readonly joinedAt: Date | null;
		public joinedTimestamp: number | null;
		public readonly kickable: boolean;
		public readonly manageable: boolean;
		public nickname: string;
		public readonly partial: boolean;
		public readonly permissions: Readonly<Permissions>;
		public readonly premiumSince: Date | null;
		public premiumSinceTimestamp: number | null;
		public readonly presence: Presence;
		public roles: GuildMemberRoleStore;
		public user: User;
		public readonly voice: VoiceState;
		public ban(options?: BanOptions): Promise<GuildMember>;
		public fetch(): Promise<GuildMember>;
		public createDM(): Promise<DMChannel>;
		public deleteDM(): Promise<DMChannel>;
		public edit(data: GuildMemberEditData, reason?: string): Promise<GuildMember>;
		public hasPermission(permission: PermissionResolvable, options?: { checkAdmin?: boolean; checkOwner?: boolean }): boolean;
		public kick(reason?: string): Promise<GuildMember>;
		public permissionsIn(channel: ChannelResolvable): Readonly<Permissions>;
		public setNickname(nickname: string, reason?: string): Promise<GuildMember>;
		public toJSON(): object;
		public toString(): string;
	}

	export class Integration extends Base {
		constructor(client: Client, data: object, guild: Guild);
		public account: IntegrationAccount;
		public enabled: boolean;
		public expireBehavior: number;
		public expireGracePeriod: number;
		public guild: Guild;
		public id: Snowflake;
		public name: string;
		public role: Role;
		public syncedAt: number;
		public syncing: boolean;
		public type: number;
		public user: User;
		public delete(reason?: string): Promise<Integration>;
		public edit(data: IntegrationEditData, reason?: string): Promise<Integration>;
		public sync(): Promise<Integration>;
	}

	export class HTTPError extends Error {
		constructor(message: string, name: string, code: number, method: string, path: string);
		public code: number;
		public method: string;
		public name: string;
		public path: string;
	}

	export class Invite extends Base {
		constructor(client: Client, data: object);
		public channel: GuildChannel;
		public code: string;
		public readonly deletable: boolean;
		public readonly createdAt: Date | null;
		public createdTimestamp: number | null;
		public readonly expiresAt: Date | null;
		public readonly expiresTimestamp: number | null;
		public guild: Guild | null;
		public inviter: User | null;
		public maxAge: number | null;
		public maxUses: number | null;
		public memberCount: number;
		public presenceCount: number;
		public targetUser: User | null;
		public targetUserType: TargetUser | null;
		public temporary: boolean | null;
		public readonly url: string;
		public uses: number | null;
		public delete(reason?: string): Promise<Invite>;
		public toJSON(): object;
		public toString(): string;
	}

	export class Message extends Base {
		constructor(client: Client, data: object, channel: TextChannel | DMChannel);
		private _edits: Message[];
		private patch(data: object): void;

		public activity: GroupActivity | null;
		public application: ClientApplication | null;
		public attachments: Collection<Snowflake, MessageAttachment>;
		public author: User | null;
		public channel: TextChannel | DMChannel;
		public readonly cleanContent: string;
		public content: string;
		public readonly createdAt: Date;
		public createdTimestamp: number;
		public readonly deletable: boolean;
		public deleted: boolean;
		public readonly editable: boolean;
		public readonly editedAt: Date | null;
		public editedTimestamp: number | null;
		public readonly edits: Message[];
		public embeds: MessageEmbed[];
		public readonly guild: Guild | null;
		public id: Snowflake;
		public readonly member: GuildMember | null;
		public mentions: MessageMentions;
		public nonce: string;
		public readonly partial: boolean;
		public readonly pinnable: boolean;
		public pinned: boolean;
		public reactions: ReactionStore;
		public system: boolean;
		public tts: boolean;
		public type: MessageType;
		public readonly url: string;
		public webhookID: Snowflake | null;
		public awaitReactions(filter: CollectorFilter, options?: AwaitReactionsOptions): Promise<Collection<Snowflake, MessageReaction>>;
		public createReactionCollector(filter: CollectorFilter, options?: ReactionCollectorOptions): ReactionCollector;
		public delete(options?: { timeout?: number, reason?: string }): Promise<Message>;
		public edit(content: StringResolvable, options?: MessageEditOptions | MessageEmbed): Promise<Message>;
		public edit(options: MessageEditOptions | MessageEmbed | APIMessage): Promise<Message>;
		public equals(message: Message, rawData: object): boolean;
		public fetchWebhook(): Promise<Webhook>;
		public fetch(): Promise<Message>;
		public pin(): Promise<Message>;
		public react(emoji: EmojiIdentifierResolvable): Promise<MessageReaction>;
		public reply(content?: StringResolvable, options?: MessageOptions | MessageAdditions): Promise<Message | Message[]>;
		public reply(options?: MessageOptions | MessageAdditions | APIMessage): Promise<Message | Message[]>;
		public toJSON(): object;
		public toString(): string;
		public unpin(): Promise<Message>;
	}

	export class MessageAttachment {
		constructor(attachment: BufferResolvable | Stream, name?: string, data?: object);

		public attachment: BufferResolvable | Stream;
		public height: number | null;
		public id: Snowflake;
		public name?: string;
		public proxyURL: string;
		public size: number;
		public url: string;
		public width: number | null;
		public setFile(attachment: BufferResolvable | Stream, name?: string): this;
		public setName(name: string): this;
		public toJSON(): object;
	}

	export class MessageCollector extends Collector<Snowflake, Message> {
		constructor(channel: TextChannel | DMChannel, filter: CollectorFilter, options?: MessageCollectorOptions);
		public channel: Channel;
		public options: MessageCollectorOptions;
		public received: number;

		public collect(message: Message): Snowflake;
		public dispose(message: Message): Snowflake;
		public endReason(): string;
	}

	export class MessageEmbed {
		constructor(data?: MessageEmbed | MessageEmbedOptions);
		private _apiTransform(): MessageEmbedOptions;

		public author: { name?: string; url?: string; iconURL?: string; proxyIconURL?: string } | null;
		public color: number;
		public readonly createdAt: Date | null;
		public description: string;
		public fields: EmbedField[];
		public files: (MessageAttachment | string | FileOptions)[];
		public footer: { text?: string; iconURL?: string; proxyIconURL?: string } | null;
		public readonly hexColor: string | null;
		public image: { url: string; proxyURL?: string; height?: number; width?: number; } | null;
		public readonly length: number;
		public provider: { name: string; url: string; };
		public thumbnail: { url: string; proxyURL?: string; height?: number; width?: number; } | null;
		public timestamp: number | null;
		public title: string;
		public type: string;
		public url: string;
		public readonly video: { url?: string; proxyURL?: string; height?: number; width?: number } | null;
		public addBlankField(inline?: boolean): this;
		public addField(name: StringResolvable, value: StringResolvable, inline?: boolean): this;
		public attachFiles(file: (MessageAttachment | FileOptions | string)[]): this;
		public setAuthor(name: StringResolvable, iconURL?: string, url?: string): this;
		public setColor(color: ColorResolvable): this;
		public setDescription(description: StringResolvable): this;
		public setFooter(text: StringResolvable, iconURL?: string): this;
		public setImage(url: string): this;
		public setThumbnail(url: string): this;
		public setTimestamp(timestamp?: Date | number): this;
		public setTitle(title: StringResolvable): this;
		public setURL(url: string): this;
		public spliceField(index: number, deleteCount: number, name?: StringResolvable, value?: StringResolvable, inline?: boolean): this;
		public toJSON(): object;

		public static checkField(name: StringResolvable, value: StringResolvable, inline?: boolean): Required<EmbedField>;
	}

	export class MessageMentions {
		constructor(message: Message, users: object[] | Collection<Snowflake, User>, roles: Snowflake[] | Collection<Snowflake, Role>, everyone: boolean);
		private _channels: Collection<Snowflake, GuildChannel> | null;
		private readonly _content: Message;
		private _members: Collection<Snowflake, GuildMember> | null;

		public readonly channels: Collection<Snowflake, TextChannel>;
		public readonly client: Client;
		public everyone: boolean;
		public readonly guild: Guild;
		public has(data: User | GuildMember | Role | GuildChannel, options?: {
			ignoreDirect?: boolean;
			ignoreRoles?: boolean;
			ignoreEveryone?: boolean;
		}): boolean;
		public readonly members: Collection<Snowflake, GuildMember> | null;
		public roles: Collection<Snowflake, Role>;
		public users: Collection<Snowflake, User>;
		public toJSON(): object;

		public static CHANNELS_PATTERN: RegExp;
		public static EVERYONE_PATTERN: RegExp;
		public static ROLES_PATTERN: RegExp;
		public static USERS_PATTERN: RegExp;
	}

	export class MessageReaction {
		constructor(client: Client, data: object, message: Message);
		private _emoji: GuildEmoji | ReactionEmoji;

		public count: number;
		public readonly emoji: GuildEmoji | ReactionEmoji;
		public me: boolean;
		public message: Message;
		public users: ReactionUserStore;
		public toJSON(): object;
	}

	export class PermissionOverwrites {
		constructor(guildChannel: GuildChannel, data?: object);
		public allow: Readonly<Permissions>;
		public readonly channel: GuildChannel;
		public deny: Readonly<Permissions>;
		public id: Snowflake;
		public type: OverwriteType;
		public update(options: PermissionOverwriteOption, reason?: string): Promise<PermissionOverwrites>;
		public delete(reason?: string): Promise<PermissionOverwrites>;
		public toJSON(): object;
		public static resolveOverwriteOptions(options: ResolvedOverwriteOptions, initialPermissions: { allow?: PermissionResolvable, deny?: PermissionResolvable }): ResolvedOverwriteOptions;
		public static resolve(overwrite: OverwriteResolvable, guild: Guild): RawOverwriteData;
	}

	export class Permissions extends BitField<PermissionString> {
		public has(permission: PermissionResolvable, checkAdmin?: boolean): boolean;

		public static ALL: number;
		public static DEFAULT: number;
		public static FLAGS: PermissionFlags;
		public static resolve(permission?: PermissionResolvable): number;
	}

	export class Presence {
		constructor(client: Client, data?: object);
		public activity: Activity | null;
		public clientStatus: ClientPresenceStatusData | null;
		public flags: Readonly<ActivityFlags>;
		public guild: Guild | null;
		public readonly member: GuildMember | null;
		public status: PresenceStatus;
		public readonly user: User | null;
		public equals(presence: Presence): boolean;
	}

	export class ReactionCollector extends Collector<Snowflake, MessageReaction> {
		constructor(message: Message, filter: CollectorFilter, options?: ReactionCollectorOptions);
		public message: Message;
		public options: ReactionCollectorOptions;
		public total: number;
		public users: Collection<Snowflake, User>;

		public static key(reaction: MessageReaction): Snowflake | string;

		public collect(reaction: MessageReaction): Snowflake | string;
		public dispose(reaction: MessageReaction, user: User): Snowflake | string;
		public empty(): void;
		public endReason(): string | null;

		public on(event: 'collect', listener: (reaction: MessageReaction, user: User) => void): this;
		public on(event: 'dispose', listener: (reaction: MessageReaction, user: User) => void): this;
		public on(event: 'end', listener: (collected: Collection<Snowflake, MessageReaction>, reason: string) => void): this;
		public on(event: 'remove', listener: (reaction: MessageReaction, user: User) => void): this;
		public on(event: string, listener: Function): this;

		public once(event: 'collect', listener: (reaction: MessageReaction, user: User) => void): this;
		public once(event: 'dispose', listener: (reaction: MessageReaction, user: User) => void): this;
		public once(event: 'end', listener: (collected: Collection<Snowflake, MessageReaction>, reason: string) => void): this;
		public once(event: 'remove', listener: (reaction: MessageReaction, user: User) => void): this;
		public once(event: string, listener: Function): this;
	}

	export class ReactionEmoji extends Emoji {
		constructor(reaction: MessageReaction, emoji: object);
		public reaction: MessageReaction;
		public toJSON(): object;
	}

	export class RichPresenceAssets {
		constructor(activity: Activity, assets: object);
		public largeImage: Snowflake | null;
		public largeText: string | null;
		public smallImage: Snowflake | null;
		public smallText: string | null;
		public largeImageURL(options: AvatarOptions): string | null;
		public smallImageURL(options: AvatarOptions): string | null;
	}

	export class Role extends Base {
		constructor(client: Client, data: object, guild: Guild);
		public color: number;
		public readonly createdAt: Date;
		public readonly createdTimestamp: number;
		public deleted: boolean;
		public readonly editable: boolean;
		public guild: Guild;
		public readonly hexColor: string;
		public hoist: boolean;
		public id: Snowflake;
		public managed: boolean;
		public readonly members: Collection<Snowflake, GuildMember>;
		public mentionable: boolean;
		public name: string;
		public permissions: Readonly<Permissions>;
		public readonly position: number;
		public rawPosition: number;
		public comparePositionTo(role: Role): number;
		public delete(reason?: string): Promise<Role>;
		public edit(data: RoleData, reason?: string): Promise<Role>;
		public equals(role: Role): boolean;
		public permissionsIn(channel: ChannelResolvable): Readonly<Permissions>;
		public setColor(color: ColorResolvable, reason?: string): Promise<Role>;
		public setHoist(hoist: boolean, reason?: string): Promise<Role>;
		public setMentionable(mentionable: boolean, reason?: string): Promise<Role>;
		public setName(name: string, reason?: string): Promise<Role>;
		public setPermissions(permissions: PermissionResolvable, reason?: string): Promise<Role>;
		public setPosition(position: number, options?: { relative?: boolean; reason?: string }): Promise<Role>;
		public toJSON(): object;
		public toString(): string;

		public static comparePositions(role1: Role, role2: Role): number;
	}

	export class Shard extends EventEmitter {
		constructor(manager: ShardingManager, id: number);
		private _evals: Map<string, Promise<any>>;
		private _exitListener: Function;
		private _fetches: Map<string, Promise<any>>;
		private _handleExit(respawn?: boolean): void;
		private _handleMessage(message: any): void;

		public args: string[];
		public execArgv: string[];
		public env: object;
		public id: number;
		public manager: ShardingManager;
		public process: ChildProcess | null;
		public ready: boolean;
		public worker: any | null;
		public eval(script: string): Promise<any>;
		public eval<T>(fn: (client: Client) => T): Promise<T[]>;
		public fetchClientValue(prop: string): Promise<any>;
		public kill(): void;
		public respawn(delay?: number, spawnTimeout?: number): Promise<ChildProcess>;
		public send(message: any): Promise<Shard>;
		public spawn(spawnTimeout?: number): Promise<ChildProcess>;

		public on(event: 'death', listener: (child: ChildProcess) => void): this;
		public on(event: 'disconnect' | 'ready' | 'reconnecting', listener: () => void): this;
		public on(event: 'error', listener: (error: Error) => void): this;
		public on(event: 'message', listener: (message: any) => void): this;
		public on(event: 'spawn', listener: (child: ChildProcess) => void): this;
		public on(event: string, listener: Function): this;

		public once(event: 'death', listener: (child: ChildProcess) => void): this;
		public once(event: 'disconnect' | 'ready' | 'reconnecting', listener: () => void): this;
		public once(event: 'error', listener: (error: Error) => void): this;
		public once(event: 'message', listener: (message: any) => void): this;
		public once(event: 'spawn', listener: (child: ChildProcess) => void): this;
		public once(event: string, listener: Function): this;
	}

	export class ShardClientUtil {
		constructor(client: Client, mode: ShardingManagerMode);
		private _handleMessage(message: any): void;
		private _respond(type: string, message: any): void;

		public client: Client;
		public readonly count: number;
		public readonly ids: number[];
		public mode: ShardingManagerMode;
		public parentPort: any | null;
		public broadcastEval(script: string): Promise<any[]>;
		public broadcastEval<T>(fn: (client: Client) => T): Promise<T[]>;
		public fetchClientValues(prop: string): Promise<any[]>;
		public respawnAll(shardDelay?: number, respawnDelay?: number, spawnTimeout?: number): Promise<void>;
		public send(message: any): Promise<void>;

		public static singleton(client: Client, mode: ShardingManagerMode): ShardClientUtil;
	}

	export class ShardingManager extends EventEmitter {
		constructor(file: string, options?: {
			totalShards?: number | 'auto';
			mode?: ShardingManagerMode;
			respawn?: boolean;
			shardArgs?: string[];
			token?: string;
			execArgv?: string[];
		});

		public file: string;
		public respawn: boolean;
		public shardArgs: string[];
		public shards: Collection<number, Shard>;
		public token: string | null;
		public totalShards: number | 'auto';
		public broadcast(message: any): Promise<Shard[]>;
		public broadcastEval(script: string): Promise<any[]>;
		public createShard(id: number): Shard;
		public fetchClientValues(prop: string): Promise<any[]>;
		public respawnAll(shardDelay?: number, respawnDelay?: number, spawnTimeout?: number): Promise<Collection<number, Shard>>;
		public spawn(amount?: number | 'auto', delay?: number, spawnTimeout?: number): Promise<Collection<number, Shard>>;

		public on(event: 'shardCreate', listener: (shard: Shard) => void): this;

		public once(event: 'shardCreate', listener: (shard: Shard) => void): this;
	}

	export class SnowflakeUtil {
		public static deconstruct(snowflake: Snowflake): DeconstructedSnowflake;
		public static generate(timestamp?: number | Date): Snowflake;
	}

	const VolumeMixin: <T>(base: Constructable<T>) => Constructable<T & VolumeInterface>;

	class StreamDispatcher extends VolumeMixin(Writable) {
		constructor(player: object, options?: StreamOptions, streams?: object);
		public player: object;
		public pausedSince: number;
		public broadcast: VoiceBroadcast | null;
		public readonly paused: boolean;
		public readonly pausedTime: boolean | null;
		public readonly streamTime: number;
		public readonly totalStreamTime: number;
		public readonly bitrateEditable: boolean;

		public setBitrate(value: number | 'auto'): boolean;
		public setPLP(value: number): boolean;
		public setFEC(enabled: boolean): boolean;
		public pause(silence?: boolean): void;
		public resume(): void;

		public on(event: 'close', listener: () => void): this;
		public on(event: 'debug', listener: (info: string) => void): this;
		public on(event: 'drain', listener: () => void): this;
		public on(event: 'end', listener: () => void): this;
		public on(event: 'error', listener: (err: Error) => void): this;
		public on(event: 'finish', listener: () => void): this;
		public on(event: 'pipe', listener: (src: Readable) => void): this;
		public on(event: 'start', listener: () => void): this;
		public on(event: 'speaking', listener: (speaking: boolean) => void): this;
		public on(event: 'unpipe', listener: (src: Readable) => void): this;
		public on(event: 'volumeChange', listener: (oldVolume: number, newVolume: number) => void): this;
		public on(event: string, listener: Function): this;

		public once(event: 'close', listener: () => void): this;
		public once(event: 'debug', listener: (info: string) => void): this;
		public once(event: 'drain', listener: () => void): this;
		public once(event: 'end', listener: () => void): this;
		public once(event: 'error', listener: (err: Error) => void): this;
		public once(event: 'finish', listener: () => void): this;
		public once(event: 'pipe', listener: (src: Readable) => void): this;
		public once(event: 'start', listener: () => void): this;
		public once(event: 'speaking', listener: (speaking: boolean) => void): this;
		public once(event: 'unpipe', listener: (src: Readable) => void): this;
		public on(event: 'volumeChange', listener: (oldVolume: number, newVolume: number) => void): this;
		public once(event: string, listener: Function): this;
	}

	export class Speaking extends BitField<SpeakingString> {
		public static FLAGS: Record<SpeakingString, number>;
		public static resolve(bit?: BitFieldResolvable<SpeakingString>): number;
	}

	export class Structures {
		static get<K extends keyof Extendable>(structure: K): Extendable[K];
		static get(structure: string): Function;
		static extend<K extends keyof Extendable, T extends Extendable[K]>(structure: K, extender: (baseClass: Extendable[K]) => T): T;
		static extend<T extends Function>(structure: string, extender: (baseClass: typeof Function) => T): T;
	}

	export class TextChannel extends TextBasedChannel(GuildChannel) {
		constructor(guild: Guild, data?: object);
		public readonly members: Collection<Snowflake, GuildMember>;
		public messages: MessageStore;
		public nsfw: boolean;
		public rateLimitPerUser: number;
		public topic: string;
		public createWebhook(name: string, options?: { avatar?: BufferResolvable | Base64Resolvable, reason?: string }): Promise<Webhook>;
		public setNSFW(nsfw: boolean, reason?: string): Promise<TextChannel>;
		public setRateLimitPerUser(rateLimitPerUser: number, reason?: string): Promise<TextChannel>;
		public fetchWebhooks(): Promise<Collection<Snowflake, Webhook>>;
	}

	export class NewsChannel extends TextBasedChannel(GuildChannel) {
		constructor(guild: Guild, data?: object);
		public readonly members: Collection<Snowflake, GuildMember>;
		public messages: MessageStore;
		public nsfw: boolean;
		public topic: string;
		public createWebhook(name: string, options?: { avatar?: BufferResolvable | Base64Resolvable, reason?: string }): Promise<Webhook>;
		public setNSFW(nsfw: boolean, reason?: string): Promise<NewsChannel>;
		public fetchWebhooks(): Promise<Collection<Snowflake, Webhook>>;
	}

	export class User extends PartialTextBasedChannel(Base) {
		constructor(client: Client, data: object);
		public avatar: string | null;
		public bot: boolean;
		public readonly createdAt: Date;
		public readonly createdTimestamp: number;
		public discriminator: string;
		public readonly defaultAvatarURL: string;
		public readonly dmChannel: DMChannel;
		public id: Snowflake;
		public locale: string;
		public readonly partial: boolean;
		public readonly presence: Presence;
		public readonly tag: string;
		public username: string;
		public avatarURL(options?: AvatarOptions): string | null;
		public createDM(): Promise<DMChannel>;
		public deleteDM(): Promise<DMChannel>;
		public displayAvatarURL(options?: AvatarOptions): string;
		public equals(user: User): boolean;
		public fetch(): Promise<User>;
		public toString(): string;
		public typingDurationIn(channel: ChannelResolvable): number;
		public typingIn(channel: ChannelResolvable): boolean;
		public typingSinceIn(channel: ChannelResolvable): Date;
	}

	export class Util {
		public static basename(path: string, ext?: string): string;
		public static binaryToID(num: string): Snowflake;
		public static cleanContent(str: string, message: Message): string;
		public static cloneObject(obj: object): object;
		public static convertToBuffer(ab: ArrayBuffer | string): Buffer;
		public static delayFor(ms: number): Promise<void>;
		public static discordSort<K, V extends { rawPosition: number; id: string; }>(collection: Collection<K, V>): Collection<K, V>;
		public static escapeMarkdown(text: string, options?: { codeBlock?: boolean, inlineCode?: boolean, bold?: boolean, italic?: boolean, underline?: boolean, strikethrough?: boolean, spoiler?: boolean, inlineCodeContent?: boolean, codeBlockContent?: boolean }): string;
		public static escapeCodeBlock(text: string): string;
		public static escapeInlineCode(text: string): string;
		public static escapeBold(text: string): string;
		public static escapeItalic(text: string): string;
		public static escapeUnderline(text: string): string;
		public static escapeStrikethrough(text: string): string;
		public static escapeSpoiler(text: string): string;
		public static cleanCodeBlockContent(text: string): string;
		public static fetchRecommendedShards(token: string, guildsPerShard?: number): Promise<number>;
		public static flatten(obj: object, ...props: { [key: string]: boolean | string }[]): object;
		public static idToBinary(num: Snowflake): string;
		public static makeError(obj: { name: string, message: string, stack: string }): Error;
		public static makePlainError(err: Error): { name: string, message: string, stack: string };
		public static mergeDefault(def: object, given: object): object;
		public static moveElementInArray(array: any[], element: any, newIndex: number, offset?: boolean): number;
		public static parseEmoji(text: string): { animated: boolean; name: string; id: string | null; } | null;
		public static resolveColor(color: ColorResolvable): number;
		public static resolveString(data: StringResolvable): string;
		public static setPosition<T extends (Channel | Role)>(
			item: T,
			position: number,
			relative: boolean,
			sorted: Collection<Snowflake, T>,
			route: object,
			reason?: string
		): Promise<{ id: Snowflake; position: number }[]>;
		public static splitMessage(text: string, options?: SplitOptions): string[];
		public static str2ab(str: string): ArrayBuffer;
	}

	class VoiceBroadcast extends EventEmitter {
		constructor(client: Client);
		public client: Client;
		public dispatchers: StreamDispatcher[];
		public readonly dispatcher: BroadcastDispatcher;
		public play(input: string | Readable, options?: StreamOptions): BroadcastDispatcher;

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
		constructor(guild: Guild, data?: object);
		public bitrate: number;
		public readonly connection: VoiceConnection;
		public readonly editable: boolean;
		public readonly full: boolean;
		public readonly joinable: boolean;
		public readonly members: Collection<Snowflake, GuildMember>;
		public readonly speakable: boolean;
		public userLimit: number;
		public join(): Promise<VoiceConnection>;
		public leave(): void;
		public setBitrate(bitrate: number, reason?: string): Promise<VoiceChannel>;
		public setUserLimit(userLimit: number, reason?: string): Promise<VoiceChannel>;
	}

	class VoiceConnection extends EventEmitter {
		constructor(voiceManager: ClientVoiceManager, channel: VoiceChannel);
		private authentication: object;
		private sockets: object;
		private ssrcMap: Map<number, boolean>;
		private _speaking: Map<Snowflake, Readonly<Speaking>>;
		private _disconnect(): void;
		private authenticate(): void;
		private authenticateFailed(reason: string): void;
		private checkAuthenticated(): void;
		private cleanup(): void;
		private connect(): void;
		private onReady(data: object): void;
		private onSessionDescription(mode: string, secret: string): void;
		private onSpeaking(data: object): void;
		private reconnect(token: string, endpoint: string): void;
		private sendVoiceStateUpdate(options: object): Promise<Shard>;
		private setSessionID(sessionID: string): void;
		private setSpeaking(value: BitFieldResolvable<SpeakingString>): void;
		private setTokenAndEndpoint(token: string, endpoint: string): void;
		private updateChannel(channel: VoiceChannel): void;

		public channel: VoiceChannel;
		public readonly client: Client;
		public readonly dispatcher: StreamDispatcher;
		public player: object;
		public receiver: VoiceReceiver;
		public speaking: Readonly<Speaking>;
		public status: VoiceStatus;
		public readonly voice: VoiceState;
		public voiceManager: ClientVoiceManager;
		public disconnect(): void;
		public play(input: VoiceBroadcast | Readable | string, options?: StreamOptions): StreamDispatcher;

		public on(event: 'authenticated', listener: () => void): this;
		public on(event: 'closing', listener: () => void): this;
		public on(event: 'debug', listener: (message: string) => void): this;
		public on(event: 'disconnect', listener: (error: Error) => void): this;
		public on(event: 'error', listener: (error: Error) => void): this;
		public on(event: 'failed', listener: (error: Error) => void): this;
		public on(event: 'newSession', listener: () => void): this;
		public on(event: 'ready', listener: () => void): this;
		public on(event: 'reconnecting', listener: () => void): this;
		public on(event: 'speaking', listener: (user: User, speaking: Readonly<Speaking>) => void): this;
		public on(event: 'warn', listener: (warning: string | Error) => void): this;
		public on(event: string, listener: Function): this;

		public once(event: 'authenticated', listener: () => void): this;
		public once(event: 'closing', listener: () => void): this;
		public once(event: 'debug', listener: (message: string) => void): this;
		public once(event: 'disconnect', listener: (error: Error) => void): this;
		public once(event: 'error', listener: (error: Error) => void): this;
		public once(event: 'failed', listener: (error: Error) => void): this;
		public once(event: 'newSession', listener: () => void): this;
		public once(event: 'ready', listener: () => void): this;
		public once(event: 'reconnecting', listener: () => void): this;
		public once(event: 'speaking', listener: (user: User, speaking: Readonly<Speaking>) => void): this;
		public once(event: 'warn', listener: (warning: string | Error) => void): this;
		public once(event: string, listener: Function): this;
	}

	class VoiceReceiver extends EventEmitter {
		constructor(connection: VoiceConnection);
		public createStream(user: UserResolvable, options?: { mode?: 'opus' | 'pcm', end?: 'silence' | 'manual' }): Readable;

		public on(event: 'debug', listener: (error: Error | string) => void): this;
		public on(event: string, listener: Function): this;

		public once(event: 'debug', listener: (error: Error | string) => void): this;
		public once(event: string, listener: Function): this;
	}

	export class VoiceRegion {
		constructor(data: object);
		public custom: boolean;
		public deprecated: boolean;
		public id: string;
		public name: string;
		public optimal: boolean;
		public vip: boolean;
		public toJSON(): object;
	}

	export class VoiceState extends Base {
		constructor(guild: Guild, data: object);
		public readonly channel: VoiceChannel | null;
		public channelID?: Snowflake;
		public readonly connection: VoiceConnection | null;
		public readonly deaf?: boolean;
		public guild: Guild;
		public id: Snowflake;
		public readonly member: GuildMember | null;
		public readonly mute?: boolean;
		public selfDeaf?: boolean;
		public selfMute?: boolean;
		public serverDeaf?: boolean;
		public serverMute?: boolean;
		public sessionID?: string;
		public readonly speaking: boolean | null;

		public setDeaf(deaf: boolean, reason?: string): Promise<GuildMember>;
		public setMute(mute: boolean, reason?: string): Promise<GuildMember>;
		public setChannel(channel: ChannelResolvable | null, reason?: string): Promise<GuildMember>;
		public setSelfDeaf(deaf: boolean): Promise<boolean>;
		public setSelfMute(mute: boolean): Promise<boolean>;
	}

	class VolumeInterface extends EventEmitter {
		constructor(options?: { volume?: number })
		public readonly volume: number;
		public readonly volumeDecibels: number;
		public readonly volumeEditable: boolean;
		public readonly volumeLogarithmic: number;
		public setVolume(volume: number): void;
		public setVolumeDecibels(db: number): void;
		public setVolumeLogarithmic(value: number): void;

		public on(event: 'volumeChange', listener: (oldVolume: number, newVolume: number) => void): this;

		public once(event: 'volumeChange', listener: (oldVolume: number, newVolume: number) => void): this;
	}

	export class Webhook extends WebhookMixin() {
		constructor(client: Client, data?: object);
		public avatar: string;
		public channelID: Snowflake;
		public guildID: Snowflake;
		public name: string;
		public owner: User | object | null;
		public readonly url: string;
	}

	export class WebhookClient extends WebhookMixin(BaseClient) {
		constructor(id: string, token: string, options?: ClientOptions);
	}

	export class WebSocketManager extends EventEmitter {
		constructor(client: Client);
		private totalShards: number | string;
		private shardQueue: Set<WebSocketShard>;
		private packetQueue: object[];
		private destroyed: boolean;
		private reconnecting: boolean;
		private sessionStartLimit?: { total: number; remaining: number; reset_after: number; };

		public readonly client: Client;
		public gateway?: string;
		public shards: Collection<number, WebSocketShard>;
		public status: Status;
		public readonly ping: number;

		public on(event: WSEventType, listener: (data: any, shardID: number) => void): this;
		public once(event: WSEventType, listener: (data: any, shardID: number) => void): this;
		private debug(message: string, shard?: WebSocketShard): void;
		private connect(): Promise<void>;
		private createShards(): Promise<void>;
		private reconnect(): Promise<void>;
		private broadcast(packet: object): void;
		private destroy(): void;
		private _handleSessionLimit(remaining?: number, resetAfter?: number): Promise<void>;
		private handlePacket(packet?: object, shard?: WebSocketShard): Promise<boolean>;
		private checkReady(): boolean;
		private triggerReady(): void;
	}

	export class WebSocketShard extends EventEmitter {
		constructor(manager: WebSocketManager, id: number);
		private sequence: number;
		private closeSequence: number;
		private sessionID?: string;
		private lastPingTimestamp: number;
		private lastHeartbeatAcked: boolean;
		private ratelimit: { queue: object[]; total: number; remaining: number; time: 60e3; timer: NodeJS.Timeout | null; };
		private connection: WebSocket | null;
		private helloTimeout: NodeJS.Timeout | null;
		private eventsAttached: boolean;

		public manager: WebSocketManager;
		public id: number;
		public status: Status;
		public pings: [number, number, number];
		public readonly ping: number;

		private debug(message: string): void;
		private connect(): Promise<void>;
		private onOpen(): void;
		private onMessage(event: MessageEvent): void;
		private onError(error: ErrorEvent | object): void;
		private onClose(event: CloseEvent): void;
		private onPacket(packet: object): void;
		private setHelloTimeout(time?: number): void;
		private setHeartbeatTimer(time: number): void;
		private sendHeartbeat(): void;
		private ackHeartbeat(): void;
		private identify(): void;
		private identifyNew(): void;
		private identifyResume(): void;
		private _send(data: object): void;
		private processQueue(): void;
		private destroy(closeCode: number): void;

		public send(data: object): void;
		public on(event: 'ready', listener: () => void): this;
		public on(event: 'resumed', listener: () => void): this;
		public on(event: 'close', listener: (event: CloseEvent) => void): this;
		public on(event: 'invalidSession', listener: () => void): this;
		public on(event: string, listener: Function): this;

		public once(event: 'ready', listener: () => void): this;
		public once(event: 'resumed', listener: () => void): this;
		public once(event: 'close', listener: (event: CloseEvent) => void): this;
		public once(event: 'invalidSession', listener: () => void): this;
		public once(event: string, listener: Function): this;
	}

//#endregion

//#region Stores

	export class ChannelStore extends DataStore<Snowflake, Channel, typeof Channel, ChannelResolvable> {
		constructor(client: Client, iterable: Iterable<any>, options?: { lru: boolean });
		constructor(client: Client, options?: { lru: boolean });
		public fetch(id: Snowflake, cache?: boolean): Promise<Channel>;
	}

	export class DataStore<K, V, VConstructor = Constructable<V>, R = any> extends Collection<K, V> {
		constructor(client: Client, iterable: Iterable<any>, holds: VConstructor);
		public static readonly [Symbol.species]: typeof Collection;
		public client: Client;
		public holds: VConstructor;
		public add(data: any, cache?: boolean, { id, extras }?: { id: K, extras: any[] }): V;
		public remove(key: K): void;
		public resolve(resolvable: R): V;
		public resolveID(resolvable: R): K;
	}

	export class GuildEmojiRoleStore extends OverridableDataStore<Snowflake, Role, typeof Role, RoleResolvable> {
		constructor(emoji: GuildEmoji);
		public add(roleOrRoles: RoleResolvable | RoleResolvable[] | Collection<Snowflake, Role>): Promise<GuildEmoji>;
		public set(roles: RoleResolvable[] | Collection<Snowflake, Role>): Promise<GuildEmoji>;
		public remove(roleOrRoles: RoleResolvable | RoleResolvable[] | Collection<Snowflake, Role>): Promise<GuildEmoji>;
	}

	export class GuildEmojiStore extends DataStore<Snowflake, GuildEmoji, typeof GuildEmoji, EmojiResolvable> {
		constructor(guild: Guild, iterable?: Iterable<any>);
		public create(attachment: BufferResolvable | Base64Resolvable, name: string, options?: GuildEmojiCreateOptions): Promise<GuildEmoji>;
		public resolveIdentifier(emoji: EmojiIdentifierResolvable): string | null;
	}

	export class GuildChannelStore extends DataStore<Snowflake, GuildChannel, typeof GuildChannel, GuildChannelResolvable> {
		constructor(guild: Guild, iterable?: Iterable<any>);
		public create(name: string, options?: GuildCreateChannelOptions): Promise<TextChannel | VoiceChannel | CategoryChannel>;
	}

	// Hacky workaround because changing the signature of an overridden method errors
	class OverridableDataStore<V, K, VConstructor = Constructable<V>, R = any> extends DataStore<V, K, VConstructor, R> {
		public add(data: any, cache: any): any;
		public set(key: any): any;
	}

	export class GuildMemberRoleStore extends OverridableDataStore<Snowflake, Role, typeof Role, RoleResolvable> {
		constructor(member: GuildMember);
		public readonly hoist: Role | null;
		public readonly color: Role | null;
		public readonly highest: Role;

		public add(roleOrRoles: RoleResolvable | RoleResolvable[] | Collection<Snowflake, Role>, reason?: string): Promise<GuildMember>;
		public set(roles: RoleResolvable[] | Collection<Snowflake, Role>, reason?: string): Promise<GuildMember>;
		public remove(roleOrRoles: RoleResolvable | RoleResolvable[] | Collection<Snowflake, Role>, reason?: string): Promise<GuildMember>;
	}

	export class GuildMemberStore extends DataStore<Snowflake, GuildMember, typeof GuildMember, GuildMemberResolvable> {
		constructor(guild: Guild, iterable?: Iterable<any>);
		public ban(user: UserResolvable, options?: BanOptions): Promise<GuildMember | User | Snowflake>;
		public fetch(options: UserResolvable | FetchMemberOptions): Promise<GuildMember>;
		public fetch(): Promise<GuildMemberStore>;
		public fetch(options: FetchMembersOptions): Promise<Collection<Snowflake, GuildMember>>;
		public prune(options: GuildPruneMembersOptions & { dry?: false, count: false }): Promise<null>;
		public prune(options?: GuildPruneMembersOptions): Promise<number>;
		public unban(user: UserResolvable, reason?: string): Promise<User>;
	}

	export class GuildStore extends DataStore<Snowflake, Guild, typeof Guild, GuildResolvable> {
		constructor(client: Client, iterable?: Iterable<any>);
		public create(name: string, options?: { region?: string, icon: BufferResolvable | Base64Resolvable | null }): Promise<Guild>;
	}

	export class MessageStore extends DataStore<Snowflake, Message, typeof Message, MessageResolvable> {
		constructor(channel: TextChannel | DMChannel, iterable?: Iterable<any>);
		public fetch(message: Snowflake, cache?: boolean): Promise<Message>;
		public fetch(options?: ChannelLogsQueryOptions, cache?: boolean): Promise<Collection<Snowflake, Message>>;
		public fetchPinned(cache?: boolean): Promise<Collection<Snowflake, Message>>;
		public remove(message: MessageResolvable, reason?: string): Promise<void>;
	}

	export class PresenceStore extends DataStore<Snowflake, Presence, typeof Presence, PresenceResolvable> {
		constructor(client: Client, iterable?: Iterable<any>);
	}

	export class ReactionStore extends DataStore<Snowflake, MessageReaction, typeof MessageReaction, MessageReactionResolvable> {
		constructor(message: Message, iterable?: Iterable<any>);
		public removeAll(): Promise<Message>;
	}

	export class ReactionUserStore extends DataStore<Snowflake, User, typeof User, UserResolvable> {
		constructor(client: Client, iterable: Iterable<any> | undefined, reaction: MessageReaction);
		public fetch(options?: { limit?: number, after?: Snowflake, before?: Snowflake }): Promise<Collection<Snowflake, User>>;
		public remove(user?: UserResolvable): Promise<MessageReaction>;
	}

	export class RoleStore extends DataStore<Snowflake, Role, typeof Role, RoleResolvable> {
		constructor(guild: Guild, iterable?: Iterable<any>);
		public readonly everyone: Role | null;
		public readonly highest: Role;

		public create(options?: { data?: RoleData, reason?: string }): Promise<Role>;
		public fetch(id: Snowflake, cache?: boolean): Promise<Role | null>;
		public fetch(id?: Snowflake, cache?: boolean): Promise<this>;
	}

	export class UserStore extends DataStore<Snowflake, User, typeof User, UserResolvable> {
		constructor(client: Client, iterable?: Iterable<any>);
		public fetch(id: Snowflake, cache?: boolean): Promise<User>;
	}

	export class VoiceStateStore extends DataStore<Snowflake, VoiceState, typeof VoiceState> {
		constructor(guild: Guild, iterable?: Iterable<any>);
	}

//#endregion

//#region Mixins

	// Model the TextBasedChannel mixin system, allowing application of these fields
	// to the classes that use these methods without having to manually add them
	// to each of those classes

	type Constructable<T> = new (...args: any[]) => T;
	const PartialTextBasedChannel: <T>(Base?: Constructable<T>) => Constructable<T & PartialTextBasedChannelFields>;
	const TextBasedChannel: <T>(Base?: Constructable<T>) => Constructable<T & TextBasedChannelFields>;

	interface PartialTextBasedChannelFields {
		lastMessageID: Snowflake | null;
		lastMessageChannelID: Snowflake | null;
		readonly lastMessage: Message | null;
		lastPinTimestamp: number | null;
		readonly lastPinAt: Date;
		send(content?: StringResolvable, options?: MessageOptions | MessageAdditions): Promise<Message>;
		send(content?: StringResolvable, options?: MessageOptions & { split?: false } | MessageAdditions): Promise<Message>;
		send(content?: StringResolvable, options?: MessageOptions & { split: true | SplitOptions } | MessageAdditions): Promise<Message[]>;
		send(options?: MessageOptions | MessageAdditions | APIMessage): Promise<Message>;
		send(options?: MessageOptions & { split?: false } | MessageAdditions | APIMessage): Promise<Message>;
		send(options?: MessageOptions & { split: true | SplitOptions } | MessageAdditions | APIMessage): Promise<Message[]>;
	}

	interface TextBasedChannelFields extends PartialTextBasedChannelFields {
		typing: boolean;
		typingCount: number;
		awaitMessages(filter: CollectorFilter, options?: AwaitMessagesOptions): Promise<Collection<Snowflake, Message>>;
		bulkDelete(messages: Collection<Snowflake, Message> | Message[] | Snowflake[] | number, filterOld?: boolean): Promise<Collection<Snowflake, Message>>;
		createMessageCollector(filter: CollectorFilter, options?: MessageCollectorOptions): MessageCollector;
		startTyping(count?: number): Promise<void>;
		stopTyping(force?: boolean): void;
	}

	const WebhookMixin: <T>(Base?: Constructable<T>) => Constructable<T & WebhookFields>;

	interface WebhookFields {
		readonly client: Client;
		id: Snowflake;
		token: string;
		delete(reason?: string): Promise<void>;
		edit(options: WebhookEditData): Promise<Webhook>;
		send(content?: StringResolvable, options?: WebhookMessageOptions & { split?: false } | MessageAdditions): Promise<Message>;
		send(content?: StringResolvable, options?: WebhookMessageOptions & { split: true | SplitOptions } | MessageAdditions): Promise<Message[]>;
		send(options?: WebhookMessageOptions & { split?: false } | MessageAdditions | APIMessage): Promise<Message>;
		send(options?: WebhookMessageOptions & { split: true | SplitOptions } | MessageAdditions | APIMessage): Promise<Message[]>;
		sendSlackMessage(body: object): Promise<boolean>;
	}

//#endregion

//#region Typedefs

	type ActivityFlagsString = 'INSTANCE'
		| 'JOIN'
		| 'SPECTATE'
		| 'JOIN_REQUEST'
		| 'SYNC'
		| 'PLAY';

	type ActivityType = 'PLAYING'
		| 'STREAMING'
		| 'LISTENING'
		| 'WATCHING';

	interface APIErrror {
		UNKNOWN_ACCOUNT: number;
		UNKNOWN_APPLICATION: number;
		UNKNOWN_CHANNEL: number;
		UNKNOWN_GUILD: number;
		UNKNOWN_INTEGRATION: number;
		UNKNOWN_INVITE: number;
		UNKNOWN_MEMBER: number;
		UNKNOWN_MESSAGE: number;
		UNKNOWN_OVERWRITE: number;
		UNKNOWN_PROVIDER: number;
		UNKNOWN_ROLE: number;
		UNKNOWN_TOKEN: number;
		UNKNOWN_USER: number;
		UNKNOWN_EMOJI: number;
		UNKNOWN_WEBHOOK: number;
		BOT_PROHIBITED_ENDPOINT: number;
		BOT_ONLY_ENDPOINT: number;
		MAXIMUM_GUILDS: number;
		MAXIMUM_FRIENDS: number;
		MAXIMUM_PINS: number;
		MAXIMUM_ROLES: number;
		MAXIMUM_REACTIONS: number;
		UNAUTHORIZED: number;
		MISSING_ACCESS: number;
		INVALID_ACCOUNT_TYPE: number;
		CANNOT_EXECUTE_ON_DM: number;
		EMBED_DISABLED: number;
		CANNOT_EDIT_MESSAGE_BY_OTHER: number;
		CANNOT_SEND_EMPTY_MESSAGE: number;
		CANNOT_MESSAGE_USER: number;
		CANNOT_SEND_MESSAGES_IN_VOICE_CHANNEL: number;
		CHANNEL_VERIFICATION_LEVEL_TOO_HIGH: number;
		OAUTH2_APPLICATION_BOT_ABSENT: number;
		MAXIMUM_OAUTH2_APPLICATIONS: number;
		INVALID_OAUTH_STATE: number;
		MISSING_PERMISSIONS: number;
		INVALID_AUTHENTICATION_TOKEN: number;
		NOTE_TOO_LONG: number;
		INVALID_BULK_DELETE_QUANTITY: number;
		CANNOT_PIN_MESSAGE_IN_OTHER_CHANNEL: number;
		CANNOT_EXECUTE_ON_SYSTEM_MESSAGE: number;
		BULK_DELETE_MESSAGE_TOO_OLD: number;
		INVITE_ACCEPTED_TO_GUILD_NOT_CONTAINING_BOT: number;
		REACTION_BLOCKED: number;
	}

	interface AddGuildMemberOptions {
		accessToken: String;
		nick?: string;
		roles?: Collection<Snowflake, Role> | RoleResolvable[];
		mute?: boolean;
		deaf?: boolean;
	}

	interface AuditLogChange {
		key: string;
		old?: any;
		new?: any;
	}

	interface AvatarOptions {
		format?: ImageExt;
		size?: ImageSize;
	}

	interface AwaitMessagesOptions extends MessageCollectorOptions {
		errors?: string[];
	}

	interface AwaitReactionsOptions extends ReactionCollectorOptions {
		errors?: string[];
	}

	interface BanOptions {
		days?: number;
		reason?: string;
	}

	type Base64Resolvable = Buffer | Base64String;

	type Base64String = string;

	type BitFieldResolvable<T extends string> = RecursiveArray<T | number | Readonly<BitField<T>>> | T | number | Readonly<BitField<T>>;

	type BufferResolvable = Buffer | string;

	interface ChannelCreationOverwrites {
		allow?: PermissionResolvable | number;
		deny?: PermissionResolvable | number;
		id: RoleResolvable | UserResolvable;
	}

	interface ChannelData {
		name?: string;
		position?: number;
		topic?: string;
		nsfw?: boolean;
		bitrate?: number;
		userLimit?: number;
		parentID?: Snowflake;
		rateLimitPerUser?: number;
		lockPermissions?: boolean;
		permissionOverwrites?: OverwriteResolvable[] | Collection<Snowflake, OverwriteResolvable>;
	}

	interface ChannelLogsQueryOptions {
		limit?: number;
		before?: Snowflake;
		after?: Snowflake;
		around?: Snowflake;
	}

	interface ChannelPosition {
		channel: ChannelResolvable;
		position: number;
	}

	type ChannelResolvable = Channel | Snowflake;

	interface ClientApplicationAsset {
		name: string;
		id: Snowflake;
		type: 'BIG' | 'SMALL';
	}

	interface ClientOptions {
		shards?: number | number[];
		shardCount?: number | 'auto';
		totalShardCount?: number;
		messageCacheMaxSize?: number;
		messageCacheLifetime?: number;
		messageSweepInterval?: number;
		fetchAllMembers?: boolean;
		disableEveryone?: boolean;
		partials?: PartialTypes[];
		restWsBridgeTimeout?: number;
		restTimeOffset?: number;
		restRequestTimeout?: number;
		restSweepInterval?: number;
		retryLimit?: number;
		presence?: PresenceData;
		disabledEvents?: WSEventType[];
		ws?: WebSocketOptions;
		http?: HTTPOptions;
	}

	type CollectorFilter = (...args: any[]) => boolean;

	interface CollectorOptions {
		time?: number;
		idle?: number;
		dispose?: boolean;
	}

	type ColorResolvable = 'DEFAULT'
		| 'WHITE'
		| 'AQUA'
		| 'GREEN'
		| 'BLUE'
		| 'YELLOW'
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
		| 'DARK_VIVID_PINK'
		| 'DARK_GOLD'
		| 'DARK_ORANGE'
		| 'DARK_RED'
		| 'DARK_GREY'
		| 'LIGHT_GREY'
		| 'DARK_NAVY'
		| 'RANDOM'
		| [number, number, number]
		| number
		| string;

	interface DeconstructedSnowflake {
		timestamp: number;
		readonly date: Date;
		workerID: number;
		processID: number;
		increment: number;
		binary: string;
	}

	type DefaultMessageNotifications = 'ALL' | 'MENTIONS';

	interface GuildEmojiEditData {
		name?: string;
		roles?: Collection<Snowflake, Role> | RoleResolvable[];
	}

	interface EmbedField {
		name: string;
		value: string;
		inline?: boolean;
	}

	type EmojiIdentifierResolvable = string | EmojiResolvable;

	type EmojiResolvable = Snowflake | GuildEmoji | ReactionEmoji;

	interface Extendable {
		GuildEmoji: typeof GuildEmoji;
		DMChannel: typeof DMChannel;
		TextChannel: typeof TextChannel;
		VoiceChannel: typeof VoiceChannel;
		CategoryChannel: typeof CategoryChannel;
		GuildMember: typeof GuildMember;
		Guild: typeof Guild;
		Message: typeof Message;
		MessageReaction: typeof MessageReaction;
		Presence: typeof Presence;
		VoiceState: typeof VoiceState;
		Role: typeof Role;
		User: typeof User;
	}

	interface FetchMemberOptions {
		user: UserResolvable;
		cache?: boolean;
	}

	interface FetchMembersOptions {
		query?: string;
		limit?: number;
	}

	interface FileOptions {
		attachment: BufferResolvable | Stream;
		name?: string;
	}

	interface GroupActivity {
		partyID: string;
		type: number;
	}

	type GuildAuditLogsAction = keyof GuildAuditLogsActions;

	interface GuildAuditLogsActions {
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
	}

	type GuildAuditLogsActionType = 'CREATE'
		| 'DELETE'
		| 'UPDATE'
		| 'ALL';

	interface GuildAuditLogsFetchOptions {
		before?: Snowflake | GuildAuditLogsEntry;
		limit?: number;
		user?: UserResolvable;
		type?: string | number;
	}

	type GuildAuditLogsTarget = keyof GuildAuditLogsTargets;

	interface GuildAuditLogsTargets {
		ALL?: string;
		GUILD?: string;
		CHANNEL?: string;
		USER?: string;
		ROLE?: string;
		INVITE?: string;
		WEBHOOK?: string;
		EMOJI?: string;
		MESSAGE?: string;
	}

	type GuildChannelResolvable = Snowflake | GuildChannel;

	interface GuildCreateChannelOptions {
		permissionOverwrites?: OverwriteResolvable[] | Collection<Snowflake, OverwriteResolvable>;
		topic?: string;
		type?: 'text' | 'voice' | 'category';
		nsfw?: boolean;
		parent?: ChannelResolvable;
		bitrate?: number;
		userLimit?: number;
		rateLimitPerUser?: number;
		position?: number;
		reason?: string;
	}

	interface GuildChannelCloneOptions extends GuildCreateChannelOptions {
		name?: string;
	}

	interface GuildEmojiCreateOptions {
		roles?: Collection<Snowflake, Role> | RoleResolvable[];
		reason?: string;
	}

	interface GuildEditData {
		name?: string;
		region?: string;
		verificationLevel?: number;
		explicitContentFilter?: number;
		defaultMessageNotifications?: DefaultMessageNotifications | number;
		afkChannel?: ChannelResolvable;
		systemChannel?: ChannelResolvable;
		afkTimeout?: number;
		icon?: Base64Resolvable;
		owner?: GuildMemberResolvable;
		splash?: Base64Resolvable;
		banner?: Base64Resolvable;
	}

	interface GuildEmbedData {
		enabled: boolean;
		channel: GuildChannelResolvable | null;
	}

	type GuildFeatures = 'INVITE_SPLASH'
		| 'MORE_EMOJI'
		| 'VERIFIED'
		| 'VIP_REGIONS'
		| 'VANITY_URL'
		| 'DISCOVERABLE'
		| 'FEATURABLE';

	interface GuildMemberEditData {
		nick?: string;
		roles?: Collection<Snowflake, Role> | RoleResolvable[];
		mute?: boolean;
		deaf?: boolean;
		channel?: ChannelResolvable | null;
	}

	type GuildMemberResolvable = GuildMember | UserResolvable;

	type GuildResolvable = Guild | Snowflake;

	interface GuildPruneMembersOptions {
		count?: boolean;
		days?: number;
		dry?: boolean;
		reason?: string;
	}

	interface HTTPOptions {
		version?: number;
		host?: string;
		cdn?: string;
		invite?: string;
	}

	type ImageExt = 'webp'
		| 'png'
		| 'jpg'
		| 'gif';

	type ImageSize = 16
		| 32
		| 64
		| 128
		| 256
		| 512
		| 1024
		| 2048;

	interface IntegrationData {
		id: string;
		type: string;
	}

	interface IntegrationEditData {
		expireBehavior?: number;
		expireGracePeriod?: number;
	}

	interface IntegrationAccount {
		id: string;
		name: string;
	}

	interface InviteOptions {
		temporary?: boolean;
		maxAge?: number;
		maxUses?: number;
		unique?: boolean;
		reason?: string;
	}

	type InviteResolvable = string;

	type MembershipStates = 'INVITED'
		| 'ACCEPTED';

	interface MessageCollectorOptions extends CollectorOptions {
		max?: number;
		maxProcessed?: number;
	}

	type MessageAdditions = MessageEmbed | MessageAttachment | (MessageEmbed | MessageAttachment)[];

	interface MessageEditOptions {
		content?: string;
		embed?: MessageEmbedOptions | null;
		code?: string | boolean;
	}

	interface MessageEmbedOptions {
		title?: string;
		description?: string;
		url?: string;
		timestamp?: Date | number;
		color?: ColorResolvable;
		fields?: { name: string; value: string; inline?: boolean; }[];
		files?: (MessageAttachment | string | FileOptions)[];
		author?: { name?: string; url?: string; icon_url?: string; iconURL?: string; };
		thumbnail?: { url?: string; height?: number; width?: number; };
		image?: { url?: string; proxy_url?: string; proxyURL?: string; height?: number; width?: number; };
		video?: { url?: string; height?: number; width?: number; };
		footer?: { text?: string; icon_url?: string; iconURL?: string; };
	}

	interface MessageOptions {
		tts?: boolean;
		nonce?: string;
		content?: string;
		embed?: MessageEmbed | MessageEmbedOptions;
		disableEveryone?: boolean;
		files?: (FileOptions | BufferResolvable | Stream | MessageAttachment)[];
		code?: string | boolean;
		split?: boolean | SplitOptions;
		reply?: UserResolvable;
	}

	type MessageReactionResolvable = MessageReaction | Snowflake;

	type MessageResolvable = Message | Snowflake;

	type MessageTarget = TextChannel | DMChannel | User | GuildMember | Webhook | WebhookClient;

	type MessageType = 'DEFAULT'
		| 'RECIPIENT_ADD'
		| 'RECIPIENT_REMOVE'
		| 'CALL'
		| 'CHANNEL_NAME_CHANGE'
		| 'CHANNEL_ICON_CHANGE'
		| 'PINS_ADD'
		| 'GUILD_MEMBER_JOIN'
		| 'USER_PREMIUM_GUILD_SUBSCRIPTION'
		| 'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1'
		| 'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2'
		| 'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3';

	interface OverwriteData {
		allow?: PermissionResolvable;
		deny?: PermissionResolvable;
		id: GuildMemberResolvable | RoleResolvable;
		type?: OverwriteType;
	}

	type OverwriteResolvable = PermissionOverwrites | OverwriteData;

	type OverwriteType = 'member' | 'role';

	interface PermissionFlags extends Record<PermissionString, number> { }

	interface PermissionObject extends Record<PermissionString, boolean> { }

	interface PermissionOverwriteOption extends Partial<Record<PermissionString, boolean | null>> { }

	type PermissionString = 'CREATE_INSTANT_INVITE'
		| 'KICK_MEMBERS'
		| 'BAN_MEMBERS'
		| 'ADMINISTRATOR'
		| 'MANAGE_CHANNELS'
		| 'MANAGE_GUILD'
		| 'ADD_REACTIONS'
		| 'VIEW_AUDIT_LOG'
		| 'PRIORITY_SPEAKER'
		| 'STREAM'
		| 'VIEW_CHANNEL'
		| 'SEND_MESSAGES'
		| 'SEND_TTS_MESSAGES'
		| 'MANAGE_MESSAGES'
		| 'EMBED_LINKS'
		| 'ATTACH_FILES'
		| 'READ_MESSAGE_HISTORY'
		| 'MENTION_EVERYONE'
		| 'USE_EXTERNAL_EMOJIS'
		| 'CONNECT'
		| 'SPEAK'
		| 'MUTE_MEMBERS'
		| 'DEAFEN_MEMBERS'
		| 'MOVE_MEMBERS'
		| 'USE_VAD'
		| 'CHANGE_NICKNAME'
		| 'MANAGE_NICKNAMES'
		| 'MANAGE_ROLES'
		| 'MANAGE_WEBHOOKS'
		| 'MANAGE_EMOJIS';

	interface RecursiveArray<T> extends Array<T | RecursiveArray<T>> { }

	type PermissionResolvable = BitFieldResolvable<PermissionString>;

	interface PermissionOverwriteOptions {
		allow: PermissionResolvable;
		deny: PermissionResolvable;
		id: UserResolvable | RoleResolvable;
	}

	type PremiumTier = number;

	interface PresenceData {
		status?: PresenceStatusData;
		afk?: boolean;
		activity?: {
			name?: string;
			type?: ActivityType | number;
			url?: string;
		};
		shardID?: number | number[];
	}

	type PresenceResolvable = Presence | UserResolvable | Snowflake;

	type ClientPresenceStatus = 'online' | 'idle' | 'dnd';

	interface ClientPresenceStatusData {
		web?: ClientPresenceStatus;
		mobile?: ClientPresenceStatus;
		desktop?: ClientPresenceStatus;
	}

	type PartialTypes = 'USER'
		| 'CHANNEL'
		| 'GUILD_MEMBER'
		| 'MESSAGE';

	type PresenceStatus = ClientPresenceStatus | 'offline';

	type PresenceStatusData = ClientPresenceStatus | 'invisible';

	interface RateLimitData {
		timeout: number;
		limit: number;
		timeDifference: number;
		method: string;
		path: string;
		route: string;
	}

	interface RawOverwriteData {
		id: Snowflake;
		allow: number;
		deny: number;
		type: OverwriteType;
	}

	interface ReactionCollectorOptions extends CollectorOptions {
		max?: number;
		maxEmojis?: number;
		maxUsers?: number;
	}

	interface ResolvedOverwriteOptions {
		allow: Permissions;
		deny: Permissions;
	}

	interface RoleData {
		name?: string;
		color?: ColorResolvable;
		hoist?: boolean;
		position?: number;
		permissions?: PermissionResolvable;
		mentionable?: boolean;
	}

	interface RolePosition {
		role: RoleResolvable;
		position: number;
	}

	type RoleResolvable = Role | string;

	type ShardingManagerMode = 'process' | 'worker';

	type Snowflake = string;

	interface SplitOptions {
		maxLength?: number;
		char?: string;
		prepend?: string;
		append?: string;
	}

	type Status = number;

	interface StreamOptions {
		type?: StreamType;
		seek?: number;
		volume?: number | boolean;
		plp?: number;
		fec?: boolean;
		bitrate?: number | 'auto';
		highWaterMark?: number;
	}

	type SpeakingString = 'SPEAKING' | 'SOUNDSHARE';

	type StreamType = 'unknown' | 'converted' | 'opus' | 'ogg/opus' | 'webm/opus';

	type StringResolvable = string | string[] | any;

	type TargetUser = number;

	type UserResolvable = User | Snowflake | Message | GuildMember;

	type VoiceStatus = number;

	interface WebhookEditData {
		name?: string;
		avatar?: BufferResolvable;
		channel?: ChannelResolvable;
		reason?: string;
	}

	interface WebhookMessageOptions {
		username?: string;
		avatarURL?: string;
		tts?: boolean;
		nonce?: string;
		embeds?: (MessageEmbed | object)[];
		disableEveryone?: boolean;
		files?: (FileOptions | BufferResolvable | Stream | MessageAttachment)[];
		code?: string | boolean;
		split?: boolean | SplitOptions;
	}

	interface WebSocketOptions {
		large_threshold?: number;
		compress?: boolean;
	}

	type PartialType = 'USER'
		| 'CHANNEL'
		| 'GUILD_MEMBER'
		| 'MESSAGE';

	type WSEventType = 'READY'
		| 'RESUMED'
		| 'GUILD_CREATE'
		| 'GUILD_DELETE'
		| 'GUILD_UPDATE'
		| 'GUILD_MEMBER_ADD'
		| 'GUILD_MEMBER_REMOVE'
		| 'GUILD_MEMBER_UPDATE'
		| 'GUILD_MEMBERS_CHUNK'
		| 'GUILD_ROLE_CREATE'
		| 'GUILD_ROLE_DELETE'
		| 'GUILD_ROLE_UPDATE'
		| 'GUILD_BAN_ADD'
		| 'GUILD_BAN_REMOVE'
		| 'GUILD_EMOJIS_UPDATE'
		| 'GUILD_INTEGRATIONS_UPDATE'
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
		| 'PRESENCE_UPDATE'
		| 'VOICE_STATE_UPDATE'
		| 'TYPING_START'
		| 'VOICE_STATE_UPDATE'
		| 'VOICE_SERVER_UPDATE'
		| 'WEBHOOKS_UPDATE';

	type MessageEvent = { data: WebSocket.Data; type: string; target: WebSocket; };
	type CloseEvent = { wasClean: boolean; code: number; reason: string; target: WebSocket; };
	type ErrorEvent = { error: any, message: string, type: string, target: WebSocket; };

//#endregion
}
