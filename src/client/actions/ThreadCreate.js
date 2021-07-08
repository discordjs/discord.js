'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class ThreadCreateAction extends Action {
  handle(data) {
    const client = this.client;
    const existing = client.channels.cache.has(data.id);
    const thread = client.channels._add(data);
    if (!existing && thread) {
      /**
       * Emitted whenever a thread is created or when the client user is added to a thread.
       * @event Client#threadCreate
       * @param {ThreadChannel} thread The thread that was created
       */
      client.emit(Events.THREAD_CREATE, thread);
    }
    return { thread };
  }
}

module.exports = ThreadCreateAction;
