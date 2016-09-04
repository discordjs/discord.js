const EventEmitter = require('events').EventEmitter;

class ConverterEngine extends EventEmitter {
  constructor(player) {
    super();
    this.player = player;
  }

  createConvertStream() {
    return;
  }
}

module.exports = ConverterEngine;
