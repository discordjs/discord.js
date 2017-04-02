class BaseOpus {
  constructor(player) {
    this.player = player;

    this.ctl = {
      FEC: 4012,
      PLP: 4014,
    };
  }

  init() {
    try {
      // Enable FEC (forward error correction)
      this.setFEC(true);

      // Set PLP (expected packet loss percentage) to 15%
      this.setPLP(0.15);
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
