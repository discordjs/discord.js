const MessageEmbed = require('../MessageEmbed');
const MessageAttachment = require('../MessageAttachment');

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

module.exports = function transformOptions(content, options) {
  if (!options && typeof content === 'object' && !(content instanceof Array)) {
    options = content;
    content = '';
  }

  if (!options) {
    options = {};
  }

  if (options instanceof MessageEmbed) {
    return { content, embeds: [options] };
  }

  if (options instanceof MessageAttachment) {
    return { content, files: [options] };
  }

  if (options instanceof Array) {
    const [embeds, files] = partitionMessageAdditions(options);
    return { content, embeds, files };
  } else if (content instanceof Array) {
    const [embeds, files] = partitionMessageAdditions(content);
    if (embeds.length || files.length) {
      return { embeds, files };
    }
  }

  return Object.assign({ content }, options);
};
