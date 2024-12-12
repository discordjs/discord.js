'use strict';

module.exports = (client, { d: data }) => {
  client.actions.GuildSoundboardSoundUpdate.handle(data);
};
