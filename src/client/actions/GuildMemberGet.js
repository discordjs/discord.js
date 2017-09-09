const Action = require('./Action');

class GuildMemberGetAction extends Action {
  handle(guild, data) {
    const member = guild.members.create(data);
    return { member };
  }
}

module.exports = GuildMemberGetAction;
