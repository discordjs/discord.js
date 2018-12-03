'use strict';

const { Events } = require('../../../util/Constants');

/**
 * A "store" for handling broadcast dispatcher (un)subscription
 * @private
 */
class DispatcherSet extends Set {
  constructor(broadcast) {
    super();
    /**
     * The broadcast that this set belongs to
     * @type {VoiceBroadcast}
     */
    this.broadcast = broadcast;
  }

  add(dispatcher) {
    super.add(dispatcher);
    /**
     * Emitted whenever a stream dispatcher subscribes to the broadcast.
     * @event VoiceBroadcast#subscribe
     * @param {StreamDispatcher} dispatcher The subscribed dispatcher
     */
    this.broadcast.emit(Events.VOICE_BROADCAST_SUBSCRIBE, dispatcher);
    return this;
  }

  delete(dispatcher) {
    const ret = super.delete(dispatcher);
    /**
     * Emitted whenever a stream dispatcher unsubscribes to the broadcast.
     * @event VoiceBroadcast#unsubscribe
     * @param {StreamDispatcher} dispatcher The unsubscribed dispatcher
     */
    if (ret) this.broadcast.emit(Events.VOICE_BROADCAST_UNSUBSCRIBE, dispatcher);
    return ret;
  }
}

module.exports = DispatcherSet;
