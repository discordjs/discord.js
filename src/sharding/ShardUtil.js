/**
 * Helper class for sharded clients
 */
class ShardUtil {
  /**
   * @param {Client} client Client of the current shard
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Handles an IPC message
   * @param {*} message Message received
   */
  _handleMessage(message) {
    if (!message) return;
    if (message._eval) {
      try {
        process.send({ _evalResult: eval(message._eval) });
      } catch (err) {
        process.send({ _evalError: err });
      }
    } else if (message._fetchProp) {
      const props = message._fetchProp.split('.');
      let value = this.client;
      for (const prop of props) value = value[prop];
      process.send({ _fetchProp: message._fetchProp, _fetchPropValue: value });
    }
  }

  /**
   * Creates/gets the singleton of this class
   * @param {Client} client Client to use
   * @returns {ShardUtil}
   */
  static singleton(client) {
    if (!this._singleton) {
      this._singleton = new this(client);
    } else {
      client.emit('error', 'Multiple clients created in child process; only the first will handle sharding helpers.');
    }
    return this._singleton;
  }
}

module.exports = ShardUtil;
