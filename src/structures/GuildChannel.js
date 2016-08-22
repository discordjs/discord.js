const Channel = require('./Channel');
const PermissionOverwrites = require('./PermissionOverwrites');
const Role = require('./Role');
const EvaluatedPermissions = require('./EvaluatedPermissions');
const Constants = require('../util/Constants');

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a.length !== b.length) return false;

  for (const itemInd in a) {
    const item = a[itemInd];
    const ind = b.indexOf(item);
    if (ind) {
      b.splice(ind, 1);
    }
  }

  return b.length === 0;
}

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
     * The type of the Guild Channel
     * @type {Number}
     */
    this.type = data.type;
    /**
     * The topic of the Guild Channel, if there is one.
     * @type {?String}
     */
    this.topic = data.topic;
    /**
     * The position of the channel in the list.
     * @type {Number}
     */
    this.position = data.position;
    /**
     * The name of the Guild Channel
     * @type {String}
     */
    this.name = data.name;
    /**
     * The ID of the last message in the channel, if one was sent.
     * @type {?String}
     */
    this.lastMessageID = data.last_message_id;
    this.ow = data.permission_overwrites;
    /**
     * A map of permission overwrites in this channel for roles and users.
     * @type {Map<String, PermissionOverwrites>}
     */
    this.permissionOverwrites = new Map();
    if (data.permission_overwrites) {
      for (const overwrite of data.permission_overwrites) {
        this.permissionOverwrites.set(overwrite.id, new PermissionOverwrites(this, overwrite));
      }
    }
  }

  /**
   * Checks if this channel has the same type, topic, position, name, overwrites and ID as another channel.
   * In most cases, a simple `channel.id === channel2.id` will do, and is much faster too.
   * @param {GuildChannel} channel the channel to compare this channel to
   * @returns {Boolean}
   */
  equals(other) {
    let base = (
      this.type === other.type &&
      this.topic === other.topic &&
      this.position === other.position &&
      this.name === other.name &&
      this.id === other.id
    );

    if (base) {
      if (other.permission_overwrites) {
        const thisIDSet = Array.from(this.permissionOverwrites.keys());
        const otherIDSet = other.permission_overwrites.map(overwrite => overwrite.id);
        if (arraysEqual(thisIDSet, otherIDSet)) {
          base = true;
        } else {
          base = false;
        }
      } else {
        base = false;
      }
    }

    return base;
  }

  /**
   * Gets the overall set of permissions for a user in this channel, taking into account roles and permission
   * overwrites.
   * @param {GuildMemberResolvable} member the user that you want to obtain the overall permissions for
   * @returns {?EvaluatedPermissions}
   */
  permissionsFor(member) {
    member = this.client.resolver.resolveGuildMember(this.guild, member);
    if (member) {
      if (this.guild.owner.id === member.id) {
        return new EvaluatedPermissions(member, Constants.ALL_PERMISSIONS);
      }

      const roles = member.roles;
      let permissions = 0;
      const overwrites = this.overwritesFor(member, true);

      for (const role of roles) {
        permissions |= role.permissions;
      }

      for (const overwrite of overwrites.role.concat(overwrites.member)) {
        permissions &= ~overwrite.denyData;
        permissions |= overwrite.allowData;
      }

      const admin = Boolean(permissions & (Constants.PermissionFlags.ADMINISTRATOR));
      if (admin) {
        permissions = Constants.ALL_PERMISSIONS;
      }

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

      for (const overwrite of this.permissionOverwrites) {
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
   * @typedef {(number|string)} PermissionOverwriteOptions
   * @example
   * // overwrite permissions for a message author
   * message.channel.overwritePermissions(message.author, {
   *  SEND_MESSAGES: false
   * })
   * .then(() => console.log('Done!'))
   * .catch(console.log);
   */

  /**
   * Overwrites the permissions for a user or role in this channel.
   * @param {Role|UserResolvable} userOrRole the user or role to update
   * @param {PermissionOverwriteOptions} config the configuration for the update
   * @returns {Promise<null, Error>}
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
      if (!userOrRole) {
        return Promise.reject('supplied parameter was neither a user or a role');
      }
    }

    payload.id = userOrRole.id;

    const prevOverwrite = this.permissionOverwrites.get(userOrRole.id);
    
    if (prevOverwrite) {
      payload.allow = prevOverwrite.allow;
      payload.deny = prevOverwrite.deny;
    }

    for (const perm in options) {
      if (options[perm] === true) {
        payload.allow |= (Constants.PermissionFlags[perm] || 0);
        payload.deny &= ~(Constants.PermissionFlags[perm] || 0);
      } else if (options[perm] === false) {
        payload.allow &= ~(Constants.PermissionFlags[perm] || 0);
        payload.deny |= (Constants.PermissionFlags[perm] || 0);
      }
    }

    return this.client.rest.methods.setChannelOverwrite(this, payload);
  }

  edit(data) {
    return this.client.rest.methods.updateChannel(this, data);
  }

  /**
   * Set a new name for the Guild Channel
   * @param {String} name the new name for the guild channel
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
   * @param {Number} position the new position for the guild channel
   * @returns {Promise<GuildChannel>}
   * @example
   * // set a new channel position
   * channel.setPosition(2)
   *  .then(newChannel => console.log(`Channel's new position is ${newChannel.position}`))
   *  .catch(console.log);
   */
  setPosition(position) {
    return this.rest.client.rest.methods.updateChannel(this, { position });
  }

  /**
   * Set a new topic for the Guild Channel
   * @param {String} topic the new topic for the guild channel
   * @returns {Promise<GuildChannel>}
   * @example
   * // set a new channel topic
   * channel.setTopic('needs more rate limiting')
   *  .then(newChannel => console.log(`Channel's new topic is ${newChannel.topic}`))
   *  .catch(console.log);
   */
  setTopic(topic) {
    return this.rest.client.rest.methods.updateChannel(this, { topic });
  }

  /**
   * When concatenated with a String, this automatically concatenates the Channel's name instead of the Channel object.
   * @returns {String}
   * @example
   * // Outputs: Hello from general
   * console.log(`Hello from ${channel}`);
   * @example
   * // Outputs: Hello from general
   * console.log('Hello from ' + ${channel});
   */
  toString() {
    return this.name;
  }
}

module.exports = GuildChannel;
