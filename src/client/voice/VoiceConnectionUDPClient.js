const udp = require('dgram');
const dns = require('dns');
const Constants = require('../../util/Constants');
const EventEmitter = require('events').EventEmitter;

class VoiceConnectionUDPClient extends EventEmitter {
  constructor(voiceConnection, data) {
    super();
  }
}

module.exports = VoiceConnectionUDPClient;
