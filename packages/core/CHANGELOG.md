# Changelog

All notable changes to this project will be documented in this file.

# [@discordjs/core@2.1.0](https://github.com/discordjs/discord.js/compare/@discordjs/core@2.0.1...@discordjs/core@2.1.0) - (2025-04-25)

## Features

- **website:** Include reexported members in docs (#10518) ([aa61c20](https://github.com/discordjs/discord.js/commit/aa61c20ffdac3f3a0dca224f9e48e614309ecb2e))

# [@discordjs/core@2.0.0](https://github.com/discordjs/discord.js/compare/@discordjs/core@1.2.0...@discordjs/core@2.0.0) - (2024-09-01)

## Bug Fixes

- **OAuth2API:** Enable token exchange without token (#10312) ([9b07036](https://github.com/discordjs/discord.js/commit/9b07036d707b123709480987d5741d6ba75b148b))

## Documentation

- **stageInstances:** Correct reference for stage instance creation (#10333) ([7f60a8f](https://github.com/discordjs/discord.js/commit/7f60a8fc5d412718e269774505b2ed4fc30a83cd))

## Features

- Use get sticker pack endpoint (#10445) ([1b1ae2f](https://github.com/discordjs/discord.js/commit/1b1ae2f0cb339170e4c0692eb43fbc966fd64030))
- **VoiceState:** Add methods for fetching voice state (#10442) ([9907ff9](https://github.com/discordjs/discord.js/commit/9907ff915e7c72e7e980d68bf005763a3aacad1c))
- Application emojis (#10399) ([5d92525](https://github.com/discordjs/discord.js/commit/5d92525596a0193fe65626119bb040c2eb9e945a))
- **OAuth2API:** Add `revokeToken` method (#10440) ([69adc6f](https://github.com/discordjs/discord.js/commit/69adc6f4b9eb4fafe4a20b01137a270621f1365f))
- Premium buttons (#10353) ([4f59b74](https://github.com/discordjs/discord.js/commit/4f59b740d01b9ff2213949708a36e17da32b89c3))
- Add `reason` to `followAnnouncements` method (#10275) ([b36ec98](https://github.com/discordjs/discord.js/commit/b36ec983828c7001e47debcd435592ea026768d5))

## Refactor

- Use get guild role endpoint (#10443) ([bba0e72](https://github.com/discordjs/discord.js/commit/bba0e72e2283630b9f84b77d53525397036c6b31))
- **ws:** Event layout (#10376) ([bf6761a](https://github.com/discordjs/discord.js/commit/bf6761a44adec1fe5017f6bf5d8bc0734916961f))
  - **BREAKING CHANGE:** All events now emit shard id as its own param

# [@discordjs/core@1.2.0](https://github.com/discordjs/discord.js/compare/@discordjs/core@1.1.1...@discordjs/core@1.2.0) - (2024-05-04)

## Bug Fixes

- **Gateway:** Export interface (#10060) ([ce84d3e](https://github.com/discordjs/discord.js/commit/ce84d3efee7186150c89698916e7211a2423a839))

## Documentation

- Remove duplicated words (#10178) ([26af386](https://github.com/discordjs/discord.js/commit/26af3868a5648042b7715a14b8ed8dd2f478345c))
- Split docs.api.json into multiple json files ([597340f](https://github.com/discordjs/discord.js/commit/597340f288437c35da8c703d9b621274de60d880))

## Features

- Consumable entitlements (#10235) ([9978870](https://github.com/discordjs/discord.js/commit/997887069a00b732e62ba7bdceed714e3ede1079))
- Polls (#10185) ([a1aeaeb](https://github.com/discordjs/discord.js/commit/a1aeaeb9d804b126dd525b6090c6f2ff9591cb9c))
- **GuildsAPI:** Bulk ban users (#10202) ([bfc3b10](https://github.com/discordjs/discord.js/commit/bfc3b100dad97417b64ecc94d8f84135c3208072))
- Local and preview detection ([79fbda3](https://github.com/discordjs/discord.js/commit/79fbda3aac6d4f0f8bfb193e797d09cbe331d315))
- **guild:** Add `with_counts` to getting guilds (#10143) ([8c2abab](https://github.com/discordjs/discord.js/commit/8c2ababa786be470519e08846a1d843b406f9f50))
- Premium application subscriptions (#9907) ([c4fcee3](https://github.com/discordjs/discord.js/commit/c4fcee3ef6021c440f162a5764d5d9465f06dc9b))

## Refactor

- Docs (#10126) ([18cce83](https://github.com/discordjs/discord.js/commit/18cce83d80598c430218775c53441b6b2ecdc776))
- **oauth2:** Remove unnecessary dependency on 'node:url' (#10141) ([906ade9](https://github.com/discordjs/discord.js/commit/906ade9cc54ef3c162734e70215bef1b1cf1793e))
- Use interfaces for AsyncEventEmitter event maps (#10044) ([adfd9cd](https://github.com/discordjs/discord.js/commit/adfd9cd3b32cfabdcc45ec90f535b2852a3ca4a6))

# [@discordjs/core@1.1.1](https://github.com/discordjs/discord.js/tree/@discordjs/core@1.1.1) - (2023-11-18)

## Bug Fixes

- Minify mainlib docs json (#9963) ([4b88306](https://github.com/discordjs/discord.js/commit/4b88306dcb2b16b840ec61e9e33047af3a31c45d))

# [@discordjs/core@1.1.1](https://github.com/discordjs/discord.js/compare/@discordjs/core@1.1.0...@discordjs/core@1.1.1) - (2023-11-17)

## Bug Fixes

- Minify mainlib docs json (#9963) ([4b88306](https://github.com/discordjs/discord.js/commit/4b88306dcb2b16b840ec61e9e33047af3a31c45d))

# [@discordjs/core@1.1.0](https://github.com/discordjs/discord.js/compare/@discordjs/core@1.0.1...@discordjs/core@1.1.0) - (2023-11-12)

## Documentation

- **stickers:** Reveal link in the website (#9870) ([332b624](https://github.com/discordjs/discord.js/commit/332b624aed648c707a1ba67da5535fcbf9c84497))
- **ApplicationsAPI:** Fix `getCurrent()` options description (#9816) ([23a6424](https://github.com/discordjs/discord.js/commit/23a6424261d0d61db2742838f1b5803e3ee00625))

## Features

- **Client:** AsyncIterator-returning method for fetching members (#9771) ([fffe70a](https://github.com/discordjs/discord.js/commit/fffe70a039280830b2773818a776d821a6b1d3dd))
- Add guild member (#9877) ([c051ed9](https://github.com/discordjs/discord.js/commit/c051ed94271a7f5e5dec9836571ad4856e28f3b5))
- Onboarding mode and edit method (#9647) ([7671a83](https://github.com/discordjs/discord.js/commit/7671a836f4b080a0c0d42bbbacc6ddd1df7c0ba8))
- Support new application properties and patch endpoint (#9709) ([1fe7247](https://github.com/discordjs/discord.js/commit/1fe72475286775cdfc68dad251ed662db7375ad1))
- Implement `GET` current application (#9797) ([50106c7](https://github.com/discordjs/discord.js/commit/50106c77dbce34ccfac2a15e4ed6bfae4727b9ca))

## Refactor

- Stickers are free (no more "premium" packs) (#9791) ([e02a59b](https://github.com/discordjs/discord.js/commit/e02a59bbb6f57c6935230d120867519c1e84d10a))

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
