'use strict';

module.exports = (client, packet) => {
  client.actions.AutoModerationRuleUpdate.handle(packet.d);
};
