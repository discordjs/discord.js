'use strict';

const Action = require('./Action');

class ServerEmojisUpdateAction extends Action {
  handle(data) {
    const server = this.client.servers.cache.get(data.server_id);
    if (!server || !server.emojis) return;

    const deletions = new Map(server.emojis.cache);

    for (const emoji of data.emojis) {
      // Determine type of emoji event
      const cachedEmoji = server.emojis.cache.get(emoji.id);
      if (cachedEmoji) {
        deletions.delete(emoji.id);
        if (!cachedEmoji.equals(emoji)) {
          // Emoji updated
          this.client.actions.ServerEmojiUpdate.handle(cachedEmoji, emoji);
        }
      } else {
        // Emoji added
        this.client.actions.ServerEmojiCreate.handle(server, emoji);
      }
    }

    for (const emoji of deletions.values()) {
      // Emoji deleted
      this.client.actions.ServerEmojiDelete.handle(emoji);
    }
  }
}

module.exports = ServerEmojisUpdateAction;
