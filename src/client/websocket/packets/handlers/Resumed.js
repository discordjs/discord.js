const AbstractHandler = require('./AbstractHandler');
const Constants = require('../../../../util/Constants');

class ResumedHandler extends AbstractHandler {
  handle() {
    const client = this.packetManager.client;
    const ws = client.ws.connection;

    ws.status = Constants.Status.READY;
    this.packetManager.handleQueue();

    const replayed = ws.sequence - ws.closeSequence;

    ws.debug(`RESUMED | replayed ${replayed} events.`);
    client.emit(Constants.Events.RESUME, replayed);
    ws.heartbeat();
  }
}

/**
 * Emitted whenever a WebSocket resumes.
 * @event Client#resume
 * @param {number} replayed The number of events that were replayed
 */

module.exports = ResumedHandler;
