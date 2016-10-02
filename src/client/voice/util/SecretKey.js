class SecretKey {
  constructor(key) {
    this.key = new Uint8Array(new ArrayBuffer(key.length));
    for (const index in key) {
      this.key[index] = key[index];
    }
  }
}

module.exports = SecretKey;
