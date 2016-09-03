const EventEmitter = require('events').EventEmitter;
const NaCl = require('tweetnacl');

const nonce = new Buffer(24);
nonce.fill(0);

/**
 * The class that sends voice packet data to the voice connection.
 * @extends {EventEmitter}
 */
class StreamDispatcher extends EventEmitter {
  constructor(player, stream, sd) {
    super();
    this.player = player;
    this.stream = stream;
    this.streamingData = {
      channels: 2,
      count: sd.count,
      sequence: sd.sequence,
      timestamp: sd.timestamp,
    };
    this._startStreaming();
    this._triggered = false;
  }

  /**
  * Emitted when the dispatcher starts/stops speaking
  * @event StreamDispatcher#speaking
  * @param {boolean} value whether or not the dispatcher is speaking
  */
  _setSpeaking(value) {
    this.speaking = value;
    this.emit('speaking', value);
  }

  _sendBuffer(buffer, sequence, timestamp) {
    this.player.connection.udp.send(
      this._createPacket(sequence, timestamp, this.player.opusEncoder.encode(buffer))
    );
  }

  _createPacket(sequence, timestamp, buffer) {
    const packetBuffer = new Buffer(buffer.length + 28);
    packetBuffer.fill(0);
    packetBuffer[0] = 0x80;
    packetBuffer[1] = 0x78;

    packetBuffer.writeUIntBE(sequence, 2, 2);
    packetBuffer.writeUIntBE(timestamp, 4, 4);
    packetBuffer.writeUIntBE(this.player.connection.data.ssrc, 8, 4);

    packetBuffer.copy(nonce, 0, 0, 12);
    buffer = NaCl.secretbox(buffer, nonce, this.player.connection.data.secret);

    for (let i = 0; i < buffer.length; i++) {
      packetBuffer[i + 12] = buffer[i];
    }

    return packetBuffer;
  }

  _send() {
    try {
      if (this._triggered) {
        this._setSpeaking(false);
        return;
      }
      const data = this.streamingData;
      if (data.missed >= 5) {
        this._triggerTerminalState('error', new Error('stream is not generating fast enough'));
        return;
      }
      if (this.paused) {
        data.timestamp = data.timestamp + 4294967295 ? data.timestamp + 960 : 0;
        this.player.connection.manager.client.setTimeout(() => this._send(), data.length * 10);
        return;
      }
      const bufferLength = 1920 * data.channels;
      this._setSpeaking(true);
      let buffer = this.stream.read(bufferLength);

      if (!buffer) {
        data.missed++;
        this.player.connection.manager.client.setTimeout(() => this._send(), data.length * 10);
        return;
      }

      data.missed = 0;

      if (buffer.length !== bufferLength) {
        const newBuffer = new Buffer(bufferLength).fill(0);
        buffer.copy(newBuffer);
        buffer = newBuffer;
      }

      data.count++;
      data.sequence = (data.sequence + 1) < (65536) ? data.sequence + 1 : 0;
      data.timestamp = data.timestamp + 4294967295 ? data.timestamp + 960 : 0;

      this._sendBuffer(buffer, data.sequence, data.timestamp);

      const nextTime = data.startTime + (data.count * data.length);

      this.player.connection.manager.client.setTimeout(() => this._send(), data.length + (nextTime - Date.now()));
    } catch (e) {
      this._triggerTerminalState('error', e);
    }
  }

  /**
  * Emitted once the stream has ended. Attach a `once` listener to this.
  * @event StreamDispatcher#end
  */
  _triggerEnd() {
    this.emit('end');
  }

  /**
  * Emitted once the stream has encountered an error. Attach a `once` listener to this. Also emits `end`.
  * @event StreamDispatcher#error
  * @param {Error} err the error encountered
  */
  _triggerError(err) {
    this.emit('end');
    this.emit('error', err);
  }

  _triggerTerminalState(state, err) {
    if (this._triggered) {
      return;
    }

    /**
    * Emitted when the stream wants to give debug information.
    * @event StreamDispatcher#debug
    * @param {string} information the debug information
    */
    this.emit('debug', `triggered terminal state ${state} - stream is now dead`);
    this._triggered = true;
    this._setSpeaking(false);
    switch (state) {
      case 'end':
        this._triggerEnd(err);
        break;
      case 'error':
        this._triggerError(err);
        break;
      default:
        this.emit('error', 'unknown trigger state');
        break;
    }
  }

  _startStreaming() {
    if (!this.stream) {
      this.emit('error', 'no stream');
      return;
    }
    this.stream.on('end', err => this._triggerTerminalState('end', err));
    this.stream.on('error', err => this._triggerTerminalState('error', err));
    const data = this.streamingData;
    data.length = 20;
    data.missed = 0;
    data.startTime = Date.now();
    this.stream.once('readable', () => this._send());
  }

  _pause(value) {
    if (value) {
      this.paused = true;
      this._setSpeaking(false);
    } else {
      this.paused = false;
      this._setSpeaking(true);
    }
  }

  /**
   * Stops the current stream permanently and emits an `end` event.
   */
  end() {
    this._triggerTerminalState('end', 'user requested');
  }

  /**
   * Stops sending voice packets to the voice connection (stream may still progress however)
   */
  pause() {
    this._pause(true);
  }

  /**
   * Resumes sending voice packets to the voice connection (may be further on in the stream than when paused)
   */
  resume() {
    this._pause(false);
  }
}

module.exports = StreamDispatcher;
