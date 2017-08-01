const { register } = require('./DJSError');

const Messages = {
  CLIENT_INVALID_OPTION: (prop, must) => `The ${prop} option must be ${must}`,

  TOKEN_INVALID: 'An invalid token was provided.',
  TOKEN_MISSING: 'Request to use token, but token was unavailable to the client.',

  FEATURE_BOT_ONLY: 'Only bot accounts are able to make use of this feature.',
  FEATURE_USER_ONLY: 'Only user accounts are able to make use of this feature.',

  WS_BAD_MESSAGE: 'A bad message was received from the websocket; either bad compression, or not JSON.',
  WS_CONNECTION_EXISTS: 'There is already an existing WebSocket connection.',
  WS_NOT_OPEN: (data = 'data') => `Websocket not open to send ${data}`,

  PERMISSION_INVALID: 'Invalid permission string or number.',

  RATELIMIT_INVALID_METHOD: 'Unknown rate limiting method.',

  SHARDING_INVALID: 'Invalid shard settings were provided.',
  SHARDING_REQUIRED: 'This session would have handled too many guilds - Sharding is required.',
  SHARDING_CHILD_CONNECTION: 'Failed to send message to shard\'s process.',
  SHARDING_PARENT_CONNECTION: 'Failed to send message to master process.',
  SHARDING_NO_SHARDS: 'No shards have been spawned',
  SHARDING_IN_PROCESS: 'Shards are still being spawned',
  SHARDING_ALREADY_SPAWNED: count => `Already spawned ${count} shards`,

  SHARD_MESSAGE_FAILED: 'Failed to send message to master process.',

  COLOR_RANGE: 'Color must be within the range 0 - 16777215 (0xFFFFFF).',
  COLOR_CONVERT: 'Unable to convert color to a number.',

  EMBED_FIELD_COUNT: 'MessageEmbeds may not exceed 25 fields.',
  EMBED_FIELD_NAME: 'MessageEmbed field names may not exceed 256 characters or be empty.',
  EMBED_FIELD_VALUE: 'MessageEmbed field values may not exceed 1024 characters or be empty.',
  EMBED_DESCRIPTION: 'MessageEmbed descriptions may not exceed 2048 characters.',
  EMBED_FOOTER_TEXT: 'MessageEmbed footer text may not exceed 2048 characters.',
  EMBED_TITLE: 'MessageEmbed titles may not exceed 256 characters.',

  FILE_NOT_FOUND: file => `File could not be found: ${file}`,

  USER_STATUS: 'User status must be a string',
  USER_NOT_CACHED: 'User is not cached. Use Client.fetchUser first.',
  USER_NO_DMCHANNEL: 'No DM Channel exists!',

  VOICE_INVALID_HEARTBEAT: 'Tried to set voice heartbeat but no valid interval was specified.',
  VOICE_USER_MISSING: 'Couldn\'t resolve the user to create stream.',
  VOICE_STREAM_EXISTS: 'There is already an existing stream for that user.',
  VOICE_JOIN_CHANNEL: (full = false) =>
    `You do not have permission to join this voice channel${full ? '; it is full.' : '.'}`,
  VOICE_CONNECTION_TIMEOUT: 'Connection not established within 15 seconds.',
  VOICE_TOKEN_ABSENT: 'Token not provided from voice server packet.',
  VOICE_SESSION_ABSENT: 'Session ID not supplied.',
  VOICE_INVALID_ENDPOINT: 'Invalid endpoint received.',
  VOICE_NO_BROWSER: 'Voice connections are not available in browsers.',
  VOICE_CONNECTION_ATTEMPTS_EXCEEDED: attempts => `Too many connection attempts (${attempts}).`,
  VOICE_JOIN_SOCKET_CLOSED: 'Tried to send join packet, but the WebSocket is not open.',

  OPUS_ENGINE_MISSING: 'Couldn\'t find an Opus engine.',

  UDP_SEND_FAIL: 'Tried to send a UDP packet, but there is no socket available.',
  UDP_ADDRESS_MALFORMED: 'Malformed UDP address or port.',
  UDP_CONNECTION_EXISTS: 'There is already an existing UDP connection.',

  REQ_BODY_TYPE: 'The response body isn\'t a Buffer.',
  REQ_RESOURCE_TYPE: 'The resource must be a string or Buffer.',

  IMAGE_FORMAT: format => `Invalid image format: ${format}`,
  IMAGE_SIZE: size => `Invalid image size: ${size}`,

  MESSAGE_MISSING: 'Message not found',
  MESSAGE_BULK_DELETE_TYPE: 'The messages must be an Array, Collection, or number.',
  MESSAGE_NONCE_TYPE: 'Message nonce must fit in an unsigned 64-bit integer.',

  TYPING_COUNT: 'Count must be at least 1',

  SPLIT_MAX_LEN: 'Message exceeds the max length and contains no split characters.',

  BAN_RESOLVE_ID: (ban = false) => `Couldn't resolve the user ID to ${ban ? 'ban' : 'unban'}.`,

  PRUNE_DAYS_TYPE: 'Days must be a number',

  SEARCH_CHANNEL_TYPE: 'Target must be a TextChannel, DMChannel, GroupDMChannel, or Guild.',

  MESSAGE_SPLIT_MISSING: 'Message exceeds the max length and contains no split characters.',

  GUILD_CHANNEL_RESOLVE: 'Could not resolve channel to a guild channel.',
  GUILD_OWNED: 'Guild is owned by the client.',
  GUILD_RESTRICTED: (state = false) => `Guild is ${state ? 'already' : 'not'} restricted.`,
  GUILD_MEMBERS_TIMEOUT: 'Members didn\'t arrive in time.',

  INVALID_TYPE: (name, expected, an = false) => `Supplied ${name} is not a${an ? 'n' : ''} ${expected}.`,


  WEBHOOK_MESSAGE: 'The message was not sent by a webhook.',

  EMOJI_TYPE: 'Emoji must be a string or Emoji/ReactionEmoji',

  REACTION_RESOLVE_USER: 'Couldn\'t resolve the user ID to remove from the reaction.',
};

for (const [name, message] of Object.entries(Messages)) register(name, message);
