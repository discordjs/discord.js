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
}

module.exports = BaseOpus;
