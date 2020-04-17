declare enum ChannelType {
  text = 0,
  dm = 1,
  voice = 2,
  group = 3,
  category = 4,
  news = 5,
  store = 6,
  unknown = 7,
}

declare module 'discord.js' {
  import BaseCollection from '@discordjs/collection';
  import { ChildProcess } from 'child_process';
  import { EventEmitter } from 'events';
  import { PathLike } from 'fs';
  import { Readable, Stream, Writable } from 'stream';
  import * as WebSocket from 'ws';

  export const version: string;

  //#region Classes

  export class Activity {
    constructor(presence: Presence, data?: object);
    public applicationID: Snowflake | null;
    public assets: RichPresenceAssets | null;
    public readonly createdAt: Date;
    public createdTimestamp: number;
    public details: string | null;
    public emoji: Emoji | null;
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
      extra?: MessageOptions | WebhookMessageOptions,
    ): APIMessage;
    public static partitionMessageAdditions(
      items: (MessageEmbed | MessageAttachment)[],
    ): [MessageEmbed[], MessageAttachment[]];
    public static resolveFile(fileLike: BufferResolvable | Stream | FileOptions | MessageAttachment): Promise<object>;
    public static transformOptions(
      content: StringResolvable,
      options: MessageOptions | WebhookMessageOptions | MessageAdditions,
      extra?: MessageOptions | WebhookMessageOptions,
      isWebhook?: boolean,
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
    public setInterval(fn: (...args: any[]) => void, delay: number, ...args: any[]): NodeJS.Timer;
    public setTimeout(fn: (...args: any[]) => void, delay: number, ...args: any[]): NodeJS.Timer;
    public setImmediate(fn: (...args: any[]) => void, ...args: any[]): NodeJS.Immediate;
    public toJSON(...props: { [key: string]: boolean | string }[]): object;
  }

  export class BaseGuildEmoji extends Emoji {
    constructor(client: Client, data: object, guild: Guild);
    private _roles: string[];

    public available: boolean;
    public readonly createdAt: Date;
    public readonly createdTimestamp: number;
    public guild: Guild | GuildPreview;
    public id: Snowflake;
    public managed: boolean;
    public requiresColons: boolean;
  }

  class BroadcastDispatcher extends VolumeMixin(StreamDispatcher) {
    public broadcast: VoiceBroadcast;
  }

  export class BitField<S extends string> {
    constructor(bits?: BitFieldResolvable<S>);
    public bitfield: number;
    public add(...bits: BitFieldResolvable<S>[]): BitField<S>;
    public any(bit: BitFieldResolvable<S>): boolean;
    public equals(bit: BitFieldResolvable<S>): boolean;
    public freeze(): Readonly<BitField<S>>;
    public has(bit: BitFieldResolvable<S>): boolean;
    public missing(bits: BitFieldResolvable<S>, ...hasParam: readonly unknown[]): S[];
    public remove(...bits: BitFieldResolvable<S>[]): BitField<S>;
    public serialize(...hasParam: readonly unknown[]): Record<S, boolean>;
    public toArray(...hasParam: readonly unknown[]): S[];
    public toJSON(): number;
    public valueOf(): number;
    public [Symbol.iterator](): IterableIterator<S>;
    public static FLAGS: object;
    public static resolve(bit?: BitFieldResolvable<any>): number;
  }

  export class CategoryChannel extends GuildChannel {
    public readonly children: Collection<Snowflake, GuildChannel>;
    public type: 'category';
  }

  export class Channel extends Base {
    constructor(client: Client, data?: object);
    public readonly createdAt: Date;
    public readonly createdTimestamp: number;
    public deleted: boolean;
    public id: Snowflake;
    public type: keyof typeof ChannelType;
    public delete(reason?: string): Promise<this>;
    public fetch(): Promise<this>;
    public toString(): string;
  }

  export class Client extends BaseClient {
    constructor(options?: ClientOptions);
    private actions: object;
    private _eval(script: string): any;
    private _validateOptions(options?: ClientOptions): void;

    public channels: ChannelManager;
    public readonly emojis: GuildEmojiManager;
    public guilds: GuildManager;
    public readyAt: Date | null;
    public readonly readyTimestamp: number | null;
    public shard: ShardClientUtil | null;
    public token: string | null;
    public readonly uptime: number | null;
    public user: ClientUser | null;
    public users: UserManager;
    public voice: ClientVoiceManager | null;
    public ws: WebSocketManager;
    public destroy(): void;
    public fetchApplication(): Promise<ClientApplication>;
    public fetchGuildPreview(guild: GuildResolvable): Promise<GuildPreview>;
    public fetchInvite(invite: InviteResolvable): Promise<Invite>;
    public fetchVoiceRegions(): Promise<Collection<string, VoiceRegion>>;
    public fetchWebhook(id: Snowflake, token?: string): Promise<Webhook>;
    public generateInvite(permissions?: PermissionResolvable): Promise<string>;
    public login(token?: string): Promise<string>;
    public sweepMessages(lifetime?: number): number;
    public toJSON(): object;

    public on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;

    public once<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;

    public emit<K extends keyof ClientEvents>(event: K, ...args: ClientEvents[K]): boolean;
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
    public coverImage(options?: ImageURLOptions): string;
    public fetchAssets(): Promise<ClientApplicationAsset[]>;
    public iconURL(options?: ImageURLOptions): string;
    public toJSON(): object;
    public toString(): string;
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

  export class ClientVoiceManager {
    constructor(client: Client);
    public readonly client: Client;
    public connections: Collection<Snowflake, VoiceConnection>;
    public broadcasts: VoiceBroadcast[];

    private joinChannel(channel: VoiceChannel): Promise<VoiceConnection>;

    public createBroadcast(): VoiceBroadcast;
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
    public resetTimer(options?: { time?: number; idle?: number }): void;
    public [Symbol.asyncIterator](): AsyncIterableIterator<V>;
    public toJSON(): object;

    protected listener: (...args: any[]) => void;
    public abstract collect(...args: any[]): K;
    public abstract dispose(...args: any[]): K;
    public abstract endReason(): void;

    public on(event: 'collect' | 'dispose', listener: (...args: any[]) => void): this;
    public on(event: 'end', listener: (collected: Collection<K, V>, reason: string) => void): this;

    public once(event: 'collect' | 'dispose', listener: (...args: any[]) => void): this;
    public once(event: 'end', listener: (collected: Collection<K, V>, reason: string) => void): this;
  }

  type AllowedImageFormat = 'webp' | 'png' | 'jpg' | 'jpeg' | 'gif';

  export const Constants: {
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
      repository: { type: string; url: string };
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
      CDN: (
        root: string,
      ) => {
        Asset: (name: string) => string;
        DefaultAvatar: (id: string | number) => string;
        Emoji: (emojiID: string, format: 'png' | 'gif') => string;
        Avatar: (userID: string | number, hash: string, format: 'default' | AllowedImageFormat, size: number) => string;
        Banner: (guildID: string | number, hash: string, format: AllowedImageFormat, size: number) => string;
        Icon: (userID: string | number, hash: string, format: 'default' | AllowedImageFormat, size: number) => string;
        AppIcon: (userID: string | number, hash: string, format: AllowedImageFormat, size: number) => string;
        AppAsset: (userID: string | number, hash: string, format: AllowedImageFormat, size: number) => string;
        GDMIcon: (userID: string | number, hash: string, format: AllowedImageFormat, size: number) => string;
        Splash: (guildID: string | number, hash: string, format: AllowedImageFormat, size: number) => string;
        DiscoverySplash: (guildID: string | number, hash: string, format: AllowedImageFormat, size: number) => string;
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
      INVITE_CREATE: 'inviteCreate';
      INVITE_DELETE: 'inviteDelete';
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
      SHARD_DISCONNECT: 'shardDisconnect';
      SHARD_ERROR: 'shardError';
      SHARD_RECONNECTING: 'shardReconnecting';
      SHARD_READY: 'shardReady';
      SHARD_RESUME: 'shardResume';
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
      [K in PartialTypes]: K;
    };
    WSEvents: {
      [K in WSEventType]: K;
    };
    Colors: {
      DEFAULT: 0x000000;
      WHITE: 0xffffff;
      AQUA: 0x1abc9c;
      GREEN: 0x2ecc71;
      BLUE: 0x3498db;
      YELLOW: 0xffff00;
      PURPLE: 0x9b59b6;
      LUMINOUS_VIVID_PINK: 0xe91e63;
      GOLD: 0xf1c40f;
      ORANGE: 0xe67e22;
      RED: 0xe74c3c;
      GREY: 0x95a5a6;
      NAVY: 0x34495e;
      DARK_AQUA: 0x11806a;
      DARK_GREEN: 0x1f8b4c;
      DARK_BLUE: 0x206694;
      DARK_PURPLE: 0x71368a;
      DARK_VIVID_PINK: 0xad1457;
      DARK_GOLD: 0xc27c0e;
      DARK_ORANGE: 0xa84300;
      DARK_RED: 0x992d22;
      DARK_GREY: 0x979c9f;
      DARKER_GREY: 0x7f8c8d;
      LIGHT_GREY: 0xbcc0c0;
      DARK_NAVY: 0x2c3e50;
      BLURPLE: 0x7289da;
      GREYPLE: 0x99aab5;
      DARK_BUT_NOT_BLACK: 0x2c2f33;
      NOT_QUITE_BLACK: 0x23272a;
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
      MAXIMUM_CHANNELS: 30013;
      MAXIMUM_INVITES: 30016;
      UNAUTHORIZED: 40001;
      USER_BANNED: 40007;
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
      INVALID_OAUTH_TOKEN: 50025;
      BULK_DELETE_MESSAGE_TOO_OLD: 50034;
      INVALID_FORM_BODY: 50035;
      INVITE_ACCEPTED_TO_GUILD_NOT_CONTAINING_BOT: 50036;
      INVALID_API_VERSION: 50041;
      REACTION_BLOCKED: 90001;
      RESOURCE_OVERLOADED: 130000;
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
    ExplicitContentFilterLevels: ExplicitContentFilterLevel[];
    DefaultMessageNotifications: DefaultMessageNotifications[];
    VerificationLevels: VerificationLevel[];
    MembershipStates: 'INVITED' | 'ACCEPTED';
  };

  export class DataResolver {
    public static resolveBase64(data: Base64Resolvable): string;
    public static resolveFile(resource: BufferResolvable | Stream): Promise<Buffer | Stream>;
    public static resolveFileAsBuffer(resource: BufferResolvable | Stream): Promise<Buffer>;
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
    public messages: MessageManager;
    public recipient: User;
    public readonly partial: false;
    public type: 'dm';
    public fetch(): Promise<this>;
  }

  export class Emoji extends Base {
    constructor(client: Client, emoji: object);
    public animated: boolean;
    public readonly createdAt: Date | null;
    public readonly createdTimestamp: number | null;
    public deleted: boolean;
    public id: Snowflake | null;
    public name: string;
    public readonly identifier: string;
    public readonly url: string | null;
    public toJSON(): object;
    public toString(): string;
  }

  export class Guild extends Base {
    constructor(client: Client, data: object);
    private _sortedRoles(): Collection<Snowflake, Role>;
    private _sortedChannels(channel: Channel): Collection<Snowflake, GuildChannel>;
    private _memberSpeakUpdate(user: Snowflake, speaking: boolean): void;

    public readonly afkChannel: VoiceChannel | null;
    public afkChannelID: Snowflake | null;
    public afkTimeout: number;
    public applicationID: Snowflake | null;
    public available: boolean;
    public banner: string | null;
    public channels: GuildChannelManager;
    public readonly createdAt: Date;
    public readonly createdTimestamp: number;
    public defaultMessageNotifications: DefaultMessageNotifications | number;
    public deleted: boolean;
    public description: string | null;
    public embedChannel: GuildChannel | null;
    public embedChannelID: Snowflake | null;
    public embedEnabled: boolean;
    public emojis: GuildEmojiManager;
    public explicitContentFilter: ExplicitContentFilterLevel;
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
    public members: GuildMemberManager;
    public mfaLevel: number;
    public name: string;
    public readonly nameAcronym: string;
    public readonly owner: GuildMember | null;
    public ownerID: Snowflake;
    public readonly partnered: boolean;
    public premiumSubscriptionCount: number | null;
    public premiumTier: PremiumTier;
    public presences: PresenceManager;
    public readonly publicUpdatesChannel: TextChannel | null;
    public publicUpdatesChannelID: Snowflake | null;
    public region: string;
    public roles: RoleManager;
    public readonly rulesChannel: TextChannel | null;
    public rulesChannelID: Snowflake | null;
    public readonly shard: WebSocketShard;
    public shardID: number;
    public splash: string | null;
    public readonly systemChannel: TextChannel | null;
    public systemChannelFlags: Readonly<SystemChannelFlags>;
    public systemChannelID: Snowflake | null;
    public vanityURLCode: string | null;
    public verificationLevel: VerificationLevel;
    public readonly verified: boolean;
    public readonly voice: VoiceState | null;
    public readonly voiceStates: VoiceStateManager;
    public readonly widgetChannel: TextChannel | null;
    public widgetChannelID: Snowflake | null;
    public widgetEnabled: boolean | null;
    public addMember(user: UserResolvable, options: AddGuildMemberOptions): Promise<GuildMember>;
    public bannerURL(options?: ImageURLOptions): string | null;
    public createIntegration(data: IntegrationData, reason?: string): Promise<Guild>;
    public delete(): Promise<Guild>;
    public edit(data: GuildEditData, reason?: string): Promise<Guild>;
    public equals(guild: Guild): boolean;
    public fetch(): Promise<Guild>;
    public fetchAuditLogs(options?: GuildAuditLogsFetchOptions): Promise<GuildAuditLogs>;
    public fetchBan(user: UserResolvable): Promise<{ user: User; reason: string }>;
    public fetchBans(): Promise<Collection<Snowflake, { user: User; reason: string }>>;
    public fetchEmbed(): Promise<GuildEmbedData>;
    public fetchIntegrations(): Promise<Collection<string, Integration>>;
    public fetchInvites(): Promise<Collection<string, Invite>>;
    public fetchPreview(): Promise<GuildPreview>;
    public fetchVanityCode(): Promise<string>;
    public fetchVoiceRegions(): Promise<Collection<string, VoiceRegion>>;
    public fetchWebhooks(): Promise<Collection<Snowflake, Webhook>>;
    public iconURL(options?: ImageURLOptions & { dynamic?: boolean }): string | null;
    public leave(): Promise<Guild>;
    public member(user: UserResolvable): GuildMember | null;
    public setAFKChannel(afkChannel: ChannelResolvable | null, reason?: string): Promise<Guild>;
    public setAFKTimeout(afkTimeout: number, reason?: string): Promise<Guild>;
    public setBanner(banner: Base64Resolvable | null, reason?: string): Promise<Guild>;
    public setChannelPositions(channelPositions: ChannelPosition[]): Promise<Guild>;
    public setDefaultMessageNotifications(
      defaultMessageNotifications: DefaultMessageNotifications | number,
      reason?: string,
    ): Promise<Guild>;
    public setEmbed(embed: GuildEmbedData, reason?: string): Promise<Guild>;
    public setExplicitContentFilter(explicitContentFilter: ExplicitContentFilterLevel, reason?: string): Promise<Guild>;
    public setIcon(icon: Base64Resolvable | null, reason?: string): Promise<Guild>;
    public setName(name: string, reason?: string): Promise<Guild>;
    public setOwner(owner: GuildMemberResolvable, reason?: string): Promise<Guild>;
    public setRegion(region: string, reason?: string): Promise<Guild>;
    public setRolePositions(rolePositions: RolePosition[]): Promise<Guild>;
    public setSplash(splash: Base64Resolvable | null, reason?: string): Promise<Guild>;
    public setSystemChannel(systemChannel: ChannelResolvable | null, reason?: string): Promise<Guild>;
    public setSystemChannelFlags(systemChannelFlags: SystemChannelFlagsResolvable, reason?: string): Promise<Guild>;
    public setVerificationLevel(verificationLevel: VerificationLevel, reason?: string): Promise<Guild>;
    public splashURL(options?: ImageURLOptions): string | null;
    public toJSON(): object;
    public toString(): string;
  }

  export class GuildAuditLogs {
    constructor(guild: Guild, data: object);
    private webhooks: Collection<Snowflake, Webhook>;
    private integrations: Collection<Snowflake, Integration>;

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
    public target: Guild | User | Role | GuildEmoji | Invite | Webhook | Integration | null;
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
    public readonly members: Collection<Snowflake, GuildMember>;
    public name: string;
    public readonly parent: CategoryChannel | null;
    public parentID: Snowflake | null;
    public permissionOverwrites: Collection<Snowflake, PermissionOverwrites>;
    public readonly permissionsLocked: boolean | null;
    public readonly position: number;
    public rawPosition: number;
    public type: Exclude<keyof typeof ChannelType, 'dm' | 'group' | 'unknown'>;
    public readonly viewable: boolean;
    public clone(options?: GuildChannelCloneOptions): Promise<this>;
    public createInvite(options?: InviteOptions): Promise<Invite>;
    public createOverwrite(
      userOrRole: RoleResolvable | UserResolvable,
      options: PermissionOverwriteOption,
      reason?: string,
    ): Promise<this>;
    public edit(data: ChannelData, reason?: string): Promise<this>;
    public equals(channel: GuildChannel): boolean;
    public fetchInvites(): Promise<Collection<string, Invite>>;
    public lockPermissions(): Promise<this>;
    public overwritePermissions(
      overwrites: OverwriteResolvable[] | Collection<Snowflake, OverwriteResolvable>,
      reason?: string,
    ): Promise<this>;
    public permissionsFor(memberOrRole: GuildMemberResolvable | RoleResolvable): Readonly<Permissions> | null;
    public setName(name: string, reason?: string): Promise<this>;
    public setParent(
      channel: CategoryChannel | Snowflake,
      options?: { lockPermissions?: boolean; reason?: string },
    ): Promise<this>;
    public setPosition(position: number, options?: { relative?: boolean; reason?: string }): Promise<this>;
    public setTopic(topic: string, reason?: string): Promise<this>;
    public updateOverwrite(
      userOrRole: RoleResolvable | UserResolvable,
      options: PermissionOverwriteOption,
      reason?: string,
    ): Promise<this>;
  }

  export class GuildEmoji extends BaseGuildEmoji {
    public readonly deletable: boolean;
    public guild: Guild;
    public readonly roles: GuildEmojiRoleManager;
    public readonly url: string;
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
    public lastMessageChannelID: Snowflake | null;
    public readonly manageable: boolean;
    public nickname: string | null;
    public readonly partial: false;
    public readonly permissions: Readonly<Permissions>;
    public readonly premiumSince: Date | null;
    public premiumSinceTimestamp: number | null;
    public readonly presence: Presence;
    public readonly roles: GuildMemberRoleManager;
    public user: User;
    public readonly voice: VoiceState;
    public ban(options?: BanOptions): Promise<GuildMember>;
    public fetch(): Promise<GuildMember>;
    public createDM(): Promise<DMChannel>;
    public deleteDM(): Promise<DMChannel>;
    public edit(data: GuildMemberEditData, reason?: string): Promise<GuildMember>;
    public hasPermission(
      permission: PermissionResolvable,
      options?: { checkAdmin?: boolean; checkOwner?: boolean },
    ): boolean;
    public kick(reason?: string): Promise<GuildMember>;
    public permissionsIn(channel: ChannelResolvable): Readonly<Permissions>;
    public setNickname(nickname: string, reason?: string): Promise<GuildMember>;
    public toJSON(): object;
    public toString(): string;
    public valueOf(): string;
  }

  export class GuildPreview extends Base {
    constructor(client: Client, data: object);
    public approximateMemberCount: number;
    public approximatePresenceCount: number;
    public description?: string;
    public discoverySplash: string | null;
    public emojis: Collection<Snowflake, GuildPreviewEmoji>;
    public features: GuildFeatures[];
    public icon: string | null;
    public id: string;
    public name: string;
    public splash: string | null;
    public discoverySplashURL(options?: ImageURLOptions): string | null;
    public iconURL(options?: ImageURLOptions & { dynamic?: boolean }): string | null;
    public splashURL(options?: ImageURLOptions): string | null;
    public fetch(): Promise<GuildPreview>;
    public toJSON(): object;
    public toString(): string;
  }

  export class GuildPreviewEmoji extends BaseGuildEmoji {
    constructor(client: Client, data: object, guild: GuildPreview);
    public guild: GuildPreview;
    public readonly roles: Set<Snowflake>;
  }

  export class HTTPError extends Error {
    constructor(message: string, name: string, code: number, method: string, path: string);
    public code: number;
    public method: string;
    public name: string;
    public path: string;
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
    public type: string;
    public user: User;
    public delete(reason?: string): Promise<Integration>;
    public edit(data: IntegrationEditData, reason?: string): Promise<Integration>;
    public sync(): Promise<Integration>;
  }

  export class Intents extends BitField<IntentsString> {
    public static FLAGS: Record<IntentsString, number>;
    public static PRIVILEGED: number;
    public static ALL: number;
    public static NON_PRIVILEGED: number;
    public static resolve(bit?: BitFieldResolvable<IntentsString>): number;
  }

  export class Invite extends Base {
    constructor(client: Client, data: object);
    public channel: GuildChannel | PartialGroupDMChannel;
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

    public activity: MessageActivity | null;
    public application: ClientApplication | null;
    public attachments: Collection<Snowflake, MessageAttachment>;
    public author: User;
    public channel: TextChannel | DMChannel | NewsChannel;
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
    public nonce: string | null;
    public readonly partial: false;
    public readonly pinnable: boolean;
    public pinned: boolean;
    public reactions: ReactionManager;
    public system: boolean;
    public tts: boolean;
    public type: MessageType;
    public readonly url: string;
    public webhookID: Snowflake | null;
    public flags: Readonly<MessageFlags>;
    public reference: MessageReference | null;
    public awaitReactions(
      filter: CollectorFilter,
      options?: AwaitReactionsOptions,
    ): Promise<Collection<Snowflake, MessageReaction>>;
    public createReactionCollector(filter: CollectorFilter, options?: ReactionCollectorOptions): ReactionCollector;
    public delete(options?: { timeout?: number; reason?: string }): Promise<Message>;
    public edit(content: StringResolvable, options?: MessageEditOptions | MessageEmbed): Promise<Message>;
    public edit(options: MessageEditOptions | MessageEmbed | APIMessage): Promise<Message>;
    public equals(message: Message, rawData: object): boolean;
    public fetchWebhook(): Promise<Webhook>;
    public fetch(): Promise<Message>;
    public pin(): Promise<Message>;
    public react(emoji: EmojiIdentifierResolvable): Promise<MessageReaction>;
    public reply(
      content?: StringResolvable,
      options?: MessageOptions | MessageAdditions | (MessageOptions & { split?: false }) | MessageAdditions,
    ): Promise<Message>;
    public reply(
      content?: StringResolvable,
      options?: (MessageOptions & { split: true | SplitOptions }) | MessageAdditions,
    ): Promise<Message[]>;
    public reply(
      options?:
        | MessageOptions
        | MessageAdditions
        | APIMessage
        | (MessageOptions & { split?: false })
        | MessageAdditions
        | APIMessage,
    ): Promise<Message>;
    public reply(
      options?: (MessageOptions & { split: true | SplitOptions }) | MessageAdditions | APIMessage,
    ): Promise<Message[]>;
    public suppressEmbeds(suppress?: boolean): Promise<Message>;
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
    public readonly spoiler: boolean;
    public url: string;
    public width: number | null;
    public setFile(attachment: BufferResolvable | Stream, name?: string): this;
    public setName(name: string): this;
    public toJSON(): object;
  }

  export class MessageCollector extends Collector<Snowflake, Message> {
    constructor(channel: TextChannel | DMChannel, filter: CollectorFilter, options?: MessageCollectorOptions);
    private _handleChannelDeletion(channel: GuildChannel): void;
    private _handleGuildDeletion(guild: Guild): void;

    public channel: Channel;
    public options: MessageCollectorOptions;
    public received: number;

    public collect(message: Message): Snowflake;
    public dispose(message: Message): Snowflake;
    public endReason(): string;
  }

  export class MessageEmbed {
    constructor(data?: MessageEmbed | MessageEmbedOptions);
    public author: MessageEmbedAuthor | null;
    public color?: number;
    public readonly createdAt: Date | null;
    public description?: string;
    public fields: EmbedField[];
    public files: (MessageAttachment | string | FileOptions)[];
    public footer: MessageEmbedFooter | null;
    public readonly hexColor: string | null;
    public image: MessageEmbedImage | null;
    public readonly length: number;
    public provider: MessageEmbedProvider | null;
    public thumbnail: MessageEmbedThumbnail | null;
    public timestamp: number | null;
    public title?: string;
    public type: string;
    public url?: string;
    public readonly video: MessageEmbedVideo | null;
    public addField(name: StringResolvable, value: StringResolvable, inline?: boolean): this;
    public addFields(...fields: EmbedFieldData[] | EmbedFieldData[][]): this;
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
    public spliceFields(index: number, deleteCount: number, ...fields: EmbedFieldData[] | EmbedFieldData[][]): this;
    public toJSON(): object;

    public static normalizeField(
      name: StringResolvable,
      value: StringResolvable,
      inline?: boolean,
    ): Required<EmbedFieldData>;
    public static normalizeFields(...fields: EmbedFieldData[] | EmbedFieldData[][]): Required<EmbedFieldData>[];
  }

  export class MessageFlags extends BitField<MessageFlagsString> {
    public static FLAGS: Record<MessageFlagsString, number>;
    public static resolve(bit?: BitFieldResolvable<MessageFlagsString>): number;
  }

  export class MessageMentions {
    constructor(
      message: Message,
      users: object[] | Collection<Snowflake, User>,
      roles: Snowflake[] | Collection<Snowflake, Role>,
      everyone: boolean,
    );
    private _channels: Collection<Snowflake, GuildChannel> | null;
    private readonly _content: Message;
    private _members: Collection<Snowflake, GuildMember> | null;

    public readonly channels: Collection<Snowflake, TextChannel>;
    public readonly client: Client;
    public everyone: boolean;
    public readonly guild: Guild;
    public has(
      data: User | GuildMember | Role | GuildChannel,
      options?: {
        ignoreDirect?: boolean;
        ignoreRoles?: boolean;
        ignoreEveryone?: boolean;
      },
    ): boolean;
    public readonly members: Collection<Snowflake, GuildMember> | null;
    public roles: Collection<Snowflake, Role>;
    public users: Collection<Snowflake, User>;
    public crosspostedChannels: Collection<Snowflake, CrosspostedChannel>;
    public toJSON(): object;

    public static CHANNELS_PATTERN: RegExp;
    public static EVERYONE_PATTERN: RegExp;
    public static ROLES_PATTERN: RegExp;
    public static USERS_PATTERN: RegExp;
  }

  export class MessageReaction {
    constructor(client: Client, data: object, message: Message);
    private _emoji: GuildEmoji | ReactionEmoji;

    public count: number | null;
    public readonly emoji: GuildEmoji | ReactionEmoji;
    public me: boolean;
    public message: Message;
    public readonly partial: boolean;
    public users: ReactionUserManager;
    public remove(): Promise<MessageReaction>;
    public fetch(): Promise<MessageReaction>;
    public toJSON(): object;
  }

  export class NewsChannel extends TextBasedChannel(GuildChannel) {
    constructor(guild: Guild, data?: object);
    public messages: MessageManager;
    public nsfw: boolean;
    public topic: string | null;
    public type: 'news';
    public createWebhook(
      name: string,
      options?: { avatar?: BufferResolvable | Base64Resolvable; reason?: string },
    ): Promise<Webhook>;
    public setNSFW(nsfw: boolean, reason?: string): Promise<NewsChannel>;
    public fetchWebhooks(): Promise<Collection<Snowflake, Webhook>>;
  }

  export class PartialGroupDMChannel extends Channel {
    constructor(client: Client, data: object);
    public name: string;
    public icon: string | null;
    public iconURL(options?: ImageURLOptions): string | null;
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
    public static resolveOverwriteOptions(
      options: ResolvedOverwriteOptions,
      initialPermissions: { allow?: PermissionResolvable; deny?: PermissionResolvable },
    ): ResolvedOverwriteOptions;
    public static resolve(overwrite: OverwriteResolvable, guild: Guild): RawOverwriteData;
  }

  export class Permissions extends BitField<PermissionString> {
    public any(permission: PermissionResolvable, checkAdmin?: boolean): boolean;
    public has(permission: PermissionResolvable, checkAdmin?: boolean): boolean;
    public missing(bits: BitFieldResolvable<PermissionString>, checkAdmin?: boolean): PermissionString[];
    public serialize(checkAdmin?: boolean): Record<PermissionString, boolean>;
    public toArray(checkAdmin?: boolean): PermissionString[];

    public static ALL: number;
    public static DEFAULT: number;
    public static FLAGS: PermissionFlags;
    public static resolve(permission?: PermissionResolvable): number;
  }

  export class Presence {
    constructor(client: Client, data?: object);
    public activities: Activity[];
    public clientStatus: ClientPresenceStatusData | null;
    public flags: Readonly<ActivityFlags>;
    public guild: Guild | null;
    public readonly member: GuildMember | null;
    public status: PresenceStatus;
    public readonly user: User | null;
    public userID: Snowflake;
    public equals(presence: Presence): boolean;
  }

  export class ReactionCollector extends Collector<Snowflake, MessageReaction> {
    constructor(message: Message, filter: CollectorFilter, options?: ReactionCollectorOptions);
    private _handleChannelDeletion(channel: GuildChannel): void;
    private _handleGuildDeletion(guild: Guild): void;
    private _handleMessageDeletion(message: Message): void;

    public message: Message;
    public options: ReactionCollectorOptions;
    public total: number;
    public users: Collection<Snowflake, User>;

    public static key(reaction: MessageReaction): Snowflake | string;

    public collect(reaction: MessageReaction): Snowflake | string;
    public dispose(reaction: MessageReaction, user: User): Snowflake | string;
    public empty(): void;
    public endReason(): string | null;

    public on(event: 'collect' | 'dispose' | 'remove', listener: (reaction: MessageReaction, user: User) => void): this;
    public on(
      event: 'end',
      listener: (collected: Collection<Snowflake, MessageReaction>, reason: string) => void,
    ): this;
    public on(event: string, listener: (...args: any[]) => void): this;

    public once(
      event: 'collect' | 'dispose' | 'remove',
      listener: (reaction: MessageReaction, user: User) => void,
    ): this;
    public once(
      event: 'end',
      listener: (collected: Collection<Snowflake, MessageReaction>, reason: string) => void,
    ): this;
    public once(event: string, listener: (...args: any[]) => void): this;
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
    public largeImageURL(options?: ImageURLOptions): string | null;
    public smallImageURL(options?: ImageURLOptions): string | null;
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
    private _exitListener: (...args: any[]) => void;
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

    public on(event: 'spawn' | 'death', listener: (child: ChildProcess) => void): this;
    public on(event: 'disconnect' | 'ready' | 'reconnecting', listener: () => void): this;
    public on(event: 'error', listener: (error: Error) => void): this;
    public on(event: 'message', listener: (message: any) => void): this;
    public on(event: string, listener: (...args: any[]) => void): this;

    public once(event: 'spawn' | 'death', listener: (child: ChildProcess) => void): this;
    public once(event: 'disconnect' | 'ready' | 'reconnecting', listener: () => void): this;
    public once(event: 'error', listener: (error: Error) => void): this;
    public once(event: 'message', listener: (message: any) => void): this;
    public once(event: string, listener: (...args: any[]) => void): this;
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
    constructor(
      file: string,
      options?: {
        totalShards?: number | 'auto';
        shardList?: number[] | 'auto';
        mode?: ShardingManagerMode;
        respawn?: boolean;
        shardArgs?: string[];
        token?: string;
        execArgv?: string[];
      },
    );

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
    public respawnAll(
      shardDelay?: number,
      respawnDelay?: number,
      spawnTimeout?: number,
    ): Promise<Collection<number, Shard>>;
    public spawn(amount?: number | 'auto', delay?: number, spawnTimeout?: number): Promise<Collection<number, Shard>>;

    public on(event: 'shardCreate', listener: (shard: Shard) => void): this;

    public once(event: 'shardCreate', listener: (shard: Shard) => void): this;
  }

  export class SnowflakeUtil {
    public static deconstruct(snowflake: Snowflake): DeconstructedSnowflake;
    public static generate(timestamp?: number | Date): Snowflake;
  }

  export class Speaking extends BitField<SpeakingString> {
    public static FLAGS: Record<SpeakingString, number>;
    public static resolve(bit?: BitFieldResolvable<SpeakingString>): number;
  }

  export class StoreChannel extends GuildChannel {
    constructor(guild: Guild, data?: object);
    public nsfw: boolean;
    public type: 'store';
  }

  class StreamDispatcher extends VolumeMixin(Writable) {
    constructor(player: object, options?: StreamOptions, streams?: object);
    public readonly bitrateEditable: boolean;
    public broadcast: VoiceBroadcast | null;
    public readonly paused: boolean;
    public pausedSince: number | null;
    public readonly pausedTime: number;
    public player: object;
    public readonly streamTime: number;
    public readonly totalStreamTime: number;

    public pause(silence?: boolean): void;
    public resume(): void;
    public setBitrate(value: number | 'auto'): boolean;
    public setFEC(enabled: boolean): boolean;
    public setPLP(value: number): boolean;

    public on(event: 'close' | 'drain' | 'finish' | 'start', listener: () => void): this;
    public on(event: 'debug', listener: (info: string) => void): this;
    public on(event: 'error', listener: (err: Error) => void): this;
    public on(event: 'pipe' | 'unpipe', listener: (src: Readable) => void): this;
    public on(event: 'speaking', listener: (speaking: boolean) => void): this;
    public on(event: 'volumeChange', listener: (oldVolume: number, newVolume: number) => void): this;
    public on(event: string, listener: (...args: any[]) => void): this;

    public once(event: 'close' | 'drain' | 'finish' | 'start', listener: () => void): this;
    public once(event: 'debug', listener: (info: string) => void): this;
    public once(event: 'error', listener: (err: Error) => void): this;
    public once(event: 'pipe' | 'unpipe', listener: (src: Readable) => void): this;
    public once(event: 'speaking', listener: (speaking: boolean) => void): this;
    public once(event: 'volumeChange', listener: (oldVolume: number, newVolume: number) => void): this;
    public once(event: string, listener: (...args: any[]) => void): this;
  }

  export class Structures {
    public static get<K extends keyof Extendable>(structure: K): Extendable[K];
    public static get(structure: string): (...args: any[]) => void;
    public static extend<K extends keyof Extendable, T extends Extendable[K]>(
      structure: K,
      extender: (baseClass: Extendable[K]) => T,
    ): T;
    public static extend<T extends (...args: any[]) => void>(
      structure: string,
      extender: (baseClass: typeof Function) => T,
    ): T;
  }

  export class SystemChannelFlags extends BitField<SystemChannelFlagsString> {
    public static FLAGS: Record<SystemChannelFlagsString, number>;
    public static resolve(bit?: BitFieldResolvable<SystemChannelFlagsString>): number;
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

    public iconURL(options?: ImageURLOptions): string;
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

  export class TextChannel extends TextBasedChannel(GuildChannel) {
    constructor(guild: Guild, data?: object);
    public messages: MessageManager;
    public nsfw: boolean;
    public type: 'text';
    public rateLimitPerUser: number;
    public topic: string | null;
    public createWebhook(
      name: string,
      options?: { avatar?: BufferResolvable | Base64Resolvable; reason?: string },
    ): Promise<Webhook>;
    public setNSFW(nsfw: boolean, reason?: string): Promise<TextChannel>;
    public setRateLimitPerUser(rateLimitPerUser: number, reason?: string): Promise<TextChannel>;
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
    public flags: Readonly<UserFlags>;
    public id: Snowflake;
    public lastMessageID: Snowflake | null;
    public locale: string;
    public readonly partial: false;
    public readonly presence: Presence;
    public system?: boolean;
    public readonly tag: string;
    public username: string;
    public avatarURL(options?: ImageURLOptions & { dynamic?: boolean }): string | null;
    public createDM(): Promise<DMChannel>;
    public deleteDM(): Promise<DMChannel>;
    public displayAvatarURL(options?: ImageURLOptions & { dynamic?: boolean }): string;
    public equals(user: User): boolean;
    public fetch(): Promise<User>;
    public toString(): string;
    public typingDurationIn(channel: ChannelResolvable): number;
    public typingIn(channel: ChannelResolvable): boolean;
    public typingSinceIn(channel: ChannelResolvable): Date;
  }

  export class UserFlags extends BitField<UserFlagsString> {
    public static FLAGS: Record<UserFlagsString, number>;
    public static resolve(bit?: BitFieldResolvable<UserFlagsString>): number;
  }

  export class Util {
    public static basename(path: string, ext?: string): string;
    public static binaryToID(num: string): Snowflake;
    public static cleanContent(str: string, message: Message): string;
    public static removeMentions(str: string): string;
    public static cloneObject(obj: object): object;
    public static convertToBuffer(ab: ArrayBuffer | string): Buffer;
    public static delayFor(ms: number): Promise<void>;
    public static discordSort<K, V extends { rawPosition: number; id: string }>(
      collection: Collection<K, V>,
    ): Collection<K, V>;
    public static escapeMarkdown(text: string, options?: EscapeMarkdownOptions): string;
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
    public static makeError(obj: { name: string; message: string; stack: string }): Error;
    public static makePlainError(err: Error): { name: string; message: string; stack: string };
    public static mergeDefault(def: object, given: object): object;
    public static moveElementInArray(array: any[], element: any, newIndex: number, offset?: boolean): number;
    public static parseEmoji(text: string): { animated: boolean; name: string; id: string | null } | null;
    public static resolveColor(color: ColorResolvable): number;
    public static resolveString(data: StringResolvable): string;
    public static setPosition<T extends Channel | Role>(
      item: T,
      position: number,
      relative: boolean,
      sorted: Collection<Snowflake, T>,
      route: object,
      reason?: string,
    ): Promise<{ id: Snowflake; position: number }[]>;
    public static splitMessage(text: StringResolvable, options?: SplitOptions): string[];
    public static str2ab(str: string): ArrayBuffer;
  }

  class VoiceBroadcast extends EventEmitter {
    constructor(client: Client);
    public client: Client;
    public subscribers: StreamDispatcher[];
    public readonly dispatcher?: BroadcastDispatcher;
    public play(input: string | Readable, options?: StreamOptions): BroadcastDispatcher;
    public end(): void;

    public on(event: 'end', listener: () => void): this;
    public on(event: 'subscribe' | 'unsubscribe', listener: (dispatcher: StreamDispatcher) => void): this;
    public on(event: string, listener: (...args: any[]) => void): this;

    public once(event: 'end', listener: () => void): this;
    public once(event: 'subscribe' | 'unsubscribe', listener: (dispatcher: StreamDispatcher) => void): this;
    public once(event: string, listener: (...args: any[]) => void): this;
  }

  export class VoiceChannel extends GuildChannel {
    constructor(guild: Guild, data?: object);
    public bitrate: number;
    public readonly editable: boolean;
    public readonly full: boolean;
    public readonly joinable: boolean;
    public readonly speakable: boolean;
    public type: 'voice';
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

    public on(event: 'authenticated' | 'closing' | 'newSession' | 'ready' | 'reconnecting', listener: () => void): this;
    public on(event: 'debug', listener: (message: string) => void): this;
    public on(event: 'error' | 'failed' | 'disconnect', listener: (error: Error) => void): this;
    public on(event: 'speaking', listener: (user: User, speaking: Readonly<Speaking>) => void): this;
    public on(event: 'warn', listener: (warning: string | Error) => void): this;
    public on(event: string, listener: (...args: any[]) => void): this;

    public once(
      event: 'authenticated' | 'closing' | 'newSession' | 'ready' | 'reconnecting',
      listener: () => void,
    ): this;
    public once(event: 'debug', listener: (message: string) => void): this;
    public once(event: 'error' | 'failed' | 'disconnect', listener: (error: Error) => void): this;
    public once(event: 'speaking', listener: (user: User, speaking: Readonly<Speaking>) => void): this;
    public once(event: 'warn', listener: (warning: string | Error) => void): this;
    public once(event: string, listener: (...args: any[]) => void): this;
  }

  class VoiceReceiver extends EventEmitter {
    constructor(connection: VoiceConnection);
    public createStream(
      user: UserResolvable,
      options?: { mode?: 'opus' | 'pcm'; end?: 'silence' | 'manual' },
    ): Readable;

    public on(event: 'debug', listener: (error: Error | string) => void): this;
    public on(event: string, listener: (...args: any[]) => void): this;

    public once(event: 'debug', listener: (error: Error | string) => void): this;
    public once(event: string, listener: (...args: any[]) => void): this;
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
    public streaming: boolean;
    public readonly speaking: boolean | null;

    public setDeaf(deaf: boolean, reason?: string): Promise<GuildMember>;
    public setMute(mute: boolean, reason?: string): Promise<GuildMember>;
    public kick(reason?: string): Promise<GuildMember>;
    public setChannel(channel: ChannelResolvable | null, reason?: string): Promise<GuildMember>;
    public setSelfDeaf(deaf: boolean): Promise<boolean>;
    public setSelfMute(mute: boolean): Promise<boolean>;
  }

  class VolumeInterface extends EventEmitter {
    constructor(options?: { volume?: number });
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
    public avatarURL(options?: ImageURLOptions): string | null;
    public channelID: Snowflake;
    public client: Client;
    public guildID: Snowflake;
    public name: string;
    public owner: User | object | null;
    public token: string | null;
    public type: WebhookTypes;
  }

  export class WebhookClient extends WebhookMixin(BaseClient) {
    constructor(id: string, token: string, options?: ClientOptions);
    public client: this;
    public token: string;
  }

  export class WebSocketManager extends EventEmitter {
    constructor(client: Client);
    private totalShards: number | string;
    private shardQueue: Set<WebSocketShard>;
    private packetQueue: object[];
    private destroyed: boolean;
    private reconnecting: boolean;
    private sessionStartLimit?: { total: number; remaining: number; reset_after: number };

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
    private handlePacket(packet?: object, shard?: WebSocketShard): boolean;
    private checkShardsReady(): Promise<void>;
    private triggerClientReady(): void;
  }

  export class WebSocketShard extends EventEmitter {
    constructor(manager: WebSocketManager, id: number);
    private sequence: number;
    private closeSequence: number;
    private sessionID?: string;
    private lastPingTimestamp: number;
    private lastHeartbeatAcked: boolean;
    private ratelimit: { queue: object[]; total: number; remaining: number; time: 60e3; timer: NodeJS.Timeout | null };
    private connection: WebSocket | null;
    private helloTimeout: NodeJS.Timeout | undefined;
    private eventsAttached: boolean;
    private expectedGuilds: Set<Snowflake> | undefined;
    private readyTimeout: NodeJS.Timeout | undefined;

    public manager: WebSocketManager;
    public id: number;
    public status: Status;
    public ping: number;

    private debug(message: string): void;
    private connect(): Promise<void>;
    private onOpen(): void;
    private onMessage(event: MessageEvent): void;
    private onError(error: ErrorEvent | object): void;
    private onClose(event: CloseEvent): void;
    private onPacket(packet: object): void;
    private checkReady(): void;
    private setHelloTimeout(time?: number): void;
    private setHeartbeatTimer(time: number): void;
    private sendHeartbeat(): void;
    private ackHeartbeat(): void;
    private identify(): void;
    private identifyNew(): void;
    private identifyResume(): void;
    private _send(data: object): void;
    private processQueue(): void;
    private destroy(destroyOptions?: { closeCode?: number; reset?: boolean; emit?: boolean; log?: boolean }): void;
    private _cleanupConnection(): void;
    private _emitDestroyed(): void;

    public send(data: object): void;
    public on(event: 'ready' | 'resumed' | 'invalidSession', listener: () => void): this;
    public on(event: 'close', listener: (event: CloseEvent) => void): this;
    public on(event: 'allReady', listener: (unavailableGuilds?: Set<Snowflake>) => void): this;
    public on(event: string, listener: (...args: any[]) => void): this;

    public once(event: 'ready' | 'resumed' | 'invalidSession', listener: () => void): this;
    public once(event: 'close', listener: (event: CloseEvent) => void): this;
    public once(event: 'allReady', listener: (unavailableGuilds?: Set<Snowflake>) => void): this;
    public once(event: string, listener: (...args: any[]) => void): this;
  }

  //#endregion

  //#region Collections

  export class Collection<K, V> extends BaseCollection<K, V> {
    public flatMap<T>(
      fn: (value: V, key: K, collection: this) => Collection<K, T>,
      thisArg?: unknown,
    ): Collection<K, T>;
    public flatMap<T, This>(
      fn: (this: This, value: V, key: K, collection: this) => Collection<K, T>,
      thisArg: This,
    ): Collection<K, T>;
    public mapValues<T>(fn: (value: V, key: K, collection: this) => T, thisArg?: unknown): Collection<K, T>;
    public mapValues<This, T>(
      fn: (this: This, value: V, key: K, collection: this) => T,
      thisArg: This,
    ): Collection<K, T>;
    public toJSON(): object;
  }

  //#endregion

  //#region Managers

  export class ChannelManager extends BaseManager<Snowflake, Channel, ChannelResolvable> {
    constructor(client: Client, iterable: Iterable<any>);
    public fetch(id: Snowflake, cache?: boolean): Promise<Channel>;
  }

  export abstract class BaseManager<K, Holds, R> {
    constructor(client: Client, iterable: Iterable<any>, holds: Constructable<Holds>, cacheType: Collection<K, Holds>);
    public holds: Constructable<Holds>;
    public cache: Collection<K, Holds>;
    public cacheType: Collection<K, Holds>;
    public readonly client: Client;
    public add(data: any, cache?: boolean, { id, extras }?: { id: K; extras: any[] }): Holds;
    public resolve(resolvable: R): Holds | null;
    public resolveID(resolvable: R): K | null;
  }

  export class GuildChannelManager extends BaseManager<Snowflake, GuildChannel, GuildChannelResolvable> {
    constructor(guild: Guild, iterable?: Iterable<any>);
    public guild: Guild;
    public create(name: string, options: GuildCreateChannelOptions & { type: 'voice' }): Promise<VoiceChannel>;
    public create(name: string, options: GuildCreateChannelOptions & { type: 'category' }): Promise<CategoryChannel>;
    public create(name: string, options?: GuildCreateChannelOptions & { type?: 'text' }): Promise<TextChannel>;
    public create(
      name: string,
      options: GuildCreateChannelOptions,
    ): Promise<TextChannel | VoiceChannel | CategoryChannel>;
  }

  export class GuildEmojiManager extends BaseManager<Snowflake, GuildEmoji, EmojiResolvable> {
    constructor(guild: Guild, iterable?: Iterable<any>);
    public guild: Guild;
    public create(
      attachment: BufferResolvable | Base64Resolvable,
      name: string,
      options?: GuildEmojiCreateOptions,
    ): Promise<GuildEmoji>;
    public resolveIdentifier(emoji: EmojiIdentifierResolvable): string | null;
  }

  export class GuildEmojiRoleManager {
    constructor(emoji: GuildEmoji);
    public emoji: GuildEmoji;
    public guild: Guild;
    public cache: Collection<Snowflake, Role>;
    public add(roleOrRoles: RoleResolvable | RoleResolvable[] | Collection<Snowflake, Role>): Promise<GuildEmoji>;
    public set(roles: RoleResolvable[] | Collection<Snowflake, Role>): Promise<GuildEmoji>;
    public remove(roleOrRoles: RoleResolvable | RoleResolvable[] | Collection<Snowflake, Role>): Promise<GuildEmoji>;
  }

  export class GuildManager extends BaseManager<Snowflake, Guild, GuildResolvable> {
    constructor(client: Client, iterable?: Iterable<any>);
    public create(
      name: string,
      options?: { region?: string; icon: BufferResolvable | Base64Resolvable | null },
    ): Promise<Guild>;
  }

  export class GuildMemberManager extends BaseManager<Snowflake, GuildMember, GuildMemberResolvable> {
    constructor(guild: Guild, iterable?: Iterable<any>);
    public guild: Guild;
    public ban(user: UserResolvable, options?: BanOptions): Promise<GuildMember | User | Snowflake>;
    public fetch(
      options: UserResolvable | FetchMemberOptions | (FetchMembersOptions & { user: UserResolvable }),
    ): Promise<GuildMember>;
    public fetch(options?: FetchMembersOptions): Promise<Collection<Snowflake, GuildMember>>;
    public prune(options: GuildPruneMembersOptions & { dry?: false; count: false }): Promise<null>;
    public prune(options?: GuildPruneMembersOptions): Promise<number>;
    public unban(user: UserResolvable, reason?: string): Promise<User>;
  }

  export class GuildMemberRoleManager extends OverridableManager<Snowflake, Role, RoleResolvable> {
    constructor(member: GuildMember);
    public readonly hoist: Role | null;
    public readonly color: Role | null;
    public readonly highest: Role;
    public member: GuildMember;
    public guild: Guild;

    public add(
      roleOrRoles: RoleResolvable | RoleResolvable[] | Collection<Snowflake, Role>,
      reason?: string,
    ): Promise<GuildMember>;
    public set(roles: RoleResolvable[] | Collection<Snowflake, Role>, reason?: string): Promise<GuildMember>;
    public remove(
      roleOrRoles: RoleResolvable | RoleResolvable[] | Collection<Snowflake, Role>,
      reason?: string,
    ): Promise<GuildMember>;
  }

  export class MessageManager extends BaseManager<Snowflake, Message, MessageResolvable> {
    constructor(channel: TextChannel | DMChannel, iterable?: Iterable<any>);
    public channel: TextBasedChannelFields;
    public cache: Collection<Snowflake, Message>;
    public fetch(message: Snowflake, cache?: boolean): Promise<Message>;
    public fetch(options?: ChannelLogsQueryOptions, cache?: boolean): Promise<Collection<Snowflake, Message>>;
    public fetchPinned(cache?: boolean): Promise<Collection<Snowflake, Message>>;
    public delete(message: MessageResolvable, reason?: string): Promise<void>;
  }

  // Hacky workaround because changing the signature of an overridden method errors
  class OverridableManager<V, K, R = any> extends BaseManager<V, K, R> {
    public add(data: any, cache: any): any;
    public set(key: any): any;
  }

  export class PresenceManager extends BaseManager<Snowflake, Presence, PresenceResolvable> {
    constructor(client: Client, iterable?: Iterable<any>);
  }

  export class ReactionManager extends BaseManager<Snowflake, MessageReaction, MessageReactionResolvable> {
    constructor(message: Message, iterable?: Iterable<any>);
    public message: Message;
    public removeAll(): Promise<Message>;
  }

  export class ReactionUserManager extends BaseManager<Snowflake, User, UserResolvable> {
    constructor(client: Client, iterable: Iterable<any> | undefined, reaction: MessageReaction);
    public reaction: MessageReaction;
    public fetch(options?: {
      limit?: number;
      after?: Snowflake;
      before?: Snowflake;
    }): Promise<Collection<Snowflake, User>>;
    public remove(user?: UserResolvable): Promise<MessageReaction>;
  }

  export class RoleManager extends BaseManager<Snowflake, Role, RoleResolvable> {
    constructor(guild: Guild, iterable?: Iterable<any>);
    public readonly everyone: Role;
    public readonly highest: Role;
    public guild: Guild;

    public create(options?: { data?: RoleData; reason?: string }): Promise<Role>;
    public fetch(id: Snowflake, cache?: boolean): Promise<Role | null>;
    public fetch(id?: Snowflake, cache?: boolean): Promise<this>;
  }

  export class UserManager extends BaseManager<Snowflake, User, UserResolvable> {
    constructor(client: Client, iterable?: Iterable<any>);
    public fetch(id: Snowflake, cache?: boolean): Promise<User>;
  }

  export class VoiceStateManager extends BaseManager<Snowflake, VoiceState, typeof VoiceState> {
    constructor(guild: Guild, iterable?: Iterable<any>);
    public guild: Guild;
  }

  //#endregion

  //#region Mixins

  // Model the TextBasedChannel mixin system, allowing application of these fields
  // to the classes that use these methods without having to manually add them
  // to each of those classes

  type Constructable<T> = new (...args: any[]) => T;
  function PartialTextBasedChannel<T>(Base?: Constructable<T>): Constructable<T & PartialTextBasedChannelFields>;
  function TextBasedChannel<T>(Base?: Constructable<T>): Constructable<T & TextBasedChannelFields>;

  interface PartialTextBasedChannelFields {
    lastMessageID: Snowflake | null;
    readonly lastMessage: Message | null;
    send(
      options: MessageOptions | (MessageOptions & { split?: false }) | MessageAdditions | APIMessage,
    ): Promise<Message>;
    send(
      options: (MessageOptions & { split: true | SplitOptions; content: StringResolvable }) | APIMessage,
    ): Promise<Message[]>;
    send(
      content: StringResolvable,
      options?: MessageOptions | (MessageOptions & { split?: false }) | MessageAdditions,
    ): Promise<Message>;
    send(content: StringResolvable, options?: MessageOptions & { split: true | SplitOptions }): Promise<Message[]>;
  }

  interface TextBasedChannelFields extends PartialTextBasedChannelFields {
    _typing: Map<string, TypingData>;
    lastPinTimestamp: number | null;
    readonly lastPinAt: Date;
    typing: boolean;
    typingCount: number;
    awaitMessages(filter: CollectorFilter, options?: AwaitMessagesOptions): Promise<Collection<Snowflake, Message>>;
    bulkDelete(
      messages: Collection<Snowflake, Message> | Message[] | Snowflake[] | number,
      filterOld?: boolean,
    ): Promise<Collection<Snowflake, Message>>;
    createMessageCollector(filter: CollectorFilter, options?: MessageCollectorOptions): MessageCollector;
    startTyping(count?: number): Promise<void>;
    stopTyping(force?: boolean): void;
  }

  function WebhookMixin<T>(Base?: Constructable<T>): Constructable<T & WebhookFields>;

  function VolumeMixin<T>(base: Constructable<T>): Constructable<T & VolumeInterface>;

  interface WebhookFields {
    id: Snowflake;
    readonly createdAt: Date;
    readonly createdTimestamp: number;
    readonly url: string;
    delete(reason?: string): Promise<void>;
    edit(options: WebhookEditData): Promise<Webhook>;
    send(
      content?: StringResolvable,
      options?: (WebhookMessageOptions & { split?: false }) | MessageAdditions,
    ): Promise<Message>;
    send(
      content?: StringResolvable,
      options?: (WebhookMessageOptions & { split: true | SplitOptions }) | MessageAdditions,
    ): Promise<Message[]>;
    send(options?: (WebhookMessageOptions & { split?: false }) | MessageAdditions | APIMessage): Promise<Message>;
    send(
      options?: (WebhookMessageOptions & { split: true | SplitOptions }) | MessageAdditions | APIMessage,
    ): Promise<Message[]>;
    sendSlackMessage(body: object): Promise<boolean>;
  }

  //#endregion

  //#region Typedefs

  type ActivityFlagsString = 'INSTANCE' | 'JOIN' | 'SPECTATE' | 'JOIN_REQUEST' | 'SYNC' | 'PLAY';

  interface ActivityOptions {
    name?: string;
    url?: string;
    type?: ActivityType | number;
    shardID?: number | number[];
  }

  type ActivityType = 'PLAYING' | 'STREAMING' | 'LISTENING' | 'WATCHING' | 'CUSTOM_STATUS';

  interface AddGuildMemberOptions {
    accessToken: string;
    nick?: string;
    roles?: Collection<Snowflake, Role> | RoleResolvable[];
    mute?: boolean;
    deaf?: boolean;
  }

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

  interface AuditLogChange {
    key: string;
    old?: any;
    new?: any;
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

  type BitFieldResolvable<T extends string> =
    | RecursiveArray<T | number | Readonly<BitField<T>>>
    | T
    | number
    | Readonly<BitField<T>>;

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

  interface ClientEvents {
    channelCreate: [Channel];
    channelDelete: [Channel | PartialDMChannel];
    channelPinsUpdate: [Channel | PartialDMChannel, Date];
    channelUpdate: [Channel, Channel];
    debug: [string];
    warn: [string];
    disconnect: [any, number];
    emojiCreate: [GuildEmoji];
    emojiDelete: [GuildEmoji];
    emojiUpdate: [GuildEmoji, GuildEmoji];
    error: [Error];
    guildBanAdd: [Guild, User | PartialUser];
    guildBanRemove: [Guild, User | PartialUser];
    guildCreate: [Guild];
    guildDelete: [Guild];
    guildUnavailable: [Guild];
    guildIntegrationsUpdate: [Guild];
    guildMemberAdd: [GuildMember | PartialGuildMember];
    guildMemberAvailable: [GuildMember | PartialGuildMember];
    guildMemberRemove: [GuildMember | PartialGuildMember];
    guildMembersChunk: [Collection<Snowflake, GuildMember | PartialGuildMember>, Guild];
    guildMemberSpeaking: [GuildMember | PartialGuildMember, Readonly<Speaking>];
    guildMemberUpdate: [GuildMember | PartialGuildMember, GuildMember | PartialGuildMember];
    guildUpdate: [Guild, Guild];
    inviteCreate: [Invite];
    inviteDelete: [Invite];
    message: [Message];
    messageDelete: [Message | PartialMessage];
    messageReactionRemoveAll: [Message | PartialMessage];
    messageReactionRemoveEmoji: [MessageReaction];
    messageDeleteBulk: [Collection<Snowflake, Message | PartialMessage>];
    messageReactionAdd: [MessageReaction, User | PartialUser];
    messageReactionRemove: [MessageReaction, User | PartialUser];
    messageUpdate: [Message | PartialMessage, Message | PartialMessage];
    presenceUpdate: [Presence | undefined, Presence];
    rateLimit: [RateLimitData];
    ready: [];
    invalidated: [];
    roleCreate: [Role];
    roleDelete: [Role];
    roleUpdate: [Role, Role];
    typingStart: [Channel | PartialDMChannel, User | PartialUser];
    userUpdate: [User | PartialUser, User | PartialUser];
    voiceStateUpdate: [VoiceState, VoiceState];
    webhookUpdate: [TextChannel];
    shardDisconnect: [CloseEvent, number];
    shardError: [Error, number];
    shardReady: [number];
    shardReconnecting: [number];
    shardResume: [number, number];
  }

  interface ClientOptions {
    shards?: number | number[] | 'auto';
    shardCount?: number;
    messageCacheMaxSize?: number;
    messageCacheLifetime?: number;
    messageSweepInterval?: number;
    fetchAllMembers?: boolean;
    disableMentions?: 'none' | 'all' | 'everyone';
    allowedMentions?: MessageMentionOptions;
    partials?: PartialTypes[];
    restWsBridgeTimeout?: number;
    restTimeOffset?: number;
    restRequestTimeout?: number;
    restSweepInterval?: number;
    retryLimit?: number;
    presence?: PresenceData;
    ws?: WebSocketOptions;
    http?: HTTPOptions;
  }

  type ClientPresenceStatus = 'online' | 'idle' | 'dnd';

  interface ClientPresenceStatusData {
    web?: ClientPresenceStatus;
    mobile?: ClientPresenceStatus;
    desktop?: ClientPresenceStatus;
  }

  interface CloseEvent {
    wasClean: boolean;
    code: number;
    reason: string;
    target: WebSocket;
  }

  type CollectorFilter = (...args: any[]) => boolean;

  interface CollectorOptions {
    time?: number;
    idle?: number;
    dispose?: boolean;
  }

  type ColorResolvable =
    | 'DEFAULT'
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

  interface CrosspostedChannel {
    channelID: Snowflake;
    guildID: Snowflake;
    type: keyof typeof ChannelType;
    name: string;
  }

  interface DeconstructedSnowflake {
    timestamp: number;
    readonly date: Date;
    workerID: number;
    processID: number;
    increment: number;
    binary: string;
  }

  type DefaultMessageNotifications = 'ALL' | 'MENTIONS';

  interface EmbedField {
    name: string;
    value: string;
    inline: boolean;
  }

  interface EmbedFieldData {
    name: StringResolvable;
    value: StringResolvable;
    inline?: boolean;
  }

  type EmojiIdentifierResolvable = string | EmojiResolvable;

  type EmojiResolvable = Snowflake | GuildEmoji | ReactionEmoji;

  interface ErrorEvent {
    error: any;
    message: string;
    type: string;
    target: WebSocket;
  }

  interface EscapeMarkdownOptions {
    codeBlock?: boolean;
    inlineCode?: boolean;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    spoiler?: boolean;
    inlineCodeContent?: boolean;
    codeBlockContent?: boolean;
  }

  type ExplicitContentFilterLevel = 'DISABLED' | 'MEMBERS_WITHOUT_ROLES' | 'ALL_MEMBERS';

  interface Extendable {
    GuildEmoji: typeof GuildEmoji;
    DMChannel: typeof DMChannel;
    TextChannel: typeof TextChannel;
    VoiceChannel: typeof VoiceChannel;
    CategoryChannel: typeof CategoryChannel;
    NewsChannel: typeof NewsChannel;
    StoreChannel: typeof StoreChannel;
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
    user?: UserResolvable | UserResolvable[];
    query?: string;
    limit?: number;
    withPresences?: boolean;
    time?: number;
  }

  interface FileOptions {
    attachment: BufferResolvable | Stream;
    name?: string;
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
    MEMBER_MOVE?: number;
    MEMBER_DISCONNECT?: number;
    BOT_ADD?: number;
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
    MESSAGE_BULK_DELETE?: number;
    MESSAGE_PIN?: number;
    MESSAGE_UNPIN?: number;
    INTEGRATION_CREATE?: number;
    INTEGRATION_UPDATE?: number;
    INTEGRATION_DELETE?: number;
  }

  type GuildAuditLogsActionType = 'CREATE' | 'DELETE' | 'UPDATE' | 'ALL';

  interface GuildAuditLogsFetchOptions {
    before?: Snowflake | GuildAuditLogsEntry;
    limit?: number;
    user?: UserResolvable;
    type?: GuildAuditLogsAction | number;
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
    INTEGRATION?: string;
    UNKNOWN?: string;
  }

  type GuildChannelResolvable = Snowflake | GuildChannel;

  interface GuildCreateChannelOptions {
    permissionOverwrites?: OverwriteResolvable[] | Collection<Snowflake, OverwriteResolvable>;
    topic?: string;
    type?: Exclude<
      keyof typeof ChannelType | ChannelType,
      'dm' | 'group' | 'unknown' | ChannelType.dm | ChannelType.group | ChannelType.unknown
    >;
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

  interface GuildEditData {
    name?: string;
    region?: string;
    verificationLevel?: VerificationLevel;
    explicitContentFilter?: ExplicitContentFilterLevel;
    defaultMessageNotifications?: DefaultMessageNotifications | number;
    afkChannel?: ChannelResolvable;
    systemChannel?: ChannelResolvable;
    systemChannelFlags?: SystemChannelFlagsResolvable;
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

  interface GuildEmojiCreateOptions {
    roles?: Collection<Snowflake, Role> | RoleResolvable[];
    reason?: string;
  }

  interface GuildEmojiEditData {
    name?: string;
    roles?: Collection<Snowflake, Role> | RoleResolvable[];
  }

  type GuildFeatures =
    | 'ANIMATED_ICON'
    | 'BANNER'
    | 'COMMERCE'
    | 'DISCOVERABLE'
    | 'FEATURABLE'
    | 'INVITE_SPLASH'
    | 'NEWS'
    | 'PARTNERED'
    | 'PUBLIC'
    | 'PUBLIC_DISABLED'
    | 'VANITY_URL'
    | 'VERIFIED'
    | 'VIP_REGIONS'
    | 'WELCOME_SCREEN_ENABLED';

  interface GuildMemberEditData {
    nick?: string;
    roles?: Collection<Snowflake, Role> | RoleResolvable[];
    mute?: boolean;
    deaf?: boolean;
    channel?: ChannelResolvable | null;
  }

  type GuildMemberResolvable = GuildMember | UserResolvable;

  type GuildResolvable = Guild | GuildChannel | GuildMember | GuildEmoji | Invite | Role | Snowflake;

  interface GuildPruneMembersOptions {
    count?: boolean;
    days?: number;
    dry?: boolean;
    reason?: string;
  }

  interface HTTPOptions {
    api?: string;
    version?: number;
    host?: string;
    cdn?: string;
    invite?: string;
  }

  type ImageSize = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;

  interface ImageURLOptions {
    format?: AllowedImageFormat;
    size?: ImageSize;
  }

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

  type IntentsString =
    | 'GUILDS'
    | 'GUILD_MEMBERS'
    | 'GUILD_BANS'
    | 'GUILD_EMOJIS'
    | 'GUILD_INTEGRATIONS'
    | 'GUILD_WEBHOOKS'
    | 'GUILD_INVITES'
    | 'GUILD_VOICE_STATES'
    | 'GUILD_PRESENCES'
    | 'GUILD_MESSAGES'
    | 'GUILD_MESSAGE_REACTIONS'
    | 'GUILD_MESSAGE_TYPING'
    | 'DIRECT_MESSAGES'
    | 'DIRECT_MESSAGE_REACTIONS'
    | 'DIRECT_MESSAGE_TYPING';

  interface InviteOptions {
    temporary?: boolean;
    maxAge?: number;
    maxUses?: number;
    unique?: boolean;
    reason?: string;
  }

  type InviteResolvable = string;

  type MembershipStates = 'INVITED' | 'ACCEPTED';

  type MessageAdditions = MessageEmbed | MessageAttachment | (MessageEmbed | MessageAttachment)[];

  interface MessageActivity {
    partyID: string;
    type: number;
  }

  interface MessageCollectorOptions extends CollectorOptions {
    max?: number;
    maxProcessed?: number;
  }

  interface MessageEditOptions {
    content?: string;
    embed?: MessageEmbedOptions | null;
    code?: string | boolean;
    flags?: BitFieldResolvable<MessageFlagsString>;
    allowedMentions?: MessageMentionOptions;
  }

  interface MessageEmbedAuthor {
    name?: string;
    url?: string;
    iconURL?: string;
    proxyIconURL?: string;
  }

  interface MessageEmbedFooter {
    text?: string;
    iconURL?: string;
    proxyIconURL?: string;
  }

  interface MessageEmbedImage {
    url: string;
    proxyURL?: string;
    height?: number;
    width?: number;
  }

  interface MessageEmbedOptions {
    title?: string;
    description?: string;
    url?: string;
    timestamp?: Date | number;
    color?: ColorResolvable;
    fields?: EmbedFieldData[];
    files?: (MessageAttachment | string | FileOptions)[];
    author?: Partial<MessageEmbedAuthor> & { icon_url?: string; proxy_icon_url?: string };
    thumbnail?: Partial<MessageEmbedThumbnail> & { proxy_url?: string };
    image?: Partial<MessageEmbedImage> & { proxy_url?: string };
    video?: Partial<MessageEmbedVideo> & { proxy_url?: string };
    footer?: Partial<MessageEmbedFooter> & { icon_url?: string; proxy_icon_url?: string };
  }

  interface MessageEmbedProvider {
    name: string;
    url: string;
  }

  interface MessageEmbedThumbnail {
    url: string;
    proxyURL?: string;
    height?: number;
    width?: number;
  }

  interface MessageEmbedVideo {
    url?: string;
    proxyURL?: string;
    height?: number;
    width?: number;
  }

  interface MessageEvent {
    data: WebSocket.Data;
    type: string;
    target: WebSocket;
  }

  type MessageFlagsString = 'CROSSPOSTED' | 'IS_CROSSPOST' | 'SUPPRESS_EMBEDS' | 'SOURCE_MESSAGE_DELETED' | 'URGENT';

  interface MessageMentionOptions {
    parse?: MessageMentionTypes[];
    roles?: Snowflake[];
    users?: Snowflake[];
  }

  type MessageMentionTypes = 'roles' | 'users' | 'everyone';

  interface MessageOptions {
    tts?: boolean;
    nonce?: string;
    content?: string;
    embed?: MessageEmbed | MessageEmbedOptions;
    disableMentions?: 'none' | 'all' | 'everyone';
    allowedMentions?: MessageMentionOptions;
    files?: (FileOptions | BufferResolvable | Stream | MessageAttachment)[];
    code?: string | boolean;
    split?: boolean | SplitOptions;
    reply?: UserResolvable;
  }

  type MessageReactionResolvable = MessageReaction | Snowflake;

  interface MessageReference {
    channelID: string;
    guildID: string;
    messageID: string | null;
  }

  type MessageResolvable = Message | Snowflake;

  type MessageTarget = TextChannel | DMChannel | User | GuildMember | Webhook | WebhookClient;

  type MessageType =
    | 'DEFAULT'
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
    | 'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3'
    | 'CHANNEL_FOLLOW_ADD'
    | 'GUILD_DISCOVERY_DISQUALIFIED'
    | 'GUILD_DISCOVERY_REQUALIFIED';

  interface OverwriteData {
    allow?: PermissionResolvable;
    deny?: PermissionResolvable;
    id: GuildMemberResolvable | RoleResolvable;
    type?: OverwriteType;
  }

  type OverwriteResolvable = PermissionOverwrites | OverwriteData;

  type OverwriteType = 'member' | 'role';

  interface PermissionFlags extends Record<PermissionString, number> {}

  interface PermissionObject extends Record<PermissionString, boolean> {}

  interface PermissionOverwriteOption extends Partial<Record<PermissionString, boolean | null>> {}

  type PermissionResolvable = BitFieldResolvable<PermissionString>;

  type PermissionString =
    | 'CREATE_INSTANT_INVITE'
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
    | 'VIEW_GUILD_INSIGHTS'
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

  interface RecursiveArray<T> extends Array<T | RecursiveArray<T>> {}

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

  type Partialize<T, O extends string> = {
    readonly client: Client;
    readonly createdAt: Date;
    readonly createdTimestamp: number;
    deleted: boolean;
    id: string;
    partial: true;
    fetch(): Promise<T>;
  } & {
    [K in keyof Omit<
      T,
      'client' | 'createdAt' | 'createdTimestamp' | 'id' | 'partial' | 'fetch' | O
    >]: T[K] extends Function ? T[K] : T[K] | null; // tslint:disable-line:ban-types
  };

  interface PartialDMChannel
    extends Partialize<
      DMChannel,
      'lastMessage' | 'lastMessageID' | 'messages' | 'recipient' | 'type' | 'typing' | 'typingCount'
    > {
    lastMessage: null;
    lastMessageID: undefined;
    messages: MessageManager;
    recipient: User | PartialUser;
    type: 'dm';
    readonly typing: boolean;
    readonly typingCount: number;
  }

  interface PartialChannelData {
    id?: number;
    name: string;
    topic?: string;
    type?: ChannelType;
    parentID?: number;
    permissionOverwrites?: {
      id: number | Snowflake;
      type?: OverwriteType;
      allow?: PermissionResolvable;
      deny?: PermissionResolvable;
    }[];
  }

  interface PartialGuildMember
    extends Partialize<
      GuildMember,
      'bannable' | 'displayColor' | 'displayHexColor' | 'displayName' | 'guild' | 'kickable' | 'permissions' | 'roles'
    > {
    readonly bannable: boolean;
    readonly displayColor: number;
    readonly displayHexColor: string;
    readonly displayName: string;
    guild: Guild;
    joinedAt: null;
    joinedTimestamp: null;
    readonly kickable: boolean;
    readonly permissions: GuildMember['permissions'];
    readonly roles: GuildMember['roles'];
  }

  interface PartialMessage
    extends Partialize<
      Message,
      'attachments' | 'channel' | 'deletable' | 'editable' | 'mentions' | 'pinnable' | 'system' | 'url'
    > {
    attachments: Message['attachments'];
    channel: Message['channel'];
    readonly deletable: boolean;
    readonly editable: boolean;
    mentions: Message['mentions'];
    readonly pinnable: boolean;
    reactions: Message['reactions'];
    system: boolean;
    readonly url: string;
  }

  interface PartialRoleData extends RoleData {
    id?: number;
  }

  type PartialTypes = 'USER' | 'CHANNEL' | 'GUILD_MEMBER' | 'MESSAGE' | 'REACTION';

  interface PartialUser extends Partialize<User, 'discriminator' | 'username' | 'tag'> {
    discriminator: undefined;
    username: undefined;
    readonly tag: null;
  }

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

  type SpeakingString = 'SPEAKING' | 'SOUNDSHARE' | 'PRIORITY_SPEAKING';

  type StreamType = 'unknown' | 'converted' | 'opus' | 'ogg/opus' | 'webm/opus';

  type StringResolvable = string | string[] | any;

  type SystemChannelFlagsString = 'WELCOME_MESSAGE_DISABLED' | 'BOOST_MESSAGE_DISABLED';

  type SystemChannelFlagsResolvable = BitFieldResolvable<SystemChannelFlagsString>;

  type TargetUser = number;

  interface TypingData {
    user: User | PartialUser;
    since: Date;
    lastTimestamp: Date;
    elapsedTime: number;
    timeout: NodeJS.Timeout;
  }

  type UserFlagsString =
    | 'DISCORD_EMPLOYEE'
    | 'DISCORD_PARTNER'
    | 'HYPESQUAD_EVENTS'
    | 'BUGHUNTER_LEVEL_1'
    | 'HOUSE_BRAVERY'
    | 'HOUSE_BRILLIANCE'
    | 'HOUSE_BALANCE'
    | 'EARLY_SUPPORTER'
    | 'TEAM_USER'
    | 'SYSTEM'
    | 'BUGHUNTER_LEVEL_2'
    | 'VERIFIED_BOT'
    | 'VERIFIED_DEVELOPER';

  type UserResolvable = User | Snowflake | Message | GuildMember;

  type VerificationLevel = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';

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
    disableMentions?: 'none' | 'all' | 'everyone';
    allowedMentions?: MessageMentionOptions;
    files?: (FileOptions | BufferResolvable | Stream | MessageAttachment)[];
    code?: string | boolean;
    split?: boolean | SplitOptions;
  }

  type WebhookTypes = 'Incoming' | 'Channel Follower';

  interface WebSocketOptions {
    large_threshold?: number;
    compress?: boolean;
    intents?: BitFieldResolvable<IntentsString> | number;
  }

  type WSEventType =
    | 'READY'
    | 'RESUMED'
    | 'GUILD_CREATE'
    | 'GUILD_DELETE'
    | 'GUILD_UPDATE'
    | 'INVITE_CREATE'
    | 'INVITE_DELETE'
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
    | 'MESSAGE_REACTION_REMOVE_EMOJI'
    | 'USER_UPDATE'
    | 'PRESENCE_UPDATE'
    | 'TYPING_START'
    | 'VOICE_STATE_UPDATE'
    | 'VOICE_SERVER_UPDATE'
    | 'WEBHOOKS_UPDATE';

  //#endregion
}
