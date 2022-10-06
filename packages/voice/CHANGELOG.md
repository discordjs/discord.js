# Changelog

All notable changes to this project will be documented in this file.

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

# [@discordjs/voice@0.10.0](https://github.com/discordjs/discord.js/compare/@discordjs/voice@0.8.0...@discordjs/voice@0.10.0) - (2022-06-04)

## Bug Fixes

- Fix some typos (#7393) ([92a04f4](https://github.com/discordjs/discord.js/commit/92a04f4d98f6c6760214034cc8f5a1eaa78893c7))

## Features

- Support sodium-native lib for voice (#7698) ([f0d0242](https://github.com/discordjs/discord.js/commit/f0d0242c76a455bb7a5ea7bd95ca62907c7e9d62))
- Add API v10 support (#7477) ([72577c4](https://github.com/discordjs/discord.js/commit/72577c4bfd02524a27afb6ff4aebba9301a690d3))
- Add support for module: NodeNext in TS and ESM (#7598) ([8f1986a](https://github.com/discordjs/discord.js/commit/8f1986a6aa98365e09b00e84ad5f9f354ab61f3d))
- **builders:** Add attachment command option type (#7203) ([ae0f35f](https://github.com/discordjs/discord.js/commit/ae0f35f51d68dfa5a7dc43d161ef9365171debdb))

## Styling

- Cleanup tests and tsup configs ([6b8ef20](https://github.com/discordjs/discord.js/commit/6b8ef20cb3af5b5cfd176dd0aa0a1a1e98551629))

# [@discordjs/voice@0.8.0](https://github.com/discordjs/discord.js/compare/@discordjs/voice@0.7.5...@discordjs/voice@0.8.0) - (2022-01-24)

## Refactor

- PresenceUpdate and demuxProbe (#7248) ([1745973](https://github.com/discordjs/discord.js/commit/174597302408f13c5bb685e2fb02ae2137cb481d))

## Testing

- **voice:** Fix tests ([62c74b8](https://github.com/discordjs/discord.js/commit/62c74b8333066465e5bd295b8b102b35a506751d))
- Fix voice secretbox tests ([4a2dbd6](https://github.com/discordjs/discord.js/commit/4a2dbd62382f904d596b34da0116d50e724b81c4))
- Fix voice tests ([b593bd3](https://github.com/discordjs/discord.js/commit/b593bd32a98282a92fa28f2fb0a8ef239866622c))
