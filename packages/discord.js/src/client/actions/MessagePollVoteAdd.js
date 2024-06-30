'use strict';

const Action = require('./Action');
const { Poll } = require('../../structures/Poll');
const { PollAnswer } = require('../../structures/PollAnswer');
const Events = require('../../util/Events');
const Partials = require('../../util/Partials');

class MessagePollVoteAddAction extends Action {
  handle(data) {
    const channel = this.getChannel(data);
    if (!channel?.isTextBased()) return false;

    const message = this.getMessage(data, channel);
    if (!message) return false;

    const includePollPartial = this.client.options.partials.includes(Partials.Poll);
    const includePollAnswerPartial = this.client.options.partials.includes(Partials.PollAnswer);
    if (message.partial && (!includePollPartial || !includePollAnswerPartial)) return false;

    if (!message.poll && includePollPartial && includePollAnswerPartial) {
      message.poll = new Poll(this.client, { ...data, answers: [], partial: true }, message, channel);

      const pollAnswer = new PollAnswer(this.client, data, message.poll);

      message.poll.answers.set(data.answer_id, pollAnswer);
    }

    const answer = message.poll.answers.get(data.answer_id);

    if (!answer) return false;

    const user = this.getUser(data);

    answer.voters._add(user);
    answer.voteCount++;

    /**
     * Emitted whenever a user votes in a poll.
     * @event Client#messagePollVoteAdd
     * @param {PollAnswer} pollAnswer The answer that was voted on
     * @param {Snowflake} userId The id of the user that voted
     */
    this.client.emit(Events.MessagePollVoteAdd, answer, data.user_id);

    const { poll } = message;

    return { poll };
  }
}

module.exports = MessagePollVoteAddAction;
