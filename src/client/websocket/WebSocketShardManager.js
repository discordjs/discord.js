const EventEmitter = require('events').EventEmitter;
const WebSocketManager = require('./WebSocketManager');
const Constants = require('../../util/Constants');
const PacketManager = require('./packets/WebSocketPacketManager');
const Collection = require('../../util/Collection');

class WebSocketShardManager extends EventEmitter {
  constructor(client) { // eslint-disable-line consistent-return
    super();
    this.client = client;

    this.packetManager = new PacketManager(this);

    this.managers = new Collection();

    this.gateway = null;

    this.afterConnect = false;
    this.afterReady = false;

    if (client.options.shardCount !== 'auto') {
      this.shardCount = Math.max(1, client.options.shardCount);

      if (this.client.options.shardID) {
        this.spawn(0);
      } else {
        this._spawnAll();
      }
    }

    this.client.on('shardReady', () => {
      this.checkIfReady();
    });
  }

  _spawnAll() {
    this.client.emit('debug', `Spawning ${this.shardCount} shard(s)`);
    this.spawn(0);
    const interval = setInterval(() => {
      if (this.managers.size >= this.shardCount) {
        clearInterval(interval);
        return;
      }
      this.spawn(this.managers.size);
    }, 5500);
  }

  spawn(id) {
    const manager = new WebSocketManager(this.client, this.packetManager, {
      shardID: id,
      shardCount: this.shardCount,
    });

    manager.on('send', this.emit);
    manager.on('close', this.emit);

    if (this.afterConnect) manager.connect(this.gateway);

    this.managers.set(id, manager);
  }

  connect(gateway, shardCount) {
    this.gateway = gateway;
    this.afterConnect = true;
    if (shardCount) {
      this.shardCount = shardCount;
      this._spawnAll();
    } else {
      for (const manager of this.managers.values()) {
        manager.connect(gateway);
      }
    }
  }

  checkIfReady() {
    if (this.managers.size < this.shardCount) return;
    if (this.managers.every((m) => m.status === Constants.Status.READY)) {
      if (!this.afterReady) {
        /**
         * Emitted when the Client becomes ready to start working
         * @event Client#ready
         */
        this.client.emit(Constants.Events.READY);
        this.afterReady = true;
      }
    }
  }

  broadcast(data) {
    for (const manager of this.managers.values()) manager.send(data);
  }
}

module.exports = WebSocketShardManager;
