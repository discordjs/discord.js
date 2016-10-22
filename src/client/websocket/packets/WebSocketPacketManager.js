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
  constructor(websocketManager) {
    this.ws = websocketManager;
    this.handlers = {};
    this.queue = [];

    this.register(Constants.WSEvents.READY, 'Ready');
    this.register(Constants.WSEvents.GUILD_CREATE, 'GuildCreate');
    this.register(Constants.WSEvents.GUILD_DELETE, 'GuildDelete');
    this.register(Constants.WSEvents.GUILD_UPDATE, 'GuildUpdate');
    this.register(Constants.WSEvents.GUILD_BAN_ADD, 'GuildBanAdd');
    this.register(Constants.WSEvents.GUILD_BAN_REMOVE, 'GuildBanRemove');
    this.register(Constants.WSEvents.GUILD_MEMBER_ADD, 'GuildMemberAdd');
    this.register(Constants.WSEvents.GUILD_MEMBER_REMOVE, 'GuildMemberRemove');
    this.register(Constants.WSEvents.GUILD_MEMBER_UPDATE, 'GuildMemberUpdate');
    this.register(Constants.WSEvents.GUILD_ROLE_CREATE, 'GuildRoleCreate');
    this.register(Constants.WSEvents.GUILD_ROLE_DELETE, 'GuildRoleDelete');
    this.register(Constants.WSEvents.GUILD_ROLE_UPDATE, 'GuildRoleUpdate');
    this.register(Constants.WSEvents.GUILD_MEMBERS_CHUNK, 'GuildMembersChunk');
    this.register(Constants.WSEvents.CHANNEL_CREATE, 'ChannelCreate');
    this.register(Constants.WSEvents.CHANNEL_DELETE, 'ChannelDelete');
    this.register(Constants.WSEvents.CHANNEL_UPDATE, 'ChannelUpdate');
    this.register(Constants.WSEvents.PRESENCE_UPDATE, 'PresenceUpdate');
    this.register(Constants.WSEvents.USER_UPDATE, 'UserUpdate');
    this.register(Constants.WSEvents.VOICE_STATE_UPDATE, 'VoiceStateUpdate');
    this.register(Constants.WSEvents.TYPING_START, 'TypingStart');
    this.register(Constants.WSEvents.MESSAGE_CREATE, 'MessageCreate');
    this.register(Constants.WSEvents.MESSAGE_DELETE, 'MessageDelete');
    this.register(Constants.WSEvents.MESSAGE_UPDATE, 'MessageUpdate');
    this.register(Constants.WSEvents.VOICE_SERVER_UPDATE, 'VoiceServerUpdate');
    this.register(Constants.WSEvents.MESSAGE_DELETE_BULK, 'MessageDeleteBulk');
    this.register(Constants.WSEvents.CHANNEL_PINS_UPDATE, 'ChannelPinsUpdate');
    this.register(Constants.WSEvents.GUILD_SYNC, 'GuildSync');
    this.register(Constants.WSEvents.RELATIONSHIP_ADD, 'RelationshipAdd');
    this.register(Constants.WSEvents.RELATIONSHIP_REMOVE, 'RelationshipRemove');
  }

  get client() {
    return this.ws.client;
  }

  register(event, handle) {
    const Handler = require(`./handlers/${handle}`);
    this.handlers[event] = new Handler(this);
  }

  handleQueue() {
    this.queue.forEach((element, index) => {
      this.handle(this.queue[index]);
      this.queue.splice(index, 1);
    });
  }

  setSequence(s) {
    if (s && s > this.ws.sequence) this.ws.sequence = s;
  }

  handle(packet) {
    if (packet.op === Constants.OPCodes.RECONNECT) {
      this.setSequence(packet.s);
      this.ws.tryReconnect();
      return false;
    }

    if (packet.op === Constants.OPCodes.INVALID_SESSION) {
      this.ws.sessionID = null;
      this.ws._sendNewIdentify();
      return false;
    }

    if (packet.op === Constants.OPCodes.HEARTBEAT_ACK) this.ws.client.emit('debug', 'Heartbeat acknowledged');

    if (this.ws.status === Constants.Status.RECONNECTING) {
      this.ws.reconnecting = false;
      this.ws.checkIfReady();
    }

    this.setSequence(packet.s);

    if (this.ws.disabledEvents[packet.t] !== undefined) return false;

    if (this.ws.status !== Constants.Status.READY) {
      if (BeforeReadyWhitelist.indexOf(packet.t) === -1) {
        this.queue.push(packet);
        return false;
      }
    }

    if (this.handlers[packet.t]) return this.handlers[packet.t].handle(packet);
    return false;
  }
}

module.exports = WebSocketPacketManager;
