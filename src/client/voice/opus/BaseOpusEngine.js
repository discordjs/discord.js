/**
 * The base opus encoding engine.
 * @private
 */
class BaseOpus {
  /**
   * @param {Object} [options] The options to apply to the Opus engine
   * @param {number} [options.bitrate=48] The desired bitrate (kbps)
   * @param {boolean} [options.fec=false] Whether to enable forward error correction
   * @param {number} [options.plp=0] The expected packet loss percentage
   */
  constructor({ bitrate = 48, fec = false, plp = 0 } = {}) {
    this.ctl = {
      BITRATE: 4002,
      FEC: 4012,
      PLP: 4014,
    };

    this.samplingRate = 48000;
    this.channels = 2;

    /**
     * The desired bitrate (kbps)
     * @type {number}
     */
    this.bitrate = bitrate;

    /**
     * Miscellaneous Opus options
     * @type {Object}
     */
    this.options = { fec, plp };
  }

  init() {
    try {
      this.setBitrate(this.bitrate);

      // Set FEC (forward error correction)
      if (this.options.fec) this.setFEC(this.options.fec);

      // Set PLP (expected packet loss percentage)
      if (this.options.plp) this.setPLP(this.options.plp);
    } catch (err) {
      // Opus engine likely has no support for libopus CTL
    }
  }

  encode(buffer) {
    return buffer;
  }

  decode(buffer) {
    return buffer;
  }

  destroy() {} // eslint-disable-line no-empty-function
}

module.exports = BaseOpus;
