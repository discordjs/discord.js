import {
  ActionRowBuilder as BuilderActionRow,
  MessageActionRowComponentBuilder,
  blockQuote,
  bold,
  ButtonBuilder as BuilderButtonComponent,
  channelMention,
  codeBlock,
  EmbedBuilder as BuildersEmbed,
  formatEmoji,
  hideLinkEmbed,
  hyperlink,
  inlineCode,
  italic,
  quote,
  roleMention,
  ChannelSelectMenuBuilder as BuilderChannelSelectMenuComponent,
  MentionableSelectMenuBuilder as BuilderMentionableSelectMenuComponent,
  RoleSelectMenuBuilder as BuilderRoleSelectMenuComponent,
  StringSelectMenuBuilder as BuilderStringSelectMenuComponent,
  UserSelectMenuBuilder as BuilderUserSelectMenuComponent,
  TextInputBuilder as BuilderTextInputComponent,
  SelectMenuOptionBuilder as BuildersSelectMenuOption,
  spoiler,
  strikethrough,
  time,
  TimestampStyles,
  underscore,
  userMention,
  ModalActionRowComponentBuilder,
  ModalBuilder as BuildersModal,
  AnyComponentBuilder,
  ComponentBuilder,
  type RestOrArray,
} from '@discordjs/builders';
import { Awaitable, JSONEncodable } from '@discordjs/util';
import { Collection } from '@discordjs/collection';
import { BaseImageURLOptions, ImageURLOptions, RawFile, REST, RESTOptions } from '@discordjs/rest';
import {
  APIActionRowComponent,
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
  GatewayDispatchEvents,
  GatewayVoiceServerUpdateDispatchData,
  GatewayVoiceStateUpdateDispatchData,
  GuildFeature,
  GuildMFALevel,
  GuildNSFWLevel,
  GuildPremiumTier,
  GuildVerificationLevel,
  Locale,
  InteractionType,
  InviteTargetType,
  MessageType,
  OAuth2Scopes,
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
  AuditLogEvent,
  APIMessageComponentEmoji,
  EmbedType,
  APIActionRowComponentTypes,
  APIModalInteractionResponseCallbackData,
  APIModalSubmitInteraction,
  APIMessageActionRowComponent,
  TextInputStyle,
  APITextInputComponent,
  APIModalActionRowComponent,
  APIModalComponent,
  APISelectMenuOption,
  APIEmbedField,
  APIEmbedAuthor,
  APIEmbedFooter,
  APIEmbedImage,
  VideoQualityMode,
  LocalizationMap,
  LocaleString,
  MessageActivityType,
  APIAttachment,
  APIChannel,
  ThreadAutoArchiveDuration,
  FormattingPatterns,
  APIEmbedProvider,
  AuditLogOptionsType,
  TextChannelType,
  ChannelFlags,
  SortOrderType,
  APIMessageStringSelectInteractionData,
  APIMessageUserSelectInteractionData,
  APIStringSelectComponent,
  APIUserSelectComponent,
  APIRoleSelectComponent,
  APIMentionableSelectComponent,
  APIChannelSelectComponent,
  APIGuildMember,
  APIMessageRoleSelectInteractionData,
  APIMessageMentionableSelectInteractionData,
  APIMessageChannelSelectInteractionData,
} from 'discord-api-types/v10';
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
  RawMessageButtonInteractionData,
  RawMessageComponentInteractionData,
  RawMessageData,
  RawMessagePayloadData,
  RawMessageReactionData,
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

declare module 'node:events' {
  class EventEmitter {
    // Add type overloads for client events.
    public static once<E extends EventEmitter, K extends keyof ClientEvents>(
      eventEmitter: E,
      eventName: E extends Client ? K : string,
    ): Promise<E extends Client ? ClientEvents[K] : any[]>;
    public static on<E extends EventEmitter, K extends keyof ClientEvents>(
      eventEmitter: E,
      eventName: E extends Client ? K : string,
    ): AsyncIterableIterator<E extends Client ? ClientEvents[K] : any>;
  }
}

//#region Classes

export class Activity {
  private constructor(presence: Presence, data?: RawActivityData);
  public applicationId: Snowflake | null;
  public assets: RichPresenceAssets | null;
  public buttons: string[];
  public get createdAt(): Date;
  public createdTimestamp: number;
  public details: string | null;
  public emoji: Emoji | null;
  public flags: Readonly<ActivityFlagsBitField>;
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
  public toString(): string;
}

export type ActivityFlagsString = keyof typeof ActivityFlags;

export interface BaseComponentData {
  type: ComponentType;
}

export type MessageActionRowComponentData =
  | JSONEncodable<APIMessageActionRowComponent>
  | ButtonComponentData
  | StringSelectMenuComponentData
  | UserSelectMenuComponentData
  | RoleSelectMenuComponentData
  | MentionableSelectMenuComponentData
  | ChannelSelectMenuComponentData;

export type ModalActionRowComponentData = JSONEncodable<APIModalActionRowComponent> | TextInputComponentData;

export type ActionRowComponentData = MessageActionRowComponentData | ModalActionRowComponentData;

export type ActionRowComponent = MessageActionRowComponent | ModalActionRowComponent;

export interface ActionRowData<T extends JSONEncodable<APIActionRowComponentTypes> | ActionRowComponentData>
  extends BaseComponentData {
  components: T[];
}

export class ActionRowBuilder<T extends AnyComponentBuilder = AnyComponentBuilder> extends BuilderActionRow<T> {
  constructor(
    data?: Partial<
      | ActionRowData<ActionRowComponentData | JSONEncodable<APIActionRowComponentTypes>>
      | APIActionRowComponent<APIMessageActionRowComponent | APIModalActionRowComponent>
    >,
  );
  public static from(
    other:
      | JSONEncodable<APIActionRowComponent<APIMessageActionRowComponent | APIModalActionRowComponent>>
      | APIActionRowComponent<APIMessageActionRowComponent | APIModalActionRowComponent>,
  ): ActionRowBuilder;
}

export type MessageActionRowComponent =
  | ButtonComponent
  | StringSelectMenuComponent
  | UserSelectMenuComponent
  | RoleSelectMenuComponent
  | MentionableSelectMenuComponent
  | ChannelSelectMenuComponent;
export type ModalActionRowComponent = TextInputComponent;

export class ActionRow<T extends MessageActionRowComponent | ModalActionRowComponent> extends Component<
  APIActionRowComponent<APIMessageActionRowComponent | APIModalActionRowComponent>
> {
  private constructor(data: APIActionRowComponent<APIMessageActionRowComponent | APIModalActionRowComponent>);
  public readonly components: T[];
  public toJSON(): APIActionRowComponent<ReturnType<T['toJSON']>>;
}

export class ActivityFlagsBitField extends BitField<ActivityFlagsString> {
  public static Flags: typeof ActivityFlags;
  public static resolve(bit?: BitFieldResolvable<ActivityFlagsString, number>): number;
}

export abstract class AnonymousGuild extends BaseGuild {
  protected constructor(client: Client<true>, data: RawAnonymousGuildData, immediatePatch?: boolean);
  public banner: string | null;
  public description: string | null;
  public nsfwLevel: GuildNSFWLevel;
  public premiumSubscriptionCount: number | null;
  public splash: string | null;
  public vanityURLCode: string | null;
  public verificationLevel: GuildVerificationLevel;
  public bannerURL(options?: ImageURLOptions): string | null;
  public splashURL(options?: ImageURLOptions): string | null;
}

export abstract class Application extends Base {
  protected constructor(client: Client<true>, data: RawApplicationData);
  public get createdAt(): Date;
  public get createdTimestamp(): number;
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
  private constructor(client: Client<true>, data: RawApplicationCommandData, guild?: Guild, guildId?: Snowflake);
  public applicationId: Snowflake;
  public get createdAt(): Date;
  public get createdTimestamp(): number;
  public defaultMemberPermissions: Readonly<PermissionsBitField> | null;
  public description: string;
  public descriptionLocalizations: LocalizationMap | null;
  public descriptionLocalized: string | null;
  public dmPermission: boolean | null;
  public guild: Guild | null;
  public guildId: Snowflake | null;
  public get manager(): ApplicationCommandManager;
  public id: Snowflake;
  public name: string;
  public nameLocalizations: LocalizationMap | null;
  public nameLocalized: string | null;
  public options: (ApplicationCommandOption & { nameLocalized?: string; descriptionLocalized?: string })[];
  public permissions: ApplicationCommandPermissionsManager<
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
  public setDefaultMemberPermissions(
    defaultMemberPermissions: PermissionResolvable | null,
  ): Promise<ApplicationCommand<PermissionsFetchType>>;
  public setDMPermission(dmPermission?: boolean): Promise<ApplicationCommand<PermissionsFetchType>>;
  public setOptions(options: ApplicationCommandOptionData[]): Promise<ApplicationCommand<PermissionsFetchType>>;
  public equals(
    command: ApplicationCommand | ApplicationCommandData | RawApplicationCommandData,
    enforceOptionOrder?: boolean,
  ): boolean;
  public static optionsEqual(
    existing: ApplicationCommandOption[],
    options: ApplicationCommandOption[] | ApplicationCommandOptionData[] | APIApplicationCommandOption[],
    enforceOptionOrder?: boolean,
  ): boolean;
  private static _optionEquals(
    existing: ApplicationCommandOption,
    options: ApplicationCommandOption | ApplicationCommandOptionData | APIApplicationCommandOption,
    enforceOptionOrder?: boolean,
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
  public constructor(client: Client<true>);
  public readonly client: Client<true>;
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

export type BooleanCache<T extends CacheType> = T extends 'cached' ? true : false;

export abstract class CommandInteraction<Cached extends CacheType = CacheType> extends BaseInteraction<Cached> {
  public type: InteractionType.ApplicationCommand;
  public get command(): ApplicationCommand | ApplicationCommand<{ guild: GuildResolvable }> | null;
  public options: Omit<
    CommandInteractionOptionResolver<Cached>,
    | 'getMessage'
    | 'getFocused'
    | 'getMentionable'
    | 'getRole'
    | 'getAttachment'
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
  public commandGuildId: Snowflake | null;
  public deferred: boolean;
  public ephemeral: boolean | null;
  public replied: boolean;
  public webhook: InteractionWebhook;
  public inGuild(): this is CommandInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is CommandInteraction<'cached'>;
  public inRawGuild(): this is CommandInteraction<'raw'>;
  public deferReply(
    options: InteractionDeferReplyOptions & { fetchResponse: true },
  ): Promise<Message<BooleanCache<Cached>>>;
  public deferReply(options?: InteractionDeferReplyOptions): Promise<InteractionResponse<BooleanCache<Cached>>>;
  public deleteResponse(message?: MessageResolvable | '@original'): Promise<void>;
  public editResponse(
    options: string | MessagePayload | InteractionEditResponseOptions,
  ): Promise<Message<BooleanCache<Cached>>>;
  public fetchResponse(message?: Snowflake | '@original'): Promise<Message<BooleanCache<Cached>>>;
  public followUp(options: string | MessagePayload | InteractionReplyOptions): Promise<Message<BooleanCache<Cached>>>;
  public reply(options: InteractionReplyOptions & { fetchResponse: true }): Promise<Message<BooleanCache<Cached>>>;
  public reply(
    options: string | MessagePayload | InteractionReplyOptions,
  ): Promise<InteractionResponse<BooleanCache<Cached>>>;
  public showModal(
    modal:
      | JSONEncodable<APIModalInteractionResponseCallbackData>
      | ModalComponentData
      | APIModalInteractionResponseCallbackData,
  ): Promise<void>;
  public awaitModalSubmit(
    options: AwaitModalSubmitOptions<ModalSubmitInteraction>,
  ): Promise<ModalSubmitInteraction<Cached>>;
  private transformOption(
    option: APIApplicationCommandOption,
    resolved: APIApplicationCommandInteractionData['resolved'],
  ): CommandInteractionOption<Cached>;
  private transformResolved(
    resolved: APIApplicationCommandInteractionData['resolved'],
  ): CommandInteractionResolvedData<Cached>;
}

export class InteractionResponse<Cached extends boolean = boolean> {
  private constructor(interaction: Interaction, id?: Snowflake);
  public interaction: Interaction<WrapBooleanCache<Cached>>;
  public client: Client;
  public id: Snowflake;
  public awaitMessageComponent<T extends MessageComponentType>(
    options?: AwaitMessageCollectorOptionsParams<T, Cached>,
  ): Promise<MappedInteractionTypes<Cached>[T]>;
  public createMessageComponentCollector<T extends MessageComponentType>(
    options?: MessageCollectorOptionsParams<T, Cached>,
  ): InteractionCollector<MappedInteractionTypes<Cached>[T]>;
}

export abstract class BaseGuild extends Base {
  protected constructor(client: Client<true>, data: RawBaseGuildData);
  public get createdAt(): Date;
  public get createdTimestamp(): number;
  public features: `${GuildFeature}`[];
  public icon: string | null;
  public id: Snowflake;
  public name: string;
  public get nameAcronym(): string;
  public get partnered(): boolean;
  public get verified(): boolean;
  public fetch(): Promise<Guild>;
  public iconURL(options?: ImageURLOptions): string | null;
  public toString(): string;
}

export class BaseGuildEmoji extends Emoji {
  protected constructor(client: Client<true>, data: RawGuildEmojiData, guild: Guild | GuildPreview);
  public available: boolean | null;
  public get createdAt(): Date;
  public get createdTimestamp(): number;
  public guild: Guild | GuildPreview;
  public id: Snowflake;
  public managed: boolean | null;
  public requiresColons: boolean | null;
}

export class BaseGuildTextChannel extends TextBasedChannelMixin(GuildChannel, true) {
  protected constructor(guild: Guild, data?: RawGuildChannelData, client?: Client<true>, immediatePatch?: boolean);
  public defaultAutoArchiveDuration?: ThreadAutoArchiveDuration;
  public rateLimitPerUser: number | null;
  public nsfw: boolean;
  public threads: GuildTextThreadManager<AllowedThreadTypeForTextChannel | AllowedThreadTypeForNewsChannel>;
  public topic: string | null;
  public createInvite(options?: CreateInviteOptions): Promise<Invite>;
  public fetchInvites(cache?: boolean): Promise<Collection<string, Invite>>;
  public setDefaultAutoArchiveDuration(
    defaultAutoArchiveDuration: ThreadAutoArchiveDuration,
    reason?: string,
  ): Promise<this>;
  public setTopic(topic: string | null, reason?: string): Promise<this>;
  public setType(type: ChannelType.GuildText, reason?: string): Promise<TextChannel>;
  public setType(type: ChannelType.GuildAnnouncement, reason?: string): Promise<NewsChannel>;
}

export class BaseGuildVoiceChannel extends GuildChannel {
  public constructor(guild: Guild, data?: RawGuildChannelData);
  public get members(): Collection<Snowflake, GuildMember>;
  public get full(): boolean;
  public get joinable(): boolean;
  public rtcRegion: string | null;
  public bitrate: number;
  public userLimit: number;
  public createInvite(options?: CreateInviteOptions): Promise<Invite>;
  public setRTCRegion(rtcRegion: string | null, reason?: string): Promise<this>;
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
  private constructor(client: Client<true>, data: RawMessageButtonInteractionData);
  public componentType: ComponentType.Button;
  public get component(): CacheTypeReducer<
    Cached,
    ButtonComponent,
    APIButtonComponent,
    ButtonComponent | APIButtonComponent,
    ButtonComponent | APIButtonComponent
  >;
  public inGuild(): this is ButtonInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is ButtonInteraction<'cached'>;
  public inRawGuild(): this is ButtonInteraction<'raw'>;
}

export type AnyComponent =
  | APIMessageComponent
  | APIModalComponent
  | APIActionRowComponent<APIMessageActionRowComponent | APIModalActionRowComponent>;

export class Component<T extends AnyComponent = AnyComponent> {
  public readonly data: Readonly<T>;
  public get type(): T['type'];
  public toJSON(): T;
  public equals(other: this | T): boolean;
}

export class ButtonComponent extends Component<APIButtonComponent> {
  private constructor(data: APIButtonComponent);
  public get style(): ButtonStyle;
  public get label(): string | null;
  public get emoji(): APIMessageComponentEmoji | null;
  public get disabled(): boolean | null;
  public get customId(): string | null;
  public get url(): string | null;
}

export type ComponentEmojiResolvable = APIMessageComponentEmoji | string;

export class ButtonBuilder extends BuilderButtonComponent {
  public constructor(data?: Partial<ButtonComponentData> | Partial<APIButtonComponent>);
  public static from(other: JSONEncodable<APIButtonComponent> | APIButtonComponent): ButtonBuilder;
  public override setEmoji(emoji: ComponentEmojiResolvable): this;
}

export class StringSelectMenuBuilder extends BuilderStringSelectMenuComponent {
  public constructor(data?: Partial<StringSelectMenuComponentData | APIStringSelectComponent>);
  private static normalizeEmoji(
    selectMenuOption: JSONEncodable<APISelectMenuOption> | SelectMenuComponentOptionData,
  ): (APISelectMenuOption | SelectMenuOptionBuilder)[];
  public override addOptions(
    ...options: RestOrArray<BuildersSelectMenuOption | SelectMenuComponentOptionData | APISelectMenuOption>
  ): this;
  public override setOptions(
    ...options: RestOrArray<BuildersSelectMenuOption | SelectMenuComponentOptionData | APISelectMenuOption>
  ): this;
  public static from(other: JSONEncodable<APISelectMenuComponent> | APISelectMenuComponent): StringSelectMenuBuilder;
}

export {
  /** @deprecated Use {@link StringSelectMenuBuilder} instead */
  StringSelectMenuBuilder as SelectMenuBuilder,
};

export class UserSelectMenuBuilder extends BuilderUserSelectMenuComponent {
  public constructor(data?: Partial<UserSelectMenuComponentData | APIUserSelectComponent>);
  public static from(other: JSONEncodable<APISelectMenuComponent> | APISelectMenuComponent): UserSelectMenuBuilder;
}

export class RoleSelectMenuBuilder extends BuilderRoleSelectMenuComponent {
  public constructor(data?: Partial<RoleSelectMenuComponentData | APIRoleSelectComponent>);
  public static from(other: JSONEncodable<APISelectMenuComponent> | APISelectMenuComponent): RoleSelectMenuBuilder;
}

export class MentionableSelectMenuBuilder extends BuilderMentionableSelectMenuComponent {
  public constructor(data?: Partial<MentionableSelectMenuComponentData | APIMentionableSelectComponent>);
  public static from(
    other: JSONEncodable<APISelectMenuComponent> | APISelectMenuComponent,
  ): MentionableSelectMenuBuilder;
}

export class ChannelSelectMenuBuilder extends BuilderChannelSelectMenuComponent {
  public constructor(data?: Partial<ChannelSelectMenuComponentData | APIChannelSelectComponent>);
  public static from(other: JSONEncodable<APISelectMenuComponent> | APISelectMenuComponent): ChannelSelectMenuBuilder;
}

export class SelectMenuOptionBuilder extends BuildersSelectMenuOption {
  public constructor(data?: SelectMenuComponentOptionData | APISelectMenuOption);
  public override setEmoji(emoji: ComponentEmojiResolvable): this;
  public static from(other: JSONEncodable<APISelectMenuOption> | APISelectMenuOption): SelectMenuOptionBuilder;
}

export class ModalBuilder extends BuildersModal {
  public constructor(data?: Partial<ModalComponentData> | Partial<APIModalInteractionResponseCallbackData>);
  public static from(other: JSONEncodable<APIModalComponent> | APIModalComponent): ModalBuilder;
}

export class TextInputBuilder extends BuilderTextInputComponent {
  public constructor(data?: Partial<TextInputComponentData | APITextInputComponent>);
  public static from(other: JSONEncodable<APITextInputComponent> | APITextInputComponent): TextInputBuilder;
}

export class TextInputComponent extends Component<APITextInputComponent> {
  public get customId(): string;
  public get value(): string;
}

export class BaseSelectMenuComponent<Data extends APISelectMenuComponent> extends Component<Data> {
  protected constructor(data: Data);
  public get placeholder(): string | null;
  public get maxValues(): number | null;
  public get minValues(): number | null;
  public get customId(): string;
  public get disabled(): boolean | null;
}

export class StringSelectMenuComponent extends BaseSelectMenuComponent<APIStringSelectComponent> {
  public get options(): APISelectMenuOption[];
}

export {
  /** @deprecated Use {@link StringSelectMenuComponent} instead */
  StringSelectMenuComponent as SelectMenuComponent,
};

export class UserSelectMenuComponent extends BaseSelectMenuComponent<APIUserSelectComponent> {}

export class RoleSelectMenuComponent extends BaseSelectMenuComponent<APIRoleSelectComponent> {}

export class MentionableSelectMenuComponent extends BaseSelectMenuComponent<APIMentionableSelectComponent> {}

export class ChannelSelectMenuComponent extends BaseSelectMenuComponent<APIChannelSelectComponent> {
  public getChannelTypes(): ChannelType[] | null;
}

export interface EmbedData {
  title?: string;
  type?: EmbedType;
  description?: string;
  url?: string;
  timestamp?: string | number | Date;
  color?: number;
  footer?: EmbedFooterData;
  image?: EmbedAssetData;
  thumbnail?: EmbedAssetData;
  provider?: APIEmbedProvider;
  author?: EmbedAuthorData;
  fields?: APIEmbedField[];
  video?: EmbedAssetData;
}

export interface IconData {
  iconURL?: string;
  proxyIconURL?: string;
}

export type EmbedAuthorData = Omit<APIEmbedAuthor, 'icon_url' | 'proxy_icon_url'> & IconData;

export type EmbedFooterData = Omit<APIEmbedFooter, 'icon_url' | 'proxy_icon_url'> & IconData;

export interface EmbedAssetData extends Omit<APIEmbedImage, 'proxy_url'> {
  proxyURL?: string;
}

export class EmbedBuilder extends BuildersEmbed {
  public constructor(data?: EmbedData | APIEmbed);
  public override setColor(color: ColorResolvable | null): this;
  public static from(other: JSONEncodable<APIEmbed> | APIEmbed): EmbedBuilder;
}

export class Embed {
  private constructor(data: APIEmbed);
  public readonly data: Readonly<APIEmbed>;
  public get fields(): APIEmbedField[];
  public get footer(): EmbedFooterData | null;
  public get title(): string | null;
  public get description(): string | null;
  public get url(): string | null;
  public get color(): number | null;
  public get hexColor(): string | null;
  public get timestamp(): string | null;
  public get thumbnail(): EmbedAssetData | null;
  public get image(): EmbedAssetData | null;
  public get author(): EmbedAuthorData | null;
  public get provider(): APIEmbedProvider | null;
  public get video(): EmbedAssetData | null;
  public get length(): number;
  public equals(other: Embed | APIEmbed): boolean;
  public toJSON(): APIEmbed;
}

export interface MappedChannelCategoryTypes {
  [ChannelType.GuildAnnouncement]: NewsChannel;
  [ChannelType.GuildVoice]: VoiceChannel;
  [ChannelType.GuildText]: TextChannel;
  [ChannelType.GuildStageVoice]: StageChannel;
  [ChannelType.GuildForum]: ForumChannel;
}

export type CategoryChannelType = Exclude<
  ChannelType,
  | ChannelType.DM
  | ChannelType.GroupDM
  | ChannelType.PublicThread
  | ChannelType.AnnouncementThread
  | ChannelType.PrivateThread
  | ChannelType.GuildCategory
  | ChannelType.GuildDirectory
>;

export class CategoryChannel extends GuildChannel {
  public get children(): CategoryChannelChildManager;
  public type: ChannelType.GuildCategory;
}

export type CategoryChannelResolvable = Snowflake | CategoryChannel;

export type ChannelFlagsString = keyof typeof ChannelFlags;

export type ChannelFlagsResolvable = BitFieldResolvable<ChannelFlagsString, number>;

export class ChannelFlagsBitField extends BitField<ChannelFlagsString> {
  public static Flags: typeof ChannelFlags;
  public static resolve(bit?: BitFieldResolvable<ChannelFlagsString, ChannelFlags>): number;
}

export abstract class BaseChannel extends Base {
  public constructor(client: Client<true>, data?: RawChannelData, immediatePatch?: boolean);
  public get createdAt(): Date | null;
  public get createdTimestamp(): number | null;
  public id: Snowflake;
  public flags: Readonly<ChannelFlagsBitField> | null;
  public get partial(): false;
  public type: ChannelType;
  public get url(): string;
  public delete(): Promise<this>;
  public fetch(force?: boolean): Promise<this>;
  public isThread(): this is AnyThreadChannel;
  public isTextBased(): this is TextBasedChannel;
  public isDMBased(): this is PartialGroupDMChannel | DMChannel | PartialDMChannel;
  public isVoiceBased(): this is VoiceBasedChannel;
  public toString(): ChannelMention | UserMention;
}

export type If<T extends boolean, A, B = null> = T extends true ? A : T extends false ? B : A | B;

export class Client<Ready extends boolean = boolean> extends BaseClient {
  public constructor(options: ClientOptions);
  private actions: unknown;
  private presence: ClientPresence;
  private _eval(script: string): unknown;
  private _validateOptions(options: ClientOptions): void;
  private get _censoredToken(): string | null;

  public application: If<Ready, ClientApplication>;
  public channels: ChannelManager;
  public get emojis(): BaseGuildEmojiManager;
  public guilds: GuildManager;
  public options: Omit<ClientOptions, 'intents'> & { intents: IntentsBitField };
  public get readyAt(): If<Ready, Date>;
  public readyTimestamp: If<Ready, number>;
  public sweepers: Sweepers;
  public shard: ShardClientUtil | null;
  public token: If<Ready, string, string | null>;
  public get uptime(): If<Ready, number>;
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
  private constructor(client: Client<true>, data: RawClientApplicationData);
  public botPublic: boolean | null;
  public botRequireCodeGrant: boolean | null;
  public commands: ApplicationCommandManager;
  public cover: string | null;
  public flags: Readonly<ApplicationFlagsBitField>;
  public tags: string[];
  public installParams: ClientApplicationInstallParams | null;
  public customInstallURL: string | null;
  public owner: User | Team | null;
  public get partial(): boolean;
  public rpcOrigins: string[];
  public fetch(): Promise<ClientApplication>;
}

export class ClientPresence extends Presence {
  private constructor(client: Client<true>, data: RawPresenceData);
  private _parse(data: PresenceData): RawPresenceData;

  public set(presence: PresenceData): ClientPresence;
}

export class ClientUser extends User {
  public mfaEnabled: boolean;
  public get presence(): ClientPresence;
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
  public static get DefaultMakeCacheSettings(): CacheWithLimitsOptions;
  public static get DefaultSweeperSettings(): SweeperOptions;
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
  ignore: [V, ...F];
  dispose: [V, ...F];
  end: [collected: Collection<K, V>, reason: string];
}

export abstract class Collector<K, V, F extends unknown[] = []> extends EventEmitter {
  protected constructor(client: Client<true>, options?: CollectorOptions<[V, ...F]>);
  private _timeout: NodeJS.Timeout | null;
  private _idletimeout: NodeJS.Timeout | null;
  private _endReason: string | null;

  public readonly client: Client;
  public collected: Collection<K, V>;
  public ended: boolean;
  public get endReason(): string | null;
  public filter: CollectorFilter<[V, ...F]>;
  public get next(): Promise<V>;
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

export class ChatInputCommandInteraction<Cached extends CacheType = CacheType> extends CommandInteraction<Cached> {
  public commandType: ApplicationCommandType.ChatInput;
  public options: Omit<CommandInteractionOptionResolver<Cached>, 'getMessage' | 'getFocused'>;
  public inGuild(): this is ChatInputCommandInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is ChatInputCommandInteraction<'cached'>;
  public inRawGuild(): this is ChatInputCommandInteraction<'raw'>;
  public toString(): string;
}

export class AutocompleteInteraction<Cached extends CacheType = CacheType> extends BaseInteraction<Cached> {
  public type: InteractionType.ApplicationCommandAutocomplete;
  public get command(): ApplicationCommand | ApplicationCommand<{ guild: GuildResolvable }> | null;
  public channelId: Snowflake;
  public commandId: Snowflake;
  public commandName: string;
  public commandType: ApplicationCommandType.ChatInput;
  public commandGuildId: Snowflake | null;
  public responded: boolean;
  public options: Omit<
    CommandInteractionOptionResolver<Cached>,
    'getMessage' | 'getUser' | 'getAttachment' | 'getChannel' | 'getMember' | 'getMentionable' | 'getRole'
  >;
  public inGuild(): this is AutocompleteInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is AutocompleteInteraction<'cached'>;
  public inRawGuild(): this is AutocompleteInteraction<'raw'>;
  public respond(options: ApplicationCommandOptionChoiceData[]): Promise<void>;
}

export class CommandInteractionOptionResolver<Cached extends CacheType = CacheType> {
  private constructor(
    client: Client<true>,
    options: CommandInteractionOption[],
    resolved: CommandInteractionResolvedData,
  );
  public readonly client: Client;
  public readonly data: readonly CommandInteractionOption<Cached>[];
  public readonly resolved: Readonly<CommandInteractionResolvedData<Cached>> | null;
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
  public getAttachment(name: string, required: true): NonNullable<CommandInteractionOption<Cached>['attachment']>;
  public getAttachment(
    name: string,
    required?: boolean,
  ): NonNullable<CommandInteractionOption<Cached>['attachment']> | null;
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
}

export class ContextMenuCommandInteraction<Cached extends CacheType = CacheType> extends CommandInteraction<Cached> {
  public commandType: ApplicationCommandType.Message | ApplicationCommandType.User;
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

export interface ResolvedFile {
  data: Buffer;
  contentType?: string;
}

export class DataResolver extends null {
  private constructor();
  public static resolveBase64(data: Base64Resolvable): string;
  public static resolveCode(data: string, regex: RegExp): string;
  public static resolveFile(resource: BufferResolvable | Stream): Promise<ResolvedFile>;
  public static resolveImage(resource: BufferResolvable | Base64Resolvable): Promise<string | null>;
  public static resolveInviteCode(data: InviteResolvable): string;
  public static resolveGuildTemplateCode(data: GuildTemplateResolvable): string;
}

export class DMChannel extends TextBasedChannelMixin(BaseChannel, false, [
  'bulkDelete',
  'fetchWebhooks',
  'createWebhook',
  'setRateLimitPerUser',
  'setNSFW',
]) {
  private constructor(client: Client<true>, data?: RawDMChannelData);
  public flags: Readonly<ChannelFlagsBitField>;
  public recipientId: Snowflake;
  public get recipient(): User | null;
  public type: ChannelType.DM;
  public fetch(force?: boolean): Promise<this>;
  public toString(): UserMention;
}

export class Emoji extends Base {
  protected constructor(client: Client<true>, emoji: RawEmojiData);
  public animated: boolean | null;
  public get createdAt(): Date | null;
  public get createdTimestamp(): number | null;
  public id: Snowflake | null;
  public name: string | null;
  public get identifier(): string;
  public get url(): string | null;
  public toJSON(): unknown;
  public toString(): string;
}

export class Guild extends AnonymousGuild {
  private constructor(client: Client<true>, data: RawGuildData);
  private _sortedRoles(): Collection<Snowflake, Role>;
  private _sortedChannels(channel: NonThreadGuildBasedChannel): Collection<Snowflake, NonThreadGuildBasedChannel>;

  public get afkChannel(): VoiceChannel | null;
  public afkChannelId: Snowflake | null;
  public afkTimeout: number;
  public applicationId: Snowflake | null;
  public maxVideoChannelUsers: number | null;
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
  public get joinedAt(): Date;
  public joinedTimestamp: number;
  public large: boolean;
  public maximumMembers: number | null;
  public maximumPresences: number | null;
  public memberCount: number;
  public members: GuildMemberManager;
  public mfaLevel: GuildMFALevel;
  public ownerId: Snowflake;
  public preferredLocale: Locale;
  public premiumProgressBarEnabled: boolean;
  public premiumTier: GuildPremiumTier;
  public presences: PresenceManager;
  public get publicUpdatesChannel(): TextChannel | null;
  public publicUpdatesChannelId: Snowflake | null;
  public roles: RoleManager;
  public get rulesChannel(): TextChannel | null;
  public rulesChannelId: Snowflake | null;
  public scheduledEvents: GuildScheduledEventManager;
  public get shard(): WebSocketShard;
  public shardId: number;
  public stageInstances: StageInstanceManager;
  public stickers: GuildStickerManager;
  public get systemChannel(): TextChannel | null;
  public systemChannelFlags: Readonly<SystemChannelFlagsBitField>;
  public systemChannelId: Snowflake | null;
  public vanityURLUses: number | null;
  public get voiceAdapterCreator(): InternalDiscordGatewayAdapterCreator;
  public voiceStates: VoiceStateManager;
  public get widgetChannel(): TextChannel | NewsChannel | VoiceBasedChannel | ForumChannel | null;
  public widgetChannelId: Snowflake | null;
  public widgetEnabled: boolean | null;
  public get maximumBitrate(): number;
  public createTemplate(name: string, description?: string): Promise<GuildTemplate>;
  public delete(): Promise<Guild>;
  public discoverySplashURL(options?: ImageURLOptions): string | null;
  public edit(data: GuildEditData): Promise<Guild>;
  public editWelcomeScreen(data: WelcomeScreenEditData): Promise<WelcomeScreen>;
  public equals(guild: Guild): boolean;
  public fetchAuditLogs<T extends GuildAuditLogsResolvable = null>(
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
    defaultMessageNotifications: GuildDefaultMessageNotifications | null,
    reason?: string,
  ): Promise<Guild>;
  public setDiscoverySplash(
    discoverySplash: BufferResolvable | Base64Resolvable | null,
    reason?: string,
  ): Promise<Guild>;
  public setExplicitContentFilter(
    explicitContentFilter: GuildExplicitContentFilter | null,
    reason?: string,
  ): Promise<Guild>;
  public setIcon(icon: BufferResolvable | Base64Resolvable | null, reason?: string): Promise<Guild>;
  public setName(name: string, reason?: string): Promise<Guild>;
  public setOwner(owner: GuildMemberResolvable, reason?: string): Promise<Guild>;
  public setPreferredLocale(preferredLocale: Locale | null, reason?: string): Promise<Guild>;
  public setPublicUpdatesChannel(publicUpdatesChannel: TextChannelResolvable | null, reason?: string): Promise<Guild>;
  public setRulesChannel(rulesChannel: TextChannelResolvable | null, reason?: string): Promise<Guild>;
  public setSplash(splash: BufferResolvable | Base64Resolvable | null, reason?: string): Promise<Guild>;
  public setSystemChannel(systemChannel: TextChannelResolvable | null, reason?: string): Promise<Guild>;
  public setSystemChannelFlags(systemChannelFlags: SystemChannelFlagsResolvable, reason?: string): Promise<Guild>;
  public setVerificationLevel(verificationLevel: GuildVerificationLevel | null, reason?: string): Promise<Guild>;
  public setPremiumProgressBarEnabled(enabled?: boolean, reason?: string): Promise<Guild>;
  public setWidgetSettings(settings: GuildWidgetSettingsData, reason?: string): Promise<Guild>;
  public setMFALevel(level: GuildMFALevel, reason?: string): Promise<Guild>;
  public toJSON(): unknown;
}

export class GuildAuditLogs<T extends GuildAuditLogsResolvable = AuditLogEvent> {
  private constructor(guild: Guild, data: RawGuildAuditLogData);
  private applicationCommands: Collection<Snowflake, ApplicationCommand>;
  private webhooks: Collection<Snowflake, Webhook>;
  private integrations: Collection<Snowflake | string, Integration>;
  private guildScheduledEvents: Collection<Snowflake, GuildScheduledEvent>;
  public entries: Collection<Snowflake, GuildAuditLogsEntry<T>>;
  public toJSON(): unknown;
}

export class GuildAuditLogsEntry<
  TAction extends GuildAuditLogsResolvable = AuditLogEvent,
  TActionType extends GuildAuditLogsActionType = TAction extends keyof GuildAuditLogsTypes
    ? GuildAuditLogsTypes[TAction][1]
    : GuildAuditLogsActionType,
  TTargetType extends GuildAuditLogsTargetType = TAction extends keyof GuildAuditLogsTypes
    ? GuildAuditLogsTypes[TAction][0]
    : GuildAuditLogsTargetType,
  TResolvedType = TAction extends null ? AuditLogEvent : TAction,
> {
  private constructor(logs: GuildAuditLogs, guild: Guild, data: RawGuildAuditLogEntryData);
  public static Targets: GuildAuditLogsTargets;
  public action: TResolvedType;
  public actionType: TActionType;
  public changes: AuditLogChange[];
  public get createdAt(): Date;
  public get createdTimestamp(): number;
  public executor: User | null;
  public extra: TResolvedType extends keyof GuildAuditLogsEntryExtraField
    ? GuildAuditLogsEntryExtraField[TResolvedType]
    : null;
  public id: Snowflake;
  public reason: string | null;
  public target: TTargetType extends keyof GuildAuditLogsEntryTargetField<TActionType>
    ? GuildAuditLogsEntryTargetField<TActionType>[TTargetType]
    : Role | GuildEmoji | { id: Snowflake } | null;
  public targetType: TTargetType;
  public static actionType(action: AuditLogEvent): GuildAuditLogsActionType;
  public static targetType(target: AuditLogEvent): GuildAuditLogsTargetType;
  public toJSON(): unknown;
}

export class GuildBan extends Base {
  private constructor(client: Client<true>, data: RawGuildBanData, guild: Guild);
  public guild: Guild;
  public user: User;
  public get partial(): boolean;
  public reason?: string | null;
  public fetch(force?: boolean): Promise<GuildBan>;
}

export abstract class GuildChannel extends BaseChannel {
  public constructor(guild: Guild, data?: RawGuildChannelData, client?: Client<true>, immediatePatch?: boolean);
  private memberPermissions(member: GuildMember, checkAdmin: boolean): Readonly<PermissionsBitField>;
  private rolePermissions(role: Role, checkAdmin: boolean): Readonly<PermissionsBitField>;
  public get createdAt(): Date;
  public get createdTimestamp(): number;
  public get deletable(): boolean;
  public flags: Readonly<ChannelFlagsBitField>;
  public guild: Guild;
  public guildId: Snowflake;
  public get manageable(): boolean;
  public get members(): Collection<Snowflake, GuildMember>;
  public name: string;
  public get parent(): CategoryChannel | null;
  public parentId: Snowflake | null;
  public permissionOverwrites: PermissionOverwriteManager;
  public get permissionsLocked(): boolean | null;
  public get position(): number;
  public rawPosition: number;
  public type: Exclude<ChannelType, ChannelType.DM | ChannelType.GroupDM>;
  public get viewable(): boolean;
  public clone(options?: GuildChannelCloneOptions): Promise<this>;
  public delete(reason?: string): Promise<this>;
  public edit(data: GuildChannelEditOptions): Promise<this>;
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
  public toString(): ChannelMention;
}

export class GuildEmoji extends BaseGuildEmoji {
  private constructor(client: Client<true>, data: RawGuildEmojiData, guild: Guild);
  private _roles: Snowflake[];

  public get deletable(): boolean;
  public guild: Guild;
  public author: User | null;
  public get roles(): GuildEmojiRoleManager;
  public get url(): string;
  public delete(reason?: string): Promise<GuildEmoji>;
  public edit(data: GuildEmojiEditData): Promise<GuildEmoji>;
  public equals(other: GuildEmoji | unknown): boolean;
  public fetchAuthor(): Promise<User>;
  public setName(name: string, reason?: string): Promise<GuildEmoji>;
}

export class GuildMember extends PartialTextBasedChannel(Base) {
  private constructor(client: Client<true>, data: RawGuildMemberData, guild: Guild);
  public avatar: string | null;
  public get bannable(): boolean;
  public get dmChannel(): DMChannel | null;
  public get displayColor(): number;
  public get displayHexColor(): HexColorString;
  public get displayName(): string;
  public guild: Guild;
  public get id(): Snowflake;
  public pending: boolean;
  public get communicationDisabledUntil(): Date | null;
  public communicationDisabledUntilTimestamp: number | null;
  public get joinedAt(): Date | null;
  public joinedTimestamp: number | null;
  public get kickable(): boolean;
  public get manageable(): boolean;
  public get moderatable(): boolean;
  public nickname: string | null;
  public get partial(): false;
  public get permissions(): Readonly<PermissionsBitField>;
  public get premiumSince(): Date | null;
  public premiumSinceTimestamp: number | null;
  public get presence(): Presence | null;
  public get roles(): GuildMemberRoleManager;
  public user: User;
  public get voice(): VoiceState;
  public avatarURL(options?: ImageURLOptions): string | null;
  public ban(options?: BanOptions): Promise<GuildMember>;
  public disableCommunicationUntil(timeout: DateResolvable | null, reason?: string): Promise<GuildMember>;
  public timeout(timeout: number | null, reason?: string): Promise<GuildMember>;
  public fetch(force?: boolean): Promise<GuildMember>;
  public createDM(force?: boolean): Promise<DMChannel>;
  public deleteDM(): Promise<DMChannel>;
  public displayAvatarURL(options?: ImageURLOptions): string;
  public edit(data: GuildMemberEditData): Promise<GuildMember>;
  public isCommunicationDisabled(): this is GuildMember & {
    communicationDisabledUntilTimestamp: number;
    readonly communicationDisabledUntil: Date;
  };
  public kick(reason?: string): Promise<GuildMember>;
  public permissionsIn(channel: GuildChannelResolvable): Readonly<PermissionsBitField>;
  public setNickname(nickname: string | null, reason?: string): Promise<GuildMember>;
  public toJSON(): unknown;
  public toString(): UserMention;
  public valueOf(): string;
}

export class GuildPreview extends Base {
  private constructor(client: Client<true>, data: RawGuildPreviewData);
  public approximateMemberCount: number;
  public approximatePresenceCount: number;
  public get createdAt(): Date;
  public get createdTimestamp(): number;
  public description: string | null;
  public discoverySplash: string | null;
  public emojis: Collection<Snowflake, GuildPreviewEmoji>;
  public stickers: Collection<Snowflake, Sticker>;
  public features: `${GuildFeature}`[];
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
  private constructor(client: Client<true>, data: RawGuildScheduledEventData);
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
  public entityMetadata: GuildScheduledEventEntityMetadata | null;
  public userCount: number | null;
  public creator: User | null;
  public get createdTimestamp(): number;
  public get createdAt(): Date;
  public get scheduledStartAt(): Date | null;
  public get scheduledEndAt(): Date | null;
  public get channel(): VoiceChannel | StageChannel | null;
  public get guild(): Guild | null;
  public get url(): string;
  public image: string | null;
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
  private constructor(client: Client<true>, data: RawGuildTemplateData);
  public createdTimestamp: number;
  public updatedTimestamp: number;
  public get url(): string;
  public code: string;
  public name: string;
  public description: string | null;
  public usageCount: number;
  public creator: User;
  public creatorId: Snowflake;
  public get createdAt(): Date;
  public get updatedAt(): Date;
  public get guild(): Guild | null;
  public guildId: Snowflake;
  public serializedGuild: APITemplateSerializedSourceGuild;
  public unSynced: boolean | null;
  public createGuild(name: string, icon?: BufferResolvable | Base64Resolvable): Promise<Guild>;
  public delete(): Promise<GuildTemplate>;
  public edit(options?: EditGuildTemplateOptions): Promise<GuildTemplate>;
  public sync(): Promise<GuildTemplate>;
  public static GuildTemplatesPattern: RegExp;
}

export class GuildPreviewEmoji extends BaseGuildEmoji {
  private constructor(client: Client<true>, data: RawGuildEmojiData, guild: GuildPreview);
  public guild: GuildPreview;
  public roles: Snowflake[];
}

export class Integration extends Base {
  private constructor(client: Client<true>, data: RawIntegrationData, guild: Guild);
  public account: IntegrationAccount;
  public application: IntegrationApplication | null;
  public enabled: boolean | null;
  public expireBehavior: IntegrationExpireBehavior | null;
  public expireGracePeriod: number | null;
  public guild: Guild;
  public id: Snowflake | string;
  public name: string;
  public role: Role | null;
  public enableEmoticons: boolean | null;
  public get roles(): Collection<Snowflake, Role>;
  public scopes: OAuth2Scopes[];
  public get syncedAt(): Date | null;
  public syncedTimestamp: number | null;
  public syncing: boolean | null;
  public type: IntegrationType;
  public user: User | null;
  public subscriberCount: number | null;
  public revoked: boolean | null;
  public delete(reason?: string): Promise<Integration>;
}

export class IntegrationApplication extends Application {
  private constructor(client: Client<true>, data: RawIntegrationApplicationData);
  public bot: User | null;
  public termsOfServiceURL: string | null;
  public privacyPolicyURL: string | null;
  public rpcOrigins: string[];
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

export type Interaction<Cached extends CacheType = CacheType> =
  | ChatInputCommandInteraction<Cached>
  | MessageContextMenuCommandInteraction<Cached>
  | UserContextMenuCommandInteraction<Cached>
  | AnySelectMenuInteraction<Cached>
  | ButtonInteraction<Cached>
  | AutocompleteInteraction<Cached>
  | ModalSubmitInteraction<Cached>;

export type RepliableInteraction<Cached extends CacheType = CacheType> = Exclude<
  Interaction<Cached>,
  AutocompleteInteraction<Cached>
>;

export class BaseInteraction<Cached extends CacheType = CacheType> extends Base {
  // This a technique used to brand different cached types. Or else we'll get `never` errors on typeguard checks.
  private readonly _cacheType: Cached;
  protected constructor(client: Client<true>, data: RawInteractionData);
  public applicationId: Snowflake;
  public get channel(): CacheTypeReducer<
    Cached,
    GuildTextBasedChannel | null,
    GuildTextBasedChannel | null,
    GuildTextBasedChannel | null,
    TextBasedChannel | null
  >;
  public channelId: Snowflake | null;
  public get createdAt(): Date;
  public get createdTimestamp(): number;
  public get guild(): CacheTypeReducer<Cached, Guild, null>;
  public guildId: CacheTypeReducer<Cached, Snowflake>;
  public id: Snowflake;
  public member: CacheTypeReducer<Cached, GuildMember, APIInteractionGuildMember>;
  public readonly token: string;
  public type: InteractionType;
  public user: User;
  public version: number;
  public appPermissions: Readonly<PermissionsBitField> | null;
  public memberPermissions: CacheTypeReducer<Cached, Readonly<PermissionsBitField>>;
  public locale: Locale;
  public guildLocale: CacheTypeReducer<Cached, Locale>;
  public inGuild(): this is BaseInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is BaseInteraction<'cached'>;
  public inRawGuild(): this is BaseInteraction<'raw'>;
  public isButton(): this is ButtonInteraction<Cached>;
  public isAutocomplete(): this is AutocompleteInteraction<Cached>;
  public isChatInputCommand(): this is ChatInputCommandInteraction<Cached>;
  public isCommand(): this is CommandInteraction<Cached>;
  public isContextMenuCommand(): this is ContextMenuCommandInteraction<Cached>;
  public isMessageComponent(): this is MessageComponentInteraction<Cached>;
  public isMessageContextMenuCommand(): this is MessageContextMenuCommandInteraction<Cached>;
  public isModalSubmit(): this is ModalSubmitInteraction<Cached>;
  public isUserContextMenuCommand(): this is UserContextMenuCommandInteraction<Cached>;
  /** @deprecated Use {@link BaseInteraction#isStringSelectMenu} instead */
  public isSelectMenu(): this is StringSelectMenuInteraction<Cached>;
  public isAnySelectMenu(): this is AnySelectMenuInteraction<Cached>;
  public isStringSelectMenu(): this is StringSelectMenuInteraction<Cached>;
  public isUserSelectMenu(): this is UserSelectMenuInteraction<Cached>;
  public isRoleSelectMenu(): this is RoleSelectMenuInteraction<Cached>;
  public isMentionableSelectMenu(): this is MentionableSelectMenuInteraction<Cached>;
  public isChannelSelectMenu(): this is ChannelSelectMenuInteraction<Cached>;
  public isRepliable(): this is RepliableInteraction<Cached>;
}

export class InteractionCollector<T extends CollectedInteraction> extends Collector<
  Snowflake,
  T,
  [Collection<Snowflake, T>]
> {
  public constructor(client: Client<true>, options?: InteractionCollectorOptions<T>);
  private _handleMessageDeletion(message: Message): void;
  private _handleChannelDeletion(channel: NonThreadGuildBasedChannel): void;
  private _handleGuildDeletion(guild: Guild): void;

  public channelId: Snowflake | null;
  public messageInteractionId: Snowflake | null;
  public componentType: ComponentType | null;
  public guildId: Snowflake | null;
  public interactionType: InteractionType | null;
  public messageId: Snowflake | null;
  public options: InteractionCollectorOptions<T>;
  public total: number;
  public users: Collection<Snowflake, User>;

  public collect(interaction: Interaction): Snowflake;
  public empty(): void;
  public dispose(interaction: Interaction): Snowflake;
  public on(event: 'collect' | 'dispose' | 'ignore', listener: (interaction: T) => Awaitable<void>): this;
  public on(event: 'end', listener: (collected: Collection<Snowflake, T>, reason: string) => Awaitable<void>): this;
  public on(event: string, listener: (...args: any[]) => Awaitable<void>): this;

  public once(event: 'collect' | 'dispose' | 'ignore', listener: (interaction: T) => Awaitable<void>): this;
  public once(event: 'end', listener: (collected: Collection<Snowflake, T>, reason: string) => Awaitable<void>): this;
  public once(event: string, listener: (...args: any[]) => Awaitable<void>): this;
}

export class InteractionWebhook extends PartialWebhookMixin() {
  public constructor(client: Client<true>, id: Snowflake, token: string);
  public token: string;
  public send(options: string | MessagePayload | InteractionReplyOptions): Promise<Message>;
  public editMessage(
    message: MessageResolvable | '@original',
    options: string | MessagePayload | WebhookEditMessageOptions,
  ): Promise<Message>;
  public fetchMessage(message: Snowflake | '@original'): Promise<Message>;
}

export class Invite extends Base {
  private constructor(client: Client<true>, data: RawInviteData);
  public channel: NonThreadGuildBasedChannel | PartialGroupDMChannel | null;
  public channelId: Snowflake | null;
  public code: string;
  public get deletable(): boolean;
  public get createdAt(): Date | null;
  public createdTimestamp: number | null;
  public get expiresAt(): Date | null;
  public get expiresTimestamp(): number | null;
  public guild: InviteGuild | Guild | null;
  public get inviter(): User | null;
  public inviterId: Snowflake | null;
  public maxAge: number | null;
  public maxUses: number | null;
  public memberCount: number;
  public presenceCount: number;
  public targetApplication: IntegrationApplication | null;
  public targetUser: User | null;
  public targetType: InviteTargetType | null;
  public temporary: boolean | null;
  public get url(): string;
  public uses: number | null;
  public delete(reason?: string): Promise<Invite>;
  public toJSON(): unknown;
  public toString(): string;
  public static InvitesPattern: RegExp;
  /** @deprecated */
  public stageInstance: InviteStageInstance | null;
  public guildScheduledEvent: GuildScheduledEvent | null;
}

/** @deprecated */
export class InviteStageInstance extends Base {
  private constructor(client: Client<true>, data: RawInviteStageInstance, channelId: Snowflake, guildId: Snowflake);
  public channelId: Snowflake;
  public guildId: Snowflake;
  public members: Collection<Snowflake, GuildMember>;
  public topic: string;
  public participantCount: number;
  public speakerCount: number;
  public get channel(): StageChannel | null;
  public get guild(): Guild | null;
}

export class InviteGuild extends AnonymousGuild {
  private constructor(client: Client<true>, data: RawInviteGuildData);
  public welcomeScreen: WelcomeScreen | null;
}

export class LimitedCollection<K, V> extends Collection<K, V> {
  public constructor(options?: LimitedCollectionOptions<K, V>, iterable?: Iterable<readonly [K, V]>);
  public maxSize: number;
  public keepOverLimit: ((value: V, key: K, collection: this) => boolean) | null;
}

export type MessageComponentType = Exclude<ComponentType, ComponentType.TextInput | ComponentType.ActionRow>;

export type MessageCollectorOptionsParams<T extends MessageComponentType, Cached extends boolean = boolean> =
  | {
      componentType?: T;
    } & MessageComponentCollectorOptions<MappedInteractionTypes<Cached>[T]>;

export type MessageChannelCollectorOptionsParams<T extends MessageComponentType, Cached extends boolean = boolean> =
  | {
      componentType?: T;
    } & MessageChannelComponentCollectorOptions<MappedInteractionTypes<Cached>[T]>;

export type AwaitMessageCollectorOptionsParams<T extends MessageComponentType, Cached extends boolean = boolean> =
  | { componentType?: T } & Pick<
      InteractionCollectorOptions<MappedInteractionTypes<Cached>[T]>,
      keyof AwaitMessageComponentOptions<any>
    >;

export interface StringMappedInteractionTypes<Cached extends CacheType = CacheType> {
  Button: ButtonInteraction<Cached>;
  StringSelectMenu: StringSelectMenuInteraction<Cached>;
  UserSelectMenu: UserSelectMenuInteraction<Cached>;
  RoleSelectMenu: RoleSelectMenuInteraction<Cached>;
  MentionableSelectMenu: MentionableSelectMenuInteraction<Cached>;
  ChannelSelectMenu: ChannelSelectMenuInteraction<Cached>;
  ActionRow: MessageComponentInteraction<Cached>;
}

export type WrapBooleanCache<T extends boolean> = If<T, 'cached', CacheType>;

export interface MappedInteractionTypes<Cached extends boolean = boolean> {
  [ComponentType.Button]: ButtonInteraction<WrapBooleanCache<Cached>>;
  [ComponentType.StringSelect]: StringSelectMenuInteraction<WrapBooleanCache<Cached>>;
  [ComponentType.UserSelect]: UserSelectMenuInteraction<WrapBooleanCache<Cached>>;
  [ComponentType.RoleSelect]: RoleSelectMenuInteraction<WrapBooleanCache<Cached>>;
  [ComponentType.MentionableSelect]: MentionableSelectMenuInteraction<WrapBooleanCache<Cached>>;
  [ComponentType.ChannelSelect]: ChannelSelectMenuInteraction<WrapBooleanCache<Cached>>;
}

export class Message<InGuild extends boolean = boolean> extends Base {
  private readonly _cacheType: InGuild;
  private constructor(client: Client<true>, data: RawMessageData);
  private _patch(data: RawPartialMessageData | RawMessageData): void;

  public activity: MessageActivity | null;
  public applicationId: Snowflake | null;
  public attachments: Collection<Snowflake, Attachment>;
  public author: User;
  public get bulkDeletable(): boolean;
  public get channel(): If<InGuild, GuildTextBasedChannel, TextBasedChannel>;
  public channelId: Snowflake;
  public get cleanContent(): string;
  public components: ActionRow<MessageActionRowComponent>[];
  public content: string;
  public get createdAt(): Date;
  public createdTimestamp: number;
  public get crosspostable(): boolean;
  public get deletable(): boolean;
  public get editable(): boolean;
  public get editedAt(): Date | null;
  public editedTimestamp: number | null;
  public embeds: Embed[];
  public groupActivityApplication: ClientApplication | null;
  public guildId: If<InGuild, Snowflake>;
  public get guild(): If<InGuild, Guild>;
  public get hasThread(): boolean;
  public id: Snowflake;
  public interaction: MessageInteraction | null;
  public get member(): GuildMember | null;
  public mentions: MessageMentions;
  public nonce: string | number | null;
  public get partial(): false;
  public get pinnable(): boolean;
  public pinned: boolean;
  public reactions: ReactionManager;
  public stickers: Collection<Snowflake, Sticker>;
  public position: number | null;
  public system: boolean;
  public get thread(): AnyThreadChannel | null;
  public tts: boolean;
  public type: MessageType;
  public get url(): string;
  public webhookId: Snowflake | null;
  public flags: Readonly<MessageFlagsBitField>;
  public reference: MessageReference | null;
  public awaitMessageComponent<T extends MessageComponentType>(
    options?: AwaitMessageCollectorOptionsParams<T, InGuild>,
  ): Promise<MappedInteractionTypes<InGuild>[T]>;
  public awaitReactions(options?: AwaitReactionsOptions): Promise<Collection<Snowflake | string, MessageReaction>>;
  public createReactionCollector(options?: ReactionCollectorOptions): ReactionCollector;
  public createMessageComponentCollector<T extends MessageComponentType>(
    options?: MessageCollectorOptionsParams<T, InGuild>,
  ): InteractionCollector<MappedInteractionTypes<InGuild>[T]>;
  public delete(): Promise<Message<InGuild>>;
  public edit(content: string | MessageEditOptions | MessagePayload): Promise<Message<InGuild>>;
  public equals(message: Message, rawData: unknown): boolean;
  public fetchReference(): Promise<Message<InGuild>>;
  public fetchWebhook(): Promise<Webhook>;
  public crosspost(): Promise<Message<InGuild>>;
  public fetch(force?: boolean): Promise<Message<InGuild>>;
  public pin(reason?: string): Promise<Message<InGuild>>;
  public react(emoji: EmojiIdentifierResolvable): Promise<MessageReaction>;
  public removeAttachments(): Promise<Message<InGuild>>;
  public reply(options: string | MessagePayload | MessageReplyOptions): Promise<Message<InGuild>>;
  public resolveComponent(customId: string): MessageActionRowComponent | null;
  public startThread(options: StartThreadOptions): Promise<AnyThreadChannel>;
  public suppressEmbeds(suppress?: boolean): Promise<Message<InGuild>>;
  public toJSON(): unknown;
  public toString(): string;
  public unpin(reason?: string): Promise<Message<InGuild>>;
  public inGuild(): this is Message<true>;
}

export class AttachmentBuilder {
  public constructor(attachment: BufferResolvable | Stream, data?: AttachmentData);
  public attachment: BufferResolvable | Stream;
  public description: string | null;
  public name: string | null;
  public get spoiler(): boolean;
  public setDescription(description: string): this;
  public setFile(attachment: BufferResolvable | Stream, name?: string): this;
  public setName(name: string): this;
  public setSpoiler(spoiler?: boolean): this;
  public toJSON(): unknown;
  public static from(other: JSONEncodable<AttachmentPayload>): AttachmentBuilder;
}

export class Attachment {
  private constructor(data: APIAttachment);
  public attachment: BufferResolvable | Stream;
  public contentType: string | null;
  public description: string | null;
  public ephemeral: boolean;
  public height: number | null;
  public id: Snowflake;
  public name: string | null;
  public proxyURL: string;
  public size: number;
  public get spoiler(): boolean;
  public url: string;
  public width: number | null;
  public toJSON(): unknown;
}

export class MessageCollector extends Collector<Snowflake, Message, [Collection<Snowflake, Message>]> {
  public constructor(channel: TextBasedChannel, options?: MessageCollectorOptions);
  private _handleChannelDeletion(channel: NonThreadGuildBasedChannel): void;
  private _handleGuildDeletion(guild: Guild): void;

  public channel: TextBasedChannel;
  public options: MessageCollectorOptions;
  public received: number;

  public collect(message: Message): Snowflake | null;
  public dispose(message: Message): Snowflake | null;
}

export class MessageComponentInteraction<Cached extends CacheType = CacheType> extends BaseInteraction<Cached> {
  protected constructor(client: Client<true>, data: RawMessageComponentInteractionData);
  public type: InteractionType.MessageComponent;
  public get component(): CacheTypeReducer<
    Cached,
    MessageActionRowComponent,
    Exclude<APIMessageComponent, APIActionRowComponent<APIMessageActionRowComponent>>,
    MessageActionRowComponent | Exclude<APIMessageComponent, APIActionRowComponent<APIMessageActionRowComponent>>,
    MessageActionRowComponent | Exclude<APIMessageComponent, APIActionRowComponent<APIMessageActionRowComponent>>
  >;
  public componentType: Exclude<ComponentType, ComponentType.ActionRow | ComponentType.TextInput>;
  public customId: string;
  public channelId: Snowflake;
  public deferred: boolean;
  public ephemeral: boolean | null;
  public message: Message<BooleanCache<Cached>>;
  public replied: boolean;
  public webhook: InteractionWebhook;
  public inGuild(): this is MessageComponentInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is MessageComponentInteraction<'cached'>;
  public inRawGuild(): this is MessageComponentInteraction<'raw'>;
  public deferReply(
    options: InteractionDeferReplyOptions & { fetchResponse: true },
  ): Promise<Message<BooleanCache<Cached>>>;
  public deferReply(options?: InteractionDeferReplyOptions): Promise<InteractionResponse<BooleanCache<Cached>>>;
  public deferMessageUpdate(
    options: InteractionDeferMessageUpdateOptions & { fetchResponse: true },
  ): Promise<Message<BooleanCache<Cached>>>;
  public deferMessageUpdate(
    options?: InteractionDeferMessageUpdateOptions,
  ): Promise<InteractionResponse<BooleanCache<Cached>>>;
  public deleteResponse(message?: MessageResolvable | '@original'): Promise<void>;
  public editResponse(
    options: string | MessagePayload | InteractionEditResponseOptions,
  ): Promise<Message<BooleanCache<Cached>>>;
  public fetchResponse(message?: Snowflake | '@original'): Promise<Message<BooleanCache<Cached>>>;
  public followUp(options: string | MessagePayload | InteractionReplyOptions): Promise<Message<BooleanCache<Cached>>>;
  public reply(options: InteractionReplyOptions & { fetchResponse: true }): Promise<Message<BooleanCache<Cached>>>;
  public reply(
    options: string | MessagePayload | InteractionReplyOptions,
  ): Promise<InteractionResponse<BooleanCache<Cached>>>;
  public updateMessage(
    options: InteractionUpdateMessageOptions & { fetchResponse: true },
  ): Promise<Message<BooleanCache<Cached>>>;
  public updateMessage(
    options: string | MessagePayload | InteractionUpdateMessageOptions,
  ): Promise<InteractionResponse<BooleanCache<Cached>>>;
  public showModal(
    modal:
      | JSONEncodable<APIModalInteractionResponseCallbackData>
      | ModalComponentData
      | APIModalInteractionResponseCallbackData,
  ): Promise<void>;
  public awaitModalSubmit(
    options: AwaitModalSubmitOptions<ModalSubmitInteraction>,
  ): Promise<ModalSubmitInteraction<Cached>>;
}

export class MessageContextMenuCommandInteraction<
  Cached extends CacheType = CacheType,
> extends ContextMenuCommandInteraction<Cached> {
  public commandType: ApplicationCommandType.Message;
  public get targetMessage(): NonNullable<CommandInteractionOption<Cached>['message']>;
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
  private _channels: Collection<Snowflake, Channel> | null;
  private readonly _content: string;
  private _members: Collection<Snowflake, GuildMember> | null;
  private _parsedUsers: Collection<Snowflake, User> | null;

  public get channels(): Collection<Snowflake, Channel>;
  public readonly client: Client;
  public everyone: boolean;
  public readonly guild: Guild;
  public has(data: UserResolvable | RoleResolvable | ChannelResolvable, options?: MessageMentionsHasOptions): boolean;
  public get members(): Collection<Snowflake, GuildMember> | null;
  public get parsedUsers(): Collection<Snowflake, User>;
  public repliedUser: User | null;
  public roles: Collection<Snowflake, Role>;
  public users: Collection<Snowflake, User>;
  public crosspostedChannels: Collection<Snowflake, CrosspostedChannel>;
  public toJSON(): unknown;

  private static GlobalChannelsPattern: RegExp;
  private static GlobalUsersPattern: RegExp;
  public static ChannelsPattern: typeof FormattingPatterns.Channel;
  public static EveryonePattern: RegExp;
  public static RolesPattern: typeof FormattingPatterns.Role;
  public static UsersPattern: typeof FormattingPatterns.User;
}

export type MessagePayloadOption =
  | MessageCreateOptions
  | MessageEditOptions
  | WebhookCreateMessageOptions
  | WebhookEditMessageOptions
  | InteractionReplyOptions
  | InteractionUpdateMessageOptions;

export class MessagePayload {
  public constructor(target: MessageTarget, options: MessagePayloadOption);
  public body: RawMessagePayloadData | null;
  public get isUser(): boolean;
  public get isWebhook(): boolean;
  public get isMessage(): boolean;
  public get isMessageManager(): boolean;
  public get isInteraction(): boolean;
  public files: RawFile[] | null;
  public options: MessagePayloadOption;
  public target: MessageTarget;

  public static create(
    target: MessageTarget,
    options: string | MessagePayloadOption,
    extra?: MessagePayloadOption,
  ): MessagePayload;
  public static resolveFile(
    fileLike: BufferResolvable | Stream | AttachmentPayload | JSONEncodable<AttachmentPayload>,
  ): Promise<RawFile>;

  public makeContent(): string | undefined;
  public resolveBody(): this;
  public resolveFiles(): Promise<this>;
}

export class MessageReaction {
  private constructor(client: Client<true>, data: RawMessageReactionData, message: Message);
  private _emoji: GuildEmoji | ReactionEmoji;

  public readonly client: Client<true>;
  public count: number;
  public get emoji(): GuildEmoji | ReactionEmoji;
  public me: boolean;
  public message: Message | PartialMessage;
  public get partial(): false;
  public users: ReactionUserManager;
  public react(): Promise<MessageReaction>;
  public remove(): Promise<MessageReaction>;
  public fetch(): Promise<MessageReaction>;
  public toJSON(): unknown;
}

export interface ModalComponentData {
  customId: string;
  title: string;
  components: (
    | JSONEncodable<APIActionRowComponent<APIModalActionRowComponent>>
    | ActionRowData<ModalActionRowComponentData>
  )[];
}

export interface BaseModalData {
  customId: string;
  type: ComponentType;
}

export interface TextInputModalData extends BaseModalData {
  type: ComponentType.TextInput;
  value: string;
}

export interface ActionRowModalData {
  type: ComponentType.ActionRow;
  components: ModalData[];
}

export type ModalData = TextInputModalData | ActionRowModalData;

export class ModalSubmitFields {
  constructor(components: ModalActionRowComponent[][]);
  public components: ActionRow<ModalActionRowComponent>;
  public fields: Collection<string, ModalActionRowComponent>;
  public getField<T extends ComponentType>(customId: string, type: T): { type: T } & ModalData;
  public getField(customId: string, type?: ComponentType): ModalData;
  public getTextInputValue(customId: string): string;
}

export interface ModalMessageModalSubmitInteraction<Cached extends CacheType = CacheType>
  extends ModalSubmitInteraction<Cached> {
  message: Message<BooleanCache<Cached>>;
  channelId: Snowflake;
  updateMessage(options: InteractionUpdateMessageOptions & { fetchResponse: true }): Promise<Message>;
  updateMessage(
    options: string | MessagePayload | InteractionUpdateMessageOptions,
  ): Promise<InteractionResponse<BooleanCache<Cached>>>;
  inGuild(): this is ModalMessageModalSubmitInteraction<'raw' | 'cached'>;
  inCachedGuild(): this is ModalMessageModalSubmitInteraction<'cached'>;
  inRawGuild(): this is ModalMessageModalSubmitInteraction<'raw'>;
}

export class ModalSubmitInteraction<Cached extends CacheType = CacheType> extends BaseInteraction<Cached> {
  private constructor(client: Client<true>, data: APIModalSubmitInteraction);
  public type: InteractionType.ModalSubmit;
  public readonly customId: string;
  public readonly components: ActionRowModalData[];
  public readonly fields: ModalSubmitFields;
  public deferred: boolean;
  public ephemeral: boolean | null;
  public message: Message<BooleanCache<Cached>> | null;
  public replied: boolean;
  public readonly webhook: InteractionWebhook;
  public reply(options: InteractionReplyOptions & { fetchResponse: true }): Promise<Message<BooleanCache<Cached>>>;
  public reply(
    options: string | MessagePayload | InteractionReplyOptions,
  ): Promise<InteractionResponse<BooleanCache<Cached>>>;
  public deleteResponse(message?: MessageResolvable | '@original'): Promise<void>;
  public editResponse(
    options: string | MessagePayload | InteractionEditResponseOptions,
  ): Promise<Message<BooleanCache<Cached>>>;
  public deferReply(
    options: InteractionDeferReplyOptions & { fetchResponse: true },
  ): Promise<Message<BooleanCache<Cached>>>;
  public deferReply(options?: InteractionDeferReplyOptions): Promise<InteractionResponse<BooleanCache<Cached>>>;
  public fetchResponse(message?: Snowflake | '@original'): Promise<Message<BooleanCache<Cached>>>;
  public followUp(options: string | MessagePayload | InteractionReplyOptions): Promise<Message<BooleanCache<Cached>>>;
  public deferMessageUpdate(
    options: InteractionDeferMessageUpdateOptions & { fetchResponse: true },
  ): Promise<Message<BooleanCache<Cached>>>;
  public deferMessageUpdate(
    options?: InteractionDeferMessageUpdateOptions,
  ): Promise<InteractionResponse<BooleanCache<Cached>>>;
  public inGuild(): this is ModalSubmitInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is ModalSubmitInteraction<'cached'>;
  public inRawGuild(): this is ModalSubmitInteraction<'raw'>;
  public isFromMessage(): this is ModalMessageModalSubmitInteraction<Cached>;
}

export class NewsChannel extends BaseGuildTextChannel {
  public threads: GuildTextThreadManager<AllowedThreadTypeForNewsChannel>;
  public type: ChannelType.GuildAnnouncement;
  public addFollower(channel: TextChannelResolvable, reason?: string): Promise<NewsChannel>;
}

export class OAuth2Guild extends BaseGuild {
  private constructor(client: Client<true>, data: RawOAuth2GuildData);
  public owner: boolean;
  public permissions: Readonly<PermissionsBitField>;
}

export class PartialGroupDMChannel extends BaseChannel {
  private constructor(client: Client<true>, data: RawPartialGroupDMChannelData);
  public type: ChannelType.GroupDM;
  public flags: null;
  public name: string | null;
  public icon: string | null;
  public recipients: PartialRecipient[];
  public iconURL(options?: ImageURLOptions): string | null;
  public toString(): ChannelMention;
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

export class ForumChannel extends TextBasedChannelMixin(GuildChannel, true, [
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
  public type: ChannelType.GuildForum;
  public threads: GuildForumThreadManager;
  public availableTags: GuildForumTag[];
  public defaultReactionEmoji: DefaultReactionEmoji | null;
  public defaultThreadRateLimitPerUser: number | null;
  public rateLimitPerUser: number | null;
  public defaultAutoArchiveDuration: ThreadAutoArchiveDuration | null;
  public nsfw: boolean;
  public topic: string | null;
  public defaultSortOrder: SortOrderType | null;

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
}

export class PermissionOverwrites extends Base {
  private constructor(client: Client<true>, data: RawPermissionOverwriteData, channel: NonThreadGuildBasedChannel);
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
  protected constructor(client: Client<true>, data?: RawPresenceData);
  public activities: Activity[];
  public clientStatus: ClientPresenceStatusData | null;
  public guild: Guild | null;
  public get member(): GuildMember | null;
  public status: PresenceStatus;
  public get user(): User | null;
  public userId: Snowflake;
  public equals(presence: Presence): boolean;
}

export class ReactionCollector extends Collector<Snowflake | string, MessageReaction, [User]> {
  public constructor(message: Message, options?: ReactionCollectorOptions);
  private _handleChannelDeletion(channel: NonThreadGuildBasedChannel): void;
  private _handleGuildDeletion(guild: Guild): void;
  private _handleMessageDeletion(message: Message): void;

  public message: Message;
  public options: ReactionCollectorOptions;
  public total: number;
  public users: Collection<Snowflake, User>;

  public static key(reaction: MessageReaction): Snowflake | string;

  public collect(reaction: MessageReaction, user: User): Snowflake | string | null;
  public dispose(reaction: MessageReaction, user: User): Snowflake | string | null;
  public empty(): void;

  public on(
    event: 'collect' | 'dispose' | 'remove' | 'ignore',
    listener: (reaction: MessageReaction, user: User) => void,
  ): this;
  public on(event: 'end', listener: (collected: Collection<Snowflake, MessageReaction>, reason: string) => void): this;
  public on(event: string, listener: (...args: any[]) => void): this;

  public once(
    event: 'collect' | 'dispose' | 'remove' | 'ignore',
    listener: (reaction: MessageReaction, user: User) => void,
  ): this;
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
  private constructor(client: Client<true>, data: RawRoleData, guild: Guild);
  public color: number;
  public get createdAt(): Date;
  public get createdTimestamp(): number;
  public get editable(): boolean;
  public guild: Guild;
  public get hexColor(): HexColorString;
  public hoist: boolean;
  public id: Snowflake;
  public managed: boolean;
  public get members(): Collection<Snowflake, GuildMember>;
  public mentionable: boolean;
  public name: string;
  public permissions: Readonly<PermissionsBitField>;
  public get position(): number;
  public rawPosition: number;
  public tags: RoleTagData | null;
  public comparePositionTo(role: RoleResolvable): number;
  public icon: string | null;
  public unicodeEmoji: string | null;
  public delete(reason?: string): Promise<Role>;
  public edit(data: EditRoleOptions): Promise<Role>;
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

export class StringSelectMenuInteraction<
  Cached extends CacheType = CacheType,
> extends MessageComponentInteraction<Cached> {
  public constructor(client: Client<true>, data: APIMessageStringSelectInteractionData);
  public get component(): CacheTypeReducer<
    Cached,
    StringSelectMenuComponent,
    APIStringSelectComponent,
    StringSelectMenuComponent | APIStringSelectComponent,
    StringSelectMenuComponent | APIStringSelectComponent
  >;
  public componentType: ComponentType.StringSelect;
  public values: string[];
  public inGuild(): this is StringSelectMenuInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is StringSelectMenuInteraction<'cached'>;
  public inRawGuild(): this is StringSelectMenuInteraction<'raw'>;
}

export {
  /** @deprecated Use {@link StringSelectMenuInteraction} instead */
  StringSelectMenuInteraction as SelectMenuInteraction,
};

export class UserSelectMenuInteraction<
  Cached extends CacheType = CacheType,
> extends MessageComponentInteraction<Cached> {
  public constructor(client: Client<true>, data: APIMessageUserSelectInteractionData);
  public get component(): CacheTypeReducer<
    Cached,
    UserSelectMenuComponent,
    APIUserSelectComponent,
    UserSelectMenuComponent | APIUserSelectComponent,
    UserSelectMenuComponent | APIUserSelectComponent
  >;
  public componentType: ComponentType.UserSelect;
  public users: Collection<Snowflake, User>;
  public members: Collection<Snowflake, CacheTypeReducer<Cached, GuildMember, APIGuildMember>>;
  public inGuild(): this is UserSelectMenuInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is UserSelectMenuInteraction<'cached'>;
  public inRawGuild(): this is UserSelectMenuInteraction<'raw'>;
}

export class RoleSelectMenuInteraction<
  Cached extends CacheType = CacheType,
> extends MessageComponentInteraction<Cached> {
  public constructor(client: Client<true>, data: APIMessageRoleSelectInteractionData);
  public get component(): CacheTypeReducer<
    Cached,
    RoleSelectMenuComponent,
    APIRoleSelectComponent,
    RoleSelectMenuComponent | APIRoleSelectComponent,
    RoleSelectMenuComponent | APIRoleSelectComponent
  >;
  public componentType: ComponentType.RoleSelect;
  public roles: Collection<Snowflake, CacheTypeReducer<Cached, Role, APIRole>>;
  public inGuild(): this is RoleSelectMenuInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is RoleSelectMenuInteraction<'cached'>;
  public inRawGuild(): this is RoleSelectMenuInteraction<'raw'>;
}

export class MentionableSelectMenuInteraction<
  Cached extends CacheType = CacheType,
> extends MessageComponentInteraction<Cached> {
  public constructor(client: Client<true>, data: APIMessageMentionableSelectInteractionData);
  public get component(): CacheTypeReducer<
    Cached,
    MentionableSelectMenuComponent,
    APIMentionableSelectComponent,
    MentionableSelectMenuComponent | APIMentionableSelectComponent,
    MentionableSelectMenuComponent | APIMentionableSelectComponent
  >;
  public componentType: ComponentType.MentionableSelect;
  public users: Collection<Snowflake, User>;
  public members: Collection<Snowflake, CacheTypeReducer<Cached, GuildMember, APIGuildMember>>;
  public roles: Collection<Snowflake, CacheTypeReducer<Cached, Role, APIRole>>;
  public inGuild(): this is MentionableSelectMenuInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is MentionableSelectMenuInteraction<'cached'>;
  public inRawGuild(): this is MentionableSelectMenuInteraction<'raw'>;
}

export class ChannelSelectMenuInteraction<
  Cached extends CacheType = CacheType,
> extends MessageComponentInteraction<Cached> {
  public constructor(client: Client<true>, data: APIMessageChannelSelectInteractionData);
  public get component(): CacheTypeReducer<
    Cached,
    ChannelSelectMenuComponent,
    APIChannelSelectComponent,
    ChannelSelectMenuComponent | APIChannelSelectComponent,
    ChannelSelectMenuComponent | APIChannelSelectComponent
  >;
  public componentType: ComponentType.ChannelSelect;
  public channels: Collection<Snowflake, CacheTypeReducer<Cached, Channel, APIChannel>>;
  public inGuild(): this is ChannelSelectMenuInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is ChannelSelectMenuInteraction<'cached'>;
  public inRawGuild(): this is ChannelSelectMenuInteraction<'raw'>;
}

// Ideally this should be named SelectMenuInteraction, but that's the name of the "old" StringSelectMenuInteraction, meaning
// the type name is reserved as a re-export to prevent a breaking change from being made, as such:
// TODO: Rename this to SelectMenuInteraction in the next major
export type AnySelectMenuInteraction<Cached extends CacheType = CacheType> =
  | StringSelectMenuInteraction<Cached>
  | UserSelectMenuInteraction<Cached>
  | RoleSelectMenuInteraction<Cached>
  | MentionableSelectMenuInteraction<Cached>
  | ChannelSelectMenuInteraction<Cached>;

export type SelectMenuType = APISelectMenuComponent['type'];

export interface ShardEventTypes {
  death: [process: ChildProcess | Worker];
  disconnect: [];
  error: [error: Error];
  message: [message: any];
  ready: [];
  reconnecting: [];
  spawn: [process: ChildProcess | Worker];
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
  public eval<T, P>(fn: (client: Client<true>, context: Serialized<P>) => T, context: P): Promise<T>;
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
  private constructor(client: Client<true>, mode: ShardingManagerMode);
  private _handleMessage(message: unknown): void;
  private _respond(type: string, message: unknown): void;
  private incrementMaxListeners(emitter: EventEmitter | ChildProcess): void;
  private decrementMaxListeners(emitter: EventEmitter | ChildProcess): void;

  public client: Client;
  public get count(): number;
  public get ids(): number[];
  public mode: ShardingManagerMode;
  public parentPort: MessagePort | null;
  public broadcastEval<T>(fn: (client: Client) => Awaitable<T>): Promise<Serialized<T>[]>;
  public broadcastEval<T>(fn: (client: Client) => Awaitable<T>, options: { shard: number }): Promise<Serialized<T>>;
  public broadcastEval<T, P>(
    fn: (client: Client<true>, context: Serialized<P>) => Awaitable<T>,
    options: { context: P },
  ): Promise<Serialized<T>[]>;
  public broadcastEval<T, P>(
    fn: (client: Client<true>, context: Serialized<P>) => Awaitable<T>,
    options: { context: P; shard: number },
  ): Promise<Serialized<T>>;
  public fetchClientValues(prop: string): Promise<unknown[]>;
  public fetchClientValues(prop: string, shard: number): Promise<unknown>;
  public respawnAll(options?: MultipleShardRespawnOptions): Promise<void>;
  public send(message: unknown): Promise<void>;

  public static singleton(client: Client<true>, mode: ShardingManagerMode): ShardClientUtil;
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
    fn: (client: Client<true>, context: Serialized<P>) => Awaitable<T>,
    options: { context: P },
  ): Promise<Serialized<T>[]>;
  public broadcastEval<T, P>(
    fn: (client: Client<true>, context: Serialized<P>) => Awaitable<T>,
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

export interface FetchRecommendedShardCountOptions {
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
  public get stageInstance(): StageInstance | null;
  public createStageInstance(options: StageInstanceCreateOptions): Promise<StageInstance>;
  public setTopic(topic: string): Promise<StageChannel>;
}

export class DirectoryChannel extends BaseChannel {
  public flags: Readonly<ChannelFlagsBitField>;
  public guild: InviteGuild;
  public guildId: Snowflake;
  public name: string;
}

export class StageInstance extends Base {
  private constructor(client: Client<true>, data: RawStageInstanceData, channel: StageChannel);
  public id: Snowflake;
  public guildId: Snowflake;
  public channelId: Snowflake;
  public topic: string;
  public privacyLevel: StageInstancePrivacyLevel;
  /** @deprecated See https://github.com/discord/discord-api-docs/pull/4296 for more information */
  public discoverableDisabled: boolean | null;
  public guildScheduledEventId?: Snowflake;
  public get channel(): StageChannel | null;
  public get guild(): Guild | null;
  public get guildScheduledEvent(): GuildScheduledEvent | null;
  public edit(options: StageInstanceEditOptions): Promise<StageInstance>;
  public delete(): Promise<StageInstance>;
  public setTopic(topic: string): Promise<StageInstance>;
  public get createdTimestamp(): number;
  public get createdAt(): Date;
}

export class Sticker extends Base {
  private constructor(client: Client<true>, data: RawStickerData);
  public get createdTimestamp(): number;
  public get createdAt(): Date;
  public available: boolean | null;
  public description: string | null;
  public format: StickerFormatType;
  public get guild(): Guild | null;
  public guildId: Snowflake | null;
  public id: Snowflake;
  public name: string;
  public packId: Snowflake | null;
  public get partial(): boolean;
  public sortValue: number | null;
  public tags: string | null;
  public type: StickerType | null;
  public user: User | null;
  public get url(): string;
  public fetch(): Promise<Sticker>;
  public fetchPack(): Promise<StickerPack | null>;
  public fetchUser(): Promise<User | null>;
  public edit(data?: GuildStickerEditData): Promise<Sticker>;
  public delete(reason?: string): Promise<Sticker>;
  public equals(other: Sticker | unknown): boolean;
}

export class StickerPack extends Base {
  private constructor(client: Client<true>, data: RawStickerPackData);
  public get createdTimestamp(): number;
  public get createdAt(): Date;
  public bannerId: Snowflake | null;
  public get coverSticker(): Sticker | null;
  public coverStickerId: Snowflake | null;
  public description: string;
  public id: Snowflake;
  public name: string;
  public skuId: Snowflake;
  public stickers: Collection<Snowflake, Sticker>;
  public bannerURL(options?: ImageURLOptions): string | null;
}

export class Sweepers {
  public constructor(client: Client<true>, options: SweeperOptions);
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

export type SystemChannelFlagsString = keyof typeof GuildSystemChannelFlags;

export class SystemChannelFlagsBitField extends BitField<SystemChannelFlagsString> {
  public static Flags: typeof GuildSystemChannelFlags;
  public static resolve(bit?: BitFieldResolvable<SystemChannelFlagsString, number>): number;
}

export class Team extends Base {
  private constructor(client: Client<true>, data: RawTeamData);
  public id: Snowflake;
  public name: string;
  public icon: string | null;
  public ownerId: Snowflake | null;
  public members: Collection<Snowflake, TeamMember>;
  public get owner(): TeamMember | null;
  public get createdAt(): Date;
  public get createdTimestamp(): number;

  public iconURL(options?: ImageURLOptions): string | null;
  public toJSON(): unknown;
  public toString(): string;
}

export class TeamMember extends Base {
  private constructor(team: Team, data: RawTeamMemberData);
  public team: Team;
  public get id(): Snowflake;
  public permissions: string[];
  public membershipState: TeamMemberMembershipState;
  public user: User;

  public toString(): UserMention;
}

export class TextChannel extends BaseGuildTextChannel {
  public rateLimitPerUser: number;
  public threads: GuildTextThreadManager<AllowedThreadTypeForTextChannel>;
  public type: ChannelType.GuildText;
}

export type AnyThreadChannel<Forum extends boolean = boolean> = PublicThreadChannel<Forum> | PrivateThreadChannel;

export interface PublicThreadChannel<Forum extends boolean = boolean> extends ThreadChannel<Forum> {
  type: ChannelType.PublicThread | ChannelType.AnnouncementThread;
}

export interface PrivateThreadChannel extends ThreadChannel<false> {
  get createdTimestamp(): number;
  get createdAt(): Date;
  type: ChannelType.PrivateThread;
}

export class ThreadChannel<Forum extends boolean = boolean> extends TextBasedChannelMixin(BaseChannel, true, [
  'fetchWebhooks',
  'createWebhook',
  'setNSFW',
]) {
  private constructor(guild: Guild, data?: RawThreadChannelData, client?: Client<true>, fromInteraction?: boolean);
  public archived: boolean | null;
  public get archivedAt(): Date | null;
  public archiveTimestamp: number | null;
  public get createdAt(): Date | null;
  private _createdTimestamp: number | null;
  public get createdTimestamp(): number | null;
  public autoArchiveDuration: ThreadAutoArchiveDuration | null;
  public get editable(): boolean;
  public flags: Readonly<ChannelFlagsBitField>;
  public guild: Guild;
  public guildId: Snowflake;
  public get guildMembers(): Collection<Snowflake, GuildMember>;
  public invitable: boolean | null;
  public get joinable(): boolean;
  public get joined(): boolean;
  public locked: boolean | null;
  public get manageable(): boolean;
  public get viewable(): boolean;
  public get sendable(): boolean;
  public memberCount: number | null;
  public messageCount: number | null;
  public appliedTags: Snowflake[];
  public totalMessageSent: number | null;
  public members: ThreadMemberManager;
  public name: string;
  public ownerId: Snowflake | null;
  public get parent(): If<Forum, ForumChannel, TextChannel | NewsChannel> | null;
  public parentId: Snowflake | null;
  public rateLimitPerUser: number | null;
  public type: ThreadChannelType;
  public get unarchivable(): boolean;
  public delete(reason?: string): Promise<this>;
  public edit(data: ThreadEditData): Promise<AnyThreadChannel>;
  public join(): Promise<AnyThreadChannel>;
  public leave(): Promise<AnyThreadChannel>;
  public permissionsFor(memberOrRole: GuildMember | Role, checkAdmin?: boolean): Readonly<PermissionsBitField>;
  public permissionsFor(
    memberOrRole: GuildMemberResolvable | RoleResolvable,
    checkAdmin?: boolean,
  ): Readonly<PermissionsBitField> | null;
  public fetchOwner(options?: BaseFetchOptions): Promise<ThreadMember | null>;
  public fetchStarterMessage(options?: BaseFetchOptions): Promise<Message<true> | null>;
  public setArchived(archived?: boolean, reason?: string): Promise<AnyThreadChannel>;
  public setAutoArchiveDuration(
    autoArchiveDuration: ThreadAutoArchiveDuration,
    reason?: string,
  ): Promise<AnyThreadChannel>;
  public setInvitable(invitable?: boolean, reason?: string): Promise<AnyThreadChannel>;
  public setLocked(locked?: boolean, reason?: string): Promise<AnyThreadChannel>;
  public setName(name: string, reason?: string): Promise<AnyThreadChannel>;
  public setAppliedTags(appliedTags: Snowflake[], reason?: string): Promise<ThreadChannel<true>>;
  public toString(): ChannelMention;
}

export class ThreadMember extends Base {
  private constructor(thread: ThreadChannel, data?: RawThreadMemberData);
  public flags: ThreadMemberFlagsBitField;
  public get guildMember(): GuildMember | null;
  public id: Snowflake;
  public get joinedAt(): Date | null;
  public joinedTimestamp: number | null;
  public get manageable(): boolean;
  public thread: AnyThreadChannel;
  public get user(): User | null;
  public get partial(): false;
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
  public user: User | PartialUser;
  public startedTimestamp: number;
  public get startedAt(): Date;
  public get guild(): Guild | null;
  public get member(): GuildMember | null;
  public inGuild(): this is this & {
    channel: TextChannel | NewsChannel | ThreadChannel;
    get guild(): Guild;
  };
}

export class User extends PartialTextBasedChannel(Base) {
  protected constructor(client: Client<true>, data: RawUserData);
  private _equals(user: APIUser): boolean;

  public accentColor: number | null | undefined;
  public avatar: string | null;
  public banner: string | null | undefined;
  public bot: boolean;
  public get createdAt(): Date;
  public get createdTimestamp(): number;
  public discriminator: string;
  public get defaultAvatarURL(): string;
  public get dmChannel(): DMChannel | null;
  public flags: Readonly<UserFlagsBitField> | null;
  public get hexAccentColor(): HexColorString | null | undefined;
  public id: Snowflake;
  public get partial(): false;
  public system: boolean;
  public get tag(): string;
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
  public commandType: ApplicationCommandType.User;
  public get targetUser(): User;
  public get targetMember(): CacheTypeReducer<Cached, GuildMember, APIInteractionGuildMember>;
  public inGuild(): this is UserContextMenuCommandInteraction<'raw' | 'cached'>;
  public inCachedGuild(): this is UserContextMenuCommandInteraction<'cached'>;
  public inRawGuild(): this is UserContextMenuCommandInteraction<'raw'>;
}

export type UserFlagsString = keyof typeof UserFlags;

export class UserFlagsBitField extends BitField<UserFlagsString> {
  public static Flags: typeof UserFlags;
  public static resolve(bit?: BitFieldResolvable<UserFlagsString, number>): number;
}

export function basename(path: string, ext?: string): string;
export function cleanContent(str: string, channel: TextBasedChannel): string;
export function discordSort<K, V extends { rawPosition: number; id: Snowflake }>(
  collection: Collection<K, V>,
): Collection<K, V>;
export function escapeMarkdown(text: string, options?: EscapeMarkdownOptions): string;
export function escapeCodeBlock(text: string): string;
export function escapeInlineCode(text: string): string;
export function escapeBold(text: string): string;
export function escapeItalic(text: string): string;
export function escapeUnderline(text: string): string;
export function escapeStrikethrough(text: string): string;
export function escapeSpoiler(text: string): string;
export function escapeEscape(text: string): string;
export function escapeHeading(text: string): string;
export function escapeBulletedList(text: string): string;
export function escapeNumberedList(text: string): string;
export function escapeMaskedLink(text: string): string;
export function cleanCodeBlockContent(text: string): string;
export function fetchRecommendedShardCount(token: string, options?: FetchRecommendedShardCountOptions): Promise<number>;
export function flatten(obj: unknown, ...props: Record<string, boolean | string>[]): unknown;
export function makeError(obj: MakeErrorOptions): Error;
export function makePlainError(err: Error): MakeErrorOptions;
export function mergeDefault(def: unknown, given: unknown): unknown;
export function moveElementInArray(array: unknown[], element: unknown, newIndex: number, offset?: boolean): number;
export function parseEmoji(text: string): { animated: boolean; name: string; id: Snowflake | null } | null;
export function resolveColor(color: ColorResolvable): number;
export function resolvePartialEmoji(emoji: EmojiIdentifierResolvable): Partial<APIPartialEmoji> | null;
export function verifyString(data: string, error?: typeof Error, errorMessage?: string, allowEmpty?: boolean): string;
export function setPosition<T extends Channel | Role>(
  item: T,
  position: number,
  relative: boolean,
  sorted: Collection<Snowflake, T>,
  client: Client<true>,
  route: string,
  reason?: string,
): Promise<{ id: Snowflake; position: number }[]>;
export function parseWebhookURL(url: string): WebhookClientDataIdWithToken | null;

export interface MappedComponentBuilderTypes {
  [ComponentType.Button]: ButtonBuilder;
  [ComponentType.StringSelect]: StringSelectMenuBuilder;
  [ComponentType.UserSelect]: UserSelectMenuBuilder;
  [ComponentType.RoleSelect]: RoleSelectMenuBuilder;
  [ComponentType.MentionableSelect]: MentionableSelectMenuBuilder;
  [ComponentType.ChannelSelect]: ChannelSelectMenuBuilder;
  [ComponentType.ActionRow]: ActionRowBuilder;
  [ComponentType.TextInput]: TextInputBuilder;
}

export interface MappedComponentTypes {
  [ComponentType.Button]: ButtonComponent;
  [ComponentType.StringSelect]: StringSelectMenuComponent;
  [ComponentType.UserSelect]: UserSelectMenuComponent;
  [ComponentType.RoleSelect]: RoleSelectMenuComponent;
  [ComponentType.MentionableSelect]: MentionableSelectMenuComponent;
  [ComponentType.ChannelSelect]: ChannelSelectMenuComponent;
  [ComponentType.ActionRow]: ActionRowComponent;
  [ComponentType.TextInput]: TextInputComponent;
}

export interface CreateChannelOptions {
  allowFromUnknownGuild?: boolean;
  fromInteraction?: boolean;
}

export function createChannel(client: Client<true>, data: APIChannel, options?: CreateChannelOptions): Channel;

export function createComponent<T extends keyof MappedComponentTypes>(
  data: APIMessageComponent & { type: T },
): MappedComponentTypes[T];
export function createComponent<C extends Component>(data: C): C;
export function createComponent(data: APIMessageComponent | Component): Component;
export function createComponentBuilder<T extends keyof MappedComponentBuilderTypes>(
  data: APIMessageComponent & { type: T },
): MappedComponentBuilderTypes[T];
export function createComponentBuilder<C extends ComponentBuilder>(data: C): C;
export function createComponentBuilder(data: APIMessageComponent | ComponentBuilder): ComponentBuilder;

/** @deprecated This class is redundant as all methods of the class can be imported from discord.js directly. */
export class Formatters extends null {
  /** @deprecated Import this method directly from discord.js instead. */
  public static blockQuote: typeof blockQuote;
  /** @deprecated Import this method directly from discord.js instead. */
  public static bold: typeof bold;
  /** @deprecated Import this method directly from discord.js instead. */
  public static channelMention: typeof channelMention;
  /** @deprecated Import this method directly from discord.js instead. */
  public static codeBlock: typeof codeBlock;
  /** @deprecated Import this method directly from discord.js instead. */
  public static formatEmoji: typeof formatEmoji;
  /** @deprecated Import this method directly from discord.js instead. */
  public static hideLinkEmbed: typeof hideLinkEmbed;
  /** @deprecated Import this method directly from discord.js instead. */
  public static hyperlink: typeof hyperlink;
  /** @deprecated Import this method directly from discord.js instead. */
  public static inlineCode: typeof inlineCode;
  /** @deprecated Import this method directly from discord.js instead. */
  public static italic: typeof italic;
  /** @deprecated Import this method directly from discord.js instead. */
  public static quote: typeof quote;
  /** @deprecated Import this method directly from discord.js instead. */
  public static roleMention: typeof roleMention;
  /** @deprecated Import this method directly from discord.js instead. */
  public static spoiler: typeof spoiler;
  /** @deprecated Import this method directly from discord.js instead. */
  public static strikethrough: typeof strikethrough;
  /** @deprecated Import this method directly from discord.js instead. */
  public static time: typeof time;
  /** @deprecated Import this property directly from discord.js instead. */
  public static TimestampStyles: typeof TimestampStyles;
  /** @deprecated Import this method directly from discord.js instead. */
  public static underscore: typeof underscore;
  /** @deprecated Import this method directly from discord.js instead. */
  public static userMention: typeof userMention;
}

export type ComponentData =
  | MessageActionRowComponentData
  | ModalActionRowComponentData
  | ActionRowData<MessageActionRowComponentData | ModalActionRowComponentData>;

export class VoiceChannel extends TextBasedChannelMixin(BaseGuildVoiceChannel, true, [
  'lastPinTimestamp',
  'lastPinAt',
]) {
  public videoQualityMode: VideoQualityMode | null;
  public get speakable(): boolean;
  public type: ChannelType.GuildVoice;
  public nsfw: boolean;
  public rateLimitPerUser: number | null;
  public setBitrate(bitrate: number, reason?: string): Promise<VoiceChannel>;
  public setUserLimit(userLimit: number, reason?: string): Promise<VoiceChannel>;
  public setVideoQualityMode(videoQualityMode: VideoQualityMode, reason?: string): Promise<VoiceChannel>;
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
  public get channel(): VoiceBasedChannel | null;
  public channelId: Snowflake | null;
  public get deaf(): boolean | null;
  public guild: Guild;
  public id: Snowflake;
  public get member(): GuildMember | null;
  public get mute(): boolean | null;
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
  public setRequestToSpeak(request?: boolean): Promise<this>;
  public setSuppressed(suppressed?: boolean): Promise<this>;
  public edit(data: VoiceStateEditData): Promise<this>;
}

export class Webhook extends WebhookMixin() {
  private constructor(client: Client<true>, data?: RawWebhookData);
  public avatar: string | null;
  public avatarURL(options?: ImageURLOptions): string | null;
  public channelId: Snowflake;
  public readonly client: Client;
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

  public editMessage(
    message: MessageResolvable,
    options: string | MessagePayload | WebhookEditMessageOptions,
  ): Promise<Message>;
  public fetchMessage(message: Snowflake, options?: WebhookFetchMessageOptions): Promise<Message>;
  public send(options: string | MessagePayload | WebhookCreateMessageOptions): Promise<Message>;
}

export class WebhookClient extends WebhookMixin(BaseClient) {
  public constructor(data: WebhookClientData, options?: WebhookClientOptions);
  public readonly client: this;
  public options: WebhookClientOptions;
  public token: string;
  public editMessage(
    message: MessageResolvable,
    options: string | MessagePayload | WebhookEditMessageOptions,
  ): Promise<APIMessage>;
  public fetchMessage(message: Snowflake, options?: WebhookFetchMessageOptions): Promise<APIMessage>;
  public send(options: string | MessagePayload | WebhookCreateMessageOptions): Promise<APIMessage>;
}

export class WebSocketManager extends EventEmitter {
  private constructor(client: Client);
  private totalShards: number | string;
  private shardQueue: Set<WebSocketShard>;
  private readonly packetQueue: unknown[];
  private destroyed: boolean;
  private reconnecting: boolean;

  public readonly client: Client;
  public gateway: string | null;
  public shards: Collection<number, WebSocketShard>;
  public status: Status;
  public get ping(): number;

  public on(event: GatewayDispatchEvents, listener: (data: any, shardId: number) => void): this;
  public once(event: GatewayDispatchEvents, listener: (data: any, shardId: number) => void): this;

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

export interface WebSocketShardEventTypes {
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
  private sessionId: string | null;
  private resumeURL: string | null;
  public lastPingTimestamp: number;
  private lastHeartbeatAcked: boolean;
  private readonly ratelimit: {
    queue: unknown[];
    total: number;
    remaining: number;
    time: 60e3;
    timer: NodeJS.Timeout | null;
  };
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

  public on<K extends keyof WebSocketShardEventTypes>(
    event: K,
    listener: (...args: WebSocketShardEventTypes[K]) => Awaitable<void>,
  ): this;

  public once<K extends keyof WebSocketShardEventTypes>(
    event: K,
    listener: (...args: WebSocketShardEventTypes[K]) => Awaitable<void>,
  ): this;
}

export class Widget extends Base {
  private constructor(client: Client<true>, data: RawWidgetData);
  private _patch(data: RawWidgetData): void;
  public fetch(): Promise<Widget>;
  public id: Snowflake;
  public instantInvite?: string;
  public channels: Collection<Snowflake, WidgetChannel>;
  public members: Collection<string, WidgetMember>;
  public presenceCount: number;
}

export class WidgetMember extends Base {
  private constructor(client: Client<true>, data: RawWidgetMemberData);
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
  public get channel(): TextChannel | NewsChannel | ForumChannel | null;
  public get emoji(): GuildEmoji | Emoji;
}

export class WelcomeScreen extends Base {
  private constructor(guild: Guild, data: RawWelcomeScreenData);
  public get enabled(): boolean;
  public guild: Guild | InviteGuild;
  public description: string | null;
  public welcomeChannels: Collection<Snowflake, WelcomeChannel>;
}

//#endregion

//#region Constants

export type NonSystemMessageType =
  | MessageType.Default
  | MessageType.Reply
  | MessageType.ChatInputCommand
  | MessageType.ContextMenuCommand;

export const Constants: {
  MaxBulkDeletableMessageAge: 1_209_600_000;
  SweeperKeys: SweeperKey[];
  NonSystemMessageTypes: NonSystemMessageType[];
  TextBasedChannelTypes: TextBasedChannelTypes[];
  ThreadChannelTypes: ThreadChannelType[];
  VoiceBasedChannelTypes: VoiceBasedChannelTypes[];
  SelectMenuTypes: SelectMenuType[];
};

export const version: string;

//#endregion

//#region Errors
export enum DiscordjsErrorCodes {
  ClientInvalidOption = 'ClientInvalidOption',
  ClientInvalidProvidedShards = 'ClientInvalidProvidedShards',
  ClientMissingIntents = 'ClientMissingIntents',
  ClientNotReady = 'ClientNotReady',

  TokenInvalid = 'TokenInvalid',
  TokenMissing = 'TokenMissing',
  ApplicationCommandPermissionsTokenMissing = 'ApplicationCommandPermissionsTokenMissing',

  WSCloseRequested = 'WSCloseRequested',
  WSConnectionExists = 'WSConnectionExists',
  WSNotOpen = 'WSNotOpen',
  ManagerDestroyed = 'ManagerDestroyed',

  BitFieldInvalid = 'BitFieldInvalid',

  ShardingInvalid = 'ShardingInvalid',
  ShardingRequired = 'ShardingRequired',
  InvalidIntents = 'InvalidIntents',
  DisallowedIntents = 'DisallowedIntents',
  ShardingNoShards = 'ShardingNoShards',
  ShardingInProcess = 'ShardingInProcess',
  ShardingInvalidEvalBroadcast = 'ShardingInvalidEvalBroadcast',
  ShardingShardNotFound = 'ShardingShardNotFound',
  ShardingAlreadySpawned = 'ShardingAlreadySpawned',
  ShardingProcessExists = 'ShardingProcessExists',
  ShardingWorkerExists = 'ShardingWorkerExists',
  ShardingReadyTimeout = 'ShardingReadyTimeout',
  ShardingReadyDisconnected = 'ShardingReadyDisconnected',
  ShardingReadyDied = 'ShardingReadyDied',
  ShardingNoChildExists = 'ShardingNoChildExists',
  ShardingShardMiscalculation = 'ShardingShardMiscalculation',

  ColorRange = 'ColorRange',
  ColorConvert = 'ColorConvert',

  InviteOptionsMissingChannel = 'InviteOptionsMissingChannel',

  ButtonLabel = 'ButtonLabel',
  ButtonURL = 'ButtonURL',
  ButtonCustomId = 'ButtonCustomId',

  SelectMenuCustomId = 'SelectMenuCustomId',
  SelectMenuPlaceholder = 'SelectMenuPlaceholder',
  SelectOptionLabel = 'SelectOptionLabel',
  SelectOptionValue = 'SelectOptionValue',
  SelectOptionDescription = 'SelectOptionDescription',

  InteractionCollectorError = 'InteractionCollectorError',

  FileNotFound = 'FileNotFound',

  UserBannerNotFetched = 'UserBannerNotFetched',
  UserNoDMChannel = 'UserNoDMChannel',

  VoiceNotStageChannel = 'VoiceNotStageChannel',

  VoiceStateNotOwn = 'VoiceStateNotOwn',
  VoiceStateInvalidType = 'VoiceStateInvalidType',

  ReqResourceType = 'ReqResourceType',

  ImageFormat = 'ImageFormat',
  ImageSize = 'ImageSize',

  MessageBulkDeleteType = 'MessageBulkDeleteType',
  MessageNonceType = 'MessageNonceType',
  MessageContentType = 'MessageContentType',

  SplitMaxLen = 'SplitMaxLen',

  BanResolveId = 'BanResolveId',
  FetchBanResolveId = 'FetchBanResolveId',

  PruneDaysType = 'PruneDaysType',

  GuildChannelResolve = 'GuildChannelResolve',
  GuildVoiceChannelResolve = 'GuildVoiceChannelResolve',
  GuildChannelOrphan = 'GuildChannelOrphan',
  GuildChannelUnowned = 'GuildChannelUnowned',
  GuildOwned = 'GuildOwned',
  GuildMembersTimeout = 'GuildMembersTimeout',
  GuildUncachedMe = 'GuildUncachedMe',
  ChannelNotCached = 'ChannelNotCached',
  StageChannelResolve = 'StageChannelResolve',
  GuildScheduledEventResolve = 'GuildScheduledEventResolve',
  FetchOwnerId = 'FetchOwnerId',

  InvalidType = 'InvalidType',
  InvalidElement = 'InvalidElement',

  MessageThreadParent = 'MessageThreadParent',
  MessageExistingThread = 'MessageExistingThread',
  ThreadInvitableType = 'ThreadInvitableType',

  WebhookMessage = 'WebhookMessage',
  WebhookTokenUnavailable = 'WebhookTokenUnavailable',
  WebhookURLInvalid = 'WebhookURLInvalid',
  WebhookApplication = 'WebhookApplication',
  MessageReferenceMissing = 'MessageReferenceMissing',

  EmojiType = 'EmojiType',
  EmojiManaged = 'EmojiManaged',
  MissingManageEmojisAndStickersPermission = 'MissingManageEmojisAndStickersPermission',
  NotGuildSticker = 'NotGuildSticker',

  ReactionResolveUser = 'ReactionResolveUser',

  VanityURL = 'VanityURL',

  InviteResolveCode = 'InviteResolveCode',

  InviteNotFound = 'InviteNotFound',

  DeleteGroupDMChannel = 'DeleteGroupDMChannel',
  FetchGroupDMChannel = 'FetchGroupDMChannel',

  MemberFetchNonceLength = 'MemberFetchNonceLength',

  GlobalCommandPermissions = 'GlobalCommandPermissions',
  GuildUncachedEntityResolve = 'GuildUncachedEntityResolve',

  InteractionAlreadyReplied = 'InteractionAlreadyReplied',
  InteractionNotReplied = 'InteractionNotReplied',
  /** @deprecated */
  InteractionEphemeralReplied = 'InteractionEphemeralReplied',

  CommandInteractionOptionNotFound = 'CommandInteractionOptionNotFound',
  CommandInteractionOptionType = 'CommandInteractionOptionType',
  CommandInteractionOptionEmpty = 'CommandInteractionOptionEmpty',
  CommandInteractionOptionNoSubcommand = 'CommandInteractionOptionNoSubcommand',
  CommandInteractionOptionNoSubcommandGroup = 'CommandInteractionOptionNoSubcommandGroup',
  AutocompleteInteractionOptionNoFocusedOption = 'AutocompleteInteractionOptionNoFocusedOption',

  ModalSubmitInteractionFieldNotFound = 'ModalSubmitInteractionFieldNotFound',
  ModalSubmitInteractionFieldType = 'ModalSubmitInteractionFieldType',

  InvalidMissingScopes = 'InvalidMissingScopes',

  NotImplemented = 'NotImplemented',

  SweepFilterReturn = 'SweepFilterReturn',

  GuildForumMessageRequired = 'GuildForumMessageRequired',
}

export interface DiscordjsErrorFields<Name extends string> {
  readonly name: `${Name} [${DiscordjsErrorCodes}]`;
  get code(): DiscordjsErrorCodes;
}

export function DiscordjsErrorMixin<T, N extends string>(
  Base: Constructable<T>,
  name: N,
): Constructable<T & DiscordjsErrorFields<N>>;

export class DiscordjsError extends DiscordjsErrorMixin(Error, 'Error') {}

export class DiscordjsTypeError extends DiscordjsErrorMixin(TypeError, 'TypeError') {}

export class DiscordjsRangeError extends DiscordjsErrorMixin(RangeError, 'RangeError') {}

//#endregion

//#region Managers

export abstract class BaseManager {
  protected constructor(client: Client);
  public readonly client: Client;
}

export abstract class DataManager<K, Holds, R> extends BaseManager {
  protected constructor(client: Client<true>, holds: Constructable<Holds>);
  public readonly holds: Constructable<Holds>;
  public get cache(): Collection<K, Holds>;
  public resolve(resolvable: Holds): Holds;
  public resolve(resolvable: R): Holds | null;
  public resolveId(resolvable: K | Holds): K;
  public resolveId(resolvable: R): K | null;
  public valueOf(): Collection<K, Holds>;
}

export abstract class CachedManager<K, Holds, R> extends DataManager<K, Holds, R> {
  protected constructor(client: Client<true>, holds: Constructable<Holds>);
  private _add(data: unknown, cache?: boolean, { id, extras }?: { id: K; extras: unknown[] }): Holds;
}

export type ApplicationCommandDataResolvable =
  | ApplicationCommandData
  | RESTPostAPIApplicationCommandsJSONBody
  | JSONEncodable<RESTPostAPIApplicationCommandsJSONBody>;

export class ApplicationCommandManager<
  ApplicationCommandScope = ApplicationCommand<{ guild: GuildResolvable }>,
  PermissionsOptionsExtras = { guild: GuildResolvable },
  PermissionsGuildType = null,
> extends CachedManager<Snowflake, ApplicationCommandScope, ApplicationCommandResolvable> {
  protected constructor(client: Client<true>, iterable?: Iterable<unknown>);
  public permissions: ApplicationCommandPermissionsManager<
    { command?: ApplicationCommandResolvable } & PermissionsOptionsExtras,
    { command: ApplicationCommandResolvable } & PermissionsOptionsExtras,
    PermissionsGuildType,
    null
  >;
  private commandPath({ id, guildId }: { id?: Snowflake; guildId?: Snowflake }): string;
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
  GuildType,
  CommandIdType,
> extends BaseManager {
  private constructor(manager: ApplicationCommandManager | GuildApplicationCommandManager | ApplicationCommand);
  private manager: ApplicationCommandManager | GuildApplicationCommandManager | ApplicationCommand;

  public commandId: CommandIdType;
  public guild: GuildType;
  public guildId: Snowflake | null;
  public add(
    options: FetchSingleOptions & EditApplicationCommandPermissionsMixin,
  ): Promise<ApplicationCommandPermissions[]>;
  public has(
    options: FetchSingleOptions & {
      permissionId: ApplicationCommandPermissionIdResolvable;
      permissionType?: ApplicationCommandPermissionType;
    },
  ): Promise<boolean>;
  public fetch(options: FetchSingleOptions): Promise<ApplicationCommandPermissions[]>;
  public fetch(options: BaseOptions): Promise<Collection<Snowflake, ApplicationCommandPermissions[]>>;
  public remove(
    options:
      | (FetchSingleOptions & {
          token: string;
          channels?: (GuildChannelResolvable | ChannelPermissionConstant)[];
          roles?: (RoleResolvable | RolePermissionConstant)[];
          users: UserResolvable[];
        })
      | (FetchSingleOptions & {
          token: string;
          channels?: (GuildChannelResolvable | ChannelPermissionConstant)[];
          roles: (RoleResolvable | RolePermissionConstant)[];
          users?: UserResolvable[];
        })
      | (FetchSingleOptions & {
          token: string;
          channels: (GuildChannelResolvable | ChannelPermissionConstant)[];
          roles?: (RoleResolvable | RolePermissionConstant)[];
          users?: UserResolvable[];
        }),
  ): Promise<ApplicationCommandPermissions[]>;
  public set(
    options: FetchSingleOptions & EditApplicationCommandPermissionsMixin,
  ): Promise<ApplicationCommandPermissions[]>;
  private permissionsPath(guildId: Snowflake, commandId?: Snowflake): string;
}

export class BaseGuildEmojiManager extends CachedManager<Snowflake, GuildEmoji, EmojiResolvable> {
  protected constructor(client: Client<true>, iterable?: Iterable<RawGuildEmojiData>);
  public resolveIdentifier(emoji: EmojiIdentifierResolvable): string | null;
}

export class CategoryChannelChildManager extends DataManager<Snowflake, CategoryChildChannel, GuildChannelResolvable> {
  private constructor(channel: CategoryChannel);

  public channel: CategoryChannel;
  public get guild(): Guild;
  public create<T extends CategoryChannelType>(
    options: CategoryCreateChannelOptions & { type: T },
  ): Promise<MappedChannelCategoryTypes[T]>;
  public create(options: CategoryCreateChannelOptions): Promise<TextChannel>;
}

export class ChannelManager extends CachedManager<Snowflake, Channel, ChannelResolvable> {
  private constructor(client: Client<true>, iterable: Iterable<RawChannelData>);
  public fetch(id: Snowflake, options?: FetchChannelOptions): Promise<Channel | null>;
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

export type MappedGuildChannelTypes = {
  [ChannelType.GuildCategory]: CategoryChannel;
} & MappedChannelCategoryTypes;

export type GuildChannelTypes = CategoryChannelType | ChannelType.GuildCategory;

export class GuildChannelManager extends CachedManager<Snowflake, GuildBasedChannel, GuildChannelResolvable> {
  private constructor(guild: Guild, iterable?: Iterable<RawGuildChannelData>);
  public get channelCountWithoutThreads(): number;
  public guild: Guild;

  public addFollower(
    channel: NewsChannel | Snowflake,
    targetChannel: TextChannelResolvable,
    reason?: string,
  ): Promise<Snowflake>;
  public create<T extends GuildChannelTypes>(
    options: GuildChannelCreateOptions & { type: T },
  ): Promise<MappedGuildChannelTypes[T]>;
  public create(options: GuildChannelCreateOptions): Promise<TextChannel>;
  public createWebhook(options: WebhookCreateOptions): Promise<Webhook>;
  public edit(channel: GuildChannelResolvable, data: GuildChannelEditOptions): Promise<GuildChannel>;
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
  public create(options: GuildEmojiCreateOptions): Promise<GuildEmoji>;
  public fetch(id: Snowflake, options?: BaseFetchOptions): Promise<GuildEmoji>;
  public fetch(id?: undefined, options?: BaseFetchOptions): Promise<Collection<Snowflake, GuildEmoji>>;
  public fetchAuthor(emoji: EmojiResolvable): Promise<User>;
  public delete(emoji: EmojiResolvable, reason?: string): Promise<void>;
  public edit(emoji: EmojiResolvable, data: GuildEmojiEditData): Promise<GuildEmoji>;
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
  private constructor(client: Client<true>, iterable?: Iterable<RawGuildData>);
  public create(options: GuildCreateOptions): Promise<Guild>;
  public fetch(options: Snowflake | FetchGuildOptions): Promise<Guild>;
  public fetch(options?: FetchGuildsOptions): Promise<Collection<Snowflake, OAuth2Guild>>;
}

export interface AddOrRemoveGuildMemberRoleOptions {
  user: GuildMemberResolvable;
  role: RoleResolvable;
  reason?: string;
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
  public ban(user: UserResolvable, options?: BanOptions): Promise<GuildMember | User | Snowflake>;
  public edit(user: UserResolvable, data: GuildMemberEditData): Promise<GuildMember>;
  public fetch(
    options: UserResolvable | FetchMemberOptions | (FetchMembersOptions & { user: UserResolvable }),
  ): Promise<GuildMember>;
  public fetch(options?: FetchMembersOptions): Promise<Collection<Snowflake, GuildMember>>;
  public fetchMe(options?: BaseFetchOptions): Promise<GuildMember>;
  public kick(user: UserResolvable, reason?: string): Promise<GuildMember | User | Snowflake>;
  public list(options?: GuildListMembersOptions): Promise<Collection<Snowflake, GuildMember>>;
  public prune(options: GuildPruneMembersOptions & { dry?: false; count: false }): Promise<null>;
  public prune(options?: GuildPruneMembersOptions): Promise<number>;
  public search(options: GuildSearchMembersOptions): Promise<Collection<Snowflake, GuildMember>>;
  public unban(user: UserResolvable, reason?: string): Promise<User | null>;
  public addRole(options: AddOrRemoveGuildMemberRoleOptions): Promise<GuildMember | User | Snowflake>;
  public removeRole(options: AddOrRemoveGuildMemberRoleOptions): Promise<GuildMember | User | Snowflake>;
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
  public create(options: GuildStickerCreateOptions): Promise<Sticker>;
  public edit(sticker: StickerResolvable, data?: GuildStickerEditData): Promise<Sticker>;
  public delete(sticker: StickerResolvable, reason?: string): Promise<void>;
  public fetch(id: Snowflake, options?: BaseFetchOptions): Promise<Sticker>;
  public fetch(id?: Snowflake, options?: BaseFetchOptions): Promise<Collection<Snowflake, Sticker>>;
  public fetchUser(sticker: StickerResolvable): Promise<User | null>;
}

export class GuildMemberRoleManager extends DataManager<Snowflake, Role, RoleResolvable> {
  private constructor(member: GuildMember);
  public get hoist(): Role | null;
  public get icon(): Role | null;
  public get color(): Role | null;
  public get highest(): Role;
  public get premiumSubscriberRole(): Role | null;
  public get botRole(): Role | null;
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

export class MessageManager<InGuild extends boolean = boolean> extends CachedManager<
  Snowflake,
  Message<InGuild>,
  MessageResolvable
> {
  private constructor(channel: TextBasedChannel, iterable?: Iterable<RawMessageData>);
  public channel: If<InGuild, GuildTextBasedChannel, TextBasedChannel>;
  public crosspost(message: MessageResolvable): Promise<Message<InGuild>>;
  public delete(message: MessageResolvable): Promise<void>;
  public edit(
    message: MessageResolvable,
    options: string | MessagePayload | MessageEditOptions,
  ): Promise<Message<InGuild>>;
  public fetch(options: MessageResolvable | FetchMessageOptions): Promise<Message<InGuild>>;
  public fetch(options?: FetchMessagesOptions): Promise<Collection<Snowflake, Message<InGuild>>>;
  public fetchPinned(cache?: boolean): Promise<Collection<Snowflake, Message<InGuild>>>;
  public react(message: MessageResolvable, emoji: EmojiIdentifierResolvable): Promise<void>;
  public pin(message: MessageResolvable, reason?: string): Promise<void>;
  public unpin(message: MessageResolvable, reason?: string): Promise<void>;
}

export class PermissionOverwriteManager extends CachedManager<
  Snowflake,
  PermissionOverwrites,
  PermissionOverwriteResolvable
> {
  private constructor(client: Client<true>, iterable?: Iterable<RawPermissionOverwriteData>);
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
  private constructor(client: Client<true>, iterable?: Iterable<RawPresenceData>);
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
  public get everyone(): Role;
  public get highest(): Role;
  public guild: Guild;
  public get premiumSubscriberRole(): Role | null;
  public botRoleFor(user: UserResolvable): Role | null;
  public fetch(id: Snowflake, options?: BaseFetchOptions): Promise<Role | null>;
  public fetch(id?: undefined, options?: BaseFetchOptions): Promise<Collection<Snowflake, Role>>;
  public create(options?: CreateRoleOptions): Promise<Role>;
  public edit(role: RoleResolvable, options: EditRoleOptions): Promise<Role>;
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

export class ThreadManager<Forum extends boolean = boolean> extends CachedManager<
  Snowflake,
  ThreadChannel<Forum>,
  ThreadChannelResolvable
> {
  protected constructor(channel: TextChannel | NewsChannel | ForumChannel, iterable?: Iterable<RawThreadChannelData>);
  public channel: If<Forum, ForumChannel, TextChannel | NewsChannel>;
  public fetch(options: ThreadChannelResolvable, cacheOptions?: BaseFetchOptions): Promise<AnyThreadChannel | null>;
  public fetch(options?: FetchThreadsOptions, cacheOptions?: { cache?: boolean }): Promise<FetchedThreads>;
  public fetchArchived(options?: FetchArchivedThreadOptions, cache?: boolean): Promise<FetchedThreads>;
  public fetchActive(cache?: boolean): Promise<FetchedThreads>;
}

export class GuildTextThreadManager<AllowedThreadType> extends ThreadManager<false> {
  public create(options: GuildTextThreadCreateOptions<AllowedThreadType>): Promise<ThreadChannel>;
}

export class GuildForumThreadManager extends ThreadManager<true> {
  public create(options: GuildForumThreadCreateOptions): Promise<ThreadChannel>;
}

export class ThreadMemberManager extends CachedManager<Snowflake, ThreadMember, ThreadMemberResolvable> {
  private constructor(thread: ThreadChannel, iterable?: Iterable<RawThreadMemberData>);
  public thread: AnyThreadChannel;
  public get me(): ThreadMember | null;
  public add(member: UserResolvable | '@me', reason?: string): Promise<Snowflake>;
  public fetch(options: ThreadMemberResolvable | FetchThreadMemberOptions): Promise<ThreadMember>;
  public fetch(options?: FetchThreadMembersOptions): Promise<Collection<Snowflake, ThreadMember>>;
  public fetchMe(options?: BaseFetchOptions): Promise<ThreadMember>;
  public remove(id: Snowflake | '@me', reason?: string): Promise<Snowflake>;
}

export class UserManager extends CachedManager<Snowflake, User, UserResolvable> {
  private constructor(client: Client<true>, iterable?: Iterable<RawUserData>);
  private dmChannel(userId: Snowflake): DMChannel | null;
  public createDM(user: UserResolvable, options?: BaseFetchOptions): Promise<DMChannel>;
  public deleteDM(user: UserResolvable): Promise<DMChannel>;
  public fetch(user: UserResolvable, options?: BaseFetchOptions): Promise<User>;
  public fetchFlags(user: UserResolvable, options?: BaseFetchOptions): Promise<UserFlagsBitField>;
  public send(user: UserResolvable, options: string | MessagePayload | MessageCreateOptions): Promise<Message>;
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
export function PartialTextBasedChannel<T>(
  Base?: Constructable<T>,
): Constructable<T & PartialTextBasedChannelFields<false>>;

export function TextBasedChannelMixin<
  T,
  InGuild extends boolean = boolean,
  I extends keyof TextBasedChannelFields<InGuild> = never,
>(
  Base?: Constructable<T>,
  inGuild?: InGuild,
  ignore?: I[],
): Constructable<T & Omit<TextBasedChannelFields<InGuild>, I>>;

export interface PartialTextBasedChannelFields<InGuild extends boolean = boolean> {
  send(options: string | MessagePayload | MessageCreateOptions): Promise<Message<InGuild>>;
}

export interface TextBasedChannelFields<InGuild extends boolean = boolean>
  extends PartialTextBasedChannelFields<InGuild> {
  lastMessageId: Snowflake | null;
  get lastMessage(): Message | null;
  lastPinTimestamp: number | null;
  get lastPinAt(): Date | null;
  messages: MessageManager<InGuild>;
  awaitMessageComponent<T extends MessageComponentType>(
    options?: AwaitMessageCollectorOptionsParams<T, true>,
  ): Promise<MappedInteractionTypes[T]>;
  awaitMessages(options?: AwaitMessagesOptions): Promise<Collection<Snowflake, Message>>;
  bulkDelete(
    messages: Collection<Snowflake, Message> | readonly MessageResolvable[] | number,
    filterOld?: boolean,
  ): Promise<Collection<Snowflake, Message | PartialMessage | undefined>>;
  createMessageComponentCollector<T extends MessageComponentType>(
    options?: MessageChannelCollectorOptionsParams<T, true>,
  ): InteractionCollector<MappedInteractionTypes[T]>;
  createMessageCollector(options?: MessageCollectorOptions): MessageCollector;
  createWebhook(options: ChannelWebhookCreateOptions): Promise<Webhook>;
  fetchWebhooks(): Promise<Collection<Snowflake, Webhook>>;
  sendTyping(): Promise<void>;
  setRateLimitPerUser(rateLimitPerUser: number, reason?: string): Promise<this>;
  setNSFW(nsfw?: boolean, reason?: string): Promise<this>;
}

export function PartialWebhookMixin<T>(Base?: Constructable<T>): Constructable<T & PartialWebhookFields>;
export function WebhookMixin<T>(Base?: Constructable<T>): Constructable<T & WebhookFields>;

export interface PartialWebhookFields {
  id: Snowflake;
  get url(): string;
  deleteMessage(message: MessageResolvable | APIMessage | '@original', threadId?: Snowflake): Promise<void>;
  editMessage(
    message: MessageResolvable | '@original',
    options: string | MessagePayload | WebhookEditMessageOptions,
  ): Promise<APIMessage | Message>;
  fetchMessage(message: Snowflake | '@original', options?: WebhookFetchMessageOptions): Promise<APIMessage | Message>;
  send(
    options: string | MessagePayload | InteractionReplyOptions | WebhookCreateMessageOptions,
  ): Promise<APIMessage | Message>;
}

export interface WebhookFields extends PartialWebhookFields {
  get createdAt(): Date;
  get createdTimestamp(): number;
  delete(reason?: string): Promise<void>;
  edit(options: WebhookEditData): Promise<Webhook>;
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

export interface AddGuildMemberOptions {
  accessToken: string;
  nick?: string;
  roles?: Collection<Snowflake, Role> | RoleResolvable[];
  mute?: boolean;
  deaf?: boolean;
  force?: boolean;
  fetchWhenExisting?: boolean;
}

export type AllowedPartial = User | Channel | GuildMember | Message | MessageReaction | ThreadMember;

export type AllowedThreadTypeForNewsChannel = ChannelType.AnnouncementThread;

export type AllowedThreadTypeForTextChannel = ChannelType.PublicThread | ChannelType.PrivateThread;

export interface BaseApplicationCommandData {
  name: string;
  nameLocalizations?: LocalizationMap;
  dmPermission?: boolean;
  defaultMemberPermissions?: PermissionResolvable | null;
}

export interface AttachmentData {
  name?: string;
  description?: string;
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
  nameLocalizations?: LocalizationMap;
  description: string;
  descriptionLocalizations?: LocalizationMap;
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
  descriptionLocalizations?: LocalizationMap;
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

export interface ApplicationCommandRoleOptionData extends BaseApplicationCommandOptionsData {
  type: ApplicationCommandOptionType.Role;
}

export interface ApplicationCommandRoleOption extends BaseApplicationCommandOptionsData {
  type: ApplicationCommandOptionType.Role;
}

export interface ApplicationCommandUserOptionData extends BaseApplicationCommandOptionsData {
  type: ApplicationCommandOptionType.User;
}

export interface ApplicationCommandUserOption extends BaseApplicationCommandOptionsData {
  type: ApplicationCommandOptionType.User;
}

export interface ApplicationCommandMentionableOptionData extends BaseApplicationCommandOptionsData {
  type: ApplicationCommandOptionType.Mentionable;
}

export interface ApplicationCommandMentionableOption extends BaseApplicationCommandOptionsData {
  type: ApplicationCommandOptionType.Mentionable;
}

export interface ApplicationCommandAttachmentOption extends BaseApplicationCommandOptionsData {
  type: ApplicationCommandOptionType.Attachment;
}

export interface ApplicationCommandAutocompleteNumericOption
  extends Omit<BaseApplicationCommandOptionsData, 'autocomplete'> {
  type: CommandOptionNumericResolvableType;
  minValue?: number;
  maxValue?: number;
  autocomplete: true;
}

export interface ApplicationCommandAutocompleteStringOption
  extends Omit<BaseApplicationCommandOptionsData, 'autocomplete'> {
  type: ApplicationCommandOptionType.String;
  minLength?: number;
  maxLength?: number;
  autocomplete: true;
}

export interface ApplicationCommandAutocompleteNumericOptionData
  extends Omit<BaseApplicationCommandOptionsData, 'autocomplete'> {
  type: CommandOptionNumericResolvableType;
  minValue?: number;
  min_value?: number;
  maxValue?: number;
  max_value?: number;
  autocomplete: true;
}

export interface ApplicationCommandAutocompleteStringOptionData
  extends Omit<BaseApplicationCommandOptionsData, 'autocomplete'> {
  type: ApplicationCommandOptionType.String;
  minLength?: number;
  min_length?: number;
  maxLength?: number;
  max_length?: number;
  autocomplete: true;
}

export interface ApplicationCommandChoicesData<Type extends string | number = string | number>
  extends Omit<BaseApplicationCommandOptionsData, 'autocomplete'> {
  type: CommandOptionChoiceResolvableType;
  choices?: ApplicationCommandOptionChoiceData<Type>[];
  autocomplete?: false;
}

export interface ApplicationCommandChoicesOption<Type extends string | number = string | number>
  extends Omit<BaseApplicationCommandOptionsData, 'autocomplete'> {
  type: CommandOptionChoiceResolvableType;
  choices?: ApplicationCommandOptionChoiceData<Type>[];
  autocomplete?: false;
}

export interface ApplicationCommandNumericOptionData extends ApplicationCommandChoicesData<number> {
  type: CommandOptionNumericResolvableType;
  minValue?: number;
  min_value?: number;
  maxValue?: number;
  max_value?: number;
}

export interface ApplicationCommandStringOptionData extends ApplicationCommandChoicesData<string> {
  type: ApplicationCommandOptionType.String;
  minLength?: number;
  min_length?: number;
  maxLength?: number;
  max_length?: number;
}

export interface ApplicationCommandBooleanOptionData extends BaseApplicationCommandOptionsData {
  type: ApplicationCommandOptionType.Boolean;
}

export interface ApplicationCommandNumericOption extends ApplicationCommandChoicesOption<number> {
  type: CommandOptionNumericResolvableType;
  minValue?: number;
  maxValue?: number;
}

export interface ApplicationCommandStringOption extends ApplicationCommandChoicesOption<string> {
  type: ApplicationCommandOptionType.String;
  minLength?: number;
  maxLength?: number;
}

export interface ApplicationCommandBooleanOption extends BaseApplicationCommandOptionsData {
  type: ApplicationCommandOptionType.Boolean;
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
  options?: Exclude<ApplicationCommandOptionData, ApplicationCommandSubGroupData | ApplicationCommandSubCommandData>[];
}

export interface ApplicationCommandSubCommand extends Omit<BaseApplicationCommandOptionsData, 'required'> {
  type: ApplicationCommandOptionType.Subcommand;
  options?: Exclude<ApplicationCommandOption, ApplicationCommandSubGroup | ApplicationCommandSubCommand>[];
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
  | ApplicationCommandAutocompleteNumericOptionData
  | ApplicationCommandAutocompleteStringOptionData
  | ApplicationCommandNumericOptionData
  | ApplicationCommandStringOptionData
  | ApplicationCommandRoleOptionData
  | ApplicationCommandUserOptionData
  | ApplicationCommandMentionableOptionData
  | ApplicationCommandBooleanOptionData
  | ApplicationCommandSubCommandData;

export type ApplicationCommandOption =
  | ApplicationCommandSubGroup
  | ApplicationCommandAutocompleteNumericOption
  | ApplicationCommandAutocompleteStringOption
  | ApplicationCommandNonOptions
  | ApplicationCommandChannelOption
  | ApplicationCommandNumericOption
  | ApplicationCommandStringOption
  | ApplicationCommandRoleOption
  | ApplicationCommandUserOption
  | ApplicationCommandMentionableOption
  | ApplicationCommandBooleanOption
  | ApplicationCommandAttachmentOption
  | ApplicationCommandSubCommand;

export interface ApplicationCommandOptionChoiceData<Value extends string | number = string | number> {
  name: string;
  nameLocalizations?: LocalizationMap;
  value: Value;
}

export interface ApplicationCommandPermissions {
  id: Snowflake;
  type: ApplicationCommandPermissionType;
  permission: boolean;
}

export interface ApplicationCommandPermissionsUpdateData {
  id: Snowflake;
  guildId: Snowflake;
  applicationId: Snowflake;
  permissions: ApplicationCommandPermissions[];
}

export interface EditApplicationCommandPermissionsMixin {
  permissions: ApplicationCommandPermissions[];
  token: string;
}

export type ChannelPermissionConstant = Snowflake;

export type RolePermissionConstant = Snowflake;

export type ApplicationCommandPermissionIdResolvable =
  | GuildChannelResolvable
  | RoleResolvable
  | UserResolvable
  | ChannelPermissionConstant
  | RolePermissionConstant;

export type ApplicationCommandResolvable = ApplicationCommand | Snowflake;

export type ApplicationFlagsString = keyof typeof ApplicationFlags;

export interface AuditLogChange {
  key: APIAuditLogChange['key'];
  old?: APIAuditLogChange['old_value'];
  new?: APIAuditLogChange['new_value'];
}

export type AwaitMessageComponentOptions<T extends CollectedMessageInteraction> = Omit<
  MessageComponentCollectorOptions<T>,
  'max' | 'maxComponents' | 'maxUsers'
>;

export type ModalSubmitInteractionCollectorOptions<T extends ModalSubmitInteraction> = Omit<
  InteractionCollectorOptions<T>,
  'channel' | 'message' | 'guild' | 'interactionType'
>;

export type AwaitModalSubmitOptions<T extends ModalSubmitInteraction> = Omit<
  ModalSubmitInteractionCollectorOptions<T>,
  'max' | 'maxComponents' | 'maxUsers'
> & {
  time: number;
};

export interface AwaitMessagesOptions extends MessageCollectorOptions {
  errors?: string[];
}

export interface AwaitReactionsOptions extends ReactionCollectorOptions {
  errors?: string[];
}

export interface BanOptions {
  /** @deprecated Use {@link deleteMessageSeconds} instead. */
  deleteMessageDays?: number;
  deleteMessageSeconds?: number;
  reason?: string;
}

export type Base64Resolvable = Buffer | Base64String;

export type Base64String = string;

export interface BaseFetchOptions {
  cache?: boolean;
  force?: boolean;
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
  GuildForumThreadManager: [manager: typeof GuildForumThreadManager, holds: typeof ThreadChannel];
  GuildInviteManager: [manager: typeof GuildInviteManager, holds: typeof Invite];
  GuildScheduledEventManager: [manager: typeof GuildScheduledEventManager, holds: typeof GuildScheduledEvent];
  GuildStickerManager: [manager: typeof GuildStickerManager, holds: typeof Sticker];
  GuildTextThreadManager: [manager: typeof GuildTextThreadManager, holds: typeof ThreadChannel];
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
  name: string;
  permissionOverwrites?: OverwriteResolvable[] | Collection<Snowflake, OverwriteResolvable>;
  topic?: string;
  type?: CategoryChannelType;
  nsfw?: boolean;
  bitrate?: number;
  userLimit?: number;
  rateLimitPerUser?: number;
  position?: number;
  rtcRegion?: string;
  videoQualityMode?: VideoQualityMode;
  availableTags?: GuildForumTagData[];
  defaultReactionEmoji?: DefaultReactionEmoji;
  defaultAutoArchiveDuration?: ThreadAutoArchiveDuration;
  defaultSortOrder?: SortOrderType;
  reason?: string;
}

export interface ChannelCreationOverwrites {
  allow?: PermissionResolvable;
  deny?: PermissionResolvable;
  id: RoleResolvable | UserResolvable;
}

export type ChannelMention = `<#${Snowflake}>`;

export interface ChannelPosition {
  channel: NonThreadGuildBasedChannel | Snowflake;
  lockPermissions?: boolean;
  parent?: CategoryChannelResolvable | null;
  position?: number;
}

export type GuildTextChannelResolvable = TextChannel | NewsChannel | Snowflake;
export type ChannelResolvable = Channel | Snowflake;

export interface ChannelWebhookCreateOptions {
  name: string;
  avatar?: BufferResolvable | Base64Resolvable | null;
  reason?: string;
}

export interface WebhookCreateOptions extends ChannelWebhookCreateOptions {
  channel: TextChannel | NewsChannel | VoiceChannel | ForumChannel | Snowflake;
}

export interface ClientEvents {
  applicationCommandPermissionsUpdate: [data: ApplicationCommandPermissionsUpdateData];
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
  messageDeleteBulk: [messages: Collection<Snowflake, Message | PartialMessage>, channel: GuildTextBasedChannel];
  messageReactionAdd: [reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser];
  messageReactionRemove: [reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser];
  messageUpdate: [oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage];
  presenceUpdate: [oldPresence: Presence | null, newPresence: Presence];
  ready: [client: Client<true>];
  invalidated: [];
  roleCreate: [role: Role];
  roleDelete: [role: Role];
  roleUpdate: [oldRole: Role, newRole: Role];
  threadCreate: [thread: AnyThreadChannel, newlyCreated: boolean];
  threadDelete: [thread: AnyThreadChannel];
  threadListSync: [threads: Collection<Snowflake, AnyThreadChannel>, guild: Guild];
  threadMemberUpdate: [oldMember: ThreadMember, newMember: ThreadMember];
  threadMembersUpdate: [
    addedMembers: Collection<Snowflake, ThreadMember>,
    removedMembers: Collection<Snowflake, ThreadMember | PartialThreadMember>,
    thread: AnyThreadChannel,
  ];
  threadUpdate: [oldThread: AnyThreadChannel, newThread: AnyThreadChannel];
  typingStart: [typing: Typing];
  userUpdate: [oldUser: User | PartialUser, newUser: User];
  voiceStateUpdate: [oldState: VoiceState, newState: VoiceState];
  webhookUpdate: [channel: TextChannel | NewsChannel | VoiceChannel | ForumChannel];
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
  guildScheduledEventUpdate: [
    oldGuildScheduledEvent: GuildScheduledEvent | null,
    newGuildScheduledEvent: GuildScheduledEvent,
  ];
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
  closeTimeout?: number;
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
  jsonTransformer?: (obj: unknown) => unknown;
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
  | keyof typeof Colors
  | 'Random'
  | readonly [red: number, green: number, blue: number]
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
  attachment?: Attachment;
  message?: Message<BooleanCache<Cached>>;
}

export interface CommandInteractionResolvedData<Cached extends CacheType = CacheType> {
  users?: Collection<Snowflake, User>;
  members?: Collection<Snowflake, CacheTypeReducer<Cached, GuildMember, APIInteractionDataResolvedGuildMember>>;
  roles?: Collection<Snowflake, CacheTypeReducer<Cached, Role, APIRole>>;
  channels?: Collection<Snowflake, CacheTypeReducer<Cached, Channel, APIInteractionDataResolvedChannel>>;
  messages?: Collection<Snowflake, CacheTypeReducer<Cached, Message, APIMessage>>;
  attachments?: Collection<Snowflake, Attachment>;
}

export type AutocompleteFocusedOption = Pick<CommandInteractionOption, 'name'> & {
  focused: true;
  type:
    | ApplicationCommandOptionType.String
    | ApplicationCommandOptionType.Integer
    | ApplicationCommandOptionType.Number;
  value: string;
};

export declare const Colors: {
  Default: 0x000000;
  White: 0xffffff;
  Aqua: 0x1abc9c;
  Green: 0x57f287;
  Blue: 0x3498db;
  Yellow: 0xfee75c;
  Purple: 0x9b59b6;
  LuminousVividPink: 0xe91e63;
  Fuchsia: 0xeb459e;
  Gold: 0xf1c40f;
  Orange: 0xe67e22;
  Red: 0xed4245;
  Grey: 0x95a5a6;
  Navy: 0x34495e;
  DarkAqua: 0x11806a;
  DarkGreen: 0x1f8b4c;
  DarkBlue: 0x206694;
  DarkPurple: 0x71368a;
  DarkVividPink: 0xad1457;
  DarkGold: 0xc27c0e;
  DarkOrange: 0xa84300;
  DarkRed: 0x992d22;
  DarkGrey: 0x979c9f;
  DarkerGrey: 0x7f8c8d;
  LightGrey: 0xbcc0c0;
  DarkNavy: 0x2c3e50;
  Blurple: 0x5865f2;
  Greyple: 0x99aab5;
  DarkButNotBlack: 0x2c2f33;
  NotQuiteBlack: 0x23272a;
};

export enum Events {
  ApplicationCommandPermissionsUpdate = 'applicationCommandPermissionsUpdate',
  ClientReady = 'ready',
  GuildCreate = 'guildCreate',
  GuildDelete = 'guildDelete',
  GuildUpdate = 'guildUpdate',
  GuildUnavailable = 'guildUnavailable',
  GuildMemberAdd = 'guildMemberAdd',
  GuildMemberRemove = 'guildMemberRemove',
  GuildMemberUpdate = 'guildMemberUpdate',
  GuildMemberAvailable = 'guildMemberAvailable',
  GuildMembersChunk = 'guildMembersChunk',
  GuildIntegrationsUpdate = 'guildIntegrationsUpdate',
  GuildRoleCreate = 'roleCreate',
  GuildRoleDelete = 'roleDelete',
  InviteCreate = 'inviteCreate',
  InviteDelete = 'inviteDelete',
  GuildRoleUpdate = 'roleUpdate',
  GuildEmojiCreate = 'emojiCreate',
  GuildEmojiDelete = 'emojiDelete',
  GuildEmojiUpdate = 'emojiUpdate',
  GuildBanAdd = 'guildBanAdd',
  GuildBanRemove = 'guildBanRemove',
  ChannelCreate = 'channelCreate',
  ChannelDelete = 'channelDelete',
  ChannelUpdate = 'channelUpdate',
  ChannelPinsUpdate = 'channelPinsUpdate',
  MessageCreate = 'messageCreate',
  MessageDelete = 'messageDelete',
  MessageUpdate = 'messageUpdate',
  MessageBulkDelete = 'messageDeleteBulk',
  MessageReactionAdd = 'messageReactionAdd',
  MessageReactionRemove = 'messageReactionRemove',
  MessageReactionRemoveAll = 'messageReactionRemoveAll',
  MessageReactionRemoveEmoji = 'messageReactionRemoveEmoji',
  ThreadCreate = 'threadCreate',
  ThreadDelete = 'threadDelete',
  ThreadUpdate = 'threadUpdate',
  ThreadListSync = 'threadListSync',
  ThreadMemberUpdate = 'threadMemberUpdate',
  ThreadMembersUpdate = 'threadMembersUpdate',
  UserUpdate = 'userUpdate',
  PresenceUpdate = 'presenceUpdate',
  VoiceServerUpdate = 'voiceServerUpdate',
  VoiceStateUpdate = 'voiceStateUpdate',
  TypingStart = 'typingStart',
  WebhooksUpdate = 'webhookUpdate',
  InteractionCreate = 'interactionCreate',
  Error = 'error',
  Warn = 'warn',
  Debug = 'debug',
  CacheSweep = 'cacheSweep',
  ShardDisconnect = 'shardDisconnect',
  ShardError = 'shardError',
  ShardReconnecting = 'shardReconnecting',
  ShardReady = 'shardReady',
  ShardResume = 'shardResume',
  Invalidated = 'invalidated',
  Raw = 'raw',
  StageInstanceCreate = 'stageInstanceCreate',
  StageInstanceUpdate = 'stageInstanceUpdate',
  StageInstanceDelete = 'stageInstanceDelete',
  GuildStickerCreate = 'stickerCreate',
  GuildStickerDelete = 'stickerDelete',
  GuildStickerUpdate = 'stickerUpdate',
  GuildScheduledEventCreate = 'guildScheduledEventCreate',
  GuildScheduledEventUpdate = 'guildScheduledEventUpdate',
  GuildScheduledEventDelete = 'guildScheduledEventDelete',
  GuildScheduledEventUserAdd = 'guildScheduledEventUserAdd',
  GuildScheduledEventUserRemove = 'guildScheduledEventUserRemove',
}

export enum ShardEvents {
  Death = 'death',
  Disconnect = 'disconnect',
  Error = 'error',
  Message = 'message',
  Ready = 'ready',
  Reconnecting = 'reconnecting',
  Spawn = 'spawn',
}

export enum WebSocketShardEvents {
  Close = 'close',
  Destroyed = 'destroyed',
  InvalidSession = 'invalidSession',
  Ready = 'ready',
  Resumed = 'resumed',
  AllReady = 'allReady',
}

export enum Status {
  Ready = 0,
  Connecting = 1,
  Reconnecting = 2,
  Idle = 3,
  Nearly = 4,
  Disconnected = 5,
  WaitingForGuilds = 6,
  Identifying = 7,
  Resuming = 8,
}

export interface CreateGuildScheduledEventInviteURLOptions extends CreateInviteOptions {
  channel?: GuildInvitableChannelResolvable;
}

export interface CreateRoleOptions extends RoleData {
  reason?: string;
}

export interface EditRoleOptions extends RoleData {
  reason?: string;
}

export interface StageInstanceCreateOptions {
  topic: string;
  privacyLevel?: StageInstancePrivacyLevel;
  sendStartNotification?: boolean;
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

export interface EmbedField {
  name: string;
  value: string;
  inline: boolean;
}

export type EmojiIdentifierResolvable = string | EmojiResolvable;

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
  threads: Collection<Snowflake, AnyThreadChannel>;
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

export interface FetchMessageOptions extends BaseFetchOptions {
  message: MessageResolvable;
}

export interface FetchMessagesOptions {
  limit?: number;
  before?: Snowflake;
  after?: Snowflake;
  around?: Snowflake;
  cache?: boolean;
}

export interface FetchReactionUsersOptions {
  limit?: number;
  after?: Snowflake;
}

export interface FetchThreadMemberOptions extends BaseFetchOptions {
  member: ThreadMemberResolvable;
}

export interface FetchThreadMembersOptions {
  cache?: boolean;
}

export interface FetchThreadsOptions {
  archived?: FetchArchivedThreadOptions;
  active?: boolean;
}

export interface AttachmentPayload {
  attachment: BufferResolvable | Stream;
  name?: string;
  description?: string;
}

export type GlobalSweepFilter<K, V> = () => ((value: V, key: K, collection: Collection<K, V>) => boolean) | null;

interface GuildAuditLogsTypes {
  [AuditLogEvent.GuildUpdate]: ['Guild', 'Update'];
  [AuditLogEvent.ChannelCreate]: ['Channel', 'Create'];
  [AuditLogEvent.ChannelUpdate]: ['Channel', 'Update'];
  [AuditLogEvent.ChannelDelete]: ['Channel', 'Delete'];
  [AuditLogEvent.ChannelOverwriteCreate]: ['Channel', 'Create'];
  [AuditLogEvent.ChannelOverwriteUpdate]: ['Channel', 'Update'];
  [AuditLogEvent.ChannelOverwriteDelete]: ['Channel', 'Delete'];
  [AuditLogEvent.MemberKick]: ['User', 'Delete'];
  [AuditLogEvent.MemberPrune]: ['User', 'Delete'];
  [AuditLogEvent.MemberBanAdd]: ['User', 'Delete'];
  [AuditLogEvent.MemberBanRemove]: ['User', 'Create'];
  [AuditLogEvent.MemberUpdate]: ['User', 'Update'];
  [AuditLogEvent.MemberRoleUpdate]: ['User', 'Update'];
  [AuditLogEvent.MemberMove]: ['User', 'Update'];
  [AuditLogEvent.MemberDisconnect]: ['User', 'Delete'];
  [AuditLogEvent.BotAdd]: ['User', 'Create'];
  [AuditLogEvent.RoleCreate]: ['Role', 'Create'];
  [AuditLogEvent.RoleUpdate]: ['Role', 'Update'];
  [AuditLogEvent.RoleDelete]: ['Role', 'Delete'];
  [AuditLogEvent.InviteCreate]: ['Invite', 'Create'];
  [AuditLogEvent.InviteUpdate]: ['Invite', 'Update'];
  [AuditLogEvent.InviteDelete]: ['Invite', 'Delete'];
  [AuditLogEvent.WebhookCreate]: ['Webhook', 'Create'];
  [AuditLogEvent.WebhookUpdate]: ['Webhook', 'Update'];
  [AuditLogEvent.WebhookDelete]: ['Webhook', 'Delete'];
  [AuditLogEvent.EmojiCreate]: ['Emoji', 'Create'];
  [AuditLogEvent.EmojiUpdate]: ['Emoji', 'Update'];
  [AuditLogEvent.EmojiDelete]: ['Emoji', 'Delete'];
  [AuditLogEvent.MessageDelete]: ['Message', 'Delete'];
  [AuditLogEvent.MessageBulkDelete]: ['Message', 'Delete'];
  [AuditLogEvent.MessagePin]: ['Message', 'Create'];
  [AuditLogEvent.MessageUnpin]: ['Message', 'Delete'];
  [AuditLogEvent.IntegrationCreate]: ['Integration', 'Create'];
  [AuditLogEvent.IntegrationUpdate]: ['Integration', 'Update'];
  [AuditLogEvent.IntegrationDelete]: ['Integration', 'Delete'];
  [AuditLogEvent.StageInstanceCreate]: ['StageInstance', 'Create'];
  [AuditLogEvent.StageInstanceUpdate]: ['StageInstance', 'Update'];
  [AuditLogEvent.StageInstanceDelete]: ['StageInstance', 'Delete'];
  [AuditLogEvent.StickerCreate]: ['Sticker', 'Create'];
  [AuditLogEvent.StickerUpdate]: ['Sticker', 'Update'];
  [AuditLogEvent.StickerDelete]: ['Sticker', 'Delete'];
  [AuditLogEvent.GuildScheduledEventCreate]: ['GuildScheduledEvent', 'Create'];
  [AuditLogEvent.GuildScheduledEventUpdate]: ['GuildScheduledEvent', 'Update'];
  [AuditLogEvent.GuildScheduledEventDelete]: ['GuildScheduledEvent', 'Delete'];
  [AuditLogEvent.ThreadCreate]: ['Thread', 'Create'];
  [AuditLogEvent.ThreadUpdate]: ['Thread', 'Update'];
  [AuditLogEvent.ThreadDelete]: ['Thread', 'Delete'];
  [AuditLogEvent.ApplicationCommandPermissionUpdate]: ['ApplicationCommand', 'Update'];
}

export type GuildAuditLogsActionType = GuildAuditLogsTypes[keyof GuildAuditLogsTypes][1] | 'All';

export interface GuildAuditLogsEntryExtraField {
  [AuditLogEvent.MemberPrune]: { removed: number; days: number };
  [AuditLogEvent.MemberMove]: { channel: VoiceBasedChannel | { id: Snowflake }; count: number };
  [AuditLogEvent.MessageDelete]: { channel: GuildTextBasedChannel | { id: Snowflake }; count: number };
  [AuditLogEvent.MessageBulkDelete]: { channel: GuildTextBasedChannel | { id: Snowflake }; count: number };
  [AuditLogEvent.MessagePin]: { channel: GuildTextBasedChannel | { id: Snowflake }; messageId: Snowflake };
  [AuditLogEvent.MessageUnpin]: { channel: GuildTextBasedChannel | { id: Snowflake }; messageId: Snowflake };
  [AuditLogEvent.MemberDisconnect]: { count: number };
  [AuditLogEvent.ChannelOverwriteCreate]:
    | Role
    | GuildMember
    | { id: Snowflake; name: string; type: AuditLogOptionsType.Role }
    | { id: Snowflake; type: AuditLogOptionsType.Member };
  [AuditLogEvent.ChannelOverwriteUpdate]:
    | Role
    | GuildMember
    | { id: Snowflake; name: string; type: AuditLogOptionsType.Role }
    | { id: Snowflake; type: AuditLogOptionsType.Member };
  [AuditLogEvent.ChannelOverwriteDelete]:
    | Role
    | GuildMember
    | { id: Snowflake; name: string; type: AuditLogOptionsType.Role }
    | { id: Snowflake; type: AuditLogOptionsType.Member };
  [AuditLogEvent.StageInstanceCreate]: StageChannel | { id: Snowflake };
  [AuditLogEvent.StageInstanceDelete]: StageChannel | { id: Snowflake };
  [AuditLogEvent.StageInstanceUpdate]: StageChannel | { id: Snowflake };
  [AuditLogEvent.ApplicationCommandPermissionUpdate]: { applicationId: Snowflake };
}

export interface GuildAuditLogsEntryTargetField<TActionType extends GuildAuditLogsActionType> {
  User: User | null;
  Guild: Guild;
  Webhook: Webhook;
  Invite: Invite;
  Message: TActionType extends AuditLogEvent.MessageBulkDelete ? Guild | { id: Snowflake } : User;
  Integration: Integration;
  Channel: NonThreadGuildBasedChannel | { id: Snowflake; [x: string]: unknown };
  Thread: AnyThreadChannel | { id: Snowflake; [x: string]: unknown };
  StageInstance: StageInstance;
  Sticker: Sticker;
  GuildScheduledEvent: GuildScheduledEvent;
  ApplicationCommand: ApplicationCommand;
}

export interface GuildAuditLogsFetchOptions<T extends GuildAuditLogsResolvable> {
  before?: Snowflake | GuildAuditLogsEntry;
  limit?: number;
  user?: UserResolvable;
  type?: T;
}

export type GuildAuditLogsResolvable = AuditLogEvent | null;

export type GuildAuditLogsTargetType = GuildAuditLogsTypes[keyof GuildAuditLogsTypes][0] | 'All' | 'Unknown';

export type GuildAuditLogsTargets = {
  [key in GuildAuditLogsTargetType]: GuildAuditLogsTargetType;
};

export type GuildBanResolvable = GuildBan | UserResolvable;

export type GuildChannelResolvable = Snowflake | GuildBasedChannel;

export interface GuildChannelCreateOptions extends Omit<CategoryCreateChannelOptions, 'type'> {
  parent?: CategoryChannelResolvable | null;
  type?: Exclude<
    ChannelType,
    | ChannelType.DM
    | ChannelType.GroupDM
    | ChannelType.PublicThread
    | ChannelType.AnnouncementThread
    | ChannelType.PrivateThread
  >;
}

export interface GuildChannelCloneOptions extends Omit<GuildChannelCreateOptions, 'name'> {
  name?: string;
}

export interface GuildChannelEditOptions {
  name?: string;
  type?: ChannelType.GuildText | ChannelType.GuildAnnouncement;
  position?: number;
  topic?: string | null;
  nsfw?: boolean;
  bitrate?: number;
  userLimit?: number;
  parent?: CategoryChannelResolvable | null;
  rateLimitPerUser?: number;
  lockPermissions?: boolean;
  permissionOverwrites?: readonly OverwriteResolvable[] | Collection<Snowflake, OverwriteResolvable>;
  defaultAutoArchiveDuration?: ThreadAutoArchiveDuration;
  rtcRegion?: string | null;
  videoQualityMode?: VideoQualityMode | null;
  availableTags?: GuildForumTagData[];
  defaultReactionEmoji?: DefaultReactionEmoji | null;
  defaultThreadRateLimitPerUser?: number;
  flags?: ChannelFlagsResolvable;
  defaultSortOrder?: SortOrderType | null;
  reason?: string;
}

export interface GuildChannelOverwriteOptions {
  reason?: string;
  type?: OverwriteType;
}

export interface GuildCreateOptions {
  name: string;
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
  channel: TextChannel | NewsChannel | VoiceBasedChannel | ForumChannel | null;
}

export interface GuildEditData {
  name?: string;
  verificationLevel?: GuildVerificationLevel | null;
  explicitContentFilter?: GuildExplicitContentFilter | null;
  defaultMessageNotifications?: GuildDefaultMessageNotifications | null;
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
  preferredLocale?: Locale | null;
  premiumProgressBarEnabled?: boolean;
  description?: string | null;
  features?: `${GuildFeature}`[];
  reason?: string;
}

export interface GuildEmojiCreateOptions {
  attachment: BufferResolvable | Base64Resolvable;
  name: string;
  roles?: Collection<Snowflake, Role> | RoleResolvable[];
  reason?: string;
}

export interface GuildEmojiEditData {
  name?: string;
  roles?: Collection<Snowflake, Role> | RoleResolvable[];
  reason?: string;
}

export interface GuildStickerCreateOptions {
  file: BufferResolvable | Stream | AttachmentPayload | JSONEncodable<AttachmentBuilder>;
  name: string;
  tags: string;
  description?: string | null;
  reason?: string;
}

export interface GuildStickerEditData {
  name?: string;
  description?: string | null;
  tags?: string;
  reason?: string;
}

export interface GuildMemberEditData {
  nick?: string | null;
  roles?: Collection<Snowflake, Role> | readonly RoleResolvable[];
  mute?: boolean;
  deaf?: boolean;
  channel?: GuildVoiceChannelResolvable | null;
  communicationDisabledUntil?: DateResolvable | null;
  reason?: string;
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
  channel: TextChannel | NewsChannel | VoiceBasedChannel | ForumChannel | Snowflake | null;
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
  image?: BufferResolvable | Base64Resolvable | null;
  reason?: string;
}

export interface GuildScheduledEventEditOptions<
  S extends GuildScheduledEventStatus,
  T extends GuildScheduledEventSetStatusArg<S>,
> extends Omit<Partial<GuildScheduledEventCreateOptions>, 'channel'> {
  channel?: GuildVoiceChannelResolvable | null;
  status?: T;
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

export type CollectedInteraction<Cached extends CacheType = CacheType> =
  | StringSelectMenuInteraction<Cached>
  | UserSelectMenuInteraction<Cached>
  | RoleSelectMenuInteraction<Cached>
  | MentionableSelectMenuInteraction<Cached>
  | ChannelSelectMenuInteraction<Cached>
  | ButtonInteraction<Cached>
  | ModalSubmitInteraction<Cached>;

export interface InteractionCollectorOptions<T extends CollectedInteraction, Cached extends CacheType = CacheType>
  extends CollectorOptions<[T, Collection<Snowflake, T>]> {
  channel?: TextBasedChannelResolvable;
  componentType?: ComponentType;
  guild?: GuildResolvable;
  interactionType?: InteractionType;
  max?: number;
  maxComponents?: number;
  maxUsers?: number;
  message?: CacheTypeReducer<Cached, Message, APIMessage>;
  interactionResponse?: InteractionResponse<BooleanCache<Cached>>;
}

export interface InteractionDeferReplyOptions {
  ephemeral?: boolean;
  fetchResponse?: boolean;
}

export type InteractionDeferMessageUpdateOptions = Omit<InteractionDeferReplyOptions, 'ephemeral'>;

export interface InteractionReplyOptions extends BaseMessageOptions {
  tts?: boolean;
  ephemeral?: boolean;
  fetchResponse?: boolean;
  flags?: BitFieldResolvable<
    Extract<MessageFlagsString, 'Ephemeral' | 'SuppressEmbeds'>,
    MessageFlags.Ephemeral | MessageFlags.SuppressEmbeds
  >;
}

export interface InteractionUpdateMessageOptions extends MessageEditOptions {
  fetchResponse?: boolean;
}

export interface InviteGenerationOptions {
  permissions?: PermissionResolvable;
  guild?: GuildResolvable;
  disableGuildSelect?: boolean;
  scopes: OAuth2Scopes[];
}

export type GuildInvitableChannelResolvable = TextChannel | VoiceChannel | NewsChannel | StageChannel | Snowflake;

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

export type ActionRowComponentOptions =
  | ButtonComponentData
  | StringSelectMenuComponentData
  | UserSelectMenuComponentData
  | RoleSelectMenuComponentData
  | MentionableSelectMenuComponentData
  | ChannelSelectMenuComponentData;

export type MessageActionRowComponentResolvable = MessageActionRowComponent | ActionRowComponentOptions;

export interface MessageActivity {
  partyId?: string;
  type: MessageActivityType;
}

export interface BaseButtonComponentData extends BaseComponentData {
  style: ButtonStyle;
  disabled?: boolean;
  emoji?: ComponentEmojiResolvable;
  label?: string;
}

export interface LinkButtonComponentData extends BaseButtonComponentData {
  style: ButtonStyle.Link;
  url: string;
}

export interface InteractionButtonComponentData extends BaseButtonComponentData {
  style: Exclude<ButtonStyle, ButtonStyle.Link>;
  customId: string;
}

export type ButtonComponentData = InteractionButtonComponentData | LinkButtonComponentData;

export interface MessageCollectorOptions extends CollectorOptions<[Message, Collection<Snowflake, Message>]> {
  max?: number;
  maxProcessed?: number;
}

export type MessageComponent =
  | Component
  | ActionRowBuilder<MessageActionRowComponentBuilder | ModalActionRowComponentBuilder>
  | ButtonComponent
  | StringSelectMenuComponent
  | UserSelectMenuComponent
  | RoleSelectMenuComponent
  | MentionableSelectMenuComponent
  | ChannelSelectMenuComponent;

export type CollectedMessageInteraction<Cached extends CacheType = CacheType> = Exclude<
  CollectedInteraction<Cached>,
  ModalSubmitInteraction
>;

export type MessageComponentCollectorOptions<T extends CollectedMessageInteraction> = Omit<
  InteractionCollectorOptions<T>,
  'channel' | 'message' | 'guild' | 'interactionType'
>;

export type MessageChannelComponentCollectorOptions<T extends CollectedMessageInteraction> = Omit<
  InteractionCollectorOptions<T>,
  'channel' | 'guild' | 'interactionType'
>;

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

export interface BaseMessageOptions {
  content?: string;
  embeds?: (JSONEncodable<APIEmbed> | APIEmbed)[];
  allowedMentions?: MessageMentionOptions;
  files?: (
    | BufferResolvable
    | Stream
    | JSONEncodable<APIAttachment>
    | Attachment
    | AttachmentBuilder
    | AttachmentPayload
  )[];
  components?: (
    | JSONEncodable<APIActionRowComponent<APIMessageActionRowComponent>>
    | ActionRowData<MessageActionRowComponentData | MessageActionRowComponentBuilder>
    | APIActionRowComponent<APIMessageActionRowComponent>
  )[];
}

export interface MessageCreateOptions extends BaseMessageOptions {
  tts?: boolean;
  nonce?: string | number;
  reply?: ReplyOptions;
  stickers?: StickerResolvable[];
  flags?: BitFieldResolvable<Extract<MessageFlagsString, 'SuppressEmbeds'>, MessageFlags.SuppressEmbeds>;
}

export type GuildForumThreadMessageCreateOptions = BaseMessageOptions &
  Pick<MessageCreateOptions, 'flags' | 'stickers'>;

export interface MessageEditOptions extends Omit<BaseMessageOptions, 'content'> {
  content?: string | null;
  attachments?: JSONEncodable<AttachmentPayload>[];
  flags?: BitFieldResolvable<Extract<MessageFlagsString, 'SuppressEmbeds'>, MessageFlags.SuppressEmbeds>;
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

export interface BaseSelectMenuComponentData extends BaseComponentData {
  customId: string;
  disabled?: boolean;
  maxValues?: number;
  minValues?: number;
  placeholder?: string;
}

export interface StringSelectMenuComponentData extends BaseSelectMenuComponentData {
  type: ComponentType.StringSelect;
  options?: SelectMenuComponentOptionData[];
}

export interface UserSelectMenuComponentData extends BaseSelectMenuComponentData {
  type: ComponentType.UserSelect;
}

export interface RoleSelectMenuComponentData extends BaseSelectMenuComponentData {
  type: ComponentType.RoleSelect;
}

export interface MentionableSelectMenuComponentData extends BaseSelectMenuComponentData {
  type: ComponentType.MentionableSelect;
}

export interface ChannelSelectMenuComponentData extends BaseSelectMenuComponentData {
  type: ComponentType.ChannelSelect;
  channelTypes?: ChannelType[];
}

export interface MessageSelectOption {
  default: boolean;
  description: string | null;
  emoji: APIPartialEmoji | null;
  label: string;
  value: string;
}

export interface SelectMenuComponentOptionData {
  default?: boolean;
  description?: string;
  emoji?: ComponentEmojiResolvable;
  label: string;
  value: string;
}

export interface TextInputComponentData extends BaseComponentData {
  type: ComponentType.TextInput;
  customId: string;
  style: TextInputStyle;
  label: string;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  value?: string;
  placeholder?: string;
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
  type?: ChannelType.GuildText | ChannelType.GuildVoice | ChannelType.GuildCategory;
  name: string;
  topic?: string | null;
  nsfw?: boolean;
  bitrate?: number;
  userLimit?: number;
  rtcRegion?: string | null;
  videoQualityMode?: VideoQualityMode;
  permissionOverwrites?: PartialOverwriteData[];
  rateLimitPerUser?: number;
}

export type Partialize<
  T extends AllowedPartial,
  N extends keyof T | null = null,
  M extends keyof T | null = null,
  E extends keyof T | '' = '',
> = {
  readonly client: Client<true>;
  id: Snowflake;
  partial: true;
} & {
  [K in keyof Omit<T, 'client' | 'id' | 'partial' | E>]: K extends N ? null : K extends M ? T[K] | null : T[K];
};

export interface PartialDMChannel extends Partialize<DMChannel, null, null, 'lastMessageId'> {
  lastMessageId: undefined;
}

export interface PartialGuildMember extends Partialize<GuildMember, 'joinedAt' | 'joinedTimestamp' | 'pending'> {}

export interface PartialMessage
  extends Partialize<Message, 'type' | 'system' | 'pinned' | 'tts', 'content' | 'cleanContent' | 'author'> {}

export interface PartialMessageReaction extends Partialize<MessageReaction, 'count'> {}

export interface PartialThreadMember extends Partialize<ThreadMember, 'flags' | 'joinedAt' | 'joinedTimestamp'> {}

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
  ThreadMember,
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

export interface MessageReplyOptions extends Omit<MessageCreateOptions, 'reply'> {
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

export type StageInstanceResolvable = StageInstance | Snowflake;

export interface StartThreadOptions {
  name: string;
  autoArchiveDuration?: ThreadAutoArchiveDuration;
  reason?: string;
  rateLimitPerUser?: number;
}

export type ClientStatus = number;

export type StickerResolvable = Sticker | Snowflake;

export type SystemChannelFlagsResolvable = BitFieldResolvable<SystemChannelFlagsString, number>;

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
  threads: [Snowflake, AnyThreadChannel, true];
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

export type Channel =
  | CategoryChannel
  | DMChannel
  | PartialDMChannel
  | PartialGroupDMChannel
  | NewsChannel
  | StageChannel
  | TextChannel
  | AnyThreadChannel
  | VoiceChannel
  | ForumChannel;

export type TextBasedChannel = Exclude<
  Extract<Channel, { type: TextChannelType }>,
  PartialGroupDMChannel | ForumChannel
>;

export type TextBasedChannelTypes = TextBasedChannel['type'];

export type VoiceBasedChannel = Extract<Channel, { bitrate: number }>;

export type GuildBasedChannel = Extract<Channel, { guild: Guild }>;

export type CategoryChildChannel = Exclude<Extract<Channel, { parent: CategoryChannel | null }>, CategoryChannel>;

export type NonThreadGuildBasedChannel = Exclude<GuildBasedChannel, AnyThreadChannel>;

export type GuildTextBasedChannel = Exclude<Extract<GuildBasedChannel, TextBasedChannel>, ForumChannel>;

export type TextChannelResolvable = Snowflake | TextChannel;

export type TextBasedChannelResolvable = Snowflake | TextBasedChannel;

export type ThreadChannelResolvable = AnyThreadChannel | Snowflake;

export type ThreadChannelType = ChannelType.AnnouncementThread | ChannelType.PublicThread | ChannelType.PrivateThread;

export interface GuildTextThreadCreateOptions<AllowedThreadType> extends StartThreadOptions {
  startMessage?: MessageResolvable;
  type?: AllowedThreadType;
  invitable?: AllowedThreadType extends ChannelType.PrivateThread ? boolean : never;
}

export interface GuildForumThreadCreateOptions extends StartThreadOptions {
  message: GuildForumThreadMessageCreateOptions | MessagePayload;
  appliedTags?: Snowflake[];
}

export interface ThreadEditData {
  name?: string;
  archived?: boolean;
  autoArchiveDuration?: ThreadAutoArchiveDuration;
  rateLimitPerUser?: number;
  locked?: boolean;
  invitable?: boolean;
  appliedTags?: Snowflake[];
  flags?: ChannelFlagsResolvable;
  reason?: string;
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

export interface VoiceStateEditData {
  requestToSpeak?: boolean;
  suppressed?: boolean;
}

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
  reason?: string;
}

export interface WebhookEditMessageOptions extends Omit<MessageEditOptions, 'flags'> {
  threadId?: Snowflake;
}

export interface InteractionEditResponseOptions extends WebhookEditMessageOptions {
  message?: MessageResolvable | '@original';
}

export interface WebhookFetchMessageOptions {
  threadId?: Snowflake;
}

export interface WebhookCreateMessageOptions extends Omit<MessageCreateOptions, 'nonce' | 'reply' | 'stickers'> {
  username?: string;
  avatarURL?: string;
  threadId?: Snowflake;
  threadName?: string;
}

export interface WebSocketOptions {
  large_threshold?: number;
  compress?: boolean;
  properties?: WebSocketProperties;
  version?: number;
}

export interface WebSocketProperties {
  os?: string;
  browser?: string;
  device?: string;
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
  channel: TextChannel | NewsChannel | ForumChannel | Snowflake;
  emoji?: EmojiIdentifierResolvable;
}

export interface WelcomeScreenEditData {
  enabled?: boolean;
  description?: string;
  welcomeChannels?: WelcomeChannelData[];
}

export interface ClientApplicationInstallParams {
  scopes: OAuth2Scopes[];
  permissions: Readonly<PermissionsBitField>;
}

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
export * from 'discord-api-types/v10';
export * from '@discordjs/builders';
export * from '@discordjs/rest';
export * from '@discordjs/util';
