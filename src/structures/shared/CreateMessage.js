const Embed = require('../MessageEmbed');
const DataResolver = require('../../util/DataResolver');
const MessageEmbed = require('../MessageEmbed');
const MessageAttachment = require('../MessageAttachment');
const { browser } = require('../../util/Constants');
const Util = require('../../util/Util');

// eslint-disable-next-line complexity
module.exports = async function createMessage(channel, options) {
  const User = require('../User');
  const GuildMember = require('../GuildMember');
  const Webhook = require('../Webhook');
  const WebhookClient = require('../../client/WebhookClient');

  const webhook = channel instanceof Webhook || channel instanceof WebhookClient;

  if (typeof options.nonce !== 'undefined') {
    options.nonce = parseInt(options.nonce);
    if (isNaN(options.nonce) || options.nonce < 0) throw new RangeError('MESSAGE_NONCE_TYPE');
  }

  if (options instanceof MessageEmbed) options = webhook ? { embeds: [options] } : { embed: options };
  if (options instanceof MessageAttachment) options = { files: [options.file] };

  if (options.reply && !(channel instanceof User || channel instanceof GuildMember) && channel.type !== 'dm') {
    const id = channel.client.users.resolveID(options.reply);
    const mention = `<@${options.reply instanceof GuildMember && options.reply.nickname ? '!' : ''}${id}>`;
    if (options.split) options.split.prepend = `${mention}, ${options.split.prepend || ''}`;
    options.content = `${mention}${typeof options.content !== 'undefined' ? `, ${options.content}` : ''}`;
  }

  if (options.content) {
    options.content = Util.resolveString(options.content);
    if (options.split && typeof options.split !== 'object') options.split = {};
    // Wrap everything in a code block
    if (typeof options.code !== 'undefined' && (typeof options.code !== 'boolean' || options.code === true)) {
      options.content = Util.escapeMarkdown(options.content, true);
      options.content =
        `\`\`\`${typeof options.code !== 'boolean' ? options.code || '' : ''}\n${options.content}\n\`\`\``;
      if (options.split) {
        options.split.prepend = `\`\`\`${typeof options.code !== 'boolean' ? options.code || '' : ''}\n`;
        options.split.append = '\n```';
      }
    }

    // Add zero-width spaces to @everyone/@here
    if (options.disableEveryone ||
      (typeof options.disableEveryone === 'undefined' && channel.client.options.disableEveryone)) {
      options.content = options.content.replace(/@(everyone|here)/g, '@\u200b$1');
    }

    if (options.split) options.content = Util.splitMessage(options.content, options.split);
  }

  if (options.embed && options.embed.files) {
    if (options.files) options.files = options.files.concat(options.embed.files);
    else options.files = options.embed.files;
  }

  if (options.embed && webhook) options.embeds = [new Embed(options.embed)._apiTransform()];
  else if (options.embed) options.embed = new Embed(options.embed)._apiTransform();
  else if (options.embeds) options.embeds = options.embeds.map(e => new Embed(e)._apiTransform());

  let files;

  if (options.files) {
    for (let i = 0; i < options.files.length; i++) {
      let file = options.files[i];
      if (typeof file === 'string' || (!browser && Buffer.isBuffer(file))) file = { attachment: file };
      if (!file.name) {
        if (typeof file.attachment === 'string') {
          file.name = Util.basename(file.attachment);
        } else if (file.attachment && file.attachment.path) {
          file.name = Util.basename(file.attachment.path);
        } else if (file instanceof MessageAttachment) {
          file = { attachment: file.file, name: Util.basename(file.file) || 'file.jpg' };
        } else {
          file.name = 'file.jpg';
        }
      } else if (file instanceof MessageAttachment) {
        file = file.file;
      }
      options.files[i] = file;
    }

    files = await Promise.all(options.files.map(file =>
      DataResolver.resolveFile(file.attachment).then(resource => {
        file.file = resource;
        return file;
      })
    ));
  }

  if (webhook) {
    if (!options.username) options.username = this.name;
    if (options.avatarURL) options.avatar_url = options.avatarURL;
  }

  return { data: {
    content: options.content,
    tts: options.tts,
    nonce: options.nonce,
    embed: options.embed,
    embeds: options.embeds,
    username: options.username,
    avatar_url: options.avatar_url,
  }, files };
};
