// These are aggregate types that are used in the typings file but do not exist as actual exported values.
// To prevent them from showing up in an editor, they are imported from here instead of exporting them there directly.

import {
  APIApplication,
  APIApplicationCommand,
  APIApplicationCommandInteraction,
  APIAuditLog,
  APIAuditLogEntry,
  APIBan,
  APIChannel,
  APIEmoji,
  APIExtendedInvite,
  APIGuildIntegration,
  APIGuildIntegrationApplication,
  APIGuildMember,
  APIGuildPreview,
  APIGuildWelcomeScreen,
  APIGuildWelcomeScreenChannel,
  APIGuildWidget,
  APIGuildWidgetMember,
  APIInteractionGuildMember,
  APIInvite,
  APIInviteStageInstance,
  APIMessage,
  APIMessageButtonInteractionData,
  APIMessageComponentInteraction,
  APIOverwrite,
  APIPartialChannel,
  APIPartialEmoji,
  APIPartialGuild,
  APIReaction,
  APIRole,
  APIStageInstance,
  APISticker,
  APIStickerItem,
  APIStickerPack,
  APITeam,
  APITeamMember,
  APITemplate,
  APIThreadMember,
  APIUnavailableGuild,
  APIUser,
  APIVoiceRegion,
  APIWebhook,
  GatewayActivity,
  GatewayActivityAssets,
  GatewayActivityEmoji,
  GatewayGuildBanAddDispatchData,
  GatewayGuildMemberAddDispatchData,
  GatewayGuildMemberUpdateDispatchData,
  GatewayInteractionCreateDispatchData,
  GatewayInviteCreateDispatchData,
  GatewayInviteDeleteDispatchData,
  GatewayMessageReactionAddDispatchData,
  GatewayMessageUpdateDispatchData,
  GatewayPresenceUpdate,
  GatewayReadyDispatchData,
  GatewayTypingStartDispatchData,
  GatewayVoiceState,
  RESTAPIPartialCurrentUserGuild,
  RESTGetAPIWebhookWithTokenResult,
  RESTPatchAPIChannelMessageJSONBody,
  RESTPatchAPICurrentGuildMemberNicknameJSONBody,
  RESTPatchAPIInteractionFollowupJSONBody,
  RESTPatchAPIInteractionOriginalResponseJSONBody,
  RESTPatchAPIWebhookWithTokenJSONBody,
  RESTPostAPIChannelMessageJSONBody,
  RESTPostAPIInteractionCallbackFormDataBody,
  RESTPostAPIInteractionFollowupJSONBody,
  RESTPostAPIWebhookWithTokenJSONBody,
  Snowflake,
  APIGuildScheduledEvent,
  APITextInputComponent,
  APIModalSubmitInteraction,
  GuildDefaultMessageNotifications,
  GuildExplicitContentFilter,
  GuildMFALevel,
  GuildSystemChannelFlags,
  GuildPremiumTier,
  GuildNSFWLevel,
  GuildHubType,
  GuildVerificationLevel,
  GuildFeature,
  APIThreadMetadata,
  APISelectMenuOption,
  APIButtonComponent,
  APIAttachment,
  LocalizationMap,
} from 'discord-api-types/v9';
import { GuildChannel, Guild, PermissionOverwrites, Permissions } from '.';
import type {
  AutoModerationActionTypes,
  AutoModerationRuleEventTypes,
  AutoModerationRuleKeywordPresetTypes,
  AutoModerationRuleTriggerTypes,
  MessageComponentTypes,
  ApplicationRoleConnectionMetadataTypes,
  SelectMenuComponentTypes,
  ChannelTypes,
} from './enums';

export type RawActivityData = GatewayActivity;

export type RawApplicationData = RawClientApplicationData | RawIntegrationApplicationData;
export type RawClientApplicationData = GatewayReadyDispatchData['application'] | APIMessage['application'];
export type RawIntegrationApplicationData = APIGuildIntegrationApplication | Partial<APIApplication>;

export type RawApplicationCommandData = APIApplicationCommand;

export type RawChannelData =
  | RawGuildChannelData
  | RawThreadChannelData
  | RawDMChannelData
  | RawPartialGroupDMChannelData;
export type RawDMChannelData = APIChannel | APIInteractionDataResolvedChannel;
export type RawGuildChannelData = APIChannel | APIInteractionDataResolvedChannel | Required<APIPartialChannel>;
export type RawPartialGroupDMChannelData = APIChannel | Required<APIPartialChannel>;
export type RawThreadChannelData = APIChannel | APIInteractionDataResolvedChannel;

export type RawEmojiData =
  | RawGuildEmojiData
  | RawReactionEmojiData
  | GatewayActivityEmoji
  | Omit<Partial<APIPartialEmoji>, 'animated'>;
export type RawGuildEmojiData = APIEmoji;
export type RawReactionEmojiData = APIEmoji | APIPartialEmoji;

export type RawGuildAuditLogData = APIAuditLog;

export type RawGuildAuditLogEntryData = APIAuditLogEntry;

export type RawGuildBanData = GatewayGuildBanAddDispatchData | APIBan;

export type RawGuildData = APIGuild | APIUnavailableGuild;
export type RawAnonymousGuildData = RawGuildData | RawInviteGuildData;
export type RawBaseGuildData = RawAnonymousGuildData | RawOAuth2GuildData;
export type RawInviteGuildData = APIPartialGuild;
export type RawOAuth2GuildData = RESTAPIPartialCurrentUserGuild;

export type RawGuildMemberData =
  | APIGuildMember
  | APIInteractionGuildMember
  | APIInteractionDataResolvedGuildMember
  | GatewayGuildMemberAddDispatchData
  | GatewayGuildMemberUpdateDispatchData
  | Required<RESTPatchAPICurrentGuildMemberNicknameJSONBody>
  | { user: { id: Snowflake } };
export type RawThreadMemberData = APIThreadMember;

export type RawGuildPreviewData = APIGuildPreview;

export type RawGuildScheduledEventData = APIGuildScheduledEvent;

export type RawGuildTemplateData = APITemplate;

export type RawIntegrationData = APIGuildIntegration;

export type RawInteractionData = GatewayInteractionCreateDispatchData;
export type RawCommandInteractionData = APIApplicationCommandInteraction;
export type RawMessageComponentInteractionData = APIMessageComponentInteraction;
export type RawMessageButtonInteractionData = APIMessageButtonInteractionData;

export type RawTextInputComponentData = APITextInputComponent;
export type RawModalSubmitInteractionData = APIModalSubmitInteraction;

export type RawInviteData =
  | APIExtendedInvite
  | APIInvite
  | (GatewayInviteCreateDispatchData & { channel: GuildChannel; guild: Guild })
  | (GatewayInviteDeleteDispatchData & { channel: GuildChannel; guild: Guild });

export type RawInviteStageInstance = APIInviteStageInstance;

export type RawMessageData = APIMessage;
export type RawPartialMessageData = GatewayMessageUpdateDispatchData;

export interface RawMessageAttachmentData {
  id: Snowflake;
  filename: string;
  description?: string;
  content_type?: string;
  size: number;
  url: string;
  proxy_url: string;
  height?: number | null;
  width?: number | null;
  ephemeral?: boolean;
  duration_secs?: number;
  waveform?: string;
}

export type RawMessagePayloadData =
  | RESTPostAPIChannelMessageJSONBody
  | RESTPatchAPIChannelMessageJSONBody
  | RESTPostAPIWebhookWithTokenJSONBody
  | RESTPatchAPIWebhookWithTokenJSONBody
  | RESTPostAPIInteractionCallbackFormDataBody
  | RESTPatchAPIInteractionOriginalResponseJSONBody
  | RESTPostAPIInteractionFollowupJSONBody
  | RESTPatchAPIInteractionFollowupJSONBody;

export type RawMessageReactionData = APIReaction | GatewayMessageReactionAddDispatchData;

export type RawPermissionOverwriteData = APIOverwrite | PermissionOverwrites;

export type RawPresenceData = GatewayPresenceUpdate;

export type RawRoleData = APIRole;

export type RawRichPresenceAssets = GatewayActivityAssets;

export type RawStageInstanceData =
  | APIStageInstance
  | (Partial<APIStageInstance> & Pick<APIStageInstance, 'id' | 'channel_id' | 'guild_id'>);

export type RawStickerData = APISticker | APIStickerItem;

export type RawStickerPackData = APIStickerPack;

export type RawTeamData = APITeam;

export type RawTeamMemberData = APITeamMember;

export type RawTypingData = GatewayTypingStartDispatchData;

export type RawUserData =
  | (APIUser & { member?: Omit<APIGuildMember, 'user'> })
  | (GatewayPresenceUpdate['user'] & Pick<APIUser, 'username'>);

export type RawVoiceRegionData = APIVoiceRegion;

export type RawVoiceStateData = GatewayVoiceState | Omit<GatewayVoiceState, 'guild_id'>;

export type RawWebhookData =
  | APIWebhook
  | RESTGetAPIWebhookWithTokenResult
  | (Partial<APIWebhook> & Required<Pick<APIWebhook, 'id' | 'guild_id'>>);

export type RawWelcomeChannelData = APIGuildWelcomeScreenChannel;

export type RawWelcomeScreenData = APIGuildWelcomeScreen;

export type RawWidgetData = APIGuildWidget;

export type RawWidgetMemberData = APIGuildWidgetMember;

export interface GatewayAutoModerationActionExecutionDispatchData {
  guild_id: Snowflake;
  action: APIAutoModerationAction;
  rule_id: Snowflake;
  rule_trigger_type: AutoModerationRuleTriggerTypes;
  user_id: Snowflake;
  channel_id?: Snowflake;
  message_id?: Snowflake;
  alert_system_message_id?: Snowflake;
  content: string;
  matched_keyword: string | null;
  matched_content: string | null;
}

export interface APIAutoModerationAction {
  type: AutoModerationActionTypes;
  metadata?: APIAutoModerationActionMetadata;
}
export interface APIAutoModerationActionMetadata {
  channel_id?: Snowflake;
  duration_seconds?: number;
  custom_message?: string;
}

export interface APIAutoModerationRule {
  id: Snowflake;
  guild_id: Snowflake;
  name: string;
  creator_id: Snowflake;
  event_type: AutoModerationRuleEventTypes;
  trigger_type: AutoModerationRuleTriggerTypes;
  trigger_metadata: APIAutoModerationRuleTriggerMetadata;
  actions: APIAutoModerationAction[];
  enabled: boolean;
  exempt_roles: Snowflake[];
  exempt_channels: Snowflake[];
}

export interface APIAutoModerationRuleTriggerMetadata {
  keyword_filter?: string[];
  presets?: AutoModerationRuleKeywordPresetTypes[];
  allow_list?: string[];
  regex_patterns?: string[];
  mention_total_limit?: number;
  mention_raid_protection_enabled?: boolean;
}

export interface APIGuild extends APIPartialGuild {
  icon_hash?: string | null;
  discovery_splash: string | null;
  owner?: boolean;
  owner_id: Snowflake;
  permissions?: Permissions;
  region: string;
  afk_channel_id: Snowflake | null;
  afk_timeout: number;
  widget_enabled?: boolean;
  widget_channel_id?: Snowflake | null;
  verification_level: GuildVerificationLevel;
  default_message_notifications: GuildDefaultMessageNotifications;
  explicit_content_filter: GuildExplicitContentFilter;
  roles: APIRole[];
  emojis: APIEmoji[];
  features: GuildFeature[];
  mfa_level: GuildMFALevel;
  application_id: Snowflake | null;
  system_channel_id: Snowflake | null;
  system_channel_flags: GuildSystemChannelFlags;
  rules_channel_id: Snowflake | null;
  max_presences?: number | null;
  max_members?: number;
  vanity_url_code: string | null;
  description: string | null;
  banner: string | null;
  premium_tier: GuildPremiumTier;
  premium_subscription_count?: number;
  preferred_locale: string;
  public_updates_channel_id: Snowflake | null;
  max_video_channel_users?: number;
  approximate_member_count?: number;
  approximate_presence_count?: number;
  welcome_screen?: APIGuildWelcomeScreen;
  nsfw_level: GuildNSFWLevel;
  stickers: APISticker[];
  premium_progress_bar_enabled: boolean;
  hub_type: GuildHubType | null;
  safety_alerts_channel_id: Snowflake | null;
}

export interface APIApplicationRoleConnectionMetadata {
  type: ApplicationRoleConnectionMetadataTypes;
  key: string;
  name: string;
  name_localizations?: LocalizationMap;
  description: string;
  description_localizations?: LocalizationMap;
}

export interface APIInteractionDataResolvedChannel extends Required<APIPartialChannel> {
  thread_metadata?: APIThreadMetadata | null;
  permissions: Permissions;
  parent_id?: string | null;
}

export interface APIInteractionDataResolvedGuildMember extends Omit<APIGuildMember, 'user' | 'deaf' | 'mute'> {
  permissions: Permissions;
}

export interface APIInteractionDataResolved {
  users?: Record<Snowflake, APIUser>;
  roles?: Record<Snowflake, APIRole>;
  members?: Record<Snowflake, APIInteractionDataResolvedGuildMember>;
  channels?: Record<Snowflake, APIInteractionDataResolvedChannel>;
  attachments?: Record<Snowflake, APIAttachment>;
}

export type APIUserInteractionDataResolved = Required<Pick<APIInteractionDataResolved, 'users'>> &
  Pick<APIInteractionDataResolved, 'members'>;

export interface APIMessageStringSelectInteractionData {
  custom_id: string;
  component_type: SelectMenuComponentTypes.STRING_SELECT;
  values: string[];
}

export interface APIMessageUserSelectInteractionData {
  custom_id: string;
  component_type: SelectMenuComponentTypes.USER_SELECT;
  values: Snowflake[];
  resolved: APIUserInteractionDataResolved;
}

export interface APIMessageRoleSelectInteractionData {
  custom_id: string;
  component_type: SelectMenuComponentTypes.ROLE_SELECT;
  values: Snowflake[];
  resolved: Required<Pick<APIInteractionDataResolved, 'roles'>>;
}

export interface APIMessageMentionableSelectInteractionData {
  custom_id: string;
  component_type: SelectMenuComponentTypes.MENTIONABLE_SELECT;
  values: Snowflake[];
  resolved: Pick<APIInteractionDataResolved, 'users' | 'members' | 'roles'>;
}

export interface APIMessageChannelSelectInteractionData {
  custom_id: string;
  component_type: SelectMenuComponentTypes.CHANNEL_SELECT;
  values: Snowflake[];
  resolved: Required<Pick<APIInteractionDataResolved, 'channels'>>;
}

export type APIMessageSelectMenuInteractionData =
  | APIMessageStringSelectInteractionData
  | APIMessageUserSelectInteractionData
  | APIMessageRoleSelectInteractionData
  | APIMessageMentionableSelectInteractionData
  | APIMessageChannelSelectInteractionData;

export type RawMessageSelectMenuInteractionData = APIMessageSelectMenuInteractionData;

export interface APIBaseSelectMenuComponent<T extends SelectMenuComponentTypes> {
  type: T;
  custom_id: string;
  placeholder?: string;
  min_values?: number;
  max_values?: number;
  disabled?: boolean;
}

export interface APIStringSelectComponent extends APIBaseSelectMenuComponent<SelectMenuComponentTypes.STRING_SELECT> {
  options: APISelectMenuOption[];
}

export type APIUserSelectComponent = APIBaseSelectMenuComponent<SelectMenuComponentTypes.USER_SELECT>;

export type APIRoleSelectComponent = APIBaseSelectMenuComponent<SelectMenuComponentTypes.ROLE_SELECT>;

export type APIMentionableSelectComponent = APIBaseSelectMenuComponent<SelectMenuComponentTypes.MENTIONABLE_SELECT>;

export interface APIChannelSelectComponent extends APIBaseSelectMenuComponent<SelectMenuComponentTypes.CHANNEL_SELECT> {
  channel_types?: ChannelTypes[];
}

export type APISelectMenuComponent =
  | APIStringSelectComponent
  | APIUserSelectComponent
  | APIRoleSelectComponent
  | APIMentionableSelectComponent
  | APIChannelSelectComponent;

export interface APIActionRowComponent<T extends APIActionRowComponentTypes> {
  type: MessageComponentTypes.ACTION_ROW;
  components: T[];
}

export declare type APIMessageComponent =
  | APIMessageActionRowComponent
  | APIActionRowComponent<APIMessageActionRowComponent>;
export declare type APIActionRowComponentTypes = APIMessageActionRowComponent | APIModalActionRowComponent;
export declare type APIMessageActionRowComponent = APIButtonComponent | APISelectMenuComponent;
export declare type APIModalActionRowComponent = APITextInputComponent;
