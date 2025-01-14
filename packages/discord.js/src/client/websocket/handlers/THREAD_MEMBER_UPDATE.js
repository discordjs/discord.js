'use strict';

const Events = require('../../../util/Events.js');

module.exports = (client, { d: data }) => {
  // Discord sends the thread id as id in this object
  const thread = client.channels.cache.get(data.id);
  if (!thread) return;

  const member = thread.members.cache.get(data.user_id);
  if (!member) {
    thread.members._add(data);
    return;
  }

  const old = member._update(data);

  /**
   * Emitted whenever the client user's thread member is updated.
   * @event Client#threadMemberUpdate
   * @param {ThreadMember} oldMember The member before the update
   * @param {ThreadMember} newMember The member after the update
   */
  client.emit(Events.ThreadMemberUpdate, old, member);
};
