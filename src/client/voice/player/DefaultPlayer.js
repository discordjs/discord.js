const BasePlayer = require('./BasePlayer');
const fs = require('fs');

class DefaultPlayer extends BasePlayer {
  playFile(file) {
    return this.playStream(fs.createReadStream(file));
  }

  playStream(stream) {
    this._shutdown();
    const pcmStream = this.convertStream(stream);
    const dispatcher = this.playPCMStream(pcmStream);
    return dispatcher;
  }
}

module.exports = DefaultPlayer;
