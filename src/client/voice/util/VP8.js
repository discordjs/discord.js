// This should ideally be moved to prism at some point!

// https://tools.ietf.org/html/rfc7741#section-4.2
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
  get Y() { return (this.hadTID || this.hasKEYIDX) ? this.data[4 + this._pictureIDOffset] & (1 << 5) : null; }
  get KEYIDX() { return this.hasKEYIDX ? this.data[4 + this._pictureIDOffset] & 0x1f : null; }

  get size() { return 5 + this._pictureIDOffset; }
}

exports.PayloadDescriptor = PayloadDescriptor;
