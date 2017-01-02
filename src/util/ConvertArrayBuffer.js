function str2ab(str) {
  const buffer = new ArrayBuffer(str.length * 2);
  const view = new Uint16Array(buffer);
  for (var i = 0, strLen = str.length; i < strLen; i++) view[i] = str.charCodeAt(i);
  return buffer;
}

module.exports = function convertArrayBuffer(x) {
  if (typeof x === 'string') x = str2ab(x);
  return Buffer.from(x);
};
