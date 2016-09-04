class AbstractHandler {
  constructor(packetManager) {
    this.packetManager = packetManager;
  }

  handle(packet) {
    return packet;
  }
}

module.exports = AbstractHandler;
