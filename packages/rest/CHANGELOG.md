# Changelog

All notable changes to this project will be documented in this file.

# [@discordjs/rest@1.0.0](https://github.com/discordjs/discord.js/compare/@discordjs/rest@0.6.0...@discordjs/rest@1.0.0) - (2022-07-17)

## Info

- 1.0.0 release bump, no new features.

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

# [0.2.0-canary.0](https://github.com/discordjs/discord.js-modules/compare/@discordjs/rest@0.1.1-canary.0...@discordjs/rest@0.2.0-canary.0) (2021-12-08)

## Bug Fixes

- **CDN#icon:** remove `guild` prefixes ([#67](https://github.com/discordjs/discord.js-modules/issues/67)) ([8882686](https://github.com/discordjs/discord.js-modules/commit/88826869d8ed3695f2b9475bea8d3b851df270bd))
- **Cdn:** make parameters immutable ([#84](https://github.com/discordjs/discord.js-modules/issues/84)) ([3105b61](https://github.com/discordjs/discord.js-modules/commit/3105b614da603dd3c8479dea089b5953d3c8b89b))
- **CDN:** use correct types ([#86](https://github.com/discordjs/discord.js-modules/issues/86)) ([64b02d4](https://github.com/discordjs/discord.js-modules/commit/64b02d4649a38802dd1a4e7a738ec64c27dea760))
- **Rest:** lint errors ([53c0cce](https://github.com/discordjs/discord.js-modules/commit/53c0ccefee80225ca7640cf88f44c68da99f31e7))
- use hash instead of animatedHash for default avatar test ([#74](https://github.com/discordjs/discord.js-modules/issues/74)) ([4852838](https://github.com/discordjs/discord.js-modules/commit/485283824cf368874096d59a64131970401218e9))

## Features

- **CDN#guildIcon:** implement dynamic logic ([#53](https://github.com/discordjs/discord.js-modules/issues/53)) ([c4b2803](https://github.com/discordjs/discord.js-modules/commit/c4b280366b0c5920c147126ccb9068f16fc898aa))
- **CDN:** add role icon endpoint ([#64](https://github.com/discordjs/discord.js-modules/issues/64)) ([4d7d692](https://github.com/discordjs/discord.js-modules/commit/4d7d692b4954c373941d2d8f3e3335a9a8543220))
- **CDN:** add sticker endpoints ([#60](https://github.com/discordjs/discord.js-modules/issues/60)) ([3b714ba](https://github.com/discordjs/discord.js-modules/commit/3b714bada415a7987dd6aa50c938751c66dc05be))
- **CDN:** guild member avatars ([#68](https://github.com/discordjs/discord.js-modules/issues/68)) ([90c25ad](https://github.com/discordjs/discord.js-modules/commit/90c25ad4afa5ec5906867f431afcaf11fb56355a))
- **Errors:** show data sent when an error occurs ([#72](https://github.com/discordjs/discord.js-modules/issues/72)) ([3e2edc8](https://github.com/discordjs/discord.js-modules/commit/3e2edc8974e2c62c324db0c151da4d34c289c40a))
- expose https agent options ([#82](https://github.com/discordjs/discord.js-modules/issues/82)) ([7f1c9be](https://github.com/discordjs/discord.js-modules/commit/7f1c9be817bbc6a4a11a726c952580dd3cb7b149))
- **RateLimits:** optionally error on ratelimits ([#77](https://github.com/discordjs/discord.js-modules/issues/77)) ([a371f0b](https://github.com/discordjs/discord.js-modules/commit/a371f0bc6c76cffaf048fd0fbf9c64a6c4d6619e))
- **RequestManager:** support setting global headers in options ([#70](https://github.com/discordjs/discord.js-modules/issues/70)) ([d1758c7](https://github.com/discordjs/discord.js-modules/commit/d1758c74b00a3f83c39745cd9af147a7f8f2b12b))
- **Requests:** add attachment keys and form data for stickers ([#81](https://github.com/discordjs/discord.js-modules/issues/81)) ([7c2b0c0](https://github.com/discordjs/discord.js-modules/commit/7c2b0c0e432b82776bb57c1708f3be6b4affde56))
- **Rest:** add response and request events ([#85](https://github.com/discordjs/discord.js-modules/issues/85)) ([c3aba56](https://github.com/discordjs/discord.js-modules/commit/c3aba567572e73548c38cd7c7f9945e9361833de))
- **REST:** change api version to v9 ([#62](https://github.com/discordjs/discord.js-modules/issues/62)) ([4c980e6](https://github.com/discordjs/discord.js-modules/commit/4c980e6ad6c0297519ec0f09ec27953764a4a12d))
- **Rest:** improve global rate limit and invalid request tracking ([#51](https://github.com/discordjs/discord.js-modules/issues/51)) ([b73cc06](https://github.com/discordjs/discord.js-modules/commit/b73cc060daa701de71815a824ebaccdc9ebf2859))
- **Rest:** use native Node.js AbortController ([#66](https://github.com/discordjs/discord.js-modules/issues/66)) ([3b53910](https://github.com/discordjs/discord.js-modules/commit/3b539102f07c413ffd3ee60718ac8e5a709bdd0e))
- **SequentialHandler:** add more info to debug when rate limit was hit ([#78](https://github.com/discordjs/discord.js-modules/issues/78)) ([a4e404b](https://github.com/discordjs/discord.js-modules/commit/a4e404b2e6df625a48176b9f1bfac6cfe86c5d66))

# [0.1.1-canary.0](https://github.com/discordjs/discord.js-modules/compare/@discordjs/rest@0.1.0-canary.0...@discordjs/rest@0.1.1-canary.0) (2021-08-24)

## Bug Fixes

- **Rest:** use reference type for DOM ([#55](https://github.com/discordjs/discord.js-modules/issues/55)) ([07f5aa7](https://github.com/discordjs/discord.js-modules/commit/07f5aa744092c16b0f05b05055e5d4bbd49754e7))

# 0.1.0-canary.0 (2021-06-29)

## Features

- **rest:** Implement rest module ([#34](https://github.com/discordjs/discord.js-modules/issues/34)) ([6990f0f](https://github.com/discordjs/discord.js-modules/commit/6990f0f7f3ca958a95f9b1b19681b42669743427))
