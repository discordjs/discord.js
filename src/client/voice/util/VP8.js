// This should ideally be moved to prism at some point!

// https://tools.ietf.org/html/rfc7741#section-4.2
class Payload {
  constructor(data) {
    this.descriptor = new PayloadDescriptor(data);
    if (this.descriptor.isStartOfVP8Partition && this.descriptor.partitionIndex === 0) {
      this.header = new PayloadHeader(data.slice(this.descriptor.length));
    }
  }
}

class PayloadDescriptor {
  constructor(data) {
    this.data = data;

    this.length = 0;
    this._main = this.data[this.length++];
    if (this.hasExtendedControlBits) {
      this._extendedControl = this.data[this.length++];
      if (this.hasPictureID) {
        this._pictureID = this.data[this.length++];
        if (this._pictureID >> 7) {
          this._pictureID = (this._pictureID << 8) + this.data[this.length++];
        }
      }
      if (this.hasTL0PICIDX) this._TL0PICIDX = this.data[this.length++];
      if (this.hasTID || this.hasKEYIDX) this._TIDYKEYIDX = this.data[this.length++];
    }
  }

  get hasExtendedControlBits() { return this._main >> 7; }
  get isNonReferenceFrame() { return this._main & (1 << 5); }
  get isStartOfVP8Partition() { return this._main & (1 << 4); }
  get partitionIndex() { return this._main & 0x7; }

  get hasPictureID() { return this._extendedControl >> 7; }
  get hasTL0PICIDX() { return this._extendedControl & (1 << 6); }
  get hasTID() { return this._extendedControl & (1 << 5); }
  get hasKEYIDX() { return this._extendedControl & (1 << 4); }

  get pictureIDLength() { return this._pictureID >> 7 ? 15 : 7; }
  get pictureID() { return this.pictureIDLength === 7 ? this._pictureID & 0x7f : this._pictureID & 0x7fff; }

  get TL0PICIDX() { return this._TL0PICIDX; }

  get TID() { return this._TIDYKEYIDX >> 6; }
  get Y() { return this._TIDYKEYIDX & (1 << 5); }
  get KEYIDX() { return this._TIDYKEYIDX & 0x1F; }
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
