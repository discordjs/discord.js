import { Buffer } from 'node:buffer';
import { ChildProcess } from 'node:child_process';
import { Stream } from 'node:stream';
import { MessagePort, Worker } from 'node:worker_threads';
import { ApplicationCommandOptionAllowedChannelType, MessageActionRowComponentBuilder } from '@discordjs/builders';
import { Collection, ReadonlyCollection } from '@discordjs/collection';
import { BaseImageURLOptions, ImageURLOptions, RawFile, REST, RESTOptions, EmojiURLOptions } from '@discordjs/rest';
import { Awaitable, JSONEncodable } from '@discordjs/util';
import { WebSocketManager, WebSocketManagerOptions } from '@discordjs/ws';
import { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
import {
  ActivityFlags,
  ActivityType,
  APIActionRowComponent,
  APIApplicationCommand,
  APIApplicationCommandInteractionData,
  APIApplicationCommandOption,
  APIApplicationRoleConnectionMetadata,
  APIAttachment,
  APIAuditLog,
  APIAuditLogChange,
  APIAuditLogEntry,
  APIAuthorizingIntegrationOwnersMap,
  APIAutoModerationRule,
  APIButtonComponent,
  APIChannel,
  APIChannelSelectComponent,
  APIComponentInActionRow,
  APIComponentInContainer,
  APIComponentInMessageActionRow,
  APIComponentInModalActionRow,
  APIContainerComponent,
  APIEmbed,
  APIEmbedField,
  APIEmbedProvider,
  APIEmoji,
  APIEntitlement,
  APIFileComponent,
  APIGuild,
  APIGuildIntegration,
  APIGuildMember,
  APIGuildOnboardingPrompt,
  APIGuildOnboardingPromptOption,
  APIGuildPreview,
  APIGuildScheduledEvent,
  APIGuildWelcomeScreen,
  APIGuildWelcomeScreenChannel,
  APIGuildWidget,
  APIGuildWidgetMember,
  APIInteractionDataResolvedChannel,
  APIInteractionDataResolvedGuildMember,
  APIInteractionGuildMember,
  APILabelComponent,
  APIMediaGalleryComponent,
  APIMediaGalleryItem,
  APIMentionableSelectComponent,
  APIMessage,
  APIMessageButtonInteractionData,
  APIMessageChannelSelectInteractionData,
  APIMessageComponent,
  APIMessageComponentEmoji,
  APIMessageComponentInteraction,
  APIMessageMentionableSelectInteractionData,
  APIMessageRoleSelectInteractionData,
  APIMessageStringSelectInteractionData,
  APIMessageTopLevelComponent,
  APIMessageUserSelectInteractionData,
  APIModalComponent,
  APIModalInteractionResponseCallbackComponent,
  APIModalInteractionResponseCallbackData,
  APIModalSubmitInteraction,
  APIOverwrite,
  APIPartialChannel,
  APIPartialEmoji,
  APIPartialGuild,
  APIPoll,
  APIPollAnswer,
  APIRole,
  APIRoleSelectComponent,
  APISectionComponent,
  APISelectMenuComponent,
  APISelectMenuDefaultValue,
  APISelectMenuOption,
  APISeparatorComponent,
  APISKU,
  APISoundboardSound,
  APIStickerPack,
  APIStringSelectComponent,
  APISubscription,
  APITeam,
  APITeamMember,
  APITemplate,
  APITemplateSerializedSourceGuild,
  APITextDisplayComponent,
  APITextInputComponent,
  APIThreadMember,
  APIThumbnailComponent,
  APIUnavailableGuild,
  APIUnfurledMediaItem,
  APIUser,
  APIUserSelectComponent,
  APIVoiceRegion,
  ApplicationCommandOptionType,
  ApplicationCommandPermissionType,
  ApplicationCommandType,
  ApplicationFlags,
  ApplicationIntegrationType,
  ApplicationRoleConnectionMetadataType,
  ApplicationWebhookEventStatus,
  ApplicationWebhookEventType,
  AttachmentFlags,
  AuditLogEvent,
  AuditLogOptionsType,
  AuditLogRuleTriggerType,
  AutoModerationActionType,
  AutoModerationRuleEventType,
  AutoModerationRuleKeywordPresetType,
  AutoModerationRuleTriggerType,
  ButtonStyle,
  ChannelFlags,
  ChannelType,
  ComponentType,
  EmbedType,
  EntitlementType,
  EntryPointCommandHandlerType,
  FormattingPatterns,
  ForumLayoutType,
  GatewayActivity,
  GatewayActivityAssets,
  GatewayAutoModerationActionExecutionDispatchData,
  GatewayDispatchPayload,
  GatewayIntentBits,
  GatewayInteractionCreateDispatchData,
  GatewayMessageUpdateDispatchData,
  GatewayPresenceUpdate,
  GatewaySendPayload,
  GatewayTypingStartDispatchData,
  GatewayVoiceChannelEffectSendDispatchData,
  GatewayVoiceServerUpdateDispatchData,
  GatewayVoiceStateUpdateDispatchData,
  GuildDefaultMessageNotifications,
  GuildExplicitContentFilter,
  GuildFeature,
  GuildMemberFlags,
  GuildMFALevel,
  GuildNSFWLevel,
  GuildOnboardingMode,
  GuildOnboardingPromptType,
  GuildPremiumTier,
  GuildScheduledEventEntityType,
  GuildScheduledEventPrivacyLevel,
  GuildScheduledEventRecurrenceRuleFrequency,
  GuildScheduledEventRecurrenceRuleMonth,
  GuildScheduledEventRecurrenceRuleWeekday,
  GuildScheduledEventStatus,
  GuildSystemChannelFlags,
  GuildVerificationLevel,
  GuildWidgetStyle,
  ImageFormat,
  IntegrationExpireBehavior,
  InteractionContextType,
  InteractionResponseType,
  InteractionType,
  InviteFlags,
  InviteTargetType,
  InviteType,
  Locale,
  LocalizationMap,
  MessageActivityType,
  MessageFlags,
  MessageReferenceType,
  MessageType,
  NameplatePalette,
  OAuth2Scopes,
  OverwriteType,
  PermissionFlagsBits,
  PollLayoutType,
  ReactionType,
  RESTAPIInteractionCallbackActivityInstanceResource,
  RESTAPIInteractionCallbackObject,
  RESTAPIInteractionCallbackResourceObject,
  RESTAPIPartialCurrentUserGuild,
  RESTAPIPoll,
  RESTGetAPIGuildOnboardingResult,
  RESTGetAPIGuildThreadsResult,
  RESTPatchAPIChannelMessageJSONBody,
  RESTPatchAPIInteractionFollowupJSONBody,
  RESTPatchAPIInteractionOriginalResponseJSONBody,
  RESTPatchAPIWebhookWithTokenJSONBody,
  RESTPostAPIApplicationCommandsJSONBody,
  RESTPostAPIChannelMessageJSONBody,
  RESTPostAPIInteractionCallbackFormDataBody,
  RESTPostAPIInteractionCallbackWithResponseResult,
  RESTPostAPIInteractionFollowupJSONBody,
  RESTPostAPIWebhookWithTokenJSONBody,
  RoleFlags,
  SelectMenuDefaultValueType,
  SeparatorSpacingSize,
  SKUFlags,
  SKUType,
  Snowflake,
  SortOrderType,
  StageInstancePrivacyLevel,
  StickerFormatType,
  StickerType,
  SubscriptionStatus,
  TeamMemberMembershipState,
  TeamMemberRole,
  TextChannelType,
  TextInputStyle,
  ThreadAutoArchiveDuration,
  ThreadChannelType,
  ThreadMemberFlags,
  UserFlags,
  VideoQualityMode,
  VoiceChannelEffectSendAnimationType,
  WebhookType,
} from 'discord-api-types/v10';

// #region Classes

export class Activity {
  private constructor(presence: Presence, data?: GatewayActivity);
  public readonly presence: Presence;
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
  public syncId: string | null;
  public timestamps: {
    end: Date | null;
    start: Date | null;
  } | null;
  public type: ActivityType;
  public url: string | null;
  public equals(activity: Activity): boolean;
  public toString(): string;
}

export type ActivityFlagsString = keyof typeof ActivityFlags;

export interface BaseComponentData {
  id?: number;
  type: ComponentType;
}

export type MessageActionRowComponentData =
  | ButtonComponentData
  | ChannelSelectMenuComponentData
  | JSONEncodable<APIComponentInMessageActionRow>
  | MentionableSelectMenuComponentData
  | RoleSelectMenuComponentData
  | StringSelectMenuComponentData
  | UserSelectMenuComponentData;

export type ActionRowComponentData = MessageActionRowComponentData;

export type ActionRowComponent = MessageActionRowComponent;

export interface ActionRowData<ComponentType extends ActionRowComponentData | JSONEncodable<APIComponentInActionRow>>
  extends BaseComponentData {
  components: readonly ComponentType[];
}

export type ComponentInLabelData =
  | ChannelSelectMenuComponentData
  | MentionableSelectMenuComponentData
  | RoleSelectMenuComponentData
  | StringSelectMenuComponentData
  | TextInputComponentData
  | UserSelectMenuComponentData;
export interface LabelData extends BaseComponentData {
  component: ComponentInLabelData;
  description?: string;
  label: string;
}

export type MessageActionRowComponent =
  | ButtonComponent
  | ChannelSelectMenuComponent
  | MentionableSelectMenuComponent
  | RoleSelectMenuComponent
  | StringSelectMenuComponent
  | UserSelectMenuComponent;

export class ActionRow<ComponentType extends MessageActionRowComponent> extends Component<
  APIActionRowComponent<APIComponentInMessageActionRow>
> {
  private constructor(data: APIActionRowComponent<APIComponentInMessageActionRow>);
  public readonly components: ComponentType[];
  public toJSON(): APIActionRowComponent<ReturnType<ComponentType['toJSON']>>;
}

export class ActivityFlagsBitField extends BitField<ActivityFlagsString> {
  public static Flags: typeof ActivityFlags;
  public static resolve(bit?: BitFieldResolvable<ActivityFlagsString, number>): number;
}

export abstract class AnonymousGuild extends BaseGuild {
  protected constructor(client: Client<true>, data: unknown, immediatePatch?: boolean);
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

export class AutoModerationActionExecution {
  private constructor(data: GatewayAutoModerationActionExecutionDispatchData, guild: Guild);
  public guild: Guild;
  public action: AutoModerationAction;
  public ruleId: Snowflake;
  public ruleTriggerType: AutoModerationRuleTriggerType;
  public get user(): User | null;
  public userId: Snowflake;
  public get channel(): ForumChannel | GuildTextBasedChannel | MediaChannel | null;
  public channelId: Snowflake | null;
  public get member(): GuildMember | null;
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
  public setEventType(eventType: AutoModerationRuleEventType, reason?: string): Promise<AutoModerationRule>;
  public setKeywordFilter(keywordFilter: readonly string[], reason?: string): Promise<AutoModerationRule>;
  public setRegexPatterns(regexPatterns: readonly string[], reason?: string): Promise<AutoModerationRule>;
  public setPresets(
    presets: readonly AutoModerationRuleKeywordPresetType[],
    reason?: string,
  ): Promise<AutoModerationRule>;
  public setAllowList(allowList: readonly string[], reason?: string): Promise<AutoModerationRule>;
  public setMentionTotalLimit(mentionTotalLimit: number, reason?: string): Promise<AutoModerationRule>;
  public setMentionRaidProtectionEnabled(
    mentionRaidProtectionEnabled: boolean,
    reason?: string,
  ): Promise<AutoModerationRule>;
  public setActions(actions: readonly AutoModerationActionOptions[], reason?: string): Promise<AutoModerationRule>;
  public setEnabled(enabled?: boolean, reason?: string): Promise<AutoModerationRule>;
  public setExemptRoles(
    roles: ReadonlyCollection<Snowflake, Role> | readonly RoleResolvable[],
    reason?: string,
  ): Promise<AutoModerationRule>;
  public setExemptChannels(
    channels: ReadonlyCollection<Snowflake, GuildBasedChannel> | readonly GuildChannelResolvable[],
    reason?: string,
  ): Promise<AutoModerationRule>;
}

export abstract class Application extends Base {
  protected constructor(client: Client<true>, data: unknown);
  public get createdAt(): Date;
  public get createdTimestamp(): number;
  public description: string | null;
  public icon: string | null;
  public id: Snowflake;
  public name: string | null;
  public termsOfServiceURL: string | null;
  public privacyPolicyURL: string | null;
  public rpcOrigins: string[];
  public cover: string | null;
  public verifyKey: string | null;
  public coverURL(options?: ImageURLOptions): string | null;
  public iconURL(options?: ImageURLOptions): string | null;
  public toJSON(): unknown;
  public toString(): string | null;
}

export class ApplicationCommand<PermissionsFetchType = {}> extends Base {
  private constructor(client: Client<true>, data: APIApplicationCommand, guild?: Guild, guildId?: Snowflake);
  public applicationId: Snowflake;
  public contexts: InteractionContextType[] | null;
  public get createdAt(): Date;
  public get createdTimestamp(): number;
  public defaultMemberPermissions: Readonly<PermissionsBitField> | null;
  public description: string;
  public descriptionLocalizations: LocalizationMap | null;
  public descriptionLocalized: string | null;
  public guild: Guild | null;
  public guildId: Snowflake | null;
  public get manager(): ApplicationCommandManager;
  public id: Snowflake;
  public integrationTypes: ApplicationIntegrationType[] | null;
  public handler: EntryPointCommandHandlerType | null;
  public name: string;
  public nameLocalizations: LocalizationMap | null;
  public nameLocalized: string | null;
  public options: (ApplicationCommandOption & { descriptionLocalized?: string; nameLocalized?: string })[];
  public permissions: ApplicationCommandPermissionsManager<
    PermissionsFetchType,
    PermissionsFetchType,
    Guild | null,
    Snowflake
  >;
  public type: ApplicationCommandType;
  public version: Snowflake;
  public nsfw: boolean;
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
  public setOptions(
    options: readonly ApplicationCommandOptionData[],
  ): Promise<ApplicationCommand<PermissionsFetchType>>;
  public equals(
    command: APIApplicationCommand | ApplicationCommand | ApplicationCommandData,
    enforceOptionOrder?: boolean,
  ): boolean;
  public static optionsEqual(
    existing: readonly ApplicationCommandOption[],
    options:
      | readonly APIApplicationCommandOption[]
      | readonly ApplicationCommandOption[]
      | readonly ApplicationCommandOptionData[],
    enforceOptionOrder?: boolean,
  ): boolean;
  private static _optionEquals(
    existing: ApplicationCommandOption,
    options: APIApplicationCommandOption | ApplicationCommandOption | ApplicationCommandOptionData,
    enforceOptionOrder?: boolean,
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
  public type: ApplicationRoleConnectionMetadataType;
}

export type ApplicationResolvable = Activity | Application | Snowflake;

export class ApplicationFlagsBitField extends BitField<ApplicationFlagsString> {
  public static Flags: typeof ApplicationFlags;
  public static resolve(bit?: BitFieldResolvable<ApplicationFlagsString, number>): number;
}

export type ApplicationFlagsResolvable = BitFieldResolvable<ApplicationFlagsString, number>;

export type AutoModerationRuleResolvable = AutoModerationRule | Snowflake;

export abstract class Base {
  public constructor(client: Client<true>);
  public readonly client: Client<true>;
  public toJSON(...props: Record<string, boolean | string>[]): unknown;
  public valueOf(): string;
}

export class BaseClient<Events extends {}> extends AsyncEventEmitter<Events> implements AsyncDisposable {
  public constructor(options?: ClientOptions | WebhookClientOptions);
  private decrementMaxListeners(): void;
  private incrementMaxListeners(): void;

  public options: ClientOptions | WebhookClientOptions;
  public rest: REST;
  public destroy(): void;
  public toJSON(...props: Record<string, boolean | string>[]): unknown;
  public [Symbol.asyncDispose](): Promise<void>;
}

export type GuildCacheMessage<Cached extends CacheType> = CacheTypeReducer<
  Cached,
  Message<true>,
  APIMessage,
  APIMessage | Message,
  APIMessage | Message
>;

export type BooleanCache<Cached extends CacheType> = Cached extends 'cached' ? true : false;

export abstract class CommandInteraction<Cached extends CacheType = CacheType> extends BaseInteraction<Cached> {
  public type: InteractionType.ApplicationCommand;
  public get command(): ApplicationCommand | ApplicationCommand<{ guild: GuildResolvable }> | null;
  public channelId: Snowflake;
  public commandId: Snowflake;
  public commandName: string;
  public commandType: ApplicationCommandType;
  public commandGuildId: Snowflake | null;
  public deferred: boolean;
  public ephemeral: boolean | null;
  public replied: boolean;
  public webhook: InteractionWebhook;
  public inGuild(): this is CommandInteraction<'cached' | 'raw'>;
  public inCachedGuild(): this is CommandInteraction<'cached'>;
  public inRawGuild(): this is CommandInteraction<'raw'>;
  public deferReply(
    options: InteractionDeferReplyOptions & { withResponse: true },
  ): Promise<InteractionCallbackResponse<BooleanCache<Cached>>>;
  public deferReply(options?: InteractionDeferReplyOptions & { withResponse: false }): Promise<undefined>;
  public deferReply(
    options?: InteractionDeferReplyOptions,
  ): Promise<InteractionCallbackResponse<BooleanCache<Cached>> | undefined>;
  public deleteReply(message?: MessageResolvable | '@original'): Promise<void>;
  public editReply(
    options: InteractionEditReplyOptions | MessagePayload | string,
  ): Promise<Message<BooleanCache<Cached>>>;
  public fetchReply(message?: Snowflake | '@original'): Promise<Message<BooleanCache<Cached>>>;
  public followUp(options: InteractionReplyOptions | MessagePayload | string): Promise<Message<BooleanCache<Cached>>>;
  public reply(
    options: InteractionReplyOptions & { withResponse: true },
  ): Promise<InteractionCallbackResponse<BooleanCache<Cached>>>;
  public reply(options: InteractionReplyOptions & { withResponse: false }): Promise<undefined>;
  public reply(
    options: InteractionReplyOptions | MessagePayload | string,
  ): Promise<InteractionCallbackResponse<BooleanCache<Cached>> | undefined>;
  public launchActivity(
    options: LaunchActivityOptions & { withResponse: true },
  ): Promise<InteractionCallbackResponse<BooleanCache<Cached>>>;
  public launchActivity(options?: LaunchActivityOptions & { withResponse?: false }): Promise<undefined>;
  public launchActivity(
    options?: LaunchActivityOptions,
  ): Promise<InteractionCallbackResponse<BooleanCache<Cached>> | undefined>;
  public showModal(
    modal:
      | APIModalInteractionResponseCallbackData
      | JSONEncodable<APIModalInteractionResponseCallbackData>
      | ModalComponentData,
    options: ShowModalOptions & { withResponse: true },
  ): Promise<InteractionCallbackResponse<BooleanCache<Cached>>>;
  public showModal(
    modal:
      | APIModalInteractionResponseCallbackData
      | JSONEncodable<APIModalInteractionResponseCallbackData>
      | ModalComponentData,
    options?: ShowModalOptions & { withResponse: false },
  ): Promise<undefined>;
  public showModal(
    modal:
      | APIModalInteractionResponseCallbackData
      | JSONEncodable<APIModalInteractionResponseCallbackData>
      | ModalComponentData,
    options?: ShowModalOptions,
  ): Promise<InteractionCallbackResponse<BooleanCache<Cached>> | undefined>;
  public awaitModalSubmit(options: AwaitModalSubmitOptions): Promise<ModalSubmitInteraction<Cached>>;
  private transformOption(
    option: APIApplicationCommandOption,
    resolved: Extract<APIApplicationCommandInteractionData, { resolved: any }>['resolved'],
  ): CommandInteractionOption<Cached>;
}

export abstract class BaseGuild extends Base {
  protected constructor(client: Client<true>, data: unknown);
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
  protected constructor(client: Client<true>, data: APIEmoji, guild: Guild | GuildPreview);
  public imageURL(options?: EmojiURLOptions): string;
  public available: boolean | null;
  public get createdAt(): Date;
  public get createdTimestamp(): number;
  public guild: Guild | GuildPreview;
  public id: Snowflake;
  public name: string;
  public animated: boolean;
  public managed: boolean;
  public requiresColons: boolean | null;
}

export interface BaseGuildTextChannel
  extends TextBasedChannelFields<true>,
    PinnableChannelFields,
    WebhookChannelFields,
    BulkDeleteMethod,
    SetRateLimitPerUserMethod,
    MessageChannelFields,
    SendMethod<true> {}
export class BaseGuildTextChannel extends GuildChannel {
  protected constructor(guild: Guild, data?: RawGuildChannelData, client?: Client<true>, immediatePatch?: boolean);
  public defaultAutoArchiveDuration?: ThreadAutoArchiveDuration;
  public defaultThreadRateLimitPerUser: number | null;
  public rateLimitPerUser: number | null;
  public nsfw: boolean;
  public threads: GuildTextThreadManager<AllowedThreadTypeForAnnouncementChannel | AllowedThreadTypeForTextChannel>;
  public topic: string | null;
  public createInvite(options?: InviteCreateOptions): Promise<GuildInvite>;
  public fetchInvites(cache?: boolean): Promise<Collection<string, GuildInvite>>;
  public setDefaultAutoArchiveDuration(
    defaultAutoArchiveDuration: ThreadAutoArchiveDuration,
    reason?: string,
  ): Promise<this>;
  public setTopic(topic: string | null, reason?: string): Promise<this>;
  public setType(type: ChannelType.GuildText, reason?: string): Promise<TextChannel>;
  public setType(type: ChannelType.GuildAnnouncement, reason?: string): Promise<AnnouncementChannel>;
}

export interface BaseGuildVoiceChannel
  extends TextBasedChannelFields<true>,
    WebhookChannelFields,
    BulkDeleteMethod,
    SetRateLimitPerUserMethod,
    MessageChannelFields,
    SendMethod<true> {}
export class BaseGuildVoiceChannel extends GuildChannel {
  public constructor(guild: Guild, data?: RawGuildChannelData);
  public bitrate: number;
  public get full(): boolean;
  public get joinable(): boolean;
  public get members(): Collection<Snowflake, GuildMember>;
  public nsfw: boolean;
  public rateLimitPerUser: number | null;
  public rtcRegion: string | null;
  public userLimit: number;
  public videoQualityMode: VideoQualityMode | null;
  public createInvite(options?: InviteCreateOptions): Promise<GuildInvite>;
  public fetchInvites(cache?: boolean): Promise<Collection<string, GuildInvite>>;
  public setBitrate(bitrate: number, reason?: string): Promise<this>;
  public setRTCRegion(rtcRegion: string | null, reason?: string): Promise<this>;
  public setUserLimit(userLimit: number, reason?: string): Promise<this>;
  public setVideoQualityMode(videoQualityMode: VideoQualityMode, reason?: string): Promise<this>;
}

export type EnumLike<Enum, Value> = Record<keyof Enum, Value>;

export class BitField<Flags extends string, Type extends bigint | number = number> {
  public constructor(bits?: BitFieldResolvable<Flags, Type>);
  public bitfield: Type;
  public add(...bits: BitFieldResolvable<Flags, Type>[]): BitField<Flags, Type>;
  public any(bit: BitFieldResolvable<Flags, Type>): boolean;
  public equals(bit: BitFieldResolvable<Flags, Type>): boolean;
  public freeze(): Readonly<BitField<Flags, Type>>;
  public has(bit: BitFieldResolvable<Flags, Type>): boolean;
  public missing(bits: BitFieldResolvable<Flags, Type>, ...hasParams: readonly unknown[]): Flags[];
  public remove(...bits: BitFieldResolvable<Flags, Type>[]): BitField<Flags, Type>;
  public serialize(...hasParams: readonly unknown[]): Record<Flags, boolean>;
  public toArray(...hasParams: readonly unknown[]): Flags[];
  public toJSON(): Type extends number ? number : string;
  public valueOf(): Type;
  public [Symbol.iterator](): IterableIterator<Flags>;
  public static Flags: EnumLike<unknown, bigint | number>;
  public static resolve(bit?: BitFieldResolvable<string, bigint | number>): bigint | number;
}

export class ButtonInteraction<Cached extends CacheType = CacheType> extends MessageComponentInteraction<Cached> {
  private constructor(client: Client<true>, data: APIMessageButtonInteractionData);
  public componentType: ComponentType.Button;
  public get component(): CacheTypeReducer<
    Cached,
    ButtonComponent,
    APIButtonComponent,
    APIButtonComponent | ButtonComponent,
    APIButtonComponent | ButtonComponent
  >;
  public inGuild(): this is ButtonInteraction<'cached' | 'raw'>;
  public inCachedGuild(): this is ButtonInteraction<'cached'>;
  public inRawGuild(): this is ButtonInteraction<'raw'>;
}

export type AnyComponent =
  | AnyComponentV2
  | APIActionRowComponent<APIComponentInMessageActionRow | APIComponentInModalActionRow>
  | APIMessageComponent
  | APIModalComponent;

export class Component<RawComponentData extends AnyComponent = AnyComponent> {
  public readonly data: Readonly<RawComponentData>;
  public get id(): RawComponentData['id'];
  public get type(): RawComponentData['type'];
  public toJSON(): RawComponentData;
  public equals(other: RawComponentData | this): boolean;
}

export type AnyComponentV2 = APIComponentInContainer | APIContainerComponent | APIThumbnailComponent;

export type TopLevelComponent =
  | ActionRow<MessageActionRowComponent>
  | ContainerComponent
  | FileComponent
  | MediaGalleryComponent
  | SectionComponent
  | SeparatorComponent
  | TextDisplayComponent;

export type TopLevelComponentData =
  | ActionRowData<MessageActionRowComponentData>
  | ContainerComponentData
  | FileComponentData
  | MediaGalleryComponentData
  | SectionComponentData
  | SeparatorComponentData
  | TextDisplayComponentData;

export class ButtonComponent extends Component<APIButtonComponent> {
  private constructor(data: APIButtonComponent);
  public get style(): ButtonStyle;
  public get label(): string | null;
  public get emoji(): APIMessageComponentEmoji | null;
  public get disabled(): boolean;
  public get customId(): string | null;
  public get url(): string | null;
}

export type ComponentEmojiResolvable = APIMessageComponentEmoji | string;

export class TextInputComponent extends Component<APITextInputComponent> {
  public get customId(): string;
  public get value(): string;
}

export class LabelComponent extends Component<APILabelComponent> {
  public component: StringSelectMenuComponent | TextInputComponent;
  public get label(): string;
  public get description(): string | null;
}

export class BaseSelectMenuComponent<Data extends APISelectMenuComponent> extends Component<Data> {
  protected constructor(data: Data);
  public get placeholder(): string | null;
  public get maxValues(): number | null;
  public get minValues(): number | null;
  public get customId(): string;
  public get disabled(): boolean;
}

export class StringSelectMenuComponent extends BaseSelectMenuComponent<APIStringSelectComponent> {
  public get options(): APISelectMenuOption[];
}

export class UserSelectMenuComponent extends BaseSelectMenuComponent<APIUserSelectComponent> {}

export class RoleSelectMenuComponent extends BaseSelectMenuComponent<APIRoleSelectComponent> {}

export class MentionableSelectMenuComponent extends BaseSelectMenuComponent<APIMentionableSelectComponent> {}

export class ChannelSelectMenuComponent extends BaseSelectMenuComponent<APIChannelSelectComponent> {
  public getChannelTypes(): ChannelType[] | null;
}

export interface EmbedData {
  author?: EmbedAuthorData;
  color?: number;
  description?: string;
  fields?: readonly APIEmbedField[];
  footer?: EmbedFooterData;
  image?: EmbedAssetData;
  provider?: APIEmbedProvider;
  thumbnail?: EmbedAssetData;
  timestamp?: Date | number | string;
  title?: string;
  type?: EmbedType;
  url?: string;
  video?: EmbedAssetData;
}

export interface IconData {
  iconURL?: string;
  proxyIconURL?: string;
}

export interface EmbedAuthorData extends IconData {
  name: string;
  url?: string;
}

export interface EmbedFooterData extends IconData {
  text: string;
}

export interface EmbedAssetData {
  height?: number;
  proxyURL?: string;
  url: string;
  width?: number;
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
  public equals(other: APIEmbed | Embed): boolean;
  public toJSON(): APIEmbed;
}

export interface MappedChannelCategoryTypes {
  [ChannelType.GuildAnnouncement]: AnnouncementChannel;
  [ChannelType.GuildVoice]: VoiceChannel;
  [ChannelType.GuildText]: TextChannel;
  [ChannelType.GuildStageVoice]: StageChannel;
  [ChannelType.GuildForum]: ForumChannel;
  [ChannelType.GuildMedia]: MediaChannel;
}

export type CategoryChannelChildTypes =
  | ChannelType.GuildAnnouncement
  | ChannelType.GuildForum
  | ChannelType.GuildMedia
  | ChannelType.GuildStageVoice
  | ChannelType.GuildText
  | ChannelType.GuildVoice;

export class CategoryChannel extends GuildChannel {
  public get children(): CategoryChannelChildManager;
  public type: ChannelType.GuildCategory;
  public get parent(): null;
  public parentId: null;
}

export type CategoryChannelResolvable = CategoryChannel | Snowflake;

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
  public isDMBased(): this is DMChannel | PartialDMChannel | PartialGroupDMChannel;
  public isVoiceBased(): this is VoiceBasedChannel;
  public isThreadOnly(): this is ThreadOnlyChannel;
  public isSendable(): this is SendableChannels;
  public toString(): ChannelMention | UserMention;
}

export type RawChannelData =
  | RawDMChannelData
  | RawGuildChannelData
  | RawPartialGroupDMChannelData
  | RawThreadChannelData;

export type RawGuildChannelData = APIChannel | APIInteractionDataResolvedChannel | Required<APIPartialChannel>;
export type RawThreadChannelData = APIChannel | APIInteractionDataResolvedChannel;
export type RawDMChannelData = APIChannel | APIInteractionDataResolvedChannel;
export type RawPartialGroupDMChannelData = APIChannel | Required<APIPartialChannel>;

export type If<Value extends boolean, TrueResult, FalseResult = null> = Value extends true
  ? TrueResult
  : Value extends false
    ? FalseResult
    : FalseResult | TrueResult;

export class Client<Ready extends boolean = boolean> extends BaseClient<ClientEventTypes> {
  public constructor(options: ClientOptions);
  private readonly actions: unknown;
  private readonly expectedGuilds: Set<Snowflake>;
  private readonly packetQueue: unknown[];
  private readonly presence: ClientPresence;
  private readonly pings: Collection<number, number>;
  private readonly readyTimeout: NodeJS.Timeout | null;
  private _broadcast(packet: GatewaySendPayload): void;
  private _eval(script: string): unknown;
  private _handlePacket(packet?: GatewayDispatchPayload, shardId?: number): boolean;
  private _checkReady(): void;
  private _triggerClientReady(): void;
  private _validateOptions(options: ClientOptions): void;
  private get _censoredToken(): string | null;
  // This a technique used to brand the ready state. Or else we'll get `never` errors on typeguard checks.
  private readonly _ready: Ready;

  public application: If<Ready, ClientApplication>;
  public channels: ChannelManager;
  public guilds: GuildManager;
  public lastPingTimestamps: ReadonlyCollection<number, number>;
  public options: ClientOptions & { intents: IntentsBitField };
  public get ping(): number | null;
  public get readyAt(): If<Ready, Date>;
  public readyTimestamp: If<Ready, number>;
  public sweepers: Sweepers;
  public shard: ShardClientUtil | null;
  public status: Status;
  public token: If<Ready, string, string | null>;
  public get uptime(): If<Ready, number>;
  public user: If<Ready, ClientUser>;
  public users: UserManager;
  public voice: ClientVoiceManager;
  public ws: WebSocketManager;

  public destroy(): Promise<void>;
  public deleteWebhook(id: Snowflake, options?: WebhookDeleteOptions): Promise<void>;
  public fetchGuildPreview(guild: GuildResolvable): Promise<GuildPreview>;
  public fetchInvite(
    invite: InviteResolvable,
    options: ClientFetchInviteOptions & { withCounts: true },
  ): Promise<Invite<true>>;
  public fetchInvite(invite: InviteResolvable, options?: ClientFetchInviteOptions): Promise<Invite>;
  public fetchGuildTemplate(template: GuildTemplateResolvable): Promise<GuildTemplate>;
  public fetchVoiceRegions(): Promise<Collection<string, VoiceRegion>>;
  public fetchSticker(id: Snowflake): Promise<Sticker>;
  public fetchStickerPacks(options: { packId: Snowflake }): Promise<StickerPack>;
  public fetchStickerPacks(options?: StickerPackFetchOptions): Promise<Collection<Snowflake, StickerPack>>;
  public fetchDefaultSoundboardSounds(): Promise<Collection<string, DefaultSoundboardSound>>;
  public fetchWebhook(id: Snowflake, token?: string): Promise<Webhook>;
  public fetchGuildWidget(guild: GuildResolvable): Promise<Widget>;
  public generateInvite(options?: InviteGenerationOptions): string;
  public login(token?: string): Promise<string>;
  public isReady(): this is Client<true>;
  public toJSON(): unknown;
}

export interface StickerPackFetchOptions {
  packId?: Snowflake;
}

export class ClientApplication extends Application {
  private constructor(client: Client<true>, data: unknown);
  public botPublic: boolean | null;
  public botRequireCodeGrant: boolean | null;
  public bot: User | null;
  public commands: ApplicationCommandManager;
  public emojis: ApplicationEmojiManager;
  public entitlements: EntitlementManager;
  public subscriptions: SubscriptionManager;
  public guildId: Snowflake | null;
  public get guild(): Guild | null;
  public flags: Readonly<ApplicationFlagsBitField>;
  public approximateGuildCount: number | null;
  public approximateUserInstallCount: number | null;
  public approximateUserAuthorizationCount: number | null;
  public tags: string[];
  public installParams: ClientApplicationInstallParams | null;
  public integrationTypesConfig: IntegrationTypesConfiguration | null;
  public customInstallURL: string | null;
  public owner: Team | User | null;
  public get partial(): boolean;
  public interactionsEndpointURL: string | null;
  public eventWebhooksURL: string | null;
  public eventWebhooksStatus: ApplicationWebhookEventStatus | null;
  public eventWebhooksTypes: ApplicationWebhookEventType[] | null;
  public roleConnectionsVerificationURL: string | null;
  public edit(options: ClientApplicationEditOptions): Promise<ClientApplication>;
  public fetch(): Promise<ClientApplication>;
  public fetchRoleConnectionMetadataRecords(): Promise<ApplicationRoleConnectionMetadata[]>;
  public fetchSKUs(): Promise<Collection<Snowflake, SKU>>;
  public editRoleConnectionMetadataRecords(
    records: readonly ApplicationRoleConnectionMetadataEditOptions[],
  ): Promise<ApplicationRoleConnectionMetadata[]>;
}

export class ClientPresence extends Presence {
  private constructor(client: Client<true>, data: GatewayPresenceUpdate);
  private _parse(data: PresenceData): GatewayPresenceUpdate;

  public set(presence: PresenceData): ClientPresence;
}

export class ClientUser extends User {
  public mfaEnabled: boolean;
  public get presence(): ClientPresence;
  public verified: boolean;
  public edit(options: ClientUserEditOptions): Promise<this>;
  public setActivity(options?: ActivityOptions): ClientPresence;
  public setActivity(name: string, options?: Omit<ActivityOptions, 'name'>): ClientPresence;
  public setAFK(afk?: boolean, shardId?: number | readonly number[]): ClientPresence;
  public setAvatar(avatar: Base64Resolvable | BufferResolvable | null): Promise<this>;
  public setBanner(banner: Base64Resolvable | BufferResolvable | null): Promise<this>;
  public setPresence(data: PresenceData): ClientPresence;
  public setStatus(status: PresenceStatusData, shardId?: number | readonly number[]): ClientPresence;
  public setUsername(username: string): Promise<this>;
}

export class Options extends null {
  private constructor();
  private static readonly userAgentAppendix: string;
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

export type ComponentInContainer =
  | ActionRow<MessageActionRowComponent>
  | FileComponent
  | MediaGalleryComponent
  | SectionComponent
  | SeparatorComponent
  | TextDisplayComponent;

export type ComponentInContainerData =
  | ActionRowData<ActionRowComponentData>
  | FileComponentData
  | MediaGalleryComponentData
  | SectionComponentData
  | SeparatorComponentData
  | TextDisplayComponentData;

export interface ContainerComponentData<
  ComponentType extends ComponentInContainerData | JSONEncodable<APIComponentInContainer> =
    | ComponentInContainerData
    | JSONEncodable<APIComponentInContainer>,
> extends BaseComponentData {
  accentColor?: number;
  components: readonly ComponentType[];
  spoiler?: boolean;
}

export class ContainerComponent extends Component<APIContainerComponent> {
  private constructor(data: APIContainerComponent);
  public get accentColor(): number;
  public get hexAccentColor(): HexColorString;
  public get spoiler(): boolean;
  public readonly components: ComponentInContainer[];
}

export { Collection, type ReadonlyCollection } from '@discordjs/collection';

export interface CollectorEventTypes<Key, Value, Extras extends unknown[] = []> {
  collect: [Value, ...Extras];
  dispose: [Value, ...Extras];
  end: [collected: ReadonlyCollection<Key, Value>, reason: string];
  ignore: [Value, ...Extras];
}

export abstract class Collector<
  Key,
  Value,
  Extras extends unknown[] = [],
  EventTypes extends {} = CollectorEventTypes<Key, Value, Extras>,
> extends AsyncEventEmitter<EventTypes> {
  protected constructor(client: Client<true>, options?: CollectorOptions<[Value, ...Extras]>);
  private readonly _timeout: NodeJS.Timeout | null;
  private readonly _idletimeout: NodeJS.Timeout | null;
  private readonly _endReason: string | null;

  public readonly client: Client;
  public collected: Collection<Key, Value>;
  public lastCollectedTimestamp: number | null;
  public get lastCollectedAt(): Date | null;
  public ended: boolean;
  public get endReason(): string | null;
  public filter: CollectorFilter<[Value, ...Extras]>;
  public get next(): Promise<Value>;
  public options: CollectorOptions<[Value, ...Extras]>;
  public checkEnd(): boolean;
  public handleCollect(...args: unknown[]): Promise<void>;
  public handleDispose(...args: unknown[]): Promise<void>;
  public stop(reason?: string): void;
  public resetTimer(options?: CollectorResetTimerOptions): void;
  public [Symbol.asyncIterator](): AsyncIterableIterator<[Value, ...Extras]>;
  public toJSON(): unknown;

  protected listener: (...args: any[]) => void;
  public abstract collect(...args: unknown[]): Awaitable<Key | null>;
  public abstract dispose(...args: unknown[]): Key | null;
}

export class ChatInputCommandInteraction<Cached extends CacheType = CacheType> extends CommandInteraction<Cached> {
  public commandType: ApplicationCommandType.ChatInput;
  public options: Omit<CommandInteractionOptionResolver<Cached>, 'getFocused' | 'getMessage'>;
  public inGuild(): this is ChatInputCommandInteraction<'cached' | 'raw'>;
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
    'getAttachment' | 'getChannel' | 'getMember' | 'getMentionable' | 'getMessage' | 'getRole' | 'getUser'
  >;
  public inGuild(): this is AutocompleteInteraction<'cached' | 'raw'>;
  public inCachedGuild(): this is AutocompleteInteraction<'cached'>;
  public inRawGuild(): this is AutocompleteInteraction<'raw'>;
  public respond(options: readonly ApplicationCommandOptionChoiceData[]): Promise<void>;
}

export class CommandInteractionOptionResolver<Cached extends CacheType = CacheType> {
  private constructor(
    client: Client<true>,
    options: readonly CommandInteractionOption[],
    resolved: CommandInteractionResolvedData,
  );
  public readonly client: Client;
  public readonly data: readonly CommandInteractionOption<Cached>[];
  public readonly resolved: Readonly<CommandInteractionResolvedData<Cached>> | null;
  private readonly _group: string | null;
  private readonly _hoistedOptions: CommandInteractionOption<Cached>[];
  private readonly _subcommand: string | null;
  private _getTypedOption(
    name: string,
    allowedTypes: readonly ApplicationCommandOptionType[],
    properties: readonly (keyof ApplicationCommandOption)[],
    required: true,
  ): CommandInteractionOption<Cached>;
  private _getTypedOption(
    name: string,
    allowedTypes: readonly ApplicationCommandOptionType[],
    properties: readonly (keyof ApplicationCommandOption)[],
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
  /**
   * @privateRemarks
   * The ternary in the return type is required.
   * The `type` property of the {@link PublicThreadChannel} interface is typed as `ChannelType.PublicThread | ChannelType.AnnouncementThread`.
   * If the user were to pass only one of those channel types, the `Extract<>` would resolve to `never`.
   */
  public getChannel<const Type extends ChannelType = ChannelType>(
    name: string,
    required: true,
    channelTypes?: readonly Type[],
  ): Extract<
    NonNullable<CommandInteractionOption<Cached>['channel']>,
    {
      type: Type extends ChannelType.AnnouncementThread | ChannelType.PublicThread
        ? ChannelType.AnnouncementThread | ChannelType.PublicThread
        : Type;
    }
  >;
  /**
   * @privateRemarks
   * The ternary in the return type is required.
   * The `type` property of the {@link PublicThreadChannel} interface is typed as `ChannelType.PublicThread | ChannelType.AnnouncementThread`.
   * If the user were to pass only one of those channel types, the `Extract<>` would resolve to `never`.
   */
  public getChannel<const Type extends ChannelType = ChannelType>(
    name: string,
    required?: boolean,
    channelTypes?: readonly Type[],
  ): Extract<
    NonNullable<CommandInteractionOption<Cached>['channel']>,
    {
      type: Type extends ChannelType.AnnouncementThread | ChannelType.PublicThread
        ? ChannelType.AnnouncementThread | ChannelType.PublicThread
        : Type;
    }
  > | null;
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
  public getFocused(): AutocompleteFocusedOption;
}

export class ContextMenuCommandInteraction<Cached extends CacheType = CacheType> extends CommandInteraction<Cached> {
  public options: Omit<
    CommandInteractionOptionResolver<Cached>,
    | 'getAttachment'
    | 'getBoolean'
    | 'getChannel'
    | 'getFocused'
    | 'getInteger'
    | 'getMember'
    | 'getMentionable'
    | 'getMessage'
    | 'getNumber'
    | 'getRole'
    | 'getString'
    | 'getSubcommand'
    | 'getSubcommandGroup'
    | 'getUser'
  >;
  public commandType: ApplicationCommandType.Message | ApplicationCommandType.User;
  public targetId: Snowflake;
  public inGuild(): this is ContextMenuCommandInteraction<'cached' | 'raw'>;
  public inCachedGuild(): this is ContextMenuCommandInteraction<'cached'>;
  public inRawGuild(): this is ContextMenuCommandInteraction<'raw'>;
  private resolveContextMenuOptions(data: APIApplicationCommandInteractionData): CommandInteractionOption<Cached>[];
}

export class PrimaryEntryPointCommandInteraction<
  Cached extends CacheType = CacheType,
> extends CommandInteraction<Cached> {
  public commandType: ApplicationCommandType.PrimaryEntryPoint;
  public inGuild(): this is PrimaryEntryPointCommandInteraction<'cached' | 'raw'>;
  public inCachedGuild(): this is PrimaryEntryPointCommandInteraction<'cached'>;
  public inRawGuild(): this is PrimaryEntryPointCommandInteraction<'raw'>;
}

export interface DMChannel
  extends TextBasedChannelFields<false, true>,
    PinnableChannelFields,
    MessageChannelFields,
    SendMethod<false> {}
export class DMChannel extends BaseChannel {
  private constructor(client: Client<true>, data?: RawDMChannelData);
  public flags: Readonly<ChannelFlagsBitField>;
  public recipientId: Snowflake;
  public get recipient(): User | null;
  public type: ChannelType.DM;
  public fetch(force?: boolean): Promise<this>;
  public toString(): UserMention;
}

export class Emoji extends Base {
  protected constructor(client: Client<true>, emoji: unknown);
  public animated: boolean | null;
  public get createdAt(): Date | null;
  public get createdTimestamp(): number | null;
  public id: Snowflake | null;
  public name: string | null;
  public get identifier(): string;
  public imageURL(options?: EmojiURLOptions): string | null;
  public toJSON(): unknown;
  public toString(): string;
}

export interface ApplicationEmojiCreateOptions {
  attachment: Base64Resolvable | BufferResolvable;
  name: string;
}

export interface ApplicationEmojiEditOptions {
  name?: string;
}

export class ApplicationEmoji extends Emoji {
  private constructor(client: Client<true>, data: APIEmoji, application: ClientApplication);

  public application: ClientApplication;
  public author: User;
  public id: Snowflake;
  public managed: false;
  public requiresColons: true;
  public name: string;
  public animated: boolean;
  public available: true;
  public get createdAt(): Date;
  public get createdTimestamp(): number;
  public imageURL(options?: EmojiURLOptions): string;
  public delete(): Promise<ApplicationEmoji>;
  public edit(options: ApplicationEmojiEditOptions): Promise<ApplicationEmoji>;
  public equals(other: ApplicationEmoji | unknown): boolean;
  public fetchAuthor(): Promise<User>;
  public setName(name: string): Promise<ApplicationEmoji>;
}

export class ApplicationEmojiManager extends CachedManager<Snowflake, ApplicationEmoji, EmojiResolvable> {
  private constructor(application: ClientApplication, iterable?: Iterable<APIEmoji>);
  public application: ClientApplication;
  public create(options: ApplicationEmojiCreateOptions): Promise<ApplicationEmoji>;
  public fetch(id: Snowflake, options?: BaseFetchOptions): Promise<ApplicationEmoji>;
  public fetch(id?: undefined, options?: BaseFetchOptions): Promise<Collection<Snowflake, ApplicationEmoji>>;
  public fetchAuthor(emoji: EmojiResolvable): Promise<User>;
  public delete(emoji: EmojiResolvable): Promise<void>;
  public edit(emoji: EmojiResolvable, options: ApplicationEmojiEditOptions): Promise<ApplicationEmoji>;
}

export class Entitlement extends Base {
  private constructor(client: Client<true>, data: APIEntitlement);
  public id: Snowflake;
  public skuId: Snowflake;
  public userId: Snowflake;
  public guildId: Snowflake | null;
  public applicationId: Snowflake;
  public type: EntitlementType;
  public consumed: boolean;
  public deleted: boolean;
  public startsTimestamp: number | null;
  public endsTimestamp: number | null;
  public get guild(): Guild | null;
  public get startsAt(): Date | null;
  public get endsAt(): Date | null;
  public consume(): Promise<void>;
  public fetchUser(): Promise<User>;
  public isActive(): boolean;
  public isTest(): this is this & {
    get endsAt(): null;
    endsTimestamp: null;
    get startsAt(): null;
    startsTimestamp: null;
  };
  public isUserSubscription(): this is this & { get guild(): null; guildId: null };
  public isGuildSubscription(): this is this & { guild: Guild; guildId: Snowflake };
}

export interface FileComponentData extends BaseComponentData {
  file: UnfurledMediaItemData;
  spoiler?: boolean;
}
export class FileComponent extends Component<APIFileComponent> {
  private constructor(data: APIFileComponent);
  public readonly file: UnfurledMediaItem;
  public get spoiler(): boolean;
}

export class Guild extends AnonymousGuild {
  private constructor(client: Client<true>, data: APIGuild | APIUnavailableGuild);
  private _sortedRoles(): Collection<Snowflake, Role>;
  private _sortedChannels(channel: NonThreadGuildBasedChannel): Collection<Snowflake, NonThreadGuildBasedChannel>;

  public get afkChannel(): VoiceChannel | null;
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
  public maxStageVideoChannelUsers: number | null;
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
  public get safetyAlertsChannel(): TextChannel | null;
  public safetyAlertsChannelId: Snowflake | null;
  public scheduledEvents: GuildScheduledEventManager;
  public shardId: number;
  public soundboardSounds: GuildSoundboardSoundManager;
  public stageInstances: StageInstanceManager;
  public stickers: GuildStickerManager;
  public incidentsData: IncidentActions | null;
  public get systemChannel(): TextChannel | null;
  public systemChannelFlags: Readonly<SystemChannelFlagsBitField>;
  public systemChannelId: Snowflake | null;
  public vanityURLUses: number | null;
  public get voiceAdapterCreator(): InternalDiscordGatewayAdapterCreator;
  public voiceStates: VoiceStateManager;
  public get widgetChannel():
    | AnnouncementChannel
    | ForumChannel
    | MediaChannel
    | TextChannel
    | VoiceBasedChannel
    | null;
  public widgetChannelId: Snowflake | null;
  public widgetEnabled: boolean | null;
  public get maximumBitrate(): number;
  public createTemplate(name: string, description?: string): Promise<GuildTemplate>;
  public discoverySplashURL(options?: ImageURLOptions): string | null;
  public edit(options: GuildEditOptions): Promise<Guild>;
  public editOnboarding(options: GuildOnboardingEditOptions): Promise<GuildOnboarding>;
  public editWelcomeScreen(options: WelcomeScreenEditOptions): Promise<WelcomeScreen>;
  public equals(guild: Guild): boolean;
  public fetchAuditLogs<Event extends GuildAuditLogsResolvable = AuditLogEvent>(
    options?: GuildAuditLogsFetchOptions<Event>,
  ): Promise<GuildAuditLogs<Event extends null ? AuditLogEvent : Event>>;
  public fetchIntegrations(): Promise<Collection<Snowflake | string, Integration>>;
  public fetchOnboarding(): Promise<GuildOnboarding>;
  public fetchOwner(options?: BaseFetchOptions): Promise<GuildMember>;
  public fetchPreview(): Promise<GuildPreview>;
  public fetchTemplates(): Promise<Collection<GuildTemplate['code'], GuildTemplate>>;
  public fetchVanityData(): Promise<Vanity>;
  public fetchWebhooks(): Promise<Collection<Snowflake, Webhook<WebhookType.ChannelFollower | WebhookType.Incoming>>>;
  public fetchWelcomeScreen(): Promise<WelcomeScreen>;
  public fetchWidget(): Promise<Widget>;
  public fetchWidgetSettings(): Promise<GuildWidgetSettings>;
  public widgetImageURL(style?: GuildWidgetStyle): string;
  public leave(): Promise<Guild>;
  public disableInvites(disabled?: boolean): Promise<Guild>;
  public setIncidentActions(incidentActions: IncidentActionsEditOptions): Promise<IncidentActions>;
  public setAFKChannel(afkChannel: VoiceChannelResolvable | null, reason?: string): Promise<Guild>;
  public setAFKTimeout(afkTimeout: number, reason?: string): Promise<Guild>;
  public setBanner(banner: Base64Resolvable | BufferResolvable | null, reason?: string): Promise<Guild>;
  public setDefaultMessageNotifications(
    defaultMessageNotifications: GuildDefaultMessageNotifications | null,
    reason?: string,
  ): Promise<Guild>;
  public setDiscoverySplash(
    discoverySplash: Base64Resolvable | BufferResolvable | null,
    reason?: string,
  ): Promise<Guild>;
  public setExplicitContentFilter(
    explicitContentFilter: GuildExplicitContentFilter | null,
    reason?: string,
  ): Promise<Guild>;
  public setIcon(icon: Base64Resolvable | BufferResolvable | null, reason?: string): Promise<Guild>;
  public setName(name: string, reason?: string): Promise<Guild>;
  public setPreferredLocale(preferredLocale: Locale | null, reason?: string): Promise<Guild>;
  public setPublicUpdatesChannel(publicUpdatesChannel: TextChannelResolvable | null, reason?: string): Promise<Guild>;
  public setRulesChannel(rulesChannel: TextChannelResolvable | null, reason?: string): Promise<Guild>;
  public setSafetyAlertsChannel(safetyAlertsChannel: TextChannelResolvable | null, reason?: string): Promise<Guild>;
  public setSplash(splash: Base64Resolvable | BufferResolvable | null, reason?: string): Promise<Guild>;
  public setSystemChannel(systemChannel: TextChannelResolvable | null, reason?: string): Promise<Guild>;
  public setSystemChannelFlags(systemChannelFlags: SystemChannelFlagsResolvable, reason?: string): Promise<Guild>;
  public setVerificationLevel(verificationLevel: GuildVerificationLevel | null, reason?: string): Promise<Guild>;
  public setPremiumProgressBarEnabled(enabled?: boolean, reason?: string): Promise<Guild>;
  public setWidgetSettings(settings: GuildWidgetSettingsData, reason?: string): Promise<Guild>;
  public toJSON(): unknown;
}

export class GuildAuditLogs<Event extends AuditLogEvent = AuditLogEvent> {
  private constructor(guild: Guild, data: APIAuditLog);
  private readonly applicationCommands: Collection<Snowflake, ApplicationCommand>;
  private readonly webhooks: Collection<Snowflake, Webhook<WebhookType.ChannelFollower | WebhookType.Incoming>>;
  private readonly integrations: Collection<Snowflake | string, Integration>;
  private readonly guildScheduledEvents: Collection<Snowflake, GuildScheduledEvent>;
  private readonly autoModerationRules: Collection<Snowflake, AutoModerationRule>;
  public entries: Collection<Snowflake, GuildAuditLogsEntry<Event>>;
  public toJSON(): unknown;
}

export class GuildAuditLogsEntry<
  TAction extends AuditLogEvent = AuditLogEvent,
  TActionType extends GuildAuditLogsActionType = TAction extends keyof GuildAuditLogsTypes
    ? GuildAuditLogsTypes[TAction][1]
    : 'All',
  TTargetType extends GuildAuditLogsTargetType = TAction extends keyof GuildAuditLogsTypes
    ? GuildAuditLogsTypes[TAction][0]
    : 'Unknown',
> {
  private constructor(guild: Guild, data: APIAuditLogEntry, logs?: GuildAuditLogs);
  public static Targets: GuildAuditLogsTargets;
  public action: TAction;
  public actionType: TActionType;
  public changes: AuditLogChange[];
  public get createdAt(): Date;
  public get createdTimestamp(): number;
  public executorId: Snowflake | null;
  public executor: PartialUser | User | null;
  public extra: TAction extends keyof GuildAuditLogsEntryExtraField ? GuildAuditLogsEntryExtraField[TAction] : null;
  public id: Snowflake;
  public reason: string | null;
  public targetId: Snowflake | null;
  public target: TTargetType extends keyof GuildAuditLogsEntryTargetField<TAction>
    ? GuildAuditLogsEntryTargetField<TAction>[TTargetType]
    : { [x: string]: unknown; id: Snowflake | undefined } | null;
  public targetType: TTargetType;
  public static actionType(action: AuditLogEvent): GuildAuditLogsActionType;
  public static targetType(target: AuditLogEvent): GuildAuditLogsTargetType;
  public isAction<TCheckAction extends TAction>(
    action: TCheckAction,
  ): this is GuildAuditLogsEntry<
    TCheckAction,
    TCheckAction extends keyof GuildAuditLogsTypes ? GuildAuditLogsTypes[TCheckAction][1] : 'All',
    TCheckAction extends keyof GuildAuditLogsTypes ? GuildAuditLogsTypes[TCheckAction][0] : 'Unknown'
  >;
  public toJSON(): unknown;
}

export class GuildBan extends Base {
  private constructor(client: Client<true>, data: unknown, guild: Guild);
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
  public type: GuildChannelTypes;
  public get viewable(): boolean;
  public clone(options?: GuildChannelCloneOptions): Promise<this>;
  public delete(reason?: string): Promise<this>;
  public edit(options: GuildChannelEditOptions): Promise<this>;
  public equals(channel: GuildChannel): boolean;
  public lockPermissions(): Promise<this>;
  public permissionsFor(memberOrRole: GuildMember | Role, checkAdmin?: boolean): Readonly<PermissionsBitField>;
  public permissionsFor(
    memberOrRole: RoleResolvable | UserResolvable,
    checkAdmin?: boolean,
  ): Readonly<PermissionsBitField> | null;
  public setName(name: string, reason?: string): Promise<this>;
  public setParent(channel: CategoryChannelResolvable | null, options?: SetParentOptions): Promise<this>;
  public setPosition(position: number, options?: SetChannelPositionOptions): Promise<this>;
  public isTextBased(): this is GuildBasedChannel & TextBasedChannel;
  public toString(): ChannelMention;
}

export class GuildEmoji extends BaseGuildEmoji {
  private constructor(client: Client<true>, data: APIEmoji, guild: Guild);
  private readonly _roles: Snowflake[];

  public get deletable(): boolean;
  public guild: Guild;
  public author: User | null;
  public get roles(): GuildEmojiRoleManager;
  public delete(reason?: string): Promise<GuildEmoji>;
  public edit(options: GuildEmojiEditOptions): Promise<GuildEmoji>;
  public equals(other: GuildEmoji | unknown): boolean;
  public fetchAuthor(): Promise<User>;
  public setName(name: string, reason?: string): Promise<GuildEmoji>;
}

export type GuildMemberFlagsString = keyof typeof GuildMemberFlags;

export type GuildMemberFlagsResolvable = BitFieldResolvable<GuildMemberFlagsString, number>;

export class GuildMemberFlagsBitField extends BitField<GuildMemberFlagsString> {
  public static Flags: GuildMemberFlags;
  public static resolve(bit?: BitFieldResolvable<GuildMemberFlagsString, GuildMemberFlags>): number;
}

export interface GuildMember extends SendMethod<false> {}
export class GuildMember extends Base {
  private constructor(client: Client<true>, data: unknown, guild: Guild);
  private readonly _roles: Snowflake[];
  public avatar: string | null;
  public avatarDecorationData: AvatarDecorationData | null;
  public banner: string | null;
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
  public flags: Readonly<GuildMemberFlagsBitField>;
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
  public avatarDecorationURL(): string | null;
  public bannerURL(options?: ImageURLOptions): string | null;
  public ban(options?: BanOptions): Promise<void>;
  public disableCommunicationUntil(timeout: DateResolvable | null, reason?: string): Promise<GuildMember>;
  public timeout(timeout: number | null, reason?: string): Promise<GuildMember>;
  public fetch(force?: boolean): Promise<GuildMember>;
  public createDM(force?: boolean): Promise<DMChannel>;
  public deleteDM(): Promise<DMChannel>;
  public displayAvatarURL(options?: ImageURLOptions): string;
  public displayBannerURL(options?: ImageURLOptions): string | null;
  public displayAvatarDecorationURL(): string | null;
  public edit(options: GuildMemberEditOptions): Promise<GuildMember>;
  public isCommunicationDisabled(): this is GuildMember & {
    readonly communicationDisabledUntil: Date;
    communicationDisabledUntilTimestamp: number;
  };
  public kick(reason?: string): Promise<void>;
  public permissionsIn(channel: GuildChannelResolvable): Readonly<PermissionsBitField>;
  public setFlags(flags: GuildMemberFlagsResolvable, reason?: string): Promise<GuildMember>;
  public setNickname(nickname: string | null, reason?: string): Promise<GuildMember>;
  public toJSON(): unknown;
  public toString(): UserMention;
  public valueOf(): string;
}

export class GuildOnboarding extends Base {
  private constructor(client: Client, data: RESTGetAPIGuildOnboardingResult);
  public get guild(): Guild;
  public guildId: Snowflake;
  public prompts: Collection<Snowflake, GuildOnboardingPrompt>;
  public defaultChannels: Collection<Snowflake, GuildChannel>;
  public enabled: boolean;
  public mode: GuildOnboardingMode;
}

export class GuildOnboardingPrompt extends Base {
  private constructor(client: Client, data: APIGuildOnboardingPrompt, guildId: Snowflake);
  public id: Snowflake;
  public get guild(): Guild;
  public guildId: Snowflake;
  public options: Collection<Snowflake, GuildOnboardingPromptOption>;
  public title: string;
  public singleSelect: boolean;
  public required: boolean;
  public inOnboarding: boolean;
  public type: GuildOnboardingPromptType;
}

export class GuildOnboardingPromptOption extends Base {
  private constructor(client: Client, data: APIGuildOnboardingPromptOption, guildId: Snowflake);
  private readonly _emoji: APIPartialEmoji;

  public id: Snowflake;
  public get emoji(): Emoji | GuildEmoji | null;
  public get guild(): Guild;
  public guildId: Snowflake;
  public channels: Collection<Snowflake, GuildChannel>;
  public roles: Collection<Snowflake, Role>;
  public title: string;
  public description: string | null;
}

export class GuildPreview extends Base {
  private constructor(client: Client<true>, data: APIGuildPreview);
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

export class GuildScheduledEvent<Status extends GuildScheduledEventStatus = GuildScheduledEventStatus> extends Base {
  private constructor(client: Client<true>, data: APIGuildScheduledEvent);
  public id: Snowflake;
  public guildId: Snowflake;
  public channelId: Snowflake | null;
  public creatorId: Snowflake | null;
  public name: string;
  public description: string | null;
  public scheduledStartTimestamp: number | null;
  public scheduledEndTimestamp: number | null;
  public privacyLevel: GuildScheduledEventPrivacyLevel;
  public status: Status;
  public entityType: GuildScheduledEventEntityType;
  public entityId: Snowflake | null;
  public entityMetadata: GuildScheduledEventEntityMetadata | null;
  public userCount: number | null;
  public creator: User | null;
  public recurrenceRule: GuildScheduledEventRecurrenceRule | null;
  public get createdTimestamp(): number;
  public get createdAt(): Date;
  public get scheduledStartAt(): Date | null;
  public get scheduledEndAt(): Date | null;
  public get channel(): StageChannel | VoiceChannel | null;
  public get guild(): Guild | null;
  public get url(): string;
  public image: string | null;
  public get partial(): false;
  public coverImageURL(options?: Readonly<BaseImageURLOptions>): string | null;
  public createInviteURL(options?: GuildScheduledEventInviteURLCreateOptions): Promise<string>;
  public edit<AcceptableStatus extends GuildScheduledEventSetStatusArg<Status>>(
    options: GuildScheduledEventEditOptions<Status, AcceptableStatus>,
  ): Promise<GuildScheduledEvent<AcceptableStatus>>;
  public fetch(force?: boolean): Promise<GuildScheduledEvent<Status>>;
  public delete(): Promise<GuildScheduledEvent<Status>>;
  public setName(name: string, reason?: string): Promise<GuildScheduledEvent<Status>>;
  public setScheduledStartTime(
    scheduledStartTime: DateResolvable,
    reason?: string,
  ): Promise<GuildScheduledEvent<Status>>;
  public setScheduledEndTime(scheduledEndTime: DateResolvable, reason?: string): Promise<GuildScheduledEvent<Status>>;
  public setDescription(description: string, reason?: string): Promise<GuildScheduledEvent<Status>>;
  public setStatus<AcceptableStatus extends GuildScheduledEventSetStatusArg<Status>>(
    status: AcceptableStatus,
    reason?: string,
  ): Promise<GuildScheduledEvent<AcceptableStatus>>;
  public setLocation(location: string, reason?: string): Promise<GuildScheduledEvent<Status>>;
  public fetchSubscribers<Options extends FetchGuildScheduledEventSubscribersOptions>(
    options?: Options,
  ): Promise<GuildScheduledEventManagerFetchSubscribersResult<Options>>;
  public toString(): string;
  public isActive(): this is GuildScheduledEvent<GuildScheduledEventStatus.Active>;
  public isCanceled(): this is GuildScheduledEvent<GuildScheduledEventStatus.Canceled>;
  public isCompleted(): this is GuildScheduledEvent<GuildScheduledEventStatus.Completed>;
  public isScheduled(): this is GuildScheduledEvent<GuildScheduledEventStatus.Scheduled>;
}

export interface GuildScheduledEventRecurrenceRule {
  byMonth: readonly GuildScheduledEventRecurrenceRuleMonth[] | null;
  byMonthDay: readonly number[] | null;
  byNWeekday: readonly GuildScheduledEventRecurrenceRuleNWeekday[] | null;
  byWeekday: readonly GuildScheduledEventRecurrenceRuleWeekday[] | null;
  byYearDay: readonly number[] | null;
  count: number | null;
  get endAt(): Date | null;
  endTimestamp: number | null;
  frequency: GuildScheduledEventRecurrenceRuleFrequency;
  interval: number;
  get startAt(): Date;
  startTimestamp: number;
}

export interface GuildScheduledEventRecurrenceRuleNWeekday {
  day: GuildScheduledEventRecurrenceRuleWeekday;
  n: number;
}

export class GuildTemplate extends Base {
  private constructor(client: Client<true>, data: APITemplate);
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
  public delete(): Promise<GuildTemplate>;
  public edit(options?: GuildTemplateEditOptions): Promise<GuildTemplate>;
  public sync(): Promise<GuildTemplate>;
  public static GuildTemplatesPattern: RegExp;
}

export class GuildPreviewEmoji extends BaseGuildEmoji {
  private constructor(client: Client<true>, data: APIEmoji, guild: GuildPreview);
  public guild: GuildPreview;
  public roles: Snowflake[];
}

export class Integration extends Base {
  private constructor(client: Client<true>, data: APIGuildIntegration, guild: Guild);
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
  private constructor(client: Client<true>, data: unknown);
  public bot: User | null;
  public termsOfServiceURL: string | null;
  public privacyPolicyURL: string | null;
  public rpcOrigins: string[];
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
    : [State] extends ['cached' | 'raw']
      ? PresentType
      : Fallback;

export type Interaction<Cached extends CacheType = CacheType> =
  | AutocompleteInteraction<Cached>
  | ButtonInteraction<Cached>
  | ChatInputCommandInteraction<Cached>
  | MessageContextMenuCommandInteraction<Cached>
  | ModalSubmitInteraction<Cached>
  | PrimaryEntryPointCommandInteraction<Cached>
  | SelectMenuInteraction<Cached>
  | UserContextMenuCommandInteraction<Cached>;

export type RepliableInteraction<Cached extends CacheType = CacheType> = Exclude<
  Interaction<Cached>,
  AutocompleteInteraction<Cached>
>;

export class BaseInteraction<Cached extends CacheType = CacheType> extends Base {
  // This a technique used to brand different cached types. Or else we'll get `never` errors on typeguard checks.
  private readonly _cacheType: Cached;
  protected constructor(client: Client<true>, data: GatewayInteractionCreateDispatchData);
  public applicationId: Snowflake;
  public authorizingIntegrationOwners: APIAuthorizingIntegrationOwnersMap;
  public get channel(): CacheTypeReducer<
    Cached,
    GuildTextBasedChannel | null,
    GuildTextBasedChannel | null,
    GuildTextBasedChannel | null,
    TextBasedChannel | null
  >;
  public channelId: Snowflake | null;
  public context: InteractionContextType | null;
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
  public appPermissions: Readonly<PermissionsBitField>;
  public memberPermissions: CacheTypeReducer<Cached, Readonly<PermissionsBitField>>;
  public locale: Locale;
  public guildLocale: CacheTypeReducer<Cached, Locale>;
  public entitlements: Collection<Snowflake, Entitlement>;
  public attachmentSizeLimit: number;
  public inGuild(): this is BaseInteraction<'cached' | 'raw'>;
  public inCachedGuild(): this is BaseInteraction<'cached'>;
  public inRawGuild(): this is BaseInteraction<'raw'>;
  public isButton(): this is ButtonInteraction<Cached>;
  public isAutocomplete(): this is AutocompleteInteraction<Cached>;
  public isChatInputCommand(): this is ChatInputCommandInteraction<Cached>;
  public isCommand(): this is CommandInteraction<Cached>;
  public isContextMenuCommand(): this is ContextMenuCommandInteraction<Cached>;
  public isPrimaryEntryPointCommand(): this is PrimaryEntryPointCommandInteraction<Cached>;
  public isMessageComponent(): this is MessageComponentInteraction<Cached>;
  public isMessageContextMenuCommand(): this is MessageContextMenuCommandInteraction<Cached>;
  public isModalSubmit(): this is ModalSubmitInteraction<Cached>;
  public isUserContextMenuCommand(): this is UserContextMenuCommandInteraction<Cached>;
  public isSelectMenu(): this is SelectMenuInteraction<Cached>;
  public isStringSelectMenu(): this is StringSelectMenuInteraction<Cached>;
  public isUserSelectMenu(): this is UserSelectMenuInteraction<Cached>;
  public isRoleSelectMenu(): this is RoleSelectMenuInteraction<Cached>;
  public isMentionableSelectMenu(): this is MentionableSelectMenuInteraction<Cached>;
  public isChannelSelectMenu(): this is ChannelSelectMenuInteraction<Cached>;
  public isRepliable(): this is RepliableInteraction<Cached>;
}

export class InteractionCallback {
  private constructor(client: Client<true>, data: RESTAPIInteractionCallbackObject);
  public activityInstanceId: string | null;
  public readonly client: Client<true>;
  public get createdAt(): Date;
  public get createdTimestamp(): number;
  public id: Snowflake;
  public responseMessageEphemeral: boolean | null;
  public responseMessageId: Snowflake | null;
  public responseMessageLoading: boolean | null;
  public type: InteractionType;
}

export class InteractionCallbackResponse<InGuild extends boolean = boolean> {
  private constructor(client: Client<true>, data: RESTPostAPIInteractionCallbackWithResponseResult);
  public readonly client: Client<true>;
  public interaction: InteractionCallback;
  public resource: InteractionCallbackResource<InGuild> | null;
}

export class InteractionCallbackResource<InGuild extends boolean = boolean> {
  private constructor(client: Client<true>, data: RESTAPIInteractionCallbackResourceObject);
  public activityInstance: RESTAPIInteractionCallbackActivityInstanceResource | null;
  public message: Message<InGuild> | null;
  public type: InteractionResponseType;
}

export class InteractionCollector<Interaction extends CollectedInteraction> extends Collector<Snowflake, Interaction> {
  public constructor(client: Client<true>, options?: InteractionCollectorOptions<Interaction>);
  private _handleMessageDeletion(message: Message): void;
  private _handleChannelDeletion(channel: NonThreadGuildBasedChannel): void;
  private _handleGuildDeletion(guild: Guild): void;

  public channelId: Snowflake | null;
  public componentType: ComponentType | null;
  public guildId: Snowflake | null;
  public interactionType: InteractionType | null;
  public messageId: Snowflake | null;
  public options: InteractionCollectorOptions<Interaction>;
  public total: number;
  public users: Collection<Snowflake, User>;

  public collect(interaction: Interaction): Snowflake;
  public empty(): void;
  public dispose(interaction: Interaction): Snowflake;
}

export interface InteractionWebhook extends PartialWebhookFields {}
export class InteractionWebhook {
  public constructor(client: Client<true>, id: Snowflake, token: string);
  public readonly client: Client<true>;
  public token: string;
  public send(options: InteractionReplyOptions | MessagePayload | string): Promise<Message>;
  public editMessage(
    message: MessageResolvable | '@original',
    options: MessagePayload | WebhookMessageEditOptions | string,
  ): Promise<Message>;
  public fetchMessage(message: Snowflake | '@original'): Promise<Message>;
}

export class BaseInvite<WithCounts extends boolean = boolean> extends Base {
  protected constructor(client: Client<true>, data: unknown);
  public readonly type: InviteType;
  public readonly code: string;
  public readonly inviterId: Snowflake | null;
  public get inviter(): User | null;
  public maxAge: number | null;
  public get createdAt(): Date | null;
  public createdTimestamp: number | null;
  public get expiresAt(): Date | null;
  public get expiresTimestamp(): number | null;
  public readonly channelId: Snowflake | null;
  public approximateMemberCount: WithCounts extends true ? number : null;
  public get url(): string;
  public static InvitesPattern: RegExp;
  public toString(): string;
  public toJSON(): unknown;
}

export class GuildInvite<WithCounts extends boolean = boolean> extends BaseInvite<WithCounts> {
  public readonly type: InviteType.Guild;
  public flags: Readonly<InviteFlagsBitField>;
  public guild: Guild | InviteGuild | null;
  public readonly guildId: Snowflake;
  public channel: NonThreadGuildBasedChannel | null;
  public targetType: InviteTargetType | null;
  public targetUser: User | null;
  public targetApplication: IntegrationApplication | null;
  public guildScheduledEvent: GuildScheduledEvent | null;
  public uses: number | null;
  public maxUses: number | null;
  public temporary: boolean | null;
  public approximatePresenceCount: WithCounts extends true ? number : null;
  public get deletable(): boolean;
  public delete(reason?: string): Promise<void>;
}

export type InviteFlagsString = keyof typeof InviteFlags;

export class InviteFlagsBitField extends BitField<InviteFlagsString> {
  public static Flags: typeof InviteFlags;
  public static resolve(bit?: BitFieldResolvable<InviteFlagsString, number>): number;
}

export class GroupDMInvite<WithCounts extends boolean = boolean> extends BaseInvite<WithCounts> {
  public readonly type: InviteType.GroupDM;
  public channel: PartialGroupDMChannel | null;
}

export type Invite<WithCounts extends boolean = boolean> = GroupDMInvite<WithCounts> | GuildInvite<WithCounts>;

export class InviteGuild extends AnonymousGuild {
  private constructor(client: Client<true>, data: APIPartialGuild);
  public welcomeScreen: WelcomeScreen | null;
}

export class LimitedCollection<Key, Value> extends Collection<Key, Value> {
  public constructor(options?: LimitedCollectionOptions<Key, Value>, iterable?: Iterable<readonly [Key, Value]>);
  public maxSize: number;
  public keepOverLimit: ((value: Value, key: Key, collection: this) => boolean) | null;
}

export interface MediaGalleryComponentData extends BaseComponentData {
  items: readonly MediaGalleryItemData[];
}
export class MediaGalleryComponent extends Component<APIMediaGalleryComponent> {
  private constructor(data: APIMediaGalleryComponent);
  public readonly items: MediaGalleryItem[];
}

export interface MediaGalleryItemData {
  description?: string;
  media: UnfurledMediaItemData;
  spoiler?: boolean;
}
export class MediaGalleryItem {
  private constructor(data: APIMediaGalleryItem);
  public readonly data: APIMediaGalleryItem;
  public readonly media: UnfurledMediaItem;
  public get description(): string | null;
  public get spoiler(): boolean;
}

export interface MessageCall {
  get endedAt(): Date | null;
  endedTimestamp: number | null;
  participants: readonly Snowflake[];
}

export type MessageComponentType =
  | ComponentType.Button
  | ComponentType.ChannelSelect
  | ComponentType.MentionableSelect
  | ComponentType.RoleSelect
  | ComponentType.StringSelect
  | ComponentType.UserSelect;

export interface MessageCollectorOptionsParams<
  ComponentType extends MessageComponentType,
  Cached extends boolean = boolean,
> extends MessageComponentCollectorOptions<MappedInteractionTypes<Cached>[ComponentType]> {
  componentType?: ComponentType;
}

export interface MessageChannelCollectorOptionsParams<
  ComponentType extends MessageComponentType,
  Cached extends boolean = boolean,
> extends MessageChannelComponentCollectorOptions<MappedInteractionTypes<Cached>[ComponentType]> {
  componentType?: ComponentType;
}

export interface AwaitMessageCollectorOptionsParams<
  ComponentType extends MessageComponentType,
  Cached extends boolean = boolean,
> extends AwaitMessageComponentOptions<MappedInteractionTypes<Cached>[ComponentType]> {
  componentType?: ComponentType;
}

export interface StringMappedInteractionTypes<Cached extends CacheType = CacheType> {
  ActionRow: MessageComponentInteraction<Cached>;
  Button: ButtonInteraction<Cached>;
  ChannelSelectMenu: ChannelSelectMenuInteraction<Cached>;
  MentionableSelectMenu: MentionableSelectMenuInteraction<Cached>;
  RoleSelectMenu: RoleSelectMenuInteraction<Cached>;
  StringSelectMenu: StringSelectMenuInteraction<Cached>;
  UserSelectMenu: UserSelectMenuInteraction<Cached>;
}

export type WrapBooleanCache<Cached extends boolean> = If<Cached, 'cached', CacheType>;

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
  private constructor(client: Client<true>, data: APIMessage);
  private _patch(data: APIMessage | GatewayMessageUpdateDispatchData): void;

  public activity: MessageActivity | null;
  public applicationId: Snowflake | null;
  public attachments: Collection<Snowflake, Attachment>;
  public author: User;
  public get bulkDeletable(): boolean;
  public get channel(): If<InGuild, GuildTextBasedChannel, TextBasedChannel>;
  public channelId: Snowflake;
  public get cleanContent(): string;
  public components: TopLevelComponent[];
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
  public interactionMetadata: MessageInteractionMetadata | null;
  public get member(): GuildMember | null;
  public mentions: MessageMentions<InGuild>;
  public nonce: number | string | null;
  public get partial(): false;
  public get pinnable(): boolean;
  public pinned: boolean;
  public reactions: ReactionManager;
  public stickers: Collection<Snowflake, Sticker>;
  public position: number | null;
  public roleSubscriptionData: RoleSubscriptionData | null;
  public resolved: CommandInteractionResolvedData | null;
  public system: boolean;
  public get thread(): AnyThreadChannel | null;
  public tts: boolean;
  public poll: Poll | null;
  public call: MessageCall | null;
  public type: MessageType;
  public get url(): string;
  public webhookId: Snowflake | null;
  public flags: Readonly<MessageFlagsBitField>;
  public reference: MessageReference | null;
  public messageSnapshots: Collection<Snowflake, MessageSnapshot>;
  public awaitMessageComponent<ComponentType extends MessageComponentType>(
    options?: AwaitMessageCollectorOptionsParams<ComponentType, InGuild>,
  ): Promise<MappedInteractionTypes<InGuild>[ComponentType]>;
  public awaitReactions(options?: AwaitReactionsOptions): Promise<Collection<Snowflake | string, MessageReaction>>;
  public createReactionCollector(options?: ReactionCollectorOptions): ReactionCollector;
  public createMessageComponentCollector<ComponentType extends MessageComponentType>(
    options?: MessageCollectorOptionsParams<ComponentType, InGuild>,
  ): InteractionCollector<MappedInteractionTypes<InGuild>[ComponentType]>;
  public delete(): Promise<OmitPartialGroupDMChannel<Message<InGuild>>>;
  public edit(
    content: MessageEditOptions | MessagePayload | string,
  ): Promise<OmitPartialGroupDMChannel<Message<InGuild>>>;
  public equals(message: Message, rawData: unknown): boolean;
  public fetchReference(): Promise<OmitPartialGroupDMChannel<Message<InGuild>>>;
  public fetchWebhook(): Promise<Webhook>;
  public crosspost(): Promise<OmitPartialGroupDMChannel<Message<InGuild>>>;
  public fetch(force?: boolean): Promise<OmitPartialGroupDMChannel<Message<InGuild>>>;
  public pin(reason?: string): Promise<OmitPartialGroupDMChannel<Message<InGuild>>>;
  public react(emoji: EmojiIdentifierResolvable): Promise<MessageReaction>;
  public removeAttachments(): Promise<OmitPartialGroupDMChannel<Message<InGuild>>>;
  public reply(
    options: MessagePayload | MessageReplyOptions | string,
  ): Promise<OmitPartialGroupDMChannel<Message<InGuild>>>;
  public forward(
    channel: Exclude<TextBasedChannelResolvable, PartialGroupDMChannel>,
  ): Promise<OmitPartialGroupDMChannel<Message>>;
  public resolveComponent(customId: string): MessageActionRowComponent | null;
  public startThread(options: StartThreadOptions): Promise<PublicThreadChannel<false>>;
  public suppressEmbeds(suppress?: boolean): Promise<OmitPartialGroupDMChannel<Message<InGuild>>>;
  public toJSON(): unknown;
  public toString(): string;
  public unpin(reason?: string): Promise<OmitPartialGroupDMChannel<Message<InGuild>>>;
  public inGuild(): this is Message<true>;
}

export class AttachmentBuilder {
  public constructor(attachment: BufferResolvable | Stream, data?: AttachmentData);
  public attachment: BufferResolvable | Stream;
  public description: string | null;
  public name: string | null;
  public title: string | null;
  public waveform: string | null;
  public duration: number | null;
  public get spoiler(): boolean;
  public setDescription(description: string): this;
  public setFile(attachment: BufferResolvable | Stream, name?: string): this;
  public setName(name: string): this;
  public setTitle(title: string): this;
  public setWaveform(waveform: string): this;
  public setDuration(duration: number): this;
  public setSpoiler(spoiler?: boolean): this;
  public toJSON(): unknown;
  public static from(other: JSONEncodable<AttachmentPayload>): AttachmentBuilder;
}

export class Attachment {
  private constructor(data: APIAttachment);
  private readonly attachment: BufferResolvable | Stream;
  public contentType: string | null;
  public description: string | null;
  public duration: number | null;
  public ephemeral: boolean;
  public flags: AttachmentFlagsBitField;
  public height: number | null;
  public id: Snowflake;
  public name: string;
  public proxyURL: string;
  public size: number;
  public get spoiler(): boolean;
  public title: string | null;
  public url: string;
  public waveform: string | null;
  public width: number | null;
  public toJSON(): unknown;
}

export type AttachmentFlagsString = keyof typeof AttachmentFlags;

export class AttachmentFlagsBitField extends BitField<AttachmentFlagsString> {
  public static Flags: Record<AttachmentFlagsString, number>;
  public static resolve(bit?: BitFieldResolvable<AttachmentFlagsString, number>): number;
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
  protected constructor(client: Client<true>, data: APIMessageComponentInteraction);
  public type: InteractionType.MessageComponent;
  public get component(): CacheTypeReducer<
    Cached,
    MessageActionRowComponent,
    APIComponentInMessageActionRow,
    APIComponentInMessageActionRow | MessageActionRowComponent,
    APIComponentInMessageActionRow | MessageActionRowComponent
  >;
  public componentType: MessageComponentType;
  public customId: string;
  public channelId: Snowflake;
  public deferred: boolean;
  public ephemeral: boolean | null;
  public message: Message<BooleanCache<Cached>>;
  public replied: boolean;
  public webhook: InteractionWebhook;
  public inGuild(): this is MessageComponentInteraction<'cached' | 'raw'>;
  public inCachedGuild(): this is MessageComponentInteraction<'cached'>;
  public inRawGuild(): this is MessageComponentInteraction<'raw'>;
  public deferReply(
    options: InteractionDeferReplyOptions & { withResponse: true },
  ): Promise<InteractionCallbackResponse<BooleanCache<Cached>>>;
  public deferReply(options?: InteractionDeferReplyOptions & { withResponse: false }): Promise<undefined>;
  public deferReply(
    options?: InteractionDeferReplyOptions,
  ): Promise<InteractionCallbackResponse<BooleanCache<Cached>> | undefined>;
  public deferUpdate(
    options: InteractionDeferUpdateOptions & { withResponse: true },
  ): Promise<InteractionCallbackResponse<BooleanCache<Cached>>>;
  public deferUpdate(options?: InteractionDeferUpdateOptions & { withResponse: false }): Promise<undefined>;
  public deferUpdate(
    options?: InteractionDeferUpdateOptions,
  ): Promise<InteractionCallbackResponse<BooleanCache<Cached>> | undefined>;
  public deleteReply(message?: MessageResolvable | '@original'): Promise<void>;
  public editReply(
    options: InteractionEditReplyOptions | MessagePayload | string,
  ): Promise<Message<BooleanCache<Cached>>>;
  public fetchReply(message?: Snowflake | '@original'): Promise<Message<BooleanCache<Cached>>>;
  public followUp(options: InteractionReplyOptions | MessagePayload | string): Promise<Message<BooleanCache<Cached>>>;
  public reply(
    options: InteractionReplyOptions & { withResponse: true },
  ): Promise<InteractionCallbackResponse<BooleanCache<Cached>>>;
  public reply(options: InteractionReplyOptions & { withResponse: false }): Promise<undefined>;
  public reply(
    options: InteractionReplyOptions | MessagePayload | string,
  ): Promise<InteractionCallbackResponse<BooleanCache<Cached>> | undefined>;
  public update(
    options: InteractionUpdateOptions & { withResponse: true },
  ): Promise<InteractionCallbackResponse<BooleanCache<Cached>>>;
  public update(options?: InteractionUpdateOptions & { withResponse: false }): Promise<undefined>;
  public update(
    options?: InteractionUpdateOptions | MessagePayload | string,
  ): Promise<InteractionCallbackResponse<BooleanCache<Cached>> | undefined>;
  public launchActivity(
    options: LaunchActivityOptions & { withResponse: true },
  ): Promise<InteractionCallbackResponse<BooleanCache<Cached>>>;
  public launchActivity(options?: LaunchActivityOptions & { withResponse?: false }): Promise<undefined>;
  public launchActivity(
    options?: LaunchActivityOptions,
  ): Promise<InteractionCallbackResponse<BooleanCache<Cached>> | undefined>;
  public showModal(
    modal:
      | APIModalInteractionResponseCallbackData
      | JSONEncodable<APIModalInteractionResponseCallbackData>
      | ModalComponentData,
    options: ShowModalOptions & { withResponse: true },
  ): Promise<InteractionCallbackResponse<BooleanCache<Cached>>>;
  public showModal(
    modal:
      | APIModalInteractionResponseCallbackData
      | JSONEncodable<APIModalInteractionResponseCallbackData>
      | ModalComponentData,
    options?: ShowModalOptions & { withResponse: false },
  ): Promise<undefined>;
  public showModal(
    modal:
      | APIModalInteractionResponseCallbackData
      | JSONEncodable<APIModalInteractionResponseCallbackData>
      | ModalComponentData,
    options?: ShowModalOptions,
  ): Promise<InteractionCallbackResponse<BooleanCache<Cached>> | undefined>;
  public awaitModalSubmit(options: AwaitModalSubmitOptions): Promise<ModalSubmitInteraction<Cached>>;
}

export class MessageContextMenuCommandInteraction<
  Cached extends CacheType = CacheType,
> extends ContextMenuCommandInteraction<Cached> {
  public commandType: ApplicationCommandType.Message;
  public options: Omit<
    CommandInteractionOptionResolver<Cached>,
    | 'getAttachment'
    | 'getBoolean'
    | 'getChannel'
    | 'getFocused'
    | 'getInteger'
    | 'getMentionable'
    | 'getNumber'
    | 'getRole'
    | 'getString'
    | 'getSubcommand'
    | 'getSubcommandGroup'
    | 'getUser'
  >;
  public get targetMessage(): NonNullable<CommandInteractionOption<Cached>['message']>;
  public inGuild(): this is MessageContextMenuCommandInteraction<'cached' | 'raw'>;
  public inCachedGuild(): this is MessageContextMenuCommandInteraction<'cached'>;
  public inRawGuild(): this is MessageContextMenuCommandInteraction<'raw'>;
}

export type MessageFlagsString = keyof typeof MessageFlags;

export class MessageFlagsBitField extends BitField<MessageFlagsString> {
  public static Flags: typeof MessageFlags;
  public static resolve(bit?: BitFieldResolvable<MessageFlagsString, number>): number;
}

export class MessageMentions<InGuild extends boolean = boolean> {
  private constructor(
    message: Message,
    users: ReadonlyCollection<Snowflake, User> | readonly APIUser[],
    roles: ReadonlyCollection<Snowflake, Role> | readonly Snowflake[],
    everyone: boolean,
    repliedUser?: APIUser | User,
  );
  private readonly _channels: Collection<Snowflake, Channel> | null;
  private readonly _content: string;
  private readonly _members: Collection<Snowflake, GuildMember> | null;
  private readonly _parsedUsers: Collection<Snowflake, User> | null;

  public get channels(): Collection<Snowflake, Channel>;
  public readonly client: Client;
  public everyone: boolean;
  public readonly guild: If<InGuild, Guild>;
  public has(data: ChannelResolvable | RoleResolvable | UserResolvable, options?: MessageMentionsHasOptions): boolean;
  public get members(): If<InGuild, Collection<Snowflake, GuildMember>>;
  public get parsedUsers(): Collection<Snowflake, User>;
  public repliedUser: User | null;
  public roles: Collection<Snowflake, Role>;
  public users: Collection<Snowflake, User>;
  public crosspostedChannels: Collection<Snowflake, CrosspostedChannel>;
  public toJSON(): unknown;

  private static readonly GlobalChannelsPattern: RegExp;
  private static readonly GlobalUsersPattern: RegExp;
  public static ChannelsPattern: typeof FormattingPatterns.Channel;
  public static EveryonePattern: RegExp;
  public static RolesPattern: typeof FormattingPatterns.Role;
  public static UsersPattern: typeof FormattingPatterns.User;
}

export type MessagePayloadOption =
  | InteractionReplyOptions
  | InteractionUpdateOptions
  | MessageCreateOptions
  | MessageEditOptions
  | WebhookMessageCreateOptions
  | WebhookMessageEditOptions;

export class MessagePayload {
  public constructor(target: MessageTarget, options: MessagePayloadOption);
  public body: RawMessagePayloadData | null;
  public get isUser(): boolean;
  public get isWebhook(): boolean;
  public get isMessage(): boolean;
  public get isMessageManager(): boolean;
  public files: RawFile[] | null;
  public options: MessagePayloadOption;
  public target: MessageTarget;

  public static create(
    target: MessageTarget,
    options: MessagePayloadOption | string,
    extra?: MessagePayloadOption,
  ): MessagePayload;
  public static resolveFile(
    fileLike: AttachmentPayload | BufferResolvable | JSONEncodable<AttachmentPayload> | Stream,
  ): Promise<RawFile>;

  public makeContent(): string | undefined;
  public resolveBody(): this;
  public resolveFiles(): Promise<this>;
}

export type RawMessagePayloadData =
  | RESTPatchAPIChannelMessageJSONBody
  | RESTPatchAPIInteractionFollowupJSONBody
  | RESTPatchAPIInteractionOriginalResponseJSONBody
  | RESTPatchAPIWebhookWithTokenJSONBody
  | RESTPostAPIChannelMessageJSONBody
  | RESTPostAPIInteractionCallbackFormDataBody
  | RESTPostAPIInteractionFollowupJSONBody
  | RESTPostAPIWebhookWithTokenJSONBody;

export class MessageReaction {
  private constructor(client: Client<true>, data: unknown, message: Message);
  private readonly _emoji: ApplicationEmoji | GuildEmoji | ReactionEmoji;

  public burstColors: string[] | null;
  public readonly client: Client<true>;
  public count: number;
  public countDetails: ReactionCountDetailsData;
  public get emoji(): ApplicationEmoji | GuildEmoji | ReactionEmoji;
  public me: boolean;
  public meBurst: boolean;
  public message: Message | PartialMessage;
  public get partial(): false;
  public users: ReactionUserManager;
  public react(): Promise<MessageReaction>;
  public remove(): Promise<MessageReaction>;
  public fetch(): Promise<MessageReaction>;
  public toJSON(): unknown;
  public valueOf(): Snowflake | string;
}

export interface MessageReactionEventDetails {
  burst: boolean;
  type: ReactionType;
}

export interface ModalComponentData {
  components: readonly (LabelData | TextDisplayComponentData)[];
  customId: string;
  title: string;
}

export interface BaseModalData<Type extends ComponentType> {
  id: number;
  type: Type;
}

export interface TextInputModalData extends BaseModalData<ComponentType.TextInput> {
  customId: string;
  value: string;
}

export interface SelectMenuModalData<Cached extends CacheType = CacheType>
  extends BaseModalData<
    | ComponentType.ChannelSelect
    | ComponentType.MentionableSelect
    | ComponentType.RoleSelect
    | ComponentType.StringSelect
    | ComponentType.UserSelect
  > {
  channels?: ReadonlyCollection<
    Snowflake,
    CacheTypeReducer<Cached, GuildBasedChannel, APIInteractionDataResolvedChannel>
  >;
  customId: string;
  members?: ReadonlyCollection<Snowflake, CacheTypeReducer<Cached, GuildMember, APIInteractionDataResolvedGuildMember>>;
  roles?: ReadonlyCollection<Snowflake, CacheTypeReducer<Cached, Role, APIRole>>;
  users?: ReadonlyCollection<Snowflake, User>;
  values: readonly string[];
}

export type ModalData = SelectMenuModalData | TextInputModalData;

export interface LabelModalData extends BaseModalData<ComponentType.Label> {
  component: readonly ModalData[];
}
export interface ActionRowModalData extends BaseModalData<ComponentType.ActionRow> {
  components: readonly TextInputModalData[];
}

export interface TextDisplayModalData extends BaseModalData<ComponentType.TextDisplay> {}

export interface ModalSelectedMentionables<Cached extends CacheType = CacheType> {
  members: NonNullable<SelectMenuModalData<Cached>['members']>;
  roles: NonNullable<SelectMenuModalData<Cached>['roles']>;
  users: NonNullable<SelectMenuModalData<Cached>['users']>;
}
export class ModalComponentResolver<Cached extends CacheType = CacheType> {
  private constructor(client: Client<true>, components: readonly ModalData[], resolved: BaseInteractionResolvedData);
  public readonly client: Client<true>;
  public readonly data: readonly (ActionRowModalData | LabelModalData | TextDisplayModalData)[];
  public readonly resolved: Readonly<BaseInteractionResolvedData<Cached>> | null;
  public readonly hoistedComponents: ReadonlyCollection<string, ModalData>;
  public getComponent(customId: string): ModalData;
  private _getTypedComponent(
    customId: string,
    allowedTypes: readonly ComponentType[],
    properties: string,
    required: boolean,
  ): ModalData;
  public getTextInputValue(customId: string): string;
  public getStringSelectValues(customId: string): readonly string[];
  public getSelectedUsers(customId: string, required: true): ReadonlyCollection<Snowflake, User>;
  public getSelectedUsers(customId: string, required?: boolean): ReadonlyCollection<Snowflake, User> | null;
  public getSelectedMembers(customId: string): NonNullable<SelectMenuModalData<Cached>['members']> | null;
  public getSelectedChannels<const Type extends ChannelType = ChannelType>(
    customId: string,
    required: true,
    channelTypes?: readonly Type[],
  ): ReadonlyCollection<
    Snowflake,
    Extract<
      NonNullable<CommandInteractionOption<Cached>['channel']>,
      {
        type: Type extends ChannelType.AnnouncementThread | ChannelType.PublicThread
          ? ChannelType.AnnouncementThread | ChannelType.PublicThread
          : Type;
      }
    >
  >;
  public getSelectedChannels<const Type extends ChannelType = ChannelType>(
    customId: string,
    required?: boolean,
    channelTypes?: readonly Type[],
  ): ReadonlyCollection<
    Snowflake,
    Extract<
      NonNullable<CommandInteractionOption<Cached>['channel']>,
      {
        type: Type extends ChannelType.AnnouncementThread | ChannelType.PublicThread
          ? ChannelType.AnnouncementThread | ChannelType.PublicThread
          : Type;
      }
    >
  > | null;

  public getSelectedRoles(customId: string, required: true): NonNullable<SelectMenuModalData<Cached>['roles']>;
  public getSelectedRoles(
    customId: string,
    required?: boolean,
  ): NonNullable<SelectMenuModalData<Cached>['roles']> | null;

  public getSelectedMentionables(customId: string, required: true): ModalSelectedMentionables<Cached>;
  public getSelectedMentionables(customId: string, required?: boolean): ModalSelectedMentionables<Cached> | null;
}

export interface ModalMessageModalSubmitInteraction<Cached extends CacheType = CacheType>
  extends ModalSubmitInteraction<Cached> {
  channelId: Snowflake;
  inCachedGuild(): this is ModalMessageModalSubmitInteraction<'cached'>;
  inGuild(): this is ModalMessageModalSubmitInteraction<'cached' | 'raw'>;
  inRawGuild(): this is ModalMessageModalSubmitInteraction<'raw'>;
  message: Message<BooleanCache<Cached>>;
  update(
    options: InteractionUpdateOptions & { withResponse: true },
  ): Promise<InteractionCallbackResponse<BooleanCache<Cached>>>;
  update(
    options: InteractionUpdateOptions | MessagePayload | string,
  ): Promise<InteractionCallbackResponse<BooleanCache<Cached>> | undefined>;
  update(options: InteractionUpdateOptions & { withResponse: false }): Promise<undefined>;
}

export class ModalSubmitInteraction<Cached extends CacheType = CacheType> extends BaseInteraction<Cached> {
  private constructor(client: Client<true>, data: APIModalSubmitInteraction);
  public type: InteractionType.ModalSubmit;
  public readonly customId: string;
  public readonly components: ModalComponentResolver<Cached>;
  public deferred: boolean;
  public ephemeral: boolean | null;
  public message: Message<BooleanCache<Cached>> | null;
  public replied: boolean;
  public readonly webhook: InteractionWebhook;
  public reply(
    options: InteractionReplyOptions & { withResponse: true },
  ): Promise<InteractionCallbackResponse<BooleanCache<Cached>>>;
  public reply(options: InteractionReplyOptions & { withResponse: false }): Promise<undefined>;
  public reply(
    options: InteractionReplyOptions | MessagePayload | string,
  ): Promise<InteractionCallbackResponse<BooleanCache<Cached>> | undefined>;
  public deleteReply(message?: MessageResolvable | '@original'): Promise<void>;
  public editReply(
    options: InteractionEditReplyOptions | MessagePayload | string,
  ): Promise<Message<BooleanCache<Cached>>>;
  public deferReply(
    options: InteractionDeferReplyOptions & { withResponse: true },
  ): Promise<InteractionCallbackResponse<BooleanCache<Cached>>>;
  public deferReply(options?: InteractionDeferReplyOptions & { withResponse: false }): Promise<undefined>;
  public deferReply(
    options?: InteractionDeferReplyOptions,
  ): Promise<InteractionCallbackResponse<BooleanCache<Cached>> | undefined>;
  public fetchReply(message?: Snowflake | '@original'): Promise<Message<BooleanCache<Cached>>>;
  public followUp(options: InteractionReplyOptions | MessagePayload | string): Promise<Message<BooleanCache<Cached>>>;
  public deferUpdate(
    options: InteractionDeferUpdateOptions & { withResponse: true },
  ): Promise<InteractionCallbackResponse<BooleanCache<Cached>>>;
  public deferUpdate(options?: InteractionDeferUpdateOptions & { withResponse: false }): Promise<undefined>;
  public deferUpdate(
    options?: InteractionDeferUpdateOptions,
  ): Promise<InteractionCallbackResponse<BooleanCache<Cached>> | undefined>;
  public launchActivity(
    options: LaunchActivityOptions & { withResponse: true },
  ): Promise<InteractionCallbackResponse<BooleanCache<Cached>>>;
  public launchActivity(options?: LaunchActivityOptions & { withResponse?: false }): Promise<undefined>;
  public launchActivity(
    options?: LaunchActivityOptions,
  ): Promise<InteractionCallbackResponse<BooleanCache<Cached>> | undefined>;
  public inGuild(): this is ModalSubmitInteraction<'cached' | 'raw'>;
  public inCachedGuild(): this is ModalSubmitInteraction<'cached'>;
  public inRawGuild(): this is ModalSubmitInteraction<'raw'>;
  public isFromMessage(): this is ModalMessageModalSubmitInteraction<Cached>;
}

export class AnnouncementChannel extends BaseGuildTextChannel {
  public threads: GuildTextThreadManager<AllowedThreadTypeForAnnouncementChannel>;
  public type: ChannelType.GuildAnnouncement;
  public addFollower(channel: TextChannelResolvable, reason?: string): Promise<FollowedChannelData>;
}

export type AnnouncementChannelResolvable = AnnouncementChannel | Snowflake;

export class OAuth2Guild extends BaseGuild {
  private constructor(client: Client<true>, data: RESTAPIPartialCurrentUserGuild);
  public owner: boolean;
  public permissions: Readonly<PermissionsBitField>;
}

export interface PartialGroupDMChannel extends TextBasedChannelFields<false, false>, PinnableChannelFields {}
export class PartialGroupDMChannel extends BaseChannel {
  private constructor(client: Client<true>, data: RawPartialGroupDMChannelData);
  public type: ChannelType.GroupDM;
  public flags: null;
  public name: string | null;
  public icon: string | null;
  public recipients: PartialRecipient[];
  public ownerId: Snowflake | null;
  public iconURL(options?: ImageURLOptions): string | null;
  public fetchOwner(options?: BaseFetchOptions): Promise<User>;
  public toString(): ChannelMention;
}

export interface GuildForumTagEmoji {
  id: Snowflake | null;
  name: string | null;
}

export interface GuildForumTag {
  emoji: GuildForumTagEmoji | null;
  id: Snowflake;
  moderated: boolean;
  name: string;
}

export interface GuildForumTagData extends Partial<GuildForumTag> {
  name: string;
}

export interface DefaultReactionEmoji {
  id: Snowflake | null;
  name: string | null;
}

export interface ThreadOnlyChannel extends WebhookChannelFields, SetRateLimitPerUserMethod {}
export abstract class ThreadOnlyChannel extends GuildChannel {
  public type: ChannelType.GuildForum | ChannelType.GuildMedia;
  public threads: GuildForumThreadManager;
  public availableTags: GuildForumTag[];
  public defaultReactionEmoji: DefaultReactionEmoji | null;
  public defaultThreadRateLimitPerUser: number | null;
  public rateLimitPerUser: number | null;
  public defaultAutoArchiveDuration: ThreadAutoArchiveDuration | null;
  public nsfw: boolean;
  public topic: string | null;
  public defaultSortOrder: SortOrderType | null;
  public setAvailableTags(tags: readonly GuildForumTagData[], reason?: string): Promise<this>;
  public setDefaultReactionEmoji(emojiId: DefaultReactionEmoji | null, reason?: string): Promise<this>;
  public setDefaultThreadRateLimitPerUser(rateLimit: number, reason?: string): Promise<this>;
  public createInvite(options?: InviteCreateOptions): Promise<GuildInvite>;
  public fetchInvites(cache?: boolean): Promise<Collection<string, GuildInvite>>;
  public setDefaultAutoArchiveDuration(
    defaultAutoArchiveDuration: ThreadAutoArchiveDuration,
    reason?: string,
  ): Promise<this>;
  public setTopic(topic: string | null, reason?: string): Promise<this>;
  public setDefaultSortOrder(defaultSortOrder: SortOrderType | null, reason?: string): Promise<this>;
}

export class ForumChannel extends ThreadOnlyChannel {
  public type: ChannelType.GuildForum;
  public defaultForumLayout: ForumLayoutType;
  public setDefaultForumLayout(defaultForumLayout: ForumLayoutType, reason?: string): Promise<this>;
}

export class MediaChannel extends ThreadOnlyChannel {
  public type: ChannelType.GuildMedia;
}

export class PermissionOverwrites extends Base {
  private constructor(client: Client<true>, data: unknown, channel: NonThreadGuildBasedChannel);
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
  protected constructor(client: Client<true>, data?: GatewayPresenceUpdate);
  public activities: Activity[];
  public clientStatus: ClientPresenceStatusData | null;
  public guild: Guild | null;
  public get member(): GuildMember | null;
  public status: PresenceStatus;
  public get user(): User | null;
  public userId: Snowflake;
  public equals(presence: Presence): boolean;
}

export interface PollQuestionMedia {
  text: string | null;
}

export interface BaseFetchPollAnswerVotersOptions {
  after?: Snowflake;
  limit?: number;
}

export class PollAnswerVoterManager extends CachedManager<Snowflake, User, UserResolvable> {
  private constructor(answer: PollAnswer);
  public answer: PollAnswer;
  public fetch(options?: BaseFetchPollAnswerVotersOptions): Promise<Collection<Snowflake, User>>;
}

export class Poll extends Base {
  private constructor(client: Client<true>, data: APIPoll, message: Message, channel: TextBasedChannel);
  public readonly channel: TextBasedChannel;
  public channelId: Snowflake;
  public readonly message: Message;
  public messageId: Snowflake;
  public question: PollQuestionMedia;
  public answers: Collection<number, PartialPollAnswer | PollAnswer>;
  public expiresTimestamp: number | null;
  public get expiresAt(): Date | null;
  public allowMultiselect: boolean;
  public layoutType: PollLayoutType;
  public resultsFinalized: boolean;
  public get partial(): false;
  public fetch(): Promise<this>;
  public end(): Promise<Message>;
}

export class PollAnswer extends Base {
  private constructor(client: Client<true>, data: APIPollAnswer & { count?: number }, poll: Poll);
  private readonly _emoji: APIPartialEmoji | null;
  public readonly poll: PartialPoll | Poll;
  public id: number;
  public text: string | null;
  public voteCount: number;
  public voters: PollAnswerVoterManager;
  public get emoji(): Emoji | GuildEmoji | null;
  public get partial(): false;
}

export interface ReactionCollectorEventTypes extends CollectorEventTypes<Snowflake | string, MessageReaction, [User]> {
  remove: [reaction: MessageReaction, user: User];
}

export class ReactionCollector extends Collector<
  Snowflake | string,
  MessageReaction,
  [User],
  ReactionCollectorEventTypes
> {
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
}

export class ReactionEmoji extends Emoji {
  private constructor(reaction: MessageReaction, emoji: unknown);
  public reaction: MessageReaction;
  public toJSON(): unknown;
}

export class RichPresenceAssets {
  private constructor(activity: Activity, assets: GatewayActivityAssets);
  public readonly activity: Activity;
  public largeImage: Snowflake | null;
  public largeText: string | null;
  public smallImage: Snowflake | null;
  public smallText: string | null;
  public largeImageURL(options?: ImageURLOptions): string | null;
  public smallImageURL(options?: ImageURLOptions): string | null;
}

export interface RoleColors {
  primaryColor: number;
  secondaryColor: number | null;
  tertiaryColor: number | null;
}

export interface RoleColorsResolvable {
  primaryColor: ColorResolvable;
  secondaryColor?: ColorResolvable;
  tertiaryColor?: ColorResolvable;
}

export class Role extends Base {
  private constructor(client: Client<true>, data: APIRole, guild: Guild);
  public colors: RoleColors;
  public get createdAt(): Date;
  public get createdTimestamp(): number;
  public get editable(): boolean;
  public flags: RoleFlagsBitField;
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
  public edit(options: RoleEditOptions): Promise<Role>;
  public equals(role: Role): boolean;
  public iconURL(options?: ImageURLOptions): string | null;
  public permissionsIn(
    channel: NonThreadGuildBasedChannel | Snowflake,
    checkAdmin?: boolean,
  ): Readonly<PermissionsBitField>;
  public setColors(colors: RoleColorsResolvable, reason?: string): Promise<Role>;
  public setHoist(hoist?: boolean, reason?: string): Promise<Role>;
  public setMentionable(mentionable?: boolean, reason?: string): Promise<Role>;
  public setName(name: string, reason?: string): Promise<Role>;
  public setPermissions(permissions: PermissionResolvable, reason?: string): Promise<Role>;
  public setIcon(icon: Base64Resolvable | BufferResolvable | EmojiResolvable | null, reason?: string): Promise<Role>;
  public setPosition(position: number, options?: SetRolePositionOptions): Promise<Role>;
  public setUnicodeEmoji(unicodeEmoji: string | null, reason?: string): Promise<Role>;
  public toJSON(): unknown;
  public toString(): RoleMention;
}

export type RoleFlagsString = keyof typeof RoleFlags;

export class RoleFlagsBitField extends BitField<RoleFlagsString> {
  public static Flags: typeof RoleFlags;
  public static resolve(bit?: BitFieldResolvable<RoleFlagsString, number>): number;
}

export interface SectionComponentData extends BaseComponentData {
  accessory: ButtonComponentData | ThumbnailComponentData;
  components: readonly TextDisplayComponentData[];
}

export class SectionComponent<
  AccessoryType extends ButtonComponent | ThumbnailComponent = ButtonComponent | ThumbnailComponent,
> extends Component<APISectionComponent> {
  private constructor(data: APISectionComponent);
  public readonly accessory: AccessoryType;
  public readonly components: TextDisplayComponent[];
  public toJSON(): APISectionComponent;
}

export class StringSelectMenuInteraction<
  Cached extends CacheType = CacheType,
> extends MessageComponentInteraction<Cached> {
  public constructor(client: Client<true>, data: APIMessageStringSelectInteractionData);
  public get component(): CacheTypeReducer<
    Cached,
    StringSelectMenuComponent,
    APIStringSelectComponent,
    APIStringSelectComponent | StringSelectMenuComponent,
    APIStringSelectComponent | StringSelectMenuComponent
  >;
  public componentType: ComponentType.StringSelect;
  public values: string[];
  public inGuild(): this is StringSelectMenuInteraction<'cached' | 'raw'>;
  public inCachedGuild(): this is StringSelectMenuInteraction<'cached'>;
  public inRawGuild(): this is StringSelectMenuInteraction<'raw'>;
}

export class UserSelectMenuInteraction<
  Cached extends CacheType = CacheType,
> extends MessageComponentInteraction<Cached> {
  public constructor(client: Client<true>, data: APIMessageUserSelectInteractionData);
  public get component(): CacheTypeReducer<
    Cached,
    UserSelectMenuComponent,
    APIUserSelectComponent,
    APIUserSelectComponent | UserSelectMenuComponent,
    APIUserSelectComponent | UserSelectMenuComponent
  >;
  public componentType: ComponentType.UserSelect;
  public values: Snowflake[];
  public users: Collection<Snowflake, User>;
  public members: Collection<
    Snowflake,
    CacheTypeReducer<Cached, GuildMember, APIGuildMember, APIGuildMember | GuildMember, APIGuildMember | GuildMember>
  >;
  public inGuild(): this is UserSelectMenuInteraction<'cached' | 'raw'>;
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
    APIRoleSelectComponent | RoleSelectMenuComponent,
    APIRoleSelectComponent | RoleSelectMenuComponent
  >;
  public componentType: ComponentType.RoleSelect;
  public values: Snowflake[];
  public roles: Collection<Snowflake, CacheTypeReducer<Cached, Role, APIRole, APIRole | Role, APIRole | Role>>;
  public inGuild(): this is RoleSelectMenuInteraction<'cached' | 'raw'>;
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
    APIMentionableSelectComponent | MentionableSelectMenuComponent,
    APIMentionableSelectComponent | MentionableSelectMenuComponent
  >;
  public componentType: ComponentType.MentionableSelect;
  public values: Snowflake[];
  public users: Collection<Snowflake, User>;
  public members: Collection<
    Snowflake,
    CacheTypeReducer<Cached, GuildMember, APIGuildMember, APIGuildMember | GuildMember, APIGuildMember | GuildMember>
  >;
  public roles: Collection<Snowflake, CacheTypeReducer<Cached, Role, APIRole, APIRole | Role, APIRole | Role>>;
  public inGuild(): this is MentionableSelectMenuInteraction<'cached' | 'raw'>;
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
    APIChannelSelectComponent | ChannelSelectMenuComponent,
    APIChannelSelectComponent | ChannelSelectMenuComponent
  >;
  public componentType: ComponentType.ChannelSelect;
  public values: Snowflake[];
  public channels: Collection<
    Snowflake,
    CacheTypeReducer<Cached, Channel, APIChannel, APIChannel | Channel, APIChannel | Channel>
  >;
  public inGuild(): this is ChannelSelectMenuInteraction<'cached' | 'raw'>;
  public inCachedGuild(): this is ChannelSelectMenuInteraction<'cached'>;
  public inRawGuild(): this is ChannelSelectMenuInteraction<'raw'>;
}

export type SelectMenuInteraction<Cached extends CacheType = CacheType> =
  | ChannelSelectMenuInteraction<Cached>
  | MentionableSelectMenuInteraction<Cached>
  | RoleSelectMenuInteraction<Cached>
  | StringSelectMenuInteraction<Cached>
  | UserSelectMenuInteraction<Cached>;

export type SelectMenuType = APISelectMenuComponent['type'];

export interface SeparatorComponentData extends BaseComponentData {
  divider?: boolean;
  spacing?: SeparatorSpacingSize;
}
export class SeparatorComponent extends Component<APISeparatorComponent> {
  private constructor(data: APISeparatorComponent);
  public get spacing(): SeparatorSpacingSize;
  public get divider(): boolean;
}

export interface ShardEventTypes {
  death: [process: ChildProcess | Worker];
  disconnect: [];
  error: [error: Error];
  message: [message: any];
  ready: [];
  reconnecting: [];
  resume: [];
  spawn: [process: ChildProcess | Worker];
}

export class Shard extends AsyncEventEmitter<ShardEventTypes> {
  private constructor(manager: ShardingManager, id: number);
  private readonly _evals: Map<string, Promise<unknown>>;
  private readonly _exitListener: (...args: any[]) => void;
  private readonly _fetches: Map<string, Promise<unknown>>;
  private _handleExit(respawn?: boolean, timeout?: number): void;
  private _handleMessage(message: unknown): void;
  private incrementMaxListeners(emitter: ChildProcess | Worker): void;
  private decrementMaxListeners(emitter: ChildProcess | Worker): void;

  public args: string[];
  public execArgv: string[];
  public env: unknown;
  public id: number;
  public manager: ShardingManager;
  public process: ChildProcess | null;
  public ready: boolean;
  public silent: boolean;
  public worker: Worker | null;
  public eval(script: string): Promise<unknown>;
  public eval<Result>(fn: (client: Client) => Result): Promise<Result>;
  public eval<Result, Context>(
    fn: (client: Client<true>, context: Serialized<Context>) => Result,
    context: Context,
  ): Promise<Result>;
  public fetchClientValue(prop: string): Promise<unknown>;
  public kill(): void;
  public respawn(options?: { delay?: number; timeout?: number }): Promise<ChildProcess>;
  public send(message: unknown): Promise<Shard>;
  public spawn(timeout?: number): Promise<ChildProcess>;
}

export class ShardClientUtil {
  private constructor(client: Client<true>, mode: ShardingManagerMode);
  private _handleMessage(message: unknown): void;
  private _respond(type: string, message: unknown): void;
  private incrementMaxListeners(emitter: ChildProcess | Worker): void;
  private decrementMaxListeners(emitter: ChildProcess | Worker): void;

  public client: Client;
  public mode: ShardingManagerMode;
  public parentPort: MessagePort | null;
  public broadcastEval<Result>(fn: (client: Client) => Awaitable<Result>): Promise<Serialized<Result>[]>;
  public broadcastEval<Result>(
    fn: (client: Client) => Awaitable<Result>,
    options: { shard: number },
  ): Promise<Serialized<Result>>;
  public broadcastEval<Result, Context>(
    fn: (client: Client<true>, context: Serialized<Context>) => Awaitable<Result>,
    options: { context: Context },
  ): Promise<Serialized<Result>[]>;
  public broadcastEval<Result, Context>(
    fn: (client: Client<true>, context: Serialized<Context>) => Awaitable<Result>,
    options: { context: Context; shard: number },
  ): Promise<Serialized<Result>>;
  public fetchClientValues(prop: string): Promise<unknown[]>;
  public fetchClientValues(prop: string, shard: number): Promise<unknown>;
  public respawnAll(options?: MultipleShardRespawnOptions): Promise<void>;
  public send(message: unknown): Promise<void>;

  public static singleton(client: Client<true>, mode: ShardingManagerMode): ShardClientUtil;
  public static shardIdForGuildId(guildId: Snowflake, shardCount: number): number;
}

export interface ShardingManagerEventTypes {
  shardCreate: [shard: Shard];
}

export class ShardingManager extends AsyncEventEmitter<ShardingManagerEventTypes> {
  public constructor(file: string, options?: ShardingManagerOptions);
  private _performOnShards(method: string, args: readonly unknown[]): Promise<unknown[]>;
  private _performOnShards(method: string, args: readonly unknown[], shard: number): Promise<unknown>;

  public file: string;
  public respawn: boolean;
  public silent: boolean;
  public shardArgs: string[];
  public shards: Collection<number, Shard>;
  public token: string | null;
  public totalShards: number | 'auto';
  public shardList: number[] | 'auto';
  public broadcast(message: unknown): Promise<Shard[]>;
  public broadcastEval<Result>(fn: (client: Client) => Awaitable<Result>): Promise<Serialized<Result>[]>;
  public broadcastEval<Result>(
    fn: (client: Client) => Awaitable<Result>,
    options: { shard: number },
  ): Promise<Serialized<Result>>;
  public broadcastEval<Result, Context>(
    fn: (client: Client<true>, context: Serialized<Context>) => Awaitable<Result>,
    options: { context: Context },
  ): Promise<Serialized<Result>[]>;
  public broadcastEval<Result, Context>(
    fn: (client: Client<true>, context: Serialized<Context>) => Awaitable<Result>,
    options: { context: Context; shard: number },
  ): Promise<Serialized<Result>>;
  public createShard(id: number): Shard;
  public fetchClientValues(prop: string): Promise<unknown[]>;
  public fetchClientValues(prop: string, shard: number): Promise<unknown>;
  public respawnAll(options?: MultipleShardRespawnOptions): Promise<Collection<number, Shard>>;
  public spawn(options?: MultipleShardSpawnOptions): Promise<Collection<number, Shard>>;
}

export interface FetchRecommendedShardCountOptions {
  guildsPerShard?: number;
  multipleOf?: number;
}

export {
  DiscordSnowflake as SnowflakeUtil,
  type SnowflakeGenerateOptions,
  type DeconstructedSnowflake,
} from '@sapphire/snowflake';

export class SKU extends Base {
  private constructor(client: Client<true>, data: APISKU);
  public id: Snowflake;
  public type: SKUType;
  public applicationId: Snowflake;
  public name: string;
  public slug: string;
  public flags: Readonly<SKUFlagsBitField>;
}

export type SKUFlagsString = keyof typeof SKUFlags;

export class SKUFlagsBitField extends BitField<SKUFlagsString> {
  public static FLAGS: typeof SKUFlags;
  public static resolve(bit?: BitFieldResolvable<SKUFlagsString, number>): number;
}

export class Subscription extends Base {
  private constructor(client: Client<true>, data: APISubscription);
  public id: Snowflake;
  public userId: Snowflake;
  public skuIds: Snowflake[];
  public entitlementIds: Snowflake[];
  public renewalSkuIds: Snowflake[] | null;
  public currentPeriodStartTimestamp: number;
  public currentPeriodEndTimestamp: number;
  public status: SubscriptionStatus;
  public canceledTimestamp: number | null;
  public country: string | null;
  public get canceledAt(): Date | null;
  public get currentPeriodStartAt(): Date;
  public get currentPeriodEndAt(): Date;
}

export class StageChannel extends BaseGuildVoiceChannel {
  public get stageInstance(): StageInstance | null;
  public topic: string | null;
  public type: ChannelType.GuildStageVoice;
  public createStageInstance(options: StageInstanceCreateOptions): Promise<StageInstance>;
  public setTopic(topic: string): Promise<StageChannel>;
}

export class DirectoryChannel extends BaseChannel {
  public flags: Readonly<ChannelFlagsBitField>;
  public guild: InviteGuild;
  public guildId: Snowflake;
  public name: string;
  public toString(): ChannelMention;
}

export class StageInstance extends Base {
  private constructor(client: Client<true>, data: unknown, channel: StageChannel);
  public id: Snowflake;
  public guildId: Snowflake;
  public channelId: Snowflake;
  public topic: string;
  public privacyLevel: StageInstancePrivacyLevel;
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
  private constructor(client: Client<true>, data: unknown);
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
  public edit(options?: GuildStickerEditOptions): Promise<Sticker>;
  public delete(reason?: string): Promise<Sticker>;
  public equals(other: Sticker | unknown): boolean;
}

export class StickerPack extends Base {
  private constructor(client: Client<true>, data: APIStickerPack);
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
  public sweepAutoModerationRules(
    filter: CollectionSweepFilter<
      SweeperDefinitions['autoModerationRules'][0],
      SweeperDefinitions['autoModerationRules'][1]
    >,
  ): number;
  public sweepBans(filter: CollectionSweepFilter<SweeperDefinitions['bans'][0], SweeperDefinitions['bans'][1]>): number;
  public sweepEmojis(
    filter: CollectionSweepFilter<SweeperDefinitions['emojis'][0], SweeperDefinitions['emojis'][1]>,
  ): number;
  public sweepEntitlements(
    filter: CollectionSweepFilter<SweeperDefinitions['entitlements'][0], SweeperDefinitions['entitlements'][1]>,
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
  public static filterByLifetime<Key, Value>(
    options?: LifetimeFilterOptions<Key, Value>,
  ): GlobalSweepFilter<Key, Value>;
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
  private constructor(client: Client<true>, data: APITeam);
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
  private constructor(team: Team, data: APITeamMember);
  public team: Team;
  public get id(): Snowflake;
  public membershipState: TeamMemberMembershipState;
  public user: User;
  public role: TeamMemberRole;

  public toString(): UserMention;
}

export class TextChannel extends BaseGuildTextChannel {
  public rateLimitPerUser: number;
  public threads: GuildTextThreadManager<AllowedThreadTypeForTextChannel>;
  public type: ChannelType.GuildText;
}

export interface TextDisplayComponentData extends BaseComponentData {
  content: string;
}

export class TextDisplayComponent extends Component<APITextDisplayComponent> {
  private constructor(data: APITextDisplayComponent);
  public get content(): string;
}

export type ForumThreadChannel = PublicThreadChannel<true>;
export type TextThreadChannel = PrivateThreadChannel | PublicThreadChannel<false>;
export type AnyThreadChannel = ForumThreadChannel | TextThreadChannel;

export interface PublicThreadChannel<Forum extends boolean = boolean> extends ThreadChannel<Forum> {
  type: ChannelType.AnnouncementThread | ChannelType.PublicThread;
}

export interface PrivateThreadChannel extends ThreadChannel<false> {
  get createdAt(): Date;
  get createdTimestamp(): number;
  type: ChannelType.PrivateThread;
}

export interface ThreadChannel<ThreadOnly extends boolean = boolean>
  extends TextBasedChannelFields<true>,
    PinnableChannelFields,
    BulkDeleteMethod,
    SetRateLimitPerUserMethod,
    MessageChannelFields,
    SendMethod<true> {}
export class ThreadChannel<ThreadOnly extends boolean = boolean> extends BaseChannel {
  private constructor(guild: Guild, data?: RawThreadChannelData, client?: Client<true>);
  public archived: boolean | null;
  public get archivedAt(): Date | null;
  public archiveTimestamp: number | null;
  public get createdAt(): Date | null;
  private readonly _createdTimestamp: number | null;
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
  public ownerId: Snowflake;
  public get parent(): If<ThreadOnly, ForumChannel | MediaChannel, AnnouncementChannel | TextChannel> | null;
  public parentId: Snowflake | null;
  public rateLimitPerUser: number | null;
  public type: ThreadChannelType;
  public get unarchivable(): boolean;
  public delete(reason?: string): Promise<this>;
  public edit(options: ThreadEditOptions): Promise<this>;
  public join(): Promise<this>;
  public leave(): Promise<this>;
  public permissionsFor(memberOrRole: GuildMember | Role, checkAdmin?: boolean): Readonly<PermissionsBitField>;
  public permissionsFor(
    memberOrRole: RoleResolvable | UserResolvable,
    checkAdmin?: boolean,
  ): Readonly<PermissionsBitField> | null;
  public fetchOwner(options?: FetchThreadOwnerOptions): Promise<ThreadMember>;
  public fetchStarterMessage(options?: BaseFetchOptions): Promise<Message<true> | null>;
  public setArchived(archived?: boolean, reason?: string): Promise<this>;
  public setAutoArchiveDuration(autoArchiveDuration: ThreadAutoArchiveDuration, reason?: string): Promise<this>;
  public setInvitable(invitable?: boolean, reason?: string): Promise<this>;
  public setLocked(locked?: boolean, reason?: string): Promise<this>;
  public setName(name: string, reason?: string): Promise<this>;
  // The following 3 methods can only be run on forum threads.
  public setAppliedTags(appliedTags: readonly Snowflake[], reason?: string): Promise<If<ThreadOnly, this, never>>;
  public pin(reason?: string): Promise<If<ThreadOnly, this, never>>;
  public unpin(reason?: string): Promise<If<ThreadOnly, this, never>>;
  public toString(): ChannelMention;
}

export class ThreadMember<HasMemberData extends boolean = boolean> extends Base {
  private constructor(thread: ThreadChannel, data: APIThreadMember, extra?: unknown);
  public flags: ThreadMemberFlagsBitField;
  private readonly member: If<HasMemberData, GuildMember>;
  public get guildMember(): HasMemberData extends true ? GuildMember : GuildMember | null;
  public id: Snowflake;
  public get joinedAt(): Date | null;
  public joinedTimestamp: number | null;
  public get manageable(): boolean;
  public thread: AnyThreadChannel;
  public get user(): User | null;
  public get partial(): false;
  public remove(): Promise<ThreadMember>;
}

export type ThreadMemberFlagsString = keyof typeof ThreadMemberFlags;

export class ThreadMemberFlagsBitField extends BitField<ThreadMemberFlagsString> {
  public static Flags: typeof ThreadMemberFlags;
  public static resolve(bit?: BitFieldResolvable<ThreadMemberFlagsString, number>): number;
}

export interface ThumbnailComponentData extends BaseComponentData {
  description?: string;
  media: UnfurledMediaItemData;
  spoiler?: boolean;
}

export class ThumbnailComponent extends Component<APIThumbnailComponent> {
  private constructor(data: APIThumbnailComponent);
  public readonly media: UnfurledMediaItem;
  public get description(): string | null;
  public get spoiler(): boolean;
}

export class Typing extends Base {
  private constructor(channel: TextBasedChannel, user: PartialUser, data?: GatewayTypingStartDispatchData);
  public channel: TextBasedChannel;
  public user: PartialUser | User;
  public startedTimestamp: number;
  public get startedAt(): Date;
  public get guild(): Guild | null;
  public get member(): GuildMember | null;
  public inGuild(): this is this & {
    channel: AnnouncementChannel | TextChannel | ThreadChannel;
    get guild(): Guild;
  };
}

export interface AvatarDecorationData {
  asset: string;
  skuId: Snowflake;
}

export interface Collectibles {
  nameplate: NameplateData | null;
}

export interface UserPrimaryGuild {
  badge: string | null;
  identityEnabled: boolean | null;
  identityGuildId: Snowflake | null;
  tag: string | null;
}

export interface NameplateData {
  asset: string;
  label: string;
  palette: NameplatePalette;
  skuId: Snowflake;
}

export interface UnfurledMediaItemData {
  url: string;
}

export class UnfurledMediaItem {
  private constructor(data: APIUnfurledMediaItem);
  public readonly data: APIUnfurledMediaItem;
  public get url(): string;
}

export interface User extends SendMethod<false> {}
export class User extends Base {
  protected constructor(client: Client<true>, data: unknown);
  private _equals(user: APIUser): boolean;

  public accentColor: number | null | undefined;
  public avatar: string | null;
  public avatarDecorationData: AvatarDecorationData | null;
  public banner: string | null | undefined;
  public bot: boolean;
  public get createdAt(): Date;
  public get createdTimestamp(): number;
  public collectibles: Collectibles | null;
  public discriminator: string;
  public get displayName(): string;
  public get defaultAvatarURL(): string;
  public get dmChannel(): DMChannel | null;
  public flags: Readonly<UserFlagsBitField> | null;
  public globalName: string | null;
  public get hexAccentColor(): HexColorString | null | undefined;
  public id: Snowflake;
  public get partial(): false;
  public primaryGuild: UserPrimaryGuild | null;
  public system: boolean;
  public get tag(): string;
  public username: string;
  public avatarURL(options?: ImageURLOptions): string | null;
  public avatarDecorationURL(): string | null;
  public bannerURL(options?: ImageURLOptions): string | null | undefined;
  public guildTagBadgeURL(options?: ImageURLOptions): string | null;
  public createDM(force?: boolean): Promise<DMChannel>;
  public deleteDM(): Promise<DMChannel>;
  public displayAvatarURL(options?: ImageURLOptions): string;
  public equals(user: User): boolean;
  public fetch(force?: boolean): Promise<User>;
  public toString(): UserMention;
}

export class UserContextMenuCommandInteraction<
  Cached extends CacheType = CacheType,
> extends ContextMenuCommandInteraction<Cached> {
  public commandType: ApplicationCommandType.User;
  public options: Omit<
    CommandInteractionOptionResolver<Cached>,
    | 'getAttachment'
    | 'getBoolean'
    | 'getChannel'
    | 'getFocused'
    | 'getInteger'
    | 'getMentionable'
    | 'getMessage'
    | 'getNumber'
    | 'getRole'
    | 'getString'
    | 'getSubcommand'
    | 'getSubcommandGroup'
  >;
  public get targetUser(): User;
  public get targetMember(): CacheTypeReducer<Cached, GuildMember, APIInteractionGuildMember> | null;
  public inGuild(): this is UserContextMenuCommandInteraction<'cached' | 'raw'>;
  public inCachedGuild(): this is UserContextMenuCommandInteraction<'cached'>;
  public inRawGuild(): this is UserContextMenuCommandInteraction<'raw'>;
}

export type UserFlagsString = keyof typeof UserFlags;

export class UserFlagsBitField extends BitField<UserFlagsString> {
  public static Flags: typeof UserFlags;
  public static resolve(bit?: BitFieldResolvable<UserFlagsString, number>): number;
}

export function cleanCodeBlockContent(text: string): string;
export function cleanContent(str: string, channel: TextBasedChannel): string;
export function discordSort<Key, Value extends { id: Snowflake; rawPosition: number }>(
  collection: ReadonlyCollection<Key, Value>,
): Collection<Key, Value>;
export function fetchRecommendedShardCount(token: string, options?: FetchRecommendedShardCountOptions): Promise<number>;
export function flatten(obj: unknown, ...props: Record<string, boolean | string>[]): unknown;

export function parseEmoji(text: string): PartialEmoji | null;
export function parseWebhookURL(url: string): WebhookClientDataIdWithToken | null;
export function resolveColor(color: ColorResolvable): number;
export function resolveSKUId(resolvable: SKUResolvable): Snowflake | null;
export function verifyString(data: string, error?: typeof Error, errorMessage?: string, allowEmpty?: boolean): string;

export type ComponentData =
  | ComponentInContainerData
  | ComponentInLabelData
  | ContainerComponentData
  | LabelData
  | MessageActionRowComponentData
  | ThumbnailComponentData;

export interface SendSoundboardSoundOptions {
  guildId?: Snowflake;
  soundId: Snowflake;
}

export class VoiceChannel extends BaseGuildVoiceChannel {
  public get speakable(): boolean;
  public type: ChannelType.GuildVoice;
  public sendSoundboardSound(sound: SendSoundboardSoundOptions | SoundboardSound): Promise<void>;
}

export class VoiceChannelEffect {
  private constructor(data: GatewayVoiceChannelEffectSendDispatchData, guild: Guild);
  public guild: Guild;
  public channelId: Snowflake;
  public userId: Snowflake;
  public emoji: Emoji | null;
  public animationType: VoiceChannelEffectSendAnimationType | null;
  public animationId: number | null;
  public soundId: Snowflake | number | null;
  public soundVolume: number | null;
  public get channel(): VoiceChannel | null;
  public get soundboardSound(): GuildSoundboardSound | null;
}

export class VoiceRegion {
  private constructor(data: APIVoiceRegion);
  public custom: boolean;
  public deprecated: boolean;
  public id: string;
  public name: string;
  public optimal: boolean;
  public toJSON(): unknown;
}

export class VoiceState extends Base {
  private constructor(guild: Guild, data: unknown);
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
  public edit(options: VoiceStateEditOptions): Promise<this>;
  public fetch(force?: boolean): Promise<VoiceState>;
}

export interface Webhook<Type extends WebhookType = WebhookType> extends WebhookFields {}
export class Webhook<Type extends WebhookType = WebhookType> {
  private constructor(client: Client<true>, data?: unknown);
  public avatar: string | null;
  public avatarURL(options?: ImageURLOptions): string | null;
  public channelId: Snowflake;
  public readonly client: Client;
  public guildId: Snowflake;
  public name: string;
  public owner: Type extends WebhookType.Incoming ? APIUser | User | null : APIUser | User;
  public sourceGuild: Type extends WebhookType.ChannelFollower ? APIPartialGuild | Guild : null;
  public sourceChannel: Type extends WebhookType.ChannelFollower ? AnnouncementChannel | APIPartialChannel : null;
  public token: Type extends WebhookType.Incoming
    ? string
    : Type extends WebhookType.ChannelFollower
      ? null
      : string | null;
  public type: Type;
  public applicationId: Type extends WebhookType.Application ? Snowflake : null;
  public get channel():
    | AnnouncementChannel
    | ForumChannel
    | MediaChannel
    | StageChannel
    | TextChannel
    | VoiceChannel
    | null;
  public isUserCreated(): this is Webhook<WebhookType.Incoming> & {
    owner: APIUser | User;
  };
  public isApplicationCreated(): this is Webhook<WebhookType.Application>;
  public isIncoming(): this is Webhook<WebhookType.Incoming>;
  public isChannelFollower(): this is Webhook<WebhookType.ChannelFollower>;

  public editMessage(
    message: MessageResolvable,
    options: MessagePayload | WebhookMessageEditOptions | string,
  ): Promise<Message<true>>;
  public fetchMessage(message: Snowflake, options?: WebhookFetchMessageOptions): Promise<Message<true>>;
  public send(options: MessagePayload | WebhookMessageCreateOptions | string): Promise<Message<true>>;
}

export interface WebhookClient extends WebhookFields, BaseClient<{}> {}
export class WebhookClient extends BaseClient<{}> {
  public constructor(data: WebhookClientData, options?: WebhookClientOptions);
  public readonly client: this;
  public options: WebhookClientOptions;
  public token: string;
  public editMessage(
    message: MessageResolvable,
    options: MessagePayload | WebhookMessageEditOptions | string,
  ): Promise<APIMessage>;
  public fetchMessage(message: Snowflake, options?: WebhookFetchMessageOptions): Promise<APIMessage>;
  public send(options: MessagePayload | WebhookMessageCreateOptions | string): Promise<APIMessage>;
}

export class Widget extends Base {
  private constructor(client: Client<true>, data: APIGuildWidget);
  private _patch(data: APIGuildWidget): void;
  public fetch(): Promise<Widget>;
  public imageURL(style?: GuildWidgetStyle): string;
  public id: Snowflake;
  public name: string;
  public instantInvite?: string;
  public channels: Collection<Snowflake, WidgetChannel>;
  public members: Collection<string, WidgetMember>;
  public presenceCount: number;
}

export class WidgetMember extends Base {
  private constructor(client: Client<true>, data: APIGuildWidgetMember);
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

export type SoundboardSoundResolvable = Snowflake | SoundboardSound | string;

export class SoundboardSound extends Base {
  private constructor(client: Client<true>, data: APISoundboardSound);
  public name: string;
  public soundId: Snowflake | string;
  public volume: number;
  private readonly _emoji: Omit<APIEmoji, 'animated'> | null;
  public guildId: Snowflake | null;
  public available: boolean;
  public user: User | null;
  public get createdAt(): Date;
  public get createdTimestamp(): number;
  public get emoji(): Emoji | null;
  public get guild(): Guild | null;
  public get url(): string;
  public edit(options?: GuildSoundboardSoundEditOptions): Promise<GuildSoundboardSound>;
  public delete(reason?: string): Promise<GuildSoundboardSound>;
  public equals(other: APISoundboardSound | SoundboardSound): boolean;
}

export type DefaultSoundboardSound = SoundboardSound & { get guild(): null; guildId: null; soundId: string };
export type GuildSoundboardSound = SoundboardSound & { get guild(): Guild; guildId: Snowflake; soundId: Snowflake };

export class WelcomeChannel extends Base {
  private constructor(guild: Guild, data: APIGuildWelcomeScreenChannel);
  private readonly _emoji: Omit<APIEmoji, 'animated'>;
  public channelId: Snowflake;
  public guild: Guild | InviteGuild;
  public description: string;
  public get channel(): AnnouncementChannel | ForumChannel | MediaChannel | TextChannel | null;
  public get emoji(): Emoji | GuildEmoji;
}

export class WelcomeScreen extends Base {
  private constructor(guild: Guild, data: APIGuildWelcomeScreen);
  public get enabled(): boolean;
  public guild: Guild | InviteGuild;
  public description: string | null;
  public welcomeChannels: Collection<Snowflake, WelcomeChannel>;
}

// #endregion

// #region Constants

export type NonSystemMessageType =
  | MessageType.ChatInputCommand
  | MessageType.ContextMenuCommand
  | MessageType.Default
  | MessageType.Reply;

export type UndeletableMessageType =
  | MessageType.Call
  | MessageType.ChannelIconChange
  | MessageType.ChannelNameChange
  | MessageType.RecipientAdd
  | MessageType.RecipientRemove
  | MessageType.ThreadStarterMessage;

export const Constants: {
  GuildTextBasedChannelTypes: GuildTextBasedChannelTypes[];
  HolographicStyle: {
    Primary: 11_127_295;
    Secondary: 16_759_788;
    Tertiary: 16_761_760;
  };
  MaxBulkDeletableMessageAge: 1_209_600_000;
  NonSystemMessageTypes: NonSystemMessageType[];
  SelectMenuTypes: SelectMenuType[];
  SendableChannels: SendableChannelTypes[];
  StickerFormatExtensionMap: Record<StickerFormatType, ImageFormat>;
  SweeperKeys: SweeperKey[];
  TextBasedChannelTypes: TextBasedChannelTypes[];
  ThreadChannelTypes: ThreadChannelType[];
  UndeletableMessageTypes: UndeletableMessageType[];
  VoiceBasedChannelTypes: VoiceBasedChannelTypes[];
};

export const version: string;

// #endregion

// #region Errors
/* eslint-disable typescript-sort-keys/string-enum */
export enum DiscordjsErrorCodes {
  ClientInvalidOption = 'ClientInvalidOption',
  ClientInvalidProvidedShards = 'ClientInvalidProvidedShards',
  ClientMissingIntents = 'ClientMissingIntents',
  ClientNotReady = 'ClientNotReady',

  TokenInvalid = 'TokenInvalid',
  TokenMissing = 'TokenMissing',
  ApplicationCommandPermissionsTokenMissing = 'ApplicationCommandPermissionsTokenMissing',

  BitFieldInvalid = 'BitFieldInvalid',

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

  InteractionCollectorError = 'InteractionCollectorError',

  FileNotFound = 'FileNotFound',

  UserNoDMChannel = 'UserNoDMChannel',

  VoiceNotStageChannel = 'VoiceNotStageChannel',

  VoiceStateNotOwn = 'VoiceStateNotOwn',
  VoiceStateInvalidType = 'VoiceStateInvalidType',

  ReqResourceType = 'ReqResourceType',

  MessageBulkDeleteType = 'MessageBulkDeleteType',
  MessageContentType = 'MessageContentType',
  MessageNonceRequired = 'MessageNonceRequired',
  MessageNonceType = 'MessageNonceType',

  BanResolveId = 'BanResolveId',
  FetchBanResolveId = 'FetchBanResolveId',

  PruneDaysType = 'PruneDaysType',

  GuildChannelResolve = 'GuildChannelResolve',
  GuildVoiceChannelResolve = 'GuildVoiceChannelResolve',
  GuildChannelOrphan = 'GuildChannelOrphan',
  GuildChannelUnowned = 'GuildChannelUnowned',
  GuildOwned = 'GuildOwned',
  GuildMembersTimeout = 'GuildMembersTimeout',
  GuildSoundboardSoundsTimeout = 'GuildSoundboardSoundsTimeout',
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
  MissingManageGuildExpressionsPermission = 'MissingManageGuildExpressionsPermission',

  NotGuildSoundboardSound = 'NotGuildSoundboardSound',
  NotGuildSticker = 'NotGuildSticker',

  ReactionResolveUser = 'ReactionResolveUser',

  InviteResolveCode = 'InviteResolveCode',
  InviteNotFound = 'InviteNotFound',

  DeleteGroupDMChannel = 'DeleteGroupDMChannel',
  FetchGroupDMChannel = 'FetchGroupDMChannel',

  MemberFetchNonceLength = 'MemberFetchNonceLength',

  GlobalCommandPermissions = 'GlobalCommandPermissions',
  GuildUncachedEntityResolve = 'GuildUncachedEntityResolve',

  InteractionAlreadyReplied = 'InteractionAlreadyReplied',
  InteractionNotReplied = 'InteractionNotReplied',

  CommandInteractionOptionNotFound = 'CommandInteractionOptionNotFound',
  CommandInteractionOptionType = 'CommandInteractionOptionType',
  CommandInteractionOptionEmpty = 'CommandInteractionOptionEmpty',
  CommandInteractionOptionNoSubcommand = 'CommandInteractionOptionNoSubcommand',
  CommandInteractionOptionNoSubcommandGroup = 'CommandInteractionOptionNoSubcommandGroup',
  AutocompleteInteractionOptionNoFocusedOption = 'AutocompleteInteractionOptionNoFocusedOption',

  ModalSubmitInteractionComponentNotFound = 'ModalSubmitInteractionComponentNotFound',
  ModalSubmitInteractionComponentType = 'ModalSubmitInteractionComponentType',
  ModalSubmitInteractionComponentEmpty = 'ModalSubmitInteractionComponentEmpty',
  ModalSubmitInteractionComponentInvalidChannelType = 'ModalSubmitInteractionComponentInvalidChannelType',

  InvalidMissingScopes = 'InvalidMissingScopes',
  InvalidScopesWithPermissions = 'InvalidScopesWithPermissions',

  NotImplemented = 'NotImplemented',

  SweepFilterReturn = 'SweepFilterReturn',

  GuildForumMessageRequired = 'GuildForumMessageRequired',

  EntitlementCreateInvalidOwner = 'EntitlementCreateInvalidOwner',

  BulkBanUsersOptionEmpty = 'BulkBanUsersOptionEmpty',

  PollAlreadyExpired = 'PollAlreadyExpired',
}
/* eslint-enable typescript-sort-keys/string-enum */

export class DiscordjsError extends Error {
  private constructor(code: DiscordjsErrorCodes, ...args: unknown[]);
  public readonly code: DiscordjsErrorCodes;
  public get name(): `Error [${DiscordjsErrorCodes}]`;
}

export class DiscordjsTypeError extends TypeError {
  private constructor(code: DiscordjsErrorCodes, ...args: unknown[]);
  public readonly code: DiscordjsErrorCodes;
  public get name(): `TypeError [${DiscordjsErrorCodes}]`;
}

export class DiscordjsRangeError extends RangeError {
  private constructor(code: DiscordjsErrorCodes, ...args: unknown[]);
  public readonly code: DiscordjsErrorCodes;
  public get name(): `RangeError [${DiscordjsErrorCodes}]`;
}

// #endregion

// #region Managers

export abstract class BaseManager {
  protected constructor(client: Client);
  public readonly client: Client;
}

export abstract class DataManager<Key, Holds, Resolvable> extends BaseManager {
  protected constructor(client: Client<true>, holds: Constructable<Holds>);
  public readonly holds: Constructable<Holds>;
  public get cache(): Collection<Key, Holds>;
  public resolve(resolvable: Holds): Holds;
  public resolve(resolvable: Resolvable): Holds | null;
  public resolveId(resolvable: Holds | Key): Key;
  public resolveId(resolvable: Resolvable): Key | null;
  public valueOf(): Collection<Key, Holds>;
}

export abstract class CachedManager<Key, Holds, Resolvable> extends DataManager<Key, Holds, Resolvable> {
  protected constructor(client: Client<true>, holds: Constructable<Holds>, iterable?: Iterable<Holds>);
  private readonly _cache: Collection<Key, Holds>;
  private _add(data: unknown, cache?: boolean, { id, extras }?: { extras: unknown[]; id: Key }): Holds;
}

export type ApplicationCommandDataResolvable =
  | ApplicationCommandData
  | JSONEncodable<RESTPostAPIApplicationCommandsJSONBody>
  | RESTPostAPIApplicationCommandsJSONBody;

export class ApplicationCommandManager<
  ApplicationCommandScope = ApplicationCommand<{ guild: GuildResolvable }>,
  PermissionsOptionsExtras = { guild: GuildResolvable },
  PermissionsGuildType = null,
> extends CachedManager<Snowflake, ApplicationCommandScope, ApplicationCommandResolvable> {
  protected constructor(client: Client<true>, iterable?: Iterable<unknown>);
  public permissions: ApplicationCommandPermissionsManager<
    PermissionsOptionsExtras & { command?: ApplicationCommandResolvable },
    PermissionsOptionsExtras & { command: ApplicationCommandResolvable },
    PermissionsGuildType,
    null
  >;
  private commandPath({ id, guildId }: { guildId?: Snowflake; id?: Snowflake }): string;
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
    options: Snowflake | (FetchGuildApplicationCommandFetchOptions & { id: Snowflake }),
  ): Promise<ApplicationCommandScope>;
  public fetch(
    options: FetchApplicationCommandOptions & { guildId: Snowflake; id: Snowflake },
  ): Promise<ApplicationCommand>;
  public fetch(
    options?: Omit<FetchApplicationCommandOptions, 'id'>,
  ): Promise<Collection<Snowflake, ApplicationCommandScope>>;
  public set(
    commands: readonly ApplicationCommandDataResolvable[],
  ): Promise<Collection<Snowflake, ApplicationCommandScope>>;
  public set(
    commands: readonly ApplicationCommandDataResolvable[],
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
  private constructor(manager: ApplicationCommand | ApplicationCommandManager | GuildApplicationCommandManager);
  private readonly manager: ApplicationCommand | ApplicationCommandManager | GuildApplicationCommandManager;

  public commandId: CommandIdType;
  public guild: GuildType;
  public guildId: Snowflake | null;
  public add(
    options: EditApplicationCommandPermissionsMixin & FetchSingleOptions,
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
          channels: readonly (ChannelPermissionConstant | GuildChannelResolvable)[];
          roles?: readonly (RolePermissionConstant | RoleResolvable)[];
          token: string;
          users?: readonly UserResolvable[];
        })
      | (FetchSingleOptions & {
          channels?: readonly (ChannelPermissionConstant | GuildChannelResolvable)[];
          roles: readonly (RolePermissionConstant | RoleResolvable)[];
          token: string;
          users?: readonly UserResolvable[];
        })
      | (FetchSingleOptions & {
          channels?: readonly (ChannelPermissionConstant | GuildChannelResolvable)[];
          roles?: readonly (RolePermissionConstant | RoleResolvable)[];
          token: string;
          users: readonly UserResolvable[];
        }),
  ): Promise<ApplicationCommandPermissions[]>;
  public set(
    options: EditApplicationCommandPermissionsMixin & FetchSingleOptions,
  ): Promise<ApplicationCommandPermissions[]>;
  private permissionsPath(guildId: Snowflake, commandId?: Snowflake): string;
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

export class CategoryChannelChildManager extends DataManager<Snowflake, CategoryChildChannel, GuildChannelResolvable> {
  private constructor(channel: CategoryChannel);

  public channel: CategoryChannel;
  public get guild(): Guild;
  public create<Type extends CategoryChannelChildTypes>(
    options: CategoryCreateChannelOptions & { type: Type },
  ): Promise<MappedChannelCategoryTypes[Type]>;
  public create(options: CategoryCreateChannelOptions): Promise<TextChannel>;
}

export class ChannelManager extends CachedManager<Snowflake, Channel, ChannelResolvable> {
  private constructor(client: Client<true>, iterable: Iterable<RawChannelData>);
  public createMessage(
    channel: Exclude<TextBasedChannelResolvable, PartialGroupDMChannel>,
    options: MessageCreateOptions | MessagePayload | string,
  ): Promise<OmitPartialGroupDMChannel<Message>>;
  public fetch(id: Snowflake, options?: FetchChannelOptions): Promise<Channel | null>;
}

export type EntitlementResolvable = Entitlement | Snowflake;
export type SKUResolvable = SKU | Snowflake;
export type SubscriptionResolvable = Snowflake | Subscription;

export interface GuildEntitlementCreateOptions {
  guild: GuildResolvable;
  sku: SKUResolvable;
}

export interface UserEntitlementCreateOptions {
  sku: SKUResolvable;
  user: UserResolvable;
}

export interface FetchEntitlementOptions extends BaseFetchOptions {
  entitlement: EntitlementResolvable;
}

export interface FetchEntitlementsOptions {
  after?: Snowflake;
  before?: Snowflake;
  cache?: boolean;
  excludeDeleted?: boolean;
  excludeEnded?: boolean;
  guild?: GuildResolvable;
  limit?: number;
  skus?: readonly SKUResolvable[];
  user?: UserResolvable;
}

export class EntitlementManager extends CachedManager<Snowflake, Entitlement, EntitlementResolvable> {
  private constructor(client: Client<true>, iterable: Iterable<APIEntitlement>);
  public fetch(options: EntitlementResolvable | FetchEntitlementOptions): Promise<Entitlement>;
  public fetch(options?: FetchEntitlementsOptions): Promise<Collection<Snowflake, Entitlement>>;
  public createTest(options: GuildEntitlementCreateOptions | UserEntitlementCreateOptions): Promise<Entitlement>;
  public deleteTest(entitlement: EntitlementResolvable): Promise<void>;
  public consume(entitlementId: Snowflake): Promise<void>;
}

export interface FetchSubscriptionOptions extends BaseFetchOptions {
  sku: SKUResolvable;
  subscriptionId: Snowflake;
}

export interface FetchSubscriptionsOptions {
  after?: Snowflake;
  before?: Snowflake;
  limit?: number;
  sku: SKUResolvable;
  user: UserResolvable;
}

export class SubscriptionManager extends CachedManager<Snowflake, Subscription, SubscriptionResolvable> {
  private constructor(client: Client<true>, iterable?: Iterable<APISubscription>);
  public fetch(options: FetchSubscriptionOptions): Promise<Subscription>;
  public fetch(options: FetchSubscriptionsOptions): Promise<Collection<Snowflake, Subscription>>;
}

export interface FetchGuildApplicationCommandFetchOptions extends BaseFetchOptions {
  id?: Snowflake;
  locale?: Locale;
  withLocalizations?: boolean;
}

export class GuildApplicationCommandManager extends ApplicationCommandManager<ApplicationCommand, {}, Guild> {
  private constructor(guild: Guild, iterable?: Iterable<APIApplicationCommand>);
  public guild: Guild;
  public create(command: ApplicationCommandDataResolvable): Promise<ApplicationCommand>;
  public delete(command: ApplicationCommandResolvable): Promise<ApplicationCommand | null>;
  public edit(
    command: ApplicationCommandResolvable,
    data: Partial<ApplicationCommandDataResolvable>,
  ): Promise<ApplicationCommand>;
  public fetch(
    options: Snowflake | (FetchGuildApplicationCommandFetchOptions & { id: Snowflake }),
  ): Promise<ApplicationCommand>;
  public fetch(
    options?: Omit<FetchGuildApplicationCommandFetchOptions, 'id'>,
  ): Promise<Collection<Snowflake, ApplicationCommand>>;
  public set(commands: readonly ApplicationCommandDataResolvable[]): Promise<Collection<Snowflake, ApplicationCommand>>;
}

export interface FollowedChannelData {
  channelId: Snowflake;
  webhookId: Snowflake;
}

export type MappedGuildChannelTypes = MappedChannelCategoryTypes & {
  [ChannelType.GuildCategory]: CategoryChannel;
};

export type GuildChannelTypes = CategoryChannelChildTypes | ChannelType.GuildCategory;

export class GuildChannelManager extends CachedManager<Snowflake, GuildBasedChannel, GuildChannelResolvable> {
  private constructor(guild: Guild, iterable?: Iterable<RawGuildChannelData>);
  public get channelCountWithoutThreads(): number;
  public guild: Guild;

  public addFollower(
    channel: AnnouncementChannelResolvable,
    targetChannel: TextChannelResolvable,
    reason?: string,
  ): Promise<FollowedChannelData>;
  public create<Type extends GuildChannelTypes>(
    options: GuildChannelCreateOptions & { type: Type },
  ): Promise<MappedGuildChannelTypes[Type]>;
  public create(options: GuildChannelCreateOptions): Promise<TextChannel>;
  public createWebhook(options: WebhookCreateOptions): Promise<Webhook<WebhookType.Incoming>>;
  public edit(channel: GuildChannelResolvable, data: GuildChannelEditOptions): Promise<GuildChannel>;
  public fetch(id: Snowflake, options?: BaseFetchOptions): Promise<GuildBasedChannel | null>;
  public fetch(
    id?: undefined,
    options?: BaseFetchOptions,
  ): Promise<Collection<Snowflake, NonThreadGuildBasedChannel | null>>;
  public fetchWebhooks(
    channel: GuildChannelResolvable,
  ): Promise<Collection<Snowflake, Webhook<WebhookType.ChannelFollower | WebhookType.Incoming>>>;
  public setPosition(
    channel: GuildChannelResolvable,
    position: number,
    options?: SetChannelPositionOptions,
  ): Promise<GuildChannel>;
  public setPositions(channelPositions: readonly ChannelPosition[]): Promise<Guild>;
  public fetchActiveThreads(cache?: boolean): Promise<FetchedThreads>;
  private rawFetchGuildActiveThreads(): Promise<RESTGetAPIGuildThreadsResult>;
  public delete(channel: GuildChannelResolvable, reason?: string): Promise<void>;
}

export class GuildEmojiManager extends CachedManager<Snowflake, GuildEmoji, EmojiResolvable> {
  private constructor(guild: Guild, iterable?: Iterable<APIEmoji>);
  public guild: Guild;
  public create(options: GuildEmojiCreateOptions): Promise<GuildEmoji>;
  public fetch(id: Snowflake, options?: BaseFetchOptions): Promise<GuildEmoji>;
  public fetch(id?: undefined, options?: BaseFetchOptions): Promise<Collection<Snowflake, GuildEmoji>>;
  public fetchAuthor(emoji: EmojiResolvable): Promise<User>;
  public delete(emoji: EmojiResolvable, reason?: string): Promise<void>;
  public edit(emoji: EmojiResolvable, options: GuildEmojiEditOptions): Promise<GuildEmoji>;
  public resolveIdentifier(emoji: EmojiIdentifierResolvable): string | null;
}

export class GuildEmojiRoleManager extends DataManager<Snowflake, Role, RoleResolvable> {
  private constructor(emoji: GuildEmoji);
  public emoji: GuildEmoji;
  public guild: Guild;
  public add(
    roleOrRoles: ReadonlyCollection<Snowflake, Role> | RoleResolvable | readonly RoleResolvable[],
  ): Promise<GuildEmoji>;
  public set(roles: ReadonlyCollection<Snowflake, Role> | readonly RoleResolvable[]): Promise<GuildEmoji>;
  public remove(
    roleOrRoles: ReadonlyCollection<Snowflake, Role> | RoleResolvable | readonly RoleResolvable[],
  ): Promise<GuildEmoji>;
}

export interface FetchSoundboardSoundsOptions {
  guildIds: readonly Snowflake[];
  time?: number;
}

export class GuildManager extends CachedManager<Snowflake, Guild, GuildResolvable> {
  private constructor(client: Client<true>, iterable?: Iterable<APIGuild | APIUnavailableGuild>);
  public fetch(options: FetchGuildOptions | Snowflake): Promise<Guild>;
  public fetch(options?: FetchGuildsOptions): Promise<Collection<Snowflake, OAuth2Guild>>;
  public fetchSoundboardSounds(
    options: FetchSoundboardSoundsOptions,
  ): Promise<Collection<Snowflake, Collection<Snowflake, GuildSoundboardSound>>>;
  public setIncidentActions(
    guild: GuildResolvable,
    incidentActions: IncidentActionsEditOptions,
  ): Promise<IncidentActions>;
  public widgetImageURL(guild: GuildResolvable, style?: GuildWidgetStyle): string;
}

export interface AddOrRemoveGuildMemberRoleOptions {
  reason?: string;
  role: RoleResolvable;
  user: UserResolvable;
}

export class GuildMemberManager extends CachedManager<Snowflake, GuildMember, UserResolvable> {
  private constructor(guild: Guild, iterable?: Iterable<unknown>);
  public guild: Guild;
  public get me(): GuildMember | null;
  public add(
    user: UserResolvable,
    options: AddGuildMemberOptions & { fetchWhenExisting: false },
  ): Promise<GuildMember | null>;
  public add(user: UserResolvable, options: AddGuildMemberOptions): Promise<GuildMember>;
  public ban(user: UserResolvable, options?: BanOptions): Promise<void>;
  public bulkBan(
    users: ReadonlyCollection<Snowflake, UserResolvable> | readonly UserResolvable[],
    options?: BanOptions,
  ): Promise<BulkBanResult>;
  public edit(user: UserResolvable, options: GuildMemberEditOptions): Promise<GuildMember>;
  public editMe(options: GuildMemberEditMeOptions): Promise<GuildMember>;
  public fetch(
    options: FetchMemberOptions | UserResolvable | (FetchMembersOptions & { user: UserResolvable }),
  ): Promise<GuildMember>;
  public fetch(options?: FetchMembersOptions): Promise<Collection<Snowflake, GuildMember>>;
  public fetchMe(options?: BaseFetchOptions): Promise<GuildMember>;
  public kick(user: UserResolvable, reason?: string): Promise<void>;
  public list(options?: GuildListMembersOptions): Promise<Collection<Snowflake, GuildMember>>;
  public prune(options: GuildPruneMembersOptions & { count: false; dry?: false }): Promise<null>;
  public prune(options?: GuildPruneMembersOptions): Promise<number>;
  public search(options: GuildSearchMembersOptions): Promise<Collection<Snowflake, GuildMember>>;
  public unban(user: UserResolvable, reason?: string): Promise<void>;
  public addRole(options: AddOrRemoveGuildMemberRoleOptions): Promise<void>;
  public removeRole(options: AddOrRemoveGuildMemberRoleOptions): Promise<void>;
}

export class GuildBanManager extends CachedManager<Snowflake, GuildBan, GuildBanResolvable> {
  private constructor(guild: Guild, iterable?: Iterable<unknown>);
  public guild: Guild;
  public create(user: UserResolvable, options?: BanOptions): Promise<void>;
  public fetch(options: FetchBanOptions | UserResolvable): Promise<GuildBan>;
  public fetch(options?: FetchBansOptions): Promise<Collection<Snowflake, GuildBan>>;
  public remove(user: UserResolvable, reason?: string): Promise<void>;
  public bulkCreate(
    users: ReadonlyCollection<Snowflake, UserResolvable> | readonly UserResolvable[],
    options?: BanOptions,
  ): Promise<BulkBanResult>;
}

export class GuildInviteManager extends DataManager<string, GuildInvite, GuildInviteResolvable> {
  private constructor(guild: Guild, iterable?: Iterable<unknown>);
  public guild: Guild;
  public create(channel: GuildInvitableChannelResolvable, options?: InviteCreateOptions): Promise<GuildInvite>;
  public fetch(options: FetchInviteOptions | InviteResolvable): Promise<GuildInvite>;
  public fetch(options?: FetchInvitesOptions): Promise<Collection<string, GuildInvite>>;
  public delete(invite: InviteResolvable, reason?: string): Promise<void>;
}

export class GuildScheduledEventManager extends CachedManager<
  Snowflake,
  GuildScheduledEvent,
  GuildScheduledEventResolvable
> {
  private constructor(guild: Guild, iterable?: Iterable<APIGuildScheduledEvent>);
  public guild: Guild;
  public create(options: GuildScheduledEventCreateOptions): Promise<GuildScheduledEvent>;
  public fetch(): Promise<Collection<Snowflake, GuildScheduledEvent>>;
  public fetch<
    Options extends FetchGuildScheduledEventOptions | FetchGuildScheduledEventsOptions | GuildScheduledEventResolvable,
  >(options?: Options): Promise<GuildScheduledEventManagerFetchResult<Options>>;
  public edit<
    Status extends GuildScheduledEventStatus,
    AcceptableStatus extends GuildScheduledEventSetStatusArg<Status>,
  >(
    guildScheduledEvent: GuildScheduledEventResolvable,
    options: GuildScheduledEventEditOptions<Status, AcceptableStatus>,
  ): Promise<GuildScheduledEvent<AcceptableStatus>>;
  public delete(guildScheduledEvent: GuildScheduledEventResolvable): Promise<void>;
  public fetchSubscribers<Options extends FetchGuildScheduledEventSubscribersOptions>(
    guildScheduledEvent: GuildScheduledEventResolvable,
    options?: Options,
  ): Promise<GuildScheduledEventManagerFetchSubscribersResult<Options>>;
}

export interface GuildSoundboardSoundCreateOptions {
  contentType?: string;
  emojiId?: Snowflake;
  emojiName?: string;
  file: BufferResolvable | Stream;
  name: string;
  reason?: string;
  volume?: number;
}

export interface GuildSoundboardSoundEditOptions {
  emojiId?: Snowflake | null;
  emojiName?: string | null;
  name?: string;
  reason?: string;
  volume?: number | null;
}

export interface FetchGuildSoundboardSoundOptions extends BaseFetchOptions {
  soundboardSound: SoundboardSoundResolvable;
}

export interface FetchGuildSoundboardSoundsOptions {
  cache?: boolean;
}

export class GuildSoundboardSoundManager extends CachedManager<Snowflake, SoundboardSound, SoundboardSoundResolvable> {
  private constructor(guild: Guild, iterable?: Iterable<APISoundboardSound>);
  public guild: Guild;
  public create(options: GuildSoundboardSoundCreateOptions): Promise<GuildSoundboardSound>;
  public edit(
    soundboardSound: SoundboardSoundResolvable,
    options: GuildSoundboardSoundEditOptions,
  ): Promise<GuildSoundboardSound>;
  public delete(soundboardSound: SoundboardSoundResolvable): Promise<void>;
  public fetch(id: Snowflake, options?: BaseFetchOptions): Promise<GuildSoundboardSound>;
  public fetch(options?: BaseFetchOptions): Promise<Collection<Snowflake, GuildSoundboardSound>>;
}

export class GuildStickerManager extends CachedManager<Snowflake, Sticker, StickerResolvable> {
  private constructor(guild: Guild, iterable?: Iterable<unknown>);
  public guild: Guild;
  public create(options: GuildStickerCreateOptions): Promise<Sticker>;
  public edit(sticker: StickerResolvable, data?: GuildStickerEditOptions): Promise<Sticker>;
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
    roleOrRoles: ReadonlyCollection<Snowflake, Role> | RoleResolvable | readonly RoleResolvable[],
    reason?: string,
  ): Promise<GuildMember>;
  public set(
    roles: ReadonlyCollection<Snowflake, Role> | readonly RoleResolvable[],
    reason?: string,
  ): Promise<GuildMember>;
  public remove(
    roleOrRoles: ReadonlyCollection<Snowflake, Role> | RoleResolvable | readonly RoleResolvable[],
    reason?: string,
  ): Promise<GuildMember>;
}

export interface FetchPollAnswerVotersOptions extends BaseFetchPollAnswerVotersOptions {
  answerId: number;
  messageId: Snowflake;
}

export abstract class MessageManager<InGuild extends boolean = boolean> extends CachedManager<
  Snowflake,
  Message<InGuild>,
  MessageResolvable
> {
  protected constructor(channel: TextBasedChannel, iterable?: Iterable<APIMessage>);
  public channel: TextBasedChannel;
  public delete(message: MessageResolvable): Promise<void>;
  public edit(
    message: MessageResolvable,
    options: MessageEditOptions | MessagePayload | string,
  ): Promise<Message<InGuild>>;
  public fetch(options: FetchMessageOptions | MessageResolvable): Promise<Message<InGuild>>;
  public fetch(options?: FetchMessagesOptions): Promise<Collection<Snowflake, Message<InGuild>>>;
  public fetchPins(options?: FetchPinnedMessagesOptions): Promise<FetchPinnedMessagesResponse<InGuild>>;
  public react(message: MessageResolvable, emoji: EmojiIdentifierResolvable): Promise<void>;
  public pin(message: MessageResolvable, reason?: string): Promise<void>;
  public unpin(message: MessageResolvable, reason?: string): Promise<void>;
  public endPoll(messageId: Snowflake): Promise<Message>;
  public fetchPollAnswerVoters(options: FetchPollAnswerVotersOptions): Promise<Collection<Snowflake, User>>;
}

export class DMMessageManager extends MessageManager {
  public channel: DMChannel;
}

export class PartialGroupDMMessageManager extends MessageManager {
  public channel: PartialGroupDMChannel;
}

export class GuildMessageManager extends MessageManager<true> {
  public channel: GuildTextBasedChannel;
  public crosspost(message: MessageResolvable): Promise<Message<true>>;
}

export class PermissionOverwriteManager extends CachedManager<
  Snowflake,
  PermissionOverwrites,
  PermissionOverwriteResolvable
> {
  private constructor(client: Client<true>, iterable?: Iterable<unknown>);
  public set(
    overwrites: ReadonlyCollection<Snowflake, OverwriteResolvable> | readonly OverwriteResolvable[],
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
  private constructor(client: Client<true>, iterable?: Iterable<GatewayPresenceUpdate>);
}

export class ReactionManager extends CachedManager<Snowflake | string, MessageReaction, MessageReactionResolvable> {
  private constructor(message: Message, iterable?: Iterable<unknown>);
  public message: Message;
  public removeAll(): Promise<Message>;
}

export class ReactionUserManager extends CachedManager<Snowflake, User, UserResolvable> {
  private constructor(reaction: MessageReaction, iterable?: Iterable<unknown>);
  public reaction: MessageReaction;
  public fetch(options?: FetchReactionUsersOptions): Promise<Collection<Snowflake, User>>;
  public remove(user?: UserResolvable): Promise<MessageReaction>;
}

export class RoleManager extends CachedManager<Snowflake, Role, RoleResolvable> {
  private constructor(guild: Guild, iterable?: Iterable<APIRole>);
  public get everyone(): Role;
  public get highest(): Role;
  public guild: Guild;
  public get premiumSubscriberRole(): Role | null;
  public botRoleFor(user: UserResolvable): Role | null;
  public fetch(id: Snowflake, options?: BaseFetchOptions): Promise<Role>;
  public fetch(id?: undefined, options?: BaseFetchOptions): Promise<Collection<Snowflake, Role>>;
  public create(options?: RoleCreateOptions): Promise<Role>;
  public edit(role: RoleResolvable, options: RoleEditOptions): Promise<Role>;
  public delete(role: RoleResolvable, reason?: string): Promise<void>;
  public setPosition(role: RoleResolvable, position: number, options?: SetRolePositionOptions): Promise<Role>;
  public setPositions(rolePositions: readonly RolePosition[]): Promise<Guild>;
  public comparePositions(role1: RoleResolvable, role2: RoleResolvable): number;
}

export class StageInstanceManager extends CachedManager<Snowflake, StageInstance, StageInstanceResolvable> {
  private constructor(guild: Guild, iterable?: Iterable<unknown>);
  public guild: Guild;
  public create(channel: StageChannelResolvable, options: StageInstanceCreateOptions): Promise<StageInstance>;
  public fetch(channel: StageChannelResolvable, options?: BaseFetchOptions): Promise<StageInstance>;
  public edit(channel: StageChannelResolvable, options: StageInstanceEditOptions): Promise<StageInstance>;
  public delete(channel: StageChannelResolvable): Promise<void>;
}

export class ThreadManager<ThreadOnly extends boolean = boolean> extends CachedManager<
  Snowflake,
  If<ThreadOnly, ForumThreadChannel, TextThreadChannel>,
  ThreadChannelResolvable
> {
  protected constructor(
    channel: AnnouncementChannel | ForumChannel | MediaChannel | TextChannel,
    iterable?: Iterable<RawThreadChannelData>,
  );
  public channel: If<ThreadOnly, ForumChannel | MediaChannel, AnnouncementChannel | TextChannel>;
  public fetch(
    options: ThreadChannelResolvable,
    cacheOptions?: BaseFetchOptions,
  ): Promise<If<ThreadOnly, ForumThreadChannel, TextThreadChannel> | null>;
  public fetch(
    options: FetchThreadsOptions & { archived: FetchArchivedThreadOptions },
    cacheOptions?: { cache?: boolean },
  ): Promise<FetchedThreadsMore>;
  public fetch(options?: FetchThreadsOptions, cacheOptions?: { cache?: boolean }): Promise<FetchedThreads>;
  public fetchArchived(options?: FetchArchivedThreadOptions, cache?: boolean): Promise<FetchedThreadsMore>;
  public fetchActive(cache?: boolean): Promise<FetchedThreads>;
}

export class GuildTextThreadManager<AllowedThreadType> extends ThreadManager<false> {
  public create(
    options: GuildTextThreadCreateOptions<AllowedThreadType>,
  ): Promise<AllowedThreadType extends ChannelType.PrivateThread ? PrivateThreadChannel : PublicThreadChannel<false>>;
}

export class GuildForumThreadManager extends ThreadManager<true> {
  public create(options: GuildForumThreadCreateOptions): Promise<ForumThreadChannel>;
}

export class ThreadMemberManager extends CachedManager<Snowflake, ThreadMember, ThreadMemberResolvable> {
  private constructor(thread: ThreadChannel, iterable?: Iterable<APIThreadMember>);
  public thread: AnyThreadChannel;
  public get me(): ThreadMember | null;
  public add(member: UserResolvable | '@me'): Promise<Snowflake>;

  public fetch(
    options: ThreadMember<true> | ({ member: ThreadMember<true> } | (FetchThreadMemberOptions & { withMember: true })),
  ): Promise<ThreadMember<true>>;

  public fetch(options: FetchThreadMemberOptions | ThreadMemberResolvable): Promise<ThreadMember>;

  public fetch(
    options: FetchThreadMembersWithGuildMemberDataOptions,
  ): Promise<Collection<Snowflake, ThreadMember<true>>>;

  public fetch(options?: FetchThreadMembersWithoutGuildMemberDataOptions): Promise<Collection<Snowflake, ThreadMember>>;
  public fetchMe(options?: BaseFetchOptions): Promise<ThreadMember>;
  public remove(member: UserResolvable | '@me'): Promise<Snowflake>;
}

export class UserManager extends CachedManager<Snowflake, User, UserResolvable> {
  private constructor(client: Client<true>, iterable?: Iterable<unknown>);
  private dmChannel(userId: Snowflake): DMChannel | null;
  public createDM(user: UserResolvable, options?: BaseFetchOptions): Promise<DMChannel>;
  public deleteDM(user: UserResolvable): Promise<DMChannel>;
  public fetch(user: UserResolvable, options?: BaseFetchOptions): Promise<User>;
  public send(user: UserResolvable, options: MessageCreateOptions | MessagePayload | string): Promise<Message>;
}

export class VoiceStateManager extends CachedManager<Snowflake, VoiceState, typeof VoiceState> {
  private constructor(guild: Guild, iterable?: Iterable<unknown>);
  public guild: Guild;
  public fetch(member: UserResolvable | '@me', options?: BaseFetchOptions): Promise<VoiceState>;
}

// #endregion

// #region Mixins

// Model the TextBasedChannel mixin system, allowing application of these fields
// to the classes that use these methods without having to manually add them
// to each of those classes

export type Constructable<Entity> = abstract new (...args: any[]) => Entity;

export interface SendMethod<InGuild extends boolean = boolean> {
  send(options: MessageCreateOptions | MessagePayload | string): Promise<Message<InGuild>>;
}

export interface PinnableChannelFields {
  get lastPinAt(): Date | null;
  lastPinTimestamp: number | null;
}

export interface BulkDeleteMethod {
  bulkDelete(
    messages: Collection<Snowflake, Message> | number | readonly MessageResolvable[],
    filterOld?: boolean,
  ): Promise<Snowflake[]>;
}

export interface SetRateLimitPerUserMethod {
  setRateLimitPerUser(rateLimitPerUser: number, reason?: string): Promise<this>;
}

export interface WebhookChannelFields {
  createWebhook(options: ChannelWebhookCreateOptions): Promise<Webhook<WebhookType.Incoming>>;
  fetchWebhooks(): Promise<Collection<Snowflake, Webhook<WebhookType.ChannelFollower | WebhookType.Incoming>>>;
  setNSFW(nsfw?: boolean, reason?: string): Promise<this>;
}

export interface MessageChannelFields {
  awaitMessages(options?: AwaitMessagesOptions): Promise<Collection<Snowflake, Message>>;
  createMessageCollector(options?: MessageCollectorOptions): MessageCollector;
  sendTyping(): Promise<void>;
}

export interface TextBasedChannelFields<InGuild extends boolean = boolean, InDM extends boolean = boolean> {
  awaitMessageComponent<ComponentType extends MessageComponentType>(
    options?: AwaitMessageCollectorOptionsParams<ComponentType, true>,
  ): Promise<MappedInteractionTypes[ComponentType]>;
  createMessageComponentCollector<ComponentType extends MessageComponentType>(
    options?: MessageChannelCollectorOptionsParams<ComponentType, true>,
  ): InteractionCollector<MappedInteractionTypes[ComponentType]>;
  get lastMessage(): Message | null;
  lastMessageId: Snowflake | null;
  messages: If<InGuild, GuildMessageManager, If<InDM, DMMessageManager, PartialGroupDMMessageManager>>;
}

export interface PartialWebhookFields {
  deleteMessage(message: APIMessage | MessageResolvable | '@original', threadId?: Snowflake): Promise<void>;
  editMessage(
    message: MessageResolvable | '@original',
    options: MessagePayload | WebhookMessageEditOptions | string,
  ): Promise<APIMessage | Message>;
  fetchMessage(message: Snowflake | '@original', options?: WebhookFetchMessageOptions): Promise<APIMessage | Message>;
  id: Snowflake;
  send(
    options: InteractionReplyOptions | MessagePayload | WebhookMessageCreateOptions | string,
  ): Promise<APIMessage | Message>;
  get url(): string;
}

export interface WebhookFields extends PartialWebhookFields {
  get createdAt(): Date;
  get createdTimestamp(): number;
  delete(reason?: string): Promise<void>;
  edit(options: WebhookEditOptions): Promise<this>;
  sendSlackMessage(body: unknown): Promise<boolean>;
}

// #endregion

// #region Typedefs

export interface ActivitiesOptions {
  name: string;
  state?: string;
  type?: ActivityType;
  url?: string;
}

export interface ActivityOptions extends ActivitiesOptions {
  shardId?: number | readonly number[];
}

export interface AddGuildMemberOptions {
  accessToken: string;
  deaf?: boolean;
  fetchWhenExisting?: boolean;
  force?: boolean;
  mute?: boolean;
  nick?: string;
  roles?: ReadonlyCollection<Snowflake, Role> | readonly RoleResolvable[];
}

export type AllowedPartial =
  | Channel
  | GuildMember
  | GuildScheduledEvent
  | Message
  | MessageReaction
  | Poll
  | PollAnswer
  | SoundboardSound
  | ThreadMember
  | User;

export type AllowedThreadTypeForAnnouncementChannel = ChannelType.AnnouncementThread;

export type AllowedThreadTypeForTextChannel = ChannelType.PrivateThread | ChannelType.PublicThread;

export interface BaseApplicationCommandData {
  contexts?: readonly InteractionContextType[];
  defaultMemberPermissions?: PermissionResolvable | null;
  integrationTypes?: readonly ApplicationIntegrationType[];
  name: string;
  nameLocalizations?: LocalizationMap;
  nsfw?: boolean;
}

export interface AttachmentData {
  description?: string;
  duration?: number;
  name?: string;
  title?: string;
  waveform?: string;
}

export type CommandOptionDataTypeResolvable = ApplicationCommandOptionType;

export type CommandOptionChannelResolvableType = ApplicationCommandOptionType.Channel;

export type CommandOptionChoiceResolvableType =
  | ApplicationCommandOptionType.String
  | CommandOptionNumericResolvableType;

export type CommandOptionNumericResolvableType =
  | ApplicationCommandOptionType.Integer
  | ApplicationCommandOptionType.Number;

export type CommandOptionSubOptionResolvableType =
  | ApplicationCommandOptionType.Subcommand
  | ApplicationCommandOptionType.SubcommandGroup;

export type CommandOptionNonChoiceResolvableType = Exclude<
  CommandOptionDataTypeResolvable,
  CommandOptionChannelResolvableType | CommandOptionChoiceResolvableType | CommandOptionSubOptionResolvableType
>;

export interface CommonBaseApplicationCommandOptionsData {
  description: string;
  descriptionLocalizations?: LocalizationMap;
  name: string;
  nameLocalizations?: LocalizationMap;
}
export interface BaseApplicationCommandOptionsData extends CommonBaseApplicationCommandOptionsData {
  required?: boolean;
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
  options?: readonly ApplicationCommandOptionData[];
  type?: ApplicationCommandType.ChatInput;
}

export interface PrimaryEntryPointCommandData extends BaseApplicationCommandData {
  description?: string;
  descriptionLocalizations?: LocalizationMap;
  handler?: EntryPointCommandHandlerType;
  type: ApplicationCommandType.PrimaryEntryPoint;
}

export type ApplicationCommandData =
  | ChatInputApplicationCommandData
  | MessageApplicationCommandData
  | PrimaryEntryPointCommandData
  | UserApplicationCommandData;

export interface ApplicationCommandChannelOptionData extends BaseApplicationCommandOptionsData {
  channelTypes?: readonly ApplicationCommandOptionAllowedChannelType[];
  channel_types?: readonly ApplicationCommandOptionAllowedChannelType[];
  type: CommandOptionChannelResolvableType;
}

export interface ApplicationCommandChannelOption extends BaseApplicationCommandOptionsData {
  channelTypes?: readonly ApplicationCommandOptionAllowedChannelType[];
  type: ApplicationCommandOptionType.Channel;
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

export interface ApplicationCommandAutocompleteNumericOption extends BaseApplicationCommandOptionsData {
  autocomplete: true;
  maxValue?: number;
  minValue?: number;
  type: CommandOptionNumericResolvableType;
}

export interface ApplicationCommandAutocompleteStringOption extends BaseApplicationCommandOptionsData {
  autocomplete: true;
  maxLength?: number;
  minLength?: number;
  type: ApplicationCommandOptionType.String;
}

export interface ApplicationCommandAutocompleteNumericOptionData extends BaseApplicationCommandOptionsData {
  autocomplete: true;
  maxValue?: number;
  max_value?: number;
  minValue?: number;
  min_value?: number;
  type: CommandOptionNumericResolvableType;
}

export interface ApplicationCommandAutocompleteStringOptionData extends BaseApplicationCommandOptionsData {
  autocomplete: true;
  maxLength?: number;
  max_length?: number;
  minLength?: number;
  min_length?: number;
  type: ApplicationCommandOptionType.String;
}

export interface ApplicationCommandChoicesData<Type extends number | string = number | string>
  extends BaseApplicationCommandOptionsData {
  autocomplete?: false;
  choices?: readonly ApplicationCommandOptionChoiceData<Type>[];
  type: CommandOptionChoiceResolvableType;
}

export interface ApplicationCommandChoicesOption<Type extends number | string = number | string>
  extends BaseApplicationCommandOptionsData {
  autocomplete?: false;
  choices?: readonly ApplicationCommandOptionChoiceData<Type>[];
  type: CommandOptionChoiceResolvableType;
}

export interface ApplicationCommandNumericOptionData extends ApplicationCommandChoicesData<number> {
  maxValue?: number;
  max_value?: number;
  minValue?: number;
  min_value?: number;
  type: CommandOptionNumericResolvableType;
}

export interface ApplicationCommandStringOptionData extends ApplicationCommandChoicesData<string> {
  maxLength?: number;
  max_length?: number;
  minLength?: number;
  min_length?: number;
  type: ApplicationCommandOptionType.String;
}

export interface ApplicationCommandBooleanOptionData extends BaseApplicationCommandOptionsData {
  type: ApplicationCommandOptionType.Boolean;
}

export interface ApplicationCommandNumericOption extends ApplicationCommandChoicesOption<number> {
  maxValue?: number;
  minValue?: number;
  type: CommandOptionNumericResolvableType;
}

export interface ApplicationCommandStringOption extends ApplicationCommandChoicesOption<string> {
  maxLength?: number;
  minLength?: number;
  type: ApplicationCommandOptionType.String;
}

export interface ApplicationCommandBooleanOption extends BaseApplicationCommandOptionsData {
  type: ApplicationCommandOptionType.Boolean;
}

export interface ApplicationCommandSubGroupData extends CommonBaseApplicationCommandOptionsData {
  options: readonly ApplicationCommandSubCommandData[];
  type: ApplicationCommandOptionType.SubcommandGroup;
}

export interface ApplicationCommandSubGroup extends CommonBaseApplicationCommandOptionsData {
  options?: readonly ApplicationCommandSubCommand[];
  type: ApplicationCommandOptionType.SubcommandGroup;
}

export interface ApplicationCommandSubCommandData extends CommonBaseApplicationCommandOptionsData {
  options?: readonly Exclude<
    ApplicationCommandOptionData,
    ApplicationCommandSubCommandData | ApplicationCommandSubGroupData
  >[];
  type: ApplicationCommandOptionType.Subcommand;
}

export interface ApplicationCommandSubCommand extends CommonBaseApplicationCommandOptionsData {
  options?: readonly Exclude<ApplicationCommandOption, ApplicationCommandSubCommand | ApplicationCommandSubGroup>[];
  type: ApplicationCommandOptionType.Subcommand;
}

export interface ApplicationCommandNonOptionsData extends BaseApplicationCommandOptionsData {
  type: CommandOptionNonChoiceResolvableType;
}

export interface ApplicationCommandNonOptions extends BaseApplicationCommandOptionsData {
  type: Exclude<CommandOptionNonChoiceResolvableType, ApplicationCommandOptionType>;
}

export type ApplicationCommandOptionData =
  | ApplicationCommandAutocompleteNumericOptionData
  | ApplicationCommandAutocompleteStringOptionData
  | ApplicationCommandBooleanOptionData
  | ApplicationCommandChannelOptionData
  | ApplicationCommandMentionableOptionData
  | ApplicationCommandNonOptionsData
  | ApplicationCommandNumericOptionData
  | ApplicationCommandRoleOptionData
  | ApplicationCommandStringOptionData
  | ApplicationCommandSubCommandData
  | ApplicationCommandSubGroupData
  | ApplicationCommandUserOptionData;

export type ApplicationCommandOption =
  | ApplicationCommandAttachmentOption
  | ApplicationCommandAutocompleteNumericOption
  | ApplicationCommandAutocompleteStringOption
  | ApplicationCommandBooleanOption
  | ApplicationCommandChannelOption
  | ApplicationCommandMentionableOption
  | ApplicationCommandNonOptions
  | ApplicationCommandNumericOption
  | ApplicationCommandRoleOption
  | ApplicationCommandStringOption
  | ApplicationCommandSubCommand
  | ApplicationCommandSubGroup
  | ApplicationCommandUserOption;

export interface ApplicationCommandOptionChoiceData<Value extends number | string = number | string> {
  name: string;
  nameLocalizations?: LocalizationMap;
  value: Value;
}

export interface ApplicationCommandPermissions {
  id: Snowflake;
  permission: boolean;
  type: ApplicationCommandPermissionType;
}

export interface ApplicationCommandPermissionsUpdateData {
  applicationId: Snowflake;
  guildId: Snowflake;
  id: Snowflake;
  permissions: readonly ApplicationCommandPermissions[];
}

export interface EditApplicationCommandPermissionsMixin {
  permissions: readonly ApplicationCommandPermissions[];
  token: string;
}

export type ChannelPermissionConstant = Snowflake;

export type RolePermissionConstant = Snowflake;

export type ApplicationCommandPermissionIdResolvable =
  | ChannelPermissionConstant
  | GuildChannelResolvable
  | RolePermissionConstant
  | RoleResolvable
  | UserResolvable;

export type ApplicationCommandResolvable = ApplicationCommand | Snowflake;

export type ApplicationFlagsString = keyof typeof ApplicationFlags;

export interface ApplicationRoleConnectionMetadataEditOptions {
  description: string;
  descriptionLocalizations?: LocalizationMap | null;
  key: string;
  name: string;
  nameLocalizations?: LocalizationMap | null;
  type: ApplicationRoleConnectionMetadataType;
}

export type AuditLogChange = {
  [SourceElement in APIAuditLogChange as SourceElement['key']]: {
    key: SourceElement['key'];
    new?: SourceElement['new_value'];
    old?: SourceElement['old_value'];
  };
}[APIAuditLogChange['key']];

export interface AutoModerationAction {
  metadata: AutoModerationActionMetadata;
  type: AutoModerationActionType;
}

export interface BaseAutoModerationActionMetadata {
  customMessage?: string | null;
  durationSeconds?: number | null;
}

export interface AutoModerationActionMetadata extends BaseAutoModerationActionMetadata {
  channelId: Snowflake | null;
  customMessage: string | null;
  durationSeconds: number | null;
}

export interface AutoModerationTriggerMetadata {
  allowList: readonly string[];
  keywordFilter: readonly string[];
  mentionRaidProtectionEnabled: boolean;
  mentionTotalLimit: number | null;
  presets: readonly AutoModerationRuleKeywordPresetType[];
  regexPatterns: readonly string[];
}

export interface AwaitMessageComponentOptions<Interaction extends CollectedMessageInteraction>
  extends CollectorOptions<[Interaction, Collection<Snowflake, Interaction>]> {
  componentType?: ComponentType;
}

export interface AwaitModalSubmitOptions
  extends CollectorOptions<[ModalSubmitInteraction, Collection<Snowflake, ModalSubmitInteraction>]> {
  time: number;
}

export interface AwaitMessagesOptions extends MessageCollectorOptions {
  errors?: readonly string[];
}

export interface AwaitReactionsOptions extends ReactionCollectorOptions {
  errors?: readonly string[];
}

export interface BanOptions {
  deleteMessageSeconds?: number;
  reason?: string;
}

export interface BulkBanResult {
  bannedUsers: readonly Snowflake[];
  failedUsers: readonly Snowflake[];
}

export interface PollData {
  allowMultiselect: boolean;
  answers: readonly PollAnswerData[];
  duration: number;
  layoutType?: PollLayoutType;
  question: PollQuestionMedia;
}

export interface PollAnswerData {
  emoji?: EmojiIdentifierResolvable;
  text: string;
}

export type Base64Resolvable = Base64String | Buffer;

export type Base64String = string;

export interface BaseFetchOptions {
  cache?: boolean;
  force?: boolean;
}

export type BitFieldResolvable<Flags extends string, Type extends bigint | number> =
  | Flags
  | Readonly<BitField<Flags, Type>>
  | RecursiveReadonlyArray<Flags | Readonly<BitField<Flags, Type>> | Type | `${bigint}`>
  | Type
  | `${bigint}`;

export type BufferResolvable = Buffer | string;

export interface Caches {
  ApplicationCommandManager: [manager: typeof ApplicationCommandManager, holds: typeof ApplicationCommand];
  ApplicationEmojiManager: [manager: typeof ApplicationEmojiManager, holds: typeof ApplicationEmoji];
  AutoModerationRuleManager: [manager: typeof AutoModerationRuleManager, holds: typeof AutoModerationRule];
  // TODO: ChannelManager: [manager: typeof ChannelManager, holds: typeof Channel];
  DMMessageManager: [manager: typeof MessageManager, holds: typeof Message<false>];
  EntitlementManager: [manager: typeof EntitlementManager, holds: typeof Entitlement];
  GuildBanManager: [manager: typeof GuildBanManager, holds: typeof GuildBan];
  // TODO: GuildChannelManager: [manager: typeof GuildChannelManager, holds: typeof GuildChannel];
  GuildEmojiManager: [manager: typeof GuildEmojiManager, holds: typeof GuildEmoji];
  GuildForumThreadManager: [manager: typeof GuildForumThreadManager, holds: typeof ThreadChannel<true>];
  GuildInviteManager: [manager: typeof GuildInviteManager, holds: typeof GuildInvite];
  // TODO: GuildManager: [manager: typeof GuildManager, holds: typeof Guild];
  GuildMemberManager: [manager: typeof GuildMemberManager, holds: typeof GuildMember];
  GuildMessageManager: [manager: typeof GuildMessageManager, holds: typeof Message<true>];
  GuildScheduledEventManager: [manager: typeof GuildScheduledEventManager, holds: typeof GuildScheduledEvent];
  GuildStickerManager: [manager: typeof GuildStickerManager, holds: typeof Sticker];
  GuildTextThreadManager: [manager: typeof GuildTextThreadManager, holds: typeof ThreadChannel<false>];
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
  [Cache in keyof Caches]: Caches[Cache][0] & { name: Cache };
};

export type OverriddenCaches =
  | 'DMMessageManager'
  | 'GuildForumThreadManager'
  | 'GuildMessageManager'
  | 'GuildTextThreadManager';

// This doesn't actually work the way it looks 😢.
// Narrowing the type of `manager.name` doesn't propagate type information to `holds` and the return type.
export type CacheFactory = (
  managerType: CacheConstructors[Exclude<keyof Caches, OverriddenCaches>],
  holds: Caches[(typeof manager)['name']][1],
  manager: CacheConstructors[keyof Caches],
) => (typeof manager)['prototype'] extends DataManager<infer Key, infer Value, any> ? Collection<Key, Value> : never;

export type CacheWithLimitsOptions = {
  [K in keyof Caches]?: Caches[K][0]['prototype'] extends DataManager<infer Key, infer Value, any>
    ? LimitedCollectionOptions<Key, Value> | number
    : never;
};

export interface CategoryCreateChannelOptions {
  availableTags?: readonly GuildForumTagData[];
  bitrate?: number;
  defaultAutoArchiveDuration?: ThreadAutoArchiveDuration;
  defaultForumLayout?: ForumLayoutType;
  defaultReactionEmoji?: DefaultReactionEmoji;
  defaultSortOrder?: SortOrderType;
  defaultThreadRateLimitPerUser?: number;
  name: string;
  nsfw?: boolean;
  permissionOverwrites?: ReadonlyCollection<Snowflake, OverwriteResolvable> | readonly OverwriteResolvable[];
  position?: number;
  rateLimitPerUser?: number;
  reason?: string;
  rtcRegion?: string;
  topic?: string;
  type?: CategoryChannelChildTypes;
  userLimit?: number;
  videoQualityMode?: VideoQualityMode;
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

export type GuildTextChannelResolvable = AnnouncementChannel | Snowflake | TextChannel;
export type ChannelResolvable = Channel | Snowflake;

export interface ChannelWebhookCreateOptions {
  avatar?: Base64Resolvable | BufferResolvable | null;
  name: string;
  reason?: string;
}

export interface WebhookCreateOptions extends ChannelWebhookCreateOptions {
  channel: AnnouncementChannel | ForumChannel | MediaChannel | Snowflake | StageChannel | TextChannel | VoiceChannel;
}

export interface GuildMembersChunk {
  count: number;
  index: number;
  nonce: string | undefined;
  notFound: readonly unknown[];
}

export type OmitPartialGroupDMChannel<Structure extends { channel: Channel }> = Structure & {
  channel: Exclude<Structure['channel'], PartialGroupDMChannel>;
};

export interface ClientEventTypes {
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
  clientReady: [client: Client<true>];
  debug: [message: string];
  emojiCreate: [emoji: GuildEmoji];
  emojiDelete: [emoji: GuildEmoji];
  emojiUpdate: [oldEmoji: GuildEmoji, newEmoji: GuildEmoji];
  entitlementCreate: [entitlement: Entitlement];
  entitlementDelete: [entitlement: Entitlement];
  entitlementUpdate: [oldEntitlement: Entitlement | null, newEntitlement: Entitlement];
  error: [error: Error];
  guildAuditLogEntryCreate: [auditLogEntry: GuildAuditLogsEntry, guild: Guild];
  guildAvailable: [guild: Guild];
  guildBanAdd: [ban: GuildBan];
  guildBanRemove: [ban: GuildBan];
  guildCreate: [guild: Guild];
  guildDelete: [guild: Guild];
  guildIntegrationsUpdate: [guild: Guild];
  guildMemberAdd: [member: GuildMember];
  guildMemberAvailable: [member: GuildMember | PartialGuildMember];
  guildMemberRemove: [member: GuildMember | PartialGuildMember];
  guildMemberUpdate: [oldMember: GuildMember | PartialGuildMember, newMember: GuildMember];
  guildMembersChunk: [members: ReadonlyCollection<Snowflake, GuildMember>, guild: Guild, data: GuildMembersChunk];
  guildScheduledEventCreate: [guildScheduledEvent: GuildScheduledEvent];
  guildScheduledEventDelete: [guildScheduledEvent: GuildScheduledEvent | PartialGuildScheduledEvent];
  guildScheduledEventUpdate: [
    oldGuildScheduledEvent: GuildScheduledEvent | PartialGuildScheduledEvent | null,
    newGuildScheduledEvent: GuildScheduledEvent,
  ];
  guildScheduledEventUserAdd: [guildScheduledEvent: GuildScheduledEvent | PartialGuildScheduledEvent, user: User];
  guildScheduledEventUserRemove: [guildScheduledEvent: GuildScheduledEvent | PartialGuildScheduledEvent, user: User];
  guildSoundboardSoundCreate: [soundboardSound: GuildSoundboardSound];
  guildSoundboardSoundDelete: [soundboardSound: GuildSoundboardSound | PartialSoundboardSound];
  guildSoundboardSoundUpdate: [
    oldSoundboardSound: GuildSoundboardSound | null,
    newSoundboardSound: GuildSoundboardSound,
  ];
  guildSoundboardSoundsUpdate: [soundboardSounds: ReadonlyCollection<Snowflake, GuildSoundboardSound>, guild: Guild];
  guildUnavailable: [guild: Guild];
  guildUpdate: [oldGuild: Guild, newGuild: Guild];
  interactionCreate: [interaction: Interaction];
  invalidated: [];
  inviteCreate: [invite: GuildInvite];
  inviteDelete: [invite: GuildInvite];
  messageCreate: [message: OmitPartialGroupDMChannel<Message>];
  messageDelete: [message: OmitPartialGroupDMChannel<Message | PartialMessage>];
  messageDeleteBulk: [
    messages: ReadonlyCollection<Snowflake, OmitPartialGroupDMChannel<Message | PartialMessage>>,
    channel: GuildTextBasedChannel,
  ];
  messagePollVoteAdd: [pollAnswer: PartialPollAnswer | PollAnswer, userId: Snowflake];
  messagePollVoteRemove: [pollAnswer: PartialPollAnswer | PollAnswer, userId: Snowflake];
  messageReactionAdd: [
    reaction: MessageReaction | PartialMessageReaction,
    user: PartialUser | User,
    details: MessageReactionEventDetails,
  ];
  messageReactionRemove: [
    reaction: MessageReaction | PartialMessageReaction,
    user: PartialUser | User,
    details: MessageReactionEventDetails,
  ];
  messageReactionRemoveAll: [
    message: OmitPartialGroupDMChannel<Message | PartialMessage>,
    reactions: ReadonlyCollection<Snowflake | string, MessageReaction>,
  ];
  messageReactionRemoveEmoji: [reaction: MessageReaction | PartialMessageReaction];
  messageUpdate: [
    oldMessage: OmitPartialGroupDMChannel<Message | PartialMessage>,
    newMessage: OmitPartialGroupDMChannel<Message>,
  ];
  presenceUpdate: [oldPresence: Presence | null, newPresence: Presence];
  roleCreate: [role: Role];
  roleDelete: [role: Role];
  roleUpdate: [oldRole: Role, newRole: Role];
  soundboardSounds: [soundboardSounds: ReadonlyCollection<Snowflake, GuildSoundboardSound>, guild: Guild];
  stageInstanceCreate: [stageInstance: StageInstance];
  stageInstanceDelete: [stageInstance: StageInstance];
  stageInstanceUpdate: [oldStageInstance: StageInstance | null, newStageInstance: StageInstance];
  stickerCreate: [sticker: Sticker];
  stickerDelete: [sticker: Sticker];
  stickerUpdate: [oldSticker: Sticker, newSticker: Sticker];
  subscriptionCreate: [subscription: Subscription];
  subscriptionDelete: [subscription: Subscription];
  subscriptionUpdate: [oldSubscription: Subscription | null, newSubscription: Subscription];
  threadCreate: [thread: AnyThreadChannel, newlyCreated: boolean];
  threadDelete: [thread: AnyThreadChannel];
  threadListSync: [threads: ReadonlyCollection<Snowflake, AnyThreadChannel>, guild: Guild];
  threadMemberUpdate: [oldMember: ThreadMember, newMember: ThreadMember];
  threadMembersUpdate: [
    addedMembers: ReadonlyCollection<Snowflake, ThreadMember>,
    removedMembers: ReadonlyCollection<Snowflake, PartialThreadMember | ThreadMember>,
    thread: AnyThreadChannel,
  ];
  threadUpdate: [oldThread: AnyThreadChannel, newThread: AnyThreadChannel];
  typingStart: [typing: Typing];
  userUpdate: [oldUser: PartialUser | User, newUser: User];
  voiceChannelEffectSend: [voiceChannelEffect: VoiceChannelEffect];
  voiceStateUpdate: [oldState: VoiceState, newState: VoiceState];
  warn: [message: string];
  webhooksUpdate: [channel: AnnouncementChannel | ForumChannel | MediaChannel | TextChannel | VoiceChannel];
}

export interface ClientFetchInviteOptions {
  guildScheduledEventId?: Snowflake;
  withCounts?: boolean;
}

export interface ClientOptions extends WebhookClientOptions {
  closeTimeout?: number;
  enforceNonce?: boolean;
  failIfNotExists?: boolean;
  intents: BitFieldResolvable<GatewayIntentsString, number>;
  jsonTransformer?(obj: unknown): unknown;
  makeCache?: CacheFactory;
  partials?: readonly Partials[];
  presence?: PresenceData;
  sweepers?: SweeperOptions;
  waitGuildTimeout?: number;
  ws?: Partial<WebSocketManagerOptions>;
}

export type ClientPresenceStatus = 'dnd' | 'idle' | 'online';

export interface ClientPresenceStatusData {
  desktop?: ClientPresenceStatus;
  mobile?: ClientPresenceStatus;
  web?: ClientPresenceStatus;
}

export interface ClientUserEditOptions {
  avatar?: Base64Resolvable | BufferResolvable | null;
  banner?: Base64Resolvable | BufferResolvable | null;
  username?: string;
}

export type CollectorFilter<Arguments extends unknown[]> = (...args: Arguments) => Awaitable<boolean>;

export interface CollectorOptions<FilterArguments extends unknown[]> {
  dispose?: boolean;
  filter?: CollectorFilter<FilterArguments>;
  idle?: number;
  time?: number;
}

export interface CollectorResetTimerOptions {
  idle?: number;
  time?: number;
}

export type ColorResolvable =
  | HexColorString
  | number
  | keyof typeof Colors
  | readonly [red: number, green: number, blue: number]
  | 'Random';

export interface CommandInteractionOption<Cached extends CacheType = CacheType> {
  attachment?: Attachment;
  autocomplete?: boolean;
  channel?: CacheTypeReducer<Cached, GuildBasedChannel, APIInteractionDataResolvedChannel>;
  focused?: boolean;
  member?: CacheTypeReducer<Cached, GuildMember, APIInteractionDataResolvedGuildMember>;
  message?: Message<BooleanCache<Cached>>;
  name: string;
  options?: readonly CommandInteractionOption[];
  role?: CacheTypeReducer<Cached, Role, APIRole>;
  type: ApplicationCommandOptionType;
  user?: User;
  value?: boolean | number | string;
}

export interface BaseInteractionResolvedData<Cached extends CacheType = CacheType> {
  channels?: ReadonlyCollection<Snowflake, CacheTypeReducer<Cached, Channel, APIInteractionDataResolvedChannel>>;
  members?: ReadonlyCollection<Snowflake, CacheTypeReducer<Cached, GuildMember, APIInteractionDataResolvedGuildMember>>;
  roles?: ReadonlyCollection<Snowflake, CacheTypeReducer<Cached, Role, APIRole>>;
  users?: ReadonlyCollection<Snowflake, User>;
}

export interface CommandInteractionResolvedData<Cached extends CacheType = CacheType>
  extends BaseInteractionResolvedData<Cached> {
  attachments?: ReadonlyCollection<Snowflake, Attachment>;
  messages?: ReadonlyCollection<Snowflake, CacheTypeReducer<Cached, Message, APIMessage>>;
}

export interface AutocompleteFocusedOption {
  focused: true;
  name: string;
  type:
    | ApplicationCommandOptionType.Integer
    | ApplicationCommandOptionType.Number
    | ApplicationCommandOptionType.String;
  value: string;
}

export declare const Colors: {
  Aqua: 0x1abc9c;
  Blue: 0x3498db;
  Blurple: 0x5865f2;
  DarkAqua: 0x11806a;
  DarkBlue: 0x206694;
  DarkButNotBlack: 0x2c2f33;
  DarkGold: 0xc27c0e;
  DarkGreen: 0x1f8b4c;
  DarkGrey: 0x979c9f;
  DarkNavy: 0x2c3e50;
  DarkOrange: 0xa84300;
  DarkPurple: 0x71368a;
  DarkRed: 0x992d22;
  DarkVividPink: 0xad1457;
  DarkerGrey: 0x7f8c8d;
  Default: 0x000000;
  Fuchsia: 0xeb459e;
  Gold: 0xf1c40f;
  Green: 0x57f287;
  Grey: 0x95a5a6;
  Greyple: 0x99aab5;
  LightGrey: 0xbcc0c0;
  LuminousVividPink: 0xe91e63;
  Navy: 0x34495e;
  NotQuiteBlack: 0x23272a;
  Orange: 0xe67e22;
  Purple: 0x9b59b6;
  Red: 0xed4245;
  White: 0xffffff;
  Yellow: 0xfee75c;
};

export enum Events {
  ApplicationCommandPermissionsUpdate = 'applicationCommandPermissionsUpdate',
  AutoModerationActionExecution = 'autoModerationActionExecution',
  AutoModerationRuleCreate = 'autoModerationRuleCreate',
  AutoModerationRuleDelete = 'autoModerationRuleDelete',
  AutoModerationRuleUpdate = 'autoModerationRuleUpdate',
  CacheSweep = 'cacheSweep',
  ChannelCreate = 'channelCreate',
  ChannelDelete = 'channelDelete',
  ChannelPinsUpdate = 'channelPinsUpdate',
  ChannelUpdate = 'channelUpdate',
  ClientReady = 'clientReady',
  Debug = 'debug',
  EntitlementCreate = 'entitlementCreate',
  EntitlementDelete = 'entitlementDelete',
  EntitlementUpdate = 'entitlementUpdate',
  Error = 'error',
  GuildAuditLogEntryCreate = 'guildAuditLogEntryCreate',
  GuildAvailable = 'guildAvailable',
  GuildBanAdd = 'guildBanAdd',
  GuildBanRemove = 'guildBanRemove',
  GuildCreate = 'guildCreate',
  GuildDelete = 'guildDelete',
  GuildEmojiCreate = 'emojiCreate',
  GuildEmojiDelete = 'emojiDelete',
  GuildEmojiUpdate = 'emojiUpdate',
  GuildIntegrationsUpdate = 'guildIntegrationsUpdate',
  GuildMemberAdd = 'guildMemberAdd',
  GuildMemberAvailable = 'guildMemberAvailable',
  GuildMemberRemove = 'guildMemberRemove',
  GuildMemberUpdate = 'guildMemberUpdate',
  GuildMembersChunk = 'guildMembersChunk',
  GuildRoleCreate = 'roleCreate',
  GuildRoleDelete = 'roleDelete',
  GuildRoleUpdate = 'roleUpdate',
  GuildScheduledEventCreate = 'guildScheduledEventCreate',
  GuildScheduledEventDelete = 'guildScheduledEventDelete',
  GuildScheduledEventUpdate = 'guildScheduledEventUpdate',
  GuildScheduledEventUserAdd = 'guildScheduledEventUserAdd',
  GuildScheduledEventUserRemove = 'guildScheduledEventUserRemove',
  GuildSoundboardSoundCreate = 'guildSoundboardSoundCreate',
  GuildSoundboardSoundDelete = 'guildSoundboardSoundDelete',
  GuildSoundboardSoundUpdate = 'guildSoundboardSoundUpdate',
  GuildSoundboardSoundsUpdate = 'guildSoundboardSoundsUpdate',
  GuildStickerCreate = 'stickerCreate',
  GuildStickerDelete = 'stickerDelete',
  GuildStickerUpdate = 'stickerUpdate',
  GuildUnavailable = 'guildUnavailable',
  GuildUpdate = 'guildUpdate',
  InteractionCreate = 'interactionCreate',
  Invalidated = 'invalidated',
  InviteCreate = 'inviteCreate',
  InviteDelete = 'inviteDelete',
  MessageBulkDelete = 'messageDeleteBulk',
  MessageCreate = 'messageCreate',
  MessageDelete = 'messageDelete',
  MessagePollVoteAdd = 'messagePollVoteAdd',
  MessagePollVoteRemove = 'messagePollVoteRemove',
  MessageReactionAdd = 'messageReactionAdd',
  MessageReactionRemove = 'messageReactionRemove',
  MessageReactionRemoveAll = 'messageReactionRemoveAll',
  MessageReactionRemoveEmoji = 'messageReactionRemoveEmoji',
  MessageUpdate = 'messageUpdate',
  PresenceUpdate = 'presenceUpdate',
  SoundboardSounds = 'soundboardSounds',
  StageInstanceCreate = 'stageInstanceCreate',
  StageInstanceDelete = 'stageInstanceDelete',
  StageInstanceUpdate = 'stageInstanceUpdate',
  SubscriptionCreate = 'subscriptionCreate',
  SubscriptionDelete = 'subscriptionDelete',
  SubscriptionUpdate = 'subscriptionUpdate',
  ThreadCreate = 'threadCreate',
  ThreadDelete = 'threadDelete',
  ThreadListSync = 'threadListSync',
  ThreadMemberUpdate = 'threadMemberUpdate',
  ThreadMembersUpdate = 'threadMembersUpdate',
  ThreadUpdate = 'threadUpdate',
  TypingStart = 'typingStart',
  UserUpdate = 'userUpdate',
  VoiceChannelEffectSend = 'voiceChannelEffectSend',
  VoiceServerUpdate = 'voiceServerUpdate',
  VoiceStateUpdate = 'voiceStateUpdate',
  Warn = 'warn',
  WebhooksUpdate = 'webhooksUpdate',
}

export enum ShardEvents {
  Death = 'death',
  Disconnect = 'disconnect',
  Error = 'error',
  Message = 'message',
  Ready = 'ready',
  Resume = 'resume',
  Spawn = 'spawn',
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

export interface GuildScheduledEventInviteURLCreateOptions extends InviteCreateOptions {
  channel?: GuildInvitableChannelResolvable;
}

export interface RoleCreateOptions extends RoleData {
  reason?: string;
}

export interface RoleEditOptions extends RoleData {
  reason?: string;
}

export interface StageInstanceCreateOptions {
  guildScheduledEvent?: GuildScheduledEventResolvable;
  privacyLevel?: StageInstancePrivacyLevel;
  sendStartNotification?: boolean;
  topic: string;
}

export interface CrosspostedChannel {
  channelId: Snowflake;
  guildId: Snowflake;
  name: string;
  type: ChannelType;
}

export type DateResolvable = Date | number | string;

export interface GuildTemplateEditOptions {
  description?: string;
  name?: string;
}

export interface EmbedField {
  inline: boolean;
  name: string;
  value: string;
}

export type EmojiIdentifierResolvable =
  | EmojiResolvable
  | string
  | `<${'' | 'a'}:${string}:${Snowflake}>`
  | `${'' | 'a:'}${string}:${Snowflake}`;

export type EmojiResolvable = ApplicationEmoji | GuildEmoji | ReactionEmoji | Snowflake;

export interface FetchApplicationCommandOptions extends FetchGuildApplicationCommandFetchOptions {
  guildId?: Snowflake;
}

export interface FetchArchivedThreadOptions {
  before?: DateResolvable | ThreadChannelResolvable;
  fetchAll?: boolean;
  limit?: number;
  type?: 'private' | 'public';
}

export interface FetchAutoModerationRuleOptions extends BaseFetchOptions {
  autoModerationRule: AutoModerationRuleResolvable;
}

export interface FetchAutoModerationRulesOptions {
  cache?: boolean;
}

export interface FetchBanOptions extends BaseFetchOptions {
  user: UserResolvable;
}

export interface FetchBansOptions {
  after?: Snowflake;
  before?: Snowflake;
  cache?: boolean;
  limit?: number;
}

export interface FetchChannelOptions extends BaseFetchOptions {
  allowUnknownGuild?: boolean;
}

export interface FetchedThreads {
  members: ReadonlyCollection<Snowflake, ThreadMember>;
  threads: ReadonlyCollection<Snowflake, AnyThreadChannel>;
}

export interface FetchedThreadsMore extends FetchedThreads {
  hasMore: boolean;
}

export interface FetchGuildOptions extends BaseFetchOptions {
  guild: GuildResolvable;
  withCounts?: boolean;
}

export interface FetchGuildsOptions {
  after?: Snowflake;
  before?: Snowflake;
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

export interface FetchInviteOptions extends BaseFetchOptions {
  code: string;
}

export interface FetchInvitesOptions {
  cache?: boolean;
  channelId?: GuildInvitableChannelResolvable;
}

export interface FetchMemberOptions extends BaseFetchOptions {
  user: UserResolvable;
}

export interface FetchMembersOptions {
  limit?: number;
  nonce?: string;
  query?: string;
  time?: number;
  user?: UserResolvable | readonly UserResolvable[];
  withPresences?: boolean;
}

export interface FetchMessageOptions extends BaseFetchOptions {
  message: MessageResolvable;
}

export interface FetchMessagesOptions {
  after?: Snowflake;
  around?: Snowflake;
  before?: Snowflake;
  cache?: boolean;
  limit?: number;
}

export interface FetchPinnedMessagesOptions {
  before?: DateResolvable;
  cache?: boolean;
  limit?: number;
}

export interface FetchPinnedMessagesResponse<InGuild extends boolean = boolean> {
  hasMore: boolean;
  items: readonly MessagePin<InGuild>[];
}

export interface MessagePin<InGuild extends boolean = boolean> {
  message: Message<InGuild>;
  get pinnedAt(): Date;
  pinnedTimestamp: number;
}

export interface FetchReactionUsersOptions {
  after?: Snowflake;
  limit?: number;
  type?: ReactionType;
}

export interface FetchThreadMemberOptions extends BaseFetchOptions {
  member: ThreadMemberResolvable;
  withMember?: boolean;
}

export interface FetchThreadOwnerOptions extends BaseFetchOptions {
  withMember?: boolean;
}

export interface FetchThreadMembersWithGuildMemberDataOptions {
  after?: Snowflake;
  cache?: boolean;
  limit?: number;
  withMember: true;
}

export interface FetchThreadMembersWithoutGuildMemberDataOptions {
  cache?: boolean;
  withMember?: false;
}

export type FetchThreadMembersOptions =
  | FetchThreadMembersWithGuildMemberDataOptions
  | FetchThreadMembersWithoutGuildMemberDataOptions;

export interface FetchThreadsOptions {
  archived?: FetchArchivedThreadOptions;
}

export interface AttachmentPayload {
  attachment: BufferResolvable | Stream;
  description?: string;
  duration?: number;
  name?: string;
  title?: string;
  waveform?: string;
}

export type GlobalSweepFilter<Key, Value> = () =>
  | ((value: Value, key: Key, collection: Collection<Key, Value>) => boolean)
  | null;

export interface GuildAuditLogsTypes {
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
  [AuditLogEvent.SoundboardSoundCreate]: ['SoundboardSound', 'Create'];
  [AuditLogEvent.SoundboardSoundUpdate]: ['SoundboardSound', 'Update'];
  [AuditLogEvent.SoundboardSoundDelete]: ['SoundboardSound', 'Delete'];
  [AuditLogEvent.AutoModerationRuleCreate]: ['AutoModeration', 'Create'];
  [AuditLogEvent.AutoModerationRuleUpdate]: ['AutoModeration', 'Update'];
  [AuditLogEvent.AutoModerationRuleDelete]: ['AutoModeration', 'Delete'];
  [AuditLogEvent.AutoModerationBlockMessage]: ['User', 'Update'];
  [AuditLogEvent.AutoModerationFlagToChannel]: ['User', 'Update'];
  [AuditLogEvent.AutoModerationUserCommunicationDisabled]: ['User', 'Update'];
  [AuditLogEvent.OnboardingPromptCreate]: ['GuildOnboardingPrompt', 'Create'];
  [AuditLogEvent.OnboardingPromptUpdate]: ['GuildOnboardingPrompt', 'Update'];
  [AuditLogEvent.OnboardingPromptDelete]: ['GuildOnboardingPrompt', 'Delete'];
  // Never have a target: CreatorMonetizationRequestCreated, CreatorMonetizationTermsAccepted, OnboardingCreate, OnboardingUpdate, HomeSettingsCreate, HomeSettingsUpdate
}

export type GuildAuditLogsActionType = GuildAuditLogsTypes[keyof GuildAuditLogsTypes][1] | 'All';

export interface GuildAuditLogsEntryExtraField {
  [AuditLogEvent.MemberKick]: { integrationType: string } | null;
  [AuditLogEvent.MemberRoleUpdate]: { integrationType: string } | null;
  [AuditLogEvent.MemberPrune]: { days: number; removed: number };
  [AuditLogEvent.MemberMove]: { channel: VoiceBasedChannel | { id: Snowflake }; count: number };
  [AuditLogEvent.MessageDelete]: { channel: GuildTextBasedChannel | { id: Snowflake }; count: number };
  [AuditLogEvent.MessageBulkDelete]: { count: number };
  [AuditLogEvent.MessagePin]: { channel: GuildTextBasedChannel | { id: Snowflake }; messageId: Snowflake };
  [AuditLogEvent.MessageUnpin]: { channel: GuildTextBasedChannel | { id: Snowflake }; messageId: Snowflake };
  [AuditLogEvent.MemberDisconnect]: { count: number };
  [AuditLogEvent.ChannelOverwriteCreate]:
    | GuildMember
    | Role
    | { id: Snowflake; name: string; type: AuditLogOptionsType.Role }
    | { id: Snowflake; type: AuditLogOptionsType.Member };
  [AuditLogEvent.ChannelOverwriteUpdate]:
    | GuildMember
    | Role
    | { id: Snowflake; name: string; type: AuditLogOptionsType.Role }
    | { id: Snowflake; type: AuditLogOptionsType.Member };
  [AuditLogEvent.ChannelOverwriteDelete]:
    | GuildMember
    | Role
    | { id: Snowflake; name: string; type: AuditLogOptionsType.Role }
    | { id: Snowflake; type: AuditLogOptionsType.Member };
  [AuditLogEvent.StageInstanceCreate]: StageChannel | { id: Snowflake };
  [AuditLogEvent.StageInstanceDelete]: StageChannel | { id: Snowflake };
  [AuditLogEvent.StageInstanceUpdate]: StageChannel | { id: Snowflake };
  [AuditLogEvent.ApplicationCommandPermissionUpdate]: { applicationId: Snowflake };
  [AuditLogEvent.AutoModerationBlockMessage]: {
    autoModerationRuleName: string;
    autoModerationRuleTriggerType: AuditLogRuleTriggerType;
    channel: GuildTextBasedChannel | { id: Snowflake };
  };
  [AuditLogEvent.AutoModerationFlagToChannel]: {
    autoModerationRuleName: string;
    autoModerationRuleTriggerType: AuditLogRuleTriggerType;
    channel: GuildTextBasedChannel | { id: Snowflake };
  };
  [AuditLogEvent.AutoModerationUserCommunicationDisabled]: {
    autoModerationRuleName: string;
    autoModerationRuleTriggerType: AuditLogRuleTriggerType;
    channel: GuildTextBasedChannel | { id: Snowflake };
  };
}

export interface GuildAuditLogsEntryTargetField<TAction extends AuditLogEvent> {
  ApplicationCommand: ApplicationCommand | { id: Snowflake };
  AutoModeration: AutoModerationRule;
  Channel: NonThreadGuildBasedChannel | { [x: string]: unknown; id: Snowflake };
  Emoji: GuildEmoji | { id: Snowflake };
  Guild: Guild;
  GuildOnboardingPrompt: GuildOnboardingPrompt | { [x: string]: unknown; id: Snowflake };
  GuildScheduledEvent: GuildScheduledEvent;
  Integration: Integration;
  Invite: GuildInvite;
  Message: TAction extends AuditLogEvent.MessageBulkDelete ? GuildTextBasedChannel | { id: Snowflake } : User | null;
  Role: Role | { id: Snowflake };
  SoundboardSound: SoundboardSound | { id: Snowflake };
  StageInstance: StageInstance;
  Sticker: Sticker;
  Thread: AnyThreadChannel | { [x: string]: unknown; id: Snowflake };
  User: PartialUser | User | null;
  Webhook: Webhook<WebhookType.ChannelFollower | WebhookType.Incoming>;
}

export interface GuildAuditLogsFetchOptions<Event extends GuildAuditLogsResolvable> {
  after?: GuildAuditLogsEntry | Snowflake;
  before?: GuildAuditLogsEntry | Snowflake;
  limit?: number;
  type?: Event;
  user?: UserResolvable;
}

export type GuildAuditLogsResolvable = AuditLogEvent | null;

export type GuildAuditLogsTargetType = GuildAuditLogsTypes[keyof GuildAuditLogsTypes][0] | 'Unknown';

export type GuildAuditLogsTargets = {
  [Key in GuildAuditLogsTargetType]: Key;
};

export type GuildBanResolvable = GuildBan | UserResolvable;

export type GuildChannelResolvable = GuildBasedChannel | Snowflake;

export interface AutoModerationRuleCreateOptions extends AutoModerationRuleEditOptions {
  actions: readonly AutoModerationActionOptions[];
  eventType: AutoModerationRuleEventType;
  name: string;
  triggerType: AutoModerationRuleTriggerType;
}

export interface AutoModerationRuleEditOptions {
  actions?: readonly AutoModerationActionOptions[];
  enabled?: boolean;
  eventType?: AutoModerationRuleEventType;
  exemptChannels?: ReadonlyCollection<Snowflake, GuildBasedChannel> | readonly GuildChannelResolvable[];
  exemptRoles?: ReadonlyCollection<Snowflake, Role> | readonly RoleResolvable[];
  name?: string;
  reason?: string;
  triggerMetadata?: AutoModerationTriggerMetadataOptions;
}

export interface AutoModerationTriggerMetadataOptions extends AutoModerationTriggerMetadata {}

export interface AutoModerationActionOptions {
  metadata?: AutoModerationActionMetadataOptions;
  type: AutoModerationActionType;
}

export interface AutoModerationActionMetadataOptions extends BaseAutoModerationActionMetadata {
  channel?: GuildTextChannelResolvable | ThreadChannel;
}

export interface GuildChannelCreateOptions extends Omit<CategoryCreateChannelOptions, 'type'> {
  parent?: CategoryChannelResolvable | null;
  type?: Exclude<
    ChannelType,
    | ChannelType.AnnouncementThread
    | ChannelType.DM
    | ChannelType.GroupDM
    | ChannelType.PrivateThread
    | ChannelType.PublicThread
  >;
}

export interface GuildChannelCloneOptions extends Omit<GuildChannelCreateOptions, 'name'> {
  name?: string;
}

export interface GuildChannelEditOptions {
  availableTags?: readonly GuildForumTagData[];
  bitrate?: number;
  defaultAutoArchiveDuration?: ThreadAutoArchiveDuration;
  defaultForumLayout?: ForumLayoutType;
  defaultReactionEmoji?: DefaultReactionEmoji | null;
  defaultSortOrder?: SortOrderType | null;
  defaultThreadRateLimitPerUser?: number;
  flags?: ChannelFlagsResolvable;
  lockPermissions?: boolean;
  name?: string;
  nsfw?: boolean;
  parent?: CategoryChannelResolvable | null;
  permissionOverwrites?: ReadonlyCollection<Snowflake, OverwriteResolvable> | readonly OverwriteResolvable[];
  position?: number;
  rateLimitPerUser?: number;
  reason?: string;
  rtcRegion?: string | null;
  topic?: string | null;
  type?: ChannelType.GuildAnnouncement | ChannelType.GuildText;
  userLimit?: number;
  videoQualityMode?: VideoQualityMode | null;
}

export interface GuildChannelOverwriteOptions {
  reason?: string;
  type?: OverwriteType;
}

export interface GuildWidgetSettings {
  channel: AnnouncementChannel | ForumChannel | MediaChannel | TextChannel | VoiceBasedChannel | null;
  enabled: boolean;
}

export interface GuildEditOptions {
  afkChannel?: VoiceChannelResolvable | null;
  afkTimeout?: number;
  banner?: Base64Resolvable | BufferResolvable | null;
  defaultMessageNotifications?: GuildDefaultMessageNotifications | null;
  description?: string | null;
  discoverySplash?: Base64Resolvable | BufferResolvable | null;
  explicitContentFilter?: GuildExplicitContentFilter | null;
  features?: readonly `${GuildFeature}`[];
  icon?: Base64Resolvable | BufferResolvable | null;
  name?: string;
  preferredLocale?: Locale | null;
  premiumProgressBarEnabled?: boolean;
  publicUpdatesChannel?: TextChannelResolvable | null;
  reason?: string;
  rulesChannel?: TextChannelResolvable | null;
  safetyAlertsChannel?: TextChannelResolvable | null;
  splash?: Base64Resolvable | BufferResolvable | null;
  systemChannel?: TextChannelResolvable | null;
  systemChannelFlags?: SystemChannelFlagsResolvable;
  verificationLevel?: GuildVerificationLevel | null;
}

export interface GuildEmojiCreateOptions {
  attachment: Base64Resolvable | BufferResolvable;
  name: string;
  reason?: string;
  roles?: ReadonlyCollection<Snowflake, Role> | readonly RoleResolvable[];
}

export interface GuildEmojiEditOptions {
  name?: string;
  reason?: string;
  roles?: ReadonlyCollection<Snowflake, Role> | readonly RoleResolvable[];
}

export interface GuildStickerCreateOptions {
  description?: string | null;
  file: AttachmentPayload | BufferResolvable | JSONEncodable<AttachmentBuilder> | Stream;
  name: string;
  reason?: string;
  tags: string;
}

export interface GuildStickerEditOptions {
  description?: string | null;
  name?: string;
  reason?: string;
  tags?: string;
}

export interface GuildMemberEditOptions {
  channel?: GuildVoiceChannelResolvable | null;
  communicationDisabledUntil?: DateResolvable | null;
  deaf?: boolean;
  flags?: GuildMemberFlagsResolvable;
  mute?: boolean;
  nick?: string | null;
  reason?: string;
  roles?: ReadonlyCollection<Snowflake, Role> | readonly RoleResolvable[];
}

export interface GuildMemberEditMeOptions {
  avatar?: Base64Resolvable | BufferResolvable | null;
  banner?: Base64Resolvable | BufferResolvable | null;
  bio?: string | null;
  nick?: string | null;
  reason?: string;
}

export type GuildResolvable =
  | Guild
  | GuildEmoji
  | GuildInvite
  | GuildMember
  | NonThreadGuildBasedChannel
  | Role
  | Snowflake;

export interface GuildPruneMembersOptions {
  count?: boolean;
  days?: number;
  dry?: boolean;
  reason?: string;
  roles?: readonly RoleResolvable[];
}

export interface GuildWidgetSettingsData {
  channel: AnnouncementChannel | ForumChannel | MediaChannel | Snowflake | TextChannel | VoiceBasedChannel | null;
  enabled: boolean;
}

export interface GuildSearchMembersOptions {
  cache?: boolean;
  limit?: number;
  query: string;
}

export interface GuildListMembersOptions {
  after?: Snowflake;
  cache?: boolean;
  limit?: number;
}

// TODO: use conditional types for better TS support
export interface GuildScheduledEventCreateOptions {
  channel?: GuildVoiceChannelResolvable;
  description?: string;
  entityMetadata?: GuildScheduledEventEntityMetadataOptions;
  entityType: GuildScheduledEventEntityType;
  image?: Base64Resolvable | BufferResolvable | null;
  name: string;
  privacyLevel: GuildScheduledEventPrivacyLevel;
  reason?: string;
  recurrenceRule?: GuildScheduledEventRecurrenceRuleOptions;
  scheduledEndTime?: DateResolvable;
  scheduledStartTime: DateResolvable;
}

export type GuildScheduledEventRecurrenceRuleOptions =
  | BaseGuildScheduledEventRecurrenceRuleOptions<
      GuildScheduledEventRecurrenceRuleFrequency.Daily | GuildScheduledEventRecurrenceRuleFrequency.Weekly,
      {
        byWeekday: readonly GuildScheduledEventRecurrenceRuleWeekday[];
      }
    >
  | BaseGuildScheduledEventRecurrenceRuleOptions<
      GuildScheduledEventRecurrenceRuleFrequency.Monthly,
      {
        byNWeekday: readonly GuildScheduledEventRecurrenceRuleNWeekday[];
      }
    >
  | BaseGuildScheduledEventRecurrenceRuleOptions<
      GuildScheduledEventRecurrenceRuleFrequency.Yearly,
      {
        byMonth: readonly GuildScheduledEventRecurrenceRuleMonth[];
        byMonthDay: readonly number[];
      }
    >;

export type BaseGuildScheduledEventRecurrenceRuleOptions<
  Frequency extends GuildScheduledEventRecurrenceRuleFrequency,
  Extra extends {},
> = Extra & {
  frequency: Frequency;
  interval: number;
  startAt: DateResolvable;
};

export interface GuildScheduledEventEditOptions<
  Status extends GuildScheduledEventStatus,
  AcceptableStatus extends GuildScheduledEventSetStatusArg<Status>,
> extends Omit<Partial<GuildScheduledEventCreateOptions>, 'channel' | 'recurrenceRule'> {
  channel?: GuildVoiceChannelResolvable | null;
  recurrenceRule?: GuildScheduledEventRecurrenceRuleOptions | null;
  status?: AcceptableStatus;
}

export interface GuildScheduledEventEntityMetadata {
  location: string | null;
}

export interface GuildScheduledEventEntityMetadataOptions {
  location?: string;
}

export type GuildScheduledEventManagerFetchResult<
  Options extends FetchGuildScheduledEventOptions | FetchGuildScheduledEventsOptions | GuildScheduledEventResolvable,
> = Options extends FetchGuildScheduledEventOptions | GuildScheduledEventResolvable
  ? GuildScheduledEvent
  : Collection<Snowflake, GuildScheduledEvent>;

export type GuildScheduledEventManagerFetchSubscribersResult<
  Options extends FetchGuildScheduledEventSubscribersOptions,
> = Options extends { withMember: true }
  ? Collection<Snowflake, GuildScheduledEventUser<true>>
  : Collection<Snowflake, GuildScheduledEventUser<false>>;

export type GuildScheduledEventResolvable = GuildScheduledEvent | Snowflake;

export type GuildScheduledEventSetStatusArg<Status extends GuildScheduledEventStatus> =
  Status extends GuildScheduledEventStatus.Scheduled
    ? GuildScheduledEventStatus.Active | GuildScheduledEventStatus.Canceled
    : Status extends GuildScheduledEventStatus.Active
      ? GuildScheduledEventStatus.Completed
      : never;

export interface GuildScheduledEventUser<WithMember> {
  guildScheduledEventId: Snowflake;
  member: WithMember extends true ? GuildMember : null;
  user: User;
}

export type GuildTemplateResolvable = string;

export type GuildVoiceChannelResolvable = Snowflake | VoiceBasedChannel;

export interface GuildOnboardingEditOptions {
  defaultChannels?: ReadonlyCollection<Snowflake, GuildChannel> | readonly ChannelResolvable[];
  enabled?: boolean;
  mode?: GuildOnboardingMode;
  prompts?: ReadonlyCollection<Snowflake, GuildOnboardingPrompt> | readonly GuildOnboardingPromptData[];
  reason?: string;
}

export interface GuildOnboardingPromptData {
  id?: Snowflake;
  inOnboarding?: boolean;
  options: ReadonlyCollection<Snowflake, GuildOnboardingPromptOption> | readonly GuildOnboardingPromptOptionData[];
  required?: boolean;
  singleSelect?: boolean;
  title: string;
  type?: GuildOnboardingPromptType;
}

export interface GuildOnboardingPromptOptionData {
  channels?: ReadonlyCollection<Snowflake, GuildChannel> | readonly ChannelResolvable[];
  description?: string | null;
  emoji?: Emoji | EmojiIdentifierResolvable | null;
  id?: Snowflake | null;
  roles?: ReadonlyCollection<Snowflake, Role> | readonly RoleResolvable[];
  title: string;
}

export type HexColorString = `#${string}`;

export interface IncidentActions {
  dmSpamDetectedAt: Date | null;
  dmsDisabledUntil: Date | null;
  invitesDisabledUntil: Date | null;
  raidDetectedAt: Date | null;
}

export interface IncidentActionsEditOptions {
  dmsDisabledUntil?: DateResolvable | null | undefined;
  invitesDisabledUntil?: DateResolvable | null | undefined;
}

export interface IntegrationAccount {
  id: Snowflake | string;
  name: string;
}

export type IntegrationType = 'discord' | 'guild_subscription' | 'twitch' | 'youtube';

export type IntegrationTypesConfigurationParameters = ClientApplicationInstallParams;

export interface IntegrationTypesConfigurationContext {
  oauth2InstallParams: IntegrationTypesConfigurationParameters | null;
}

export type IntegrationTypesConfiguration = Partial<
  Record<ApplicationIntegrationType, IntegrationTypesConfigurationContext>
>;

export type CollectedInteraction<Cached extends CacheType = CacheType> =
  | ButtonInteraction<Cached>
  | ChannelSelectMenuInteraction<Cached>
  | MentionableSelectMenuInteraction<Cached>
  | ModalSubmitInteraction<Cached>
  | RoleSelectMenuInteraction<Cached>
  | StringSelectMenuInteraction<Cached>
  | UserSelectMenuInteraction<Cached>;

export interface InteractionCollectorOptions<
  Interaction extends CollectedInteraction,
  Cached extends CacheType = CacheType,
> extends CollectorOptions<[Interaction]> {
  channel?: TextBasedChannelResolvable;
  componentType?: ComponentType;
  guild?: GuildResolvable;
  interactionType?: InteractionType;
  max?: number;
  maxComponents?: number;
  maxUsers?: number;
  message?: CacheTypeReducer<Cached, Message, APIMessage>;
}

export interface InteractionDeferReplyOptions {
  flags?: BitFieldResolvable<Extract<MessageFlagsString, 'Ephemeral'>, MessageFlags.Ephemeral> | undefined;
  withResponse?: boolean;
}

export interface InteractionDeferUpdateOptions {
  withResponse?: boolean;
}

export interface InteractionReplyOptions extends BaseMessageOptions, MessageOptionsPoll {
  flags?:
    | BitFieldResolvable<
        Extract<
          MessageFlagsString,
          'Ephemeral' | 'IsComponentsV2' | 'IsVoiceMessage' | 'SuppressEmbeds' | 'SuppressNotifications'
        >,
        | MessageFlags.Ephemeral
        | MessageFlags.IsComponentsV2
        | MessageFlags.IsVoiceMessage
        | MessageFlags.SuppressEmbeds
        | MessageFlags.SuppressNotifications
      >
    | undefined;
  tts?: boolean;
  withResponse?: boolean;
}

export interface InteractionUpdateOptions extends MessageEditOptions {
  withResponse?: boolean;
}

export interface InviteGenerationOptions {
  disableGuildSelect?: boolean;
  guild?: GuildResolvable;
  permissions?: PermissionResolvable;
  scopes: readonly OAuth2Scopes[];
}

export type GuildInvitableChannel = AnnouncementChannel | ForumChannel | MediaChannel | TextChannel | VoiceChannel;

export type GuildInvitableChannelResolvable = GuildInvitableChannel | Snowflake;

export interface InviteCreateOptions {
  maxAge?: number;
  maxUses?: number;
  reason?: string;
  targetApplication?: ApplicationResolvable;
  targetType?: InviteTargetType;
  targetUser?: UserResolvable;
  temporary?: boolean;
  unique?: boolean;
}

export type InviteResolvable = string;
export type GuildInviteResolvable = string;

export interface LifetimeFilterOptions<Key, Value> {
  excludeFromSweep?(value: Value, key: Key, collection: LimitedCollection<Key, Value>): boolean;
  getComparisonTimestamp?(value: Value, key: Key, collection: LimitedCollection<Key, Value>): number;
  lifetime?: number;
}

export type ActionRowComponentOptions =
  | ButtonComponentData
  | ChannelSelectMenuComponentData
  | MentionableSelectMenuComponentData
  | RoleSelectMenuComponentData
  | StringSelectMenuComponentData
  | UserSelectMenuComponentData;

export type MessageActionRowComponentResolvable = ActionRowComponentOptions | MessageActionRowComponent;

export interface MessageActivity {
  partyId?: string;
  type: MessageActivityType;
}

export interface BaseButtonComponentData extends BaseComponentData {
  disabled?: boolean;
  emoji?: ComponentEmojiResolvable;
  label?: string;
  style: ButtonStyle;
  type: ComponentType.Button;
}

export interface LinkButtonComponentData extends BaseButtonComponentData {
  style: ButtonStyle.Link;
  url: string;
}

export interface InteractionButtonComponentData extends BaseButtonComponentData {
  customId: string;
  style: Exclude<ButtonStyle, ButtonStyle.Link>;
}

export type ButtonComponentData = InteractionButtonComponentData | LinkButtonComponentData;

export interface MessageCollectorOptions extends CollectorOptions<[Message, Collection<Snowflake, Message>]> {
  max?: number;
  maxProcessed?: number;
}

export type CollectedMessageInteraction<Cached extends CacheType = CacheType> = Exclude<
  CollectedInteraction<Cached>,
  ModalSubmitInteraction
>;

export interface MessageComponentCollectorOptions<Interaction extends CollectedMessageInteraction>
  extends AwaitMessageComponentOptions<Interaction> {
  max?: number;
  maxComponents?: number;
  maxUsers?: number;
}

export interface MessageChannelComponentCollectorOptions<
  Interaction extends CollectedMessageInteraction,
  Cached extends CacheType = CacheType,
> extends MessageComponentCollectorOptions<Interaction> {
  message?: CacheTypeReducer<Cached, Message, APIMessage>;
}

export interface MessageInteractionMetadata {
  authorizingIntegrationOwners: APIAuthorizingIntegrationOwnersMap;
  id: Snowflake;
  interactedMessageId: Snowflake | null;
  originalResponseMessageId: Snowflake | null;
  triggeringInteractionMetadata: MessageInteractionMetadata | null;
  type: InteractionType;
  user: User;
}

export interface MessageMentionsHasOptions {
  ignoreDirect?: boolean;
  ignoreEveryone?: boolean;
  ignoreRepliedUser?: boolean;
  ignoreRoles?: boolean;
}

export interface MessageMentionOptions {
  parse?: readonly MessageMentionTypes[];
  repliedUser?: boolean;
  roles?: readonly Snowflake[];
  users?: readonly Snowflake[];
}

export type MessageMentionTypes = 'everyone' | 'roles' | 'users';

export interface MessageSnapshot
  extends Partialize<
    Message,
    null,
    Exclude<
      keyof Message,
      | 'attachments'
      | 'client'
      | 'components'
      | 'content'
      | 'createdTimestamp'
      | 'editedTimestamp'
      | 'embeds'
      | 'flags'
      | 'mentions'
      | 'stickers'
      | 'type'
    >
  > {}

export interface BaseMessageOptions {
  allowedMentions?: MessageMentionOptions;
  components?: readonly (
    | ActionRowData<MessageActionRowComponentBuilder | MessageActionRowComponentData>
    | APIMessageTopLevelComponent
    | JSONEncodable<APIActionRowComponent<APIComponentInActionRow>>
    | JSONEncodable<APIMessageTopLevelComponent>
    | TopLevelComponentData
  )[];
  content?: string;
  embeds?: readonly (APIEmbed | JSONEncodable<APIEmbed>)[];
  files?: readonly (
    | Attachment
    | AttachmentBuilder
    | AttachmentPayload
    | BufferResolvable
    | JSONEncodable<APIAttachment>
    | Stream
  )[];
}

export interface MessageOptionsPoll {
  poll?: JSONEncodable<RESTAPIPoll> | PollData;
}

export interface MessageOptionsFlags {
  flags?:
    | BitFieldResolvable<
        Extract<MessageFlagsString, 'IsComponentsV2' | 'IsVoiceMessage' | 'SuppressEmbeds' | 'SuppressNotifications'>,
        | MessageFlags.IsComponentsV2
        | MessageFlags.IsVoiceMessage
        | MessageFlags.SuppressEmbeds
        | MessageFlags.SuppressNotifications
      >
    | undefined;
}

export interface MessageOptionsTTS {
  tts?: boolean;
}

export interface MessageOptionsStickers {
  stickers?: readonly StickerResolvable[];
}

export interface BaseMessageCreateOptions
  extends BaseMessageOptions,
    MessageOptionsPoll,
    MessageOptionsFlags,
    MessageOptionsTTS,
    MessageOptionsStickers {
  enforceNonce?: boolean;
  nonce?: number | string;
}

export interface MessageCreateOptions extends BaseMessageCreateOptions {
  messageReference?: MessageReferenceOptions;
}

export interface GuildForumThreadMessageCreateOptions
  extends BaseMessageOptions,
    MessageOptionsFlags,
    MessageOptionsStickers {}

export interface MessageEditAttachmentData {
  id: Snowflake;
}

export interface MessageEditOptions extends Omit<BaseMessageOptions, 'content'> {
  attachments?: readonly (Attachment | MessageEditAttachmentData)[];
  content?: string | null;
  flags?:
    | BitFieldResolvable<
        Extract<MessageFlagsString, 'IsComponentsV2' | 'SuppressEmbeds'>,
        MessageFlags.IsComponentsV2 | MessageFlags.SuppressEmbeds
      >
    | undefined;
}

export type MessageReactionResolvable = MessageReaction | Snowflake | string;

export interface MessageReference {
  channelId: Snowflake;
  guildId: Snowflake | undefined;
  messageId: Snowflake | undefined;
  type: MessageReferenceType;
}

export interface MessageReferenceOptions extends MessageReference {
  failIfNotExists?: boolean;
}

export type MessageResolvable = Message | Snowflake;

export interface BaseSelectMenuComponentData extends BaseComponentData {
  customId: string;
  disabled?: boolean;
  maxValues?: number;
  minValues?: number;
  placeholder?: string;
  required?: boolean;
}

export interface StringSelectMenuComponentData extends BaseSelectMenuComponentData {
  options: readonly SelectMenuComponentOptionData[];
  type: ComponentType.StringSelect;
}

export interface UserSelectMenuComponentData extends BaseSelectMenuComponentData {
  defaultValues?: readonly APISelectMenuDefaultValue<SelectMenuDefaultValueType.User>[];
  type: ComponentType.UserSelect;
}

export interface RoleSelectMenuComponentData extends BaseSelectMenuComponentData {
  defaultValues?: readonly APISelectMenuDefaultValue<SelectMenuDefaultValueType.Role>[];
  type: ComponentType.RoleSelect;
}

export interface MentionableSelectMenuComponentData extends BaseSelectMenuComponentData {
  defaultValues?: readonly APISelectMenuDefaultValue<
    SelectMenuDefaultValueType.Role | SelectMenuDefaultValueType.User
  >[];
  type: ComponentType.MentionableSelect;
}

export interface ChannelSelectMenuComponentData extends BaseSelectMenuComponentData {
  channelTypes?: readonly ChannelType[];
  defaultValues?: readonly APISelectMenuDefaultValue<SelectMenuDefaultValueType.Channel>[];
  type: ComponentType.ChannelSelect;
}

export interface MessageSelectOption {
  default: boolean;
  description: string | null;
  emoji: APIPartialEmoji | null;
  label: string;
  value: string;
}

export interface ReactionCountDetailsData {
  burst: number;
  normal: number;
}

export interface SelectMenuComponentOptionData {
  default?: boolean;
  description?: string;
  emoji?: ComponentEmojiResolvable;
  label: string;
  value: string;
}

export interface TextInputComponentData extends BaseComponentData {
  customId: string;
  maxLength?: number;
  minLength?: number;
  placeholder?: string;
  required?: boolean;
  style: TextInputStyle;
  type: ComponentType.TextInput;
  value?: string;
}

export type MessageTarget =
  | ChannelManager
  | Interaction
  | InteractionWebhook
  | Message
  | MessageManager
  | TextBasedChannel
  | Webhook<WebhookType.Incoming>
  | WebhookClient;

export interface MultipleShardRespawnOptions {
  respawnDelay?: number;
  shardDelay?: number;
  timeout?: number;
}

export interface MultipleShardSpawnOptions {
  amount?: number | 'auto';
  delay?: number;
  timeout?: number;
}

export interface BaseOverwriteData {
  allow?: PermissionResolvable;
  deny?: PermissionResolvable;
  id: RoleResolvable | UserResolvable;
  type?: OverwriteType;
}

export interface OverwriteDataWithMandatoryType extends BaseOverwriteData {
  type: OverwriteType;
}

export interface OverwriteDataWithOptionalType extends BaseOverwriteData {
  id: Exclude<RoleResolvable | UserResolvable, Snowflake>;
}

export type OverwriteData = OverwriteDataWithMandatoryType | OverwriteDataWithOptionalType;

export type OverwriteResolvable = OverwriteData | PermissionOverwrites;

export type PermissionFlags = Record<keyof typeof PermissionFlagsBits, bigint>;

export type PermissionOverwriteOptions = Partial<Record<keyof typeof PermissionFlagsBits, boolean | null>>;

export type PermissionResolvable = BitFieldResolvable<keyof typeof PermissionFlagsBits, bigint>;

export type PermissionOverwriteResolvable = PermissionOverwrites | RoleResolvable | UserResolvable;

export interface RecursiveReadonlyArray<ItemType> extends ReadonlyArray<ItemType | RecursiveReadonlyArray<ItemType>> {}

export interface PartialRecipient {
  username: string;
}

export interface PresenceData {
  activities?: readonly ActivitiesOptions[];
  afk?: boolean;
  shardId?: number | readonly number[];
  status?: PresenceStatusData;
}

export type PresenceResolvable = Presence | Snowflake | UserResolvable;

export interface PartialEmoji {
  animated: boolean;
  id: Snowflake | undefined;
  name: string;
}

export interface PartialEmojiOnlyId {
  id: Snowflake;
}

export type Partialize<
  PartialType extends AllowedPartial,
  NulledKeys extends keyof PartialType | null = null,
  NullableKeys extends keyof PartialType | null = null,
  OverridableKeys extends keyof PartialType | '' = '',
> = {
  [K in keyof Omit<PartialType, OverridableKeys>]: K extends 'partial'
    ? true
    : K extends NulledKeys
      ? null
      : K extends NullableKeys
        ? PartialType[K] | null
        : PartialType[K];
};

export interface PartialDMChannel extends Partialize<DMChannel, null, null, 'lastMessageId'> {
  lastMessageId: undefined;
}

export interface PartialGuildMember extends Partialize<GuildMember, 'joinedAt' | 'joinedTimestamp' | 'pending'> {}

export interface PartialMessage
  extends Partialize<Message, 'pinned' | 'system' | 'tts' | 'type', 'author' | 'cleanContent' | 'content'> {}

export interface PartialMessageReaction extends Partialize<MessageReaction, 'count'> {}

export interface PartialPoll
  extends Partialize<
    Poll,
    'allowMultiselect' | 'expiresTimestamp' | 'layoutType',
    null,
    'answers' | 'message' | 'question'
  > {
  // eslint-disable-next-line no-restricted-syntax
  answers: Collection<number, PartialPollAnswer>;
  message: PartialMessage;
  question: { text: null };
}

export interface PartialPollAnswer extends Partialize<PollAnswer, 'emoji' | 'text', null, 'poll'> {
  readonly poll: PartialPoll;
}

export interface PartialGuildScheduledEvent
  extends Partialize<GuildScheduledEvent, 'userCount', 'entityType' | 'name' | 'privacyLevel' | 'status'> {}

export interface PartialThreadMember extends Partialize<ThreadMember, 'flags' | 'joinedAt' | 'joinedTimestamp'> {}

export interface PartialSoundboardSound extends Partialize<SoundboardSound, 'available' | 'name' | 'volume'> {}

export enum Partials {
  User,
  Channel,
  GuildMember,
  Message,
  Reaction,
  GuildScheduledEvent,
  ThreadMember,
  Poll,
  PollAnswer,
  SoundboardSound,
}

export interface PartialUser extends Partialize<User, 'discriminator' | 'tag' | 'username'> {}

export type PresenceStatusData = ClientPresenceStatus | 'invisible';

export type PresenceStatus = PresenceStatusData | 'offline';

export interface ReactionCollectorOptions extends CollectorOptions<[MessageReaction, User]> {
  max?: number;
  maxEmojis?: number;
  maxUsers?: number;
}

export interface MessageReplyOptions extends BaseMessageCreateOptions {
  failIfNotExists?: boolean;
}

export interface ResolvedOverwriteOptions {
  allow: PermissionsBitField;
  deny: PermissionsBitField;
}

export interface RoleData {
  colors?: RoleColorsResolvable;
  hoist?: boolean;
  icon?: Base64Resolvable | BufferResolvable | EmojiResolvable | null;
  mentionable?: boolean;
  name?: string;
  permissions?: PermissionResolvable;
  position?: number;
  unicodeEmoji?: string | null;
}

export type RoleMention = '@everyone' | `<@&${Snowflake}>`;

export interface RolePosition {
  position: number;
  role: RoleResolvable;
}

export type RoleResolvable = Role | Snowflake;

export interface RoleSubscriptionData {
  isRenewal: boolean;
  roleSubscriptionListingId: Snowflake;
  tierName: string;
  totalMonthsSubscribed: number;
}

export interface RoleTagData {
  availableForPurchase?: true;
  botId?: Snowflake;
  guildConnections?: true;
  integrationId?: Snowflake;
  premiumSubscriberRole?: true;
  subscriptionListingId?: Snowflake;
}

export interface SetChannelPositionOptions {
  reason?: string;
  relative?: boolean;
}

export interface SetParentOptions {
  lockPermissions?: boolean;
  reason?: string;
}

export interface SetRolePositionOptions {
  reason?: string;
  relative?: boolean;
}

export type ShardingManagerMode = 'process' | 'worker';

export interface ShardingManagerOptions {
  execArgv?: readonly string[];
  mode?: ShardingManagerMode;
  respawn?: boolean;
  shardArgs?: readonly string[];
  shardList?: readonly number[] | 'auto';
  silent?: boolean;
  token?: string;
  totalShards?: number | 'auto';
}

export interface ShowModalOptions {
  withResponse?: boolean;
}

export interface LaunchActivityOptions {
  withResponse?: boolean;
}

export type StageInstanceResolvable = Snowflake | StageInstance;

export interface StartThreadOptions {
  autoArchiveDuration?: ThreadAutoArchiveDuration;
  name: string;
  rateLimitPerUser?: number;
  reason?: string;
}

export type ClientStatus = number;

export type StickerResolvable = Snowflake | Sticker;

export type SystemChannelFlagsResolvable = BitFieldResolvable<SystemChannelFlagsString, number>;

export type StageChannelResolvable = Snowflake | StageChannel;

export interface StageInstanceEditOptions {
  privacyLevel?: StageInstancePrivacyLevel;
  topic?: string;
}

export type SweeperKey = keyof SweeperDefinitions;

export type CollectionSweepFilter<Key, Value> = (value: Value, key: Key, collection: Collection<Key, Value>) => boolean;

export interface SweepOptions<Key, Value> {
  filter: GlobalSweepFilter<Key, Value>;
  interval: number;
}

export interface LifetimeSweepOptions {
  filter?: never;
  interval: number;
  lifetime: number;
}

export interface SweeperDefinitions {
  applicationCommands: [Snowflake, ApplicationCommand];
  autoModerationRules: [Snowflake, AutoModerationRule];
  bans: [Snowflake, GuildBan];
  emojis: [Snowflake, GuildEmoji];
  entitlements: [Snowflake, Entitlement];
  guildMembers: [Snowflake, GuildMember];
  invites: [string, GuildInvite, true];
  messages: [Snowflake, Message, true];
  presences: [Snowflake, Presence];
  reactions: [Snowflake | string, MessageReaction];
  stageInstances: [Snowflake, StageInstance];
  stickers: [Snowflake, Sticker];
  threadMembers: [Snowflake, ThreadMember];
  threads: [Snowflake, AnyThreadChannel, true];
  users: [Snowflake, User];
  voiceStates: [Snowflake, VoiceState];
}

export type SweeperOptions = {
  [Key in keyof SweeperDefinitions]?: SweeperDefinitions[Key][2] extends true
    ? LifetimeSweepOptions | SweepOptions<SweeperDefinitions[Key][0], SweeperDefinitions[Key][1]>
    : SweepOptions<SweeperDefinitions[Key][0], SweeperDefinitions[Key][1]>;
};

export interface LimitedCollectionOptions<Key, Value> {
  keepOverLimit?(value: Value, key: Key, collection: LimitedCollection<Key, Value>): boolean;
  maxSize?: number;
}

export type Channel =
  | AnnouncementChannel
  | CategoryChannel
  | DMChannel
  | ForumChannel
  | MediaChannel
  | PartialDMChannel
  | PartialGroupDMChannel
  | PrivateThreadChannel
  | PublicThreadChannel
  | StageChannel
  | TextChannel
  | VoiceChannel;

export type TextBasedChannel = Exclude<Extract<Channel, { type: TextChannelType }>, ForumChannel | MediaChannel>;

export type TextBasedChannels = TextBasedChannel;

export type TextBasedChannelTypes = TextBasedChannel['type'];

export type GuildTextBasedChannelTypes = Exclude<TextBasedChannelTypes, ChannelType.DM | ChannelType.GroupDM>;

export type VoiceBasedChannel = Extract<Channel, { bitrate: number }>;

export type GuildBasedChannel = Extract<Channel, { guild: Guild }>;

export type SendableChannels = Extract<Channel, { send(...args: any[]): any }>;

export type CategoryChildChannel = Exclude<Extract<Channel, { parent: CategoryChannel | null }>, CategoryChannel>;

export type NonThreadGuildBasedChannel = Exclude<GuildBasedChannel, AnyThreadChannel>;

export type GuildTextBasedChannel = Extract<GuildBasedChannel, TextBasedChannel>;

export type SendableChannelTypes = SendableChannels['type'];

export type TextChannelResolvable = Snowflake | TextChannel;

export type TextBasedChannelResolvable = Snowflake | TextBasedChannel;

export type ThreadChannelResolvable = Snowflake | ThreadChannel;

export interface GuildTextThreadCreateOptions<AllowedThreadType> extends StartThreadOptions {
  invitable?: AllowedThreadType extends ChannelType.PrivateThread ? boolean : never;
  startMessage?: MessageResolvable;
  type?: AllowedThreadType;
}

export interface GuildForumThreadCreateOptions extends StartThreadOptions {
  appliedTags?: readonly Snowflake[];
  message: GuildForumThreadMessageCreateOptions | MessagePayload;
}

export interface ThreadEditOptions {
  appliedTags?: readonly Snowflake[];
  archived?: boolean;
  autoArchiveDuration?: ThreadAutoArchiveDuration;
  flags?: ChannelFlagsResolvable;
  invitable?: boolean;
  locked?: boolean;
  name?: string;
  rateLimitPerUser?: number;
  reason?: string;
}

export type ThreadMemberResolvable = ThreadMember | UserResolvable;

export type UserMention = `<@${Snowflake}>`;

export type UserResolvable = GuildMember | Message | Snowflake | ThreadMember | User;

export interface Vanity {
  code: string | null;
  uses: number;
}

export type VoiceBasedChannelTypes = VoiceBasedChannel['type'];

export type VoiceChannelResolvable = Snowflake | VoiceChannel;

export interface VoiceStateEditOptions {
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

export interface WebhookClientOptions {
  allowedMentions?: MessageMentionOptions;
  rest?: Partial<RESTOptions>;
}

export interface WebhookDeleteOptions {
  reason?: string;
  token?: string;
}

export interface WebhookEditOptions {
  avatar?: BufferResolvable | null;
  channel?: ForumChannel | GuildTextChannelResolvable | MediaChannel | StageChannel | VoiceChannel;
  name?: string;
  reason?: string;
}

export interface WebhookMessageEditOptions extends MessageEditOptions {
  threadId?: Snowflake;
  withComponents?: boolean;
}

export interface InteractionEditReplyOptions extends WebhookMessageEditOptions, MessageOptionsPoll {
  message?: MessageResolvable | '@original';
}

export interface WebhookFetchMessageOptions {
  threadId?: Snowflake;
}

export interface WebhookMessageCreateOptions
  extends BaseMessageOptions,
    MessageOptionsPoll,
    MessageOptionsFlags,
    MessageOptionsTTS {
  appliedTags?: readonly Snowflake[];
  avatarURL?: string;
  threadId?: Snowflake;
  threadName?: string;
  username?: string;
  withComponents?: boolean;
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
  channel: AnnouncementChannel | ForumChannel | MediaChannel | Snowflake | TextChannel;
  description: string;
  emoji?: EmojiIdentifierResolvable;
}

export interface WelcomeScreenEditOptions {
  description?: string;
  enabled?: boolean;
  welcomeChannels?: readonly WelcomeChannelData[];
}

export interface ClientApplicationEditOptions {
  coverImage?: Base64Resolvable | BufferResolvable | null;
  customInstallURL?: string;
  description?: string;
  eventWebhooksStatus?: ApplicationWebhookEventStatus.Disabled | ApplicationWebhookEventStatus.Enabled;
  eventWebhooksTypes?: readonly ApplicationWebhookEventType[];
  eventWebhooksURL?: string;
  flags?: ApplicationFlagsResolvable;
  icon?: Base64Resolvable | BufferResolvable | null;
  installParams?: ClientApplicationInstallParams;
  interactionsEndpointURL?: string;
  roleConnectionsVerificationURL?: string;
  tags?: readonly string[];
}

export interface ClientApplicationInstallParams {
  permissions: Readonly<PermissionsBitField>;
  scopes: readonly OAuth2Scopes[];
}

export type Serialized<Value> = Value extends bigint | symbol | (() => any)
  ? never
  : Value extends boolean | number | string | undefined
    ? Value
    : Value extends JSONEncodable<infer JSONResult>
      ? JSONResult
      : Value extends readonly (infer ItemType)[]
        ? Serialized<ItemType>[]
        : Value extends ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>
          ? {}
          : { [K in keyof Value]: Serialized<Value[K]> };

// #endregion

// #region Voice

/**
 * @remarks
 * Use `DiscordGatewayAdapterLibraryMethods` from `@discordjs/voice` instead.
 */
export interface InternalDiscordGatewayAdapterLibraryMethods {
  destroy(): void;
  onVoiceServerUpdate(data: GatewayVoiceServerUpdateDispatchData): void;
  onVoiceStateUpdate(data: GatewayVoiceStateUpdateDispatchData): void;
}

/**
 * @remarks
 * Use `DiscordGatewayAdapterImplementerMethods` from `@discordjs/voice` instead.
 */
export interface InternalDiscordGatewayAdapterImplementerMethods {
  destroy(): void;
  sendPayload(payload: unknown): boolean;
}

/**
 * @remarks
 * Use `DiscordGatewayAdapterCreator` from `@discordjs/voice` instead.
 */
export type InternalDiscordGatewayAdapterCreator = (
  methods: InternalDiscordGatewayAdapterLibraryMethods,
) => InternalDiscordGatewayAdapterImplementerMethods;

// #endregion

// External
export * from '@discordjs/builders';
export * from '@discordjs/formatters';
export * from '@discordjs/rest';
export * from '@discordjs/util';
export * from '@discordjs/ws';
export * from 'discord-api-types/v10';
