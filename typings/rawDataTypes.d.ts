// These are aggregate types that are used in the typings file but do not exist as actual exported values.
// To prevent them from showing up in an editor, they are imported from here instead of exporting them there directly.

import {
  APIApplication,
  APIApplicationCommand,
  APIApplicationCommandInteraction,
  APIAttachment,
  APIAuditLog,
  APIAuditLogEntry,
  APIBan,
  APIChannel,
  APIEmoji,
  APIExtendedInvite,
  APIGuild,
  APIGuildIntegration,
  APIGuildIntegrationApplication,
  APIGuildMember,
  APIGuildPreview,
  APIGuildWelcomeScreen,
  APIGuildWelcomeScreenChannel,
  APIGuildWidget,
  APIGuildWidgetMember,
  APIInteractionDataResolvedChannel,
  APIInteractionDataResolvedGuildMember,
  APIInteractionGuildMember,
  APIInvite,
  APIInviteStageInstance,
  APIMessage,
  APIMessageButtonInteractionData,
  APIMessageComponentInteraction,
  APIMessageSelectMenuInteractionData,
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
  APIActionRowComponent,
  APITextInputComponent,
  APIModalActionRowComponent,
  APIModalSubmitInteraction,
  LocalizationMap
} from 'discord-api-types/v9';
import { GuildChannel, Guild, PermissionOverwrites, InteractionType } from '.';
import type {
  AutoModerationActionTypes,
  AutoModerationRuleEventTypes,
  AutoModerationRuleKeywordPresetTypes,
  AutoModerationRuleTriggerTypes,
  InteractionTypes,
  MessageComponentTypes,
  ApplicationRoleConnectionMetadataTypes,
  AnimationTypes
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
export type RawMessageSelectMenuInteractionData = APIMessageSelectMenuInteractionData;

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

export type RawMessageAttachmentData = APIAttachment;

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
}

export interface APIApplicationRoleConnectionMetadata {
  type: ApplicationRoleConnectionMetadataTypes;
  key: string;
  name: string;
  name_localizations?: LocalizationMap;
  description: string;
  description_localizations?: LocalizationMap;
}

export interface VoiceChannelEffectData {
	channel_id: Snowflake;
	guild_id: Snowflake;
	user_id: Snowflake;
	emoji?: APIEmoji | null;
	animation_type?: AnimationTypes;
	animation_id?: number;
}
