import {
  blockQuote,
  bold,
  channelMention,
  codeBlock,
  ContextMenuCommandBuilder,
  formatEmoji,
  hideLinkEmbed,
  hyperlink,
  inlineCode,
  italic,
  quote,
  roleMention,
  SlashCommandBuilder,
  spoiler,
  strikethrough,
  time,
  TimestampStyles,
  TimestampStylesString,
  underscore,
  userMention,
} from '@discordjs/builders';
import { Collection } from '@discordjs/collection';
import {
  APIActionRowComponent,
  APIApplicationCommandInteractionData,
  APIApplicationCommandOption,
  APIApplicationCommandPermission,
  APIAuditLogChange,
  APIButtonComponent,
  APIEmbed,
  APIEmoji,
  APIInteractionDataResolvedChannel,
  APIInteractionDataResolvedGuildMember,
  APIInteractionGuildMember,
  APIMessage,
  APIMessageActionRowComponent,
  APIMessageComponent,
  APIModalActionRowComponent,
  APIOverwrite,
  APIPartialChannel,
  APIPartialEmoji,
  APIPartialGuild,
  APIRole,
  APISelectMenuComponent,
  APITemplateSerializedSourceGuild,
  APIUser,
  GatewayVoiceServerUpdateDispatchData,
  GatewayVoiceStateUpdateDispatchData,
  MessageActivityType,
  RESTPostAPIApplicationCommandsJSONBody,
  Snowflake,
  LocalizationMap,
  LocaleString,
} from 'discord-api-types/v9';
import { ChildProcess } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { AgentOptions } from 'node:https';
import { Response } from 'node-fetch';
import { Stream } from 'node:stream';
import { MessagePort, Worker } from 'node:worker_threads';
import * as WebSocket from 'ws';
import {
  ActivityTypes,
  ApplicationCommandOptionTypes,
  ApplicationCommandPermissionTypes,
  ApplicationCommandTypes,
  AutoModerationActionTypes,
  AutoModerationRuleEventTypes,
  AutoModerationRuleKeywordPresetTypes,
  AutoModerationRuleTriggerTypes,
  ChannelTypes,
  DefaultMessageNotificationLevels,
  ExplicitContentFilterLevels,
  InteractionResponseTypes,
  InteractionTypes,
  InviteTargetType,
  MembershipStates,
  MessageButtonStyles,
  MessageComponentTypes,
  MessageTypes,
  ModalComponentTypes,
  MFALevels,
  NSFWLevels,
  OverwriteTypes,
  PremiumTiers,
  PrivacyLevels,
  StickerFormatTypes,
  StickerTypes,
  TextInputStyles,
  VerificationLevels,
  WebhookTypes,
  GuildScheduledEventEntityTypes,
  GuildScheduledEventStatuses,
  GuildScheduledEventPrivacyLevels,
  VideoQualityModes,
  SortOrderType,
  ForumLayoutType,
  ApplicationRoleConnectionMetadataTypes,
} from './enums';
import {
  APIApplicationRoleConnectionMetadata,
  APIAutoModerationRule,
  GatewayAutoModerationActionExecutionDispatchData,
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
  RawModalSubmitInteractionData,
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
  RawTextInputComponentData,
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
  public readonly presence: Presence;
  public applicationId: Snowflake | null;
  public assets: RichPresenceAssets | null;
  public buttons: string[];
  public readonly createdAt: Date;
  public createdTimestamp: number;
  public details: string | null;
  public emoji: Emoji | null;
  public flags: Readonly<ActivityFlags>;
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

export class ActivityFlags extends BitField<ActivityFlagsString> {
  public static FLAGS: Record<ActivityFlagsString, number>;
  public static resolve(bit?: BitFieldResolvable<ActivityFlagsString, number>): number;
}

export abstract class AnonymousGuild extends BaseGuild {
  protected constructor(client: Client, data: RawAnonymousGuildData, immediatePatch?: boolean);
  public banner: string | null;
  public description: string | null;
  public nsfwLevel: NSFWLevel;
  public premiumSubscriptionCount: number | null;
  public splash: string | null;
  public vanityURLCode: string | null;
  public verificationLevel: VerificationLevel;
  public bannerURL(options?: StaticImageURLOptions): string | null;
  public splashURL(options?: StaticImageURLOptions): string | null;
}

export abstract class Application extends Base {
  protected constructor(client: Client, data: RawApplicationData);
  public readonly createdAt: Date;
  public readonly createdTimestamp: number;
  public description: string | null;
  public icon: string | null;
  public id: Snowflake;
  public name: string | null;
  public roleConnectionsVerificationURL: string | null;
  public coverURL(options?: StaticImageURLOptions): string | null;
  /** @deprecated This method is deprecated as it is unsupported and will be removed in the next major version. */
  public fetchAssets(): Promise<ApplicationAsset[]>;
  public iconURL(options?: StaticImageURLOptions): string | null;
  public toJSON(): unknown;
  public toString(): string | null;
}

export class ApplicationCommand<PermissionsFetchType = {}> extends Base {
  private constructor(client: Client, data: RawApplicationCommandData, guild?: Guild, guildId?: Snowflake);
  public applicationId: Snowflake;
  public readonly createdAt: Date;
  public readonly createdTimestamp: number;
  /** @deprecated Use {@link defaultMemberPermissions} and {@link dmPermission} instead. */
  public defaultPermission: boolean;
  public defaultMemberPermissions: Readonly<Permissions> | null;
  public description: string;
  public descriptionLocalizations: LocalizationMap | null;
  public descriptionLocalized: string | null;
  public dmPermission: boolean | null;
  public guild: Guild | null;
  public guildId: Snowflake | null;
  public readonly manager: ApplicationCommandManager;
  public id: Snowflake;
  public name: string;
  public nameLocalizations: LocalizationMap | null;
  public nameLocalized: string | null;
  public options: (ApplicationCommandOption & { nameLocalized?: string; descriptionLocalized?: string })[];
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
  public edit(data: Partial<ApplicationCommandData>): Promise<ApplicationCommand<PermissionsFetchType>>;
  public setName(name: string): Promise<ApplicationCommand<PermissionsFetchType>>;
  public setNameLocalizations(nameLocalizations: LocalizationMap): Promise<ApplicationCommand<PermissionsFetchType>>;
  public setDescription(description: string): Promise<ApplicationCommand<PermissionsFetchType>>;
  public setDescriptionLocalizations(
    descriptionLocalizations: LocalizationMap,
  ): Promise<ApplicationCommand<PermissionsFetchType>>;
  /** @deprecated Use {@link setDefaultMemberPermissions} and {@link setDMPermission} instead. */
  public setDefaultPermission(defaultPermission?: boolean): Promise<ApplicationCommand<PermissionsFetchType>>;
  public setDefaultMemberPermissions(
    defaultMemberPermissions: PermissionResolvable | null,
  ): Promise<ApplicationCommand<PermissionsFetchType>>;
  public setDMPermission(dmPermission?: boolean): Promise<ApplicationCommand<PermissionsFetchType>>;
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

export class ApplicationRoleConnectionMetadata {
  private constructor(data: APIApplicationRoleConnectionMetadata);
  public name: string;
  public nameLocalizations: LocalizationMap | null;
  public description: string;
  public descriptionLocalizations: LocalizationMap | null;
  public key: string;
  public type: ApplicationRoleConnectionMetadataTypes;
}

export type ApplicationResolvable = Application | Activity | Snowflake;

export type AutoModerationRuleResolvable = AutoModerationRule | Snowflake;

export class ApplicationFlags extends BitField<ApplicationFlagsString> {
  public static FLAGS: Record<ApplicationFlagsString, number>;
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
  private readonly api: unknown;
  private rest: unknown;
  private decrementMaxListeners(): void;
  private incrementMaxListeners(): void;

  public on<K extends keyof BaseClientEvents>(
    event: K,
    listener: (...args: BaseClientEvents[K]) => Awaitable<void>,
  ): this;
  public on<S extends string | symbol>(
    event: Exclude<S, keyof BaseClientEvents>,
    listener: (...args: any[]) => Awaitable<void>,
  ): this;

  public once<K extends keyof BaseClientEvents>(
    event: K,
    listener: (...args: BaseClientEvents[K]) => Awaitable<void>,
  ): this;
  public once<S extends string | symbol>(
    event: Exclude<S, keyof BaseClientEvents>,
    listener: (...args: any[]) => Awaitable<void>,
  ): this;

  public emit<K extends keyof BaseClientEvents>(event: K, ...args: BaseClientEvents[K]): boolean;
  public emit<S extends string | symbol>(event: Exclude<S, keyof BaseClientEvents>, ...args: unknown[]): boolean;

  public off<K extends keyof BaseClientEvents>(
    event: K,
    listener: (...args: BaseClientEvents[K]) => Awaitable<void>,
  ): this;
  public off<S extends string | symbol>(
    event: Exclude<S, keyof BaseClientEvents>,
    listener: (...args: any[]) => Awaitable<void>,
  ): this;

  public removeAllListeners<K extends keyof BaseClientEvents>(event?: K): this;
  public removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof BaseClientEvents>): this;

  public options: ClientOptions | WebhookClientOptions;
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
  deferred: boolean;
  ephemeral: boolean | null;
  replied: boolean;
  webhook: InteractionWebhook;
  reply(options: InteractionReplyOptions & { fetchReply: true }): Promise<GuildCacheMessage<Cached>>;
  reply(options: string | MessagePayload | InteractionReplyOptions): Promise<void>;
  deleteReply(message?: MessageResolvable | '@original'): Promise<void>;
  editReply(options: string | MessagePayload | InteractionEditReplyOptions): Promise<GuildCacheMessage<Cached>>;
  deferReply(options: InteractionDeferReplyOptions & { fetchReply: true }): Promise<GuildCacheMessage<Cached>>;
  deferReply(options?: InteractionDeferReplyOptions): Promise<void>;
  fetchReply(message?: MessageResolvable | '@original'): Promise<GuildCacheMessage<Cached>>;
  followUp(options: string | MessagePayload | InteractionReplyOptions): Promise<GuildCacheMessage<Cached>>;
}

export abstract class BaseCommandInteraction<Cached extends CacheType = CacheType> extends Interaction<Cached> {
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
    | 'getAttachment'
  >;
  public channelId: Snowflake;
  public commandId: Snowflake;
  public commandName: string;
  public deferred: boolean;
  public ephemeral: boolean | null;
  public replied: boolean;
  public webhook: InteractionWebhook;
  public awaitModalSubmit(
    options: AwaitModalSubmitOptions<ModalSubmitInteraction>,
  ): Promise<ModalSubmitInteraction<Cached>>;
  public inGuild(): this is BaseCommandInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is BaseCommandInteraction<'cached'>;
  public inRawGuild(): this is BaseCommandInteraction<'raw'>;
  public deferReply(options: InteractionDeferReplyOptions & { fetchReply: true }): Promise<GuildCacheMessage<Cached>>;
  public deferReply(options?: InteractionDeferReplyOptions): Promise<void>;
  public deleteReply(message?: MessageResolvable | '@original'): Promise<void>;
  public editReply(options: string | MessagePayload | InteractionEditReplyOptions): Promise<GuildCacheMessage<Cached>>;
  public fetchReply(message?: MessageResolvable | '@original'): Promise<GuildCacheMessage<Cached>>;
  public followUp(options: string | MessagePayload | InteractionReplyOptions): Promise<GuildCacheMessage<Cached>>;
  public reply(options: InteractionReplyOptions & { fetchReply: true }): Promise<GuildCacheMessage<Cached>>;
  public reply(options: string | MessagePayload | InteractionReplyOptions): Promise<void>;
  public showModal(modal: Modal | ModalOptions): Promise<void>;
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
  public rateLimitPerUser: number | null;
  public nsfw: boolean;
  public threads: GuildTextThreadManager<AllowedThreadTypeForTextChannel | AllowedThreadTypeForNewsChannel>;
  public topic: string | null;
  public createInvite(options?: CreateInviteOptions): Promise<Invite>;
  public fetchInvites(cache?: boolean): Promise<Collection<string, Invite>>;
  public setDefaultAutoArchiveDuration(
    defaultAutoArchiveDuration: ThreadAutoArchiveDuration | 'MAX',
    reason?: string,
  ): Promise<this>;
  public setTopic(topic: string | null, reason?: string): Promise<this>;
  public setType(type: Pick<typeof ChannelTypes, 'GUILD_TEXT'>, reason?: string): Promise<TextChannel>;
  public setType(type: Pick<typeof ChannelTypes, 'GUILD_NEWS'>, reason?: string): Promise<NewsChannel>;
}

export class BaseGuildVoiceChannel extends TextBasedChannelMixin(GuildChannel, ['lastPinTimestamp', 'lastPinAt']) {
  public constructor(guild: Guild, data?: RawGuildChannelData);
  public readonly members: Collection<Snowflake, GuildMember>;
  public readonly full: boolean;
  public readonly joinable: boolean;
  public bitrate: number;
  public nsfw: boolean;
  public rtcRegion: string | null;
  public rateLimitPerUser: number | null;
  public userLimit: number;
  public videoQualityMode: VideoQualityMode | null;
  public createInvite(options?: CreateInviteOptions): Promise<Invite>;
  public setRTCRegion(rtcRegion: string | null, reason?: string): Promise<this>;
  public fetchInvites(cache?: boolean): Promise<Collection<string, Invite>>;
  public setBitrate(bitrate: number, reason?: string): Promise<VoiceChannel>;
  public setUserLimit(userLimit: number, reason?: string): Promise<VoiceChannel>;
  public setVideoQualityMode(videoQualityMode: VideoQualityMode | number, reason?: string): Promise<VoiceChannel>;
}

export class BaseMessageComponent {
  protected constructor(data?: BaseMessageComponent | BaseMessageComponentOptions);
  public type: MessageComponentType | null;
  private static create(data: MessageComponentOptions, client?: Client | WebhookClient): MessageComponent | undefined;
  private static resolveType(type: MessageComponentTypeResolvable): MessageComponentType;
}

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
  public static FLAGS: Record<string, number | bigint>;
  public static resolve(bit?: BitFieldResolvable<string, number | bigint>): number | bigint;
}

export class ButtonInteraction<Cached extends CacheType = CacheType> extends MessageComponentInteraction<Cached> {
  private constructor(client: Client, data: RawMessageButtonInteractionData);
  public readonly component: CacheTypeReducer<
    Cached,
    MessageButton,
    APIButtonComponent,
    MessageButton | APIButtonComponent,
    MessageButton | APIButtonComponent
  >;
  public componentType: 'BUTTON';
  public inGuild(): this is ButtonInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is ButtonInteraction<'cached'>;
  public inRawGuild(): this is ButtonInteraction<'raw'>;
}

export type KeyedEnum<K, T> = {
  [Key in keyof K]: T | string;
};

export type EnumValueMapped<E extends KeyedEnum<T, number>, T extends Partial<Record<keyof E, unknown>>> = T & {
  [Key in keyof T as E[Key]]: T[Key];
};

export type MappedChannelCategoryTypes = EnumValueMapped<
  typeof ChannelTypes,
  {
    GUILD_NEWS: NewsChannel;
    GUILD_VOICE: VoiceChannel;
    GUILD_TEXT: TextChannel;
    GUILD_STORE: StoreChannel;
    GUILD_STAGE_VOICE: StageChannel;
    GUILD_FORUM: ForumChannel;
  }
>;

export type CategoryChannelTypes = ExcludeEnum<
  typeof ChannelTypes,
  | 'DM'
  | 'GROUP_DM'
  | 'UNKNOWN'
  | 'GUILD_PUBLIC_THREAD'
  | 'GUILD_NEWS_THREAD'
  | 'GUILD_PRIVATE_THREAD'
  | 'GUILD_CATEGORY'
  | 'GUILD_DIRECTORY'
>;

export class CategoryChannel extends GuildChannel {
  public readonly children: Collection<Snowflake, Exclude<NonThreadGuildBasedChannel, CategoryChannel>>;
  public static parent: null;
  public parentId: null;
  public type: 'GUILD_CATEGORY';

  public createChannel<T extends Exclude<CategoryChannelTypes, 'GUILD_STORE' | ChannelTypes.GUILD_STORE>>(
    name: string,
    options: CategoryCreateChannelOptions & { type: T },
  ): Promise<MappedChannelCategoryTypes[T]>;
  /** @deprecated See [Self-serve Game Selling Deprecation](https://support-dev.discord.com/hc/en-us/articles/6309018858647) for more information */
  public createChannel(
    name: string,
    options: CategoryCreateChannelOptions & { type: 'GUILD_STORE' | ChannelTypes.GUILD_STORE },
  ): Promise<StoreChannel>;
  public createChannel(name: string, options?: CategoryCreateChannelOptions): Promise<TextChannel>;
}

export type CategoryChannelResolvable = Snowflake | CategoryChannel;

export abstract class Channel extends Base {
  public constructor(client: Client, data?: RawChannelData, immediatePatch?: boolean);
  public readonly createdAt: Date | null;
  public readonly createdTimestamp: number | null;
  /** @deprecated This will be removed in the next major version, see https://github.com/discordjs/discord.js/issues/7091 */
  public deleted: boolean;
  public id: Snowflake;
  public readonly partial: false;
  public type: keyof typeof ChannelTypes;
  public flags: Readonly<ChannelFlags> | null;
  public delete(): Promise<this>;
  public fetch(force?: boolean): Promise<this>;
  public isText(): this is TextBasedChannel;
  public isVoice(): this is BaseGuildVoiceChannel;
  public isThread(): this is ThreadChannel;
  public isDirectory(): this is DirectoryChannel;
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
  public readyAt: If<Ready, Date>;
  public readonly readyTimestamp: If<Ready, number>;
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
  /** @deprecated Use {@link Sweepers#sweepMessages} instead */
  public sweepMessages(lifetime?: number): number;
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
  public flags: Readonly<ApplicationFlags>;
  public tags: string[];
  public installParams: ClientApplicationInstallParams | null;
  public customInstallURL: string | null;
  public owner: User | Team | null;
  public readonly partial: boolean;
  public rpcOrigins: string[];
  public fetch(): Promise<ClientApplication>;
  public fetchRoleConnectionMetadataRecords(): Promise<ApplicationRoleConnectionMetadata[]>;
  public editRoleConnectionMetadataRecords(
    records: ApplicationRoleConnectionMetadataEditOptions[],
  ): Promise<ApplicationRoleConnectionMetadata[]>;
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

export type ChannelFlagsString = 'PINNED' | 'REQUIRE_TAG';
export class ChannelFlags extends BitField<ChannelFlagsString> {
  public static FLAGS: Record<ChannelFlagsString, number>;
  public static resolve(bit?: BitFieldResolvable<ChannelFlagsString, number>): number;
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
  public [Symbol.asyncIterator](): AsyncIterableIterator<V>;
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
  getSubcommandGroup(required?: true): string;
  getSubcommandGroup(required: boolean): string | null;
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
  getMember(name: string, required: true): NonNullable<CommandInteractionOption<Cached>['member']>;
  getMember(name: string, required?: boolean): NonNullable<CommandInteractionOption<Cached>['member']> | null;
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

export class CommandInteraction<Cached extends CacheType = CacheType> extends BaseCommandInteraction<Cached> {
  public options: Omit<CommandInteractionOptionResolver<Cached>, 'getMessage' | 'getFocused'>;
  public inGuild(): this is CommandInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is CommandInteraction<'cached'>;
  public inRawGuild(): this is CommandInteraction<'raw'>;
  public toString(): string;
}

export class AutocompleteInteraction<Cached extends CacheType = CacheType> extends Interaction<Cached> {
  public readonly command: ApplicationCommand | ApplicationCommand<{ guild: GuildResolvable }> | null;
  public channelId: Snowflake;
  public commandId: Snowflake;
  public commandName: string;
  public responded: boolean;
  public options: Omit<CommandInteractionOptionResolver<Cached>, 'getMessage'>;
  public inGuild(): this is AutocompleteInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is AutocompleteInteraction<'cached'>;
  public inRawGuild(): this is AutocompleteInteraction<'raw'>;
  private transformOption(option: APIApplicationCommandOption): CommandInteractionOption;
  public respond(options: ApplicationCommandOptionChoiceData[]): Promise<void>;
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
  public getSubcommandGroup(required?: true): string;
  public getSubcommandGroup(required: boolean): string | null;
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
  public getMember(name: string, required: true): NonNullable<CommandInteractionOption<Cached>['member']>;
  public getMember(name: string, required?: boolean): NonNullable<CommandInteractionOption<Cached>['member']> | null;
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
  public getFocused(getFull: true): AutocompleteFocusedOption;
  public getFocused(getFull?: boolean): string;
  public getAttachment(name: string, required: true): NonNullable<CommandInteractionOption<Cached>['attachment']>;
  public getAttachment(
    name: string,
    required?: boolean,
  ): NonNullable<CommandInteractionOption<Cached>['attachment']> | null;
}

export class ContextMenuInteraction<Cached extends CacheType = CacheType> extends BaseCommandInteraction<Cached> {
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
  public targetType: Exclude<ApplicationCommandType, 'CHAT_INPUT'>;
  public inGuild(): this is ContextMenuInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is ContextMenuInteraction<'cached'>;
  public inRawGuild(): this is ContextMenuInteraction<'raw'>;
  private resolveContextMenuOptions(data: APIApplicationCommandInteractionData): CommandInteractionOption<Cached>[];
}

export class DataResolver extends null {
  private constructor();
  public static resolveBase64(data: Base64Resolvable): string;
  public static resolveCode(data: string, regx: RegExp): string;
  public static resolveFile(resource: BufferResolvable | Stream): Promise<Buffer | Stream>;
  public static resolveFileAsBuffer(resource: BufferResolvable | Stream): Promise<Buffer>;
  public static resolveImage(resource: BufferResolvable | Base64Resolvable): Promise<string | null>;
  public static resolveInviteCode(data: InviteResolvable): string;
  public static resolveGuildTemplateCode(data: GuildTemplateResolvable): string;
}

export class DiscordAPIError extends Error {
  private constructor(error: unknown, status: number, request: unknown);
  private static flattenErrors(obj: unknown, key: string): string[];

  public code: number;
  public method: string;
  public path: string;
  public httpStatus: number;
  public requestData: HTTPErrorData;
}

export class DMChannel extends TextBasedChannelMixin(Channel, [
  'bulkDelete',
  'fetchWebhooks',
  'createWebhook',
  'setRateLimitPerUser',
  'setNSFW',
]) {
  private constructor(client: Client, data?: RawDMChannelData);
  public recipient: User;
  public type: 'DM';
  public flags: Readonly<ChannelFlags>;
  public fetch(force?: boolean): Promise<this>;
}

export class Emoji extends Base {
  protected constructor(client: Client, emoji: RawEmojiData);
  public animated: boolean | null;
  public readonly createdAt: Date | null;
  public readonly createdTimestamp: number | null;
  /** @deprecated This will be removed in the next major version, see https://github.com/discordjs/discord.js/issues/7091 */
  public deleted: boolean;
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
  public maxVideoChannelUsers: number | null;
  public approximateMemberCount: number | null;
  public approximatePresenceCount: number | null;
  public autoModerationRules: AutoModerationRuleManager;
  public available: boolean;
  public bans: GuildBanManager;
  public channels: GuildChannelManager;
  public commands: GuildApplicationCommandManager;
  public defaultMessageNotifications: DefaultMessageNotificationLevel | number;
  /** @deprecated This will be removed in the next major version, see https://github.com/discordjs/discord.js/issues/7091 */
  public deleted: boolean;
  public discoverySplash: string | null;
  public emojis: GuildEmojiManager;
  public explicitContentFilter: ExplicitContentFilterLevel;
  public invites: GuildInviteManager;
  public readonly joinedAt: Date;
  public joinedTimestamp: number;
  public large: boolean;
  public maximumMembers: number | null;
  public maximumPresences: number | null;
  /** @deprecated Use {@link GuildMemberManager.me} instead. */
  public readonly me: GuildMember | null;
  public memberCount: number;
  public members: GuildMemberManager;
  public mfaLevel: MFALevel;
  public ownerId: Snowflake;
  public preferredLocale: string;
  public premiumProgressBarEnabled: boolean;
  public premiumTier: PremiumTier;
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
  public systemChannelFlags: Readonly<SystemChannelFlags>;
  public systemChannelId: Snowflake | null;
  public vanityURLUses: number | null;
  public readonly voiceAdapterCreator: InternalDiscordGatewayAdapterCreator;
  public readonly voiceStates: VoiceStateManager;
  public readonly widgetChannel: TextChannel | NewsChannel | VoiceBasedChannel | ForumChannel | null;
  public widgetChannelId: Snowflake | null;
  public widgetEnabled: boolean | null;
  public readonly maximumBitrate: number;
  public createTemplate(name: string, description?: string): Promise<GuildTemplate>;
  public delete(): Promise<Guild>;
  public discoverySplashURL(options?: StaticImageURLOptions): string | null;
  public edit(data: GuildEditData, reason?: string): Promise<Guild>;
  public editWelcomeScreen(data: WelcomeScreenEditData): Promise<WelcomeScreen>;
  public equals(guild: Guild): boolean;
  public fetchAuditLogs<T extends GuildAuditLogsResolvable = 'ALL'>(
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
  public disableInvites(disabled?: boolean): Promise<Guild>;
  public setAFKChannel(afkChannel: VoiceChannelResolvable | null, reason?: string): Promise<Guild>;
  public setAFKTimeout(afkTimeout: number, reason?: string): Promise<Guild>;
  public setBanner(banner: BufferResolvable | Base64Resolvable | null, reason?: string): Promise<Guild>;
  /** @deprecated Use {@link GuildChannelManager.setPositions} instead */
  public setChannelPositions(channelPositions: readonly ChannelPosition[]): Promise<Guild>;
  public setDefaultMessageNotifications(
    defaultMessageNotifications: DefaultMessageNotificationLevel | number | null,
    reason?: string,
  ): Promise<Guild>;
  public setDiscoverySplash(
    discoverySplash: BufferResolvable | Base64Resolvable | null,
    reason?: string,
  ): Promise<Guild>;
  public setExplicitContentFilter(
    explicitContentFilter: ExplicitContentFilterLevel | number | null,
    reason?: string,
  ): Promise<Guild>;
  public setIcon(icon: BufferResolvable | Base64Resolvable | null, reason?: string): Promise<Guild>;
  public setName(name: string, reason?: string): Promise<Guild>;
  public setOwner(owner: GuildMemberResolvable, reason?: string): Promise<Guild>;
  public setPreferredLocale(preferredLocale: string | null, reason?: string): Promise<Guild>;
  public setPublicUpdatesChannel(publicUpdatesChannel: TextChannelResolvable | null, reason?: string): Promise<Guild>;
  /** @deprecated Use {@link RoleManager.setPositions} instead */
  public setRolePositions(rolePositions: readonly RolePosition[]): Promise<Guild>;
  public setRulesChannel(rulesChannel: TextChannelResolvable | null, reason?: string): Promise<Guild>;
  public setSplash(splash: BufferResolvable | Base64Resolvable | null, reason?: string): Promise<Guild>;
  public setSystemChannel(systemChannel: TextChannelResolvable | null, reason?: string): Promise<Guild>;
  public setSystemChannelFlags(systemChannelFlags: SystemChannelFlagsResolvable, reason?: string): Promise<Guild>;
  public setVerificationLevel(verificationLevel: VerificationLevel | number | null, reason?: string): Promise<Guild>;
  public setPremiumProgressBarEnabled(enabled?: boolean, reason?: string): Promise<Guild>;
  public setWidgetSettings(settings: GuildWidgetSettingsData, reason?: string): Promise<Guild>;
  public toJSON(): unknown;
}

export class GuildAuditLogs<T extends GuildAuditLogsResolvable = 'ALL'> {
  private constructor(guild: Guild, data: RawGuildAuditLogData);
  private webhooks: Collection<Snowflake, Webhook>;
  private integrations: Collection<Snowflake | string, Integration>;
  private autoModerationRules: Collection<Snowflake, AutoModerationRule>;

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
  TActionRaw extends GuildAuditLogsResolvable = 'ALL',
  TAction = TActionRaw extends keyof GuildAuditLogsIds
    ? GuildAuditLogsIds[TActionRaw]
    : TActionRaw extends null
    ? 'ALL'
    : TActionRaw,
  TActionType extends GuildAuditLogsActionType = TAction extends keyof GuildAuditLogsTypes
    ? GuildAuditLogsTypes[TAction][1]
    : 'ALL',
  TTargetType extends GuildAuditLogsTarget = TAction extends keyof GuildAuditLogsTypes
    ? GuildAuditLogsTypes[TAction][0]
    : 'UNKNOWN',
> {
  private constructor(guild: Guild, data: RawGuildAuditLogEntryData, logs?: GuildAuditLogs);
  public action: TAction;
  public actionType: TActionType;
  public changes: AuditLogChange[];
  public readonly createdAt: Date;
  public readonly createdTimestamp: number;
  public executorId: Snowflake | null;
  public executor: User | null;
  public extra: TAction extends keyof GuildAuditLogsEntryExtraField ? GuildAuditLogsEntryExtraField[TAction] : null;
  public id: Snowflake;
  public reason: string | null;
  public targetId: Snowflake | null;
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
  private memberPermissions(member: GuildMember, checkAdmin: boolean): Readonly<Permissions>;
  private rolePermissions(role: Role, checkAdmin: boolean): Readonly<Permissions>;
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
  public type: Exclude<keyof typeof ChannelTypes, 'DM' | 'GROUP_DM' | 'UNKNOWN'>;
  public flags: Readonly<ChannelFlags>;
  public readonly viewable: boolean;
  public clone(options?: GuildChannelCloneOptions): Promise<this>;
  public delete(reason?: string): Promise<this>;
  public edit(data: ChannelData, reason?: string): Promise<this>;
  public equals(channel: GuildChannel): boolean;
  public lockPermissions(): Promise<this>;
  public permissionsFor(memberOrRole: GuildMember | Role, checkAdmin?: boolean): Readonly<Permissions>;
  public permissionsFor(
    memberOrRole: GuildMemberResolvable | RoleResolvable,
    checkAdmin?: boolean,
  ): Readonly<Permissions> | null;
  public setName(name: string, reason?: string): Promise<this>;
  public setParent(channel: CategoryChannelResolvable | null, options?: SetParentOptions): Promise<this>;
  public setPosition(position: number, options?: SetChannelPositionOptions): Promise<this>;
  public isText(): this is GuildTextBasedChannel;
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
  private _roles: Snowflake[];
  public avatar: string | null;
  public readonly bannable: boolean;
  /** @deprecated This will be removed in the next major version, see https://github.com/discordjs/discord.js/issues/7091 */
  public deleted: boolean;
  public readonly displayColor: number;
  public readonly displayHexColor: HexColorString;
  public readonly displayName: string;
  public flags: Readonly<GuildMemberFlags>;
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
  public readonly permissions: Readonly<Permissions>;
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
  public permissionsIn(channel: GuildChannelResolvable): Readonly<Permissions>;
  public setNickname(nickname: string | null, reason?: string): Promise<GuildMember>;
  public setFlags(flags: GuildMemberFlagsResolvable): Promise<GuildMember>;
  public toJSON(): unknown;
  public toString(): MemberMention;
  public valueOf(): string;
}

export class GuildMemberFlags extends BitField<GuildMemberFlagsString> {
  public static FLAGS: Record<GuildMemberFlagsString, number>;
  public static resolve(bit?: BitFieldResolvable<GuildMemberFlagsString, number>): number;
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
  public discoverySplashURL(options?: StaticImageURLOptions): string | null;
  public iconURL(options?: ImageURLOptions): string | null;
  public splashURL(options?: StaticImageURLOptions): string | null;
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
  public coverImageURL(options?: StaticImageURLOptions): string | null;
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
  public isActive(): this is GuildScheduledEvent<'ACTIVE'>;
  public isCanceled(): this is GuildScheduledEvent<'CANCELED'>;
  public isCompleted(): this is GuildScheduledEvent<'COMPLETED'>;
  public isScheduled(): this is GuildScheduledEvent<'SCHEDULED'>;
}

export class GuildTemplate extends Base {
  private constructor(client: Client, data: RawGuildTemplateData);
  public readonly createdTimestamp: number;
  public readonly updatedTimestamp: number;
  public readonly url: string;
  public code: string;
  public name: string;
  public description: string | null;
  public usageCount: number;
  public creator: User;
  public creatorId: Snowflake;
  public createdAt: Date;
  public updatedAt: Date;
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

export class HTTPError extends Error {
  private constructor(message: string, name: string, code: number, request: unknown);
  public code: number;
  public method: string;
  public name: string;
  public path: string;
  public requestData: HTTPErrorData;
}

// tslint:disable-next-line:no-empty-interface - Merge RateLimitData into RateLimitError to not have to type it again
export interface RateLimitError extends RateLimitData {}
export class RateLimitError extends Error {
  private constructor(data: RateLimitData);
  public name: 'RateLimitError';
}

export class Integration extends Base {
  private constructor(client: Client, data: RawIntegrationData, guild: Guild);
  public account: IntegrationAccount;
  public application: IntegrationApplication | null;
  public enabled: boolean;
  public expireBehavior: number | undefined;
  public expireGracePeriod: number | undefined;
  public guild: Guild;
  public id: Snowflake | string;
  public name: string;
  public role: Role | undefined;
  public enableEmoticons: boolean | null;
  public readonly roles: Collection<Snowflake, Role>;
  public syncedAt: number | undefined;
  public syncing: boolean | undefined;
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
  /** @deprecated This property is no longer being sent by the API. */
  public summary: string | null;
  public hook: boolean | null;
  public cover: string | null;
  public verifyKey: string | null;
}

export class Intents extends BitField<IntentsString> {
  public static FLAGS: Record<IntentsString, number>;
  public static resolve(bit?: BitFieldResolvable<IntentsString, number>): number;
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
  public appPermissions: Readonly<Permissions> | null;
  public memberPermissions: CacheTypeReducer<Cached, Readonly<Permissions>>;
  public locale: string;
  public guildLocale: CacheTypeReducer<Cached, string, string, string>;
  public inGuild(): this is Interaction<'raw' | 'cached'>;
  public inCachedGuild(): this is Interaction<'cached'>;
  public inRawGuild(): this is Interaction<'raw'>;
  public isApplicationCommand(): this is BaseCommandInteraction<Cached>;
  public isButton(): this is ButtonInteraction<Cached>;
  public isCommand(): this is CommandInteraction<Cached>;
  public isAutocomplete(): this is AutocompleteInteraction<Cached>;
  public isContextMenu(): this is ContextMenuInteraction<Cached>;
  public isUserContextMenu(): this is UserContextMenuInteraction<Cached>;
  public isMessageContextMenu(): this is MessageContextMenuInteraction<Cached>;
  public isMessageComponent(): this is MessageComponentInteraction<Cached>;
  public isModalSubmit(): this is ModalSubmitInteraction<Cached>;
  public isSelectMenu(): this is SelectMenuInteraction<Cached>;
  public isRepliable(): this is this & InteractionResponseFields<Cached>;
}

export class InteractionCollector<T extends Interaction> extends Collector<Snowflake, T> {
  public constructor(client: Client, options?: InteractionCollectorOptions<T>);
  private _handleMessageDeletion(message: Message): void;
  private _handleChannelDeletion(channel: NonThreadGuildBasedChannel): void;
  private _handleGuildDeletion(guild: Guild): void;

  public channelId: Snowflake | null;
  public componentType: MessageComponentType | null;
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
  public channelId: Snowflake;
  public code: string;
  public readonly deletable: boolean;
  public readonly createdAt: Date | null;
  public createdTimestamp: number | null;
  public readonly expiresAt: Date | null;
  public readonly expiresTimestamp: number | null;
  public guild: InviteGuild | Guild | null;
  public inviter: User | null;
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
  /** @deprecated Use Global Sweepers instead */
  public interval: NodeJS.Timeout | null;
  /** @deprecated Use Global Sweepers instead */
  public sweepFilter: SweepFilter<K, V> | null;

  /** @deprecated Use `Sweepers.filterByLifetime` instead */
  public static filterByLifetime<K, V>(options?: LifetimeFilterOptions<K, V>): SweepFilter<K, V>;
}

export type MessageCollectorOptionsParams<T extends MessageComponentTypeResolvable, Cached extends boolean = boolean> =
  | {
      componentType?: T;
    } & MessageComponentCollectorOptions<MappedInteractionTypes<Cached>[T]>;

export type MessageChannelCollectorOptionsParams<
  T extends MessageComponentTypeResolvable,
  Cached extends boolean = boolean,
> =
  | {
      componentType?: T;
    } & MessageChannelComponentCollectorOptions<MappedInteractionTypes<Cached>[T]>;

export type AwaitMessageCollectorOptionsParams<
  T extends MessageComponentTypeResolvable,
  Cached extends boolean = boolean,
> =
  | { componentType?: T } & Pick<
      InteractionCollectorOptions<MappedInteractionTypes<Cached>[T]>,
      keyof AwaitMessageComponentOptions<any>
    >;

export interface StringMappedInteractionTypes<Cached extends CacheType = CacheType> {
  BUTTON: ButtonInteraction<Cached>;
  SELECT_MENU: SelectMenuInteraction<Cached>;
  ACTION_ROW: MessageComponentInteraction<Cached>;
}

export type WrapBooleanCache<T extends boolean> = If<T, 'cached', CacheType>;

export type MappedInteractionTypes<Cached extends boolean = boolean> = EnumValueMapped<
  typeof MessageComponentTypes,
  {
    BUTTON: ButtonInteraction<WrapBooleanCache<Cached>>;
    SELECT_MENU: SelectMenuInteraction<WrapBooleanCache<Cached>>;
    ACTION_ROW: MessageComponentInteraction<WrapBooleanCache<Cached>>;
    TEXT_INPUT: ModalSubmitInteraction<WrapBooleanCache<Cached>>;
  }
>;

export class Message<Cached extends boolean = boolean> extends Base {
  private readonly _cacheType: Cached;
  private constructor(client: Client, data: RawMessageData);
  private _patch(data: RawPartialMessageData | RawMessageData): void;

  public activity: MessageActivity | null;
  public applicationId: Snowflake | null;
  public attachments: Collection<Snowflake, MessageAttachment>;
  public author: User;
  public get bulkDeletable(): boolean;
  public readonly channel: If<Cached, GuildTextBasedChannel, TextBasedChannel>;
  public channelId: Snowflake;
  public readonly cleanContent: string;
  public components: MessageActionRow[];
  public content: string;
  public readonly createdAt: Date;
  public createdTimestamp: number;
  public readonly crosspostable: boolean;
  public readonly deletable: boolean;
  /** @deprecated This will be removed in the next major version, see https://github.com/discordjs/discord.js/issues/7091 */
  public deleted: boolean;
  public readonly editable: boolean;
  public readonly editedAt: Date | null;
  public editedTimestamp: number | null;
  public embeds: MessageEmbed[];
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
  public flags: Readonly<MessageFlags>;
  public reference: MessageReference | null;
  public position: number | null;
  public awaitMessageComponent<T extends MessageComponentTypeResolvable = 'ACTION_ROW'>(
    options?: AwaitMessageCollectorOptionsParams<T, Cached>,
  ): Promise<MappedInteractionTypes<Cached>[T]>;
  public awaitReactions(options?: AwaitReactionsOptions): Promise<Collection<Snowflake | string, MessageReaction>>;
  public createReactionCollector(options?: ReactionCollectorOptions): ReactionCollector;
  public createMessageComponentCollector<T extends MessageComponentTypeResolvable = 'ACTION_ROW'>(
    options?: MessageCollectorOptionsParams<T, Cached>,
  ): InteractionCollector<MappedInteractionTypes<Cached>[T]>;
  public delete(): Promise<Message>;
  public edit(content: string | MessageEditOptions | MessagePayload): Promise<Message>;
  public equals(message: Message, rawData: unknown): boolean;
  public fetchReference(): Promise<Message>;
  public fetchWebhook(): Promise<Webhook>;
  public crosspost(): Promise<Message>;
  public fetch(force?: boolean): Promise<Message>;
  public pin(reason?: string): Promise<Message>;
  public react(emoji: EmojiIdentifierResolvable): Promise<MessageReaction>;
  public removeAttachments(): Promise<Message>;
  public reply(options: string | MessagePayload | ReplyMessageOptions): Promise<Message>;
  public resolveComponent(customId: string): MessageActionRowComponent | null;
  public startThread(options: StartThreadOptions): Promise<ThreadChannel>;
  public suppressEmbeds(suppress?: boolean): Promise<Message>;
  public toJSON(): unknown;
  public toString(): string;
  public unpin(reason?: string): Promise<Message>;
  public inGuild(): this is Message<true> & this;
}

export class MessageActionRow<
  T extends MessageActionRowComponent | ModalActionRowComponent = MessageActionRowComponent,
  U = T extends ModalActionRowComponent ? ModalActionRowComponentResolvable : MessageActionRowComponentResolvable,
  V = T extends ModalActionRowComponent
    ? APIActionRowComponent<APIModalActionRowComponent>
    : APIActionRowComponent<APIMessageActionRowComponent>,
> extends BaseMessageComponent {
  // tslint:disable-next-line:ban-ts-ignore
  // @ts-ignore (TS:2344, Caused by TypeScript 4.8)
  // Fixed in DiscordJS >= 14.x / DiscordApiTypes >= 0.37.x, ignoring the type error here.
  public constructor(data?: MessageActionRow<T> | MessageActionRowOptions<U> | V);
  public type: 'ACTION_ROW';
  public components: T[];
  public addComponents(...components: U[] | U[][]): this;
  public setComponents(...components: U[] | U[][]): this;
  public spliceComponents(index: number, deleteCount: number, ...components: U[] | U[][]): this;
  public toJSON(): V;
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

export class MessageButton extends BaseMessageComponent {
  public constructor(data?: MessageButton | MessageButtonOptions | APIButtonComponent);
  public customId: string | null;
  public disabled: boolean;
  public emoji: APIPartialEmoji | null;
  public label: string | null;
  public style: MessageButtonStyle | null;
  public type: 'BUTTON';
  public url: string | null;
  public setCustomId(customId: string): this;
  public setDisabled(disabled?: boolean): this;
  public setEmoji(emoji: EmojiIdentifierResolvable): this;
  public setLabel(label: string): this;
  public setStyle(style: MessageButtonStyleResolvable): this;
  public setURL(url: string): this;
  public toJSON(): APIButtonComponent;
  private static resolveStyle(style: MessageButtonStyleResolvable): MessageButtonStyle;
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
    MessageActionRowComponent,
    Exclude<APIMessageComponent, APIActionRowComponent<APIMessageActionRowComponent>>,
    MessageActionRowComponent | Exclude<APIMessageComponent, APIActionRowComponent<APIMessageActionRowComponent>>,
    MessageActionRowComponent | Exclude<APIMessageComponent, APIActionRowComponent<APIMessageActionRowComponent>>
  >;
  public componentType: Exclude<MessageComponentType, 'ACTION_ROW'>;
  public customId: string;
  public channelId: Snowflake;
  public deferred: boolean;
  public ephemeral: boolean | null;
  public message: GuildCacheMessage<Cached>;
  public replied: boolean;
  public webhook: InteractionWebhook;
  public awaitModalSubmit(
    options: AwaitModalSubmitOptions<ModalSubmitInteraction>,
  ): Promise<ModalSubmitInteraction<Cached>>;
  public inGuild(): this is MessageComponentInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is MessageComponentInteraction<'cached'>;
  public inRawGuild(): this is MessageComponentInteraction<'raw'>;
  public deferReply(options: InteractionDeferReplyOptions & { fetchReply: true }): Promise<GuildCacheMessage<Cached>>;
  public deferReply(options?: InteractionDeferReplyOptions): Promise<void>;
  public deferUpdate(options: InteractionDeferUpdateOptions & { fetchReply: true }): Promise<GuildCacheMessage<Cached>>;
  public deferUpdate(options?: InteractionDeferUpdateOptions): Promise<void>;
  public deleteReply(message?: MessageResolvable | '@original'): Promise<void>;
  public editReply(options: string | MessagePayload | InteractionEditReplyOptions): Promise<GuildCacheMessage<Cached>>;
  public fetchReply(message?: MessageResolvable | '@original'): Promise<GuildCacheMessage<Cached>>;
  public followUp(options: string | MessagePayload | InteractionReplyOptions): Promise<GuildCacheMessage<Cached>>;
  public reply(options: InteractionReplyOptions & { fetchReply: true }): Promise<GuildCacheMessage<Cached>>;
  public reply(options: string | MessagePayload | InteractionReplyOptions): Promise<void>;
  public showModal(modal: Modal | ModalOptions): Promise<void>;
  public update(options: InteractionUpdateOptions & { fetchReply: true }): Promise<GuildCacheMessage<Cached>>;
  public update(options: string | MessagePayload | InteractionUpdateOptions): Promise<void>;

  public static resolveType(type: MessageComponentTypeResolvable): MessageComponentType;
}

export class MessageContextMenuInteraction<
  Cached extends CacheType = CacheType,
> extends ContextMenuInteraction<Cached> {
  public readonly targetMessage: NonNullable<CommandInteractionOption<Cached>['message']>;
  public inGuild(): this is MessageContextMenuInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is MessageContextMenuInteraction<'cached'>;
  public inRawGuild(): this is MessageContextMenuInteraction<'raw'>;
}

export class MessageEmbed {
  private _fieldEquals(field: EmbedField, other: EmbedField): boolean;

  public constructor(data?: MessageEmbed | MessageEmbedOptions | APIEmbed);
  public author: MessageEmbedAuthor | null;
  public color: number | null;
  public readonly createdAt: Date | null;
  public description: string | null;
  public fields: EmbedField[];
  public footer: MessageEmbedFooter | null;
  public readonly hexColor: HexColorString | null;
  public image: MessageEmbedImage | null;
  public readonly length: number;
  public provider: MessageEmbedProvider | null;
  public thumbnail: MessageEmbedThumbnail | null;
  public timestamp: number | null;
  public title: string | null;
  /** @deprecated */
  public type: string;
  public url: string | null;
  public readonly video: MessageEmbedVideo | null;
  /** @deprecated This method is a wrapper for {@link MessageEmbed#addFields}. Use that instead. */
  public addField(name: string, value: string, inline?: boolean): this;
  public addFields(...fields: EmbedFieldData[] | EmbedFieldData[][]): this;
  public setFields(...fields: EmbedFieldData[] | EmbedFieldData[][]): this;
  public setAuthor(options: EmbedAuthorData | null): this;
  /** @deprecated Supply a lone object of interface {@link EmbedAuthorData} instead. */
  public setAuthor(name: string, iconURL?: string, url?: string): this;
  public setColor(color: ColorResolvable): this;
  public setDescription(description: string): this;
  public setFooter(options: EmbedFooterData | null): this;
  /** @deprecated Supply a lone object of interface {@link EmbedFooterData} instead. */
  public setFooter(text: string, iconURL?: string): this;
  public setImage(url: string): this;
  public setThumbnail(url: string): this;
  public setTimestamp(timestamp?: Date | number | null): this;
  public setTitle(title: string): this;
  public setURL(url: string): this;
  public spliceFields(index: number, deleteCount: number, ...fields: EmbedFieldData[] | EmbedFieldData[][]): this;
  public equals(embed: MessageEmbed | APIEmbed): boolean;
  public toJSON(): APIEmbed;

  public static normalizeField(name: string, value: string, inline?: boolean): Required<EmbedFieldData>;
  public static normalizeFields(...fields: EmbedFieldData[] | EmbedFieldData[][]): Required<EmbedFieldData>[];
}

export class MessageFlags extends BitField<MessageFlagsString> {
  public static FLAGS: Record<MessageFlagsString, number>;
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
  private _parsedUsers: Collection<Snowflake, User> | null;

  public readonly channels: Collection<Snowflake, AnyChannel>;
  public readonly client: Client;
  public everyone: boolean;
  public readonly guild: Guild;
  public has(data: UserResolvable | RoleResolvable | ChannelResolvable, options?: MessageMentionsHasOptions): boolean;
  public readonly members: Collection<Snowflake, GuildMember> | null;
  public readonly parsedUsers: Collection<Snowflake, User>;
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
  public data: RawMessagePayloadData | null;
  public readonly isUser: boolean;
  public readonly isWebhook: boolean;
  public readonly isMessage: boolean;
  public readonly isMessageManager: boolean;
  public readonly isInteraction: boolean;
  public files: HTTPAttachmentData[] | null;
  public options: MessageOptions | WebhookMessageOptions;
  public target: MessageTarget;

  public static create(
    target: MessageTarget,
    options: string | MessageOptions | WebhookMessageOptions,
    extra?: MessageOptions | WebhookMessageOptions,
  ): MessagePayload;
  public static resolveFile(
    fileLike: BufferResolvable | Stream | FileOptions | MessageAttachment,
  ): Promise<HTTPAttachmentData>;

  public makeContent(): string | undefined;
  public resolveData(): this;
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

export class MessageSelectMenu extends BaseMessageComponent {
  public constructor(data?: MessageSelectMenu | MessageSelectMenuOptions | APISelectMenuComponent);
  public customId: string | null;
  public disabled: boolean;
  public maxValues: number | null;
  public minValues: number | null;
  public options: MessageSelectOption[];
  public placeholder: string | null;
  public type: 'SELECT_MENU';
  public addOptions(...options: MessageSelectOptionData[] | MessageSelectOptionData[][]): this;
  public setOptions(...options: MessageSelectOptionData[] | MessageSelectOptionData[][]): this;
  public setCustomId(customId: string): this;
  public setDisabled(disabled?: boolean): this;
  public setMaxValues(maxValues: number): this;
  public setMinValues(minValues: number): this;
  public setPlaceholder(placeholder: string): this;
  public spliceOptions(
    index: number,
    deleteCount: number,
    ...options: MessageSelectOptionData[] | MessageSelectOptionData[][]
  ): this;
  public toJSON(): APISelectMenuComponent;
}

export class Modal {
  public constructor(data?: Modal | ModalOptions);
  public components: MessageActionRow<ModalActionRowComponent>[];
  public customId: string | null;
  public title: string | null;
  public addComponents(
    ...components: (
      | MessageActionRow<ModalActionRowComponent>
      | (Required<BaseMessageComponentOptions> & MessageActionRowOptions<ModalActionRowComponentResolvable>)
    )[]
  ): this;
  public setComponents(
    ...components: (
      | MessageActionRow<ModalActionRowComponent>
      | (Required<BaseMessageComponentOptions> & MessageActionRowOptions<ModalActionRowComponentResolvable>)
    )[]
  ): this;
  public setCustomId(customId: string): this;
  public spliceComponents(
    index: number,
    deleteCount: number,
    ...components: (
      | MessageActionRow<ModalActionRowComponent>
      | (Required<BaseMessageComponentOptions> & MessageActionRowOptions<ModalActionRowComponentResolvable>)
    )[]
  ): this;
  public setTitle(title: string): this;
  public toJSON(): RawModalSubmitInteractionData;
}

export class ModalSubmitFieldsResolver {
  constructor(components: PartialModalActionRow[]);
  private readonly _fields: PartialTextInputData[];
  public getField(customId: string): PartialTextInputData;
  public getTextInputValue(customId: string): string;
}

export interface ModalMessageModalSubmitInteraction<Cached extends CacheType = CacheType>
  extends ModalSubmitInteraction<Cached> {
  message: GuildCacheMessage<Cached>;
  channelId: Snowflake;
  update(options: InteractionUpdateOptions & { fetchReply: true }): Promise<GuildCacheMessage<Cached>>;
  update(options: string | MessagePayload | InteractionUpdateOptions): Promise<void>;
  deferUpdate(options: InteractionDeferUpdateOptions & { fetchReply: true }): Promise<GuildCacheMessage<Cached>>;
  deferUpdate(options?: InteractionDeferUpdateOptions): Promise<void>;
  inGuild(): this is ModalMessageModalSubmitInteraction<'raw' | 'cached'>;
  inCachedGuild(): this is ModalMessageModalSubmitInteraction<'cached'>;
  inRawGuild(): this is ModalMessageModalSubmitInteraction<'raw'>;
}

export class ModalSubmitInteraction<Cached extends CacheType = CacheType> extends Interaction<Cached> {
  protected constructor(client: Client, data: RawModalSubmitInteractionData);
  public customId: string;
  public components: PartialModalActionRow[];
  public deferred: boolean;
  public ephemeral: boolean | null;
  public message: GuildCacheMessage<Cached> | null;
  public fields: ModalSubmitFieldsResolver;
  public replied: false;
  public webhook: InteractionWebhook;
  public reply(options: InteractionReplyOptions & { fetchReply: true }): Promise<GuildCacheMessage<Cached>>;
  public reply(options: string | MessagePayload | InteractionReplyOptions): Promise<void>;
  public deleteReply(message?: MessageResolvable | '@original'): Promise<void>;
  public editReply(options: string | MessagePayload | InteractionEditReplyOptions): Promise<GuildCacheMessage<Cached>>;
  public deferReply(options: InteractionDeferReplyOptions & { fetchReply: true }): Promise<GuildCacheMessage<Cached>>;
  public deferReply(options?: InteractionDeferReplyOptions): Promise<void>;
  public deferUpdate(options: InteractionDeferUpdateOptions & { fetchReply: true }): Promise<GuildCacheMessage<Cached>>;
  public deferUpdate(options?: InteractionDeferUpdateOptions): Promise<void>;
  public fetchReply(message?: MessageResolvable | '@original'): Promise<GuildCacheMessage<Cached>>;
  public followUp(options: string | MessagePayload | InteractionReplyOptions): Promise<GuildCacheMessage<Cached>>;
  public inGuild(): this is ModalSubmitInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is ModalSubmitInteraction<'cached'>;
  public inRawGuild(): this is ModalSubmitInteraction<'raw'>;
  public isFromMessage(): this is ModalMessageModalSubmitInteraction<Cached>;
  public update(options: InteractionUpdateOptions & { fetchReply: true }): Promise<GuildCacheMessage<Cached>>;
  public update(options: string | MessagePayload | InteractionUpdateOptions): Promise<void>;
}

export class NewsChannel extends BaseGuildTextChannel {
  public threads: GuildTextThreadManager<AllowedThreadTypeForNewsChannel>;
  public type: 'GUILD_NEWS';
  public addFollower(channel: TextChannelResolvable, reason?: string): Promise<NewsChannel>;
}

export class OAuth2Guild extends BaseGuild {
  private constructor(client: Client, data: RawOAuth2GuildData);
  public owner: boolean;
  public permissions: Readonly<Permissions>;
}

export class PartialGroupDMChannel extends Channel {
  private constructor(client: Client, data: RawPartialGroupDMChannelData);
  public name: string | null;
  public icon: string | null;
  public flags: null;
  public recipients: PartialRecipient[];
  public iconURL(options?: StaticImageURLOptions): string | null;
}

export class PermissionOverwrites extends Base {
  private constructor(client: Client, data: RawPermissionOverwriteData, channel: NonThreadGuildBasedChannel);
  public allow: Readonly<Permissions>;
  public readonly channel: NonThreadGuildBasedChannel;
  public deny: Readonly<Permissions>;
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

export class Permissions extends BitField<PermissionString, bigint> {
  public any(permission: PermissionResolvable, checkAdmin?: boolean): boolean;
  public has(permission: PermissionResolvable, checkAdmin?: boolean): boolean;
  public missing(bits: BitFieldResolvable<PermissionString, bigint>, checkAdmin?: boolean): PermissionString[];
  public serialize(checkAdmin?: boolean): Record<PermissionString, boolean>;
  public toArray(): PermissionString[];

  public static ALL: bigint;
  public static DEFAULT: bigint;
  public static STAGE_MODERATOR: bigint;
  public static FLAGS: PermissionFlags;
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
  public readonly activity: Activity;
  public largeImage: Snowflake | null;
  public largeText: string | null;
  public smallImage: Snowflake | null;
  public smallText: string | null;
  public largeImageURL(options?: StaticImageURLOptions): string | null;
  public smallImageURL(options?: StaticImageURLOptions): string | null;
}

export class Role extends Base {
  private constructor(client: Client, data: RawRoleData, guild: Guild);
  public color: number;
  public readonly createdAt: Date;
  public readonly createdTimestamp: number;
  /** @deprecated This will be removed in the next major version, see https://github.com/discordjs/discord.js/issues/7091 */
  public deleted: boolean;
  public readonly editable: boolean;
  public guild: Guild;
  public readonly hexColor: HexColorString;
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
  public comparePositionTo(role: RoleResolvable): number;
  public icon: string | null;
  public unicodeEmoji: string | null;
  public delete(reason?: string): Promise<Role>;
  public edit(data: RoleData, reason?: string): Promise<Role>;
  public equals(role: Role): boolean;
  public iconURL(options?: StaticImageURLOptions): string | null;
  public permissionsIn(channel: NonThreadGuildBasedChannel | Snowflake, checkAdmin?: boolean): Readonly<Permissions>;
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

  /** @deprecated Use {@link RoleManager.comparePositions} instead. */
  public static comparePositions(role1: Role, role2: Role): number;
}

export class SelectMenuInteraction<Cached extends CacheType = CacheType> extends MessageComponentInteraction<Cached> {
  public constructor(client: Client, data: RawMessageSelectMenuInteractionData);
  public readonly component: CacheTypeReducer<
    Cached,
    MessageSelectMenu,
    APISelectMenuComponent,
    MessageSelectMenu | APISelectMenuComponent,
    MessageSelectMenu | APISelectMenuComponent
  >;
  public componentType: 'SELECT_MENU';
  public values: string[];
  public inGuild(): this is SelectMenuInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is SelectMenuInteraction<'cached'>;
  public inRawGuild(): this is SelectMenuInteraction<'raw'>;
}

export interface ShardEventTypes {
  spawn: [process: ChildProcess | Worker];
  death: [process: ChildProcess | Worker];
  disconnect: [];
  ready: [];
  reconnecting: [];
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

export class SnowflakeUtil extends null {
  private constructor();
  public static deconstruct(snowflake: Snowflake): DeconstructedSnowflake;
  public static generate(timestamp?: number | Date): Snowflake;
  public static timestampFrom(snowflake: Snowflake): number;
  public static readonly EPOCH: number;
}

export class StageChannel extends BaseGuildVoiceChannel {
  public readonly stageInstance: StageInstance | null;
  public topic: string | null;
  public type: 'GUILD_STAGE_VOICE';
  public createStageInstance(options: StageInstanceCreateOptions): Promise<StageInstance>;
  public setTopic(topic: string): Promise<StageChannel>;
}

export class DirectoryChannel extends Channel {
  public flags: Readonly<ChannelFlags>;
}

export class StageInstance extends Base {
  private constructor(client: Client, data: RawStageInstanceData, channel: StageChannel);
  public id: Snowflake;
  /** @deprecated This will be removed in the next major version, see https://github.com/discordjs/discord.js/issues/7091 */
  public deleted: boolean;
  public guildId: Snowflake;
  public channelId: Snowflake;
  public topic: string;
  public privacyLevel: PrivacyLevel;
  public discoverableDisabled: boolean | null;
  public guildScheduledEventId?: Snowflake;
  public readonly channel: StageChannel | null;
  public readonly guild: Guild | null;
  public get guildScheduledEvent(): GuildScheduledEvent | null;
  public edit(options: StageInstanceEditOptions): Promise<StageInstance>;
  public delete(): Promise<StageInstance>;
  public setTopic(topic: string): Promise<StageInstance>;
  public readonly createdTimestamp: number;
  public readonly createdAt: Date;
}

export class Sticker extends Base {
  private constructor(client: Client, data: RawStickerData);
  /** @deprecated This will be removed in the next major version, see https://github.com/discordjs/discord.js/issues/7091 */
  public deleted: boolean;
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
  public bannerURL(options?: StaticImageURLOptions): string | null;
}

/** @deprecated See [Self-serve Game Selling Deprecation](https://support-dev.discord.com/hc/en-us/articles/6309018858647) for more information */
export class StoreChannel extends GuildChannel {
  private constructor(guild: Guild, data?: RawGuildChannelData, client?: Client);
  public createInvite(options?: CreateInviteOptions): Promise<Invite>;
  public fetchInvites(cache?: boolean): Promise<Collection<string, Invite>>;
  /** @deprecated See [Self-serve Game Selling Deprecation](https://support-dev.discord.com/hc/en-us/articles/6309018858647) for more information */
  public clone(options?: GuildChannelCloneOptions): Promise<this>;
  public nsfw: boolean;
  public type: 'GUILD_STORE';
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
  public sweepStageInstances(
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

export class SystemChannelFlags extends BitField<SystemChannelFlagsString> {
  public static FLAGS: Record<SystemChannelFlagsString, number>;
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

  public iconURL(options?: StaticImageURLOptions): string | null;
  public toJSON(): unknown;
  public toString(): string;
}

export class TeamMember extends Base {
  private constructor(team: Team, data: RawTeamMemberData);
  public team: Team;
  public readonly id: Snowflake;
  public permissions: string[];
  public membershipState: MembershipState;
  public user: User;

  public toString(): UserMention;
}

export class TextChannel extends BaseGuildTextChannel {
  public rateLimitPerUser: number;
  public threads: GuildTextThreadManager<AllowedThreadTypeForTextChannel>;
  public type: 'GUILD_TEXT';
}

export interface GuildForumTagEmoji {
  id: Snowflake | null;
  name: string | null;
}

export interface GuildForumTag {
  id: Snowflake;
  name: string;
  moderated: boolean;
  emoji: GuildForumTagEmoji | null;
}

export type GuildForumTagData = Partial<GuildForumTag> & { name: string };

export interface DefaultReactionEmoji {
  id: Snowflake | null;
  name: string | null;
}

export class ForumChannel extends TextBasedChannelMixin(GuildChannel, [
  'send',
  'lastMessage',
  'lastPinAt',
  'bulkDelete',
  'sendTyping',
  'createMessageCollector',
  'awaitMessages',
  'createMessageComponentCollector',
  'awaitMessageComponent',
]) {
  public type: 'GUILD_FORUM';
  public threads: GuildForumThreadManager;
  public availableTags: GuildForumTag[];
  public defaultReactionEmoji: DefaultReactionEmoji | null;
  public defaultThreadRateLimitPerUser: number | null;
  public rateLimitPerUser: number | null;
  public defaultAutoArchiveDuration: ThreadAutoArchiveDuration | null;
  public nsfw: boolean;
  public topic: string | null;
  public defaultSortOrder: SortOrderType | null;
  public defaultForumLayout: ForumLayoutType;
  public setAvailableTags(tags: GuildForumTagData[], reason?: string): Promise<this>;
  public setDefaultReactionEmoji(emojiId: DefaultReactionEmoji | null, reason?: string): Promise<this>;
  public setDefaultThreadRateLimitPerUser(rateLimit: number, reason?: string): Promise<this>;
  public createInvite(options?: CreateInviteOptions): Promise<Invite>;
  public fetchInvites(cache?: boolean): Promise<Collection<string, Invite>>;
  public setDefaultAutoArchiveDuration(
    defaultAutoArchiveDuration: ThreadAutoArchiveDuration,
    reason?: string,
  ): Promise<this>;
  public setTopic(topic: string | null, reason?: string): Promise<this>;
  public setDefaultSortOrder(defaultSortOrder: SortOrderType | null, reason?: string): Promise<this>;
  public setDefaultForumLayout(defaultForumLayout: ForumLayoutType, reason?: string): Promise<this>;
}

export class TextInputComponent extends BaseMessageComponent {
  public constructor(data?: TextInputComponent | TextInputComponentOptions);
  public customId: string | null;
  public label: string | null;
  public required: boolean;
  public maxLength: number | null;
  public minLength: number | null;
  public placeholder: string | null;
  public style: TextInputStyle;
  public value: string | null;
  public setCustomId(customId: string): this;
  public setLabel(label: string): this;
  public setRequired(required?: boolean): this;
  public setMaxLength(maxLength: number): this;
  public setMinLength(minLength: number): this;
  public setPlaceholder(placeholder: string): this;
  public setStyle(style: TextInputStyleResolvable): this;
  public setValue(value: string): this;
  public toJSON(): RawTextInputComponentData;
  public static resolveStyle(style: TextInputStyleResolvable): TextInputStyle;
}

export class ThreadChannel extends TextBasedChannelMixin(Channel, ['fetchWebhooks', 'createWebhook', 'setNSFW']) {
  private constructor(guild: Guild, data?: RawThreadChannelData, client?: Client);
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
  public members: ThreadMemberManager;
  public name: string;
  public ownerId: Snowflake | null;
  public readonly parent: TextChannel | NewsChannel | ForumChannel | null;
  public parentId: Snowflake | null;
  public rateLimitPerUser: number | null;
  public type: ThreadChannelTypes;
  public flags: Readonly<ChannelFlags>;
  public appliedTags: Snowflake[];
  public totalMessageSent: number | null;
  public readonly unarchivable: boolean;
  public isPrivate(): this is this & {
    readonly createdTimestamp: number;
    readonly createdAt: Date;
    type: 'GUILD_PRIVATE_THREAD';
  };
  public delete(reason?: string): Promise<this>;
  public edit(data: ThreadEditData, reason?: string): Promise<ThreadChannel>;
  public join(): Promise<ThreadChannel>;
  public leave(): Promise<ThreadChannel>;
  public permissionsFor(memberOrRole: GuildMember | Role, checkAdmin?: boolean): Readonly<Permissions>;
  public permissionsFor(
    memberOrRole: GuildMemberResolvable | RoleResolvable,
    checkAdmin?: boolean,
  ): Readonly<Permissions> | null;
  public fetchOwner(options?: BaseFetchOptions): Promise<ThreadMember | null>;
  public fetchStarterMessage(options?: BaseFetchOptions): Promise<Message | null>;
  public setArchived(archived?: boolean, reason?: string): Promise<ThreadChannel>;
  public setAutoArchiveDuration(
    autoArchiveDuration: ThreadAutoArchiveDuration | 'MAX',
    reason?: string,
  ): Promise<ThreadChannel>;
  public setInvitable(invitable?: boolean, reason?: string): Promise<ThreadChannel>;
  public setLocked(locked?: boolean, reason?: string): Promise<ThreadChannel>;
  public setName(name: string, reason?: string): Promise<ThreadChannel>;
  public setAppliedTags(appliedTags: Snowflake[], reason?: string): Promise<ThreadChannel>;
  public pin(reason?: string): Promise<ThreadChannel>;
  public unpin(reason?: string): Promise<ThreadChannel>;
}

export class ThreadMember<HasMemberData extends boolean = boolean> extends Base {
  private constructor(thread: ThreadChannel, data?: RawThreadMemberData, extra?: unknown);
  public flags: ThreadMemberFlags;
  public readonly guildMember: HasMemberData extends true ? GuildMember : GuildMember | null;
  public id: Snowflake;
  public readonly joinedAt: Date | null;
  public joinedTimestamp: number | null;
  public readonly manageable: boolean;
  private member: If<HasMemberData, GuildMember>;
  public thread: ThreadChannel;
  public readonly user: User | null;
  public remove(reason?: string): Promise<ThreadMember>;
}

export class ThreadMemberFlags extends BitField<ThreadMemberFlagsString> {
  public static FLAGS: Record<ThreadMemberFlagsString, number>;
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
  public flags: Readonly<UserFlags> | null;
  public readonly hexAccentColor: HexColorString | null | undefined;
  public id: Snowflake;
  public readonly partial: false;
  public system: boolean;
  public readonly tag: string;
  public username: string;
  public avatarURL(options?: ImageURLOptions): string | null;
  public bannerURL(options?: ImageURLOptions): string | null;
  public createDM(force?: boolean): Promise<DMChannel>;
  public deleteDM(): Promise<DMChannel>;
  public displayAvatarURL(options?: ImageURLOptions): string;
  public equals(user: User): boolean;
  public fetch(force?: boolean): Promise<User>;
  public fetchFlags(force?: boolean): Promise<UserFlags>;
  public toString(): UserMention;
}

export class UserContextMenuInteraction<Cached extends CacheType = CacheType> extends ContextMenuInteraction<Cached> {
  public readonly targetUser: User;
  public readonly targetMember: CacheTypeReducer<Cached, GuildMember, APIInteractionGuildMember>;
  public inGuild(): this is UserContextMenuInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is UserContextMenuInteraction<'cached'>;
  public inRawGuild(): this is UserContextMenuInteraction<'raw'>;
}

export class UserFlags extends BitField<UserFlagsString> {
  public static FLAGS: Record<UserFlagsString, number>;
  public static resolve(bit?: BitFieldResolvable<UserFlagsString, number>): number;
}

export class Util extends null {
  private constructor();
  /** @deprecated When not using with `makeCache` use `Sweepers.archivedThreadSweepFilter` instead */
  public static archivedThreadSweepFilter<K, V>(lifetime?: number): SweepFilter<K, V>;
  public static basename(path: string, ext?: string): string;
  public static cleanContent(str: string, channel: TextBasedChannel): string;
  /** @deprecated Use {@link MessageOptions.allowedMentions} to control mentions in a message instead. */
  public static removeMentions(str: string): string;
  private static _removeMentions(str: string): string;
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
  public static escapeEscape(text: string): string;
  public static escapeHeading(text: string): string;
  public static escapeBulletedList(text: string): string;
  public static escapeNumberedList(text: string): string;
  public static escapeMaskedLink(text: string): string;
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
    route: unknown,
    reason?: string,
  ): Promise<{ id: Snowflake; position: number }[]>;
  /** @deprecated This will be removed in the next major version. */
  public static splitMessage(text: string, options?: SplitOptions): string[];
  /** @deprecated This will be removed in the next major version. */
  public static resolveAutoArchiveMaxLimit(guild: Guild): Exclude<ThreadAutoArchiveDuration, 60>;
}

export class Formatters extends null {
  public static blockQuote: typeof blockQuote;
  public static bold: typeof bold;
  public static channelMention: typeof channelMention;
  public static chatInputApplicationCommandMention
    <N extends string, G extends string, S extends string, I extends Snowflake>(commandName: N, subcommandGroupName: G, subcommandName: S, commandId: I): `</${N} ${G} ${S}:${I}>`;
  public static chatInputApplicationCommandMention<N extends string, S extends string, I extends Snowflake>(commandName: N, subcommandName: S, commandId: I): `</${N} ${S}:${I}>`;
  public static chatInputApplicationCommandMention<N extends string, I extends Snowflake>(commandName: N, commandId: I): `</${N}:${I}>`;
  public static codeBlock: typeof codeBlock;
  public static formatEmoji: typeof formatEmoji;
  public static hideLinkEmbed: typeof hideLinkEmbed;
  public static hyperlink: typeof hyperlink;
  public static inlineCode: typeof inlineCode;
  public static italic: typeof italic;
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
  /** @deprecated Use manageable instead */
  public readonly editable: boolean;
  public readonly speakable: boolean;
  public type: 'GUILD_VOICE';
}

export class VoiceRegion {
  private constructor(data: RawVoiceRegionData);
  public custom: boolean;
  public deprecated: boolean;
  public id: string;
  public name: string;
  public optimal: boolean;
  /** @deprecated This property is no longer being sent by the API. */
  public vip: boolean;
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
  public streaming: boolean;
  public selfVideo: boolean | null;
  public suppress: boolean;
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
  public avatarURL(options?: StaticImageURLOptions): string | null;
  public readonly channel: TextChannel | VoiceChannel | NewsChannel | ForumChannel | null;
  public channelId: Snowflake;
  public client: Client;
  public guildId: Snowflake;
  public name: string;
  public owner: User | APIUser | null;
  public sourceGuild: Guild | APIPartialGuild | null;
  public sourceChannel: NewsChannel | APIPartialChannel | null;
  public token: string | null;
  public type: WebhookType;
  public isIncoming(): this is this & { token: string };
  public isChannelFollower(): this is this & {
    sourceGuild: Guild | APIPartialGuild;
    sourceChannel: NewsChannel | APIPartialChannel;
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
  /* tslint:disable:unified-signatures */
  /** @deprecated */
  public fetchMessage(message: Snowflake, cache?: boolean): Promise<APIMessage>;
  /* tslint:enable:unified-signatures */
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
  destroyed: [];
  close: [event: CloseEvent];
  allReady: [unavailableGuilds?: Set<Snowflake>];
}

export class WebSocketShard extends EventEmitter {
  private constructor(manager: WebSocketManager, id: number);
  private sequence: number;
  private closeSequence: number;
  private resumeURL: string | null;
  private sessionId: string | null;
  private lastPingTimestamp: number;
  private lastHeartbeatAcked: boolean;
  private ratelimit: { queue: unknown[]; total: number; remaining: number; time: 60e3; timer: NodeJS.Timeout | null };
  private connection: WebSocket | null;
  private helloTimeout: NodeJS.Timeout | null;
  private eventsAttached: boolean;
  private expectedGuilds: Set<Snowflake> | null;
  private readyTimeout: NodeJS.Timeout | null;
  private closeEmitted: boolean;
  private wsCloseTimeout: NodeJS.Timeout | null;

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
  private setWsCloseTimeout(time?: number): void;
  private setHeartbeatTimer(time: number): void;
  private sendHeartbeat(): void;
  private ackHeartbeat(): void;
  private identify(): void;
  private identifyNew(): void;
  private identifyResume(): void;
  private _send(data: unknown): void;
  private processQueue(): void;
  private destroy(destroyOptions?: { closeCode?: number; reset?: boolean; emit?: boolean; log?: boolean }): void;
  private emitClose(event?: CloseEvent): void;
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
  public name: string;
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
  public readonly channel: TextChannel | NewsChannel | StoreChannel | ForumChannel | null;
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

export type EnumHolder<T> = { [P in keyof T]: T[P] };

export type ExcludeEnum<T, K extends keyof T> = Exclude<keyof T | T[keyof T], K | T[K]>;

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
  MaxBulkDeletableMessageAge: 1_209_600_000;
  UserAgent: string;
  Endpoints: {
    botGateway: string;
    invite: (root: string, code: string, eventId?: Snowflake) => string;
    scheduledEvent: (root: string, guildId: Snowflake, eventId: Snowflake) => string;
    CDN: (root: string) => {
      Emoji: (emojiId: Snowflake, format: DynamicImageFormat) => string;
      Asset: (name: string) => string;
      DefaultAvatar: (discriminator: number) => string;
      Avatar: (
        userId: Snowflake,
        hash: string,
        format: DynamicImageFormat,
        size: AllowedImageSize,
        dynamic: boolean,
      ) => string;
      Banner: (
        id: Snowflake,
        hash: string,
        format: DynamicImageFormat,
        size: AllowedImageSize,
        dynamic: boolean,
      ) => string;
      GuildMemberAvatar: (
        guildId: Snowflake,
        memberId: Snowflake,
        hash: string,
        format?: DynamicImageFormat,
        size?: AllowedImageSize,
        dynamic?: boolean,
      ) => string;
      Icon: (
        guildId: Snowflake,
        hash: string,
        format: DynamicImageFormat,
        size: AllowedImageSize,
        dynamic: boolean,
      ) => string;
      AppIcon: (
        appId: Snowflake,
        hash: string,
        { format, size }: { format: AllowedImageFormat; size: AllowedImageSize },
      ) => string;
      AppAsset: (
        appId: Snowflake,
        hash: string,
        { format, size }: { format: AllowedImageFormat; size: AllowedImageSize },
      ) => string;
      StickerPackBanner: (bannerId: Snowflake, format: AllowedImageFormat, size: AllowedImageSize) => string;
      GDMIcon: (channelId: Snowflake, hash: string, format: AllowedImageFormat, size: AllowedImageSize) => string;
      Splash: (guildId: Snowflake, hash: string, format: AllowedImageFormat, size: AllowedImageSize) => string;
      DiscoverySplash: (guildId: Snowflake, hash: string, format: AllowedImageFormat, size: AllowedImageSize) => string;
      TeamIcon: (
        teamId: Snowflake,
        hash: string,
        { format, size }: { format: AllowedImageFormat; size: AllowedImageSize },
      ) => string;
      Sticker: (stickerId: Snowflake, stickerFormat: StickerFormatType) => string;
      RoleIcon: (roleId: Snowflake, hash: string, format: AllowedImageFormat, size: AllowedImageSize) => string;
    };
  };
  WSCodes: {
    1000: 'WS_CLOSE_REQUESTED';
    1011: 'INTERNAL_ERROR';
    4004: 'TOKEN_INVALID';
    4010: 'SHARDING_INVALID';
    4011: 'SHARDING_REQUIRED';
    4013: 'INVALID_INTENTS';
    4014: 'DISALLOWED_INTENTS';
  };
  Events: ConstantsEvents;
  ShardEvents: ConstantsShardEvents;
  PartialTypes: {
    [K in PartialTypes]: K;
  };
  WSEvents: {
    [K in WSEventType]: K;
  };
  Colors: ConstantsColors;
  Status: ConstantsStatus;
  Opcodes: ConstantsOpcodes;
  APIErrors: APIErrors;
  ChannelTypes: EnumHolder<typeof ChannelTypes>;
  ThreadChannelTypes: ThreadChannelTypes[];
  TextBasedChannelTypes: TextBasedChannelTypes[];
  VoiceBasedChannelTypes: VoiceBasedChannelTypes[];
  ClientApplicationAssetTypes: ConstantsClientApplicationAssetTypes;
  IntegrationExpireBehaviors: IntegrationExpireBehaviors[];
  InviteScopes: InviteScope[];
  MessageTypes: MessageType[];
  SystemMessageTypes: SystemMessageType[];
  ActivityTypes: EnumHolder<typeof ActivityTypes>;
  StickerTypes: EnumHolder<typeof StickerTypes>;
  StickerFormatTypes: EnumHolder<typeof StickerFormatTypes>;
  OverwriteTypes: EnumHolder<typeof OverwriteTypes>;
  ExplicitContentFilterLevels: EnumHolder<typeof ExplicitContentFilterLevels>;
  DefaultMessageNotificationLevels: EnumHolder<typeof DefaultMessageNotificationLevels>;
  VerificationLevels: EnumHolder<typeof VerificationLevels>;
  MembershipStates: EnumHolder<typeof MembershipStates>;
  AutoModerationRuleTriggerTypes: EnumHolder<typeof AutoModerationRuleTriggerTypes>;
  AutoModerationRuleKeywordPresetTypes: EnumHolder<typeof AutoModerationRuleKeywordPresetTypes>;
  AutoModerationActionTypes: EnumHolder<typeof AutoModerationActionTypes>;
  AutoModerationRuleEventTypes: EnumHolder<typeof AutoModerationRuleEventTypes>;

  ApplicationCommandPermissionTypes: EnumHolder<typeof ApplicationCommandPermissionTypes>;
  InteractionTypes: EnumHolder<typeof InteractionTypes>;
  InteractionResponseTypes: EnumHolder<typeof InteractionResponseTypes>;
  MessageComponentTypes: EnumHolder<typeof MessageComponentTypes>;
  MessageButtonStyles: EnumHolder<typeof MessageButtonStyles>;
  ModalComponentTypes: EnumHolder<typeof ModalComponentTypes>;
  TextInputStyles: EnumHolder<typeof TextInputStyles>;
  MFALevels: EnumHolder<typeof MFALevels>;
  NSFWLevels: EnumHolder<typeof NSFWLevels>;
  PrivacyLevels: EnumHolder<typeof PrivacyLevels>;
  WebhookTypes: EnumHolder<typeof WebhookTypes>;
  PremiumTiers: EnumHolder<typeof PremiumTiers>;
  ApplicationCommandTypes: EnumHolder<typeof ApplicationCommandTypes>;
  GuildScheduledEventEntityTypes: EnumHolder<typeof GuildScheduledEventEntityTypes>;
  GuildScheduledEventStatuses: EnumHolder<typeof GuildScheduledEventStatuses>;
  GuildScheduledEventPrivacyLevels: EnumHolder<typeof GuildScheduledEventPrivacyLevels>;
  VideoQualityModes: EnumHolder<typeof VideoQualityModes>;
  SweeperKeys: SweeperKey[];
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
  private readonly _cache: Collection<K, Holds>;
  private _add(data: unknown, cache?: boolean, { id, extras }?: { id: K; extras: unknown[] }): Holds;
}

export type ApplicationCommandDataResolvable =
  | ApplicationCommandData
  | RESTPostAPIApplicationCommandsJSONBody
  | SlashCommandBuilder
  | ContextMenuCommandBuilder;

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
  private commandPath({ id, guildId }: { id?: Snowflake; guildId?: Snowflake }): unknown;
  public create(command: ApplicationCommandDataResolvable, guildId?: Snowflake): Promise<ApplicationCommandScope>;
  public delete(command: ApplicationCommandResolvable, guildId?: Snowflake): Promise<ApplicationCommandScope | null>;
  public edit(
    command: ApplicationCommandResolvable,
    data: Partial<ApplicationCommandDataResolvable>,
  ): Promise<ApplicationCommandScope>;
  public edit(
    command: ApplicationCommandResolvable,
    data: Partial<ApplicationCommandDataResolvable>,
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
  private static transformCommand(command: ApplicationCommandDataResolvable): RESTPostAPIApplicationCommandsJSONBody;
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
  private permissionsPath(guildId: Snowflake, commandId?: Snowflake): unknown;
  private static transformPermissions(
    permissions: ApplicationCommandPermissionData,
    received: true,
  ): Omit<APIApplicationCommandPermission, 'type'> & { type: keyof ApplicationCommandPermissionTypes };
  private static transformPermissions(permissions: ApplicationCommandPermissionData): APIApplicationCommandPermission;
}

export class BaseGuildEmojiManager extends CachedManager<Snowflake, GuildEmoji, EmojiResolvable> {
  protected constructor(client: Client, iterable?: Iterable<RawGuildEmojiData>);
  public resolveIdentifier(emoji: EmojiIdentifierResolvable): string | null;
}

export class ChannelManager extends CachedManager<Snowflake, AnyChannel, ChannelResolvable> {
  private constructor(client: Client, iterable: Iterable<RawChannelData>);
  public fetch(id: Snowflake, options?: FetchChannelOptions): Promise<AnyChannel | null>;
}

export type FetchGuildApplicationCommandFetchOptions = Omit<FetchApplicationCommandOptions, 'guildId'>;

export class GuildApplicationCommandManager extends ApplicationCommandManager<ApplicationCommand, {}, Guild> {
  private constructor(guild: Guild, iterable?: Iterable<RawApplicationCommandData>);
  public guild: Guild;
  public create(command: ApplicationCommandDataResolvable): Promise<ApplicationCommand>;
  public delete(command: ApplicationCommandResolvable): Promise<ApplicationCommand | null>;
  public edit(
    command: ApplicationCommandResolvable,
    data: Partial<ApplicationCommandDataResolvable>,
  ): Promise<ApplicationCommand>;
  public fetch(id: Snowflake, options?: FetchGuildApplicationCommandFetchOptions): Promise<ApplicationCommand>;
  public fetch(options: FetchGuildApplicationCommandFetchOptions): Promise<Collection<Snowflake, ApplicationCommand>>;
  public fetch(
    id?: undefined,
    options?: FetchGuildApplicationCommandFetchOptions,
  ): Promise<Collection<Snowflake, ApplicationCommand>>;
  public set(commands: ApplicationCommandDataResolvable[]): Promise<Collection<Snowflake, ApplicationCommand>>;
}

export type MappedGuildChannelTypes = EnumValueMapped<
  typeof ChannelTypes,
  {
    GUILD_CATEGORY: CategoryChannel;
  }
> &
  MappedChannelCategoryTypes;

export type GuildChannelTypes = CategoryChannelTypes | ChannelTypes.GUILD_CATEGORY | 'GUILD_CATEGORY';

export class GuildChannelManager extends CachedManager<Snowflake, GuildBasedChannel, GuildChannelResolvable> {
  private constructor(guild: Guild, iterable?: Iterable<RawGuildChannelData>);
  public readonly channelCountWithoutThreads: number;
  public guild: Guild;

  public create<T extends Exclude<GuildChannelTypes, 'GUILD_STORE' | ChannelTypes.GUILD_STORE>>(
    name: string,
    options: GuildChannelCreateOptions & { type: T },
  ): Promise<MappedGuildChannelTypes[T]>;

  /** @deprecated See [Self-serve Game Selling Deprecation](https://support-dev.discord.com/hc/en-us/articles/6309018858647) for more information */
  public create(
    name: string,
    options: GuildChannelCreateOptions & { type: 'GUILD_STORE' | ChannelTypes.GUILD_STORE },
  ): Promise<StoreChannel>;
  public create(name: string, options?: GuildChannelCreateOptions): Promise<TextChannel>;
  public createWebhook(
    channel: GuildChannelResolvable,
    name: string,
    options?: TextChannel | NewsChannel | VoiceChannel | StageChannel | ForumChannel | Snowflake,
  ): Promise<Webhook>;
  public addFollower(
    channel: NewsChannel | Snowflake,
    targetChannel: TextChannelResolvable,
    reason?: string,
  ): Promise<Snowflake>;
  public edit(channel: GuildChannelResolvable, data: ChannelData, reason?: string): Promise<GuildChannel>;
  public fetch(id: Snowflake, options?: BaseFetchOptions): Promise<GuildBasedChannel | null>;
  public fetch(
    id?: undefined,
    options?: BaseFetchOptions,
  ): Promise<Collection<Snowflake, NonThreadGuildBasedChannel | null>>;
  public fetchWebhooks(channel: GuildChannelResolvable): Promise<Collection<Snowflake, Webhook>>;
  public setPosition(
    channel: GuildChannelResolvable,
    position: number,
    options?: SetChannelPositionOptions,
  ): Promise<GuildChannel>;
  public setPositions(channelPositions: readonly ChannelPosition[]): Promise<Guild>;
  public fetchActiveThreads(cache?: boolean): Promise<FetchedThreads>;
  public delete(channel: GuildChannelResolvable, reason?: string): Promise<void>;
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
  public fetchAuthor(emoji: EmojiResolvable): Promise<User>;
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
  public get me(): GuildMember | null;
  public add(
    user: UserResolvable,
    options: AddGuildMemberOptions & { fetchWhenExisting: false },
  ): Promise<GuildMember | null>;
  public add(user: UserResolvable, options: AddGuildMemberOptions): Promise<GuildMember>;
  public addRole(user: UserResolvable, role: RoleResolvable, reason?: string): Promise<GuildMember|User|Snowflake>;
  public ban(user: UserResolvable, options?: BanOptions): Promise<GuildMember | User | Snowflake>;
  public edit(user: UserResolvable, data: GuildMemberEditData, reason?: string): Promise<GuildMember>;
  public fetch(
    options: UserResolvable | FetchMemberOptions | (FetchMembersOptions & { user: UserResolvable }),
  ): Promise<GuildMember>;
  public fetch(options?: FetchMembersOptions): Promise<Collection<Snowflake, GuildMember>>;
  public fetchMe(options?: BaseFetchOptions): Promise<GuildMember>;
  public kick(user: UserResolvable, reason?: string): Promise<GuildMember | User | Snowflake>;
  public list(options?: GuildListMembersOptions): Promise<Collection<Snowflake, GuildMember>>;
  public prune(options: GuildPruneMembersOptions & { dry?: false; count: false }): Promise<null>;
  public prune(options?: GuildPruneMembersOptions): Promise<number>;
  public removeRole(user: UserResolvable, role: RoleResolvable, reason?: string): Promise<GuildMember|User|Snowflake>;
  public search(options: GuildSearchMembersOptions): Promise<Collection<Snowflake, GuildMember>>;
  public unban(user: UserResolvable, reason?: string): Promise<User | null>;
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
  public fetchUser(sticker: StickerResolvable): Promise<User | null>;
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
  public pin(message: MessageResolvable, reason?: string): Promise<void>;
  public unpin(message: MessageResolvable, reason?: string): Promise<void>;
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
  public setPosition(role: RoleResolvable, position: number, options?: SetRolePositionOptions): Promise<Role>;
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

export class ThreadManager extends CachedManager<Snowflake, ThreadChannel, ThreadChannelResolvable> {
  protected constructor(channel: TextChannel | NewsChannel, iterable?: Iterable<RawThreadChannelData>);
  public channel: TextChannel | NewsChannel;
  public fetch(options: ThreadChannelResolvable, cacheOptions?: BaseFetchOptions): Promise<ThreadChannel | null>;
  public fetch(options?: FetchThreadsOptions, cacheOptions?: { cache?: boolean }): Promise<FetchedThreads>;
  public fetchArchived(options?: FetchArchivedThreadOptions, cache?: boolean): Promise<FetchedThreads>;
  public fetchActive(cache?: boolean): Promise<FetchedThreads>;
}

export class GuildTextThreadManager<AllowedThreadType> extends ThreadManager {
  public create(options: GuildTextThreadCreateOptions<AllowedThreadType>): Promise<ThreadChannel>;
}

export class GuildForumThreadManager extends ThreadManager {
  public create(options: GuildForumThreadCreateOptions): Promise<ThreadChannel>;
}

export class ThreadMemberManager extends CachedManager<Snowflake, ThreadMember, ThreadMemberResolvable> {
  private constructor(thread: ThreadChannel, iterable?: Iterable<RawThreadMemberData>);
  public thread: ThreadChannel;
  public get me(): ThreadMember | null;
  public add(member: UserResolvable | '@me', reason?: string): Promise<Snowflake>;
  public fetch(options?: FetchThreadMembersWithoutGuildMemberDataOptions): Promise<Collection<Snowflake, ThreadMember>>;
  public fetch(
    member: ThreadMember<true>,
    options?: FetchMemberOptions
    ): Promise<ThreadMember<true>>;
  public fetch(
    member: Snowflake,
    options: (FetchThreadMemberOptions & { withMember: true }),
  ): Promise<ThreadMember<true>>;
  public fetch(
    options: FetchThreadMembersWithGuildMemberDataOptions,
    ): Promise<Collection<Snowflake, ThreadMember<true>>>;
  public fetch(member: UserResolvable, options?: FetchThreadMemberOptions): Promise<ThreadMember>;

  /** @deprecated Use `fetch(options)` instead. */
  public fetch(cache: boolean, options?: FetchThreadMembersOptions): Promise<Collection<Snowflake, ThreadMember>>;

  public fetch(x: undefined, options: FetchThreadMembersWithGuildMemberDataOptions): Promise<Collection<Snowflake, ThreadMember<true>>>;
  public fetch(x: undefined, options?: FetchThreadMembersWithoutGuildMemberDataOptions): Promise<Collection<Snowflake, ThreadMember>>;

  public fetchMe(options?: BaseFetchOptions): Promise<ThreadMember>;
  public remove(id: Snowflake | '@me', reason?: string): Promise<Snowflake>;
}

export class UserManager extends CachedManager<Snowflake, User, UserResolvable> {
  private constructor(client: Client, iterable?: Iterable<RawUserData>);
  private dmChannel(userId: Snowflake): DMChannel | null;
  public createDM(user: UserResolvable, options?: BaseFetchOptions): Promise<DMChannel>;
  public deleteDM(user: UserResolvable): Promise<DMChannel>;
  public fetch(user: UserResolvable, options?: BaseFetchOptions): Promise<User>;
  public fetchFlags(user: UserResolvable, options?: BaseFetchOptions): Promise<UserFlags>;
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
  messages: MessageManager;
  awaitMessageComponent<T extends MessageComponentTypeResolvable = 'ACTION_ROW'>(
    options?: AwaitMessageCollectorOptionsParams<T, true>,
  ): Promise<MappedInteractionTypes[T]>;
  awaitMessages(options?: AwaitMessagesOptions): Promise<Collection<Snowflake, Message>>;
  bulkDelete(
    messages: Collection<Snowflake, Message> | readonly MessageResolvable[] | number,
    filterOld?: boolean,
  ): Promise<Collection<Snowflake, Message | PartialMessage | undefined>>;
  createMessageComponentCollector<T extends MessageComponentTypeResolvable = 'ACTION_ROW'>(
    options?: MessageChannelCollectorOptionsParams<T, true>,
  ): InteractionCollector<MappedInteractionTypes[T]>;
  createMessageCollector(options?: MessageCollectorOptions): MessageCollector;
  createWebhook(name: string, options?: ChannelWebhookCreateOptions): Promise<Webhook>;
  setRateLimitPerUser(rateLimitPerUser: number, reason?: string): Promise<this>;
  setNSFW(nsfw?: boolean, reason?: string): Promise<this>;
  fetchWebhooks(): Promise<Collection<Snowflake, Webhook>>;
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
  /* tslint:disable:unified-signatures */
  /** @deprecated */
  fetchMessage(message: Snowflake | '@original', cache?: boolean): Promise<Message | APIMessage>;
  /* tslint:enable:unified-signatures */
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

export type ActivityFlagsString =
  | 'INSTANCE'
  | 'JOIN'
  | 'SPECTATE'
  | 'JOIN_REQUEST'
  | 'SYNC'
  | 'PLAY'
  | 'PARTY_PRIVACY_FRIENDS'
  | 'PARTY_PRIVACY_VOICE_CHANNEL'
  | 'EMBEDDED';

export type ActivitiesOptions = Omit<ActivityOptions, 'shardId'>;

export interface ActivityOptions {
  name?: string;
  url?: string;
  type?: ExcludeEnum<typeof ActivityTypes, 'CUSTOM'>;
  shardId?: number | readonly number[];
}

export type ActivityPlatform = 'desktop' | 'samsung' | 'xbox';

export type ActivityType = keyof typeof ActivityTypes;

export interface AddGuildMemberOptions {
  accessToken: string;
  nick?: string;
  roles?: Collection<Snowflake, Role> | RoleResolvable[];
  mute?: boolean;
  deaf?: boolean;
  force?: boolean;
  fetchWhenExisting?: boolean;
}

export type AllowedImageFormat = 'webp' | 'png' | 'jpg' | 'jpeg';

export type AllowedImageSize = 16 | 32 | 56 | 64 | 96 | 128 | 256 | 300 | 512 | 600 | 1024 | 2048 | 4096;

export type AllowedPartial = User | Channel | GuildMember | Message | MessageReaction;

export type AllowedThreadTypeForNewsChannel = 'GUILD_NEWS_THREAD' | 10;

export type AllowedThreadTypeForTextChannel = 'GUILD_PUBLIC_THREAD' | 'GUILD_PRIVATE_THREAD' | 11 | 12;

export interface ClientApplicationInstallParams {
  scopes: InviteScope[];
  permissions: Readonly<Permissions>;
}

export interface APIErrors {
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
  UNKNOWN_WEBHOOK_SERVICE: 10016;
  UNKNOWN_SESSION: 10020;
  UNKNOWN_BAN: 10026;
  UNKNOWN_SKU: 10027;
  UNKNOWN_STORE_LISTING: 10028;
  UNKNOWN_ENTITLEMENT: 10029;
  UNKNOWN_BUILD: 10030;
  UNKNOWN_LOBBY: 10031;
  UNKNOWN_BRANCH: 10032;
  UNKNOWN_STORE_DIRECTORY_LAYOUT: 10033;
  UNKNOWN_REDISTRIBUTABLE: 10036;
  UNKNOWN_GIFT_CODE: 10038;
  UNKNOWN_STREAM: 10049;
  UNKNOWN_PREMIUM_SERVER_SUBSCRIBE_COOLDOWN: 10050;
  UNKNOWN_GUILD_TEMPLATE: 10057;
  UNKNOWN_DISCOVERABLE_SERVER_CATEGORY: 10059;
  UNKNOWN_STICKER: 10060;
  UNKNOWN_INTERACTION: 10062;
  UNKNOWN_APPLICATION_COMMAND: 10063;
  UNKNOWN_APPLICATION_COMMAND_PERMISSIONS: 10066;
  UNKNOWN_STAGE_INSTANCE: 10067;
  UNKNOWN_GUILD_MEMBER_VERIFICATION_FORM: 10068;
  UNKNOWN_GUILD_WELCOME_SCREEN: 10069;
  UNKNOWN_GUILD_SCHEDULED_EVENT: 10070;
  UNKNOWN_GUILD_SCHEDULED_EVENT_USER: 10071;
  BOT_PROHIBITED_ENDPOINT: 20001;
  BOT_ONLY_ENDPOINT: 20002;
  CANNOT_SEND_EXPLICIT_CONTENT: 20009;
  NOT_AUTHORIZED: 20012;
  SLOWMODE_RATE_LIMIT: 20016;
  ACCOUNT_OWNER_ONLY: 20018;
  ANNOUNCEMENT_EDIT_LIMIT_EXCEEDED: 20022;
  CHANNEL_HIT_WRITE_RATELIMIT: 20028;
  SERVER_HIT_WRITE_RATELIMIT: 20029;
  CONTENT_NOT_ALLOWED: 20031;
  GUILD_PREMIUM_LEVEL_TOO_LOW: 20035;
  MAXIMUM_GUILDS: 30001;
  MAXIMUM_FRIENDS: 30002;
  MAXIMUM_PINS: 30003;
  MAXIMUM_RECIPIENTS: 30004;
  MAXIMUM_ROLES: 30005;
  MAXIMUM_WEBHOOKS: 30007;
  MAXIMUM_EMOJIS: 30008;
  MAXIMUM_REACTIONS: 30010;
  MAXIMUM_CHANNELS: 30013;
  MAXIMUM_ATTACHMENTS: 30015;
  MAXIMUM_INVITES: 30016;
  MAXIMUM_ANIMATED_EMOJIS: 30018;
  MAXIMUM_SERVER_MEMBERS: 30019;
  MAXIMUM_NUMBER_OF_SERVER_CATEGORIES: 30030;
  GUILD_ALREADY_HAS_TEMPLATE: 30031;
  MAXIMUM_THREAD_PARTICIPANTS: 30033;
  MAXIMUM_NON_GUILD_MEMBERS_BANS: 30035;
  MAXIMUM_BAN_FETCHES: 30037;
  MAXIMUM_NUMBER_OF_UNCOMPLETED_GUILD_SCHEDULED_EVENTS_REACHED: 30038;
  MAXIMUM_NUMBER_OF_STICKERS_REACHED: 30039;
  MAXIMUM_PRUNE_REQUESTS: 30040;
  MAXIMUM_GUILD_WIDGET_SETTINGS_UPDATE: 30042;
  MAXIMUM_NUMBER_OF_PREMIUM_EMOJIS: 30056;
  UNAUTHORIZED: 40001;
  ACCOUNT_VERIFICATION_REQUIRED: 40002;
  DIRECT_MESSAGES_TOO_FAST: 40003;
  REQUEST_ENTITY_TOO_LARGE: 40005;
  FEATURE_TEMPORARILY_DISABLED: 40006;
  USER_BANNED: 40007;
  TARGET_USER_NOT_CONNECTED_TO_VOICE: 40032;
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
  CANNOT_EXECUTE_ON_CHANNEL_TYPE: 50024;
  INVALID_OAUTH_TOKEN: 50025;
  MISSING_OAUTH_SCOPE: 50026;
  INVALID_WEBHOOK_TOKEN: 50027;
  INVALID_ROLE: 50028;
  INVALID_RECIPIENTS: 50033;
  BULK_DELETE_MESSAGE_TOO_OLD: 50034;
  INVALID_FORM_BODY: 50035;
  INVITE_ACCEPTED_TO_GUILD_NOT_CONTAINING_BOT: 50036;
  INVALID_API_VERSION: 50041;
  FILE_UPLOADED_EXCEEDS_MAXIMUM_SIZE: 50045;
  INVALID_FILE_UPLOADED: 50046;
  CANNOT_SELF_REDEEM_GIFT: 50054;
  INVALID_GUILD: 50055;
  INVALID_MESSAGE_TYPE: 50068;
  PAYMENT_SOURCE_REQUIRED: 50070;
  CANNOT_DELETE_COMMUNITY_REQUIRED_CHANNEL: 50074;
  INVALID_STICKER_SENT: 50081;
  INVALID_OPERATION_ON_ARCHIVED_THREAD: 50083;
  INVALID_THREAD_NOTIFICATION_SETTINGS: 50084;
  PARAMETER_EARLIER_THAN_CREATION: 50085;
  GUILD_NOT_AVAILABLE_IN_LOCATION: 50095;
  GUILD_MONETIZATION_REQUIRED: 50097;
  INSUFFICIENT_BOOSTS: 50101;
  INVALID_JSON: 50109;
  CANNOT_MIX_SUBSCRIPTION_AND_NON_SUBSCRIPTION_ROLES_FOR_EMOJI: 50144;
  CANNOT_CONVERT_PREMIUM_EMOJI_TO_NORMAL_EMOJI: 50145;
  TWO_FACTOR_REQUIRED: 60003;
  NO_USERS_WITH_DISCORDTAG_EXIST: 80004;
  REACTION_BLOCKED: 90001;
  RESOURCE_OVERLOADED: 130000;
  STAGE_ALREADY_OPEN: 150006;
  CANNOT_REPLY_WITHOUT_READ_MESSAGE_HISTORY_PERMISSION: 160002;
  MESSAGE_ALREADY_HAS_THREAD: 160004;
  THREAD_LOCKED: 160005;
  MAXIMUM_ACTIVE_THREADS: 160006;
  MAXIMUM_ACTIVE_ANNOUNCEMENT_THREADS: 160007;
  INVALID_JSON_FOR_UPLOADED_LOTTIE_FILE: 170001;
  UPLOADED_LOTTIES_CANNOT_CONTAIN_RASTERIZED_IMAGES: 170002;
  STICKER_MAXIMUM_FRAMERATE_EXCEEDED: 170003;
  STICKER_FRAME_COUNT_EXCEEDS_MAXIMUM_OF_1000_FRAMES: 170004;
  LOTTIE_ANIMATION_MAXIMUM_DIMENSIONS_EXCEEDED: 170005;
  STICKER_FRAME_RATE_IS_TOO_SMALL_OR_TOO_LARGE: 170006;
  STICKER_ANIMATION_DURATION_EXCEEDS_MAXIMUM_OF_5_SECONDS: 170007;
  CANNOT_UPDATE_A_FINISHED_EVENT: 180000;
  FAILED_TO_CREATE_STAGE_NEEDED_FOR_STAGE_EVENT: 180002;
}

export interface APIRequest {
  method: 'get' | 'post' | 'delete' | 'patch' | 'put';
  options: unknown;
  path: string;
  retries: number;
  route: string;
}

export interface ApplicationAsset {
  name: string;
  id: Snowflake;
  type: 'BIG' | 'SMALL';
}

export interface BaseApplicationCommandData {
  name: string;
  nameLocalizations?: LocalizationMap;
  /** @deprecated Use {@link defaultMemberPermissions} and {@link dmPermission} instead. */
  defaultPermission?: boolean;
  defaultMemberPermissions?: PermissionResolvable | null;
  dmPermission?: boolean;
}

export type CommandOptionDataTypeResolvable = ApplicationCommandOptionType | ApplicationCommandOptionTypes;

export type CommandOptionChannelResolvableType = ApplicationCommandOptionTypes.CHANNEL | 'CHANNEL';

export type CommandOptionChoiceResolvableType =
  | ApplicationCommandOptionTypes.STRING
  | 'STRING'
  | CommandOptionNumericResolvableType;

export type CommandOptionNumericResolvableType =
  | ApplicationCommandOptionTypes.NUMBER
  | 'NUMBER'
  | ApplicationCommandOptionTypes.INTEGER
  | 'INTEGER';

export type CommandOptionSubOptionResolvableType =
  | ApplicationCommandOptionTypes.SUB_COMMAND
  | 'SUB_COMMAND'
  | ApplicationCommandOptionTypes.SUB_COMMAND_GROUP
  | 'SUB_COMMAND_GROUP';

export type CommandOptionNonChoiceResolvableType = Exclude<
  CommandOptionDataTypeResolvable,
  CommandOptionChoiceResolvableType | CommandOptionSubOptionResolvableType | CommandOptionChannelResolvableType
>;

export interface BaseApplicationCommandOptionsData {
  name: string;
  nameLocalizations?: LocalizationMap;
  description: string;
  descriptionLocalizations?: LocalizationMap;
  required?: boolean;
  autocomplete?: never;
}

export interface UserApplicationCommandData extends BaseApplicationCommandData {
  type: 'USER' | ApplicationCommandTypes.USER;
}

export interface MessageApplicationCommandData extends BaseApplicationCommandData {
  type: 'MESSAGE' | ApplicationCommandTypes.MESSAGE;
}

export interface ChatInputApplicationCommandData extends BaseApplicationCommandData {
  description: string;
  descriptionLocalizations?: LocalizationMap;
  type?: 'CHAT_INPUT' | ApplicationCommandTypes.CHAT_INPUT;
  options?: ApplicationCommandOptionData[];
}

export type ApplicationCommandData =
  | UserApplicationCommandData
  | MessageApplicationCommandData
  | ChatInputApplicationCommandData;

export interface ApplicationCommandChannelOptionData extends BaseApplicationCommandOptionsData {
  type: CommandOptionChannelResolvableType;
  channelTypes?: ExcludeEnum<typeof ChannelTypes, 'UNKNOWN'>[];
  channel_types?: Exclude<ChannelTypes, ChannelTypes.UNKNOWN>[];
}

export interface ApplicationCommandChannelOption extends BaseApplicationCommandOptionsData {
  type: 'CHANNEL';
  channelTypes?: (keyof typeof ChannelTypes)[];
}

export interface ApplicationCommandAutocompleteOption extends Omit<BaseApplicationCommandOptionsData, 'autocomplete'> {
  type:
    | 'STRING'
    | 'NUMBER'
    | 'INTEGER'
    | ApplicationCommandOptionTypes.STRING
    | ApplicationCommandOptionTypes.NUMBER
    | ApplicationCommandOptionTypes.INTEGER;
  autocomplete: true;
}

export interface ApplicationCommandChoicesData extends Omit<BaseApplicationCommandOptionsData, 'autocomplete'> {
  type: CommandOptionChoiceResolvableType;
  choices?: ApplicationCommandOptionChoiceData[];
  autocomplete?: false;
}

export interface ApplicationCommandChoicesOption extends Omit<BaseApplicationCommandOptionsData, 'autocomplete'> {
  type: CommandOptionChoiceResolvableType;
  choices?: ApplicationCommandOptionChoiceData[];
  autocomplete?: false;
}

export interface ApplicationCommandNumericOptionData extends ApplicationCommandChoicesData {
  type: CommandOptionNumericResolvableType;
  minValue?: number;
  min_value?: number;
  maxValue?: number;
  max_value?: number;
}

export interface ApplicationCommandStringOptionData extends ApplicationCommandChoicesData {
  type: ApplicationCommandOptionTypes.STRING;
  minLength?: number;
  min_length?: number;
  maxLength?: number;
  max_length?: number;
}

export interface ApplicationCommandNumericOption extends ApplicationCommandChoicesOption {
  type: CommandOptionNumericResolvableType;
  minValue?: number;
  maxValue?: number;
}

export interface ApplicationCommandStringOption extends ApplicationCommandChoicesOption {
  type: ApplicationCommandOptionTypes.STRING;
  minLength?: number;
  maxLength?: number;
}

export interface ApplicationCommandSubGroupData extends Omit<BaseApplicationCommandOptionsData, 'required'> {
  type: 'SUB_COMMAND_GROUP' | ApplicationCommandOptionTypes.SUB_COMMAND_GROUP;
  options?: ApplicationCommandSubCommandData[];
}

export interface ApplicationCommandSubGroup extends Omit<BaseApplicationCommandOptionsData, 'required'> {
  type: 'SUB_COMMAND_GROUP';
  options?: ApplicationCommandSubCommand[];
}

export interface ApplicationCommandSubCommandData extends Omit<BaseApplicationCommandOptionsData, 'required'> {
  type: 'SUB_COMMAND' | ApplicationCommandOptionTypes.SUB_COMMAND;
  options?: (
    | ApplicationCommandChoicesData
    | ApplicationCommandNonOptionsData
    | ApplicationCommandChannelOptionData
    | ApplicationCommandAutocompleteOption
    | ApplicationCommandNumericOptionData
    | ApplicationCommandStringOptionData
  )[];
}

export interface ApplicationCommandSubCommand extends Omit<BaseApplicationCommandOptionsData, 'required'> {
  type: 'SUB_COMMAND';
  options?: (ApplicationCommandChoicesOption | ApplicationCommandNonOptions | ApplicationCommandChannelOption)[];
}

export interface ApplicationCommandNonOptionsData extends BaseApplicationCommandOptionsData {
  type: CommandOptionNonChoiceResolvableType;
}

export interface ApplicationCommandNonOptions extends BaseApplicationCommandOptionsData {
  type: Exclude<CommandOptionNonChoiceResolvableType, ApplicationCommandOptionTypes>;
}

export type ApplicationCommandOptionData =
  | ApplicationCommandSubGroupData
  | ApplicationCommandNonOptionsData
  | ApplicationCommandChannelOptionData
  | ApplicationCommandChoicesData
  | ApplicationCommandAutocompleteOption
  | ApplicationCommandNumericOptionData
  | ApplicationCommandStringOptionData
  | ApplicationCommandSubCommandData;

export type ApplicationCommandOption =
  | ApplicationCommandSubGroup
  | ApplicationCommandNonOptions
  | ApplicationCommandChannelOption
  | ApplicationCommandChoicesOption
  | ApplicationCommandNumericOption
  | ApplicationCommandStringOption
  | ApplicationCommandSubCommand;

export interface ApplicationCommandOptionChoiceData {
  name: string;
  nameLocalizations?: LocalizationMap;
  value: string | number;
}

export type ApplicationCommandType = keyof typeof ApplicationCommandTypes;

export type ApplicationCommandOptionType = keyof typeof ApplicationCommandOptionTypes;

export type AutoModerationRuleTriggerType = keyof typeof AutoModerationRuleTriggerTypes;

export type AutoModerationRuleKeywordPresetType = keyof typeof AutoModerationRuleKeywordPresetTypes;

export type AutoModerationActionType = keyof typeof AutoModerationActionTypes;

export type AutoModerationRuleEventType = keyof typeof AutoModerationRuleEventTypes;

export class AutoModerationActionExecution {
  private constructor(data: GatewayAutoModerationActionExecutionDispatchData, guild: Guild);
  public guild: Guild;
  public action: AutoModerationAction;
  public ruleId: Snowflake;
  public ruleTriggerType: AutoModerationRuleTriggerType;
  public userId: Snowflake;
  public channelId: Snowflake | null;
  public messageId: Snowflake | null;
  public alertSystemMessageId: Snowflake | null;
  public content: string;
  public matchedKeyword: string | null;
  public matchedContent: string | null;
  public get autoModerationRule(): AutoModerationRule | null;
}

export class AutoModerationRule extends Base {
  private constructor(client: Client<true>, data: APIAutoModerationRule, guild: Guild);
  public id: Snowflake;
  public guild: Guild;
  public name: string;
  public creatorId: Snowflake;
  public eventType: AutoModerationRuleEventType;
  public triggerType: AutoModerationRuleTriggerType;
  public triggerMetadata: AutoModerationTriggerMetadata;
  public actions: AutoModerationAction[];
  public enabled: boolean;
  public exemptRoles: Collection<Snowflake, Role>;
  public exemptChannels: Collection<Snowflake, GuildBasedChannel>;
  public edit(options: AutoModerationRuleEditOptions): Promise<AutoModerationRule>;
  public delete(reason?: string): Promise<void>;
  public setName(name: string, reason?: string): Promise<AutoModerationRule>;
  public setEventType(
    eventType: AutoModerationRuleEventType | AutoModerationRuleEventTypes,
    reason?: string,
  ): Promise<AutoModerationRule>;
  public setKeywordFilter(keywordFilter: string[], reason?: string): Promise<AutoModerationRule>;
  public setRegexPatterns(regexPatterns: string[], reason?: string): Promise<AutoModerationRule>;
  public setPresets(presets: AutoModerationRuleKeywordPresetType[], reason?: string): Promise<AutoModerationRule>;
  public setAllowList(allowList: string[], reason?: string): Promise<AutoModerationRule>;
  public setMentionTotalLimit(mentionTotalLimit: number, reason?: string): Promise<AutoModerationRule>;
  public setActions(actions: AutoModerationActionOptions[], reason?: string): Promise<AutoModerationRule>;
  public setEnabled(enabled?: boolean, reason?: string): Promise<AutoModerationRule>;
  public setExemptRoles(
    roles: Collection<Snowflake, Role> | RoleResolvable[],
    reason?: string,
  ): Promise<AutoModerationRule>;
  public setExemptChannels(
    channels: Collection<Snowflake, GuildBasedChannel> | GuildChannelResolvable[],
    reason?: string,
  ): Promise<AutoModerationRule>;
}

export class AutoModerationRuleManager extends CachedManager<
  Snowflake,
  AutoModerationRule,
  AutoModerationRuleResolvable
> {
  private constructor(guild: Guild, iterable: unknown);
  public guild: Guild;
  public create(options: AutoModerationRuleCreateOptions): Promise<AutoModerationRule>;
  public edit(
    autoModerationRule: AutoModerationRuleResolvable,
    options: AutoModerationRuleEditOptions,
  ): Promise<AutoModerationRule>;
  public fetch(options: AutoModerationRuleResolvable | FetchAutoModerationRuleOptions): Promise<AutoModerationRule>;
  public fetch(options?: FetchAutoModerationRulesOptions): Promise<Collection<Snowflake, AutoModerationRule>>;
  public delete(autoModerationRule: AutoModerationRuleResolvable, reason?: string): Promise<void>;
}

export interface ApplicationCommandPermissionData {
  id: Snowflake;
  type: ApplicationCommandPermissionType | ApplicationCommandPermissionTypes;
  permission: boolean;
}

export interface ApplicationCommandPermissionsUpdateData {
  permissions: ApplicationCommandPermissions;
  id: Snowflake;
  guildId: Snowflake;
  applicationId: Snowflake;
}

export interface ApplicationCommandPermissions extends ApplicationCommandPermissionData {
  type: ApplicationCommandPermissionType;
}

export type ApplicationCommandPermissionType = keyof typeof ApplicationCommandPermissionTypes;

export type ApplicationCommandResolvable = ApplicationCommand | Snowflake;

export type ApplicationFlagsString =
  | 'GATEWAY_PRESENCE'
  | 'GATEWAY_PRESENCE_LIMITED'
  | 'GATEWAY_GUILD_MEMBERS'
  | 'GATEWAY_GUILD_MEMBERS_LIMITED'
  | 'VERIFICATION_PENDING_GUILD_LIMIT'
  | 'EMBEDDED'
  | 'GATEWAY_MESSAGE_CONTENT'
  | 'GATEWAY_MESSAGE_CONTENT_LIMITED';

export interface ApplicationRoleConnectionMetadataEditOptions {
  name: string;
  nameLocalizations?: LocalizationMap | null;
  description: string;
  descriptionLocalizations?: LocalizationMap | null;
  key: string;
  type: ApplicationRoleConnectionMetadataTypes;
}

export interface AutoModerationAction {
  type: AutoModerationActionType | AutoModerationActionTypes;
  metadata: AutoModerationActionMetadata;
}

export interface AutoModerationActionMetadata {
  channelId: Snowflake | null;
  durationSeconds: number | null;
  customMessage: string | null;
}

export interface AutoModerationTriggerMetadata {
  keywordFilter: string[];
  regexPatterns: string[];
  presets: (AutoModerationRuleKeywordPresetType | AutoModerationRuleKeywordPresetTypes)[];
  allowList: string[];
  mentionTotalLimit: number | null;
}

export interface FetchAutoModerationRuleOptions extends BaseFetchOptions {
  autoModerationRule: AutoModerationRuleResolvable;
}

export interface FetchAutoModerationRulesOptions {
  cache?: boolean;
}

export interface AutoModerationRuleCreateOptions {
  name: string;
  eventType: AutoModerationRuleEventType | AutoModerationRuleEventTypes;
  triggerType: AutoModerationRuleTriggerType | AutoModerationRuleTriggerTypes;
  triggerMetadata?: AutoModerationTriggerMetadataOptions;
  actions: AutoModerationActionOptions[];
  enabled?: boolean;
  exemptRoles?: Collection<Snowflake, Role> | RoleResolvable[];
  exemptChannels?: Collection<Snowflake, GuildBasedChannel> | GuildChannelResolvable[];
  reason?: string;
}

export interface AutoModerationRuleEditOptions extends Partial<Omit<AutoModerationRuleCreateOptions, 'triggerType'>> {}

export interface AutoModerationTriggerMetadataOptions extends Partial<AutoModerationTriggerMetadata> {}

export interface AutoModerationActionOptions {
  type: AutoModerationActionType | AutoModerationActionTypes;
  metadata?: AutoModerationActionMetadataOptions;
}

export interface AutoModerationActionMetadataOptions extends Partial<Omit<AutoModerationActionMetadata, 'channelId'>> {
  channel: GuildTextChannelResolvable | ThreadChannel;
}

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

export type AwaitModalSubmitOptions<T extends ModalSubmitInteraction> = Omit<
  ModalSubmitInteractionCollectorOptions<T>,
  'max' | 'maxComponents' | 'maxUsers'
> & {
  time: number;
};

export interface AwaitReactionsOptions extends ReactionCollectorOptions {
  errors?: string[];
}

export interface BanOptions {
  /** @deprecated Use {@link deleteMessageSeconds} instead. */
  days?: number;
  deleteMessageSeconds?: number;
  reason?: string;
}

export type Base64Resolvable = Buffer | Base64String;

export type Base64String = string;

export interface BaseFetchOptions {
  cache?: boolean;
  force?: boolean;
}

export interface BaseMessageComponentOptions {
  type?: MessageComponentType | MessageComponentTypes;
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
  AutoModerationRuleManager: [manager: typeof AutoModerationRuleManager, holds: typeof AutoModerationRule];
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
  type?: ExcludeEnum<
    typeof ChannelTypes,
    | 'DM'
    | 'GROUP_DM'
    | 'UNKNOWN'
    | 'GUILD_PUBLIC_THREAD'
    | 'GUILD_NEWS_THREAD'
    | 'GUILD_PRIVATE_THREAD'
    | 'GUILD_CATEGORY'
  >;
  nsfw?: boolean;
  bitrate?: number;
  userLimit?: number;
  rateLimitPerUser?: number;
  position?: number;
  rtcRegion?: string;
  videoQualityMode?: VideoQualityMode;
  availableTags?: GuildForumTagData[];
  defaultReactionEmoji?: DefaultReactionEmoji;
  defaultSortOrder?: SortOrderType;
  defaultForumLayout?: ForumLayoutType;
  reason?: string;
}

export interface ChannelCreationOverwrites {
  allow?: PermissionResolvable;
  deny?: PermissionResolvable;
  id: RoleResolvable | UserResolvable;
}

export interface ChannelData {
  name?: string;
  type?: Pick<typeof ChannelTypes, 'GUILD_TEXT' | 'GUILD_NEWS'>;
  position?: number;
  topic?: string;
  nsfw?: boolean;
  bitrate?: number;
  userLimit?: number;
  parent?: CategoryChannelResolvable | null;
  rateLimitPerUser?: number;
  lockPermissions?: boolean;
  permissionOverwrites?: readonly OverwriteResolvable[] | Collection<Snowflake, OverwriteResolvable>;
  defaultAutoArchiveDuration?: ThreadAutoArchiveDuration | 'MAX';
  rtcRegion?: string | null;
  videoQualityMode?: VideoQualityMode | null;
  availableTags?: GuildForumTagData[];
  defaultReactionEmoji?: DefaultReactionEmoji;
  defaultThreadRateLimitPerUser?: number;
  defaultSortOrder?: SortOrderType | null;
  defaultForumLayout?: ForumLayoutType;
  flags?: ChannelFlagsResolvable;
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

export interface BaseClientEvents {
  apiResponse: [request: APIRequest, response: Response];
  apiRequest: [request: APIRequest];
  debug: [message: string];
  rateLimit: [rateLimitData: RateLimitData];
  invalidRequestWarning: [invalidRequestWarningData: InvalidRequestWarningData];
}

export interface ClientEvents extends BaseClientEvents {
  /** @deprecated See [this issue](https://github.com/discord/discord-api-docs/issues/3690) for more information. */
  applicationCommandCreate: [command: ApplicationCommand];
  /** @deprecated See [this issue](https://github.com/discord/discord-api-docs/issues/3690) for more information. */
  applicationCommandDelete: [command: ApplicationCommand];
  /** @deprecated See [this issue](https://github.com/discord/discord-api-docs/issues/3690) for more information. */
  applicationCommandUpdate: [oldCommand: ApplicationCommand | null, newCommand: ApplicationCommand];
  applicationCommandPermissionsUpdate: [data: ApplicationCommandPermissionsUpdateData];
  autoModerationActionExecution: [autoModerationActionExecution: AutoModerationActionExecution];
  autoModerationRuleCreate: [autoModerationRule: AutoModerationRule];
  autoModerationRuleDelete: [autoModerationRule: AutoModerationRule];
  autoModerationRuleUpdate: [
    oldAutoModerationRule: AutoModerationRule | null,
    newAutoModerationRule: AutoModerationRule,
  ];
  cacheSweep: [message: string];
  channelCreate: [channel: NonThreadGuildBasedChannel];
  channelDelete: [channel: DMChannel | NonThreadGuildBasedChannel];
  channelPinsUpdate: [channel: TextBasedChannel, date: Date];
  channelUpdate: [
    oldChannel: DMChannel | NonThreadGuildBasedChannel,
    newChannel: DMChannel | NonThreadGuildBasedChannel,
  ];
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
    data: { count: number; index: number; nonce: string | undefined; notFound: unknown[] },
  ];
  guildMemberUpdate: [oldMember: GuildMember | PartialGuildMember, newMember: GuildMember];
  guildUpdate: [oldGuild: Guild, newGuild: Guild];
  inviteCreate: [invite: Invite];
  inviteDelete: [invite: Invite];
  /** @deprecated Use messageCreate instead */
  message: [message: Message];
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
  threadCreate: [thread: ThreadChannel, newlyCreated: boolean];
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
  webhookUpdate: [channel: TextChannel | NewsChannel | VoiceChannel | ForumChannel | StageChannel];
  /** @deprecated Use interactionCreate instead */
  interaction: [interaction: Interaction];
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
  guildAuditLogEntryCreate: [auditLogEntry: GuildAuditLogsEntry, guild: Guild];
}

export interface ClientFetchInviteOptions {
  guildScheduledEventId?: Snowflake;
}

export interface ClientOptions {
  shards?: number | number[] | 'auto';
  shardCount?: number;
  closeTimeout?: number;
  makeCache?: CacheFactory;
  /** @deprecated Pass the value of this property as `lifetime` to `sweepers.messages` instead. */
  messageCacheLifetime?: number;
  /** @deprecated Pass the value of this property as `interval` to `sweepers.messages` instead. */
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
  failIfNotExists?: boolean;
  userAgentSuffix?: string[];
  presence?: PresenceData;
  intents: BitFieldResolvable<IntentsString, number>;
  waitGuildTimeout?: number;
  sweepers?: SweeperOptions;
  ws?: WebSocketOptions;
  http?: HTTPOptions;
  rejectOnRateLimit?: string[] | ((data: RateLimitData) => boolean | Promise<boolean>);
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
  attachment?: MessageAttachment;
}

export interface CommandInteractionResolvedData<Cached extends CacheType = CacheType> {
  users?: Collection<Snowflake, User>;
  members?: Collection<Snowflake, CacheTypeReducer<Cached, GuildMember, APIInteractionDataResolvedGuildMember>>;
  roles?: Collection<Snowflake, CacheTypeReducer<Cached, Role, APIRole>>;
  channels?: Collection<Snowflake, CacheTypeReducer<Cached, AnyChannel, APIInteractionDataResolvedChannel>>;
  messages?: Collection<Snowflake, CacheTypeReducer<Cached, Message, APIMessage>>;
  attachments?: Collection<Snowflake, MessageAttachment>;
}

export interface ConstantsClientApplicationAssetTypes {
  SMALL: 1;
  BIG: 2;
}

export type AutocompleteFocusedOption = Pick<CommandInteractionOption, 'name'> & {
  focused: true;
  type:
    | 'STRING'
    | 'INTEGER'
    | 'NUMBER'
    | ApplicationCommandOptionTypes.STRING
    | ApplicationCommandOptionTypes.INTEGER
    | ApplicationCommandOptionTypes.NUMBER;
  value: string;
};

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
  RATE_LIMIT: 'rateLimit';
  INVALID_REQUEST_WARNING: 'invalidRequestWarning';
  API_RESPONSE: 'apiResponse';
  API_REQUEST: 'apiRequest';
  CLIENT_READY: 'ready';
  /** @deprecated See [this issue](https://github.com/discord/discord-api-docs/issues/3690) for more information. */
  APPLICATION_COMMAND_CREATE: 'applicationCommandCreate';
  /** @deprecated See [this issue](https://github.com/discord/discord-api-docs/issues/3690) for more information. */
  APPLICATION_COMMAND_DELETE: 'applicationCommandDelete';
  APPLICATION_COMMAND_PERMISSIONS_UPDATE: 'applicationCommandPermissionsUpdate';
  /** @deprecated See [this issue](https://github.com/discord/discord-api-docs/issues/3690) for more information. */
  APPLICATION_COMMAND_UPDATE: 'applicationCommandUpdate';
  AUTO_MODERATION_ACTION_EXECUTION: 'autoModerationActionExecution';
  AUTO_MODERATION_RULE_CREATE: 'autoModerationRuleCreate';
  AUTO_MODERATION_RULE_DELETE: 'autoModerationRuleDelete';
  AUTO_MODERATION_RULE_UPDATE: 'autoModerationRuleUpdate';
  GUILD_CREATE: 'guildCreate';
  GUILD_DELETE: 'guildDelete';
  GUILD_UPDATE: 'guildUpdate';
  GUILD_UNAVAILABLE: 'guildUnavailable';
  GUILD_MEMBER_ADD: 'guildMemberAdd';
  GUILD_MEMBER_REMOVE: 'guildMemberRemove';
  GUILD_MEMBER_UPDATE: 'guildMemberUpdate';
  GUILD_MEMBER_AVAILABLE: 'guildMemberAvailable';
  GUILD_MEMBERS_CHUNK: 'guildMembersChunk';
  GUILD_INTEGRATIONS_UPDATE: 'guildIntegrationsUpdate';
  GUILD_ROLE_CREATE: 'roleCreate';
  GUILD_ROLE_DELETE: 'roleDelete';
  INVITE_CREATE: 'inviteCreate';
  INVITE_DELETE: 'inviteDelete';
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
  GUILD_AUDIT_LOG_ENTRY_CREATE: 'guildAuditLogEntryCreate';
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
  ALL_READY: 'allReady';
}

export interface ConstantsStatus {
  READY: 0;
  CONNECTING: 1;
  RECONNECTING: 2;
  IDLE: 3;
  NEARLY: 4;
  DISCONNECTED: 5;
  WAITING_FOR_GUILDS: 6;
  IDENTIFYING: 7;
  RESUMING: 8;
}

export interface CreateGuildScheduledEventInviteURLOptions extends CreateInviteOptions {
  channel?: GuildInvitableChannelResolvable;
}

export interface CreateRoleOptions extends RoleData {
  reason?: string;
}

export interface StageInstanceCreateOptions {
  topic: string;
  privacyLevel?: PrivacyLevel | number;
  sendStartNotification?: boolean;
}

export interface CrosspostedChannel {
  channelId: Snowflake;
  guildId: Snowflake;
  type: keyof typeof ChannelTypes;
  name: string;
}

export type DateResolvable = Date | number | string;

export interface DeconstructedSnowflake {
  timestamp: number;
  readonly date: Date;
  workerId: number;
  processId: number;
  increment: number;
  binary: string;
}

export type DefaultMessageNotificationLevel = keyof typeof DefaultMessageNotificationLevels;

export type DynamicImageFormat = AllowedImageFormat | 'gif';

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

export type EmojiIdentifierResolvable =
  | EmojiResolvable
  | `${'' | 'a:'}${string}:${Snowflake}`
  | `<${'' | 'a'}:${string}:${Snowflake}>`
  | string;

export type EmojiResolvable = Snowflake | GuildEmoji | ReactionEmoji;

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
  codeBlockContent?: boolean;
  inlineCodeContent?: boolean;
  escape?: boolean;
  heading?: boolean;
  bulletedList?: boolean;
  numberedList?: boolean;
  maskedLink?: boolean;
}

export type ExplicitContentFilterLevel = keyof typeof ExplicitContentFilterLevels;

export interface FetchApplicationCommandOptions extends BaseFetchOptions {
  guildId?: Snowflake;
  locale?: LocaleString;
  withLocalizations?: boolean;
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
  limit?: number;
  before?: Snowflake;
  after?: Snowflake;
  cache?: boolean;
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

export interface FetchThreadMemberOptions extends BaseFetchOptions {
  withMember?: boolean;
}

export interface FetchThreadMembersWithGuildMemberDataOptions {
  withMember: true;
  after?: Snowflake;
  limit?: number;
  cache?: boolean;
}

export interface FetchThreadMembersWithoutGuildMemberDataOptions {
  withMember?: false;
  cache?: boolean;
}

export type FetchThreadMembersOptions =
  | FetchThreadMembersWithGuildMemberDataOptions
  | FetchThreadMembersWithoutGuildMemberDataOptions;

export interface FetchThreadsOptions {
  archived?: FetchArchivedThreadOptions;
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
  GUILD_UPDATE: ['GUILD', 'UPDATE'];
  CHANNEL_CREATE: ['CHANNEL', 'CREATE'];
  CHANNEL_UPDATE: ['CHANNEL', 'UPDATE'];
  CHANNEL_DELETE: ['CHANNEL', 'DELETE'];
  CHANNEL_OVERWRITE_CREATE: ['CHANNEL', 'CREATE'];
  CHANNEL_OVERWRITE_UPDATE: ['CHANNEL', 'UPDATE'];
  CHANNEL_OVERWRITE_DELETE: ['CHANNEL', 'DELETE'];
  MEMBER_KICK: ['USER', 'DELETE'];
  MEMBER_PRUNE: ['USER', 'DELETE'];
  MEMBER_BAN_ADD: ['USER', 'DELETE'];
  MEMBER_BAN_REMOVE: ['USER', 'CREATE'];
  MEMBER_UPDATE: ['USER', 'UPDATE'];
  MEMBER_ROLE_UPDATE: ['USER', 'UPDATE'];
  MEMBER_MOVE: ['USER', 'UPDATE'];
  MEMBER_DISCONNECT: ['USER', 'DELETE'];
  BOT_ADD: ['USER', 'CREATE'];
  ROLE_CREATE: ['ROLE', 'CREATE'];
  ROLE_UPDATE: ['ROLE', 'UPDATE'];
  ROLE_DELETE: ['ROLE', 'DELETE'];
  INVITE_CREATE: ['INVITE', 'CREATE'];
  INVITE_UPDATE: ['INVITE', 'UPDATE'];
  INVITE_DELETE: ['INVITE', 'DELETE'];
  WEBHOOK_CREATE: ['WEBHOOK', 'CREATE'];
  WEBHOOK_UPDATE: ['WEBHOOK', 'UPDATE'];
  WEBHOOK_DELETE: ['WEBHOOK', 'DELETE'];
  EMOJI_CREATE: ['EMOJI', 'CREATE'];
  EMOJI_UPDATE: ['EMOJI', 'UPDATE'];
  EMOJI_DELETE: ['EMOJI', 'DELETE'];
  MESSAGE_DELETE: ['MESSAGE', 'DELETE'];
  MESSAGE_BULK_DELETE: ['MESSAGE', 'DELETE'];
  MESSAGE_PIN: ['MESSAGE', 'CREATE'];
  MESSAGE_UNPIN: ['MESSAGE', 'DELETE'];
  INTEGRATION_CREATE: ['INTEGRATION', 'CREATE'];
  INTEGRATION_UPDATE: ['INTEGRATION', 'UPDATE'];
  INTEGRATION_DELETE: ['INTEGRATION', 'DELETE'];
  STAGE_INSTANCE_CREATE: ['STAGE_INSTANCE', 'CREATE'];
  STAGE_INSTANCE_UPDATE: ['STAGE_INSTANCE', 'UPDATE'];
  STAGE_INSTANCE_DELETE: ['STAGE_INSTANCE', 'DELETE'];
  STICKER_CREATE: ['STICKER', 'CREATE'];
  STICKER_UPDATE: ['STICKER', 'UPDATE'];
  STICKER_DELETE: ['STICKER', 'DELETE'];
  GUILD_SCHEDULED_EVENT_CREATE: ['GUILD_SCHEDULED_EVENT', 'CREATE'];
  GUILD_SCHEDULED_EVENT_UPDATE: ['GUILD_SCHEDULED_EVENT', 'UPDATE'];
  GUILD_SCHEDULED_EVENT_DELETE: ['GUILD_SCHEDULED_EVENT', 'DELETE'];
  THREAD_CREATE: ['THREAD', 'CREATE'];
  THREAD_UPDATE: ['THREAD', 'UPDATE'];
  THREAD_DELETE: ['THREAD', 'DELETE'];
  APPLICATION_COMMAND_PERMISSION_UPDATE: ['APPLICATION_COMMAND_PERMISSION', 'UPDATE'];
  AUTO_MODERATION_RULE_CREATE: ['AUTO_MODERATION', 'CREATE'];
  AUTO_MODERATION_RULE_UPDATE: ['AUTO_MODERATION', 'UPDATE'];
  AUTO_MODERATION_RULE_DELETE: ['AUTO_MODERATION', 'DELETE'];
  AUTO_MODERATION_BLOCK_MESSAGE: ['AUTO_MODERATION', 'CREATE'];
  AUTO_MODERATION_FLAG_TO_CHANNEL: ['AUTO_MODERATION', 'CREATE'];
  AUTO_MODERATION_USER_COMMUNICATION_DISABLED: ['AUTO_MODERATION', 'CREATE'];
}

export interface GuildAuditLogsIds {
  1: 'GUILD_UPDATE';
  10: 'CHANNEL_CREATE';
  11: 'CHANNEL_UPDATE';
  12: 'CHANNEL_DELETE';
  13: 'CHANNEL_OVERWRITE_CREATE';
  14: 'CHANNEL_OVERWRITE_UPDATE';
  15: 'CHANNEL_OVERWRITE_DELETE';
  20: 'MEMBER_KICK';
  21: 'MEMBER_PRUNE';
  22: 'MEMBER_BAN_ADD';
  23: 'MEMBER_BAN_REMOVE';
  24: 'MEMBER_UPDATE';
  25: 'MEMBER_ROLE_UPDATE';
  26: 'MEMBER_MOVE';
  27: 'MEMBER_DISCONNECT';
  28: 'BOT_ADD';
  30: 'ROLE_CREATE';
  31: 'ROLE_UPDATE';
  32: 'ROLE_DELETE';
  40: 'INVITE_CREATE';
  41: 'INVITE_UPDATE';
  42: 'INVITE_DELETE';
  50: 'WEBHOOK_CREATE';
  51: 'WEBHOOK_UPDATE';
  52: 'WEBHOOK_DELETE';
  60: 'EMOJI_CREATE';
  61: 'EMOJI_UPDATE';
  62: 'EMOJI_DELETE';
  72: 'MESSAGE_DELETE';
  73: 'MESSAGE_BULK_DELETE';
  74: 'MESSAGE_PIN';
  75: 'MESSAGE_UNPIN';
  80: 'INTEGRATION_CREATE';
  81: 'INTEGRATION_UPDATE';
  82: 'INTEGRATION_DELETE';
  83: 'STAGE_INSTANCE_CREATE';
  84: 'STAGE_INSTANCE_UPDATE';
  85: 'STAGE_INSTANCE_DELETE';
  90: 'STICKER_CREATE';
  91: 'STICKER_UPDATE';
  92: 'STICKER_DELETE';
  100: 'GUILD_SCHEDULED_EVENT_CREATE';
  101: 'GUILD_SCHEDULED_EVENT_UPDATE';
  102: 'GUILD_SCHEDULED_EVENT_DELETE';
  110: 'THREAD_CREATE';
  111: 'THREAD_UPDATE';
  112: 'THREAD_DELETE';
  121: 'APPLICATION_COMMAND_PERMISSION_UPDATE';
  140: 'AUTO_MODERATION_RULE_CREATE';
  141: 'AUTO_MODERATION_RULE_UPDATE';
  142: 'AUTO_MODERATION_RULE_DELETE';
  143: 'AUTO_MODERATION_BLOCK_MESSAGE';
  144: 'AUTO_MODERATION_FLAG_TO_CHANNEL';
  145: 'AUTO_MODERATION_USER_COMMUNICATION_DISABLED';
}

export type GuildAuditLogsActions = { [Key in keyof GuildAuditLogsIds as GuildAuditLogsIds[Key]]: Key } & { ALL: null };

export type GuildAuditLogsAction = keyof GuildAuditLogsActions;

export type GuildAuditLogsActionType = GuildAuditLogsTypes[keyof GuildAuditLogsTypes][1] | 'ALL';

export interface GuildAuditLogsEntryExtraField {
  MEMBER_PRUNE: { removed: number; days: number };
  MEMBER_MOVE: { channel: VoiceBasedChannel | { id: Snowflake }; count: number };
  MESSAGE_DELETE: { channel: GuildTextBasedChannel | { id: Snowflake }; count: number };
  MESSAGE_BULK_DELETE: { channel: GuildTextBasedChannel | { id: Snowflake }; count: number };
  MESSAGE_PIN: { channel: GuildTextBasedChannel | { id: Snowflake }; messageId: Snowflake };
  MESSAGE_UNPIN: { channel: GuildTextBasedChannel | { id: Snowflake }; messageId: Snowflake };
  MEMBER_DISCONNECT: { count: number };
  CHANNEL_OVERWRITE_CREATE:
    | Role
    | GuildMember
    | { id: Snowflake; name: string; type: OverwriteTypes.role }
    | { id: Snowflake; type: OverwriteTypes.member };
  CHANNEL_OVERWRITE_UPDATE:
    | Role
    | GuildMember
    | { id: Snowflake; name: string; type: OverwriteTypes.role }
    | { id: Snowflake; type: OverwriteTypes.member };
  CHANNEL_OVERWRITE_DELETE:
    | Role
    | GuildMember
    | { id: Snowflake; name: string; type: OverwriteTypes.role }
    | { id: Snowflake; type: OverwriteTypes.member };
  STAGE_INSTANCE_CREATE: StageChannel | { id: Snowflake };
  STAGE_INSTANCE_DELETE: StageChannel | { id: Snowflake };
  STAGE_INSTANCE_UPDATE: StageChannel | { id: Snowflake };
  APPLICATION_COMMAND_PERMISSION_UPDATE: {
    applicationId: Snowflake;
  };
  AUTO_MODERATION_BLOCK_MESSAGE: {
    autoModerationRuleName: string;
    autoModerationRuleTriggerType: AutoModerationRuleTriggerType;
  };
  AUTO_MODERATION_FLAG_TO_CHANNEL: {
    autoModerationRuleName: string;
    autoModerationRuleTriggerType: AutoModerationRuleTriggerType;
  };
  AUTO_MODERATION_USER_COMMUNICATIONDISABLED: {
    autoModerationRuleName: string;
    autoModerationRuleTriggerType: AutoModerationRuleTriggerType;
  };
}

export interface GuildAuditLogsEntryTargetField<TActionType extends GuildAuditLogsActionType> {
  USER: User | null;
  GUILD: Guild;
  WEBHOOK: Webhook;
  INVITE: Invite;
  MESSAGE: TActionType extends 'MESSAGE_BULK_DELETE' ? Guild | { id: Snowflake } : User;
  INTEGRATION: Integration;
  CHANNEL: NonThreadGuildBasedChannel | { id: Snowflake; [x: string]: unknown };
  THREAD: ThreadChannel | { id: Snowflake; [x: string]: unknown };
  STAGE_INSTANCE: StageInstance;
  STICKER: Sticker;
  GUILD_SCHEDULED_EVENT: GuildScheduledEvent;
  APPLICATION_COMMAND: ApplicationCommand | { id: Snowflake };
  AUTO_MODERATION: AutoModerationRule;
}

export interface GuildAuditLogsFetchOptions<T extends GuildAuditLogsResolvable> {
  before?: Snowflake | GuildAuditLogsEntry;
  after?: Snowflake | GuildAuditLogsEntry;
  limit?: number;
  user?: UserResolvable;
  type?: T;
}

export type GuildAuditLogsResolvable = keyof GuildAuditLogsIds | GuildAuditLogsAction | null;

export type GuildAuditLogsTarget = GuildAuditLogsTypes[keyof GuildAuditLogsTypes][0] | 'ALL' | 'UNKNOWN';

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
  type?: ExcludeEnum<
    typeof ChannelTypes,
    'DM' | 'GROUP_DM' | 'UNKNOWN' | 'GUILD_PUBLIC_THREAD' | 'GUILD_NEWS_THREAD' | 'GUILD_PRIVATE_THREAD'
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
  defaultMessageNotifications?: DefaultMessageNotificationLevel | number;
  explicitContentFilter?: ExplicitContentFilterLevel | number;
  icon?: BufferResolvable | Base64Resolvable | null;
  roles?: PartialRoleData[];
  systemChannelFlags?: SystemChannelFlagsResolvable;
  systemChannelId?: Snowflake | number;
  verificationLevel?: VerificationLevel | number;
}

export interface GuildWidgetSettings {
  enabled: boolean;
  channel: NonThreadGuildBasedChannel | null;
}

export interface GuildEditData {
  name?: string;
  verificationLevel?: VerificationLevel | number | null;
  explicitContentFilter?: ExplicitContentFilterLevel | number | null;
  defaultMessageNotifications?: DefaultMessageNotificationLevel | number | null;
  afkChannel?: VoiceChannelResolvable | null;
  systemChannel?: TextChannelResolvable | null;
  systemChannelFlags?: SystemChannelFlagsResolvable;
  afkTimeout?: number;
  icon?: BufferResolvable | Base64Resolvable | null;
  owner?: GuildMemberResolvable;
  splash?: BufferResolvable | Base64Resolvable | null;
  discoverySplash?: BufferResolvable | Base64Resolvable | null;
  banner?: BufferResolvable | Base64Resolvable | null;
  rulesChannel?: TextChannelResolvable | null;
  publicUpdatesChannel?: TextChannelResolvable | null;
  preferredLocale?: string | null;
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
  | 'AUTO_MODERATION'
  | 'BANNER'
  | 'COMMERCE'
  | 'COMMUNITY'
  | 'CREATOR_MONETIZABLE_PROVISIONAL'
  | 'CREATOR_STORE_PAGE'
  | 'DISCOVERABLE'
  | 'FEATURABLE'
  | 'INVITES_DISABLED'
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
  | 'MORE_STICKERS'
  | 'THREE_DAY_THREAD_ARCHIVE'
  | 'SEVEN_DAY_THREAD_ARCHIVE'
  | 'PRIVATE_THREADS'
  | 'ROLE_ICONS'
  | 'ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE'
  | 'ROLE_SUBSCRIPTIONS_ENABLED';

export interface GuildMemberEditData {
  nick?: string | null;
  roles?: Collection<Snowflake, Role> | readonly RoleResolvable[];
  mute?: boolean;
  deaf?: boolean;
  channel?: GuildVoiceChannelResolvable | null;
  communicationDisabledUntil?: DateResolvable | null;
  flags?: GuildMemberFlagsResolvable;
}

export type GuildMemberFlagsString = 'DID_REJOIN' | 'COMPLETED_ONBOARDING' | 'BYPASSES_VERIFICATION' | 'STARTED_ONBOARDING';

export type GuildMemberFlagsResolvable = BitFieldResolvable<GuildMemberFlagsString, number>;

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
  privacyLevel: GuildScheduledEventPrivacyLevel | number;
  entityType: GuildScheduledEventEntityType | number;
  description?: string;
  channel?: GuildVoiceChannelResolvable;
  entityMetadata?: GuildScheduledEventEntityMetadataOptions;
  image?: BufferResolvable | Base64Resolvable | null;
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

export type GuildScheduledEventEntityType = keyof typeof GuildScheduledEventEntityTypes;

export type GuildScheduledEventManagerFetchResult<
  T extends GuildScheduledEventResolvable | FetchGuildScheduledEventOptions | FetchGuildScheduledEventsOptions,
> = T extends GuildScheduledEventResolvable | FetchGuildScheduledEventOptions
  ? GuildScheduledEvent
  : Collection<Snowflake, GuildScheduledEvent>;

export type GuildScheduledEventManagerFetchSubscribersResult<T extends FetchGuildScheduledEventSubscribersOptions> =
  T extends { withMember: true }
    ? Collection<Snowflake, GuildScheduledEventUser<true>>
    : Collection<Snowflake, GuildScheduledEventUser<false>>;

export type GuildScheduledEventPrivacyLevel = keyof typeof GuildScheduledEventPrivacyLevels;

export type GuildScheduledEventResolvable = Snowflake | GuildScheduledEvent;

export type GuildScheduledEventSetStatusArg<T extends GuildScheduledEventStatus> = T extends 'SCHEDULED'
  ? 'ACTIVE' | 'CANCELED'
  : T extends 'ACTIVE'
  ? 'COMPLETED'
  : never;

export type GuildScheduledEventStatus = keyof typeof GuildScheduledEventStatuses;

export interface GuildScheduledEventUser<T> {
  guildScheduledEventId: Snowflake;
  user: User;
  member: T extends true ? GuildMember : null;
}

export type GuildTemplateResolvable = string;

export type GuildVoiceChannelResolvable = VoiceBasedChannel | Snowflake;

export type HexColorString = `#${string}`;

export interface HTTPAttachmentData {
  attachment: string | Buffer | Stream;
  name: string;
  file: Buffer | Stream;
}

export interface HTTPErrorData {
  json: unknown;
  files: HTTPAttachmentData[];
}

export interface HTTPOptions {
  agent?: Omit<AgentOptions, 'keepAlive'>;
  api?: string;
  version?: number;
  host?: string;
  cdn?: string;
  invite?: string;
  template?: string;
  headers?: Record<string, string>;
  scheduledEvent?: string;
}

export interface ImageURLOptions extends Omit<StaticImageURLOptions, 'format'> {
  dynamic?: boolean;
  format?: DynamicImageFormat;
}

export type IntegrationType = 'twitch' | 'youtube' | 'discord' | 'guild_subscription';

export interface InteractionCollectorOptions<T extends Interaction, Cached extends CacheType = CacheType>
  extends CollectorOptions<[T]> {
  channel?: TextBasedChannelResolvable;
  componentType?: MessageComponentType | MessageComponentTypes;
  guild?: GuildResolvable;
  interactionType?: InteractionType | InteractionTypes;
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
  flags?: BitFieldResolvable<'SUPPRESS_EMBEDS' | 'EPHEMERAL', number>;
}

export type InteractionResponseType = keyof typeof InteractionResponseTypes;

export type InteractionType = keyof typeof InteractionTypes;

export interface InteractionUpdateOptions extends MessageEditOptions {
  fetchReply?: boolean;
}

export type IntentsString =
  | 'GUILDS'
  | 'GUILD_MEMBERS'
  | 'GUILD_BANS'
  | 'GUILD_EMOJIS_AND_STICKERS'
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
  | 'DIRECT_MESSAGE_TYPING'
  | 'MESSAGE_CONTENT'
  | 'GUILD_SCHEDULED_EVENTS'
  | 'AUTO_MODERATION_CONFIGURATION'
  | 'AUTO_MODERATION_EXECUTION';

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

export type IntegrationExpireBehaviors = 'REMOVE_ROLE' | 'KICK';

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
  | 'webhook.incoming'
  | 'role_connections.write';

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

export type MembershipState = keyof typeof MembershipStates;

export type MessageActionRowComponent = MessageButton | MessageSelectMenu;

export type MessageActionRowComponentOptions =
  | (Required<BaseMessageComponentOptions> & MessageButtonOptions)
  | (Required<BaseMessageComponentOptions> & MessageSelectMenuOptions);

export type MessageActionRowComponentResolvable =
  | MessageActionRowComponent
  | MessageActionRowComponentOptions
  | APIMessageActionRowComponent;

export type ModalActionRowComponent = TextInputComponent;

export type ModalActionRowComponentOptions = TextInputComponentOptions;

export type ModalActionRowComponentResolvable =
  | ModalActionRowComponent
  | ModalActionRowComponentOptions
  | APIModalActionRowComponent;

export interface MessageActionRowOptions<
  T extends
    | MessageActionRowComponentResolvable
    | ModalActionRowComponentResolvable = MessageActionRowComponentResolvable,
> extends BaseMessageComponentOptions {
  components: T[];
}

export interface MessageActivity {
  partyId: string;
  type: MessageActivityType;
}

export interface BaseButtonOptions extends BaseMessageComponentOptions {
  disabled?: boolean;
  emoji?: EmojiIdentifierResolvable;
  label?: string;
}

export interface LinkButtonOptions extends BaseButtonOptions {
  style: 'LINK' | MessageButtonStyles.LINK;
  url: string;
}

export interface InteractionButtonOptions extends BaseButtonOptions {
  style: ExcludeEnum<typeof MessageButtonStyles, 'LINK'>;
  customId: string;
}

export type MessageButtonOptions = InteractionButtonOptions | LinkButtonOptions;

export type MessageButtonStyle = keyof typeof MessageButtonStyles;

export type MessageButtonStyleResolvable = MessageButtonStyle | MessageButtonStyles;

export interface MessageCollectorOptions extends CollectorOptions<[Message]> {
  max?: number;
  maxProcessed?: number;
}

export type MessageComponent = BaseMessageComponent | MessageActionRow | MessageButton | MessageSelectMenu;

export type MessageComponentCollectorOptions<T extends MessageComponentInteraction | ModalSubmitInteraction> = Omit<
  InteractionCollectorOptions<T>,
  'channel' | 'message' | 'guild' | 'interactionType'
>;

export type MessageChannelComponentCollectorOptions<T extends MessageComponentInteraction | ModalSubmitInteraction> =
  Omit<InteractionCollectorOptions<T>, 'channel' | 'guild' | 'interactionType'>;

export type MessageComponentOptions =
  | BaseMessageComponentOptions
  | MessageActionRowOptions
  | MessageButtonOptions
  | MessageSelectMenuOptions;

export type MessageComponentType = keyof typeof MessageComponentTypes;

export type MessageComponentTypeResolvable = MessageComponentType | MessageComponentTypes;

export type GuildForumThreadMessageCreateOptions = MessageOptions & Pick<MessageOptions, 'flags' | 'stickers'>;

export interface MessageEditOptions {
  attachments?: MessageAttachment[];
  content?: string | null;
  embeds?: (MessageEmbed | MessageEmbedOptions | APIEmbed)[] | null;
  files?: (FileOptions | BufferResolvable | Stream | MessageAttachment)[];
  flags?: BitFieldResolvable<MessageFlagsString, number>;
  allowedMentions?: MessageMentionOptions;
  components?: (MessageActionRow | (Required<BaseMessageComponentOptions> & MessageActionRowOptions))[];
}

export interface MessageEmbedAuthor {
  name: string;
  url?: string;
  iconURL?: string;
  proxyIconURL?: string;
}

export interface MessageEmbedFooter {
  text: string;
  iconURL?: string;
  proxyIconURL?: string;
}

export interface MessageEmbedImage {
  url: string;
  proxyURL?: string;
  height?: number;
  width?: number;
}

export interface MessageEmbedOptions {
  title?: string;
  description?: string;
  url?: string;
  timestamp?: Date | number;
  color?: ColorResolvable;
  fields?: EmbedFieldData[];
  author?: Partial<MessageEmbedAuthor> & { icon_url?: string; proxy_icon_url?: string };
  thumbnail?: Partial<MessageEmbedThumbnail> & { proxy_url?: string };
  image?: Partial<MessageEmbedImage> & { proxy_url?: string };
  video?: Partial<MessageEmbedVideo> & { proxy_url?: string };
  footer?: Partial<MessageEmbedFooter> & { icon_url?: string; proxy_icon_url?: string };
}

export interface MessageEmbedProvider {
  name: string;
  url: string;
}

export interface MessageEmbedThumbnail {
  url: string;
  proxyURL?: string;
  height?: number;
  width?: number;
}

export interface MessageEmbedVideo {
  url?: string;
  proxyURL?: string;
  height?: number;
  width?: number;
}

export interface MessageEvent {
  data: WebSocket.Data;
  type: string;
  target: WebSocket;
}

export type MessageFlagsString =
  | 'CROSSPOSTED'
  | 'IS_CROSSPOST'
  | 'SUPPRESS_EMBEDS'
  | 'SOURCE_MESSAGE_DELETED'
  | 'URGENT'
  | 'HAS_THREAD'
  | 'EPHEMERAL'
  | 'LOADING'
  | 'SUPPRESS_NOTIFICATIONS';

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

export interface MessageOptions {
  tts?: boolean;
  nonce?: string | number;
  content?: string | null;
  embeds?: (MessageEmbed | MessageEmbedOptions | APIEmbed)[];
  components?: (MessageActionRow | (Required<BaseMessageComponentOptions> & MessageActionRowOptions))[];
  allowedMentions?: MessageMentionOptions;
  files?: (FileOptions | BufferResolvable | Stream | MessageAttachment)[];
  reply?: ReplyOptions;
  stickers?: StickerResolvable[];
  attachments?: MessageAttachment[];
  flags?: BitFieldResolvable<'SUPPRESS_EMBEDS' | 'SUPPRESS_NOTIFICATIONS', number>;
}

export type MessageReactionResolvable = MessageReaction | Snowflake | string;

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

export type MessageType = keyof typeof MessageTypes;

export type MFALevel = keyof typeof MFALevels;

export interface ModalOptions {
  components:
    | MessageActionRow<ModalActionRowComponent>[]
    | MessageActionRowOptions<ModalActionRowComponentResolvable>[];
  customId: string;
  title: string;
}

export type ModalSubmitInteractionCollectorOptions<T extends ModalSubmitInteraction> = Omit<
  InteractionCollectorOptions<T>,
  'channel' | 'message' | 'guild' | 'interactionType'
>;

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

export type NSFWLevel = keyof typeof NSFWLevels;

export interface OverwriteData {
  allow?: PermissionResolvable;
  deny?: PermissionResolvable;
  id: GuildMemberResolvable | RoleResolvable;
  type?: OverwriteType;
}

export type OverwriteResolvable = PermissionOverwrites | OverwriteData;

export type OverwriteType = 'member' | 'role';

export interface PartialModalActionRow {
  type: MessageComponentType;
  components: PartialTextInputData[];
}

export interface PartialTextInputData {
  value: string;
  // TODO: use dapi types
  type: MessageComponentType;
  customId: string;
}

export type PermissionFlags = Record<PermissionString, bigint>;

export type PermissionOverwriteOptions = Partial<Record<PermissionString, boolean | null>>;

export type PermissionResolvable = BitFieldResolvable<PermissionString, bigint>;

export type PermissionOverwriteResolvable = UserResolvable | RoleResolvable | PermissionOverwrites;

export type PermissionString =
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
  | 'MANAGE_EMOJIS_AND_STICKERS'
  | 'USE_APPLICATION_COMMANDS'
  | 'REQUEST_TO_SPEAK'
  | 'MANAGE_THREADS'
  | 'USE_PUBLIC_THREADS'
  | 'CREATE_PUBLIC_THREADS'
  | 'USE_PRIVATE_THREADS'
  | 'CREATE_PRIVATE_THREADS'
  | 'USE_EXTERNAL_STICKERS'
  | 'SEND_MESSAGES_IN_THREADS'
  | 'START_EMBEDDED_ACTIVITIES'
  | 'MODERATE_MEMBERS'
  | 'MANAGE_EVENTS'
  | 'VIEW_CREATOR_MONETIZATION_ANALYTICS'
  | 'USE_SOUNDBOARD';

export type RecursiveArray<T> = ReadonlyArray<T | RecursiveArray<T>>;

export type RecursiveReadonlyArray<T> = ReadonlyArray<T | RecursiveReadonlyArray<T>>;

export interface PartialRecipient {
  username: string;
}

export type PremiumTier = keyof typeof PremiumTiers;

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
  type?: ExcludeEnum<
    typeof ChannelTypes,
    | 'DM'
    | 'GROUP_DM'
    | 'GUILD_NEWS'
    | 'GUILD_STORE'
    | 'UNKNOWN'
    | 'GUILD_NEWS_THREAD'
    | 'GUILD_PUBLIC_THREAD'
    | 'GUILD_PRIVATE_THREAD'
    | 'GUILD_STAGE_VOICE'
  >;
  name: string;
  topic?: string;
  nsfw?: boolean;
  bitrate?: number;
  userLimit?: number;
  rtcRegion?: string | null;
  videoQualityMode?: VideoQualityMode;
  permissionOverwrites?: PartialOverwriteData[];
  rateLimitPerUser?: number;
  availableTags?: GuildForumTagData[];
  defaultReactionEmoji?: DefaultReactionEmoji;
  defaultThreadRateLimitPerUser?: number;
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

export type PartialTypes = 'USER' | 'CHANNEL' | 'GUILD_MEMBER' | 'MESSAGE' | 'REACTION' | 'GUILD_SCHEDULED_EVENT';

export interface PartialUser extends Partialize<User, 'username' | 'tag' | 'discriminator'> {}

export type PresenceStatusData = ClientPresenceStatus | 'invisible';

export type PresenceStatus = PresenceStatusData | 'offline';

export type PrivacyLevel = keyof typeof PrivacyLevels;

export interface RateLimitData {
  timeout: number;
  limit: number;
  method: string;
  path: string;
  route: string;
  global: boolean;
}

export interface InvalidRequestWarningData {
  count: number;
  remainingTime: number;
}

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
  allow: Permissions;
  deny: Permissions;
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
  subscriptionListingId?: Snowflake;
  availableForPurchase?: true;
  guildConnections?: true;
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

export interface StaticImageURLOptions {
  format?: AllowedImageFormat;
  size?: AllowedImageSize;
}

export type StageInstanceResolvable = StageInstance | Snowflake;

export interface StartThreadOptions {
  name: string;
  autoArchiveDuration?: ThreadAutoArchiveDuration | 'MAX';
  reason?: string;
  rateLimitPerUser?: number;
}

export type Status = number;

export type StickerFormatType = keyof typeof StickerFormatTypes;

export type StickerResolvable = Sticker | Snowflake;

export type StickerType = keyof typeof StickerTypes;

export type SystemChannelFlagsString =
  | 'SUPPRESS_JOIN_NOTIFICATIONS'
  | 'SUPPRESS_PREMIUM_SUBSCRIPTIONS'
  | 'SUPPRESS_GUILD_REMINDER_NOTIFICATIONS'
  | 'SUPPRESS_JOIN_NOTIFICATION_REPLIES';

export type SystemChannelFlagsResolvable = BitFieldResolvable<SystemChannelFlagsString, number>;

export type ChannelFlagsResolvable = BitFieldResolvable<ChannelFlagsString, number>;

export type SystemMessageType = Exclude<
  MessageType,
  'DEFAULT' | 'REPLY' | 'APPLICATION_COMMAND' | 'CONTEXT_MENU_COMMAND'
>;

export type StageChannelResolvable = StageChannel | Snowflake;

export interface StageInstanceEditOptions {
  topic?: string;
  privacyLevel?: PrivacyLevel | number;
}

export type SweeperKey = keyof SweeperDefinitions;

export type CollectionSweepFilter<K, V> = (value: V, key: K, collection: Collection<K, V>) => boolean;

export type SweepFilter<K, V> = (
  collection: LimitedCollection<K, V>,
) => ((value: V, key: K, collection: LimitedCollection<K, V>) => boolean) | null;

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
  autoModerationRules: [Snowflake, AutoModerationRule];
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
  /** @deprecated Use Global Sweepers instead */
  sweepFilter?: SweepFilter<K, V>;
  /** @deprecated Use Global Sweepers instead */
  sweepInterval?: number;
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
  | VoiceChannel
  | ForumChannel;

export type TextBasedChannel = Exclude<Extract<AnyChannel, { messages: MessageManager }>, ForumChannel>;

export type TextBasedChannelTypes = TextBasedChannel['type'];

export interface TextInputComponentOptions extends BaseMessageComponentOptions {
  customId?: string;
  label?: string;
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  required?: boolean;
  style?: TextInputStyleResolvable;
  value?: string;
}

export type TextInputStyle = keyof typeof TextInputStyles;

export type TextInputStyleResolvable = TextInputStyle | TextInputStyles;
export interface IntegrationAccount {
  id: string | Snowflake;
  name: string;
}

export type VoiceBasedChannel = Extract<AnyChannel, { bitrate: number }>;

export type GuildBasedChannel = Extract<AnyChannel, { guild: Guild }>;

export type NonThreadGuildBasedChannel = Exclude<GuildBasedChannel, ThreadChannel>;

export type GuildTextBasedChannel = Extract<GuildBasedChannel, TextBasedChannel>;

export type TextChannelResolvable = Snowflake | TextChannel;

export type TextBasedChannelResolvable = Snowflake | TextBasedChannel;

export type ThreadAutoArchiveDuration = 60 | 1440 | 4320 | 10080;

export type ThreadChannelResolvable = ThreadChannel | Snowflake;

export type ThreadChannelTypes = 'GUILD_NEWS_THREAD' | 'GUILD_PUBLIC_THREAD' | 'GUILD_PRIVATE_THREAD';

export interface GuildTextThreadCreateOptions<AllowedThreadType> extends StartThreadOptions {
  startMessage?: MessageResolvable;
  type?: AllowedThreadType;
  invitable?: AllowedThreadType extends 'GUILD_PRIVATE_THREAD' | 12 ? boolean : never;
  rateLimitPerUser?: number;
}

export interface GuildForumThreadCreateOptions extends StartThreadOptions {
  message: GuildForumThreadMessageCreateOptions | MessagePayload;
  appliedTags?: Snowflake[];
}

export interface ThreadEditData {
  name?: string;
  archived?: boolean;
  autoArchiveDuration?: ThreadAutoArchiveDuration | 'MAX';
  rateLimitPerUser?: number;
  locked?: boolean;
  invitable?: boolean;
  appliedTags?: Snowflake[];
  flags?: ChannelFlagsResolvable;
}

export type ThreadMemberFlagsString = '';

export type ThreadMemberResolvable = ThreadMember | UserResolvable;

export type UserFlagsString =
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
  | 'DISCORD_CERTIFIED_MODERATOR'
  | 'BOT_HTTP_INTERACTIONS'
  | 'ACTIVE_DEVELOPER';

export type UserMention = `<@${Snowflake}>`;

export type UserResolvable = User | Snowflake | Message | GuildMember | ThreadMember;

export interface Vanity {
  code: string | null;
  uses: number;
}

export type VerificationLevel = keyof typeof VerificationLevels;

export type VideoQualityMode = keyof typeof VideoQualityModes;

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

export type WebhookClientOptions = Pick<
  ClientOptions,
  'allowedMentions' | 'restTimeOffset' | 'restRequestTimeout' | 'retryLimit' | 'http'
>;

export interface WebhookEditData {
  name?: string;
  avatar?: BufferResolvable | null;
  channel?: GuildTextChannelResolvable | VoiceChannel | StageChannel | ForumChannel;
}

export type WebhookEditMessageOptions = Pick<
  WebhookMessageOptions,
  'content' | 'embeds' | 'files' | 'allowedMentions' | 'components' | 'attachments' | 'threadId'
>;
export interface InteractionEditReplyOptions extends WebhookEditMessageOptions {
  message?: MessageResolvable | '@original';
}

export interface WebhookFetchMessageOptions {
  cache?: boolean;
  threadId?: Snowflake;
}

export interface WebhookMessageOptions extends Omit<MessageOptions, 'reply' | 'stickers'> {
  username?: string;
  avatarURL?: string;
  threadId?: Snowflake;
  threadName?: string;
}

export type WebhookType = keyof typeof WebhookTypes;

export interface WebSocketOptions {
  large_threshold?: number;
  compress?: boolean;
  properties?: WebSocketProperties;
}

export interface WebSocketProperties {
  os?: string;
  browser?: string;
  device?: string;
  /** @deprecated Use {@link os} instead. */
  $os?: string;
  /** @deprecated Use {@link browser} instead. */
  $browser?: string;
  /** @deprecated Use {@link device} instead. */
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
  channel: TextChannel | NewsChannel | StoreChannel | ForumChannel | Snowflake;
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
  | 'APPLICATION_COMMAND_CREATE'
  | 'APPLICATION_COMMAND_DELETE'
  | 'APPLICATION_COMMAND_PERMISSIONS_UPDATE'
  | 'APPLICATION_COMMAND_UPDATE'
  | 'AUTO_MODERATION_ACTION_EXECUTION'
  | 'AUTO_MODERATION_RULE_CREATE'
  | 'AUTO_MODERATION_RULE_DELETE'
  | 'AUTO_MODERATION_RULE_UPDATE'
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
