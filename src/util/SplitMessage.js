module.exports = function splitMessage(text, { maxLength = 1950, char = '\n', prepend = '', append = '' } = {}) {
  if (text.length <= maxLength) return text;
  let splitText = text.split(char);
  if (splitText.length === 1) splitText = splitText.join('').match(new RegExp(`[\\s\\S]{1,${maxLength}}\b`, 'g'));
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
  return messages.filter(m => m);
};
