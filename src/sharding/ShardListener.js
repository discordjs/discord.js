const crypto = require('crypto');

class ShardListener {
  constructor() {
    this.waitingForResponse = new Map();
    this.process = process;
  }

  send(type, timeout = 60000, data = {}) {
    return new Promise((resolve, reject) => {
      const id = crypto.randomBytes(16).toString('hex');
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

module.exports = ShardListener;
