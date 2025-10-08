'use strict';

const { Collection } = require('@discordjs/collection');
const Base = require('./Base');
const { PollAnswer } = require('./PollAnswer');
const { DiscordjsError } = require('../errors/DJSError');
const { ErrorCodes } = require('../errors/index');

/**
 * Represents a Poll
 * @extends {Base}
 */
class Poll extends Base {
  constructor(client, data, message, channel) {
    super(client);

    /**
     * The id of the channel that this poll is in
     * @type {Snowflake}
     */
    this.channelId = data.channel_id ?? channel.id;

    /**
     * The channel that this poll is in
     * @name Poll#channel
     * @type {TextBasedChannel}
     * @readonly
     */

    Object.defineProperty(this, 'channel', { value: channel });

    /**
     * The id of the message that started this poll
     * @type {Snowflake}
     */
    this.messageId = data.message_id ?? message.id;

    /**
     * The message that started this poll
     * @name Poll#message
     * @type {Message}
     * @readonly
     */

    Object.defineProperty(this, 'message', { value: message });

    /**
     * The answers of this poll
     * @type {Collection<number, PollAnswer|PartialPollAnswer>}
     */
    this.answers = new Collection();

    this._patch(data);
  }

  _patch(data) {
    if (data.answers) {
      for (const answer of data.answers) {
        const existing = this.answers.get(answer.answer_id);
        if (existing) {
          existing._patch(answer);
        } else {
          this.answers.set(answer.answer_id, new PollAnswer(this.client, answer, this));
        }
      }
    }

    if (data.results) {
      /**
       * Whether this poll's results have been precisely counted
       * @type {boolean}
       */
      this.resultsFinalized = data.results.is_finalized;

      for (const answerResult of data.results.answer_counts) {
        const answer = this.answers.get(answerResult.id);
        answer?._patch(answerResult);
      }
    } else {
      this.resultsFinalized ??= false;
    }

    if ('allow_multiselect' in data) {
      /**
       * Whether this poll allows multiple answers
       * @type {boolean}
       */
      this.allowMultiselect = data.allow_multiselect;
    } else {
      this.allowMultiselect ??= null;
    }

    if ('layout_type' in data) {
      /**
       * The layout type of this poll
       * @type {PollLayoutType}
       */
      this.layoutType = data.layout_type;
    } else {
      this.layoutType ??= null;
    }

    if ('expiry' in data) {
      /**
       * The timestamp when this poll expires
       * @type {?number}
       */
      this.expiresTimestamp = data.expiry && Date.parse(data.expiry);
    } else {
      this.expiresTimestamp ??= null;
    }

    if (data.question) {
      /**
       * The media for a poll's question
       * @typedef {Object} PollQuestionMedia
       * @property {?string} text The text of this question
       */

      /**
       * The media for this poll's question
       * @type {PollQuestionMedia}
       */
      this.question = {
        text: data.question.text,
      };
    } else {
      this.question ??= {
        text: null,
      };
    }
  }

  /**
   * The date when this poll expires
   * @type {?Date}
   * @readonly
   */
  get expiresAt() {
    return this.expiresTimestamp && new Date(this.expiresTimestamp);
  }

  /**
   * Whether this poll is a partial
   * @type {boolean}
   * @readonly
   */
  get partial() {
    return this.allowMultiselect === null;
  }

  /**
   * Fetches the message that started this poll, then updates the poll from the fetched message.
   * @returns {Promise<Poll>}
   */
  async fetch() {
    await this.channel.messages.fetch(this.messageId);

    return this;
  }

  /**
   * Ends this poll.
   * @returns {Promise<Message>}
   */
  async end() {
    if (this.expiresTimestamp !== null && Date.now() > this.expiresTimestamp) {
      throw new DiscordjsError(ErrorCodes.PollAlreadyExpired);
    }

    return this.channel.messages.endPoll(this.messageId);
  }
}

exports.Poll = Poll;
