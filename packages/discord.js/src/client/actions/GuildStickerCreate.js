'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class GuildStickerCreateAction extends Action {
  handle(guild, createdSticker) {
    const already = guild.stickers.cache.has(createdSticker.id);
    const sticker = guild.stickers._add(createdSticker);
    /**
     * Emitted whenever a custom sticker is created in a guild.
     * @event Client#stickerCreate
     * @param {Sticker} sticker The sticker that was created
     */
    if (!already) this.client.emit(Events.GuildStickerCreate, sticker);
    return { sticker };
  }
}

module.exports = GuildStickerCreateAction;
