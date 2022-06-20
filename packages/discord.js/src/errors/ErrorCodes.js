'use strict';

const { createEnum } = require('../util/Enums');

/**
 * @typedef {Object} DiscordjsErrorCodes

 * @property {number} ClientInvalidOption
 * @property {number} ClientInvalidProvidedShards
 * @property {number} ClientMissingIntents
 * @property {number} ClientNotReady

 * @property {number} TokenInvalid
 * @property {number} TokenMissing
 * @property {number} ApplicationCommandPermissionsTokenMissing

 * @property {number} WSCloseRequested
 * @property {number} WSConnectionExists
 * @property {number} WSNotOpen
 * @property {number} ManagerDestroyed

 * @property {number} BitFieldInvalid

 * @property {number} ShardingInvalid
 * @property {number} ShardingRequired
 * @property {number} InvalidIntents
 * @property {number} DisallowedIntents
 * @property {number} ShardingNoShards
 * @property {number} ShardingInProcess
 * @property {number} ShardingInvalidEvalBroadcast
 * @property {number} ShardingShardNotFound
 * @property {number} ShardingAlreadySpawned
 * @property {number} ShardingProcessExists
 * @property {number} ShardingWorkerExists
 * @property {number} ShardingReadyTimeout
 * @property {number} ShardingReadyDisconnected
 * @property {number} ShardingReadyDied
 * @property {number} ShardingNoChildExists
 * @property {number} ShardingShardMiscalculation

 * @property {number} ColorRange
 * @property {number} ColorConvert

 * @property {number} InviteOptionsMissingChannel

 * @property {number} ButtonLabel
 * @property {number} ButtonURL
 * @property {number} ButtonCustomId

 * @property {number} SelectMenuCustomId
 * @property {number} SelectMenuPlaceholder
 * @property {number} SelectOptionLabel
 * @property {number} SelectOptionValue
 * @property {number} SelectOptionDescription

 * @property {number} InteractionCollectorError

 * @property {number} FileNotFound

 * @property {number} UserBannerNotFetched
 * @property {number} UserNoDMChannel

 * @property {number} VoiceNotStageChannel

 * @property {number} VoiceStateNotOwn
 * @property {number} VoiceStateInvalidType

 * @property {number} ReqResourceType

 * @property {number} ImageFormat
 * @property {number} ImageSize

 * @property {number} MessageBulkDeleteType
 * @property {number} MessageNonceType
 * @property {number} MessageContentType

 * @property {number} SplitMaxLen

 * @property {number} BanResolveId
 * @property {number} FetchBanResolveId

 * @property {number} PruneDaysType

 * @property {number} GuildChannelResolve
 * @property {number} GuildVoiceChannelResolve
 * @property {number} GuildChannelOrphan
 * @property {number} GuildChannelUnowned
 * @property {number} GuildOwned
 * @property {number} GuildMembersTimeout
 * @property {number} GuildUncachedMe
 * @property {number} ChannelNotCached
 * @property {number} StageChannelResolve
 * @property {number} GuildScheduledEventResolve
 * @property {number} FetchOwnerId

 * @property {number} InvalidType
 * @property {number} InvalidElement

 * @property {number} MessageThreadParent
 * @property {number} MessageExistingThread
 * @property {number} ThreadInvitableType

 * @property {number} WebhookMessage
 * @property {number} WebhookTokenUnavailable
 * @property {number} WebhookURLInvalid
 * @property {number} WebhookApplication
 * @property {number} MessageReferenceMissing

 * @property {number} EmojiType
 * @property {number} EmojiManaged
 * @property {number} MissingManageEmojisAndStickersPermission
 * @property {number} NotGuildSticker

 * @property {number} ReactionResolveUser

 * @property {number} VanityURL

 * @property {number} InviteResolveCode

 * @property {number} InviteNotFound

 * @property {number} DeleteGroupDMChannel
 * @property {number} FetchGroupDMChannel

 * @property {number} MemberFetchNonceLength

 * @property {number} GlobalCommandPermissions
 * @property {number} GuildUncachedEntityResolve

 * @property {number} InteractionAlreadyReplied
 * @property {number} InteractionNotReplied
 * @property {number} InteractionEphemeralReplied

 * @property {number} CommandInteractionOptionNotFound
 * @property {number} CommandInteractionOptionType
 * @property {number} CommandInteractionOptionEmpty
 * @property {number} CommandInteractionOptionNoSubcommand
 * @property {number} CommandInteractionOptionNoSubcommandGroup
 * @property {number} AutocompleteInteractionOptionNoFocusedOption

 * @property {number} ModalSubmitInteractionFieldNotFound
 * @property {number} ModalSubmitInteractionFieldType

 * @property {number} InvalidMissingScopes

 * @property {number} NotImplemented

 * @property {number} SweepFilterReturn
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
  'CommandInteractionOptionEmpty',
  'CommandInteractionOptionNoSubcommand',
  'CommandInteractionOptionNoSubcommandGroup',
  'AutocompleteInteractionOptionNoFocusedOption',

  'ModalSubmitInteractionFieldNotFound',
  'ModalSubmitInteractionFieldType',

  'InvalidMissingScopes',

  'NotImplemented',

  'SweepFilterReturn',
]);
