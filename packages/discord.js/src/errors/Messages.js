'use strict';

const DjsErrorCodes = require('./ErrorCodes');

const Messages = {
  [DjsErrorCodes.CLIENT_INVALID_OPTION]: (prop, must) => `The ${prop} option must be ${must}`,
  [DjsErrorCodes.CLIENT_INVALID_PROVIDED_SHARDS]: 'None of the provided shards were valid.',
  [DjsErrorCodes.CLIENT_MISSING_INTENTS]: 'Valid intents must be provided for the Client.',
  [DjsErrorCodes.CLIENT_NOT_READY]: action => `The client needs to be logged in to ${action}.`,

  [DjsErrorCodes.TOKEN_INVALID]: 'An invalid token was provided.',
  [DjsErrorCodes.TOKEN_MISSING]: 'Request to use token, but token was unavailable to the client.',
  [DjsErrorCodes.APPLICATION_COMMAND_PERMISSIONS_TOKEN_MISSING]:
    'Editing application command permissions requires an OAuth2 bearer token, but none was provided.',

  [DjsErrorCodes.WS_CLOSE_REQUESTED]: 'WebSocket closed due to user request.',
  [DjsErrorCodes.WS_CONNECTION_EXISTS]: 'There is already an existing WebSocket connection.',
  [DjsErrorCodes.WS_NOT_OPEN]: (data = 'data') => `WebSocket not open to send ${data}`,
  [DjsErrorCodes.MANAGER_DESTROYED]: 'Manager was destroyed.',

  [DjsErrorCodes.BITFIELD_INVALID]: bit => `Invalid bitfield flag or number: ${bit}.`,

  [DjsErrorCodes.SHARDING_INVALID]: 'Invalid shard settings were provided.',
  [DjsErrorCodes.SHARDING_REQUIRED]: 'This session would have handled too many guilds - Sharding is required.',
  [DjsErrorCodes.INVALID_INTENTS]: 'Invalid intent provided for WebSocket intents.',
  [DjsErrorCodes.DISALLOWED_INTENTS]: 'Privileged intent provided is not enabled or whitelisted.',
  [DjsErrorCodes.SHARDING_NO_SHARDS]: 'No shards have been spawned.',
  [DjsErrorCodes.SHARDING_IN_PROCESS]: 'Shards are still being spawned.',
  [DjsErrorCodes.SHARDING_INVALID_EVAL_BROADCAST]: 'Script to evaluate must be a function',
  [DjsErrorCodes.SHARDING_SHARD_NOT_FOUND]: id => `Shard ${id} could not be found.`,
  [DjsErrorCodes.SHARDING_ALREADY_SPAWNED]: count => `Already spawned ${count} shards.`,
  [DjsErrorCodes.SHARDING_PROCESS_EXISTS]: id => `Shard ${id} already has an active process.`,
  [DjsErrorCodes.SHARDING_WORKER_EXISTS]: id => `Shard ${id} already has an active worker.`,
  [DjsErrorCodes.SHARDING_READY_TIMEOUT]: id => `Shard ${id}'s Client took too long to become ready.`,
  [DjsErrorCodes.SHARDING_READY_DISCONNECTED]: id => `Shard ${id}'s Client disconnected before becoming ready.`,
  [DjsErrorCodes.SHARDING_READY_DIED]: id => `Shard ${id}'s process exited before its Client became ready.`,
  [DjsErrorCodes.SHARDING_NO_CHILD_EXISTS]: id => `Shard ${id} has no active process or worker.`,
  [DjsErrorCodes.SHARDING_SHARD_MISCALCULATION]: (shard, guild, count) =>
    `Calculated invalid shard ${shard} for guild ${guild} with ${count} shards.`,

  [DjsErrorCodes.COLOR_RANGE]: 'Color must be within the range 0 - 16777215 (0xFFFFFF).',
  [DjsErrorCodes.COLOR_CONVERT]: 'Unable to convert color to a number.',

  [DjsErrorCodes.INVITE_OPTIONS_MISSING_CHANNEL]:
    'A valid guild channel must be provided when GuildScheduledEvent is EXTERNAL.',

  [DjsErrorCodes.BUTTON_LABEL]: 'MessageButton label must be a string',
  [DjsErrorCodes.BUTTON_URL]: 'MessageButton URL must be a string',
  [DjsErrorCodes.BUTTON_CUSTOM_ID]: 'MessageButton customId must be a string',

  [DjsErrorCodes.SELECT_MENU_CUSTOM_ID]: 'MessageSelectMenu customId must be a string',
  [DjsErrorCodes.SELECT_MENU_PLACEHOLDER]: 'MessageSelectMenu placeholder must be a string',
  [DjsErrorCodes.SELECT_OPTION_LABEL]: 'MessageSelectOption label must be a string',
  [DjsErrorCodes.SELECT_OPTION_VALUE]: 'MessageSelectOption value must be a string',
  [DjsErrorCodes.SELECT_OPTION_DESCRIPTION]: 'MessageSelectOption description must be a string',

  [DjsErrorCodes.INTERACTION_COLLECTOR_ERROR]: reason =>
    `Collector received no interactions before ending with reason: ${reason}`,

  [DjsErrorCodes.FILE_NOT_FOUND]: file => `File could not be found: ${file}`,

  [DjsErrorCodes.USER_BANNER_NOT_FETCHED]: "You must fetch this user's banner before trying to generate its URL!",
  [DjsErrorCodes.USER_NO_DM_CHANNEL]: 'No DM Channel exists!',

  [DjsErrorCodes.VOICE_NOT_STAGE_CHANNEL]: 'You are only allowed to do this in stage channels.',

  [DjsErrorCodes.VOICE_STATE_NOT_OWN]:
    'You cannot self-deafen/mute/request to speak on VoiceStates that do not belong to the ClientUser.',
  [DjsErrorCodes.VOICE_STATE_INVALID_TYPE]: name => `${name} must be a boolean.`,

  [DjsErrorCodes.REQ_RESOURCE_TYPE]: 'The resource must be a string, Buffer or a valid file stream.',

  [DjsErrorCodes.IMAGE_FORMAT]: format => `Invalid image format: ${format}`,
  [DjsErrorCodes.IMAGE_SIZE]: size => `Invalid image size: ${size}`,

  [DjsErrorCodes.MESSAGE_BULK_DELETE_TYPE]: 'The messages must be an Array, Collection, or number.',
  [DjsErrorCodes.MESSAGE_NONCE_TYPE]: 'Message nonce must be an integer or a string.',
  [DjsErrorCodes.MESSAGE_CONTENT_TYPE]: 'Message content must be a string.',

  [DjsErrorCodes.SPLIT_MAX_LEN]: 'Chunk exceeds the max length and contains no split characters.',

  [DjsErrorCodes.BAN_RESOLVE_ID]: (ban = false) => `Couldn't resolve the user id to ${ban ? 'ban' : 'unban'}.`,
  [DjsErrorCodes.FETCH_BAN_RESOLVE_ID]: "Couldn't resolve the user id to fetch the ban.",

  [DjsErrorCodes.PRUNE_DAYS_TYPE]: 'Days must be a number',

  [DjsErrorCodes.GUILD_CHANNEL_RESOLVE]: 'Could not resolve channel to a guild channel.',
  [DjsErrorCodes.GUILD_VOICE_CHANNEL_RESOLVE]: 'Could not resolve channel to a guild voice channel.',
  [DjsErrorCodes.GUILD_CHANNEL_ORPHAN]: 'Could not find a parent to this guild channel.',
  [DjsErrorCodes.GUILD_CHANNEL_UNOWNED]: "The fetched channel does not belong to this manager's guild.",
  [DjsErrorCodes.GUILD_OWNED]: 'Guild is owned by the client.',
  [DjsErrorCodes.GUILD_MEMBERS_TIMEOUT]: "Members didn't arrive in time.",
  [DjsErrorCodes.GUILD_UNCACHED_ME]: 'The client user as a member of this guild is uncached.',
  [DjsErrorCodes.CHANNEL_NOT_CACHED]: 'Could not find the channel where this message came from in the cache!',
  [DjsErrorCodes.STAGE_CHANNEL_RESOLVE]: 'Could not resolve channel to a stage channel.',
  [DjsErrorCodes.GUILD_SCHEDULED_EVENT_RESOLVE]: 'Could not resolve the guild scheduled event.',
  [DjsErrorCodes.FETCH_OWNER_ID]: "Couldn't resolve the guild ownerId to fetch the member.",

  [DjsErrorCodes.INVALID_TYPE]: (name, expected, an = false) =>
    `Supplied ${name} is not a${an ? 'n' : ''} ${expected}.`,
  [DjsErrorCodes.INVALID_ELEMENT]: (type, name, elem) =>
    `Supplied ${type} ${name} includes an invalid element: ${elem}`,

  [DjsErrorCodes.MESSAGE_THREAD_PARENT]: 'The message was not sent in a guild text or news channel',
  [DjsErrorCodes.MESSAGE_EXISTING_THREAD]: 'The message already has a thread',
  [DjsErrorCodes.THREAD_INVITABLE_TYPE]: type => `Invitable cannot be edited on ${type}`,

  [DjsErrorCodes.WEBHOOK_MESSAGE]: 'The message was not sent by a webhook.',
  [DjsErrorCodes.WEBHOOK_TOKEN_UNAVAILABLE]: 'This action requires a webhook token, but none is available.',
  [DjsErrorCodes.WEBHOOK_URL_INVALID]: 'The provided webhook URL is not valid.',
  [DjsErrorCodes.WEBHOOK_APPLICATION]: 'This message webhook belongs to an application and cannot be fetched.',
  [DjsErrorCodes.MESSAGE_REFERENCE_MISSING]: 'The message does not reference another message',

  [DjsErrorCodes.EMOJI_TYPE]: 'Emoji must be a string or GuildEmoji/ReactionEmoji',
  [DjsErrorCodes.EMOJI_MANAGED]: 'Emoji is managed and has no Author.',
  [DjsErrorCodes.MISSING_MANAGE_EMOJIS_AND_STICKERS_PERMISSION]: guild =>
    `Client must have Manage Emojis and Stickers permission in guild ${guild} to see emoji authors.`,
  [DjsErrorCodes.NOT_GUILD_STICKER]: 'Sticker is a standard (non-guild) sticker and has no author.',

  [DjsErrorCodes.REACTION_RESOLVE_USER]: "Couldn't resolve the user id to remove from the reaction.",

  [DjsErrorCodes.VANITY_URL]: 'This guild does not have the VANITY_URL feature enabled.',

  [DjsErrorCodes.INVITE_RESOLVE_CODE]: 'Could not resolve the code to fetch the invite.',

  [DjsErrorCodes.INVITE_NOT_FOUND]: 'Could not find the requested invite.',

  [DjsErrorCodes.DELETE_GROUP_DM_CHANNEL]: "Bots don't have access to Group DM Channels and cannot delete them",
  [DjsErrorCodes.FETCH_GROUP_DM_CHANNEL]: "Bots don't have access to Group DM Channels and cannot fetch them",

  [DjsErrorCodes.MEMBER_FETCH_NONCE_LENGTH]: 'Nonce length must not exceed 32 characters.',

  [DjsErrorCodes.GLOBAL_COMMAND_PERMISSIONS]:
    'Permissions for global commands may only be fetched or modified by providing a GuildResolvable ' +
    "or from a guild's application command manager.",
  [DjsErrorCodes.GUILD_UNCACHED_ENTITY_RESOLVE]: type =>
    `Cannot resolve ${type} from an arbitrary guild, provide an id instead`,

  [DjsErrorCodes.INTERACTION_ALREADY_REPLIED]: 'The reply to this interaction has already been sent or deferred.',
  [DjsErrorCodes.INTERACTION_NOT_REPLIED]: 'The reply to this interaction has not been sent or deferred.',
  [DjsErrorCodes.INTERACTION_EPHEMERAL_REPLIED]: 'Ephemeral responses cannot be deleted.',

  [DjsErrorCodes.COMMAND_INTERACTION_OPTION_NOT_FOUND]: name => `Required option "${name}" not found.`,
  [DjsErrorCodes.COMMAND_INTERACTION_OPTION_TYPE]: (name, type, expected) =>
    `Option "${name}" is of type: ${type}; expected ${expected}.`,
  [DjsErrorCodes.COMMAND_INTERACTION_OPTION_EMPTY]: (name, type) =>
    `Required option "${name}" is of type: ${type}; expected a non-empty value.`,
  [DjsErrorCodes.COMMAND_INTERACTION_OPTION_NO_SUB_COMMAND]: 'No subcommand specified for interaction.',
  [DjsErrorCodes.COMMAND_INTERACTION_OPTION_NO_SUB_COMMAND_GROUP]: 'No subcommand group specified for interaction.',
  [DjsErrorCodes.AUTOCOMPLETE_INTERACTION_OPTION_NO_FOCUSED_OPTION]: 'No focused option for autocomplete interaction.',

  [DjsErrorCodes.MODAL_SUBMIT_INTERACTION_FIELD_NOT_FOUND]: customId =>
    `Required field with custom id "${customId}" not found.`,
  [DjsErrorCodes.MODAL_SUBMIT_INTERACTION_FIELD_TYPE]: (customId, type, expected) =>
    `Field with custom id "${customId}" is of type: ${type}; expected ${expected}.`,

  [DjsErrorCodes.INVITE_MISSING_SCOPES]: 'At least one valid scope must be provided for the invite',

  [DjsErrorCodes.NOT_IMPLEMENTED]: (what, name) => `Method ${what} not implemented on ${name}.`,

  [DjsErrorCodes.SWEEP_FILTER_RETURN]: 'The return value of the sweepFilter function was not false or a Function',
};

// Magic needed by WS
Messages.AuthenticationFailed = Messages[DjsErrorCodes.AUTHENTICATION_FAILED];
Messages.InvalidShard = Messages[DjsErrorCodes.SHARDING_INVALID];
Messages.ShardingRequired = Messages[DjsErrorCodes.SHARDING_REQUIRED];
Messages.InvalidIntents = Messages[DjsErrorCodes.INVALID_INTENTS];
Messages.DisallowedIntents = Messages[DjsErrorCodes.DISALLOWED_INTENTS];
