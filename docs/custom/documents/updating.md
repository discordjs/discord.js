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
