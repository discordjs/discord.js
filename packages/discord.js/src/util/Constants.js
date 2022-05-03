'use strict';

const process = require('node:process');
const { ChannelType, MessageType } = require('discord-api-types/v10');
const Package = (exports.Package = require('../../package.json'));

exports.UserAgent = `DiscordBot (${Package.homepage}, ${Package.version}) Node.js/${process.version}`;

/**
 * The name of an item to be swept in Sweepers
 * * `applicationCommands` - both global and guild commands
 * * `bans`
 * * `emojis`
 * * `invites` - accepts the `lifetime` property, using it will sweep based on expires timestamp
 * * `guildMembers`
 * * `messages` - accepts the `lifetime` property, using it will sweep based on edited or created timestamp
 * * `presences`
 * * `reactions`
 * * `stageInstances`
 * * `stickers`
 * * `threadMembers`
 * * `threads` - accepts the `lifetime` property, using it will sweep archived threads based on archived timestamp
 * * `users`
 * * `voiceStates`
 * @typedef {string} SweeperKey
 */
exports.SweeperKeys = [
  'applicationCommands',
  'bans',
  'emojis',
  'invites',
  'guildMembers',
  'messages',
  'presences',
  'reactions',
  'stageInstances',
  'stickers',
  'threadMembers',
  'threads',
  'users',
  'voiceStates',
];

/**
 * The types of messages that are not `System`. The available types are:
 * * {@link MessageType.Default}
 * * {@link MessageType.Reply}
 * * {@link MessageType.ChatInputCommand}
 * * {@link MessageType.ContextMenuCommand}
 * @typedef {MessageType[]} NonSystemMessageTypes
 */
exports.NonSystemMessageTypes = [
  MessageType.Default,
  MessageType.Reply,
  MessageType.ChatInputCommand,
  MessageType.ContextMenuCommand,
];

/**
 * The channels that are text-based.
 * * DMChannel
 * * TextChannel
 * * NewsChannel
 * * ThreadChannel
 * * VoiceChannel
 * @typedef {DMChannel|TextChannel|NewsChannel|ThreadChannel|VoiceChannel} TextBasedChannels
 */

/**
 * Data that resolves to give a text-based channel. This can be:
 * * A text-based channel
 * * A snowflake
 * @typedef {TextBasedChannels|Snowflake} TextBasedChannelsResolvable
 */

/**
 * The types of channels that are text-based. The available types are:
 * * {@link ChannelType.DM}
 * * {@link ChannelType.GuildText}
 * * {@link ChannelType.GuildNews}
 * * {@link ChannelType.GuildNewsThread}
 * * {@link ChannelType.GuildPublicThread}
 * * {@link ChannelType.GuildPrivateThread}
 * * {@link ChannelType.GuildVoice}
 * @typedef {ChannelType} TextBasedChannelTypes
 */
exports.TextBasedChannelTypes = [
  ChannelType.DM,
  ChannelType.GuildText,
  ChannelType.GuildNews,
  ChannelType.GuildNewsThread,
  ChannelType.GuildPublicThread,
  ChannelType.GuildPrivateThread,
  ChannelType.GuildVoice,
];

/**
 * The types of channels that are threads. The available types are:
 * * {@link ChannelType.GuildNewsThread}
 * * {@link ChannelType.GuildPublicThread}
 * * {@link ChannelType.GuildPrivateThread}
 * @typedef {ChannelType[]} ThreadChannelTypes
 */
exports.ThreadChannelTypes = [
  ChannelType.GuildNewsThread,
  ChannelType.GuildPublicThread,
  ChannelType.GuildPrivateThread,
];

/**
 * The types of channels that are voice-based. The available types are:
 * * {@link ChannelType.GuildVoice}
 * * {@link ChannelType.GuildStageVoice}
 * @typedef {ChannelType[]} VoiceBasedChannelTypes
 */
exports.VoiceBasedChannelTypes = [ChannelType.GuildVoice, ChannelType.GuildStageVoice];

/* eslint-enable max-len */

/**
 * @typedef {Object} Constants Constants that can be used in an enum or object-like way.
 * @property {Status} Status The available statuses of the client.
 */
