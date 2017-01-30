const list = [
  require('./NodeOpusEngine'),
  require('./OpusScriptEngine'),
];

let opusEngineFound;

function fetch(Encoder) {
  try {
    return new Encoder();
  } catch (err) {
    return null;
  }
}

exports.add = encoder => {
  list.push(encoder);
};

exports.fetch = () => {
  for (const encoder of list) {
    const fetched = fetch(encoder);
    if (fetched) return fetched;
  }
  return null;
};

exports.guaranteeOpusEngine = () => {
  if (typeof opusEngineFound === 'undefined') opusEngineFound = Boolean(exports.fetch());
  if (!opusEngineFound) throw new Error('Couldn\'t find an Opus engine.');
};
