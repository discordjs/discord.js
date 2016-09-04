const childProcess = require('child_process');
const path = require('path');
const EventEmitter = require('events').EventEmitter;
const Collection = require('../util/Collection');
const Shard = require('./Shard');

class ShardingManager extends EventEmitter {
  constructor(file, totalShards) {
    super();
    this.file = file;
    if (!path.isAbsolute(file)) {
      this.file = path.resolve(`${process.cwd()}${file}`);
    }
    this.totalShards = totalShards;
    this.shards = new Collection();
    this.waiting = new Collection();
  }

  createShard() {
    const id = this.shards.size;
    const shard = new Shard(this, id);
    this.shards.set(id, shard);
    this.emit('launch', id, shard);
  }

  spawn(amount) {
    this.totalShards = amount;
    this.createShard();
    const interval = setInterval(() => {
      if (this.shards.size === this.totalShards) {
        return clearInterval(interval);
      }
      this.createShard();
    }, 5500);
  }
}

module.exports = ShardingManager;
