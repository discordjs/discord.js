const { Events } = require('../../../util/Constants');

module.exports = (client, packet) => {
  const { user, reaction } = client.actions.MessageReactionAdd.handle(packet.d);
  /**
   * Emitted whenever a reaction is added to a cached message.
   * @event Client#messageReactionAdd
   * @param {MessageReaction} messageReaction The reaction object
   * @param {User} user The user that applied the guild or reaction emoji
   */
  if (reaction) client.emit(Events.MESSAGE_REACTION_ADD, reaction, user);
};
