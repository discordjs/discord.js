# Changelog

All notable changes to this project will be documented in this file.

# [@discordjs/builders@1.1.0](https://github.com/discordjs/discord.js/compare/@discordjs/builders@1.0.0...@discordjs/builders@1.1.0) - (2022-07-29)

## Bug Fixes

- Use proper format for `@link` text (#8384) ([2655639](https://github.com/discordjs/discord.js/commit/26556390a3800e954974a00c1328ff47d3e67e9a))
- **Formatters:** Add newline in `codeBlock` (#8369) ([5d8bd03](https://github.com/discordjs/discord.js/commit/5d8bd030d60ef364de3ef5f9963da8bda5c4efd4))
- **selectMenu:** Allow json to be used for select menu options (#8322) ([6a2d0d8](https://github.com/discordjs/discord.js/commit/6a2d0d8e96d157d5b85cee7f17bffdfff4240074))

## Documentation

- Use link tags (#8382) ([5494791](https://github.com/discordjs/discord.js/commit/549479131318c659f86f0eb18578d597e22522d3))

## Features

- Add channel & message URL formatters (#8371) ([a7deb8f](https://github.com/discordjs/discord.js/commit/a7deb8f89830ead6185c5fb46a49688b6d209ed1))

# [@discordjs/builders@1.0.0](https://github.com/discordjs/discord.js/compare/@discordjs/builders@0.16.0...@discordjs/builders@1.0.0) - (2022-07-17)

## Info

- 1.0.0 release bump, no new features.

# [@discordjs/builders@0.16.0](https://github.com/discordjs/discord.js/compare/@discordjs/builders@0.15.0...@discordjs/builders@0.16.0) - (2022-07-17)

## Bug Fixes

- Slash command name regex (#8265) ([32f9056](https://github.com/discordjs/discord.js/commit/32f9056b15edede3bab07de96afb4b56d3a9ecca))
- **TextInputBuilder:** Parse `custom_id`, `label`, and `style` (#8216) ([2d9dfa3](https://github.com/discordjs/discord.js/commit/2d9dfa3c6ea4bb972da2f7e088d148b798c866d9))

## Documentation

- Add codecov coverage badge to readmes (#8226) ([f6db285](https://github.com/discordjs/discord.js/commit/f6db285c073898a749fe4591cbd4463d1896daf5))

## Features

- **builder:** Add max min length in string option (#8214) ([96c8d21](https://github.com/discordjs/discord.js/commit/96c8d21f95eb366c46ae23505ba9054f44821b25))
- Codecov (#8219) ([f10f4cd](https://github.com/discordjs/discord.js/commit/f10f4cdcd88ca6be7ec735ed3a415ba13da83db0))
- **docgen:** Update typedoc ([b3346f4](https://github.com/discordjs/discord.js/commit/b3346f4b9b3d4f96443506643d4631dc1c6d7b21))
- Website (#8043) ([127931d](https://github.com/discordjs/discord.js/commit/127931d1df7a2a5c27923c2f2151dbf3824e50cc))
- **docgen:** Typescript support ([3279b40](https://github.com/discordjs/discord.js/commit/3279b40912e6aa61507bedb7db15a2b8668de44b))
- Docgen package (#8029) ([8b979c0](https://github.com/discordjs/discord.js/commit/8b979c0245c42fd824d8e98745ee869f5360fc86))

## Refactor

- **builder:** Remove `unsafe*Builder`s (#8074) ([a4d1862](https://github.com/discordjs/discord.js/commit/a4d18629828234f43f03d1bd4851d4b727c6903b))
- Remove @sindresorhus/is as it's now esm only (#8133) ([c6f285b](https://github.com/discordjs/discord.js/commit/c6f285b7b089b004776fbeb444fe973a68d158d8))
- Move all the config files to root (#8033) ([769ea0b](https://github.com/discordjs/discord.js/commit/769ea0bfe78c4f1d413c6b397c604ffe91e39c6a))

## Typings

- Remove expect error (#8242) ([7e6dbaa](https://github.com/discordjs/discord.js/commit/7e6dbaaed900c07d1a04e23bbbf9cd0d1b0501c5))
- **builder:** Remove casting (#8241) ([8198da5](https://github.com/discordjs/discord.js/commit/8198da5cd0898e06954615a2287853321e7ebbd4))

# [@discordjs/builders@0.15.0](https://github.com/discordjs/discord.js/compare/@discordjs/builders@0.14.0...@discordjs/builders@0.15.0) - (2022-06-06)

## Features

- Allow builders to accept rest params and arrays (#7874) ([ad75be9](https://github.com/discordjs/discord.js/commit/ad75be9a9cf90c8624495df99b75177e6c24022f))
- Use vitest instead of jest for more speed ([8d8e6c0](https://github.com/discordjs/discord.js/commit/8d8e6c03decd7352a2aa180f6e5bc1a13602539b))
- Add scripts package for locally used scripts ([f2ae1f9](https://github.com/discordjs/discord.js/commit/f2ae1f9348bfd893332a9060f71a8a5f272a1b8b))

# [@discordjs/builders@0.15.0](https://github.com/discordjs/discord.js/compare/@discordjs/builders@0.14.0...@discordjs/builders@0.15.0) - (2022-06-05)

## Features

- Allow builders to accept rest params and arrays (#7874) ([ad75be9](https://github.com/discordjs/discord.js/commit/ad75be9a9cf90c8624495df99b75177e6c24022f))
- Use vitest instead of jest for more speed ([8d8e6c0](https://github.com/discordjs/discord.js/commit/8d8e6c03decd7352a2aa180f6e5bc1a13602539b))
- Add scripts package for locally used scripts ([f2ae1f9](https://github.com/discordjs/discord.js/commit/f2ae1f9348bfd893332a9060f71a8a5f272a1b8b))

# [@discordjs/builders@0.14.0](https://github.com/discordjs/discord.js/compare/@discordjs/builders@0.13.0...@discordjs/builders@0.14.0) - (2022-06-04)

## Bug Fixes

- **builders:** Leftover invalid null type ([8a7cd10](https://github.com/discordjs/discord.js/commit/8a7cd10554a2a71cd2fe7f6a177b5f4f43464348))
- **SlashCommandBuilder:** Import `Permissions` correctly (#7921) ([7ce641d](https://github.com/discordjs/discord.js/commit/7ce641d33a4af6586d5e7beffbe7d38619dcf1a2))
- Add localizations for subcommand builders and option choices (#7862) ([c1b5e73](https://github.com/discordjs/discord.js/commit/c1b5e731daa9cbbfca03a046e47cb1221ee1ed7c))

## Features

- Export types from `interactions/slashCommands/mixins` (#7942) ([68d5169](https://github.com/discordjs/discord.js/commit/68d5169f66c96f8fe5be17a1c01cdd5155607ab2))
- **builders:** Add new command permissions v2 (#7861) ([de3f157](https://github.com/discordjs/discord.js/commit/de3f1573f07dda294cc0fbb1ca4b659eb2388a12))
- **builders:** Improve embed errors and predicates (#7795) ([ec8d87f](https://github.com/discordjs/discord.js/commit/ec8d87f93272cc9987f9613735c0361680c4ed1e))

## Refactor

- Use arrays instead of rest parameters for builders (#7759) ([29293d7](https://github.com/discordjs/discord.js/commit/29293d7bbb5ed463e52e5a5853817e5a09cf265b))

## Styling

- Cleanup tests and tsup configs ([6b8ef20](https://github.com/discordjs/discord.js/commit/6b8ef20cb3af5b5cfd176dd0aa0a1a1e98551629))

# [@discordjs/builders@0.13.0](https://github.com/discordjs/discord.js/compare/@discordjs/builders@0.12.0...@discordjs/builders@0.13.0) - (2022-04-17)

## Bug Fixes

- Validate select menu options (#7566) ([b1d63d9](https://github.com/discordjs/discord.js/commit/b1d63d919a61f309ac89f27016b0f148678dac2b))
- **SelectMenu:** Set `placeholder` max to 150 (#7538) ([dcd4797](https://github.com/discordjs/discord.js/commit/dcd479767b6ec980a373f2ea1f22754f41661c1e))
- Only check `instanceof Component` once (#7546) ([0aa4851](https://github.com/discordjs/discord.js/commit/0aa48516a4e33497e8e8dc50da164a57cdee09d3))
- **builders:** Allow negative min/max value of number/integer option (#7484) ([3baa340](https://github.com/discordjs/discord.js/commit/3baa340821b8ecf8a16253bc0917a1033250d7c9))
- **components:** SetX should take rest parameters (#7461) ([3617359](https://github.com/discordjs/discord.js/commit/36173590a712f041b087b7882054805a8bd42dae))
- Unsafe embed builder field normalization (#7418) ([b936103](https://github.com/discordjs/discord.js/commit/b936103395121cb21a8c616f669ddab1d2efb0f1))
- Fix some typos (#7393) ([92a04f4](https://github.com/discordjs/discord.js/commit/92a04f4d98f6c6760214034cc8f5a1eaa78893c7))
- **builders:** Make type optional in constructor (#7391) ([4abb28c](https://github.com/discordjs/discord.js/commit/4abb28c0a1256c57a60369a6b8ec9e98c265b489))
- Don't create new instances of builders classes (#7343) ([d6b56d0](https://github.com/discordjs/discord.js/commit/d6b56d0080c4c5f8ace731f1e8bcae0c9d3fb5a5))

## Documentation

- Completely fix builders example link (#7543) ([1a14c0c](https://github.com/discordjs/discord.js/commit/1a14c0ca562ea173d363a770a0437209f461fd23))
- Add slash command builders example, fixes #7338 (#7339) ([3ae6f3c](https://github.com/discordjs/discord.js/commit/3ae6f3c313091151245d6e6b52337b459ecfc765))

## Features

- Slash command localization for builders (#7683) ([40b9a1d](https://github.com/discordjs/discord.js/commit/40b9a1d67d0b508ec593e030913acd8161cd17f8))
- Add API v10 support (#7477) ([72577c4](https://github.com/discordjs/discord.js/commit/72577c4bfd02524a27afb6ff4aebba9301a690d3))
- Add support for module: NodeNext in TS and ESM (#7598) ([8f1986a](https://github.com/discordjs/discord.js/commit/8f1986a6aa98365e09b00e84ad5f9f354ab61f3d))
- Add Modals and Text Inputs (#7023) ([ed92015](https://github.com/discordjs/discord.js/commit/ed920156344233241a21b0c0b99736a3a855c23c))
- Add missing `v13` component methods (#7466) ([f7257f0](https://github.com/discordjs/discord.js/commit/f7257f07655076eabfe355cb6a53260b39ca9670))
- **builders:** Add attachment command option type (#7203) ([ae0f35f](https://github.com/discordjs/discord.js/commit/ae0f35f51d68dfa5a7dc43d161ef9365171debdb))
- **components:** Add unsafe message component builders (#7387) ([6b6222b](https://github.com/discordjs/discord.js/commit/6b6222bf513d1ee8cd98fba0ad313def560b864f))
- **embed:** Add setFields (#7322) ([bcc5cda](https://github.com/discordjs/discord.js/commit/bcc5cda8a902ddb28c7e3578e0f29b4272832624))

## Refactor

- Remove nickname parsing (#7736) ([78a3afc](https://github.com/discordjs/discord.js/commit/78a3afcd7fdac358e06764cc0d675e1215c785f3))
- Replace zod with shapeshift (#7547) ([3c0bbac](https://github.com/discordjs/discord.js/commit/3c0bbac82fa9988af4a62ff00c66d149fbe6b921))
- Remove store channels (#7634) ([aedddb8](https://github.com/discordjs/discord.js/commit/aedddb875e740e1f1bd77f06ce1b361fd3b7bc36))
- Allow builders to accept emoji strings (#7616) ([fb9a9c2](https://github.com/discordjs/discord.js/commit/fb9a9c221121ee1c7986f9c775b77b9691a0ae15))
- Don't return builders from API data (#7584) ([549716e](https://github.com/discordjs/discord.js/commit/549716e4fcec89ca81216a6d22aa8e623175e37a))
- Remove obsolete builder methods (#7590) ([10607db](https://github.com/discordjs/discord.js/commit/10607dbdafe257c5cbf5b952b7eecec4919e8b4a))
- **Embed:** Remove add field (#7522) ([8478d2f](https://github.com/discordjs/discord.js/commit/8478d2f4de9ac013733850cbbc67902f7c5abc55))
- Make `data` public in builders (#7486) ([ba31203](https://github.com/discordjs/discord.js/commit/ba31203a0ad96e0a00f8312c397889351e4c5cfd))
- **embed:** Remove array support in favor of rest params (#7498) ([b3fa2ec](https://github.com/discordjs/discord.js/commit/b3fa2ece402839008738ad3adce3db958445838d))
- **components:** Default set boolean methods to true (#7502) ([b122149](https://github.com/discordjs/discord.js/commit/b12214922cea2f43afbe6b1555a74a3c8e16f798))
- Make public builder props getters (#7422) ([e8252ed](https://github.com/discordjs/discord.js/commit/e8252ed3b981a4b7e4013f12efadd2f5d9318d3e))
- **builders-methods:** Make methods consistent (#7395) ([f495364](https://github.com/discordjs/discord.js/commit/f4953647ff9f39127978c73bf8a62c08462802ca))
- Remove conditional autocomplete option return types (#7396) ([0909824](https://github.com/discordjs/discord.js/commit/09098240bfb13b8afafa4ab549f06d236e0ff1c9))
- **embed:** Mark properties as readonly (#7332) ([31768fc](https://github.com/discordjs/discord.js/commit/31768fcd69ed5b4566a340bda89ce881418e8272))

## Typings

- Fix regressions (#7649) ([5748dbe](https://github.com/discordjs/discord.js/commit/5748dbe08783beb80c526de38ccd105eb0e82664))

# [@discordjs/builders@0.12.0](https://github.com/discordjs/discord.js/compare/@discordjs/builders@0.11.0...@discordjs/builders@0.12.0) - (2022-01-24)

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
