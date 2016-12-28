const BasePlayer = require('./BasePlayer');
const fs = require('fs');

class DefaultPlayer extends BasePlayer {
  playFile(file, { seek = 0, volume = 1 } = {}) {
    const options = { seek: seek, volume: volume };
    return this.playStream(fs.createReadStream(file), options);
  }

  playStream(stream, { seek = 0, volume = 1, passes = 1 } = {}) {
    this._shutdown();
    const options = { seek, volume, passes };
    const pcmStream = this.convertStream(stream, options);
    const dispatcher = this.playPCMStream(pcmStream, options);
    return dispatcher;
  }
}

module.exports = DefaultPlayer;
