try {
  const sodium = require('sodium');
  module.exports = {
    open: sodium.api.crypto_secretbox_xsalsa20poly1305_open,
    close: sodium.api.crypto_secretbox_xsalsa20poly1305,
  };
} catch (err) {
  const tweetnacl = require('tweetnacl');
  module.exports = {
    open: tweetnacl.secretbox.open,
    close: tweetnacl.secretbox,
  };
}
