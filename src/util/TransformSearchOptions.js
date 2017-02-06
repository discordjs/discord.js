const long = require('long');

/**
 * @typedef {Object} MessageSearchOptions
 * @property {string} [content] Message content
 * @property {string} [maxID] Maximum ID for the filter
 * @property {string} [minID] Minimum ID for the filter
 * @property {string} [has] One of `link`, `embed`, `file`, `video`, `image`, or `sound`,
 * or add `-` to negate (e.g. `-file`)
 * @property {ChannelResolvable} [channel] Channel to limit search to (only for guild search endpoint)
 * @property {UserResolvable} [author] Author to limit search
 * @property {string} [authorType] One of `user`, `bot`, `webhook`, or add `-` to negate (e.g. `-webhook`)
 * @property {string} [sortBy='recent'] `recent` or `relevant`
 * @property {string} [sortOrder='desc'] `asc` or `desc`
 * @property {number} [contextSize=2] How many messages to get around the matched message (0 to 2)
 * @property {number} [limit=25] Maximum number of results to get (1 to 25)
 * @property {number} [offset=0] Offset the "pages" of results (since you can only see 25 at a time)
 * @property {UserResolvable} [mentions] Mentioned user filter
 * @property {boolean} [mentionsEveryone] If everyone is mentioned
 * @property {string} [linkHostname] Filter links by hostname
 * @property {string} [embedProvider] The name of an embed provider
 * @property {string} [embedType] one of `image`, `video`, `url`, `rich`
 * @property {string} [attachmentFilename] The name of an attachment
 * @property {string} [attachmentExtension] The extension of an attachment
 * @property {Date} [before] Date to find messages before
 * @property {Date} [after] Date to find messages before
 * @property {Date} [during] Date to find messages during (range of date to date + 24 hours)
 */

module.exports = function TransformSearchOptions(options, client) {
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
    options.maxID = long.fromNumber(t + 86400000).shiftLeft(22).toString();
  }

  if (options.channel) options.channel = client.resolver.resolveChannelID(options.channel);

  if (options.author) options.author = client.resolver.resolveUserID(options.author);

  if (options.mentions) options.mentions = client.resolver.resolveUserID(options.options.mentions);

  return {
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
  };
};
