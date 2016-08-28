const OpusEngine = require('./BaseOpusEngine');

let opusscript;

class NodeOpusEngine extends OpusEngine {
  constructor(player) {
    super(player);
    try {
      // eslint-disable-next-line import/no-unresolved
      opusscript = require('opusscript');
    } catch (err) {
      throw err;
    }
    this.encoder = new opusscript(48000, 2);
  }

  encode(buffer) {
    super.encode(buffer);
    return this.encoder.encode(buffer, 960);
  }

  decode(buffer) {
    super.decode(buffer);
    return this.encoder.decode(buffer);
  }
}

module.exports = NodeOpusEngine;
