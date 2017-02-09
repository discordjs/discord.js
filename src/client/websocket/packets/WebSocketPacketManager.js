const Constants = require('../../../util/Constants');

const BeforeReadyWhitelist = [
  Constants.WSEvents.READY,
  Constants.WSEvents.GUILD_CREATE,
  Constants.WSEvents.GUILD_DELETE,
  Constants.WSEvents.GUILD_MEMBERS_CHUNK,
  Constants.WSEvents.GUILD_MEMBER_ADD,
  Constants.WSEvents.GUILD_MEMBER_REMOVE,
];

class WebSocketPacketManager {
  constructor(websocketShardManager) {
    this.ws = websocketShardManager;
    this.handlers = {};
    this.queue = [];

    /**
     * An object with keys that are websocket event names that should be ignored
     * @type {Object}
     */
    this.disabledEvents = {};
    for (const event of this.ws.client.options.disabledEvents) this.disabledEvents[event] = true;

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
    this.register(Constants.WSEvents.CHANNEL_CREATE, require('./handlers/ChannelCreate'));
    this.register(Constants.WSEvents.CHANNEL_DELETE, require('./handlers/ChannelDelete'));
    this.register(Constants.WSEvents.CHANNEL_UPDATE, require('./handlers/ChannelUpdate'));
    this.register(Constants.WSEvents.CHANNEL_PINS_UPDATE, require('./handlers/ChannelPinsUpdate'));
    this.register(Constants.WSEvents.PRESENCE_UPDATE, require('./handlers/PresenceUpdate'));
    this.register(Constants.WSEvents.USER_UPDATE, require('./handlers/UserUpdate'));
    this.register(Constants.WSEvents.USER_NOTE_UPDATE, require('./handlers/UserNoteUpdate'));
    this.register(Constants.WSEvents.VOICE_STATE_UPDATE, require('./handlers/VoiceStateUpdate'));
    this.register(Constants.WSEvents.VOICE_SERVER_UPDATE, require('./handlers/VoiceServerUpdate'));
    this.register(Constants.WSEvents.TYPING_START, require('./handlers/TypingStart'));
    this.register(Constants.WSEvents.MESSAGE_CREATE, require('./handlers/MessageCreate'));
    this.register(Constants.WSEvents.MESSAGE_DELETE, require('./handlers/MessageDelete'));
    this.register(Constants.WSEvents.MESSAGE_UPDATE, require('./handlers/MessageUpdate'));
    this.register(Constants.WSEvents.MESSAGE_DELETE_BULK, require('./handlers/MessageDeleteBulk'));
    this.register(Constants.WSEvents.GUILD_SYNC, require('./handlers/GuildSync'));
    this.register(Constants.WSEvents.RELATIONSHIP_ADD, require('./handlers/RelationshipAdd'));
    this.register(Constants.WSEvents.RELATIONSHIP_REMOVE, require('./handlers/RelationshipRemove'));
    this.register(Constants.WSEvents.MESSAGE_REACTION_ADD, require('./handlers/MessageReactionAdd'));
    this.register(Constants.WSEvents.MESSAGE_REACTION_REMOVE, require('./handlers/MessageReactionRemove'));
    this.register(Constants.WSEvents.MESSAGE_REACTION_REMOVE_ALL, require('./handlers/MessageReactionRemoveAll'));
  }

  get client() {
    return this.ws.client;
  }

  register(event, Handler) {
    this.handlers[event] = new Handler(this);
  }

  handleQueue() {
    this.queue.forEach((element, index) => {
      this.handle(this.queue[index]);
      this.queue.splice(index, 1);
    });
  }

  handle(packet) {
    const ws = this.ws.managers.get(packet.shardID);

    this.client.emit('raw', packet);

    if (packet.d) packet.d.shardID = packet.shardID;

    if (ws.status === Constants.Status.RECONNECTING) ws.checkIfReady();

    if (packet.op === Constants.OPCodes.RECONNECT) {
      ws.tryReconnect();
      return false;
    }

    if (packet.op === Constants.OPCodes.INVALID_SESSION) {
      ws.emit('debug', `Invalid session! Should wait: ${packet.d}`);
      if (packet.d) {
        setTimeout(() => {
          ws.sendResume();
        }, 2500);
      } else {
        ws.sessionID = null;
        ws.sendNewIdentify();
      }
      return false;
    }

    if (packet.op === Constants.OPCodes.HEARTBEAT_ACK) {
      ws.pong();
      ws.emit('debug', 'Heartbeat acknowledged');
    } else if (packet.op === Constants.OPCodes.HEARTBEAT) {
      ws.heartbeat(false);
      ws.emit('debug', 'Received gateway heartbeat');
    }

    if (this.disabledEvents[packet.t] !== undefined) return false;

    if (ws.status !== Constants.Status.READY) {
      if (!BeforeReadyWhitelist.includes(packet.t)) {
        this.queue.push(packet);
        return false;
      }
    }

    if (this.handlers[packet.t]) return this.handlers[packet.t].handle(packet);
    return false;
  }
}

module.exports = WebSocketPacketManager;
