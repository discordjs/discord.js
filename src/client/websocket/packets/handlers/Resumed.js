const AbstractHandler = require('./AbstractHandler');
const { Events, Status } = require('../../../../util/Constants');

class ResumedHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const ws = client.ws.connection;

    ws._trace = packet.d._trace;

    ws.status = Status.READY;
    this.packetManager.handleQueue();

    const replayed = ws.sequence - ws.closeSequence;

    ws.debug(`RESUMED ${ws._trace.join(' -> ')} | replayed ${replayed} events.`);
    client.emit(Events.RESUMED, replayed);
    ws.heartbeat();
  }
}

/**
 * Emitted whenever a WebSocket resumed.
 * @event Client#resumed
 * @param {number} replayed The number of events that were replayed
 */

module.exports = ResumedHandler;
