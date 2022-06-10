'use strict';

const { ChannelType } = require('discord-api-types/v10');
const { lazy } = require('./Util');

const getCategoryChannel = lazy(() => require('../structures/CategoryChannel'));
const getDMChannel = lazy(() => require('../structures/DMChannel'));
const getNewsChannel = lazy(() => require('../structures/NewsChannel'));
const getStageChannel = lazy(() => require('../structures/StageChannel'));
const getTextChannel = lazy(() => require('../structures/TextChannel'));
const getThreadChannel = lazy(() => require('../structures/ThreadChannel'));
const getVoiceChannel = lazy(() => require('../structures/VoiceChannel'));
const getDirectoryChannel = lazy(() => require('../structures/DirectoryChannel'));
const getPartialGroupDMChannel = lazy(() => require('../structures/PartialGroupDMChannel'));

// eslint-disable-next-line valid-jsdoc
/**
 * @private
 */
function createChannel(client, data, guild, { allowUnknownGuild, fromInteraction } = {}) {
  let channel;
  if (!data.guild_id && !guild) {
    if ((data.recipients && data.type !== ChannelType.GroupDM) || data.type === ChannelType.DM) {
      channel = new (getDMChannel())(client, data);
    } else if (data.type === ChannelType.GroupDM) {
      channel = new (getPartialGroupDMChannel())(client, data);
    }
  } else {
    guild ??= client.guilds.cache.get(data.guild_id);

    if (guild || allowUnknownGuild) {
      switch (data.type) {
        case ChannelType.GuildText: {
          channel = new (getTextChannel())(guild, data, client);
          break;
        }
        case ChannelType.GuildVoice: {
          channel = new (getVoiceChannel())(guild, data, client);
          break;
        }
        case ChannelType.GuildCategory: {
          channel = new (getCategoryChannel())(guild, data, client);
          break;
        }
        case ChannelType.GuildNews: {
          channel = new (getNewsChannel())(guild, data, client);
          break;
        }
        case ChannelType.GuildStageVoice: {
          channel = new (getStageChannel())(guild, data, client);
          break;
        }
        case ChannelType.GuildNewsThread:
        case ChannelType.GuildPublicThread:
        case ChannelType.GuildPrivateThread: {
          channel = new (getThreadChannel())(guild, data, client, fromInteraction);
          if (!allowUnknownGuild) channel.parent?.threads.cache.set(channel.id, channel);
          break;
        }
        case ChannelType.GuildDirectory:
          channel = new (getDirectoryChannel())(guild, data, client);
          break;
      }
      if (channel && !allowUnknownGuild) guild.channels?.cache.set(channel.id, channel);
    }
  }
  return channel;
}

module.exports = {
  createChannel,
};
