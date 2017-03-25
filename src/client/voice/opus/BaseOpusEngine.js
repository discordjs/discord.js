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

  destroy() {} // eslint-disable-line no-empty-function
}

module.exports = BaseOpus;
