'use strict';

const { createEnum } = require('../util/Enums');

/**
 * @typedef {Object} DiscordjsErrorCodes

 * @property {string} ClientInvalidOption
 * @property {string} ClientInvalidProvidedShards
 * @property {string} ClientMissingIntents
 * @property {string} ClientNotReady

 * @property {string} TokenInvalid
 * @property {string} TokenMissing
 * @property {string} ApplicationCommandPermissionsTokenMissing

 * @property {string} WSCloseRequested
 * @property {string} WSConnectionExists
 * @property {string} WSNotOpen
 * @property {string} ManagerDestroyed

 * @property {string} BitFieldInvalid

 * @property {string} ShardingInvalid
 * @property {string} ShardingRequired
 * @property {string} InvalidIntents
 * @property {string} DisallowedIntents
 * @property {string} ShardingNoShards
 * @property {string} ShardingInProcess
 * @property {string} ShardingInvalidEvalBroadcast
 * @property {string} ShardingShardNotFound
 * @property {string} ShardingAlreadySpawned
 * @property {string} ShardingProcessExists
 * @property {string} ShardingWorkerExists
 * @property {string} ShardingReadyTimeout
 * @property {string} ShardingReadyDisconnected
 * @property {string} ShardingReadyDied
 * @property {string} ShardingNoChildExists
 * @property {string} ShardingShardMiscalculation

 * @property {string} ColorRange
 * @property {string} ColorConvert

 * @property {string} InviteOptionsMissingChannel

 * @property {string} ButtonLabel
 * @property {string} ButtonURL
 * @property {string} ButtonCustomId

 * @property {string} SelectMenuCustomId
 * @property {string} SelectMenuPlaceholder
 * @property {string} SelectOptionLabel
 * @property {string} SelectOptionValue
 * @property {string} SelectOptionDescription

 * @property {string} InteractionCollectorError

 * @property {string} FileNotFound

 * @property {string} UserBannerNotFetched
 * @property {string} UserNoDMChannel

 * @property {string} VoiceNotStageChannel

 * @property {string} VoiceStateNotOwn
 * @property {string} VoiceStateInvalidType

 * @property {string} ReqResourceType

 * @property {string} ImageFormat
 * @property {string} ImageSize

 * @property {string} MessageBulkDeleteType
 * @property {string} MessageNonceType
 * @property {string} MessageContentType

 * @property {string} SplitMaxLen

 * @property {string} BanResolveId
 * @property {string} FetchBanResolveId

 * @property {string} PruneDaysType

 * @property {string} GuildChannelResolve
 * @property {string} GuildVoiceChannelResolve
 * @property {string} GuildChannelOrphan
 * @property {string} GuildChannelUnowned
 * @property {string} GuildOwned
 * @property {string} GuildMembersTimeout
 * @property {string} GuildUncachedMe
 * @property {string} ChannelNotCached
 * @property {string} StageChannelResolve
 * @property {string} GuildScheduledEventResolve
 * @property {string} FetchOwnerId

 * @property {string} InvalidType
 * @property {string} InvalidElement

 * @property {string} MessageThreadParent
 * @property {string} MessageExistingThread
 * @property {string} ThreadInvitableType

 * @property {string} WebhookMessage
 * @property {string} WebhookTokenUnavailable
 * @property {string} WebhookURLInvalid
 * @property {string} WebhookApplication
 * @property {string} MessageReferenceMissing

 * @property {string} EmojiType
 * @property {string} EmojiManaged
 * @property {string} MissingManageEmojisAndStickersPermission
 * @property {string} NotGuildSticker

 * @property {string} ReactionResolveUser

 * @property {string} VanityURL

 * @property {string} InviteResolveCode

 * @property {string} InviteNotFound

 * @property {string} DeleteGroupDMChannel
 * @property {string} FetchGroupDMChannel

 * @property {string} MemberFetchNonceLength

 * @property {string} GlobalCommandPermissions
 * @property {string} GuildUncachedEntityResolve

 * @property {string} InteractionAlreadyReplied
 * @property {string} InteractionNotReplied
 * @property {string} InteractionEphemeralReplied

 * @property {string} CommandInteractionOptionNotFound
 * @property {string} CommandInteractionOptionType
 * @property {string} CommandInteractionOptionNoSubCommand
 * @property {string} CommandInteractionOptionNoSubCommandGroup
 * @property {string} AutocompleteInteractionOptionNoFocusedOption

 * @property {string} ModalSubmitInteractionFieldNotFound
 * @property {string} ModalSubmitInteractionFieldType

 * @property {string} InvalidMissingScopes

 * @property {string} NotImplemented

 * @property {string} SweepFilterReturn
 */

// JSDoc for intellisense purposes
/**
 * @type {DiscordjsErrorCodes}
 * @ignore
 */
module.exports = createEnum([
  'ClientInvalidOption',
  'ClientInvalidProvidedShards',
  'ClientMissingIntents',
  'ClientNotReady',

  'TokenInvalid',
  'TokenMissing',
  'ApplicationCommandPermissionsTokenMissing',

  'WSCloseRequested',
  'WSConnectionExists',
  'WSNotOpen',
  'ManagerDestroyed',

  'BitFieldInvalid',

  'ShardingInvalid',
  'ShardingRequired',
  'InvalidIntents',
  'DisallowedIntents',
  'ShardingNoShards',
  'ShardingInProcess',
  'ShardingInvalidEvalBroadcast',
  'ShardingShardNotFound',
  'ShardingAlreadySpawned',
  'ShardingProcessExists',
  'ShardingWorkerExists',
  'ShardingReadyTimeout',
  'ShardingReadyDisconnected',
  'ShardingReadyDied',
  'ShardingNoChildExists',
  'ShardingShardMiscalculation',

  'ColorRange',
  'ColorConvert',

  'InviteOptionsMissingChannel',

  'ButtonLabel',
  'ButtonURL',
  'ButtonCustomId',

  'SelectMenuCustomId',
  'SelectMenuPlaceholder',
  'SelectOptionLabel',
  'SelectOptionValue',
  'SelectOptionDescription',

  'InteractionCollectorError',

  'FileNotFound',

  'UserBannerNotFetched',
  'UserNoDMChannel',

  'VoiceNotStageChannel',

  'VoiceStateNotOwn',
  'VoiceStateInvalidType',

  'ReqResourceType',

  'ImageFormat',
  'ImageSize',

  'MessageBulkDeleteType',
  'MessageNonceType',
  'MessageContentType',

  'SplitMaxLen',

  'BanResolveId',
  'FetchBanResolveId',

  'PruneDaysType',

  'GuildChannelResolve',
  'GuildVoiceChannelResolve',
  'GuildChannelOrphan',
  'GuildChannelUnowned',
  'GuildOwned',
  'GuildMembersTimeout',
  'GuildUncachedMe',
  'ChannelNotCached',
  'StageChannelResolve',
  'GuildScheduledEventResolve',
  'FetchOwnerId',

  'InvalidType',
  'InvalidElement',

  'MessageThreadParent',
  'MessageExistingThread',
  'ThreadInvitableType',

  'WebhookMessage',
  'WebhookTokenUnavailable',
  'WebhookURLInvalid',
  'WebhookApplication',
  'MessageReferenceMissing',

  'EmojiType',
  'EmojiManaged',
  'MissingManageEmojisAndStickersPermission',
  'NotGuildSticker',

  'ReactionResolveUser',

  'VanityURL',

  'InviteResolveCode',

  'InviteNotFound',

  'DeleteGroupDMChannel',
  'FetchGroupDMChannel',

  'MemberFetchNonceLength',

  'GlobalCommandPermissions',
  'GuildUncachedEntityResolve',

  'InteractionAlreadyReplied',
  'InteractionNotReplied',
  'InteractionEphemeralReplied',

  'CommandInteractionOptionNotFound',
  'CommandInteractionOptionType',
  'CommandInteractionOptionNoSubCommand',
  'CommandInteractionOptionNoSubCommandGroup',
  'AutocompleteInteractionOptionNoFocusedOption',

  'ModalSubmitInteractionFieldNotFound',
  'ModalSubmitInteractionFieldType',

  'InvalidMissingScopes',

  'NotImplemented',

  'SweepFilterReturn',
]);
