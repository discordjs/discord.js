'use strict';

const { Collection } = require('@discordjs/collection');
const Events = require('../../../util/Events.js');

module.exports = (client, { d: data }) => {
  const guild = client.guilds.cache.get(data.guild_id);
  if (!guild) return;

  if (data.channel_ids) {
    for (const id of data.channel_ids) {
      const channel = client.channels.cache.get(id);
      if (channel) removeStaleThreads(client, channel);
    }
  } else {
    for (const channel of guild.channels.cache.values()) {
      removeStaleThreads(client, channel);
    }
  }

  const syncedThreads = data.threads.reduce((coll, rawThread) => {
    const thread = client.channels._add(rawThread);
    return coll.set(thread.id, thread);
  }, new Collection());

  for (const rawMember of Object.values(data.members)) {
    // Discord sends the thread id as id in this object
    const thread = client.channels.cache.get(rawMember.id);
    if (thread) {
      thread.members._add(rawMember);
    }
  }

  /**
   * Emitted whenever the client user gains access to a text or announcement channel that contains threads
   * @event Client#threadListSync
   * @param {Collection<Snowflake, ThreadChannel>} threads The threads that were synced
   * @param {Guild} guild The guild that the threads were synced in
   */
  client.emit(Events.ThreadListSync, syncedThreads, guild);
};

function removeStaleThreads(client, channel) {
  channel.threads?.cache.forEach(thread => {
    if (!thread.archived) {
      client.channels._remove(thread.id);
    }
  });
}
