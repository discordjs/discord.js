'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class ThreadMembersUpdateAction extends Action {
  handle(data) {
    const client = this.client;
    const thread = client.channels.cache.get(data.id);
    if (thread) {
      const old = thread.members.cache.clone();
      thread.memberCount = data.member_count;

      data.added_members?.forEach(rawMember => {
        thread.members._add(rawMember);
      });

      data.removed_member_ids?.forEach(memberId => {
        thread.members.cache.delete(memberId);
      });

      /**
       * Emitted whenever members are added or removed from a thread. Requires `GUILD_MEMBERS` privileged intent
       * @event Client#threadMembersUpdate
       * @param {Collection<Snowflake, ThreadMember>} oldMembers The members before the update
       * @param {Collection<Snowflake, ThreadMember>} newMembers The members after the update
       */
      client.emit(Events.THREAD_MEMBERS_UPDATE, old, thread.members.cache);
    }
    return {};
  }
}

module.exports = ThreadMembersUpdateAction;
