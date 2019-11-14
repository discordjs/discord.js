'use strict';

const secretbox = require('../util/Secretbox');
const EventEmitter = require('events');

// The delay between packets when a user is considered to have stopped speaking
// https://github.com/discordjs/discord.js/issues/3524#issuecomment-540373200
const DISCORD_SPEAKING_DELAY = 250;

class Readable extends require('stream').Readable { _read() {} } // eslint-disable-line no-empty-function

class PacketHandler extends EventEmitter {
  constructor(receiver) {
    super();
    this.nonce = Buffer.alloc(24);
    this.receiver = receiver;
    this.streams = new Map();
    this.speakingTimeouts = new Map();
  }

  get connection() {
    return this.receiver.connection;
  }

  _stoppedSpeaking(userID) {
    const streamInfo = this.streams.get(userID);
    if (streamInfo && streamInfo.end === 'silence') {
      this.streams.delete(userID);
      streamInfo.stream.push(null);
    }
  }

  makeStream(user, end) {
    if (this.streams.has(user)) return this.streams.get(user).stream;
    const stream = new Readable();
    stream.on('end', () => this.streams.delete(user));
    this.streams.set(user, { stream, end });
    return stream;
  }

  parseBuffer(buffer) {
    const { secret_key, mode } = this.receiver.connection.authentication;

    // Choose correct nonce depending on encryption
    let end;
    if (mode === 'xsalsa20_poly1305_lite') {
      buffer.copy(this.nonce, 0, buffer.length - 4);
      end = buffer.length - 4;
    } else if (mode === 'xsalsa20_poly1305_suffix') {
      buffer.copy(this.nonce, 0, buffer.length - 24);
      end = buffer.length - 24;
    } else {
      buffer.copy(this.nonce, 0, 0, 12);
    }

    // Open packet
    let packet = secretbox.methods.open(buffer.slice(12, end), this.nonce, secret_key);
    if (!packet) return new Error('Failed to decrypt voice packet');
    packet = Buffer.from(packet);

    // Strip RTP Header Extensions (one-byte only)
    if (packet[0] === 0xBE && packet[1] === 0xDE && packet.length > 4) {
      const headerExtensionLength = packet.readUInt16BE(2);
      let offset = 4;
      for (let i = 0; i < headerExtensionLength; i++) {
        const byte = packet[offset];
        offset++;
        if (byte === 0) continue;
        offset += 1 + (0b1111 & (byte >> 4));
      }
      // Skip over undocumented Discord byte
      offset++;

      packet = packet.slice(offset);
    }

    return packet;
  }

  userFromSSRC(ssrc) { return this.connection.client.users.get(this.connection.ssrcMap.get(ssrc)); }

  push(buffer) {
    const ssrc = buffer.readUInt32BE(8);
    const user = this.userFromSSRC(ssrc);
    if (!user) return;

    const previousTimeout = this.speakingTimeouts.get(ssrc);
    if (typeof previousTimeout === 'undefined') {
      this.connection.onSpeaking({ user_id: user.id, ssrc: ssrc, speaking: 1 });
    } else {
      clearTimeout(this.speakingTimeouts.get(ssrc));
      this.speakingTimeouts.delete(ssrc);
    }
    const speakingTimer = setTimeout(() => {
      try {
        this.connection.onSpeaking({ user_id: user.id, ssrc: ssrc, speaking: 0 });
        this.speakingTimeouts.delete(ssrc);
      } catch (ex) {
        // Connection already closed, ignore
      }
    }, DISCORD_SPEAKING_DELAY);
    this.speakingTimeouts.set(ssrc, speakingTimer);

    let stream = this.streams.get(user.id);
    if (!stream) return;
    stream = stream.stream;
    const opusPacket = this.parseBuffer(buffer);
    if (opusPacket instanceof Error) {
      this.emit('error', opusPacket);
      return;
    }
    stream.push(opusPacket);
  }
}

module.exports = PacketHandler;
