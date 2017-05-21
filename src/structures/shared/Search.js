const long = require('long');

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
    options.maxID = long.fromNumber(t + 86400000).shiftLeft(22).toString();
  }
  if (options.channel) options.channel = target.client.resolver.resolveChannelID(options.channel);
  if (options.author) options.author = target.client.resolver.resolveUserID(options.author);
  if (options.mentions) options.mentions = target.client.resolver.resolveUserID(options.options.mentions);
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
  };

  // Lazy load these because some of them use util
  const Channel = require('../Channel');
  const Guild = require('../Guild');
  const Message = require('../Message');

  if (!(target instanceof Channel || target instanceof Guild)) {
    throw new TypeError('Target must be a TextChannel, DMChannel, GroupDMChannel, or Guild.');
  }

  let endpoint = target.client.api[target instanceof Channel ? 'channels' : 'guilds'](target.id).messages().search;
  return endpoint.get({ query: options }).then(body => {
    const messages = body.messages.map(x =>
      x.map(m => new Message(target.client.channels.get(m.channel_id), m, target.client))
    );
    return {
      totalResults: body.total_results,
      messages,
    };
  });
};
