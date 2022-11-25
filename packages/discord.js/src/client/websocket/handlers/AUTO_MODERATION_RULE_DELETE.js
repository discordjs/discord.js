'use strict';

module.exports = (client, packet) => {
  client.actions.AutoModerationRuleDelete.handle(packet.d);
};
