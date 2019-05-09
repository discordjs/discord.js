'use strict';

const Util = require('../util/Util');
const Emoji = require('./Emoji');

/**
 * Represents a limited emoji set used for both custom and unicode emojis. Custom emojis
 * will use this class opposed to the Emoji class when the client doesn't know enough
 * information about them.
 * @extends {Emoji}
 */
class ReactionEmoji extends Emoji {
  constructor(reaction, emoji) {
    super(reaction.message.client, emoji);
    /**
     * The message reaction this emoji refers to
     * @type {MessageReaction}
     */
    this.reaction = reaction;
  }

  toJSON() {
    return Util.flatten(this, { identifier: true });
  }

  valueOf() {
    return this.id;
  }
}

module.exports = ReactionEmoji;
