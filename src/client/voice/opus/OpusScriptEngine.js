const OpusEngine = require('./BaseOpusEngine');

let OpusScript;

class OpusScriptEngine extends OpusEngine {
  constructor(player) {
    super(player);
    try {
      OpusScript = require('opusscript');
    } catch (err) {
      throw err;
    }
    this.encoder = new OpusScript(48000, 2);
  }

  encode(buffer) {
    super.encode(buffer);
    return this.encoder.encode(buffer, 960);
  }

  decode(buffer) {
    super.decode(buffer);
    return this.encoder.decode(buffer);
  }

  destroy() {
    super.destroy();
    this.encoder.delete();
  }
}

module.exports = OpusScriptEngine;
