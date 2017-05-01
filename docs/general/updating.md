# Version 11.1.0
v11.1.0 features improved voice and gateway stability, as well as support for new features such as audit logs and searching for messages.
See [the changelog](https://github.com/hydrabolt/discord.js/releases/tag/11.1.0) for a full list of changes, including
information about deprecations.

# Version 11
Version 11 contains loads of new and improved features, optimisations, and bug fixes.
See [the changelog](https://github.com/hydrabolt/discord.js/releases/tag/11.0.0) for a full list of changes.

## Significant additions
* Message Reactions and Embeds (rich text)
* Support for uws and erlpack for better performance
* OAuthApplication support
* Web distributions

## Breaking changes
### Client.login() no longer supports logging in with email + password
Logging in with an email and password has always been heavily discouraged since the advent of proper token support, but in v11 we have made the decision to completely remove the functionality, since Hammer & Chisel have [officially stated](https://github.com/hammerandchisel/discord-api-docs/issues/69#issuecomment-223886862) it simply shouldn't be done.

User accounts can still log in with tokens just like bot accounts. To obtain the token for a user account, you can log in to Discord with that account, and use Ctrl + Shift + I to open the developer tools. In the console tab, evaluating `localStorage.token` will give you the token for that account.

### ClientUser.setEmail()/setPassword() now require the current password, as well as setUsername() on user accounts
Since you can no longer log in with email and password, you must provide the current account password to the `setEmail()`, `setPassword()`, and `setUsername()` methods for user accounts (self-bots).

### Removed TextBasedChannel.sendTTSMessage()
This method was deemed to be an entirely pointless shortcut that virtually nobody even used.
The same results can be achieved by passing options to `send()` or `sendMessage()`.

Example:
```js
channel.send('Hi there', { tts: true });
```

### Using Collection.find()/exists() with IDs will throw an error
This is simply to help prevent a common mistake that is made frequently.
To find something or check its existence using an ID, you should use `.get()` and `.has()` which are part of the [ES6 Map class](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Map), which Collection is an extension of.

# Version 10
Version 10's non-BC changes focus on cleaning up some inconsistencies that exist in previous versions.
Upgrading from v9 should be quick and painless.

## Client options
All client options have been converted to camelCase rather than snake_case, and `max_message_cache` was renamed to `messageCacheMaxSize`.

v9 code example:
```js
const client = new Discord.Client({
  disable_everyone: true,
  max_message_cache: 500,
  message_cache_lifetime: 120,
  message_sweep_interval: 60
});
```

v10 code example:
```js
const client = new Discord.Client({
  disableEveryone: true,
  messageCacheMaxSize: 500,
  messageCacheLifetime: 120,
  messageSweepInterval: 60
});
```

## Presences
Presences have been completely restructured.
Previous versions of discord.js assumed that users had the same presence amongst all guilds - with the introduction of sharding, however, this is no longer the case.

v9 discord.js code may look something like this:
```js
User.status; // the status of the user
User.game; // the game that the user is playing
ClientUser.setStatus(status, game, url); // set the new status for the user
```

v10 moves presences to GuildMember instances. For the sake of simplicity, though, User classes also expose presences.
When accessing a presence on a User object, it simply finds the first GuildMember for the user, and uses its presence.
Additionally, the introduction of the Presence class keeps all of the presence data organised.

**It is strongly recommended that you use a GuildMember's presence where available, rather than a User.
A user may have an entirely different presence between two different guilds.**

v10 code:
```js
MemberOrUser.presence.status; // the status of the member or user
MemberOrUser.presence.game; // the game that the member or user is playing
ClientUser.setStatus(status); // online, idle, dnd, offline
ClientUser.setGame(game, streamingURL); // a game
ClientUser.setPresence(fullPresence); // status and game combined
```

## Voice
Voice has been rewritten internally, but in a backwards-compatible manner.
There is only one breaking change here; the `disconnected` event was renamed to `disconnect`.
Several more events have been made available to a VoiceConnection, so see the documentation.

## Events
Many events have been renamed or had their arguments change.

### Client events
|    Version   9                                       |    Version   10                               |
|------------------------------------------------------|-----------------------------------------------|
|    guildMemberAdd(guild, member)                     |    guildMemberAdd(member)                     |
|    guildMemberAvailable(guild, member)               |    guildMemberAvailable(member)               |
|    guildMemberRemove(guild, member)                  |    guildMemberRemove(member)                  |
|    guildMembersChunk(guild, members)                 |    guildMembersChunk(members)                 |
|    guildMemberUpdate(guild, oldMember, newMember)    |    guildMemberUpdate(oldMember, newMember)    |
|    guildRoleCreate(guild, role)                      |    roleCreate(role)                           |
|    guildRoleDelete(guild, role)                      |    roleDelete(role)                           |
|    guildRoleUpdate(guild, oldRole, newRole)          |    roleUpdate(oldRole, newRole)               |

The guild parameter that has been dropped from the guild-related events can still be derived using `member.guild` or `role.guild`.

### VoiceConnection events
| Version 9    | Version 10 |
|--------------|------------|
| disconnected | disconnect |

## Dates and timestamps
All dates/timestamps on the structures have been refactored to have a consistent naming scheme and availability.
All of them are named similarly to this:  
**Date:** `Message.createdAt`  
**Timestamp:** `Message.createdTimestamp`  
See the docs for each structure to see which date/timestamps are available on them.


# Version 9
The version 9 (v9) rewrite takes a much more object-oriented approach than previous versions,
which allows your code to be much more readable and manageable.
It's been rebuilt from the ground up and should be much more stable, fixing caching issues that affected
older versions. It also has support for newer Discord Features, such as emojis.

Version 9, while containing a sizable number of breaking changes, does not require much change in your code's logic -
most of the concepts are still the same, but loads of functions have been moved around.
The vast majority of methods you're used to using have been moved out of the Client class,
into other more relevant classes where they belong.
Because of this, you will need to convert most of your calls over to the new methods.

Here are a few examples of methods that have changed:
* `Client.sendMessage(channel, message)` ==> `TextChannel.sendMessage(message)`
  * `Client.sendMessage(user, message)` ==> `User.sendMessage(message)`
* `Client.updateMessage(message, "New content")` ==> `Message.edit("New Content")`
* `Client.getChannelLogs(channel, limit)` ==> `TextChannel.fetchMessages({options})`
* `Server.detailsOfUser(User)` ==> `Server.members.get(User).properties` (retrieving a member gives a GuildMember object)
* `Client.joinVoiceChannel(voicechannel)` => `VoiceChannel.join()`

A couple more important details:
* `Client.loginWithToken("token")` ==> `client.login("token")`
* `Client.servers.length` ==> `client.guilds.size` (all instances of `server` are now `guild`)

## No more callbacks!
Version 9 eschews callbacks in favour of Promises. This means all code relying on callbacks must be changed.  
For example, the following code:

```js
client.getChannelLogs(channel, 100, function(messages) {
  console.log(`${messages.length} messages found`);
});
```

```js
channel.fetchMessages({limit: 100}).then(messages => {
  console.log(`${messages.size} messages found`);
});
```
