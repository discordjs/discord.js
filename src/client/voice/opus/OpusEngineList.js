const list = [
  require('./NodeOpusEngine'),
  require('./OpusScriptEngine'),
];

exports.add = encoder => {
  list.push(encoder);
};

function fetch(Encoder) {
  try {
    return new Encoder();
  } catch (err) {
    return;
  }
}

exports.fetch = () => {
  for (const encoder of list) {
    const success = fetch(encoder);
    if (success) {
      return success;
    }
  }
  throw new Error('could not find an opus engine');
};
