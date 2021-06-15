'use strict';

const Base = require('./Base');
const Collection = require('../util/Collection');

class InviteStageInstance extends Base {
  constructor(client, data, guildID, channelID) {
    super(client);

    this.guildID = guildID;

    this.channelID = channelID;

    this.members = new Collection();

    this._patch(data);
  }

  _patch(data) {
    this.topic = data.topic;

    this.participantCount = data.participant_count;

    this.speakerCount = data.speaker_count;

    for (const rawMember of data.members) {
      const member = this.guild.members.add(rawMember);
      this.members.set(member.id, member);
    }
  }

  get guild() {
    return this.client.guilds.resolve(this.guildID);
  }

  get channel() {
    return this.client.channels.resolve(this.channelID);
  }
}

module.exports = InviteStageInstance;
