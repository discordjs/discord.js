const AbstractHandler = require('./AbstractHandler');
const { Events, Status } = require('../../../../util/Constants');

class ResumedHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const shard = packet.shard;

    shard._trace = packet.d._trace;

    shard.status = Status.READY;
    this.packetManager.handleQueue();

    const replayed = shard.sequence - shard.closeSequence;

    shard.debug(`RESUMED ${shard._trace.join(' -> ')} | replayed ${replayed} events.`);
    client.emit(Events.RESUMED, replayed);
    shard.heartbeat();
  }
}

/**
 * Emitted whenever a WebSocket resumes.
 * @event Client#resumed
 * @param {number} replayed The number of events that were replayed
 */

module.exports = ResumedHandler;
