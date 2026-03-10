'use strict';

const { PollAnswerVoterManager } = require('../managers/PollAnswerVoterManager.js');
const { resolveGuildEmoji } = require('../util/Util.js');
const { Base } = require('./Base.js');
const { Emoji } = require('./Emoji.js');

/**
 * Represents an answer to a {@link Poll}
 *
 * @extends {Base}
 */
class PollAnswer extends Base {
  constructor(client, data, poll) {
    super(client);

    /**
     * The {@link Poll} this answer is part of
     *
     * @name PollAnswer#poll
     * @type {Poll|PartialPoll}
     * @readonly
     */
    Object.defineProperty(this, 'poll', { value: poll });

    /**
     * The id of this answer
     *
     * @type {number}
     */
    this.id = data.answer_id;

    /**
     * The manager of the voters for this answer
     *
     * @type {PollAnswerVoterManager}
     */
    this.voters = new PollAnswerVoterManager(this);

    /**
     * The raw emoji of this answer
     *
     * @name PollAnswer#_emoji
     * @type {?APIPartialEmoji}
     * @private
     */
    Object.defineProperty(this, '_emoji', { value: null, writable: true });

    this._patch(data);
  }

  _patch(data) {
    // This `count` field comes from `poll.results.answer_counts`
    if ('count' in data) {
      /**
       * The amount of votes this answer has
       *
       * @type {number}
       */
      this.voteCount = data.count;
    } else {
      this.voteCount ??= this.voters.cache.size;
    }

    /**
     * The text of this answer
     *
     * @type {?string}
     */
    this.text ??= data.poll_media?.text ?? null;

    if (data.poll_media?.emoji) {
      this._emoji = data.poll_media.emoji;
    }
  }

  /**
   * The emoji of this answer
   *
   * @type {?(GuildEmoji|Emoji)}
   */
  get emoji() {
    if (!this._emoji || (!this._emoji.id && !this._emoji.name)) return null;
    return resolveGuildEmoji(this.client, this._emoji.id) ?? new Emoji(this.client, this._emoji);
  }

  /**
   * Whether this poll answer is a partial.
   *
   * @type {boolean}
   * @readonly
   */
  get partial() {
    return this.poll.partial || (this.text === null && this.emoji === null);
  }
}

exports.PollAnswer = PollAnswer;
