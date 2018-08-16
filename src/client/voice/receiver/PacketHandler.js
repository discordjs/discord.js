const secretbox = require('../util/Secretbox');
const { VoiceCodecs } = require('../../../util/Constants');
const EventEmitter = require('events');

const PayloadTypes = {};
for (let codec of Object.values(VoiceCodecs)) {
  PayloadTypes[codec.payload_type] = codec.name;
}

class Readable extends require('stream').Readable { _read() {} } // eslint-disable-line no-empty-function

class PacketHandler extends EventEmitter {
  constructor(receiver) {
    super();
    this.nonce = Buffer.alloc(24);
    this.receiver = receiver;
    this.streams = new Map();
  }

  get connection() {
    return this.receiver.connection;
  }

  makeStream(user, { mode }) {
    const streamMap = this.streams.get(user) || {};
    if (streamMap[mode]) return streamMap[mode];

    const stream = new Readable();
    stream.on('end', () => {
      const existing = this.streams.get(user);
      if (existing) existing[mode] = null;
    });

    streamMap[mode] = { stream, mode };

    this.streams.set(user, streamMap);
    return stream;
  }

  parseBuffer(header, buffer) {
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
    if (header.hasExtension && packet[0] === 0xBE && packet[1] === 0xDE && packet.length > 4) {
      const headerExtensionLength = packet.readUInt16BE(2);
      let offset = 4;
      for (let i = 0; i < headerExtensionLength; i++) {
        const byte = packet[offset];
        offset++;
        if (byte === 0) continue;
        offset += 1 + (0b1111 & (byte >> 4));
      }
      while (packet[offset] === 0) offset++;
      packet = packet.slice(offset);
    }
    return packet;
  }

  resolveSSRC(ssrc) {
    for (const [user_id, { audio_ssrc, video_ssrc }] of this.connection.ssrcMap) {
      let type;
      if (ssrc === audio_ssrc) type = 'audio';
      else if (ssrc === video_ssrc) type = 'video';
      else continue;
      const user = this.connection.client.users.get(user_id);
      return { user, type };
    }
    return { user: null, type: null };
  }

  push(buffer) {
    const header = parseRTPHeader(buffer);
    const { user } = this.resolveSSRC(header.ssrc);
    if (!user) return;
    const streams = this.streams.get(user.id);
    if (!streams || !streams[header.payloadType]) return;
    const stream = streams[header.payloadType].stream;
    const packet = this.parseBuffer(header, buffer);
    if (packet instanceof Error) {
      this.emit('error', packet);
      return;
    }
    stream.push(packet);
  }
}

function parseRTPHeader(buffer) {
  return {
    hasExtension: Boolean(buffer[0] & (1 << 4)),
    payloadType: PayloadTypes[buffer[1] & ~(1 << 7)],
    ssrc: buffer.readUInt32BE(8),
  };
}

module.exports = PacketHandler;
