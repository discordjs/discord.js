import { Events } from '../../util/Events.js';
import { Action } from './Action.js';

export class GuildEmojiDeleteAction extends Action {
  handle(emoji) {
    emoji.guild.emojis.cache.delete(emoji.id);
    /**
     * Emitted whenever a custom emoji is deleted in a guild.
     *
     * @event Client#emojiDelete
     * @param {GuildEmoji} emoji The emoji that was deleted
     */
    this.client.emit(Events.GuildEmojiDelete, emoji);
    return { emoji };
  }
}
