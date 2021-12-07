'use strict';

const Sticker = require('./Sticker');

/**
 * Parent class for {@link GuildSticker}.
 * @extends {Sticker}
 * @abstract
 */
class BaseGuildSticker extends Sticker {
  constructor(client, data, guild) {
    super(client, data);

    /**
     * The guild this sticker is a part of
     * @type {Guild|GuildPreview}
     */
    this.guild = guild;

    this.available = null;

    this._patch(data);
  }

  _patch(data) {
    if ('name' in data) this.name = data.name;

    if ('available' in data) {
      /**
       * Whether this sticker is available
       * @type {?boolean}
       */
      this.available = data.available;
    }
  }
}

module.exports = BaseGuildSticker;
