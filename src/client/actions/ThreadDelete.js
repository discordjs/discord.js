'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class ThreadDeleteAction extends Action {
  handle(data) {
    const client = this.client;
    const thread = client.channels.cache.get(data.id);

    if (thread) {
      client.channels._remove(thread.id);
      thread.deleted = true;
      for (const message of thread.messages.cache.values()) {
        message.deleted = true;
      }

      /**
       * Emitted whenever a thread is deleted.
       * @event Client#threadDelete
       * @param {ThreadChannel} thread The thread that was deleted
       */
      client.emit(Events.THREAD_DELETE, thread);
    }

    return { thread };
  }
}

module.exports = ThreadDeleteAction;
