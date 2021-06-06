declare enum ChannelType {
  text = 0,
  dm = 1,
  voice = 2,
  group = 3,
  category = 4,
  news = 5,
  store = 6,
  unknown = 7,
  stage = 13,
}

declare enum ChannelTypes {
  TEXT = 0,
  DM = 1,
  VOICE = 2,
  GROUP = 3,
  CATEGORY = 4,
  NEWS = 5,
  STORE = 6,
  STAGE = 13,
}

declare enum InteractionResponseTypes {
  PONG = 1,
  CHANNEL_MESSAGE_WITH_SOURCE = 4,
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = 5,
  DEFERRED_MESSAGE_UPDATE = 6,
  UPDATE_MESSAGE = 7,
}

declare enum InteractionTypes {
  PING = 1,
  APPLICATION_COMMAND = 2,
  MESSAGE_COMPONENT = 3,
}

declare enum InviteTargetType {
  STREAM = 1,
  EMBEDDED_APPLICATION = 2,
}

declare enum MessageButtonStyles {
  PRIMARY = 1,
  SECONDARY = 2,
  SUCCESS = 3,
  DANGER = 4,
  LINK = 5,
}

declare enum MessageComponentTypes {
  ACTION_ROW = 1,
  BUTTON = 2,
}

declare enum NSFWLevels {
  DEFAULT = 0,
  EXPLICIT = 1,
  SAFE = 2,
  AGE_RESTRICTED = 3,
}

declare enum OverwriteTypes {
  role = 0,
  member = 1,
}

declare enum StickerFormatTypes {
  PNG = 1,
  APNG = 2,
  LOTTIE = 3,
}

type Awaited<T> = T | Promise<T>;

declare module 'discord.js' {
  import BaseCollection from '@discordjs/collection';
  import { ChildProcess } from 'child_process';
  import {
    APIInteractionDataResolvedChannel as RawInteractionDataResolvedChannel,
    APIInteractionDataResolvedGuildMember as RawInteractionDataResolvedGuildMember,
    APIInteractionGuildMember as RawInteractionGuildMember,
    APIMessage as RawMessage,
    APIOverwrite as RawOverwrite,
    APIPartialEmoji as RawEmoji,
    APIRole as RawRole,
    Snowflake as APISnowflake,
    ApplicationCommandOptionType as ApplicationCommandOptionTypes,
    ApplicationCommandPermissionType as ApplicationCommandPermissionTypes,
  } from 'discord-api-types/v8';
  import { EventEmitter } from 'events';
  import { PathLike } from 'fs';
  import { Readable, Stream, Writable } from 'stream';
  import * as WebSocket from 'ws';

  export const version: string;

  //#region Classes

  export class Activity {
    constructor(presence: Presence, data?: unknown);
    public applicationID: Snowflake | null;
    public assets: RichPresenceAssets | null;
    public buttons: string[];
    public readonly createdAt: Date;
    public createdTimestamp: number;
    public details: string | null;
    public emoji: Emoji | null;
    public flags: Readonly<ActivityFlags>;
    public id: Snowflake;
    public name: string;
    public party: {
      id: string | null;
      size: [number, number];
    } | null;
    public platform: ActivityPlatform | null;
    public sessionID: string | null;
    public state: string | null;
    public syncID: string | null;
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
    public static resolve(bit?: BitFieldResolvable<ActivityFlagsString, number>): number;
  }

  export class APIMessage {
    constructor(target: MessageTarget, options: MessageOptions | WebhookMessageOptions);
    public data: unknown | null;
    public readonly isUser: boolean;
    public readonly isWebhook: boolean;
    public readonly isMessage: boolean;
    public readonly isInteraction: boolean;
    public files: unknown[] | null;
    public options: MessageOptions | WebhookMessageOptions;
    public target: MessageTarget;

    public static create(
      target: MessageTarget,
      content: string | null,
      options?: undefined,
      extra?: MessageOptions | WebhookMessageOptions,
    ): APIMessage;
    public static create(
      target: MessageTarget,
      content: string | null,
      options: MessageOptions | WebhookMessageOptions | MessageAdditions,
      extra?: MessageOptions | WebhookMessageOptions,
    ): APIMessage;
    public static partitionMessageAdditions(
      items: readonly (MessageEmbed | MessageAttachment)[],
    ): [MessageEmbed[], MessageAttachment[]];
    public static resolveFile(fileLike: BufferResolvable | Stream | FileOptions | MessageAttachment): Promise<unknown>;
    public static transformOptions(
      content: string | null,
      options?: undefined,
      extra?: MessageOptions | WebhookMessageOptions,
      isWebhook?: boolean,
    ): MessageOptions | WebhookMessageOptions;
    public static transformOptions(
      content: string | null,
      options: MessageOptions | WebhookMessageOptions | MessageAdditions,
      extra?: MessageOptions | WebhookMessageOptions,
      isWebhook?: boolean,
    ): MessageOptions | WebhookMessageOptions;

    public makeContent(): string | string[] | undefined;
    public resolveData(): this;
    public resolveFiles(): Promise<this>;
    public split(): APIMessage[];
  }

  export abstract class Application {
    constructor(client: Client, data: unknown);
    public readonly createdAt: Date;
    public readonly createdTimestamp: number;
    public description: string | null;
    public icon: string | null;
    public id: Snowflake;
    public name: string | null;
    public coverURL(options?: ImageURLOptions): string | null;
    public fetchAssets(): Promise<ApplicationAsset[]>;
    public iconURL(options?: ImageURLOptions): string | null;
    public toJSON(): unknown;
    public toString(): string | null;
  }

  export class ApplicationCommand extends Base {
    constructor(client: Client, data: unknown, guild?: Guild);
    public readonly createdAt: Date;
    public readonly createdTimestamp: number;
    public defaultPermission: boolean;
    public description: string;
    public guild: Guild | null;
    public readonly manager: ApplicationCommandManager;
    public id: Snowflake;
    public name: string;
    public options: ApplicationCommandOption[];
    public delete(): Promise<ApplicationCommand>;
    public edit(data: ApplicationCommandData): Promise<ApplicationCommand>;
    public fetchPermissions(): Promise<ApplicationCommandPermissions[]>;
    public setPermissions(permissions: ApplicationCommandPermissionData[]): Promise<ApplicationCommandPermissions[]>;
    private static transformOption(option: ApplicationCommandOptionData, received?: boolean): unknown;
  }

  type ApplicationResolvable = Application | Activity | Snowflake;

  export class ApplicationFlags extends BitField<ApplicationFlagsString> {
    public static FLAGS: Record<ApplicationFlagsString, number>;
    public static resolve(bit?: BitFieldResolvable<ApplicationFlagsString, number>): number;
  }

  export class Base {
    constructor(client: Client);
    public readonly client: Client;
    public toJSON(...props: { [key: string]: boolean | string }[]): unknown;
    public valueOf(): string;
  }

  export class BaseClient extends EventEmitter {
    constructor(options?: ClientOptions | WebhookClientOptions);
    private _timeouts: Set<NodeJS.Timeout>;
    private _intervals: Set<NodeJS.Timeout>;
    private _immediates: Set<NodeJS.Immediate>;
    private readonly api: unknown;
    private rest: unknown;
    private decrementMaxListeners(): void;
    private incrementMaxListeners(): void;

    public options: ClientOptions | WebhookClientOptions;
    public clearInterval(interval: NodeJS.Timeout): void;
    public clearTimeout(timeout: NodeJS.Timeout): void;
    public clearImmediate(timeout: NodeJS.Immediate): void;
    public destroy(): void;
    public setInterval(fn: (...args: any[]) => void, delay: number, ...args: any[]): NodeJS.Timeout;
    public setTimeout(fn: (...args: any[]) => void, delay: number, ...args: any[]): NodeJS.Timeout;
    public setImmediate(fn: (...args: any[]) => void, ...args: any[]): NodeJS.Immediate;
    public toJSON(...props: { [key: string]: boolean | string }[]): unknown;
  }

  export class BaseGuild extends Base {
    public readonly createdAt: Date;
    public readonly createdTimestamp: number;
    public features: GuildFeatures[];
    public icon: string | null;
    public id: Snowflake;
    public name: string;
    public readonly nameAcronym: string;
    public readonly partnered: boolean;
    public readonly verified: boolean;
    public fetch(): Promise<Guild>;
    public iconURL(options?: ImageURLOptions & { dynamic?: boolean }): string | null;
    public toString(): string;
  }

  export class BaseGuildEmoji extends Emoji {
    constructor(client: Client, data: unknown, guild: Guild);
    private _roles: Snowflake[];

    public available: boolean | null;
    public readonly createdAt: Date;
    public readonly createdTimestamp: number;
    public guild: Guild | GuildPreview;
    public id: Snowflake;
    public managed: boolean | null;
    public requiresColons: boolean | null;
  }

  export class BaseGuildVoiceChannel extends GuildChannel {
    constructor(guild: Guild, data?: unknown);
    public readonly members: Collection<Snowflake, GuildMember>;
    public readonly full: boolean;
    public readonly joinable: boolean;
    public rtcRegion: string | null;
    public bitrate: number;
    public userLimit: number;
    public join(): Promise<VoiceConnection>;
    public leave(): void;
    public setRTCRegion(region: string | null): Promise<this>;
  }

  export class BaseMessageComponent {
    constructor(data?: BaseMessageComponent | BaseMessageComponentOptions);
    public type: MessageComponentType | null;
    private static create(data: MessageComponentOptions): MessageComponent;
    private static resolveType(type: MessageComponentTypeResolvable): MessageComponentType;
  }

  class BroadcastDispatcher extends VolumeMixin(StreamDispatcher) {
    public broadcast: VoiceBroadcast;
  }

  export class BitField<S extends string, N extends number | bigint = number> {
    constructor(bits?: BitFieldResolvable<S, N>);
    public bitfield: N;
    public add(...bits: BitFieldResolvable<S, N>[]): BitField<S, N>;
    public any(bit: BitFieldResolvable<S, N>): boolean;
    public equals(bit: BitFieldResolvable<S, N>): boolean;
    public freeze(): Readonly<BitField<S, N>>;
    public has(bit: BitFieldResolvable<S, N>): boolean;
    public missing(bits: BitFieldResolvable<S, N>, ...hasParam: readonly unknown[]): S[];
    public remove(...bits: BitFieldResolvable<S, N>[]): BitField<S, N>;
    public serialize(...hasParam: readonly unknown[]): Record<S, boolean>;
    public toArray(...hasParam: readonly unknown[]): S[];
    public toJSON(): number;
    public valueOf(): number;
    public [Symbol.iterator](): IterableIterator<S>;
    public static FLAGS: unknown;
    public static resolve(bit?: BitFieldResolvable<any, number | bigint>): number | bigint;
  }

  export class CategoryChannel extends GuildChannel {
    public readonly children: Collection<Snowflake, GuildChannel>;
    public type: 'category';
  }

  type CategoryChannelResolvable = Snowflake | CategoryChannel;

  export class Channel extends Base {
    constructor(client: Client, data?: unknown);
    public readonly createdAt: Date;
    public readonly createdTimestamp: number;
    public deleted: boolean;
    public id: Snowflake;
    public type: keyof typeof ChannelType;
    public delete(reason?: string): Promise<Channel>;
    public fetch(force?: boolean): Promise<Channel>;
    public isText(): this is TextChannel | DMChannel | NewsChannel;
    public toString(): string;
  }

  export class Client extends BaseClient {
    constructor(options: ClientOptions);
    private actions: unknown;
    private _eval(script: string): any;
    private _validateOptions(options: ClientOptions): void;

    public application: ClientApplication | null;
    public channels: ChannelManager;
    public readonly emojis: BaseGuildEmojiManager;
    public guilds: GuildManager;
    public options: ClientOptions;
    public readyAt: Date | null;
    public readonly readyTimestamp: number | null;
    public shard: ShardClientUtil | null;
    public token: string | null;
    public readonly uptime: number | null;
    public user: ClientUser | null;
    public users: UserManager;
    public voice: ClientVoiceManager;
    public ws: WebSocketManager;
    public destroy(): void;
    public fetchGuildPreview(guild: GuildResolvable): Promise<GuildPreview>;
    public fetchInvite(invite: InviteResolvable): Promise<Invite>;
    public fetchGuildTemplate(template: GuildTemplateResolvable): Promise<GuildTemplate>;
    public fetchVoiceRegions(): Promise<Collection<string, VoiceRegion>>;
    public fetchWebhook(id: Snowflake, token?: string): Promise<Webhook>;
    public generateInvite(options?: InviteGenerationOptions): string;
    public login(token?: string): Promise<string>;
    public sweepMessages(lifetime?: number): number;
    public toJSON(): unknown;

    public on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaited<void>): this;
    public on<S extends string | symbol>(
      event: Exclude<S, keyof ClientEvents>,
      listener: (...args: any[]) => Awaited<void>,
    ): this;

    public once<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaited<void>): this;
    public once<S extends string | symbol>(
      event: Exclude<S, keyof ClientEvents>,
      listener: (...args: any[]) => Awaited<void>,
    ): this;

    public emit<K extends keyof ClientEvents>(event: K, ...args: ClientEvents[K]): boolean;
    public emit<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, ...args: any[]): boolean;

    public off<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaited<void>): this;
    public off<S extends string | symbol>(
      event: Exclude<S, keyof ClientEvents>,
      listener: (...args: any[]) => Awaited<void>,
    ): this;

    public removeAllListeners<K extends keyof ClientEvents>(event?: K): this;
    public removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof ClientEvents>): this;
  }

  export class ClientApplication extends Application {
    public botPublic: boolean | null;
    public botRequireCodeGrant: boolean | null;
    public commands: ApplicationCommandManager;
    public cover: string | null;
    public flags: Readonly<ApplicationFlags>;
    public owner: User | Team | null;
    public readonly partial: boolean;
    public rpcOrigins: string[];
    public fetch(): Promise<ClientApplication>;
  }

  export class ClientUser extends User {
    public mfaEnabled: boolean;
    public verified: boolean;
    public edit(data: ClientUserEditData): Promise<this>;
    public setActivity(options?: ActivityOptions): Presence;
    public setActivity(name: string, options?: ActivityOptions): Presence;
    public setAFK(afk: boolean): Promise<Presence>;
    public setAvatar(avatar: BufferResolvable | Base64Resolvable): Promise<this>;
    public setPresence(data: PresenceData): Presence;
    public setStatus(status: PresenceStatusData, shardID?: number | number[]): Presence;
    public setUsername(username: string): Promise<this>;
  }

  export class ClientVoiceManager {
    constructor(client: Client);
    public readonly client: Client;
    public connections: Collection<Snowflake, VoiceConnection>;
    public broadcasts: VoiceBroadcast[];

    private joinChannel(channel: VoiceChannel | StageChannel): Promise<VoiceConnection>;

    public createBroadcast(): VoiceBroadcast;
  }

  export abstract class Collector<K, V> extends EventEmitter {
    constructor(client: Client, filter: CollectorFilter<[V]>, options?: CollectorOptions);
    private _timeout: NodeJS.Timeout | null;
    private _idletimeout: NodeJS.Timeout | null;

    public readonly client: Client;
    public collected: Collection<K, V>;
    public ended: boolean;
    public abstract endReason: string | null;
    public filter: CollectorFilter<[V]>;
    public readonly next: Promise<V>;
    public options: CollectorOptions;
    public checkEnd(): void;
    public handleCollect(...args: any[]): void;
    public handleDispose(...args: any[]): void;
    public stop(reason?: string): void;
    public resetTimer(options?: { time?: number; idle?: number }): void;
    public [Symbol.asyncIterator](): AsyncIterableIterator<V>;
    public toJSON(): unknown;

    protected listener: (...args: any[]) => void;
    public abstract collect(...args: any[]): K;
    public abstract dispose(...args: any[]): K;

    public on(event: 'collect' | 'dispose', listener: (...args: any[]) => Awaited<void>): this;
    public on(event: 'end', listener: (collected: Collection<K, V>, reason: string) => Awaited<void>): this;

    public once(event: 'collect' | 'dispose', listener: (...args: any[]) => Awaited<void>): this;
    public once(event: 'end', listener: (collected: Collection<K, V>, reason: string) => Awaited<void>): this;
  }

  export class CommandInteraction extends Interaction {
    public readonly command: ApplicationCommand | null;
    public channel: TextChannel | DMChannel | NewsChannel;
    public commandID: Snowflake;
    public commandName: string;
    public deferred: boolean;
    public options: Collection<string, CommandInteractionOption>;
    public replied: boolean;
    public webhook: InteractionWebhook;
    public defer(options?: InteractionDeferOptions): Promise<void>;
    public deleteReply(): Promise<void>;
    public editReply(
      content: string | null | APIMessage | WebhookEditMessageOptions | MessageAdditions,
    ): Promise<Message | RawMessage>;
    public editReply(content: string | null, options?: WebhookEditMessageOptions): Promise<Message | RawMessage>;
    public fetchReply(): Promise<Message | RawMessage>;
    public followUp(
      content: string | APIMessage | InteractionReplyOptions | MessageAdditions,
    ): Promise<Message | RawMessage>;
    public followUp(content: string | null, options?: InteractionReplyOptions): Promise<Message | RawMessage>;
    public reply(content: string | null | APIMessage | InteractionReplyOptions | MessageAdditions): Promise<void>;
    public reply(content: string | null, options?: InteractionReplyOptions): Promise<void>;
    private transformOption(option: unknown, resolved: unknown): CommandInteractionOption;
    private _createOptionsCollection(options: unknown, resolved: unknown): Collection<string, CommandInteractionOption>;
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
      scripts: { [key: string]: string };
      engines: { [key: string]: string };
      dependencies: { [key: string]: string };
      peerDependencies: { [key: string]: string };
      devDependencies: { [key: string]: string };
      [key: string]: any;
    };
    DefaultOptions: ClientOptions;
    UserAgent: string | null;
    Endpoints: {
      botGateway: string;
      invite: (root: string, code: string) => string;
      CDN: (root: string) => {
        Asset: (name: string) => string;
        DefaultAvatar: (id: Snowflake | number) => string;
        Emoji: (emojiID: Snowflake, format: 'png' | 'gif') => string;
        Avatar: (
          userID: Snowflake | number,
          hash: string,
          format: 'default' | AllowedImageFormat,
          size: number,
        ) => string;
        Banner: (guildID: Snowflake | number, hash: string, format: AllowedImageFormat, size: number) => string;
        Icon: (
          userID: Snowflake | number,
          hash: string,
          format: 'default' | AllowedImageFormat,
          size: number,
        ) => string;
        AppIcon: (userID: Snowflake | number, hash: string, format: AllowedImageFormat, size: number) => string;
        AppAsset: (userID: Snowflake | number, hash: string, format: AllowedImageFormat, size: number) => string;
        GDMIcon: (userID: Snowflake | number, hash: string, format: AllowedImageFormat, size: number) => string;
        Splash: (guildID: Snowflake | number, hash: string, format: AllowedImageFormat, size: number) => string;
        DiscoverySplash: (
          guildID: Snowflake | number,
          hash: string,
          format: AllowedImageFormat,
          size: number,
        ) => string;
        TeamIcon: (teamID: Snowflake | number, hash: string, format: AllowedImageFormat, size: number) => string;
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
      INVALID_REQUEST_WARNING: 'invalidRequestWarning';
      CLIENT_READY: 'ready';
      RESUMED: 'resumed';
      APPLICATION_COMMAND_CREATE: 'applicationCommandCreate';
      APPLICATION_COMMAND_DELETE: 'applicationCommandDelete';
      APPLICATION_COMMAND_UPDATE: 'applicationCommandUpdate';
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
      INTERACTION_CREATE: 'interaction';
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
      GREEN: 0x57f287;
      BLUE: 0x3498db;
      YELLOW: 0xfee75c;
      PURPLE: 0x9b59b6;
      LUMINOUS_VIVID_PINK: 0xe91e63;
      FUCHSIA: 0xeb459e;
      GOLD: 0xf1c40f;
      ORANGE: 0xe67e22;
      RED: 0xed4245;
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
      BLURPLE: 0x5865f2;
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
    APIErrors: APIErrors;
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
    ChannelTypes: typeof ChannelTypes;
    ClientApplicationAssetTypes: {
      SMALL: 1;
      BIG: 2;
    };
    InviteScopes: InviteScope[];
    MessageTypes: MessageType[];
    SystemMessageTypes: SystemMessageType[];
    ActivityTypes: ActivityType[];
    StickerFormatTypes: typeof StickerFormatTypes;
    OverwriteTypes: typeof OverwriteTypes;
    ExplicitContentFilterLevels: ExplicitContentFilterLevel[];
    DefaultMessageNotifications: DefaultMessageNotifications[];
    VerificationLevels: VerificationLevel[];
    MembershipStates: 'INVITED' | 'ACCEPTED';
    ApplicationCommandOptionTypes: typeof ApplicationCommandOptionTypes;
    ApplicationCommandPermissionTypes: typeof ApplicationCommandPermissionTypes;
    InteractionTypes: typeof InteractionTypes;
    InteractionResponseTypes: typeof InteractionResponseTypes;
    MessageComponentTypes: typeof MessageComponentTypes;
    MessageButtonStyles: typeof MessageButtonStyles;
    NSFWLevels: typeof NSFWLevels;
  };

  export class DataResolver {
    public static resolveBase64(data: Base64Resolvable): string;
    public static resolveCode(data: string, regx: RegExp): string;
    public static resolveFile(resource: BufferResolvable | Stream): Promise<Buffer | Stream>;
    public static resolveFileAsBuffer(resource: BufferResolvable | Stream): Promise<Buffer>;
    public static resolveImage(resource: BufferResolvable | Base64Resolvable): Promise<string>;
    public static resolveInviteCode(data: InviteResolvable): string;
    public static resolveGuildTemplateCode(data: GuildTemplateResolvable): string;
  }

  export class DiscordAPIError extends Error {
    constructor(error: unknown, status: number, request: unknown);
    private static flattenErrors(obj: unknown, key: string): string[];

    public code: number;
    public method: string;
    public path: string;
    public httpStatus: number;
    public requestData: HTTPErrorData;
  }

  export class DMChannel extends TextBasedChannel(Channel, ['bulkDelete']) {
    constructor(client: Client, data?: unknown);
    public messages: MessageManager;
    public recipient: User;
    public readonly partial: false;
    public type: 'dm';
    public fetch(force?: boolean): Promise<this>;
  }

  export class Emoji extends Base {
    constructor(client: Client, emoji: unknown);
    public animated: boolean;
    public readonly createdAt: Date | null;
    public readonly createdTimestamp: number | null;
    public deleted: boolean;
    public id: Snowflake | null;
    public name: string | null;
    public readonly identifier: string;
    public readonly url: string | null;
    public toJSON(): unknown;
    public toString(): string;
  }

  export class Guild extends BaseGuild {
    constructor(client: Client, data: unknown);
    private _sortedRoles(): Collection<Snowflake, Role>;
    private _sortedChannels(channel: Channel): Collection<Snowflake, GuildChannel>;
    private _memberSpeakUpdate(user: Snowflake, speaking: boolean): void;

    public readonly afkChannel: VoiceChannel | null;
    public afkChannelID: Snowflake | null;
    public afkTimeout: number;
    public applicationID: Snowflake | null;
    public approximateMemberCount: number | null;
    public approximatePresenceCount: number | null;
    public available: boolean;
    public banner: string | null;
    public bans: GuildBanManager;
    public channels: GuildChannelManager;
    public commands: GuildApplicationCommandManager;
    public defaultMessageNotifications: DefaultMessageNotifications | number;
    public deleted: boolean;
    public description: string | null;
    public discoverySplash: string | null;
    public emojis: GuildEmojiManager;
    public explicitContentFilter: ExplicitContentFilterLevel;
    public readonly joinedAt: Date;
    public joinedTimestamp: number;
    public large: boolean;
    public maximumMembers: number | null;
    public maximumPresences: number | null;
    public readonly me: GuildMember | null;
    public memberCount: number;
    public members: GuildMemberManager;
    public mfaLevel: number;
    public nsfwLevel: NSFWLevel;
    public ownerID: Snowflake;
    public preferredLocale: string;
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
    public vanityURLUses: number | null;
    public verificationLevel: VerificationLevel;
    public readonly voiceStates: VoiceStateManager;
    public readonly widgetChannel: TextChannel | null;
    public widgetChannelID: Snowflake | null;
    public widgetEnabled: boolean | null;
    public addMember(user: UserResolvable, options: AddGuildMemberOptions): Promise<GuildMember>;
    public bannerURL(options?: ImageURLOptions): string | null;
    public createIntegration(data: IntegrationData, reason?: string): Promise<Guild>;
    public createTemplate(name: string, description?: string): Promise<GuildTemplate>;
    public delete(): Promise<Guild>;
    public discoverySplashURL(options?: ImageURLOptions): string | null;
    public edit(data: GuildEditData, reason?: string): Promise<Guild>;
    public equals(guild: Guild): boolean;
    public fetchAuditLogs(options?: GuildAuditLogsFetchOptions): Promise<GuildAuditLogs>;
    public fetchIntegrations(): Promise<Collection<string, Integration>>;
    public fetchInvites(): Promise<Collection<string, Invite>>;
    public fetchOwner(options?: FetchOwnerOptions): Promise<GuildMember>;
    public fetchPreview(): Promise<GuildPreview>;
    public fetchTemplates(): Promise<Collection<GuildTemplate['code'], GuildTemplate>>;
    public fetchVanityData(): Promise<Vanity>;
    public fetchVoiceRegions(): Promise<Collection<string, VoiceRegion>>;
    public fetchWebhooks(): Promise<Collection<Snowflake, Webhook>>;
    public fetchWidget(): Promise<GuildWidget>;
    public leave(): Promise<Guild>;
    public setAFKChannel(afkChannel: ChannelResolvable | null, reason?: string): Promise<Guild>;
    public setAFKTimeout(afkTimeout: number, reason?: string): Promise<Guild>;
    public setBanner(banner: Base64Resolvable | null, reason?: string): Promise<Guild>;
    public setChannelPositions(channelPositions: readonly ChannelPosition[]): Promise<Guild>;
    public setDefaultMessageNotifications(
      defaultMessageNotifications: DefaultMessageNotifications | number,
      reason?: string,
    ): Promise<Guild>;
    public setDiscoverySplash(discoverySplash: Base64Resolvable | null, reason?: string): Promise<Guild>;
    public setExplicitContentFilter(
      explicitContentFilter: ExplicitContentFilterLevel | number,
      reason?: string,
    ): Promise<Guild>;
    public setIcon(icon: Base64Resolvable | null, reason?: string): Promise<Guild>;
    public setName(name: string, reason?: string): Promise<Guild>;
    public setOwner(owner: GuildMemberResolvable, reason?: string): Promise<Guild>;
    public setPreferredLocale(preferredLocale: string, reason?: string): Promise<Guild>;
    public setPublicUpdatesChannel(publicUpdatesChannel: ChannelResolvable | null, reason?: string): Promise<Guild>;
    public setRegion(region: string, reason?: string): Promise<Guild>;
    public setRolePositions(rolePositions: readonly RolePosition[]): Promise<Guild>;
    public setRulesChannel(rulesChannel: ChannelResolvable | null, reason?: string): Promise<Guild>;
    public setSplash(splash: Base64Resolvable | null, reason?: string): Promise<Guild>;
    public setSystemChannel(systemChannel: ChannelResolvable | null, reason?: string): Promise<Guild>;
    public setSystemChannelFlags(systemChannelFlags: SystemChannelFlagsResolvable, reason?: string): Promise<Guild>;
    public setVerificationLevel(verificationLevel: VerificationLevel | number, reason?: string): Promise<Guild>;
    public setWidget(widget: GuildWidgetData, reason?: string): Promise<Guild>;
    public splashURL(options?: ImageURLOptions): string | null;
    public toJSON(): unknown;
  }

  export class GuildAuditLogs {
    constructor(guild: Guild, data: unknown);
    private webhooks: Collection<Snowflake, Webhook>;
    private integrations: Collection<Snowflake, Integration>;

    public entries: Collection<Snowflake, GuildAuditLogsEntry>;

    public static Actions: GuildAuditLogsActions;
    public static Targets: GuildAuditLogsTargets;
    public static Entry: typeof GuildAuditLogsEntry;
    public static actionType(action: number): GuildAuditLogsActionType;
    public static build(...args: any[]): Promise<GuildAuditLogs>;
    public static targetType(target: number): GuildAuditLogsTarget;
    public toJSON(): unknown;
  }

  class GuildAuditLogsEntry {
    constructor(logs: GuildAuditLogs, guild: Guild, data: unknown);
    public action: GuildAuditLogsAction;
    public actionType: GuildAuditLogsActionType;
    public changes: AuditLogChange[] | null;
    public readonly createdAt: Date;
    public readonly createdTimestamp: number;
    public executor: User | null;
    public extra: unknown | Role | GuildMember | null;
    public id: Snowflake;
    public reason: string | null;
    public target:
      | Guild
      | GuildChannel
      | User
      | Role
      | GuildEmoji
      | Invite
      | Webhook
      | Message
      | Integration
      | { id: Snowflake }
      | null;
    public targetType: GuildAuditLogsTarget;
    public toJSON(): unknown;
  }

  export class GuildBan extends Base {
    constructor(client: Client, data: unknown, guild: Guild);
    public guild: Guild;
    public user: User;
    public readonly partial: boolean;
    public reason?: string | null;
    public fetch(force?: boolean): Promise<GuildBan>;
  }

  export class GuildChannel extends Channel {
    constructor(guild: Guild, data?: unknown);
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
      options: PermissionOverwriteOptions,
      overwriteOptions?: GuildChannelOverwriteOptions,
    ): Promise<this>;
    public edit(data: ChannelData, reason?: string): Promise<this>;
    public equals(channel: GuildChannel): boolean;
    public fetchInvites(): Promise<Collection<string, Invite>>;
    public lockPermissions(): Promise<this>;
    public overwritePermissions(
      overwrites: readonly OverwriteResolvable[] | Collection<Snowflake, OverwriteResolvable>,
      reason?: string,
    ): Promise<this>;
    public permissionsFor(memberOrRole: GuildMember | Role): Readonly<Permissions>;
    public permissionsFor(memberOrRole: GuildMemberResolvable | RoleResolvable): Readonly<Permissions> | null;
    public setName(name: string, reason?: string): Promise<this>;
    public setParent(
      channel: CategoryChannel | Snowflake | null,
      options?: { lockPermissions?: boolean; reason?: string },
    ): Promise<this>;
    public setPosition(position: number, options?: { relative?: boolean; reason?: string }): Promise<this>;
    public setTopic(topic: string | null, reason?: string): Promise<this>;
    public updateOverwrite(
      userOrRole: RoleResolvable | UserResolvable,
      options: PermissionOverwriteOptions,
      overwriteOptions?: GuildChannelOverwriteOptions,
    ): Promise<this>;
    public isText(): this is TextChannel | NewsChannel;
  }

  export class GuildEmoji extends BaseGuildEmoji {
    public readonly deletable: boolean;
    public guild: Guild;
    public author: User | null;
    public readonly roles: GuildEmojiRoleManager;
    public readonly url: string;
    public delete(reason?: string): Promise<GuildEmoji>;
    public edit(data: GuildEmojiEditData, reason?: string): Promise<GuildEmoji>;
    public equals(other: GuildEmoji | unknown): boolean;
    public fetchAuthor(): Promise<User>;
    public setName(name: string, reason?: string): Promise<GuildEmoji>;
  }

  export class GuildMember extends PartialTextBasedChannel(Base) {
    constructor(client: Client, data: unknown, guild: Guild);
    public readonly bannable: boolean;
    public deleted: boolean;
    public readonly displayColor: number;
    public readonly displayHexColor: string;
    public readonly displayName: string;
    public guild: Guild;
    public readonly id: Snowflake;
    public pending: boolean;
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
    public fetch(force?: boolean): Promise<GuildMember>;
    public createDM(force?: boolean): Promise<DMChannel>;
    public deleteDM(): Promise<DMChannel>;
    public edit(data: GuildMemberEditData, reason?: string): Promise<GuildMember>;
    public kick(reason?: string): Promise<GuildMember>;
    public permissionsIn(channel: ChannelResolvable): Readonly<Permissions>;
    public setNickname(nickname: string | null, reason?: string): Promise<GuildMember>;
    public toJSON(): unknown;
    public toString(): string;
    public valueOf(): string;
  }

  export class GuildPreview extends Base {
    constructor(client: Client, data: unknown);
    public approximateMemberCount: number;
    public approximatePresenceCount: number;
    public description: string | null;
    public discoverySplash: string | null;
    public emojis: Collection<Snowflake, GuildPreviewEmoji>;
    public features: GuildFeatures[];
    public icon: string | null;
    public id: Snowflake;
    public name: string;
    public splash: string | null;
    public discoverySplashURL(options?: ImageURLOptions): string | null;
    public iconURL(options?: ImageURLOptions & { dynamic?: boolean }): string | null;
    public splashURL(options?: ImageURLOptions): string | null;
    public fetch(): Promise<GuildPreview>;
    public toJSON(): unknown;
    public toString(): string;
  }

  export class GuildTemplate extends Base {
    constructor(client: Client, data: unknown);
    public readonly createdTimestamp: number;
    public readonly updatedTimestamp: number;
    public readonly url: string;
    public code: string;
    public name: string;
    public description: string | null;
    public usageCount: number;
    public creator: User;
    public creatorID: Snowflake;
    public createdAt: Date;
    public updatedAt: Date;
    public guild: Guild | null;
    public guildID: Snowflake;
    public serializedGuild: unknown;
    public unSynced: boolean | null;
    public createGuild(name: string, icon?: BufferResolvable | Base64Resolvable): Promise<Guild>;
    public delete(): Promise<GuildTemplate>;
    public edit(options?: { name?: string; description?: string }): Promise<GuildTemplate>;
    public sync(): Promise<GuildTemplate>;
    public static GUILD_TEMPLATES_PATTERN: RegExp;
  }

  export class GuildPreviewEmoji extends BaseGuildEmoji {
    constructor(client: Client, data: unknown, guild: GuildPreview);
    public guild: GuildPreview;
    public readonly roles: Set<Snowflake>;
  }

  export class HTTPError extends Error {
    constructor(message: string, name: string, code: number, request: unknown);
    public code: number;
    public method: string;
    public name: string;
    public path: string;
    public requestData: HTTPErrorData;
  }

  export class Integration extends Base {
    constructor(client: Client, data: unknown, guild: Guild);
    public account: IntegrationAccount;
    public application: IntegrationApplication | null;
    public enabled: boolean;
    public expireBehavior: number;
    public expireGracePeriod: number;
    public guild: Guild;
    public id: Snowflake;
    public name: string;
    public role: Role;
    public readonly roles: Collection<Snowflake, Role>;
    public syncedAt: number;
    public syncing: boolean;
    public type: string;
    public user: User | null;
    public delete(reason?: string): Promise<Integration>;
    public edit(data: IntegrationEditData, reason?: string): Promise<Integration>;
    public sync(): Promise<Integration>;
  }

  export class IntegrationApplication extends Application {
    public bot: User | null;
    public termsOfServiceURL: string | null;
    public privacyPolicyURL: string | null;
    public rpcOrigins: string[];
    public summary: string | null;
    public hook: boolean | null;
    public cover: string | null;
    public verifyKey: string | null;
  }

  export class Intents extends BitField<IntentsString> {
    public static FLAGS: Record<IntentsString, number>;
    public static PRIVILEGED: number;
    public static ALL: number;
    public static NON_PRIVILEGED: number;
    public static resolve(bit?: BitFieldResolvable<IntentsString, number>): number;
  }

  export class Interaction extends Base {
    constructor(client: Client, data: unknown);
    public applicationID: Snowflake;
    public readonly channel: Channel | null;
    public channelID: Snowflake | null;
    public readonly createdAt: Date;
    public readonly createdTimestamp: number;
    public readonly guild: Guild | null;
    public guildID: Snowflake | null;
    public id: Snowflake;
    public member: GuildMember | RawInteractionGuildMember | null;
    public readonly token: string;
    public type: InteractionType;
    public user: User;
    public version: number;
    public isCommand(): this is CommandInteraction;
    public isMessageComponent(): this is MessageComponentInteraction;
  }

  export class InteractionWebhook extends PartialWebhookMixin() {
    constructor(client: Client, id: Snowflake, token: string);
    public token: string;
    public send(
      content: string | (InteractionReplyOptions & { split?: false }) | MessageAdditions,
    ): Promise<Message | RawMessage>;
    public send(options: InteractionReplyOptions & { split: true | SplitOptions }): Promise<(Message | RawMessage)[]>;
    public send(
      options: InteractionReplyOptions | APIMessage,
    ): Promise<Message | RawMessage | (Message | RawMessage)[]>;
    public send(
      content: string | null,
      options: (InteractionReplyOptions & { split?: false }) | MessageAdditions,
    ): Promise<Message | RawMessage>;
    public send(
      content: string | null,
      options: InteractionReplyOptions & { split: true | SplitOptions },
    ): Promise<(Message | RawMessage)[]>;
    public send(
      content: string | null,
      options: InteractionReplyOptions,
    ): Promise<Message | RawMessage | (Message | RawMessage)[]>;
  }

  export class Invite extends Base {
    constructor(client: Client, data: unknown);
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
    public targetApplication: IntegrationApplication | null;
    public targetUser: User | null;
    public targetType: InviteTargetType | null;
    public temporary: boolean | null;
    public readonly url: string;
    public uses: number | null;
    public delete(reason?: string): Promise<Invite>;
    public toJSON(): unknown;
    public toString(): string;
    public static INVITES_PATTERN: RegExp;
  }

  export class Message extends Base {
    constructor(client: Client, data: unknown, channel: TextChannel | DMChannel | NewsChannel);
    private patch(data: unknown): Message;

    public activity: MessageActivity | null;
    public application: ClientApplication | null;
    public attachments: Collection<Snowflake, MessageAttachment>;
    public author: User;
    public channel: TextChannel | DMChannel | NewsChannel;
    public readonly cleanContent: string;
    public components: MessageActionRow[];
    public content: string;
    public readonly createdAt: Date;
    public createdTimestamp: number;
    public readonly crosspostable: boolean;
    public readonly deletable: boolean;
    public deleted: boolean;
    public readonly editable: boolean;
    public readonly editedAt: Date | null;
    public editedTimestamp: number | null;
    public embeds: MessageEmbed[];
    public readonly guild: Guild | null;
    public id: Snowflake;
    public interaction: MessageInteraction | null;
    public readonly member: GuildMember | null;
    public mentions: MessageMentions;
    public nonce: string | number | null;
    public readonly partial: false;
    public readonly pinnable: boolean;
    public pinned: boolean;
    public reactions: ReactionManager;
    public stickers: Collection<Snowflake, Sticker>;
    public system: boolean;
    public tts: boolean;
    public type: MessageType;
    public readonly url: string;
    public webhookID: Snowflake | null;
    public flags: Readonly<MessageFlags>;
    public reference: MessageReference | null;
    public awaitMessageComponentInteractions(
      filter: CollectorFilter<[MessageComponentInteraction]>,
      options?: AwaitMessageComponentInteractionsOptions,
    ): Promise<Collection<Snowflake, MessageComponentInteraction>>;
    public awaitReactions(
      filter: CollectorFilter<[MessageReaction, User]>,
      options?: AwaitReactionsOptions,
    ): Promise<Collection<Snowflake | string, MessageReaction>>;
    public createReactionCollector(
      filter: CollectorFilter<[MessageReaction, User]>,
      options?: ReactionCollectorOptions,
    ): ReactionCollector;
    public createMessageComponentInteractionCollector(
      filter: CollectorFilter<[MessageComponentInteraction]>,
      options?: AwaitMessageComponentInteractionsOptions,
    ): MessageComponentInteractionCollector;
    public delete(): Promise<Message>;
    public edit(
      content: string | null | MessageEditOptions | MessageEmbed | APIMessage | MessageAttachment | MessageAttachment[],
    ): Promise<Message>;
    public edit(
      content: string | null,
      options: MessageEditOptions | MessageEmbed | MessageAttachment | MessageAttachment[],
    ): Promise<Message>;
    public equals(message: Message, rawData: unknown): boolean;
    public fetchReference(): Promise<Message>;
    public fetchWebhook(): Promise<Webhook>;
    public crosspost(): Promise<Message>;
    public fetch(force?: boolean): Promise<Message>;
    public pin(): Promise<Message>;
    public react(emoji: EmojiIdentifierResolvable): Promise<MessageReaction>;
    public removeAttachments(): Promise<Message>;
    public reply(
      content: string | null | (ReplyMessageOptions & { split?: false }) | MessageAdditions,
    ): Promise<Message>;
    public reply(options: ReplyMessageOptions & { split: true | SplitOptions }): Promise<Message[]>;
    public reply(options: ReplyMessageOptions | APIMessage): Promise<Message | Message[]>;
    public reply(
      content: string | null,
      options: (ReplyMessageOptions & { split?: false }) | MessageAdditions,
    ): Promise<Message>;
    public reply(
      content: string | null,
      options: ReplyMessageOptions & { split: true | SplitOptions },
    ): Promise<Message[]>;
    public reply(content: string | null, options: ReplyMessageOptions): Promise<Message | Message[]>;
    public suppressEmbeds(suppress?: boolean): Promise<Message>;
    public toJSON(): unknown;
    public toString(): string;
    public unpin(): Promise<Message>;
  }

  export class MessageActionRow extends BaseMessageComponent {
    constructor(data?: MessageActionRow | MessageActionRowOptions);
    public type: 'ACTION_ROW';
    public components: MessageActionRowComponent[];
    public addComponents(
      ...components: MessageActionRowComponentResolvable[] | MessageActionRowComponentResolvable[][]
    ): this;
    public spliceComponents(
      index: number,
      deleteCount: number,
      ...components: MessageActionRowComponentResolvable[] | MessageActionRowComponentResolvable[][]
    ): this;
    public toJSON(): unknown;
  }

  export class MessageAttachment {
    constructor(attachment: BufferResolvable | Stream, name?: string, data?: unknown);

    public attachment: BufferResolvable | Stream;
    public contentType: string | null;
    public height: number | null;
    public id: Snowflake;
    public name: string | null;
    public proxyURL: string;
    public size: number;
    public readonly spoiler: boolean;
    public url: string;
    public width: number | null;
    public setFile(attachment: BufferResolvable | Stream, name?: string): this;
    public setName(name: string): this;
    public toJSON(): unknown;
  }

  export class MessageButton extends BaseMessageComponent {
    constructor(data?: MessageButton | MessageButtonOptions);
    public customID: string | null;
    public disabled: boolean;
    public emoji: string | RawEmoji | null;
    public label: string | null;
    public style: MessageButtonStyle | null;
    public type: 'BUTTON';
    public url: string | null;
    public setCustomID(customID: string): this;
    public setDisabled(disabled: boolean): this;
    public setEmoji(emoji: EmojiIdentifierResolvable): this;
    public setLabel(label: string): this;
    public setStyle(style: MessageButtonStyleResolvable): this;
    public setURL(url: string): this;
    public toJSON(): unknown;
    private static resolveStyle(style: MessageButtonStyleResolvable): MessageButtonStyle;
  }

  export class MessageCollector extends Collector<Snowflake, Message> {
    constructor(
      channel: TextChannel | DMChannel,
      filter: CollectorFilter<[Message]>,
      options?: MessageCollectorOptions,
    );
    private _handleChannelDeletion(channel: GuildChannel): void;
    private _handleGuildDeletion(guild: Guild): void;

    public channel: Channel;
    public readonly endReason: string | null;
    public options: MessageCollectorOptions;
    public received: number;

    public collect(message: Message): Snowflake;
    public dispose(message: Message): Snowflake;
  }

  export class MessageComponentInteraction extends Interaction {
    public componentType: MessageComponentType;
    public customID: string;
    public deferred: boolean;
    public message: Message | RawMessage;
    public replied: boolean;
    public webhook: InteractionWebhook;
    public defer(options?: InteractionDeferOptions): Promise<void>;
    public deferUpdate(): Promise<void>;
    public deleteReply(): Promise<void>;
    public editReply(
      content: string | APIMessage | WebhookEditMessageOptions | MessageEmbed | MessageEmbed[],
    ): Promise<Message | RawMessage>;
    public editReply(content: string, options?: WebhookEditMessageOptions): Promise<Message | RawMessage>;
    public fetchReply(): Promise<Message | RawMessage>;
    public followUp(
      content: string | APIMessage | InteractionReplyOptions | MessageAdditions,
    ): Promise<Message | RawMessage>;
    public followUp(content: string, options?: InteractionReplyOptions): Promise<Message | RawMessage>;
    public reply(content: string | APIMessage | InteractionReplyOptions | MessageAdditions): Promise<void>;
    public reply(content: string, options?: InteractionReplyOptions): Promise<void>;
    public update(
      content: string | APIMessage | WebhookEditMessageOptions | MessageEmbed | MessageEmbed[],
    ): Promise<Message | RawMessage>;
    public update(content: string, options?: WebhookEditMessageOptions): Promise<Message | RawMessage>;
    public static resolveType(type: MessageComponentTypeResolvable): MessageComponentType;
  }

  export class MessageComponentInteractionCollector extends Collector<Snowflake, MessageComponentInteraction> {
    constructor(
      source: Message | TextChannel | NewsChannel | DMChannel,
      filter: CollectorFilter<[MessageComponentInteraction]>,
      options?: MessageComponentInteractionCollectorOptions,
    );
    private _handleMessageDeletion(message: Message): void;
    private _handleChannelDeletion(channel: GuildChannel): void;
    private _handleGuildDeletion(guild: Guild): void;

    public channel: TextChannel | NewsChannel | DMChannel;
    public empty(): void;
    public readonly endReason: string | null;
    public message: Message | null;
    public options: MessageComponentInteractionCollectorOptions;
    public total: number;
    public users: Collection<Snowflake, User>;

    public collect(interaction: Interaction): Snowflake;
    public dispose(interaction: Interaction): Snowflake;
    public on(
      event: 'collect' | 'dispose',
      listener: (interaction: MessageComponentInteraction) => Awaited<void>,
    ): this;
    public on(
      event: 'end',
      listener: (collected: Collection<Snowflake, MessageComponentInteraction>, reason: string) => Awaited<void>,
    ): this;
    public on(event: string, listener: (...args: any[]) => Awaited<void>): this;

    public once(
      event: 'collect' | 'dispose',
      listener: (interaction: MessageComponentInteraction) => Awaited<void>,
    ): this;
    public once(
      event: 'end',
      listener: (collected: Collection<Snowflake, MessageComponentInteraction>, reason: string) => Awaited<void>,
    ): this;
    public once(event: string, listener: (...args: any[]) => Awaited<void>): this;
  }

  export class MessageEmbed {
    constructor(data?: MessageEmbed | MessageEmbedOptions);
    public author: MessageEmbedAuthor | null;
    public color: number | null;
    public readonly createdAt: Date | null;
    public description: string | null;
    public fields: EmbedField[];
    public files: (MessageAttachment | string | FileOptions)[];
    public footer: MessageEmbedFooter | null;
    public readonly hexColor: string | null;
    public image: MessageEmbedImage | null;
    public readonly length: number;
    public provider: MessageEmbedProvider | null;
    public thumbnail: MessageEmbedThumbnail | null;
    public timestamp: number | null;
    public title: string | null;
    public type: string;
    public url: string | null;
    public readonly video: MessageEmbedVideo | null;
    public addField(name: string, value: string, inline?: boolean): this;
    public addFields(...fields: EmbedFieldData[] | EmbedFieldData[][]): this;
    public attachFiles(file: (MessageAttachment | FileOptions | string)[]): this;
    public setAuthor(name: string, iconURL?: string, url?: string): this;
    public setColor(color: ColorResolvable): this;
    public setDescription(description: string): this;
    public setFooter(text: string, iconURL?: string): this;
    public setImage(url: string): this;
    public setThumbnail(url: string): this;
    public setTimestamp(timestamp?: Date | number): this;
    public setTitle(title: string): this;
    public setURL(url: string): this;
    public spliceFields(index: number, deleteCount: number, ...fields: EmbedFieldData[] | EmbedFieldData[][]): this;
    public toJSON(): unknown;

    public static normalizeField(name: string, value: string, inline?: boolean): Required<EmbedFieldData>;
    public static normalizeFields(...fields: EmbedFieldData[] | EmbedFieldData[][]): Required<EmbedFieldData>[];
  }

  export class MessageFlags extends BitField<MessageFlagsString> {
    public static FLAGS: Record<MessageFlagsString, number>;
    public static resolve(bit?: BitFieldResolvable<MessageFlagsString, number>): number;
  }

  export class MessageMentions {
    constructor(
      message: Message,
      users: unknown[] | Collection<Snowflake, User>,
      roles: Snowflake[] | Collection<Snowflake, Role>,
      everyone: boolean,
    );
    private _channels: Collection<Snowflake, Channel> | null;
    private readonly _content: string;
    private _members: Collection<Snowflake, GuildMember> | null;

    public readonly channels: Collection<Snowflake, Channel>;
    public readonly client: Client;
    public everyone: boolean;
    public readonly guild: Guild;
    public has(
      data: UserResolvable | RoleResolvable | ChannelResolvable,
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
    public toJSON(): unknown;

    public static CHANNELS_PATTERN: RegExp;
    public static EVERYONE_PATTERN: RegExp;
    public static ROLES_PATTERN: RegExp;
    public static USERS_PATTERN: RegExp;
  }

  export class MessageReaction {
    constructor(client: Client, data: unknown, message: Message);
    private _emoji: GuildEmoji | ReactionEmoji;

    public readonly client: Client;
    public count: number | null;
    public readonly emoji: GuildEmoji | ReactionEmoji;
    public me: boolean;
    public message: Message | PartialMessage;
    public readonly partial: boolean;
    public users: ReactionUserManager;
    public remove(): Promise<MessageReaction>;
    public fetch(): Promise<MessageReaction>;
    public toJSON(): unknown;
  }

  export class NewsChannel extends TextBasedChannel(GuildChannel) {
    constructor(guild: Guild, data?: unknown);
    public messages: MessageManager;
    public nsfw: boolean;
    public topic: string | null;
    public type: 'news';
    public createWebhook(
      name: string,
      options?: { avatar?: BufferResolvable | Base64Resolvable; reason?: string },
    ): Promise<Webhook>;
    public setNSFW(nsfw: boolean, reason?: string): Promise<NewsChannel>;
    public setType(type: Pick<typeof ChannelType, 'text' | 'news'>, reason?: string): Promise<GuildChannel>;
    public fetchWebhooks(): Promise<Collection<Snowflake, Webhook>>;
    public addFollower(channel: GuildChannelResolvable, reason?: string): Promise<NewsChannel>;
  }

  export class OAuth2Guild extends BaseGuild {
    public owner: boolean;
    public permissions: Readonly<Permissions>;
  }

  export class PartialGroupDMChannel extends Channel {
    constructor(client: Client, data: unknown);
    public name: string;
    public icon: string | null;
    public iconURL(options?: ImageURLOptions): string | null;
  }

  export class PermissionOverwrites {
    constructor(guildChannel: GuildChannel, data?: unknown);
    public allow: Readonly<Permissions>;
    public readonly channel: GuildChannel;
    public deny: Readonly<Permissions>;
    public id: Snowflake;
    public type: OverwriteType;
    public update(options: PermissionOverwriteOptions, reason?: string): Promise<PermissionOverwrites>;
    public delete(reason?: string): Promise<PermissionOverwrites>;
    public toJSON(): unknown;
    public static resolveOverwriteOptions(
      options: PermissionOverwriteOptions,
      initialPermissions: { allow?: PermissionResolvable; deny?: PermissionResolvable },
    ): ResolvedOverwriteOptions;
    public static resolve(overwrite: OverwriteResolvable, guild: Guild): RawOverwrite;
  }

  export class Permissions extends BitField<PermissionString, bigint> {
    public any(permission: PermissionResolvable, checkAdmin?: boolean): boolean;
    public has(permission: PermissionResolvable, checkAdmin?: boolean): boolean;
    public missing(bits: BitFieldResolvable<PermissionString, bigint>, checkAdmin?: boolean): PermissionString[];
    public serialize(checkAdmin?: boolean): Record<PermissionString, boolean>;
    public toArray(checkAdmin?: boolean): PermissionString[];

    public static ALL: bigint;
    public static DEFAULT: bigint;
    public static STAGE_MODERATOR: bigint;
    public static FLAGS: PermissionFlags;
    public static resolve(permission?: PermissionResolvable): bigint;
  }

  export class Presence {
    constructor(client: Client, data?: unknown);
    public activities: Activity[];
    public clientStatus: ClientPresenceStatusData | null;
    public guild: Guild | null;
    public readonly member: GuildMember | null;
    public status: PresenceStatus;
    public readonly user: User | null;
    public userID: Snowflake;
    public equals(presence: Presence): boolean;
  }

  export class ReactionCollector extends Collector<Snowflake | string, MessageReaction> {
    constructor(message: Message, filter: CollectorFilter<[MessageReaction, User]>, options?: ReactionCollectorOptions);
    private _handleChannelDeletion(channel: GuildChannel): void;
    private _handleGuildDeletion(guild: Guild): void;
    private _handleMessageDeletion(message: Message): void;

    public readonly endReason: string | null;
    public message: Message;
    public options: ReactionCollectorOptions;
    public total: number;
    public users: Collection<Snowflake, User>;

    public static key(reaction: MessageReaction): Snowflake | string;

    public collect(reaction: MessageReaction): Snowflake | string;
    public dispose(reaction: MessageReaction, user: User): Snowflake | string;
    public empty(): void;

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
    constructor(reaction: MessageReaction, emoji: unknown);
    public reaction: MessageReaction;
    public toJSON(): unknown;
  }

  export class RichPresenceAssets {
    constructor(activity: Activity, assets: unknown);
    public largeImage: Snowflake | null;
    public largeText: string | null;
    public smallImage: Snowflake | null;
    public smallText: string | null;
    public largeImageURL(options?: ImageURLOptions): string | null;
    public smallImageURL(options?: ImageURLOptions): string | null;
  }

  export class Role extends Base {
    constructor(client: Client, data: unknown, guild: Guild);
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
    public tags: RoleTagData | null;
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
    public toJSON(): unknown;
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
    public env: unknown;
    public id: number;
    public manager: ShardingManager;
    public process: ChildProcess | null;
    public ready: boolean;
    public worker: any | null;
    public eval(script: string): Promise<any>;
    public eval<T>(fn: (client: Client) => T): Promise<T[]>;
    public fetchClientValue(prop: string): Promise<any>;
    public kill(): void;
    public respawn(options?: { delay?: number; timeout?: number }): Promise<ChildProcess>;
    public send(message: any): Promise<Shard>;
    public spawn(timeout?: number): Promise<ChildProcess>;

    public on(event: 'spawn' | 'death', listener: (child: ChildProcess) => Awaited<void>): this;
    public on(event: 'disconnect' | 'ready' | 'reconnecting', listener: () => Awaited<void>): this;
    public on(event: 'error', listener: (error: Error) => Awaited<void>): this;
    public on(event: 'message', listener: (message: any) => Awaited<void>): this;
    public on(event: string, listener: (...args: any[]) => Awaited<void>): this;

    public once(event: 'spawn' | 'death', listener: (child: ChildProcess) => Awaited<void>): this;
    public once(event: 'disconnect' | 'ready' | 'reconnecting', listener: () => Awaited<void>): this;
    public once(event: 'error', listener: (error: Error) => Awaited<void>): this;
    public once(event: 'message', listener: (message: any) => Awaited<void>): this;
    public once(event: string, listener: (...args: any[]) => Awaited<void>): this;
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
    public broadcastEval(script: string, shard: number): Promise<any>;
    public broadcastEval<T>(fn: (client: Client) => T): Promise<T[]>;
    public broadcastEval<T>(fn: (client: Client) => T, shard: number): Promise<T>;
    public fetchClientValues(prop: string): Promise<any[]>;
    public fetchClientValues(prop: string, shard: number): Promise<any>;
    public respawnAll(options?: { shardDelay?: number; respawnDelay?: number; timeout?: number }): Promise<void>;
    public send(message: any): Promise<void>;

    public static singleton(client: Client, mode: ShardingManagerMode): ShardClientUtil;
    public static shardIDForGuildID(guildID: Snowflake, shardCount: number): number;
  }

  export class ShardingManager extends EventEmitter {
    constructor(file: string, options?: ShardingManagerOptions);
    private _performOnShards(method: string, args: any[]): Promise<any[]>;
    private _performOnShards(method: string, args: any[], shard: number): Promise<any>;

    public file: string;
    public respawn: boolean;
    public shardArgs: string[];
    public shards: Collection<number, Shard>;
    public token: string | null;
    public totalShards: number | 'auto';
    public shardList: number[] | 'auto';
    public broadcast(message: any): Promise<Shard[]>;
    public broadcastEval(script: string): Promise<any[]>;
    public broadcastEval(script: string, shard: number): Promise<any>;
    public createShard(id: number): Shard;
    public fetchClientValues(prop: string): Promise<any[]>;
    public fetchClientValues(prop: string, shard: number): Promise<any>;
    public respawnAll(options?: {
      shardDelay?: number;
      respawnDelay?: number;
      timeout?: number;
    }): Promise<Collection<number, Shard>>;
    public spawn(options?: {
      amount?: number | 'auto';
      delay?: number;
      timeout?: number;
    }): Promise<Collection<number, Shard>>;

    public on(event: 'shardCreate', listener: (shard: Shard) => Awaited<void>): this;

    public once(event: 'shardCreate', listener: (shard: Shard) => Awaited<void>): this;
  }

  export class SnowflakeUtil {
    public static deconstruct(snowflake: Snowflake): DeconstructedSnowflake;
    public static generate(timestamp?: number | Date): Snowflake;
    public static readonly EPOCH: number;
  }

  export class Speaking extends BitField<SpeakingString> {
    public static FLAGS: Record<SpeakingString, number>;
    public static resolve(bit?: BitFieldResolvable<SpeakingString, number>): number;
  }

  export class StageChannel extends BaseGuildVoiceChannel {
    public topic: string | null;
    public type: 'stage';
  }

  export class StoreChannel extends GuildChannel {
    constructor(guild: Guild, data?: unknown);
    public nsfw: boolean;
    public type: 'store';
  }

  class StreamDispatcher extends VolumeMixin(Writable) {
    constructor(player: unknown, options?: StreamOptions, streams?: unknown);
    public readonly bitrateEditable: boolean;
    public broadcast: VoiceBroadcast | null;
    public readonly paused: boolean;
    public pausedSince: number | null;
    public readonly pausedTime: number;
    public player: unknown;
    public readonly streamTime: number;
    public readonly totalStreamTime: number;

    public pause(silence?: boolean): void;
    public resume(): void;
    public setBitrate(value: number | 'auto'): boolean;
    public setFEC(enabled: boolean): boolean;
    public setPLP(value: number): boolean;

    public on(event: 'close' | 'drain' | 'finish' | 'start', listener: () => Awaited<void>): this;
    public on(event: 'debug', listener: (info: string) => Awaited<void>): this;
    public on(event: 'error', listener: (err: Error) => Awaited<void>): this;
    public on(event: 'pipe' | 'unpipe', listener: (src: Readable) => Awaited<void>): this;
    public on(event: 'speaking', listener: (speaking: boolean) => Awaited<void>): this;
    public on(event: 'volumeChange', listener: (oldVolume: number, newVolume: number) => Awaited<void>): this;
    public on(event: string, listener: (...args: any[]) => Awaited<void>): this;

    public once(event: 'close' | 'drain' | 'finish' | 'start', listener: () => Awaited<void>): this;
    public once(event: 'debug', listener: (info: string) => Awaited<void>): this;
    public once(event: 'error', listener: (err: Error) => Awaited<void>): this;
    public once(event: 'pipe' | 'unpipe', listener: (src: Readable) => Awaited<void>): this;
    public once(event: 'speaking', listener: (speaking: boolean) => Awaited<void>): this;
    public once(event: 'volumeChange', listener: (oldVolume: number, newVolume: number) => Awaited<void>): this;
    public once(event: string, listener: (...args: any[]) => Awaited<void>): this;
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
    public static resolve(bit?: BitFieldResolvable<SystemChannelFlagsString, number>): number;
  }

  export class Team extends Base {
    constructor(client: Client, data: unknown);
    public id: Snowflake;
    public name: string;
    public icon: string | null;
    public ownerID: Snowflake | null;
    public members: Collection<Snowflake, TeamMember>;

    public readonly owner: TeamMember;
    public readonly createdAt: Date;
    public readonly createdTimestamp: number;

    public iconURL(options?: ImageURLOptions): string;
    public toJSON(): unknown;
    public toString(): string;
  }

  export class TeamMember extends Base {
    constructor(team: Team, data: unknown);
    public team: Team;
    public readonly id: Snowflake;
    public permissions: string[];
    public membershipState: MembershipStates;
    public user: User;

    public toString(): string;
  }

  export class TextChannel extends TextBasedChannel(GuildChannel) {
    constructor(guild: Guild, data?: unknown);
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
    public setType(type: Pick<typeof ChannelType, 'text' | 'news'>, reason?: string): Promise<GuildChannel>;
    public fetchWebhooks(): Promise<Collection<Snowflake, Webhook>>;
  }

  export class User extends PartialTextBasedChannel(Base) {
    constructor(client: Client, data: unknown);
    public avatar: string | null;
    public bot: boolean;
    public readonly createdAt: Date;
    public readonly createdTimestamp: number;
    public discriminator: string;
    public readonly defaultAvatarURL: string;
    public readonly dmChannel: DMChannel | null;
    public flags: Readonly<UserFlags> | null;
    public id: Snowflake;
    public lastMessageID: Snowflake | null;
    public readonly partial: false;
    public readonly presence: Presence;
    public system: boolean | null;
    public readonly tag: string;
    public username: string;
    public avatarURL(options?: ImageURLOptions & { dynamic?: boolean }): string | null;
    public createDM(): Promise<DMChannel>;
    public deleteDM(): Promise<DMChannel>;
    public displayAvatarURL(options?: ImageURLOptions & { dynamic?: boolean }): string;
    public equals(user: User): boolean;
    public fetch(force?: boolean): Promise<User>;
    public fetchFlags(force?: boolean): Promise<UserFlags>;
    public toString(): string;
    public typingDurationIn(channel: ChannelResolvable): number;
    public typingIn(channel: ChannelResolvable): boolean;
    public typingSinceIn(channel: ChannelResolvable): Date;
  }

  export class UserFlags extends BitField<UserFlagsString> {
    public static FLAGS: Record<UserFlagsString, number>;
    public static resolve(bit?: BitFieldResolvable<UserFlagsString, number>): number;
  }

  export class Util {
    public static basename(path: string, ext?: string): string;
    public static binaryToID(num: string): Snowflake;
    public static cleanContent(str: string, channel: Channel): string;
    public static removeMentions(str: string): string;
    public static cloneObject(obj: unknown): unknown;
    public static delayFor(ms: number): Promise<void>;
    public static discordSort<K, V extends { rawPosition: number; id: Snowflake }>(
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
    public static flatten(obj: unknown, ...props: { [key: string]: boolean | string }[]): unknown;
    public static idToBinary(num: Snowflake): string;
    public static makeError(obj: { name: string; message: string; stack: string }): Error;
    public static makePlainError(err: Error): { name: string; message: string; stack: string };
    public static mergeDefault(def: unknown, given: unknown): unknown;
    public static moveElementInArray(array: any[], element: any, newIndex: number, offset?: boolean): number;
    public static parseEmoji(text: string): { animated: boolean; name: string; id: Snowflake | null } | null;
    public static resolveColor(color: ColorResolvable): number;
    public static verifyString(data: string, error?: typeof Error, errorMessage?: string, allowEmpty?: boolean): string;
    public static setPosition<T extends Channel | Role>(
      item: T,
      position: number,
      relative: boolean,
      sorted: Collection<Snowflake, T>,
      route: unknown,
      reason?: string,
    ): Promise<{ id: Snowflake; position: number }[]>;
    public static splitMessage(text: string, options?: SplitOptions): string[];
  }

  class VoiceBroadcast extends EventEmitter {
    constructor(client: Client);
    public client: Client;
    public subscribers: StreamDispatcher[];
    public readonly dispatcher: BroadcastDispatcher | null;
    public play(input: string | Readable, options?: StreamOptions): BroadcastDispatcher;
    public end(): void;

    public on(event: 'end', listener: () => Awaited<void>): this;
    public on(event: 'subscribe' | 'unsubscribe', listener: (dispatcher: StreamDispatcher) => Awaited<void>): this;
    public on(event: string, listener: (...args: any[]) => Awaited<void>): this;

    public once(event: 'end', listener: () => Awaited<void>): this;
    public once(event: 'subscribe' | 'unsubscribe', listener: (dispatcher: StreamDispatcher) => Awaited<void>): this;
    public once(event: string, listener: (...args: any[]) => Awaited<void>): this;
  }

  export class VoiceChannel extends BaseGuildVoiceChannel {
    public readonly editable: boolean;
    public readonly speakable: boolean;
    public type: 'voice';
    public setBitrate(bitrate: number, reason?: string): Promise<VoiceChannel>;
    public setUserLimit(userLimit: number, reason?: string): Promise<VoiceChannel>;
  }

  class VoiceConnection extends EventEmitter {
    constructor(voiceManager: ClientVoiceManager, channel: VoiceChannel);
    private authentication: unknown;
    private sockets: unknown;
    private ssrcMap: Map<number, boolean>;
    private _speaking: Map<Snowflake, Readonly<Speaking>>;
    private _disconnect(): void;
    private authenticate(): void;
    private authenticateFailed(reason: string): void;
    private checkAuthenticated(): void;
    private cleanup(): void;
    private connect(): void;
    private onReady(data: unknown): void;
    private onSessionDescription(mode: string, secret: string): void;
    private onSpeaking(data: unknown): void;
    private reconnect(token: string, endpoint: string): void;
    private sendVoiceStateUpdate(options: unknown): Promise<Shard>;
    private setSessionID(sessionID: string): void;
    private setTokenAndEndpoint(token: string, endpoint: string): void;
    private updateChannel(channel: VoiceChannel | StageChannel): void;

    public channel: VoiceChannel | StageChannel;
    public readonly client: Client;
    public readonly dispatcher: StreamDispatcher | null;
    public player: unknown;
    public receiver: VoiceReceiver;
    public speaking: Readonly<Speaking>;
    public status: VoiceStatus;
    public readonly voice: VoiceState | null;
    public voiceManager: ClientVoiceManager;
    public disconnect(): void;
    public play(input: VoiceBroadcast | Readable | string, options?: StreamOptions): StreamDispatcher;
    public setSpeaking(value: BitFieldResolvable<SpeakingString, number>): void;

    public on(
      event: 'authenticated' | 'closing' | 'newSession' | 'ready' | 'reconnecting',
      listener: () => Awaited<void>,
    ): this;
    public on(event: 'debug', listener: (message: string) => Awaited<void>): this;
    public on(event: 'error' | 'failed' | 'disconnect', listener: (error: Error) => Awaited<void>): this;
    public on(event: 'speaking', listener: (user: User, speaking: Readonly<Speaking>) => Awaited<void>): this;
    public on(event: 'warn', listener: (warning: string | Error) => Awaited<void>): this;
    public on(event: string, listener: (...args: any[]) => Awaited<void>): this;

    public once(
      event: 'authenticated' | 'closing' | 'newSession' | 'ready' | 'reconnecting',
      listener: () => Awaited<void>,
    ): this;
    public once(event: 'debug', listener: (message: string) => Awaited<void>): this;
    public once(event: 'error' | 'failed' | 'disconnect', listener: (error: Error) => Awaited<void>): this;
    public once(event: 'speaking', listener: (user: User, speaking: Readonly<Speaking>) => Awaited<void>): this;
    public once(event: 'warn', listener: (warning: string | Error) => Awaited<void>): this;
    public once(event: string, listener: (...args: any[]) => Awaited<void>): this;
  }

  class VoiceReceiver extends EventEmitter {
    constructor(connection: VoiceConnection);
    public createStream(
      user: UserResolvable,
      options?: { mode?: 'opus' | 'pcm'; end?: 'silence' | 'manual' },
    ): Readable;

    public on(event: 'debug', listener: (error: Error | string) => Awaited<void>): this;
    public on(event: string, listener: (...args: any[]) => Awaited<void>): this;

    public once(event: 'debug', listener: (error: Error | string) => Awaited<void>): this;
    public once(event: string, listener: (...args: any[]) => Awaited<void>): this;
  }

  export class VoiceRegion {
    constructor(data: unknown);
    public custom: boolean;
    public deprecated: boolean;
    public id: string;
    public name: string;
    public optimal: boolean;
    public vip: boolean;
    public toJSON(): unknown;
  }

  export class VoiceState extends Base {
    constructor(guild: Guild, data: unknown);
    public readonly channel: VoiceChannel | StageChannel | null;
    public channelID: Snowflake | null;
    public readonly connection: VoiceConnection | null;
    public readonly deaf: boolean | null;
    public guild: Guild;
    public id: Snowflake;
    public readonly member: GuildMember | null;
    public readonly mute: boolean | null;
    public selfDeaf: boolean | null;
    public selfMute: boolean | null;
    public serverDeaf: boolean | null;
    public serverMute: boolean | null;
    public sessionID: string | null;
    public streaming: boolean;
    public selfVideo: boolean;
    public suppress: boolean;
    public requestToSpeakTimestamp: number | null;
    public readonly speaking: boolean | null;

    public setDeaf(deaf: boolean, reason?: string): Promise<GuildMember>;
    public setMute(mute: boolean, reason?: string): Promise<GuildMember>;
    public kick(reason?: string): Promise<GuildMember>;
    public setChannel(channel: ChannelResolvable | null, reason?: string): Promise<GuildMember>;
    public setSelfDeaf(deaf: boolean): Promise<boolean>;
    public setSelfMute(mute: boolean): Promise<boolean>;
    public setRequestToSpeak(request: boolean): Promise<void>;
    public setSuppressed(suppressed: boolean): Promise<void>;
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

    public on(event: 'volumeChange', listener: (oldVolume: number, newVolume: number) => Awaited<void>): this;

    public once(event: 'volumeChange', listener: (oldVolume: number, newVolume: number) => Awaited<void>): this;
  }

  export class Webhook extends WebhookMixin() {
    constructor(client: Client, data?: unknown);
    public avatar: string;
    public avatarURL(options?: ImageURLOptions): string | null;
    public channelID: Snowflake;
    public client: Client;
    public guildID: Snowflake;
    public name: string;
    public owner: User | unknown | null;
    public sourceGuild: Guild | unknown | null;
    public sourceChannel: Channel | unknown | null;
    public token: string | null;
    public type: WebhookTypes;
  }

  export class WebhookClient extends WebhookMixin(BaseClient) {
    constructor(id: Snowflake, token: string, options?: WebhookClientOptions);
    public client: this;
    public options: WebhookClientOptions;
    public token: string;
    public editMessage(
      message: MessageResolvable,
      content: string | null | APIMessage | MessageEmbed | MessageEmbed[],
      options?: WebhookEditMessageOptions,
    ): Promise<RawMessage>;
    public editMessage(message: MessageResolvable, options: WebhookEditMessageOptions): Promise<RawMessage>;
    public fetchMessage(message: Snowflake, cache?: boolean): Promise<RawMessage>;
    public send(content: string | (WebhookMessageOptions & { split?: false }) | MessageAdditions): Promise<RawMessage>;
    public send(options: WebhookMessageOptions & { split: true | SplitOptions }): Promise<RawMessage[]>;
    public send(options: WebhookMessageOptions | APIMessage): Promise<RawMessage | RawMessage[]>;
    public send(
      content: string | null,
      options: (WebhookMessageOptions & { split?: false }) | MessageAdditions,
    ): Promise<RawMessage>;
    public send(
      content: string | null,
      options: WebhookMessageOptions & { split: true | SplitOptions },
    ): Promise<RawMessage[]>;
    public send(content: string | null, options: WebhookMessageOptions): Promise<RawMessage | RawMessage[]>;
  }

  export class WebSocketManager extends EventEmitter {
    constructor(client: Client);
    private totalShards: number | string;
    private shardQueue: Set<WebSocketShard>;
    private packetQueue: unknown[];
    private destroyed: boolean;
    private reconnecting: boolean;

    public readonly client: Client;
    public gateway: string | null;
    public shards: Collection<number, WebSocketShard>;
    public status: Status;
    public readonly ping: number;

    public on(event: WSEventType, listener: (data: any, shardID: number) => void): this;
    public once(event: WSEventType, listener: (data: any, shardID: number) => void): this;

    private debug(message: string, shard?: WebSocketShard): void;
    private connect(): Promise<void>;
    private createShards(): Promise<void>;
    private reconnect(): Promise<void>;
    private broadcast(packet: unknown): void;
    private destroy(): void;
    private handlePacket(packet?: unknown, shard?: WebSocketShard): boolean;
    private checkShardsReady(): void;
    private triggerClientReady(): void;
  }

  export class WebSocketShard extends EventEmitter {
    constructor(manager: WebSocketManager, id: number);
    private sequence: number;
    private closeSequence: number;
    private sessionID: string | null;
    private lastPingTimestamp: number;
    private lastHeartbeatAcked: boolean;
    private ratelimit: { queue: unknown[]; total: number; remaining: number; time: 60e3; timer: NodeJS.Timeout | null };
    private connection: WebSocket | null;
    private helloTimeout: NodeJS.Timeout | null;
    private eventsAttached: boolean;
    private expectedGuilds: Set<Snowflake> | null;
    private readyTimeout: NodeJS.Timeout | null;

    public manager: WebSocketManager;
    public id: number;
    public status: Status;
    public ping: number;

    private debug(message: string): void;
    private connect(): Promise<void>;
    private onOpen(): void;
    private onMessage(event: MessageEvent): void;
    private onError(error: ErrorEvent | unknown): void;
    private onClose(event: CloseEvent): void;
    private onPacket(packet: unknown): void;
    private checkReady(): void;
    private setHelloTimeout(time?: number): void;
    private setHeartbeatTimer(time: number): void;
    private sendHeartbeat(): void;
    private ackHeartbeat(): void;
    private identify(): void;
    private identifyNew(): void;
    private identifyResume(): void;
    private _send(data: unknown): void;
    private processQueue(): void;
    private destroy(destroyOptions?: { closeCode?: number; reset?: boolean; emit?: boolean; log?: boolean }): void;
    private _cleanupConnection(): void;
    private _emitDestroyed(): void;

    public send(data: unknown): void;

    public on(event: 'ready' | 'resumed' | 'invalidSession', listener: () => Awaited<void>): this;
    public on(event: 'close', listener: (event: CloseEvent) => Awaited<void>): this;
    public on(event: 'allReady', listener: (unavailableGuilds?: Set<Snowflake>) => Awaited<void>): this;
    public on(event: string, listener: (...args: any[]) => Awaited<void>): this;

    public once(event: 'ready' | 'resumed' | 'invalidSession', listener: () => Awaited<void>): this;
    public once(event: 'close', listener: (event: CloseEvent) => Awaited<void>): this;
    public once(event: 'allReady', listener: (unavailableGuilds?: Set<Snowflake>) => Awaited<void>): this;
    public once(event: string, listener: (...args: any[]) => Awaited<void>): this;
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
    public toJSON(): unknown;
  }

  //#endregion

  //#region Managers

  export abstract class BaseManager<K, Holds, R> {
    constructor(client: Client, iterable: Iterable<any>, holds: Constructable<Holds>, cacheType: Collection<K, Holds>);
    public holds: Constructable<Holds>;
    public cache: Collection<K, Holds>;
    public cacheType: Collection<K, Holds>;
    public readonly client: Client;
    public add(data: any, cache?: boolean, { id, extras }?: { id: K; extras: any[] }): Holds;
    public resolve(resolvable: Holds): Holds;
    public resolve(resolvable: R): Holds | null;
    public resolveID(resolvable: Holds): K;
    public resolveID(resolvable: R): K | null;
    public valueOf(): Collection<K, Holds>;
  }

  export class ApplicationCommandManager extends BaseManager<
    Snowflake,
    ApplicationCommand,
    ApplicationCommandResolvable
  > {
    constructor(client: Client, iterable?: Iterable<any>);
    private readonly commandPath: unknown;
    public create(command: ApplicationCommandData): Promise<ApplicationCommand>;
    public delete(command: ApplicationCommandResolvable): Promise<ApplicationCommand | null>;
    public edit(command: ApplicationCommandResolvable, data: ApplicationCommandData): Promise<ApplicationCommand>;
    public fetch(id: Snowflake, cache?: boolean, force?: boolean): Promise<ApplicationCommand>;
    public fetch(id?: Snowflake, cache?: boolean, force?: boolean): Promise<Collection<Snowflake, ApplicationCommand>>;
    public set(commands: ApplicationCommandData[]): Promise<Collection<Snowflake, ApplicationCommand>>;
    private static transformCommand(command: ApplicationCommandData): unknown;
  }

  export class BaseGuildEmojiManager extends BaseManager<Snowflake, GuildEmoji, EmojiResolvable> {
    constructor(client: Client, iterable?: Iterable<any>);
    public resolveIdentifier(emoji: EmojiIdentifierResolvable): string | null;
  }

  export class ChannelManager extends BaseManager<Snowflake, Channel, ChannelResolvable> {
    constructor(client: Client, iterable: Iterable<any>);
    public fetch(id: Snowflake, cache?: boolean, force?: boolean): Promise<Channel | null>;
  }

  export class GuildApplicationCommandManager extends ApplicationCommandManager {
    constructor(guild: Guild, iterable?: Iterable<any>);
    public guild: Guild;
    public fetchPermissions(): Promise<Collection<Snowflake, ApplicationCommandPermissions[]>>;
    public fetchPermissions(command: ApplicationCommandResolvable): Promise<ApplicationCommandPermissions[]>;
    public setPermissions(
      command: ApplicationCommandResolvable,
      permissions: ApplicationCommandPermissionData[],
    ): Promise<ApplicationCommandPermissions[]>;
    public setPermissions(
      permissions: GuildApplicationCommandPermissionData[],
    ): Promise<Collection<Snowflake, ApplicationCommandPermissions[]>>;
    private static transformPermissions(permissions: ApplicationCommandPermissionData, received?: boolean): unknown;
  }

  export class GuildChannelManager extends BaseManager<Snowflake, GuildChannel, GuildChannelResolvable> {
    constructor(guild: Guild, iterable?: Iterable<any>);
    public guild: Guild;
    public create(name: string, options: GuildCreateChannelOptions & { type: 'voice' }): Promise<VoiceChannel>;
    public create(name: string, options: GuildCreateChannelOptions & { type: 'category' }): Promise<CategoryChannel>;
    public create(name: string, options?: GuildCreateChannelOptions & { type?: 'text' }): Promise<TextChannel>;
    public create(name: string, options: GuildCreateChannelOptions & { type: 'news' }): Promise<NewsChannel>;
    public create(name: string, options: GuildCreateChannelOptions & { type: 'store' }): Promise<StoreChannel>;
    public create(name: string, options: GuildCreateChannelOptions & { type: 'stage' }): Promise<StageChannel>;
    public create(
      name: string,
      options: GuildCreateChannelOptions,
    ): Promise<TextChannel | VoiceChannel | CategoryChannel | NewsChannel | StoreChannel | StageChannel>;
  }

  export class GuildEmojiManager extends BaseGuildEmojiManager {
    constructor(guild: Guild, iterable?: Iterable<any>);
    public guild: Guild;
    public create(
      attachment: BufferResolvable | Base64Resolvable,
      name: string,
      options?: GuildEmojiCreateOptions,
    ): Promise<GuildEmoji>;
    public fetch(id: Snowflake, cache?: boolean, force?: boolean): Promise<GuildEmoji>;
    public fetch(id?: Snowflake, cache?: boolean, force?: boolean): Promise<Collection<Snowflake, GuildEmoji>>;
  }

  export class GuildEmojiRoleManager {
    constructor(emoji: GuildEmoji);
    public emoji: GuildEmoji;
    public guild: Guild;
    public cache: Collection<Snowflake, Role>;
    public add(
      roleOrRoles: RoleResolvable | readonly RoleResolvable[] | Collection<Snowflake, Role>,
    ): Promise<GuildEmoji>;
    public set(roles: readonly RoleResolvable[] | Collection<Snowflake, Role>): Promise<GuildEmoji>;
    public remove(
      roleOrRoles: RoleResolvable | readonly RoleResolvable[] | Collection<Snowflake, Role>,
    ): Promise<GuildEmoji>;
    public valueOf(): Collection<Snowflake, Role>;
  }

  export class GuildManager extends BaseManager<Snowflake, Guild, GuildResolvable> {
    constructor(client: Client, iterable?: Iterable<any>);
    public create(name: string, options?: GuildCreateOptions): Promise<Guild>;
    public fetch(options: Snowflake | FetchGuildOptions): Promise<Guild>;
    public fetch(options?: FetchGuildsOptions): Promise<Collection<Snowflake, OAuth2Guild>>;
  }

  export class GuildMemberManager extends BaseManager<Snowflake, GuildMember, GuildMemberResolvable> {
    constructor(guild: Guild, iterable?: Iterable<any>);
    public guild: Guild;
    public ban(user: UserResolvable, options?: BanOptions): Promise<GuildMember | User | Snowflake>;
    public edit(user: UserResolvable, data: GuildMemberEditData, reason?: string): Promise<void>;
    public fetch(
      options: UserResolvable | FetchMemberOptions | (FetchMembersOptions & { user: UserResolvable }),
    ): Promise<GuildMember>;
    public fetch(options?: FetchMembersOptions): Promise<Collection<Snowflake, GuildMember>>;
    public kick(user: UserResolvable, reason?: string): Promise<GuildMember | User | Snowflake>;
    public prune(options: GuildPruneMembersOptions & { dry?: false; count: false }): Promise<null>;
    public prune(options?: GuildPruneMembersOptions): Promise<number>;
    public search(options: GuildSearchMembersOptions): Promise<Collection<Snowflake, GuildMember>>;
    public unban(user: UserResolvable, reason?: string): Promise<User>;
  }

  export class GuildBanManager extends BaseManager<Snowflake, GuildBan, GuildBanResolvable> {
    constructor(guild: Guild, iterable?: Iterable<any>);
    public guild: Guild;
    public create(user: UserResolvable, options?: BanOptions): Promise<GuildMember | User | Snowflake>;
    public fetch(options: UserResolvable | FetchBanOptions): Promise<GuildBan>;
    public fetch(options?: FetchBansOptions): Promise<Collection<Snowflake, GuildBan>>;
    public remove(user: UserResolvable, reason?: string): Promise<User>;
  }

  export class GuildMemberRoleManager {
    constructor(member: GuildMember);
    public readonly cache: Collection<Snowflake, Role>;
    public readonly hoist: Role | null;
    public readonly color: Role | null;
    public readonly highest: Role;
    public readonly premiumSubscriberRole: Role | null;
    public readonly botRole: Role | null;
    public member: GuildMember;
    public guild: Guild;

    public add(
      roleOrRoles: RoleResolvable | readonly RoleResolvable[] | Collection<Snowflake, Role>,
      reason?: string,
    ): Promise<GuildMember>;
    public set(roles: readonly RoleResolvable[] | Collection<Snowflake, Role>, reason?: string): Promise<GuildMember>;
    public remove(
      roleOrRoles: RoleResolvable | readonly RoleResolvable[] | Collection<Snowflake, Role>,
      reason?: string,
    ): Promise<GuildMember>;
    public valueOf(): Collection<Snowflake, Role>;
  }

  export class MessageManager extends BaseManager<Snowflake, Message, MessageResolvable> {
    constructor(channel: TextChannel | DMChannel, iterable?: Iterable<any>);
    public channel: TextBasedChannelFields;
    public cache: Collection<Snowflake, Message>;
    public crosspost(message: MessageResolvable): Promise<Message>;
    public delete(message: MessageResolvable): Promise<void>;
    public edit(message: MessageResolvable, options: APIMessage | MessageEditOptions): Promise<Message>;
    public fetch(message: Snowflake, cache?: boolean, force?: boolean): Promise<Message>;
    public fetch(
      options?: ChannelLogsQueryOptions,
      cache?: boolean,
      force?: boolean,
    ): Promise<Collection<Snowflake, Message>>;
    public fetchPinned(cache?: boolean): Promise<Collection<Snowflake, Message>>;
    public react(message: MessageResolvable, emoji: EmojiIdentifierResolvable): Promise<void>;
    public pin(message: MessageResolvable): Promise<void>;
    public unpin(message: MessageResolvable): Promise<void>;
  }

  export class PresenceManager extends BaseManager<Snowflake, Presence, PresenceResolvable> {
    constructor(client: Client, iterable?: Iterable<any>);
  }

  export class ReactionManager extends BaseManager<Snowflake | string, MessageReaction, MessageReactionResolvable> {
    constructor(message: Message, iterable?: Iterable<any>);
    public message: Message;
    public removeAll(): Promise<Message>;
  }

  export class ReactionUserManager extends BaseManager<Snowflake, User, UserResolvable> {
    constructor(client: Client, iterable: Iterable<any> | undefined, reaction: MessageReaction);
    public reaction: MessageReaction;
    public fetch(options?: { limit?: number; after?: Snowflake }): Promise<Collection<Snowflake, User>>;
    public remove(user?: UserResolvable): Promise<MessageReaction>;
  }

  export class RoleManager extends BaseManager<Snowflake, Role, RoleResolvable> {
    constructor(guild: Guild, iterable?: Iterable<any>);
    public readonly everyone: Role;
    public readonly highest: Role;
    public guild: Guild;
    public readonly premiumSubscriberRole: Role | null;
    public botRoleFor(user: UserResolvable): Role | null;
    public create(options?: RoleData & { reason?: string }): Promise<Role>;
    public fetch(id: Snowflake, cache?: boolean, force?: boolean): Promise<Role | null>;
    public fetch(id?: Snowflake, cache?: boolean, force?: boolean): Promise<Collection<Snowflake, Role>>;
  }

  export class UserManager extends BaseManager<Snowflake, User, UserResolvable> {
    constructor(client: Client, iterable?: Iterable<any>);
    public fetch(id: Snowflake, cache?: boolean, force?: boolean): Promise<User>;
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
  function TextBasedChannel<T, I extends keyof TextBasedChannelFields = never>(
    Base?: Constructable<T>,
    ignore?: I[],
  ): Constructable<T & Omit<TextBasedChannelFields, I>>;

  interface PartialTextBasedChannelFields {
    lastMessageID: Snowflake | null;
    readonly lastMessage: Message | null;
    send(content: string | (MessageOptions & { split?: false }) | MessageAdditions): Promise<Message>;
    send(options: MessageOptions & { split: true | SplitOptions }): Promise<Message[]>;
    send(options: MessageOptions | APIMessage): Promise<Message | Message[]>;
    send(content: string | null, options: (MessageOptions & { split?: false }) | MessageAdditions): Promise<Message>;
    send(content: string | null, options: MessageOptions & { split: true | SplitOptions }): Promise<Message[]>;
    send(content: string | null, options: MessageOptions): Promise<Message | Message[]>;
  }

  interface TextBasedChannelFields extends PartialTextBasedChannelFields {
    _typing: Map<string, TypingData>;
    lastPinTimestamp: number | null;
    readonly lastPinAt: Date | null;
    typing: boolean;
    typingCount: number;
    awaitMessageComponentInteractions(
      filter: CollectorFilter<[MessageComponentInteraction]>,
      options?: AwaitMessageComponentInteractionsOptions,
    ): Promise<Collection<Snowflake, MessageComponentInteraction>>;
    awaitMessages(
      filter: CollectorFilter<[Message]>,
      options?: AwaitMessagesOptions,
    ): Promise<Collection<Snowflake, Message>>;
    bulkDelete(
      messages: Collection<Snowflake, Message> | readonly MessageResolvable[] | number,
      filterOld?: boolean,
    ): Promise<Collection<Snowflake, Message>>;
    createMessageComponentInteractionCollector(
      filter: CollectorFilter<[MessageComponentInteraction]>,
      options?: MessageComponentInteractionCollectorOptions,
    ): MessageComponentInteractionCollector;
    createMessageCollector(filter: CollectorFilter<[Message]>, options?: MessageCollectorOptions): MessageCollector;
    startTyping(count?: number): Promise<void>;
    stopTyping(force?: boolean): void;
  }

  function PartialWebhookMixin<T>(Base?: Constructable<T>): Constructable<T & PartialWebhookFields>;
  function WebhookMixin<T>(Base?: Constructable<T>): Constructable<T & WebhookFields>;

  function VolumeMixin<T>(base: Constructable<T>): Constructable<T & VolumeInterface>;

  interface PartialWebhookFields {
    id: Snowflake;
    readonly url: string;
    deleteMessage(message: MessageResolvable | '@original'): Promise<void>;
    editMessage(
      message: MessageResolvable | '@original',
      content: string | null | APIMessage | MessageAdditions,
      options?: WebhookEditMessageOptions,
    ): Promise<Message | RawMessage>;
    editMessage(
      message: MessageResolvable | '@original',
      options: WebhookEditMessageOptions,
    ): Promise<Message | RawMessage>;
    fetchMessage(message: Snowflake | '@original', cache?: boolean): Promise<Message | RawMessage>;
    send(
      content: string | (WebhookMessageOptions & { split?: false }) | MessageAdditions,
    ): Promise<Message | RawMessage>;
    send(options: WebhookMessageOptions & { split: true | SplitOptions }): Promise<(Message | RawMessage)[]>;
    send(options: WebhookMessageOptions | APIMessage): Promise<Message | RawMessage | (Message | RawMessage)[]>;
    send(
      content: string | null,
      options: (WebhookMessageOptions & { split?: false }) | MessageAdditions,
    ): Promise<Message | RawMessage>;
    send(
      content: string | null,
      options: WebhookMessageOptions & { split: true | SplitOptions },
    ): Promise<(Message | RawMessage)[]>;
    send(
      content: string | null,
      options: WebhookMessageOptions,
    ): Promise<Message | RawMessage | (Message | RawMessage)[]>;
  }

  interface WebhookFields extends PartialWebhookFields {
    readonly createdAt: Date;
    readonly createdTimestamp: number;
    delete(reason?: string): Promise<void>;
    edit(options: WebhookEditData): Promise<Webhook>;
    sendSlackMessage(body: object): Promise<boolean>;
  }

  //#endregion

  //#region Typedefs

  type ActivityFlagsString = 'INSTANCE' | 'JOIN' | 'SPECTATE' | 'JOIN_REQUEST' | 'SYNC' | 'PLAY';

  type ActivitiesOptions = Omit<ActivityOptions, 'shardID'>;

  interface ActivityOptions {
    name?: string;
    url?: string;
    type?: ActivityType | number;
    shardID?: number | readonly number[];
  }

  type ActivityPlatform = 'desktop' | 'samsung' | 'xbox';

  type ActivityType = 'PLAYING' | 'STREAMING' | 'LISTENING' | 'WATCHING' | 'CUSTOM_STATUS' | 'COMPETING';

  interface AddGuildMemberOptions {
    accessToken: string;
    nick?: string;
    roles?: Collection<Snowflake, Role> | RoleResolvable[];
    mute?: boolean;
    deaf?: boolean;
  }

  interface APIErrors {
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
    UNKNOWN_BAN: 10026;
    UNKNOWN_GUILD_TEMPLATE: 10057;
    BOT_PROHIBITED_ENDPOINT: 20001;
    BOT_ONLY_ENDPOINT: 20002;
    ANNOUNCEMENT_EDIT_LIMIT_EXCEEDED: 20022;
    CHANNEL_HIT_WRITE_RATELIMIT: 20028;
    MAXIMUM_GUILDS: 30001;
    MAXIMUM_FRIENDS: 30002;
    MAXIMUM_PINS: 30003;
    MAXIMUM_ROLES: 30005;
    MAXIMUM_WEBHOOKS: 30007;
    MAXIMUM_REACTIONS: 30010;
    MAXIMUM_CHANNELS: 30013;
    MAXIMUM_ATTACHMENTS: 30015;
    MAXIMUM_INVITES: 30016;
    GUILD_ALREADY_HAS_TEMPLATE: 30031;
    UNAUTHORIZED: 40001;
    ACCOUNT_VERIFICATION_REQUIRED: 40002;
    REQUEST_ENTITY_TOO_LARGE: 40005;
    FEATURE_TEMPORARILY_DISABLED: 40006;
    USER_BANNED: 40007;
    ALREADY_CROSSPOSTED: 40033;
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
    INVALID_OR_TAKEN_INVITE_CODE: 50020;
    CANNOT_EXECUTE_ON_SYSTEM_MESSAGE: 50021;
    INVALID_OAUTH_TOKEN: 50025;
    BULK_DELETE_MESSAGE_TOO_OLD: 50034;
    INVALID_FORM_BODY: 50035;
    INVITE_ACCEPTED_TO_GUILD_NOT_CONTAINING_BOT: 50036;
    INVALID_API_VERSION: 50041;
    CANNOT_DELETE_COMMUNITY_REQUIRED_CHANNEL: 50074;
    INVALID_STICKER_SENT: 50081;
    REACTION_BLOCKED: 90001;
    RESOURCE_OVERLOADED: 130000;
  }

  interface ApplicationAsset {
    name: string;
    id: Snowflake;
    type: 'BIG' | 'SMALL';
  }

  interface ApplicationCommandData {
    name: string;
    description: string;
    options?: ApplicationCommandOptionData[];
    defaultPermission?: boolean;
  }

  interface ApplicationCommandOptionData {
    type: ApplicationCommandOptionType | ApplicationCommandOptionTypes;
    name: string;
    description: string;
    required?: boolean;
    choices?: ApplicationCommandOptionChoice[];
    options?: this[];
  }

  interface ApplicationCommandOption extends ApplicationCommandOptionData {
    type: ApplicationCommandOptionType;
  }

  interface ApplicationCommandOptionChoice {
    name: string;
    value: string | number;
  }

  type ApplicationCommandOptionType = keyof typeof ApplicationCommandOptionTypes;

  interface ApplicationCommandPermissionData {
    id: Snowflake;
    type: ApplicationCommandPermissionType | ApplicationCommandPermissionTypes;
    permission: boolean;
  }

  interface ApplicationCommandPermissions extends ApplicationCommandPermissionData {
    type: ApplicationCommandPermissionType;
  }

  type ApplicationCommandPermissionType = keyof typeof ApplicationCommandPermissionTypes;

  type ApplicationCommandResolvable = ApplicationCommand | Snowflake;

  type ApplicationFlagsString =
    | 'MANAGED_EMOJI'
    | 'GROUP_DM_CREATE'
    | 'RPC_HAS_CONNECTED'
    | 'GATEWAY_PRESENCE'
    | 'FATEWAY_PRESENCE_LIMITED'
    | 'GATEWAY_GUILD_MEMBERS'
    | 'GATEWAY_GUILD_MEMBERS_LIMITED'
    | 'VERIFICATION_PENDING_GUILD_LIMIT'
    | 'EMBEDDED';

  interface AuditLogChange {
    key: string;
    old?: any;
    new?: any;
  }

  interface AwaitMessageComponentInteractionsOptions extends MessageComponentInteractionCollectorOptions {
    errors?: string[];
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

  interface BaseMessageComponentOptions {
    type?: MessageComponentType | MessageComponentTypes;
  }

  type BitFieldResolvable<T extends string, N extends number | bigint> =
    | RecursiveReadonlyArray<T | N | Readonly<BitField<T, N>>>
    | T
    | N
    | Readonly<BitField<T, N>>;

  type BufferResolvable = Buffer | string;

  interface ChannelCreationOverwrites {
    allow?: PermissionResolvable;
    deny?: PermissionResolvable;
    id: RoleResolvable | UserResolvable;
  }

  interface ChannelData {
    name?: string;
    type?: Pick<typeof ChannelType, 'text' | 'news'>;
    position?: number;
    topic?: string;
    nsfw?: boolean;
    bitrate?: number;
    userLimit?: number;
    parentID?: Snowflake | null;
    rateLimitPerUser?: number;
    lockPermissions?: boolean;
    permissionOverwrites?: readonly OverwriteResolvable[] | Collection<Snowflake, OverwriteResolvable>;
    rtcRegion?: string | null;
  }

  interface ChannelLogsQueryOptions {
    limit?: number;
    before?: Snowflake;
    after?: Snowflake;
    around?: Snowflake;
  }

  interface ChannelPosition {
    channel: ChannelResolvable;
    lockPermissions?: boolean;
    parent?: CategoryChannelResolvable;
    position?: number;
  }

  type ChannelResolvable = Channel | Snowflake;

  interface ClientEvents {
    applicationCommandCreate: [command: ApplicationCommand];
    applicationCommandDelete: [command: ApplicationCommand];
    applicationCommandUpdate: [oldCommand: ApplicationCommand | null, newCommand: ApplicationCommand];
    channelCreate: [channel: GuildChannel];
    channelDelete: [channel: DMChannel | GuildChannel];
    channelPinsUpdate: [channel: TextChannel | NewsChannel | DMChannel | PartialDMChannel, date: Date];
    channelUpdate: [oldChannel: DMChannel | GuildChannel, newChannel: DMChannel | GuildChannel];
    debug: [message: string];
    warn: [message: string];
    emojiCreate: [emoji: GuildEmoji];
    emojiDelete: [emoji: GuildEmoji];
    emojiUpdate: [oldEmoji: GuildEmoji, newEmoji: GuildEmoji];
    error: [error: Error];
    guildBanAdd: [ban: GuildBan];
    guildBanRemove: [ban: GuildBan];
    guildCreate: [guild: Guild];
    guildDelete: [guild: Guild];
    guildUnavailable: [guild: Guild];
    guildIntegrationsUpdate: [guild: Guild];
    guildMemberAdd: [member: GuildMember];
    guildMemberAvailable: [member: GuildMember | PartialGuildMember];
    guildMemberRemove: [member: GuildMember | PartialGuildMember];
    guildMembersChunk: [
      members: Collection<Snowflake, GuildMember>,
      guild: Guild,
      data: { count: number; index: number; nonce: string | undefined },
    ];
    guildMemberSpeaking: [member: GuildMember | PartialGuildMember, speaking: Readonly<Speaking>];
    guildMemberUpdate: [oldMember: GuildMember | PartialGuildMember, newMember: GuildMember];
    guildUpdate: [oldGuild: Guild, newGuild: Guild];
    inviteCreate: [invite: Invite];
    inviteDelete: [invite: Invite];
    message: [message: Message];
    messageDelete: [message: Message | PartialMessage];
    messageReactionRemoveAll: [message: Message | PartialMessage];
    messageReactionRemoveEmoji: [reaction: MessageReaction];
    messageDeleteBulk: [messages: Collection<Snowflake, Message | PartialMessage>];
    messageReactionAdd: [message: MessageReaction, user: User | PartialUser];
    messageReactionRemove: [reaction: MessageReaction, user: User | PartialUser];
    messageUpdate: [oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage];
    presenceUpdate: [oldPresence: Presence | undefined, newPresence: Presence];
    rateLimit: [rateLimitData: RateLimitData];
    invalidRequestWarning: [invalidRequestWarningData: InvalidRequestWarningData];
    ready: [];
    invalidated: [];
    roleCreate: [role: Role];
    roleDelete: [role: Role];
    roleUpdate: [oldRole: Role, newRole: Role];
    typingStart: [channel: TextChannel | NewsChannel | DMChannel | PartialDMChannel, user: User | PartialUser];
    userUpdate: [oldUser: User | PartialUser, newUser: User];
    voiceStateUpdate: [oldState: VoiceState, newState: VoiceState];
    webhookUpdate: [channel: TextChannel];
    interaction: [interaction: Interaction];
    shardDisconnect: [closeEvent: CloseEvent, shardID: number];
    shardError: [error: Error, shardID: number];
    shardReady: [shardID: number, unavailableGuilds: Set<Snowflake> | undefined];
    shardReconnecting: [shardID: number];
    shardResume: [shardID: number, replayedEvents: number];
  }

  interface ClientOptions {
    shards?: number | number[] | 'auto';
    shardCount?: number;
    messageCacheMaxSize?: number;
    messageCacheLifetime?: number;
    messageSweepInterval?: number;
    allowedMentions?: MessageMentionOptions;
    invalidRequestWarningInterval?: number;
    partials?: PartialTypes[];
    restWsBridgeTimeout?: number;
    restTimeOffset?: number;
    restRequestTimeout?: number;
    restGlobalRateLimit?: number;
    restSweepInterval?: number;
    retryLimit?: number;
    presence?: PresenceData;
    intents: BitFieldResolvable<IntentsString, number>;
    ws?: WebSocketOptions;
    http?: HTTPOptions;
  }

  type ClientPresenceStatus = 'online' | 'idle' | 'dnd';

  interface ClientPresenceStatusData {
    web?: ClientPresenceStatus;
    mobile?: ClientPresenceStatus;
    desktop?: ClientPresenceStatus;
  }

  interface ClientUserEditData {
    username?: string;
    avatar?: BufferResolvable | Base64Resolvable;
  }

  interface CloseEvent {
    wasClean: boolean;
    code: number;
    reason: string;
    target: WebSocket;
  }

  type CollectorFilter<T extends any[]> = (...args: T) => boolean | Promise<boolean>;

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
    | 'FUCHSIA'
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
    | 'BLURPLE'
    | 'GREYPLE'
    | 'DARK_BUT_NOT_BLACK'
    | 'NOT_QUITE_BLACK'
    | 'RANDOM'
    | [number, number, number]
    | number
    | string;

  interface CommandInteractionOption {
    name: string;
    type: ApplicationCommandOptionType;
    value?: string | number | boolean;
    options?: Collection<string, CommandInteractionOption>;
    user?: User;
    member?: GuildMember | RawInteractionDataResolvedGuildMember;
    channel?: GuildChannel | RawInteractionDataResolvedChannel;
    role?: Role | RawRole;
  }

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
    name: string;
    value: string;
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
    CommandInteraction: typeof CommandInteraction;
  }

  interface FetchBanOptions {
    user: UserResolvable;
    cache?: boolean;
    force?: boolean;
  }

  interface FetchBansOptions {
    cache: boolean;
  }

  interface FetchGuildOptions {
    guild: GuildResolvable;
    cache?: boolean;
    force?: boolean;
  }

  interface FetchGuildsOptions {
    before?: Snowflake;
    after?: Snowflake;
    limit?: number;
  }

  interface FetchMemberOptions {
    user: UserResolvable;
    cache?: boolean;
    force?: boolean;
  }

  interface FetchMembersOptions {
    user?: UserResolvable | UserResolvable[];
    query?: string;
    limit?: number;
    withPresences?: boolean;
    time?: number;
    nonce?: string;
    force?: boolean;
  }

  type FetchOwnerOptions = Omit<FetchMemberOptions, 'user'>;

  interface FileOptions {
    attachment: BufferResolvable | Stream;
    name?: string;
  }

  interface GuildApplicationCommandPermissionData {
    id: Snowflake;
    permissions: ApplicationCommandPermissionData[];
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

  type GuildBanResolvable = GuildBan | UserResolvable;

  interface GuildChannelOverwriteOptions {
    reason?: string;
    type?: number;
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

  interface GuildCreateOptions {
    afkChannelID?: number;
    afkTimeout?: number;
    channels?: PartialChannelData[];
    defaultMessageNotifications?: DefaultMessageNotifications | number;
    explicitContentFilter?: ExplicitContentFilterLevel | number;
    icon?: BufferResolvable | Base64Resolvable | null;
    region?: string;
    roles?: PartialRoleData[];
    systemChannelFlags?: SystemChannelFlagsResolvable;
    systemChannelID?: number;
    verificationLevel?: VerificationLevel | number;
  }

  interface GuildWidget {
    enabled: boolean;
    channel: GuildChannel | null;
  }

  interface GuildEditData {
    name?: string;
    region?: string;
    verificationLevel?: VerificationLevel | number;
    explicitContentFilter?: ExplicitContentFilterLevel | number;
    defaultMessageNotifications?: DefaultMessageNotifications | number;
    afkChannel?: ChannelResolvable;
    systemChannel?: ChannelResolvable;
    systemChannelFlags?: SystemChannelFlagsResolvable;
    afkTimeout?: number;
    icon?: Base64Resolvable;
    owner?: GuildMemberResolvable;
    splash?: Base64Resolvable;
    discoverySplash?: Base64Resolvable;
    banner?: Base64Resolvable;
    rulesChannel?: ChannelResolvable;
    publicUpdatesChannel?: ChannelResolvable;
    preferredLocale?: string;
    description?: string | null;
    features?: GuildFeatures[];
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
    | 'COMMUNITY'
    | 'DISCOVERABLE'
    | 'FEATURABLE'
    | 'INVITE_SPLASH'
    | 'MEMBER_VERIFICATION_GATE_ENABLED'
    | 'MONETIZATION_ENABLED'
    | 'MORE_STICKERS'
    | 'NEWS'
    | 'PARTNERED'
    | 'PREVIEW_ENABLED'
    | 'RELAY_ENABLED'
    | 'TICKETED_EVENTS_ENABLED'
    | 'VANITY_URL'
    | 'VERIFIED'
    | 'VIP_REGIONS'
    | 'WELCOME_SCREEN_ENABLED';

  interface GuildMemberEditData {
    nick?: string | null;
    roles?: Collection<Snowflake, Role> | readonly RoleResolvable[];
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
    roles?: RoleResolvable[];
  }

  interface GuildWidgetData {
    enabled: boolean;
    channel: GuildChannelResolvable | null;
  }

  interface GuildSearchMembersOptions {
    query: string;
    limit?: number;
    cache?: boolean;
  }

  interface HTTPAttachmentData {
    attachment: string | Buffer | Stream;
    name: string;
    file: Buffer | Stream;
  }

  interface HTTPErrorData {
    json: unknown;
    files: HTTPAttachmentData[];
  }

  interface HTTPOptions {
    api?: string;
    version?: number;
    host?: string;
    cdn?: string;
    invite?: string;
    template?: string;
    headers?: Record<string, string>;
  }

  type ImageSize = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;

  interface ImageURLOptions {
    format?: AllowedImageFormat;
    size?: ImageSize;
  }

  interface IntegrationData {
    id: Snowflake;
    type: string;
  }

  interface IntegrationEditData {
    expireBehavior?: number;
    expireGracePeriod?: number;
  }

  interface IntegrationAccount {
    id: string | Snowflake;
    name: string;
  }

  interface InteractionDeferOptions {
    ephemeral?: boolean;
  }

  interface InteractionReplyOptions extends Omit<WebhookMessageOptions, 'username' | 'avatarURL'> {
    ephemeral?: boolean;
  }

  type InteractionResponseType = keyof typeof InteractionResponseTypes;

  type InteractionType = keyof typeof InteractionTypes;

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

  interface InviteGenerationOptions {
    permissions?: PermissionResolvable;
    guild?: GuildResolvable;
    disableGuildSelect?: boolean;
    additionalScopes?: InviteScope[];
  }

  interface InviteOptions {
    temporary?: boolean;
    maxAge?: number;
    maxUses?: number;
    unique?: boolean;
    reason?: string;
    targetApplication?: ApplicationResolvable;
    targetUser?: UserResolvable;
    targetType?: InviteTargetType;
  }

  type InviteResolvable = string;

  type InviteScope =
    | 'applications.builds.read'
    | 'applications.commands'
    | 'applications.entitlements'
    | 'applications.store.update'
    | 'connections'
    | 'email'
    | 'identity'
    | 'guilds'
    | 'guilds.join'
    | 'gdm.join'
    | 'webhook.incoming';

  type GuildTemplateResolvable = string;

  type MembershipStates = 'INVITED' | 'ACCEPTED';

  type MessageAdditions = MessageEmbed | MessageAttachment | (MessageEmbed | MessageAttachment)[];

  type MessageActionRowComponent = MessageButton;

  type MessageActionRowComponentOptions = MessageButtonOptions;

  type MessageActionRowComponentResolvable = MessageActionRowComponent | MessageActionRowComponentOptions;

  interface MessageActionRowOptions extends BaseMessageComponentOptions {
    components?: MessageActionRowComponentResolvable[];
  }

  interface MessageActivity {
    partyID: string;
    type: number;
  }

  interface MessageButtonOptions extends BaseMessageComponentOptions {
    customID?: string;
    disabled?: boolean;
    emoji?: RawEmoji;
    label?: string;
    style: MessageButtonStyleResolvable;
    url?: string;
  }

  type MessageButtonStyle = keyof typeof MessageButtonStyles;

  type MessageButtonStyleResolvable = MessageButtonStyle | MessageButtonStyles;

  interface MessageCollectorOptions extends CollectorOptions {
    max?: number;
    maxProcessed?: number;
  }

  type MessageComponent = BaseMessageComponent | MessageActionRow | MessageButton;

  interface MessageComponentInteractionCollectorOptions extends CollectorOptions {
    max?: number;
    maxComponents?: number;
    maxUsers?: number;
  }

  type MessageComponentOptions = BaseMessageComponentOptions | MessageActionRowOptions | MessageButtonOptions;

  type MessageComponentType = keyof typeof MessageComponentTypes;

  type MessageComponentTypeResolvable = MessageComponentType | MessageComponentTypes;

  interface MessageEditOptions {
    attachments?: MessageAttachment[];
    content?: string | null;
    embed?: MessageEmbed | MessageEmbedOptions | null;
    code?: string | boolean;
    files?: (FileOptions | BufferResolvable | Stream | MessageAttachment)[];
    flags?: BitFieldResolvable<MessageFlagsString, number>;
    allowedMentions?: MessageMentionOptions;
    components?: MessageActionRow[] | MessageActionRowOptions[];
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

  type MessageFlagsString =
    | 'CROSSPOSTED'
    | 'IS_CROSSPOST'
    | 'SUPPRESS_EMBEDS'
    | 'SOURCE_MESSAGE_DELETED'
    | 'URGENT'
    | 'EPHEMERAL'
    | 'LOADING';

  interface MessageInteraction {
    id: Snowflake;
    type: InteractionType;
    commandName: string;
    user: User;
  }

  interface MessageMentionOptions {
    parse?: MessageMentionTypes[];
    roles?: Snowflake[];
    users?: Snowflake[];
    repliedUser?: boolean;
  }

  type MessageMentionTypes = 'roles' | 'users' | 'everyone';

  interface MessageOptions {
    tts?: boolean;
    nonce?: string | number;
    content?: string;
    embed?: MessageEmbed | MessageEmbedOptions;
    components?: MessageActionRow[] | MessageActionRowOptions[];
    allowedMentions?: MessageMentionOptions;
    files?: (FileOptions | BufferResolvable | Stream | MessageAttachment)[];
    code?: string | boolean;
    split?: boolean | SplitOptions;
    reply?: ReplyOptions;
  }

  type MessageReactionResolvable =
    | MessageReaction
    | Snowflake
    | `${string}:${Snowflake}`
    | `<:${string}:${Snowflake}>`
    | `<a:${string}:${Snowflake}>`;

  interface MessageReference {
    channelID: Snowflake;
    guildID: Snowflake;
    messageID: Snowflake | null;
  }

  type MessageResolvable = Message | Snowflake;

  type MessageTarget =
    | Interaction
    | InteractionWebhook
    | TextChannel
    | NewsChannel
    | DMChannel
    | User
    | GuildMember
    | Webhook
    | WebhookClient;

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
    | 'GUILD_DISCOVERY_REQUALIFIED'
    | 'GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING'
    | 'GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING'
    | 'REPLY'
    | 'APPLICATION_COMMAND';

  type NSFWLevel = keyof typeof NSFWLevels;

  interface OverwriteData {
    allow?: PermissionResolvable;
    deny?: PermissionResolvable;
    id: GuildMemberResolvable | RoleResolvable;
    type?: OverwriteType;
  }

  type OverwriteResolvable = PermissionOverwrites | OverwriteData;

  type OverwriteType = 'member' | 'role';

  interface PermissionFlags extends Record<PermissionString, bigint> {}

  interface PermissionObject extends Record<PermissionString, boolean> {}

  interface PermissionOverwriteOptions extends Partial<Record<PermissionString, boolean | null>> {}

  type PermissionResolvable = BitFieldResolvable<PermissionString, bigint>;

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
    | 'MANAGE_EMOJIS'
    | 'USE_APPLICATION_COMMANDS'
    | 'REQUEST_TO_SPEAK';

  interface RecursiveArray<T> extends ReadonlyArray<T | RecursiveArray<T>> {}

  type RecursiveReadonlyArray<T> = ReadonlyArray<T | RecursiveReadonlyArray<T>>;

  type PremiumTier = 0 | 1 | 2 | 3;

  interface PresenceData {
    status?: PresenceStatusData;
    afk?: boolean;
    activities?: ActivitiesOptions[];
    shardID?: number | number[];
  }

  type PresenceResolvable = Presence | UserResolvable | Snowflake;

  type Partialize<T, O extends string> = {
    readonly client: Client;
    readonly createdAt: Date;
    readonly createdTimestamp: number;
    deleted: boolean;
    id: Snowflake;
    partial: true;
    fetch(): Promise<T>;
  } & {
    [K in keyof Omit<
      T,
      'client' | 'createdAt' | 'createdTimestamp' | 'id' | 'partial' | 'fetch' | 'deleted' | O
    >]: T[K] extends (...args: any) => void ? T[K] : T[K] | null;
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
      | 'bannable'
      | 'displayColor'
      | 'displayHexColor'
      | 'displayName'
      | 'guild'
      | 'kickable'
      | 'permissions'
      | 'roles'
      | 'manageable'
      | 'presence'
      | 'voice'
    > {
    readonly bannable: boolean;
    readonly displayColor: number;
    readonly displayHexColor: string;
    readonly displayName: string;
    guild: Guild;
    readonly manageable: boolean;
    joinedAt: null;
    joinedTimestamp: null;
    readonly kickable: boolean;
    readonly permissions: GuildMember['permissions'];
    readonly presence: GuildMember['presence'];
    readonly roles: GuildMember['roles'];
    readonly voice: GuildMember['voice'];
  }

  interface PartialMessage
    extends Partialize<
      Message,
      | 'attachments'
      | 'channel'
      | 'deletable'
      | 'crosspostable'
      | 'editable'
      | 'mentions'
      | 'pinnable'
      | 'url'
      | 'flags'
      | 'embeds'
    > {
    attachments: Message['attachments'];
    channel: Message['channel'];
    readonly deletable: boolean;
    readonly crosspostable: boolean;
    readonly editable: boolean;
    embeds: Message['embeds'];
    flags: Message['flags'];
    mentions: Message['mentions'];
    readonly pinnable: boolean;
    reactions: Message['reactions'];
    readonly url: string;
  }

  interface PartialRoleData extends RoleData {
    id?: number;
  }

  type PartialTypes = 'USER' | 'CHANNEL' | 'GUILD_MEMBER' | 'MESSAGE' | 'REACTION';

  interface PartialUser extends Omit<Partialize<User, 'bot' | 'flags' | 'system' | 'tag' | 'username'>, 'deleted'> {
    bot: User['bot'];
    flags: User['flags'];
    system: User['system'];
    readonly tag: null;
    username: null;
  }

  type PresenceStatusData = ClientPresenceStatus | 'invisible';

  type PresenceStatus = PresenceStatusData | 'offline';

  interface RateLimitData {
    timeout: number;
    limit: number;
    method: string;
    path: string;
    route: string;
    global: boolean;
  }

  interface InvalidRequestWarningData {
    count: number;
    remainingTime: number;
  }

  interface ReactionCollectorOptions extends CollectorOptions {
    max?: number;
    maxEmojis?: number;
    maxUsers?: number;
  }

  interface ReplyOptions {
    messageReference: MessageResolvable;
    failIfNotExists?: boolean;
  }

  interface ReplyMessageOptions extends Omit<MessageOptions, 'reply'> {
    failIfNotExists?: boolean;
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

  interface RoleTagData {
    botID?: Snowflake;
    integrationID?: Snowflake;
    premiumSubscriberRole?: true;
  }

  type ShardingManagerMode = 'process' | 'worker';

  interface ShardingManagerOptions {
    totalShards?: number | 'auto';
    shardList?: number[] | 'auto';
    mode?: ShardingManagerMode;
    respawn?: boolean;
    shardArgs?: string[];
    token?: string;
    execArgv?: string[];
  }

  type Snowflake = APISnowflake;

  interface SplitOptions {
    maxLength?: number;
    char?: string;
    prepend?: string;
    append?: string;
  }

  type Status = number;

  export class Sticker extends Base {
    constructor(client: Client, data: unknown);
    public asset: string;
    public readonly createdTimestamp: number;
    public readonly createdAt: Date;
    public description: string;
    public format: StickerFormatTypes;
    public id: Snowflake;
    public name: string;
    public packID: Snowflake;
    public tags: string[];
    public readonly url: string;
  }

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

  type SystemChannelFlagsString =
    | 'SUPPRESS_JOIN_NOTIFICATIONS'
    | 'SUPPRESS_PREMIUM_SUBSCRIPTIONS'
    | 'SUPPRESS_GUILD_REMINDER_NOTIFICATIONS';

  type SystemChannelFlagsResolvable = BitFieldResolvable<SystemChannelFlagsString, number>;

  type SystemMessageType = Exclude<MessageType, 'DEFAULT' | 'REPLY' | 'APPLICATION_COMMAND'>;

  interface TypingData {
    user: User | PartialUser;
    since: Date;
    lastTimestamp: Date;
    elapsedTime: number;
    timeout: NodeJS.Timeout;
  }

  type UserFlagsString =
    | 'DISCORD_EMPLOYEE'
    | 'PARTNERED_SERVER_OWNER'
    | 'HYPESQUAD_EVENTS'
    | 'BUGHUNTER_LEVEL_1'
    | 'HOUSE_BRAVERY'
    | 'HOUSE_BRILLIANCE'
    | 'HOUSE_BALANCE'
    | 'EARLY_SUPPORTER'
    | 'TEAM_USER'
    | 'BUGHUNTER_LEVEL_2'
    | 'VERIFIED_BOT'
    | 'EARLY_VERIFIED_BOT_DEVELOPER'
    | 'DISCORD_CERTIFIED_MODERATOR';

  type UserResolvable = User | Snowflake | Message | GuildMember;

  interface Vanity {
    code: string | null;
    uses: number | null;
  }

  type VerificationLevel = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';

  type VoiceStatus = number;

  type WebhookClientOptions = Pick<
    ClientOptions,
    'allowedMentions' | 'restTimeOffset' | 'restRequestTimeout' | 'retryLimit' | 'http'
  >;

  interface WebhookEditData {
    name?: string;
    avatar?: BufferResolvable;
    channel?: ChannelResolvable;
    reason?: string;
  }

  type WebhookEditMessageOptions = Pick<
    WebhookMessageOptions,
    'content' | 'embeds' | 'files' | 'allowedMentions' | 'components'
  >;

  interface WebhookMessageOptions extends Omit<MessageOptions, 'embed' | 'reply'> {
    username?: string;
    avatarURL?: string;
    embeds?: (MessageEmbed | unknown)[];
  }

  type WebhookTypes = 'Incoming' | 'Channel Follower';

  interface WebSocketOptions {
    large_threshold?: number;
    compress?: boolean;
    properties?: WebSocketProperties;
  }

  interface WebSocketProperties {
    $os?: string;
    $browser?: string;
    $device?: string;
  }

  type WSEventType =
    | 'READY'
    | 'RESUMED'
    | 'APPLICATION_COMMAND_CREATE'
    | 'APPLICATION_COMMAND_DELETE'
    | 'APPLICATION_COMMAND_UPDATE'
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
    | 'WEBHOOKS_UPDATE'
    | 'INTERACTION_CREATE';

  //#endregion
}
