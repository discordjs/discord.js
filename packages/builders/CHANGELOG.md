# Changelog

All notable changes to this project will be documented in this file.

# [0.12.0](https://github.com/discordjs/discord.js/compare/@discordjs/builders@0.11.0...@discordjs/builders@0.12.0) (2021-12-08)

## Bug Fixes

- **builders:** Dont export `Button` component stuff twice (#7289) ([86d9d06](https://github.com/discordjs/discord.js/commit/86d9d0674347c08d056cd054cb4ce4253195bf94))

## Documentation

- **SlashCommandSubcommands:** Updating old links from Discord developer portal (#7224) ([bd7a6f2](https://github.com/discordjs/discord.js/commit/bd7a6f265212624199fb0b2ddc8ece39759c63de))

## Features

- Add components to /builders (#7195) ([2bb40fd](https://github.com/discordjs/discord.js/commit/2bb40fd767cf5918e3ba422ff73082734bfa05b0))

## Typings

- Make `required` a boolean (#7307) ([c10afea](https://github.com/discordjs/discord.js/commit/c10afeadc702ab98bec5e077b3b92494a9596f9c))

# [0.11.0](https://github.com/discordjs/builders/compare/v0.10.0...v0.11.0) (2021-12-29)

## Bug Fixes

- **ApplicationCommandOptions:** clean up code for builder options ([#68](https://github.com/discordjs/builders/issues/68)) ([b5d0b15](https://github.com/discordjs/builders/commit/b5d0b157b1262bd01fa011f8e0cf33adb82776e7))

# [0.10.0](https://github.com/discordjs/builders/compare/v0.9.0...v0.10.0) (2021-12-24)

## Bug Fixes

- use zod instead of ow for max/min option validation ([#66](https://github.com/discordjs/builders/issues/66)) ([beb35fb](https://github.com/discordjs/builders/commit/beb35fb1f65bd6be2321e17cc792f67e8615fd48))

## Features

- add max/min option for int and number builder options ([#47](https://github.com/discordjs/builders/issues/47)) ([2e1e860](https://github.com/discordjs/builders/commit/2e1e860b46e3453398b20df63dabb6d4325e32d1))

# [0.9.0](https://github.com/discordjs/builders/compare/v0.8.2...v0.9.0) (2021-12-02)

## Bug Fixes

- replace ow with zod ([#58](https://github.com/discordjs/builders/issues/58)) ([0b6fb81](https://github.com/discordjs/builders/commit/0b6fb8161b858e42781855fb73aaa873fec58160))

## Features

- **SlashCommandBuilder:** add autocomplete ([#53](https://github.com/discordjs/builders/issues/53)) ([05b07a7](https://github.com/discordjs/builders/commit/05b07a7e88848188c27d7380d9f948cba25ef778))

## [0.8.2](https://github.com/discordjs/builders/compare/v0.8.1...v0.8.2) (2021-10-30)

## Bug Fixes

- downgrade ow because of esm issues ([#55](https://github.com/discordjs/builders/issues/55)) ([3722d2c](https://github.com/discordjs/builders/commit/3722d2c1109a7a5c0abad63c1a7eb944df6e46c8))

## [0.8.1](https://github.com/discordjs/builders/compare/v0.8.0...v0.8.1) (2021-10-29)

## Bug Fixes

- documentation ([e33ec8d](https://github.com/discordjs/builders/commit/e33ec8dfd5785312f82e0afb017a3dac614fd71d))

# [0.7.0](https://github.com/discordjs/builders/compare/v0.6.0...v0.7.0) (2021-10-18)

## Bug Fixes

- properly type `toJSON` methods ([#34](https://github.com/discordjs/builders/issues/34)) ([7723ad0](https://github.com/discordjs/builders/commit/7723ad0da169386e638188de220451a97513bc25))

## Features

- **ContextMenus:** add context menu command builder ([#29](https://github.com/discordjs/builders/issues/29)) ([f0641e5](https://github.com/discordjs/builders/commit/f0641e55733de8992600f3082bcf054e6f815cf7))
- add support for channel types on channel options ([#41](https://github.com/discordjs/builders/issues/41)) ([f6c187e](https://github.com/discordjs/builders/commit/f6c187e0ad6ebe03e65186ece3e95cb1db5aeb50))

# [0.6.0](https://github.com/discordjs/builders/compare/v0.5.0...v0.6.0) (2021-08-24)

## Bug Fixes

- **SlashCommandBuilder:** allow subcommands and groups to coexist at the root level ([#26](https://github.com/discordjs/builders/issues/26)) ([0be4daf](https://github.com/discordjs/builders/commit/0be4dafdfc0b5747c880be0078c00ada913eb4fb))

## Features

- create `Embed` builder ([#11](https://github.com/discordjs/builders/issues/11)) ([eb942a4](https://github.com/discordjs/builders/commit/eb942a4d1f3bcec9a4e370b6af602a713ad8f9b7))
- **SlashCommandBuilder:** create setDefaultPermission function ([#19](https://github.com/discordjs/builders/issues/19)) ([5d53759](https://github.com/discordjs/builders/commit/5d537593937a8da330153ce4711b7d093a80330e))
- **SlashCommands:** add number option type ([#23](https://github.com/discordjs/builders/issues/23)) ([1563991](https://github.com/discordjs/builders/commit/1563991d421bb07bf7a412c87e7613692d770f04))

# [0.5.0](https://github.com/discordjs/builders/compare/v0.3.0...v0.5.0) (2021-08-10)

## Features

- **Formatters:** add `formatEmoji` ([#20](https://github.com/discordjs/builders/issues/20)) ([c3d8bb5](https://github.com/discordjs/builders/commit/c3d8bb5363a1d46b45c0def4277da6921e2ba209))

# [0.4.0](https://github.com/discordjs/builders/compare/v0.3.0...v0.4.0) (2021-08-05)

## Features

- `sub command` => `subcommand` ([#18](https://github.com/discordjs/builders/pull/18)) ([95599c5](https://github.com/discordjs/builders/commit/95599c5b5366ebd054c4c277c52f1a44cda1209d))

# [0.3.0](https://github.com/discordjs/builders/compare/v0.2.0...v0.3.0) (2021-08-01)

## Bug Fixes

- **Shrug:** Update comment ([#14](https://github.com/discordjs/builders/issues/14)) ([6fa6c40](https://github.com/discordjs/builders/commit/6fa6c405f2ea733811677d3d1bfb1e2806d504d5))
- shrug face rendering ([#13](https://github.com/discordjs/builders/issues/13)) ([6ad24ec](https://github.com/discordjs/builders/commit/6ad24ecd96c82b0f576e78e9e53fc7bf9c36ef5d))

## Features

- **formatters:** mentions ([#9](https://github.com/discordjs/builders/issues/9)) ([f83fe99](https://github.com/discordjs/builders/commit/f83fe99b83188ed999845751ffb005c687dbd60a))
- **Formatters:** Add a spoiler function ([#16](https://github.com/discordjs/builders/issues/16)) ([c213a6a](https://github.com/discordjs/builders/commit/c213a6abb114f65653017a4edec4bdba2162d771))
- **SlashCommands:** add slash command builders ([#3](https://github.com/discordjs/builders/issues/3)) ([6aa3af0](https://github.com/discordjs/builders/commit/6aa3af07b0ee342fff91f080914bb12b3ab773f8))
- shrug, tableflip and unflip strings ([#5](https://github.com/discordjs/builders/issues/5)) ([de5fa82](https://github.com/discordjs/builders/commit/de5fa823cd6f1feba5b2d0a63b2cb1761dfd1814))

# [0.2.0](https://github.com/discordjs/builders/compare/v0.1.1...v0.2.0) (2021-07-03)

## Features

- **Formatters:** added `hyperlink` and `hideLinkEmbed` ([#4](https://github.com/discordjs/builders/issues/4)) ([c532daf](https://github.com/discordjs/builders/commit/c532daf2ba2feae75bf9668f63462e96a5314cff))

# [0.1.1](https://github.com/discordjs/builders/compare/v0.1.0...v0.1.1) (2021-06-30)

## Bug Fixes

- **Deps:** added `tslib` as dependency ([#2](https://github.com/discordjs/builders/issues/2)) ([5576ff3](https://github.com/discordjs/builders/commit/5576ff3b67136b957bed0ab8a4c655d5de322813))

# 0.1.0 (2021-06-30)

## Features

- added message formatters ([#1](https://github.com/discordjs/builders/issues/1)) ([765e46d](https://github.com/discordjs/builders/commit/765e46dac96c4e49d350243e5fad34c2bc738a7c))
