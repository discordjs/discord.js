const BasePlayer = require('./BasePlayer');
const fs = require('fs-extra');

class DefaultPlayer extends BasePlayer {

  playFile(file) {
    this._shutdown();
    const fileStream = fs.createReadStream(file);
    const pcmStream = this.convertStream(fileStream);
    const dispatcher = this.playPCMStream(pcmStream);
    return dispatcher;
  }

}

module.exports = DefaultPlayer;
