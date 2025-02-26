'use strict';

const { lazy } = require('@discordjs/util');
const { ChannelType } = require('discord-api-types/v10');

const getCategoryChannel = lazy(() => require('../structures/CategoryChannel.js').CategoryChannel);
const getDMChannel = lazy(() => require('../structures/DMChannel.js').DMChannel);
const getAnnouncementChannel = lazy(() => require('../structures/AnnouncementChannel.js').AnnouncementChannel);
const getStageChannel = lazy(() => require('../structures/StageChannel.js').StageChannel);
const getTextChannel = lazy(() => require('../structures/TextChannel.js').TextChannel);
const getThreadChannel = lazy(() => require('../structures/ThreadChannel.js').ThreadChannel);
const getVoiceChannel = lazy(() => require('../structures/VoiceChannel.js').VoiceChannel);
const getDirectoryChannel = lazy(() => require('../structures/DirectoryChannel.js').DirectoryChannel);
const getPartialGroupDMChannel = lazy(() => require('../structures/PartialGroupDMChannel.js').PartialGroupDMChannel);
const getForumChannel = lazy(() => require('../structures/ForumChannel.js').ForumChannel);
const getMediaChannel = lazy(() => require('../structures/MediaChannel.js').MediaChannel);

/**
 * Extra options for creating a channel.
 * @typedef {Object} CreateChannelOptions
 * @property {boolean} [allowFromUnknownGuild] Whether to allow creating a channel from an unknown guild
 * @private
 */

/**
 * Creates a discord.js channel from data received from the API.
 * @param {Client} client The client
 * @param {APIChannel} data The data of the channel to create
 * @param {Guild} [guild] The guild where this channel belongs
 * @param {CreateChannelOptions} [extras] Extra information to supply for creating this channel
 * @returns {BaseChannel} Any kind of channel.
 * @ignore
 */
function createChannel(client, data, guild, { allowUnknownGuild } = {}) {
  let channel;
  let resolvedGuild = guild || client.guilds.cache.get(data.guild_id);

  if (!data.guild_id && !resolvedGuild) {
    if ((data.recipients && data.type !== ChannelType.GroupDM) || data.type === ChannelType.DM) {
      channel = new (getDMChannel())(client, data);
    } else if (data.type === ChannelType.GroupDM) {
      channel = new (getPartialGroupDMChannel())(client, data);
    }
  } else if (resolvedGuild || allowUnknownGuild) {
    switch (data.type) {
      case ChannelType.GuildText: {
        channel = new (getTextChannel())(resolvedGuild, data, client);
        break;
      }
      case ChannelType.GuildVoice: {
        channel = new (getVoiceChannel())(resolvedGuild, data, client);
        break;
      }
      case ChannelType.GuildCategory: {
        channel = new (getCategoryChannel())(resolvedGuild, data, client);
        break;
      }
      case ChannelType.GuildAnnouncement: {
        channel = new (getAnnouncementChannel())(resolvedGuild, data, client);
        break;
      }
      case ChannelType.GuildStageVoice: {
        channel = new (getStageChannel())(resolvedGuild, data, client);
        break;
      }
      case ChannelType.AnnouncementThread:
      case ChannelType.PublicThread:
      case ChannelType.PrivateThread: {
        channel = new (getThreadChannel())(resolvedGuild, data, client);
        if (!allowUnknownGuild) channel.parent?.threads.cache.set(channel.id, channel);
        break;
      }
      case ChannelType.GuildDirectory:
        channel = new (getDirectoryChannel())(resolvedGuild, data, client);
        break;
      case ChannelType.GuildForum:
        channel = new (getForumChannel())(resolvedGuild, data, client);
        break;
      case ChannelType.GuildMedia:
        channel = new (getMediaChannel())(resolvedGuild, data, client);
        break;
    }
    if (channel && !allowUnknownGuild) resolvedGuild.channels?.cache.set(channel.id, channel);
  }
  return channel;
}

/**
 * Transforms an API guild forum tag to camel-cased guild forum tag.
 * @param {APIGuildForumTag} tag The tag to transform
 * @returns {GuildForumTag}
 * @ignore
 */
function transformAPIGuildForumTag(tag) {
  return {
    id: tag.id,
    name: tag.name,
    moderated: tag.moderated,
    emoji:
      (tag.emoji_id ?? tag.emoji_name)
        ? {
            id: tag.emoji_id,
            name: tag.emoji_name,
          }
        : null,
  };
}

/**
 * Transforms a camel-cased guild forum tag to an API guild forum tag.
 * @param {GuildForumTag} tag The tag to transform
 * @returns {APIGuildForumTag}
 * @ignore
 */
function transformGuildForumTag(tag) {
  return {
    id: tag.id,
    name: tag.name,
    moderated: tag.moderated,
    emoji_id: tag.emoji?.id ?? null,
    emoji_name: tag.emoji?.name ?? null,
  };
}

/**
 * Transforms an API guild forum default reaction object to a
 * camel-cased guild forum default reaction object.
 * @param {APIGuildForumDefaultReactionEmoji} defaultReaction The default reaction to transform
 * @returns {DefaultReactionEmoji}
 * @ignore
 */
function transformAPIGuildDefaultReaction(defaultReaction) {
  return {
    id: defaultReaction.emoji_id,
    name: defaultReaction.emoji_name,
  };
}

/**
 * Transforms a camel-cased guild forum default reaction object to an
 * API guild forum default reaction object.
 * @param {DefaultReactionEmoji} defaultReaction The default reaction to transform
 * @returns {APIGuildForumDefaultReactionEmoji}
 * @ignore
 */
function transformGuildDefaultReaction(defaultReaction) {
  return {
    emoji_id: defaultReaction.id,
    emoji_name: defaultReaction.name,
  };
}

exports.createChannel = createChannel;
exports.transformAPIGuildForumTag = transformAPIGuildForumTag;
exports.transformGuildForumTag = transformGuildForumTag;
exports.transformAPIGuildDefaultReaction = transformAPIGuildDefaultReaction;
exports.transformGuildDefaultReaction = transformGuildDefaultReaction;
