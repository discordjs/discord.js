const Constants = require('../../../util/Constants');

const BeforeReadyWhitelist = [
  Constants.WSEvents.READY,
  Constants.WSEvents.RESUMED,
  Constants.WSEvents.GUILD_CREATE,
  Constants.WSEvents.GUILD_DELETE,
  Constants.WSEvents.GUILD_MEMBERS_CHUNK,
  Constants.WSEvents.GUILD_MEMBER_ADD,
  Constants.WSEvents.GUILD_MEMBER_REMOVE,
];

class WebSocketPacketManager {
  constructor(connection) {
    this.ws = connection;
    this.handlers = {};
    this.queue = [];

    this.register(Constants.WSEvents.READY, require('./handlers/Ready'));
    this.register(Constants.WSEvents.RESUMED, require('./handlers/Resumed'));
    this.register(Constants.WSEvents.GUILD_CREATE, require('./handlers/GuildCreate'));
    this.register(Constants.WSEvents.GUILD_DELETE, require('./handlers/GuildDelete'));
    this.register(Constants.WSEvents.GUILD_UPDATE, require('./handlers/GuildUpdate'));
    this.register(Constants.WSEvents.GUILD_BAN_ADD, require('./handlers/GuildBanAdd'));
    this.register(Constants.WSEvents.GUILD_BAN_REMOVE, require('./handlers/GuildBanRemove'));
    this.register(Constants.WSEvents.GUILD_MEMBER_ADD, require('./handlers/GuildMemberAdd'));
    this.register(Constants.WSEvents.GUILD_MEMBER_REMOVE, require('./handlers/GuildMemberRemove'));
    this.register(Constants.WSEvents.GUILD_MEMBER_UPDATE, require('./handlers/GuildMemberUpdate'));
    this.register(Constants.WSEvents.GUILD_ROLE_CREATE, require('./handlers/GuildRoleCreate'));
    this.register(Constants.WSEvents.GUILD_ROLE_DELETE, require('./handlers/GuildRoleDelete'));
    this.register(Constants.WSEvents.GUILD_ROLE_UPDATE, require('./handlers/GuildRoleUpdate'));
    this.register(Constants.WSEvents.GUILD_EMOJIS_UPDATE, require('./handlers/GuildEmojisUpdate'));
    this.register(Constants.WSEvents.GUILD_MEMBERS_CHUNK, require('./handlers/GuildMembersChunk'));
    this.register(Constants.WSEvents.GUILD_INTEGRATIONS_UPDATE, require('./handlers/GuildIntegrationsUpdate'));
    this.register(Constants.WSEvents.CHANNEL_CREATE, require('./handlers/ChannelCreate'));
    this.register(Constants.WSEvents.CHANNEL_DELETE, require('./handlers/ChannelDelete'));
    this.register(Constants.WSEvents.CHANNEL_UPDATE, require('./handlers/ChannelUpdate'));
    this.register(Constants.WSEvents.CHANNEL_PINS_UPDATE, require('./handlers/ChannelPinsUpdate'));
    this.register(Constants.WSEvents.PRESENCE_UPDATE, require('./handlers/PresenceUpdate'));
    this.register(Constants.WSEvents.USER_UPDATE, require('./handlers/UserUpdate'));
    this.register(Constants.WSEvents.USER_NOTE_UPDATE, require('./handlers/UserNoteUpdate'));
    this.register(Constants.WSEvents.USER_SETTINGS_UPDATE, require('./handlers/UserSettingsUpdate'));
    this.register(Constants.WSEvents.USER_GUILD_SETTINGS_UPDATE, require('./handlers/UserGuildSettingsUpdate'));
    this.register(Constants.WSEvents.VOICE_STATE_UPDATE, require('./handlers/VoiceStateUpdate'));
    this.register(Constants.WSEvents.TYPING_START, require('./handlers/TypingStart'));
    this.register(Constants.WSEvents.MESSAGE_CREATE, require('./handlers/MessageCreate'));
    this.register(Constants.WSEvents.MESSAGE_DELETE, require('./handlers/MessageDelete'));
    this.register(Constants.WSEvents.MESSAGE_UPDATE, require('./handlers/MessageUpdate'));
    this.register(Constants.WSEvents.MESSAGE_DELETE_BULK, require('./handlers/MessageDeleteBulk'));
    this.register(Constants.WSEvents.VOICE_SERVER_UPDATE, require('./handlers/VoiceServerUpdate'));
    this.register(Constants.WSEvents.GUILD_SYNC, require('./handlers/GuildSync'));
    this.register(Constants.WSEvents.RELATIONSHIP_ADD, require('./handlers/RelationshipAdd'));
    this.register(Constants.WSEvents.RELATIONSHIP_REMOVE, require('./handlers/RelationshipRemove'));
    this.register(Constants.WSEvents.MESSAGE_REACTION_ADD, require('./handlers/MessageReactionAdd'));
    this.register(Constants.WSEvents.MESSAGE_REACTION_REMOVE, require('./handlers/MessageReactionRemove'));
    this.register(Constants.WSEvents.MESSAGE_REACTION_REMOVE_ALL, require('./handlers/MessageReactionRemoveAll'));
    this.register(Constants.WSEvents.WEBHOOKS_UPDATE, require('./handlers/WebhooksUpdate'));
  }

  get client() {
    return this.ws.client;
  }

  register(event, Handler) {
    this.handlers[event] = new Handler(this);
  }

  handleQueue() {
    this.queue.forEach((element, index) => {
      this.handle(this.queue[index], true);
      this.queue.splice(index, 1);
    });
  }

  handle(packet, queue = false) {
    if (packet.op === Constants.OPCodes.HEARTBEAT_ACK) {
      this.ws.client._pong(this.ws.client._pingTimestamp);
      this.ws.lastHeartbeatAck = true;
      this.ws.client.emit('debug', 'Heartbeat acknowledged');
    } else if (packet.op === Constants.OPCodes.HEARTBEAT) {
      this.client.ws.send({
        op: Constants.OPCodes.HEARTBEAT,
        d: this.client.ws.sequence,
      });
      this.ws.client.emit('debug', 'Received gateway heartbeat');
    }

    if (this.ws.status === Constants.Status.RECONNECTING) {
      this.ws.reconnecting = false;
      this.ws.checkIfReady();
    }

    this.ws.setSequence(packet.s);

    if (this.ws.disabledEvents[packet.t] !== undefined) return false;

    if (this.ws.status !== Constants.Status.READY) {
      if (BeforeReadyWhitelist.indexOf(packet.t) === -1) {
        this.queue.push(packet);
        return false;
      }
    }

    if (!queue && this.queue.length > 0) this.handleQueue();
    if (this.handlers[packet.t]) return this.handlers[packet.t].handle(packet);
    return false;
  }
}

module.exports = WebSocketPacketManager;
