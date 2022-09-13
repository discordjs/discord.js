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
const getForumChannel = lazy(() => require('../structures/GuildForumChannel'));

/**
 * Creates a discord.js channel from data received from the API.
 * @param {Client} client The client
 * @param {APIChannel} data The data of the channel to create
 * @param {Guild} [guild] The guild where this channel belongs
 * @param {Object} [extras] Extra information to supply for creating this channel
 * @returns {Channel} Any kind of channel.
 * @ignore
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
        case ChannelType.GuildAnnouncement: {
          channel = new (getNewsChannel())(guild, data, client);
          break;
        }
        case ChannelType.GuildStageVoice: {
          channel = new (getStageChannel())(guild, data, client);
          break;
        }
        case ChannelType.AnnouncementThread:
        case ChannelType.PublicThread:
        case ChannelType.PrivateThread: {
          channel = new (getThreadChannel())(guild, data, client, fromInteraction);
          if (!allowUnknownGuild) channel.parent?.threads.cache.set(channel.id, channel);
          break;
        }
        case ChannelType.GuildDirectory:
          channel = new (getDirectoryChannel())(guild, data, client);
          break;
        case ChannelType.GuildForum:
          channel = new (getForumChannel())(guild, data, client);
          break;
      }
      if (channel && !allowUnknownGuild) guild.channels?.cache.set(channel.id, channel);
    }
  }
  return channel;
}

/**
 * Transforms an API guild forum tag to camel-cased guild forum tag.
 * @param {GuildForumTag} tag The tag to transform
 * @returns {GuildForumTag}
 */
function transformGuildForumTag(tag) {
  return {
    id: tag.id,
    name: tag.name,
    moderated: tag.moderated,
    emojiId: tag.emoji_id,
    emojiName: tag.emoji_name,
  };
}

/**
 * Transforms an API guild forum default reaction object to a
 * camel-cased guild forum default reaction object.
 * @param {APIDefaultReaction} defaultReaction The default reaction to transform
 * @returns {DefaultReaction}
 */
function transformGuildDefaultReaction(defaultReaction) {
  return {
    emojiId: defaultReaction.emoji_id,
    emojiName: defaultReaction.emoji_name,
  };
}

module.exports = {
  transformGuildDefaultReaction,
  transformGuildForumTag,
  createChannel,
};
