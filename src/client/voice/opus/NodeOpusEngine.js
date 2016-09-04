const OpusEngine = require('./BaseOpusEngine');

let opus;

class NodeOpusEngine extends OpusEngine {
  constructor(player) {
    super(player);
    try {
      opus = require('node-opus');
    } catch (err) {
      throw err;
    }
    this.encoder = new opus.OpusEncoder(48000, 2);
  }

  encode(buffer) {
    super.encode(buffer);
    return this.encoder.encode(buffer, 1920);
  }

  decode(buffer) {
    super.decode(buffer);
    return this.encoder.decode(buffer, 1920);
  }
}

module.exports = NodeOpusEngine;
