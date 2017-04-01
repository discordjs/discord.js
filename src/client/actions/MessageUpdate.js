const Action = require('./Action');
const Constants = require('../../util/Constants');
const Message = require('../../structures/Message');

class MessageUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    const channel = client.channels.get(data.channel_id);
    if (channel) {
      const message = channel.messages.get(data.id);
      if (message) {
        const newMessage = new Message(message.channel, this.patchDataPacket(data, message), client);
        newMessage._edits.push(message, ...message._edits);
        newMessage.reactions = message.reactions;
        channel.messages.set(data.id, newMessage);
        client.emit(Constants.Events.MESSAGE_UPDATE, message, newMessage);
        return {
          old: message,
          updated: newMessage,
        };
      }

      return {
        old: message,
        updated: message,
      };
    }

    return {
      old: null,
      updated: null,
    };
  }

  patchDataPacket(data, message) {
    data.type = 'type' in data ? data.type : Constants.MessageTypes.indexOf(message.type);
    data.tts = 'tts' in data ? data.tts : message.tts;
    data.timestamp = 'timestamp' in data ? data.timestamp : message.createdAt.toString();
    data.pinned = 'pinned' in data ? data.pinned : message.pinned;
    data.nonce = 'nonce' in data ? data.nonce : message.nonce;
    data.mentions = 'mentions' in data ? data.mentions : message.mentions.users.keyArray();
    data.mentions_roles = 'mentions_roles' in data ?
			data.mentions_roles : message.mentions.roles.keyArray();
    data.mention_everyone = 'mention_everyone' in data ? data.mention_everyone : message.mentions.everyone;
    data.embeds = 'embeds' in data ? data.embeds : message.embeds;
    data.content = 'content' in data ? data.content : message.content;
    data.author = 'author' in data ? data.author : {
      username: message.author.username,
      id: message.author.id,
      discriminator: message.author.discriminator,
      avatar: message.author.avatar,
    };
    data.attachments = 'attachments' in data ? data.attachments : message.attachments.array();
    return data;
  }

}

/**
 * Emitted whenever a message is updated - e.g. embed or content change.
 * @event Client#messageUpdate
 * @param {Message} oldMessage The message before the update.
 * @param {Message} newMessage The message after the update.
 */

module.exports = MessageUpdateAction;
