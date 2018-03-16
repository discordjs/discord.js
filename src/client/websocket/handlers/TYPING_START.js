const { Events } = require('../../../util/Constants');

module.exports = (client, { d: data }) => {
  const channel = client.channels.get(data.channel_id);
  const user = client.users.get(data.user_id);

  if (channel && user) {
  /**
   * Emitted whenever a user starts typing in a channel.
   * @event Client#typingStart
   * @param {Channel} channel The channel the user started typing in
   * @param {User} user The user that started typing
   */
    client.emit(Events.TYPING_START, channel, user);
  }
};
