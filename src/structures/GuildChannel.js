const Channel = require('./Channel');
const Role = require('./Role');
const PermissionOverwrites = require('./PermissionOverwrites');
const EvaluatedPermissions = require('./EvaluatedPermissions');
const Constants = require('../util/Constants');
const Collection = require('../util/Collection');
const arraysEqual = require('../util/ArraysEqual');

/**
 * Represents a Guild Channel (i.e. Text Channels and Voice Channels)
 * @extends {Channel}
 */
class GuildChannel extends Channel {
  constructor(guild, data) {
    super(guild.client, data, guild);
  }

  setup(data) {
    super.setup(data);
    /**
     * The topic of the Guild Channel, if there is one.
     * @type {?string}
     */
    this.topic = data.topic;
    /**
     * The position of the channel in the list.
     * @type {number}
     */
    this.position = data.position;
    /**
     * The name of the Guild Channel
     * @type {string}
     */
    this.name = data.name;
    this.ow = data.permission_overwrites;
    /**
     * A map of permission overwrites in this channel for roles and users.
     * @type {Collection<string, PermissionOverwrites>}
     */
    this.permissionOverwrites = new Collection();
    if (data.permission_overwrites) {
      for (const overwrite of data.permission_overwrites) {
        this.permissionOverwrites.set(overwrite.id, new PermissionOverwrites(this, overwrite));
      }
    }
  }

  /**
   * Checks if this channel has the same type, topic, position, name, overwrites and ID as another channel.
   * In most cases, a simple `channel.id === channel2.id` will do, and is much faster too.
   * @param {GuildChannel} channel The channel to compare this channel to
   * @returns {boolean}
   */
  equals(channel) {
    let equal = channel &&
      this.type === channel.type &&
      this.topic === channel.topic &&
      this.position === channel.position &&
      this.name === channel.name &&
      this.id === channel.id;

    if (equal) {
      if (channel.permission_overwrites) {
        const thisIDSet = Array.from(this.permissionOverwrites.keys());
        const otherIDSet = channel.permission_overwrites.map(overwrite => overwrite.id);
        equal = arraysEqual(thisIDSet, otherIDSet);
      } else {
        equal = false;
      }
    }

    return equal;
  }

  /**
   * Gets the overall set of permissions for a user in this channel, taking into account roles and permission
   * overwrites.
   * @param {GuildMemberResolvable} member The user that you want to obtain the overall permissions for
   * @returns {?EvaluatedPermissions}
   */
  permissionsFor(member) {
    member = this.client.resolver.resolveGuildMember(this.guild, member);
    if (member) {
      if (this.guild.owner.id === member.id) return new EvaluatedPermissions(member, Constants.ALL_PERMISSIONS);

      const roles = member.roles;
      let permissions = 0;
      const overwrites = this.overwritesFor(member, true);

      for (const role of roles.values()) permissions |= role.permissions;
      for (const overwrite of overwrites.role.concat(overwrites.member)) {
        permissions &= ~overwrite.denyData;
        permissions |= overwrite.allowData;
      }

      const admin = Boolean(permissions & (Constants.PermissionFlags.ADMINISTRATOR));
      if (admin) permissions = Constants.ALL_PERMISSIONS;

      return new EvaluatedPermissions(member, permissions);
    }

    return null;
  }

  overwritesFor(member, verified) {
    // for speed
    if (!verified) member = this.client.resolver.resolveGuildMember(this.guild, member);
    if (member) {
      const memberRoles = member._roles;

      const roleOverwrites = [];
      const memberOverwrites = [];

      for (const overwrite of this.permissionOverwrites.values()) {
        if (overwrite.id === member.id) {
          memberOverwrites.push(overwrite);
        } else if (memberRoles.indexOf(overwrite.id) > -1) {
          roleOverwrites.push(overwrite);
        }
      }

      return {
        role: roleOverwrites,
        member: memberOverwrites,
      };
    }

    return [];
  }

  /**
   * An object mapping permission flags to `true` (enabled) or `false` (disabled)
   * ```js
   * {
   *  'SEND_MESSAGES': true,
   *  'ATTACH_FILES': false,
   * }
   * ```
   * @typedef {Object} PermissionOverwriteOptions
   */

  /**
   * Overwrites the permissions for a user or role in this channel.
   * @param {Role|UserResolvable} userOrRole The user or role to update
   * @param {PermissionOverwriteOptions} options The configuration for the update
   * @returns {Promise}
   * @example
   * // overwrite permissions for a message author
   * message.channel.overwritePermissions(message.author, {
   *  SEND_MESSAGES: false
   * })
   * .then(() => console.log('Done!'))
   * .catch(console.log);
   */
  overwritePermissions(userOrRole, options) {
    const payload = {
      allow: 0,
      deny: 0,
    };

    if (userOrRole instanceof Role) {
      payload.type = 'role';
    } else {
      userOrRole = this.client.resolver.resolveUser(userOrRole);
      payload.type = 'member';
      if (!userOrRole) return Promise.reject(new TypeError('supplied parameter was neither a user or a role'));
    }

    payload.id = userOrRole.id;

    const prevOverwrite = this.permissionOverwrites.get(userOrRole.id);

    if (prevOverwrite) {
      payload.allow = prevOverwrite.allow;
      payload.deny = prevOverwrite.deny;
    }

    for (const perm in options) {
      if (options[perm] === true) {
        payload.allow |= Constants.PermissionFlags[perm] || 0;
        payload.deny &= ~(Constants.PermissionFlags[perm] || 0);
      } else if (options[perm] === false) {
        payload.allow &= ~(Constants.PermissionFlags[perm] || 0);
        payload.deny |= Constants.PermissionFlags[perm] || 0;
      }
    }

    return this.client.rest.methods.setChannelOverwrite(this, payload);
  }

  edit(data) {
    return this.client.rest.methods.updateChannel(this, data);
  }

  /**
   * Set a new name for the Guild Channel
   * @param {string} name The new name for the guild channel
   * @returns {Promise<GuildChannel>}
   * @example
   * // set a new channel name
   * channel.setName('not general')
   *  .then(newChannel => console.log(`Channel's new name is ${newChannel.name}`))
   *  .catch(console.log);
   */
  setName(name) {
    return this.client.rest.methods.updateChannel(this, { name });
  }

  /**
   * Set a new position for the Guild Channel
   * @param {number} position The new position for the guild channel
   * @returns {Promise<GuildChannel>}
   * @example
   * // set a new channel position
   * channel.setPosition(2)
   *  .then(newChannel => console.log(`Channel's new position is ${newChannel.position}`))
   *  .catch(console.log);
   */
  setPosition(position) {
    return this.client.rest.methods.updateChannel(this, { position });
  }

  /**
   * Set a new topic for the Guild Channel
   * @param {string} topic The new topic for the guild channel
   * @returns {Promise<GuildChannel>}
   * @example
   * // set a new channel topic
   * channel.setTopic('needs more rate limiting')
   *  .then(newChannel => console.log(`Channel's new topic is ${newChannel.topic}`))
   *  .catch(console.log);
   */
  setTopic(topic) {
    return this.client.rest.methods.updateChannel(this, { topic });
  }

  /**
   * When concatenated with a string, this automatically returns the Channel's mention instead of the Channel object.
   * @returns {string}
   * @example
   * // Outputs: Hello from #general
   * console.log(`Hello from ${channel}`);
   * @example
   * // Outputs: Hello from #general
   * console.log('Hello from ' + channel);
   */
  toString() {
    return `<#${this.id}>`;
  }

  /**
   * Options given when creating a Guild Channel Invite:
   * ```js
   * {
   *  temporary: false, // whether the invite should kick users after 24hrs if they are not given a new role
   *  maxAge: 0, // the time in seconds the invite expires in
   *  maxUses: 0, // the maximum amount of uses for this invite
   * }
   * ```
   * @typedef {Object} InviteOptions
   */

  /**
   * Create an invite to this Guild Channel
   * @param {InviteOptions} [options={}] The options for the invite
   * @returns {Promise<Invite>}
   */
  createInvite(options = {}) {
    return this.client.rest.methods.createChannelInvite(this, options);
  }
}

module.exports = GuildChannel;
