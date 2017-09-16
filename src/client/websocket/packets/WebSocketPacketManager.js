const { OPCodes, Status, WSEvents } = require('../../../util/Constants');

const BeforeReadyWhitelist = [
  WSEvents.READY,
  WSEvents.RESUMED,
  WSEvents.GUILD_CREATE,
  WSEvents.GUILD_DELETE,
  WSEvents.GUILD_MEMBERS_CHUNK,
  WSEvents.GUILD_MEMBER_ADD,
  WSEvents.GUILD_MEMBER_REMOVE,
];

class WebSocketPacketManager {
  constructor(connection) {
    this.ws = connection;
    this.handlers = {};
    this.queue = [];

    this.register(WSEvents.READY, require('./handlers/Ready'));
    this.register(WSEvents.RESUMED, require('./handlers/Resumed'));
    this.register(WSEvents.GUILD_CREATE, require('./handlers/GuildCreate'));
    this.register(WSEvents.GUILD_DELETE, require('./handlers/GuildDelete'));
    this.register(WSEvents.GUILD_UPDATE, require('./handlers/GuildUpdate'));
    this.register(WSEvents.GUILD_BAN_ADD, require('./handlers/GuildBanAdd'));
    this.register(WSEvents.GUILD_BAN_REMOVE, require('./handlers/GuildBanRemove'));
    this.register(WSEvents.GUILD_MEMBER_ADD, require('./handlers/GuildMemberAdd'));
    this.register(WSEvents.GUILD_MEMBER_REMOVE, require('./handlers/GuildMemberRemove'));
    this.register(WSEvents.GUILD_MEMBER_UPDATE, require('./handlers/GuildMemberUpdate'));
    this.register(WSEvents.GUILD_ROLE_CREATE, require('./handlers/GuildRoleCreate'));
    this.register(WSEvents.GUILD_ROLE_DELETE, require('./handlers/GuildRoleDelete'));
    this.register(WSEvents.GUILD_ROLE_UPDATE, require('./handlers/GuildRoleUpdate'));
    this.register(WSEvents.GUILD_EMOJIS_UPDATE, require('./handlers/GuildEmojisUpdate'));
    this.register(WSEvents.GUILD_MEMBERS_CHUNK, require('./handlers/GuildMembersChunk'));
    this.register(WSEvents.CHANNEL_CREATE, require('./handlers/ChannelCreate'));
    this.register(WSEvents.CHANNEL_DELETE, require('./handlers/ChannelDelete'));
    this.register(WSEvents.CHANNEL_UPDATE, require('./handlers/ChannelUpdate'));
    this.register(WSEvents.CHANNEL_PINS_UPDATE, require('./handlers/ChannelPinsUpdate'));
    this.register(WSEvents.PRESENCE_UPDATE, require('./handlers/PresenceUpdate'));
    this.register(WSEvents.USER_UPDATE, require('./handlers/UserUpdate'));
    this.register(WSEvents.USER_NOTE_UPDATE, require('./handlers/UserNoteUpdate'));
    this.register(WSEvents.USER_SETTINGS_UPDATE, require('./handlers/UserSettingsUpdate'));
    this.register(WSEvents.USER_GUILD_SETTINGS_UPDATE, require('./handlers/UserGuildSettingsUpdate'));
    this.register(WSEvents.VOICE_STATE_UPDATE, require('./handlers/VoiceStateUpdate'));
    this.register(WSEvents.TYPING_START, require('./handlers/TypingStart'));
    this.register(WSEvents.MESSAGE_CREATE, require('./handlers/MessageCreate'));
    this.register(WSEvents.MESSAGE_DELETE, require('./handlers/MessageDelete'));
    this.register(WSEvents.MESSAGE_UPDATE, require('./handlers/MessageUpdate'));
    this.register(WSEvents.MESSAGE_DELETE_BULK, require('./handlers/MessageDeleteBulk'));
    this.register(WSEvents.VOICE_SERVER_UPDATE, require('./handlers/VoiceServerUpdate'));
    this.register(WSEvents.GUILD_SYNC, require('./handlers/GuildSync'));
    this.register(WSEvents.RELATIONSHIP_ADD, require('./handlers/RelationshipAdd'));
    this.register(WSEvents.RELATIONSHIP_REMOVE, require('./handlers/RelationshipRemove'));
    this.register(WSEvents.MESSAGE_REACTION_ADD, require('./handlers/MessageReactionAdd'));
    this.register(WSEvents.MESSAGE_REACTION_REMOVE, require('./handlers/MessageReactionRemove'));
    this.register(WSEvents.MESSAGE_REACTION_REMOVE_ALL, require('./handlers/MessageReactionRemoveAll'));
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
    if (packet.op === OPCodes.HEARTBEAT_ACK) {
      this.ws.client._pong(this.ws.client._pingTimestamp);
      this.ws.lastHeartbeatAck = true;
      this.ws.client.emit('debug', 'Heartbeat acknowledged');
    } else if (packet.op === OPCodes.HEARTBEAT) {
      this.client.ws.send({
        op: OPCodes.HEARTBEAT,
        d: this.client.ws.sequence,
      });
      this.ws.client.emit('debug', 'Received gateway heartbeat');
    }

    if (this.ws.status === Status.RECONNECTING) {
      this.ws.reconnecting = false;
      this.ws.checkIfReady();
    }

    this.ws.setSequence(packet.s);

    if (this.ws.disabledEvents[packet.t] !== undefined) return false;

    if (this.ws.status !== Status.READY) {
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
