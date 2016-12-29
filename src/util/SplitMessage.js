module.exports = function splitMessage(text, { maxLength = 1950, char = '\n', prepend = '', append = '' } = {}) {
  if (text.length <= maxLength) return text;
  const splitText = text.split(char);
  if (splitText.length === 1) throw new Error('Message exceeds the max length and contains no split characters.');
  const messages = [''];
  let msg = 0;
  for (let i = 0; i < splitText.length; i++) {
    if (messages[msg].length + splitText[i].length + 1 > maxLength) {
      messages[msg] += append;
      messages.push(prepend);
      msg++;
    }
    messages[msg] += (messages[msg].length > 0 && messages[msg] !== prepend ? char : '') + splitText[i];
  }
  return messages;
};
