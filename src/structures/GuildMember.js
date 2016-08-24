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

  sendMessage() {
    return;
  }

  sendTTSMessage() {
    return;
  }
}

TextBasedChannel.applyToClass(GuildMember);

module.exports = GuildMember;
