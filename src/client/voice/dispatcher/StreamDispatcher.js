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
  * @param {Boolean} value whether or not the dispatcher is speaking
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
        return this._setSpeaking(false);
      }
      const data = this.streamingData;
      if (data.missed >= 5) {
        return this._triggerTerminalState('error', new Error('stream is not generating fast enough'));
      }
      if (this.paused) {
        data.timestamp = (data.timestamp + 4294967295) ? data.timestamp + 960 : 0;
        return this.player.connection.manager.client.setTimeout(() => this._send(), data.length * 10);
      }
      const bufferLength = 1920 * data.channels;
      this._setSpeaking(true);
      let buffer = this.stream.read(bufferLength);

      if (!buffer) {
        data.missed++;
        return this.player.connection.manager.client.setTimeout(() => this._send(), data.length * 10);
      }

      data.missed = 0;

      if (buffer.length !== bufferLength) {
        const newBuffer = new Buffer(bufferLength).fill(0);
        buffer.copy(newBuffer);
        buffer = newBuffer;
      }

      data.count++;
      data.sequence = (data.sequence + 1) < (65536) ? data.sequence + 1 : 0;
      data.timestamp = (data.timestamp + 4294967295) ? data.timestamp + 960 : 0;

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
  * @param {Error} error the error encountered
  */
  _triggerError(e) {
    this.emit('end');
    this.emit('error', e);
  }

  _triggerTerminalState(state, e) {
    if (this._triggered) {
      return;
    }

    /**
    * Emitted when the stream wants to give debug information.
    * @event StreamDispatcher#debug
    * @param {String} information the debug information
    */
    this.emit('debug', `triggered terminal state ${state} - stream is now dead`);
    this._triggered = true;
    this._setSpeaking(false);
    switch (state) {
      case 'end':
        this._triggerEnd(e);
        break;
      case 'error':
        this._triggerError(e);
        break;
      default:
        this.emit('error', 'unknown trigger state');
        break;
    }
  }

  _startStreaming() {
    if (!this.stream) {
      return this.emit('error', 'no stream');
    }
    this.stream.on('end', e => this._triggerTerminalState('end', e));
    this.stream.on('error', e => this._triggerTerminalState('error', e));
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
   * @returns {null}
   */
  end() {
    this._triggerTerminalState('end', 'user requested');
  }

  /**
   * Stops sending voice packets to the voice connection (stream may still progress however)
   * @returns {null}
   */
  pause() {
    this._pause(true);
  }

  /**
   * Resumes sending voice packets to the voice connection (may be further on in the stream than when paused)
   * @returns {null}
   */
  resume() {
    this._pause(false);
  }
}

module.exports = StreamDispatcher;
