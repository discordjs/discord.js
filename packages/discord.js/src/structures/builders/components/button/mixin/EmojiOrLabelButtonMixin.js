const { EmojiOrLabelButtonMixin: BuildersEmojiOrLabelButtonMixin } = require('@discordjs/builders');

/**
 * Represents a button builder.
 * @extends {BuildersEmojiOrLabelButtonMixin}
 */
class EmojiOrLabelButtonMixin extends BuildersEmojiOrLabelButtonMixin {
  /**
   * Sets the emoji to display on this button
   * @param {string|APIMessageComponentEmoji} emoji The emoji to display on this button
   * @returns {EmojiOrLabelButtonMixin}
   */
  setEmoji(emoji) {
    if (typeof emoji === 'string') {
      return super.setEmoji(resolvePartialEmoji(emoji));
    }

    return super.setEmoji(emoji);
  }
}

module.exports = EmojiOrLabelButtonMixin;

/**
 * @external BuildersEmojiOrLabelButtonMixin
 * @see {@link https://discord.js.org/docs/packages/builders/stable/EmojiOrLabelButtonMixin:Class}
 */
