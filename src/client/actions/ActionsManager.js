'use strict';

class ActionsManager {
  constructor(client) {
    this.client = client;

    this.register(require('./MessageCreate'));
    this.register(require('./MessageDelete'));
    this.register(require('./MessageDeleteBulk'));
    this.register(require('./MessageUpdate'));
    this.register(require('./MessageReactionAdd'));
    this.register(require('./MessageReactionRemove'));
    this.register(require('./MessageReactionRemoveAll'));
    this.register(require('./MessageReactionRemoveEmoji'));
    this.register(require('./ChannelCreate'));
    this.register(require('./ChannelDelete'));
    this.register(require('./ChannelUpdate'));
    this.register(require('./ServerDelete'));
    this.register(require('./ServerUpdate'));
    this.register(require('./InviteCreate'));
    this.register(require('./InviteDelete'));
    this.register(require('./ServerMemberRemove'));
    this.register(require('./ServerMemberUpdate'));
    this.register(require('./ServerBanRemove'));
    this.register(require('./ServerRoleCreate'));
    this.register(require('./ServerRoleDelete'));
    this.register(require('./ServerRoleUpdate'));
    this.register(require('./PresenceUpdate'));
    this.register(require('./UserUpdate'));
    this.register(require('./VoiceStateUpdate'));
    this.register(require('./ServerEmojiCreate'));
    this.register(require('./ServerEmojiDelete'));
    this.register(require('./ServerEmojiUpdate'));
    this.register(require('./ServerEmojisUpdate'));
    this.register(require('./ServerRolesPositionUpdate'));
    this.register(require('./ServerChannelsPositionUpdate'));
    this.register(require('./ServerIntegrationsUpdate'));
    this.register(require('./WebhooksUpdate'));
    this.register(require('./TypingStart'));
  }

  register(Action) {
    this[Action.name.replace(/Action$/, '')] = new Action(this.client);
  }
}

module.exports = ActionsManager;
