'use strict';

module.exports = (client, packet) => {
  client.actions.MessagePollVoteAdd.handle(packet.d);
};
