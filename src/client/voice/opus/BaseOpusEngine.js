class BaseOpus {
  constructor(player) {
    this.player = player;

    this.ctl = {
      FEC: 4012,
      PLP: 4014,
    };
  }

  init() {
    // enable FEC (forward error correction)
    this.setFEC(true);

    // set PLP (expected packet loss percentage) to 15%
    this.setPLP(0.15);
  }

  encode(buffer) {
    return buffer;
  }

  decode(buffer) {
    return buffer;
  }

  destroy() {
    return;
  }
}

module.exports = BaseOpus;
