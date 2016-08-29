const TextBasedChannel = require('./interface/TextBasedChannel');

/**
 * Represents a Member of a Guild on Discord
 * @implements {TextBasedChannel}
 */
class GuildMember {
  constructor(guild, data) {
    /**
     * The client that instantiated this GuildMember
     * @type {Client}
     */
    this.client = guild.client;
    /**
     * The guild that this member is part of
     * @type {Guild}
     */
    this.guild = guild;
    /**
     * The user that this guild member instance Represents
     * @type {User}
     */
    this.user = {};
    this._roles = [];
    if (data) {
      this.setup(data);
    }
  }

  setup(data) {
    this.user = data.user;
    /**
     * Whether this member is deafened server-wide
     * @type {Boolean}
     */
    this.serverDeaf = data.deaf;
    /**
     * Whether this member is muted server-wide
     * @type {Boolean}
     */
    this.serverMute = data.mute;
    /**
     * Whether this member is self-muted
     * @type {Boolean}
     */
    this.selfMute = data.self_mute;
    /**
     * Whether this member is self-deafened
     * @type {Boolean}
     */
    this.selfDeaf = data.self_deaf;
    /**
     * The voice session ID of this member, if any
     * @type {?String}
     */
    this.voiceSessionID = data.session_id;
    /**
     * The voice channel ID of this member, if any
     * @type {?String}
     */
    this.voiceChannelID = data.channel_id;
    /**
     * The date this member joined the guild
     * @type {Date}
     */
    this.joinDate = new Date(data.joined_at);
    /**
     * Whether this meember is speaking
     * @type {?Boolean}
     */
    this.speaking = this.speaking;
    /**
     * The nickname of this Guild Member, if they have one
     * @type {?String}
     */
    this.nickname = data.nick;
    this._roles = data.roles;
  }

  /**
   * A list of roles that are applied to this GuildMember
   * @type {Array<Role>}
   * @readonly
   */
  get roles() {
    const list = [];
    const everyoneRole = this.guild.roles.get(this.guild.id);

    if (everyoneRole) {
      list.push(everyoneRole);
    }

    for (const roleID of this._roles) {
      const role = this.guild.roles.get(roleID);
      if (role) {
        list.push(role);
      }
    }

    return list;
  }

  /**
   * Whether this member is muted in any way
   * @type {Boolean}
   * @readonly
   */
  get mute() {
    return this.selfMute || this.serverMute;
  }

  /**
   * Whether this member is deafened in any way
   * @type {Boolean}
   * @readonly
   */
  get deaf() {
    return this.selfDeaf || this.serverDeaf;
  }

  /**
   * The voice channel this member is in, if any
   * @type {?VoiceChannel}
   * @readonly
   */
  get voiceChannel() {
    return this.guild.channels.get(this.voiceChannelID);
  }

  /**
   * The ID of this User
   * @type {String}
   * @readonly
   */
  get id() {
    return this.user.id;
  }

  /**
   * Mute/unmute a user
   * @param {Boolean} mute whether or not the member should be muted
   * @returns {Promise<GuildMember, Error>}
   */
  setMute(mute) {
    return this.edit({ mute });
  }

  /**
   * Deafen/undeafen a user
   * @param {Boolean} deaf whether or not the member should be deafened
   * @returns {Promise<GuildMember, Error>}
   */
  setDeaf(deaf) {
    return this.edit({ deaf });
  }

  /**
   * Moves the Guild Member to the given channel.
   * @param {ChannelResolvable} channel the channel to move the member to
   * @returns {Promise<GuildMember, Error>}
   */
  setVoiceChannel(channel) {
    return this.edit({ channel });
  }

  /**
   * Sets the Roles applied to the member.
   * @param {Collection<String, Role>|Array<Role>} roles the roles to apply
   * @returns {Promise<GuildMember, Error>}
   */
  setRoles(roles) {
    return this.edit({ roles });
  }

  /**
   * Set the nickname for the Guild Member
   * @param {String} nick the nickname for the Guild Member
   * @returns {Promise<GuildMember, Error>}
   */
  setNickname(nick) {
    return this.edit({ nick });
  }

  /**
   * Edit a Guild Member
   * @param {GuildmemberEditData} data the data to edit the member with
   * @returns {Promise<GuildMember, Error>}
   */
  edit(data) {
    return this.client.rest.methods.updateGuildMember(this, data);
  }

  /**
   * Deletes any DM's with this Guild Member
   * @returns {Promise<DMChannel>}
   */
  deleteDM() {
    return this.client.rest.methods.deleteChannel(this);
  }

  /**
   * Kick this member from the Guild
   * @returns {Promise<GuildMember>}
   */
  kick() {
    return this.client.rest.methods.kickGuildMember(this.guild, this);
  }

  /**
   * Ban this Guild Member
   * @param {number} [deleteDays=0] The amount of days worth of messages from this member that should
   * also be deleted. Between `0` and `7`.
   * @returns {Promise<GuildMember, Error>}
   * @example
   * // ban a guild member
   * guildMember.ban(7);
   */
  ban(deleteDays = 0) {
    return this.client.rest.methods.banGuildMember(this, deleteDays);
  }

  sendMessage() {
    return;
  }

  sendTTSMessage() {
    return;
  }

  sendFile() {
    return;
  }
}

TextBasedChannel.applyToClass(GuildMember);

module.exports = GuildMember;
