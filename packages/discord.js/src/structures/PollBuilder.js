'use strict';

const { PollBuilder: BuildersPoll, normalizeArray, resolveBuilder } = require('@discordjs/builders');
const { isJSONEncodable } = require('@discordjs/util');
const PollAnswerBuilder = require('./PollAnswerBuilder');
const { toSnakeCase } = require('../util/Transformers');
const { resolvePartialEmoji } = require('../util/Util');

/**
 * Represents a poll builder.
 * @extends {BuildersPoll}
 */
class PollBuilder extends BuildersPoll {
  constructor(data = {}) {
    super(
      toSnakeCase({
        ...data,
        answers:
          data.answers &&
          data.answers?.map(answer => ({
            ...answer,
            poll_media: {
              ...answer.poll_media,
              emoji: answer.poll_media?.emoji && resolvePartialEmoji(answer.poll_media.emoji),
            },
          })),
      }),
    );
  }

  /**
   * @typedef {Object} PollAnswerEmojiObject
   * @property {Snowflake|undfined} id The id of the emoji
   * @property {string|undefined} name The name of the emoji
   * @property {boolean|undefined} animated Whether the emoji is animated
   */

  /**
   * @typedef {Object} PollMediaData Data used for an answer on a poll
   * @property {string} text The text to use for the answer
   * @property {string|PollAnswerEmojiObject|EmojiResolvable|undefined} emoji The emoji to use for the answer
   */

  /**
   * @typedef {Object} PollAnswerData
   * @property {PollMediaData} poll_media The media for this poll answer
   */

  /**
   * Sets the answers for this poll.
   * @param {...PollAnswerData} [answers] The answers to set
   * @returns {PollBuilder}
   */
  setAnswers(...answers) {
    return this.spliceAnswers(0, this.data.answers.length, normalizeArray(answers));
  }

  /**
   * Appends answers to the poll.
   * @param {...PollAnswerData} [answers] The answers to add
   * @returns {PollBuilder}
   */
  addAnswers(...answers) {
    return super.addAnswers(this.resolveAnswers(answers));
  }

  /**
   * Removes, replaces, or inserts answers for this poll.
   * @param {number} index The index to start at
   * @param {number} deleteCount The number of answers to remove
   * @param {...PollAnswerData} [answers] The replacing answer objects
   * @returns {PollBuilder}
   */
  spliceAnswers(index, deleteCount, ...answers) {
    return super.spliceAnswers(index, deleteCount, this.resolveAnswers(answers));
  }

  /**
   * Resolves poll answers.
   * @private
   * @param {...PollAnswerData} answers - The answers to resolve
   * @returns {PollAnswerBuilder | PollAnswerData}
   */
  resolveAnswers(answers) {
    return normalizeArray(answers).map(answer => resolveBuilder(answer, PollAnswerBuilder));
  }

  /**
   * Creates a new poll builder from JSON data
   * @param {PollBuilder|APIPoll} other The other data
   * @returns {PollBuilder}
   */
  static from(other) {
    return new this(isJSONEncodable(other) ? other.toJSON() : other);
  }
}

module.exports = PollBuilder;

/**
 * @external BuildersPoll
 * @see {@link https://discord.js.org/docs/packages/builders/stable/PollBuilder:Class}
 */
