'use strict';

const { Events } = require('../../util/Events.js');
const { Action } = require('./Action.js');

class GuildEmojiCreateAction extends Action {
  handle(guild, createdEmoji) {
    const already = guild.emojis.cache.has(createdEmoji.id);
    const emoji = guild.emojis._add(createdEmoji);
    /**
     * Emitted whenever a custom emoji is created in a guild.
     *
     * @event Client#emojiCreate
     * @param {GuildEmoji} emoji The emoji that was created
     */
    if (!already) this.client.emit(Events.GuildEmojiCreate, emoji);
    return { emoji };
  }
}

exports.GuildEmojiCreateAction = GuildEmojiCreateAction;
