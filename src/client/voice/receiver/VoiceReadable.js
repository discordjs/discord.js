const Readable = require('stream').Readable;

class VoiceReadable extends Readable {
  constructor() {
    super();
    this._packets = [];
    this.open = true;
  }

  _read() {
    return;
  }

  _push(d) {
    if (this.open) this.push(d);
  }
}

module.exports = VoiceReadable;
