'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class MessagePollVoteRemoveAction extends Action {
  handle(data) {
    const channel = this.getChannel({ id: data.channel_id, ...('guild_id' in data && { guild_id: data.guild_id }) });
    if (!channel?.isTextBased()) return false;

    const message = this.getMessage(data, channel);
    if (!message) return false;

    const poll = this.getPoll(data, message, channel);
    if (!poll) return false;

    const answer = poll.answers.get(data.answer_id);
    if (!answer) return false;

    answer.voters.cache.delete(data.user_id);

    if (answer.voteCount > 0) {
      answer.voteCount--;
    }

    /**
     * Emitted whenever a user removes their vote in a poll.
     * @event Client#messagePollVoteRemove
     * @param {PollAnswer} pollAnswer The answer where the vote was removed
     * @param {Snowflake} userId The id of the user that removed their vote
     */
    this.client.emit(Events.MessagePollVoteRemove, answer, data.user_id);

    return { poll };
  }
}

module.exports = MessagePollVoteRemoveAction;
