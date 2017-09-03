const list = [
  require('./NodeOpusEngine'),
  require('./OpusScriptEngine'),
];

function fetch(Encoder, engineOptions) {
  try {
    return new Encoder(engineOptions);
  } catch (err) {
    if (err.message.includes('Cannot find module')) return null;

    // The Opus engine exists, but another error occurred.
    throw err;
  }
}

exports.add = encoder => {
  list.push(encoder);
};

exports.fetch = engineOptions => {
  for (const encoder of list) {
    const fetched = fetch(encoder, engineOptions);
    if (fetched) return fetched;
  }

  throw new Error('OPUS_ENGINE_MISSING');
};
