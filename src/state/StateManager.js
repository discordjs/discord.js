const Collection = require('../util/Collection');
const Constants = require('../util/Constants');
const Guild = require('../structures/Guild');

const stores = new Collection();

function addClient(client) {
  stores.set(client, {
    token: null,
    options: null,
    guilds: new Collection(),
    channels: new Collection(),
    users: new Collection(),
  });
}

function dispatch(event, client, data) {
  switch (event) {
    case 'GUILD_CREATE': {
      const already = stores.get(client).guilds.has(data.id);
      const guild = new Guild(client, data);
      stores.get(client).guilds.set(guild.id, guild);
      if (this.pastReady && !already) {
        /**
         * Emitted whenever the client joins a guild.
         * @event Client#guildCreate
         * @param {Guild} guild The created guild
         */
        if (client.options.fetchAllMembers) {
          guild.fetchMembers().then(() => { client.emit(Constants.Events.GUILD_CREATE, guild); });
        } else {
          client.emit(Constants.Events.GUILD_CREATE, guild);
        }
      }
      break;
    }
    default:
      break;
  }
}

module.exports = {
  mount: addClient,
  dispatch,
  stores: client => stores.get(client),
};
