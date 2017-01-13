const EventEmitter = require('events').EventEmitter;
const WebSocketManager = require('./WebSocketManager');
const Constants = require('../../util/Constants');

class WebSocketShardManager extends EventEmitter {
  constructor(client) { // eslint-disable-line consistent-return
    super();
    this.client = client;

    this.managers = [];

    this.gateway = null;

    this.afterConnect = false;

    this.shardCount = Math.max(1, client.options.shardCount);

    this._spawnAll();

    this.client.on('shardReady', () => {
      if (this.managers.every((m) => m.status === Constants.Status.READY)) {
        /**
         * Emitted when the Client becomes ready to start working
         * @event Client#ready
         */
        this.client.emit(Constants.Events.READY);
      }
    });
  }

  _spawnAll() {
    this.client.emit('debug', `Spawning ${this.shardCount} shards`);
    this.spawn(0);
    const interval = setInterval(() => {
      if (this.managers.length >= this.shardCount) {
        clearInterval(interval);
        return;
      }
      this.spawn(this.managers.length);
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

  _emitReady() {}
}

module.exports = WebSocketShardManager;
