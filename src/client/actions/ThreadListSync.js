'use strict';

const Action = require('./Action');
const Collection = require('../../util/Collection');
const { Events } = require('../../util/Constants');

class ThreadListSyncAction extends Action {
  handle(data) {
    const client = this.client;

    const guild = client.guilds.cache.get(data.guild_id);
    if (guild) {
      if (!data.channels_ids) {
        guild.channels.cache.forEach(channel => {
          this.removeStale(channel);
        });
      } else {
        data.channel_ids.forEach(id => {
          const channel = client.channels.resolve(id);
          if (channel) this.removeStale(channel);
        });
      }

      const syncedThreads = new Collection();
      data.threads.forEach(rawThread => {
        const thread = client.channels.add(rawThread);
        syncedThreads.set(thread.id, thread);
      });

      Object.entries(data.members).forEach(([threadID, rawMember]) => {
        const thread = client.channels.cache.get(threadID);
        if (thread) {
          thread.members.add(rawMember);
        }
      });

      /**
       * Emitted whenever the client user gains access to a text or news channel that contains threads
       * @event Client#threadListSync
       * @param {Collection<Snowflake, ThreadChannel>} threads The threads that were synced
       */
      client.emit(Events.THREAD_LIST_SYNC, syncedThreads);

      return {
        syncedThreads,
      };
    }

    return {};
  }

  removeStale(channel) {
    channel.threads?.cache.forEach(thread => {
      if (!thread.archived) {
        this.client.channels.remove(thread.id);
      }
    });
  }
}

module.exports = ThreadListSyncAction;
