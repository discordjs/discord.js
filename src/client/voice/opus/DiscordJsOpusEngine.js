const OpusEngine = require('./BaseOpusEngine');

class DiscordJsOpusEngine extends OpusEngine {
  constructor(player) {
    super(player);
    const opus = require('@discordjs/opus');
    this.encoder = new opus.OpusEncoder(this.samplingRate, this.channels);
    super.init();
  }

  setBitrate(bitrate) {
    this.encoder.setBitrate(Math.min(128, Math.max(16, bitrate)) * 1000);
  }

  setFEC(enabled) {
    this.encoder.applyEncoderCTL(this.ctl.FEC, enabled ? 1 : 0);
  }

  setPLP(percent) {
    this.encoder.applyEncoderCTL(this.ctl.PLP, Math.min(100, Math.max(0, percent * 100)));
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

module.exports = DiscordJsOpusEngine;
