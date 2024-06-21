'use strict';

const { PollBuilder: BuildersPoll, normalizeArray } = require('@discordjs/builders');
const { isJSONEncodable } = require('@discordjs/util');
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
          data.answers.map(answer => {
            if ('poll_media' in answer) answer = answer.poll_media;

            return {
              poll_media: {
                text: answer.text,
                emoji:
                  answer.emoji && typeof answer.emoji === 'string' ? resolvePartialEmoji(answer.emoji) : answer.emoji,
              },
            };
          }),
      }),
    );
  }

  /**
   * Sets the answers for this poll.
   * @param {...APIPollMedia} [answers] The answers to set
   * @returns {PollBuilder}
   */
  setAnswers(...answers) {
    super.setAnswers(
      normalizeArray(answers).map(answer => ({
        text: answer.text,
        emoji: answer.emoji && typeof answer.emoji === 'string' ? resolvePartialEmoji(answer.emoji) : answer.emoji,
      })),
    );
    return this;
  }

  /**
   * Appends answers to the poll.
   * @param {...APIPollMedia} [answers] The answers to add
   * @returns {PollBuilder}
   */
  addAnswers(...answers) {
    super.addAnswers(
      normalizeArray(answers).map(answer => ({
        text: answer.text,
        emoji: answer.emoji && typeof answer.emoji === 'string' ? resolvePartialEmoji(answer.emoji) : answer.emoji,
      })),
    );
    return this;
  }

  /**
   * Removes, replaces, or inserts answers for this poll.
   * @param {number} index The index to start at
   * @param {number} deleteCount The number of answers to remove
   * @param {...APIPollMedia} [answers] The replacing answer objects
   * @returns {PollBuilder}
   */
  spliceAnswers(index, deleteCount, ...answers) {
    super.spliceAnswers(
      index,
      deleteCount,
      normalizeArray(answers).map(answer => ({
        text: answer.text,
        emoji: answer.emoji && typeof answer.emoji === 'string' ? resolvePartialEmoji(answer.emoji) : answer.emoji,
      })),
    );
    return this;
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
