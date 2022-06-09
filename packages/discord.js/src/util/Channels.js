'use strict';

const { ChannelType } = require('discord-api-types/v10');
const { ThreadChannelTypes } = require('../util/Constants');

let CategoryChannel;
let DMChannel;
let NewsChannel;
let StageChannel;
let TextChannel;
let ThreadChannel;
let VoiceChannel;
let DirectoryChannel;

/**
 * Indicates whether this channel is a {@link ThreadChannel}
 * @param {Channel} channel The channel to check against
 * @returns {boolean}
 */
function isThread(channel) {
  return ThreadChannelTypes.includes(channel.type);
}

/**
 * Indicates whether this channel is {@link TextBasedChannels text-based}.
 * @param {Channel} channel The channel to check against
 * @returns {boolean}
 */
function isTextBased(channel) {
  return 'messages' in channel;
}

/**
 * Indicates whether this channel is DM-based (either a {@link DMChannel} or a {@link PartialGroupDMChannel}).
 * @param {Channel} channel The channel to check against
 * @returns {boolean}
 */
function isDMBased(channel) {
  return [ChannelType.DM, ChannelType.GroupDM].includes(channel.type);
}

/**
 * Indicates whether this channel is {@link BaseGuildVoiceChannel voice-based}.
 * @param {Channel} channel The channel to check against
 * @returns {boolean}
 */
function isVoiceBased(channel) {
  return 'bitrate' in channel;
}

// eslint-disable-next-line valid-jsdoc
/**
 * @private
 */
function createChannel(client, data, guild, { allowUnknownGuild, fromInteraction } = {}) {
  CategoryChannel ??= require('./CategoryChannel');
  DMChannel ??= require('./DMChannel');
  NewsChannel ??= require('./NewsChannel');
  StageChannel ??= require('./StageChannel');
  TextChannel ??= require('./TextChannel');
  ThreadChannel ??= require('./ThreadChannel');
  VoiceChannel ??= require('./VoiceChannel');
  DirectoryChannel ??= require('./DirectoryChannel');

  let channel;
  if (!data.guild_id && !guild) {
    if ((data.recipients && data.type !== ChannelType.GroupDM) || data.type === ChannelType.DM) {
      channel = new DMChannel(client, data);
    } else if (data.type === ChannelType.GroupDM) {
      const PartialGroupDMChannel = require('./PartialGroupDMChannel');
      channel = new PartialGroupDMChannel(client, data);
    }
  } else {
    guild ??= client.guilds.cache.get(data.guild_id);

    if (guild || allowUnknownGuild) {
      switch (data.type) {
        case ChannelType.GuildText: {
          channel = new TextChannel(guild, data, client);
          break;
        }
        case ChannelType.GuildVoice: {
          channel = new VoiceChannel(guild, data, client);
          break;
        }
        case ChannelType.GuildCategory: {
          channel = new CategoryChannel(guild, data, client);
          break;
        }
        case ChannelType.GuildNews: {
          channel = new NewsChannel(guild, data, client);
          break;
        }
        case ChannelType.GuildStageVoice: {
          channel = new StageChannel(guild, data, client);
          break;
        }
        case ChannelType.GuildNewsThread:
        case ChannelType.GuildPublicThread:
        case ChannelType.GuildPrivateThread: {
          channel = new ThreadChannel(guild, data, client, fromInteraction);
          if (!allowUnknownGuild) channel.parent?.threads.cache.set(channel.id, channel);
          break;
        }
        case ChannelType.GuildDirectory:
          channel = new DirectoryChannel(guild, data, client);
          break;
      }
      if (channel && !allowUnknownGuild) guild.channels?.cache.set(channel.id, channel);
    }
  }
  return channel;
}

module.exports = {
  isThread,
  isTextBased,
  isDMBased,
  isVoiceBased,
  createChannel,
};
