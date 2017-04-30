/**
 * The base opus encoding engine.
 * @private
 */
class BaseOpus {
  /**
   * @param {Object} [options] The options to apply to the Opus engine
   * @param {boolean} [options.fec] Whether to enable forward error correction (defaults to false)
   * @param {number} [options.plp] The expected packet loss percentage (0-1 inclusive, defaults to 0)
   */
  constructor(options = {}) {
    this.ctl = {
      FEC: 4012,
      PLP: 4014,
    };

    this.options = options;
  }

  init() {
    try {
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
