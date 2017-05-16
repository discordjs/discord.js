const Util = require('../../util/Util');

module.exports = function sendMessage(channel, options) {
  const User = require('../User');
  const GuildMember = require('../GuildMember');
  let { content, nonce, reply, code, disableEveryone, tts, embed, files } = options;

  if (typeof nonce !== 'undefined') {
    nonce = parseInt(nonce);
    if (isNaN(nonce) || nonce < 0) throw new RangeError('Message nonce must fit in an unsigned 64-bit integer.');
  }

  if (content) {
    // Wrap everything in a code block
    if (typeof code !== 'undefined' && (typeof code !== 'boolean' || code === true)) {
      content = Util.escapeMarkdown(channel.client.resolver.resolveString(content), true);
      content = `\`\`\`${typeof code !== 'boolean' ? code || '' : ''}\n${content}\n\`\`\``;
    }

    // Add zero-width spaces to @everyone/@here
    if (disableEveryone || (typeof disableEveryone === 'undefined' && channel.client.options.disableEveryone)) {
      content = content.replace(/@(everyone|here)/g, '@\u200b$1');
    }

    // Add the reply prefix
    if (reply && !(channel instanceof User || channel instanceof GuildMember) && channel.type !== 'dm') {
      const id = channel.client.resolver.resolveUserID(reply);
      const mention = `<@${reply instanceof GuildMember && reply.nickname ? '!' : ''}${id}>`;
      content = `${mention}${content ? `, ${content}` : ''}`;
    }
  } else if (reply && !(channel instanceof User || channel instanceof GuildMember) && channel.type !== 'dm') {
    const id = channel.client.resolver.resolveUserID(reply);
    content = `<@${reply instanceof GuildMember && reply.nickname ? '!' : ''}${id}>`;
  }

  if (channel instanceof User) return channel.createDM().then(dm => dm.send(content, options));

  return channel.client.api.channels(channel.id).messages.post({
    data: { content, tts, nonce, embed },
    files,
  }).then(data => channel.client.actions.MessageCreate.handle(data).message);
};
