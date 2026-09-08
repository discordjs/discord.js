'use strict';

module.exports = (client, { d: data }) => {
  client.actions.GuildSoundboardSoundDelete.handle(data);
};
