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
    super.init();
  }

  setFEC(enabled) {
    this.encoder.encoderCTL(this.ctl.FEC, enabled ? 1 : 0);
  }

  setPLP(percent) {
    this.encoder.encoderCTL(this.ctl.PLP, Math.min(100, Math.max(0, percent * 100)));
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
