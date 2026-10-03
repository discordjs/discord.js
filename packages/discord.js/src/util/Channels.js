import { ChannelType } from 'discord-api-types/v10';
import { AnnouncementChannel } from '../structures/AnnouncementChannel.js';
import { CategoryChannel } from '../structures/CategoryChannel.js';
import { DMChannel } from '../structures/DMChannel.js';
import { DirectoryChannel } from '../structures/DirectoryChannel.js';
import { ForumChannel } from '../structures/ForumChannel.js';
import { MediaChannel } from '../structures/MediaChannel.js';
import { PartialGroupDMChannel } from '../structures/PartialGroupDMChannel.js';
import { StageChannel } from '../structures/StageChannel.js';
import { TextChannel } from '../structures/TextChannel.js';
import { ThreadChannel } from '../structures/ThreadChannel.js';
import { VoiceChannel } from '../structures/VoiceChannel.js';

/**
 * Extra options for creating a channel.
 *
 * @typedef {Object} CreateChannelOptions
 * @property {boolean} [allowFromUnknownGuild] Whether to allow creating a channel from an unknown guild
 * @private
 */

/**
 * Creates a discord.js channel from data received from the API.
 *
 * @param {Client} client The client
 * @param {APIChannel} data The data of the channel to create
 * @param {Guild} [guild] The guild where this channel belongs
 * @param {CreateChannelOptions} [extras] Extra information to supply for creating this channel
 * @returns {BaseChannel} Any kind of channel.
 * @ignore
 */
export function createChannel(client, data, guild, { allowUnknownGuild } = {}) {
  let channel;
  const resolvedGuild = guild ?? client.guilds.cache.get(data.guild_id);

  if (!data.guild_id && !resolvedGuild) {
    if ((data.recipients && data.type !== ChannelType.GroupDM) || data.type === ChannelType.DM) {
      channel = new DMChannel(client, data);
    } else if (data.type === ChannelType.GroupDM) {
      channel = new PartialGroupDMChannel(client, data);
    }
  } else if (resolvedGuild || allowUnknownGuild) {
    switch (data.type) {
      case ChannelType.GuildText: {
        channel = new TextChannel(resolvedGuild, data, client);
        break;
      }

      case ChannelType.GuildVoice: {
        channel = new VoiceChannel(resolvedGuild, data, client);
        break;
      }

      case ChannelType.GuildCategory: {
        channel = new CategoryChannel(resolvedGuild, data, client);
        break;
      }

      case ChannelType.GuildAnnouncement: {
        channel = new AnnouncementChannel(resolvedGuild, data, client);
        break;
      }

      case ChannelType.GuildStageVoice: {
        channel = new StageChannel(resolvedGuild, data, client);
        break;
      }

      case ChannelType.AnnouncementThread:
      case ChannelType.PublicThread:
      case ChannelType.PrivateThread: {
        channel = new ThreadChannel(resolvedGuild, data, client);
        if (!allowUnknownGuild) channel.parent?.threads.cache.set(channel.id, channel);
        break;
      }

      case ChannelType.GuildDirectory:
        channel = new DirectoryChannel(resolvedGuild, data, client);
        break;
      case ChannelType.GuildForum:
        channel = new ForumChannel(resolvedGuild, data, client);
        break;
      case ChannelType.GuildMedia:
        channel = new MediaChannel(resolvedGuild, data, client);
        break;
      default:
        break;
    }

    if (channel && !allowUnknownGuild) resolvedGuild.channels?.cache.set(channel.id, channel);
  }

  return channel;
}

/**
 * Transforms an API guild forum tag to camel-cased guild forum tag.
 *
 * @param {APIGuildForumTag} tag The tag to transform
 * @returns {GuildForumTag}
 * @ignore
 */
export function transformAPIGuildForumTag(tag) {
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
 *
 * @param {GuildForumTag} tag The tag to transform
 * @returns {APIGuildForumTag}
 * @ignore
 */
export function transformGuildForumTag(tag) {
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
 *
 * @param {APIGuildForumDefaultReactionEmoji} defaultReaction The default reaction to transform
 * @returns {DefaultReactionEmoji}
 * @ignore
 */
export function transformAPIGuildDefaultReaction(defaultReaction) {
  return {
    id: defaultReaction.emoji_id,
    name: defaultReaction.emoji_name,
  };
}

/**
 * Transforms a camel-cased guild forum default reaction object to an
 * API guild forum default reaction object.
 *
 * @param {DefaultReactionEmoji} defaultReaction The default reaction to transform
 * @returns {APIGuildForumDefaultReactionEmoji}
 * @ignore
 */
export function transformGuildDefaultReaction(defaultReaction) {
  return {
    emoji_id: defaultReaction.id,
    emoji_name: defaultReaction.name,
  };
}
