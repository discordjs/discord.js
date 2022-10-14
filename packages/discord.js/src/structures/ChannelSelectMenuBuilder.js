'use strict';

const { ChannelSelectMenuBuilder: BuildersChannelSelectMenu, isJSONEncodable } = require('@discordjs/builders');
const { toSnakeCase } = require('../util/Transformers');
const { resolvePartialEmoji } = require('../util/Util');

/**
 * Class used to build select menu components to be sent through the API
 * @extends {BuildersChannelSelectMenu}
 */
class ChannelSelectMenuBuilder extends BuildersChannelSelectMenu {
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
   * @returns {ChannelSelectMenuBuilder}
   */
  static from(other) {
    if (isJSONEncodable(other)) {
      return new this(other.toJSON());
    }
    return new this(other);
  }
}

module.exports = ChannelSelectMenuBuilder;

/**
 * @external BuildersChannelSelectMenu
 * @see {@link https://discord.js.org/#/docs/builders/main/class/ChannelSelectMenuBuilder}
 */
