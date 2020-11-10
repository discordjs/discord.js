'use strict';

const libs = {
  sodium: sodium => ({
    open: sodium.api.crypto_secretbox_open_easy,
    close: sodium.api.crypto_secretbox_easy,
    random: n => sodium.randombytes_buf(n),
    verify: sodium.api.crypto_sign_verify_detached,
  }),
  'libsodium-wrappers': sodium => ({
    open: sodium.crypto_secretbox_open_easy,
    close: sodium.crypto_secretbox_easy,
    random: n => sodium.randombytes_buf(n),
    verify: sodium.crypto_sign_verify_detached,
  }),
  tweetnacl: tweetnacl => ({
    open: tweetnacl.secretbox.open,
    close: tweetnacl.secretbox,
    random: n => tweetnacl.randomBytes(n),
    verify: (s, d, p) => tweetnacl.sign.detached.verify(d, s, p),
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
    } catch {} // eslint-disable-line no-empty
  }
})();
