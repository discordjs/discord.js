const Action = require('./Action');

class GuildGetAction extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.dataManager.newGuild(data);
    return {
      guild,
    };
  }
}

module.exports = GuildGetAction;
