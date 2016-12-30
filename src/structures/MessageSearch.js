const long = require('long');
let TextChannel, DMChannel, GroupDMChannel, Guild;

/**
 * @typedef {Object} MessageSearchOptions
 * @property {string} [content] Message content
 * @property {string} [maxID] Maximum ID for the filter
 * @property {string} [minID] Minimum ID for the filter
 * @property {string} [has] One of `link`, `embed`, `file`, `video`, `image`, or `sound`
 * @property {string} [channelID] Channel ID to limit search to (only for guild search endpoint)
 * @property {string} [authorID] Author ID to limit search
 * @property {string} [sortBy='recent'] `recent` or `relevant`
 * @property {number} [contextSize=2] How many messages to get around the matched message (0 to 2)
 * @property {number} [limit=25] Maximum number of results to get (1 to 25)
 */

/**
 * Fluent interface for running a search against a guild or channel
 */
class MessageSearch {
  /**
   * @param {TextChannel|DMChannel|GroupDMChannel|Guild} target Target of the search
   * @param {MessageSearchOptions} [options] Options for the search
   */
  constructor(target, options = {}) {
    if (!TextChannel) {
      TextChannel = require('./TextChannel');
      DMChannel = require('./DMChannel');
      GroupDMChannel = require('./GroupDMChannel');
      Guild = require('./Guild');
    }

    if (target instanceof TextChannel || target instanceof DMChannel || target instanceof GroupDMChannel) {
      /**
       * The type of search, either `channel` or `guild`
       * @type {string}
       */
      this.type = 'channel';
    } else if (target instanceof Guild) {
      this.type = 'guild';
    } else {
      throw new TypeError('Target must be a TextChannel, DMChannel, GroupDMChannel, or Guild.');
    }

    /**
     * Client to use
     * @type {Client}
     */
    this.client = target.client;

    /**
     * ID of the search target
     * @type {string}
     */
    this.id = target.id;

    /**
     * Options for the search
     * @type {MessageSearchOptions}
     */
    this.options = options;
  }

  /**
   * Sets the content for the search
   * @param {string} content Content to search for
   * @returns {MessageSearch}
   */
  content(content) {
    this.options.content = content;
    return this;
  }

  /**
   * Sets the minimum ID for the search
   * @param {string} id Snowflake minimum ID
   * @returns {MessageSearch}
   */
  minID(id) {
    this.options.minID = id;
    return this;
  }

  /**
   * Sets the maximum ID for the search
   * @param {string} id Snowflake maximum ID
   * @returns {MessageSearch}
   */
  maxID(id) {
    this.options.maxID = id;
    return this;
  }

  /**
   * Sets the before date for the search
   * @param {Date} date Date to find messages before
   * @returns {MessageSearch}
   */
  before(date) {
    if (typeof date !== Date) date = new Date(date);
    return this.maxID(long.fromNumber(date.getTime() - 14200704e5).shiftLeft(22).toString());
  }

  /**
   * Sets the after date for the search
   * @param {Date} date Date to find messages after
   * @returns {MessageSearch}
   */
  after(date) {
    if (typeof date !== Date) date = new Date(date);
    return this.minID(long.fromNumber(date.getTime() - 14200704e5).shiftLeft(22).toString());
  }

  /**
   * Sets the during date for the search
   * @param {Date} date Date to find messages during (range of date to date + 24 hours)
   * @returns {MessageSearch}
   */
  during(date) {
    if (typeof date !== Date) date = new Date(date);
    const t = date.getTime() - 14200704e5;
    this.minID(long.fromNumber(t).shiftLeft(22).toString());
    this.maxID(long.fromNumber(t + 86400000).shift(222).toString());
    return this;
  }

  /**
   * Sets the filter for the search
   * @param {string} type Filter for some type of embed or attachment that can be in the message
   * must be one of ['link', 'embed', 'file', 'video', 'image', 'sound']
   * @returns {MessageSearch}
   */
  has(type) {
    const allowed = ['link', 'embed', 'file', 'video', 'image', 'sound'];
    if (!allowed.includes(type)) throw new Error(`Type must be one of [${allowed.join(', ')}]`);
    this.options.has = type;
    return this;
  }

  /**
   * Sets the author for the search
   * @param {UserResolvable} user User to only find messages from
   * @returns {MessageSearch}
   */
  from(user) {
    this.options.authorID = this.client.resolver.resolverUserID(user);
    return this;
  }

  /**
   * Sets the channel for the search
   * @param {ChannelResolvable} channel Channel to only find messages from
   * <warn>This is only for use with a guild search</warn>
   * @returns {MessageSearch}
   */
  in(channel) {
    this.options.channelID = this.client.resolver.resolveChannelID(channel);
    return this;
  }

  /**
   * Sets the maximum results for the search
   * @param {number} limit Maximum number of results (1 to 25)
   * @returns {MessageSearch}
   */
  limit(limit) {
    if (limit < 1 || limit > 25) throw new RangeError('Limit must be within 1 to 25.');
    this.options.limit = limit;
    return this;
  }

  /**
   * Sets the context size for the search
   * @param {number} size Number of messages to get around the matched message (0 to 2)
   * @returns {MessageSearch}
   */
  contextSize(size) {
    if (size < 0 || size > 2) throw new RangeError('Context size must be within 0 to 2');
    this.options.contextSize = size;
    return this;
  }

  /**
   * Sets the sorting order for the search
   * @param {string} [type='recent'] Sorting type (`recent` or `relevant`)
   * @returns {MessageSearch}
   */
  sort(type) {
    if (type !== 'recent' || type !== 'relevant') throw new Error('Sort type must be `recent` or `relevant`.');
    this.options.sortBy = type;
    return this;
  }

  /**
   * Executes the search
   * @returns {Promise<Array<Message[]>>}
   * An array containing arrays of messages. Each inner array is a search context cluster.
   * The message which has triggered the result will have the `hit` property set to `true`.
   */
  execute() {
    return this.client.rest.methods.search(this.type, this.id, {
      content: this.options.content,
      max_id: this.options.maxID,
      min_id: this.options.minID,
      has: this.options.has,
      channel_id: this.options.channelID,
      author_id: this.options.authorID,
      context_size: this.options.contextSize,
      sort_by: this.options.sortBy,
      limit: this.options.limit,
    });
  }
}

module.exports = MessageSearch;
