'use strict';

const { Collection } = require('@discordjs/collection');
const Action = require('./Action');
const Events = require('../../util/Events');

class ThreadMembersUpdateAction extends Action {
  handle(data) {
    const client = this.client;
    const thread = client.channels.cache.get(data.id);
    if (thread) {
      thread.memberCount = data.member_count;
      const addedMembers = new Collection();
      const removedMembers = new Collection();

      data.added_members?.reduce(
        (_addedMembers, addedMember) => _addedMembers.set(addedMember.user_id, thread.members._add(addedMember)),
        addedMembers,
      );

      data.removed_member_ids?.reduce((removedMembersIds, removedMembersId) => {
        const threadMember = this.getThreadMember(removedMembersId, thread.members);
        if (threadMember) removedMembersIds.set(threadMember.user.id, threadMember);
        thread.members.cache.delete(removedMembersId);
        return removedMembersIds;
      }, removedMembers);

      if (addedMembers.size === 0 && removedMembers.size === 0) {
        // Uncached thread member(s) left.
        return {};
      }

      /**
       * Emitted whenever members are added or removed from a thread.
       * <info>This event requires the {@link GatewayIntentBits.GuildMembers} privileged gateway intent.</info>
       * @event Client#threadMembersUpdate
       * @param {Collection<Snowflake, ThreadMember>} addedMembers The members that were added
       * @param {Collection<Snowflake, ThreadMember>} removedMembers The members that were removed
       * @param {ThreadChannel} thread The thread where members got updated
       */
      client.emit(Events.ThreadMembersUpdate, addedMembers, removedMembers, thread);
    }
    return {};
  }
}

module.exports = ThreadMembersUpdateAction;
