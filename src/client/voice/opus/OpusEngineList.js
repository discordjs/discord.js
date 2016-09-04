const list = [
  require('./NodeOpusEngine'),
  require('./OpusScriptEngine'),
];

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
  throw new Error('could not find an opus engine');
};
