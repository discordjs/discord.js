'use strict';

const { register } = require('./DJSError');

const Messages = {
  CLIENT_INVALID_OPTION: (prop, must) => `The ${prop} option must be ${must}`,
  CLIENT_INVALID_PROVIDED_SHARDS: 'None of the provided shards were valid.',

  TOKEN_INVALID: 'An invalid token was provided.',
  TOKEN_MISSING: 'Request to use token, but token was unavailable to the client.',

  WS_CLOSE_REQUESTED: 'WebSocket closed due to user request.',
  WS_CONNECTION_EXISTS: 'There is already an existing WebSocket connection.',
  WS_NOT_OPEN: (data = 'data') => `Websocket not open to send ${data}`,

  BITFIELD_INVALID: 'Invalid bitfield flag or number.',

  SHARDING_INVALID: 'Invalid shard settings were provided.',
  SHARDING_REQUIRED: 'This session would have handled too many guilds - Sharding is required.',
  INVALID_INTENTS: 'Invalid intent provided for WebSocket intents.',
  DISALLOWED_INTENTS: 'Privileged intent provided is not enabled or whitelisted.',
  SHARDING_NO_SHARDS: 'No shards have been spawned.',
  SHARDING_IN_PROCESS: 'Shards are still being spawned.',
  SHARDING_ALREADY_SPAWNED: count => `Already spawned ${count} shards.`,
  SHARDING_PROCESS_EXISTS: id => `Shard ${id} already has an active process.`,
  SHARDING_READY_TIMEOUT: id => `Shard ${id}'s Client took too long to become ready.`,
  SHARDING_READY_DISCONNECTED: id => `Shard ${id}'s Client disconnected before becoming ready.`,
  SHARDING_READY_DIED: id => `Shard ${id}'s process exited before its Client became ready.`,

  COLOR_RANGE: 'Color must be within the range 0 - 16777215 (0xFFFFFF).',
  COLOR_CONVERT: 'Unable to convert color to a number.',

  EMBED_FIELD_NAME: 'MessageEmbed field names may not be empty.',
  EMBED_FIELD_VALUE: 'MessageEmbed field values may not be empty.',

  FILE_NOT_FOUND: file => `File could not be found: ${file}`,

  USER_NO_DMCHANNEL: 'No DM Channel exists!',

  VOICE_INVALID_HEARTBEAT: 'Tried to set voice heartbeat but no valid interval was specified.',
  VOICE_USER_MISSING: "Couldn't resolve the user to create stream.",
  VOICE_JOIN_CHANNEL: (full = false) =>
    `You do not have permission to join this voice channel${full ? '; it is full.' : '.'}`,
  VOICE_CONNECTION_TIMEOUT: 'Connection not established within 15 seconds.',
  VOICE_TOKEN_ABSENT: 'Token not provided from voice server packet.',
  VOICE_SESSION_ABSENT: 'Session ID not supplied.',
  VOICE_INVALID_ENDPOINT: 'Invalid endpoint received.',
  VOICE_NO_BROWSER: 'Voice connections are not available in browsers.',
  VOICE_CONNECTION_ATTEMPTS_EXCEEDED: attempts => `Too many connection attempts (${attempts}).`,
  VOICE_JOIN_SOCKET_CLOSED: 'Tried to send join packet, but the WebSocket is not open.',
  VOICE_PLAY_INTERFACE_NO_BROADCAST: 'A broadcast cannot be played in this context.',
  VOICE_PLAY_INTERFACE_BAD_TYPE: 'Unknown stream type',
  VOICE_PRISM_DEMUXERS_NEED_STREAM: 'To play a webm/ogg stream, you need to pass a ReadableStream.',

  VOICE_STATE_UNCACHED_MEMBER: 'The member of this voice state is uncached.',
  VOICE_STATE_NOT_OWN: 'You cannot self-deafen/mute on VoiceStates that do not belong to the ClientUser.',
  VOICE_STATE_INVALID_TYPE: name => `${name} must be a boolean.`,

  UDP_SEND_FAIL: 'Tried to send a UDP packet, but there is no socket available.',
  UDP_ADDRESS_MALFORMED: 'Malformed UDP address or port.',
  UDP_CONNECTION_EXISTS: 'There is already an existing UDP connection.',

  REQ_RESOURCE_TYPE: 'The resource must be a string, Buffer or a valid file stream.',

  IMAGE_FORMAT: format => `Invalid image format: ${format}`,
  IMAGE_SIZE: size => `Invalid image size: ${size}`,

  MESSAGE_BULK_DELETE_TYPE: 'The messages must be an Array, Collection, or number.',
  MESSAGE_NONCE_TYPE: 'Message nonce must fit in an unsigned 64-bit integer.',

  TYPING_COUNT: 'Count must be at least 1',

  SPLIT_MAX_LEN: 'Chunk exceeds the max length and contains no split characters.',

  BAN_RESOLVE_ID: (ban = false) => `Couldn't resolve the user ID to ${ban ? 'ban' : 'unban'}.`,
  FETCH_BAN_RESOLVE_ID: "Couldn't resolve the user ID to fetch the ban.",

  PRUNE_DAYS_TYPE: 'Days must be a number',

  GUILD_CHANNEL_RESOLVE: 'Could not resolve channel to a guild channel.',
  GUILD_VOICE_CHANNEL_RESOLVE: 'Could not resolve channel to a guild voice channel.',
  GUILD_CHANNEL_ORPHAN: 'Could not find a parent to this guild channel.',
  GUILD_OWNED: 'Guild is owned by the client.',
  GUILD_MEMBERS_TIMEOUT: "Members didn't arrive in time.",
  GUILD_UNCACHED_ME: 'The client user as a member of this guild is uncached.',

  INVALID_TYPE: (name, expected, an = false) => `Supplied ${name} is not a${an ? 'n' : ''} ${expected}.`,

  WEBHOOK_MESSAGE: 'The message was not sent by a webhook.',

  EMOJI_TYPE: 'Emoji must be a string or GuildEmoji/ReactionEmoji',
  EMOJI_MANAGED: 'Emoji is managed and has no Author.',
  MISSING_MANAGE_EMOJIS_PERMISSION: guild =>
    `Client must have Manage Emoji permission in guild ${guild} to see emoji authors.`,

  REACTION_RESOLVE_USER: "Couldn't resolve the user ID to remove from the reaction.",

  VANITY_URL: 'This guild does not have the VANITY_URL feature enabled.',

  DELETE_GROUP_DM_CHANNEL: "Bots don't have access to Group DM Channels and cannot delete them",
  FETCH_GROUP_DM_CHANNEL: "Bots don't have access to Group DM Channels and cannot fetch them",
};

for (const [name, message] of Object.entries(Messages)) register(name, message);
