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
 * <warn>This property is deprecated.</warn>
 * @property {'WSConnectionExists'} WSConnectionExists
 * <warn>This property is deprecated.</warn>
 * @property {'WSNotOpen'} WSNotOpen
 * <warn>This property is deprecated.</warn>
 * @property {'ManagerDestroyed'} ManagerDestroyed
 * <warn>This property is deprecated.</warn>

 * @property {'BitFieldInvalid'} BitFieldInvalid

 * @property {'ShardingInvalid'} ShardingInvalid
 * <warn>This property is deprecated.</warn>
 * @property {'ShardingRequired'} ShardingRequired
 * <warn>This property is deprecated.</warn>
 * @property {'InvalidIntents'} InvalidIntents
 * <warn>This property is deprecated.</warn>
 * @property {'DisallowedIntents'} DisallowedIntents
 * <warn>This property is deprecated.</warn>
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
 * <warn>This property is deprecated.</warn>
 * @property {'ButtonURL'} ButtonURL
 * <warn>This property is deprecated.</warn>
 * @property {'ButtonCustomId'} ButtonCustomId
 * <warn>This property is deprecated.</warn>

 * @property {'SelectMenuCustomId'} SelectMenuCustomId
 * <warn>This property is deprecated.</warn>
 * @property {'SelectMenuPlaceholder'} SelectMenuPlaceholder
 * <warn>This property is deprecated.</warn>
 * @property {'SelectOptionLabel'} SelectOptionLabel
 * <warn>This property is deprecated.</warn>
 * @property {'SelectOptionValue'} SelectOptionValue
 * <warn>This property is deprecated.</warn>
 * @property {'SelectOptionDescription'} SelectOptionDescription
 * <warn>This property is deprecated.</warn>

 * @property {'InteractionCollectorError'} InteractionCollectorError

 * @property {'FileNotFound'} FileNotFound

 * @property {'UserBannerNotFetched'} UserBannerNotFetched
 * <warn>This property is deprecated.</warn>
 * @property {'UserNoDMChannel'} UserNoDMChannel

 * @property {'VoiceNotStageChannel'} VoiceNotStageChannel

 * @property {'VoiceStateNotOwn'} VoiceStateNotOwn
 * @property {'VoiceStateInvalidType'} VoiceStateInvalidType

 * @property {'ReqResourceType'} ReqResourceType

 * @property {'ImageFormat'} ImageFormat
 * <warn>This property is deprecated.</warn>
 * @property {'ImageSize'} ImageSize
 * <warn>This property is deprecated.</warn>

 * @property {'MessageBulkDeleteType'} MessageBulkDeleteType
 * @property {'MessageContentType'} MessageContentType
 * @property {'MessageNonceRequired'} MessageNonceRequired
 * @property {'MessageNonceType'} MessageNonceType

 * @property {'SplitMaxLen'} SplitMaxLen
 * <warn>This property is deprecated.</warn>

 * @property {'BanResolveId'} BanResolveId
 * @property {'FetchBanResolveId'} FetchBanResolveId

 * @property {'PruneDaysType'} PruneDaysType

 * @property {'GuildChannelResolve'} GuildChannelResolve
 * @property {'GuildVoiceChannelResolve'} GuildVoiceChannelResolve
 * @property {'GuildChannelOrphan'} GuildChannelOrphan
 * @property {'GuildChannelUnowned'} GuildChannelUnowned
 * @property {'GuildOwned'} GuildOwned
 * @property {'GuildMembersTimeout'} GuildMembersTimeout
 * @property {'GuildSoundboardSoundsTimeout'} GuildSoundboardSoundsTimeout
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
 * @property {'MissingManageGuildExpressionsPermission'} MissingManageGuildExpressionsPermission
 * @property {'MissingManageEmojisAndStickersPermission'} MissingManageEmojisAndStickersPermission
 * <warn>This property is deprecated. Use `MissingManageGuildExpressionsPermission` instead.</warn>
 *

 * @property {'NotGuildSoundboardSound'} NotGuildSoundboardSound
 * @property {'NotGuildSticker'} NotGuildSticker

 * @property {'ReactionResolveUser'} ReactionResolveUser

 * @property {'VanityURL'} VanityURL
 * <warn>This property is deprecated.</warn>

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
 * @property {'CommandInteractionOptionInvalidChannelType'} CommandInteractionOptionInvalidChannelType
 * @property {'AutocompleteInteractionOptionNoFocusedOption'} AutocompleteInteractionOptionNoFocusedOption

 * @property {'ModalSubmitInteractionFieldNotFound'} ModalSubmitInteractionFieldNotFound
 * @property {'ModalSubmitInteractionFieldType'} ModalSubmitInteractionFieldType

 * @property {'InvalidMissingScopes'} InvalidMissingScopes
 * @property {'InvalidScopesWithPermissions'} InvalidScopesWithPermissions

 * @property {'NotImplemented'} NotImplemented

 * @property {'GuildForumMessageRequired'} GuildForumMessageRequired

 * @property {'SweepFilterReturn'} SweepFilterReturn

 * @property {'EntitlementCreateInvalidOwner'} EntitlementCreateInvalidOwner

 * @property {'BulkBanUsersOptionEmpty'} BulkBanUsersOptionEmpty

 * @property {'PollAlreadyExpired'} PollAlreadyExpired
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
  'MessageContentType',
  'MessageNonceRequired',
  'MessageNonceType',

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
  'GuildSoundboardSoundsTimeout',
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
  'MissingManageGuildExpressionsPermission',
  'MissingManageEmojisAndStickersPermission',

  'NotGuildSoundboardSound',
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
  'CommandInteractionOptionInvalidChannelType',
  'AutocompleteInteractionOptionNoFocusedOption',

  'ModalSubmitInteractionFieldNotFound',
  'ModalSubmitInteractionFieldType',

  'InvalidMissingScopes',
  'InvalidScopesWithPermissions',

  'NotImplemented',

  'SweepFilterReturn',

  'GuildForumMessageRequired',

  'EntitlementCreateInvalidOwner',

  'BulkBanUsersOptionEmpty',

  'PollAlreadyExpired',
];

// JSDoc for IntelliSense purposes
/**
 * @type {DiscordjsErrorCodes}
 * @ignore
 */
module.exports = Object.fromEntries(keys.map(key => [key, key]));
