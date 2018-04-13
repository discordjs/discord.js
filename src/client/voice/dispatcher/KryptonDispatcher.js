const krypton = require('krypton');
const StreamDispatcher = require('./StreamDispatcher');

const nonce = Buffer.alloc(24).fill(0);

const CTL = {
  BITRATE: 4002,
  FEC: 4012,
  PLP: 4014,
};

/**
 * The class that sends voice packet data to the voice connection.
 * @implements {VolumeInterface}
 * @extends {StreamDispatcher}
 * @private
 */
class KryptonDispatcher extends StreamDispatcher {
  constructor(
    player,
    { seek = 0, volume = 1, passes = 1, fec, plp, bitrate = 96, highWaterMark = 12, chain, type, opus } = {},
    streams) {
    const streamOptions = { seek, volume, passes, fec, plp, bitrate, highWaterMark };
    super(player, streamOptions, streams);

    this._type = type;
    this._chain = chain;
    this._buffer = Buffer.alloc(0);
    this._opus = opus;

    krypton.count++;
  }

  _destroy(err, cb) {
    krypton.count--;
    super._destroy(err, cb);
  }

  resume() {
    krypton.count++;
    super.resume();
  }

  pause() {
    krypton.count--;
    super.pause();
  }

  _write(chunk, enc, done) {
    if (['opus', 'ogg/opus', 'webm/opus'].includes(this._type)) {
      super._write(chunk, enc, done);
    } else {
      this._buffer = Buffer.concat([this._buffer, chunk]);

      const func = () => {
        super._write(this._buffer.slice(0, 3840), enc, () => {
          if (this._buffer.length >= 3840) func();
          else done();
        });

        this._buffer = this._buffer.slice(3840);
      };

      func();
    }
  }

  async _createPacket(sequence, timestamp, buffer) {
    nonce[0] = 0x80;
    nonce[1] = 0x78;

    nonce.writeUIntBE(sequence, 2, 2);
    nonce.writeUIntBE(timestamp, 4, 4);
    nonce.writeUIntBE(this.player.voiceConnection.authentication.ssrc, 8, 4);

    buffer = await this._chain.do(
      krypton.sodium.encrypt({ nonce, key: this.player.voiceConnection.authentication.secretKey })
    ).run(undefined, buffer);

    const packetBuffer = Buffer.alloc(buffer.length + 12);
    packetBuffer.fill(0);

    nonce.copy(packetBuffer, 0, 0, 12);

    for (let i = 0; i < buffer.length; i++) packetBuffer[i + 12] = buffer[i];

    return packetBuffer;
  }

  setBitrate(value) {
    if (!value || !this.bitrateEditable) return false;
    const bitrate = value === 'auto' ? this.player.voiceConnection.channel.bitrate : value;
    this._opus.applyEncoderCTL(CTL.BITRATE, Math.min(128e3, Math.max(16e3, bitrate * 1000)));
    return true;
  }

  setPLP(value) {
    if (!this.bitrateEditable) return false;
    this._opus.applyEncoderCTL(CTL.PLP, Math.min(100, Math.max(0, value * 100)));
    return true;
  }

  setFEC(enabled) {
    if (!this.bitrateEditable) return false;
    this._opus.applyEncoderCTL(CTL.FEC, enabled ? 1 : 0);
    return true;
  }

  get volumeEditable() { return Boolean(this._chain.functions.find(f => f.name === 'PCM::Volume16')); }

  get bitrateEditable() { return Boolean(this._opus); }

  get volume() {
    return this.volumeEditable ? this._chain.functions.find(f => f.name === 'PCM::Volume16').args.volume : 1;
  }

  setVolume(value) {
    if (!this._chain || !this.volumeEditable) return false;
    this.emit('volumeChange', this.volume, value);
    this._chain.functions.find(f => f.name === 'PCM::Volume16').args.volume = value;
    return true;
  }
}

module.exports = KryptonDispatcher;
