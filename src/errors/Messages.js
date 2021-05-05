'use strict';

const { register } = require('./DJSError');

const Messages = {
  CLIENT_INVALID_OPTION: (prop, must) => `[discord.js] The ${prop} option must be ${must}`,
  CLIENT_INVALID_PROVIDED_SHARDS: '[discord.js] None of the provided shards were valid.',
  CLIENT_MISSING_INTENTS: '[discord.js] Valid intents must be provided for the Client.',
  CLIENT_NOT_READY: action => `[discord.js] The client needs to be logged in to ${action}.`,

  TOKEN_INVALID: '[discord.js] An invalid token was provided.',
  TOKEN_MISSING: '[discord.js] Request to use token, but token was unavailable to the client.',

  WS_CLOSE_REQUESTED: '[discord.js] WebSocket closed due to user request.',
  WS_CONNECTION_EXISTS: '[discord.js] There is already an existing WebSocket connection.',
  WS_NOT_OPEN: (data = '[discord.js] data') => `[discord.js] Websocket not open to send ${data}`,

  BITFIELD_INVALID: bit => `[discord.js] Invalid bitfield flag or number: ${bit}.`,

  SHARDING_INVALID: '[discord.js] Invalid shard settings were provided.',
  SHARDING_REQUIRED: '[discord.js] This session would have handled too many guilds - Sharding is required.',
  INVALID_INTENTS: '[discord.js] Invalid intent provided for WebSocket intents.',
  DISALLOWED_INTENTS: '[discord.js] Privileged intent provided is not enabled or whitelisted.',
  SHARDING_NO_SHARDS: '[discord.js] No shards have been spawned.',
  SHARDING_IN_PROCESS: '[discord.js] Shards are still being spawned.',
  SHARDING_SHARD_NOT_FOUND: id => `[discord.js] Shard ${id} could not be found.`,
  SHARDING_ALREADY_SPAWNED: count => `[discord.js] Already spawned ${count} shards.`,
  SHARDING_PROCESS_EXISTS: id => `[discord.js] Shard ${id} already has an active process.`,
  SHARDING_WORKER_EXISTS: id => `[discord.js] Shard ${id} already has an active worker.`,
  SHARDING_READY_TIMEOUT: id => `[discord.js] Shard ${id}'s Client took too long to become ready.`,
  SHARDING_READY_DISCONNECTED: id => `[discord.js] Shard ${id}'s Client disconnected before becoming ready.`,
  SHARDING_READY_DIED: id => `[discord.js] Shard ${id}'s process exited before its Client became ready.`,
  SHARDING_NO_CHILD_EXISTS: id => `[discord.js] Shard ${id} has no active process or worker.`,
  SHARDING_SHARD_MISCALCULATION: (shard, guild, count) =>
    `[discord.js] Calculated invalid shard ${shard} for guild ${guild} with ${count} shards.`,

  COLOR_RANGE: '[discord.js] Color must be within the range 0 - 16777215 (0xFFFFFF).',
  COLOR_CONVERT: '[discord.js] Unable to convert color to a number.',

  EMBED_FIELD_NAME: '[discord.js] MessageEmbed field names may not be empty.',
  EMBED_FIELD_VALUE: '[discord.js] MessageEmbed field values may not be empty.',

  FILE_NOT_FOUND: file => `[discord.js] File could not be found: ${file}`,

  USER_NO_DMCHANNEL: '[discord.js] No DM Channel exists!',

  VOICE_INVALID_HEARTBEAT: '[discord.js] Tried to set voice heartbeat but no valid interval was specified.',
  VOICE_USER_MISSING: "[discord.js] Couldn't resolve the user to create stream.",
  VOICE_JOIN_CHANNEL: (full = false) => `[discord.js] You do not have permission to join this voice channel${full ? '[discord.js] ; it is full.' : '[discord.js] .'}`,
  VOICE_CONNECTION_TIMEOUT: '[discord.js] Connection not established within 15 seconds.',
  VOICE_TOKEN_ABSENT: '[discord.js] Token not provided from voice server packet.',
  VOICE_SESSION_ABSENT: '[discord.js] Session ID not supplied.',
  VOICE_INVALID_ENDPOINT: '[discord.js] Invalid endpoint received.',
  VOICE_CONNECTION_ATTEMPTS_EXCEEDED: attempts => `[discord.js] Too many connection attempts (${attempts}).`,
  VOICE_JOIN_SOCKET_CLOSED: '[discord.js] Tried to send join packet, but the WebSocket is not open.',
  VOICE_PLAY_INTERFACE_NO_BROADCAST: '[discord.js] A broadcast cannot be played in this context.',
  VOICE_PLAY_INTERFACE_BAD_TYPE: '[discord.js] Unknown stream type',
  VOICE_PRISM_DEMUXERS_NEED_STREAM: '[discord.js] To play a webm/ogg stream, you need to pass a ReadableStream.',
  VOICE_NOT_STAGE_CHANNEL: '[discord.js] You are only allowed to do this in stage channels.',

  VOICE_STATE_UNCACHED_MEMBER: '[discord.js] The member of this voice state is uncached.',
  VOICE_STATE_NOT_OWN: '[discord.js] You cannot self-deafen/mute/request to speak on VoiceStates that do not belong to the ClientUser.',
  VOICE_STATE_INVALID_TYPE: name => `[discord.js] ${name} must be a boolean.`,

  UDP_SEND_FAIL: '[discord.js] Tried to send a UDP packet, but there is no socket available.',
  UDP_ADDRESS_MALFORMED: '[discord.js] Malformed UDP address or port.',
  UDP_CONNECTION_EXISTS: '[discord.js] There is already an existing UDP connection.',

  REQ_RESOURCE_TYPE: '[discord.js] The resource must be a string, Buffer or a valid file stream.',

  IMAGE_FORMAT: format => `[discord.js] Invalid image format: ${format}`,
  IMAGE_SIZE: size => `[discord.js] Invalid image size: ${size}`,

  MESSAGE_BULK_DELETE_TYPE: '[discord.js] The messages must be an Array, Collection, or number.',
  MESSAGE_NONCE_TYPE: '[discord.js] Message nonce must be an integer or a string.',

  TYPING_COUNT: '[discord.js] Count must be at least 1',

  SPLIT_MAX_LEN: '[discord.js] Chunk exceeds the max length and contains no split characters.',

  BAN_RESOLVE_ID: (ban = false) => `[discord.js] Couldn't resolve the user ID to ${ban ? '[discord.js] ban' : '[discord.js] unban'}.`,
  FETCH_BAN_RESOLVE_ID: "[discord.js] Couldn't resolve the user ID to fetch the ban.",

  PRUNE_DAYS_TYPE: '[discord.js] Days must be a number',

  GUILD_CHANNEL_RESOLVE: '[discord.js] Could not resolve channel to a guild channel.',
  GUILD_VOICE_CHANNEL_RESOLVE: '[discord.js] Could not resolve channel to a guild voice channel.',
  GUILD_CHANNEL_ORPHAN: '[discord.js] Could not find a parent to this guild channel.',
  GUILD_OWNED: '[discord.js] Guild is owned by the client.',
  GUILD_MEMBERS_TIMEOUT: "[discord.js] Members didn't arrive in time.",
  GUILD_UNCACHED_ME: '[discord.js] The client user as a member of this guild is uncached.',

  INVALID_TYPE: (name, expected, an = false) => `[discord.js] Supplied ${name} is not a${an ? '[discord.js] n' : '[discord.js] '} ${expected}.`,
  INVALID_ELEMENT: (type, name, elem) => `[discord.js] Supplied ${type} ${name} includes an invalid element: ${elem}`,

  WEBHOOK_MESSAGE: '[discord.js] The message was not sent by a webhook.',

  EMOJI_TYPE: '[discord.js] Emoji must be a string or GuildEmoji/ReactionEmoji',
  EMOJI_MANAGED: '[discord.js] Emoji is managed and has no Author.',
  MISSING_MANAGE_EMOJIS_PERMISSION: guild => `[discord.js] Client must have Manage Emoji permission in guild ${guild} to see emoji authors.`,

  REACTION_RESOLVE_USER: "[discord.js] Couldn't resolve the user ID to remove from the reaction.",

  VANITY_URL: '[discord.js] This guild does not have the VANITY_URL feature enabled.',

  DELETE_GROUP_DM_CHANNEL: "[discord.js] Bots don't have access to Group DM Channels and cannot delete them",
  FETCH_GROUP_DM_CHANNEL: "[discord.js] Bots don't have access to Group DM Channels and cannot fetch them",

  MEMBER_FETCH_NONCE_LENGTH: '[discord.js] Nonce length must not exceed 32 characters.',
};

for (const [name, message] of Object.entries(Messages)) register(name, message);
