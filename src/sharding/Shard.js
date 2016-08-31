const childProcess = require('child_process');
const path = require('path');
const crypto = require('crypto');

class Shard {
  constructor(manager, id) {
    this.manager = manager;
    this.id = id;
    this.process = childProcess.fork(path.resolve(this.manager.file), [id, this.manager.shards.size], { silent: true });
    this.waitingForResponse = new Map();
    this.process.on('message', m => {
      if (m && m.type && m.id) {
        if (this.waitingForResponse.get(m.id)) {
          const resp = this.waitingForResponse.get(m.id);
          resp.resolve(m.data);
          this.waitingForResponse.delete(m.id);
        } else {
          const reply = data => {
            this.send(m.id);
          }
        }
      }
    });
  }

  send(type, timeout = 60000, data = {}) {
    const id = crypto.randomBytes(16).toString('hex');
    this._send(id, type, timeout, data);
  }

  _send(id, type, timeout, data) {
    return new Promise((resolve, reject) => {
      this.process.send({
        type,
        id,
        data,
      });
      this.waitingForResponse.set(id, {
        resolve,
      });
      setTimeout(() => {
        reject(new Error('did not receive response'));
        this.waitingForResponse.delete(id);
      }, timeout);
    });
  }
}

module.exports = Shard;
