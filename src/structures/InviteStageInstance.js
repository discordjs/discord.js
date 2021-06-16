'use strict';

const Base = require('./Base');
const Collection = require('../util/Collection');

/**
 * Represents the data about a public {@link StageInstance} in an {@link Invite}.
 * @extends {Base}
 */
class InviteStageInstance extends Base {
  constructor(client, data, channelID, guildID) {
    super(client);

    /**
     * The ID of the stage channel this invite is for
     * @type {Snowflake}
     */
    this.channelID = channelID;

    /**
     * The guild ID of the stage channel
     * @type {Snowflake}
     */
    this.guildID = guildID;

    /**
     * The members speaking in the stage channel
     * @type {Collection<Snowflake, GuildMember>}
     */
    this.members = new Collection();

    this._patch(data);
  }

  _patch(data) {
    /**
     * The topic of the stage instance
     * @type {string}
     */
    this.topic = data.topic;

    /**
     * The number of users in the stage channel
     * @type {number}
     */
    this.participantCount = data.participant_count;

    /**
     * The number of users speaking in the stage channel
     * @type {number}
     */
    this.speakerCount = data.speaker_count;

    this.members.clear();
    for (const rawMember of data.members) {
      const member = this.guild.members.add(rawMember);
      this.members.set(member.id, member);
    }
  }

  /**
   * The stage channel this invite is for
   * @type {?StageChannel}
   * @readonly
   */
  get channel() {
    return this.client.channels.resolve(this.channelID);
  }

  /**
   * The guild of the stage channel this invite is for
   * @type {?Guild}
   * @readonly
   */
  get guild() {
    return this.client.guilds.resolve(this.guildID);
  }
}

module.exports = InviteStageInstance;
