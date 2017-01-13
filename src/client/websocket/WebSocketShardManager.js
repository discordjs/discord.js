const EventEmitter = require('events').EventEmitter;
const WebSocketManager = require('./WebSocketManager');
const Constants = require('../../util/Constants');

class WebSocketShardManager extends EventEmitter {
  constructor(client) {
    super();
    this.client = client;

    this.shardCount = Math.max(1, client.options.shardCount);

    this.managers = [];

    this.gateway = null;

    this._spawnAll();

    this.afterConnect = false;
  }

  _spawnAll() {
    this.client.emit('debug', `Spawning ${this.shardCount} shards`);
    this.spawn(0);
    const interval = setInterval(() => {
      if (this.managers.length >= this.shardCount) {
        clearInterval(interval);
        return;
      }
      this.spawn(this.managers.size);
    }, 1000);
  }

  spawn(id) {
    const manager = new WebSocketManager(this.client, {
      shardID: id,
      shardCount: this.shardCount,
    });

    manager.on('send', this.emit);
    manager.on('close', this.emit);

    if (this.afterConnect) manager.connect(this.gateway);

    this.managers.push(manager);
  }

  connect(gateway) {
    this.gateway = gateway;
    for (const manager of this.managers) {
      manager.connect(gateway);
    }
    this.afterConnect = true;
  }

  heartbeat() {
    for (const manager of this.managers) manager.heartbeat();
  }

  send(data) {
    for (const manager of this.managers) manager.send(data);
  }
}

module.exports = WebSocketShardManager;
