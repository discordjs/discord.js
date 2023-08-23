# Changelog

All notable changes to this project will be documented in this file.

# [@discordjs/core@1.0.1](https://github.com/discordjs/discord.js/compare/@discordjs/core@1.0.0...@discordjs/core@1.0.1) - (2023-08-17)

## Documentation

- Update Node.js requirement to 16.11.0 (#9764) ([188877c](https://github.com/discordjs/discord.js/commit/188877c50af70f0d5cffb246620fa277435c6ce6))

# [@discordjs/core@1.0.0](https://github.com/discordjs/discord.js/compare/@discordjs/core@0.6.0...@discordjs/core@1.0.0) - (2023-07-31)

## Bug Fixes

- **core:** Fix inconsistencies on `core` (#9680) ([6d5840c](https://github.com/discordjs/discord.js/commit/6d5840c61e5164c461b821fbd79b71b812aa046e))
- **client:** Add missing application command permissions update event (#9639) ([2818d7c](https://github.com/discordjs/discord.js/commit/2818d7cc1d76c06252a5d89dbc48c4340cf23f3f))
- **api:** Various fixes for overlooked stuff (#9588) ([6c7a5ed](https://github.com/discordjs/discord.js/commit/6c7a5ed1e7f05ca9350cb84c429c76acf3851fc0))
- **GuildsAPI:** Use `level` rather than `mfa_level` when editing MFA (#9584) ([3535321](https://github.com/discordjs/discord.js/commit/3535321b98cec4a715aca19e8fd34e6d3b27975f))
- **roleConnections:** Fix `body` type for `updateMetadataRecords()` (#9516) ([166c961](https://github.com/discordjs/discord.js/commit/166c9612611b8665a62d8a5f657f64b5a266d0f4))

## Documentation

- Define /core token in example (#9586) ([bc2798b](https://github.com/discordjs/discord.js/commit/bc2798b8ee33895506c4bc684b59bc8acefb615d))

## Features

- **WebhooksAPI:** Allow `with token` requests without bot auth (#9715) ([bc83cab](https://github.com/discordjs/discord.js/commit/bc83cabfdad76fec9352ddb9a7d488e058ede180))
- Guild onboarding (#9120) ([dc73c93](https://github.com/discordjs/discord.js/commit/dc73c938ff9d04a0d7d57630faeb8e81ea343006))
- **ChannelsAPI:** Add permission overwrites (#9651) ([78381a5](https://github.com/discordjs/discord.js/commit/78381a56cf9a122d0a44ab1b0966cb0d7691ad7d))
- **api:** Add stage instances (#9578) ([985def3](https://github.com/discordjs/discord.js/commit/985def3f255b37891642172a3c83897c1d2749f6))
- **GuildsAPI:** Add `removeMember()` (#9576) ([5d6eed6](https://github.com/discordjs/discord.js/commit/5d6eed64140029837043cf537033b97c40f39607))
- **api:** Add `getMemberBans()` query options and `getMemberBan()` (#9569) ([590f5bc](https://github.com/discordjs/discord.js/commit/590f5bc38e6eab09e8d3d6cfd3967390202913c4))
- **client:** Support more request member fields (#9475) ([1edd01a](https://github.com/discordjs/discord.js/commit/1edd01a7a494ee7604b81bc2a3ec25a55d957f92))

## Refactor

- **rest:** Switch api to fetch-like and provide strategies (#9416) ([cdaa0a3](https://github.com/discordjs/discord.js/commit/cdaa0a36f586459f1e5ede868c4250c7da90455c))
  - **BREAKING CHANGE:** NodeJS v18+ is required when using node due to the use of global `fetch`
  - **BREAKING CHANGE:** The raw method of REST now returns a web compatible `Respone` object.
  - **BREAKING CHANGE:** The `parseResponse` utility method has been updated to operate on a web compatible `Response` object.
  - **BREAKING CHANGE:** Many underlying internals have changed, some of which were exported.
  - **BREAKING CHANGE:** `DefaultRestOptions` used to contain a default `agent`, which is now set to `null` instead.

## Typings

- Use `Snowflake` instead of `string` for snowflakes (#9583) ([1c4a12c](https://github.com/discordjs/discord.js/commit/1c4a12c7d62d060d655668a81d0ff4f1ae95607a))

# [@discordjs/core@0.6.0](https://github.com/discordjs/discord.js/compare/@discordjs/core@0.5.2...@discordjs/core@0.6.0) - (2023-05-01)

## Documentation

- Update example usage (#9461) ([6212bff](https://github.com/discordjs/discord.js/commit/6212bffa30f4c6bbe6a81dc5b2b037e5b65d493c))
- Generate static imports for types with api-extractor ([98a76db](https://github.com/discordjs/discord.js/commit/98a76db482879f79d6bb2fb2e5fc65ac2c34e2d9))

## Features

- **core:** Abstract gateway (#9410) ([5d1a4c2](https://github.com/discordjs/discord.js/commit/5d1a4c27d5ee2686c8fab6cad8bd97d8d0876e66))

# [@discordjs/core@0.5.1](https://github.com/discordjs/discord.js/compare/@discordjs/core@0.5.0...@discordjs/core@0.5.1) - (2023-04-16)

## Bug Fixes

- **interactions:** Make `data` parameter optional (#9379) ([66dc401](https://github.com/discordjs/discord.js/commit/66dc4014fe4553f1dd73aaa7c32fd83e10bde263))
- **core:** Support attachment editing on interactions (#9356) ([676307f](https://github.com/discordjs/discord.js/commit/676307ff5c6c4ef56a353b6fc74501a1080da869))
- **core:** Missed optional options (#9311) ([6912faa](https://github.com/discordjs/discord.js/commit/6912faa9b3852adbacc7d0b002aae81be041f529))

## Typings

- **ChannelsAPI:** Use correct type for `editMessage` (#9399) ([0a1701b](https://github.com/discordjs/discord.js/commit/0a1701b0463919a895c518e5daa9836760d9b6cf))

# [@discordjs/core@1.0.0](https://github.com/discordjs/discord.js/compare/@discordjs/core@0.6.0...@discordjs/core@1.0.0) - (2023-07-31)

## Bug Fixes

- **core:** Fix inconsistencies on `core` (#9680) ([6d5840c](https://github.com/discordjs/discord.js/commit/6d5840c61e5164c461b821fbd79b71b812aa046e))
- **client:** Add missing application command permissions update event (#9639) ([2818d7c](https://github.com/discordjs/discord.js/commit/2818d7cc1d76c06252a5d89dbc48c4340cf23f3f))
- **api:** Various fixes for overlooked stuff (#9588) ([6c7a5ed](https://github.com/discordjs/discord.js/commit/6c7a5ed1e7f05ca9350cb84c429c76acf3851fc0))
- **GuildsAPI:** Use `level` rather than `mfa_level` when editing MFA (#9584) ([3535321](https://github.com/discordjs/discord.js/commit/3535321b98cec4a715aca19e8fd34e6d3b27975f))
- **roleConnections:** Fix `body` type for `updateMetadataRecords()` (#9516) ([166c961](https://github.com/discordjs/discord.js/commit/166c9612611b8665a62d8a5f657f64b5a266d0f4))

## Documentation

- Define /core token in example (#9586) ([bc2798b](https://github.com/discordjs/discord.js/commit/bc2798b8ee33895506c4bc684b59bc8acefb615d))

## Features

- **WebhooksAPI:** Allow `with token` requests without bot auth (#9715) ([bc83cab](https://github.com/discordjs/discord.js/commit/bc83cabfdad76fec9352ddb9a7d488e058ede180))
- Guild onboarding (#9120) ([dc73c93](https://github.com/discordjs/discord.js/commit/dc73c938ff9d04a0d7d57630faeb8e81ea343006))
- **ChannelsAPI:** Add permission overwrites (#9651) ([78381a5](https://github.com/discordjs/discord.js/commit/78381a56cf9a122d0a44ab1b0966cb0d7691ad7d))
- **api:** Add stage instances (#9578) ([985def3](https://github.com/discordjs/discord.js/commit/985def3f255b37891642172a3c83897c1d2749f6))
- **GuildsAPI:** Add `removeMember()` (#9576) ([5d6eed6](https://github.com/discordjs/discord.js/commit/5d6eed64140029837043cf537033b97c40f39607))
- **api:** Add `getMemberBans()` query options and `getMemberBan()` (#9569) ([590f5bc](https://github.com/discordjs/discord.js/commit/590f5bc38e6eab09e8d3d6cfd3967390202913c4))
- **client:** Support more request member fields (#9475) ([1edd01a](https://github.com/discordjs/discord.js/commit/1edd01a7a494ee7604b81bc2a3ec25a55d957f92))

## Refactor

- **rest:** Switch api to fetch-like and provide strategies (#9416) ([cdaa0a3](https://github.com/discordjs/discord.js/commit/cdaa0a36f586459f1e5ede868c4250c7da90455c))
  - **BREAKING CHANGE:** NodeJS v18+ is required when using node due to the use of global `fetch`
  - **BREAKING CHANGE:** The raw method of REST now returns a web compatible `Respone` object.
  - **BREAKING CHANGE:** The `parseResponse` utility method has been updated to operate on a web compatible `Response` object.
  - **BREAKING CHANGE:** Many underlying internals have changed, some of which were exported.
  - **BREAKING CHANGE:** `DefaultRestOptions` used to contain a default `agent`, which is now set to `null` instead.

## Typings

- Use `Snowflake` instead of `string` for snowflakes (#9583) ([1c4a12c](https://github.com/discordjs/discord.js/commit/1c4a12c7d62d060d655668a81d0ff4f1ae95607a))

# [@discordjs/core@0.6.0](https://github.com/discordjs/discord.js/compare/@discordjs/core@0.5.2...@discordjs/core@0.6.0) - (2023-05-01)

## Documentation

- Update example usage (#9461) ([6212bff](https://github.com/discordjs/discord.js/commit/6212bffa30f4c6bbe6a81dc5b2b037e5b65d493c))
- Generate static imports for types with api-extractor ([98a76db](https://github.com/discordjs/discord.js/commit/98a76db482879f79d6bb2fb2e5fc65ac2c34e2d9))

## Features

- **core:** Abstract gateway (#9410) ([5d1a4c2](https://github.com/discordjs/discord.js/commit/5d1a4c27d5ee2686c8fab6cad8bd97d8d0876e66))

# [@discordjs/core@0.5.1](https://github.com/discordjs/discord.js/compare/@discordjs/core@0.5.0...@discordjs/core@0.5.1) - (2023-04-16)

## Bug Fixes

- **interactions:** Make `data` parameter optional (#9379) ([66dc401](https://github.com/discordjs/discord.js/commit/66dc4014fe4553f1dd73aaa7c32fd83e10bde263))
- **core:** Support attachment editing on interactions (#9356) ([676307f](https://github.com/discordjs/discord.js/commit/676307ff5c6c4ef56a353b6fc74501a1080da869))
- **core:** Missed optional options (#9311) ([6912faa](https://github.com/discordjs/discord.js/commit/6912faa9b3852adbacc7d0b002aae81be041f529))

## Typings

- **ChannelsAPI:** Use correct type for `editMessage` (#9399) ([0a1701b](https://github.com/discordjs/discord.js/commit/0a1701b0463919a895c518e5daa9836760d9b6cf))

# [@discordjs/core@0.6.0](https://github.com/discordjs/discord.js/compare/@discordjs/core@0.5.2...@discordjs/core@0.6.0) - (2023-05-01)

## Documentation

- Update example usage (#9461) ([6212bff](https://github.com/discordjs/discord.js/commit/6212bffa30f4c6bbe6a81dc5b2b037e5b65d493c))
- Generate static imports for types with api-extractor ([98a76db](https://github.com/discordjs/discord.js/commit/98a76db482879f79d6bb2fb2e5fc65ac2c34e2d9))

## Features

- **core:** Abstract gateway (#9410) ([5d1a4c2](https://github.com/discordjs/discord.js/commit/5d1a4c27d5ee2686c8fab6cad8bd97d8d0876e66))

# [@discordjs/core@0.5.1](https://github.com/discordjs/discord.js/compare/@discordjs/core@0.5.0...@discordjs/core@0.5.1) - (2023-04-16)

## Bug Fixes

- **interactions:** Make `data` parameter optional (#9379) ([66dc401](https://github.com/discordjs/discord.js/commit/66dc4014fe4553f1dd73aaa7c32fd83e10bde263))
- **core:** Support attachment editing on interactions (#9356) ([676307f](https://github.com/discordjs/discord.js/commit/676307ff5c6c4ef56a353b6fc74501a1080da869))
- **core:** Missed optional options (#9311) ([6912faa](https://github.com/discordjs/discord.js/commit/6912faa9b3852adbacc7d0b002aae81be041f529))

## Typings

- **ChannelsAPI:** Use correct type for `editMessage` (#9399) ([0a1701b](https://github.com/discordjs/discord.js/commit/0a1701b0463919a895c518e5daa9836760d9b6cf))

# [@discordjs/core@0.5.1](https://github.com/discordjs/discord.js/compare/@discordjs/core@0.4.0...@discordjs/core@0.5.1) - (2023-04-16)

## Bug Fixes

- **interactions:** Make `data` parameter optional (#9379) ([66dc401](https://github.com/discordjs/discord.js/commit/66dc4014fe4553f1dd73aaa7c32fd83e10bde263))
- **core:** Support attachment editing on interactions (#9356) ([676307f](https://github.com/discordjs/discord.js/commit/676307ff5c6c4ef56a353b6fc74501a1080da869))
- **core:** Missed optional options (#9311) ([6912faa](https://github.com/discordjs/discord.js/commit/6912faa9b3852adbacc7d0b002aae81be041f529))

## Typings

- **ChannelsAPI:** Use correct type for `editMessage` (#9399) ([0a1701b](https://github.com/discordjs/discord.js/commit/0a1701b0463919a895c518e5daa9836760d9b6cf))

# [@discordjs/core@0.5.1](https://github.com/discordjs/discord.js/compare/@discordjs/core@0.5.0...@discordjs/core@0.5.1) - (2023-04-16)

## Bug Fixes

- **interactions:** Make `data` parameter optional (#9379) ([66dc401](https://github.com/discordjs/discord.js/commit/66dc4014fe4553f1dd73aaa7c32fd83e10bde263))
- **core:** Support attachment editing on interactions (#9356) ([676307f](https://github.com/discordjs/discord.js/commit/676307ff5c6c4ef56a353b6fc74501a1080da869))
- **core:** Missed optional options (#9311) ([6912faa](https://github.com/discordjs/discord.js/commit/6912faa9b3852adbacc7d0b002aae81be041f529))

## Typings

- **ChannelsAPI:** Use correct type for `editMessage` (#9399) ([0a1701b](https://github.com/discordjs/discord.js/commit/0a1701b0463919a895c518e5daa9836760d9b6cf))

# [@discordjs/core@0.5.0](https://github.com/discordjs/discord.js/compare/@discordjs/core@0.4.0...@discordjs/core@0.5.0) - (2023-04-01)

## Bug Fixes

- **core:** Include data for defer (#9284) ([9d69bba](https://github.com/discordjs/discord.js/commit/9d69bba47c73b756086992bc14e57c40fadb34d1))
- **scripts:** Accessing tsComment ([d8d5f31](https://github.com/discordjs/discord.js/commit/d8d5f31d3927fd1de62f1fa3a1a6e454243ad87b))

## Features

- **core:** Http-only wrapper (#9281) ([11e682c](https://github.com/discordjs/discord.js/commit/11e682cfe388b9a3070388f73ebef3c27555c0dd))
- **core:** Add `AbortSignal` support. (#9042) ([907eb1b](https://github.com/discordjs/discord.js/commit/907eb1b4708bdaf30f4e59f4016ef8a717f47a4c))
- **website:** Render syntax and mdx on the server (#9086) ([ee5169e](https://github.com/discordjs/discord.js/commit/ee5169e0aadd7bbfcd752aae614ec0f69602b68b))

# [@discordjs/core@0.4.0](https://github.com/discordjs/discord.js/compare/@discordjs/core@0.3.0...@discordjs/core@0.4.0) - (2023-03-12)

## Bug Fixes

- **core:** Use `auth: false` for interaction callback methods (#9211) ([1b29099](https://github.com/discordjs/discord.js/commit/1b29099ed0b0deb98db844671aa23b4a84ec9c08))
- **WebSocketShard:** Proper error bubbling (#9119) ([9681f34](https://github.com/discordjs/discord.js/commit/9681f348770b0e2ff9b7c96b1c30575dd950e2ed))
- **oauth2:** Pass through body (#9106) ([483cbb3](https://github.com/discordjs/discord.js/commit/483cbb3b2abd2e3afadc3f814069d8e12bcf812b))

## Documentation

- Fix /core README example (#9201) ([f65ac2e](https://github.com/discordjs/discord.js/commit/f65ac2ea780e9f60123c611292f0d0b647106d4c))

## Features

- **core:** Adds `getWebhooks()` function for the channel API and for the guild API (#9043) ([c6f9c50](https://github.com/discordjs/discord.js/commit/c6f9c50ba9abf9555a2c40de3113a08765b830d5))
- **website:** Add support for source file links (#9048) ([f6506e9](https://github.com/discordjs/discord.js/commit/f6506e99c496683ee0ab67db0726b105b929af38))
- **core:** Implement some ws send events (#8941) ([816aed4](https://github.com/discordjs/discord.js/commit/816aed478e3035060697092d52ad2b58106be0ee))
- **core:** Add oauth2 api support (#8938) ([36560c9](https://github.com/discordjs/discord.js/commit/36560c99559ea5d66d42e29fcf050b7d1c33cf6b))

## Refactor

- **core:** Move `setVoiceState` to `GuildsAPI` (#9228) ([dff131e](https://github.com/discordjs/discord.js/commit/dff131e8e4c24356d534a3dd42b33886ad30239f))

## Typings

- **MappedEvents:** Add `GuildAuditLogEntryCreate` (#9175) ([3492b19](https://github.com/discordjs/discord.js/commit/3492b194b5aabfb6214aa985667f5ed7188fa6e8))
- Fix `GuildsAPI#getMembers` return type (#9037) ([158db47](https://github.com/discordjs/discord.js/commit/158db474b7514e9ff6ba6f48a89ad71c97a7088a))

# [@discordjs/core@0.3.0](https://github.com/discordjs/discord.js/compare/@discordjs/core@0.2.0...@discordjs/core@0.3.0) - (2022-12-16)

## Bug Fixes

- **core:** Instantiate/export role connections ([166f742](https://github.com/discordjs/discord.js/commit/166f742d02d475a5044f935ee638ae1e25075b9c))

# [@discordjs/core@0.2.0](https://github.com/discordjs/discord.js/tree/@discordjs/core@0.2.0) - (2022-12-16)

## Bug Fixes

- **thread:** `get()` route (#8897) ([3dede75](https://github.com/discordjs/discord.js/commit/3dede75621993428216196c60658e0c482aa9f61))
- Remove casts when using `makeURLSearchParams()` (#8877) ([7430c8e](https://github.com/discordjs/discord.js/commit/7430c8e4c8e299acf750b46b6146c611b0c4941d))

## Features

- **core:** Add support for role connections (#8930) ([3d6fa24](https://github.com/discordjs/discord.js/commit/3d6fa248c07b2278504bbe8bafa17a3294971fd9))
- Add links to each routes documentation (#8898) ([73300c7](https://github.com/discordjs/discord.js/commit/73300c75fae7df9af293f7c03b179236679fb753))
- **interactions:** Add `messageId` parameter to `deleteReply()` (#8896) ([3f555d5](https://github.com/discordjs/discord.js/commit/3f555d5ddf53b778fc0e69e1ff77ec93d876dcdb))
- Add `@discordjs/core` (#8736) ([2127b32](https://github.com/discordjs/discord.js/commit/2127b32d26dedeb44ec43d16ec2e2046919f9bb0))
