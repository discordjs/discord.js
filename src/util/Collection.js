const _Collection = require('collection');
const Util = require('./Util');

/**
 * A Map with additional utility methods. This is used throughout discord.js rather than Arrays for anything that has
 * an ID, for significantly improved performance and ease-of-use.
 * @extends {Collection}
 */
class Collection extends _Collection {
  toJSON() {
    return this.map(e => typeof e.toJSON === 'function' ? e.toJSON() : Util.flatten(e));
  }
}

module.exports = Collection;
