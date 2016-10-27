module.exports = function parseEmoji(text) {
  if (text.includes(':')) {
    const [name, id] = text.split(':');
    return { name, id };
  } else {
    return {
      name: text,
      id: null,
    };
  }
};
