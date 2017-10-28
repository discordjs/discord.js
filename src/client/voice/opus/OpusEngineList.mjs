import { Error } from '../../../errors';
import require from '../../../util/require';

const list = [
  require('./NodeOpusEngine'),
  require('./OpusScriptEngine'),
];

function _fetch(Encoder, engineOptions) {
  try {
    return new Encoder(engineOptions);
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') return null;

    // The Opus engine exists, but another error occurred.
    throw err;
  }
}

export function add(encoder) {
  list.push(encoder);
}

export function fetch(engineOptions) {
  for (const encoder of list) {
    const fetched = _fetch(encoder, engineOptions);
    if (fetched) return fetched;
  }

  throw new Error('OPUS_ENGINE_MISSING');
}

export default fetch;
