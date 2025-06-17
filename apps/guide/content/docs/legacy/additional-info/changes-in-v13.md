---
title: Updating from v12 to v13
---

# Updating from v12 to v13

## Before you start

v13 requires Node 16.6 or higher to use, so make sure you're up to date. To check your Node version, use `node -v` in your terminal or command prompt, and if it's not high enough, update it! There are many resources online to help you with this step based on your host system.

Once you've got Node up-to-date, you can install v13 by running the appropriate command in your terminal or command prompt.

```sh tab="npm"
npm install discord.js # text-only
npm install discord.js @discordjs/voice # voice support
```

```sh tab="yarn"
yarn add discord.js # text-only
yarn add discord.js @discordjs/voice # voice support
```

```sh tab="pnpm"
pnpm add discord.js # text-only
pnpm add discord.js @discordjs/voice # voice support
```

You can check your discord.js version with the `list` command. Should it still show v12.x, uninstall and re-install discord.js and make sure the entry in your package.json does not prevent a major version update. Please refer to the [npm documentation](https://docs.npmjs.com/files/package.json#dependencies) for this.

```sh tab="npm"
# check version
npm list discord.js
# uninstall and re-install
npm uninstall discord.js
npm install discord.js
```

```sh tab="yarn"
# check version
yarn list discord.js
# uninstall and re-install
yarn remove discord.js
yarn add discord.js
```

```sh tab="pnpm"
# check version
pnpm list discord.js
# uninstall and re-install
pnpm remove discord.js
pnpm add discord.js
```

## API version

discord.js v13 makes the switch to Discord API v9! In addition to this, the new major version also includes a bunch of cool new features.

## Slash commands

discord.js now has support for slash commands!
Refer to the [slash commands](/interactions/slash-commands.html) section of this guide to get started.

In addition to the `interactionCreate` event covered in the above guide, this release also includes the new Client events `applicationCommandCreate`, `applicationCommandDelete`, and `applicationCommandUpdate`.

## Message components

discord.js now has support for message components!
This introduces the `MessageActionRow`, `MessageButton`, and `MessageSelectMenu` classes, as well as associated interactions and collectors.

Refer to the [message components](/interactive-components/buttons.md) section of this guide to get started.

## Threads

discord.js now has support for threads! Threads are a new type of sub-channel that can be used to help separate conversations into a more meaningful flow.

This introduces the `ThreadManager` class, which can be found as `TextChannel#threads`, in addition to `ThreadChannel`, `ThreadMemberManager`, and `ThreadMember`. There are also five new events: `threadCreate`, `threadUpdate`, `threadDelete`, `threadListSync`, `threadMemberUpdate`, and `threadMembersUpdate`.

Refer to the [threads](/popular-topics/threads.html) section of this guide to get started.

## Voice

Support for voice has been separated into its own module. You now need to install and use [@discordjs/voice](https://github.com/discordjs/discord.js/tree/main/packages/voice) for interacting with the Discord Voice API.

Refer to the [voice](/voice/) section of this guide to get started.

## Customizable Manager caches

A popular request that has finally been heard - the `Client` class now has a new option, `makeCache`. It accepts a `CacheFactory`.

By combining this with the helper function `Options.cacheWithLimits`, users can define limits on each Manager's cache and let discord.js handle the rest.

```js
const client = new Client({
	makeCache: Options.cacheWithLimits({
		MessageManager: 200, // This is default
		PresenceManager: 0,
		// Add more class names here
	}),
});
```

Additional flexibility can be gained by providing a function which returns a custom cache implementation. Keep in mind this should still maintain the `Collection`/`Map`-like interface for internal compatibility.

```js
const client = new Client({
	makeCache: (manager) => {
		if (manager.name === 'MessageManager') return new LimitedCollection({ maxSize: 0 });
		return new Collection();
	},
});
```

## Commonly used methods that changed

### Sending messages, embeds, files, etc.

With the introduction of Interactions and it becoming far common for users to want to send an embed with MessageOptions, methods that send messages now enforce a single param.
This can be either a string, a `MessagePayload`, or that method's variant of `MessageOptions`.

Additionally, all messages sent by bots now support up to 10 embeds. As a result, the `embed` option was removed and replaced with an `embeds` array, which must be in the options object.

```diff
- channel.send(embed);
+ channel.send({ embeds: [embed, embed2] });

- channel.send('Hello!', { embed });
+ channel.send({ content: 'Hello!', embeds: [embed, embed2] });

- interaction.reply('Hello!', { ephemeral: true });
+ interaction.reply({ content: 'Hello!', ephemeral: true });
```

`MessageEmbed#attachFiles` has been removed; files should now be attached directly to the message instead of the embed.

```diff
- const embed = new Discord.MessageEmbed().setTitle('Attachments').attachFiles(['./image1.png', './image2.jpg']);
- channel.send(embed);
+ const embed = new Discord.MessageEmbed().setTitle('Attachments');
+ channel.send({ embeds: [embed], files: ['./image1.png', './image2.jpg'] });
```

The `code` and `split` options have also been removed. This functionality will now have to be handled manually, such as via the `Formatters.codeBlock` and `Util.splitMessage` helpers.

### Strings

Many methods in discord.js that were documented as accepting strings would also accept other types and resolve this into a string on your behalf. The results of this behavior were often undesirable, producing output such as `[object Object]`.

discord.js now enforces and validates string input on all methods that expect it. Users will need to manually call `toString()` or utilize template literals for all string inputs as appropriate.

The most common areas you will encounter this change in are: `MessageOptions#content`, the properties of a `MessageEmbed`, and passing objects such as users or roles, expecting them to be stringified.

```diff
- message.channel.send(user);
+ message.channel.send(user.toString());

let count = 5;
- embed.addField('Count', count);
+ embed.addField('Count', count.toString());
```

### Intents

As v13 makes the switch to Discord API v9, it is now **required** to specify all intents your bot uses in the Client constructor. The `intents` option has also moved from `ClientOptions#ws#intents` to `ClientOptions#intents`.

The shortcuts `Intents.ALL`, `Intents.NON_PRIVILEGED`, and `Intents.PRIVILEGED` have all been removed to discourage bad practices of enabling unused intents.

Refer to our more [detailed article about this topic](/popular-topics/intents.html).

```diff
- const client = new Client({ ws: { intents: [Intents.FLAGS.GUILDS] } });
+ const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
```

### Structures#extend

The concept of extendable Structures has been completely removed from discord.js.
For more information on why this decision was made, refer to [this pull request](https://github.com/discordjs/discord.js/pull/6027).

There is no swap-in replacement for this, as the intention is to change the code design rather than enable something equally bad.

For some real-world example of the alternatives provided in the PR, you may have been extending the `Guild` class with guild-specific settings:

```js
Structures.extend('Guild', (Guild) => {
	return class MyGuild extends Guild {
		constructor(client, data) {
			super(client, data);
			this.settings = {
				prefix: '!',
			};
		}
	};
});
```

This functionality can be replicated using the `WeakMap` or `Collection` example, even attaching it to the Client if necessary:

```js
client.guildSettings = new Collection();
client.guildSettings.set(guildId, { prefix: '!' });
// In practice, you would populate this Collection with data fetched from a database

const { prefix } = message.client.guildSettings.get(message.guild.id);
```

### Collectors

All Collector related classes and methods (both `.create*()` and `.await*()`) now take a single object parameter which also includes the filter.

```diff
- const collector = message.createReactionCollector(collectorFilter, { time: 15_000 });
+ const collector = message.createReactionCollector({ filter: collectorFilter, time: 15_000 });

- const reactions = await message.awaitReactions(collectorFilter, { time: 15_000 });
+ const reactions = await message.awaitReactions({ filter: collectorFilter, time: 15_000 });
```

### Naming conventions

Some commonly used naming conventions in discord.js have changed.

#### Thing#thingId

The casing of `thingID` properties has changed to `thingId`. This is a more-correct casing for the camelCase used by discord.js as `Id` is an abbreviation of Identifier, not an acronym.

This includes: `afkChannelId`, `applicationId`, `channelId`, `creatorId`, `guildId`, `lastMessageId`, `ownerId`, `parentId`, `partyId`, `processId`, `publicUpdatesChannelId`, `resolveId`, `rulesChannelId`, `sessionId`, `shardId`, `systemChannelId`, `webhookId`, `widgetChannelId`, and `workerId`.

```diff
- console.log(guild.ownerID);
+ console.log(guild.ownerId);

- console.log(interaction.channelID);
+ console.log(interaction.channelId);
```

#### Client#message

The `message` event has been renamed to `messageCreate`, to bring the library in line with Discord's naming conventions.
Using `message` will still work, but you'll receive a deprecation warning until you switch over.

```diff
- client.on("message", message => { ... });
+ client.on("messageCreate", message => { ... });
```

### Allowed Mentions

`clientOptions.disableMentions` has been removed and replaced with `clientOptions.allowedMentions`!
The Discord API now allows bots much more granular control over mention parsing, down to the specific id.

Refer to the [Discord API documentation](https://discord.com/developers/docs/resources/channel#allowed-mentions-object) for more information.

```diff
- const client = new Discord.Client({ disableMentions: 'everyone' });
+ const client = new Discord.Client({ allowedMentions: { parse: ['users', 'roles'], repliedUser: true } });
```

### Replies / Message#reply

`Message#reply` will no longer result in the bot prepending a user mention to the content, replacing the behavior with Discord's reply feature.

`MessageOptions#reply` no longer takes a user id. It has been replaced with a `ReplyOptions` type, expecting `MessageOptions#reply#messageReference` as a Message id.

```diff
- channel.send('content', { reply: '123456789012345678' }); // User id
+ channel.send({ content: 'content', reply: { messageReference: '765432109876543219' }}); // Message id
```

The new `MessageOptions.allowedMentions.repliedUser` boolean option determines if the reply will notify the author of the original message.

```diff
- message.reply('content')
+ message.reply({ content: 'content', allowedMentions: { repliedUser: false }})
```

Note that this will disable all other mentions in this message. To enable other mentions, you will need to include other `allowedMentions` fields. See the above "Allowed Mentions" section for more.

### Bitfields / Permissions

Bitfields are now `BigInt`s instead of `Number`s. This can be handled using the `BigInt()` class, or the n-suffixed [BigInt literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt).

```diff
- const p = new Permissions(104_324_673);
+ const p = new Permissions(BigInt(104_324_673));
+ const p = new Permissions(104_324_673n);
```

In addition, the usage of string literals for bitfield flags such as `Permissions` and `UserFlags` is discouraged; you should use the flag instead.

```diff
- permissions.has('SEND_MESSAGES')
+ permissions.has(Permissions.FLAGS.SEND_MESSAGES)
```

### DM Channels

On Discord API v8 and later, DM Channels do not emit the `CHANNEL_CREATE` event, which means discord.js is unable to cache them automatically. In order for your bot to receive DMs, the `CHANNEL` partial must be enabled.

### Webpack

Webpack builds are no longer supported.

## Changes and deletions

### ActivityType

The `CUSTOM_STATUS` type has been renamed to `CUSTOM`.

### APIMessage

The `APIMessage` class has been renamed to `MessagePayload`, resolving a naming clash with an interface in the `discord-api-types` library which represents raw message data objects.

### Channel

#### Channel#type

Channel types are now uppercase and align with Discord's naming conventions.

```diff
- if(channel.type === 'text') channel.send('Content');
+ if(channel.type === 'GUILD_TEXT') channel.send('Content');
```

### Client

#### Client#emojis

The Client Emoji manager is now a `BaseGuildEmojiManager`, providing cache resolution only and removing methods that would fail to create emojis as there was no Guild context.

#### Client#fetchApplication

The `Client#fetchApplication` method has been removed and replaced with the `Client#application` property.

```diff
- client.fetchApplication().then(application => console.log(application.name))
+ console.log(client.application.name);
```

#### Client#fetchWidget

This method has been renamed to `fetchGuildWidget` to better represent its functionality.

#### Client#generateInvite

`Client#generateInvite` no longer supports `PermissionsResolvable` as its argument, requiring `InviteGenerationOptions` instead.
This also requires that at least one of either `bot` or `applications.commands` is provided in `scopes` to generate a valid invite URL.

To generate an invite link with slash commands permissions:

```js
client.generateInvite({ scopes: ['applications.commands'] });
```

To generate an invite link for a bot and define required permissions:

```diff
- client.generateInvite([Permissions.FLAGS.SEND_MESSAGES]);
+ client.generateInvite({ scopes: ['bot'], permissions: [Permissions.FLAGS.SEND_MESSAGES] })
```

#### Client#login

Previously when a token had reached its 1000 login limit for the day, discord.js would treat this as a rate limit and silently wait to login again, but this was not communicated to the user.
This will now instead cause an error to be thrown.

#### Client#typingStart

The `Client#typingStart` event now only emits a `Typing` structure. Previously, `Channel` and `User` were emitted.

#### Client#setInterval

#### Client#setTimeout

The Client timeout methods have all been removed. These methods existed for the purpose of caching timeouts internally so they could be cleared when the Client is destroyed.
Since timers now have an `unref` method in Node, this is no longer required.

### ClientOptions

#### ClientOptions#fetchAllMembers

The `ClientOptions#fetchAllMembers` option has been removed.

With the introduction of gateway intents, the `fetchAllMembers` Client option would often fail and causes significant delays in ready states or even cause timeout errors.
As its purpose is contradictory to Discord's intentions to reduce scraping of user and presence data, it has been removed.

#### ClientOptions#messageCacheMaxSize

The `ClientOptions#messageCacheMaxSize` option has been removed. Instead, use [`ClientOptions#makeCache`](#customizable-manager-caches) to customize the `MessageManager` cache.

#### ClientOptions#messageEditHistoryMaxSize

The `ClientOptions#messageEditHistoryMaxSize` option has been removed.

To reduce caching, discord.js will no longer store an edit history. You will need to implement this yourself if required.

### ClientUser

#### ClientUser#setActivity

The `ClientUser#setActivity` method no longer returns a Promise.

#### ClientUser#setAFK

The `ClientUser#setAFK` method no longer returns a Promise.

#### ClientUser#setPresence

The `ClientUser#setPresence` method no longer returns a Promise.

`PresenceData#activity` was replaced with `PresenceData#activities`, which now requires an `Array<ActivitiesOptions>`.

```diff
- client.user.setPresence({ activity: { name: 'with discord.js' } });
+ client.user.setPresence({ activities: [{ name: 'with discord.js' }] });
```

#### ClientUser#setStatus

The `ClientUser#setStatus` method no longer returns a Promise.

### Collection

#### Collection#array()

#### Collection#keyArray()

These methods existed to provide access to a cached array of Collection values and keys respectively, which other Collection methods relied on internally.
Those other methods have been refactored to no longer rely on cache, so those arrays and these methods have been removed.

You should instead construct an array by spreading the iterators returned by the base Map class methods:

```diff
- collection.array();
+ [...collection.values()];

- collection.keyArray();
+ [...collection.keys()];
```

### ColorResolvable

Colors have been updated to align with the new Discord branding.

### Guild

#### Guild#addMember

This method has been removed, with functionality replaced by the new `GuildMemberManager#add`.

```diff
- guild.addMember(user, { accessToken: token });
+ guild.members.add(user, { accessToken: token });
```

#### Guild#fetchBan

#### Guild#fetchBans

These methods have been removed, with functionality replaced by the new `GuildBanManager`.

```diff
- guild.fetchBan(user);
+ guild.bans.fetch(user);

- guild.fetchBans();
+ guild.bans.fetch();
```

#### Guild#fetchInvites

This method has been removed, with functionality replaced by the new `GuildInviteManager`.

```diff
- guild.fetchInvites();
+ guild.invites.fetch();
```

#### Guild#fetchVanityCode

The `Guild#fetchVanityCode` method has been removed.

```diff
- Guild.fetchVanityCode().then(code => console.log(`Vanity URL: https://discord.gg/${code}`));
+ Guild.fetchVanityData().then(res => console.log(`Vanity URL: https://discord.gg/${res.code} with ${res.uses} uses`));
```

#### Guild#fetchWidget

The `Guild#fetchWidget()` method now retrieves the widget data for the guild instead of the widget settings. See `Client#fetchGuildWidget()`.
The original functionality has moved to the new method `Guild#fetchWidgetSettings()`.

#### Guild#member

The `Guild#member()` helper/shortcut method has been removed.

```diff
- guild.member(user);
+ guild.members.cache.get(user.id)
```

### Guild#mfaLevel

The `Guild#mfaLevel` property is now an enum.

### Guild#nsfw

The `Guild#nsfw` property has been removed, replaced by `Guild#nsfwLevel`.

#### Guild#owner

The `Guild#owner` property has been removed as it was unreliable due to caching, replaced with `Guild#fetchOwner`.

```diff
- console.log(guild.owner);
+ guild.fetchOwner().then(console.log);
```

#### Guild#setWidget

The `Guild#setWidget()` method has been renamed to `Guild#setWidgetSettings()`.

#### Guild#voice

The `Guild#voice` getter has been removed.

```diff
- guild.voice
+ guild.me.voice
```

### GuildChannel

#### GuildChannel#createOverwrite

This method has been removed, with functionality replaced by the new `PermissionOverwriteManager`.

```diff
- channel.createOverwrite(user, { VIEW_CHANNEL: false });
+ channel.permissionOverwrites.create(user, { VIEW_CHANNEL: false });
```

#### GuildChannel#createInvite

#### GuildChannel#fetchInvites

These methods have been removed from `GuildChannel` and placed only on subclasses for which invites can be created. These are `TextChannel`, `NewsChannel`, `VoiceChannel`, `StageChannel`, and `StoreChannel`.

On these subclasses, the method now supports additional options:

- `targetUser` to target the invite to join a particular streaming user
- `targetApplication` to target the invite to a particular Discord activity
- `targetType` defines the type of the target for this invite; user or application

#### GuildChannel#overwritePermissions

This method has been removed, with functionality replaced by the new `PermissionOverwriteManager`.

```diff
- channel.overwritePermissions([{ id: user.id , allow: ['VIEW_CHANNEL'], deny: ['SEND_MESSAGES'] }]);
+ channel.permissionOverwrites.set([{ id: user.id , allow: ['VIEW_CHANNEL'], deny: ['SEND_MESSAGES'] }]);
```

#### GuildChannel#permissionOverwrites

This method no longer returns a Collection of PermissionOverwrites, instead providing access to the `PermissionOverwriteManager`.

#### GuildChannel#setTopic

The `GuildChannel#setTopic` method has been removed and placed only on subclasses for which topics can be set. These are `TextChannel`, `NewsChannel`, and `StageChannel`.

#### GuildChannel#updateOverwrite

This method has been removed, with functionality replaced by the new `PermissionOverwriteManager`.

```diff
- channel.updateOverwrite(user, { VIEW_CHANNEL: false });
+ channel.permissionOverwrites.edit(user, { VIEW_CHANNEL: false });
```

### GuildMember

#### GuildMember#ban

`GuildMember#ban()` will throw a TypeError when a string is provided instead of an options object.

```diff
- member.ban('reason')
+ member.ban({ reason: 'reason' })
```

#### GuildMember#hasPermission

The `GuildMember#hasPermission` shortcut/helper method has been removed.

```diff
- member.hasPermission(Permissions.FLAGS.SEND_MESSAGES);
+ member.permissions.has(Permissions.FLAGS.SEND_MESSAGES);
```

#### GuildMember#lastMessage

#### GuildMember#lastMessageId

#### GuildMember#lastMessageChannelId

None of these properties were actually provided by Discord, instead relying on potentially inaccurate client cache, and have been removed.

#### GuildMember#presence

The `GuildMember#presence` property can now be null, rather than a generic offline presence, such as when the `GUILD_PRESENCES` intent is not enabled.

### GuildMemberManager

#### GuildMemberManager#ban

The `GuildMemberManager#ban` method will throw a TypeError when a string is provided instead of an options object.

```diff
- guild.members.ban('123456789012345678', 'reason')
+ guild.members.ban('123456789012345678', { reason: 'reason' })
```

### Message / MessageManager

#### Message#delete

The `Message.delete()` method no longer accepts any options, requiring a timed-delete to be performed manually.

```diff
- message.delete({ timeout: 10_000 });
+ setTimeout(() => message.delete(), 10_000);
```

`reason` is no longer a parameter as it is not used by the API.

#### MessageManager#delete

The `MessageManager.delete()` method no longer accepts any additional options, requiring a timed-delete to be performed manually.

```diff
- channel.messages.delete('123456789012345678', { timeout: 10_000 });
+ setTimeout(() => channel.messages.delete('123456789012345678'), 10_000);
```

`reason` is no longer a parameter as it is not used by the API.

#### Message#edits

The `Message#edits` property has been removed.

### MessageEmbed

#### MessageEmbed#attachFiles

The `MessageEmbed#attachFiles` method has been removed. Instead, files should be attached to the Message directly via `MessageOptions`.

```diff
- channel.send({ embeds: [new MessageEmbed().setTitle("Files").attachFiles(file)] })
+ channel.send({ embeds: [new MessageEmbed().setTitle("Files")], files: [file] })
```

### Permissions

#### Permissions#FLAGS.MANAGE_EMOJIS

`Permissions.FLAGS.MANAGE_EMOJIS` is now `Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS`.

### ReactionUserManager

#### ReactionUserManager#fetch

The `before` option has been removed as it was not supported by the API.

### RoleManager

#### RoleManager#create

The options passed to `RoleManager#create` no longer need to be nested in a `data` object.
Additionally, `reason` is now part of the options, not a second parameter.

```diff
- guild.roles.create({ data: { name: "New role" } }, "Creating new role");
+ guild.roles.create({ name: "New role", reason: "Creating new role" })
```

#### RoleManager#fetch

The `RoleManager#fetch()` method will now return a Collection instead of a RoleManager when called without params.

### Shard

#### Shard#respawn

The options for the `Shard#respawn` method are now an object instead of separate params.
In addition, the `spawnTimeout` param has been renamed to `timeout`.
This means the user no longer needs to pass defaults to fill each positional param.

```diff
- shard.respawn(500, 30_000);
+ shard.respawn({ delay: 500, timeout: 30_000 });
```

#### Shard#spawn

The `spawnTimeout` param has been renamed to `timeout`.

### ShardClientUtil

#### ShardClientUtil#broadcastEval

The `ShardClientUtil#broadcastEval` method no longer accepts a string, instead expecting a function.

```diff
- client.shard.broadcastEval('this.guilds.cache.size')
+ client.shard.broadcastEval(client => client.guilds.cache.size)
		.then(results => console.log(`${results.reduce((prev, val) => prev + val, 0)} total guilds`))
		.catch(console.error);
```

#### ShardClientUtil#respawnAll

The options for the `ShardClientUtil#respawnAll` method are now an object instead of separate params.
In addition, the `spawnTimeout` param has been renamed to `timeout`.
This means the user no longer needs to pass defaults to fill each positional param.

```diff
- client.shard.respawnAll(5_000, 500, 30_000);
+ client.shard.respawnAll({ shardDelay: 5_000, respawnDelay: 500, timeout: 30_000 });
```

### ShardingManager

#### ShardingManager#broadcastEval

The `ShardingManager#broadcastEval` method no longer accepts a string, instead expecting a function. See `ShardClientUtil#broadcastEval`.

#### ShardingManager#spawn

The options for the `ShardingManager#spawn` method are now an object instead of separate params.
In addition, the `spawnTimeout` param has been renamed to `timeout`.
This means the user no longer needs to pass defaults to fill each positional param.

```diff
- manager.spawn('auto', 5_500, 30_000);
+ manager.spawn({ amount: 'auto', delay: 5_500, timeout: 30_000 });
```

#### ShardingManager#respawnAll

The options for the `ShardingManager#respawnAll` method are now an object instead of separate params.
In addition, the `spawnTimeout` param has been renamed to `timeout`.
This means the user no longer needs to pass defaults to fill each positional param.

```diff
- manager.respawnAll(5_000, 500, 30_000);
+ manager.respawnAll({ shardDelay: 5_000, respawnDelay: 500, timeout: 30_000 });
```

### TextChannel

#### TextChannel#startTyping

#### TextChannel#stopTyping

These methods have both been replaced by a singular `TextChannel.sendTyping()`. This method automatically stops typing after 10 seconds, or when a message is sent.

### User

#### User#lastMessage

#### User#lastMessageId

Neither of these properties were actually provided by Discord, instead relying on potentially inaccurate client cache, and have been removed.

#### User#locale

The `User.locale` property has been removed, as this property is not exposed to bots.

#### User#presence

The `User.presence` property has been removed. Presences are now only found on `GuildMember`.

#### User#typingIn

As discord.js no longer caches typing event data, the `User.typingIn()` method has been removed.

#### User#typingSinceIn

As discord.js no longer caches typing event data, the `User.typingSinceIn()` method has been removed.

#### User#typingDurationIn

As discord.js no longer caches typing event data, the `User.typingDurationIn()` method has been removed.

### UserFlags

The deprecated UserFlags `DISCORD_PARTNER` and `VERIFIED_DEVELOPER` / `EARLY_VERIFIED_DEVELOPER` have been removed in favor of their renamed versions.

```diff
- user.flags.has(UserFlags.FLAGS.DISCORD_PARTNER)
+ user.flags.has(UserFlags.FLAGS.PARTNERED_SERVER_OWNER)

- user.flags.has(UserFlags.FLAGS.VERIFIED_DEVELOPER)
+ user.flags.has(UserFlags.FLAGS.EARLY_VERIFIED_BOT_DEVELOPER)
```

The new flag `DISCORD_CERTIFIED_MODERATOR` has been added.

### Util

Shortcuts to Util methods which were previously exported at the top level have been removed.

#### Util#convertToBuffer

#### Util#str2ab

Both were removed in favor of Node's built-in Buffer methods.

#### Util#fetchRecommendedShards

The `Util#fetchRecommendedShards()` method now supports an additional option `multipleOf` to calculate the number to round up to, e.g. a multiple of 16 for large bot sharding.

#### Util#resolveString

The `Util#resolveString` method has been removed. discord.js now enforces that users provide strings where expected rather than resolving one on their behalf.

### VoiceState

#### VoiceState#kick

The `VoiceState#kick` method has been renamed to `VoiceState#disconnect`.

### WebhookClient

The `WebhookClient` constructor no longer accepts `id, token` as the first two parameters, instead taking a `data` object. This object supports an additional option `url`, allowing creation of a `WebhookClient` from a webhook URL.

```diff
- new WebhookClient(id, token, options);
+ new WebhookClient({ id, token }, options);

+ new WebhookClient({ url }, options);
```

## Additions

### ActivityTypes

A new activity type `COMPETING` has been added.

### ApplicationCommand

Provides API support for slash commands.

### ApplicationCommandManager

Provides API support for creating, editing and deleting slash commands.

### ApplicationCommandPermissionsManager

Provides API support for creating, editing, and deleting permission overwrites on slash commands.

### ApplicationFlags

Provides an enumerated bitfield for `ClientApplication` flags.

### BaseGuild

The new `BaseGuild` class is extended by both `Guild` and `OAuth2Guild`.

### BaseGuildTextChannel

The new `BaseGuildTextChannel` class is extended by both `TextChannel` and `NewsChannel`.

### BaseGuildVoiceChannel

The new `BaseGuildVoiceChannel` class is extended by both `VoiceChannel` and `StageChannel`.

### ButtonInteraction

Provides gateway support for a `MessageComponentInteraction` coming from a button component.

### Channel

#### Channel#isText()

Checks and typeguards if a channel is Text-Based; one of `TextChannel`, `DMChannel`, `NewsChannel` or `ThreadChannel`.

#### Channel#isThread()

Checks and typeguards if a channel is a `ThreadChannel`.

#### Channel#isVoice()

Checks and typeguards if a channel is Voice-Based; `VoiceChannel` or `StageChannel`.

### Client

#### Client#applicationCommandCreate

Emitted when a guild application command is created.

#### Client#applicationCommandDelete

Emitted when a guild application command is deleted.

#### Client#applicationCommandUpdate

Emitted when a guild application command is updated.

#### Client#interactionCreate

Emitted when an interaction is created.

#### Client#stageInstanceCreate

Emitted when a stage instance is created.

#### Client#stageInstanceDelete

Emitted when a stage instance is deleted.

#### Client#stageInstanceUpdate

Emitted when a stage instance gets updated, e.g. change in topic or privacy level.

#### Client#stickerCreate

Emitted when a custom sticker is created in a guild.

#### Client#stickerDelete

Emitted when a custom sticker is deleted in a guild.

#### Client#stickerUpdate

Emitted when a custom sticker is updated in a guild.

#### Client#threadCreate

Emitted when a thread is created or when the client user is added to a thread.

#### Client#threadDelete

Emitted when a thread is deleted.

#### Client#threadListSync

Emitted when the client user gains access to a text or news channel that contains threads.

#### Client#threadMembersUpdate

Emitted when members are added or removed from a thread. Requires the `GUILD_MEMBERS` privileged intent.

#### Client#threadMemberUpdate

Emitted when the client user's thread member is updated.

#### Client#threadUpdate

Emitted when a thread is updated, e.g. name change, archive state change, locked state change.

### ClientOptions

#### ClientOptions#failIfNotExists

This parameter sets the default behavior for `ReplyMessageOptions#failIfNotExists`, allowing or preventing an error when replying to an unknown Message.

### CollectorOptions

#### CollectorOptions#filter

This parameter is now optional and will fall back to a function that always returns true if not provided.

### CommandInteraction

Provides gateway support for slash command interactions.
For more information refer to the [slash commands](/interactions/registering-slash-commands.html) section of the guide.

### Guild

#### Guild#bans

Provides access to the Guild's `GuildBanManager`.

#### Guild#create

`Guild#systemChannelFlags` can now be set in the `Guild#create` method.

#### Guild#edit

The `Guild#description` and `Guild#features` properties can now be edited.

#### Guild#editWelcomeScreen

Provides API support for bots to edit the Guild's `WelcomeScreen`.

#### Guild#emojis

The `GuildEmojiManager` class now extends `BaseGuildEmojiManager`.
In addition to the existing methods, it now supports `GuildEmojiManager#fetch`.

#### Guild#fetchWelcomeScreen

Provides API support for fetching the Guild's `WelcomeScreen`.

#### Guild#fetchWidget

Provides API support for the Guild's Widget, containing information about the guild and its members.

#### Guild#invites

Provides access to the new `GuildInviteManager`.

#### Guild#nsfwLevel

The `Guild#nsfwLevel` property is now represented by the `NSFWLevel` enum.

#### Guild#premiumTier

The `Guild#premiumTier` property is now represented by the `PremiumTier` enum.

#### Guild#setChannelPositions

Now supports setting the parent of multiple channels, and locking their permissions via the `ChannelPosition#parent` and `ChannelPosition#lockPermissions` options.

### GuildBanManager

Provides improved API support for handling and caching bans.

Starting from 13.11, developers should utilise `deleteMessageSeconds` instead of `days`:

```diff
<GuildBanManager>.create('123456789', {
-  days: 3
+  deleteMessageSeconds: 3 * 24 * 60 * 60
});
```

`days` is deprecated and will be removed in the future.

### GuildChannel

#### GuildChannel#clone

Now supports setting the `position` property.

### GuildChannelManager

#### GuildChannelManager#fetch

Now supports fetching the channels of a Guild.

#### GuildChannelManager#fetchActiveThreads

Retrieves a list of the active threads in a Guild.

### GuildInviteManager

Aligns support for creating and fetching invites with the managers design.
This replaces `Guild#fetchInvites`.

### GuildManager

#### GuildManager#create

Now supports specifying the AFK and system channels when creating a new guild.

#### GuildManager#fetch

Now supports fetching multiple guilds, returning a `Promise<Collection<Snowflake, OAuth2Guild>>` if used in this way.

### GuildEmojiManager

#### GuildEmojiManager#fetch

Provides API support for the `GET /guilds/{guild.id}/emojis` endpoint.

### GuildMember

#### GuildMember#pending

Flags whether a member has passed the guild's membership gate.
The flag is `true` before accepting and fires `guildMemberUpdate` when the member accepts.

### GuildMemberManager

Several methods were added to `GuildMemberManager` to provide API support for uncached members.

#### GuildMemberManager#edit

`guild.members.edit('123456789012345678', data, reason)` is equivalent to `GuildMember#edit(data, reason)`.

#### GuildMemberManager#kick

`guild.members.kick('123456789012345678', reason)` is equivalent to `GuildMember#kick(reason)`.

#### GuildMemberManager#search

Provides API support for querying GuildMembers via the REST API endpoint.
`GuildMemberManager#fetch` uses the websocket gateway to receive data.

### GuildMemberRoleManager

#### GuildMemberRoleManager#botRole

Gets the managed role this member created when joining the guild if any.

#### GuildMemberRoleManager#premiumSubscriberRole

Gets the premium subscriber (booster) role if present on the member.

### GuildPreview

#### GuildPreview#createdAt

#### GuildPreview#createdTimestamp

The datetime at which the GuildPreview was created.

### GuildTemplate

Provides API support for [server templates](https://discord.com/developers/docs/resources/guild-template).

### Integration

#### Integration#roles

A Collection of Roles which are managed by the integration.

### Interaction

Provides gateway support for slash command and message component interactions.

For more information refer to the [slash commands](/interactions/slash-commands.md#replying-to-slash-commands) and [message components](/interactive-components/buttons) sections of the guide.

### InteractionCollector

Provides a way for users to collect any type of Interaction.
This class has a more flexible design than other Collectors, able to be bound to any Guild, Channel, or Message as appropriate.
TypeScript developers can also leverage generics to define the subclass of Interaction that will be returned.

### InteractionWebhook

Provides webhook support specifically for interactions, due to their unique qualities.

### InviteGuild

Provides API support for the partial Guild data available from an `Invite`.

### InviteStageInstance

Provides API support for bots to inviting users to stage instances.

### Message

#### Message#awaitMessageComponent

A shortcut method to create a promisified `InteractionCollector` which resolves to a single `MessageComponentInteraction`.

#### Message#createMessageComponentCollector

A shortcut method to create an `InteractionCollector` for components on a specific message.

#### Message#crosspostable

Checks permissions to see if a Message can be crossposted.

#### Message#edit

Editing and/or removing attachments when editing a Message is now supported.

#### Message#fetchReference

Provides support for fetching the Message referenced by `Message#reference`, if the client has access to do so.

#### Message#react

Now supports both `<:name:id>` and `<a:name:id>` as valid inputs.

#### Message#removeAttachments

Removes the attachments from a message. Requires `MANAGE_MESSAGES` to remove attachments from messages authored by other users.

#### Message#startThread

Starts a `ThreadChannel` using this message as the starter message.

#### Message#stickers

A Collection of Stickers in the message.

### MessageActionRow

A builder class which makes constructing action row type message components easier.

### MessageAttachment

#### MessageAttachment#contentType

The media type of a MessageAttachment.

### MessageButton

A builder class which makes constructing button type message components easier.

### MessageComponentInteraction

Provides gateway support for receiving interactions from message components. Subclass of `Interaction`.

### MessageEmbed

#### MessageEmbed#setFields

Replaces all fields in the embed with the new array of fields provided.

`embed.setFields(newFields)` is equivalent to `embed.spliceFields(0, embed.fields.length, newFields)`.

### MessageManager

Methods were added to `MessageManager` to provide API support for uncached messages.

#### MessageManager#crosspost

`channel.messages.crosspost('876543210987654321')` is equivalent to `message.crosspost()`.

#### MessageManager#edit

`channel.messages.edit('876543210987654321', content, options)` is equivalent to `message.edit(content, options)`.

#### MessageManager#pin

`channel.messages.pin('876543210987654321', options)` is approximately equivalent to `message.pin(options)` but does not resolve to a Message.

#### MessageManager#react

`channel.messages.react('876543210987654321', emoji)` is approximately equivalent to `message.react(emoji)` but does not resolve to a MessageReaction.

#### MessageManager#unpin

`channel.messages.unpin('876543210987654321', options)` is approximately equivalent to `message.unpin(options)` but does not resolve to a Message.

### MessageMentions

#### MessageMentions#repliedUser

Checks if the author of a message being replied to has been mentioned.

### MessagePayload

This class has been renamed from APIMessage.
Global headers can now be set in the HTTP options.

### MessageSelectMenu

A builder class which makes constructing select menu type message components easier.

### NewsChannel

#### NewsChannel#addFollower

Provides API support for bots to follow announcements in other channels.

#### NewsChannel#setType

Allows conversion between NewsChannel and TextChannel.

### Permissions

#### Permissions#STAGE_MODERATOR

Static bitfield representing the permissions required to moderate a stage channel.

### PermissionOverwriteManager

Replaces the `createOverwrite`, `updateOverwrite`, and `overwritePermissions` methods of `GuildChannel`, aligning the design with other Managers.

### Role

#### Role#tags

Tags for roles belonging to bots, integrations, or premium subscribers.

### RoleManager

#### RoleManager#botRoleFor

Gets the managed role a bot created when joining the guild, if any.

#### RoleManager#edit

`guild.roles.edit('123456789098765432', options)` is equivalent to `role.edit(options)`.

#### RoleManager#premiumSubscriberRole

Gets the premium subscriber (booster) role for the Guild, if any.

### SelectMenuInteraction

Provides gateway support for a `MessageComponentInteraction` coming from a select menu component.

### StageChannel

Provides API support for stage channels.

### StageInstance

Provides API support for stage instances. Stage instances contain information about live stages.

### StageInstanceManager

Provides API support for the bot to create, edit, and delete live stage instances, and stores a cache of stage instances.

### Sticker

Provides API support for Discord Stickers.

### StickerPack

Provides API support for Discord Sticker packs.

### TextChannel

#### TextChannel#awaitMessageComponent

A shortcut method to create a promisified `InteractionCollector` which resolves to a single `MessageComponentInteraction`.

#### TextChannel#createMessageComponentCollector

A shortcut method to create an `InteractionCollector` for components on a specific channel.

#### TextChannel#setType

Allows conversion between `TextChannel` and `NewsChannel`.

#### TextChannel#threads

Provides access to the `ThreadManager` for this channel.

### ThreadChannel

Provides API support for thread channels.

### ThreadChannelManager

Provides API support for the bot to create, edit, and delete threads, and stores a cache of `ThreadChannels`.

### ThreadMember

Represent a member of a thread and their thread-specific metadata.

### ThreadMemberManager

Provides API support for the bot to add and remove members from threads, and stores a cache of `ThreadMembers`.

### Typing

Represents a typing state for a user in a channel.

### Webhook

#### Webhook#deleteMessage

Webhooks can now delete messages that were sent by the Webhook.

#### Webhook#editMessage

Webhooks can now edit messages that were sent by the Webhook.

#### Webhook#fetchMessage

Webhooks can now fetch messages that were sent by the Webhook.

#### Webhook#sourceChannel

#### Webhook#sourceGuild

Webhooks can now have a `sourceGuild` and `sourceChannel` if the message is being crossposted.

### WelcomeChannel

Represents the channels that can be seen in a Guild's `WelcomeScreen`.

### WelcomeScreen

Provides API support for a Guild's welcome screen.

### Widget

Represents a Guild's widget.

### WidgetMember

Partial information about a guild's members stored in a widget.

### Util

#### Formatters

A number of new formatter functions are provided in the Util class, to easily handle adding markdown to strings.

#### Util#resolvePartialEmoji

A helper method that attempts to resolve properties for a raw emoji object from input data, without the use of the discord.js Client class or its EmojiManager.

#### Util#verifyString

A helper method which is used to internally validate string arguments provided to methods in discord.js.
