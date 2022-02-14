# Changelog

All notable changes to this project will be documented in this file.

# [0.3.0](https://github.com/discordjs/discord.js/compare/@discordjs/rest@0.2.0...@discordjs/rest@0.3.0) (2021-12-08)

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
