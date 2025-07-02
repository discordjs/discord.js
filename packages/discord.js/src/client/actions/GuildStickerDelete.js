'use strict';

const { Events } = require('../../util/Events.js');
const { Action } = require('./Action.js');

class GuildStickerDeleteAction extends Action {
  handle(sticker) {
    sticker.guild.stickers.cache.delete(sticker.id);
    /**
     * Emitted whenever a custom sticker is deleted in a guild.
     *
     * @event Client#stickerDelete
     * @param {Sticker} sticker The sticker that was deleted
     */
    this.client.emit(Events.GuildStickerDelete, sticker);
    return { sticker };
  }
}

exports.GuildStickerDeleteAction = GuildStickerDeleteAction;
