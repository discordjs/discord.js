'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class GuildEmojiUpdateAction extends Action {
  handle(current, data) {
    const old = current._update(data);
    /**
     * Emitted whenever a custom emoji is updated in a guild.
     * @event Client#emojiUpdate
     * @param {GuildEmoji} oldEmoji The old emoji
     * @param {GuildEmoji} newEmoji The new emoji
     */
    this.client.emit(Events.GuildEmojiUpdate, old, current);
    return { emoji: current };
  }
}

module.exports = GuildEmojiUpdateAction;
