'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class ServerEmojiCreateAction extends Action {
  handle(server, createdEmoji) {
    const already = server.emojis.cache.has(createdEmoji.id);
    const emoji = server.emojis.add(createdEmoji);
    /**
     * Emitted whenever a custom emoji is created in a server.
     * @event Client#emojiCreate
     * @param {ServerEmoji} emoji The emoji that was created
     */
    if (!already) this.client.emit(Events.GUILD_EMOJI_CREATE, emoji);
    return { emoji };
  }
}

module.exports = ServerEmojiCreateAction;
