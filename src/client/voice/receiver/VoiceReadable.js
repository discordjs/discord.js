const Readable = require('stream').Readable;

class VoiceReadable extends Readable {
  constructor() {
    super();
    this._packets = [];
    this.open = true;
  }

  _read() {} // eslint-disable-line no-empty-function

  _push(d) {
    if (this.open) this.push(d);
  }
}

module.exports = VoiceReadable;
