const long = require('long');
const { TypeError } = require('../../errors');

/**
 * @typedef {Object} MessageSearchOptions
 * @property {string} [content] Message content
 * @property {Snowflake} [maxID] Maximum ID for the filter
 * @property {Snowflake} [minID] Minimum ID for the filter
 * @property {string} [has] One of `link`, `embed`, `file`, `video`, `image`, or `sound`,
 * or add `-` to negate (e.g. `-file`)
 * @property {ChannelResolvable} [channel] Channel to limit search to (only for guild search endpoint)
 * @property {UserResolvable} [author] Author to limit search
 * @property {string} [authorType] One of `user`, `bot`, `webhook`, or add `-` to negate (e.g. `-webhook`)
 * @property {string} [sortBy='recent'] `recent` or `relevant`
 * @property {string} [sortOrder='descending'] `ascending` or `descending`
 * @property {number} [contextSize=2] How many messages to get around the matched message (0 to 2)
 * @property {number} [limit=25] Maximum number of results to get (1 to 25)
 * @property {number} [offset=0] Offset the "pages" of results (since you can only see 25 at a time)
 * @property {UserResolvable} [mentions] Mentioned user filter
 * @property {boolean} [mentionsEveryone] If everyone is mentioned
 * @property {string} [linkHostname] Filter links by hostname
 * @property {string} [embedProvider] The name of an embed provider
 * @property {string} [embedType] one of `image`, `video`, `url`, `rich`, or add `-` to negate (e.g. `-image`)
 * @property {string} [attachmentFilename] The name of an attachment
 * @property {string} [attachmentExtension] The extension of an attachment
 * @property {Date} [before] Date to find messages before
 * @property {Date} [after] Date to find messages before
 * @property {Date} [during] Date to find messages during (range of date to date + 24 hours)
 * @property {boolean} [nsfw=false] Include results from NSFW channels
 */

/**
 * @typedef {Object} MessageSearchResult
 * @property {number} total Total result count
 * @property {Array<Message[]>} results Array of message results
 * The message which has triggered the result will have the `hit` property set to `true`
 */

module.exports = function search(target, options) {
  if (typeof options === 'string') options = { content: options };
  if (options.before) {
    if (!(options.before instanceof Date)) options.before = new Date(options.before);
    options.maxID = long.fromNumber(options.before.getTime() - 14200704e5).shiftLeft(22).toString();
  }
  if (options.after) {
    if (!(options.after instanceof Date)) options.after = new Date(options.after);
    options.minID = long.fromNumber(options.after.getTime() - 14200704e5).shiftLeft(22).toString();
  }
  if (options.during) {
    if (!(options.during instanceof Date)) options.during = new Date(options.during);
    const t = options.during.getTime() - 14200704e5;
    options.minID = long.fromNumber(t).shiftLeft(22).toString();
    options.maxID = long.fromNumber(t + 864e5).shiftLeft(22).toString();
  }
  if (options.channel) options.channel = target.client.channels.resolveID(options.channel);
  if (options.author) options.author = target.client.users.resolveID(options.author);
  if (options.mentions) options.mentions = target.client.users.resolveID(options.options.mentions);
  if (options.sortOrder) {
    options.sortOrder = { ascending: 'asc', descending: 'desc' }[options.sortOrder] || options.sortOrder;
  }
  options = {
    content: options.content,
    max_id: options.maxID,
    min_id: options.minID,
    has: options.has,
    channel_id: options.channel,
    author_id: options.author,
    author_type: options.authorType,
    context_size: options.contextSize,
    sort_by: options.sortBy,
    sort_order: options.sortOrder,
    limit: options.limit,
    offset: options.offset,
    mentions: options.mentions,
    mentions_everyone: options.mentionsEveryone,
    link_hostname: options.linkHostname,
    embed_provider: options.embedProvider,
    embed_type: options.embedType,
    attachment_filename: options.attachmentFilename,
    attachment_extension: options.attachmentExtension,
    include_nsfw: options.nsfw,
  };

  // Lazy load these because some of them use util
  const Channel = require('../Channel');
  const Guild = require('../Guild');

  if (!(target instanceof Channel || target instanceof Guild)) throw new TypeError('SEARCH_CHANNEL_TYPE');

  let endpoint = target.client.api[target instanceof Channel ? 'channels' : 'guilds'](target.id).messages().search;
  return endpoint.get({ query: options }).then(body => {
    const results = body.messages.map(x =>
      x.map(m => target.client.channels.get(m.channel_id).messages.create(m, false))
    );
    return {
      total: body.total_results,
      results,
    };
  });
};
