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

for (const libName of Object.keys(libs)) {
  try {
    const lib = require(libName);
    if (libName === 'libsodium-wrappers' && lib.ready) {
      lib.ready.then(() => {
        exports.methods = libs[libName](lib);
      }).catch(() => {
        const tweetnacl = require('tweetnacl');
        exports.methods = libs.tweetnacl(tweetnacl);
      }).catch(() => undefined);
    } else {
      exports.methods = libs[libName](lib);
    }
    break;
  } catch (err) {} // eslint-disable-line no-empty
}
