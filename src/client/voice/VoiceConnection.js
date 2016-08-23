const VoiceConnectionWebSocket = require('./VoiceConnectionWebSocket');
const EventEmitter = require('events').EventEmitter;

class VoiceConnection extends EventEmitter {
  constructor(manager, serverID, token, sessionID, endpoint) {
    super();
    this.manager = manager;
    this.websocket = new VoiceConnectionWebSocket(this, serverID, token, sessionID, endpoint);
    this.bindListeners();
  }

  bindListeners() {
    this.websocket.on('ready-for-udp', data => {
      console.log(data);
    });
  }
}

module.exports = VoiceConnection;
