const User = require('./User');
const Role = require('./Role');
const Emoji = require('./Emoji');
const GuildMember = require('./GuildMember');
const Constants = require('../util/Constants');
const Collection = require('../util/Collection');
const cloneObject = require('../util/CloneObject');
const arraysEqual = require('../util/ArraysEqual');

/**
 * Represents a Guild (or a Server) on Discord.
 * <info>It's recommended to see if a guild is available before performing operations or reading data from it. You can
 * check this with `guild.available`.</info>
 */
class Guild {
  constructor(client, data) {
    /**
     * The Client that created the instance of the the Guild.
     * @type {Client}
     */
    this.client = client;
    Object.defineProperty(this, 'client', { enumerable: false, configurable: false });

    /**
     * A Collection of members that are in this Guild. The key is the member's ID, the value is the member.
     * @type {Collection<string, GuildMember>}
     */
    this.members = new Collection();

    /**
     * A Collection of channels that are in this Guild. The key is the channel's ID, the value is the channel.
     * @type {Collection<string, GuildChannel>}
     */
    this.channels = new Collection();

    /**
     * A Collection of roles that are in this Guild. The key is the role's ID, the value is the role.
     * @type {Collection<string, Role>}
     */
    this.roles = new Collection();

    if (!data) return;
    if (data.unavailable) {
      /**
       * Whether the Guild is available to access. If it is not available, it indicates a server outage.
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
     * The full amount of members in this Guild as of `READY`
     * @type {number}
     */
    this.memberCount = data.member_count;

    /**
     * Whether the guild is "large" (has more than 250 members)
     * @type {boolean}
     */
    this.large = data.large;

    /**
     * An array of guild features.
     * @type {Object[]}
     */
    this.features = data.features;

    /**
     * An array of guild emojis.
     * @type {Object[]}
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

    this.id = data.id;
    this.available = !data.unavailable;
    this.features = data.features || [];
    this._joinDate = new Date(data.joined_at).getTime();

    if (data.members) {
      this.members.clear();
      for (const guildUser of data.members) this._addMember(guildUser, false);
    }

    if (data.owner_id) this.ownerID = data.owner_id;

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
        const user = this.client.users.get(presence.user.id);
        if (user) {
          user.status = presence.status;
          user.game = presence.game;
        }
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
   * The time the guild was created
   * @readonly
   * @type {Date}
   */
  get creationDate() {
    return new Date((this.id / 4194304) + 1420070400000);
  }

  /**
   * The date at which the logged-in client joined the guild.
   * @type {Date}
   */
  get joinDate() {
    return new Date(this._joinDate);
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
   * The owner of the Guild
   * @type {GuildMember}
   * @readonly
   */
  get owner() {
    return this.members.get(this.ownerID);
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
   * Returns the GuildMember form of a User object, if the User is present in the guild.
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
   * .catch(console.log);
   */
  edit(data) {
    return this.client.rest.methods.updateGuild(this, data);
  }

  /**
   * Edit the name of the Guild.
   * @param {string} name The new name of the Guild
   * @returns {Promise<Guild>}
   * @example
   * // edit the guild name
   * guild.setName('Discord Guild')
   *  .then(updated => console.log(`Updated guild name to ${guild.name}`))
   *  .catch(console.log);
   */
  setName(name) {
    return this.edit({ name });
  }

  /**
   * Edit the region of the Guild.
   * @param {Region} region The new region of the guild.
   * @returns {Promise<Guild>}
   * @example
   * // edit the guild region
   * guild.setRegion('london')
   *  .then(updated => console.log(`Updated guild region to ${guild.region}`))
   *  .catch(console.log);
   */
  setRegion(region) {
    return this.edit({ region });
  }

  /**
   * Edit the verification level of the Guild.
   * @param {VerificationLevel} verificationLevel The new verification level of the guild
   * @returns {Promise<Guild>}
   * @example
   * // edit the guild verification level
   * guild.setVerificationLevel(1)
   *  .then(updated => console.log(`Updated guild verification level to ${guild.verificationLevel}`))
   *  .catch(console.log);
   */
  setVerificationLevel(verificationLevel) {
    return this.edit({ verificationLevel });
  }

  /**
   * Edit the AFK channel of the Guild.
   * @param {GuildChannelResolvable} afkChannel The new AFK channel
   * @returns {Promise<Guild>}
   * @example
   * // edit the guild AFK channel
   * guild.setAFKChannel(channel)
   *  .then(updated => console.log(`Updated guild AFK channel to ${guild.afkChannel}`))
   *  .catch(console.log);
   */
  setAFKChannel(afkChannel) {
    return this.edit({ afkChannel });
  }

  /**
   * Edit the AFK timeout of the Guild.
   * @param {number} afkTimeout The time in seconds that a user must be idle to be considered AFK
   * @returns {Promise<Guild>}
   * @example
   * // edit the guild AFK channel
   * guild.setAFKTimeout(60)
   *  .then(updated => console.log(`Updated guild AFK timeout to ${guild.afkTimeout}`))
   *  .catch(console.log);
   */
  setAFKTimeout(afkTimeout) {
    return this.edit({ afkTimeout });
  }

  /**
   * Set a new Guild Icon.
   * @param {Base64Resolvable} icon The new icon of the guild
   * @returns {Promise<Guild>}
   * @example
   * // edit the guild icon
   * guild.setIcon(fs.readFileSync('./icon.png'))
   *  .then(updated => console.log('Updated the guild icon'))
   *  .catch(console.log);
   */
  setIcon(icon) {
    return this.edit({ icon });
  }

  /**
   * Sets a new owner of the Guild.
   * @param {GuildMemberResolvable} owner The new owner of the Guild
   * @returns {Promise<Guild>}
   * @example
   * // edit the guild owner
   * guild.setOwner(guilds.members[0])
   *  .then(updated => console.log(`Updated the guild owner to ${updated.owner.username}`))
   *  .catch(console.log);
   */
  setOwner(owner) {
    return this.edit({ owner });
  }

  /**
   * Set a new Guild Splash Logo.
   * @param {Base64Resolvable} splash The new splash screen of the guild
   * @returns {Promise<Guild>}
   * @example
   * // edit the guild splash
   * guild.setIcon(fs.readFileSync('./splash.png'))
   *  .then(updated => console.log('Updated the guild splash'))
   *  .catch(console.log);
   */
  setSplash(splash) {
    return this.edit({ splash });
  }

  /**
   * Bans a user from the guild.
   * @param {UserResolvable} user The user to ban
   * @param {number} [deleteDays=0] The amount of days worth of messages from this user that should
   * also be deleted. Between `0` and `7`.
   * @returns {Promise<GuildMember|User>}
   * @example
   * // ban a user
   * guild.ban('123123123123');
   */
  ban(user, deleteDays = 0) {
    return this.client.rest.methods.banGuildMember(this, user, deleteDays);
  }

  /**
   * Unbans a user from the Guild.
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
   * Fetch a Collection of banned users in this Guild.
   * @returns {Promise<Collection<string, User>>}
   */
  fetchBans() {
    return this.client.rest.methods.getGuildBans(this);
  }

  /**
   * Fetch a Collection of invites to this Guild. Resolves with a Collection mapping invites by their codes.
   * @returns {Promise<Collection<string, Invite>>}
   */
  fetchInvites() {
    return this.client.rest.methods.getGuildInvites(this);
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
   * Fetches all the members in the Guild, even if they are offline. If the Guild has less than 250 members,
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
   * Creates a new Channel in the Guild.
   * @param {string} name The name of the new channel
   * @param {string} type The type of the new channel, either `text` or `voice`
   * @returns {Promise<TextChannel|VoiceChannel>}
   * @example
   * // create a new text channel
   * guild.createChannel('new general', 'text')
   *  .then(channel => console.log(`Created new channel ${channel}`))
   *  .catch(console.log);
   */
  createChannel(name, type) {
    return this.client.rest.methods.createChannel(this, name, type);
  }

  /**
   * Creates a new role in the guild, and optionally updates it with the given information.
   * @param {RoleData} [data] The data to update the role with
   * @returns {Promise<Role>}
   * @example
   * // create a new role
   * guild.createRole()
   *  .then(role => console.log(`Created role ${role}`))
   *  .catch(console.log);
   * @example
   * // create a new role with data
   * guild.createRole({ name: 'Super Cool People' })
   *   .then(role => console.log(`Created role ${role}`))
   *   .catch(console.log)
   */
  createRole(data) {
    const create = this.client.rest.methods.createGuildRole(this);
    if (!data) return create;
    return create.then(role => role.edit(data));
  }

  /**
   * Causes the Client to leave the guild.
   * @returns {Promise<Guild>}
   * @example
   * // leave a guild
   * guild.leave()
   *  .then(g => console.log(`Left the guild ${g}`))
   *  .catch(console.log);
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
   *  .catch(console.log);
   */
  delete() {
    return this.client.rest.methods.deleteGuild(this);
  }

  /**
   * Syncs this guild (already done automatically every 30 seconds). Only applicable to user accounts.
   */
  sync() {
    if (!this.client.user.bot) this.client.syncGuilds([this]);
  }

  /**
   * Whether this Guild equals another Guild. It compares all properties, so for most operations
   * it is advisable to just compare `guild.id === guild2.id` as it is much faster and is often
   * what most users need.
   * @param {Guild} guild The guild to compare
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
   * When concatenated with a string, this automatically concatenates the Guild's name instead of the Guild object.
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
    if (!(guildUser.user instanceof User)) guildUser.user = this.client.dataManager.newUser(guildUser.user);

    guildUser.joined_at = guildUser.joined_at || 0;
    const member = new GuildMember(this, guildUser);
    this.members.set(member.id, member);

    if (this._rawVoiceStates && this._rawVoiceStates.get(member.user.id)) {
      const voiceState = this._rawVoiceStates.get(member.user.id);
      member.serverMute = voiceState.mute;
      member.serverDeaf = voiceState.deaf;
      member.selfMute = voiceState.self_mute;
      member.selfDeaf = voiceState.self_deaf;
      member.voiceSessionID = voiceState.session_id;
      member.voiceChannelID = voiceState.channel_id;
      this.channels.get(voiceState.channel_id).members.set(member.user.id, member);
    }

    /**
     * Emitted whenever a user joins a guild.
     * @event Client#guildMemberAdd
     * @param {Guild} guild The guild that the user has joined
     * @param {GuildMember} member The member that has joined
     */
    if (this.client.ws.status === Constants.Status.READY && emitEvent) {
      this.client.emit(Constants.Events.GUILD_MEMBER_ADD, this, member);
    }

    this._checkChunks();
    return member;
  }

  _updateMember(member, data) {
    const oldMember = cloneObject(member);

    if (data.roles) member._roles = data.roles;
    member.nickname = data.nick;

    const notSame = member.nickname !== oldMember.nickname || !arraysEqual(member._roles, oldMember._roles);

    if (this.client.ws.status === Constants.Status.READY && notSame) {
      /**
       * Emitted whenever a Guild Member changes - i.e. new role, removed role, nickname
       * @event Client#guildMemberUpdate
       * @param {Guild} guild The guild that the update affects
       * @param {GuildMember} oldMember The member before the update
       * @param {GuildMember} newMember The member after the update
       */
      this.client.emit(Constants.Events.GUILD_MEMBER_UPDATE, this, oldMember, member);
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
       * Emitted once a Guild Member starts/stops speaking
       * @event Client#guildMemberSpeaking
       * @param {GuildMember} member The member that started/stopped speaking
       * @param {boolean} speaking Whether or not the member is speaking
       */
      this.client.emit(Constants.Events.GUILD_MEMBER_SPEAKING, member, speaking);
    }
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
