const EventEmitter = require('events');

//  TRACE > DEBUG > INFO > WARN > ERROR
const LogLevels = [
  'TRACE',
  'DEBUG',
  'INFO',
  'WARN',
  'ERROR',
];

/**
 * Logger for logging things
 * @private
 */
class Logger extends EventEmitter {
  log(level, ...rest) {
    this.emit(`strict_${level}`, ...rest);
    for (let i = LogLevels.indexOf(level.toUpperCase()); i >= 0; i--) {
      const l = LogLevels[i].toLowerCase();
      if (!this.listenerCount(l)) continue;
      this.emit(l, ...rest);
    }
  }

  on(event, cb, strict = true) {
    return super.on(strict ? `strict_${event}` : event, cb);
  }
}

for (const level of LogLevels) {
  Logger.prototype[level.toLowerCase()] = function log(...args) {
    return this.log(level, ...args);
  };
}

module.exports = Logger;
