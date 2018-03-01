const { Events } = require('../../../util/Constants');

module.exports = (client, packet) => {
  const { user, reaction } = client.actions.MessageReactionAdd.handle(packet.d);
  if (reaction) client.emit(Events.MESSAGE_REACTION_ADD, reaction, user);
};
