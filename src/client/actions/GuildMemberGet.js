'use strict';

const Action = require('./Action');

class GuildMemberGetAction extends Action {
  handle(guild, data) {
    const client = this.client;
    const member = client.dataManager.newGuildMember(guild, data);
    return {
      member,
    };
  }
}

module.exports = GuildMemberGetAction;
