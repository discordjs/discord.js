const childProcess = require('child_process');
const path = require('path');

class Shard {
  constructor(manager, id) {
    this.manager = manager;
    this.id = id;
    this.process = childProcess.fork(path.resolve(this.manager.file), [id, this.manager.shards.size]);
  }
}

module.exports = Shard;
