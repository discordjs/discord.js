'use strict';

const Base = require('./Base');
const Collection = require('../util/Collection');

class StageInstanceInvite extends Base {
  constructor(client, data, guild) {
    super(client);

    this.guild = guild;

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
}

module.exports = StageInstanceInvite;
