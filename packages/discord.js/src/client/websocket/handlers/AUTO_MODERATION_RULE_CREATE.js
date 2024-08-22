'use strict';

module.exports = (client, packet) => {
  client.actions.AutoModerationRuleCreate.handle(packet.d);
};
