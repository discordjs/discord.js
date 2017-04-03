const Collector = require('./interfaces/Collector');
const Collection = require('../util/Collection');

class ReactionCollector extends Collector {
  constructor(message, filter, options = {}) {
    super(message.client, filter, options);
    this.message = message;
    this.users = new Collection();
    this.total = 0;
    this.client.on('messageReactionAdd', this.listener);
  }

  handle(reaction) {
    if (reaction.message.id !== this.message.id) return null;
    return [reaction.emoji.id || reaction.emoji.name, reaction];
  }

  postCheck(reaction, user) {
    this.users.set(user.id, user);
    if (this.options.max && ++this.total >= this.options.max) return 'limit';
    if (this.options.maxEmojis && this.collected.size >= this.options.maxEmojis) return 'emojiLimit';
    if (this.options.maxUsers && this.users.size >= this.options.maxUsers) return 'userLimit';
    return null;
  }

  cleanup() {
    this.client.removeListener('messageReactionAdd', this.listener);
  }
}

module.exports = ReactionCollector;
