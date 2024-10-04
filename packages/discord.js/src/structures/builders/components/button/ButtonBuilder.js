'use strict';

const { BaseButtonBuilder: BuildersButtonBase } = require('@discordjs/builders');
const { toSnakeCase } = require('../../../../util/Transformers');
const { resolvePartialEmoji } = require('../../../../util/Util');

/**
 * Represents a button builder.
 * @extends {BuildersButtonBase}
 */
class BaseButtonBuilder extends BuildersButtonBase {
  constructor({ emoji, ...data } = {}) {
    super(toSnakeCase({ ...data, emoji: emoji && typeof emoji === 'string' ? resolvePartialEmoji(emoji) : emoji }));
  }

  /**
   * Sets the emoji to display on this button
   * @param {string|APIMessageComponentEmoji} emoji The emoji to display on this button
   * @returns {ButtonBuilder}
   */
  setEmoji(emoji) {
    if (typeof emoji === 'string') {
      return super.setEmoji(resolvePartialEmoji(emoji));
    }
    return super.setEmoji(emoji);
  }
}

module.exports = BaseButtonBuilder;

/**
 * @external BuildersButtonBase
 * @see {@link https://discord.js.org/docs/packages/builders/stable/BaseButtonBuilder:Class}
 */
