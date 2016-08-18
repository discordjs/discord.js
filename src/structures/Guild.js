const User = require('./User');
const GuildMember = require('./GuildMember');
const GuildDataStore = require('./datastore/GuildDataStore');
const Constants = require('../util/Constants');
const Role = require('./Role');

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
 * Represents a Guild (or a Server) on Discord.
 */
class Guild {
  constructor(client, data) {
    /**
     * The Client that created the instance of the the Guild.
     * @type {Client}
     */
    this.client = client;

    /**
     * The data store of the Guild.
     * @type {GuildDataStore}
     */
    this.store = new GuildDataStore();

    if (!data) {
      return;
    }

    if (data.unavailable) {
      /**
       * Whether the Guild is available to access. If it is not available, it indicates a server outage.
       * @type {Boolean}
       */
      this.available = false;
      /**
       * The Unique ID of the Guild, useful for comparisons.
       * @type {String}
       */
      this.id = data.id;
    } else {
      this.available = true;
      this.setup(data);
    }
  }

  _addMember(guildUser, noEvent) {
    if (!(guildUser.user instanceof User)) {
      guildUser.user = this.client.store.newUser(guildUser.user);
    }

    guildUser.joined_at = guildUser.joined_at || 0;
    const member = this.store.add('members', new GuildMember(this, guildUser));
    if (this.client.ws.status === Constants.Status.READY && !noEvent) {
      this.client.emit(Constants.Events.GUILD_MEMBER_ADD, this, member);
    }

    return member;
  }

  _updateMember(member, data) {
    const oldRoles = member.roles;

    member._roles = data.roles;
    if (this.client.ws.status === Constants.Status.READY) {
      this.client.emit(Constants.Events.GUILD_MEMBER_ROLES_UPDATE, this, oldRoles, member.roles);
    }
  }

  _removeMember(guildMember) {
    this.store.remove('members', guildMember);
  }

  /**
   * When concatenated with a String, this automatically concatenates the Guild's name instead of the Guild object.
   * @returns {String}
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

  /**
   * Tries to kick a member from the guild.
   * @param {GuildMemberResolvable} member the member to kick
   * @returns {Promise<GuildMember, Error>}
   * @example
   * // kicks a member from a guild:
   * guild.kick(message.author)
   *  .then(member => console.log(`Kicked ${member}`))
   *  .catch(error => console.log(error));
   */
  kick(member) {
    return this.member(member).kick();
  }

  /**
   * Returns the GuildMember form of a User object, if the User is present in the guild.
   * @param {UserResolvable} user the user that you want to obtain the GuildMember of.
   * @returns {GuildMember|null}
   * @example
   * // get the guild member of a user
   * const member = guild.member(message.author);
   */
  member(user) {
    return this.client.resolver.resolveGuildMember(this, user);
  }

  /**
   * Whether this Guild equals another Guild. It compares all properties, so for most operations
   * it is advisable to just compare `guild.id === guild2.id` as it is much faster and is often
   * what most users need.
   * @param {Guild} guild the guild to compare
   * @returns {Boolean}
   */
  equals(data) {
    let base =
      this.id === data.id &&
      this.available === !data.unavailable &&
      this.splash === data.splash &&
      this.region === data.region &&
      this.name === data.name &&
      this.memberCount === data.member_count &&
      this.large === data.large &&
      this.icon === data.icon &&
      arraysEqual(this.features, data.features) &&
      this.owner.id === data.owner_id &&
      this.verificationLevel === data.verification_level &&
      this.embedEnabled === data.embed_enabled;

    if (base) {
      if (this.embedChannel) {
        if (this.embedChannel.id !== data.embed_channel_id) {
          base = false;
        }
      } else if (data.embed_channel_id) {
        base = false;
      }
    }

    return base;
  }

  /**
   * Sets up the Guild
   * @param {any} data
   * @returns {null}
   * @private
   */
  setup(data) {
    this.id = data.id;
    this.available = !data.unavailable;
    /**
     * The hash of the guild splash image, or null if no splash (VIP only)
     * @type {?String}
     */
    this.splash = data.splash;
    /**
     * The region the guild is located in
     * @type {String}
     */
    this.region = data.region;
    /**
     * The name of the guild
     * @type {String}
     */
    this.name = data.name;
    /**
     * The amount of initial members in the guild.
     * @type {Number}
     */
    this.memberCount = data.member_count;
    /**
     * Whether the guild is "large" (has more than 250 members)
     * @type {Boolean}
     */
    this.large = data.large;
    /**
     * The date at which the logged-in client joined the guild.
     * @type {Date}
     */
    this.joinDate = new Date(data.joined_at);
    /**
     * The hash of the guild icon, or null if there is no icon.
     * @type {?String}
     */
    this.icon = data.icon;
    /**
     * An array of guild features.
     * @type {Array<Object>}
     */
    this.features = data.features;
    /**
     * An array of guild emojis.
     * @type {Array<Object>}
     */
    this.emojis = data.emojis;
    /**
     * The time in seconds before a user is counted as "away from keyboard".
     * @type {?Number}
     */
    this.afkTimeout = data.afk_timeout;
    /**
     * The ID of the voice channel where AFK members are moved.
     * @type {?String}
     */
    this.afkChannelID = data.afk_channel_id;
    /**
     * Whether embedded images are enabled on this guild.
     * @type {Boolean}
     */
    this.embedEnabled = data.embed_enabled;
    /**
     * The verification level of the guild.
     * @type {Number}
     */
    this.verificationLevel = data.verification_level;
    this.features = data.features || [];

    if (data.members) {
      this.store.clear('members');
      for (const guildUser of data.members) {
        this._addMember(guildUser);
      }
    }

    /**
     * The owner of the guild
     * @type {User}
     */
    this.owner = this.store.get('members', data.owner_id);

    if (data.channels) {
      this.store.clear('channels');
      for (const channel of data.channels) {
        this.client.store.newChannel(channel, this);
      }
    }

    /**
     * The embed channel of the Guild.
     * @type {GuildChannel}
     */
    this.embedChannel = this.store.get('channels', data.embed_channel_id);

    if (data.roles) {
      this.store.clear('roles');
      for (const role of data.roles) {
        this.store.add('roles', new Role(this, role));
      }
    }

    if (data.presences) {
      for (const presence of data.presences) {
        const user = this.client.store.get('users', presence.user.id);
        if (user) {
          user.status = presence.status;
          user.game = presence.game;
        }
      }
    }

    if (data.voice_states) {
      for (const voiceState of data.voice_states) {
        const member = this.store.get('members', voiceState.user_id);
        if (member) {
          member.serverMute = voiceState.mute;
          member.serverDeaf = voiceState.deaf;
          member.selfMute = voiceState.self_mute;
          member.selfDeaf = voiceState.self_deaf;
          member.voiceSessionID = voiceState.session_id;
          member.voiceChannelID = voiceState.channel_id;
        }
      }
    }
  }

  /**
   * Creates a new Channel in the Guild.
   * @param {String} name the name of the new channel.
   * @param {String} type the type of the new channel, either `text` or `voice`.
   * @returns {Promise<TextChannel|VoiceChannel, Error>}
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
   * Creates a new role in the guild, as of now this is just a blank role.
   * @returns {Promise<Role, Error>}
   * @example
   * // create a new role
   * guild.createRole()
   *  .then(role => console.log(`Created role ${role}`))
   *  .catch(console.log);
   */
  createRole() {
    return this.client.rest.methods.createGuildRole(this);
  }

  /**
   * Causes the Client to leave the guild.
   * @returns {Promise<Guild, Error>}
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
   * @returns {Promise<Guild, Error>}
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
   * Updates the Guild with new information - e.g. a new name.
   * @param {GuildEditData} data the data to update the guild with.
   * @returns {Promise<Guild, Error>}
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
   * @param {String} name the new name of the Guild.
   * @returns {Promise<Guild, Error>}
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
   * @param {Region} region the new region of the guild.
   * @returns {Promise<Guild, Error>}
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
   * @param {VerificationLevel} verificationLevel the new verification level of the guild.
   * @returns {Promise<Guild, Error>}
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
   * @param {GuildChannelResolvable} afkChannel the new AFK channel.
   * @returns {Promise<Guild, Error>}
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
   * @param {Number} afkTimeout the time in seconds that a user must be idle to be considered AFK.
   * @returns {Promise<Guild, Error>}
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
   * @param {Base64Resolvable} icon the new icon of the guild.
   * @returns {Promise<Guild, Error>}
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
   * @param {GuildMemberResolvable} owner the new owner of the Guild.
   * @returns {Promise<Guild, Error>}
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
   * @param {Base64Resolvable} splash the new splash screen of the guild.
   * @returns {Promise<Guild, Error>}
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
   * The channels in the guild.
   * @type {Array<GuildChannel>}
   * @readonly
   */
  get channels() { return this.store.getAsArray('channels'); }

  /**
   * A dictionary mapping the IDs of channels in this guild to the channel itself. If you want to find a channel
   * in the guild by ID, use `guild.$channels[id]` rather than filtering `guild.channels` as it is much more efficient.
   * @readonly
   * @type {Object<String, Channel>}
   */
  get $channels() { return this.store.data.channels; }

  /**
   * The roles in the guild.
   * @type {Array<Role>}
   * @readonly
   */
  get roles() { return this.store.getAsArray('roles'); }

  /**
   * A dictionary mapping the IDs of roles in this guild to the role itself. If you want to find a role
   * in the guild by ID, use `guild.$roles[id]` rather than filtering `guild.roles` as it is much more efficient.
   * @readonly
   * @type {Object<String, Role>}
   */
  get $roles() { return this.store.data.roles; }

  /**
   * The members of the guild.
   * @type {Array<GuildMember>}
   * @readonly
   */
  get members() { return this.store.getAsArray('members'); }

  /**
   * A dictionary mapping the IDs of members in this guild to the member object itself. If you want to find a member
   * in the guild by ID, use `guild.$members[id]` rather than filtering `guild.members` as it is much more efficient.
   * @readonly
   * @type {Object<String, GuildMember>}
   */
  get $members() { return this.store.data.members; }
}

module.exports = Guild;
