const AbstractHandler = require('./AbstractHandler');

class ResumedHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const ws = client.ws.managers.get(packet.shardID);

    ws._trace = packet.d._trace;

    const replayed = ws.sequence - ws.resumeStart;
    ws.resumeStart = -1;

    ws.emit('debug', `Resumed ${ws._trace.join(' -> ')} | replayed ${replayed} events. `);
    client.emit('resume', replayed, ws.shardID);

    ws.heartbeat();
  }
}

/**
 * Emitted whenever a websocket resumes
 * @event Client#resume
 * @param {Number} replayed Number of events that were replayed
 * @param {Number} shardID ID of the shard that resumed
 */

module.exports = ResumedHandler;
