const Action = require('./Action');

class GuildMemberGetAction extends Action {
  handle(guild, data) {
    const member = guild._addMember(data, false);
    return {
      member,
    };
  }
}

module.exports = GuildMemberGetAction;
