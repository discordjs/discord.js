const path = require('path');

const Discord = require('../');

function fixture(name) {
  return require(path.resolve(__dirname, 'fixtures', name));
}

module.exports = {
  Discord,
  fixture,
  getClient() {
    return new Discord.Client();
  },
  ensureGuild(client, name) {
    const f = fixture(`guild/${name}`);
    client.guilds.set(f.id, new Discord.Guild(client, f));
  },
};
