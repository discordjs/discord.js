'use strict';

const { PollAnswerBuilder: BuildersPollAnswer, resolveBuilder } = require('@discordjs/builders');
const PollAnswerMediaBuilder = require('./PollAnswerMediaBuilder');
const { resolvePartialEmoji } = require('../util/Util');

class PollAnswerBuilder extends BuildersPollAnswer {
  constructor(data = {}) {
    super({
      ...data,
      poll_media: {
        ...data.poll_media,
        emoji: data.poll_media?.emoji && resolvePartialEmoji(data.poll_media.emoji),
      },
    });
  }

  /**
   * @callback PollMediaCallback
   * @param {PollAnswerMediaBuilder} options The builder to set options for the media
   */

  /**
   * Sets the media for this poll answer.
   * @param {PollMediaData|PollAnswerMediaBuilder|PollMediaCallback} options The options for the media
   * @returns {PollAnswerBuilder}
   */
  setMedia(options) {
    this.data.poll_media = resolveBuilder(options, PollAnswerMediaBuilder);
    return this;
  }
}

module.exports = PollAnswerBuilder;

/**
 * @external BuildersPollAnswer
 * @see {@link https://discord.js.org/docs/packages/builders/stable/PollAnswerBuilder:Class}
 */
