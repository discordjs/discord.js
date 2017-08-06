const path = require('path');
const fs = require('fs');
const snekfetch = require('snekfetch');

const Util = require('../util/Util');
const User = require('../structures/User');
const Message = require('../structures/Message');
const Guild = require('../structures/Guild');
const Channel = require('../structures/Channel');
const GuildMember = require('../structures/GuildMember');
const Emoji = require('../structures/Emoji');
const ReactionEmoji = require('../structures/ReactionEmoji');
const { Error, TypeError } = require('../errors');

/**
 * The DataResolver identifies different objects and tries to resolve a specific piece of information from them, e.g.
 * extracting a User from a Message object.
 * @private
 */
class ClientDataResolver {
  /**
   * @param {Client} client The client the resolver is for
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Data that resolves to give a User object. This can be:
   * * A User object
   * * A user ID
   * * A Message object (resolves to the message author)
   * * A Guild object (owner of the guild)
   * * A GuildMember object
   * @typedef {User|Snowflake|Message|Guild|GuildMember} UserResolvable
   */

  /**
   * Resolves a UserResolvable to a User object.
   * @param {UserResolvable} user The UserResolvable to identify
   * @returns {?User}
   */
  resolveUser(user) {
    if (user instanceof User) return user;
    if (typeof user === 'string') return this.client.users.get(user) || null;
    if (user instanceof GuildMember) return user.user;
    if (user instanceof Message) return user.author;
    if (user instanceof Guild) return user.owner;
    return null;
  }

  /**
   * Resolves a UserResolvable to a user ID string.
   * @param {UserResolvable} user The UserResolvable to identify
   * @returns {?Snowflake}
   */
  resolveUserID(user) {
    if (user instanceof User || user instanceof GuildMember) return user.id;
    if (typeof user === 'string') return user || null;
    if (user instanceof Message) return user.author.id;
    if (user instanceof Guild) return user.ownerID;
    return null;
  }

  /**
   * Data that resolves to give a Guild object. This can be:
   * * A Guild object
   * * A Guild ID
   * @typedef {Guild|Snowflake} GuildResolvable
   */

  /**
   * Resolves a GuildResolvable to a Guild object.
   * @param {GuildResolvable} guild The GuildResolvable to identify
   * @returns {?Guild}
   */
  resolveGuild(guild) {
    if (guild instanceof Guild) return guild;
    if (typeof guild === 'string') return this.client.guilds.get(guild) || null;
    return null;
  }

  /**
   * Data that resolves to give a GuildMember object. This can be:
   * * A GuildMember object
   * * A User object
   * @typedef {GuildMember|User} GuildMemberResolvable
   */

  /**
   * Resolves a GuildMemberResolvable to a GuildMember object.
   * @param {GuildResolvable} guild The guild that the member is part of
   * @param {UserResolvable} user The user that is part of the guild
   * @returns {?GuildMember}
   */
  resolveGuildMember(guild, user) {
    if (user instanceof GuildMember) return user;
    guild = this.resolveGuild(guild);
    user = this.resolveUser(user);
    if (!guild || !user) return null;
    return guild.members.get(user.id) || null;
  }

  /**
   * Data that can be resolved to give a Channel object. This can be:
   * * A Channel object
   * * A Message object (the channel the message was sent in)
   * * A Guild object (the #general channel)
   * * A channel ID
   * @typedef {Channel|Guild|Message|Snowflake} ChannelResolvable
   */

  /**
   * Resolves a ChannelResolvable to a Channel object.
   * @param {ChannelResolvable} channel The channel resolvable to resolve
   * @returns {?Channel}
   */
  resolveChannel(channel) {
    if (channel instanceof Channel) return channel;
    if (typeof channel === 'string') return this.client.channels.get(channel) || null;
    if (channel instanceof Message) return channel.channel;
    if (channel instanceof Guild) return channel.channels.get(channel.id) || null;
    return null;
  }

  /**
   * Resolves a ChannelResolvable to a channel ID.
   * @param {ChannelResolvable} channel The channel resolvable to resolve
   * @returns {?Snowflake}
   */
  resolveChannelID(channel) {
    if (channel instanceof Channel) return channel.id;
    if (typeof channel === 'string') return channel;
    if (channel instanceof Message) return channel.channel.id;
    if (channel instanceof Guild) return channel.defaultChannel.id;
    return null;
  }

  /**
   * Data that can be resolved to give an invite code. This can be:
   * * An invite code
   * * An invite URL
   * @typedef {string} InviteResolvable
   */

  /**
   * Resolves InviteResolvable to an invite code.
   * @param {InviteResolvable} data The invite resolvable to resolve
   * @returns {string}
   */
  resolveInviteCode(data) {
    const inviteRegex = /discord(?:app\.com\/invite|\.gg)\/([\w-]{2,255})/i;
    const match = inviteRegex.exec(data);
    if (match && match[1]) return match[1];
    return data;
  }

  /**
   * Data that resolves to give a Base64 string, typically for image uploading. This can be:
   * * A Buffer
   * * A base64 string
   * @typedef {Buffer|string} Base64Resolvable
   */

  /**
   * Resolves a Base64Resolvable to a Base 64 image.
   * @param {Base64Resolvable} data The base 64 resolvable you want to resolve
   * @returns {?string}
   */
  resolveBase64(data) {
    if (data instanceof Buffer) return `data:image/jpg;base64,${data.toString('base64')}`;
    return data;
  }

  /**
   * Data that can be resolved to give a Buffer. This can be:
   * * A Buffer
   * * The path to a local file
   * * A URL
   * @typedef {string|Buffer} BufferResolvable
   */

  /**
   * Resolves a BufferResolvable to a Buffer.
   * @param {BufferResolvable} resource The buffer resolvable to resolve
   * @returns {Promise<Buffer>}
   */
  resolveBuffer(resource) {
    if (resource instanceof Buffer) return Promise.resolve(resource);
    if (this.client.browser && resource instanceof ArrayBuffer) return Promise.resolve(Util.convertToBuffer(resource));

    if (typeof resource === 'string') {
      return new Promise((resolve, reject) => {
        if (/^https?:\/\//.test(resource)) {
          snekfetch.get(resource)
            .end((err, res) => {
              if (err) return reject(err);
              if (!(res.body instanceof Buffer)) return reject(new TypeError('REQ_BODY_TYPE'));
              return resolve(res.body);
            });
        } else {
          const file = path.resolve(resource);
          fs.stat(file, (err, stats) => {
            if (err) return reject(err);
            if (!stats || !stats.isFile()) return reject(new Error('FILE_NOT_FOUND', file));
            fs.readFile(file, (err2, data) => {
              if (err2) reject(err2); else resolve(data);
            });
            return null;
          });
        }
      });
    }

    return Promise.reject(new TypeError('REQ_RESOURCE_TYPE'));
  }

  /**
   * Converts a Stream to a Buffer.
   * @param {Stream} resource The stream to convert
   * @returns {Promise<Buffer>}
   */
  resolveFile(resource) {
    return resource ? this.resolveBuffer(resource)
      .catch(() => {
        if (resource.pipe && typeof resource.pipe === 'function') {
          return new Promise((resolve, reject) => {
            const buffers = [];
            resource.once('error', reject);
            resource.on('data', data => buffers.push(data));
            resource.once('end', () => resolve(Buffer.concat(buffers)));
          });
        } else {
          throw new TypeError('REQ_RESOURCE_TYPE');
        }
      }) :
      Promise.reject(new TypeError('REQ_RESOURCE_TYPE'));
  }

  /**
   * Data that can be resolved to give an emoji identifier. This can be:
   * * The unicode representation of an emoji
   * * A custom emoji ID
   * * An Emoji object
   * * A ReactionEmoji object
   * @typedef {string|Emoji|ReactionEmoji} EmojiIdentifierResolvable
   */

  /**
   * Resolves an EmojiResolvable to an emoji identifier.
   * @param {EmojiIdentifierResolvable} emoji The emoji resolvable to resolve
   * @returns {?string}
   */
  resolveEmojiIdentifier(emoji) {
    if (emoji instanceof Emoji || emoji instanceof ReactionEmoji) return emoji.identifier;
    if (typeof emoji === 'string') {
      if (this.client.emojis.has(emoji)) return this.client.emojis.get(emoji).identifier;
      else if (!emoji.includes('%')) return encodeURIComponent(emoji);
      else return emoji;
    }
    return null;
  }
}

module.exports = ClientDataResolver;
