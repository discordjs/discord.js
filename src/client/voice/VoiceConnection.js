const VoiceConnectionWebSocket = require('./VoiceConnectionWebSocket');
const VoiceConnectionUDPClient = require('./VoiceConnectionUDPClient');
const EventEmitter = require('events').EventEmitter;

class VoiceConnection extends EventEmitter {
  constructor(manager, serverID, token, sessionID, endpoint, resolve, reject) {
    super();
    this.manager = manager;
    this.endpoint = endpoint;
    this.websocket = new VoiceConnectionWebSocket(this, serverID, token, sessionID, endpoint);
    this.ready = false;
    this._resolve = resolve;
    this._reject = reject;
    this.bindListeners();
  }

  _onError(e) {
    this._reject(e);
    this.emit('error', e);
  }

  bindListeners() {
    this.websocket.on('error', err => this._onError(err));
    this.websocket.on('ready-for-udp', data => {
      this.udp = new VoiceConnectionUDPClient(this, data);
      this.udp.on('error', err => this._onError(err));
    });
    this.websocket.on('ready', () => {
      this.ready = true;
      this.emit('ready');
      this._resolve(this);
    });
  }
}

module.exports = VoiceConnection;
