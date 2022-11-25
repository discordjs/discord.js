'use strict';

module.exports = (client, packet) => {
  client.actions.AutoModerationActionExecution.handle(packet.d);
};
