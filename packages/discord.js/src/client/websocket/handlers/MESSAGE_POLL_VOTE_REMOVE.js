'use strict';

module.exports = (client, packet) => {
  client.actions.MessagePollVoteRemove.handle(packet.d);
};
