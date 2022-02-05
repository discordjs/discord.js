'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class ThreadDeleteAction extends Action {
  handle(data) {
    const client = this.client;
    const thread = client.channels.cache.get(data.id);

    if (thread) {
      client.channels._remove(thread.id);

      /**
       * Emitted whenever a thread is deleted.
       * @event Client#threadDelete
       * @param {ThreadChannel} thread The thread that was deleted
       */
      client.emit(Events.ThreadDelete, thread);
    }

    return { thread };
  }
}

module.exports = ThreadDeleteAction;
