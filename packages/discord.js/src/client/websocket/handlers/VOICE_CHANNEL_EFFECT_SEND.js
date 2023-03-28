'use strict';

const VoiceChannelEffect = require('../../../structures/VoiceChannelEffect');
const Events = require('../../../util/Events');

module.exports = (client, { d: data }) => {
  const guild = client.guilds.cache.get(data.guild_id);
  if (!guild) return;
  client.emit(Events.VoiceChannelEffectSend, new VoiceChannelEffect(data, guild));
};
