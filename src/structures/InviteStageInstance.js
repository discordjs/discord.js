'use strict';

const { Collection } = require('@discordjs/collection');
const Base = require('./Base');

/**
 * Represents the data about a public {@link StageInstance} in an {@link Invite}.
 * @extends {Base}
 */
class InviteStageInstance extends Base {
  constructor(client, data, channelId, guildId) {
    super(client);

    /**
     * The id of the stage channel this invite is for
     * @type {Snowflake}
     */
    this.channelId = channelId;

    /**
     * The stage channel's guild id
     * @type {Snowflake}
     */
    this.guildId = guildId;

    /**
     * The members speaking in the stage channel
     * @type {Collection<Snowflake, GuildMember>}
     */
    this.members = new Collection();

    this._patch(data);
  }

  _patch(data) {
    if ('topic' in data) {
      /**
       * The topic of the stage instance
       * @type {string}
       */
      this.topic = data.topic;
    }

    if ('participant_count' in data) {
      /**
       * The number of users in the stage channel
       * @type {number}
       */
      this.participantCount = data.participant_count;
    }

    if ('speaker_count' in data) {
      /**
       * The number of users speaking in the stage channel
       * @type {number}
       */
      this.speakerCount = data.speaker_count;
    }

    this.members.clear();
    for (const rawMember of data.members) {
      const member = this.guild.members._add(rawMember);
      this.members.set(member.id, member);
    }
  }

  /**
   * The stage channel this invite is for
   * @type {?StageChannel}
   * @readonly
   */
  get channel() {
    return this.client.channels.resolve(this.channelId);
  }

  /**
   * The guild of the stage channel this invite is for
   * @type {?Guild}
   * @readonly
   */
  get guild() {
    return this.client.guilds.resolve(this.guildId);
  }
}

module.exports = InviteStageInstance;
