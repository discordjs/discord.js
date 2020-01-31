const { Readable } = require('stream');

const SILENCE_FRAME = Buffer.from([0xF8, 0xFF, 0xFE]);

/**
 * A readable emitting silent opus frames.
 * @extends {Readable}
 * @private
 */
class Silence extends Readable {
  _read() {
    this.push(SILENCE_FRAME);
  }
}

module.exports = Silence;
