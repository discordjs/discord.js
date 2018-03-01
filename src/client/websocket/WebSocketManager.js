const WebSocketShard = require('./WebSocketShard');
const { Events, Status, WSEvents } = require('../../util/Constants');
const PacketHandlers = require('./handlers');

const BeforeReadyWhitelist = [
  WSEvents.READY,
  WSEvents.RESUMED,
  WSEvents.GUILD_CREATE,
  WSEvents.GUILD_DELETE,
  WSEvents.GUILD_MEMBERS_CHUNK,
  WSEvents.GUILD_MEMBER_ADD,
  WSEvents.GUILD_MEMBER_REMOVE,
];

class WebSocketManager {
  constructor(client) {
    this.client = client;

    this.gateway = undefined;

    this.shards = [];
    this.spawnQueue = [];
    this.spawning = false;

    this.packetQueue = [];

    this.status = Status.IDLE;
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
    if (packet && this.status !== Status.READY) {
      if (BeforeReadyWhitelist.indexOf(packet.t) === -1) {
        this.packetQueue.push({ packet, shardId: shard.id });
        return false;
      }
    }

    if (this.packetQueue.length) {
      const item = this.packetQueue.shift();
      this.client.setImmediate(() => {
        this.handlePacket(item.packet, this.shards[item.shardId]);
      });
    }

    if (packet && PacketHandlers[packet.t]) {
      PacketHandlers[packet.t](this.client, packet, shard);
    }

    return false;
  }

  checkReady() {
    if (!(this.shards.filter(s => !!s).length === this.client.options.shardCount) ||
      !this.shards.every(s => s.status === Status.READY)) {
      return false;
    }

    let unavailableGuilds = 0;
    for (const guild of this.client.guilds.values()) {
      if (!guild.available) unavailableGuilds++;
    }
    if (unavailableGuilds === 0) {
      this.status = Status.NEARLY;
      if (!this.client.options.fetchAllMembers) return this.triggerReady();
      // Fetch all members before marking self as ready
      const promises = this.client.guilds.map(g => g.members.fetch());
      Promise.all(promises)
        .then(() => this.triggerReady())
        .catch(e => {
          this.debug(`Failed to fetch all members before ready! ${e}`);
          this.triggerReady();
        });
    }
    return true;
  }

  triggerReady() {
    if (this.status === Status.READY) {
      this.debug('Tried to mark self as ready, but already ready');
      return;
    }
    /**
     * Emitted when the client becomes ready to start working.
     * @event Client#ready
     */
    this.status = Status.READY;
    this.client.emit(Events.READY);
    this.handlePacket();
  }
}

module.exports = WebSocketManager;
