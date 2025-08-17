# Changelog

All notable changes to this project will be documented in this file.

# [@discordjs/voice@0.19.0](https://github.com/discordjs/discord.js/compare/@discordjs/voice@0.18.0...@discordjs/voice@0.19.0) - (2025-08-17)

## Bug Fixes

- **voice:** Mark stream as ended (#10455) ([bc3a0c8](https://github.com/discordjs/discord.js/commit/bc3a0c83890cdc9b8ca6abd1fde59053d3c6d905)) by @nyapat

## Documentation

- Replace Discord API with Discord Developers (#10968) ([3a060f7](https://github.com/discordjs/discord.js/commit/3a060f74945da78535440890be0a5df8bd0ee36b)) by @Jiralite
- Add missing, fix existing (#10842) ([e094faf](https://github.com/discordjs/discord.js/commit/e094faf225e53e7e5ad94f9f62ecb5d3a225a56b)) by @almeidx
- Export all visible symbols (#10760) ([78d512c](https://github.com/discordjs/discord.js/commit/78d512c347320e5d4bf97f7f0c89d3469d923af8)) by @almeidx
- Guide setup (#10862) ([2184085](https://github.com/discordjs/discord.js/commit/2184085fdaf00c982130212eb27ab878df2c3e1e)) by @iCrawl
- Fix close tags (#10756) ([5c49b6d](https://github.com/discordjs/discord.js/commit/5c49b6d9af9b0e69c4792ef4be831607675d418c)) by @Jiralite
- Typos (#10628) ([a696005](https://github.com/discordjs/discord.js/commit/a69600546a33b1599fbf6c8cc44caaf307a12a7e)) by @Jiralite

## Features

- Implement DAVE end-to-end encryption (#10921) ([8bdea62](https://github.com/discordjs/discord.js/commit/8bdea6232b1db20c615614a8f8baea2347c4466b)) by @Snazzah
- **voice:** Use voice gateway v8 (#10918) ([d40ceed](https://github.com/discordjs/discord.js/commit/d40ceedad40a8a0b64c173706fc6eea780a5477c)) by @Snazzah
- Print out support for aes-256-gcm in native node:crypto (#10764) ([19d48f6](https://github.com/discordjs/discord.js/commit/19d48f6d6cb8218b896ddf69be313ebe05a96996)) by @vladfrangu

## Build

- Bump Node.js to 22.12.0 (#10726) ([3db8ce7](https://github.com/discordjs/discord.js/commit/3db8ce70a2d20bd2def70a2c839b015bc24195eb)) by @Jiralite
  - **BREAKING CHANGE:** Node.js 22.12.0 or above is required.
- Bump Node.js to 20 (#10616) ([e89c6b6](https://github.com/discordjs/discord.js/commit/e89c6b66ac6503c2f120539f4820e72589be3f94)) by @Jiralite
  - **BREAKING CHANGE:** Node.js 20 or above is required.

### New Contributors

* @Snazzah made their first contribution in #10921
* @nsgpriyanshu made their first contribution in #10428

# [@discordjs/voice@0.18.0](https://github.com/discordjs/discord.js/compare/@discordjs/voice@0.17.0...@discordjs/voice@0.18.0) - (2024-11-17)

## Features

- **voice:** Add new encryption methods, remove old methods (#10451) ([9f8b9b1](https://github.com/discordjs/discord.js/commit/9f8b9b1d66edcc84ecf396d807dee7cf39f760c8)) by @nyapat
  - **BREAKING CHANGE:** This library no longer supports using `tweetnacl` as an encryption library due to Discord deprecating the algorithms that `tweetnacl` helped us support (read more [here](https://discord.com/developers/docs/change-log#voice-encryption-modes)). Please migrate to one of: `sodium-native`, `sodium`, `@stablelib/xchacha20poly1305`, `@noble/ciphers` or `libsodium-wrappers` unless your system supports `aes-256-gcm` (verify by running `require('node:crypto').getCiphers().includes('aes-256-gcm')`).

## Testing

- Replace jest with vitest (#10472) ([24128a3](https://github.com/discordjs/discord.js/commit/24128a3c459ed0c3eb0932308f03ecc55e3c60f1)) by @nyapat

### New Contributors

* @Yareaj made their first contribution in #10575

# [@discordjs/voice@0.17.0](https://github.com/discordjs/discord.js/compare/@discordjs/voice@0.16.0...@discordjs/voice@0.17.0) - (2024-05-04)

## Bug Fixes

- Minify mainlib docs json (#9963) ([4b88306](https://github.com/discordjs/discord.js/commit/4b88306dcb2b16b840ec61e9e33047af3a31c45d))
- **TransformerGraph:** Explicitly include input args for readable input cases instead of just for string input cases (#9793) ([788888a](https://github.com/discordjs/discord.js/commit/788888ab9ad17f1c8d85d68656c617334feb4361))
- Fix external links (#9313) ([a7425c2](https://github.com/discordjs/discord.js/commit/a7425c29c4f23f1b31f4c6a463107ca9eb7fd7e2))

## Documentation

- Split docs.api.json into multiple json files ([597340f](https://github.com/discordjs/discord.js/commit/597340f288437c35da8c703d9b621274de60d880))
- **create-discord-bot:** Support bun in create-discord-bot (#9798) ([7157748](https://github.com/discordjs/discord.js/commit/7157748fe3a69265896adf0450cd3f37acbcf97b))
- Update Node.js requirement to 16.11.0 (#9764) ([188877c](https://github.com/discordjs/discord.js/commit/188877c50af70f0d5cffb246620fa277435c6ce6))
- Include StreamType enum description in new docs (#9457) ([36216c0](https://github.com/discordjs/discord.js/commit/36216c0e1a0c99e5200de97f08d054e278fd3f0f))
- Generate static imports for types with api-extractor ([98a76db](https://github.com/discordjs/discord.js/commit/98a76db482879f79d6bb2fb2e5fc65ac2c34e2d9))

## Features

- Local and preview detection ([79fbda3](https://github.com/discordjs/discord.js/commit/79fbda3aac6d4f0f8bfb193e797d09cbe331d315))

## Refactor

- Docs (#10126) ([18cce83](https://github.com/discordjs/discord.js/commit/18cce83d80598c430218775c53441b6b2ecdc776))
- Move `getNode`/`canEnableFFmpegOptimizations` into a lazy loaded call (#9918) ([637e1a4](https://github.com/discordjs/discord.js/commit/637e1a4ddb6d5810deb31c5b90400ca277218270))

# [@discordjs/voice@0.16.1](https://github.com/discordjs/discord.js/compare/@discordjs/voice@0.16.0...@discordjs/voice@0.16.1) - (2023-11-12)

## Bug Fixes

- **TransformerGraph:** Explicitly include input args for readable input cases instead of just for string input cases (#9793) ([788888a](https://github.com/discordjs/discord.js/commit/788888ab9ad17f1c8d85d68656c617334feb4361))
- Fix external links (#9313) ([a7425c2](https://github.com/discordjs/discord.js/commit/a7425c29c4f23f1b31f4c6a463107ca9eb7fd7e2))

## Documentation

- **create-discord-bot:** Support bun in create-discord-bot (#9798) ([7157748](https://github.com/discordjs/discord.js/commit/7157748fe3a69265896adf0450cd3f37acbcf97b))
- Update Node.js requirement to 16.11.0 (#9764) ([188877c](https://github.com/discordjs/discord.js/commit/188877c50af70f0d5cffb246620fa277435c6ce6))
- Include StreamType enum description in new docs (#9457) ([36216c0](https://github.com/discordjs/discord.js/commit/36216c0e1a0c99e5200de97f08d054e278fd3f0f))
- Generate static imports for types with api-extractor ([98a76db](https://github.com/discordjs/discord.js/commit/98a76db482879f79d6bb2fb2e5fc65ac2c34e2d9))

## Refactor

- Move `getNode`/`canEnableFFmpegOptimizations` into a lazy loaded call (#9918) ([637e1a4](https://github.com/discordjs/discord.js/commit/637e1a4ddb6d5810deb31c5b90400ca277218270))

# [@discordjs/voice@0.16.0](https://github.com/discordjs/discord.js/compare/@discordjs/voice@0.15.0...@discordjs/voice@0.16.0) - (2023-04-01)

## Bug Fixes

- **scripts:** Accessing tsComment ([d8d5f31](https://github.com/discordjs/discord.js/commit/d8d5f31d3927fd1de62f1fa3a1a6e454243ad87b))

## Features

- **website:** Render syntax and mdx on the server (#9086) ([ee5169e](https://github.com/discordjs/discord.js/commit/ee5169e0aadd7bbfcd752aae614ec0f69602b68b))

## Refactor

- Compare with `undefined` directly (#9191) ([869153c](https://github.com/discordjs/discord.js/commit/869153c3fdf155783e7c0ecebd3627b087c3a026))

# [@discordjs/voice@0.15.0](https://github.com/discordjs/discord.js/compare/@discordjs/voice@0.14.0...@discordjs/voice@0.15.0) - (2023-03-12)

## Bug Fixes

- **Voice:** Send keep alives without awaiting a response (#9202) ([c6d98fa](https://github.com/discordjs/discord.js/commit/c6d98fa0c55a482cd4a81abd6f08290c29839b1b))

## Documentation

- Fix version export (#9049) ([8b70f49](https://github.com/discordjs/discord.js/commit/8b70f497a1207e30edebdecd12b926c981c13d28))

## Features

- **website:** Add support for source file links (#9048) ([f6506e9](https://github.com/discordjs/discord.js/commit/f6506e99c496683ee0ab67db0726b105b929af38))

# [@discordjs/voice@0.14.0](https://github.com/discordjs/discord.js/compare/@discordjs/voice@0.13.0...@discordjs/voice@0.14.0) - (2022-11-28)

## Bug Fixes

- Voice postbuild script (#8741) ([5ffabb1](https://github.com/discordjs/discord.js/commit/5ffabb119fa3a35266ab31545a4a4b9a049eacce))
- Pin @types/node version ([9d8179c](https://github.com/discordjs/discord.js/commit/9d8179c6a78e1c7f9976f852804055964d5385d4))

## Features

- New select menus (#8793) ([5152abf](https://github.com/discordjs/discord.js/commit/5152abf7285581abf7689e9050fdc56c4abb1e2b))

# [@discordjs/voice@0.13.0](https://github.com/discordjs/discord.js/compare/@discordjs/voice@0.11.0...@discordjs/voice@0.13.0) - (2022-10-08)

## Bug Fixes

- Footer / sidebar / deprecation alert ([ba3e0ed](https://github.com/discordjs/discord.js/commit/ba3e0ed348258fe8e51eefb4aa7379a1230616a9))

## Documentation

- Change name (#8604) ([dd5a089](https://github.com/discordjs/discord.js/commit/dd5a08944c258a847fc4377f1d5e953264ab47d0))

## Features

- Web-components (#8715) ([0ac3e76](https://github.com/discordjs/discord.js/commit/0ac3e766bd9dbdeb106483fa4bb085d74de346a2))
- **website:** Show `constructor` information (#8540) ([e42fd16](https://github.com/discordjs/discord.js/commit/e42fd1636973b10dd7ed6fb4280ee1a4a8f82007))
- **WebSocketShard:** Support new resume url (#8480) ([bc06cc6](https://github.com/discordjs/discord.js/commit/bc06cc638d2f57ab5c600e8cdb6afc8eb2180166))

## Refactor

- Website components (#8600) ([c334157](https://github.com/discordjs/discord.js/commit/c3341570d983aea9ecc419979d5a01de658c9d67))
- Use `eslint-config-neon` for packages. (#8579) ([edadb9f](https://github.com/discordjs/discord.js/commit/edadb9fe5dfd9ff51a3cfc9b25cb242d3f9f5241))
- Docs design (#8487) ([4ab1d09](https://github.com/discordjs/discord.js/commit/4ab1d09997a18879a9eb9bda39df6f15aa22557e))

# [@discordjs/voice@0.11.0](https://github.com/discordjs/discord.js/compare/@discordjs/voice@0.10.0...@discordjs/voice@0.11.0) - (2022-07-17)

## Bug Fixes

- **VoiceReceiver:** ParsePacket correctly (#8277) ([1a6ddbb](https://github.com/discordjs/discord.js/commit/1a6ddbbe7b99b5eff4617b99399965740c38490b))
- **recorder-example:** Bump dependencies (#8123) ([10ba008](https://github.com/discordjs/discord.js/commit/10ba0080cc20c44389779416b6a8215603eca6ca))
- **SpeakingMap:** Allow docgen to detect event name (#8236) ([c271e05](https://github.com/discordjs/discord.js/commit/c271e05223d84f643314be649344a2cfe514923f))
- **codecov:** Use cobertura (#8235) ([fd1c240](https://github.com/discordjs/discord.js/commit/fd1c24036f3c1835b918a12be8760d46f80460ac))
- **voice:** Re-add accidental removal of postbuild script ([f8739bd](https://github.com/discordjs/discord.js/commit/f8739bd9c0c691c9593761237189dc529ed0b0a3))

## Documentation

- Add codecov coverage badge to readmes (#8226) ([f6db285](https://github.com/discordjs/discord.js/commit/f6db285c073898a749fe4591cbd4463d1896daf5))
- Remove Music bot in voice examples (#8203) ([741b3c8](https://github.com/discordjs/discord.js/commit/741b3c8e279c1cc6ba862bc83299d369bc6c1bc6))

## Features

- **builder:** Add max min length in string option (#8214) ([96c8d21](https://github.com/discordjs/discord.js/commit/96c8d21f95eb366c46ae23505ba9054f44821b25))
- Add website documentation early mvp (#8183) ([d95197c](https://github.com/discordjs/discord.js/commit/d95197cc78593df4d0a8d1cc492b0e41b4ab58b8))
- **docgen:** Proper event parsing for typescript ([d4b41dd](https://github.com/discordjs/discord.js/commit/d4b41dd0815b493b599d4f4d1b6dd18cd99f91ea))
- **docgen:** Update typedoc ([b3346f4](https://github.com/discordjs/discord.js/commit/b3346f4b9b3d4f96443506643d4631dc1c6d7b21))
- Website (#8043) ([127931d](https://github.com/discordjs/discord.js/commit/127931d1df7a2a5c27923c2f2151dbf3824e50cc))
- **docgen:** Typescript support ([3279b40](https://github.com/discordjs/discord.js/commit/3279b40912e6aa61507bedb7db15a2b8668de44b))
- Docgen package (#8029) ([8b979c0](https://github.com/discordjs/discord.js/commit/8b979c0245c42fd824d8e98745ee869f5360fc86))
- Add scripts package for locally used scripts ([f2ae1f9](https://github.com/discordjs/discord.js/commit/f2ae1f9348bfd893332a9060f71a8a5f272a1b8b))

## Refactor

- Move all the config files to root (#8033) ([769ea0b](https://github.com/discordjs/discord.js/commit/769ea0bfe78c4f1d413c6b397c604ffe91e39c6a))

## Typings

- **voice:** Bring back typed events (#8109) ([70b42bb](https://github.com/discordjs/discord.js/commit/70b42bb64a4f83da0da242569b9c7921c8d1e26f))

# [@discordjs/voice@0.10.0](https://github.com/discordjs/discord.js/compare/@discordjs/voice@0.16.1...@discordjs/voice@0.10.0) - (2022-06-04)

## Styling

- Cleanup tests and tsup configs ([6b8ef20](https://github.com/discordjs/discord.js/commit/6b8ef20cb3af5b5cfd176dd0aa0a1a1e98551629))

# [@discordjs/voice@0.8.0](https://github.com/discordjs/discord.js/compare/@discordjs/voice@0.7.5...@discordjs/voice@0.8.0) - (2022-01-24)

## Refactor

- PresenceUpdate and demuxProbe (#7248) ([1745973](https://github.com/discordjs/discord.js/commit/174597302408f13c5bb685e2fb02ae2137cb481d))

## Testing

- **voice:** Fix tests ([62c74b8](https://github.com/discordjs/discord.js/commit/62c74b8333066465e5bd295b8b102b35a506751d))
- Fix voice secretbox tests ([4a2dbd6](https://github.com/discordjs/discord.js/commit/4a2dbd62382f904d596b34da0116d50e724b81c4))
- Fix voice tests ([b593bd3](https://github.com/discordjs/discord.js/commit/b593bd32a98282a92fa28f2fb0a8ef239866622c))
