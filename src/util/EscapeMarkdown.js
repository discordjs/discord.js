module.exports = function escapeMarkdown(text, onlyCodeBlock = false, onlyInlineCode = false) {
  if (onlyCodeBlock) return text.replace(/```/g, '`\u200b``');
  if (onlyInlineCode) return text.replace(/\\(`|\\)/g, '$1').replace(/(`|\\)/g, '\\$1');
  return text.replace(/\\(\*|_|`|~|\\)/g, '$1').replace(/(\*|_|`|~|\\)/g, '\\$1');
};
