# Changelog

All notable changes to this project will be documented in this file.

# [14.8.0](https://github.com/discordjs/discord.js/compare/14.7.1...14.8.0) - (2023-03-12)

## Bug Fixes

- **snowflake:** Snowflakes length (#9144) ([955e8fe](https://github.com/discordjs/discord.js/commit/955e8fe312c42ad4937cc1994d1d81e517c413c8))
- **Actions:** Inject built data by using a symbol (#9203) ([a63ac88](https://github.com/discordjs/discord.js/commit/a63ac88fcca5b61209892a6e560e35d58f5adc3b))
- **Message#deletable:** Add check for deletable message types (#9168) ([e78b8ad](https://github.com/discordjs/discord.js/commit/e78b8ad3fb6692cba2c565b508254c723f185f0c))
- **Message:** `bulkDeletable` permissions should be retrieved later for DMs (#9146) ([a9495bd](https://github.com/discordjs/discord.js/commit/a9495bd8f014c8021a214b83ffc531a2af5defef))
- **AutoModerationActionExecution:** Transform `action` (#9111) ([9156a28](https://github.com/discordjs/discord.js/commit/9156a2889cd0946dfd0b30a5f8365abfbc377b3d))
- **MessageReaction:** `toJSON()` infinite recursion (#9070) ([f268e1d](https://github.com/discordjs/discord.js/commit/f268e1d9798744e169ae87089ea2e1f214364d95))
- **ThreadChannel:** Insert starter message from threads created in forum channels (#9100) ([0b76ab4](https://github.com/discordjs/discord.js/commit/0b76ab4c403dd646c71482856ab993b263b7c474))
- **ApplicationRoleConnectionMetadata:** Export the class correctly (#9076) ([071516c](https://github.com/discordjs/discord.js/commit/071516c35239bd4e1cae572c855d86b335c8536d))
- Don't auth for interaction `showModal()` (#9046) ([b803a9a](https://github.com/discordjs/discord.js/commit/b803a9a899aaa75a3ea2bc6623c6afb28f495e8c))
- **WebSocketShard:** Zombie connection fix (#8989) ([876b181](https://github.com/discordjs/discord.js/commit/876b1813128ec702d3ef1e7b0074a4613e88c332))
- Keep other properties in triggerMetadata (#8977) ([d8dd197](https://github.com/discordjs/discord.js/commit/d8dd197a936dfffc05f9e5bc3184ec9022c56b51))
- **escapeX:** Emojis with underlines (#8945) ([07b597d](https://github.com/discordjs/discord.js/commit/07b597df16b9412c23ec2387d54564e4d1bcf7ed))
- **WebSocketShard:** Either start close timeout or emit destroyed but never both (#8956) ([43ce2a5](https://github.com/discordjs/discord.js/commit/43ce2a572eb8977b6994680171ac0c5f9bda1703))
- **DMChannel:** `recipientId` edge case (#8950) ([7ce9909](https://github.com/discordjs/discord.js/commit/7ce990954e2f73d7a996df0afa42ab287cb12514))
- Return only boolean for `disabled` (#8965) ([6614603](https://github.com/discordjs/discord.js/commit/66146033268a4db1279b2eaee4bd418f326c0d4b))
- Export missing `escapeX()` functions (#8944) ([25c27ea](https://github.com/discordjs/discord.js/commit/25c27eac1417e75c9b601b17cf177b1f47b699a9))
- **WebSocketShard:** Only cleanup the connection if a connection still exists (#8946) ([5eab5fc](https://github.com/discordjs/discord.js/commit/5eab5fc06ca6be36ecf1557f2ad29a670d4d5ae7))
- Add `@discordjs/formatters` to dependency list (#8939) ([18b3a19](https://github.com/discordjs/discord.js/commit/18b3a19810a6436fa8bb4b490ec5137eaecbd465))
- **resolveColor:** Invalid colors (#8933) ([c76e170](https://github.com/discordjs/discord.js/commit/c76e17078602914c3e1d227a3acc98eaa99c18d4))
- **WebSocketShard:** Clear listeners on reconnect (#8927) ([aa8c57d](https://github.com/discordjs/discord.js/commit/aa8c57dab60104549e28451abf35c0387595d67e))
- Re-export formatters (#8909) ([b14604a](https://github.com/discordjs/discord.js/commit/b14604abdecca575b1fca693c1593e3585bcca8c))

## Documentation

- **MessageManager:** Add clarification to fetch messages (#9222) ([f5ec1ca](https://github.com/discordjs/discord.js/commit/f5ec1cada5ebf0ca4093bdfc81aaf56900c794ef))
- Make interactionResponse as optional (#9179) ([664cccb](https://github.com/discordjs/discord.js/commit/664cccb2706db33635aa2556954de57f93b3d3db))
- Fix typos (#9127) ([1ba1f23](https://github.com/discordjs/discord.js/commit/1ba1f238f04221ec890fc921678909b5b7d92c26))
- **chatInputApplicationCommandMention:** Parameters are not nullable (#9091) ([6f78e82](https://github.com/discordjs/discord.js/commit/6f78e8285b3ce762de010e68d49b377a47dc5a63))
- No `@type` description and reveal info block (#9097) ([405f940](https://github.com/discordjs/discord.js/commit/405f9400e8e3ffea9f3847ab5abb431a34538a96))
- **ThreadEditOptions:** Move info tag back to `invitable` (#9020) ([f3fe3ce](https://github.com/discordjs/discord.js/commit/f3fe3ced622676b406a62b43f085aedde7a621aa))
- Fix a typo in the MentionableSelectMenuInteraction link (#9000) ([6d7a143](https://github.com/discordjs/discord.js/commit/6d7a143667f33ef2ea45d8016ac4738237707881))
- **ApplicationRoleConnectionMetadata:** Add documentation (#8976) ([2e22b31](https://github.com/discordjs/discord.js/commit/2e22b31892d9b858fcb24fa580b486b4154e823f))
- Fix malformed overridden documentation (#8954) ([0b8b114](https://github.com/discordjs/discord.js/commit/0b8b114761f961a2bf8e5aae342ed711b154a89e))
- **GuildForumThreadManager:** Fix `sticker` type (#8940) ([dd62be0](https://github.com/discordjs/discord.js/commit/dd62be077d3e4fbd73a0c10ca344d93d3d19fa38))
- Fix deprecated links (#8907) ([976b234](https://github.com/discordjs/discord.js/commit/976b234e9dc9999e5dee47b58c85afbc1cd494c2))
- **UserFlagsBitField:** Make `.Flags` static (#8902) ([c48ff5e](https://github.com/discordjs/discord.js/commit/c48ff5e4205899e3b6cd35812ca857236bef6864))

## Features

- **Collector:** Add lastCollectedTimestamp (#9044) ([4458a13](https://github.com/discordjs/discord.js/commit/4458a13925164762b519ded1037ae8775d879f71))
- **StageChannel:** Add messages (#9134) ([ffdb197](https://github.com/discordjs/discord.js/commit/ffdb197f988657100e2a9ff0ca17b759339a1dda))
- **AutoModerationActionExecution:** Add `channel`, `user` and `member` getters (#9142) ([095bd77](https://github.com/discordjs/discord.js/commit/095bd77515aa31bb0e95a350b4355980fea9268d))
- **AutoModeration:** Support `custom_message` (#9171) ([c1000b8](https://github.com/discordjs/discord.js/commit/c1000b86ed6d5413afcd6ee7e80505e5a845430b))
- **ThreadMemberManager:** Support pagination fetching (#9035) ([765d5a3](https://github.com/discordjs/discord.js/commit/765d5a3b2d5529c3a2a4b29512f6932264443ed1))
- **InteractionResponse:** Add new methods (#9132) ([dc9924f](https://github.com/discordjs/discord.js/commit/dc9924fb5f24c8dac963d6b86ba279a89545e73b))
- **GuildMember:** Add `flags` (#9087) ([76b2116](https://github.com/discordjs/discord.js/commit/76b21162aca7cd4897826437da3063524e1e7553))
- **Client:** `guildAuditLogEntryCreate` event (#9058) ([9439107](https://github.com/discordjs/discord.js/commit/9439107a1d6a9b77b5f991973d96bc6100da4753))
- Add role subscription data (#9025) ([1ba22f4](https://github.com/discordjs/discord.js/commit/1ba22f4c9e4173f8866339d3eadb2939d4b32034))
- **Sticker:** Add support for gif stickers (#9038) ([6a9875d](https://github.com/discordjs/discord.js/commit/6a9875da054a875a4711394547d47439bbe66fb6))
- **GuildAuditLogs:** Support `after` (#9011) ([0076589](https://github.com/discordjs/discord.js/commit/0076589ccc93e09d77a448874d1ceff5d0e91aa2))
- Add role subscriptions (#8915) ([3407e1e](https://github.com/discordjs/discord.js/commit/3407e1eea3c8d5629465553f342ac30ceae27a47))
- Add `not_found` to guild member chunk data (#8975) ([be294ea](https://github.com/discordjs/discord.js/commit/be294eaf9901ea139ce485deeec9178959ffa91f))
- **ClientApplication:** Add role connections (#8855) ([22e2bbb](https://github.com/discordjs/discord.js/commit/22e2bbb0d24e3f30516f262308d5786f2f666713))
- **CommandInteractionOptionResolver:** Add `channelTypes` option to `getChannel` (#8934) ([429dbcc](https://github.com/discordjs/discord.js/commit/429dbccc85cabd9986b2e8bf443bf384e4ddc61a))
- **ForumChannel:** Add `defaultForumLayout` (#8895) ([cbafd47](https://github.com/discordjs/discord.js/commit/cbafd479b331633ed97f7b1a22ef03c6a2f4cf31))
- Add support for nsfw commands (#7976) ([7a51344](https://github.com/discordjs/discord.js/commit/7a5134459c5f06864bf74631d83b96d9c21b72d8))
- **InteractionResponse:** CreatedTimestamp (#8917) ([627511d](https://github.com/discordjs/discord.js/commit/627511d6522f772b84c25e6a3f6da06b06bb912e))
- **Guild:** Add disableInvites method (#8801) ([45faa19](https://github.com/discordjs/discord.js/commit/45faa199820e7c4ccdb2997c7e3b353f566d2312))

## Refactor

- Compare with `undefined` directly (#9191) ([869153c](https://github.com/discordjs/discord.js/commit/869153c3fdf155783e7c0ecebd3627b087c3a026))
- **GuildMemberManager:** Tidy up fetching guild members (#8972) ([4e0e125](https://github.com/discordjs/discord.js/commit/4e0e1250399aa12c340ac92a86ec2c05704fe2bb))
- **BitField:** Reverse iterator/toArray responsibilities (#9118) ([f70df91](https://github.com/discordjs/discord.js/commit/f70df910ed12e397066d0bdb27343af21ead4d92))
- Moved the escapeX functions from discord.js to @discord.js/formatters (#8957) ([13ce78a](https://github.com/discordjs/discord.js/commit/13ce78af6e3aedc793f53a099a6a615df44311f7))
- Use `deprecate()` directly (#9026) ([1c871b5](https://github.com/discordjs/discord.js/commit/1c871b5b576dddef12c5afacecf416dbd6243dea))
- **Guild:** Destructure object in guild editing (#8971) ([d3e9f2a](https://github.com/discordjs/discord.js/commit/d3e9f2a355a1f5272d62a507eb6ecd8808904fff))
- **GuildManager:** Better handling of creation code (#8974) ([d7a09f6](https://github.com/discordjs/discord.js/commit/d7a09f6fcee30c31b4418166bf7bf9e894841f87))
- **sharding:** Use switch statement (#8928) ([6540914](https://github.com/discordjs/discord.js/commit/6540914b4a7f244f5e40fe2a3b7e73986763d81b))
- Use consistent naming for options (#8901) ([a7b55c1](https://github.com/discordjs/discord.js/commit/a7b55c1460cf63fb482f7d05657120eec96bee82))
- **CommandInteractionOptionResolver:** Loosen mentionable checks (#8910) ([1b151db](https://github.com/discordjs/discord.js/commit/1b151db59c4340417f8a28a88064f45336ac8c78))

## Styling

- Run prettier (#9041) ([2798ba1](https://github.com/discordjs/discord.js/commit/2798ba1eb3d734f0cf2eeccd2e16cfba6804873b))

## Typings

- Allow sending messages with `SuppressNotifications` flag (#9177) ([71a427f](https://github.com/discordjs/discord.js/commit/71a427f6322be76fe2d1cb265de09f171b1b354a))
- Remove `EscapeMarkdownOptions` (#9153) ([fd0246c](https://github.com/discordjs/discord.js/commit/fd0246ca4c75e60d8e117d9ac5af7067c7a63277))
- **Attachment:** Make `attachment` private (#8982) ([da23cd5](https://github.com/discordjs/discord.js/commit/da23cd5d69de4856d075f00738f75c68c555ae5b))
- Fix type of Attachment#name (#9101) ([4e0a89f](https://github.com/discordjs/discord.js/commit/4e0a89f58f43f362bfde80d8319dce767c62850f))
- Allow builders to set channel types in discord.js (#8990) ([7dec892](https://github.com/discordjs/discord.js/commit/7dec892218f7b470a5f8e78732a524a53da24d26))
- Swap message reaction and emoji identifier types (#8969) ([ad49845](https://github.com/discordjs/discord.js/commit/ad4984526020f2baeefaeeebbded66c6848c4b85))
- **widget:** Add missing `name` (#8978) ([898b5ac](https://github.com/discordjs/discord.js/commit/898b5ac416cbbb415b125bb27221d0901fdd180e))
- Use StringSelectMenuOptionBuilder (#8949) ([bec51de](https://github.com/discordjs/discord.js/commit/bec51de1038c35c6edaaa13934781758fe1951de))
- Fix actions type in automod (#8962) ([5915f39](https://github.com/discordjs/discord.js/commit/5915f39810b712c05a46fa21ab4e12b4cfa3c25a))
- Subcommand group `options` is required (#8966) ([5dc5e90](https://github.com/discordjs/discord.js/commit/5dc5e902688fc563087cd5061dcb59dd68fd4eda))
- Add generic to `ActionRowBuilder.from()` (#8414) ([153352a](https://github.com/discordjs/discord.js/commit/153352ad7a1ccb4a9461523cf2597d81df93b69c))

# [14.7.1](https://github.com/discordjs/discord.js/compare/14.7.0...14.7.1) - (2022-12-01)

## Bug Fixes

- Prevent crash on no select menu option (#8881) ([11d195d](https://github.com/discordjs/discord.js/commit/11d195d04ff57d51adb0f0d3a0a7342f9e34aba0))

# [14.7.0](https://github.com/discordjs/discord.js/compare/14.6.0...14.7.0) - (2022-11-28)

## Bug Fixes

- **MessageMentions:** Add `InGuild` generic (#8828) ([f982803](https://github.com/discordjs/discord.js/commit/f9828034cd21e6f702762a46923e0f42115596f6))
- **Activity:** Fix equals() not checking for differing emoji (#8841) ([7e06f68](https://github.com/discordjs/discord.js/commit/7e06f68185423ba7cb310220b213f445b6571e29))
- Fixed react/astro/guide/discord.js build, updated dependencies, fix crawlvatar (#8861) ([d0c8256](https://github.com/discordjs/discord.js/commit/d0c82561b8a1765a1daa362ca903f3ffb3fa33ee))
- **escapeMarkdown:** Fix double escaping (#8798) ([d6873b7](https://github.com/discordjs/discord.js/commit/d6873b7159352479475b3a0daa215bddbdd3a79b))
- **Transfomers:** Call `.toJSON` in `toSnakeCase` (#8790) ([017f9b1](https://github.com/discordjs/discord.js/commit/017f9b1ed4014dc1db0b78c1a77e463b4403de5d))
- Censor token in debug output (#8764) ([53d8e87](https://github.com/discordjs/discord.js/commit/53d8e87d7f3a329608250656950bd0a200adb1c7))
- Pin @types/node version ([9d8179c](https://github.com/discordjs/discord.js/commit/9d8179c6a78e1c7f9976f852804055964d5385d4))

## Documentation

- Describe InteractionEditReplyOptions (#8840) ([cb77fd0](https://github.com/discordjs/discord.js/commit/cb77fd02d083438de2aff6f0769baf7d1797bc65))
- **AutoModerationRuleManager:** Describe cache (#8848) ([d275480](https://github.com/discordjs/discord.js/commit/d2754802cc3479e6288cdbfcd48c76bf57e09a07))
- Fix message action row components (#8819) ([65bc0ad](https://github.com/discordjs/discord.js/commit/65bc0adbf4d7870d33b92585ca18f964f24bc84e))
- Specify `ActionRowBuilder` for `components` (#8834) ([8ed5c1b](https://github.com/discordjs/discord.js/commit/8ed5c1beb622f71ce0bd89e4cbeff50e464da8fe))
- Add `@extends` for select menu classes (#8824) ([09f65b7](https://github.com/discordjs/discord.js/commit/09f65b724b0d2f36bbe89b83570c0d18093b5126))
- Make WebSocketShard.lastPingTimestamp public (#8768) ([68c9cb3](https://github.com/discordjs/discord.js/commit/68c9cb37bc3df6326b720291827ea477e421faf2))
- **MessageReplyOptions:** Remove duplicate stickers field (#8766) ([6e348ff](https://github.com/discordjs/discord.js/commit/6e348ffd1d8db8d8ad2da7823460814695e01a43))

## Features

- **Webhook:** Add `channel` property (#8812) ([decbce4](https://github.com/discordjs/discord.js/commit/decbce401062af75f633e6acacc88207b115a719))
- Auto Moderation (#7938) ([fd4ba5e](https://github.com/discordjs/discord.js/commit/fd4ba5eaba66898699127fc0d5f0ab52c18e3db0))
- **SelectMenuInteractions:** Add `values` property (#8805) ([b2fabd1](https://github.com/discordjs/discord.js/commit/b2fabd130a76ea54cfbfa1b871ef8659513c2c7a))
- **ThreadChannel:** Add a helper for pin and unpin (#8786) ([e74aa7f](https://github.com/discordjs/discord.js/commit/e74aa7f6b0fe04e3473fc4a62a73a7db87307685))
- Add `Message#bulkDeletable` (#8760) ([ff85481](https://github.com/discordjs/discord.js/commit/ff85481d3e7cd6f7c5e38edbe43b27b104e82fba))
- New select menus (#8793) ([5152abf](https://github.com/discordjs/discord.js/commit/5152abf7285581abf7689e9050fdc56c4abb1e2b))
- **InteractionResponses:** Add message parameter (#8773) ([8b400ca](https://github.com/discordjs/discord.js/commit/8b400ca975c6bad00060b9c67068f42bd53524ba))
- Support resume urls (#8784) ([88cd9d9](https://github.com/discordjs/discord.js/commit/88cd9d906074eb79e85df0ef49287f11133d2e0d))
- Allow deletion of ephemeral messages (#8774) ([fc10774](https://github.com/discordjs/discord.js/commit/fc107744618857bf28c2167f204253baf690ede8))
- **GuildChannelManager:** Add `.addFollower()` method (#8567) ([caeb1cb](https://github.com/discordjs/discord.js/commit/caeb1cbfdb2f2f007252c4d7e9f47a575c24bcb5))

## Refactor

- **Embed:** Use `embedLength` function from builders (#8735) ([cb3826c](https://github.com/discordjs/discord.js/commit/cb3826ce6dbcd3cf7ab639af6cdfcea80336aa1d))

# [14.6.0](https://github.com/discordjs/discord.js/compare/14.5.0...14.6.0) - (2022-10-10)

## Bug Fixes

- **ClientOptions:** Make `ClientOptions#intents` returns an IntentsBitField (#8617) ([4c2955a](https://github.com/discordjs/discord.js/commit/4c2955a5de6779c29c09e63ba9ad2b235904f842))
- Correctly construct a builder (#8727) ([e548e6a](https://github.com/discordjs/discord.js/commit/e548e6a10b7e1720f5e8f3c859b0b64d5134a012))
- **Components:** Error with unknown components (#8724) ([6fd331d](https://github.com/discordjs/discord.js/commit/6fd331dd528e78fd023c908bd58af3faa9ed6c65))
- **Client:** Don't auth for webhook fetches with token (#8709) ([01d75c8](https://github.com/discordjs/discord.js/commit/01d75c8b8b14f33c95a4da83a8494db848beeb8c))
- Re-export util (#8699) ([a306219](https://github.com/discordjs/discord.js/commit/a306219673335584accd2ff77ab34d2812ef6c5d))
- Throw discord.js errors correctly (#8697) ([ace974f](https://github.com/discordjs/discord.js/commit/ace974fc1fdbc5bcaa0d7f6f6d17de185c9f9cbf))

## Documentation

- **Utils:** Remove `private` from `parseEmoji` (#8718) ([a31e605](https://github.com/discordjs/discord.js/commit/a31e605e09064a300e31a3c91466b613654ba98e))
- Update UserContextMenuCommandInteraction documentation (#8717) ([7556db2](https://github.com/discordjs/discord.js/commit/7556db243d9480949835668fcb5724fdd5d70e08))
- Fix `AwaitMessageComponentOptions` typedef (#8696) ([9effd82](https://github.com/discordjs/discord.js/commit/9effd82abe82ba71ae627673da21ba07e1ede23e))

## Features

- **Util:** Escape more markdown characters (#8701) ([7b8966b](https://github.com/discordjs/discord.js/commit/7b8966bca156db79933403289741893a6e10ccd5))
- **GuildChannelManager:** Allow creating channels with a default auto archive duration (#8693) ([628759b](https://github.com/discordjs/discord.js/commit/628759bcff8b0d4c77926cee2b8c18d8fdb4c260))
- Add `@discordjs/util` (#8591) ([b2ec865](https://github.com/discordjs/discord.js/commit/b2ec865765bf94181473864a627fb63ea8173fd3))
- **ForumChannel:** Add `defaultSortOrder` (#8633) ([883f6e9](https://github.com/discordjs/discord.js/commit/883f6e9202a559c986f4b15fccb422b5aea7bea8))

## Refactor

- Rename Error to DiscordjsError internally (#8706) ([aec44a0](https://github.com/discordjs/discord.js/commit/aec44a0c93f620b22242f35e626d817e831fc8cb))

## Typings

- Fix events augmentation (#8681) ([ac83ada](https://github.com/discordjs/discord.js/commit/ac83ada306ec153c13260d2bd53e4d704884b68a))
- **Message:** Remove `& this` from `#inGuild` typeguard (#8704) ([c0f7a1a](https://github.com/discordjs/discord.js/commit/c0f7a1a89a4cf62edc7065bd200b2ce4018e0a27))
- **ModalBuilder:** Fix constructor typings (#8690) ([2ea2a85](https://github.com/discordjs/discord.js/commit/2ea2a85e6335d57f44689f9b6e284129104de8fc))

# [14.5.0](https://github.com/discordjs/discord.js/compare/14.4.0...14.5.0) - (2022-09-25)

## Bug Fixes

- **ThreadChannel:** Add forum channel to parent (#8664) ([0126d9b](https://github.com/discordjs/discord.js/commit/0126d9b810a156c4bf1b8b93f2121f3319855bac))
- **GuildChannelManager:** Allow creating webhooks on forums (#8661) ([16fcdc3](https://github.com/discordjs/discord.js/commit/16fcdc36877d1a65ce9995c9fe3502aa268c9388))
- **ForumChannel:** Implement missing properties and methods (#8662) ([8622939](https://github.com/discordjs/discord.js/commit/862293922924f453f69b0b0f8efe87ddebbd387d))
- RepliableInteraction respect cached generic (#8667) ([578bc95](https://github.com/discordjs/discord.js/commit/578bc951bdcdc21ec5aee86e7a47a17e8c867dfc))
- **ThreadChannel:** Allow editing flags (#8671) ([1244854](https://github.com/discordjs/discord.js/commit/1244854e1365d7e4a8d01703a7ec13610ed100c7))
- **GuildChannelManager:** Typo in `flags` property name when editing (#8669) ([fc8ed81](https://github.com/discordjs/discord.js/commit/fc8ed816e643754a938211a17b41a2cec95df265))

## Documentation

- Fix duplicate typedefs (#8677) ([d79aa2d](https://github.com/discordjs/discord.js/commit/d79aa2d0d0b186bd28cbfc82f3d6ecf3deb41c50))
- **ForumChannel:** Add `@implements` (#8678) ([8ca407e](https://github.com/discordjs/discord.js/commit/8ca407e089c3050b61a51a52b9100e4613ad1666))

## Features

- **GuildChannelManager:** Allow editing `flags` (#8637) ([abb7226](https://github.com/discordjs/discord.js/commit/abb7226af3445f5b724815bb2f7a121a52a563b5))

## Refactor

- **GuildBanManager:** Add deprecation warning for `deleteMessageDays` (#8659) ([e993122](https://github.com/discordjs/discord.js/commit/e9931229ae62a120ae0761ee2a2c10ea0cb1a6fb))

## Typings

- **GuildChannelManager:** Handle forum channel overload (#8660) ([1486bc9](https://github.com/discordjs/discord.js/commit/1486bc9336369d229972df5e28b9428365b92bff))
- **Caches:** Allow `GuildForumThreadManager` and `GuildTextThreadManager` (#8665) ([2487e3b](https://github.com/discordjs/discord.js/commit/2487e3bf76260a4a2fbf375e0b01a43f347922a3))

# [14.4.0](https://github.com/discordjs/discord.js/compare/14.3.0...14.4.0) - (2022-09-21)

## Bug Fixes

- Correct applied tags type (#8641) ([f6f15d8](https://github.com/discordjs/discord.js/commit/f6f15d8e877d4ffbe908a093e64809ef9015e0ff))
- **ThreadChannel:** Make `fetchStarterMessage()` work in forum posts (#8638) ([a7f816e](https://github.com/discordjs/discord.js/commit/a7f816eeb7fa1e193cf0901efbdcaf629f72465f))
- Update `messageCount`/`totalMessageSent` on message events (#8635) ([145eb2f](https://github.com/discordjs/discord.js/commit/145eb2fc5db5ca739aa9782d5ec5210f81a6aeeb))
- Footer / sidebar / deprecation alert ([ba3e0ed](https://github.com/discordjs/discord.js/commit/ba3e0ed348258fe8e51eefb4aa7379a1230616a9))

## Documentation

- Correctly overwrite `setRTCRegion` method (#8642) ([f049734](https://github.com/discordjs/discord.js/commit/f0497343f1193635b260b9e2085cac7b43991f74))
- **GuildTextThreadManager:** Document correct `@extend` (#8639) ([802b239](https://github.com/discordjs/discord.js/commit/802b2394b08151faab6810695fd5c8f27ce84d58))
- Fix regexps incorrectly being called global (#8624) ([fc9653f](https://github.com/discordjs/discord.js/commit/fc9653f5aea4013da15fb8de0a4452400eaa7739))
- Update misleading `Client#guildMemberAvailable` event description (#8626) ([22ac6b4](https://github.com/discordjs/discord.js/commit/22ac6b4660db6b02f62b9851e9e3bcfe5fb506b5))
- **Options:** Update DefaultMakeCacheSettings (#8585) ([3252332](https://github.com/discordjs/discord.js/commit/32523325c6610e95fe3ffcc31d005b3418c6bc68))
- Change name (#8604) ([dd5a089](https://github.com/discordjs/discord.js/commit/dd5a08944c258a847fc4377f1d5e953264ab47d0))

## Features

- **Widget:** Allow forum channels (#8645) ([b106956](https://github.com/discordjs/discord.js/commit/b1069563086fc616fe21abb789f28f69e57c8851))
- **WelcomeChannel:** Add forum channel as a type (#8643) ([6f1f465](https://github.com/discordjs/discord.js/commit/6f1f465a77e362e20ec50067be0e634d35946ba5))
- Allow forum channels in webhook update event (#8646) ([5048a3d](https://github.com/discordjs/discord.js/commit/5048a3d17ace22336e74451d30b513b3db42a26f))
- Add support for guild forums (#7791) ([8a8d519](https://github.com/discordjs/discord.js/commit/8a8d519c9c4c082370fc6935b56dafb525b873df))
- **GuildBanManager#create:** Add `deleteMessageSeconds` (#8326) ([03fb5b0](https://github.com/discordjs/discord.js/commit/03fb5b0a2f45275dec7885175ad691a1d9c449c4))
- Add typeguard to BaseInteraction#isRepliable (#8565) ([55c3ee2](https://github.com/discordjs/discord.js/commit/55c3ee20ae700e78d18a3c4c04b6a7426cffc060))
- **Integration:** Add `scopes` (#8483) ([8b3d006](https://github.com/discordjs/discord.js/commit/8b3d0061180cfd5d9ba8beae3e8d623b5ce43ea4))
- Add `chatInputApplicationCommandMention` formatter (#8546) ([d08a57c](https://github.com/discordjs/discord.js/commit/d08a57cadd9d69a734077cc1902d931ab10336db))

## Refactor

- Replace usage of deprecated `ChannelType`s (#8625) ([669c3cd](https://github.com/discordjs/discord.js/commit/669c3cd2566eac68ef38ab522dd6378ba761e8b3))
- Split message send/edit types/documentation (#8590) ([8e1afae](https://github.com/discordjs/discord.js/commit/8e1afaebdb686033555ca58e53f34bb97f7369c8))
- Website components (#8600) ([c334157](https://github.com/discordjs/discord.js/commit/c3341570d983aea9ecc419979d5a01de658c9d67))

## Typings

- Narrow channel type in thread managers (#8640) ([14bbc91](https://github.com/discordjs/discord.js/commit/14bbc9150a748e7ac1660c2375c7f065fcc55a6c))
- **interactions:** Pass `Cached` type to return type of methods (#8619) ([053da5b](https://github.com/discordjs/discord.js/commit/053da5bc91d5cfa8d842b13b0b05083d2f7f086d))
- Ensure events possess `Client<true>` (#8612) ([a9f003a](https://github.com/discordjs/discord.js/commit/a9f003ac9b56d31166cbf353d02140dad0b2517e))
- **GuildChannelManager:** Correct `fetch` return type (#8549) ([1d4cdee](https://github.com/discordjs/discord.js/commit/1d4cdee321ab25bb0f109d55a000582825dd79f9))
- **ThreadChannel:** `fetchStarterMessage` must return a `Message<true>` (#8560) ([b9c62ac](https://github.com/discordjs/discord.js/commit/b9c62ac0f0f534c33f9913135095f8b3d98ec05e))
- **webhook:** Avatar can be null (#8541) ([f77612a](https://github.com/discordjs/discord.js/commit/f77612a55e9c593a21bc27e58c9fbd03d85787e3))

# [14.3.0](https://github.com/discordjs/discord.js/compare/14.2.0...14.3.0) - (2022-08-22)

## Bug Fixes

- **GuildMemberManager:** `add()` method throws an error (#8539) ([3bef901](https://github.com/discordjs/discord.js/commit/3bef9018c0be3c5dc51d03b796d08b925dc4e1b9))
- **Guild:** Widget channel types and fixes (#8530) ([23a0b6c](https://github.com/discordjs/discord.js/commit/23a0b6ccf27410963bd4f5c53d9ee2ce019e90a8))
- **Embed:** Reference video in video (#8473) ([c97977a](https://github.com/discordjs/discord.js/commit/c97977a3e806bd5d8682bc7fb22ebec1a8ceecdc))

## Documentation

- **GuildAuditLogsEntry:** Correct `action` wording (#8499) ([7d25072](https://github.com/discordjs/discord.js/commit/7d2507279cc9d1397c7d61e7c7b856ff4bc17c86))

## Features

- **GuildMemberManager:** AddRole and removeRole (#8510) ([cda3f00](https://github.com/discordjs/discord.js/commit/cda3f005b1546fdb8410e9550526956f840857fc))
- Deprecate `ActionRow.from()` (#8504) ([f9c25dd](https://github.com/discordjs/discord.js/commit/f9c25ddcfe68f089e13f1090c3df4bd7cd74d2b7))
- **WebSocketShard:** Support new resume url (#8480) ([bc06cc6](https://github.com/discordjs/discord.js/commit/bc06cc638d2f57ab5c600e8cdb6afc8eb2180166))

## Refactor

- **GuildAuditLogsEntry:** Remove `guild` from application command permission update extra (#8520) ([2b8074d](https://github.com/discordjs/discord.js/commit/2b8074dd12f2f1e957caffb57e5fd4d7be88dc25))

## Typings

- Inference of guild in `MessageManager` (#8538) ([6bb1474](https://github.com/discordjs/discord.js/commit/6bb1474d2001b76773954c959b2c2687e1df0136))
- Allow choice's value type to be strictly inferred (#8529) ([b3f7c32](https://github.com/discordjs/discord.js/commit/b3f7c32f7f91f12766178f5e17585856e81d9a87))
- **GuildAuditLogs:** Allow fetching to return all possible values (#8522) ([0dba8ad](https://github.com/discordjs/discord.js/commit/0dba8adbd2e6efd634bd3eb31df09467ba8a8a0d))
- Correct `EventEmitter.on (static)` return type (#8524) ([16bbc8a](https://github.com/discordjs/discord.js/commit/16bbc8aa208a8a16c22be24696f57d5f7a5faf2b))
- **GuildAuditLogs:** Remove static `Entry` (#8521) ([7a3d18d](https://github.com/discordjs/discord.js/commit/7a3d18dd6d1fe27393d00019b9ecd35c98b95ee7))
- Disallow some channel types from webhook creation (#8531) ([4882b17](https://github.com/discordjs/discord.js/commit/4882b17a77484f801faa19fb971f2e6abd88e59f))
- Implement max/min values for autocomplete (#8498) ([812f7f1](https://github.com/discordjs/discord.js/commit/812f7f1ea86fc953aa796875cbc7ccc434203d77))
- **ModalMessageModalSubmitInteraction:** ChannelId is not nullable (#8496) ([c31a5cf](https://github.com/discordjs/discord.js/commit/c31a5cfcc82706667768eac77b5f99ba69cf3c91))
- Change type of ApplicationCommandSubCommand.options (#8476) ([ebaf158](https://github.com/discordjs/discord.js/commit/ebaf158006d3c7db3b8c695e7c027b8af11999ba))

# [14.2.0](https://github.com/discordjs/discord.js/compare/14.1.2...14.2.0) - (2022-08-10)

## Bug Fixes

- **ThreadChannel:** Handle possibly `null` parent (#8466) ([afa27b1](https://github.com/discordjs/discord.js/commit/afa27b15c5b92bc8d55b8285834d8e03f6692d06))
- Remove DM channels from `Client#messageDeleteBulk`'s types (#8460) ([6c6fe74](https://github.com/discordjs/discord.js/commit/6c6fe74dd84859c5319efa999404e8168f189710))
- **Transformers:** Do not transform `Date` objects (#8463) ([0e2a095](https://github.com/discordjs/discord.js/commit/0e2a09571c8e5ee61153b04e45334a226a1b4534))
- **ModalSubmitInteraction:** Allow deferUpdate (#8455) ([0fab869](https://github.com/discordjs/discord.js/commit/0fab869e5179dca7ddec75b5519615278e51ad82))
- **Guild:** Unable to fetch templates (#8420) ([aac8acc](https://github.com/discordjs/discord.js/commit/aac8acc22be7d7af99933ef099eca7deda43cb40))
- **MessageMentions:** Infinite loop in `parsedUsers` getter (#8430) ([b8a3136](https://github.com/discordjs/discord.js/commit/b8a31360a220e3d796f5381bd215d30a379ecb7c))
- **DataResolver:** Make `Buffer` from string (#8416) ([e72b986](https://github.com/discordjs/discord.js/commit/e72b986939e2958547c0e54d6d27472c8d111609))

## Documentation

- Change registration example to use global commands (#8454) ([64a4041](https://github.com/discordjs/discord.js/commit/64a4041a05e9514334a9f9e1f38a1ea18bb676d5))
- **Colors:** Provide enum descriptions (#8437) ([6ef4754](https://github.com/discordjs/discord.js/commit/6ef4754d40c5ec65715fc1e00e643c52fe0a6209))
- **AttachmentBuilder:** Fix #8407 (#8421) ([5b053cf](https://github.com/discordjs/discord.js/commit/5b053cf82ec2f2b717a490485af052dc956fe3c9))

## Features

- **Guild:** Add `max_video_channel_users` (#8423) ([3a96ce7](https://github.com/discordjs/discord.js/commit/3a96ce7970947f6268c21a1323d986aac8cb736d))

## Typings

- **Message:** Correct `bulkDelete` return type (#8465) ([c5b96a1](https://github.com/discordjs/discord.js/commit/c5b96a185cb8ba836b7cd10526c14059866f218f))
- Fix missing types for mentionable options (#8443) ([452e94f](https://github.com/discordjs/discord.js/commit/452e94fd3ecc12de9e3408982c5c7fd931bae634))
- **ApplicationCommandOption:** Add `ApplicationCommandBooleanOption` (#8434) ([38275fc](https://github.com/discordjs/discord.js/commit/38275fc53d633ce77ed2b142aff788dcbd4fad8c))

# [14.1.2](https://github.com/discordjs/discord.js/compare/14.1.1...14.1.2) - (2022-07-30)

## Bug Fixes

- **errors:** Error codes (#8398) ([480c85c](https://github.com/discordjs/discord.js/commit/480c85c9c3d129204b3399ed726a4e570e0b2852))

## Documentation

- **Embed:** Ensure height and width are numbers (#8396) ([fca3dad](https://github.com/discordjs/discord.js/commit/fca3dada2a565eecfc7e5275cc9317df1d261871))

# [14.1.0](https://github.com/discordjs/discord.js/compare/14.0.3...14.1.0) - (2022-07-29)

## Bug Fixes

- **MessageMentions:** `ignoreRepliedUser` option in `has()` (#8202) ([b4e2c0c](https://github.com/discordjs/discord.js/commit/b4e2c0c4d5538b945f9d597c6410a6f84b315084))
- **GuildChannelManager:** Allow unsetting rtcRegion (#8359) ([a7d49e5](https://github.com/discordjs/discord.js/commit/a7d49e56fc7c34d2e4548d9e5bf0aec45273506e))
- **ThreadChannel:** Omit webhook fetching (#8351) ([3839958](https://github.com/discordjs/discord.js/commit/3839958e3f682c715f1017da05436d2fe34900fd))
- **GuildAuditLogsEntry:** Replace OverwriteType with AuditLogOptionsType (#8345) ([58c1b51](https://github.com/discordjs/discord.js/commit/58c1b51c5ceab137ad9851919b338419eeeab69e))
- **ShardClientUtil#\_respond:** Construct global error (#8348) ([8e520f9](https://github.com/discordjs/discord.js/commit/8e520f946a5b9f93a939290facf4ccca2c05ff21))
- **Presence:** Do not return NaN for activity timestamp (#8340) ([df42fdf](https://github.com/discordjs/discord.js/commit/df42fdfc421f1190f0a2267a66efd3c921ec2348))
- **Client:** Omit private properties from toJSON (#8337) ([830c670](https://github.com/discordjs/discord.js/commit/830c670c61dcb17d8ab2a894a3203c68917d27e0))
- **ApplicationCommandManager:** Allow passing 0n to defaultMemberPermissions (#8311) ([1fb7b30](https://github.com/discordjs/discord.js/commit/1fb7b30963cfe7ea4c05b1f3b42171c879c46a1d))

## Documentation

- **InteractionResponses:** Add `showModal()` return type (#8376) ([0b61dbf](https://github.com/discordjs/discord.js/commit/0b61dbf720e844322b066e30080c3537ab3d8174))
- **WebhookClient:** Document working options (#8375) ([ba6797e](https://github.com/discordjs/discord.js/commit/ba6797e74209161b64c412de1b6f307cb28736b8))
- **Message:** Document gateway intent for content (#8364) ([2130aae](https://github.com/discordjs/discord.js/commit/2130aae3210a8eaf91c5ccae5463940d49052c7d))
- Use info blocks for requirements (#8361) ([80b9738](https://github.com/discordjs/discord.js/commit/80b9738957ebf5b6eb7c9858cec0fb1c897d0a1f))
- **WebhookClient:** Make constructor a union (#8370) ([e9920a9](https://github.com/discordjs/discord.js/commit/e9920a9c98ffb78bd7d0ae00d486476367296646))
- Update docs and examples to PascalCase links (#8305) ([34ba9d1](https://github.com/discordjs/discord.js/commit/34ba9d1c4c80eff7e6ac199a40232d07491432cc))

## Features

- Add channel & message URL formatters (#8371) ([a7deb8f](https://github.com/discordjs/discord.js/commit/a7deb8f89830ead6185c5fb46a49688b6d209ed1))
- Restore missing typeguards (#8328) ([77ed407](https://github.com/discordjs/discord.js/commit/77ed407f6aadb68e729470c5269e9b526cb1b3f0))
- **GuildMember:** Add dmChannel getter (#8281) ([4fc2c60](https://github.com/discordjs/discord.js/commit/4fc2c60a3bb43671b4b0202ae75eab42aba163ff))

## Refactor

- Deprecate `Formatter` class (#8373) ([7fd9ed8](https://github.com/discordjs/discord.js/commit/7fd9ed8f13d17ce7e98e34f7454d9047054d8467))
- **PermissionOverwriteManager:** Use `OverwriteType` (#8374) ([6d24805](https://github.com/discordjs/discord.js/commit/6d248051cfd431e9cb1c65cb98f56aa0a6556407))

## Typings

- **GuildAuditLogsEntryExtraField:** Use `AuditLogOptionsType` (#8349) ([200ab91](https://github.com/discordjs/discord.js/commit/200ab91f527d8a5706d277b89a975096f75d141a))

# [14.0.3](https://github.com/discordjs/discord.js/compare/14.0.2...14.0.3) - (2022-07-19)

## Bug Fixes

- **Components:** Support emoji id strings (#8310) ([660e212](https://github.com/discordjs/discord.js/commit/660e212e83df026c684ee2cda7fb4e98870f342e))

# [14.0.2](https://github.com/discordjs/discord.js/compare/14.0.1...14.0.2) - (2022-07-18)

## Bug Fixes

- **DataResolver#resolveImage:** Adjust to updated resolveFile (#8308) ([3a7e93d](https://github.com/discordjs/discord.js/commit/3a7e93df576172c797f1d8bd6483234bb6af2d00))

# [14.0.0](https://github.com/discordjs/discord.js/compare/13.12.0...14.0.0) - (2022-07-17)

## Bug Fixes

- **GuildMemberManager:** Allow setting own nickname (#8066) ([52a9e21](https://github.com/discordjs/discord.js/commit/52a9e213c2dc13ee52ee0234593fdce392f43890))
- **PermissionOverwriteManager:** Mutates user (#8283) ([3bf30b1](https://github.com/discordjs/discord.js/commit/3bf30b1e6d2d6f583f7069a1e24e7842d59fab2f))
- **GuildChannelManager:** Access `resolveId` correctly (#8296) ([3648f6d](https://github.com/discordjs/discord.js/commit/3648f6d567cd834c301de913ce19f786a265240d))
- **GuildChannelManager:** Edit lockPermissions (#8269) ([7876548](https://github.com/discordjs/discord.js/commit/787654816d2b6a5168d199d32cdaeb4ef6d270b9))
- **`SelectMenuBuilder`:** Properly accept `SelectMenuOptionBuilder`s (#8174) ([31d5930](https://github.com/discordjs/discord.js/commit/31d593046466438c55f5784b0f2098e233c5edc4))
- Remove global flag on regular expressions (#8177) ([cdd9214](https://github.com/discordjs/discord.js/commit/cdd9214212892e30b3eaa161837c37516c5bcaa0))
- **MessagePayload:** Guard against `repliedUser` property (#8211) ([fa010b5](https://github.com/discordjs/discord.js/commit/fa010b516254c4ab2762278817f31bf289f0ab6a))
- **ApplicationCommandManager:** Explicitly allow passing builders to methods (#8209) ([50d55bd](https://github.com/discordjs/discord.js/commit/50d55bd6b819307c86701f4808c087f359c6ccff))
- **GuildMemberRemove:** Remove member's presence (#8181) ([11b1739](https://github.com/discordjs/discord.js/commit/11b173931968c548f8504649ae7090865892e62d))
- Edit() data can be partial and `defaultMemberPermissions` can be `null` (#8163) ([0ffbef5](https://github.com/discordjs/discord.js/commit/0ffbef506a97a0bf22cb134fc007c2aec29cbffc))
- **WebSocketShard:** Keep an error handler on connections (#8150) ([c34c02a](https://github.com/discordjs/discord.js/commit/c34c02ab8d119bf16d8d14d125a9b650b4bb18f4))
- **DJSError:** Error code validation (#8149) ([31f6582](https://github.com/discordjs/discord.js/commit/31f658247fe0e1047897edab629643d140e77e07))
- **vcs:** Nsfw property (#8132) ([2eeaad6](https://github.com/discordjs/discord.js/commit/2eeaad6f27fdf8868364fa95ed20755ee09bda87))
- **WebSocketManager:** Correct error name (#8138) ([db2b033](https://github.com/discordjs/discord.js/commit/db2b0333d912fe83381db2ffe16829d7d03d6c2e))
- **WebSocketShard:** Disconnected casing (#8117) ([23e183a](https://github.com/discordjs/discord.js/commit/23e183a9ac7aaa3bca2bc4eb8634d1738ec34a26))
- **webhooks:** Revert webhook caching (and returning Message) (#8038) ([d54bf5d](https://github.com/discordjs/discord.js/commit/d54bf5d286f4057db130901591b192fd4d1668c1))
- **ApplicationCommand:** Remove `autocomplete` check at the top level and correctly check for `dmPermission` (#8100) ([0a44b05](https://github.com/discordjs/discord.js/commit/0a44b05db83948857afbe18471e7a867da47177a))
- **ApplicationCommand:** Fix default member permissions assignment (#8067) ([96053ba](https://github.com/discordjs/discord.js/commit/96053babe1bd65ebe1fc6a261f5eb052906afdb9))
- **scripts:** Read directory and rerun (#8065) ([f527dea](https://github.com/discordjs/discord.js/commit/f527dea36ead194aaae1bf5da1e953df59d692fd))
- Select menu options to accept both rest and array (#8032) ([fbe67e1](https://github.com/discordjs/discord.js/commit/fbe67e102502b4b49690cbf8ff891ead2232ecf3))
- **CommandInteractionOptionResolver:** Handle autocompletion interactions (#8058) ([d8077c6](https://github.com/discordjs/discord.js/commit/d8077c6839dc8ceb57d3c3a86bf9746be2a91ada))
- **scripts:** Add quotes around blob arguments (#8054) ([598f61b](https://github.com/discordjs/discord.js/commit/598f61b992fab1b3fdcab8ff960366f7af0b37ea))
- **Message:** Force fetching (#8047) ([f2b267c](https://github.com/discordjs/discord.js/commit/f2b267c079dd8aa7277910471f3db2f88af6efb2))
- **Attachment:** Do not destructure `data` (#8041) ([1afae90](https://github.com/discordjs/discord.js/commit/1afae909d72e648cf48d63d7de2708737a78c126))
- **DirectoryChannel:** Type `name` and handle `url` (#8023) ([86d8fbc](https://github.com/discordjs/discord.js/commit/86d8fbc023e3925e8f86799d6ebf2d423f7bf2ec))
- Readd `isThread` type guard (#8019) ([f8ed71b](https://github.com/discordjs/discord.js/commit/f8ed71bfca6e47e3d44ad063e23804354bd23604))
- Add static method `from` in builders (#7990) ([ad36c0b](https://github.com/discordjs/discord.js/commit/ad36c0be7744ea4214ccf345fe80a5a1a9e89101))
- Typings (#7965) ([7a1095b](https://github.com/discordjs/discord.js/commit/7a1095b66be3c5d81185e026281e2908c10c1695))
- **GuildAuditLogs:** Cache guild scheduled events (#7951) ([2f03f9a](https://github.com/discordjs/discord.js/commit/2f03f9ad3f63abee5b5c46d02f1afa8885e8977c))
- Make sure action row builders create djs builders (#7945) ([adf461b](https://github.com/discordjs/discord.js/commit/adf461baf49be754c7a10c61faf1ef3df333413a))
- **TextBasedChannel#bulkDelete:** Return deleted message (#7943) ([191510b](https://github.com/discordjs/discord.js/commit/191510b7f87903e4bd93b891649cb290fd50c47e))
- Remove trailing invites on channel deletion (#7932) ([5e9b757](https://github.com/discordjs/discord.js/commit/5e9b757a3733e6526770eb60a15072612294eb21))
- **DataResolver:** Fix check for readable streams (#7928) ([28172ca](https://github.com/discordjs/discord.js/commit/28172ca7b57357436d3252ec01ec17dad865d87f))
- **AuditLog:** Default changes to empty array (#7880) ([19eaed6](https://github.com/discordjs/discord.js/commit/19eaed63905367ef4604366b8839023384524d1f))
- **Util:** Flatten ignoring certain fields (#7773) ([df64d3e](https://github.com/discordjs/discord.js/commit/df64d3ea382c07e66bc7cc8877ee430206c31d63))
- Possibly missing (#7829) ([6239d83](https://github.com/discordjs/discord.js/commit/6239d83c4d5f0a396678410d7fef35e39ed29009))
- `endReason` not being properly set in base Collector (#7833) ([0c18dab](https://github.com/discordjs/discord.js/commit/0c18dab1280205b8855d17d075b7421860d59c14))
- **SelectMenuBuilder:** Options array (#7826) ([3617093](https://github.com/discordjs/discord.js/commit/361709332bdc871822c2b9919f14fd090d68666a))
- **Activity:** Platform type (#7805) ([4ac91c6](https://github.com/discordjs/discord.js/commit/4ac91c61d08111ae4d49d1e64caf94e6e49832c8))
- **ApplicationCommand:** Equal nameLocalizations and descriptionLocalizations (#7802) ([4972bd8](https://github.com/discordjs/discord.js/commit/4972bd87c17cbc6a94c9608ba2ab39c475f9921f))
- **InteractionResponses:** Use optional chaining on nullable property (#7812) ([c5fb548](https://github.com/discordjs/discord.js/commit/c5fb54852906898ffb19282dd60168dfc6fb2eba))
- **MessageManager:** Allow caching option of an unspecified limit (#7763) ([1b2d8de](https://github.com/discordjs/discord.js/commit/1b2d8decb638faeae8184119c5cedfcdaf9485e3))
- **builders:** Add constructor default param (#7788) ([c286650](https://github.com/discordjs/discord.js/commit/c2866504a3824005fe756556fec4b349898b7d22))
- **MessagePayload:** ResolveBody check body instead of data (#7738) ([3db20ab](https://github.com/discordjs/discord.js/commit/3db20abdd2d502a1ed457842181b164dc6390ba1))
- **ActionRow:** ToJSON should include components (#7739) ([ebb4dfa](https://github.com/discordjs/discord.js/commit/ebb4dfa262adb2086c83db487002bb2e1ed5ab88))
- Prevent `NaN` for nullable timestamps (#7750) ([8625d81](https://github.com/discordjs/discord.js/commit/8625d817145eb642aeb0da05184352f438586986))
- **InteractionCreateAction:** Ensure text-based channel for caching messages (#7755) ([25fdb38](https://github.com/discordjs/discord.js/commit/25fdb3894d33dc395a376a3d962a063eb5735253))
- Pass `force` correctly (#7721) ([402514f](https://github.com/discordjs/discord.js/commit/402514ff323ccf1f8c95d295f044cf0bb5547c2e))
- Support reason in setRTCRegion helpers (#7723) ([905a6a1](https://github.com/discordjs/discord.js/commit/905a6a11663f9469ada67f8310a969453ffc5b2a))
- **GuildMemberManager:** Return type can be null (#7680) ([74bf7d5](https://github.com/discordjs/discord.js/commit/74bf7d57ab959eb820ab1c213ac86ab1ea660398))
- **gateway:** Use version 10 (#7689) ([8880de0](https://github.com/discordjs/discord.js/commit/8880de0cecdf273fd6df23988e4cb77774a75390))
- Audit log static reference (#7703) ([85e531f](https://github.com/discordjs/discord.js/commit/85e531f22d7a8f8ad043647ce445726ae0df26c0))
- Handle possibly missing property (#7641) ([0c32332](https://github.com/discordjs/discord.js/commit/0c32332a5aacbbb6c415da75c166d09cfdb34bbd))
- **util:** Allow `escapeInlineCode` to escape double backtics (#7638) ([d5369a5](https://github.com/discordjs/discord.js/commit/d5369a56e3fcf50513f3bc582552c2838b04d199))
- **GuildEditData:** Some fields can be null (#7632) ([4d2b559](https://github.com/discordjs/discord.js/commit/4d2b55955d1a3ff05c3047599232becdc3f2c445))
- TOKEN_INVALID error not thrown at login with invalid token (#7630) ([cd79bef](https://github.com/discordjs/discord.js/commit/cd79bef2547594f4d0c744faa8fa67fb9fd61526))
- **GuildScheduledEvent:** Handle missing `image` (#7625) ([c684ac5](https://github.com/discordjs/discord.js/commit/c684ac55e1d225740e67ab7bd5643de1b35f4594))
- **guild:** Throw if ownerId falsey (#7575) ([98177aa](https://github.com/discordjs/discord.js/commit/98177aa38d3d6516d4c5354d6c7edea925dc881d))
- Remove Modal export (#7654) ([87a6b84](https://github.com/discordjs/discord.js/commit/87a6b8445bfbf3981cd39813fe961dfa1c7f2bce))
- **Embed:** Fix incorrect destructuring import (#7615) ([cbdb408](https://github.com/discordjs/discord.js/commit/cbdb408dffd1c7f2193c15989528a3de5fd9f13a))
- **ThreadMembersUpdate:** Only emit added & removed thread members (#7539) ([c12d61a](https://github.com/discordjs/discord.js/commit/c12d61a3421afcdc41f77c0fddde4efbb257fa69))
- **Util:** EscapeInlineCode properly (#7587) ([851f380](https://github.com/discordjs/discord.js/commit/851f380eb10d23ffd08e8b845aed4039abbcd03b))
- **GuildStickerManager:** Correctly access guild ID (#7605) ([4b08d9b](https://github.com/discordjs/discord.js/commit/4b08d9b376bda7a7f4bb3fb8c555d25cca648de4))
- **MessageManager:** Pin route (#7610) ([cb566c8](https://github.com/discordjs/discord.js/commit/cb566c8b6abff489a944db7952e5c5a48e0c98b0))
- Handle partial data for `Typing#user` (#7542) ([c6cb5e9](https://github.com/discordjs/discord.js/commit/c6cb5e9ebbf46d81404119a6aa11bb8ebb17d5a4))
- **guild:** Fix typo accessing user instead of users (#7537) ([8203c5d](https://github.com/discordjs/discord.js/commit/8203c5d843f2431c0f49023282f1bf73d85881d1))
- **test:** `MessageActionRow` to `ActionRow` (#7523) ([d1d1b07](https://github.com/discordjs/discord.js/commit/d1d1b076bebf7cb706b2436a40d87c6efaed1e1d))
- **MessagePayload:** Don't set reply flags to target flags (#7514) ([4f30652](https://github.com/discordjs/discord.js/commit/4f306521d829fef21ebd70557b37f8199b82572b))
- **invite:** Add back channelId property (#7501) ([78aa36f](https://github.com/discordjs/discord.js/commit/78aa36f9f5913b86c82376ecdf20653b15340bbe))
- Properly serialize `undefined` values (#7497) ([8dbd345](https://github.com/discordjs/discord.js/commit/8dbd34544cbeb499282f01dda9d35ed9bca93591))
- Allow unsafe embeds to be serialized (#7494) ([942ea1a](https://github.com/discordjs/discord.js/commit/942ea1acbfb49289ccb3a1882b5a2da0a7d0bccf))
- Attachment types (#7478) ([395a68f](https://github.com/discordjs/discord.js/commit/395a68ff49c622d5136d6b775beaf8e88a2d8610))
- Use case converter for json component serialization (#7464) ([2d45544](https://github.com/discordjs/discord.js/commit/2d4554440ed9329a5876a9c674c3eb2de0f2f917))
- **GuildAuditLogs:** Typings and consistency (#7445) ([c1b27f8](https://github.com/discordjs/discord.js/commit/c1b27f8eed8ea04a48bc106453892bddcdc6b73e))
- **dataresolver:** Ensure fetched file is convert to a buffer (#7457) ([9311fa7](https://github.com/discordjs/discord.js/commit/9311fa7b42b2b5a74e411aa263daa4fbfc270645))
- **messagepayload:** ResolveFile property names (#7458) ([a8106f7](https://github.com/discordjs/discord.js/commit/a8106f7c586f0ecac76e7f72c53b0da215a6fbf1))
- **ci:** Ci error (#7454) ([0af9bc8](https://github.com/discordjs/discord.js/commit/0af9bc841ffe1a297d308500d696bad4b85abda9))
- **threads:** Require being sendable to be unarchivable (#7406) ([861f0e2](https://github.com/discordjs/discord.js/commit/861f0e2134662ab64a11d313130aff58b413d495))
- **guildmember:** Check if member has administrator permission (#7384) ([81d8b54](https://github.com/discordjs/discord.js/commit/81d8b54ff6b98b0e7ee2c57eaee6bc0b707e135a))
- **guild:** Remove `maximumPresences` default value (#7440) ([55b388a](https://github.com/discordjs/discord.js/commit/55b388a763dc7223e88b62ae928fe85fe8b8fe58))
- **guildchannelmanager:** Edit always sets parent to null (#7446) ([b97aedd](https://github.com/discordjs/discord.js/commit/b97aedd8e15f9358960cb59403f3a8ea24b87141))
- **guildmember:** Make `pending` nullable (#7401) ([fe11ff5](https://github.com/discordjs/discord.js/commit/fe11ff5f6e85571a981e90eba5b9f3bda7a2cd04))
- **clientpresence:** Fix used opcodes (#7415) ([a921ec7](https://github.com/discordjs/discord.js/commit/a921ec7dc525c58d40b4678e66270f9238abed31))
- Correctly export UnsafeSelectMenuComponent from builders (#7421) ([aadfbda](https://github.com/discordjs/discord.js/commit/aadfbda586d57a7b775ad26c201f0dc34618180b))
- MessageReaction.me being false when it shouldn't (#7378) ([04502ce](https://github.com/discordjs/discord.js/commit/04502ce702da53c4b00bf391d0fd936746851381))
- Fix some typos (#7393) ([92a04f4](https://github.com/discordjs/discord.js/commit/92a04f4d98f6c6760214034cc8f5a1eaa78893c7))
- **messagementions:** Fix `has` method (#7292) ([3a5ab2c](https://github.com/discordjs/discord.js/commit/3a5ab2c4e54de4e67ab6e323d7eac86482da7382))
- **guildmembermanager:** Use rest in edit (#7356) ([00ce1c5](https://github.com/discordjs/discord.js/commit/00ce1c56ac224691a8691a3525cb14ae002319c6))
- **typings:** Mark `RESTOptions` as Partial in `ClientOptions` (#7349) ([e1ecc1a](https://github.com/discordjs/discord.js/commit/e1ecc1a80a9358cdbafbe8542c40b9de8cad467e))
- **Webhook:** Use correct method name (#7348) ([11e5e5a](https://github.com/discordjs/discord.js/commit/11e5e5ac5b70138f56332eb3e61a42443670b0de))
- **thread:** Don't assign directly to getters (#7346) ([2db0cdd](https://github.com/discordjs/discord.js/commit/2db0cdd357c3a02decb4fd4168db87888efba283))
- Missed enums and typings from #7290 (#7331) ([47633f0](https://github.com/discordjs/discord.js/commit/47633f0fd2435d6d8c694d8d37b26039a7b3797a))
- **guildchannelmanager:** Remove reverse enum lookup (#7304) ([857bba4](https://github.com/discordjs/discord.js/commit/857bba448029f3f070c67fb40b59a3a2a2e5c6f4))
- Import `clear{Timeout,Interval}` from `node:timers` (#7269) ([8ddd44e](https://github.com/discordjs/discord.js/commit/8ddd44ed85b32c86243efe0ec35b283eaaa8212c))
- **ApplicationCommand:** Use new ApplicationCommandOptionType enums (#7257) ([06f5210](https://github.com/discordjs/discord.js/commit/06f5210f58bbba6102173033a9f1e6fb004fdf5d))
- Use enums from discord-api-types (#7258) ([f284a46](https://github.com/discordjs/discord.js/commit/f284a4641fd68de9190bda97ec1eab0981149630))
- **exports:** Export ApplicationCommandType properly (#7256) ([f753882](https://github.com/discordjs/discord.js/commit/f75388259262bf6b4a64375b97800bd72378f3bc))
- **Shard:** EventEmitter listener warning (#7240) ([ff3a8b8](https://github.com/discordjs/discord.js/commit/ff3a8b83234d3826fc49c5a8c3cb52ef9f281ffd))
- **timestamps:** Account for timestamps of 0 when creating Dates (#7226) ([a8509c9](https://github.com/discordjs/discord.js/commit/a8509c91ca0147393b407221405b6b917677961a))
- **MessageEmbed:** CreatedAt field can be zero (#7218) ([37cad54](https://github.com/discordjs/discord.js/commit/37cad54dbdade39607397b8ad697eca94f1b7197))
- **BaseClient:** Do not append default options if provided is not an object (#6453) ([b92a7d7](https://github.com/discordjs/discord.js/commit/b92a7d72332c35b607db54aa6aca24b8e10e00ad))
- Snowflakeutil import (#7219) ([962f4bf](https://github.com/discordjs/discord.js/commit/962f4bf88211dbfb5ad0295a9467dede1e2688ee))
- **Role:** Remove unused process (#7215) ([63034b4](https://github.com/discordjs/discord.js/commit/63034b44c9849087e391684d9b6c0c6ae9a21113))
- **WebhookClient:** Updated webhook url regex (#6804) ([1c615d1](https://github.com/discordjs/discord.js/commit/1c615d1bb2606d5f19e55076d4ecab95c619518e))
- **Sweepers:** Add sweepStickers function (#7213) ([95f8375](https://github.com/discordjs/discord.js/commit/95f8375d425f58f501f32ead03f7927e6596f8e6))
- **InteractionCreate:** Use ChatInputCommandInteraction instead (#7210) ([49dada3](https://github.com/discordjs/discord.js/commit/49dada35f92470d3e4426362510847b93dd42d1a))
- **Structues:** Rename old module's name (#7207) ([fbef454](https://github.com/discordjs/discord.js/commit/fbef45489457a2198357dc4dd303740d79036784))
- **WebSocket:** Remove application command handler (#7202) ([033151c](https://github.com/discordjs/discord.js/commit/033151cf92fe43536b8a4c0f4d7d9ed75a2095c5))
- **User:** `bannerURL()` should not throw when not present (#6789) ([3872acf](https://github.com/discordjs/discord.js/commit/3872acfeb8390f6f7202d69cf1f7f8616a7b0b34))
- **VoiceState:** Ensure `suppress` & `streaming` have proper fallback values (#6377) ([a0d5f13](https://github.com/discordjs/discord.js/commit/a0d5f13dd9b27c44f5183a2a9af4c4fdecb312c0))
- **sweepers:** Provide default for object param (#7182) ([ae2f013](https://github.com/discordjs/discord.js/commit/ae2f013653c8a9f9ffb12ae8fcdb1bb604b39236))

## Deprecation

- **Caching:** Clean up deprecated cache sweeping (#7118) ([12ffa06](https://github.com/discordjs/discord.js/commit/12ffa069aa8b247e945fef16a543f41c2c391bf1))

## Documentation

- Align webhook method return types with implementation (#8253) ([5aeed99](https://github.com/discordjs/discord.js/commit/5aeed9935058241648507d7f651679226a89dbb3))
- Remove `@private` constructor documentation (#8255) ([452dec5](https://github.com/discordjs/discord.js/commit/452dec57ca422f5e7424a0f0e78c3e152717f413))
- **ApplicationCommand:** Add `min_length` and `max_length` to ApplicationCommandOptionData (#8239) ([43f62bb](https://github.com/discordjs/discord.js/commit/43f62bb6678ec332795c8cfbe0c01854b95aa61e))
- **MessageInteraction#commandName:** Updated description (#8212) ([ab238a9](https://github.com/discordjs/discord.js/commit/ab238a9046e0201dbd4755fa41fa69c44b186912))
- Add missing `@extends` (#8205) ([e0c8282](https://github.com/discordjs/discord.js/commit/e0c82824905dcebf62c2d1afcc5e5590a5594838))
- **Constants:** Fix SweeperKeys type (#8157) ([af04992](https://github.com/discordjs/discord.js/commit/af04992ed3c2617fda686c2bc7338dcada283dc6))
- **Channels:** Internally document channel creation (#8154) ([5e5853a](https://github.com/discordjs/discord.js/commit/5e5853a4e885c47e3dde519761dd59a5ec0e06fc))
- Update threads to use `ThreadAutoArchiveDuration` (#8153) ([ee36d60](https://github.com/discordjs/discord.js/commit/ee36d60dc6714c83569a20716fa8ca8e1bd7de4f))
- **APITypes:** Remove duplicate type definition (#8144) ([a061233](https://github.com/discordjs/discord.js/commit/a0612335101c7ce2a07d95da4b79f0d4a2b1a6a0))
- Document missing type definitions (#8130) ([203bc4a](https://github.com/discordjs/discord.js/commit/203bc4a2cf0c2d90a003093318aa0741605610f5))
- **InteractionResponse:** Fix return (#8141) ([f1ac17c](https://github.com/discordjs/discord.js/commit/f1ac17c961cf95d99e205133605d10d8be5bd737))
- **PermissionsBitField:** Fix `@name` of bitfield (#8115) ([3a77ce0](https://github.com/discordjs/discord.js/commit/3a77ce0b18c60a0b21ba088590ff89f2ace94087))
- `TextBasedChannel` -> `TextBasedChannels` typos (#8110) ([db663a5](https://github.com/discordjs/discord.js/commit/db663a55c2ed2faf61e217009158da50dfcf274f))
- Remove `number`s from enums (#8098) ([0a138da](https://github.com/discordjs/discord.js/commit/0a138dab95a86512f08ac3be356f77f38f2ea880))
- **GuildAuditLogs:** Fix and reimplement type definitions (#8108) ([4155136](https://github.com/discordjs/discord.js/commit/415513696c7b7e139d1b958e480bf0c7e4d14111))
- **WebSocketOptions:** Add `version` to docs and typings (#8050) ([386c41f](https://github.com/discordjs/discord.js/commit/386c41f24fb3c9d06967d9c1881a57645c3a71f2))
- **BaseGuildTextChannel:** Update `setType()`'s parameter type (#8088) ([9c0f190](https://github.com/discordjs/discord.js/commit/9c0f190de1f743d9bd597ffd656503c672db71c1))
- Update outdated examples (#8081) ([51eadf3](https://github.com/discordjs/discord.js/commit/51eadf37371a6138847efdb4b5b81ee132001cf0))
- **ThreadMemberManager:** Require `member` in `FetchThreadMemberOptions` (#8079) ([552ec72](https://github.com/discordjs/discord.js/commit/552ec72542ec3b2b3ebf35c9fd84ab502dd746cf))
- **AutocompleteInteraction:** Change useless log in responds example (#8077) ([ac7bf69](https://github.com/discordjs/discord.js/commit/ac7bf692bfce8204e278205dde811515a51f154b))
- Description and missing `@typedef` fixes (#8087) ([a2eebf6](https://github.com/discordjs/discord.js/commit/a2eebf6c66f3e4c96ece9d2ae2a1133c84257f42))
- Ignore docs of unexported functions (#8051) ([94bdcac](https://github.com/discordjs/discord.js/commit/94bdcaca62414a77d4ee0b8b79752a2be937320b))
- **ClientOptions:** Fix closeTimeout default (#8049) ([b2eea1c](https://github.com/discordjs/discord.js/commit/b2eea1c900ba73d4b98b72f5c196f51e27d3ab8f))
- **DirectoryChannel:** Extend `Channel` (#8022) ([f3f34f0](https://github.com/discordjs/discord.js/commit/f3f34f07b3b396015b130b8e9d938a3eec688fc3))
- **Attachment:** Remove constructor doc (#8009) ([0a7953e](https://github.com/discordjs/discord.js/commit/0a7953e46310c77483d277539b47f1a7ab051fd9))
- **VoiceChannel:** Annotate that it is implementing TextBasedChannel (#8007) ([5987dbe](https://github.com/discordjs/discord.js/commit/5987dbe5cff6991ae6905b0387411fa042d3e9b7))
- Add missing discord-api-types external types (#8001) ([546d486](https://github.com/discordjs/discord.js/commit/546d48655f36ed9a6c6c5ce3c2eabcca1a86a945))
- **InteractionResponses:** Replace outdated Embed example for reply (#7875) ([d308c66](https://github.com/discordjs/discord.js/commit/d308c66eeca6bdc3471637ae3aaaaa0a2f5c9989))
- Require parameter (#7838) ([f4ccc67](https://github.com/discordjs/discord.js/commit/f4ccc6772c15e32489ca22fb2c3e803b85d4dbf9))
- **ApplicationCommand:** Fix and improve localization docs (#7804) ([61a44c5](https://github.com/discordjs/discord.js/commit/61a44c509c40abaf7ffb95b10942889cbbf155ac))
- **ApplicationCommand:** Fix ApplicationCommandOptionChoice (#7794) ([f1d0084](https://github.com/discordjs/discord.js/commit/f1d0084da26b0111ca029c789ad9e8e6c2882b4d))
- Add back static properties and methods (#7706) ([520f471](https://github.com/discordjs/discord.js/commit/520f471ac56cbc01402b79197333a8a34c4ac5c9))
- **InteractionCollector:** Document channel option type (#7551) ([e787cd5](https://github.com/discordjs/discord.js/commit/e787cd5fa5d013319347392ee4f799a677f6f512))
- Correctly type getters (#7500) ([ffecf08](https://github.com/discordjs/discord.js/commit/ffecf084956f954cf10e1b844e00326e443a86f2))
- ApplicationCommandData typedef (#7389) ([d32db88](https://github.com/discordjs/discord.js/commit/d32db8833e1058fb36f2e83af79d5353a9f2f693))
- **channel:** Fix `isDMBased` docs (#7411) ([f2a7a9f](https://github.com/discordjs/discord.js/commit/f2a7a9f1b30af272a6a8d81825d09f84e749cc24))
- **messageattachment:** Fix `contentType` docs (#7413) ([2800e07](https://github.com/discordjs/discord.js/commit/2800e07e5974e07b9f8ce043722b9b99a5bcc80d))
- Add supported option types for autocomplete (#7368) ([8bb3751](https://github.com/discordjs/discord.js/commit/8bb37513400d646d784d59875d6b6a6ec10160cd))
- Add external builder docs links (#7390) ([0b866c9](https://github.com/discordjs/discord.js/commit/0b866c9fb284971113e288e52327d4506db28011))
- Add EnumResolvers (#7353) ([72767a1](https://github.com/discordjs/discord.js/commit/72767a1059526bdf617e80d5a9e5da1fbd2936d3))
- **locales:** Update Discord API docs link (#7266) ([b640272](https://github.com/discordjs/discord.js/commit/b6402723c31bed3c49f8b8cde873b65b9f373fd7))
- **StageInstance:** Deprecate discoverableDisabled (#7179) ([bd33ebb](https://github.com/discordjs/discord.js/commit/bd33ebb507eab36bc2219103dbd1e0217b9f38c0))
- **shardingmanager:** Fix type of `execArgv` option (#7284) ([e65da44](https://github.com/discordjs/discord.js/commit/e65da44d9c564d1ffcb0f4df2bcdaf0ce0636f35))
- **interaction:** Add locale list link (#7261) ([37ec0bd](https://github.com/discordjs/discord.js/commit/37ec0bda6df75fb1dc69b7a1eafbb8ea19e68457))
- Fix a typo and use milliseconds instead of ms (#7251) ([0dd56af](https://github.com/discordjs/discord.js/commit/0dd56afe1cdf16f1e7d9afe1f8c29c31d1833a25))
- Fix command interaction docs (#7212) ([137ea24](https://github.com/discordjs/discord.js/commit/137ea249df3aa6b8375ecb42aa456a6fdb811f19))
- **TextBasedChannel:** Fixed syntax error in examples (#7163) ([b454740](https://github.com/discordjs/discord.js/commit/b454740ae87b6c3c13536181965519c7277e5840))
- **TextBasedChannel:** Fix #createMessageComponentCollector description (#7168) ([d4e6e03](https://github.com/discordjs/discord.js/commit/d4e6e0370857dff00185d59faf8aaac12b343a7a))
- Fixes the examples for kick and ban (#7170) ([db669b8](https://github.com/discordjs/discord.js/commit/db669b897132ec458d50ca6c1e3afa761e98ffc3))
- **RoleManager:** Fix incorrect example (#7174) ([f79ea67](https://github.com/discordjs/discord.js/commit/f79ea67d3a9ba134a9acef0a443bd089c4e173a6))

## Features

- **builder:** Add max min length in string option (#8214) ([96c8d21](https://github.com/discordjs/discord.js/commit/96c8d21f95eb366c46ae23505ba9054f44821b25))
- **applicationCommand:** Add max min length in string option (#8215) ([94ee60d](https://github.com/discordjs/discord.js/commit/94ee60d3d438f6657bdef51471528769af09624c))
- Add website documentation early mvp (#8183) ([d95197c](https://github.com/discordjs/discord.js/commit/d95197cc78593df4d0a8d1cc492b0e41b4ab58b8))
- **BaseInteraction:** Add support for `app_permissions` (#8194) ([002d6a5](https://github.com/discordjs/discord.js/commit/002d6a5aede3d1c0e08bd58eeef38a3b9202f525))
- **util:** ParseWebhookURL (#8166) ([c4653f9](https://github.com/discordjs/discord.js/commit/c4653f97b1529eb0b99fccdba67c37eb4f467ff9))
- **AutocompleteInteraction:** Add `commandGuildId` (#8086) ([10a6c42](https://github.com/discordjs/discord.js/commit/10a6c4287dd45a30290814e50fa29a086f85da02))
- **guild:** Add support for setting MFA level (#8024) ([c5176be](https://github.com/discordjs/discord.js/commit/c5176be14b697ff506eb973c4119644eab544304))
- **vcs:** Add missing property and methods (#8002) ([0415300](https://github.com/discordjs/discord.js/commit/0415300243877ddbcb501c0a26b1ff65618a1da7))
- **docgen:** Update typedoc ([b3346f4](https://github.com/discordjs/discord.js/commit/b3346f4b9b3d4f96443506643d4631dc1c6d7b21))
- Website (#8043) ([127931d](https://github.com/discordjs/discord.js/commit/127931d1df7a2a5c27923c2f2151dbf3824e50cc))
- Docgen package (#8029) ([8b979c0](https://github.com/discordjs/discord.js/commit/8b979c0245c42fd824d8e98745ee869f5360fc86))
- Backport handle zombie connection (#7626) ([e1176fa](https://github.com/discordjs/discord.js/commit/e1176faa27898d4f127c293c099201cb294e10ee))
- **CommandInteraction:** Add 'commandGuildId' (#8018) ([aa59a40](https://github.com/discordjs/discord.js/commit/aa59a409b36c7ef7018d1785d2dba4da17b57864))
- Allow builders to accept rest params and arrays (#7874) ([ad75be9](https://github.com/discordjs/discord.js/commit/ad75be9a9cf90c8624495df99b75177e6c24022f))
- **MessageReaction:** Add react method (#7810) ([a328778](https://github.com/discordjs/discord.js/commit/a3287782b57c28b94c390c24e7d5f2d8c303301f))
- **Collector:** Add `ignore` event (#7644) ([5244fe3](https://github.com/discordjs/discord.js/commit/5244fe3c1cd400985b00e95d8e5ec73823cf4f25))
- **GuildMemberManager:** Add `GuildMemberManager#fetchMe()` (#7526) ([349766d](https://github.com/discordjs/discord.js/commit/349766dd6925e2d5e5597cc78c73e46f17c56eab))
- **guildChannelManager:** Add `videoQualityMode` option for `create()` (#7980) ([cdd2ba0](https://github.com/discordjs/discord.js/commit/cdd2ba036ab1559783eb067786c52aff61807557))
- **EnumResolvers:** Remove Enumresolvers (#7876) ([76694c1](https://github.com/discordjs/discord.js/commit/76694c1497de1b083a792fd1fda20f0eace50c48))
- Move `me` to `GuildMemberManager` manager (#7669) ([aed687b](https://github.com/discordjs/discord.js/commit/aed687b09f87862eb2f33fb9f95b2cbd0b770585))
- **rest:** Use undici (#7747) ([d1ec8c3](https://github.com/discordjs/discord.js/commit/d1ec8c37ffb7fe3b63eaa8c382f22ca1fb348c9b))
- **VoiceChannel:** Add support for text in voice (#6921) ([4ba0f56](https://github.com/discordjs/discord.js/commit/4ba0f56b6af64bac30eea807fb3e9f3c41c3c83c))
- **SelectMenu:** Allow emojis in options and option constructors (#7797) ([f22245e](https://github.com/discordjs/discord.js/commit/f22245e9d072ac4ef63b0ae0d84d5ba94608ce22))
- Allow `createMessageComponentCollector` without using `fetchReply` (#7623) ([a58556a](https://github.com/discordjs/discord.js/commit/a58556adc02b2b9239c8f277a4387c743c9d6f04))
- Add guild directory support (#6788) ([b01f414](https://github.com/discordjs/discord.js/commit/b01f4147d4f3bca021bc269c9f06463f06e3db53))
- **GuildBanManager:** Support pagination results (#7734) ([fc2a8bb](https://github.com/discordjs/discord.js/commit/fc2a8bb6750919ecd6ee7c872df05f4b677ff5d3))
- **CommandInteraction:** Add support for localized slash commands (#7684) ([01a423d](https://github.com/discordjs/discord.js/commit/01a423d110cfcddb3d794fcc32579a1547dd472d))
- Allow emoji strings to be passed through constructors (#7718) ([0faac04](https://github.com/discordjs/discord.js/commit/0faac04b69f1dda3dc860cd584af100e36a40917))
- **StageInstanceManager:** Add `sendStartNotification` option to create (#7730) ([29f8807](https://github.com/discordjs/discord.js/commit/29f88079559cc02ccfef7a7c16458d481e573fb5))
- Add `makeURLSearchParams` utility function (#7744) ([8eaec11](https://github.com/discordjs/discord.js/commit/8eaec114a98026024c21545988860c123948c55d))
- **modal:** Add `awaitModalSubmit` (#7751) ([3037fca](https://github.com/discordjs/discord.js/commit/3037fca196a0f9238d53bb51394daf737bbf3742))
- **Actions:** Add parent structure to events parameters (#7577) ([3f3e432](https://github.com/discordjs/discord.js/commit/3f3e4327c86da86734c19a96e97115bd505b4532))
- Export `UnsafeModalBuilder` and `UnsafeTextInputBuilder` (#7628) ([6fec252](https://github.com/discordjs/discord.js/commit/6fec25239dfed46a30826d38dc97f3680f24ec65))
- **VoiceChannel:** Support `video_quality_mode` (#7722) ([3b3dabf](https://github.com/discordjs/discord.js/commit/3b3dabf3da2e2f24b81967d68b581d7f7452273f))
- Add API v10 support (#7477) ([72577c4](https://github.com/discordjs/discord.js/commit/72577c4bfd02524a27afb6ff4aebba9301a690d3))
- **embed:** Remove Embed.setColor (#7662) ([9b0d8cb](https://github.com/discordjs/discord.js/commit/9b0d8cb2d8f7b55753de584eb3a3f347f87596c2))
- **StageInstance:** Add support for associated guild event (#7576) ([3dff31f](https://github.com/discordjs/discord.js/commit/3dff31f63fe4afdcc818193d737e1917f1ac8105))
- **VoiceState:** Add edit method (#7569) ([b162f27](https://github.com/discordjs/discord.js/commit/b162f27e46524bfc64515969d753c6e8f30e6c40))
- **ModalSubmitInteraction:** Add boolean properties (#7596) ([8907390](https://github.com/discordjs/discord.js/commit/89073903a253d9408839573502c72cae93fe70b6))
- Add Modals and Text Inputs (#7023) ([ed92015](https://github.com/discordjs/discord.js/commit/ed920156344233241a21b0c0b99736a3a855c23c))
- **discord.js:** Partial transition to undici (#7482) ([5158332](https://github.com/discordjs/discord.js/commit/51583320d3b0f6452cd96bad1021f2a57e4cc6f6))
- **message:** Add `reason` on pin and unpin (#7520) ([00728f7](https://github.com/discordjs/discord.js/commit/00728f72b36123b607502624b4b02a02ee524d4a))
- Re-export AuditLogEvent enum (#7528) ([6a2fa70](https://github.com/discordjs/discord.js/commit/6a2fa70b8e79a460be38916eeb605976ad6fe68b))
- **options:** Add support for custom JSON transformers (#7476) ([dee27db](https://github.com/discordjs/discord.js/commit/dee27db35af379b0835f9fd5cc19563f7bf3dfc0))
- Add CategoryChannelChildManager (#7320) ([5cf5071](https://github.com/discordjs/discord.js/commit/5cf5071061760c2f9c1e36d7648aef544b03323a))
  - **Co-authored-by:** Antonio Román <kyradiscord@gmail.com>
- Attachment application command option type (#7200) ([0034396](https://github.com/discordjs/discord.js/commit/003439671d359dcfe481446ef12b90bd71c57835))
- **builders:** Add attachment command option type (#7203) ([ae0f35f](https://github.com/discordjs/discord.js/commit/ae0f35f51d68dfa5a7dc43d161ef9365171debdb))
- **scheduledevents:** Add image option (#7436) ([fbc71ef](https://github.com/discordjs/discord.js/commit/fbc71ef6b668c4b1e2b065d9b65541d9303db0a0))
- Add methods to managers (#7300) ([dd751ae](https://github.com/discordjs/discord.js/commit/dd751ae19da196cc2f90ccd35c7d8e99878daaf9))
- **channel:** Add .url getter (#7402) ([f59d630](https://github.com/discordjs/discord.js/commit/f59d6305cb0cd0d154a909f18be76407c4d452d3))
- **components:** Add unsafe message component builders (#7387) ([6b6222b](https://github.com/discordjs/discord.js/commit/6b6222bf513d1ee8cd98fba0ad313def560b864f))
- **thread:** Add `newlyCreated` to `threadCreate` event (#7386) ([51beda5](https://github.com/discordjs/discord.js/commit/51beda56f74e44ed013b5d25044b8d5fd1978b29))
- **channel:** Add isDMBased typeguard (#7362) ([388f535](https://github.com/discordjs/discord.js/commit/388f53550cca7ded7350a050fda03c36e4c1fdf7))
- **`Interaction`:** Add `.commandType` property to `CommandInteraction` and `AutocompleteInteraction` (#7357) ([567db60](https://github.com/discordjs/discord.js/commit/567db60475c8704661b2e788c9905ef364d6c00c))
- **scheduledevent:** Add support for event cover images (#7337) ([355f579](https://github.com/discordjs/discord.js/commit/355f579771771a28a293c327a38574c8918d18f8))
- **enumResolvers:** Strengthen typings (#7344) ([9a566e8](https://github.com/discordjs/discord.js/commit/9a566e8068f28fce87c07861ef1d2877c6ae105f))
- Allow setting message flags when sending (#7312) ([706db92](https://github.com/discordjs/discord.js/commit/706db9228a91ef42e49d2ec749eac153b9ef75d0))
- **minor:** Add application_id to Webhook (#7317) ([5ccdb0a](https://github.com/discordjs/discord.js/commit/5ccdb0ab266e4f74c331386ac2d6dd32bc225c62))
- **threadchannel:** Add `createdTimestamp` field (#7306) ([9a16234](https://github.com/discordjs/discord.js/commit/9a1623425ae2d69f5c16f0096af4951ff5096e80))
- **GuildPreview:** Add stickers (#7152) ([cf25de9](https://github.com/discordjs/discord.js/commit/cf25de9373df98b3c1cd0ca0a092d9dc8172929d))
- Enum resolvers & internal enum string removal (#7290) ([213acd7](https://github.com/discordjs/discord.js/commit/213acd799738b888d550cdf3f08906764f8288e0))
- **guildemojimanager:** Add `delete` and `edit` methods (#7286) ([9181a31](https://github.com/discordjs/discord.js/commit/9181a31e0ba330502052c94da544bb15c8b66f11))
- **interaction:** Add `isRepliable` type guard (#7259) ([da05a88](https://github.com/discordjs/discord.js/commit/da05a8856b11cc1bf0df424c88a1cf9573e5b654))
- **Channel:** Improve typeguards (#6957) ([37a22e0](https://github.com/discordjs/discord.js/commit/37a22e04c27724c2a65b05c701e3000ba3653ba1))
- Add Locales to Interactions (#7131) ([9052e32](https://github.com/discordjs/discord.js/commit/9052e321d1c9c8841962d4e8dc5d9e060b104438))
- **Permissions:** Remove deprecated thread-related permissions (#6755) ([ab3ff5a](https://github.com/discordjs/discord.js/commit/ab3ff5a262caf7d6225b8d6b54ab2c6b6613c0d0))
- **VoiceRegion:** Remove the unsent vip field (#6759) ([caaef53](https://github.com/discordjs/discord.js/commit/caaef53dd97ecac9f714072ddba5ae9a99ab1027))
- **richpresenceassets:** Add YouTube and custom image support (#7184) ([d06d70c](https://github.com/discordjs/discord.js/commit/d06d70ccf26c04c1122fac8430922588a489f95e))
- **Collector:** Yield all collected values (#7073) ([2b480cb](https://github.com/discordjs/discord.js/commit/2b480cb14e6f52855efcb372da7fb455c15b13b1))

## Refactor

- **Util:** Rename `fetchRecommendedShards` (#8298) ([cafde77](https://github.com/discordjs/discord.js/commit/cafde77d73452d729ba8e2cb1cac3f14235b889b))
- **Embed:** Add all the types (#8254) ([64f8140](https://github.com/discordjs/discord.js/commit/64f814066cc4adebaca47eb8d7a2040a8df399ae))
- **rest:** Add content-type(s) to uploads (#8290) ([103a358](https://github.com/discordjs/discord.js/commit/103a3584c95a7b7f57fa62d47b86520d5ec32303))
- Make `GuildAuditLogsEntry.action` return an `AuditLogEvent` (#8256) ([f0b68d5](https://github.com/discordjs/discord.js/commit/f0b68d57368d7ac3db97925df68c11a945ccd84c))
- **builder:** Remove `unsafe*Builder`s (#8074) ([a4d1862](https://github.com/discordjs/discord.js/commit/a4d18629828234f43f03d1bd4851d4b727c6903b))
- Make `ShardEvents` the events of `Shard` (#8185) ([c5750d5](https://github.com/discordjs/discord.js/commit/c5750d59f529ab48a5bc88a73a1c449ef6ddbffd))
- **Util:** Make single `replace` call in `cleanContent` (#8210) ([6b20645](https://github.com/discordjs/discord.js/commit/6b206457400ce31d566b02a0c135042afb540853))
- **ApplicationCommandManager:** Use `makeURLSearchParams` (#8196) ([cb3dca4](https://github.com/discordjs/discord.js/commit/cb3dca4ae029724421f3d04a784ace0ae2de75e2))
- Use `Base` prefix for channel and interaction base classes (#8099) ([e24970e](https://github.com/discordjs/discord.js/commit/e24970e3c3d24f71ba711e59666cd8a49a33e33b))
- **Constants:** Remove leftover code (#8156) ([cd17aad](https://github.com/discordjs/discord.js/commit/cd17aad720430d23af51c364caeb8b22bf6cb6b5))
- Errors (#8068) ([e68effa](https://github.com/discordjs/discord.js/commit/e68effa822f064a324ed5b92e797c9fc3ce5e211))
- **ClientOptions:** Remove `$` prefix from `ws.properties` keys (#8094) ([90a98fe](https://github.com/discordjs/discord.js/commit/90a98fee16b7d1d06768461f4e85127c0edf8419))
- Use `GuildFeature` enum (#8101) ([e5ec1c4](https://github.com/discordjs/discord.js/commit/e5ec1c4dbc3fa54b2c43d1fec24932d7363e17cb))
- **util:** Make utility functions top level (#8052) ([e53d162](https://github.com/discordjs/discord.js/commit/e53d1621986035b0c92a1782f6e013d408480e00))
- **ApplicationCommand:** Permissions v2 (#7857) ([c7391db](https://github.com/discordjs/discord.js/commit/c7391db11b3efd4b1a6904affb26887ad06d6db4))
- **\*:** Include name/reason/etc fields into options/data params (#8026) ([9c8b310](https://github.com/discordjs/discord.js/commit/9c8b3102ce00d1f2c1255c150fb3030f8b6dd026))
- **ThreadMemberManager:** Consistent thread member fetching (#8021) ([da9107c](https://github.com/discordjs/discord.js/commit/da9107c007536952107bd92943b6c714538d5aeb))
- **interactions:** Remove redundant interaction typeguards (#8027) ([f57d676](https://github.com/discordjs/discord.js/commit/f57d6768ad24f6e37dc598f9c93709449d3bc4dd))
- Move all the config files to root (#8033) ([769ea0b](https://github.com/discordjs/discord.js/commit/769ea0bfe78c4f1d413c6b397c604ffe91e39c6a))
- **channel:** Remove redundant channel type guards (#8012) ([70c733b](https://github.com/discordjs/discord.js/commit/70c733bb9a5bde0f79e6bea0bdc416458bda4c06))
- Always return `Message` instances in interactions (#7917) ([9720e55](https://github.com/discordjs/discord.js/commit/9720e555340431c3b3ad7bd670ad0ac7eee8865f))
- **attachment:** Don't return attachment builders from API (#7852) ([dfadcbc](https://github.com/discordjs/discord.js/commit/dfadcbc2fd50be64c8a0c1cae3be10f83678c5ee))
- Clean up modal submissions (#7994) ([643dab3](https://github.com/discordjs/discord.js/commit/643dab3b1b5305d002fcefed62755bbe11fc3267))
- **ThreadChannel:** Remove `MAX` helper from threads (#7846) ([dfd9eb2](https://github.com/discordjs/discord.js/commit/dfd9eb20b2d3e0e7db26744b1f15134ac6eda139))
- **Activity:** Remove undocumented properties (#7844) ([5ba7740](https://github.com/discordjs/discord.js/commit/5ba7740fcfefda1eeba81ace4e6351eac02522a4))
- **MessageAttachment:** Use `Attachment` instead (#7691) ([ab4c608](https://github.com/discordjs/discord.js/commit/ab4c608b97ff319935e1a7f23564622bfd7ddd57))
- **Util:** Remove splitting (#7780) ([54e5629](https://github.com/discordjs/discord.js/commit/54e56299865a6746744544ba25d5540a1166d27c))
- Tidy up builders and components (#7711) ([96a0d83](https://github.com/discordjs/discord.js/commit/96a0d83a1366703ecae40b5e0d5171be9123d079))
- Remove nickname parsing (#7736) ([78a3afc](https://github.com/discordjs/discord.js/commit/78a3afcd7fdac358e06764cc0d675e1215c785f3))
- Remove store channels (#7634) ([aedddb8](https://github.com/discordjs/discord.js/commit/aedddb875e740e1f1bd77f06ce1b361fd3b7bc36))
- **IntegrationApplication:** Remove `summary` (#7729) ([eb6b472](https://github.com/discordjs/discord.js/commit/eb6b472f72488cad7e96befccc00270cf6dc01b8))
- **GuildAuditLogs:** Remove build (#7704) ([cedd053](https://github.com/discordjs/discord.js/commit/cedd0536baa1301984daf89dfda4e63a7be595a2))
- **InteractionCollector:** Simplify constructor logic (#7667) ([07b23a9](https://github.com/discordjs/discord.js/commit/07b23a99c7088a7c740f23051f3f755f091519b0))
- Remove undocumented checks (#7637) ([9a6e691](https://github.com/discordjs/discord.js/commit/9a6e691eaa6c3d133098b2734414590cb838de2e))
- Allow builders to accept emoji strings (#7616) ([fb9a9c2](https://github.com/discordjs/discord.js/commit/fb9a9c221121ee1c7986f9c775b77b9691a0ae15))
- Use `static` fields (#7701) ([e805777](https://github.com/discordjs/discord.js/commit/e805777a7a81d1dc7a2edd9741ecb04e685a3886))
- **EmbedBuilder:** Allow hex strings in setColor (#7673) ([f472975](https://github.com/discordjs/discord.js/commit/f4729759f600372455f062c75859f084e23a5d78))
- Don't return builders from API data (#7584) ([549716e](https://github.com/discordjs/discord.js/commit/549716e4fcec89ca81216a6d22aa8e623175e37a))
- **embed:** Allow hex strings in `setColor()` (#7593) ([79d6c04](https://github.com/discordjs/discord.js/commit/79d6c0489c3d563fdd05de63c4fcf93a6deefce1))
- **InteractionResponses:** Use ClientOptions.jsonTransformer (#7599) ([fac55bc](https://github.com/discordjs/discord.js/commit/fac55bcfd1e8b76aae1273415f74fa6de7aca66d))
- Deprecate invite stage instance (#7437) ([d2bc9d4](https://github.com/discordjs/discord.js/commit/d2bc9d444f42a70a3c4cc4c68eb107bcaebec509))
- **guild:** Move `premiumSubscriptionCount` to `AnonymousGuild` (#7451) ([6d3da22](https://github.com/discordjs/discord.js/commit/6d3da226d3c003d137639e719394a807330e4844))
- **actions:** Use optional chaining (#7460) ([d1bb362](https://github.com/discordjs/discord.js/commit/d1bb36256f2f86022884e6ee9e05b0536cb6384d))
- **guildbanmanager:** Rename days option to deleteMessageDays (#7447) ([0dfdb2c](https://github.com/discordjs/discord.js/commit/0dfdb2cf11e236e67dd34277108973b5b79790a8))
- Make public builder props getters (#7422) ([e8252ed](https://github.com/discordjs/discord.js/commit/e8252ed3b981a4b7e4013f12efadd2f5d9318d3e))
- Remove redundant API defaults (#7449) ([532846b](https://github.com/discordjs/discord.js/commit/532846b1f8260d85022a022d093553310052afc9))
- Allow discord.js builders to accept camelCase (#7424) ([94bf727](https://github.com/discordjs/discord.js/commit/94bf727cc3a2f11c88e95cdb151b235f775cd1ca))
- Replace `WSCodes`, `WSEvents`, and `InviteScopes` with `discord-api-types` equivalent (#7409) ([cc25455](https://github.com/discordjs/discord.js/commit/cc25455d2c75177e3eddc880b7fd53cb122387c4))
- Make constants enums top level and `PascalCase` (#7379) ([d8184f9](https://github.com/discordjs/discord.js/commit/d8184f94dd08daab37195f52828e06af5ed1c1e0))
- **`Bitfield`:** Use discord-api-types enums instead (#7313) ([fbb1d03](https://github.com/discordjs/discord.js/commit/fbb1d0328bcd517027ad2eedb8753d17489ed851))
- Use `@discordjs/rest` (#7298) ([ec0fba1](https://github.com/discordjs/discord.js/commit/ec0fba1ed0d3c5b1bb18171ece6fe5ee42d48497))
- Switch to /builders `Embed` (#7067) ([d2d3a80](https://github.com/discordjs/discord.js/commit/d2d3a80c556a104099a1ddb1b24f1b921c553257))
- Remove transformPermissions (#7303) ([b4ed8fd](https://github.com/discordjs/discord.js/commit/b4ed8fd3ed953085cd908b2845d4384c8555d3a2))
- Remove VoiceChannel#editable (#7291) ([164589c](https://github.com/discordjs/discord.js/commit/164589c5516a847457444d11098981d557b6778b))
- Remove boolean option for `Webhook#fetchMessage` (#7293) ([347ff80](https://github.com/discordjs/discord.js/commit/347ff80bbc9bc5243b7f68ba5d745782eadeba21))
- **subcommandgroup:** Required default to false (#7217) ([6112767](https://github.com/discordjs/discord.js/commit/6112767128a664f32205425f52ba52220d57834f))
- **invite:** Make `channel` and `inviter` getters (#7278) ([18b0ed4](https://github.com/discordjs/discord.js/commit/18b0ed4cbe8285637a971c7c99ee49d18060a403))
- Remove required from getMember (#7188) ([c90e47f](https://github.com/discordjs/discord.js/commit/c90e47f90403e5b1b3499b213dcdf2704fd96b66))
- Remove djs components and use /builders components instead (#7252) ([101d7c5](https://github.com/discordjs/discord.js/commit/101d7c5ffa03edcf8cb8a0647b77d5c9a38e4bdd))
- Default \*URL methods to animated hash (#7149) ([7c07976](https://github.com/discordjs/discord.js/commit/7c07976018728154be0ce0314d3e8dfe8eb9ed5b))
- Use setPosition inside edit (#7263) ([0b23b7f](https://github.com/discordjs/discord.js/commit/0b23b7f0394a20596c8d85b82870c3f35ea6b0e0))
- Don't disable import order lint (#7262) ([0a5d5f3](https://github.com/discordjs/discord.js/commit/0a5d5f38c0b1a249fa2efe16f3b601c90622a4d5))
- Remove discord.js enums and use discord-api-types enums instead (#7077) ([aa6d1c7](https://github.com/discordjs/discord.js/commit/aa6d1c74de01dd9a8f020c43fb2c193c4729df8d))
- **application:** Remove fetchAssets (#7250) ([1479e40](https://github.com/discordjs/discord.js/commit/1479e40bcecc4c28ecb9f05fa4fbbdfe3bd387e1))
- PresenceUpdate and demuxProbe (#7248) ([1745973](https://github.com/discordjs/discord.js/commit/174597302408f13c5bb685e2fb02ae2137cb481d))
- **embeds:** Don't create new embed instances when unnecessary (#7227) ([822dc67](https://github.com/discordjs/discord.js/commit/822dc678da626de7b4fb22a747cd3cd2e8376732))
- **GuildMember:** Throw better errors on #kickable and #bannable (#7137) ([4fd127e](https://github.com/discordjs/discord.js/commit/4fd127e79edfa1851f8a10242838f9d7aa68c8c3))
- **SnowflakeUtil:** Switch to `@sapphire/snowflake` (#7079) ([e082dfb](https://github.com/discordjs/discord.js/commit/e082dfb1584926e4c05face5966d16e4a2921bc5))
- **InteractionCreate:** Remove interaction event (#6326) ([ae876d9](https://github.com/discordjs/discord.js/commit/ae876d962453ccf843f8e6f70666a98a3173bb75))
- **MessageCreate:** Remove message event (#6324) ([171e917](https://github.com/discordjs/discord.js/commit/171e917fb96b6bf39a6ad70e83be646f72fe451e))
- **integration:** Turn undefined into null and consistency (#7209) ([13eb782](https://github.com/discordjs/discord.js/commit/13eb78256da901e6c3c405f546f36617ef5e8239))
- Remove `deleted` field (#7092) ([cee7fd1](https://github.com/discordjs/discord.js/commit/cee7fd181c464e44eabf20b511d12589f2453722))
- **Dates:** Save timestamps everywhere and use Date.parse (#7108) ([55e21f5](https://github.com/discordjs/discord.js/commit/55e21f53663a91863c63b6d9f3a8c35564664061))
- **RoleManager:** Remove `comparePositions()` (#7201) ([fbbac27](https://github.com/discordjs/discord.js/commit/fbbac279789427b2c36869dc47b65fb08431e14d))
- Better Command Terminology (#7197) ([b7856e7](https://github.com/discordjs/discord.js/commit/b7856e7809ff6fa21fe00286f885808535624f7c))
- **Actions:** Remove deleted maps (#7076) ([5022b14](https://github.com/discordjs/discord.js/commit/5022b14da09e9b421f947e9bc385a0574cbf07d1))
- **Client:** Remove applicationCommand events (#6492) ([6085b4f](https://github.com/discordjs/discord.js/commit/6085b4f72723d4ff82f7fea504241d14c94af21e))
- Remove `Util.removeMentions()` (#6530) ([0c24cc8](https://github.com/discordjs/discord.js/commit/0c24cc8ec0d818315cc8f8bcf74fce060847ac79))
- **Constants:** Change APPLICATION_COMMAND -> CHAT_INPUT_COMMAND (#7018) ([75616a3](https://github.com/discordjs/discord.js/commit/75616a305f9af33013486b13a872a39212101ce7))
- **Guild:** Remove deprecated setXPositions methods (#6897) ([43e5e3c](https://github.com/discordjs/discord.js/commit/43e5e3c339a96fa895267d4538eee1d5e5843d05))
- **UserFlags:** Update flag names (#6938) ([b246fc4](https://github.com/discordjs/discord.js/commit/b246fc4101b8e4957ffd1af8e2e4986a020ca211))

## Styling

- Cleanup tests and tsup configs ([6b8ef20](https://github.com/discordjs/discord.js/commit/6b8ef20cb3af5b5cfd176dd0aa0a1a1e98551629))

## Typings

- **GuildFeature:** Allow feature strings to be passed (#8264) ([b7d4e55](https://github.com/discordjs/discord.js/commit/b7d4e55419207d4e25f5c40cab221c7c04a617bf))
- **CategoryChannelChildManager:** Fix Holds type (#8288) ([33a7a5c](https://github.com/discordjs/discord.js/commit/33a7a5cbdc00d2a5034dc1ec91fec5da7042f9d0))
- Remove `MemberMention` (#8292) ([bf65b37](https://github.com/discordjs/discord.js/commit/bf65b37d1a9ea8417e26ad4afacea1eb45a0ff5a))
- **GuildMemberManager:** Fix placement for `fetchMe()` (#8258) ([7525615](https://github.com/discordjs/discord.js/commit/75256153a9923d94ca709a37aaccc48dfb43c153))
- Convert `Events` to an enum (#8246) ([feb3bdd](https://github.com/discordjs/discord.js/commit/feb3bdda0a3c3da80378c8cbcafca2968551eef9))
- **GuildMemberManager:** Non-void return of `edit()` (#8186) ([c7a205f](https://github.com/discordjs/discord.js/commit/c7a205f7b992eea43af13a4638e2a03db7bc0d8a))
- Add missing shard types (#8180) ([27d8deb](https://github.com/discordjs/discord.js/commit/27d8deb4716a87704370a95103b16fa1b763de18))
- Implement `GuildChannelEditOptions` (#8184) ([b83e0c0](https://github.com/discordjs/discord.js/commit/b83e0c0caffc2b767aa1ba4412580970a6901899))
- **Status:** Add missing members (#8179) ([8421f92](https://github.com/discordjs/discord.js/commit/8421f9203bd2d85ef8e64c3fb9a991c74223a75d))
- **GuildScheduledEvent#scheduledStartAt:** Should be nullish (#8111) ([65dc8d6](https://github.com/discordjs/discord.js/commit/65dc8d677ee81469c0eeb4ecdd83fe2f68cc8982))
- Fix modal builder constructor data type (#8143) ([7279f9c](https://github.com/discordjs/discord.js/commit/7279f9c31b14bc1e78c63b7298e80e37ca5dfe0c))
- Use `ThreadAutoArchiveDuration` from discord-api-types (#8145) ([a3799f9](https://github.com/discordjs/discord.js/commit/a3799f9ebb027904830457119708d550e2009200))
- **Shard#reconnecting:** Fix event name (#8118) ([95e6d6e](https://github.com/discordjs/discord.js/commit/95e6d6ede03c4fb92a8d8027a085e84b043fd895))
- **ApplicationCommand:** Fix typo in setDMPermission (#8097) ([4df491c](https://github.com/discordjs/discord.js/commit/4df491ce8578a1b01ee8412a4df8137a302e7202))
- Fix `setType()` parameter and `ChannelData.type` (#8089) ([b4e28a8](https://github.com/discordjs/discord.js/commit/b4e28a8ff6bf165c54a8726d3bc3a3cc0c1e469b))
- Fix `ApplicationCommandPermissionsUpdate` event typings (#8071) ([9964454](https://github.com/discordjs/discord.js/commit/9964454c2944a0523399481a5f609144486e549b))
- **AutocompleteOption:** Fix and improve types (#8069) ([476b7d5](https://github.com/discordjs/discord.js/commit/476b7d519c719152ea04e207f6dd09bb23e733db))
- **ThreadMemberManager:** Fix return type of fetching members with no arguments (#8060) ([2392a6f](https://github.com/discordjs/discord.js/commit/2392a6f5de2efcf6b326173d26295c928b94adb6))
- Remove isAutocomplete typeguard from typings (#8063) ([c0f079d](https://github.com/discordjs/discord.js/commit/c0f079d2325a636c83ac676c525bfa89ce308b3c))
- **AttachmentBuilder:** Fix data type (#8016) ([7fa698d](https://github.com/discordjs/discord.js/commit/7fa698d23e548987762c4c66c96c510d9ea56eb4))
- **modal:** Fix `showModal()` typings (#8014) ([0ccc243](https://github.com/discordjs/discord.js/commit/0ccc243c8ffbf852660c899cc2ad47bd5ebb65cb))
- Fix some attachment related typings (#8013) ([6aa6232](https://github.com/discordjs/discord.js/commit/6aa623240ee94b117c7e69c1d09b50923a8f7a4c))
- **AttachmentBuilder:** Remove name parameter from constructor (#8008) ([6266b0c](https://github.com/discordjs/discord.js/commit/6266b0c1e323f9522010f90f34ce6f17fcb6e769))
- Add types to `EventEmitter` static methods (#7986) ([d60c464](https://github.com/discordjs/discord.js/commit/d60c464e618e4159d2656e7832798909832f33cd))
- Nullify `guildScheduledEventUpdate`'s old parameter (#7955) ([fdeac9d](https://github.com/discordjs/discord.js/commit/fdeac9d9fba06c532eca296ddd8479047bc732bf))
- Make `CacheType` generic more accurate for return values (#7868) ([e07b910](https://github.com/discordjs/discord.js/commit/e07b910e684bc3cf71fb93417951ad42351bace4))
- **guildScheduledEvent:** Mark `entityMetadata` as nullable (#7908) ([64bdf53](https://github.com/discordjs/discord.js/commit/64bdf53116945ffb51764bb8ec539d530aefcfb1))
- **discord.js:** Export missing enums (#7864) ([5eeef3f](https://github.com/discordjs/discord.js/commit/5eeef3f708eb900ec994d837fb4cd414a4f4b437))
- Fix return type of `toString()` on channels (#7836) ([ece6289](https://github.com/discordjs/discord.js/commit/ece628986c7eb1a66f46076d8f8518c9ff00aaf3))
- **Message#activity:** Make `partyId` optional and use enum for `type` (#7845) ([bfeaf85](https://github.com/discordjs/discord.js/commit/bfeaf856f76eb7cb756ac55aac13636ccdb345b6))
- Cleanup \*Data type definitions (#7716) ([585169f](https://github.com/discordjs/discord.js/commit/585169f2f097ffb1940d17f549e4290aa55acde2))
- Fix BooleanCache never resolving to true (#7809) ([440ac24](https://github.com/discordjs/discord.js/commit/440ac243ca1d6f8cd04603e63e3f2f6ea1722ee8))
- **CommandInteraction:** Add awaitModalSubmit (#7811) ([a6d9ce5](https://github.com/discordjs/discord.js/commit/a6d9ce57c6cae90d0afc60010cad44fdc2c2d06c))
- **ThreadChannel:** Fix autoArchiveDuration types (#7816) ([0857476](https://github.com/discordjs/discord.js/commit/08574763eb665b5a43ccfb826929f1e3f0d1c3a7))
- Add missing typing (#7781) ([f094e33](https://github.com/discordjs/discord.js/commit/f094e338617a1a3c9f48a325e4b8e9b5a405aa91))
- **VoiceChannel:** Nullify property (#7793) ([446eb39](https://github.com/discordjs/discord.js/commit/446eb390ce58b7e7f60e297b25f53773a55f7fb9))
- **ModalSubmitInteraction:** Message (#7705) ([b577bcc](https://github.com/discordjs/discord.js/commit/b577bcc1df5c6424fef9984e19a5f11c77371cf3))
- **Embed:** Add missing getters and add video to EmbedData (#7728) ([fd1dc72](https://github.com/discordjs/discord.js/commit/fd1dc72c0a77dbe18753d8db22972dfa5fe4ab36))
- **ModalSubmitInteraction:** Fix `components` type (#7732) ([6f4e97b](https://github.com/discordjs/discord.js/commit/6f4e97bfafe4a058f6ec85d321676401d701ee55))
- **interactionCollector:** Filter should have a collected argument (#7753) ([e4f2705](https://github.com/discordjs/discord.js/commit/e4f27051ca921d299c302b600a8c2917e9356ef6))
- Fix regressions (#7649) ([5748dbe](https://github.com/discordjs/discord.js/commit/5748dbe08783beb80c526de38ccd105eb0e82664))
- **Constants:** Add `NonSystemMessageTypes` (#7678) ([9afc030](https://github.com/discordjs/discord.js/commit/9afc03054e4c8973702d6c18e618643f76382dd9))
- Fix auto archive duration type (#7688) ([8e3b2d7](https://github.com/discordjs/discord.js/commit/8e3b2d7abd38136534969cf77c6a748ee3a20355))
- **InteractionResponseFields:** Add webhook (#7597) ([daf2829](https://github.com/discordjs/discord.js/commit/daf2829cb58d1a44cb1f1ece21e428d1a23e99c9))
- **Embed:** Add forgotten `footer` type (#7665) ([8fb9816](https://github.com/discordjs/discord.js/commit/8fb98165a9d098ab316475d6baacb015783eb638))
- **ColorResolvable:** Simplify string types (#7643) ([2297c2b](https://github.com/discordjs/discord.js/commit/2297c2b9479ace16f5f7155479605a4ac2718e3d))
- Allow component classes in action row data (#7614) ([230c0c4](https://github.com/discordjs/discord.js/commit/230c0c4cb137882ff7bab783a4aeaa83ae941de5))
- **ActionRow:** Allow components to be passed to constructors (#7531) ([e71c76c](https://github.com/discordjs/discord.js/commit/e71c76c7f795837dbcc3576e507bd286640b4296))
- **showModal:** Align types with the documentation (#7600) ([0d7e4ed](https://github.com/discordjs/discord.js/commit/0d7e4edd969513692c061c107be4bbe7e4b54321))
- Modals type and doc fixes (#7608) ([93854a8](https://github.com/discordjs/discord.js/commit/93854a8013d07234cb849bfcbfa99f74a4c3cdb4))
- **InteractionResponseFields:** Add boolean properties (#7565) ([53defb8](https://github.com/discordjs/discord.js/commit/53defb82e36108468e35077b887ee28b811891ab))
- Allow raw components for reply and message options (#7573) ([2d4971b](https://github.com/discordjs/discord.js/commit/2d4971b032a01c05b55c93d6475e61b0d25d69d3))
- Fix component \*Data types (#7536) ([a8321d8](https://github.com/discordjs/discord.js/commit/a8321d8026df2e6a09d867939986bf77f894f3a8))
- Use discord-api-types `Locale` (#7541) ([8346003](https://github.com/discordjs/discord.js/commit/83460037be840ba623f3b02a3e6f218943f9d2b7))
- **anychannel:** Add PartialGroupDMChannel (#7472) ([cf66930](https://github.com/discordjs/discord.js/commit/cf669301c7be8eaecf91d7f764eccc67d7a5b4c6))
- Remove `ApplicationCommandInteractionOptionResolver` (#7491) ([71f4fa8](https://github.com/discordjs/discord.js/commit/71f4fa82ed6206d6843345a5394119f2a728aa35))
- **embed:** Fix timestamp allowed types (#7470) ([7959a68](https://github.com/discordjs/discord.js/commit/7959a68d8ec600af248f5506f39871cae7eeeb04))
- Remove duplicate rate limit for thread creation (#7465) ([2d2de1d](https://github.com/discordjs/discord.js/commit/2d2de1d3fd15a098d69e09710e9a7a3352234fef))
- Correct types for InteractionCollector guild and channel (#7452) ([6ce906a](https://github.com/discordjs/discord.js/commit/6ce906a02fcb051cb6df3e9f453ba9f53db03bd0))
- Fix `GuildAuditLogsTypes` keys & typos (#7423) ([3d8c776](https://github.com/discordjs/discord.js/commit/3d8c77600be51a86a99b526078bb1b1fcb9a0811))
- Remove duplicate `GuildChannelOverwriteOptions` interface (#7428) ([83458ff](https://github.com/discordjs/discord.js/commit/83458ff7c782b8efdaaac931d2dee1764dad25bf))
- Use `GuildFeature` enum from `discord-api-types` (#7397) ([a7b80b9](https://github.com/discordjs/discord.js/commit/a7b80b9d9bf4902bd85b592986771eadf7a765dc))
- Fix \*BitField.Flags properties (#7363) ([e6a26d2](https://github.com/discordjs/discord.js/commit/e6a26d25b3cf8dfcc8aa8997b021f1774f3b754b))
- Fix MessageMentions channel types (#7316) ([c05b388](https://github.com/discordjs/discord.js/commit/c05b38873bb3c37c6e4ebcb6b6373a8858cc03de))
- Fix channel create overloads (#7294) ([1c6c944](https://github.com/discordjs/discord.js/commit/1c6c9449ad68601c6c98748d73be8114401d38ef))
- Fix regressions and inconsistencies (#7260) ([26a9dc3](https://github.com/discordjs/discord.js/commit/26a9dc32062cd071917bbe7264050315b4d6dd3c))
- **interaction:** Remove renamed typeguards (#7220) ([68b9564](https://github.com/discordjs/discord.js/commit/68b9564f1821726377a1e929a3ca1fc65b4ad598))
- AssertType -> expectType ([3f36746](https://github.com/discordjs/discord.js/commit/3f36746561a40cd61a7cd2e054b7ef80d58fc707))
- Fix cache types resolving to `never` (#7164) ([c978dbb](https://github.com/discordjs/discord.js/commit/c978dbb6233bcd85408caf0bca7619c9c5d508f0))
