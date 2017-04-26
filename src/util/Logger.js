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
    this.emit('trace', ...rest);
    if (level !== 'trace') {
      this.emit(level, ...rest);
      for (let i = LogLevels.indexOf(level.toUpperCase()) - 1; i >= 1; i--) {
        const l = LogLevels[i].toLowerCase();
        if (!this.listenerCount(l)) continue;
        this.emit(`c_${l}`, ...rest);
      }
    }
  }

  on(event, cb, cascading = false) {
    return super.on(cascading ? `c_${event}` : event, cb);
  }
}

for (const level of LogLevels) {
  Logger.prototype[level.toLowerCase()] = function log(...args) {
    return this.log(level, ...args);
  };
}

module.exports = Logger;
