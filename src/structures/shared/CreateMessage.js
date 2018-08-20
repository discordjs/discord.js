const DataResolver = require('../../util/DataResolver');
const MessageEmbed = require('../MessageEmbed');
const MessageAttachment = require('../MessageAttachment');
const { browser } = require('../../util/Constants');
const Util = require('../../util/Util');
const { RangeError } = require('../../errors');

function partitionMessageAdditions(items) {
  const embeds = [];
  const files = [];
  for (const item of items) {
    if (item instanceof MessageEmbed) {
      embeds.push(item);
    } else if (item instanceof MessageAttachment) {
      files.push(item);
    }
  }

  return [embeds, files];
}

function transformOptions(content, options, isWebhook) {
  if (!options && typeof content === 'object' && !(content instanceof Array)) {
    options = content;
    content = '';
  }

  if (!options) {
    options = {};
  }

  if (options instanceof MessageEmbed) {
    return isWebhook ? { content, embeds: [options] } : { content, embed: options };
  }

  if (options instanceof MessageAttachment) {
    return { content, files: [options] };
  }

  if (options instanceof Array) {
    const [embeds, files] = partitionMessageAdditions(options);
    return isWebhook ? { content, embeds, files } : { content, embed: embeds[0], files };
  } else if (content instanceof Array) {
    const [embeds, files] = partitionMessageAdditions(content);
    if (embeds.length || files.length) {
      return isWebhook ? { embeds, files } : { embed: embeds[0], files };
    }
  }

  return Object.assign({ content }, options);
}

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

module.exports = async function createMessage(channel, firstArg, secondArg) {
  const Webhook = require('../Webhook');
  const WebhookClient = require('../../client/WebhookClient');

  const isWebhook = channel instanceof Webhook || channel instanceof WebhookClient;
  const options = transformOptions(firstArg, secondArg, isWebhook);

  const content = resolveContent(channel, options);
  const tts = Boolean(options.tts);
  let nonce;
  if (typeof options.nonce !== 'undefined') {
    nonce = parseInt(options.nonce);
    if (isNaN(nonce) || nonce < 0) throw new RangeError('MESSAGE_NONCE_TYPE');
  }

  const embedLikes = [];
  if (isWebhook) {
    if (options.embeds) {
      embedLikes.push(...options.embeds);
    }
  } else if (options.embed) {
    embedLikes.push(options.embed);
  }
  const embeds = embedLikes.map(e => new MessageEmbed(e)._apiTransform());

  let username;
  let avatarURL;
  if (isWebhook) {
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
