'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class GuildStickerDeleteAction extends Action {
  handle(sticker) {
    sticker.guild.stickers.cache.delete(sticker.id);
    /**
     * Emitted whenever a custom sticker is deleted in a guild.
     * @event Client#stickerDelete
     * @param {Sticker} sticker The sticker that was deleted
     */
    this.client.emit(Events.GuildStickerDelete, sticker);
    return { sticker };
  }
}

module.exports = GuildStickerDeleteAction;
