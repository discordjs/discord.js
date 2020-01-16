const OpusEngine = require('./BaseOpusEngine');

class OpusScriptEngine extends OpusEngine {
  constructor(player) {
    super(player);
    const OpusScript = require('opusscript');
    this.encoder = new OpusScript(this.samplingRate, this.channels);
    super.init();
  }

  setBitrate(bitrate) {
    this.encoder.encoderCTL(this.ctl.BITRATE, Math.min(128, Math.max(16, bitrate)) * 1000);
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
