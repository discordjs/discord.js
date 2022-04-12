'use strict';

const { SelectMenuBuilder: BuildersSelectMenuComponent, isJSONEncodable } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');
const Util = require('../util/Util');

class SelectMenuBuilder extends BuildersSelectMenuComponent {
  constructor({ options, ...data }) {
    super(
      Transformers.toSnakeCase({
        options: options.map(({ emoji, ...option }) => ({
          ...option,
          emoji: emoji && typeof emoji === 'string' ? Util.parseEmoji(emoji) : emoji,
        })),
        ...data,
      }),
    );
  }

  /**
   * Creates a new select menu builder from json data
   * @param {JSONEncodable<APISelectMenuComponent> | APISelectMenuComponent} other The other data
   * @returns {SelectMenuBuilder}
   */
  static from(other) {
    if (isJSONEncodable(other)) {
      return new this(other.toJSON());
    }
    return new this(other);
  }
}

module.exports = SelectMenuBuilder;
