const Action = require('./Action');
const Constants = require('../../util/Constants');

class GuildEmojiCreateAction extends Action {
  handle(guild, createdEmoji) {
    const emoji = guild.emojis.create(createdEmoji);
    this.client.emit(Constants.Events.GUILD_EMOJI_CREATE, emoji);
    return { emoji };
  }
}

/**
 * Emitted whenever a custom emoji is created in a guild.
 * @event Client#emojiCreate
 * @param {Emoji} emoji The emoji that was created
 */

module.exports = GuildEmojiCreateAction;
