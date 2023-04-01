# Changelog

All notable changes to this project will be documented in this file.

# [@discordjs/rest@1.7.0](https://github.com/discordjs/discord.js/compare/@discordjs/rest@1.6.0...@discordjs/rest@1.7.0) - (2023-04-01)

## Bug Fixes

- **handlers:** Create burst handler for interaction callbacks (#8996) ([db8df10](https://github.com/discordjs/discord.js/commit/db8df104c5e70a12f35b54e5f3f7c897068dde6f))
- **scripts:** Accessing tsComment ([d8d5f31](https://github.com/discordjs/discord.js/commit/d8d5f31d3927fd1de62f1fa3a1a6e454243ad87b))
- **rest:** Remove `const enum`s in favour of regular enums (#9243) ([229ad07](https://github.com/discordjs/discord.js/commit/229ad077ff52d8706d68ed4d31983619a32eba45))

## Features

- **website:** Render syntax and mdx on the server (#9086) ([ee5169e](https://github.com/discordjs/discord.js/commit/ee5169e0aadd7bbfcd752aae614ec0f69602b68b))

# [@discordjs/rest@1.6.0](https://github.com/discordjs/discord.js/compare/@discordjs/rest@1.5.0...@discordjs/rest@1.6.0) - (2023-03-12)

## Bug Fixes

- **snowflake:** Snowflakes length (#9144) ([955e8fe](https://github.com/discordjs/discord.js/commit/955e8fe312c42ad4937cc1994d1d81e517c413c8))
- **RequestManager:** Inference of image/apng (#9014) ([ecb4281](https://github.com/discordjs/discord.js/commit/ecb4281d1e2d9a0a427605f75352cbf74ffb2d7c))

## Documentation

- Fix typos (#9127) ([1ba1f23](https://github.com/discordjs/discord.js/commit/1ba1f238f04221ec890fc921678909b5b7d92c26))
- Fix version export (#9049) ([8b70f49](https://github.com/discordjs/discord.js/commit/8b70f497a1207e30edebdecd12b926c981c13d28))

## Features

- **Sticker:** Add support for gif stickers (#9038) ([6a9875d](https://github.com/discordjs/discord.js/commit/6a9875da054a875a4711394547d47439bbe66fb6))
- **website:** Add support for source file links (#9048) ([f6506e9](https://github.com/discordjs/discord.js/commit/f6506e99c496683ee0ab67db0726b105b929af38))

## Styling

- Run prettier (#9041) ([2798ba1](https://github.com/discordjs/discord.js/commit/2798ba1eb3d734f0cf2eeccd2e16cfba6804873b))

# [@discordjs/rest@1.5.0](https://github.com/discordjs/discord.js/compare/@discordjs/rest@1.4.0...@discordjs/rest@1.5.0) - (2022-12-16)

## Features

- **core:** Add support for role connections (#8930) ([3d6fa24](https://github.com/discordjs/discord.js/commit/3d6fa248c07b2278504bbe8bafa17a3294971fd9))

# [@discordjs/rest@1.4.0](https://github.com/discordjs/discord.js/compare/@discordjs/rest@1.3.0...@discordjs/rest@1.4.0) - (2022-11-28)

## Bug Fixes

- **SequentialHandler:** Downlevel ECONNRESET errors (#8785) ([5a70057](https://github.com/discordjs/discord.js/commit/5a70057826b47fb8251f3d836a536de689444ca1))
- Make ratelimit timeout require event loop to be active (#8779) ([68d5712](https://github.com/discordjs/discord.js/commit/68d5712deae85532604d93b4505f0953d664cde7))
- Pin @types/node version ([9d8179c](https://github.com/discordjs/discord.js/commit/9d8179c6a78e1c7f9976f852804055964d5385d4))

## Features

- Add `@discordjs/core` (#8736) ([2127b32](https://github.com/discordjs/discord.js/commit/2127b32d26dedeb44ec43d16ec2e2046919f9bb0))
- New select menus (#8793) ([5152abf](https://github.com/discordjs/discord.js/commit/5152abf7285581abf7689e9050fdc56c4abb1e2b))

## Refactor

- Update `makeURLSearchParams` to accept readonly non-`Record`s (#8868) ([8376e2d](https://github.com/discordjs/discord.js/commit/8376e2dbcd38697ce62615d9a539fd198fbc4713))

# [@discordjs/rest@1.3.0](https://github.com/discordjs/discord.js/compare/@discordjs/rest@1.2.0...@discordjs/rest@1.3.0) - (2022-10-08)

## Bug Fixes

- **SequentialHandler:** Throw http error with proper name and more useful message (#8694) ([3f86561](https://github.com/discordjs/discord.js/commit/3f8656115bf9df0dbf8391de68a3401535325895))

## Features

- Web-components (#8715) ([0ac3e76](https://github.com/discordjs/discord.js/commit/0ac3e766bd9dbdeb106483fa4bb085d74de346a2))
- Add `@discordjs/util` (#8591) ([b2ec865](https://github.com/discordjs/discord.js/commit/b2ec865765bf94181473864a627fb63ea8173fd3))
- Add `AbortSignal` support (#8672) ([3c231ae](https://github.com/discordjs/discord.js/commit/3c231ae81a52b66940ba495f35fd59a76c65e306))

# [@discordjs/rest@1.2.0](https://github.com/discordjs/discord.js/compare/@discordjs/rest@1.1.0...@discordjs/rest@1.2.0) - (2022-09-25)

## Bug Fixes

- Footer / sidebar / deprecation alert ([ba3e0ed](https://github.com/discordjs/discord.js/commit/ba3e0ed348258fe8e51eefb4aa7379a1230616a9))

## Documentation

- Change name (#8604) ([dd5a089](https://github.com/discordjs/discord.js/commit/dd5a08944c258a847fc4377f1d5e953264ab47d0))

## Features

- **rest:** Use Agent with higher connect timeout (#8679) ([64cd53c](https://github.com/discordjs/discord.js/commit/64cd53c4c23dd9c9503fd0887ac5c542137c57e8))

## Refactor

- Website components (#8600) ([c334157](https://github.com/discordjs/discord.js/commit/c3341570d983aea9ecc419979d5a01de658c9d67))
- Use `eslint-config-neon` for packages. (#8579) ([edadb9f](https://github.com/discordjs/discord.js/commit/edadb9fe5dfd9ff51a3cfc9b25cb242d3f9f5241))

# [@discordjs/rest@1.1.0](https://github.com/discordjs/discord.js/compare/@discordjs/rest@1.0.1...@discordjs/rest@1.1.0) - (2022-08-22)

## Features

- **website:** Show `constructor` information (#8540) ([e42fd16](https://github.com/discordjs/discord.js/commit/e42fd1636973b10dd7ed6fb4280ee1a4a8f82007))
- **website:** Render `@defaultValue` blocks (#8527) ([8028813](https://github.com/discordjs/discord.js/commit/8028813825e7708915ea892760c1003afd60df2f))
- **WebSocketShard:** Support new resume url (#8480) ([bc06cc6](https://github.com/discordjs/discord.js/commit/bc06cc638d2f57ab5c600e8cdb6afc8eb2180166))

## Refactor

- Docs design (#8487) ([4ab1d09](https://github.com/discordjs/discord.js/commit/4ab1d09997a18879a9eb9bda39df6f15aa22557e))

# [@discordjs/rest@0.6.0](https://github.com/discordjs/discord.js/compare/@discordjs/rest@0.5.0...@discordjs/rest@0.6.0) - (2022-07-17)

## Documentation

- Add codecov coverage badge to readmes (#8226) ([f6db285](https://github.com/discordjs/discord.js/commit/f6db285c073898a749fe4591cbd4463d1896daf5))

## Features

- **builder:** Add max min length in string option (#8214) ([96c8d21](https://github.com/discordjs/discord.js/commit/96c8d21f95eb366c46ae23505ba9054f44821b25))
- Codecov (#8219) ([f10f4cd](https://github.com/discordjs/discord.js/commit/f10f4cdcd88ca6be7ec735ed3a415ba13da83db0))
- **docgen:** Update typedoc ([b3346f4](https://github.com/discordjs/discord.js/commit/b3346f4b9b3d4f96443506643d4631dc1c6d7b21))
- Website (#8043) ([127931d](https://github.com/discordjs/discord.js/commit/127931d1df7a2a5c27923c2f2151dbf3824e50cc))
- **docgen:** Typescript support ([3279b40](https://github.com/discordjs/discord.js/commit/3279b40912e6aa61507bedb7db15a2b8668de44b))
- Docgen package (#8029) ([8b979c0](https://github.com/discordjs/discord.js/commit/8b979c0245c42fd824d8e98745ee869f5360fc86))
- Use vitest instead of jest for more speed ([8d8e6c0](https://github.com/discordjs/discord.js/commit/8d8e6c03decd7352a2aa180f6e5bc1a13602539b))
- Add scripts package for locally used scripts ([f2ae1f9](https://github.com/discordjs/discord.js/commit/f2ae1f9348bfd893332a9060f71a8a5f272a1b8b))

## Refactor

- **rest:** Add content-type(s) to uploads (#8290) ([103a358](https://github.com/discordjs/discord.js/commit/103a3584c95a7b7f57fa62d47b86520d5ec32303))
- **collection:** Remove default export (#8053) ([16810f3](https://github.com/discordjs/discord.js/commit/16810f3e410bf35ed7e6e7412d517ea74c792c5d))
- Move all the config files to root (#8033) ([769ea0b](https://github.com/discordjs/discord.js/commit/769ea0bfe78c4f1d413c6b397c604ffe91e39c6a))

# [@discordjs/rest@0.5.0](https://github.com/discordjs/discord.js/compare/@discordjs/rest@0.4.0...@discordjs/rest@0.5.0) - (2022-06-04)

## Bug Fixes

- **REST:** Remove dom types (#7922) ([e92b17d](https://github.com/discordjs/discord.js/commit/e92b17d8555164ff259e524efc6a26675660e5c2))
- Ok statusCode can be 200..299 (#7919) ([d1504f2](https://github.com/discordjs/discord.js/commit/d1504f2ae19816b3fadcdb3ad17facc863ed7529))

## Features

- **rest:** Add guild member banner cdn url (#7973) ([97eaab3](https://github.com/discordjs/discord.js/commit/97eaab35d7383ecbbd93dc623ceda969286c1554))
- REST#raw (#7929) ([dfe449c](https://github.com/discordjs/discord.js/commit/dfe449c253b617e8f92c720a2f71135aa1601a65))
- **rest:** Use undici (#7747) ([d1ec8c3](https://github.com/discordjs/discord.js/commit/d1ec8c37ffb7fe3b63eaa8c382f22ca1fb348c9b))
- **REST:** Enable setting default authPrefix (#7853) ([679dcda](https://github.com/discordjs/discord.js/commit/679dcda9709376f37cc58a60f74d12d324d93e4e))

## Styling

- Cleanup tests and tsup configs ([6b8ef20](https://github.com/discordjs/discord.js/commit/6b8ef20cb3af5b5cfd176dd0aa0a1a1e98551629))

# [@discordjs/rest@0.4.0](https://github.com/discordjs/discord.js/compare/@discordjs/rest@0.3.0...@discordjs/rest@0.4.0) - (2022-04-17)

## Bug Fixes

- **gateway:** Use version 10 (#7689) ([8880de0](https://github.com/discordjs/discord.js/commit/8880de0cecdf273fd6df23988e4cb77774a75390))
- **RequestHandler:** Only reset tokens for authenticated 401s (#7508) ([b9ff7b0](https://github.com/discordjs/discord.js/commit/b9ff7b057379a47ce13265f78e21bf0d55feaf0a))
- **ci:** Ci error (#7454) ([0af9bc8](https://github.com/discordjs/discord.js/commit/0af9bc841ffe1a297d308500d696bad4b85abda9))
- Use png as extension for defaultAvatarURL (#7414) ([538e9ce](https://github.com/discordjs/discord.js/commit/538e9cef459d00d74b9bd6852da3ce2acac9bae5))
- **rest:** Sublimit all requests on unhandled routes (#7366) ([733ac82](https://github.com/discordjs/discord.js/commit/733ac82d5dffabc622fb59e06d06e83396734dc6))
- Fix some typos (#7393) ([92a04f4](https://github.com/discordjs/discord.js/commit/92a04f4d98f6c6760214034cc8f5a1eaa78893c7))

## Documentation

- Enhance /rest README (#7757) ([a1329bd](https://github.com/discordjs/discord.js/commit/a1329bd3ebafc6d5b5e2788ff082674f01b726f3))

## Features

- Add `makeURLSearchParams` utility function (#7744) ([8eaec11](https://github.com/discordjs/discord.js/commit/8eaec114a98026024c21545988860c123948c55d))
- Add API v10 support (#7477) ([72577c4](https://github.com/discordjs/discord.js/commit/72577c4bfd02524a27afb6ff4aebba9301a690d3))
- Add support for module: NodeNext in TS and ESM (#7598) ([8f1986a](https://github.com/discordjs/discord.js/commit/8f1986a6aa98365e09b00e84ad5f9f354ab61f3d))
- **builders:** Add attachment command option type (#7203) ([ae0f35f](https://github.com/discordjs/discord.js/commit/ae0f35f51d68dfa5a7dc43d161ef9365171debdb))
- **cdn:** Add support for scheduled event image covers (#7335) ([ac26d9b](https://github.com/discordjs/discord.js/commit/ac26d9b1307d63e116b043505e5f925db7ed01aa))

## Refactor

- **requestmanager:** Use timestampfrom (#7459) ([3298510](https://github.com/discordjs/discord.js/commit/32985109c3b7614d364007608f8c5af4bed753ae))
- **files:** Remove redundant file property names (#7340) ([6725038](https://github.com/discordjs/discord.js/commit/67250382f99872a9edff99ebaa482ffa895b0c37))

# [@discordjs/rest@0.3.0](https://github.com/discordjs/discord.js/compare/@discordjs/rest@0.2.0...@discordjs/rest@0.3.0) - (2022-01-24)

## Bug Fixes

- **rest:** Don't add empty query (#7308) ([d0fa5aa](https://github.com/discordjs/discord.js/commit/d0fa5aaa26d316608120bca3050e14eefbe2f93b))
- **rest:** Use http agent when protocol is not https (#7309) ([d8ea572](https://github.com/discordjs/discord.js/commit/d8ea572fb8a51f2f6a902c4926e814017d115708))
- `ref` delay for rate limited requests (#7239) ([ed0cfd9](https://github.com/discordjs/discord.js/commit/ed0cfd91edc3a2b23a34a8ecd9db38baa12b52fa))

## Documentation

- Fix a typo and use milliseconds instead of ms (#7251) ([0dd56af](https://github.com/discordjs/discord.js/commit/0dd56afe1cdf16f1e7d9afe1f8c29c31d1833a25))

## Features

- Rest hash and handler sweeping (#7255) ([3bb4829](https://github.com/discordjs/discord.js/commit/3bb48298004d292214c6cb8f927c2fea78a42952))
- Rest docs (#7281) ([9054f2f](https://github.com/discordjs/discord.js/commit/9054f2f7ad7f246431e5f53403535bf301c27a80))

## Refactor

- **files:** File data can be much more than buffer (#7238) ([86ab526](https://github.com/discordjs/discord.js/commit/86ab526d493415b14b79b51d08c3677897d219ee))
- **rest:** Rename attachment to file (#7199) ([c969cbf](https://github.com/discordjs/discord.js/commit/c969cbf6524093757d47108b6a55e62dcb210e8b))

## Testing

- **voice:** Fix tests ([62c74b8](https://github.com/discordjs/discord.js/commit/62c74b8333066465e5bd295b8b102b35a506751d))
