'use strict';

const StreamDispatcher = require('./StreamDispatcher');

/**
 * The class that sends voice packet data to the voice connection.
 * @implements {VolumeInterface}
 * @extends {StreamDispatcher}
 */
class BroadcastDispatcher extends StreamDispatcher {
  constructor(player, options, streams) {
    super(player, options, streams);
    this.broadcast = player.broadcast;
  }

  _write(chunk, enc, done) {
    if (!this.startTime) this.startTime = Date.now();
    for (const dispatcher of this.broadcast.dispatchers) {
      dispatcher._write(chunk, enc);
    }
    this._step(done);
  }

  _destroy(err, cb) {
    if (this.player.dispatcher === this) this.player.dispatcher = null;
    const { streams } = this;
    if (streams.opus) streams.opus.unpipe(this);
    if (streams.ffmpeg) streams.ffmpeg.destroy();
    super._destroy(err, cb);
  }

  setBitrate(value) {
    if (!value || !this.streams.opus || !this.streams.opus.setBitrate) return false;
    const bitrate = value === 'auto' ? 48 : value;
    this.streams.opus.setBitrate(bitrate * 1000);
    return true;
  }
}

module.exports = BroadcastDispatcher;
