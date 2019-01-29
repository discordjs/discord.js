const libs = {
  sodium: sodium => ({
    open: sodium.api.crypto_secretbox_open_easy,
    close: sodium.api.crypto_secretbox_easy,
  }),
  'libsodium-wrappers': sodium => ({
    open: sodium.crypto_secretbox_open_easy,
    close: sodium.crypto_secretbox_easy,
  }),
  tweetnacl: tweetnacl => ({
    open: tweetnacl.secretbox.open,
    close: tweetnacl.secretbox,
  }),
};

exports.methods = {};
(function initSecretBox() {
  let lib;
  try {
    lib = require('sodium');
    exports.methods = libs.sodium(lib);
    return;
  } catch (err) {} // eslint-disable-line no-empty

  try {
    lib = require('libsodium-wrappers');
    if (lib.ready) {
      lib.ready.then(() => {
        exports.methods = libs['libsodium-wrappers'](lib);
      }).catch(() => {
        lib = require('tweetnacl');
        exports.methods = libs.tweetnacl(lib);
      });
    }
    return;
  } catch (err) {} // eslint-disable-line no-empty

  try {
    lib = require('tweetnacl');
    exports.methods = libs.tweetnacl(lib);
  } catch (err) {} // eslint-disable-line no-empty
}());
