const TextBasedChannel = require('./interface/TextBasedChannel');
const Collection = require('../util/Collection');

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
    if (data) this.setup(data);
  }

  setup(data) {
    this.user = data.user;
    /**
     * Whether this member is deafened server-wide
     * @type {boolean}
     */
    this.serverDeaf = data.deaf;
    /**
     * Whether this member is muted server-wide
     * @type {boolean}
     */
    this.serverMute = data.mute;
    /**
     * Whether this member is self-muted
     * @type {boolean}
     */
    this.selfMute = data.self_mute;
    /**
     * Whether this member is self-deafened
     * @type {boolean}
     */
    this.selfDeaf = data.self_deaf;
    /**
     * The voice session ID of this member, if any
     * @type {?string}
     */
    this.voiceSessionID = data.session_id;
    /**
     * The voice channel ID of this member, if any
     * @type {?string}
     */
    this.voiceChannelID = data.channel_id;
    this._joinDate = new Date(data.joined_at).getTime();
    /**
     * Whether this meember is speaking
     * @type {?boolean}
     */
    this.speaking = this.speaking;
    /**
     * The nickname of this Guild Member, if they have one
     * @type {?string}
     */
    this.nickname = data.nick;
    this._roles = data.roles;
  }

  /**
   * The date this member joined the guild
   * @type {Date}
   */
  get joinDate() {
    return new Date(this._joinDate);
  }

  /**
   * A list of roles that are applied to this GuildMember, mapped by the role ID.
   * @type {Collection<string, Role>}
   * @readonly
   */
  get roles() {
    const list = new Collection();
    const everyoneRole = this.guild.roles.get(this.guild.id);

    if (everyoneRole) list.set(everyoneRole.id, everyoneRole);

    for (const roleID of this._roles) {
      const role = this.guild.roles.get(roleID);
      if (role) list.set(role.id, role);
    }

    return list;
  }

  /**
   * Whether this member is muted in any way
   * @type {boolean}
   * @readonly
   */
  get mute() {
    return this.selfMute || this.serverMute;
  }

  /**
   * Whether this member is deafened in any way
   * @type {boolean}
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
   * @type {string}
   * @readonly
   */
  get id() {
    return this.user.id;
  }

  /**
   * Mute/unmute a user
   * @param {boolean} mute Whether or not the member should be muted
   * @returns {Promise<GuildMember>}
   */
  setMute(mute) {
    return this.edit({ mute });
  }

  /**
   * Deafen/undeafen a user
   * @param {boolean} deaf Whether or not the member should be deafened
   * @returns {Promise<GuildMember>}
   */
  setDeaf(deaf) {
    return this.edit({ deaf });
  }

  /**
   * Moves the Guild Member to the given channel.
   * @param {ChannelResolvable} channel The channel to move the member to
   * @returns {Promise<GuildMember>}
   */
  setVoiceChannel(channel) {
    return this.edit({ channel });
  }

  /**
   * Sets the Roles applied to the member.
   * @param {Collection<string, Role>|Role[]} roles The roles to apply
   * @returns {Promise<GuildMember>}
   */
  setRoles(roles) {
    return this.edit({ roles });
  }

  /**
   * Set the nickname for the Guild Member
   * @param {string} nick The nickname for the Guild Member
   * @returns {Promise<GuildMember>}
   */
  setNickname(nick) {
    return this.edit({ nick });
  }

  /**
   * Edit a Guild Member
   * @param {GuildmemberEditData} data The data to edit the member with
   * @returns {Promise<GuildMember>}
   */
  edit(data) {
    return this.client.rest.methods.updateGuildMember(this, data);
  }

  /**
   * Deletes any DMs with this Guild Member
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
   * @returns {Promise<GuildMember>}
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
