'use strict';

module.exports = (client, { d: data }) => {
  const guild = client.guilds.cache.get(data.guild_id);
  if (guild) guild.settings._patch(data);
};
