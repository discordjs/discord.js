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
 * @class Guild
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

  createChannel(name, type) {
    return this.client.rest.methods.createChannel(this, name, type);
  }

  createRole() {
    return this.client.rest.methods.createGuildRole(this);
  }

  leave() {
    return this.client.rest.methods.leaveGuild(this);
  }

  delete() {
    return this.client.rest.methods.deleteGuild(this);
  }

  edit(data) {
    return this.client.rest.methods.updateGuild(this, data);
  }

  setName(name) {
    return this.edit({ name });
  }

  setRegion(region) {
    return this.edit({ region });
  }

  setVerificationLevel(verificationLevel) {
    return this.edit({ verificationLevel });
  }

  setAFKChannel(afkChannel) {
    return this.edit({ afkChannel });
  }

  setAFKTimeout(afkTimeout) {
    return this.edit({ afkTimeout });
  }

  setIcon(icon) {
    return this.edit({ icon });
  }

  setOwner(owner) {
    return this.edit({ owner });
  }

  setSplash(splash) {
    return this.edit({ splash });
  }

  get channels() { return this.store.getAsArray('channels'); }

  get $channels() { return this.store.data.channels; }

  get roles() { return this.store.getAsArray('roles'); }

  get $roles() { return this.store.data.roles; }

  get members() { return this.store.getAsArray('members'); }

  get $members() { return this.store.data.members; }
}

module.exports = Guild;
