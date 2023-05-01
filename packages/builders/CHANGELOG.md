# Changelog

All notable changes to this project will be documented in this file.

# [@discordjs/builders@1.6.2](https://github.com/discordjs/discord.js/compare/@discordjs/builders@1.6.1...@discordjs/builders@1.6.2) - (2023-05-01)

## Bug Fixes

- **BaseSelectMenuBuilder:** Modify class to be `abstract` (#9358) ([ca4de2d](https://github.com/discordjs/discord.js/commit/ca4de2d9c6bc204e85d1b7eae7eabd23dbeb4475))
- Correct `@link` tags that involve parents (#9351) ([fbbce3e](https://github.com/discordjs/discord.js/commit/fbbce3eb4ba20bc0c4806ca2259d1f86001594be))
- Fix external links (#9313) ([a7425c2](https://github.com/discordjs/discord.js/commit/a7425c29c4f23f1b31f4c6a463107ca9eb7fd7e2))

## Documentation

- Reference package names properly (#9426) ([d6bca9b](https://github.com/discordjs/discord.js/commit/d6bca9bb4d976dc069a5039250db7d5b3e9142ef))
- Generate static imports for types with api-extractor ([98a76db](https://github.com/discordjs/discord.js/commit/98a76db482879f79d6bb2fb2e5fc65ac2c34e2d9))
- **builders:** Add some basic documentation (#9359) ([8073561](https://github.com/discordjs/discord.js/commit/8073561824f911d1a18d0b4f1de39f452bc69fa9))
- Use `@link` in `@see` (#9348) ([d66d113](https://github.com/discordjs/discord.js/commit/d66d1133331b81563588db4500c63a18c3c3dfae))

# [@discordjs/builders@1.6.0](https://github.com/discordjs/discord.js/compare/@discordjs/builders@1.5.0...@discordjs/builders@1.6.0) - (2023-04-01)

## Bug Fixes

- **scripts:** Accessing tsComment ([d8d5f31](https://github.com/discordjs/discord.js/commit/d8d5f31d3927fd1de62f1fa3a1a6e454243ad87b))

## Features

- **website:** Render syntax and mdx on the server (#9086) ([ee5169e](https://github.com/discordjs/discord.js/commit/ee5169e0aadd7bbfcd752aae614ec0f69602b68b))

# [@discordjs/builders@1.5.0](https://github.com/discordjs/discord.js/compare/@discordjs/builders@1.4.0...@discordjs/builders@1.5.0) - (2023-03-12)

## Documentation

- **EmbedBuilder#spliceFields:** Fix a typo (#9159) ([4367ab9](https://github.com/discordjs/discord.js/commit/4367ab930227048868db3ed8437f6c4507ff32e1))
- Fix version export (#9049) ([8b70f49](https://github.com/discordjs/discord.js/commit/8b70f497a1207e30edebdecd12b926c981c13d28))

## Features

- **website:** Add support for source file links (#9048) ([f6506e9](https://github.com/discordjs/discord.js/commit/f6506e99c496683ee0ab67db0726b105b929af38))
- **StringSelectMenu:** Add `spliceOptions()` (#8937) ([a6941d5](https://github.com/discordjs/discord.js/commit/a6941d536ce24ed2b5446a154cbc886b2b97c63a))
- Add support for nsfw commands (#7976) ([7a51344](https://github.com/discordjs/discord.js/commit/7a5134459c5f06864bf74631d83b96d9c21b72d8))
- Add `@discordjs/formatters` (#8889) ([3fca638](https://github.com/discordjs/discord.js/commit/3fca638a8470dcea2f79ddb9f18526dbc0017c88))

## Styling

- Run prettier (#9041) ([2798ba1](https://github.com/discordjs/discord.js/commit/2798ba1eb3d734f0cf2eeccd2e16cfba6804873b))

# [@discordjs/builders@1.4.0](https://github.com/discordjs/discord.js/compare/@discordjs/builders@1.3.0...@discordjs/builders@1.4.0) - (2022-11-28)

## Bug Fixes

- Pin @types/node version ([9d8179c](https://github.com/discordjs/discord.js/commit/9d8179c6a78e1c7f9976f852804055964d5385d4))

## Features

- New select menus (#8793) ([5152abf](https://github.com/discordjs/discord.js/commit/5152abf7285581abf7689e9050fdc56c4abb1e2b))
- Allow punctuation characters in context menus (#8783) ([b521366](https://github.com/discordjs/discord.js/commit/b5213664fa66746daab1673ebe2adf2db3d1522c))

## Typings

- **Formatters:** Allow boolean in `formatEmoji` (#8823) ([ec37f13](https://github.com/discordjs/discord.js/commit/ec37f137fd4fca0fdbdb8a5c83abf32362a8f285))

# [@discordjs/builders@1.3.0](https://github.com/discordjs/discord.js/compare/@discordjs/builders@1.2.0...@discordjs/builders@1.3.0) - (2022-10-08)

## Bug Fixes

- Allow adding forums to `channelTypes` (#8658) ([b1e190c](https://github.com/discordjs/discord.js/commit/b1e190c4f0773a1a739625f5b41026f593515370))
- **SlashCommandBuilder:** Missing methods in subcommand builder (#8583) ([1c5b78f](https://github.com/discordjs/discord.js/commit/1c5b78fd2130f09c951459cf4c2d637f46c3c2c9))
- Footer / sidebar / deprecation alert ([ba3e0ed](https://github.com/discordjs/discord.js/commit/ba3e0ed348258fe8e51eefb4aa7379a1230616a9))

## Documentation

- **builders/components:** Document constructors (#8636) ([8444576](https://github.com/discordjs/discord.js/commit/8444576f45da5fdddbf8ba2d91b4cb31a3b51c04))
- Change name (#8604) ([dd5a089](https://github.com/discordjs/discord.js/commit/dd5a08944c258a847fc4377f1d5e953264ab47d0))
- Use remarks instead of `Note` in descriptions (#8597) ([f3ce4a7](https://github.com/discordjs/discord.js/commit/f3ce4a75d0c4eafc89a1f0ce9f4964bcbcdae6da))

## Features

- Web-components (#8715) ([0ac3e76](https://github.com/discordjs/discord.js/commit/0ac3e766bd9dbdeb106483fa4bb085d74de346a2))
- Add `@discordjs/util` (#8591) ([b2ec865](https://github.com/discordjs/discord.js/commit/b2ec865765bf94181473864a627fb63ea8173fd3))
- Add `chatInputApplicationCommandMention` formatter (#8546) ([d08a57c](https://github.com/discordjs/discord.js/commit/d08a57cadd9d69a734077cc1902d931ab10336db))

## Refactor

- Replace usage of deprecated `ChannelType`s (#8625) ([669c3cd](https://github.com/discordjs/discord.js/commit/669c3cd2566eac68ef38ab522dd6378ba761e8b3))
- Website components (#8600) ([c334157](https://github.com/discordjs/discord.js/commit/c3341570d983aea9ecc419979d5a01de658c9d67))
- Use `eslint-config-neon` for packages. (#8579) ([edadb9f](https://github.com/discordjs/discord.js/commit/edadb9fe5dfd9ff51a3cfc9b25cb242d3f9f5241))

## Testing

- Rename incorrect test (#8596) ([ce991dd](https://github.com/discordjs/discord.js/commit/ce991dd1d883f6785b5f4b4b3ac80ef21cb304e7))

## Typings

- **interactions:** Fix `{Slash,ContextMenu}CommandBuilder#toJSON` (#8568) ([b7eb96d](https://github.com/discordjs/discord.js/commit/b7eb96d45670616521fbcca28a657793d91605c7))

# [@discordjs/builders@1.2.0](https://github.com/discordjs/discord.js/compare/@discordjs/builders@1.1.0...@discordjs/builders@1.2.0) - (2022-08-22)

## Features

- **website:** Show `constructor` information (#8540) ([e42fd16](https://github.com/discordjs/discord.js/commit/e42fd1636973b10dd7ed6fb4280ee1a4a8f82007))
- **website:** Show descriptions for `@typeParam` blocks (#8523) ([e475b63](https://github.com/discordjs/discord.js/commit/e475b63f257f6261d73cb89fee9ecbcdd84e2a6b))
- **website:** Show parameter descriptions (#8519) ([7f415a2](https://github.com/discordjs/discord.js/commit/7f415a2502bf7ce2025dbcfed9017b0635a19966))
- **WebSocketShard:** Support new resume url (#8480) ([bc06cc6](https://github.com/discordjs/discord.js/commit/bc06cc638d2f57ab5c600e8cdb6afc8eb2180166))

## Refactor

- Docs design (#8487) ([4ab1d09](https://github.com/discordjs/discord.js/commit/4ab1d09997a18879a9eb9bda39df6f15aa22557e))

# [@discordjs/builders@1.1.0](https://github.com/discordjs/discord.js/compare/@discordjs/builders@0.16.0...@discordjs/builders@1.1.0) - (2022-07-29)

## Bug Fixes

- Use proper format for `@link` text (#8384) ([2655639](https://github.com/discordjs/discord.js/commit/26556390a3800e954974a00c1328ff47d3e67e9a))
- **Formatters:** Add newline in `codeBlock` (#8369) ([5d8bd03](https://github.com/discordjs/discord.js/commit/5d8bd030d60ef364de3ef5f9963da8bda5c4efd4))
- **selectMenu:** Allow json to be used for select menu options (#8322) ([6a2d0d8](https://github.com/discordjs/discord.js/commit/6a2d0d8e96d157d5b85cee7f17bffdfff4240074))

## Documentation

- Use link tags (#8382) ([5494791](https://github.com/discordjs/discord.js/commit/549479131318c659f86f0eb18578d597e22522d3))

## Features

- Add channel & message URL formatters (#8371) ([a7deb8f](https://github.com/discordjs/discord.js/commit/a7deb8f89830ead6185c5fb46a49688b6d209ed1))

## Testing

- **builders:** Improve coverage (#8274) ([b7e6238](https://github.com/discordjs/discord.js/commit/b7e62380f2e6b9324d6bba9b9eaa5315080bf66a))

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
