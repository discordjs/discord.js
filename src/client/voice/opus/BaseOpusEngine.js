class BaseOpus {
  constructor(player) {
    this.player = player;
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
