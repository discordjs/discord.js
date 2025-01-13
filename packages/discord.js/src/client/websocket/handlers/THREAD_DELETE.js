'use strict';

const Events = require('../../../util/Events.js');

module.exports = (client, { d: data }) => {
  const thread = client.channels.cache.get(data.id);
  if (!thread) return;

  client.channels._remove(thread.id);

  /**
   * Emitted whenever a thread is deleted.
   * @event Client#threadDelete
   * @param {ThreadChannel} thread The thread that was deleted
   */
  client.emit(Events.ThreadDelete, thread);
};
