const User = require('./User');
const Role = require('./Role');
const Emoji = require('./Emoji');
const Presence = require('./Presence').Presence;
const GuildMember = require('./GuildMember');
const Constants = require('../util/Constants');
const Collection = require('../util/Collection');
const cloneObject = require('../util/CloneObject');
const arraysEqual = require('../util/ArraysEqual');

/**
 * Represents a guild (or a server) on Discord.
 * <info>It's recommended to see if a guild is available before performing operations or reading data from it. You can
 * check this with `guild.available`.</info>
 */
class Guild {
  constructor(client, data) {
    /**
     * The Client that created the instance of the the Guild.
     * @name Guild#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    /**
     * A collection of members that are in this guild. The key is the member's ID, the value is the member.
     * @type {Collection<string, GuildMember>}
     */
    this.members = new Collection();

    /**
     * A collection of channels that are in this guild. The key is the channel's ID, the value is the channel.
     * @type {Collection<string, GuildChannel>}
     */
    this.channels = new Collection();

    /**
     * A collection of roles that are in this guild. The key is the role's ID, the value is the role.
     * @type {Collection<string, Role>}
     */
    this.roles = new Collection();

    /**
     * A collection of presences in this guild
     * @type {Collection<string, Presence>}
     */
    this.presences = new Collection();

    if (!data) return;
    if (data.unavailable) {
      /**
       * Whether the guild is available to access. If it is not available, it indicates a server outage.
       * @type {boolean}
       */
      this.available = false;

      /**
       * The Unique ID of the Guild, useful for comparisons.
       * @type {string}
       */
      this.id = data.id;
    } else {
      this.available = true;
      this.setup(data);
    }
  }

  /**
   * Sets up the Guild
   * @param {*} data The raw data of the guild
   * @private
   */
  setup(data) {
    /**
     * The name of the guild
     * @type {string}
     */
    this.name = data.name;

    /**
     * The hash of the guild icon, or null if there is no icon.
     * @type {?string}
     */
    this.icon = data.icon;

    /**
     * The hash of the guild splash image, or null if no splash (VIP only)
     * @type {?string}
     */
    this.splash = data.splash;

    /**
     * The region the guild is located in
     * @type {string}
     */
    this.region = data.region;

    /**
     * The full amount of members in this guild as of `READY`
     * @type {number}
     */
    this.memberCount = data.member_count || this.memberCount;

    /**
     * Whether the guild is "large" (has more than 250 members)
     * @type {boolean}
     */
    this.large = data.large || this.large;

    /**
     * An array of guild features.
     * @type {Object[]}
     */
    this.features = data.features;

    /**
     * The ID of the application that created this guild (if applicable)
     * @type {?string}
     */
    this.applicationID = data.application_id;

    /**
     * A collection of emojis that are in this guild. The key is the emoji's ID, the value is the emoji.
     * @type {Collection<string, Emoji>}
     */
    this.emojis = new Collection();
    for (const emoji of data.emojis) this.emojis.set(emoji.id, new Emoji(this, emoji));

    /**
     * The time in seconds before a user is counted as "away from keyboard".
     * @type {?number}
     */
    this.afkTimeout = data.afk_timeout;

    /**
     * The ID of the voice channel where AFK members are moved.
     * @type {?string}
     */
    this.afkChannelID = data.afk_channel_id;

    /**
     * Whether embedded images are enabled on this guild.
     * @type {boolean}
     */
    this.embedEnabled = data.embed_enabled;

    /**
     * The verification level of the guild.
     * @type {number}
     */
    this.verificationLevel = data.verification_level;

    /**
     * The timestamp the client user joined the guild at
     * @type {number}
     */
    this.joinedTimestamp = data.joined_at ? new Date(data.joined_at).getTime() : this.joinedTimestamp;

    this.id = data.id;
    this.available = !data.unavailable;
    this.features = data.features || this.features || [];

    if (data.members) {
      this.members.clear();
      for (const guildUser of data.members) this._addMember(guildUser, false);
    }

    if (data.owner_id) {
      /**
       * The user ID of this guild's owner.
       * @type {string}
       */
      this.ownerID = data.owner_id;
    }

    if (data.channels) {
      this.channels.clear();
      for (const channel of data.channels) this.client.dataManager.newChannel(channel, this);
    }

    if (data.roles) {
      this.roles.clear();
      for (const role of data.roles) {
        const newRole = new Role(this, role);
        this.roles.set(newRole.id, newRole);
      }
    }

    if (data.presences) {
      for (const presence of data.presences) {
        this._setPresence(presence.user.id, presence);
      }
    }

    this._rawVoiceStates = new Collection();
    if (data.voice_states) {
      for (const voiceState of data.voice_states) {
        this._rawVoiceStates.set(voiceState.user_id, voiceState);
        const member = this.members.get(voiceState.user_id);
        if (member) {
          member.serverMute = voiceState.mute;
          member.serverDeaf = voiceState.deaf;
          member.selfMute = voiceState.self_mute;
          member.selfDeaf = voiceState.self_deaf;
          member.voiceSessionID = voiceState.session_id;
          member.voiceChannelID = voiceState.channel_id;
          this.channels.get(voiceState.channel_id).members.set(member.user.id, member);
        }
      }
    }
  }

  /**
   * The timestamp the guild was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return (this.id / 4194304) + 1420070400000;
  }

  /**
   * The time the guild was created
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The time the client user joined the guild
   * @type {Date}
   * @readonly
   */
  get joinedAt() {
    return new Date(this.joinedTimestamp);
  }

  /**
   * Gets the URL to this guild's icon (if it has one, otherwise it returns null)
   * @type {?string}
   * @readonly
   */
  get iconURL() {
    if (!this.icon) return null;
    return Constants.Endpoints.guildIcon(this.id, this.icon);
  }

  /**
   * Gets the URL to this guild's splash (if it has one, otherwise it returns null)
   * @type {?string}
   * @readonly
   */
  get splashURL() {
    if (!this.splash) return null;
    return Constants.Endpoints.guildSplash(this.id, this.splash);
  }

  /**
   * The owner of the guild
   * @type {GuildMember}
   * @readonly
   */
  get owner() {
    return this.members.get(this.ownerID);
  }

  /**
   * If the client is connected to any voice channel in this guild, this will be the relevant VoiceConnection.
   * @type {?VoiceConnection}
   * @readonly
   */
  get voiceConnection() {
    if (this.client.browser) return null;
    return this.client.voice.connections.get(this.id) || null;
  }

  /**
   * The `#general` GuildChannel of the server.
   * @type {GuildChannel}
   * @readonly
   */
  get defaultChannel() {
    return this.channels.get(this.id);
  }

  /**
   * Returns the GuildMember form of a User object, if the user is present in the guild.
   * @param {UserResolvable} user The user that you want to obtain the GuildMember of
   * @returns {?GuildMember}
   * @example
   * // get the guild member of a user
   * const member = guild.member(message.author);
   */
  member(user) {
    return this.client.resolver.resolveGuildMember(this, user);
  }

  /**
   * Fetch a collection of banned users in this guild.
   * @returns {Promise<Collection<string, User>>}
   */
  fetchBans() {
    return this.client.rest.methods.getGuildBans(this);
  }

  /**
   * Fetch a collection of invites to this guild. Resolves with a collection mapping invites by their codes.
   * @returns {Promise<Collection<string, Invite>>}
   */
  fetchInvites() {
    return this.client.rest.methods.getGuildInvites(this);
  }

  /**
   * Fetch all webhooks for the guild.
   * @returns {Collection<Webhook>}
   */
  fetchWebhooks() {
    return this.client.rest.methods.getGuildWebhooks(this);
  }

  /**
   * Fetch a single guild member from a user.
   * @param {UserResolvable} user The user to fetch the member for
   * @returns {Promise<GuildMember>}
   */
  fetchMember(user) {
    if (this._fetchWaiter) return Promise.reject(new Error('Already fetching guild members.'));
    user = this.client.resolver.resolveUser(user);
    if (!user) return Promise.reject(new Error('User is not cached. Use Client.fetchUser first.'));
    if (this.members.has(user.id)) return Promise.resolve(this.members.get(user.id));
    return this.client.rest.methods.getGuildMember(this, user);
  }

  /**
   * Fetches all the members in the guild, even if they are offline. If the guild has less than 250 members,
   * this should not be necessary.
   * @param {string} [query=''] An optional query to provide when fetching members
   * @returns {Promise<Guild>}
   */
  fetchMembers(query = '') {
    return new Promise((resolve, reject) => {
      if (this._fetchWaiter) throw new Error('Already fetching guild members in ${this.id}.');
      if (this.memberCount === this.members.size) {
        resolve(this);
        return;
      }
      this._fetchWaiter = resolve;
      this.client.ws.send({
        op: Constants.OPCodes.REQUEST_GUILD_MEMBERS,
        d: {
          guild_id: this.id,
          query,
          limit: 0,
        },
      });
      this._checkChunks();
      this.client.setTimeout(() => reject(new Error('Members didn\'t arrive in time.')), 120 * 1000);
    });
  }

  /**
   * The data for editing a guild
   * @typedef {Object} GuildEditData
   * @property {string} [name] The name of the guild
   * @property {string} [region] The region of the guild
   * @property {number} [verificationLevel] The verification level of the guild
   * @property {ChannelResolvable} [afkChannel] The AFK channel of the guild
   * @property {number} [afkTimeout] The AFK timeout of the guild
   * @property {Base64Resolvable} [icon] The icon of the guild
   * @property {GuildMemberResolvable} [owner] The owner of the guild
   * @property {Base64Resolvable} [splash] The splash screen of the guild
   */

  /**
   * Updates the Guild with new information - e.g. a new name.
   * @param {GuildEditData} data The data to update the guild with
   * @returns {Promise<Guild>}
   * @example
   * // set the guild name and region
   * guild.edit({
   *  name: 'Discord Guild',
   *  region: 'london',
   * })
   * .then(updated => console.log(`New guild name ${updated.name} in region ${updated.region}`))
   * .catch(console.error);
   */
  edit(data) {
    return this.client.rest.methods.updateGuild(this, data);
  }

  /**
   * Edit the name of the guild.
   * @param {string} name The new name of the guild
   * @returns {Promise<Guild>}
   * @example
   * // edit the guild name
   * guild.setName('Discord Guild')
   *  .then(updated => console.log(`Updated guild name to ${guild.name}`))
   *  .catch(console.error);
   */
  setName(name) {
    return this.edit({ name });
  }

  /**
   * Edit the region of the guild.
   * @param {string} region The new region of the guild.
   * @returns {Promise<Guild>}
   * @example
   * // edit the guild region
   * guild.setRegion('london')
   *  .then(updated => console.log(`Updated guild region to ${guild.region}`))
   *  .catch(console.error);
   */
  setRegion(region) {
    return this.edit({ region });
  }

  /**
   * Edit the verification level of the guild.
   * @param {number} verificationLevel The new verification level of the guild
   * @returns {Promise<Guild>}
   * @example
   * // edit the guild verification level
   * guild.setVerificationLevel(1)
   *  .then(updated => console.log(`Updated guild verification level to ${guild.verificationLevel}`))
   *  .catch(console.error);
   */
  setVerificationLevel(verificationLevel) {
    return this.edit({ verificationLevel });
  }

  /**
   * Edit the AFK channel of the guild.
   * @param {ChannelResolvable} afkChannel The new AFK channel
   * @returns {Promise<Guild>}
   * @example
   * // edit the guild AFK channel
   * guild.setAFKChannel(channel)
   *  .then(updated => console.log(`Updated guild AFK channel to ${guild.afkChannel}`))
   *  .catch(console.error);
   */
  setAFKChannel(afkChannel) {
    return this.edit({ afkChannel });
  }

  /**
   * Edit the AFK timeout of the guild.
   * @param {number} afkTimeout The time in seconds that a user must be idle to be considered AFK
   * @returns {Promise<Guild>}
   * @example
   * // edit the guild AFK channel
   * guild.setAFKTimeout(60)
   *  .then(updated => console.log(`Updated guild AFK timeout to ${guild.afkTimeout}`))
   *  .catch(console.error);
   */
  setAFKTimeout(afkTimeout) {
    return this.edit({ afkTimeout });
  }

  /**
   * Set a new guild icon.
   * @param {Base64Resolvable} icon The new icon of the guild
   * @returns {Promise<Guild>}
   * @example
   * // edit the guild icon
   * guild.setIcon(fs.readFileSync('./icon.png'))
   *  .then(updated => console.log('Updated the guild icon'))
   *  .catch(console.error);
   */
  setIcon(icon) {
    return this.edit({ icon });
  }

  /**
   * Sets a new owner of the guild.
   * @param {GuildMemberResolvable} owner The new owner of the guild
   * @returns {Promise<Guild>}
   * @example
   * // edit the guild owner
   * guild.setOwner(guilds.members[0])
   *  .then(updated => console.log(`Updated the guild owner to ${updated.owner.username}`))
   *  .catch(console.error);
   */
  setOwner(owner) {
    return this.edit({ owner });
  }

  /**
   * Set a new guild splash screen.
   * @param {Base64Resolvable} splash The new splash screen of the guild
   * @returns {Promise<Guild>}
   * @example
   * // edit the guild splash
   * guild.setIcon(fs.readFileSync('./splash.png'))
   *  .then(updated => console.log('Updated the guild splash'))
   *  .catch(console.error);
   */
  setSplash(splash) {
    return this.edit({ splash });
  }

  /**
   * Bans a user from the guild.
   * @param {UserResolvable} user The user to ban
   * @param {number} [deleteDays=0] The amount of days worth of messages from this user that should
   * also be deleted. Between `0` and `7`.
   * @returns {Promise<GuildMember|User|string>} Result object will be resolved as specifically as possible.
   * If the GuildMember cannot be resolved, the User will instead be attempted to be resolved. If that also cannot
   * be resolved, the user ID will be the result.
   * @example
   * // ban a user
   * guild.ban('123123123123');
   */
  ban(user, deleteDays = 0) {
    return this.client.rest.methods.banGuildMember(this, user, deleteDays);
  }

  /**
   * Unbans a user from the guild.
   * @param {UserResolvable} user The user to unban
   * @returns {Promise<User>}
   * @example
   * // unban a user
   * guild.unban('123123123123')
   *  .then(user => console.log(`Unbanned ${user.username} from ${guild.name}`))
   *  .catch(reject);
   */
  unban(user) {
    return this.client.rest.methods.unbanGuildMember(this, user);
  }

  /**
   * Prunes members from the guild based on how long they have been inactive.
   * @param {number} days Number of days of inactivity required to kick
   * @param {boolean} [dry=false] If true, will return number of users that will be kicked, without actually doing it
   * @returns {Promise<number>} The number of members that were/will be kicked
   * @example
   * // see how many members will be pruned
   * guild.pruneMembers(12, true)
   *   .then(pruned => console.log(`This will prune ${pruned} people!`);
   *   .catch(console.error);
   * @example
   * // actually prune the members
   * guild.pruneMembers(12)
   *   .then(pruned => console.log(`I just pruned ${pruned} people!`);
   *   .catch(console.error);
   */
  pruneMembers(days, dry = false) {
    if (typeof days !== 'number') throw new TypeError('Days must be a number.');
    return this.client.rest.methods.pruneGuildMembers(this, days, dry);
  }

  /**
   * Syncs this guild (already done automatically every 30 seconds).
   * <warn>This is only available when using a user account.</warn>
   */
  sync() {
    if (!this.client.user.bot) this.client.syncGuilds([this]);
  }

  /**
   * Creates a new channel in the guild.
   * @param {string} name The name of the new channel
   * @param {string} type The type of the new channel, either `text` or `voice`
   * @param {Array<PermissionOverwrites|Object>} overwrites Permission overwrites to apply to the new channel
   * @returns {Promise<TextChannel|VoiceChannel>}
   * @example
   * // create a new text channel
   * guild.createChannel('new-general', 'text')
   *  .then(channel => console.log(`Created new channel ${channel}`))
   *  .catch(console.error);
   */
  createChannel(name, type, overwrites) {
    return this.client.rest.methods.createChannel(this, name, type, overwrites);
  }

  /**
   * Creates a new role in the guild, and optionally updates it with the given information.
   * @param {RoleData} [data] The data to update the role with
   * @returns {Promise<Role>}
   * @example
   * // create a new role
   * guild.createRole()
   *  .then(role => console.log(`Created role ${role}`))
   *  .catch(console.error);
   * @example
   * // create a new role with data
   * guild.createRole({ name: 'Super Cool People' })
   *   .then(role => console.log(`Created role ${role}`))
   *   .catch(console.error)
   */
  createRole(data) {
    const create = this.client.rest.methods.createGuildRole(this);
    if (!data) return create;
    return create.then(role => role.edit(data));
  }

  /**
   * Creates a new custom emoji in the guild.
   * @param {BufferResolvable} attachment The image for the emoji.
   * @param {string} name The name for the emoji.
   * @returns {Promise<Emoji>} The created emoji.
   * @example
   * // create a new emoji from a url
   * guild.createEmoji('https://i.imgur.com/w3duR07.png', 'rip')
   *  .then(emoji => console.log(`Created new emoji with name ${emoji.name}!`))
   *  .catch(console.error);
   * @example
   * // create a new emoji from a file on your computer
   * guild.createEmoji('./memes/banana.png', 'banana')
   *  .then(emoji => console.log(`Created new emoji with name ${emoji.name}!`))
   *  .catch(console.error);
   */
  createEmoji(attachment, name) {
    return new Promise(resolve => {
      if (attachment.startsWith('data:')) {
        resolve(this.client.rest.methods.createEmoji(this, attachment, name));
      } else {
        this.client.resolver.resolveBuffer(attachment).then(data =>
          resolve(this.client.rest.methods.createEmoji(this, data, name))
        );
      }
    });
  }

  /**
   * Delete an emoji.
   * @param {Emoji|string} emoji The emoji to delete.
   * @returns {Promise}
   */
  deleteEmoji(emoji) {
    if (!(emoji instanceof Emoji)) emoji = this.emojis.get(emoji);
    return this.client.rest.methods.deleteEmoji(emoji);
  }

  /**
   * Causes the Client to leave the guild.
   * @returns {Promise<Guild>}
   * @example
   * // leave a guild
   * guild.leave()
   *  .then(g => console.log(`Left the guild ${g}`))
   *  .catch(console.error);
   */
  leave() {
    return this.client.rest.methods.leaveGuild(this);
  }

  /**
   * Causes the Client to delete the guild.
   * @returns {Promise<Guild>}
   * @example
   * // delete a guild
   * guild.delete()
   *  .then(g => console.log(`Deleted the guild ${g}`))
   *  .catch(console.error);
   */
  delete() {
    return this.client.rest.methods.deleteGuild(this);
  }

  /**
   * Set the position of a role in this guild
   * @param {string|Role} role the role to edit, can be a role object or a role ID.
   * @param {number} position the new position of the role
   * @returns {Promise<Guild>}
   */
  setRolePosition(role, position) {
    if (typeof role === 'string') {
      role = this.roles.get(role);
      if (!role) return Promise.reject(new Error('Supplied role is not a role or string.'));
    }

    position = Number(position);
    if (isNaN(position)) return Promise.reject(new Error('Supplied position is not a number.'));

    const lowestAffected = Math.min(role.position, position);
    const highestAffected = Math.max(role.position, position);

    const rolesToUpdate = this.roles.filter(r => r.position >= lowestAffected && r.position <= highestAffected);

    // stop role positions getting stupidly inflated
    if (position > role.position) {
      position = rolesToUpdate.first().position;
    } else {
      position = rolesToUpdate.last().position;
    }

    const updatedRoles = [];

    for (const uRole of rolesToUpdate.values()) {
      updatedRoles.push({
        id: uRole.id,
        position: uRole.id === role.id ? position : uRole.position + (position < role.position ? 1 : -1),
      });
    }

    return this.client.rest.methods.setRolePositions(this.id, updatedRoles);
  }

  /**
   * Whether this Guild equals another Guild. It compares all properties, so for most operations
   * it is advisable to just compare `guild.id === guild2.id` as it is much faster and is often
   * what most users need.
   * @param {Guild} guild Guild to compare with
   * @returns {boolean}
   */
  equals(guild) {
    let equal =
      guild &&
      this.id === guild.id &&
      this.available === !guild.unavailable &&
      this.splash === guild.splash &&
      this.region === guild.region &&
      this.name === guild.name &&
      this.memberCount === guild.member_count &&
      this.large === guild.large &&
      this.icon === guild.icon &&
      arraysEqual(this.features, guild.features) &&
      this.ownerID === guild.owner_id &&
      this.verificationLevel === guild.verification_level &&
      this.embedEnabled === guild.embed_enabled;

    if (equal) {
      if (this.embedChannel) {
        if (this.embedChannel.id !== guild.embed_channel_id) equal = false;
      } else if (guild.embed_channel_id) {
        equal = false;
      }
    }

    return equal;
  }

  /**
   * When concatenated with a string, this automatically concatenates the guild's name instead of the Guild object.
   * @returns {string}
   * @example
   * // logs: Hello from My Guild!
   * console.log(`Hello from ${guild}!`);
   * @example
   * // logs: Hello from My Guild!
   * console.log(`Hello from ' + guild + '!');
   */
  toString() {
    return this.name;
  }

  _addMember(guildUser, emitEvent = true) {
    const existing = this.members.has(guildUser.user.id);
    if (!(guildUser.user instanceof User)) guildUser.user = this.client.dataManager.newUser(guildUser.user);

    guildUser.joined_at = guildUser.joined_at || 0;
    const member = new GuildMember(this, guildUser);
    this.members.set(member.id, member);

    if (this._rawVoiceStates && this._rawVoiceStates.has(member.user.id)) {
      const voiceState = this._rawVoiceStates.get(member.user.id);
      member.serverMute = voiceState.mute;
      member.serverDeaf = voiceState.deaf;
      member.selfMute = voiceState.self_mute;
      member.selfDeaf = voiceState.self_deaf;
      member.voiceSessionID = voiceState.session_id;
      member.voiceChannelID = voiceState.channel_id;
      if (this.client.channels.has(voiceState.channel_id)) {
        this.client.channels.get(voiceState.channel_id).members.set(member.user.id, member);
      } else {
        this.client.emit('warn', `Member ${member.id} added in guild ${this.id} with an uncached voice channel`);
      }
    }

    /**
     * Emitted whenever a user joins a guild.
     * @event Client#guildMemberAdd
     * @param {GuildMember} member The member that has joined a guild
     */
    if (this.client.ws.status === Constants.Status.READY && emitEvent && !existing) {
      this.client.emit(Constants.Events.GUILD_MEMBER_ADD, member);
    }

    this._checkChunks();
    return member;
  }

  _updateMember(member, data) {
    const oldMember = cloneObject(member);

    if (data.roles) member._roles = data.roles;
    if (typeof data.nick !== 'undefined') member.nickname = data.nick;

    const notSame = member.nickname !== oldMember.nickname || !arraysEqual(member._roles, oldMember._roles);

    if (this.client.ws.status === Constants.Status.READY && notSame) {
      /**
       * Emitted whenever a guild member changes - i.e. new role, removed role, nickname
       * @event Client#guildMemberUpdate
       * @param {GuildMember} oldMember The member before the update
       * @param {GuildMember} newMember The member after the update
       */
      this.client.emit(Constants.Events.GUILD_MEMBER_UPDATE, oldMember, member);
    }

    return {
      old: oldMember,
      mem: member,
    };
  }

  _removeMember(guildMember) {
    this.members.delete(guildMember.id);
    this._checkChunks();
  }

  _memberSpeakUpdate(user, speaking) {
    const member = this.members.get(user);
    if (member && member.speaking !== speaking) {
      member.speaking = speaking;
      /**
       * Emitted once a guild member starts/stops speaking
       * @event Client#guildMemberSpeaking
       * @param {GuildMember} member The member that started/stopped speaking
       * @param {boolean} speaking Whether or not the member is speaking
       */
      this.client.emit(Constants.Events.GUILD_MEMBER_SPEAKING, member, speaking);
    }
  }

  _setPresence(id, presence) {
    if (this.presences.get(id)) {
      this.presences.get(id).update(presence);
      return;
    }
    this.presences.set(id, new Presence(presence));
  }

  _checkChunks() {
    if (this._fetchWaiter) {
      if (this.members.size === this.memberCount) {
        this._fetchWaiter(this);
        this._fetchWaiter = null;
      }
    }
  }
}

module.exports = Guild;
