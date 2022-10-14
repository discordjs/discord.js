'use strict';

const { MentionableSelectMenuBuilder: BuildersMentionableSelectMenu, isJSONEncodable } = require('@discordjs/builders');
const { toSnakeCase } = require('../util/Transformers');
const { resolvePartialEmoji } = require('../util/Util');

/**
 * Class used to build select menu components to be sent through the API
 * @extends {BuildersMentionableSelectMenu}
 */
class MentionableSelectMenuBuilder extends BuildersMentionableSelectMenu {
  constructor({ options, ...data } = {}) {
    super(
      toSnakeCase({
        ...data,
        options: options?.map(({ emoji, ...option }) => ({
          ...option,
          emoji: emoji && typeof emoji === 'string' ? resolvePartialEmoji(emoji) : emoji,
        })),
      }),
    );
  }

  /**
   * Creates a new select menu builder from json data
   * @param {JSONEncodable<APISelectMenuComponent> | APISelectMenuComponent} other The other data
   * @returns {MentionableSelectMenuBuilder}
   */
  static from(other) {
    if (isJSONEncodable(other)) {
      return new this(other.toJSON());
    }
    return new this(other);
  }
}

module.exports = MentionableSelectMenuBuilder;

/**
 * @external BuildersMentionableSelectMenu
 * @see {@link https://discord.js.org/#/docs/builders/main/class/MentionableSelectMenuBuilder}
 */
