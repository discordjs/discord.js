try {
  const sodium = require('sodium');
  module.exports = {
    close: sodium.api.crypto_secretbox,
    open: sodium.api.crypto_secretbox_open,
  };
} catch (e) {
  const tweetnacl = require('tweetnacl');
  module.exports = {
    close: tweetnacl.secretbox,
    open: tweetnacl.secretbox.open,
  };
}
