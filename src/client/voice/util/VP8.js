// This should ideally be moved to prism at some point!

// https://tools.ietf.org/html/rfc7741#section-4.2
class Payload {
  constructor(data) {
    this.descriptor = new PayloadDescriptor(data);
    if (this.descriptor.isStartOfVP8Partition && this.descriptor.partitionIndex === 0) {
      this.header = new PayloadHeader(data.slice(this.descriptor.size));
    }
  }
}

class PayloadDescriptor {
  constructor(data) {
    this.data = data;
  }

  get hasExtendedControlBits() { return this.data[0] & (1 << 7); }
  get isNonReferenceFrame() { return this.data[0] & (1 << 5); }
  get isStartOfVP8Partition() { return this.data[0] & (1 << 4); }
  get partitionIndex() { return this.data[0] & 0b111; }

  get hasPictureID() { return this.hasExtendedControlBits ? this.data[1] & (1 << 7) : null; }
  get hasTL0PICIDX() { return this.hasExtendedControlBits ? this.data[1] & (1 << 6) : null; }
  get hasTID() { return this.hasExtendedControlBits ? this.data[1] & (1 << 5) : null; }
  get hasKEYIDX() { return this.hasExtendedControlBits ? this.data[1] & (1 << 4) : null; }

  get pictureIDLength() { return this.hasPictureID ? this.data[2] >> 7 ? 15 : 7 : null; }
  get pictureID() {
    return this.pictureIDLength === 7 ?
      this.data[2] & 0x7f :
      this.data.readUInt16BE(2) & ~0x8000;
  }
  get _pictureIDOffset() { return this.pictureIDLength === 7 ? 0 : 1; }

  get TL0PICIDX() { return this.hasTL0PICIDX ? this.data[3 + this._pictureIDOffset] : null; }

  get TID() { return this.hasTID ? this.data[4 + this._pictureIDOffset] >> 6 : null; }
  get Y() { return this.hadTID || this.hasKEYIDX ? this.data[4 + this._pictureIDOffset] & (1 << 5) : null; }
  get KEYIDX() { return this.hasKEYIDX ? this.data[4 + this._pictureIDOffset] & 0x1f : null; }

  get size() { return 5 + this._pictureIDOffset; }
}

// https://tools.ietf.org/id/draft-ietf-payload-vp8-01.html#rfc.section.4.2
class PayloadHeader {
  constructor(data) {
    this.data = data;
  }

  get size0() { return this.data[0] >> 5; }
  get size1() { return this.data[1]; }
  get size2() { return this.data[2]; }
  // This is equivalent to the 1stPartitionSize
  get size() { return this.size0 + (8 * this.size1) + (2048 * this.size2); }

  get showFrame() { return this.data[0] && (1 << 4); }
  get version() { return this.data[0] && 0xe; }
  get inverseKeyFrame() { return this.data[0] & 1; }
}

module.exports = { Payload, PayloadDescriptor, PayloadHeader };
