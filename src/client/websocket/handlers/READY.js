'use strict';

let ClientUser;
const fetch = require('node-fetch');
module.exports = async (client, { d: data }, shard) => {
  if (client.user) {
    client.user._patch(data.user);
  } else {
    if (!ClientUser) ClientUser = require('../../../structures/ClientUser');
    const clientUser = new ClientUser(client, data.user);
    client.user = clientUser;
    client.users.cache.set(clientUser.id, clientUser);
  }
  /* Checks if the version in package.json is not the same as
  the version of the latest Github release of discord.js.
  If it is not the same as the latest release and outdatedwarn
  is true in the package.json, it will warn the user in the console
  and tell them to update.*/
  const { version } = require('../../../../package.json');
  const { outdatedwarn } = require('../../../../package.json');
  const url = 'https://api.github.com/repos/discordjs/discord.js/releases/latest';
  const body = await fetch(url).then(response => response.json());
  if (version !== body.tag_name && outdatedwarn === true) {
    console.warn(`Your version is outdated. Please update to the current version using 'npm install discord.js@latest'
or if you're using voice support, use one of these;
npm install discord.js @discordjs/opus
npm install discord.js opusscript`);
  }
  for (const guild of data.guilds) {
    guild.shardID = shard.id;
    client.guilds.add(guild);
  }

  shard.checkReady();
};
