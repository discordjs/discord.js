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

for (const libName of Object.keys(libs)) {
  try {
    const lib = require(libName);
    module.exports = libs[libName](lib);
    break;
  } catch (err) {} // eslint-disable-line no-empty
}
