# Changelog

All notable changes to this project will be documented in this file.

# [@discordjs/collection@1.0.0](https://github.com/discordjs/discord.js/compare/@discordjs/collection@0.8.0...@discordjs/collection@1.0.0) - (2022-07-17)

## Info

- 1.0.0 release bump, no new features.

# [@discordjs/collection@0.8.0](https://github.com/discordjs/discord.js/compare/@discordjs/collection@0.7.0...@discordjs/collection@0.8.0) - (2022-07-17)

## Bug Fixes

- **Collection:** Make error messages consistent (#8224) ([5bd6b28](https://github.com/discordjs/discord.js/commit/5bd6b28b3ebfced1cb9d23e83bd7c0def7a12404))
- Check for function type (#8064) ([3bb9c0e](https://github.com/discordjs/discord.js/commit/3bb9c0e5c37311044ff41761b572ac4f91cda57c))

## Documentation

- Add codecov coverage badge to readmes (#8226) ([f6db285](https://github.com/discordjs/discord.js/commit/f6db285c073898a749fe4591cbd4463d1896daf5))

## Features

- Codecov (#8219) ([f10f4cd](https://github.com/discordjs/discord.js/commit/f10f4cdcd88ca6be7ec735ed3a415ba13da83db0))
- **docgen:** Update typedoc ([b3346f4](https://github.com/discordjs/discord.js/commit/b3346f4b9b3d4f96443506643d4631dc1c6d7b21))
- Website (#8043) ([127931d](https://github.com/discordjs/discord.js/commit/127931d1df7a2a5c27923c2f2151dbf3824e50cc))
- **docgen:** Typescript support ([3279b40](https://github.com/discordjs/discord.js/commit/3279b40912e6aa61507bedb7db15a2b8668de44b))
- Docgen package (#8029) ([8b979c0](https://github.com/discordjs/discord.js/commit/8b979c0245c42fd824d8e98745ee869f5360fc86))
- Use vitest instead of jest for more speed ([8d8e6c0](https://github.com/discordjs/discord.js/commit/8d8e6c03decd7352a2aa180f6e5bc1a13602539b))
- Add scripts package for locally used scripts ([f2ae1f9](https://github.com/discordjs/discord.js/commit/f2ae1f9348bfd893332a9060f71a8a5f272a1b8b))

## Refactor

- **collection:** Remove `default` property (#8055) ([c8f1690](https://github.com/discordjs/discord.js/commit/c8f1690896f55f06e05a83704262783cfc2bb91d))
- **collection:** Remove default export (#8053) ([16810f3](https://github.com/discordjs/discord.js/commit/16810f3e410bf35ed7e6e7412d517ea74c792c5d))
- Move all the config files to root (#8033) ([769ea0b](https://github.com/discordjs/discord.js/commit/769ea0bfe78c4f1d413c6b397c604ffe91e39c6a))

## Testing

- **collection:** Improve coverage (#8222) ([a51f721](https://github.com/discordjs/discord.js/commit/a51f7215eca67a0f46fba8b2d706f7ec6f6dc228))

# [@discordjs/collection@0.7.0](https://github.com/discordjs/discord.js/compare/@discordjs/collection@0.6.0...@discordjs/collection@0.7.0) - (2022-06-04)

## Styling

- Cleanup tests and tsup configs ([6b8ef20](https://github.com/discordjs/discord.js/commit/6b8ef20cb3af5b5cfd176dd0aa0a1a1e98551629))

# [@discordjs/collection@0.6.0](https://github.com/discordjs/discord.js/compare/@discordjs/collection@0.5.0...@discordjs/collection@0.6.0) - (2022-04-17)

## Features

- Add support for module: NodeNext in TS and ESM (#7598) ([8f1986a](https://github.com/discordjs/discord.js/commit/8f1986a6aa98365e09b00e84ad5f9f354ab61f3d))
- **builders:** Add attachment command option type (#7203) ([ae0f35f](https://github.com/discordjs/discord.js/commit/ae0f35f51d68dfa5a7dc43d161ef9365171debdb))
- **Collection:** Add merging functions (#7299) ([e4bd07b](https://github.com/discordjs/discord.js/commit/e4bd07b2394f227ea06b72eb6999de9ab3127b25))

# [@discordjs/collection@0.5.0](https://github.com/discordjs/discord.js/compare/@discordjs/collection@0.4.0...@discordjs/collection@0.5.0) - (2022-01-24)

## Refactor

- Make `intersect` perform a true intersection (#7211) ([d8efba2](https://github.com/discordjs/discord.js/commit/d8efba24e09aa2a8dbf028fc57a561a56e7833fd))

## Typings

- Add `ReadonlyCollection` (#7245) ([db25f52](https://github.com/discordjs/discord.js/commit/db25f529b26d7c819c1c42ad3e26c2263ea2da0e))
- **Collection:** Union types on `intersect` and `difference` (#7196) ([1f9b922](https://github.com/discordjs/discord.js/commit/1f9b9225f2066e9cc66c3355417139fd25cc403c))

# [0.4.0](https://github.com/discordjs/collection/compare/v0.3.2...v0.4.0) (2021-12-24)

## Features

- add #reverse ([#48](https://github.com/discordjs/collection/issues/48)) ([8bcb5e2](https://github.com/discordjs/collection/commit/8bcb5e21bcc15f5b77612d8ff03dec6c37f4d449))
- add Collection#ensure ([#52](https://github.com/discordjs/collection/issues/52)) ([3809eb4](https://github.com/discordjs/collection/commit/3809eb4d18e70459355d310919a3f57747eee3dd))

# [0.3.2](https://github.com/discordjs/collection/compare/v0.3.1...v0.3.2) (2021-10-29)

## Bug Fixes

- update doc engine ([4c0e24f](https://github.com/discordjs/collection/commit/4c0e24fae0323db9de1991db9cfacc093d529abc))

# [0.3.0](https://github.com/discordjs/collection/compare/v0.2.4...v0.3.0) (2021-10-29)

## Features

- add Collection#at() and Collection#keyAt() ([#46](https://github.com/discordjs/collection/issues/46)) ([66b30b9](https://github.com/discordjs/collection/commit/66b30b91069502493383c059cc38e27c152bf541))
- improve documentation and resolve [#49](https://github.com/discordjs/collection/issues/49) ([aec01c6](https://github.com/discordjs/collection/commit/aec01c6ae3ff50b0b5f7c070bff10f01bf98d803))
- ts-docgen ([463b131](https://github.com/discordjs/collection/commit/463b1314e60f2debc526454a6ccd7ce8a9a4ae8a))

# [0.2.4](https://github.com/discordjs/collection/compare/v0.2.3...v0.2.4) (2021-10-27)

## Bug Fixes

- minification of names ([bd2fe2a](https://github.com/discordjs/collection/commit/bd2fe2a47c38f634b0334fe6e89f30f6f6a0b1f5))

# [0.2.3](https://github.com/discordjs/collection/compare/v0.2.2...v0.2.3) (2021-10-27)

### Bug Fixes

- building with useDefineForClassFields false ([2a571d5](https://github.com/discordjs/collection/commit/2a571d5a2c90ed8b708c3c5c017e2f225cd494e9))
