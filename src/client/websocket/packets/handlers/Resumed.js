const AbstractHandler = require('./AbstractHandler');

class ResumedHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const ws = client.ws;

    ws._trace = packet.d._trace;

    const replayed = ws.sequence - ws.resumeStart;
    ws.resumeStart = -1;

    client.emit('debug', `RESUMED ${ws._trace.join(' -> ')} | replayed ${replayed} events. `);
    client.emit('resume', replayed);

    ws.heartbeat();
  }
}

/**
 * Emitted whenever a websocket resumes
 * @event Client#resume
 * @param {Number} replayed Number of events that were replayed
 */

module.exports = ResumedHandler;
