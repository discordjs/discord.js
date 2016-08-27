const User = require('./User');
const GuildMember = require('./GuildMember');
const Constants = require('../util/Constants');
const cloneObject = require('../util/CloneObject');
const Role = require('./Role');
const Collection = require('../util/Collection');

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
     * A Collection of members that are in this Guild. The key is the member's ID, the value is the member.
     * @type {Collection<String, GuildMember>}
     */
    this.members = new Collection();

    /**
     * A Collection of channels that are in this Guild. The key is the channel's ID, the value is the channel.
     * @type {Collection<String, GuildChannel>}
     */
    this.channels = new Collection();

    /**
     * A Collection of roles that are in this Guild. The key is the role's ID, the value is the role.
     * @type {Collection<String, Role>}
     */
    this.roles = new Collection();

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
      guildUser.user = this.client.dataManager.newUser(guildUser.user);
    }

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

    if (this.client.ws.status === Constants.Status.READY && !noEvent) {
      this.client.emit(Constants.Events.GUILD_MEMBER_ADD, this, member);
    }

    return member;
  }

  _updateMember(member, data) {
    const oldMember = cloneObject(member);

    if (data.roles) {
      member._roles = data.roles;
    } else {
      member.nickname = data.nick;
    }

    const notSame = (
      member.nickname !== oldMember.nickname &&
      !arraysEqual(member._roles, oldMember._roles)
    );

    if (this.client.ws.status === Constants.Status.READY && notSame) {
      /**
      * Emitted whenever a Guild Member changes - i.e. new role, removed role, nickname
      *
      * @event Client#guildMemberUpdate
      * @param {Guild} guild the guild that the update affects
      * @param {GuildMember} oldMember the member before the update
      * @param {GuildMember} newMember the member after the update
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
      data &&
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

  _memberSpeakUpdate(user, speaking) {
    const member = this.members.get(user);
    if (member && member.speaking !== speaking) {
      member.speaking = speaking;
      /**
       * Emitted once a Guild Member starts/stops speaking
       * @event Client#guildMemberSpeaking
       * @param {GuildMember} member the member that started/stopped speaking
       * @param {Boolean} speaking whether or not the member is speaking
       */
      this.client.emit(Constants.Events.GUILD_MEMBER_SPEAKING, member, speaking);
    }
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
      this.members.clear();
      for (const guildUser of data.members) {
        this._addMember(guildUser);
      }
    }

    /**
     * The owner of the guild
     * @type {User}
     */
    this.owner = this.members.get(data.owner_id);

    if (data.channels) {
      this.channels.clear();
      for (const channel of data.channels) {
        this.client.dataManager.newChannel(channel, this);
      }
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
   * Gets the URL to this guild's icon (if it has one, otherwise it returns null)
   * @type {?String}
   * @readonly
   */
  get iconURL() {
    if (!this.icon) {
      return null;
    }
    return Constants.Endpoints.guildIcon(this.id, this.icon);
  }
}

module.exports = Guild;
