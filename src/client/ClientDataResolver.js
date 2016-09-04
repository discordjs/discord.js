const path = require('path');
const fs = require('fs');
const request = require('superagent');

const Constants = require('../util/Constants');
const User = require(`../structures/User`);
const Message = require(`../structures/Message`);
const Guild = require(`../structures/Guild`);
const Channel = require(`../structures/Channel`);
const GuildMember = require(`../structures/GuildMember`);

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
   * * A User ID
   * * A Message (resolves to the message author)
   * * A Guild (owner of the guild)
   * * A Guild Member
   * @typedef {User|string|Message|Guild|GuildMember} UserResolvable
   */

  /**
   * Resolves a UserResolvable to a User object
   * @param {UserResolvable} user The UserResolvable to identify
   * @returns {?User}
   */
  resolveUser(user) {
    if (user instanceof User) {
      return user;
    } else if (typeof user === 'string') {
      return this.client.users.get(user);
    } else if (user instanceof Message) {
      return user.author;
    } else if (user instanceof Guild) {
      return user.owner;
    } else if (user instanceof GuildMember) {
      return user.user;
    }

    return null;
  }

  /**
   * Data that resolves to give a Guild object. This can be:
   * * A Guild object
   * @typedef {Guild} GuildResolvable
   */

  /**
   * Resolves a GuildResolvable to a Guild object
   * @param {GuildResolvable} guild The GuildResolvable to identify
   * @returns {?Guild}
   */
  resolveGuild(guild) {
    if (guild instanceof Guild) return guild;
    if (typeof guild === 'string') return this.client.guilds.get(guild);
    return null;
  }

  /**
   * Data that resolves to give a GuildMember object. This can be:
   * * A GuildMember object
   * * A User object
   * @typedef {Guild} GuildMemberResolvable
   */

  /**
   * Resolves a GuildMemberResolvable to a GuildMember object
   * @param {GuildResolvable} guild The guild that the member is part of
   * @param {UserResolvable} user The user that is part of the guild
   * @returns {?GuildMember}
   */
  resolveGuildMember(guild, user) {
    if (user instanceof GuildMember) return user;

    guild = this.resolveGuild(guild);
    user = this.resolveUser(user);
    if (!guild || !user) return null;

    return guild.members.get(user.id);
  }

  /**
   * Data that resolves to give a Base64 string, typically for image uploading. This can be:
   * * A Buffer
   * * A Base64 string
   * @typedef {Buffer|string} Base64Resolvable
   */

  /**
   * Resolves a Base64Resolvable to a Base 64 image
   * @param {Base64Resolvable} data The base 64 resolvable you want to resolve
   * @returns {?string}
   */
  resolveBase64(data) {
    if (data instanceof Buffer) return `data:image/jpg;base64,${data.toString('base64')}`;
    return data;
  }

  /**
   * Data that can be resolved to give a Channel. This can be:
   * * An instance of a Channel
   * * An ID of a Channel
   * @typedef {Channel|string} ChannelResolvable
   */

  /**
   * Resolves a ChannelResolvable to a Channel object
   * @param {ChannelResolvable} channel The channel resolvable to resolve
   * @returns {?Channel}
   */
  resolveChannel(channel) {
    if (channel instanceof Channel) return channel;
    if (typeof channel === 'string') return this.client.channels.get(channel.id);
    return null;
  }

  /**
   * Data that can be resolved to give a permission number. This can be:
   * * A string
   * * A permission number
   * @typedef {string|number} PermissionResolvable
   */

  /**
   * Resolves a PermissionResolvable to a permission number
   * @param {PermissionResolvable} permission The permission resolvable to resolve
   * @returns {number}
   */
  resolvePermission(permission) {
    if (typeof permission === 'string') permission = Constants.PermissionFlags[permission];
    if (!permission) throw new Error(Constants.Errors.NOT_A_PERMISSION);
    return permission;
  }

  /**
   * Data that can be resolved to give a string. This can be:
   * * A string
   * * An Array (joined with a new line delimiter to give a string)
   * * Any value
   * @typedef {string|Array|*} StringResolvable
   */

  /**
   * Resolves a StringResolvable to a string
   * @param {StringResolvable} data The string resolvable to resolve
   * @returns {string}
   */
  resolveString(data) {
    if (typeof data === 'string') return data;
    if (data instanceof Array) return data.join('\n');
    return String(data);
  }

  /**
   * Data that can be resolved to give a Buffer. This can be:
   * * A Buffer
   * * The path to a local file
   * * A URL
   * @typedef {string|Buffer} FileResolvable
   */

  /**
   * Resolves a FileResolvable to a Buffer
   * @param {FileResolvable} resource The file resolvable to resolve
   * @returns {Promise<Buffer>}
   */
  resolveFile(resource) {
    if (typeof resource === 'string') {
      return new Promise((resolve, reject) => {
        if (/^https?:\/\//.test(resource)) {
          request.get(resource)
            .set('Content-Type', 'blob')
            .end((err, res) => err ? reject(err) : resolve(res.body));
        } else {
          const file = path.resolve(resource);
          fs.stat(file, (err, stats) => {
            if (err) reject(err);
            if (!stats.isFile()) throw new Error(`The file could not be found: ${file}`);
            fs.readFile(file, (err2, data) => {
              if (err2) reject(err2); else resolve(data);
            });
          });
        }
      });
    }

    if (resource instanceof Buffer) return Promise.resolve(resource);
    return Promise.reject(new TypeError('resource is not a string or Buffer'));
  }
}

module.exports = ClientDataResolver;
