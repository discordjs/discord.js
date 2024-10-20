'use strict';

const { PollAnswerMediaBuilder: BuildersPollAnswerMedia } = require('@discordjs/builders');
const { resolvePartialEmoji } = require('../util/Util');

class PollAnswerMediaBuilder extends BuildersPollAnswerMedia {
  constructor(data = {}) {
    super({
      ...data,
      emoji: data.emoji && resolvePartialEmoji(data.emoji),
    });
  }
  /**
   * Sets the emoji for this poll answer.
   *
   * @param {string|PollAnswerEmojiObject} emoji - The emoji to use
   * @returns {PollAnswerMediaBuilder}
   */
  setEmoji(emoji) {
    this.data.emoji = resolvePartialEmoji(emoji);
    return this;
  }
}

module.exports = PollAnswerMediaBuilder;

/**
 * @external BuildersPollAnswerMedia
 * @see {@link https://discord.js.org/docs/packages/builders/stable/PollAnswerMediaBuilder:Class}
 */
