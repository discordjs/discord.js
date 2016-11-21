function arrayBufferToBuffer(ab) {
  const buffer = new Buffer(ab.byteLength);
  const view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) buffer[i] = view[i];
  return buffer;
}

function str2ab(str) {
  const buffer = new ArrayBuffer(str.length * 2);
  const view = new Uint16Array(buffer);
  for (var i = 0, strLen = str.length; i < strLen; i++) view[i] = str.charCodeAt(i);
  return buffer;
}

module.exports = function convertArrayBuffer(x) {
  if (typeof x === 'string') x = str2ab(x);
  return arrayBufferToBuffer(x);
};
