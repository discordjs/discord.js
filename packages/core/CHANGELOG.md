# Changelog

All notable changes to this project will be documented in this file.

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
