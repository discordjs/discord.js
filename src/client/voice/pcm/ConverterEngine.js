let EventEmitter;
try {
  EventEmitter = require('eventemitter3');
} catch (err) {
  EventEmitter = require('events').EventEmitter;
}

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
