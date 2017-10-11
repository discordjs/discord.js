const Util = require('../../util/Util');
const Embed = require('../MessageEmbed');
const { RangeError } = require('../../errors');

module.exports = function sendMessage(channel, options) { // eslint-disable-line complexity
  const User = require('../User');
  const GuildMember = require('../GuildMember');
  if (channel instanceof User || channel instanceof GuildMember) return channel.createDM().then(dm => dm.send(options));
  let { content, nonce, reply, code, disableEveryone, tts, embed, files, split } = options;

  if (embed) embed = new Embed(embed)._apiTransform();

  if (typeof nonce !== 'undefined') {
    nonce = parseInt(nonce);
    if (isNaN(nonce) || nonce < 0) throw new RangeError('MESSAGE_NONCE_TYPE');
  }

  // Add the reply prefix
  if (reply && !(channel instanceof User || channel instanceof GuildMember) && channel.type !== 'dm') {
    const id = channel.client.users.resolveID(reply);
    const mention = `<@${reply instanceof GuildMember && reply.nickname ? '!' : ''}${id}>`;
    if (split) split.prepend = `${mention}, ${split.prepend || ''}`;
    content = `${mention}${typeof content !== 'undefined' ? `, ${content}` : ''}`;
  }

  if (content) {
    content = Util.resolveString(content);
    if (split && typeof split !== 'object') split = {};
    // Wrap everything in a code block
    if (typeof code !== 'undefined' && (typeof code !== 'boolean' || code === true)) {
      content = Util.escapeMarkdown(content, true);
      content = `\`\`\`${typeof code !== 'boolean' ? code || '' : ''}\n${content}\n\`\`\``;
      if (split) {
        split.prepend = `\`\`\`${typeof code !== 'boolean' ? code || '' : ''}\n`;
        split.append = '\n```';
      }
    }

    // Add zero-width spaces to @everyone/@here
    if (disableEveryone || (typeof disableEveryone === 'undefined' && channel.client.options.disableEveryone)) {
      content = content.replace(/@(everyone|here)/g, '@\u200b$1');
    }

    if (split) content = Util.splitMessage(content, split);
  }

  if (content instanceof Array) {
    return new Promise((resolve, reject) => {
      const messages = [];
      (function sendChunk() {
        const opt = content.length ? { tts } : { tts, embed, files };
        channel.send(content.shift(), opt).then(message => {
          messages.push(message);
          if (content.length === 0) return resolve(messages);
          return sendChunk();
        }).catch(reject);
      }());
    });
  }

  return channel.client.api.channels[channel.id].messages.post({
    data: { content, tts, nonce, embed },
    files,
  }).then(data => channel.client.actions.MessageCreate.handle(data).message);
};
