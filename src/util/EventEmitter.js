let EE;
try {
  EE = require('eventemitter3');
} catch (_) {
  EE = require('events');
}

/**
 * @private
 */
class EventEmitter extends EE {
  emit(event, ...args) {
    super.emit(event, ...args);
    super.emit('*', { event, data: args || [] });
  }
}

EventEmitter.EventEmitter = EventEmitter;

module.exports = EventEmitter;
