const childProcess = require('child_process');
const path = require('path');
const EventEmitter = require('events').EventEmitter;

class ShardingManager extends EventEmitter {
  constructor(file, totalShards) {
    super();
    this.file = file;
    if (!path.isAbsolute(file)) {
      this.file = path.resolve(`${process.cwd()}${file}`);
    }
    this.totalShards = totalShards;
    this.runningShards = 0;
    this.createShards();
  }

  createShard(id) {
    const shard = childProcess.fork(path.resolve(this.file), [id, this.totalShards]);
    this.emit('launch', id, shard);
  }

  createShards() {
    this.createShard(0);
    const interval = setInterval(() => {
      this.runningShards++;
      if (this.runningShards === this.totalShards) {
        return clearInterval(interval);
      }
      this.createShard(this.runningShards);
    }, 5500);
  }
}

module.exports = ShardingManager;
