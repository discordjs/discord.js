'use strict';

const { Events } = require('../../util/Events.js');
const { Action } = require('./Action.js');

class GuildEmojiUpdateAction extends Action {
  handle(current, data) {
    const old = current._update(data);
    /**
     * Emitted whenever a custom emoji is updated in a guild.
     *
     * @event Client#emojiUpdate
     * @param {GuildEmoji} oldEmoji The old emoji
     * @param {GuildEmoji} newEmoji The new emoji
     */
    this.client.emit(Events.GuildEmojiUpdate, old, current);
    return { emoji: current };
  }
}

exports.GuildEmojiUpdateAction = GuildEmojiUpdateAction;
