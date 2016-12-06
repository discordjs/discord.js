class ConverterEngine extends global.EventEmitter {
  constructor(player) {
    super();
    this.player = player;
  }

  createConvertStream() {
    return;
  }
}

module.exports = ConverterEngine;
