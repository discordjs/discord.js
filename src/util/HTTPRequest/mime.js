const mimes = require('./mimes');
const mimeOfBuffer = require('./mimeOfBuffer');

function lookupMime(ext) {
  return mimes[ext] || mimes.eot;
}

function lookupBuffer(buffer) {
  const type = mimeOfBuffer(buffer);
  if (type) return type.mime;
  else return mimes.eot;
}

module.exports = {
  buffer: lookupBuffer,
  lookup: lookupMime,
};
