const Action = require('./Action');
const Constants = require('../../util/Constants');

class GuildEmojiDeleteAction extends Action {
  handle(emoji) {
    emoji.guild.emojis.remove(emoji.id);
    this.client.emit(Constants.Events.GUILD_EMOJI_DELETE, emoji);
    return { emoji };
  }
}

/**
 * Emitted whenever a custom guild emoji is deleted.
 * @event Client#emojiDelete
 * @param {Emoji} emoji The emoji that was deleted
 */

module.exports = GuildEmojiDeleteAction;
