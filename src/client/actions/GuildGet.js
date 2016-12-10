const Action = require('./Action');

class GuildGetAction extends Action {
  handle(data, cache) {
    const client = this.client;
    const guild = client.dataManager.newGuild(data, cache);
    return {
      guild,
    };
  }
}

module.exports = GuildGetAction;
