'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class ServerEmojiDeleteAction extends Action {
  handle(emoji) {
    emoji.server.emojis.cache.delete(emoji.id);
    emoji.deleted = true;
    /**
     * Emitted whenever a custom emoji is deleted in a server.
     * @event Client#emojiDelete
     * @param {ServerEmoji} emoji The emoji that was deleted
     */
    this.client.emit(Events.GUILD_EMOJI_DELETE, emoji);
    return { emoji };
  }
}

module.exports = ServerEmojiDeleteAction;
