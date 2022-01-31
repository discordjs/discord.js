import {
  ActionRow,
  ActionRowComponent,
  blockQuote,
  bold,
  ButtonComponent,
  channelMention,
  codeBlock,
  Component,
  Embed,
  formatEmoji,
  hideLinkEmbed,
  hyperlink,
  inlineCode,
  italic,
  memberNicknameMention,
  quote,
  roleMention,
  SelectMenuComponent,
  spoiler,
  strikethrough,
  time,
  TimestampStyles,
  TimestampStylesString,
  underscore,
  userMention,
} from '@discordjs/builders';
import { Collection } from '@discordjs/collection';
import { BaseImageURLOptions, ImageURLOptions, RawFile, REST, RESTOptions } from '@discordjs/rest';
import {
  APIActionRowComponent,
  APIApplicationCommand,
  APIApplicationCommandInteractionData,
  APIApplicationCommandOption,
  APIAuditLogChange,
  APIButtonComponent,
  APIEmbed,
  APIEmoji,
  APIInteractionDataResolvedChannel,
  APIInteractionDataResolvedGuildMember,
  APIInteractionGuildMember,
  APIMessage,
  APIMessageComponent,
  APIOverwrite,
  APIPartialChannel,
  APIPartialEmoji,
  APIPartialGuild,
  APIRole,
  APISelectMenuComponent,
  APITemplateSerializedSourceGuild,
  APIUser,
  ButtonStyle,
  ChannelType,
  ComponentType,
  GatewayVoiceServerUpdateDispatchData,
  GatewayVoiceStateUpdateDispatchData,
  GuildMFALevel,
  GuildNSFWLevel,
  GuildPremiumTier,
  GuildVerificationLevel,
  InteractionType,
  InviteTargetType,
  MessageType,
  RESTPostAPIApplicationCommandsJSONBody,
  Snowflake,
  StageInstancePrivacyLevel,
  StickerFormatType,
  StickerType,
  TeamMemberMembershipState,
  WebhookType,
  OverwriteType,
  GuildExplicitContentFilter,
  GuildDefaultMessageNotifications,
  ApplicationCommandPermissionType,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ActivityType,
  GuildScheduledEventEntityType,
  GuildScheduledEventPrivacyLevel,
  GuildScheduledEventStatus,
  IntegrationExpireBehavior,
  ApplicationFlags,
  PermissionFlagsBits,
  ThreadMemberFlags,
  UserFlags,
  MessageFlags,
  GuildSystemChannelFlags,
  GatewayIntentBits,
  ActivityFlags,
} from 'discord-api-types/v9';
import { ChildProcess } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { Stream } from 'node:stream';
import { MessagePort, Worker } from 'node:worker_threads';
import * as WebSocket from 'ws';
import {
  RawActivityData,
  RawAnonymousGuildData,
  RawApplicationCommandData,
  RawApplicationData,
  RawBaseGuildData,
  RawChannelData,
  RawClientApplicationData,
  RawDMChannelData,
  RawEmojiData,
  RawGuildAuditLogData,
  RawGuildAuditLogEntryData,
  RawGuildBanData,
  RawGuildChannelData,
  RawGuildData,
  RawGuildEmojiData,
  RawGuildMemberData,
  RawGuildPreviewData,
  RawGuildScheduledEventData,
  RawGuildTemplateData,
  RawIntegrationApplicationData,
  RawIntegrationData,
  RawInteractionData,
  RawInviteData,
  RawInviteGuildData,
  RawInviteStageInstance,
  RawMessageAttachmentData,
  RawMessageButtonInteractionData,
  RawMessageComponentInteractionData,
  RawMessageData,
  RawMessagePayloadData,
  RawMessageReactionData,
  RawMessageSelectMenuInteractionData,
  RawOAuth2GuildData,
  RawPartialGroupDMChannelData,
  RawPartialMessageData,
  RawPermissionOverwriteData,
  RawPresenceData,
  RawReactionEmojiData,
  RawRichPresenceAssets,
  RawRoleData,
  RawStageInstanceData,
  RawStickerData,
  RawStickerPackData,
  RawTeamData,
  RawTeamMemberData,
  RawThreadChannelData,
  RawThreadMemberData,
  RawTypingData,
  RawUserData,
  RawVoiceRegionData,
  RawVoiceStateData,
  RawWebhookData,
  RawWelcomeChannelData,
  RawWelcomeScreenData,
  RawWidgetData,
  RawWidgetMemberData,
} from './rawDataTypes';

//#region Classes

export class Activity {
  private constructor(presence: Presence, data?: RawActivityData);
  public applicationId: Snowflake | null;
  public assets: RichPresenceAssets | null;
  public buttons: string[];
  public readonly createdAt: Date;
  public createdTimestamp: number;
  public details: string | null;
  public emoji: Emoji | null;
  public flags: Readonly<ActivityFlagsBitField>;
  public id: string;
  public name: string;
  public party: {
    id: string | null;
    size: [number, number];
  } | null;
  public platform: ActivityPlatform | null;
  public sessionId: string | null;
  public state: string | null;
  public syncId: string | null;
  public timestamps: {
    start: Date | null;
    end: Date | null;
  } | null;
  public type: ActivityType;
  public url: string | null;
  public equals(activity: Activity): boolean;
}

export type ActivityFlagsString = keyof typeof ActivityFlags;

export class ActivityFlagsBitField extends BitField<ActivityFlagsString> {
  public static Flags: typeof ActivityFlags;
  public static resolve(bit?: BitFieldResolvable<ActivityFlagsString, number>): number;
}

export abstract class AnonymousGuild extends BaseGuild {
  protected constructor(client: Client, data: RawAnonymousGuildData, immediatePatch?: boolean);
  public banner: string | null;
  public description: string | null;
  public nsfwLevel: GuildNSFWLevel;
  public splash: string | null;
  public vanityURLCode: string | null;
  public verificationLevel: GuildVerificationLevel;
  public bannerURL(options?: ImageURLOptions): string | null;
  public splashURL(options?: ImageURLOptions): string | null;
}

export abstract class Application extends Base {
  protected constructor(client: Client, data: RawApplicationData);
  public readonly createdAt: Date;
  public readonly createdTimestamp: number;
  public description: string | null;
  public icon: string | null;
  public id: Snowflake;
  public name: string | null;
  public coverURL(options?: ImageURLOptions): string | null;
  public iconURL(options?: ImageURLOptions): string | null;
  public toJSON(): unknown;
  public toString(): string | null;
}

export class ApplicationCommand<PermissionsFetchType = {}> extends Base {
  private constructor(client: Client, data: RawApplicationCommandData, guild?: Guild, guildId?: Snowflake);
  public applicationId: Snowflake;
  public readonly createdAt: Date;
  public readonly createdTimestamp: number;
  public defaultPermission: boolean;
  public description: string;
  public guild: Guild | null;
  public guildId: Snowflake | null;
  public readonly manager: ApplicationCommandManager;
  public id: Snowflake;
  public name: string;
  public options: ApplicationCommandOption[];
  public permissions: ApplicationCommandPermissionsManager<
    PermissionsFetchType,
    PermissionsFetchType,
    PermissionsFetchType,
    Guild | null,
    Snowflake
  >;
  public type: ApplicationCommandType;
  public version: Snowflake;
  public delete(): Promise<ApplicationCommand<PermissionsFetchType>>;
  public edit(data: ApplicationCommandData): Promise<ApplicationCommand<PermissionsFetchType>>;
  public setName(name: string): Promise<ApplicationCommand<PermissionsFetchType>>;
  public setDescription(description: string): Promise<ApplicationCommand<PermissionsFetchType>>;
  public setDefaultPermission(defaultPermission?: boolean): Promise<ApplicationCommand<PermissionsFetchType>>;
  public setOptions(options: ApplicationCommandOptionData[]): Promise<ApplicationCommand<PermissionsFetchType>>;
  public equals(
    command: ApplicationCommand | ApplicationCommandData | RawApplicationCommandData,
    enforceOptionorder?: boolean,
  ): boolean;
  public static optionsEqual(
    existing: ApplicationCommandOption[],
    options: ApplicationCommandOption[] | ApplicationCommandOptionData[] | APIApplicationCommandOption[],
    enforceOptionorder?: boolean,
  ): boolean;
  private static _optionEquals(
    existing: ApplicationCommandOption,
    options: ApplicationCommandOption | ApplicationCommandOptionData | APIApplicationCommandOption,
    enforceOptionorder?: boolean,
  ): boolean;
  private static transformOption(option: ApplicationCommandOptionData, received?: boolean): unknown;
  private static transformCommand(command: ApplicationCommandData): RESTPostAPIApplicationCommandsJSONBody;
  private static isAPICommandData(command: object): command is RESTPostAPIApplicationCommandsJSONBody;
}

export type ApplicationResolvable = Application | Activity | Snowflake;

export class ApplicationFlagsBitField extends BitField<ApplicationFlagsString> {
  public static Flags: typeof ApplicationFlags;
  public static resolve(bit?: BitFieldResolvable<ApplicationFlagsString, number>): number;
}

export abstract class Base {
  public constructor(client: Client);
  public readonly client: Client;
  public toJSON(...props: Record<string, boolean | string>[]): unknown;
  public valueOf(): string;
}

export class BaseClient extends EventEmitter {
  public constructor(options?: ClientOptions | WebhookClientOptions);
  private decrementMaxListeners(): void;
  private incrementMaxListeners(): void;

  public options: ClientOptions | WebhookClientOptions;
  public rest: REST;
  public destroy(): void;
  public toJSON(...props: Record<string, boolean | string>[]): unknown;
}

export type GuildCacheMessage<Cached extends CacheType> = CacheTypeReducer<
  Cached,
  Message<true>,
  APIMessage,
  Message | APIMessage,
  Message | APIMessage
>;

export interface InteractionResponseFields<Cached extends CacheType = CacheType> {
  reply(options: InteractionReplyOptions & { fetchReply: true }): Promise<GuildCacheMessage<Cached>>;
  reply(options: string | MessagePayload | InteractionReplyOptions): Promise<void>;
  deleteReply(): Promise<void>;
  editReply(options: string | MessagePayload | WebhookEditMessageOptions): Promise<GuildCacheMessage<Cached>>;
  deferReply(options: InteractionDeferReplyOptions & { fetchReply: true }): Promise<GuildCacheMessage<Cached>>;
  deferReply(options?: InteractionDeferReplyOptions): Promise<void>;
  fetchReply(): Promise<GuildCacheMessage<Cached>>;
  followUp(options: string | MessagePayload | InteractionReplyOptions): Promise<GuildCacheMessage<Cached>>;
}

export abstract class CommandInteraction<Cached extends CacheType = CacheType> extends Interaction<Cached> {
  public readonly command: ApplicationCommand | ApplicationCommand<{ guild: GuildResolvable }> | null;
  public options: Omit<
    CommandInteractionOptionResolver<Cached>,
    | 'getMessage'
    | 'getFocused'
    | 'getMentionable'
    | 'getRole'
    | 'getNumber'
    | 'getInteger'
    | 'getString'
    | 'getChannel'
    | 'getBoolean'
    | 'getSubcommandGroup'
    | 'getSubcommand'
  >;
  public channelId: Snowflake;
  public commandId: Snowflake;
  public commandName: string;
  public commandType: ApplicationCommandType;
  public deferred: boolean;
  public ephemeral: boolean | null;
  public replied: boolean;
  public webhook: InteractionWebhook;
  public inGuild(): this is CommandInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is CommandInteraction<'cached'>;
  public inRawGuild(): this is CommandInteraction<'raw'>;
  public deferReply(options: InteractionDeferReplyOptions & { fetchReply: true }): Promise<GuildCacheMessage<Cached>>;
  public deferReply(options?: InteractionDeferReplyOptions): Promise<void>;
  public deleteReply(): Promise<void>;
  public editReply(options: string | MessagePayload | WebhookEditMessageOptions): Promise<GuildCacheMessage<Cached>>;
  public fetchReply(): Promise<GuildCacheMessage<Cached>>;
  public followUp(options: string | MessagePayload | InteractionReplyOptions): Promise<GuildCacheMessage<Cached>>;
  public reply(options: InteractionReplyOptions & { fetchReply: true }): Promise<GuildCacheMessage<Cached>>;
  public reply(options: string | MessagePayload | InteractionReplyOptions): Promise<void>;
  private transformOption(
    option: APIApplicationCommandOption,
    resolved: APIApplicationCommandInteractionData['resolved'],
  ): CommandInteractionOption<Cached>;
  private transformResolved(
    resolved: APIApplicationCommandInteractionData['resolved'],
  ): CommandInteractionResolvedData<Cached>;
}

export abstract class BaseGuild extends Base {
  protected constructor(client: Client, data: RawBaseGuildData);
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
  public iconURL(options?: ImageURLOptions): string | null;
  public toString(): string;
}

export class BaseGuildEmoji extends Emoji {
  protected constructor(client: Client, data: RawGuildEmojiData, guild: Guild | GuildPreview);
  public available: boolean | null;
  public readonly createdAt: Date;
  public readonly createdTimestamp: number;
  public guild: Guild | GuildPreview;
  public id: Snowflake;
  public managed: boolean | null;
  public requiresColons: boolean | null;
}

export class BaseGuildTextChannel extends TextBasedChannelMixin(GuildChannel) {
  protected constructor(guild: Guild, data?: RawGuildChannelData, client?: Client, immediatePatch?: boolean);
  public defaultAutoArchiveDuration?: ThreadAutoArchiveDuration;
  public messages: MessageManager;
  public nsfw: boolean;
  public threads: ThreadManager<AllowedThreadTypeForTextChannel | AllowedThreadTypeForNewsChannel>;
  public topic: string | null;
  public createInvite(options?: CreateInviteOptions): Promise<Invite>;
  public createWebhook(name: string, options?: ChannelWebhookCreateOptions): Promise<Webhook>;
  public fetchInvites(cache?: boolean): Promise<Collection<string, Invite>>;
  public setDefaultAutoArchiveDuration(
    defaultAutoArchiveDuration: ThreadAutoArchiveDuration,
    reason?: string,
  ): Promise<this>;
  public setNSFW(nsfw?: boolean, reason?: string): Promise<this>;
  public setTopic(topic: string | null, reason?: string): Promise<this>;
  public setType(type: Pick<typeof ChannelType, 'GuildText'>, reason?: string): Promise<TextChannel>;
  public setType(type: Pick<typeof ChannelType, 'GuildNews'>, reason?: string): Promise<NewsChannel>;
  public fetchWebhooks(): Promise<Collection<Snowflake, Webhook>>;
}

export class BaseGuildVoiceChannel extends GuildChannel {
  protected constructor(guild: Guild, data?: RawGuildChannelData);
  public readonly members: Collection<Snowflake, GuildMember>;
  public readonly full: boolean;
  public readonly joinable: boolean;
  public rtcRegion: string | null;
  public bitrate: number;
  public userLimit: number;
  public createInvite(options?: CreateInviteOptions): Promise<Invite>;
  public setRTCRegion(region: string | null): Promise<this>;
  public fetchInvites(cache?: boolean): Promise<Collection<string, Invite>>;
}

export type EnumLike<E, V> = Record<keyof E, V>;

export class BitField<S extends string, N extends number | bigint = number> {
  public constructor(bits?: BitFieldResolvable<S, N>);
  public bitfield: N;
  public add(...bits: BitFieldResolvable<S, N>[]): BitField<S, N>;
  public any(bit: BitFieldResolvable<S, N>): boolean;
  public equals(bit: BitFieldResolvable<S, N>): boolean;
  public freeze(): Readonly<BitField<S, N>>;
  public has(bit: BitFieldResolvable<S, N>): boolean;
  public missing(bits: BitFieldResolvable<S, N>, ...hasParams: readonly unknown[]): S[];
  public remove(...bits: BitFieldResolvable<S, N>[]): BitField<S, N>;
  public serialize(...hasParams: readonly unknown[]): Record<S, boolean>;
  public toArray(...hasParams: readonly unknown[]): S[];
  public toJSON(): N extends number ? number : string;
  public valueOf(): N;
  public [Symbol.iterator](): IterableIterator<S>;
  public static Flags: EnumLike<unknown, number | bigint>;
  public static resolve(bit?: BitFieldResolvable<string, number | bigint>): number | bigint;
}

export class ButtonInteraction<Cached extends CacheType = CacheType> extends MessageComponentInteraction<Cached> {
  private constructor(client: Client, data: RawMessageButtonInteractionData);
  public readonly component: CacheTypeReducer<
    Cached,
    ButtonComponent,
    APIButtonComponent,
    ButtonComponent | APIButtonComponent,
    ButtonComponent | APIButtonComponent
  >;
  public componentType: ComponentType.Button;
  public inGuild(): this is ButtonInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is ButtonInteraction<'cached'>;
  public inRawGuild(): this is ButtonInteraction<'raw'>;
}

export interface MappedChannelCategoryTypes {
  [ChannelType.GuildNews]: NewsChannel;
  [ChannelType.GuildVoice]: VoiceChannel;
  [ChannelType.GuildText]: TextChannel;
  [ChannelType.GuildStore]: StoreChannel;
  [ChannelType.GuildStageVoice]: StageChannel;
}

export type CategoryChannelType = Exclude<
  ChannelType,
  | ChannelType.DM
  | ChannelType.GroupDM
  | ChannelType.GuildPublicThread
  | ChannelType.GuildNewsThread
  | ChannelType.GuildPrivateThread
  | ChannelType.GuildCategory
>;

export class CategoryChannel extends GuildChannel {
  public readonly children: Collection<Snowflake, Exclude<NonThreadGuildBasedChannel, CategoryChannel>>;
  public type: ChannelType.GuildCategory;

  public createChannel<T extends Exclude<CategoryChannelType, ChannelType.GuildStore>>(
    name: string,
    options: CategoryCreateChannelOptions & { type: T },
  ): Promise<MappedChannelCategoryTypes[T]>;
  /** @deprecated See [Self-serve Game Selling Deprecation](https://support-dev.discord.com/hc/en-us/articles/4414590563479) for more information */
  public createChannel(
    name: string,
    options: CategoryCreateChannelOptions & { type: ChannelType.GuildStore },
  ): Promise<StoreChannel>;
  public createChannel(name: string, options?: CategoryCreateChannelOptions): Promise<TextChannel>;
}

export type CategoryChannelResolvable = Snowflake | CategoryChannel;

export abstract class Channel extends Base {
  public constructor(client: Client, data?: RawChannelData, immediatePatch?: boolean);
  public readonly createdAt: Date | null;
  public readonly createdTimestamp: number | null;
  public id: Snowflake;
  public readonly partial: false;
  public type: ChannelType;
  public delete(): Promise<this>;
  public fetch(force?: boolean): Promise<this>;
  public isText(): this is TextChannel;
  public isDM(): this is DMChannel;
  public isVoice(): this is VoiceChannel;
  public isGroupDM(): this is PartialGroupDMChannel;
  public isCategory(): this is CategoryChannel;
  public isNews(): this is NewsChannel;
  public isStore(): this is StoreChannel;
  public isThread(): this is ThreadChannel;
  public isStage(): this is StageChannel;
  public isTextBased(): this is TextBasedChannel;
  public isDMBased(): this is PartialGroupDMChannel | DMChannel;
  public isVoiceBased(): this is VoiceBasedChannel;
  public toString(): ChannelMention;
}

export type If<T extends boolean, A, B = null> = T extends true ? A : T extends false ? B : A | B;

export class Client<Ready extends boolean = boolean> extends BaseClient {
  public constructor(options: ClientOptions);
  private actions: unknown;
  private presence: ClientPresence;
  private _eval(script: string): unknown;
  private _validateOptions(options: ClientOptions): void;

  public application: If<Ready, ClientApplication>;
  public channels: ChannelManager;
  public readonly emojis: BaseGuildEmojiManager;
  public guilds: GuildManager;
  public options: ClientOptions;
  public readonly readyAt: If<Ready, Date>;
  public readyTimestamp: If<Ready, number>;
  public sweepers: Sweepers;
  public shard: ShardClientUtil | null;
  public token: If<Ready, string, string | null>;
  public uptime: If<Ready, number>;
  public user: If<Ready, ClientUser>;
  public users: UserManager;
  public voice: ClientVoiceManager;
  public ws: WebSocketManager;
  public destroy(): void;
  public fetchGuildPreview(guild: GuildResolvable): Promise<GuildPreview>;
  public fetchInvite(invite: InviteResolvable, options?: ClientFetchInviteOptions): Promise<Invite>;
  public fetchGuildTemplate(template: GuildTemplateResolvable): Promise<GuildTemplate>;
  public fetchVoiceRegions(): Promise<Collection<string, VoiceRegion>>;
  public fetchSticker(id: Snowflake): Promise<Sticker>;
  public fetchPremiumStickerPacks(): Promise<Collection<Snowflake, StickerPack>>;
  public fetchWebhook(id: Snowflake, token?: string): Promise<Webhook>;
  public fetchGuildWidget(guild: GuildResolvable): Promise<Widget>;
  public generateInvite(options?: InviteGenerationOptions): string;
  public login(token?: string): Promise<string>;
  public isReady(): this is Client<true>;
  public toJSON(): unknown;

  public on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaitable<void>): this;
  public on<S extends string | symbol>(
    event: Exclude<S, keyof ClientEvents>,
    listener: (...args: any[]) => Awaitable<void>,
  ): this;

  public once<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaitable<void>): this;
  public once<S extends string | symbol>(
    event: Exclude<S, keyof ClientEvents>,
    listener: (...args: any[]) => Awaitable<void>,
  ): this;

  public emit<K extends keyof ClientEvents>(event: K, ...args: ClientEvents[K]): boolean;
  public emit<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, ...args: unknown[]): boolean;

  public off<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaitable<void>): this;
  public off<S extends string | symbol>(
    event: Exclude<S, keyof ClientEvents>,
    listener: (...args: any[]) => Awaitable<void>,
  ): this;

  public removeAllListeners<K extends keyof ClientEvents>(event?: K): this;
  public removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof ClientEvents>): this;
}

export class ClientApplication extends Application {
  private constructor(client: Client, data: RawClientApplicationData);
  public botPublic: boolean | null;
  public botRequireCodeGrant: boolean | null;
  public commands: ApplicationCommandManager;
  public cover: string | null;
  public flags: Readonly<ApplicationFlagsBitField>;
  public owner: User | Team | null;
  public readonly partial: boolean;
  public rpcOrigins: string[];
  public fetch(): Promise<ClientApplication>;
}

export class ClientPresence extends Presence {
  private constructor(client: Client, data: RawPresenceData);
  private _parse(data: PresenceData): RawPresenceData;

  public set(presence: PresenceData): ClientPresence;
}

export class ClientUser extends User {
  public mfaEnabled: boolean;
  public readonly presence: ClientPresence;
  public verified: boolean;
  public edit(data: ClientUserEditData): Promise<this>;
  public setActivity(options?: ActivityOptions): ClientPresence;
  public setActivity(name: string, options?: ActivityOptions): ClientPresence;
  public setAFK(afk?: boolean, shardId?: number | number[]): ClientPresence;
  public setAvatar(avatar: BufferResolvable | Base64Resolvable | null): Promise<this>;
  public setPresence(data: PresenceData): ClientPresence;
  public setStatus(status: PresenceStatusData, shardId?: number | number[]): ClientPresence;
  public setUsername(username: string): Promise<this>;
}

export class Options extends null {
  private constructor();
  public static defaultMakeCacheSettings: CacheWithLimitsOptions;
  public static defaultSweeperSettings: SweeperOptions;
  public static createDefault(): ClientOptions;
  public static cacheWithLimits(settings?: CacheWithLimitsOptions): CacheFactory;
  public static cacheEverything(): CacheFactory;
}

export class ClientVoiceManager {
  private constructor(client: Client);
  public readonly client: Client;
  public adapters: Map<Snowflake, InternalDiscordGatewayAdapterLibraryMethods>;
}

export { Collection } from '@discordjs/collection';

export interface CollectorEventTypes<K, V, F extends unknown[] = []> {
  collect: [V, ...F];
  dispose: [V, ...F];
  end: [collected: Collection<K, V>, reason: string];
}

export abstract class Collector<K, V, F extends unknown[] = []> extends EventEmitter {
  protected constructor(client: Client, options?: CollectorOptions<[V, ...F]>);
  private _timeout: NodeJS.Timeout | null;
  private _idletimeout: NodeJS.Timeout | null;

  public readonly client: Client;
  public collected: Collection<K, V>;
  public ended: boolean;
  public abstract readonly endReason: string | null;
  public filter: CollectorFilter<[V, ...F]>;
  public readonly next: Promise<V>;
  public options: CollectorOptions<[V, ...F]>;
  public checkEnd(): boolean;
  public handleCollect(...args: unknown[]): Promise<void>;
  public handleDispose(...args: unknown[]): Promise<void>;
  public stop(reason?: string): void;
  public resetTimer(options?: CollectorResetTimerOptions): void;
  public [Symbol.asyncIterator](): AsyncIterableIterator<[V, ...F]>;
  public toJSON(): unknown;

  protected listener: (...args: any[]) => void;
  public abstract collect(...args: unknown[]): K | null | Promise<K | null>;
  public abstract dispose(...args: unknown[]): K | null;

  public on<EventKey extends keyof CollectorEventTypes<K, V, F>>(
    event: EventKey,
    listener: (...args: CollectorEventTypes<K, V, F>[EventKey]) => Awaitable<void>,
  ): this;

  public once<EventKey extends keyof CollectorEventTypes<K, V, F>>(
    event: EventKey,
    listener: (...args: CollectorEventTypes<K, V, F>[EventKey]) => Awaitable<void>,
  ): this;
}

export interface ApplicationCommandInteractionOptionResolver<Cached extends CacheType = CacheType>
  extends CommandInteractionOptionResolver<Cached> {
  getSubcommand(required?: true): string;
  getSubcommand(required: boolean): string | null;
  getSubcommandGroup(required: true): string;
  getSubcommandGroup(required?: boolean): string | null;
  getBoolean(name: string, required: true): boolean;
  getBoolean(name: string, required?: boolean): boolean | null;
  getChannel(name: string, required: true): NonNullable<CommandInteractionOption<Cached>['channel']>;
  getChannel(name: string, required?: boolean): NonNullable<CommandInteractionOption<Cached>['channel']> | null;
  getString(name: string, required: true): string;
  getString(name: string, required?: boolean): string | null;
  getInteger(name: string, required: true): number;
  getInteger(name: string, required?: boolean): number | null;
  getNumber(name: string, required: true): number;
  getNumber(name: string, required?: boolean): number | null;
  getUser(name: string, required: true): NonNullable<CommandInteractionOption<Cached>['user']>;
  getUser(name: string, required?: boolean): NonNullable<CommandInteractionOption<Cached>['user']> | null;
  getMember(name: string): NonNullable<CommandInteractionOption<Cached>['member']> | null;
  getRole(name: string, required: true): NonNullable<CommandInteractionOption<Cached>['role']>;
  getRole(name: string, required?: boolean): NonNullable<CommandInteractionOption<Cached>['role']> | null;
  getMentionable(
    name: string,
    required: true,
  ): NonNullable<CommandInteractionOption<Cached>['member' | 'role' | 'user']>;
  getMentionable(
    name: string,
    required?: boolean,
  ): NonNullable<CommandInteractionOption<Cached>['member' | 'role' | 'user']> | null;
}

export class ChatInputCommandInteraction<Cached extends CacheType = CacheType> extends CommandInteraction<Cached> {
  public options: Omit<CommandInteractionOptionResolver<Cached>, 'getMessage' | 'getFocused'>;
  public inGuild(): this is ChatInputCommandInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is ChatInputCommandInteraction<'cached'>;
  public inRawGuild(): this is ChatInputCommandInteraction<'raw'>;
  public toString(): string;
}

export class AutocompleteInteraction<Cached extends CacheType = CacheType> extends Interaction<Cached> {
  public readonly command: ApplicationCommand | ApplicationCommand<{ guild: GuildResolvable }> | null;
  public channelId: Snowflake;
  public commandId: Snowflake;
  public commandName: string;
  public commandType: ApplicationCommandType.ChatInput;
  public responded: boolean;
  public options: Omit<CommandInteractionOptionResolver<Cached>, 'getMessage'>;
  public inGuild(): this is AutocompleteInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is AutocompleteInteraction<'cached'>;
  public inRawGuild(): this is AutocompleteInteraction<'raw'>;
  public respond(options: ApplicationCommandOptionChoice[]): Promise<void>;
}

export class CommandInteractionOptionResolver<Cached extends CacheType = CacheType> {
  private constructor(client: Client, options: CommandInteractionOption[], resolved: CommandInteractionResolvedData);
  public readonly client: Client;
  public readonly data: readonly CommandInteractionOption<Cached>[];
  public readonly resolved: Readonly<CommandInteractionResolvedData<Cached>>;
  private _group: string | null;
  private _hoistedOptions: CommandInteractionOption<Cached>[];
  private _subcommand: string | null;
  private _getTypedOption(
    name: string,
    type: ApplicationCommandOptionType,
    properties: (keyof ApplicationCommandOption)[],
    required: true,
  ): CommandInteractionOption<Cached>;
  private _getTypedOption(
    name: string,
    type: ApplicationCommandOptionType,
    properties: (keyof ApplicationCommandOption)[],
    required: boolean,
  ): CommandInteractionOption<Cached> | null;

  public get(name: string, required: true): CommandInteractionOption<Cached>;
  public get(name: string, required?: boolean): CommandInteractionOption<Cached> | null;

  public getSubcommand(required?: true): string;
  public getSubcommand(required: boolean): string | null;
  public getSubcommandGroup(required: true): string;
  public getSubcommandGroup(required?: boolean): string | null;
  public getBoolean(name: string, required: true): boolean;
  public getBoolean(name: string, required?: boolean): boolean | null;
  public getChannel(name: string, required: true): NonNullable<CommandInteractionOption<Cached>['channel']>;
  public getChannel(name: string, required?: boolean): NonNullable<CommandInteractionOption<Cached>['channel']> | null;
  public getString(name: string, required: true): string;
  public getString(name: string, required?: boolean): string | null;
  public getInteger(name: string, required: true): number;
  public getInteger(name: string, required?: boolean): number | null;
  public getNumber(name: string, required: true): number;
  public getNumber(name: string, required?: boolean): number | null;
  public getUser(name: string, required: true): NonNullable<CommandInteractionOption<Cached>['user']>;
  public getUser(name: string, required?: boolean): NonNullable<CommandInteractionOption<Cached>['user']> | null;
  public getMember(name: string): NonNullable<CommandInteractionOption<Cached>['member']> | null;
  public getRole(name: string, required: true): NonNullable<CommandInteractionOption<Cached>['role']>;
  public getRole(name: string, required?: boolean): NonNullable<CommandInteractionOption<Cached>['role']> | null;
  public getMentionable(
    name: string,
    required: true,
  ): NonNullable<CommandInteractionOption<Cached>['member' | 'role' | 'user']>;
  public getMentionable(
    name: string,
    required?: boolean,
  ): NonNullable<CommandInteractionOption<Cached>['member' | 'role' | 'user']> | null;
  public getMessage(name: string, required: true): NonNullable<CommandInteractionOption<Cached>['message']>;
  public getMessage(name: string, required?: boolean): NonNullable<CommandInteractionOption<Cached>['message']> | null;
  public getFocused(getFull: true): ApplicationCommandOptionChoice;
  public getFocused(getFull?: boolean): string | number;
}

export class ContextMenuCommandInteraction<Cached extends CacheType = CacheType> extends CommandInteraction<Cached> {
  public options: Omit<
    CommandInteractionOptionResolver<Cached>,
    | 'getFocused'
    | 'getMentionable'
    | 'getRole'
    | 'getNumber'
    | 'getInteger'
    | 'getString'
    | 'getChannel'
    | 'getBoolean'
    | 'getSubcommandGroup'
    | 'getSubcommand'
  >;
  public targetId: Snowflake;
  public inGuild(): this is ContextMenuCommandInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is ContextMenuCommandInteraction<'cached'>;
  public inRawGuild(): this is ContextMenuCommandInteraction<'raw'>;
  private resolveContextMenuOptions(data: APIApplicationCommandInteractionData): CommandInteractionOption<Cached>[];
}

export class DataResolver extends null {
  private constructor();
  public static resolveBase64(data: Base64Resolvable): string;
  public static resolveCode(data: string, regx: RegExp): string;
  public static resolveFile(resource: BufferResolvable | Stream): Promise<Buffer>;
  public static resolveImage(resource: BufferResolvable | Base64Resolvable): Promise<string | null>;
  public static resolveInviteCode(data: InviteResolvable): string;
  public static resolveGuildTemplateCode(data: GuildTemplateResolvable): string;
}

export class EnumResolvers extends null {
  private constructor();
  public static resolveChannelType(key: ChannelTypeEnumResolvable | ChannelType): ChannelType;
  public static resolveInteractionType(key: InteractionTypeEnumResolvable | InteractionType): InteractionType;
  public static resolveApplicationCommandType(
    key: ApplicationCommandTypeEnumResolvable | ApplicationCommandType,
  ): ApplicationCommandType;
  public static resolveApplicationCommandOptionType(
    key: ApplicationCommandOptionTypeEnumResolvable | ApplicationCommandOptionType,
  ): ApplicationCommandOptionType;
  public static resolveApplicationCommandPermissionType(
    key: ApplicationCommandPermissionTypeEnumResolvable | ApplicationCommandPermissionType,
  ): ApplicationCommandPermissionType;
  public static resolveComponentType(key: ComponentTypeEnumResolvable | ComponentType): ComponentType;
  public static resolveButtonStyle(key: ButtonStyleEnumResolvable | ButtonStyle): ButtonStyle;
  public static resolveMessageType(key: MessageTypeEnumResolvable | MessageType): MessageType;
  public static resolveGuildNSFWLevel(key: GuildNSFWLevelEnumResolvable | GuildNSFWLevel): GuildNSFWLevel;
  public static resolveGuildVerificationLevel(
    key: GuildVerificationLevelEnumResolvable | GuildVerificationLevel,
  ): GuildVerificationLevel;
  public static resolveGuildDefaultMessageNotifications(
    key: GuildDefaultMessageNotificationsEnumResolvable | GuildDefaultMessageNotifications,
  ): GuildDefaultMessageNotifications;
  public static resolveGuildExplicitContentFilter(
    key: GuildExplicitContentFilterEnumResolvable | GuildExplicitContentFilter,
  ): GuildExplicitContentFilter;
  public static resolveGuildPremiumTier(key: GuildPremiumTierEnumResolvable | GuildPremiumTier): GuildPremiumTier;
  public static resolveGuildScheduledEventStatus(
    key: GuildScheduledEventStatusEnumResolvable | GuildScheduledEventStatus,
  ): GuildScheduledEventStatus;
  public static resolveStageInstancePrivacyLevel(
    key: StageInstancePrivacyLevelEnumResolvable | StageInstancePrivacyLevel,
  ): StageInstancePrivacyLevel;
  public static resolveGuildMFALevel(key: GuildMFALevelEnumResolvable | GuildMFALevel): GuildMFALevel;
  public static resolveTeamMemberMembershipState(
    key: TeamMemberMembershipStateEnumResolvable | TeamMemberMembershipState,
  ): TeamMemberMembershipState;
  public static resolveGuildScheduledEventEntityType(
    key: GuildScheduledEventEntityTypeEnumResolvable | GuildScheduledEventEntityType,
  ): GuildScheduledEventEntityType;
  public static resolveIntegrationExpireBehavior(
    key: IntegrationExpireBehaviorEnumResolvable | IntegrationExpireBehavior,
  ): IntegrationExpireBehavior;
}

export class DMChannel extends TextBasedChannelMixin(Channel, ['bulkDelete']) {
  private constructor(client: Client, data?: RawDMChannelData);
  public messages: MessageManager;
  public recipient: User;
  public type: ChannelType.DM;
  public fetch(force?: boolean): Promise<this>;
}

export class Emoji extends Base {
  protected constructor(client: Client, emoji: RawEmojiData);
  public animated: boolean | null;
  public readonly createdAt: Date | null;
  public readonly createdTimestamp: number | null;
  public id: Snowflake | null;
  public name: string | null;
  public readonly identifier: string;
  public readonly url: string | null;
  public toJSON(): unknown;
  public toString(): string;
}

export class Guild extends AnonymousGuild {
  private constructor(client: Client, data: RawGuildData);
  private _sortedRoles(): Collection<Snowflake, Role>;
  private _sortedChannels(channel: NonThreadGuildBasedChannel): Collection<Snowflake, NonThreadGuildBasedChannel>;

  public readonly afkChannel: VoiceChannel | null;
  public afkChannelId: Snowflake | null;
  public afkTimeout: number;
  public applicationId: Snowflake | null;
  public approximateMemberCount: number | null;
  public approximatePresenceCount: number | null;
  public available: boolean;
  public bans: GuildBanManager;
  public channels: GuildChannelManager;
  public commands: GuildApplicationCommandManager;
  public defaultMessageNotifications: GuildDefaultMessageNotifications;
  public discoverySplash: string | null;
  public emojis: GuildEmojiManager;
  public explicitContentFilter: GuildExplicitContentFilter;
  public invites: GuildInviteManager;
  public readonly joinedAt: Date;
  public joinedTimestamp: number;
  public large: boolean;
  public maximumMembers: number | null;
  public maximumPresences: number | null;
  public readonly me: GuildMember | null;
  public memberCount: number;
  public members: GuildMemberManager;
  public mfaLevel: GuildMFALevel;
  public ownerId: Snowflake;
  public preferredLocale: string;
  public premiumSubscriptionCount: number | null;
  public premiumProgressBarEnabled: boolean;
  public premiumTier: GuildPremiumTier;
  public presences: PresenceManager;
  public readonly publicUpdatesChannel: TextChannel | null;
  public publicUpdatesChannelId: Snowflake | null;
  public roles: RoleManager;
  public readonly rulesChannel: TextChannel | null;
  public rulesChannelId: Snowflake | null;
  public scheduledEvents: GuildScheduledEventManager;
  public readonly shard: WebSocketShard;
  public shardId: number;
  public stageInstances: StageInstanceManager;
  public stickers: GuildStickerManager;
  public readonly systemChannel: TextChannel | null;
  public systemChannelFlags: Readonly<SystemChannelFlagsBitField>;
  public systemChannelId: Snowflake | null;
  public vanityURLUses: number | null;
  public readonly voiceAdapterCreator: InternalDiscordGatewayAdapterCreator;
  public readonly voiceStates: VoiceStateManager;
  public readonly widgetChannel: TextChannel | null;
  public widgetChannelId: Snowflake | null;
  public widgetEnabled: boolean | null;
  public readonly maximumBitrate: number;
  public createTemplate(name: string, description?: string): Promise<GuildTemplate>;
  public delete(): Promise<Guild>;
  public discoverySplashURL(options?: ImageURLOptions): string | null;
  public edit(data: GuildEditData, reason?: string): Promise<Guild>;
  public editWelcomeScreen(data: WelcomeScreenEditData): Promise<WelcomeScreen>;
  public equals(guild: Guild): boolean;
  public fetchAuditLogs<T extends GuildAuditLogsResolvable = 'All'>(
    options?: GuildAuditLogsFetchOptions<T>,
  ): Promise<GuildAuditLogs<T>>;
  public fetchIntegrations(): Promise<Collection<Snowflake | string, Integration>>;
  public fetchOwner(options?: BaseFetchOptions): Promise<GuildMember>;
  public fetchPreview(): Promise<GuildPreview>;
  public fetchTemplates(): Promise<Collection<GuildTemplate['code'], GuildTemplate>>;
  public fetchVanityData(): Promise<Vanity>;
  public fetchWebhooks(): Promise<Collection<Snowflake, Webhook>>;
  public fetchWelcomeScreen(): Promise<WelcomeScreen>;
  public fetchWidget(): Promise<Widget>;
  public fetchWidgetSettings(): Promise<GuildWidgetSettings>;
  public leave(): Promise<Guild>;
  public setAFKChannel(afkChannel: VoiceChannelResolvable | null, reason?: string): Promise<Guild>;
  public setAFKTimeout(afkTimeout: number, reason?: string): Promise<Guild>;
  public setBanner(banner: BufferResolvable | Base64Resolvable | null, reason?: string): Promise<Guild>;
  public setDefaultMessageNotifications(
    defaultMessageNotifications: GuildDefaultMessageNotifications,
    reason?: string,
  ): Promise<Guild>;
  public setDiscoverySplash(
    discoverySplash: BufferResolvable | Base64Resolvable | null,
    reason?: string,
  ): Promise<Guild>;
  public setExplicitContentFilter(explicitContentFilter: GuildExplicitContentFilter, reason?: string): Promise<Guild>;
  public setIcon(icon: BufferResolvable | Base64Resolvable | null, reason?: string): Promise<Guild>;
  public setName(name: string, reason?: string): Promise<Guild>;
  public setOwner(owner: GuildMemberResolvable, reason?: string): Promise<Guild>;
  public setPreferredLocale(preferredLocale: string, reason?: string): Promise<Guild>;
  public setPublicUpdatesChannel(publicUpdatesChannel: TextChannelResolvable | null, reason?: string): Promise<Guild>;
  public setRulesChannel(rulesChannel: TextChannelResolvable | null, reason?: string): Promise<Guild>;
  public setSplash(splash: BufferResolvable | Base64Resolvable | null, reason?: string): Promise<Guild>;
  public setSystemChannel(systemChannel: TextChannelResolvable | null, reason?: string): Promise<Guild>;
  public setSystemChannelFlags(systemChannelFlags: SystemChannelFlagsResolvable, reason?: string): Promise<Guild>;
  public setVerificationLevel(verificationLevel: GuildVerificationLevel, reason?: string): Promise<Guild>;
  public setPremiumProgressBarEnabled(enabled?: boolean, reason?: string): Promise<Guild>;
  public setWidgetSettings(settings: GuildWidgetSettingsData, reason?: string): Promise<Guild>;
  public toJSON(): unknown;
}

export class GuildAuditLogs<T extends GuildAuditLogsResolvable = 'All'> {
  private constructor(guild: Guild, data: RawGuildAuditLogData);
  private webhooks: Collection<Snowflake, Webhook>;
  private integrations: Collection<Snowflake | string, Integration>;

  public entries: Collection<Snowflake, GuildAuditLogsEntry<T>>;

  public static Actions: GuildAuditLogsActions;
  public static Targets: GuildAuditLogsTargets;
  public static Entry: typeof GuildAuditLogsEntry;
  public static actionType(action: number): GuildAuditLogsActionType;
  public static build(...args: unknown[]): Promise<GuildAuditLogs>;
  public static targetType(target: number): GuildAuditLogsTarget;
  public toJSON(): unknown;
}

export class GuildAuditLogsEntry<
  TActionRaw extends GuildAuditLogsResolvable = 'All',
  TAction = TActionRaw extends keyof GuildAuditLogsIds
    ? GuildAuditLogsIds[TActionRaw]
    : TActionRaw extends null
    ? 'All'
    : TActionRaw,
  TActionType extends GuildAuditLogsActionType = TAction extends keyof GuildAuditLogsTypes
    ? GuildAuditLogsTypes[TAction][1]
    : 'All',
  TTargetType extends GuildAuditLogsTarget = TAction extends keyof GuildAuditLogsTypes
    ? GuildAuditLogsTypes[TAction][0]
    : 'Unknown',
> {
  private constructor(logs: GuildAuditLogs, guild: Guild, data: RawGuildAuditLogEntryData);
  public action: TAction;
  public actionType: TActionType;
  public changes: AuditLogChange[] | null;
  public readonly createdAt: Date;
  public readonly createdTimestamp: number;
  public executor: User | null;
  public extra: TAction extends keyof GuildAuditLogsEntryExtraField ? GuildAuditLogsEntryExtraField[TAction] : null;
  public id: Snowflake;
  public reason: string | null;
  public target: TTargetType extends keyof GuildAuditLogsEntryTargetField<TActionType>
    ? GuildAuditLogsEntryTargetField<TActionType>[TTargetType]
    : Role | GuildEmoji | { id: Snowflake } | null;
  public targetType: TTargetType;
  public toJSON(): unknown;
}

export class GuildBan extends Base {
  private constructor(client: Client, data: RawGuildBanData, guild: Guild);
  public guild: Guild;
  public user: User;
  public readonly partial: boolean;
  public reason?: string | null;
  public fetch(force?: boolean): Promise<GuildBan>;
}

export abstract class GuildChannel extends Channel {
  public constructor(guild: Guild, data?: RawGuildChannelData, client?: Client, immediatePatch?: boolean);
  private memberPermissions(member: GuildMember, checkAdmin: boolean): Readonly<PermissionsBitField>;
  private rolePermissions(role: Role, checkAdmin: boolean): Readonly<PermissionsBitField>;
  public readonly createdAt: Date;
  public readonly createdTimestamp: number;
  public readonly calculatedPosition: number;
  public readonly deletable: boolean;
  public guild: Guild;
  public guildId: Snowflake;
  public readonly manageable: boolean;
  public readonly members: Collection<Snowflake, GuildMember>;
  public name: string;
  public readonly parent: CategoryChannel | null;
  public parentId: Snowflake | null;
  public permissionOverwrites: PermissionOverwriteManager;
  public readonly permissionsLocked: boolean | null;
  public readonly position: number;
  public rawPosition: number;
  public type: Exclude<ChannelType, ChannelType.DM | ChannelType.GroupDM>;
  public readonly viewable: boolean;
  public clone(options?: GuildChannelCloneOptions): Promise<this>;
  public delete(reason?: string): Promise<this>;
  public edit(data: ChannelData, reason?: string): Promise<this>;
  public equals(channel: GuildChannel): boolean;
  public lockPermissions(): Promise<this>;
  public permissionsFor(memberOrRole: GuildMember | Role, checkAdmin?: boolean): Readonly<PermissionsBitField>;
  public permissionsFor(
    memberOrRole: GuildMemberResolvable | RoleResolvable,
    checkAdmin?: boolean,
  ): Readonly<PermissionsBitField> | null;
  public setName(name: string, reason?: string): Promise<this>;
  public setParent(channel: CategoryChannelResolvable | null, options?: SetParentOptions): Promise<this>;
  public setPosition(position: number, options?: SetChannelPositionOptions): Promise<this>;
  public isTextBased(): this is GuildBasedChannel & TextBasedChannel;
}

export class GuildEmoji extends BaseGuildEmoji {
  private constructor(client: Client, data: RawGuildEmojiData, guild: Guild);
  private _roles: Snowflake[];

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
  private constructor(client: Client, data: RawGuildMemberData, guild: Guild);
  public avatar: string | null;
  public readonly bannable: boolean;
  public readonly displayColor: number;
  public readonly displayHexColor: HexColorString;
  public readonly displayName: string;
  public guild: Guild;
  public readonly id: Snowflake;
  public pending: boolean;
  public readonly communicationDisabledUntil: Date | null;
  public communicationDisabledUntilTimestamp: number | null;
  public readonly joinedAt: Date | null;
  public joinedTimestamp: number | null;
  public readonly kickable: boolean;
  public readonly manageable: boolean;
  public readonly moderatable: boolean;
  public nickname: string | null;
  public readonly partial: false;
  public readonly permissions: Readonly<PermissionsBitField>;
  public readonly premiumSince: Date | null;
  public premiumSinceTimestamp: number | null;
  public readonly presence: Presence | null;
  public readonly roles: GuildMemberRoleManager;
  public user: User;
  public readonly voice: VoiceState;
  public avatarURL(options?: ImageURLOptions): string | null;
  public ban(options?: BanOptions): Promise<GuildMember>;
  public disableCommunicationUntil(timeout: DateResolvable | null, reason?: string): Promise<GuildMember>;
  public timeout(timeout: number | null, reason?: string): Promise<GuildMember>;
  public fetch(force?: boolean): Promise<GuildMember>;
  public createDM(force?: boolean): Promise<DMChannel>;
  public deleteDM(): Promise<DMChannel>;
  public displayAvatarURL(options?: ImageURLOptions): string;
  public edit(data: GuildMemberEditData, reason?: string): Promise<GuildMember>;
  public isCommunicationDisabled(): this is GuildMember & {
    communicationDisabledUntilTimestamp: number;
    readonly communicationDisabledUntil: Date;
  };
  public kick(reason?: string): Promise<GuildMember>;
  public permissionsIn(channel: GuildChannelResolvable): Readonly<PermissionsBitField>;
  public setNickname(nickname: string | null, reason?: string): Promise<GuildMember>;
  public toJSON(): unknown;
  public toString(): MemberMention;
  public valueOf(): string;
}

export class GuildPreview extends Base {
  private constructor(client: Client, data: RawGuildPreviewData);
  public approximateMemberCount: number;
  public approximatePresenceCount: number;
  public readonly createdAt: Date;
  public readonly createdTimestamp: number;
  public description: string | null;
  public discoverySplash: string | null;
  public emojis: Collection<Snowflake, GuildPreviewEmoji>;
  public stickers: Collection<Snowflake, Sticker>;
  public features: GuildFeatures[];
  public icon: string | null;
  public id: Snowflake;
  public name: string;
  public splash: string | null;
  public discoverySplashURL(options?: ImageURLOptions): string | null;
  public iconURL(options?: ImageURLOptions): string | null;
  public splashURL(options?: ImageURLOptions): string | null;
  public fetch(): Promise<GuildPreview>;
  public toJSON(): unknown;
  public toString(): string;
}

export class GuildScheduledEvent<S extends GuildScheduledEventStatus = GuildScheduledEventStatus> extends Base {
  private constructor(client: Client, data: RawGuildScheduledEventData);
  public id: Snowflake;
  public guildId: Snowflake;
  public channelId: Snowflake | null;
  public creatorId: Snowflake | null;
  public name: string;
  public description: string | null;
  public scheduledStartTimestamp: number | null;
  public scheduledEndTimestamp: number | null;
  public privacyLevel: GuildScheduledEventPrivacyLevel;
  public status: S;
  public entityType: GuildScheduledEventEntityType;
  public entityId: Snowflake | null;
  public entityMetadata: GuildScheduledEventEntityMetadata;
  public userCount: number | null;
  public creator: User | null;
  public readonly createdTimestamp: number;
  public readonly createdAt: Date;
  public readonly scheduledStartAt: Date;
  public readonly scheduledEndAt: Date | null;
  public readonly channel: VoiceChannel | StageChannel | null;
  public readonly guild: Guild | null;
  public readonly url: string;
  public readonly image: string | null;
  public coverImageURL(options?: Readonly<BaseImageURLOptions>): string | null;
  public createInviteURL(options?: CreateGuildScheduledEventInviteURLOptions): Promise<string>;
  public edit<T extends GuildScheduledEventSetStatusArg<S>>(
    options: GuildScheduledEventEditOptions<S, T>,
  ): Promise<GuildScheduledEvent<T>>;
  public delete(): Promise<GuildScheduledEvent<S>>;
  public setName(name: string, reason?: string): Promise<GuildScheduledEvent<S>>;
  public setScheduledStartTime(scheduledStartTime: DateResolvable, reason?: string): Promise<GuildScheduledEvent<S>>;
  public setScheduledEndTime(scheduledEndTime: DateResolvable, reason?: string): Promise<GuildScheduledEvent<S>>;
  public setDescription(description: string, reason?: string): Promise<GuildScheduledEvent<S>>;
  public setStatus<T extends GuildScheduledEventSetStatusArg<S>>(
    status: T,
    reason?: string,
  ): Promise<GuildScheduledEvent<T>>;
  public setLocation(location: string, reason?: string): Promise<GuildScheduledEvent<S>>;
  public fetchSubscribers<T extends FetchGuildScheduledEventSubscribersOptions>(
    options?: T,
  ): Promise<GuildScheduledEventManagerFetchSubscribersResult<T>>;
  public toString(): string;
  public isActive(): this is GuildScheduledEvent<GuildScheduledEventStatus.Active>;
  public isCanceled(): this is GuildScheduledEvent<GuildScheduledEventStatus.Canceled>;
  public isCompleted(): this is GuildScheduledEvent<GuildScheduledEventStatus.Completed>;
  public isScheduled(): this is GuildScheduledEvent<GuildScheduledEventStatus.Scheduled>;
}

export class GuildTemplate extends Base {
  private constructor(client: Client, data: RawGuildTemplateData);
  public createdTimestamp: number;
  public updatedTimestamp: number;
  public readonly url: string;
  public code: string;
  public name: string;
  public description: string | null;
  public usageCount: number;
  public creator: User;
  public creatorId: Snowflake;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public guild: Guild | null;
  public guildId: Snowflake;
  public serializedGuild: APITemplateSerializedSourceGuild;
  public unSynced: boolean | null;
  public createGuild(name: string, icon?: BufferResolvable | Base64Resolvable): Promise<Guild>;
  public delete(): Promise<GuildTemplate>;
  public edit(options?: EditGuildTemplateOptions): Promise<GuildTemplate>;
  public sync(): Promise<GuildTemplate>;
  public static GUILD_TEMPLATES_PATTERN: RegExp;
}

export class GuildPreviewEmoji extends BaseGuildEmoji {
  private constructor(client: Client, data: RawGuildEmojiData, guild: GuildPreview);
  public guild: GuildPreview;
  public roles: Snowflake[];
}

export class Integration extends Base {
  private constructor(client: Client, data: RawIntegrationData, guild: Guild);
  public account: IntegrationAccount;
  public application: IntegrationApplication | null;
  public enabled: boolean;
  public expireBehavior: IntegrationExpireBehavior | null;
  public expireGracePeriod: number | null;
  public guild: Guild;
  public id: Snowflake | string;
  public name: string;
  public role: Role | null;
  public enableEmoticons: boolean | null;
  public readonly roles: Collection<Snowflake, Role>;
  public readonly syncedAt: Date | null;
  public syncedTimestamp: number | null;
  public syncing: boolean | null;
  public type: IntegrationType;
  public user: User | null;
  public subscriberCount: number | null;
  public revoked: boolean | null;
  public delete(reason?: string): Promise<Integration>;
}

export class IntegrationApplication extends Application {
  private constructor(client: Client, data: RawIntegrationApplicationData);
  public bot: User | null;
  public termsOfServiceURL: string | null;
  public privacyPolicyURL: string | null;
  public rpcOrigins: string[];
  public summary: string | null;
  public hook: boolean | null;
  public cover: string | null;
  public verifyKey: string | null;
}

export type GatewayIntentsString = keyof typeof GatewayIntentBits;

export class IntentsBitField extends BitField<GatewayIntentsString> {
  public static Flags: typeof GatewayIntentBits;
  public static resolve(bit?: BitFieldResolvable<GatewayIntentsString, number>): number;
}

export type CacheType = 'cached' | 'raw' | undefined;

export type CacheTypeReducer<
  State extends CacheType,
  CachedType,
  RawType = CachedType,
  PresentType = CachedType | RawType,
  Fallback = PresentType | null,
> = [State] extends ['cached']
  ? CachedType
  : [State] extends ['raw']
  ? RawType
  : [State] extends ['raw' | 'cached']
  ? PresentType
  : Fallback;

export class Interaction<Cached extends CacheType = CacheType> extends Base {
  // This a technique used to brand different cached types. Or else we'll get `never` errors on typeguard checks.
  private readonly _cacheType: Cached;
  protected constructor(client: Client, data: RawInteractionData);
  public applicationId: Snowflake;
  public readonly channel: CacheTypeReducer<
    Cached,
    GuildTextBasedChannel | null,
    GuildTextBasedChannel | null,
    GuildTextBasedChannel | null,
    TextBasedChannel | null
  >;
  public channelId: Snowflake | null;
  public readonly createdAt: Date;
  public readonly createdTimestamp: number;
  public readonly guild: CacheTypeReducer<Cached, Guild, null>;
  public guildId: CacheTypeReducer<Cached, Snowflake>;
  public id: Snowflake;
  public member: CacheTypeReducer<Cached, GuildMember, APIInteractionGuildMember>;
  public readonly token: string;
  public type: InteractionType;
  public user: User;
  public version: number;
  public memberPermissions: CacheTypeReducer<Cached, Readonly<PermissionsBitField>>;
  public locale: string;
  public guildLocale: CacheTypeReducer<Cached, string, string, string>;
  public inGuild(): this is Interaction<'raw' | 'cached'>;
  public inCachedGuild(): this is Interaction<'cached'>;
  public inRawGuild(): this is Interaction<'raw'>;
  public isButton(): this is ButtonInteraction<Cached>;
  public isCommand(): this is CommandInteraction<Cached>;
  public isChatInputCommand(): this is ChatInputCommandInteraction<Cached>;
  public isContextMenuCommand(): this is ContextMenuCommandInteraction<Cached>;
  public isMessageContextMenuCommand(): this is MessageContextMenuCommandInteraction<Cached>;
  public isAutocomplete(): this is AutocompleteInteraction<Cached>;
  public isUserContextMenuCommand(): this is UserContextMenuCommandInteraction<Cached>;
  public isMessageComponent(): this is MessageComponentInteraction<Cached>;
  public isSelectMenu(): this is SelectMenuInteraction<Cached>;
  public isRepliable(): this is this & InteractionResponseFields<Cached>;
}

export class InteractionCollector<T extends Interaction> extends Collector<Snowflake, T> {
  public constructor(client: Client, options?: InteractionCollectorOptions<T>);
  private _handleMessageDeletion(message: Message): void;
  private _handleChannelDeletion(channel: NonThreadGuildBasedChannel): void;
  private _handleGuildDeletion(guild: Guild): void;

  public channelId: Snowflake | null;
  public componentType: ComponentType | null;
  public readonly endReason: string | null;
  public guildId: Snowflake | null;
  public interactionType: InteractionType | null;
  public messageId: Snowflake | null;
  public options: InteractionCollectorOptions<T>;
  public total: number;
  public users: Collection<Snowflake, User>;

  public collect(interaction: Interaction): Snowflake;
  public empty(): void;
  public dispose(interaction: Interaction): Snowflake;
  public on(event: 'collect' | 'dispose', listener: (interaction: T) => Awaitable<void>): this;
  public on(event: 'end', listener: (collected: Collection<Snowflake, T>, reason: string) => Awaitable<void>): this;
  public on(event: string, listener: (...args: any[]) => Awaitable<void>): this;

  public once(event: 'collect' | 'dispose', listener: (interaction: T) => Awaitable<void>): this;
  public once(event: 'end', listener: (collected: Collection<Snowflake, T>, reason: string) => Awaitable<void>): this;
  public once(event: string, listener: (...args: any[]) => Awaitable<void>): this;
}

export class InteractionWebhook extends PartialWebhookMixin() {
  public constructor(client: Client, id: Snowflake, token: string);
  public token: string;
  public send(options: string | MessagePayload | InteractionReplyOptions): Promise<Message | APIMessage>;
}

export class Invite extends Base {
  private constructor(client: Client, data: RawInviteData);
  public channel: NonThreadGuildBasedChannel | PartialGroupDMChannel;
  public code: string;
  public readonly deletable: boolean;
  public readonly createdAt: Date | null;
  public createdTimestamp: number | null;
  public readonly expiresAt: Date | null;
  public readonly expiresTimestamp: number | null;
  public guild: InviteGuild | Guild | null;
  public readonly inviter: User | null;
  public inviterId: Snowflake | null;
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
  public stageInstance: InviteStageInstance | null;
  public guildScheduledEvent: GuildScheduledEvent | null;
}

export class InviteStageInstance extends Base {
  private constructor(client: Client, data: RawInviteStageInstance, channelId: Snowflake, guildId: Snowflake);
  public channelId: Snowflake;
  public guildId: Snowflake;
  public members: Collection<Snowflake, GuildMember>;
  public topic: string;
  public participantCount: number;
  public speakerCount: number;
  public readonly channel: StageChannel | null;
  public readonly guild: Guild | null;
}

export class InviteGuild extends AnonymousGuild {
  private constructor(client: Client, data: RawInviteGuildData);
  public welcomeScreen: WelcomeScreen | null;
}

export class LimitedCollection<K, V> extends Collection<K, V> {
  public constructor(options?: LimitedCollectionOptions<K, V>, iterable?: Iterable<readonly [K, V]>);
  public maxSize: number;
  public keepOverLimit: ((value: V, key: K, collection: this) => boolean) | null;
}

export type MessageCollectorOptionsParams<T extends ComponentType, Cached extends boolean = boolean> =
  | {
      componentType?: T;
    } & MessageComponentCollectorOptions<MappedInteractionTypes<Cached>[T]>;

export type MessageChannelCollectorOptionsParams<T extends ComponentType, Cached extends boolean = boolean> =
  | {
      componentType?: T;
    } & MessageChannelComponentCollectorOptions<MappedInteractionTypes<Cached>[T]>;

export type AwaitMessageCollectorOptionsParams<T extends ComponentType, Cached extends boolean = boolean> =
  | { componentType?: T } & Pick<
      InteractionCollectorOptions<MappedInteractionTypes<Cached>[T]>,
      keyof AwaitMessageComponentOptions<any>
    >;

export interface StringMappedInteractionTypes<Cached extends CacheType = CacheType> {
  Button: ButtonInteraction<Cached>;
  SelectMenu: SelectMenuInteraction<Cached>;
  ActionRow: MessageComponentInteraction<Cached>;
}

export type WrapBooleanCache<T extends boolean> = If<T, 'cached', CacheType>;

export interface MappedInteractionTypes<Cached extends boolean = boolean> {
  [ComponentType.Button]: ButtonInteraction<WrapBooleanCache<Cached>>;
  [ComponentType.SelectMenu]: SelectMenuInteraction<WrapBooleanCache<Cached>>;
  [ComponentType.ActionRow]: MessageComponentInteraction<WrapBooleanCache<Cached>>;
}

export class Message<Cached extends boolean = boolean> extends Base {
  private readonly _cacheType: Cached;
  private constructor(client: Client, data: RawMessageData);
  private _patch(data: RawPartialMessageData | RawMessageData): void;

  public activity: MessageActivity | null;
  public applicationId: Snowflake | null;
  public attachments: Collection<Snowflake, MessageAttachment>;
  public author: User;
  public readonly channel: If<Cached, GuildTextBasedChannel, TextBasedChannel>;
  public channelId: Snowflake;
  public readonly cleanContent: string;
  public components: ActionRow<ActionRowComponent>[];
  public content: string;
  public readonly createdAt: Date;
  public createdTimestamp: number;
  public readonly crosspostable: boolean;
  public readonly deletable: boolean;
  public readonly editable: boolean;
  public readonly editedAt: Date | null;
  public editedTimestamp: number | null;
  public embeds: Embed[];
  public groupActivityApplication: ClientApplication | null;
  public guildId: If<Cached, Snowflake>;
  public readonly guild: If<Cached, Guild>;
  public readonly hasThread: boolean;
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
  public readonly thread: ThreadChannel | null;
  public tts: boolean;
  public type: MessageType;
  public readonly url: string;
  public webhookId: Snowflake | null;
  public flags: Readonly<MessageFlagsBitField>;
  public reference: MessageReference | null;
  public awaitMessageComponent<T extends ComponentType = ComponentType.ActionRow>(
    options?: AwaitMessageCollectorOptionsParams<T, Cached>,
  ): Promise<MappedInteractionTypes<Cached>[T]>;
  public awaitReactions(options?: AwaitReactionsOptions): Promise<Collection<Snowflake | string, MessageReaction>>;
  public createReactionCollector(options?: ReactionCollectorOptions): ReactionCollector;
  public createMessageComponentCollector<T extends ComponentType = ComponentType.ActionRow>(
    options?: MessageCollectorOptionsParams<T, Cached>,
  ): InteractionCollector<MappedInteractionTypes<Cached>[T]>;
  public delete(): Promise<Message>;
  public edit(content: string | MessageEditOptions | MessagePayload): Promise<Message>;
  public equals(message: Message, rawData: unknown): boolean;
  public fetchReference(): Promise<Message>;
  public fetchWebhook(): Promise<Webhook>;
  public crosspost(): Promise<Message>;
  public fetch(force?: boolean): Promise<Message>;
  public pin(): Promise<Message>;
  public react(emoji: EmojiIdentifierResolvable): Promise<MessageReaction>;
  public removeAttachments(): Promise<Message>;
  public reply(options: string | MessagePayload | ReplyMessageOptions): Promise<Message>;
  public resolveComponent(customId: string): ActionRowComponent | null;
  public startThread(options: StartThreadOptions): Promise<ThreadChannel>;
  public suppressEmbeds(suppress?: boolean): Promise<Message>;
  public toJSON(): unknown;
  public toString(): string;
  public unpin(): Promise<Message>;
  public inGuild(): this is Message<true> & this;
}

export class MessageAttachment {
  public constructor(attachment: BufferResolvable | Stream, name?: string, data?: RawMessageAttachmentData);

  public attachment: BufferResolvable | Stream;
  public contentType: string | null;
  public description: string | null;
  public ephemeral: boolean;
  public height: number | null;
  public id: Snowflake;
  public name: string | null;
  public proxyURL: string;
  public size: number;
  public readonly spoiler: boolean;
  public url: string;
  public width: number | null;
  public setDescription(description: string): this;
  public setFile(attachment: BufferResolvable | Stream, name?: string): this;
  public setName(name: string): this;
  public setSpoiler(spoiler?: boolean): this;
  public toJSON(): unknown;
}

export class MessageCollector extends Collector<Snowflake, Message> {
  public constructor(channel: TextBasedChannel, options?: MessageCollectorOptions);
  private _handleChannelDeletion(channel: NonThreadGuildBasedChannel): void;
  private _handleGuildDeletion(guild: Guild): void;

  public channel: TextBasedChannel;
  public readonly endReason: string | null;
  public options: MessageCollectorOptions;
  public received: number;

  public collect(message: Message): Snowflake | null;
  public dispose(message: Message): Snowflake | null;
}

export class MessageComponentInteraction<Cached extends CacheType = CacheType> extends Interaction<Cached> {
  protected constructor(client: Client, data: RawMessageComponentInteractionData);
  public readonly component: CacheTypeReducer<
    Cached,
    ActionRowComponent,
    Exclude<APIMessageComponent, APIActionRowComponent>,
    ActionRowComponent | Exclude<APIMessageComponent, APIActionRowComponent>,
    ActionRowComponent | Exclude<APIMessageComponent, APIActionRowComponent>
  >;
  public componentType: Exclude<ComponentType, ComponentType.ActionRow>;
  public customId: string;
  public channelId: Snowflake;
  public deferred: boolean;
  public ephemeral: boolean | null;
  public message: GuildCacheMessage<Cached>;
  public replied: boolean;
  public webhook: InteractionWebhook;
  public inGuild(): this is MessageComponentInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is MessageComponentInteraction<'cached'>;
  public inRawGuild(): this is MessageComponentInteraction<'raw'>;
  public deferReply(options: InteractionDeferReplyOptions & { fetchReply: true }): Promise<GuildCacheMessage<Cached>>;
  public deferReply(options?: InteractionDeferReplyOptions): Promise<void>;
  public deferUpdate(options: InteractionDeferUpdateOptions & { fetchReply: true }): Promise<GuildCacheMessage<Cached>>;
  public deferUpdate(options?: InteractionDeferUpdateOptions): Promise<void>;
  public deleteReply(): Promise<void>;
  public editReply(options: string | MessagePayload | WebhookEditMessageOptions): Promise<GuildCacheMessage<Cached>>;
  public fetchReply(): Promise<GuildCacheMessage<Cached>>;
  public followUp(options: string | MessagePayload | InteractionReplyOptions): Promise<GuildCacheMessage<Cached>>;
  public reply(options: InteractionReplyOptions & { fetchReply: true }): Promise<GuildCacheMessage<Cached>>;
  public reply(options: string | MessagePayload | InteractionReplyOptions): Promise<void>;
  public update(options: InteractionUpdateOptions & { fetchReply: true }): Promise<GuildCacheMessage<Cached>>;
  public update(options: string | MessagePayload | InteractionUpdateOptions): Promise<void>;
}

export class MessageContextMenuCommandInteraction<
  Cached extends CacheType = CacheType,
> extends ContextMenuCommandInteraction<Cached> {
  public readonly targetMessage: NonNullable<CommandInteractionOption<Cached>['message']>;
  public inGuild(): this is MessageContextMenuCommandInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is MessageContextMenuCommandInteraction<'cached'>;
  public inRawGuild(): this is MessageContextMenuCommandInteraction<'raw'>;
}

export type MessageFlagsString = keyof typeof MessageFlags;

export class MessageFlagsBitField extends BitField<MessageFlagsString> {
  public static Flags: typeof MessageFlags;
  public static resolve(bit?: BitFieldResolvable<MessageFlagsString, number>): number;
}

export class MessageMentions {
  private constructor(
    message: Message,
    users: APIUser[] | Collection<Snowflake, User>,
    roles: Snowflake[] | Collection<Snowflake, Role>,
    everyone: boolean,
    repliedUser?: APIUser | User,
  );
  private _channels: Collection<Snowflake, AnyChannel> | null;
  private readonly _content: string;
  private _members: Collection<Snowflake, GuildMember> | null;

  public readonly channels: Collection<Snowflake, AnyChannel>;
  public readonly client: Client;
  public everyone: boolean;
  public readonly guild: Guild;
  public has(data: UserResolvable | RoleResolvable | ChannelResolvable, options?: MessageMentionsHasOptions): boolean;
  public readonly members: Collection<Snowflake, GuildMember> | null;
  public repliedUser: User | null;
  public roles: Collection<Snowflake, Role>;
  public users: Collection<Snowflake, User>;
  public crosspostedChannels: Collection<Snowflake, CrosspostedChannel>;
  public toJSON(): unknown;

  public static CHANNELS_PATTERN: RegExp;
  public static EVERYONE_PATTERN: RegExp;
  public static ROLES_PATTERN: RegExp;
  public static USERS_PATTERN: RegExp;
}

export class MessagePayload {
  public constructor(target: MessageTarget, options: MessageOptions | WebhookMessageOptions);
  public body: RawMessagePayloadData | null;
  public readonly isUser: boolean;
  public readonly isWebhook: boolean;
  public readonly isMessage: boolean;
  public readonly isMessageManager: boolean;
  public readonly isInteraction: boolean;
  public files: RawFile[] | null;
  public options: MessageOptions | WebhookMessageOptions;
  public target: MessageTarget;

  public static create(
    target: MessageTarget,
    options: string | MessageOptions | WebhookMessageOptions,
    extra?: MessageOptions | WebhookMessageOptions,
  ): MessagePayload;
  public static resolveFile(fileLike: BufferResolvable | Stream | FileOptions | MessageAttachment): Promise<RawFile>;

  public makeContent(): string | undefined;
  public resolveBody(): this;
  public resolveFiles(): Promise<this>;
}

export class MessageReaction {
  private constructor(client: Client, data: RawMessageReactionData, message: Message);
  private _emoji: GuildEmoji | ReactionEmoji;

  public readonly client: Client;
  public count: number;
  public readonly emoji: GuildEmoji | ReactionEmoji;
  public me: boolean;
  public message: Message | PartialMessage;
  public readonly partial: false;
  public users: ReactionUserManager;
  public remove(): Promise<MessageReaction>;
  public fetch(): Promise<MessageReaction>;
  public toJSON(): unknown;
}

export class NewsChannel extends BaseGuildTextChannel {
  public threads: ThreadManager<AllowedThreadTypeForNewsChannel>;
  public type: ChannelType.GuildNews;
  public addFollower(channel: TextChannelResolvable, reason?: string): Promise<NewsChannel>;
}

export class OAuth2Guild extends BaseGuild {
  private constructor(client: Client, data: RawOAuth2GuildData);
  public owner: boolean;
  public permissions: Readonly<PermissionsBitField>;
}

export class PartialGroupDMChannel extends Channel {
  private constructor(client: Client, data: RawPartialGroupDMChannelData);
  public type: ChannelType.GroupDM;
  public name: string | null;
  public icon: string | null;
  public recipients: PartialRecipient[];
  public iconURL(options?: ImageURLOptions): string | null;
}

export class PermissionOverwrites extends Base {
  private constructor(client: Client, data: RawPermissionOverwriteData, channel: NonThreadGuildBasedChannel);
  public allow: Readonly<PermissionsBitField>;
  public readonly channel: NonThreadGuildBasedChannel;
  public deny: Readonly<PermissionsBitField>;
  public id: Snowflake;
  public type: OverwriteType;
  public edit(options: PermissionOverwriteOptions, reason?: string): Promise<PermissionOverwrites>;
  public delete(reason?: string): Promise<PermissionOverwrites>;
  public toJSON(): unknown;
  public static resolveOverwriteOptions(
    options: PermissionOverwriteOptions,
    initialPermissions: { allow?: PermissionResolvable; deny?: PermissionResolvable },
  ): ResolvedOverwriteOptions;
  public static resolve(overwrite: OverwriteResolvable, guild: Guild): APIOverwrite;
}

export type PermissionsString = keyof typeof PermissionFlagsBits;

export class PermissionsBitField extends BitField<PermissionsString, bigint> {
  public any(permission: PermissionResolvable, checkAdmin?: boolean): boolean;
  public has(permission: PermissionResolvable, checkAdmin?: boolean): boolean;
  public missing(bits: BitFieldResolvable<PermissionsString, bigint>, checkAdmin?: boolean): PermissionsString[];
  public serialize(checkAdmin?: boolean): Record<PermissionsString, boolean>;
  public toArray(): PermissionsString[];

  public static All: bigint;
  public static Default: bigint;
  public static StageModerator: bigint;
  public static Flags: typeof PermissionFlagsBits;
  public static resolve(permission?: PermissionResolvable): bigint;
}

export class Presence extends Base {
  protected constructor(client: Client, data?: RawPresenceData);
  public activities: Activity[];
  public clientStatus: ClientPresenceStatusData | null;
  public guild: Guild | null;
  public readonly member: GuildMember | null;
  public status: PresenceStatus;
  public readonly user: User | null;
  public userId: Snowflake;
  public equals(presence: Presence): boolean;
}

export class ReactionCollector extends Collector<Snowflake | string, MessageReaction, [User]> {
  public constructor(message: Message, options?: ReactionCollectorOptions);
  private _handleChannelDeletion(channel: NonThreadGuildBasedChannel): void;
  private _handleGuildDeletion(guild: Guild): void;
  private _handleMessageDeletion(message: Message): void;

  public readonly endReason: string | null;
  public message: Message;
  public options: ReactionCollectorOptions;
  public total: number;
  public users: Collection<Snowflake, User>;

  public static key(reaction: MessageReaction): Snowflake | string;

  public collect(reaction: MessageReaction, user: User): Snowflake | string | null;
  public dispose(reaction: MessageReaction, user: User): Snowflake | string | null;
  public empty(): void;

  public on(event: 'collect' | 'dispose' | 'remove', listener: (reaction: MessageReaction, user: User) => void): this;
  public on(event: 'end', listener: (collected: Collection<Snowflake, MessageReaction>, reason: string) => void): this;
  public on(event: string, listener: (...args: any[]) => void): this;

  public once(event: 'collect' | 'dispose' | 'remove', listener: (reaction: MessageReaction, user: User) => void): this;
  public once(
    event: 'end',
    listener: (collected: Collection<Snowflake, MessageReaction>, reason: string) => void,
  ): this;
  public once(event: string, listener: (...args: any[]) => void): this;
}

export class ReactionEmoji extends Emoji {
  private constructor(reaction: MessageReaction, emoji: RawReactionEmojiData);
  public reaction: MessageReaction;
  public toJSON(): unknown;
}

export class RichPresenceAssets {
  private constructor(activity: Activity, assets: RawRichPresenceAssets);
  public largeImage: Snowflake | null;
  public largeText: string | null;
  public smallImage: Snowflake | null;
  public smallText: string | null;
  public largeImageURL(options?: ImageURLOptions): string | null;
  public smallImageURL(options?: ImageURLOptions): string | null;
}

export class Role extends Base {
  private constructor(client: Client, data: RawRoleData, guild: Guild);
  public color: number;
  public readonly createdAt: Date;
  public readonly createdTimestamp: number;
  public readonly editable: boolean;
  public guild: Guild;
  public readonly hexColor: HexColorString;
  public hoist: boolean;
  public id: Snowflake;
  public managed: boolean;
  public readonly members: Collection<Snowflake, GuildMember>;
  public mentionable: boolean;
  public name: string;
  public permissions: Readonly<PermissionsBitField>;
  public readonly position: number;
  public rawPosition: number;
  public tags: RoleTagData | null;
  public comparePositionTo(role: RoleResolvable): number;
  public icon: string | null;
  public unicodeEmoji: string | null;
  public delete(reason?: string): Promise<Role>;
  public edit(data: RoleData, reason?: string): Promise<Role>;
  public equals(role: Role): boolean;
  public iconURL(options?: ImageURLOptions): string | null;
  public permissionsIn(
    channel: NonThreadGuildBasedChannel | Snowflake,
    checkAdmin?: boolean,
  ): Readonly<PermissionsBitField>;
  public setColor(color: ColorResolvable, reason?: string): Promise<Role>;
  public setHoist(hoist?: boolean, reason?: string): Promise<Role>;
  public setMentionable(mentionable?: boolean, reason?: string): Promise<Role>;
  public setName(name: string, reason?: string): Promise<Role>;
  public setPermissions(permissions: PermissionResolvable, reason?: string): Promise<Role>;
  public setIcon(icon: BufferResolvable | Base64Resolvable | EmojiResolvable | null, reason?: string): Promise<Role>;
  public setPosition(position: number, options?: SetRolePositionOptions): Promise<Role>;
  public setUnicodeEmoji(unicodeEmoji: string | null, reason?: string): Promise<Role>;
  public toJSON(): unknown;
  public toString(): RoleMention;
}

export class SelectMenuInteraction<Cached extends CacheType = CacheType> extends MessageComponentInteraction<Cached> {
  public constructor(client: Client, data: RawMessageSelectMenuInteractionData);
  public readonly component: CacheTypeReducer<
    Cached,
    SelectMenuComponent,
    APISelectMenuComponent,
    SelectMenuComponent | APISelectMenuComponent,
    SelectMenuComponent | APISelectMenuComponent
  >;
  public componentType: ComponentType.SelectMenu;
  public values: string[];
  public inGuild(): this is SelectMenuInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is SelectMenuInteraction<'cached'>;
  public inRawGuild(): this is SelectMenuInteraction<'raw'>;
}

export interface ShardEventTypes {
  spawn: [child: ChildProcess];
  death: [child: ChildProcess];
  disconnect: [];
  ready: [];
  reconnection: [];
  error: [error: Error];
  message: [message: any];
}

export class Shard extends EventEmitter {
  private constructor(manager: ShardingManager, id: number);
  private _evals: Map<string, Promise<unknown>>;
  private _exitListener: (...args: any[]) => void;
  private _fetches: Map<string, Promise<unknown>>;
  private _handleExit(respawn?: boolean, timeout?: number): void;
  private _handleMessage(message: unknown): void;
  private incrementMaxListeners(emitter: EventEmitter | ChildProcess): void;
  private decrementMaxListeners(emitter: EventEmitter | ChildProcess): void;

  public args: string[];
  public execArgv: string[];
  public env: unknown;
  public id: number;
  public manager: ShardingManager;
  public process: ChildProcess | null;
  public ready: boolean;
  public worker: Worker | null;
  public eval(script: string): Promise<unknown>;
  public eval<T>(fn: (client: Client) => T): Promise<T>;
  public eval<T, P>(fn: (client: Client, context: Serialized<P>) => T, context: P): Promise<T>;
  public fetchClientValue(prop: string): Promise<unknown>;
  public kill(): void;
  public respawn(options?: { delay?: number; timeout?: number }): Promise<ChildProcess>;
  public send(message: unknown): Promise<Shard>;
  public spawn(timeout?: number): Promise<ChildProcess>;

  public on<K extends keyof ShardEventTypes>(
    event: K,
    listener: (...args: ShardEventTypes[K]) => Awaitable<void>,
  ): this;

  public once<K extends keyof ShardEventTypes>(
    event: K,
    listener: (...args: ShardEventTypes[K]) => Awaitable<void>,
  ): this;
}

export class ShardClientUtil {
  private constructor(client: Client, mode: ShardingManagerMode);
  private _handleMessage(message: unknown): void;
  private _respond(type: string, message: unknown): void;
  private incrementMaxListeners(emitter: EventEmitter | ChildProcess): void;
  private decrementMaxListeners(emitter: EventEmitter | ChildProcess): void;

  public client: Client;
  public readonly count: number;
  public readonly ids: number[];
  public mode: ShardingManagerMode;
  public parentPort: MessagePort | null;
  public broadcastEval<T>(fn: (client: Client) => Awaitable<T>): Promise<Serialized<T>[]>;
  public broadcastEval<T>(fn: (client: Client) => Awaitable<T>, options: { shard: number }): Promise<Serialized<T>>;
  public broadcastEval<T, P>(
    fn: (client: Client, context: Serialized<P>) => Awaitable<T>,
    options: { context: P },
  ): Promise<Serialized<T>[]>;
  public broadcastEval<T, P>(
    fn: (client: Client, context: Serialized<P>) => Awaitable<T>,
    options: { context: P; shard: number },
  ): Promise<Serialized<T>>;
  public fetchClientValues(prop: string): Promise<unknown[]>;
  public fetchClientValues(prop: string, shard: number): Promise<unknown>;
  public respawnAll(options?: MultipleShardRespawnOptions): Promise<void>;
  public send(message: unknown): Promise<void>;

  public static singleton(client: Client, mode: ShardingManagerMode): ShardClientUtil;
  public static shardIdForGuildId(guildId: Snowflake, shardCount: number): number;
}

export class ShardingManager extends EventEmitter {
  public constructor(file: string, options?: ShardingManagerOptions);
  private _performOnShards(method: string, args: unknown[]): Promise<unknown[]>;
  private _performOnShards(method: string, args: unknown[], shard: number): Promise<unknown>;

  public file: string;
  public respawn: boolean;
  public shardArgs: string[];
  public shards: Collection<number, Shard>;
  public token: string | null;
  public totalShards: number | 'auto';
  public shardList: number[] | 'auto';
  public broadcast(message: unknown): Promise<Shard[]>;
  public broadcastEval<T>(fn: (client: Client) => Awaitable<T>): Promise<Serialized<T>[]>;
  public broadcastEval<T>(fn: (client: Client) => Awaitable<T>, options: { shard: number }): Promise<Serialized<T>>;
  public broadcastEval<T, P>(
    fn: (client: Client, context: Serialized<P>) => Awaitable<T>,
    options: { context: P },
  ): Promise<Serialized<T>[]>;
  public broadcastEval<T, P>(
    fn: (client: Client, context: Serialized<P>) => Awaitable<T>,
    options: { context: P; shard: number },
  ): Promise<Serialized<T>>;
  public createShard(id: number): Shard;
  public fetchClientValues(prop: string): Promise<unknown[]>;
  public fetchClientValues(prop: string, shard: number): Promise<unknown>;
  public respawnAll(options?: MultipleShardRespawnOptions): Promise<Collection<number, Shard>>;
  public spawn(options?: MultipleShardSpawnOptions): Promise<Collection<number, Shard>>;

  public on(event: 'shardCreate', listener: (shard: Shard) => Awaitable<void>): this;

  public once(event: 'shardCreate', listener: (shard: Shard) => Awaitable<void>): this;
}

export interface FetchRecommendedShardsOptions {
  guildsPerShard?: number;
  multipleOf?: number;
}

export {
  DiscordSnowflake as SnowflakeUtil,
  SnowflakeGenerateOptions,
  DeconstructedSnowflake,
} from '@sapphire/snowflake';

export class StageChannel extends BaseGuildVoiceChannel {
  public topic: string | null;
  public type: ChannelType.GuildStageVoice;
  public readonly stageInstance: StageInstance | null;
  public createStageInstance(options: StageInstanceCreateOptions): Promise<StageInstance>;
  public setTopic(topic: string): Promise<StageChannel>;
}

export class StageInstance extends Base {
  private constructor(client: Client, data: RawStageInstanceData, channel: StageChannel);
  public id: Snowflake;
  public guildId: Snowflake;
  public channelId: Snowflake;
  public topic: string;
  public privacyLevel: StageInstancePrivacyLevel;
  /** @deprecated See https://github.com/discord/discord-api-docs/pull/4296 for more information */
  public discoverableDisabled: boolean | null;
  public readonly channel: StageChannel | null;
  public readonly guild: Guild | null;
  public edit(options: StageInstanceEditOptions): Promise<StageInstance>;
  public delete(): Promise<StageInstance>;
  public setTopic(topic: string): Promise<StageInstance>;
  public readonly createdTimestamp: number;
  public readonly createdAt: Date;
}

export class Sticker extends Base {
  private constructor(client: Client, data: RawStickerData);
  public readonly createdTimestamp: number;
  public readonly createdAt: Date;
  public available: boolean | null;
  public description: string | null;
  public format: StickerFormatType;
  public readonly guild: Guild | null;
  public guildId: Snowflake | null;
  public id: Snowflake;
  public name: string;
  public packId: Snowflake | null;
  public readonly partial: boolean;
  public sortValue: number | null;
  public tags: string[] | null;
  public type: StickerType | null;
  public user: User | null;
  public readonly url: string;
  public fetch(): Promise<Sticker>;
  public fetchPack(): Promise<StickerPack | null>;
  public fetchUser(): Promise<User | null>;
  public edit(data?: GuildStickerEditData, reason?: string): Promise<Sticker>;
  public delete(reason?: string): Promise<Sticker>;
  public equals(other: Sticker | unknown): boolean;
}

export class StickerPack extends Base {
  private constructor(client: Client, data: RawStickerPackData);
  public readonly createdTimestamp: number;
  public readonly createdAt: Date;
  public bannerId: Snowflake | null;
  public readonly coverSticker: Sticker | null;
  public coverStickerId: Snowflake | null;
  public description: string;
  public id: Snowflake;
  public name: string;
  public skuId: Snowflake;
  public stickers: Collection<Snowflake, Sticker>;
  public bannerURL(options?: ImageURLOptions): string | null;
}

/** @deprecated See [Self-serve Game Selling Deprecation](https://support-dev.discord.com/hc/en-us/articles/4414590563479) for more information */
export class StoreChannel extends GuildChannel {
  private constructor(guild: Guild, data?: RawGuildChannelData, client?: Client);
  public createInvite(options?: CreateInviteOptions): Promise<Invite>;
  public fetchInvites(cache?: boolean): Promise<Collection<string, Invite>>;
  /** @deprecated See [Self-serve Game Selling Deprecation](https://support-dev.discord.com/hc/en-us/articles/4414590563479) for more information */
  public clone(options?: GuildChannelCloneOptions): Promise<this>;
  public nsfw: boolean;
  public type: ChannelType.GuildStore;
}

export class Sweepers {
  public constructor(client: Client, options: SweeperOptions);
  public readonly client: Client;
  public intervals: Record<SweeperKey, NodeJS.Timeout | null>;
  public options: SweeperOptions;

  public sweepApplicationCommands(
    filter: CollectionSweepFilter<
      SweeperDefinitions['applicationCommands'][0],
      SweeperDefinitions['applicationCommands'][1]
    >,
  ): number;
  public sweepBans(filter: CollectionSweepFilter<SweeperDefinitions['bans'][0], SweeperDefinitions['bans'][1]>): number;
  public sweepEmojis(
    filter: CollectionSweepFilter<SweeperDefinitions['emojis'][0], SweeperDefinitions['emojis'][1]>,
  ): number;
  public sweepInvites(
    filter: CollectionSweepFilter<SweeperDefinitions['invites'][0], SweeperDefinitions['invites'][1]>,
  ): number;
  public sweepGuildMembers(
    filter: CollectionSweepFilter<SweeperDefinitions['guildMembers'][0], SweeperDefinitions['guildMembers'][1]>,
  ): number;
  public sweepMessages(
    filter: CollectionSweepFilter<SweeperDefinitions['messages'][0], SweeperDefinitions['messages'][1]>,
  ): number;
  public sweepPresences(
    filter: CollectionSweepFilter<SweeperDefinitions['presences'][0], SweeperDefinitions['presences'][1]>,
  ): number;
  public sweepReactions(
    filter: CollectionSweepFilter<SweeperDefinitions['reactions'][0], SweeperDefinitions['reactions'][1]>,
  ): number;
  public sweepStageInstnaces(
    filter: CollectionSweepFilter<SweeperDefinitions['stageInstances'][0], SweeperDefinitions['stageInstances'][1]>,
  ): number;
  public sweepStickers(
    filter: CollectionSweepFilter<SweeperDefinitions['stickers'][0], SweeperDefinitions['stickers'][1]>,
  ): number;
  public sweepThreadMembers(
    filter: CollectionSweepFilter<SweeperDefinitions['threadMembers'][0], SweeperDefinitions['threadMembers'][1]>,
  ): number;
  public sweepThreads(
    filter: CollectionSweepFilter<SweeperDefinitions['threads'][0], SweeperDefinitions['threads'][1]>,
  ): number;
  public sweepUsers(
    filter: CollectionSweepFilter<SweeperDefinitions['users'][0], SweeperDefinitions['users'][1]>,
  ): number;
  public sweepVoiceStates(
    filter: CollectionSweepFilter<SweeperDefinitions['voiceStates'][0], SweeperDefinitions['voiceStates'][1]>,
  ): number;

  public static archivedThreadSweepFilter(
    lifetime?: number,
  ): GlobalSweepFilter<SweeperDefinitions['threads'][0], SweeperDefinitions['threads'][1]>;
  public static expiredInviteSweepFilter(
    lifetime?: number,
  ): GlobalSweepFilter<SweeperDefinitions['invites'][0], SweeperDefinitions['invites'][1]>;
  public static filterByLifetime<K, V>(options?: LifetimeFilterOptions<K, V>): GlobalSweepFilter<K, V>;
  public static outdatedMessageSweepFilter(
    lifetime?: number,
  ): GlobalSweepFilter<SweeperDefinitions['messages'][0], SweeperDefinitions['messages'][1]>;
}

export type SystemChannelFlagsString = keyof typeof GuildSystemChannelFlags;

export class SystemChannelFlagsBitField extends BitField<SystemChannelFlagsString> {
  public static Flags: typeof GuildSystemChannelFlags;
  public static resolve(bit?: BitFieldResolvable<SystemChannelFlagsString, number>): number;
}

export class Team extends Base {
  private constructor(client: Client, data: RawTeamData);
  public id: Snowflake;
  public name: string;
  public icon: string | null;
  public ownerId: Snowflake | null;
  public members: Collection<Snowflake, TeamMember>;

  public readonly owner: TeamMember | null;
  public readonly createdAt: Date;
  public readonly createdTimestamp: number;

  public iconURL(options?: ImageURLOptions): string | null;
  public toJSON(): unknown;
  public toString(): string;
}

export class TeamMember extends Base {
  private constructor(team: Team, data: RawTeamMemberData);
  public team: Team;
  public readonly id: Snowflake;
  public permissions: string[];
  public membershipState: TeamMemberMembershipState;
  public user: User;

  public toString(): UserMention;
}

export class TextChannel extends BaseGuildTextChannel {
  public rateLimitPerUser: number;
  public threads: ThreadManager<AllowedThreadTypeForTextChannel>;
  public type: ChannelType.GuildText;
  public setRateLimitPerUser(rateLimitPerUser: number, reason?: string): Promise<TextChannel>;
}

export class ThreadChannel extends TextBasedChannelMixin(Channel) {
  private constructor(guild: Guild, data?: RawThreadChannelData, client?: Client, fromInteraction?: boolean);
  public archived: boolean | null;
  public readonly archivedAt: Date | null;
  public archiveTimestamp: number | null;
  public readonly createdAt: Date | null;
  private _createdTimestamp: number | null;
  public readonly createdTimestamp: number | null;
  public autoArchiveDuration: ThreadAutoArchiveDuration | null;
  public readonly editable: boolean;
  public guild: Guild;
  public guildId: Snowflake;
  public readonly guildMembers: Collection<Snowflake, GuildMember>;
  public invitable: boolean | null;
  public readonly joinable: boolean;
  public readonly joined: boolean;
  public locked: boolean | null;
  public readonly manageable: boolean;
  public readonly viewable: boolean;
  public readonly sendable: boolean;
  public memberCount: number | null;
  public messageCount: number | null;
  public messages: MessageManager;
  public members: ThreadMemberManager;
  public name: string;
  public ownerId: Snowflake | null;
  public readonly parent: TextChannel | NewsChannel | null;
  public parentId: Snowflake | null;
  public rateLimitPerUser: number | null;
  public type: ThreadChannelType;
  public readonly unarchivable: boolean;
  public isPrivate(): this is this & {
    readonly createdTimestamp: number;
    readonly createdAt: Date;
    type: ChannelType.GuildPrivateThread;
  };
  public delete(reason?: string): Promise<this>;
  public edit(data: ThreadEditData, reason?: string): Promise<ThreadChannel>;
  public join(): Promise<ThreadChannel>;
  public leave(): Promise<ThreadChannel>;
  public permissionsFor(memberOrRole: GuildMember | Role, checkAdmin?: boolean): Readonly<PermissionsBitField>;
  public permissionsFor(
    memberOrRole: GuildMemberResolvable | RoleResolvable,
    checkAdmin?: boolean,
  ): Readonly<PermissionsBitField> | null;
  public fetchOwner(options?: BaseFetchOptions): Promise<ThreadMember | null>;
  public fetchStarterMessage(options?: BaseFetchOptions): Promise<Message>;
  public setArchived(archived?: boolean, reason?: string): Promise<ThreadChannel>;
  public setAutoArchiveDuration(
    autoArchiveDuration: ThreadAutoArchiveDuration,
    reason?: string,
  ): Promise<ThreadChannel>;
  public setInvitable(invitable?: boolean, reason?: string): Promise<ThreadChannel>;
  public setLocked(locked?: boolean, reason?: string): Promise<ThreadChannel>;
  public setName(name: string, reason?: string): Promise<ThreadChannel>;
  public setRateLimitPerUser(rateLimitPerUser: number, reason?: string): Promise<ThreadChannel>;
}

export class ThreadMember extends Base {
  private constructor(thread: ThreadChannel, data?: RawThreadMemberData);
  public flags: ThreadMemberFlagsBitField;
  public readonly guildMember: GuildMember | null;
  public id: Snowflake;
  public readonly joinedAt: Date | null;
  public joinedTimestamp: number | null;
  public readonly manageable: boolean;
  public thread: ThreadChannel;
  public readonly user: User | null;
  public remove(reason?: string): Promise<ThreadMember>;
}

export type ThreadMemberFlagsString = keyof typeof ThreadMemberFlags;

export class ThreadMemberFlagsBitField extends BitField<ThreadMemberFlagsString> {
  public static Flags: typeof ThreadMemberFlags;
  public static resolve(bit?: BitFieldResolvable<ThreadMemberFlagsString, number>): number;
}

export class Typing extends Base {
  private constructor(channel: TextBasedChannel, user: PartialUser, data?: RawTypingData);
  public channel: TextBasedChannel;
  public user: PartialUser;
  public startedTimestamp: number;
  public readonly startedAt: Date;
  public readonly guild: Guild | null;
  public readonly member: GuildMember | null;
  public inGuild(): this is this & {
    channel: TextChannel | NewsChannel | ThreadChannel;
    readonly guild: Guild;
  };
}

export class User extends PartialTextBasedChannel(Base) {
  protected constructor(client: Client, data: RawUserData);
  private _equals(user: APIUser): boolean;

  public accentColor: number | null | undefined;
  public avatar: string | null;
  public banner: string | null | undefined;
  public bot: boolean;
  public readonly createdAt: Date;
  public readonly createdTimestamp: number;
  public discriminator: string;
  public readonly defaultAvatarURL: string;
  public readonly dmChannel: DMChannel | null;
  public flags: Readonly<UserFlagsBitField> | null;
  public readonly hexAccentColor: HexColorString | null | undefined;
  public id: Snowflake;
  public readonly partial: false;
  public system: boolean;
  public readonly tag: string;
  public username: string;
  public avatarURL(options?: ImageURLOptions): string | null;
  public bannerURL(options?: ImageURLOptions): string | null | undefined;
  public createDM(force?: boolean): Promise<DMChannel>;
  public deleteDM(): Promise<DMChannel>;
  public displayAvatarURL(options?: ImageURLOptions): string;
  public equals(user: User): boolean;
  public fetch(force?: boolean): Promise<User>;
  public fetchFlags(force?: boolean): Promise<UserFlagsBitField>;
  public toString(): UserMention;
}

export class UserContextMenuCommandInteraction<
  Cached extends CacheType = CacheType,
> extends ContextMenuCommandInteraction<Cached> {
  public readonly targetUser: User;
  public readonly targetMember: CacheTypeReducer<Cached, GuildMember, APIInteractionGuildMember>;
  public inGuild(): this is UserContextMenuCommandInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is UserContextMenuCommandInteraction<'cached'>;
  public inRawGuild(): this is UserContextMenuCommandInteraction<'raw'>;
}

export type UserFlagsString = keyof typeof UserFlags;

export class UserFlagsBitField extends BitField<UserFlagsString> {
  public static Flags: typeof UserFlags;
  public static resolve(bit?: BitFieldResolvable<UserFlagsString, number>): number;
}

export class Util extends null {
  private constructor();
  public static basename(path: string, ext?: string): string;
  public static cleanContent(str: string, channel: TextBasedChannel): string;
  public static cloneObject(obj: unknown): unknown;
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
  public static fetchRecommendedShards(token: string, options?: FetchRecommendedShardsOptions): Promise<number>;
  public static flatten(obj: unknown, ...props: Record<string, boolean | string>[]): unknown;
  public static makeError(obj: MakeErrorOptions): Error;
  public static makePlainError(err: Error): MakeErrorOptions;
  public static mergeDefault(def: unknown, given: unknown): unknown;
  public static moveElementInArray(array: unknown[], element: unknown, newIndex: number, offset?: boolean): number;
  public static parseEmoji(text: string): { animated: boolean; name: string; id: Snowflake | null } | null;
  public static resolveColor(color: ColorResolvable): number;
  public static resolvePartialEmoji(emoji: EmojiIdentifierResolvable): Partial<APIPartialEmoji> | null;
  public static verifyString(data: string, error?: typeof Error, errorMessage?: string, allowEmpty?: boolean): string;
  public static setPosition<T extends AnyChannel | Role>(
    item: T,
    position: number,
    relative: boolean,
    sorted: Collection<Snowflake, T>,
    client: Client,
    route: string,
    reason?: string,
  ): Promise<{ id: Snowflake; position: number }[]>;
  public static splitMessage(text: string, options?: SplitOptions): string[];
}

export class Formatters extends null {
  public static blockQuote: typeof blockQuote;
  public static bold: typeof bold;
  public static channelMention: typeof channelMention;
  public static codeBlock: typeof codeBlock;
  public static formatEmoji: typeof formatEmoji;
  public static hideLinkEmbed: typeof hideLinkEmbed;
  public static hyperlink: typeof hyperlink;
  public static inlineCode: typeof inlineCode;
  public static italic: typeof italic;
  public static memberNicknameMention: typeof memberNicknameMention;
  public static quote: typeof quote;
  public static roleMention: typeof roleMention;
  public static spoiler: typeof spoiler;
  public static strikethrough: typeof strikethrough;
  public static time: typeof time;
  public static TimestampStyles: typeof TimestampStyles;
  public static TimestampStylesString: TimestampStylesString;
  public static underscore: typeof underscore;
  public static userMention: typeof userMention;
}

export class VoiceChannel extends BaseGuildVoiceChannel {
  public readonly speakable: boolean;
  public type: ChannelType.GuildVoice;
  public setBitrate(bitrate: number, reason?: string): Promise<VoiceChannel>;
  public setUserLimit(userLimit: number, reason?: string): Promise<VoiceChannel>;
}

export class VoiceRegion {
  private constructor(data: RawVoiceRegionData);
  public custom: boolean;
  public deprecated: boolean;
  public id: string;
  public name: string;
  public optimal: boolean;
  public toJSON(): unknown;
}

export class VoiceState extends Base {
  private constructor(guild: Guild, data: RawVoiceStateData);
  public readonly channel: VoiceBasedChannel | null;
  public channelId: Snowflake | null;
  public readonly deaf: boolean | null;
  public guild: Guild;
  public id: Snowflake;
  public readonly member: GuildMember | null;
  public readonly mute: boolean | null;
  public selfDeaf: boolean | null;
  public selfMute: boolean | null;
  public serverDeaf: boolean | null;
  public serverMute: boolean | null;
  public sessionId: string | null;
  public streaming: boolean | null;
  public selfVideo: boolean | null;
  public suppress: boolean | null;
  public requestToSpeakTimestamp: number | null;

  public setDeaf(deaf?: boolean, reason?: string): Promise<GuildMember>;
  public setMute(mute?: boolean, reason?: string): Promise<GuildMember>;
  public disconnect(reason?: string): Promise<GuildMember>;
  public setChannel(channel: GuildVoiceChannelResolvable | null, reason?: string): Promise<GuildMember>;
  public setRequestToSpeak(request?: boolean): Promise<void>;
  public setSuppressed(suppressed?: boolean): Promise<void>;
}

export class Webhook extends WebhookMixin() {
  private constructor(client: Client, data?: RawWebhookData);
  public avatar: string;
  public avatarURL(options?: ImageURLOptions): string | null;
  public channelId: Snowflake;
  public client: Client;
  public guildId: Snowflake;
  public name: string;
  public owner: User | APIUser | null;
  public sourceGuild: Guild | APIPartialGuild | null;
  public sourceChannel: NewsChannel | APIPartialChannel | null;
  public token: string | null;
  public type: WebhookType;
  public applicationId: Snowflake | null;
  public isUserCreated(): this is this & {
    type: WebhookType.Incoming;
    applicationId: null;
    owner: User | APIUser;
  };
  public isApplicationCreated(): this is this & {
    type: WebhookType.Application;
    applicationId: Snowflake;
    owner: User | APIUser;
  };
  public isIncoming(): this is this & {
    type: WebhookType.Incoming;
    token: string;
  };
  public isChannelFollower(): this is this & {
    type: WebhookType.ChannelFollower;
    sourceGuild: Guild | APIPartialGuild;
    sourceChannel: NewsChannel | APIPartialChannel;
    token: null;
    applicationId: null;
    owner: User | APIUser;
  };
}

export class WebhookClient extends WebhookMixin(BaseClient) {
  public constructor(data: WebhookClientData, options?: WebhookClientOptions);
  public client: this;
  public options: WebhookClientOptions;
  public token: string;
  public editMessage(
    message: MessageResolvable,
    options: string | MessagePayload | WebhookEditMessageOptions,
  ): Promise<APIMessage>;
  public fetchMessage(message: Snowflake, options?: WebhookFetchMessageOptions): Promise<APIMessage>;
  public send(options: string | MessagePayload | WebhookMessageOptions): Promise<APIMessage>;
}

export class WebSocketManager extends EventEmitter {
  private constructor(client: Client);
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

  public on(event: WSEventType, listener: (data: any, shardId: number) => void): this;
  public once(event: WSEventType, listener: (data: any, shardId: number) => void): this;

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

export interface WebSocketShardEvents {
  ready: [];
  resumed: [];
  invalidSession: [];
  close: [event: CloseEvent];
  allReady: [unavailableGuilds?: Set<Snowflake>];
}

export class WebSocketShard extends EventEmitter {
  private constructor(manager: WebSocketManager, id: number);
  private sequence: number;
  private closeSequence: number;
  private sessionId: string | null;
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

  public send(data: unknown, important?: boolean): void;

  public on<K extends keyof WebSocketShardEvents>(
    event: K,
    listener: (...args: WebSocketShardEvents[K]) => Awaitable<void>,
  ): this;

  public once<K extends keyof WebSocketShardEvents>(
    event: K,
    listener: (...args: WebSocketShardEvents[K]) => Awaitable<void>,
  ): this;
}

export class Widget extends Base {
  private constructor(client: Client, data: RawWidgetData);
  private _patch(data: RawWidgetData): void;
  public fetch(): Promise<Widget>;
  public id: Snowflake;
  public instantInvite?: string;
  public channels: Collection<Snowflake, WidgetChannel>;
  public members: Collection<string, WidgetMember>;
  public presenceCount: number;
}

export class WidgetMember extends Base {
  private constructor(client: Client, data: RawWidgetMemberData);
  public id: string;
  public username: string;
  public discriminator: string;
  public avatar: string | null;
  public status: PresenceStatus;
  public deaf: boolean | null;
  public mute: boolean | null;
  public selfDeaf: boolean | null;
  public selfMute: boolean | null;
  public suppress: boolean | null;
  public channelId: Snowflake | null;
  public avatarURL: string;
  public activity: WidgetActivity | null;
}

export class WelcomeChannel extends Base {
  private constructor(guild: Guild, data: RawWelcomeChannelData);
  private _emoji: Omit<APIEmoji, 'animated'>;
  public channelId: Snowflake;
  public guild: Guild | InviteGuild;
  public description: string;
  public readonly channel: TextChannel | NewsChannel | StoreChannel | null;
  public readonly emoji: GuildEmoji | Emoji;
}

export class WelcomeScreen extends Base {
  private constructor(guild: Guild, data: RawWelcomeScreenData);
  public readonly enabled: boolean;
  public guild: Guild | InviteGuild;
  public description: string | null;
  public welcomeChannels: Collection<Snowflake, WelcomeChannel>;
}

//#endregion

//#region Constants

export const Constants: {
  Package: {
    name: string;
    version: string;
    description: string;
    license: string;
    main: string;
    types: string;
    homepage: string;
    keywords: string[];
    bugs: { url: string };
    repository: { type: string; url: string };
    scripts: Record<string, string>;
    engines: Record<string, string>;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    [key: string]: unknown;
  };
  UserAgent: string;
  WSCodes: {
    1000: 'WS_CLOSE_REQUESTED';
    4004: 'TOKEN_INVALID';
    4010: 'SHARDING_INVALID';
    4011: 'SHARDING_REQUIRED';
  };
  Events: ConstantsEvents;
  ShardEvents: ConstantsShardEvents;
  WSEvents: {
    [K in WSEventType]: K;
  };
  Colors: ConstantsColors;
  Status: ConstantsStatus;
  Opcodes: ConstantsOpcodes;
  ThreadChannelTypes: ThreadChannelType[];
  TextBasedChannelTypes: TextBasedChannelTypes[];
  VoiceBasedChannelTypes: VoiceBasedChannelTypes[];
  InviteScopes: InviteScope[];
  MessageTypes: MessageType[];
  SystemMessageTypes: SystemMessageType[];
};

export const version: string;

//#endregion

//#region Managers

export abstract class BaseManager {
  protected constructor(client: Client);
  public readonly client: Client;
}

export abstract class DataManager<K, Holds, R> extends BaseManager {
  protected constructor(client: Client, holds: Constructable<Holds>);
  public readonly holds: Constructable<Holds>;
  public readonly cache: Collection<K, Holds>;
  public resolve(resolvable: Holds): Holds;
  public resolve(resolvable: R): Holds | null;
  public resolveId(resolvable: K | Holds): K;
  public resolveId(resolvable: R): K | null;
  public valueOf(): Collection<K, Holds>;
}

export abstract class CachedManager<K, Holds, R> extends DataManager<K, Holds, R> {
  protected constructor(client: Client, holds: Constructable<Holds>);
  private _add(data: unknown, cache?: boolean, { id, extras }?: { id: K; extras: unknown[] }): Holds;
}

export type ApplicationCommandDataResolvable = ApplicationCommandData | RESTPostAPIApplicationCommandsJSONBody;

export class ApplicationCommandManager<
  ApplicationCommandScope = ApplicationCommand<{ guild: GuildResolvable }>,
  PermissionsOptionsExtras = { guild: GuildResolvable },
  PermissionsGuildType = null,
> extends CachedManager<Snowflake, ApplicationCommandScope, ApplicationCommandResolvable> {
  protected constructor(client: Client, iterable?: Iterable<unknown>);
  public permissions: ApplicationCommandPermissionsManager<
    { command?: ApplicationCommandResolvable } & PermissionsOptionsExtras,
    { command: ApplicationCommandResolvable } & PermissionsOptionsExtras,
    PermissionsOptionsExtras,
    PermissionsGuildType,
    null
  >;
  private commandPath({ id, guildId }: { id?: Snowflake; guildId?: Snowflake }): string;
  public create(command: ApplicationCommandDataResolvable, guildId?: Snowflake): Promise<ApplicationCommandScope>;
  public delete(command: ApplicationCommandResolvable, guildId?: Snowflake): Promise<ApplicationCommandScope | null>;
  public edit(
    command: ApplicationCommandResolvable,
    data: ApplicationCommandDataResolvable,
  ): Promise<ApplicationCommandScope>;
  public edit(
    command: ApplicationCommandResolvable,
    data: ApplicationCommandDataResolvable,
    guildId: Snowflake,
  ): Promise<ApplicationCommand>;
  public fetch(
    id: Snowflake,
    options: FetchApplicationCommandOptions & { guildId: Snowflake },
  ): Promise<ApplicationCommand>;
  public fetch(options: FetchApplicationCommandOptions): Promise<Collection<string, ApplicationCommandScope>>;
  public fetch(id: Snowflake, options?: FetchApplicationCommandOptions): Promise<ApplicationCommandScope>;
  public fetch(
    id?: Snowflake,
    options?: FetchApplicationCommandOptions,
  ): Promise<Collection<Snowflake, ApplicationCommandScope>>;
  public set(commands: ApplicationCommandDataResolvable[]): Promise<Collection<Snowflake, ApplicationCommandScope>>;
  public set(
    commands: ApplicationCommandDataResolvable[],
    guildId: Snowflake,
  ): Promise<Collection<Snowflake, ApplicationCommand>>;
  private static transformCommand(
    command: ApplicationCommandData,
  ): Omit<APIApplicationCommand, 'id' | 'application_id' | 'guild_id'>;
}

export class ApplicationCommandPermissionsManager<
  BaseOptions,
  FetchSingleOptions,
  FullPermissionsOptions,
  GuildType,
  CommandIdType,
> extends BaseManager {
  private constructor(manager: ApplicationCommandManager | GuildApplicationCommandManager | ApplicationCommand);
  private manager: ApplicationCommandManager | GuildApplicationCommandManager | ApplicationCommand;

  public client: Client;
  public commandId: CommandIdType;
  public guild: GuildType;
  public guildId: Snowflake | null;
  public add(
    options: FetchSingleOptions & { permissions: ApplicationCommandPermissionData[] },
  ): Promise<ApplicationCommandPermissions[]>;
  public has(options: FetchSingleOptions & { permissionId: UserResolvable | RoleResolvable }): Promise<boolean>;
  public fetch(options: FetchSingleOptions): Promise<ApplicationCommandPermissions[]>;
  public fetch(options: BaseOptions): Promise<Collection<Snowflake, ApplicationCommandPermissions[]>>;
  public remove(
    options:
      | (FetchSingleOptions & {
          users: UserResolvable | UserResolvable[];
          roles?: RoleResolvable | RoleResolvable[];
        })
      | (FetchSingleOptions & {
          users?: UserResolvable | UserResolvable[];
          roles: RoleResolvable | RoleResolvable[];
        }),
  ): Promise<ApplicationCommandPermissions[]>;
  public set(
    options: FetchSingleOptions & { permissions: ApplicationCommandPermissionData[] },
  ): Promise<ApplicationCommandPermissions[]>;
  public set(
    options: FullPermissionsOptions & {
      fullPermissions: GuildApplicationCommandPermissionData[];
    },
  ): Promise<Collection<Snowflake, ApplicationCommandPermissions[]>>;
  private permissionsPath(guildId: Snowflake, commandId?: Snowflake): string;
}

export class BaseGuildEmojiManager extends CachedManager<Snowflake, GuildEmoji, EmojiResolvable> {
  protected constructor(client: Client, iterable?: Iterable<RawGuildEmojiData>);
  public resolveIdentifier(emoji: EmojiIdentifierResolvable): string | null;
}

export class ChannelManager extends CachedManager<Snowflake, AnyChannel, ChannelResolvable> {
  private constructor(client: Client, iterable: Iterable<RawChannelData>);
  public fetch(id: Snowflake, options?: FetchChannelOptions): Promise<AnyChannel | null>;
}

export class GuildApplicationCommandManager extends ApplicationCommandManager<ApplicationCommand, {}, Guild> {
  private constructor(guild: Guild, iterable?: Iterable<RawApplicationCommandData>);
  public guild: Guild;
  public create(command: ApplicationCommandDataResolvable): Promise<ApplicationCommand>;
  public delete(command: ApplicationCommandResolvable): Promise<ApplicationCommand | null>;
  public edit(
    command: ApplicationCommandResolvable,
    data: ApplicationCommandDataResolvable,
  ): Promise<ApplicationCommand>;
  public fetch(id: Snowflake, options?: BaseFetchOptions): Promise<ApplicationCommand>;
  public fetch(options: BaseFetchOptions): Promise<Collection<Snowflake, ApplicationCommand>>;
  public fetch(id?: undefined, options?: BaseFetchOptions): Promise<Collection<Snowflake, ApplicationCommand>>;
  public set(commands: ApplicationCommandDataResolvable[]): Promise<Collection<Snowflake, ApplicationCommand>>;
}

export type MappedGuildChannelTypes = {
  [ChannelType.GuildCategory]: CategoryChannel;
} & MappedChannelCategoryTypes;

export type GuildChannelTypes = CategoryChannelType | ChannelType.GuildCategory;

export class GuildChannelManager extends CachedManager<Snowflake, GuildBasedChannel, GuildChannelResolvable> {
  private constructor(guild: Guild, iterable?: Iterable<RawGuildChannelData>);
  public readonly channelCountWithoutThreads: number;
  public guild: Guild;

  public create<T extends Exclude<GuildChannelTypes, ChannelType.GuildStore>>(
    name: string,
    options: GuildChannelCreateOptions & { type: T },
  ): Promise<MappedGuildChannelTypes[T]>;
  /** @deprecated See [Self-serve Game Selling Deprecation](https://support-dev.discord.com/hc/en-us/articles/4414590563479) for more information */
  public create(
    name: string,
    options: GuildChannelCreateOptions & { type: ChannelType.GuildStore },
  ): Promise<StoreChannel>;

  public create(name: string, options?: GuildChannelCreateOptions): Promise<TextChannel>;
  public fetch(id: Snowflake, options?: BaseFetchOptions): Promise<NonThreadGuildBasedChannel | null>;
  public fetch(id?: undefined, options?: BaseFetchOptions): Promise<Collection<Snowflake, NonThreadGuildBasedChannel>>;
  public setPositions(channelPositions: readonly ChannelPosition[]): Promise<Guild>;
  public fetchActiveThreads(cache?: boolean): Promise<FetchedThreads>;
}

export class GuildEmojiManager extends BaseGuildEmojiManager {
  private constructor(guild: Guild, iterable?: Iterable<RawGuildEmojiData>);
  public guild: Guild;
  public create(
    attachment: BufferResolvable | Base64Resolvable,
    name: string,
    options?: GuildEmojiCreateOptions,
  ): Promise<GuildEmoji>;
  public fetch(id: Snowflake, options?: BaseFetchOptions): Promise<GuildEmoji>;
  public fetch(id?: undefined, options?: BaseFetchOptions): Promise<Collection<Snowflake, GuildEmoji>>;
  public delete(emoji: EmojiResolvable, reason?: string): Promise<void>;
  public edit(emoji: EmojiResolvable, data: GuildEmojiEditData, reason?: string): Promise<GuildEmoji>;
}

export class GuildEmojiRoleManager extends DataManager<Snowflake, Role, RoleResolvable> {
  private constructor(emoji: GuildEmoji);
  public emoji: GuildEmoji;
  public guild: Guild;
  public add(
    roleOrRoles: RoleResolvable | readonly RoleResolvable[] | Collection<Snowflake, Role>,
  ): Promise<GuildEmoji>;
  public set(roles: readonly RoleResolvable[] | Collection<Snowflake, Role>): Promise<GuildEmoji>;
  public remove(
    roleOrRoles: RoleResolvable | readonly RoleResolvable[] | Collection<Snowflake, Role>,
  ): Promise<GuildEmoji>;
}

export class GuildManager extends CachedManager<Snowflake, Guild, GuildResolvable> {
  private constructor(client: Client, iterable?: Iterable<RawGuildData>);
  public create(name: string, options?: GuildCreateOptions): Promise<Guild>;
  public fetch(options: Snowflake | FetchGuildOptions): Promise<Guild>;
  public fetch(options?: FetchGuildsOptions): Promise<Collection<Snowflake, OAuth2Guild>>;
}

export class GuildMemberManager extends CachedManager<Snowflake, GuildMember, GuildMemberResolvable> {
  private constructor(guild: Guild, iterable?: Iterable<RawGuildMemberData>);
  public guild: Guild;
  public add(
    user: UserResolvable,
    options: AddGuildMemberOptions & { fetchWhenExisting: false },
  ): Promise<GuildMember | null>;
  public add(user: UserResolvable, options: AddGuildMemberOptions): Promise<GuildMember>;
  public ban(user: UserResolvable, options?: BanOptions): Promise<GuildMember | User | Snowflake>;
  public edit(user: UserResolvable, data: GuildMemberEditData, reason?: string): Promise<void>;
  public fetch(
    options: UserResolvable | FetchMemberOptions | (FetchMembersOptions & { user: UserResolvable }),
  ): Promise<GuildMember>;
  public fetch(options?: FetchMembersOptions): Promise<Collection<Snowflake, GuildMember>>;
  public kick(user: UserResolvable, reason?: string): Promise<GuildMember | User | Snowflake>;
  public list(options?: GuildListMembersOptions): Promise<Collection<Snowflake, GuildMember>>;
  public prune(options: GuildPruneMembersOptions & { dry?: false; count: false }): Promise<null>;
  public prune(options?: GuildPruneMembersOptions): Promise<number>;
  public search(options: GuildSearchMembersOptions): Promise<Collection<Snowflake, GuildMember>>;
  public unban(user: UserResolvable, reason?: string): Promise<User>;
}

export class GuildBanManager extends CachedManager<Snowflake, GuildBan, GuildBanResolvable> {
  private constructor(guild: Guild, iterable?: Iterable<RawGuildBanData>);
  public guild: Guild;
  public create(user: UserResolvable, options?: BanOptions): Promise<GuildMember | User | Snowflake>;
  public fetch(options: UserResolvable | FetchBanOptions): Promise<GuildBan>;
  public fetch(options?: FetchBansOptions): Promise<Collection<Snowflake, GuildBan>>;
  public remove(user: UserResolvable, reason?: string): Promise<User | null>;
}

export class GuildInviteManager extends DataManager<string, Invite, InviteResolvable> {
  private constructor(guild: Guild, iterable?: Iterable<RawInviteData>);
  public guild: Guild;
  public create(channel: GuildInvitableChannelResolvable, options?: CreateInviteOptions): Promise<Invite>;
  public fetch(options: InviteResolvable | FetchInviteOptions): Promise<Invite>;
  public fetch(options?: FetchInvitesOptions): Promise<Collection<string, Invite>>;
  public delete(invite: InviteResolvable, reason?: string): Promise<Invite>;
}

export class GuildScheduledEventManager extends CachedManager<
  Snowflake,
  GuildScheduledEvent,
  GuildScheduledEventResolvable
> {
  private constructor(guild: Guild, iterable?: Iterable<RawGuildScheduledEventData>);
  public guild: Guild;
  public create(options: GuildScheduledEventCreateOptions): Promise<GuildScheduledEvent>;
  public fetch(): Promise<Collection<Snowflake, GuildScheduledEvent>>;
  public fetch<
    T extends GuildScheduledEventResolvable | FetchGuildScheduledEventOptions | FetchGuildScheduledEventsOptions,
  >(options?: T): Promise<GuildScheduledEventManagerFetchResult<T>>;
  public edit<S extends GuildScheduledEventStatus, T extends GuildScheduledEventSetStatusArg<S>>(
    guildScheduledEvent: GuildScheduledEventResolvable,
    options: GuildScheduledEventEditOptions<S, T>,
  ): Promise<GuildScheduledEvent<T>>;
  public delete(guildScheduledEvent: GuildScheduledEventResolvable): Promise<void>;
  public fetchSubscribers<T extends FetchGuildScheduledEventSubscribersOptions>(
    guildScheduledEvent: GuildScheduledEventResolvable,
    options?: T,
  ): Promise<GuildScheduledEventManagerFetchSubscribersResult<T>>;
}

export class GuildStickerManager extends CachedManager<Snowflake, Sticker, StickerResolvable> {
  private constructor(guild: Guild, iterable?: Iterable<RawStickerData>);
  public guild: Guild;
  public create(
    file: BufferResolvable | Stream | FileOptions | MessageAttachment,
    name: string,
    tags: string,
    options?: GuildStickerCreateOptions,
  ): Promise<Sticker>;
  public edit(sticker: StickerResolvable, data?: GuildStickerEditData, reason?: string): Promise<Sticker>;
  public delete(sticker: StickerResolvable, reason?: string): Promise<void>;
  public fetch(id: Snowflake, options?: BaseFetchOptions): Promise<Sticker>;
  public fetch(id?: Snowflake, options?: BaseFetchOptions): Promise<Collection<Snowflake, Sticker>>;
}

export class GuildMemberRoleManager extends DataManager<Snowflake, Role, RoleResolvable> {
  private constructor(member: GuildMember);
  public readonly hoist: Role | null;
  public readonly icon: Role | null;
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
}

export class MessageManager extends CachedManager<Snowflake, Message, MessageResolvable> {
  private constructor(channel: TextBasedChannel, iterable?: Iterable<RawMessageData>);
  public channel: TextBasedChannel;
  public cache: Collection<Snowflake, Message>;
  public crosspost(message: MessageResolvable): Promise<Message>;
  public delete(message: MessageResolvable): Promise<void>;
  public edit(message: MessageResolvable, options: string | MessagePayload | MessageEditOptions): Promise<Message>;
  public fetch(message: Snowflake, options?: BaseFetchOptions): Promise<Message>;
  public fetch(
    options?: ChannelLogsQueryOptions,
    cacheOptions?: BaseFetchOptions,
  ): Promise<Collection<Snowflake, Message>>;
  public fetchPinned(cache?: boolean): Promise<Collection<Snowflake, Message>>;
  public react(message: MessageResolvable, emoji: EmojiIdentifierResolvable): Promise<void>;
  public pin(message: MessageResolvable): Promise<void>;
  public unpin(message: MessageResolvable): Promise<void>;
}

export class PermissionOverwriteManager extends CachedManager<
  Snowflake,
  PermissionOverwrites,
  PermissionOverwriteResolvable
> {
  private constructor(client: Client, iterable?: Iterable<RawPermissionOverwriteData>);
  public set(
    overwrites: readonly OverwriteResolvable[] | Collection<Snowflake, OverwriteResolvable>,
    reason?: string,
  ): Promise<NonThreadGuildBasedChannel>;
  private upsert(
    userOrRole: RoleResolvable | UserResolvable,
    options: PermissionOverwriteOptions,
    overwriteOptions?: GuildChannelOverwriteOptions,
    existing?: PermissionOverwrites,
  ): Promise<NonThreadGuildBasedChannel>;
  public create(
    userOrRole: RoleResolvable | UserResolvable,
    options: PermissionOverwriteOptions,
    overwriteOptions?: GuildChannelOverwriteOptions,
  ): Promise<NonThreadGuildBasedChannel>;
  public edit(
    userOrRole: RoleResolvable | UserResolvable,
    options: PermissionOverwriteOptions,
    overwriteOptions?: GuildChannelOverwriteOptions,
  ): Promise<NonThreadGuildBasedChannel>;
  public delete(userOrRole: RoleResolvable | UserResolvable, reason?: string): Promise<NonThreadGuildBasedChannel>;
}

export class PresenceManager extends CachedManager<Snowflake, Presence, PresenceResolvable> {
  private constructor(client: Client, iterable?: Iterable<RawPresenceData>);
}

export class ReactionManager extends CachedManager<Snowflake | string, MessageReaction, MessageReactionResolvable> {
  private constructor(message: Message, iterable?: Iterable<RawMessageReactionData>);
  public message: Message;
  public removeAll(): Promise<Message>;
}

export class ReactionUserManager extends CachedManager<Snowflake, User, UserResolvable> {
  private constructor(reaction: MessageReaction, iterable?: Iterable<RawUserData>);
  public reaction: MessageReaction;
  public fetch(options?: FetchReactionUsersOptions): Promise<Collection<Snowflake, User>>;
  public remove(user?: UserResolvable): Promise<MessageReaction>;
}

export class RoleManager extends CachedManager<Snowflake, Role, RoleResolvable> {
  private constructor(guild: Guild, iterable?: Iterable<RawRoleData>);
  public readonly everyone: Role;
  public readonly highest: Role;
  public guild: Guild;
  public readonly premiumSubscriberRole: Role | null;
  public botRoleFor(user: UserResolvable): Role | null;
  public fetch(id: Snowflake, options?: BaseFetchOptions): Promise<Role | null>;
  public fetch(id?: undefined, options?: BaseFetchOptions): Promise<Collection<Snowflake, Role>>;
  public create(options?: CreateRoleOptions): Promise<Role>;
  public edit(role: RoleResolvable, options: RoleData, reason?: string): Promise<Role>;
  public delete(role: RoleResolvable, reason?: string): Promise<void>;
  public setPositions(rolePositions: readonly RolePosition[]): Promise<Guild>;
  public comparePositions(role1: RoleResolvable, role2: RoleResolvable): number;
}

export class StageInstanceManager extends CachedManager<Snowflake, StageInstance, StageInstanceResolvable> {
  private constructor(guild: Guild, iterable?: Iterable<RawStageInstanceData>);
  public guild: Guild;
  public create(channel: StageChannelResolvable, options: StageInstanceCreateOptions): Promise<StageInstance>;
  public fetch(channel: StageChannelResolvable, options?: BaseFetchOptions): Promise<StageInstance>;
  public edit(channel: StageChannelResolvable, options: StageInstanceEditOptions): Promise<StageInstance>;
  public delete(channel: StageChannelResolvable): Promise<void>;
}

export class ThreadManager<AllowedThreadType> extends CachedManager<Snowflake, ThreadChannel, ThreadChannelResolvable> {
  private constructor(channel: TextChannel | NewsChannel, iterable?: Iterable<RawThreadChannelData>);
  public channel: TextChannel | NewsChannel;
  public create(options: ThreadCreateOptions<AllowedThreadType>): Promise<ThreadChannel>;
  public fetch(options: ThreadChannelResolvable, cacheOptions?: BaseFetchOptions): Promise<ThreadChannel | null>;
  public fetch(options?: FetchThreadsOptions, cacheOptions?: { cache?: boolean }): Promise<FetchedThreads>;
  public fetchArchived(options?: FetchArchivedThreadOptions, cache?: boolean): Promise<FetchedThreads>;
  public fetchActive(cache?: boolean): Promise<FetchedThreads>;
}

export class ThreadMemberManager extends CachedManager<Snowflake, ThreadMember, ThreadMemberResolvable> {
  private constructor(thread: ThreadChannel, iterable?: Iterable<RawThreadMemberData>);
  public thread: ThreadChannel;
  public add(member: UserResolvable | '@me', reason?: string): Promise<Snowflake>;
  public fetch(options?: ThreadMemberFetchOptions): Promise<ThreadMember>;
  public fetch(cache?: boolean): Promise<Collection<Snowflake, ThreadMember>>;
  public remove(id: Snowflake | '@me', reason?: string): Promise<Snowflake>;
}

export class UserManager extends CachedManager<Snowflake, User, UserResolvable> {
  private constructor(client: Client, iterable?: Iterable<RawUserData>);
  private dmChannel(userId: Snowflake): DMChannel | null;
  public createDM(user: UserResolvable, options?: BaseFetchOptions): Promise<DMChannel>;
  public deleteDM(user: UserResolvable): Promise<DMChannel>;
  public fetch(user: UserResolvable, options?: BaseFetchOptions): Promise<User>;
  public fetchFlags(user: UserResolvable, options?: BaseFetchOptions): Promise<UserFlagsBitField>;
  public send(user: UserResolvable, options: string | MessagePayload | MessageOptions): Promise<Message>;
}

export class VoiceStateManager extends CachedManager<Snowflake, VoiceState, typeof VoiceState> {
  private constructor(guild: Guild, iterable?: Iterable<RawVoiceStateData>);
  public guild: Guild;
}

//#endregion

//#region Mixins

// Model the TextBasedChannel mixin system, allowing application of these fields
// to the classes that use these methods without having to manually add them
// to each of those classes

export type Constructable<T> = abstract new (...args: any[]) => T;
export function PartialTextBasedChannel<T>(Base?: Constructable<T>): Constructable<T & PartialTextBasedChannelFields>;
export function TextBasedChannelMixin<T, I extends keyof TextBasedChannelFields = never>(
  Base?: Constructable<T>,
  ignore?: I[],
): Constructable<T & Omit<TextBasedChannelFields, I>>;

export interface PartialTextBasedChannelFields {
  send(options: string | MessagePayload | MessageOptions): Promise<Message>;
}

export interface TextBasedChannelFields extends PartialTextBasedChannelFields {
  lastMessageId: Snowflake | null;
  readonly lastMessage: Message | null;
  lastPinTimestamp: number | null;
  readonly lastPinAt: Date | null;
  awaitMessageComponent<T extends ComponentType = ComponentType.ActionRow>(
    options?: AwaitMessageCollectorOptionsParams<T, true>,
  ): Promise<MappedInteractionTypes[T]>;
  awaitMessages(options?: AwaitMessagesOptions): Promise<Collection<Snowflake, Message>>;
  bulkDelete(
    messages: Collection<Snowflake, Message> | readonly MessageResolvable[] | number,
    filterOld?: boolean,
  ): Promise<Collection<Snowflake, Message>>;
  createMessageComponentCollector<T extends ComponentType = ComponentType.ActionRow>(
    options?: MessageChannelCollectorOptionsParams<T, true>,
  ): InteractionCollector<MappedInteractionTypes[T]>;
  createMessageCollector(options?: MessageCollectorOptions): MessageCollector;
  sendTyping(): Promise<void>;
}

export function PartialWebhookMixin<T>(Base?: Constructable<T>): Constructable<T & PartialWebhookFields>;
export function WebhookMixin<T>(Base?: Constructable<T>): Constructable<T & WebhookFields>;

export interface PartialWebhookFields {
  id: Snowflake;
  readonly url: string;
  deleteMessage(message: MessageResolvable | APIMessage | '@original', threadId?: Snowflake): Promise<void>;
  editMessage(
    message: MessageResolvable | '@original',
    options: string | MessagePayload | WebhookEditMessageOptions,
  ): Promise<Message | APIMessage>;
  fetchMessage(message: Snowflake | '@original', options?: WebhookFetchMessageOptions): Promise<Message | APIMessage>;
  send(options: string | MessagePayload | Omit<WebhookMessageOptions, 'flags'>): Promise<Message | APIMessage>;
}

export interface WebhookFields extends PartialWebhookFields {
  readonly createdAt: Date;
  readonly createdTimestamp: number;
  delete(reason?: string): Promise<void>;
  edit(options: WebhookEditData, reason?: string): Promise<Webhook>;
  sendSlackMessage(body: unknown): Promise<boolean>;
}

//#endregion

//#region Typedefs

export type ActivitiesOptions = Omit<ActivityOptions, 'shardId'>;

export interface ActivityOptions {
  name?: string;
  url?: string;
  type?: Exclude<ActivityType, ActivityType.Custom>;
  shardId?: number | readonly number[];
}

export type ActivityPlatform = 'desktop' | 'samsung' | 'xbox';

export interface AddGuildMemberOptions {
  accessToken: string;
  nick?: string;
  roles?: Collection<Snowflake, Role> | RoleResolvable[];
  mute?: boolean;
  deaf?: boolean;
  force?: boolean;
  fetchWhenExisting?: boolean;
}

export type AllowedPartial = User | Channel | GuildMember | Message | MessageReaction;

export type AllowedThreadTypeForNewsChannel = ChannelType.GuildNewsThread;

export type AllowedThreadTypeForTextChannel = ChannelType.GuildPublicThread | ChannelType.GuildPrivateThread;

export interface BaseApplicationCommandData {
  name: string;
  defaultPermission?: boolean;
}

export type CommandOptionDataTypeResolvable = ApplicationCommandOptionType;

export type CommandOptionChannelResolvableType = ApplicationCommandOptionType.Channel;

export type CommandOptionChoiceResolvableType =
  | ApplicationCommandOptionType.String
  | CommandOptionNumericResolvableType;

export type CommandOptionNumericResolvableType =
  | ApplicationCommandOptionType.Number
  | ApplicationCommandOptionType.Integer;

export type CommandOptionSubOptionResolvableType =
  | ApplicationCommandOptionType.Subcommand
  | ApplicationCommandOptionType.SubcommandGroup;

export type CommandOptionNonChoiceResolvableType = Exclude<
  CommandOptionDataTypeResolvable,
  CommandOptionChoiceResolvableType | CommandOptionSubOptionResolvableType | CommandOptionChannelResolvableType
>;

export interface BaseApplicationCommandOptionsData {
  name: string;
  description: string;
  required?: boolean;
  autocomplete?: never;
}

export interface UserApplicationCommandData extends BaseApplicationCommandData {
  type: ApplicationCommandType.User;
}

export interface MessageApplicationCommandData extends BaseApplicationCommandData {
  type: ApplicationCommandType.Message;
}

export interface ChatInputApplicationCommandData extends BaseApplicationCommandData {
  description: string;
  type?: ApplicationCommandType.ChatInput;
  options?: ApplicationCommandOptionData[];
}

export type ApplicationCommandData =
  | UserApplicationCommandData
  | MessageApplicationCommandData
  | ChatInputApplicationCommandData;

export interface ApplicationCommandChannelOptionData extends BaseApplicationCommandOptionsData {
  type: CommandOptionChannelResolvableType;
  channelTypes?: ChannelType[];
  channel_types?: ChannelType[];
}

export interface ApplicationCommandChannelOption extends BaseApplicationCommandOptionsData {
  type: ApplicationCommandOptionType.Channel;
  channelTypes?: ChannelType[];
}

export interface ApplicationCommandAutocompleteOption extends Omit<BaseApplicationCommandOptionsData, 'autocomplete'> {
  type:
    | ApplicationCommandOptionType.String
    | ApplicationCommandOptionType.Number
    | ApplicationCommandOptionType.Integer;
  autocomplete: true;
}

export interface ApplicationCommandChoicesData extends Omit<BaseApplicationCommandOptionsData, 'autocomplete'> {
  type: CommandOptionChoiceResolvableType;
  choices?: ApplicationCommandOptionChoice[];
  autocomplete?: false;
}

export interface ApplicationCommandChoicesOption extends Omit<BaseApplicationCommandOptionsData, 'autocomplete'> {
  type: Exclude<CommandOptionChoiceResolvableType, ApplicationCommandOptionType>;
  choices?: ApplicationCommandOptionChoice[];
  autocomplete?: false;
}

export interface ApplicationCommandNumericOptionData extends ApplicationCommandChoicesData {
  type: CommandOptionNumericResolvableType;
  minValue?: number;
  min_value?: number;
  maxValue?: number;
  max_value?: number;
}

export interface ApplicationCommandNumericOption extends ApplicationCommandChoicesOption {
  type: Exclude<CommandOptionNumericResolvableType, ApplicationCommandOptionType>;
  minValue?: number;
  maxValue?: number;
}

export interface ApplicationCommandSubGroupData extends Omit<BaseApplicationCommandOptionsData, 'required'> {
  type: ApplicationCommandOptionType.SubcommandGroup;
  options?: ApplicationCommandSubCommandData[];
}

export interface ApplicationCommandSubGroup extends Omit<BaseApplicationCommandOptionsData, 'required'> {
  type: ApplicationCommandOptionType.SubcommandGroup;
  options?: ApplicationCommandSubCommand[];
}

export interface ApplicationCommandSubCommandData extends Omit<BaseApplicationCommandOptionsData, 'required'> {
  type: ApplicationCommandOptionType.Subcommand;
  options?: (
    | ApplicationCommandChoicesData
    | ApplicationCommandNonOptionsData
    | ApplicationCommandChannelOptionData
    | ApplicationCommandAutocompleteOption
    | ApplicationCommandNumericOptionData
  )[];
}

export interface ApplicationCommandSubCommand extends Omit<BaseApplicationCommandOptionsData, 'required'> {
  type: ApplicationCommandOptionType.Subcommand;
  options?: (ApplicationCommandChoicesOption | ApplicationCommandNonOptions | ApplicationCommandChannelOption)[];
}

export interface ApplicationCommandNonOptionsData extends BaseApplicationCommandOptionsData {
  type: CommandOptionNonChoiceResolvableType;
}

export interface ApplicationCommandNonOptions extends BaseApplicationCommandOptionsData {
  type: Exclude<CommandOptionNonChoiceResolvableType, ApplicationCommandOptionType>;
}

export type ApplicationCommandOptionData =
  | ApplicationCommandSubGroupData
  | ApplicationCommandNonOptionsData
  | ApplicationCommandChannelOptionData
  | ApplicationCommandChoicesData
  | ApplicationCommandAutocompleteOption
  | ApplicationCommandNumericOptionData
  | ApplicationCommandSubCommandData;

export type ApplicationCommandOption =
  | ApplicationCommandSubGroup
  | ApplicationCommandNonOptions
  | ApplicationCommandChannelOption
  | ApplicationCommandChoicesOption
  | ApplicationCommandNumericOption
  | ApplicationCommandSubCommand;

export interface ApplicationCommandOptionChoice {
  name: string;
  value: string | number;
}

export interface ApplicationCommandPermissionData {
  id: Snowflake;
  type: ApplicationCommandPermissionType;
  permission: boolean;
}

export interface ApplicationCommandPermissions extends ApplicationCommandPermissionData {
  type: ApplicationCommandPermissionType;
}

export type ApplicationCommandResolvable = ApplicationCommand | Snowflake;

export type ApplicationFlagsString = keyof typeof ApplicationFlags;

export interface AuditLogChange {
  key: APIAuditLogChange['key'];
  old?: APIAuditLogChange['old_value'];
  new?: APIAuditLogChange['new_value'];
}

export type Awaitable<T> = T | PromiseLike<T>;

export type AwaitMessageComponentOptions<T extends MessageComponentInteraction> = Omit<
  MessageComponentCollectorOptions<T>,
  'max' | 'maxComponents' | 'maxUsers'
>;

export interface AwaitMessagesOptions extends MessageCollectorOptions {
  errors?: string[];
}

export interface AwaitReactionsOptions extends ReactionCollectorOptions {
  errors?: string[];
}

export interface BanOptions {
  days?: number;
  reason?: string;
}

export type Base64Resolvable = Buffer | Base64String;

export type Base64String = string;

export interface BaseFetchOptions {
  cache?: boolean;
  force?: boolean;
}

export interface ThreadMemberFetchOptions extends BaseFetchOptions {
  member?: UserResolvable;
}

export interface BaseMessageComponentOptions {
  type?: ComponentType;
}

export type BitFieldResolvable<T extends string, N extends number | bigint> =
  | RecursiveReadonlyArray<T | N | `${bigint}` | Readonly<BitField<T, N>>>
  | T
  | N
  | `${bigint}`
  | Readonly<BitField<T, N>>;

export type BufferResolvable = Buffer | string;

export interface Caches {
  ApplicationCommandManager: [manager: typeof ApplicationCommandManager, holds: typeof ApplicationCommand];
  BaseGuildEmojiManager: [manager: typeof BaseGuildEmojiManager, holds: typeof GuildEmoji];
  GuildEmojiManager: [manager: typeof GuildEmojiManager, holds: typeof GuildEmoji];
  // TODO: ChannelManager: [manager: typeof ChannelManager, holds: typeof Channel];
  // TODO: GuildChannelManager: [manager: typeof GuildChannelManager, holds: typeof GuildChannel];
  // TODO: GuildManager: [manager: typeof GuildManager, holds: typeof Guild];
  GuildMemberManager: [manager: typeof GuildMemberManager, holds: typeof GuildMember];
  GuildBanManager: [manager: typeof GuildBanManager, holds: typeof GuildBan];
  GuildInviteManager: [manager: typeof GuildInviteManager, holds: typeof Invite];
  GuildScheduledEventManager: [manager: typeof GuildScheduledEventManager, holds: typeof GuildScheduledEvent];
  GuildStickerManager: [manager: typeof GuildStickerManager, holds: typeof Sticker];
  MessageManager: [manager: typeof MessageManager, holds: typeof Message];
  // TODO: PermissionOverwriteManager: [manager: typeof PermissionOverwriteManager, holds: typeof PermissionOverwrites];
  PresenceManager: [manager: typeof PresenceManager, holds: typeof Presence];
  ReactionManager: [manager: typeof ReactionManager, holds: typeof MessageReaction];
  ReactionUserManager: [manager: typeof ReactionUserManager, holds: typeof User];
  // TODO: RoleManager: [manager: typeof RoleManager, holds: typeof Role];
  StageInstanceManager: [manager: typeof StageInstanceManager, holds: typeof StageInstance];
  ThreadManager: [manager: typeof ThreadManager, holds: typeof ThreadChannel];
  ThreadMemberManager: [manager: typeof ThreadMemberManager, holds: typeof ThreadMember];
  UserManager: [manager: typeof UserManager, holds: typeof User];
  VoiceStateManager: [manager: typeof VoiceStateManager, holds: typeof VoiceState];
}

export type CacheConstructors = {
  [K in keyof Caches]: Caches[K][0] & { name: K };
};

// This doesn't actually work the way it looks 😢.
// Narrowing the type of `manager.name` doesn't propagate type information to `holds` and the return type.
export type CacheFactory = (
  manager: CacheConstructors[keyof Caches],
  holds: Caches[typeof manager['name']][1],
) => typeof manager['prototype'] extends DataManager<infer K, infer V, any> ? Collection<K, V> : never;

export type CacheWithLimitsOptions = {
  [K in keyof Caches]?: Caches[K][0]['prototype'] extends DataManager<infer K, infer V, any>
    ? LimitedCollectionOptions<K, V> | number
    : never;
};

export interface CategoryCreateChannelOptions {
  permissionOverwrites?: OverwriteResolvable[] | Collection<Snowflake, OverwriteResolvable>;
  topic?: string;
  type?: CategoryChannelType;
  nsfw?: boolean;
  bitrate?: number;
  userLimit?: number;
  rateLimitPerUser?: number;
  position?: number;
  rtcRegion?: string;
  reason?: string;
}

export interface ChannelCreationOverwrites {
  allow?: PermissionResolvable;
  deny?: PermissionResolvable;
  id: RoleResolvable | UserResolvable;
}

export interface ChannelData {
  name?: string;
  type?: Pick<typeof ChannelType, 'GuildText' | 'GuildNews'>;
  position?: number;
  topic?: string;
  nsfw?: boolean;
  bitrate?: number;
  userLimit?: number;
  parent?: CategoryChannelResolvable | null;
  rateLimitPerUser?: number;
  lockPermissions?: boolean;
  permissionOverwrites?: readonly OverwriteResolvable[] | Collection<Snowflake, OverwriteResolvable>;
  defaultAutoArchiveDuration?: ThreadAutoArchiveDuration;
  rtcRegion?: string | null;
}

export interface ChannelLogsQueryOptions {
  limit?: number;
  before?: Snowflake;
  after?: Snowflake;
  around?: Snowflake;
}

export type ChannelMention = `<#${Snowflake}>`;

export interface ChannelPosition {
  channel: NonThreadGuildBasedChannel | Snowflake;
  lockPermissions?: boolean;
  parent?: CategoryChannelResolvable | null;
  position?: number;
}

export type GuildTextChannelResolvable = TextChannel | NewsChannel | Snowflake;
export type ChannelResolvable = AnyChannel | Snowflake;

export interface ChannelWebhookCreateOptions {
  avatar?: BufferResolvable | Base64Resolvable | null;
  reason?: string;
}

export interface ClientEvents {
  cacheSweep: [message: string];
  channelCreate: [channel: NonThreadGuildBasedChannel];
  channelDelete: [channel: DMChannel | NonThreadGuildBasedChannel];
  channelPinsUpdate: [channel: TextBasedChannel, date: Date];
  channelUpdate: [
    oldChannel: DMChannel | NonThreadGuildBasedChannel,
    newChannel: DMChannel | NonThreadGuildBasedChannel,
  ];
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
  guildMemberUpdate: [oldMember: GuildMember | PartialGuildMember, newMember: GuildMember];
  guildUpdate: [oldGuild: Guild, newGuild: Guild];
  inviteCreate: [invite: Invite];
  inviteDelete: [invite: Invite];
  messageCreate: [message: Message];
  messageDelete: [message: Message | PartialMessage];
  messageReactionRemoveAll: [
    message: Message | PartialMessage,
    reactions: Collection<string | Snowflake, MessageReaction>,
  ];
  messageReactionRemoveEmoji: [reaction: MessageReaction | PartialMessageReaction];
  messageDeleteBulk: [messages: Collection<Snowflake, Message | PartialMessage>];
  messageReactionAdd: [reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser];
  messageReactionRemove: [reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser];
  messageUpdate: [oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage];
  presenceUpdate: [oldPresence: Presence | null, newPresence: Presence];
  ready: [client: Client<true>];
  invalidated: [];
  roleCreate: [role: Role];
  roleDelete: [role: Role];
  roleUpdate: [oldRole: Role, newRole: Role];
  threadCreate: [thread: ThreadChannel];
  threadDelete: [thread: ThreadChannel];
  threadListSync: [threads: Collection<Snowflake, ThreadChannel>];
  threadMemberUpdate: [oldMember: ThreadMember, newMember: ThreadMember];
  threadMembersUpdate: [
    oldMembers: Collection<Snowflake, ThreadMember>,
    newMembers: Collection<Snowflake, ThreadMember>,
  ];
  threadUpdate: [oldThread: ThreadChannel, newThread: ThreadChannel];
  typingStart: [typing: Typing];
  userUpdate: [oldUser: User | PartialUser, newUser: User];
  voiceStateUpdate: [oldState: VoiceState, newState: VoiceState];
  webhookUpdate: [channel: TextChannel | NewsChannel];
  interactionCreate: [interaction: Interaction];
  shardDisconnect: [closeEvent: CloseEvent, shardId: number];
  shardError: [error: Error, shardId: number];
  shardReady: [shardId: number, unavailableGuilds: Set<Snowflake> | undefined];
  shardReconnecting: [shardId: number];
  shardResume: [shardId: number, replayedEvents: number];
  stageInstanceCreate: [stageInstance: StageInstance];
  stageInstanceUpdate: [oldStageInstance: StageInstance | null, newStageInstance: StageInstance];
  stageInstanceDelete: [stageInstance: StageInstance];
  stickerCreate: [sticker: Sticker];
  stickerDelete: [sticker: Sticker];
  stickerUpdate: [oldSticker: Sticker, newSticker: Sticker];
  guildScheduledEventCreate: [guildScheduledEvent: GuildScheduledEvent];
  guildScheduledEventUpdate: [oldGuildScheduledEvent: GuildScheduledEvent, newGuildScheduledEvent: GuildScheduledEvent];
  guildScheduledEventDelete: [guildScheduledEvent: GuildScheduledEvent];
  guildScheduledEventUserAdd: [guildScheduledEvent: GuildScheduledEvent, user: User];
  guildScheduledEventUserRemove: [guildScheduledEvent: GuildScheduledEvent, user: User];
}

export interface ClientFetchInviteOptions {
  guildScheduledEventId?: Snowflake;
}

export interface ClientOptions {
  shards?: number | number[] | 'auto';
  shardCount?: number;
  makeCache?: CacheFactory;
  allowedMentions?: MessageMentionOptions;
  partials?: Partials[];
  failIfNotExists?: boolean;
  presence?: PresenceData;
  intents: BitFieldResolvable<GatewayIntentsString, number>;
  waitGuildTimeout?: number;
  sweepers?: SweeperOptions;
  ws?: WebSocketOptions;
  rest?: Partial<RESTOptions>;
}

export type ClientPresenceStatus = 'online' | 'idle' | 'dnd';

export interface ClientPresenceStatusData {
  web?: ClientPresenceStatus;
  mobile?: ClientPresenceStatus;
  desktop?: ClientPresenceStatus;
}

export interface ClientUserEditData {
  username?: string;
  avatar?: BufferResolvable | Base64Resolvable | null;
}

export interface CloseEvent {
  wasClean: boolean;
  code: number;
  reason: string;
  target: WebSocket;
}

export type CollectorFilter<T extends unknown[]> = (...args: T) => boolean | Promise<boolean>;

export interface CollectorOptions<T extends unknown[]> {
  filter?: CollectorFilter<T>;
  time?: number;
  idle?: number;
  dispose?: boolean;
}

export interface CollectorResetTimerOptions {
  time?: number;
  idle?: number;
}

export type ColorResolvable =
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
  | readonly [number, number, number]
  | number
  | HexColorString;

export interface CommandInteractionOption<Cached extends CacheType = CacheType> {
  name: string;
  type: ApplicationCommandOptionType;
  value?: string | number | boolean;
  focused?: boolean;
  autocomplete?: boolean;
  options?: CommandInteractionOption[];
  user?: User;
  member?: CacheTypeReducer<Cached, GuildMember, APIInteractionDataResolvedGuildMember>;
  channel?: CacheTypeReducer<Cached, GuildBasedChannel, APIInteractionDataResolvedChannel>;
  role?: CacheTypeReducer<Cached, Role, APIRole>;
  message?: GuildCacheMessage<Cached>;
}

export interface CommandInteractionResolvedData<Cached extends CacheType = CacheType> {
  users?: Collection<Snowflake, User>;
  members?: Collection<Snowflake, CacheTypeReducer<Cached, GuildMember, APIInteractionDataResolvedGuildMember>>;
  roles?: Collection<Snowflake, CacheTypeReducer<Cached, Role, APIRole>>;
  channels?: Collection<Snowflake, CacheTypeReducer<Cached, AnyChannel, APIInteractionDataResolvedChannel>>;
  messages?: Collection<Snowflake, CacheTypeReducer<Cached, Message, APIMessage>>;
}

export interface ConstantsColors {
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
}

export interface ConstantsEvents {
  CLIENT_READY: 'ready';
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
  MESSAGE_CREATE: 'messageCreate';
  MESSAGE_DELETE: 'messageDelete';
  MESSAGE_UPDATE: 'messageUpdate';
  MESSAGE_BULK_DELETE: 'messageDeleteBulk';
  MESSAGE_REACTION_ADD: 'messageReactionAdd';
  MESSAGE_REACTION_REMOVE: 'messageReactionRemove';
  MESSAGE_REACTION_REMOVE_ALL: 'messageReactionRemoveAll';
  MESSAGE_REACTION_REMOVE_EMOJI: 'messageReactionRemoveEmoji';
  THREAD_CREATE: 'threadCreate';
  THREAD_DELETE: 'threadDelete';
  THREAD_UPDATE: 'threadUpdate';
  THREAD_LIST_SYNC: 'threadListSync';
  THREAD_MEMBER_UPDATE: 'threadMemberUpdate';
  THREAD_MEMBERS_UPDATE: 'threadMembersUpdate';
  USER_UPDATE: 'userUpdate';
  PRESENCE_UPDATE: 'presenceUpdate';
  VOICE_SERVER_UPDATE: 'voiceServerUpdate';
  VOICE_STATE_UPDATE: 'voiceStateUpdate';
  TYPING_START: 'typingStart';
  WEBHOOKS_UPDATE: 'webhookUpdate';
  INTERACTION_CREATE: 'interactionCreate';
  ERROR: 'error';
  WARN: 'warn';
  DEBUG: 'debug';
  CACHE_SWEEP: 'cacheSweep';
  SHARD_DISCONNECT: 'shardDisconnect';
  SHARD_ERROR: 'shardError';
  SHARD_RECONNECTING: 'shardReconnecting';
  SHARD_READY: 'shardReady';
  SHARD_RESUME: 'shardResume';
  INVALIDATED: 'invalidated';
  RAW: 'raw';
  STAGE_INSTANCE_CREATE: 'stageInstanceCreate';
  STAGE_INSTANCE_UPDATE: 'stageInstanceUpdate';
  STAGE_INSTANCE_DELETE: 'stageInstanceDelete';
  GUILD_STICKER_CREATE: 'stickerCreate';
  GUILD_STICKER_DELETE: 'stickerDelete';
  GUILD_STICKER_UPDATE: 'stickerUpdate';
  GUILD_SCHEDULED_EVENT_CREATE: 'guildScheduledEventCreate';
  GUILD_SCHEDULED_EVENT_UPDATE: 'guildScheduledEventUpdate';
  GUILD_SCHEDULED_EVENT_DELETE: 'guildScheduledEventDelete';
  GUILD_SCHEDULED_EVENT_USER_ADD: 'guildScheduledEventUserAdd';
  GUILD_SCHEDULED_EVENT_USER_REMOVE: 'guildScheduledEventUserRemove';
}

export interface ConstantsOpcodes {
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
}

export interface ConstantsShardEvents {
  CLOSE: 'close';
  DESTROYED: 'destroyed';
  INVALID_SESSION: 'invalidSession';
  READY: 'ready';
  RESUMED: 'resumed';
}

export interface ConstantsStatus {
  READY: 0;
  CONNECTING: 1;
  RECONNECTING: 2;
  IDLE: 3;
  NEARLY: 4;
  DISCONNECTED: 5;
}

export interface CreateGuildScheduledEventInviteURLOptions extends CreateInviteOptions {
  channel?: GuildInvitableChannelResolvable;
}

export interface CreateRoleOptions extends RoleData {
  reason?: string;
}

export interface StageInstanceCreateOptions {
  topic: string;
  privacyLevel?: StageInstancePrivacyLevel;
}

export interface CrosspostedChannel {
  channelId: Snowflake;
  guildId: Snowflake;
  type: ChannelType;
  name: string;
}

export type DateResolvable = Date | number | string;

export interface EditGuildTemplateOptions {
  name?: string;
  description?: string;
}

export interface EmbedAuthorData {
  name: string;
  url?: string;
  iconURL?: string;
}

export interface EmbedField {
  name: string;
  value: string;
  inline: boolean;
}

export interface EmbedFieldData {
  name: string;
  value: string;
  inline?: boolean;
}

export interface EmbedFooterData {
  text: string;
  iconURL?: string;
}

export type EmojiIdentifierResolvable = string | EmojiResolvable;

export type EmojiResolvable = Snowflake | GuildEmoji | ReactionEmoji;

export type ChannelTypeEnumResolvable =
  | 'GUILD_TEXT'
  | 'DM'
  | 'GUILD_VOICE'
  | 'GROUP_DM'
  | 'GUILD_CATEGORY'
  | 'GUILD_NEWS'
  | 'GUILD_NEWS_THREAD'
  | 'GUILD_PUBLIC_THREAD'
  | 'GUILD_PRIVATE_THREAD'
  | 'GUILD_STAGE_VOICE';

export type InteractionTypeEnumResolvable =
  | 'PING'
  | 'APPLICATION_COMMAND'
  | 'MESSAGE_COMPONENT'
  | 'APPLICATION_COMMAND_AUTOCOMPLETE';

export type ApplicationCommandTypeEnumResolvable = 'CHAT_INPUT' | 'USER' | 'MESSAGE';

export type ApplicationCommandOptionTypeEnumResolvable =
  | 'SUB_COMMAND'
  | 'SUB_COMMAND_GROUP'
  | 'STRING'
  | 'INTEGER'
  | 'BOOLEAN'
  | 'USER'
  | 'CHANNEL'
  | 'ROLE'
  | 'NUMBER'
  | 'MENTIONABLE';

export type ApplicationCommandPermissionTypeEnumResolvable = 'ROLE' | 'USER';

export type ComponentTypeEnumResolvable = 'ACTION_ROW' | 'BUTTON' | 'SELECT_MENU';

export type ButtonStyleEnumResolvable = 'PRIMARY' | 'SECONDARY' | 'SUCCESS' | 'DANGER' | 'LINK';

export type MessageTypeEnumResolvable =
  | 'DEFAULT'
  | 'RECIPIENT_ADD'
  | 'RECIPIENT_REMOVE'
  | 'CALL'
  | 'CHANNEL_NAME_CHANGE'
  | 'CHANNEL_ICON_CHANGE'
  | 'CHANNEL_PINNED_MESSAGE'
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
  | 'THREAD_CREATED'
  | 'REPLY'
  | 'CHAT_INPUT_COMMAND'
  | 'THREAD_STARTER_MESSAGE'
  | 'GUILD_INVITE_REMINDER'
  | 'CONTEXT_MENU_COMMAND';

export type GuildNSFWLevelEnumResolvable = 'DEFAULT' | 'EXPLICIT' | 'SAFE' | 'AGE_RESTRICTED';

export type GuildVerificationLevelEnumResolvable = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';

export type GuildDefaultMessageNotificationsEnumResolvable = 'ALL_MESSAGES' | 'ONLY_MENTIONS';

export type GuildExplicitContentFilterEnumResolvable = 'DISABLED' | 'MEMBERS_WITHOUT_ROLES' | 'ALL_MEMBERS';

export type GuildPremiumTierEnumResolvable = 'NONE' | 'TIER_1' | 'TIER_2' | 'TIER_3';

export type GuildScheduledEventStatusEnumResolvable = 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELED';

export type StageInstancePrivacyLevelEnumResolvable = 'PUBLIC' | 'GUILD_ONLY';

export type GuildMFALevelEnumResolvable = 'NONE' | 'ELEVATED';

export type TeamMemberMembershipStateEnumResolvable = 'INVITED' | 'ACCEPTED';

export type GuildScheduledEventEntityTypeEnumResolvable = 'STAGE_INSTANCE' | 'VOICE' | 'EXTERNAL';

export type IntegrationExpireBehaviorEnumResolvable = 'REMOVE_ROLE' | 'KICK';

export interface ErrorEvent {
  error: unknown;
  message: string;
  type: string;
  target: WebSocket;
}

export interface EscapeMarkdownOptions {
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

export interface FetchApplicationCommandOptions extends BaseFetchOptions {
  guildId?: Snowflake;
}

export interface FetchArchivedThreadOptions {
  type?: 'public' | 'private';
  fetchAll?: boolean;
  before?: ThreadChannelResolvable | DateResolvable;
  limit?: number;
}

export interface FetchBanOptions extends BaseFetchOptions {
  user: UserResolvable;
}

export interface FetchBansOptions {
  cache: boolean;
}

export interface FetchChannelOptions extends BaseFetchOptions {
  allowUnknownGuild?: boolean;
}

export interface FetchedThreads {
  threads: Collection<Snowflake, ThreadChannel>;
  hasMore?: boolean;
}

export interface FetchGuildOptions extends BaseFetchOptions {
  guild: GuildResolvable;
  withCounts?: boolean;
}

export interface FetchGuildsOptions {
  before?: Snowflake;
  after?: Snowflake;
  limit?: number;
}

export interface FetchGuildScheduledEventOptions extends BaseFetchOptions {
  guildScheduledEvent: GuildScheduledEventResolvable;
  withUserCount?: boolean;
}

export interface FetchGuildScheduledEventsOptions {
  cache?: boolean;
  withUserCount?: boolean;
}

export interface FetchGuildScheduledEventSubscribersOptions {
  limit?: number;
  withMember?: boolean;
}

interface FetchInviteOptions extends BaseFetchOptions {
  code: string;
}

interface FetchInvitesOptions {
  channelId?: GuildInvitableChannelResolvable;
  cache?: boolean;
}

export interface FetchMemberOptions extends BaseFetchOptions {
  user: UserResolvable;
}

export interface FetchMembersOptions {
  user?: UserResolvable | UserResolvable[];
  query?: string;
  limit?: number;
  withPresences?: boolean;
  time?: number;
  nonce?: string;
  force?: boolean;
}

export interface FetchReactionUsersOptions {
  limit?: number;
  after?: Snowflake;
}

export interface FetchThreadsOptions {
  archived?: FetchArchivedThreadOptions;
  active?: boolean;
}

export interface FileOptions {
  attachment: BufferResolvable | Stream;
  name?: string;
  description?: string;
}

export type GlobalSweepFilter<K, V> = () => ((value: V, key: K, collection: Collection<K, V>) => boolean) | null;

export interface GuildApplicationCommandPermissionData {
  id: Snowflake;
  permissions: ApplicationCommandPermissionData[];
}

interface GuildAuditLogsTypes {
  GuildUpdate: ['Guild', 'Update'];
  ChannelCreate: ['Channel', 'Create'];
  ChannelUpdate: ['Channel', 'Update'];
  ChannelDelete: ['Channel', 'Delete'];
  ChannelOverwriteCreate: ['Channel', 'Create'];
  ChannelOverwriteUpdate: ['Channel', 'Update'];
  ChannelOverwriteDelete: ['Channel', 'Delete'];
  MemberKick: ['User', 'Delete'];
  MemberPrune: ['User', 'Delete'];
  MemberBanAdd: ['User', 'Delete'];
  MemberBanRemove: ['User', 'Create'];
  MemberUpdate: ['User', 'Update'];
  MemberRoleUpdate: ['User', 'Update'];
  MemberMove: ['User', 'Update'];
  MemberDisconnect: ['User', 'Delete'];
  BotAdd: ['User', 'Create'];
  RoleCreate: ['Role', 'Create'];
  RoleUpdate: ['Role', 'Update'];
  RoleDelete: ['Role', 'Delete'];
  InviteCreate: ['Invite', 'Create'];
  InviteUpdate: ['Invite', 'Update'];
  InviteDelete: ['Invite', 'Delete'];
  WebhookCreate: ['Webhook', 'Create'];
  WebhookUpdate: ['Webhook', 'Update'];
  WebhookDelete: ['Webhook', 'Delete'];
  EmojiCreate: ['Emoji', 'Create'];
  EmojiUpdate: ['Emoji', 'Update'];
  EmojiDelete: ['Emoji', 'Delete'];
  MessageDelete: ['Message', 'Delete'];
  MessageBulkDelete: ['Message', 'Delete'];
  MessagePin: ['Message', 'Create'];
  MessageUnpin: ['Message', 'Delete'];
  IntegrationCreate: ['Integration', 'Create'];
  IntegrationUpdate: ['Integration', 'Update'];
  IntegrationDelete: ['Integration', 'Delete'];
  StageInstanceCreate: ['StageInstance', 'Create'];
  StageInstanceUpdate: ['StageInstance', 'Update'];
  StageInstanceDelete: ['StageInstance', 'Delete'];
  StickerCreate: ['Sticker', 'Create'];
  StickerUpdate: ['Sticker', 'Update'];
  StickerDelete: ['Sticket', 'Delete'];
  GUILD_SCHEDULED_EVENT_CREATE: ['GuildScheduledEvent', 'Create'];
  GUILD_SCHEDULED_EVENT_UPDATE: ['GuildScheduledEvent', 'Update'];
  GUILD_SCHEDULED_EVENT_DELETE: ['GuildScheduledEvent', 'Delete'];
  ThreadCreate: ['Thread', 'Create'];
  ThreadUpdate: ['Thread', 'Update'];
  ThreadDelete: ['Thread', 'Delete'];
}

export interface GuildAuditLogsIds {
  1: 'GuildUpdate';
  10: 'ChannelCreate';
  11: 'ChannelUpdate';
  12: 'ChannelDelete';
  13: 'ChannelOverwriteCreate';
  14: 'ChannelOverwriteUpdate';
  15: 'ChannelOverwriteDelete';
  20: 'MemberKick';
  21: 'MemberPrune';
  22: 'MemberBanAdd';
  23: 'MemberBanRemove';
  24: 'MemberUpdate';
  25: 'MemberRoleUpdate';
  26: 'MemberMove';
  27: 'MemberDisconnect';
  28: 'BotAdd';
  30: 'RoleCreate';
  31: 'RoleUpdate';
  32: 'RoleDelete';
  40: 'InviteCreate';
  41: 'InviteUpdate';
  42: 'InviteDelete';
  50: 'WebhookCreate';
  51: 'WebhookUpdate';
  52: 'WebhookDelete';
  60: 'EmojiCreate';
  61: 'EmojiUpdate';
  62: 'EmojiDelete';
  72: 'MessageDelete';
  73: 'MessageBulkDelete';
  74: 'MessagePin';
  75: 'MessageUnpin';
  80: 'IntegrationCreate';
  81: 'IntegrationUpdate';
  82: 'IntegrationDelete';
  83: 'StageInstanceCreate';
  84: 'StageInstanceUpdate';
  85: 'StageInstanceDelete';
  90: 'StickerCreate';
  91: 'StickerUpdate';
  92: 'StickerDelete';
  100: 'GuildScheduledEventCreate';
  101: 'GuildScheduledEventUpdate';
  102: 'GuildScheduledEventDelete';
  110: 'ThreadCreate';
  111: 'ThreadUpdate';
  112: 'ThreadDelete';
}

export type GuildAuditLogsActions = { [Key in keyof GuildAuditLogsIds as GuildAuditLogsIds[Key]]: Key } & { All: null };

export type GuildAuditLogsAction = keyof GuildAuditLogsActions;

export type GuildAuditLogsActionType = GuildAuditLogsTypes[keyof GuildAuditLogsTypes][1] | 'All';

export interface GuildAuditLogsEntryExtraField {
  MemberPrune: { removed: number; days: number };
  MemberMove: { channel: VoiceBasedChannel | { id: Snowflake }; count: number };
  MessageDelete: { channel: GuildTextBasedChannel | { id: Snowflake }; count: number };
  MessageBulkDelete: { channel: GuildTextBasedChannel | { id: Snowflake }; count: number };
  MessagePin: { channel: GuildTextBasedChannel | { id: Snowflake }; messageId: Snowflake };
  MessageUnpin: { channel: GuildTextBasedChannel | { id: Snowflake }; messageId: Snowflake };
  MemberDisconnect: { count: number };
  ChannelOverwriteCreate:
    | Role
    | GuildMember
    | { id: Snowflake; name: string; type: 'Role' }
    | { id: Snowflake; type: 'Member' };
  ChannelOverwriteUpdate:
    | Role
    | GuildMember
    | { id: Snowflake; name: string; type: 'Role' }
    | { id: Snowflake; type: 'Member' };
  ChannelOverwriteDelete:
    | Role
    | GuildMember
    | { id: Snowflake; name: string; type: OverwriteType.Role }
    | { id: Snowflake; type: OverwriteType.Member };
  StageInstanceCreate: StageChannel | { id: Snowflake };
  StageInstanceDelete: StageChannel | { id: Snowflake };
  StageInstanceUpdate: StageChannel | { id: Snowflake };
}

export interface GuildAuditLogsEntryTargetField<TActionType extends GuildAuditLogsActionType> {
  User: User | null;
  Guild: Guild;
  Webhook: Webhook;
  Invite: Invite;
  Message: TActionType extends 'MESSAGE_BULK_DELETE' ? Guild | { id: Snowflake } : User;
  Integration: Integration;
  Channel: NonThreadGuildBasedChannel | { id: Snowflake; [x: string]: unknown };
  Thread: ThreadChannel | { id: Snowflake; [x: string]: unknown };
  StageInstance: StageInstance;
  Sticker: Sticker;
  GuildScheduledEvent: GuildScheduledEvent;
}

export interface GuildAuditLogsFetchOptions<T extends GuildAuditLogsResolvable> {
  before?: Snowflake | GuildAuditLogsEntry;
  limit?: number;
  user?: UserResolvable;
  type?: T;
}

export type GuildAuditLogsResolvable = keyof GuildAuditLogsIds | GuildAuditLogsAction | null;

export type GuildAuditLogsTarget = GuildAuditLogsTypes[keyof GuildAuditLogsTypes][0] | 'All' | 'Unknown';

export type GuildAuditLogsTargets = {
  [key in GuildAuditLogsTarget]?: string;
};

export type GuildBanResolvable = GuildBan | UserResolvable;

export interface GuildChannelOverwriteOptions {
  reason?: string;
  type?: number;
}

export type GuildChannelResolvable = Snowflake | GuildBasedChannel;

export interface GuildChannelCreateOptions extends Omit<CategoryCreateChannelOptions, 'type'> {
  parent?: CategoryChannelResolvable;
  type?: Exclude<
    ChannelType,
    | ChannelType.DM
    | ChannelType.GroupDM
    | ChannelType.GuildPublicThread
    | ChannelType.GuildNewsThread
    | ChannelType.GuildPrivateThread
  >;
}

export interface GuildChannelCloneOptions extends GuildChannelCreateOptions {
  name?: string;
}

export interface GuildChannelOverwriteOptions {
  reason?: string;
  type?: number;
}

export interface GuildCreateOptions {
  afkChannelId?: Snowflake | number;
  afkTimeout?: number;
  channels?: PartialChannelData[];
  defaultMessageNotifications?: GuildDefaultMessageNotifications;
  explicitContentFilter?: GuildExplicitContentFilter;
  icon?: BufferResolvable | Base64Resolvable | null;
  roles?: PartialRoleData[];
  systemChannelFlags?: SystemChannelFlagsResolvable;
  systemChannelId?: Snowflake | number;
  verificationLevel?: GuildVerificationLevel;
}

export interface GuildWidgetSettings {
  enabled: boolean;
  channel: NonThreadGuildBasedChannel | null;
}

export interface GuildEditData {
  name?: string;
  verificationLevel?: GuildVerificationLevel;
  explicitContentFilter?: GuildExplicitContentFilter;
  defaultMessageNotifications?: GuildDefaultMessageNotifications;
  afkChannel?: VoiceChannelResolvable;
  systemChannel?: TextChannelResolvable;
  systemChannelFlags?: SystemChannelFlagsResolvable;
  afkTimeout?: number;
  icon?: BufferResolvable | Base64Resolvable | null;
  owner?: GuildMemberResolvable;
  splash?: BufferResolvable | Base64Resolvable | null;
  discoverySplash?: BufferResolvable | Base64Resolvable | null;
  banner?: BufferResolvable | Base64Resolvable | null;
  rulesChannel?: TextChannelResolvable;
  publicUpdatesChannel?: TextChannelResolvable;
  preferredLocale?: string;
  premiumProgressBarEnabled?: boolean;
  description?: string | null;
  features?: GuildFeatures[];
}

export interface GuildEmojiCreateOptions {
  roles?: Collection<Snowflake, Role> | RoleResolvable[];
  reason?: string;
}

export interface GuildEmojiEditData {
  name?: string;
  roles?: Collection<Snowflake, Role> | RoleResolvable[];
}

export interface GuildStickerCreateOptions {
  description?: string | null;
  reason?: string;
}

export interface GuildStickerEditData {
  name?: string;
  description?: string | null;
  tags?: string;
}

export type GuildFeatures =
  | 'ANIMATED_ICON'
  | 'BANNER'
  | 'COMMERCE'
  | 'COMMUNITY'
  | 'DISCOVERABLE'
  | 'FEATURABLE'
  | 'INVITE_SPLASH'
  | 'MEMBER_VERIFICATION_GATE_ENABLED'
  | 'NEWS'
  | 'PARTNERED'
  | 'PREVIEW_ENABLED'
  | 'VANITY_URL'
  | 'VERIFIED'
  | 'VIP_REGIONS'
  | 'WELCOME_SCREEN_ENABLED'
  | 'TICKETED_EVENTS_ENABLED'
  | 'MONETIZATION_ENABLED'
  | 'MORE_STICKERS'
  | 'THREE_DAY_THREAD_ARCHIVE'
  | 'SEVEN_DAY_THREAD_ARCHIVE'
  | 'PRIVATE_THREADS'
  | 'ROLE_ICONS';

export interface GuildMemberEditData {
  nick?: string | null;
  roles?: Collection<Snowflake, Role> | readonly RoleResolvable[];
  mute?: boolean;
  deaf?: boolean;
  channel?: GuildVoiceChannelResolvable | null;
  communicationDisabledUntil?: DateResolvable | null;
}

export type GuildMemberResolvable = GuildMember | UserResolvable;

export type GuildResolvable = Guild | NonThreadGuildBasedChannel | GuildMember | GuildEmoji | Invite | Role | Snowflake;

export interface GuildPruneMembersOptions {
  count?: boolean;
  days?: number;
  dry?: boolean;
  reason?: string;
  roles?: RoleResolvable[];
}

export interface GuildWidgetSettingsData {
  enabled: boolean;
  channel: GuildChannelResolvable | null;
}

export interface GuildSearchMembersOptions {
  query: string;
  limit?: number;
  cache?: boolean;
}

export interface GuildListMembersOptions {
  after?: Snowflake;
  limit?: number;
  cache?: boolean;
}

// TODO: use conditional types for better TS support
export interface GuildScheduledEventCreateOptions {
  name: string;
  scheduledStartTime: DateResolvable;
  scheduledEndTime?: DateResolvable;
  privacyLevel: GuildScheduledEventPrivacyLevel;
  entityType: GuildScheduledEventEntityType;
  description?: string;
  channel?: GuildVoiceChannelResolvable;
  entityMetadata?: GuildScheduledEventEntityMetadataOptions;
  reason?: string;
}

export interface GuildScheduledEventEditOptions<
  S extends GuildScheduledEventStatus,
  T extends GuildScheduledEventSetStatusArg<S>,
> extends Omit<Partial<GuildScheduledEventCreateOptions>, 'channel'> {
  channel?: GuildVoiceChannelResolvable | null;
  status?: T | number;
}

export interface GuildScheduledEventEntityMetadata {
  location: string | null;
}

export interface GuildScheduledEventEntityMetadataOptions {
  location?: string;
}

export type GuildScheduledEventManagerFetchResult<
  T extends GuildScheduledEventResolvable | FetchGuildScheduledEventOptions | FetchGuildScheduledEventsOptions,
> = T extends GuildScheduledEventResolvable | FetchGuildScheduledEventOptions
  ? GuildScheduledEvent
  : Collection<Snowflake, GuildScheduledEvent>;

export type GuildScheduledEventManagerFetchSubscribersResult<T extends FetchGuildScheduledEventSubscribersOptions> =
  T extends { withMember: true }
    ? Collection<Snowflake, GuildScheduledEventUser<true>>
    : Collection<Snowflake, GuildScheduledEventUser<false>>;

export type GuildScheduledEventResolvable = Snowflake | GuildScheduledEvent;

export type GuildScheduledEventSetStatusArg<T extends GuildScheduledEventStatus> =
  T extends GuildScheduledEventStatus.Scheduled
    ? GuildScheduledEventStatus.Active | GuildScheduledEventStatus.Canceled
    : T extends GuildScheduledEventStatus.Active
    ? GuildScheduledEventStatus.Completed
    : never;

export interface GuildScheduledEventUser<T> {
  guildScheduledEventId: Snowflake;
  user: User;
  member: T extends true ? GuildMember : null;
}

export type GuildTemplateResolvable = string;

export type GuildVoiceChannelResolvable = VoiceBasedChannel | Snowflake;

export type HexColorString = `#${string}`;

export interface IntegrationAccount {
  id: string | Snowflake;
  name: string;
}

export type IntegrationType = 'twitch' | 'youtube' | 'discord';

export interface InteractionCollectorOptions<T extends Interaction, Cached extends CacheType = CacheType>
  extends CollectorOptions<[T]> {
  channel?: TextBasedChannel;
  componentType?: ComponentType;
  guild?: Guild;
  interactionType?: InteractionType;
  max?: number;
  maxComponents?: number;
  maxUsers?: number;
  message?: CacheTypeReducer<Cached, Message, APIMessage>;
}

export interface InteractionDeferReplyOptions {
  ephemeral?: boolean;
  fetchReply?: boolean;
}

export type InteractionDeferUpdateOptions = Omit<InteractionDeferReplyOptions, 'ephemeral'>;

export interface InteractionReplyOptions extends Omit<WebhookMessageOptions, 'username' | 'avatarURL' | 'flags'> {
  ephemeral?: boolean;
  fetchReply?: boolean;
  flags?: BitFieldResolvable<Extract<MessageFlagsString, 'SuppressEmbeds' | 'Ephemeral'>, number>;
}

export interface InteractionUpdateOptions extends MessageEditOptions {
  fetchReply?: boolean;
}

export interface InviteGenerationOptions {
  permissions?: PermissionResolvable;
  guild?: GuildResolvable;
  disableGuildSelect?: boolean;
  scopes: InviteScope[];
}

export type GuildInvitableChannelResolvable =
  | TextChannel
  | VoiceChannel
  | NewsChannel
  | StoreChannel
  | StageChannel
  | Snowflake;

export interface CreateInviteOptions {
  temporary?: boolean;
  maxAge?: number;
  maxUses?: number;
  unique?: boolean;
  reason?: string;
  targetApplication?: ApplicationResolvable;
  targetUser?: UserResolvable;
  targetType?: InviteTargetType;
}

export type InviteResolvable = string;

export type InviteScope =
  | 'applications.builds.read'
  | 'applications.commands'
  | 'applications.entitlements'
  | 'applications.store.update'
  | 'bot'
  | 'connections'
  | 'email'
  | 'identify'
  | 'guilds'
  | 'guilds.join'
  | 'gdm.join'
  | 'webhook.incoming';

export interface LifetimeFilterOptions<K, V> {
  excludeFromSweep?: (value: V, key: K, collection: LimitedCollection<K, V>) => boolean;
  getComparisonTimestamp?: (value: V, key: K, collection: LimitedCollection<K, V>) => number;
  lifetime?: number;
}

export interface MakeErrorOptions {
  name: string;
  message: string;
  stack: string;
}

export type MemberMention = UserMention | `<@!${Snowflake}>`;

export type ActionRowComponentOptions =
  | (Required<BaseMessageComponentOptions> & MessageButtonOptions)
  | (Required<BaseMessageComponentOptions> & MessageSelectMenuOptions);

export type MessageActionRowComponentResolvable = ActionRowComponent | ActionRowComponentOptions;

export interface ActionRowOptions extends BaseMessageComponentOptions {
  components: ActionRowComponent[];
}

export interface MessageActivity {
  partyId: string;
  type: number;
}

export interface BaseButtonOptions extends BaseMessageComponentOptions {
  disabled?: boolean;
  emoji?: EmojiIdentifierResolvable;
  label?: string;
}

export interface LinkButtonOptions extends BaseButtonOptions {
  style: 'Link' | ButtonStyle.Link;
  url: string;
}

export interface InteractionButtonOptions extends BaseButtonOptions {
  style: Exclude<ButtonStyle, ButtonStyle.Link>;
  customId: string;
}

export type MessageButtonOptions = InteractionButtonOptions | LinkButtonOptions;

export interface MessageCollectorOptions extends CollectorOptions<[Message]> {
  max?: number;
  maxProcessed?: number;
}

export type MessageComponent = Component | ActionRow<ActionRowComponent> | ButtonComponent | SelectMenuComponent;

export type MessageComponentCollectorOptions<T extends MessageComponentInteraction> = Omit<
  InteractionCollectorOptions<T>,
  'channel' | 'message' | 'guild' | 'interactionType'
>;

export type MessageChannelComponentCollectorOptions<T extends MessageComponentInteraction> = Omit<
  InteractionCollectorOptions<T>,
  'channel' | 'guild' | 'interactionType'
>;

export type MessageComponentOptions =
  | BaseMessageComponentOptions
  | ActionRowOptions
  | MessageButtonOptions
  | MessageSelectMenuOptions;

export interface MessageEditOptions {
  attachments?: MessageAttachment[];
  content?: string | null;
  embeds?: (Embed | APIEmbed)[] | null;
  files?: (FileOptions | BufferResolvable | Stream | MessageAttachment)[];
  flags?: BitFieldResolvable<MessageFlagsString, number>;
  allowedMentions?: MessageMentionOptions;
  components?: (ActionRow<ActionRowComponent> | (Required<BaseMessageComponentOptions> & ActionRowOptions))[];
}

export interface MessageEvent {
  data: WebSocket.Data;
  type: string;
  target: WebSocket;
}

export interface MessageInteraction {
  id: Snowflake;
  type: InteractionType;
  commandName: string;
  user: User;
}

export interface MessageMentionsHasOptions {
  ignoreDirect?: boolean;
  ignoreRoles?: boolean;
  ignoreRepliedUser?: boolean;
  ignoreEveryone?: boolean;
}

export interface MessageMentionOptions {
  parse?: MessageMentionTypes[];
  roles?: Snowflake[];
  users?: Snowflake[];
  repliedUser?: boolean;
}

export type MessageMentionTypes = 'roles' | 'users' | 'everyone';

export { Embed };

export interface MessageOptions {
  tts?: boolean;
  nonce?: string | number;
  content?: string | null;
  embeds?: (Embed | APIEmbed)[];
  components?: (ActionRow<ActionRowComponent> | (Required<BaseMessageComponentOptions> & ActionRowOptions))[];
  allowedMentions?: MessageMentionOptions;
  files?: (FileOptions | BufferResolvable | Stream | MessageAttachment)[];
  reply?: ReplyOptions;
  stickers?: StickerResolvable[];
  attachments?: MessageAttachment[];
  flags?: BitFieldResolvable<Extract<MessageFlagsString, 'SuppressEmbeds'>, number>;
}

export type MessageReactionResolvable =
  | MessageReaction
  | Snowflake
  | `${string}:${Snowflake}`
  | `<:${string}:${Snowflake}>`
  | `<a:${string}:${Snowflake}>`
  | string;

export interface MessageReference {
  channelId: Snowflake;
  guildId: Snowflake | undefined;
  messageId: Snowflake | undefined;
}

export type MessageResolvable = Message | Snowflake;

export interface MessageSelectMenuOptions extends BaseMessageComponentOptions {
  customId?: string;
  disabled?: boolean;
  maxValues?: number;
  minValues?: number;
  options?: MessageSelectOptionData[];
  placeholder?: string;
}

export interface MessageSelectOption {
  default: boolean;
  description: string | null;
  emoji: APIPartialEmoji | null;
  label: string;
  value: string;
}

export interface MessageSelectOptionData {
  default?: boolean;
  description?: string;
  emoji?: EmojiIdentifierResolvable;
  label: string;
  value: string;
}

export type MessageTarget =
  | Interaction
  | InteractionWebhook
  | TextBasedChannel
  | User
  | GuildMember
  | Webhook
  | WebhookClient
  | Message
  | MessageManager;

export interface MultipleShardRespawnOptions {
  shardDelay?: number;
  respawnDelay?: number;
  timeout?: number;
}

export interface MultipleShardSpawnOptions {
  amount?: number | 'auto';
  delay?: number;
  timeout?: number;
}

export interface OverwriteData {
  allow?: PermissionResolvable;
  deny?: PermissionResolvable;
  id: GuildMemberResolvable | RoleResolvable;
  type?: OverwriteType;
}

export type OverwriteResolvable = PermissionOverwrites | OverwriteData;

export type PermissionFlags = Record<keyof typeof PermissionFlagsBits, bigint>;

export type PermissionOverwriteOptions = Partial<Record<keyof typeof PermissionFlagsBits, boolean | null>>;

export type PermissionResolvable = BitFieldResolvable<keyof typeof PermissionFlagsBits, bigint>;

export type PermissionOverwriteResolvable = UserResolvable | RoleResolvable | PermissionOverwrites;

export type RecursiveArray<T> = ReadonlyArray<T | RecursiveArray<T>>;

export type RecursiveReadonlyArray<T> = ReadonlyArray<T | RecursiveReadonlyArray<T>>;

export interface PartialRecipient {
  username: string;
}

export interface PresenceData {
  status?: PresenceStatusData;
  afk?: boolean;
  activities?: ActivitiesOptions[];
  shardId?: number | number[];
}

export type PresenceResolvable = Presence | UserResolvable | Snowflake;

export interface PartialChannelData {
  id?: Snowflake | number;
  parentId?: Snowflake | number;
  type?: Exclude<
    ChannelType,
    | ChannelType.DM
    | ChannelType.GroupDM
    | ChannelType.GuildNews
    | ChannelType.GuildStore
    | ChannelType.GuildNewsThread
    | ChannelType.GuildPublicThread
    | ChannelType.GuildPrivateThread
    | ChannelType.GuildStageVoice
  >;
  name: string;
  topic?: string;
  nsfw?: boolean;
  bitrate?: number;
  userLimit?: number;
  rtcRegion?: string | null;
  permissionOverwrites?: PartialOverwriteData[];
  rateLimitPerUser?: number;
}

export type Partialize<
  T extends AllowedPartial,
  N extends keyof T | null = null,
  M extends keyof T | null = null,
  E extends keyof T | '' = '',
> = {
  readonly client: Client;
  id: Snowflake;
  partial: true;
} & {
  [K in keyof Omit<T, 'client' | 'id' | 'partial' | E>]: K extends N ? null : K extends M ? T[K] | null : T[K];
};

export interface PartialDMChannel extends Partialize<DMChannel, null, null, 'lastMessageId'> {
  lastMessageId: undefined;
}

export interface PartialGuildMember extends Partialize<GuildMember, 'joinedAt' | 'joinedTimestamp'> {}

export interface PartialMessage
  extends Partialize<Message, 'type' | 'system' | 'pinned' | 'tts', 'content' | 'cleanContent' | 'author'> {}

export interface PartialMessageReaction extends Partialize<MessageReaction, 'count'> {}

export interface PartialOverwriteData {
  id: Snowflake | number;
  type?: OverwriteType;
  allow?: PermissionResolvable;
  deny?: PermissionResolvable;
}

export interface PartialRoleData extends RoleData {
  id?: Snowflake | number;
}

export enum Partials {
  User,
  Channel,
  GuildMember,
  Message,
  Reaction,
  GuildScheduledEvent,
}

export interface PartialUser extends Partialize<User, 'username' | 'tag' | 'discriminator'> {}

export type PresenceStatusData = ClientPresenceStatus | 'invisible';

export type PresenceStatus = PresenceStatusData | 'offline';

export interface ReactionCollectorOptions extends CollectorOptions<[MessageReaction, User]> {
  max?: number;
  maxEmojis?: number;
  maxUsers?: number;
}

export interface ReplyOptions {
  messageReference: MessageResolvable;
  failIfNotExists?: boolean;
}

export interface ReplyMessageOptions extends Omit<MessageOptions, 'reply'> {
  failIfNotExists?: boolean;
}

export interface ResolvedOverwriteOptions {
  allow: PermissionsBitField;
  deny: PermissionsBitField;
}

export interface RoleData {
  name?: string;
  color?: ColorResolvable;
  hoist?: boolean;
  position?: number;
  permissions?: PermissionResolvable;
  mentionable?: boolean;
  icon?: BufferResolvable | Base64Resolvable | EmojiResolvable | null;
  unicodeEmoji?: string | null;
}

export type RoleMention = '@everyone' | `<@&${Snowflake}>`;

export interface RolePosition {
  role: RoleResolvable;
  position: number;
}

export type RoleResolvable = Role | Snowflake;

export interface RoleTagData {
  botId?: Snowflake;
  integrationId?: Snowflake;
  premiumSubscriberRole?: true;
}

export interface SetChannelPositionOptions {
  relative?: boolean;
  reason?: string;
}

export interface SetParentOptions {
  lockPermissions?: boolean;
  reason?: string;
}

export interface SetRolePositionOptions {
  relative?: boolean;
  reason?: string;
}

export type ShardingManagerMode = 'process' | 'worker';

export interface ShardingManagerOptions {
  totalShards?: number | 'auto';
  shardList?: number[] | 'auto';
  mode?: ShardingManagerMode;
  respawn?: boolean;
  shardArgs?: string[];
  token?: string;
  execArgv?: string[];
}

export { Snowflake };

export interface SplitOptions {
  maxLength?: number;
  char?: string | string[] | RegExp | RegExp[];
  prepend?: string;
  append?: string;
}

export type StageInstanceResolvable = StageInstance | Snowflake;

export interface StartThreadOptions {
  name: string;
  autoArchiveDuration?: ThreadAutoArchiveDuration;
  reason?: string;
  rateLimitPerUser?: number;
}

export type Status = number;

export type StickerResolvable = Sticker | Snowflake;

export type SystemChannelFlagsResolvable = BitFieldResolvable<SystemChannelFlagsString, number>;

export type SystemMessageType = Exclude<
  MessageType,
  MessageType.Default | MessageType.Reply | MessageType.ChatInputCommand | MessageType.ContextMenuCommand
>;

export type StageChannelResolvable = StageChannel | Snowflake;

export interface StageInstanceEditOptions {
  topic?: string;
  privacyLevel?: StageInstancePrivacyLevel;
}

export type SweeperKey = keyof SweeperDefinitions;

export type CollectionSweepFilter<K, V> = (value: V, key: K, collection: Collection<K, V>) => boolean;

export interface SweepOptions<K, V> {
  interval: number;
  filter: GlobalSweepFilter<K, V>;
}

export interface LifetimeSweepOptions {
  interval: number;
  lifetime: number;
  filter?: never;
}

export interface SweeperDefinitions {
  applicationCommands: [Snowflake, ApplicationCommand];
  bans: [Snowflake, GuildBan];
  emojis: [Snowflake, GuildEmoji];
  invites: [string, Invite, true];
  guildMembers: [Snowflake, GuildMember];
  messages: [Snowflake, Message, true];
  presences: [Snowflake, Presence];
  reactions: [string | Snowflake, MessageReaction];
  stageInstances: [Snowflake, StageInstance];
  stickers: [Snowflake, Sticker];
  threadMembers: [Snowflake, ThreadMember];
  threads: [Snowflake, ThreadChannel, true];
  users: [Snowflake, User];
  voiceStates: [Snowflake, VoiceState];
}

export type SweeperOptions = {
  [K in keyof SweeperDefinitions]?: SweeperDefinitions[K][2] extends true
    ? SweepOptions<SweeperDefinitions[K][0], SweeperDefinitions[K][1]> | LifetimeSweepOptions
    : SweepOptions<SweeperDefinitions[K][0], SweeperDefinitions[K][1]>;
};

export interface LimitedCollectionOptions<K, V> {
  maxSize?: number;
  keepOverLimit?: (value: V, key: K, collection: LimitedCollection<K, V>) => boolean;
}

export type AnyChannel =
  | CategoryChannel
  | DMChannel
  | PartialDMChannel
  | NewsChannel
  | StageChannel
  | StoreChannel
  | TextChannel
  | ThreadChannel
  | VoiceChannel;

export type TextBasedChannel = Extract<AnyChannel, { messages: MessageManager }>;

export type TextBasedChannelTypes = TextBasedChannel['type'];

export type VoiceBasedChannel = Extract<AnyChannel, { bitrate: number }>;

export type GuildBasedChannel = Extract<AnyChannel, { guild: Guild }>;

export type NonThreadGuildBasedChannel = Exclude<GuildBasedChannel, ThreadChannel>;

export type GuildTextBasedChannel = Extract<GuildBasedChannel, TextBasedChannel>;

export type TextChannelResolvable = Snowflake | TextChannel;

export type ThreadAutoArchiveDuration = 60 | 1440 | 4320 | 10080 | 'MAX';

export type ThreadChannelResolvable = ThreadChannel | Snowflake;

export type ThreadChannelType =
  | ChannelType.GuildNewsThread
  | ChannelType.GuildPublicThread
  | ChannelType.GuildPrivateThread;

export interface ThreadCreateOptions<AllowedThreadType> extends StartThreadOptions {
  startMessage?: MessageResolvable;
  type?: AllowedThreadType;
  invitable?: AllowedThreadType extends ChannelType.GuildPrivateThread ? boolean : never;
  rateLimitPerUser?: number;
}

export interface ThreadEditData {
  name?: string;
  archived?: boolean;
  autoArchiveDuration?: ThreadAutoArchiveDuration;
  rateLimitPerUser?: number;
  locked?: boolean;
  invitable?: boolean;
}

export type ThreadMemberResolvable = ThreadMember | UserResolvable;

export type UserMention = `<@${Snowflake}>`;

export type UserResolvable = User | Snowflake | Message | GuildMember | ThreadMember;

export interface Vanity {
  code: string | null;
  uses: number;
}

export type VoiceBasedChannelTypes = VoiceBasedChannel['type'];

export type VoiceChannelResolvable = Snowflake | VoiceChannel;

export type WebhookClientData = WebhookClientDataIdWithToken | WebhookClientDataURL;

export interface WebhookClientDataIdWithToken {
  id: Snowflake;
  token: string;
}

export interface WebhookClientDataURL {
  url: string;
}

export type WebhookClientOptions = Pick<ClientOptions, 'allowedMentions' | 'rest'>;

export interface WebhookEditData {
  name?: string;
  avatar?: BufferResolvable | null;
  channel?: GuildTextChannelResolvable;
}

export type WebhookEditMessageOptions = Pick<
  WebhookMessageOptions,
  'content' | 'embeds' | 'files' | 'allowedMentions' | 'components' | 'attachments' | 'threadId'
>;

export interface WebhookFetchMessageOptions {
  cache?: boolean;
  threadId?: Snowflake;
}

export interface WebhookMessageOptions extends Omit<MessageOptions, 'reply' | 'stickers'> {
  username?: string;
  avatarURL?: string;
  threadId?: Snowflake;
}

export interface WebSocketOptions {
  large_threshold?: number;
  compress?: boolean;
  properties?: WebSocketProperties;
}

export interface WebSocketProperties {
  $os?: string;
  $browser?: string;
  $device?: string;
}

export interface WidgetActivity {
  name: string;
}

export interface WidgetChannel {
  id: Snowflake;
  name: string;
  position: number;
}

export interface WelcomeChannelData {
  description: string;
  channel: TextChannel | NewsChannel | StoreChannel | Snowflake;
  emoji?: EmojiIdentifierResolvable;
}

export interface WelcomeScreenEditData {
  enabled?: boolean;
  description?: string;
  welcomeChannels?: WelcomeChannelData[];
}

export type WSEventType =
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
  | 'THREAD_CREATE'
  | 'THREAD_UPDATE'
  | 'THREAD_DELETE'
  | 'THREAD_LIST_SYNC'
  | 'THREAD_MEMBER_UPDATE'
  | 'THREAD_MEMBERS_UPDATE'
  | 'USER_UPDATE'
  | 'PRESENCE_UPDATE'
  | 'TYPING_START'
  | 'VOICE_STATE_UPDATE'
  | 'VOICE_SERVER_UPDATE'
  | 'WEBHOOKS_UPDATE'
  | 'INTERACTION_CREATE'
  | 'STAGE_INSTANCE_CREATE'
  | 'STAGE_INSTANCE_UPDATE'
  | 'STAGE_INSTANCE_DELETE'
  | 'GUILD_STICKERS_UPDATE';

export type Serialized<T> = T extends symbol | bigint | (() => any)
  ? never
  : T extends number | string | boolean | undefined
  ? T
  : T extends { toJSON(): infer R }
  ? R
  : T extends ReadonlyArray<infer V>
  ? Serialized<V>[]
  : T extends ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>
  ? {}
  : { [K in keyof T]: Serialized<T[K]> };

//#endregion

//#region Voice

/**
 * @internal Use `DiscordGatewayAdapterLibraryMethods` from `@discordjs/voice` instead.
 */
export interface InternalDiscordGatewayAdapterLibraryMethods {
  onVoiceServerUpdate(data: GatewayVoiceServerUpdateDispatchData): void;
  onVoiceStateUpdate(data: GatewayVoiceStateUpdateDispatchData): void;
  destroy(): void;
}

/**
 * @internal Use `DiscordGatewayAdapterImplementerMethods` from `@discordjs/voice` instead.
 */
export interface InternalDiscordGatewayAdapterImplementerMethods {
  sendPayload(payload: unknown): boolean;
  destroy(): void;
}

/**
 * @internal Use `DiscordGatewayAdapterCreator` from `@discordjs/voice` instead.
 */
export type InternalDiscordGatewayAdapterCreator = (
  methods: InternalDiscordGatewayAdapterLibraryMethods,
) => InternalDiscordGatewayAdapterImplementerMethods;

//#endregion

// External
export {
  ActivityType,
  ActivityFlags,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  ApplicationCommandPermissionType,
  ButtonStyle,
  ChannelType,
  ComponentType,
  GuildMFALevel,
  GuildNSFWLevel,
  GuildPremiumTier,
  GatewayIntentBits,
  GuildScheduledEventEntityType,
  GuildScheduledEventPrivacyLevel,
  GuildScheduledEventStatus,
  GuildVerificationLevel,
  InteractionType,
  InteractionResponseType,
  InviteTargetType,
  MessageType,
  MessageFlags,
  PermissionFlagsBits,
  RESTJSONErrorCodes,
  StageInstancePrivacyLevel,
  StickerType,
  StickerFormatType,
  GuildSystemChannelFlags,
  ThreadMemberFlags,
  UserFlags,
  WebhookType,
} from 'discord-api-types/v9';
export {
  ActionRow,
  ButtonComponent,
  SelectMenuComponent,
  SelectMenuOption,
  ActionRowComponent,
} from '@discordjs/builders';
export { DiscordAPIError, HTTPError, RateLimitError } from '@discordjs/rest';
