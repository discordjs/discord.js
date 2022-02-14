'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class GuildEmojiDeleteAction extends Action {
  handle(emoji) {
    emoji.guild.emojis.cache.delete(emoji.id);
    /**
     * Emitted whenever a custom emoji is deleted in a guild.
     * @event Client#emojiDelete
     * @param {GuildEmoji} emoji The emoji that was deleted
     */
    this.client.emit(Events.GuildEmojiDelete, emoji);
    return { emoji };
  }
}

module.exports = GuildEmojiDeleteAction;
