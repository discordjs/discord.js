// These are aggregate types that are used in the typings file but do not exist as actual exported values.
// To prevent them from showing up in an editor, they are imported from here instead of exporting them there directly.

import type {
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
  APIVoiceState,
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
} from 'discord-api-types/v10';
import type { GuildChannel, Guild, PermissionOverwrites } from './index.js';

export type RawActivityData = GatewayActivity;

export type RawApplicationData = RawClientApplicationData | RawIntegrationApplicationData;
export type RawClientApplicationData = APIMessage['application'] | GatewayReadyDispatchData['application'];
export type RawIntegrationApplicationData = APIGuildIntegrationApplication | Partial<APIApplication>;

export type RawApplicationCommandData = APIApplicationCommand;

export type RawChannelData =
  | RawDMChannelData
  | RawGuildChannelData
  | RawPartialGroupDMChannelData
  | RawThreadChannelData;
export type RawDMChannelData = APIChannel | APIInteractionDataResolvedChannel;
export type RawGuildChannelData = APIChannel | APIInteractionDataResolvedChannel | Required<APIPartialChannel>;
export type RawPartialGroupDMChannelData = APIChannel | Required<APIPartialChannel>;
export type RawThreadChannelData = APIChannel | APIInteractionDataResolvedChannel;

export type RawEmojiData =
  | GatewayActivityEmoji
  | Omit<Partial<APIPartialEmoji>, 'animated'>
  | RawGuildEmojiData
  | RawReactionEmojiData;
export type RawApplicationEmojiData = APIEmoji;
export type RawGuildEmojiData = APIEmoji;
export type RawReactionEmojiData = APIEmoji | APIPartialEmoji;

export type RawGuildAuditLogData = APIAuditLog;

export type RawGuildAuditLogEntryData = APIAuditLogEntry;

export type RawGuildBanData = APIBan | GatewayGuildBanAddDispatchData;

export type RawGuildData = APIGuild | APIUnavailableGuild;
export type RawAnonymousGuildData = RawGuildData | RawInviteGuildData;
export type RawBaseGuildData = RawAnonymousGuildData | RawOAuth2GuildData;
export type RawInviteGuildData = APIPartialGuild;
export type RawOAuth2GuildData = RESTAPIPartialCurrentUserGuild;

export type RawGuildMemberData =
  | APIGuildMember
  | APIInteractionDataResolvedGuildMember
  | APIInteractionGuildMember
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

export type RawInviteData =
  | APIExtendedInvite
  | APIInvite
  | (GatewayInviteCreateDispatchData & { channel: GuildChannel; guild: Guild })
  | (GatewayInviteDeleteDispatchData & { channel: GuildChannel; guild: Guild });

export type RawMessageData = APIMessage;
export type RawPartialMessageData = GatewayMessageUpdateDispatchData;

export type RawAttachmentData = APIAttachment;

export type RawMessagePayloadData =
  | RESTPatchAPIChannelMessageJSONBody
  | RESTPatchAPIInteractionFollowupJSONBody
  | RESTPatchAPIInteractionOriginalResponseJSONBody
  | RESTPatchAPIWebhookWithTokenJSONBody
  | RESTPostAPIChannelMessageJSONBody
  | RESTPostAPIInteractionCallbackFormDataBody
  | RESTPostAPIInteractionFollowupJSONBody
  | RESTPostAPIWebhookWithTokenJSONBody;

export type RawMessageReactionData = APIReaction | GatewayMessageReactionAddDispatchData;

export type RawPermissionOverwriteData = APIOverwrite | PermissionOverwrites;

export type RawPresenceData = GatewayPresenceUpdate;

export type RawRoleData = APIRole;

export type RawRichPresenceAssets = GatewayActivityAssets;

export type RawStageInstanceData =
  | APIStageInstance
  | (Partial<APIStageInstance> & Pick<APIStageInstance, 'channel_id' | 'guild_id' | 'id'>);

export type RawStickerData = APISticker | APIStickerItem;

export type RawStickerPackData = APIStickerPack;

export type RawTeamData = APITeam;

export type RawTeamMemberData = APITeamMember;

export type RawTypingData = GatewayTypingStartDispatchData;

export type RawUserData =
  | (APIUser & { member?: Omit<APIGuildMember, 'user'> })
  | (GatewayPresenceUpdate['user'] & Pick<APIUser, 'username'>);

export type RawVoiceRegionData = APIVoiceRegion;

export type RawVoiceStateData = APIVoiceState | Omit<APIVoiceState, 'guild_id'>;

export type RawWebhookData =
  | APIWebhook
  | RESTGetAPIWebhookWithTokenResult
  | (Partial<APIWebhook> & Required<Pick<APIWebhook, 'guild_id' | 'id'>>);

export type RawWelcomeChannelData = APIGuildWelcomeScreenChannel;

export type RawWelcomeScreenData = APIGuildWelcomeScreen;

export type RawWidgetData = APIGuildWidget;

export type RawWidgetMemberData = APIGuildWidgetMember;
