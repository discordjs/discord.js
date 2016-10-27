/**
 * Represents a Secret Key used in encryption over voice
 * @private
 */
class SecretKey {
  constructor(key) {
    /**
     * The key used for encryption
     * @type {Uint8Array}
     */
    this.key = new Uint8Array(new ArrayBuffer(key.length));
    for (const index in key) this.key[index] = key[index];
  }
}

module.exports = SecretKey;
