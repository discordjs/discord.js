const nonce = Buffer.alloc(24);

class PacketHandler {
  constructor(receiver) {
    this.receiver = receiver;
  }

  parseBuffer(buffer) {
    // reuse nonce
    buffer.copy(nonce, 0, 0, 12);

    let packet = secretbox.methods.open(buffer.slice(12), nonce, this.receiver.connection.authentication.secretKey);
    if (!packet) return Error('Failed to decrypt voice packet');
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
      while (packet[offset] === 0) offset++;
      packet = packet.slice(offset);
    }

    return packet;
  }

  userFromSSRC(ssrc) { return this.receiver.connection.ssrcMap.get(ssrc); }

  push(buffer) {
    const ssrc = buffer.readUInt32BE(8);
    const user = this.userFromSSRC(ssrc);
    if (!user) return;
    const opusPacket = this.parseBuffer(buffer);
    if (opusPacket instanceof Error) return;
  }
}

module.exports = PacketHandler;
