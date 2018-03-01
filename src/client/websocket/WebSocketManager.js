const WebSocketShard = require('./WebSocketShard');
const { Events } = require('../../util/Constants');
const PacketHandlers = require('./handlers');

class WebSocketManager {
  constructor(client) {
    this.client = client;

    this.gateway = undefined;

    this.shards = [];
    this.spawnQueue = [];
    this.spawning = false;
  }

  debug(x) {
    this.client.emit(Events.DEBUG, `[connection] ${x}`);
  }

  spawn(query) {
    if (query !== undefined) {
      if (Array.isArray(query)) {
        for (const item of query) {
          if (!this.spawnQueue.includes(item)) this.spawnQueue.push(item);
        }
      } else if (!this.spawnQueue.includes(query)) {
        this.spawnQueue.push(query);
      }
    }
    if (this.spawning) return;
    this.spawning = true;
    const item = this.spawnQueue.shift();
    if (item === undefined) {
      this.spawning = false;
      return;
    }
    if (typeof item === 'number') {
      const shard = new WebSocketShard(this, item);
      this.shards[item] = shard;
      shard.once(Events.READY, () => {
        this.spawning = false;
        this.client.setTimeout(() => this.spawn(), 5000);
      });
    } else if (item instanceof WebSocketShard) {
      item.reconnect();
    }
  }

  connect(gateway = this.gateway) {
    this.gateway = gateway;

    if (this.client.options.shardId) {
      this.spawn(this.client.options.shardId);
    } else {
      for (let i = 0; i < this.client.options.shardCount; i++) {
        this.spawn(i);
      }
    }
  }

  handlePacket(packet, shard) {
    if (PacketHandlers[packet.t]) {
      PacketHandlers[packet.t](this.client, packet, shard);
    }
  }
}

module.exports = WebSocketManager;
