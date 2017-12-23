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

(async () => {
  for (const libName of Object.keys(libs)) {
    try {
      const lib = require(libName);
      if (libName === 'libsodium-wrappers' && lib.ready) await lib.ready; // eslint-disable-line no-await-in-loop
      exports.methods = libs[libName](lib);
      break;
    } catch (err) {} // eslint-disable-line no-empty
  }
})();
