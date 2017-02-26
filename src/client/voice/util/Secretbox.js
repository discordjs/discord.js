try {
  const sodium = require('sodium');
  module.exports = {
    open: sodium.api.crypto_secretbox_easy_open,
    close: sodium.api.crypto_secretbox_easy,
  };
} catch (err) {
  const tweetnacl = require('tweetnacl');
  module.exports = {
    open: tweetnacl.secretbox.open,
    close: tweetnacl.secretbox,
  };
}
