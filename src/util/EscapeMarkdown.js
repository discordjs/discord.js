module.exports = function escapeMarkdown(text, onlyCodeBlock = false) {
  if (onlyCodeBlock) return text.replace(/```/g, '`\u200b``');
  return text.replace(/\\(\*|_|`|~|\\)/g, '$1').replace(/(\*|_|`|~|\\)/g, '\\$1');
};
