const EventEmitter = require('events').EventEmitter;
const WebSocketManager = require('./WebSocketManager');

class WebSocketShardManager extends EventEmitter {
  constructor(client) {
    super();

    this.managers = [];

    this.gateway = null;

    if (client.options.shardCount && !client.options.shardID) {
      for (let i = 0; i < client.options.shardCount; i++) {
        const manager = new WebSocketManager(client, {
          shardID: i,
          shardCount: client.options.shardCount,
        });

        manager.on('send', this.emit);
        manager.on('close', this.emit);
        this.managers.push(manager);
      }
    } else {
      this.managers.push(new WebSocketManager(client));
    }
  }

  connect(gateway) {
    this.gateway = gateway;
    for (const manager of this.managers) manager.connect(gateway);
  }

  heartbeat() {
    for (const manager of this.managers) manager.heartbeat();
  }

  send(data) {
    for (const manager of this.managers) manager.send(data);
  }
}

module.exports = WebSocketShardManager;
