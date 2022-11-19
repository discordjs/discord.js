'use strict';

/**
 * @typedef {Object} DiscordjsErrorCodes

 * @property {'ClientInvalidOption'} ClientInvalidOption
 * @property {'ClientInvalidProvidedShards'} ClientInvalidProvidedShards
 * @property {'ClientMissingIntents'} ClientMissingIntents
 * @property {'ClientNotReady'} ClientNotReady

 * @property {'TokenInvalid'} TokenInvalid
 * @property {'TokenMissing'} TokenMissing
 * @property {'ApplicationCommandPermissionsTokenMissing'} ApplicationCommandPermissionsTokenMissing

 * @property {'WSCloseRequested'} WSCloseRequested
 * @property {'WSConnectionExists'} WSConnectionExists
 * @property {'WSNotOpen'} WSNotOpen
 * @property {'ManagerDestroyed'} ManagerDestroyed

 * @property {'BitFieldInvalid'} BitFieldInvalid

 * @property {'ShardingInvalid'} ShardingInvalid
 * @property {'ShardingRequired'} ShardingRequired
 * @property {'InvalidIntents'} InvalidIntents
 * @property {'DisallowedIntents'} DisallowedIntents
 * @property {'ShardingNoShards'} ShardingNoShards
 * @property {'ShardingInProcess'} ShardingInProcess
 * @property {'ShardingInvalidEvalBroadcast'} ShardingInvalidEvalBroadcast
 * @property {'ShardingShardNotFound'} ShardingShardNotFound
 * @property {'ShardingAlreadySpawned'} ShardingAlreadySpawned
 * @property {'ShardingProcessExists'} ShardingProcessExists
 * @property {'ShardingWorkerExists'} ShardingWorkerExists
 * @property {'ShardingReadyTimeout'} ShardingReadyTimeout
 * @property {'ShardingReadyDisconnected'} ShardingReadyDisconnected
 * @property {'ShardingReadyDied'} ShardingReadyDied
 * @property {'ShardingNoChildExists'} ShardingNoChildExists
 * @property {'ShardingShardMiscalculation'} ShardingShardMiscalculation

 * @property {'ColorRange'} ColorRange
 * @property {'ColorConvert'} ColorConvert

 * @property {'InviteOptionsMissingChannel'} InviteOptionsMissingChannel

 * @property {'ButtonLabel'} ButtonLabel
 * @property {'ButtonURL'} ButtonURL
 * @property {'ButtonCustomId'} ButtonCustomId

 * @property {'SelectMenuCustomId'} SelectMenuCustomId
 * @property {'SelectMenuPlaceholder'} SelectMenuPlaceholder
 * @property {'SelectOptionLabel'} SelectOptionLabel
 * @property {'SelectOptionValue'} SelectOptionValue
 * @property {'SelectOptionDescription'} SelectOptionDescription

 * @property {'InteractionCollectorError'} InteractionCollectorError

 * @property {'FileNotFound'} FileNotFound

 * @property {'UserBannerNotFetched'} UserBannerNotFetched
 * @property {'UserNoDMChannel'} UserNoDMChannel

 * @property {'VoiceNotStageChannel'} VoiceNotStageChannel

 * @property {'VoiceStateNotOwn'} VoiceStateNotOwn
 * @property {'VoiceStateInvalidType'} VoiceStateInvalidType

 * @property {'ReqResourceType'} ReqResourceType

 * @property {'ImageFormat'} ImageFormat
 * @property {'ImageSize'} ImageSize

 * @property {'MessageBulkDeleteType'} MessageBulkDeleteType
 * @property {'MessageNonceType'} MessageNonceType
 * @property {'MessageContentType'} MessageContentType

 * @property {'SplitMaxLen'} SplitMaxLen

 * @property {'BanResolveId'} BanResolveId
 * @property {'FetchBanResolveId'} FetchBanResolveId

 * @property {'PruneDaysType'} PruneDaysType

 * @property {'GuildChannelResolve'} GuildChannelResolve
 * @property {'GuildVoiceChannelResolve'} GuildVoiceChannelResolve
 * @property {'GuildChannelOrphan'} GuildChannelOrphan
 * @property {'GuildChannelUnowned'} GuildChannelUnowned
 * @property {'GuildOwned'} GuildOwned
 * @property {'GuildMembersTimeout'} GuildMembersTimeout
 * @property {'GuildUncachedMe'} GuildUncachedMe
 * @property {'ChannelNotCached'} ChannelNotCached
 * @property {'StageChannelResolve'} StageChannelResolve
 * @property {'GuildScheduledEventResolve'} GuildScheduledEventResolve
 * @property {'FetchOwnerId'} FetchOwnerId

 * @property {'InvalidType'} InvalidType
 * @property {'InvalidElement'} InvalidElement

 * @property {'MessageThreadParent'} MessageThreadParent
 * @property {'MessageExistingThread'} MessageExistingThread
 * @property {'ThreadInvitableType'} ThreadInvitableType

 * @property {'WebhookMessage'} WebhookMessage
 * @property {'WebhookTokenUnavailable'} WebhookTokenUnavailable
 * @property {'WebhookURLInvalid'} WebhookURLInvalid
 * @property {'WebhookApplication'} WebhookApplication
 * @property {'MessageReferenceMissing'} MessageReferenceMissing

 * @property {'EmojiType'} EmojiType
 * @property {'EmojiManaged'} EmojiManaged
 * @property {'MissingManageEmojisAndStickersPermission'} MissingManageEmojisAndStickersPermission
 * @property {'NotGuildSticker'} NotGuildSticker

 * @property {'ReactionResolveUser'} ReactionResolveUser

 * @property {'VanityURL'} VanityURL

 * @property {'InviteResolveCode'} InviteResolveCode

 * @property {'InviteNotFound'} InviteNotFound

 * @property {'DeleteGroupDMChannel'} DeleteGroupDMChannel
 * @property {'FetchGroupDMChannel'} FetchGroupDMChannel

 * @property {'MemberFetchNonceLength'} MemberFetchNonceLength

 * @property {'GlobalCommandPermissions'} GlobalCommandPermissions
 * @property {'GuildUncachedEntityResolve'} GuildUncachedEntityResolve

 * @property {'InteractionAlreadyReplied'} InteractionAlreadyReplied
 * @property {'InteractionNotReplied'} InteractionNotReplied
 * @property {'InteractionEphemeralReplied'} InteractionEphemeralReplied
 * <warn>This property is deprecated.</warn>

 * @property {'CommandInteractionOptionNotFound'} CommandInteractionOptionNotFound
 * @property {'CommandInteractionOptionType'} CommandInteractionOptionType
 * @property {'CommandInteractionOptionEmpty'} CommandInteractionOptionEmpty
 * @property {'CommandInteractionOptionNoSubcommand'} CommandInteractionOptionNoSubcommand
 * @property {'CommandInteractionOptionNoSubcommandGroup'} CommandInteractionOptionNoSubcommandGroup
 * @property {'AutocompleteInteractionOptionNoFocusedOption'} AutocompleteInteractionOptionNoFocusedOption

 * @property {'ModalSubmitInteractionFieldNotFound'} ModalSubmitInteractionFieldNotFound
 * @property {'ModalSubmitInteractionFieldType'} ModalSubmitInteractionFieldType

 * @property {'InvalidMissingScopes'} InvalidMissingScopes

 * @property {'NotImplemented'} NotImplemented

 * @property {'GuildForumMessageRequired'} GuildForumMessageRequired

 * @property {'SweepFilterReturn'} SweepFilterReturn
 */

const keys = [
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

  'GuildForumMessageRequired',
];

// JSDoc for IntelliSense purposes
/**
 * @type {DiscordjsErrorCodes}
 * @ignore
 */
module.exports = Object.fromEntries(keys.map(key => [key, key]));
