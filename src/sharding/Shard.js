const childProcess = require('child_process');
const path = require('path');
const crypto = require('crypto');

class Shard {
  constructor(manager, id) {
    this.manager = manager;
    this.id = id;
    this.process = childProcess.fork(path.resolve(this.manager.file), [id, this.manager.shards.size], { silent: true });
    this.process.on('message', m => {
      if (m && m.type && m.id) {

      }
    });
  }

  send(type, timeout = 60000, data = {}) {
    return new Promise((resolve, reject) => {
      const id = crypto.randomBytes(16).toString('hex');
      this.process.send({
        type,
        id,
        data,
      });
    });
  }
}

module.exports = Shard;
