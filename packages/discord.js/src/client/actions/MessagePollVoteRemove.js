'use strict';

const Action = require('./Action');
const { Poll } = require('../../structures/Poll');
const { PollAnswer } = require('../../structures/PollAnswer');
const Events = require('../../util/Events');
const Partials = require('../../util/Partials');

class MessagePollVoteRemoveAction extends Action {
  handle(data) {
    const channel = this.getChannel(data);
    if (!channel?.isTextBased()) return false;

    const message = this.getMessage(data, channel);
    if (!message) return false;

    const { poll } = message;

    const includePollPartial = this.client.options.partials.includes(Partials.Poll);
    if (message.partial && !includePollPartial) return false;

    if (!poll && includePollPartial) {
      message.poll = new Poll(this.client, { ...data, partial: true }, message, channel);
    }

    const includePollAnswerPartial = this.client.options.partials.includes(Partials.PollAnswer);
    if (message.partial && includePollPartial && !includePollAnswerPartial) return false;

    const answer = poll?.answers?.get(data.answer_id);
    if (!answer && poll) {
      const pollAnswer = new PollAnswer(this.client, data, poll);

      poll.answers.set(data.answer_id, pollAnswer);
    } else {
      return false;
    }

    answer.voters.cache.delete(data.user_id);
    answer.voteCount--;

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
