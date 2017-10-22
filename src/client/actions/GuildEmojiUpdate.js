const Action = require('./Action');
const { Events } = require('../../util/Constants');

class GuildEmojiUpdateAction extends Action {
  handle(current, data) {
    const old = current._update(data);
    this.client.emit(Events.GUILD_EMOJI_UPDATE, old, current);
    return { emoji: current };
  }
}

/**
 * Emitted whenever a custom guild emoji is updated.
 * @event Client#emojiUpdate
 * @param {Emoji} oldEmoji The old emoji
 * @param {Emoji} newEmoji The new emoji
 */

module.exports = GuildEmojiUpdateAction;
