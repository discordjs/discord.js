const Silence = require('./Silence');

/**
 * Only emits a single silent opus frame.
 * This is used as a workaround for Discord now requiring
 * silence to be sent before being able to receive audio.
 * @extends {Silence}
 * @private
 */
class SingleSilence extends Silence {
  _read() {
    super._read();
    this.push(null);
  }
}

module.exports = SingleSilence;
