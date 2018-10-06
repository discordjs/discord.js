const secretbox = require('../util/Secretbox');
const { VoiceCodecs } = require('../../../util/Constants');
const VP8 = require('../util/VP8');
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
    this.payloads = new Map();
  }

  // https://tools.ietf.org/html/rfc7741 - 4.5.1
  _processPayloads(timestamp) {
    const payloads = this.payloads.get(timestamp).sort((a, b) => a.header.sequence - b.header.sequence);
    const [first, last] = [payloads[0], payloads[payloads.length - 1]];
    const complete = (
      first.payload.descriptor.isStartOfVP8Partition &&
      first.payload.descriptor.partitionIndex === 0 &&
      last.header.marker &&
      last.header.sequence - first.header.sequence === payloads.length - 1
    );
  }

  _storePayload(header, payload) {
    if (!this.payloads.has(header.timestamp)) {
      for (const key of this.payloads.keys()) this._processPayloads(key);
      this.payloads.set(header.timestamp, []);
    }
    this.payloads.get(header.timestamp).push({ header, payload });
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

  decryptBuffer(buffer) {
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
    const packet = secretbox.methods.open(buffer.slice(12, end), this.nonce, secret_key);
    if (!packet) return new Error('Failed to decrypt voice packet');
    return Buffer.from(packet);
  }

  // https://tools.ietf.org/html/rfc5285
  parseRTPHeaderExtensions(header, packet) {
    // Check for One-Byte Header (§4.2)
    if (header.hasExtension && packet[0] === 0xBE && packet[1] === 0xDE && packet.length > 4) {
      const elements = packet.readUInt16BE(2),
        extensionParts = [];
      let offset = 4;
      for (let i = 0; i < elements; i++) {
        const byte = packet[offset++],
          id = (byte >> 4) & 0xF,
          length = (byte & 0xF) + 1;

        // Must ignore any IDs that are 0 or 15 (reserved for future extension)
        if (id && id !== 15) extensionParts.push(packet.slice(offset, offset + length));
        offset += length;

        // Ignore any padding
        while (packet[offset] === 0) offset++;
      }
      return {
        extension: Buffer.concat(extensionParts),
        packet: packet.slice(offset),
      };
    }
    return { packet };
  }

  parseBuffer(header, payload) {
    const buffer = this.decryptBuffer(payload);
    if (buffer instanceof Error) return buffer;

    const { packet } = this.parseRTPHeaderExtensions(header, buffer);
    this._storePayload(header, new VP8.Payload(packet));
    return null;
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
    } else if (packet) {
      stream.push(packet);
    }
  }
}

function parseRTPHeader(buffer) {
  return {
    hasExtension: Boolean(buffer[0] & (1 << 4)),
    payloadType: PayloadTypes[buffer[1] & ~(1 << 7)],
    marker: buffer[1] >> 7,
    sequence: buffer.readUInt16BE(2),
    timestamp: buffer.readUInt32BE(4),
    ssrc: buffer.readUInt32BE(8),
  };
}

module.exports = PacketHandler;
