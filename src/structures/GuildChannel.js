const Channel = require('./Channel');
const Role = require('./Role');
const PermissionOverwrites = require('./PermissionOverwrites');
const Permissions = require('../util/Permissions');
const Collection = require('../util/Collection');
const Constants = require('../util/Constants');
const Invite = require('./Invite');

/**
 * Represents a guild channel (i.e. text channels and voice channels).
 * @extends {Channel}
 */
class GuildChannel extends Channel {
  constructor(guild, data) {
    super(guild.client, data);

    /**
     * The guild the channel is in
     * @type {Guild}
     */
    this.guild = guild;
  }

  setup(data) {
    super.setup(data);

    /**
     * The name of the guild channel
     * @type {string}
     */
    this.name = data.name;

    /**
     * The position of the channel in the list
     * @type {number}
     */
    this.position = data.position;

    /**
     * The ID of the category parent of this channel
     * @type {?Snowflake}
     */
    this.parentID = data.parent_id;

    /**
     * A map of permission overwrites in this channel for roles and users
     * @type {Collection<Snowflake, PermissionOverwrites>}
     */
    this.permissionOverwrites = new Collection();
    if (data.permission_overwrites) {
      for (const overwrite of data.permission_overwrites) {
        this.permissionOverwrites.set(overwrite.id, new PermissionOverwrites(this, overwrite));
      }
    }
  }

  /**
   * The position of the channel
   * @type {number}
   * @readonly
   */
  get calculatedPosition() {
    const sorted = this.guild._sortedChannels(this.type);
    return sorted.array().indexOf(sorted.get(this.id));
  }

  /**
   * The category parent of this channel
   * @type {?CategoryChannel}
   * @readonly
   */
  get parent() {
    return this.guild.channels.get(this.parentID) || null;
  }

  /**
   * Gets the overall set of permissions for a user in this channel, taking into account channel overwrites.
   * @param {GuildMemberResolvable} member The user that you want to obtain the overall permissions for
   * @returns {?Permissions}
   */
  memberPermissions(member) {
    member = this.client.resolver.resolveGuildMember(this.guild, member);
    if (!member) return null;

    if (member.id === this.guild.ownerID) return new Permissions(member, Permissions.ALL);

    const roles = member.roles;
    const permissions = new Permissions(roles.map(role => role.permissions));

    if (permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return new Permissions(Permissions.ALL).freeze();

    const overwrites = this.overwritesFor(member, true, roles);

    return permissions
      .remove(overwrites.everyone ? overwrites.everyone.deny : 0)
      .add(overwrites.everyone ? overwrites.everyone.allow : 0)
      .remove(overwrites.roles.length > 0 ? overwrites.roles.map(role => role.deny) : 0)
      .add(overwrites.roles.length > 0 ? overwrites.roles.map(role => role.allow) : 0)
      .remove(overwrites.member ? overwrites.member.deny : 0)
      .add(overwrites.member ? overwrites.member.allow : 0)
      .freeze();
  }

  /**
   * Gets the overall set of permissions for a role in this channel, taking into account channel overwrites.
   * @param {RoleResolvable} role The role that you want to obtain the overall permissions for
   * @returns {?Permissions}
   */
  rolePermissions(role) {
    if (role.permissions & Permissions.FLAGS.ADMINISTRATOR) return new Permissions(Permissions.ALL).freeze();

    const everyoneOverwrites = this.permissionOverwrites.get(this.guild.id);
    const roleOverwrites = this.permissionOverwrites.get(role.id);

    return new Permissions(role.permissions)
      .remove(everyoneOverwrites ? everyoneOverwrites.deny : 0)
      .add(everyoneOverwrites ? everyoneOverwrites.allow : 0)
      .remove(roleOverwrites ? roleOverwrites.deny : 0)
      .add(roleOverwrites ? roleOverwrites.allow : 0)
      .freeze();
  }

  /**
   * Get the overall set of permissions for a member or role in this channel, taking into account channel overwrites.
   * @param {GuildMemberResolvable|RoleResolvable} memberOrRole The member or role to obtain the overall permissions for
   * @returns {?Permissions}
   */
  permissionsFor(memberOrRole) {
    const member = this.guild.member(memberOrRole);
    if (member) return this.memberPermissions(member);
    const role = this.client.resolver.resolveRole(this.guild, memberOrRole);
    if (role) return this.rolePermissions(role);
    return null;
  }

  overwritesFor(member, verified = false, roles = null) {
    if (!verified) member = this.client.resolver.resolveGuildMember(this.guild, member);
    if (!member) return [];

    roles = roles || member.roles;
    const roleOverwrites = [];
    let memberOverwrites;
    let everyoneOverwrites;

    for (const overwrite of this.permissionOverwrites.values()) {
      if (overwrite.id === this.guild.id) {
        everyoneOverwrites = overwrite;
      } else if (roles.has(overwrite.id)) {
        roleOverwrites.push(overwrite);
      } else if (overwrite.id === member.id) {
        memberOverwrites = overwrite;
      }
    }

    return {
      everyone: everyoneOverwrites,
      roles: roleOverwrites,
      member: memberOverwrites,
    };
  }

  /**
   * Replaces the permission overwrites for a channel
   * @param {Object} [options] Options
   * @param {ChannelCreationOverwrites[]|Collection<Snowflake, PermissionOverwrites>} [options.overwrites]
   * Permission overwrites
   * @param {string} [options.reason] Reason for updating the channel overwrites
   * @returns {Promise<GuildChannel>}
   * @example
   * channel.replacePermissionOverwrites({
   * overwrites: [
   *   {
   *      id: message.author.id,
   *      denied: ['VIEW_CHANNEL'],
   *   },
   * ],
   *   reason: 'Needed to change permissions'
   * });
   */
  replacePermissionOverwrites({ overwrites, reason } = {}) {
    return this.edit({ permissionOverwrites: overwrites, reason })
      .then(() => this);
  }

  /**
   * An object mapping permission flags to `true` (enabled), `null` (unset) or `false` (disabled).
   * ```js
   * {
   *  'SEND_MESSAGES': true,
   *  'EMBED_LINKS': null,
   *  'ATTACH_FILES': false,
   * }
   * ```
   * @typedef {Object} PermissionOverwriteOptions
   */

  /**
   * Overwrites the permissions for a user or role in this channel.
   * @param {Role|Snowflake|UserResolvable} userOrRole The user or role to update
   * @param {PermissionOverwriteOptions} options The configuration for the update
   * @param {string} [reason] Reason for creating/editing this overwrite
   * @returns {Promise<GuildChannel>}
   * @example
   * // Overwrite permissions for a message author
   * message.channel.overwritePermissions(message.author, {
   *   SEND_MESSAGES: false
   * })
   *   .then(updated => console.log(updated.permissionOverwrites.get(message.author.id)))
   *   .catch(console.error);
   * @example
   * // Overwite permissions for a message author and reset some
   * message.channel.overwritePermissions(message.author, {
   *   VIEW_CHANNEL: false,
   *   SEND_MESSAGES: null
   * })
   *   .then(updated => console.log(updated.permissionOverwrites.get(message.author.id)))
   *   .catch(console.error);
   */
  overwritePermissions(userOrRole, options, reason) {
    const payload = {
      allow: 0,
      deny: 0,
    };

    if (userOrRole instanceof Role) {
      payload.type = 'role';
    } else if (this.guild.roles.has(userOrRole)) {
      userOrRole = this.guild.roles.get(userOrRole);
      payload.type = 'role';
    } else {
      userOrRole = this.client.resolver.resolveUser(userOrRole);
      payload.type = 'member';
      if (!userOrRole) return Promise.reject(new TypeError('Supplied parameter was neither a User nor a Role.'));
    }

    payload.id = userOrRole.id;

    const prevOverwrite = this.permissionOverwrites.get(userOrRole.id);

    if (prevOverwrite) {
      payload.allow = prevOverwrite.allow;
      payload.deny = prevOverwrite.deny;
    }

    for (const perm in options) {
      if (options[perm] === true) {
        payload.allow |= Permissions.FLAGS[perm] || 0;
        payload.deny &= ~(Permissions.FLAGS[perm] || 0);
      } else if (options[perm] === false) {
        payload.allow &= ~(Permissions.FLAGS[perm] || 0);
        payload.deny |= Permissions.FLAGS[perm] || 0;
      } else if (options[perm] === null) {
        payload.allow &= ~(Permissions.FLAGS[perm] || 0);
        payload.deny &= ~(Permissions.FLAGS[perm] || 0);
      }
    }

    return this.client.rest.methods.setChannelOverwrite(this, payload, reason).then(() => this);
  }

  /**
   * Locks in the permission overwrites from the parent channel.
   * @returns {Promise<GuildChannel>}
   */
  lockPermissions() {
    if (!this.parent) return Promise.reject(new TypeError('Could not find a parent to this guild channel.'));
    const permissionOverwrites = this.parent.permissionOverwrites.map(overwrite => ({
      deny: overwrite.deny,
      allow: overwrite.allow,
      id: overwrite.id,
      type: overwrite.type,
    }));
    return this.edit({ permissionOverwrites });
  }

  /**
   * The data for a guild channel.
   * @typedef {Object} ChannelData
   * @property {string} [type] The type of the channel (Only when creating)
   * @property {string} [name] The name of the channel
   * @property {number} [position] The position of the channel
   * @property {string} [topic] The topic of the text channel
   * @property {boolean} [nsfw] Whether the channel is NSFW
   * @property {number} [bitrate] The bitrate of the voice channel
   * @property {number} [userLimit] The user limit of the channel
   * @property {CategoryChannel|Snowflake} [parent] The parent or parent ID of the channel
   * @property {ChannelCreationOverwrites[]|Collection<Snowflake, PermissionOverwrites>} [permissionOverwrites]
   * Overwrites of the channel
   * @property {number} [rateLimitPerUser] The rate limit per user of the channel in seconds
   */

  /**
   * Edits the channel.
   * @param {ChannelData} data The new data for the channel
   * @param {string} [reason] Reason for editing this channel
   * @returns {Promise<GuildChannel>}
   * @example
   * // Edit a channel
   * channel.edit({ name: 'new-channel' })
   *   .then(console.log)
   *   .catch(console.error);
   */
  edit(data, reason) {
    return this.client.rest.methods.updateChannel(this, data, reason).then(() => this);
  }

  /**
   * Set a new name for the guild channel.
   * @param {string} name The new name for the guild channel
   * @param {string} [reason] Reason for changing the guild channel's name
   * @returns {Promise<GuildChannel>}
   * @example
   * // Set a new channel name
   * channel.setName('not_general')
   *   .then(newChannel => console.log(`Channel's new name is ${newChannel.name}`))
   *   .catch(console.error);
   */
  setName(name, reason) {
    return this.edit({ name }, reason);
  }

  /**
   * Set a new position for the guild channel.
   * @param {number} position The new position for the guild channel
   * @param {boolean} [relative=false] Move the position relative to its current value
   * @returns {Promise<GuildChannel>}
   * @example
   * // Set a new channel position
   * channel.setPosition(2)
   *   .then(newChannel => console.log(`Channel's new position is ${newChannel.position}`))
   *   .catch(console.error);
   */
  setPosition(position, relative) {
    return this.guild.setChannelPosition(this, position, relative);
  }

  /**
   * Set a new parent for the guild channel.
   * @param {CategoryChannel|SnowFlake} parent The new parent for the guild channel
   * @param {string} [reason] Reason for changing the guild channel's parent
   * @returns {Promise<GuildChannel>}
   * @example
   * // Sets the parent of a channel
   * channel.setParent('174674066072928256')
   *   .then(updated => console.log(`Set the category of ${updated.name} to ${updated.parent.name}`))
   *   .catch(console.error);
   */
  setParent(parent, reason) {
    parent = this.client.resolver.resolveChannelID(parent);
    return this.edit({ parent }, reason);
  }

  /**
   * Set a new topic for the guild channel.
   * @param {string} topic The new topic for the guild channel
   * @param {string} [reason] Reason for changing the guild channel's topic
   * @returns {Promise<GuildChannel>}
   * @example
   * // Set a new channel topic
   * channel.setTopic('Needs more rate limiting')
   *   .then(updated => console.log(`Channel's new topic is ${updated.topic}`))
   *   .catch(console.error);
   */
  setTopic(topic, reason) {
    return this.edit({ topic }, reason);
  }

  /**
   * Create an invite to this guild channel.
   * <warn>This is only available when using a bot account.</warn>
   * @param {Object} [options={}] Options for the invite
   * @param {boolean} [options.temporary=false] Whether members that joined via the invite should be automatically
   * kicked after 24 hours if they have not yet received a role
   * @param {number} [options.maxAge=86400] How long the invite should last (in seconds, 0 for forever)
   * @param {number} [options.maxUses=0] Maximum number of uses
   * @param {boolean} [options.unique=false] Create a unique invite, or use an existing one with similar settings
   * @param {string} [reason] Reason for creating the invite
   * @returns {Promise<Invite>}
   * @example
   * // Create an invite to a channel
   * channel.createInvite()
   *   .then(invite => console.log(`Created an invite with a code of ${invite.code}`))
   *   .catch(console.error);
   */
  createInvite(options = {}, reason) {
    return this.client.rest.methods.createChannelInvite(this, options, reason);
  }

  /**
   * Clone this channel.
   * @param {string} [name=this.name] Optional name for the new channel, otherwise it has the name of this channel
   * @param {boolean} [withPermissions=true] Whether to clone the channel with this channel's permission overwrites
   * @param {boolean} [withTopic=true] Whether to clone the channel with this channel's topic
   * @param {string} [reason] Reason for cloning this channel
   * @returns {Promise<GuildChannel>}
   * @example
   * // Clone a channel
   * channel.clone(undefined, true, false, 'Needed a clone')
   *   .then(clone => console.log(`Cloned ${channel.name} to make a channel called ${clone.name}`))
   *   .catch(console.error);
   */
  clone(name = this.name, withPermissions = true, withTopic = true, reason) {
    return this.guild.createChannel(name, {
      type: this.type,
      permissionOverwrites: withPermissions ? this.permissionOverwrites : undefined,
      topic: withTopic ? this.topic : undefined,
      reason,
    });
  }

  /**
   * Fetches a collection of invites to this guild channel.
   * Resolves with a collection mapping invites by their codes.
   * @returns {Promise<Collection<string, Invite>>}
   */
  fetchInvites() {
    return this.client.rest.makeRequest('get', Constants.Endpoints.Channel(this.id).invites, true)
      .then(data => {
        const invites = new Collection();
        for (let invite of data) {
          invite = new Invite(this.client, invite);
          invites.set(invite.code, invite);
        }

        return invites;
      });
  }

  /**
   * Deletes this channel.
   * @param {string} [reason] Reason for deleting this channel
   * @returns {Promise<GuildChannel>}
   * @example
   * // Delete the channel
   * channel.delete('Making room for new channels')
   *   .then(deleted => console.log(`Deleted ${deleted.name} to make room for new channels`))
   *   .catch(console.error);
   */
  delete(reason) {
    return this.client.rest.methods.deleteChannel(this, reason);
  }

  /**
   * Checks if this channel has the same type, topic, position, name, overwrites and ID as another channel.
   * In most cases, a simple `channel.id === channel2.id` will do, and is much faster too.
   * @param {GuildChannel} channel Channel to compare with
   * @returns {boolean}
   */
  equals(channel) {
    let equal = channel &&
      this.id === channel.id &&
      this.type === channel.type &&
      this.topic === channel.topic &&
      this.position === channel.position &&
      this.name === channel.name;

    if (equal) {
      if (this.permissionOverwrites && channel.permissionOverwrites) {
        equal = this.permissionOverwrites.equals(channel.permissionOverwrites);
      } else {
        equal = !this.permissionOverwrites && !channel.permissionOverwrites;
      }
    }

    return equal;
  }

  /**
   * Whether the channel is deletable by the client user
   * @type {boolean}
   * @readonly
   */
  get deletable() {
    return this.id !== this.guild.id &&
      this.permissionsFor(this.client.user).has(Permissions.FLAGS.MANAGE_CHANNELS);
  }

  /**
   * Whether the channel is manageable by the client user
   * @type {boolean}
   * @readonly
   */
  get manageable() {
    if (this.client.user.id === this.guild.ownerID) return true;
    const permissions = this.permissionsFor(this.client.user);
    if (!permissions) return false;
    return permissions.has([Permissions.FLAGS.MANAGE_CHANNELS, Permissions.FLAGS.VIEW_CHANNEL]);
  }

  /**
   * Whether the channel is muted
   * <warn>This is only available when using a user account.</warn>
   * @type {?boolean}
   * @readonly
   * @deprecated
   */
  get muted() {
    if (this.client.user.bot) return null;
    try {
      return this.client.user.guildSettings.get(this.guild.id).channelOverrides.get(this.id).muted;
    } catch (err) {
      return false;
    }
  }

  /**
   * The type of message that should notify you
   * <warn>This is only available when using a user account.</warn>
   * @type {?MessageNotificationType}
   * @readonly
   * @deprecated
   */
  get messageNotifications() {
    if (this.client.user.bot) return null;
    try {
      return this.client.user.guildSettings.get(this.guild.id).channelOverrides.get(this.id).messageNotifications;
    } catch (err) {
      return Constants.MessageNotificationTypes[3];
    }
  }

  /**
   * When concatenated with a string, this automatically returns the channel's mention instead of the Channel object.
   * @returns {string}
   * @example
   * // Logs: Hello from <#123456789012345678>
   * console.log(`Hello from ${channel}`);
   * @example
   * // Logs: Hello from <#123456789012345678>
   * console.log('Hello from ' + channel);
   */
  toString() {
    return `<#${this.id}>`;
  }
}

module.exports = GuildChannel;
