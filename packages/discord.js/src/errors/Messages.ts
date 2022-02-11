import { register } from './DJSError';

const tokenInvalidMessage = 'An invalid token was provided.';
const shardingInvalidMessage = 'Invalid shard settings were provided.';
const shardingRequiredMessage = 'This session would have handled too many guilds - Sharding is required.';
const invalidIntentsMessage = 'Invalid intent provided for WebSocket intents.';
const disallowedIntentsMessage = 'Privileged intent provided is not enabled or whitelisted.';

export const Messages = {
  CLIENT_INVALID_OPTION: (prop: string, must: string) => `The ${prop} option must be ${must}` as const,
  CLIENT_INVALID_PROVIDED_SHARDS: 'None of the provided shards were valid.',
  CLIENT_MISSING_INTENTS: 'Valid intents must be provided for the Client.',
  CLIENT_NOT_READY: (action: string) => `The client needs to be logged in to ${action}.` as const,

  TOKEN_INVALID: tokenInvalidMessage,
  TOKEN_MISSING: 'Request to use token, but token was unavailable to the client.',

  WS_CLOSE_REQUESTED: 'WebSocket closed due to user request.',
  WS_CONNECTION_EXISTS: 'There is already an existing WebSocket connection.',
  WS_NOT_OPEN: (data = 'data') => `WebSocket not open to send ${data}` as const,
  MANAGER_DESTROYED: 'Manager was destroyed.',

  BITFIELD_INVALID: (bit: number | bigint) => `Invalid bitfield flag or number: ${bit}.` as const,

  SHARDING_INVALID: shardingInvalidMessage,
  SHARDING_REQUIRED: shardingRequiredMessage,
  INVALID_INTENTS: invalidIntentsMessage,
  DISALLOWED_INTENTS: disallowedIntentsMessage,
  SHARDING_NO_SHARDS: 'No shards have been spawned.',
  SHARDING_IN_PROCESS: 'Shards are still being spawned.',
  SHARDING_INVALID_EVAL_BROADCAST: 'Script to evaluate must be a function',
  SHARDING_SHARD_NOT_FOUND: (id: string) => `Shard ${id} could not be found.` as const,
  SHARDING_ALREADY_SPAWNED: (count: number) => `Already spawned ${count} shards.` as const,
  SHARDING_PROCESS_EXISTS: (id: string) => `Shard ${id} already has an active process.` as const,
  SHARDING_WORKER_EXISTS: (id: string) => `Shard ${id} already has an active worker.` as const,
  SHARDING_READY_TIMEOUT: (id: string) => `Shard ${id}'s Client took too long to become ready.` as const,
  SHARDING_READY_DISCONNECTED: (id: string) => `Shard ${id}'s Client disconnected before becoming ready.` as const,
  SHARDING_READY_DIED: (id: string) => `Shard ${id}'s process exited before its Client became ready.` as const,
  SHARDING_NO_CHILD_EXISTS: (id: string) => `Shard ${id} has no active process or worker.` as const,
  SHARDING_SHARD_MISCALCULATION: (shard: string, guild: string, count: number) =>
    `Calculated invalid shard ${shard} for guild ${guild} with ${count} shards.` as const,

  COLOR_RANGE: 'Color must be within the range 0 - 16777215 (0xFFFFFF).',
  COLOR_CONVERT: 'Unable to convert color to a number.',

  INVITE_OPTIONS_MISSING_CHANNEL: 'A valid guild channel must be provided when GuildScheduledEvent is EXTERNAL.',

  BUTTON_LABEL: 'MessageButton label must be a string',
  BUTTON_URL: 'MessageButton URL must be a string',
  BUTTON_CUSTOM_ID: 'MessageButton customId must be a string',

  SELECT_MENU_CUSTOM_ID: 'MessageSelectMenu customId must be a string',
  SELECT_MENU_PLACEHOLDER: 'MessageSelectMenu placeholder must be a string',
  SELECT_OPTION_LABEL: 'MessageSelectOption label must be a string',
  SELECT_OPTION_VALUE: 'MessageSelectOption value must be a string',
  SELECT_OPTION_DESCRIPTION: 'MessageSelectOption description must be a string',

  INTERACTION_COLLECTOR_ERROR: (reason: string) =>
    `Collector received no interactions before ending with reason: ${reason}` as const,

  FILE_NOT_FOUND: (file: string) => `File could not be found: ${file}` as const,

  USER_BANNER_NOT_FETCHED: "You must fetch this user's banner before trying to generate its URL!",
  USER_NO_DM_CHANNEL: 'No DM Channel exists!',

  VOICE_NOT_STAGE_CHANNEL: 'You are only allowed to do this in stage channels.',

  VOICE_STATE_NOT_OWN:
    'You cannot self-deafen/mute/request to speak on VoiceStates that do not belong to the ClientUser.',
  VOICE_STATE_INVALID_TYPE: (name: string) => `${name} must be a boolean.` as const,

  REQ_RESOURCE_TYPE: 'The resource must be a string, Buffer or a valid file stream.',

  IMAGE_FORMAT: (format: string) => `Invalid image format: ${format}` as const,
  IMAGE_SIZE: (size: string) => `Invalid image size: ${size}` as const,

  MESSAGE_BULK_DELETE_TYPE: 'The messages must be an Array, Collection, or number.',
  MESSAGE_NONCE_TYPE: 'Message nonce must be an integer or a string.',
  MESSAGE_CONTENT_TYPE: 'Message content must be a non-empty string.',

  SPLIT_MAX_LEN: 'Chunk exceeds the max length and contains no split characters.',

  BAN_RESOLVE_ID: (ban = false) => `Couldn't resolve the user id to ${ban ? 'ban' : 'unban'}.` as const,
  FETCH_BAN_RESOLVE_ID: "Couldn't resolve the user id to fetch the ban.",

  PRUNE_DAYS_TYPE: 'Days must be a number',

  GUILD_CHANNEL_RESOLVE: 'Could not resolve channel to a guild channel.',
  GUILD_VOICE_CHANNEL_RESOLVE: 'Could not resolve channel to a guild voice channel.',
  GUILD_CHANNEL_ORPHAN: 'Could not find a parent to this guild channel.',
  GUILD_CHANNEL_UNOWNED: "The fetched channel does not belong to this manager's guild.",
  GUILD_OWNED: 'Guild is owned by the client.',
  GUILD_MEMBERS_TIMEOUT: "Members didn't arrive in time.",
  GUILD_UNCACHED_ME: 'The client user as a member of this guild is uncached.',
  CHANNEL_NOT_CACHED: 'Could not find the channel where this message came from in the cache!',
  STAGE_CHANNEL_RESOLVE: 'Could not resolve channel to a stage channel.',
  GUILD_SCHEDULED_EVENT_RESOLVE: 'Could not resolve the guild scheduled event.',

  INVALID_TYPE: (name: string, expected: string, an = false) =>
    `Supplied ${name} is not a${an ? 'n' : ''} ${expected}.` as const,
  INVALID_ELEMENT: (type: string, name: string, elem: string) =>
    `Supplied ${type} ${name} includes an invalid element: ${elem}` as const,

  MESSAGE_THREAD_PARENT: 'The message was not sent in a guild text or news channel',
  MESSAGE_EXISTING_THREAD: 'The message already has a thread',
  THREAD_INVITABLE_TYPE: (type: string) => `Invitable cannot be edited on ${type}`,

  WEBHOOK_MESSAGE: 'The message was not sent by a webhook.',
  WEBHOOK_TOKEN_UNAVAILABLE: 'This action requires a webhook token, but none is available.',
  WEBHOOK_URL_INVALID: 'The provided webhook URL is not valid.',
  WEBHOOK_APPLICATION: 'This message webhook belongs to an application and cannot be fetched.',
  MESSAGE_REFERENCE_MISSING: 'The message does not reference another message',

  EMOJI_TYPE: 'Emoji must be a string or GuildEmoji/ReactionEmoji',
  EMOJI_MANAGED: 'Emoji is managed and has no Author.',
  MISSING_MANAGE_EMOJIS_AND_STICKERS_PERMISSION: (guild: string) =>
    `Client must have Manage Emojis and Stickers permission in guild ${guild} to see emoji authors.` as const,
  NOT_GUILD_STICKER: 'Sticker is a standard (non-guild) sticker and has no author.',

  REACTION_RESOLVE_USER: "Couldn't resolve the user id to remove from the reaction.",

  VANITY_URL: 'This guild does not have the VANITY_URL feature enabled.',

  INVITE_RESOLVE_CODE: 'Could not resolve the code to fetch the invite.',

  INVITE_NOT_FOUND: 'Could not find the requested invite.',

  DELETE_GROUP_DM_CHANNEL: "Bots don't have access to Group DM Channels and cannot delete them",
  FETCH_GROUP_DM_CHANNEL: "Bots don't have access to Group DM Channels and cannot fetch them",

  MEMBER_FETCH_NONCE_LENGTH: 'Nonce length must not exceed 32 characters.',

  GLOBAL_COMMAND_PERMISSIONS:
    'Permissions for global commands may only be fetched or modified by providing a GuildResolvable ' +
    "or from a guild's application command manager.",
  GUILD_UNCACHED_ROLE_RESOLVE: 'Cannot resolve roles from an arbitrary guild, provide an id instead',

  INTERACTION_ALREADY_REPLIED: 'The reply to this interaction has already been sent or deferred.',
  INTERACTION_NOT_REPLIED: 'The reply to this interaction has not been sent or deferred.',
  INTERACTION_EPHEMERAL_REPLIED: 'Ephemeral responses cannot be deleted.',

  COMMAND_INTERACTION_OPTION_NOT_FOUND: (name: string) => `Required option "${name}" not found.` as const,
  COMMAND_INTERACTION_OPTION_TYPE: (name: string, type: string, expected: string) =>
    `Option "${name}" is of type: ${type}; expected ${expected}.` as const,
  COMMAND_INTERACTION_OPTION_EMPTY: (name: string, type: string) =>
    `Required option "${name}" is of type: ${type}; expected a non-empty value.` as const,
  COMMAND_INTERACTION_OPTION_NO_SUB_COMMAND: 'No subcommand specified for interaction.',
  COMMAND_INTERACTION_OPTION_NO_SUB_COMMAND_GROUP: 'No subcommand group specified for interaction.',
  AUTOCOMPLETE_INTERACTION_OPTION_NO_FOCUSED_OPTION: 'No focused option for autocomplete interaction.',

  INVITE_MISSING_SCOPES: 'At least one valid scope must be provided for the invite',

  NOT_IMPLEMENTED: (what: string, name: string) => `Method ${what} not implemented on ${name}.` as const,

  SWEEP_FILTER_RETURN: 'The return value of the sweepFilter function was not false or a Function',

  AuthenticationFailed: tokenInvalidMessage,
  InvalidShard: shardingInvalidMessage,
  ShardingRequired: shardingRequiredMessage,
  InvalidIntents: invalidIntentsMessage,
  DisallowedIntents: disallowedIntentsMessage,
} as const;

for (const [name, message] of Object.entries(Messages)) register(name, message);
