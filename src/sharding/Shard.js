const childProcess = require('child_process');
const path = require('path');

/**
 * Represents a Shard spawned by the ShardingManager.
 */
class Shard {
  /**
   * @param {ShardingManager} manager The sharding manager
   * @param {number} id The ID of this shard
   */
  constructor(manager, id) {
    /**
     * The manager of the spawned shard
     * @type {ShardingManager}
     */
    this.manager = manager;

    /**
     * The shard ID
     * @type {number}
     */
    this.id = id;

    /**
     * The process of the shard
     * @type {ChildProcess}
     */
    this.process = childProcess.fork(path.resolve(this.manager.file), [], {
      env: {
        SHARD_ID: this.id, SHARD_COUNT: this.manager.totalShards,
      },
    });

    this.process.on('message', message => {
      this.manager.emit('message', this, message);
    });

    this.process.once('exit', () => {
      if (this.manager.respawn) this.manager.createShard(this.id);
    });
  }

  /**
   * Sends a message to the shard's process.
   * @param {*} message Message to send to the shard
   * @returns {Promise<Shard>}
   */
  send(message) {
    return new Promise((resolve, reject) => {
      const sent = this.process.send(message, err => {
        if (err) reject(err); else resolve(this);
      });
      if (!sent) throw new Error('Failed to send message to shard\'s process.');
    });
  }
}

module.exports = Shard;
