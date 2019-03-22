const EventEmitter = require('events');

/**
 * An interface class for volume transformation.
 * @extends {EventEmitter}
 */
class VolumeInterface extends EventEmitter {
  constructor({ volume = 1 } = {}) {
    super();
    this.setVolume(volume);
  }

  /**
   * The current volume of the broadcast
   * @readonly
   * @type {number}
   */
  get volume() {
    return this._volume;
  }

  /**
   * The current volume of the broadcast in decibels
   * @readonly
   * @type {number}
   */
  get volumeDecibels() {
    return Math.log10(this._volume) * 20;
  }

  /**
   * The current volume of the broadcast from a logarithmic scale
   * @readonly
   * @type {number}
   */
  get volumeLogarithmic() {
    return Math.pow(this._volume, 1 / 1.660964);
  }

  applyVolume(buffer, volume) {
    volume = volume || this._volume;
    if (volume === 1) return buffer;

    const out = Buffer.alloc(buffer.length);
    for (let i = 0; i < buffer.length; i += 2) {
      if (i >= buffer.length - 1) break;
      const uint = Math.min(32767, Math.max(-32767, Math.floor(volume * buffer.readInt16LE(i))));
      out.writeInt16LE(uint, i);
    }

    return out;
  }

  /**
   * Sets the volume relative to the input stream - i.e. 1 is normal, 0.5 is half, 2 is double.
   * @param {number} volume The volume that you want to set
   */
  setVolume(volume) {
    /**
     * Emitted when the volume of this interface changes.
     * @event VolumeInterface#volumeChange
     * @param {number} oldVolume The old volume of this interface
     * @param {number} newVolume The new volume of this interface
     */
    this.emit('volumeChange', this._volume, volume);
    this._volume = volume;
  }

  /**
   * Set the volume in decibels.
   * @param {number} db The decibels
   */
  setVolumeDecibels(db) {
    this.setVolume(Math.pow(10, db / 20));
  }

  /**
   * Set the volume so that a perceived value of 0.5 is half the perceived volume etc.
   * @param {number} value The value for the volume
   */
  setVolumeLogarithmic(value) {
    this.setVolume(Math.pow(value, 1.660964));
  }
}

module.exports = VolumeInterface;
