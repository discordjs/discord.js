const DataResolver = require('../../util/DataResolver');
const MessageEmbed = require('../MessageEmbed');
const { browser } = require('../../util/Constants');
const Util = require('../../util/Util');
const { RangeError } = require('../../errors');

// eslint-disable-next-line complexity
function resolveContent(channel, options) {
  const User = require('../User');
  const GuildMember = require('../GuildMember');

  // eslint-disable-next-line eqeqeq
  let content = Util.resolveString(options.content == null ? '' : options.content);
  const isSplit = typeof options.split !== 'undefined' && options.split !== false;
  const isCode = typeof options.code !== 'undefined' && options.code !== false;
  const splitOptions = isSplit ? {
    prepend: options.split.prepend,
    append: options.split.append,
  } : undefined;

  let mentionPart = '';
  if (options.reply && !(channel instanceof User || channel instanceof GuildMember) && channel.type !== 'dm') {
    const id = channel.client.users.resolveID(options.reply);
    mentionPart = `<@${options.reply instanceof GuildMember && options.reply.nickname ? '!' : ''}${id}>, `;
    if (isSplit) {
      splitOptions.prepend = `${mentionPart}${splitOptions.prepend || ''}`;
    }
  }

  if (content || mentionPart) {
    if (isCode) {
      const codeName = typeof options.code === 'string' ? options.code : '';
      content = `${mentionPart}\`\`\`${codeName}\n${Util.escapeMarkdown(content, true)}\n\`\`\``;
      if (isSplit) {
        splitOptions.prepend = `${splitOptions.prepend || ''}\`\`\`${codeName}\n`;
        splitOptions.append = `\n\`\`\`${splitOptions.append || ''}`;
      }
    } else if (mentionPart) {
      content = `${mentionPart}${content}`;
    }

    const disableEveryone = typeof options.disableEveryone === 'undefined' ?
      channel.client.options.disableEveryone :
      options.disableEveryone;
    if (disableEveryone) {
      content = content.replace(/@(everyone|here)/g, '@\u200b$1');
    }

    if (isSplit) {
      content = Util.splitMessage(content, splitOptions);
    }
  }

  return content;
}

async function resolveFile(fileLike) {
  let attachment;
  let name;

  const findName = thing => {
    if (typeof thing === 'string') {
      return Util.basename(thing);
    }

    if (thing.path) {
      return Util.basename(thing.path);
    }

    return 'file.jpg';
  };

  if (typeof fileLike === 'string' || (!browser && Buffer.isBuffer(fileLike))) {
    attachment = fileLike;
    name = findName(attachment);
  } else {
    attachment = fileLike.attachment;
    name = fileLike.name || findName(attachment);
  }

  const resource = await DataResolver.resolveFile(attachment);
  return { attachment, name, file: resource };
}

module.exports = async function createMessage(channel, options) {
  const Webhook = require('../Webhook');
  const WebhookClient = require('../../client/WebhookClient');

  const content = resolveContent(channel, options);
  const tts = Boolean(options.tts);
  let nonce;
  if (typeof options.nonce !== 'undefined') {
    nonce = parseInt(options.nonce);
    if (isNaN(nonce) || nonce < 0) throw new RangeError('MESSAGE_NONCE_TYPE');
  }

  const embedLikes = [];
  if (options.embed) {
    embedLikes.push(options.embed);
  }
  if (options.embeds) {
    embedLikes.push(...options.embeds);
  }
  const embeds = embedLikes.map(e => new MessageEmbed(e)._apiTransform());

  let username;
  let avatarURL;
  if (channel instanceof Webhook || channel instanceof WebhookClient) {
    username = options.username || channel.name;
    if (options.avatarURL) avatarURL = options.avatarURL;
  }

  const fileLikes = [];
  if (options.files) {
    fileLikes.push(...options.files);
  }
  for (const embed of embedLikes) {
    if (embed.files) {
      fileLikes.push(...embed.files);
    }
  }

  const files = await Promise.all(fileLikes.map(resolveFile));

  return {
    data: {
      content,
      tts,
      nonce,
      embed: options.embed === null ? null : embeds[0],
      embeds,
      username,
      avatar_url: avatarURL,
    },
    files,
  };
};
