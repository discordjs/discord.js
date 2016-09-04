# About Version 9.0
The 9.0 rewrite takes a much more OOP approach than previous versions, which allows code to be much more manageable.
It's been rebuilt from the ground up and should be much more stable, fixing caching issues that affected
older versions and it also has support for new Discord Features, such as emojis.

## Upgrading your code
Version 9, while containing a number of breaking changes, does not require a lot of changes in the code logic. 
It does, however, require changes in some of the method changes. This is because most of the methods have been
moved away from the <Client> class into other classes where they belong.

Here are a few examples of methods that has changed: 

* `Client.sendMessage(channel, message)` ==> `TextChannel.sendMessage(message)`
  * `Client.sendMessage(user, message)` ==> `User.sendMessage(message)`
* `Client.updateMessage(message, "New content")` ==> `Message.edit("New Content")`
* `Client.getChannelLogs(channel, limit)` ==> `TextChannel.fetchMessages({options})`
* `Server.detailsOfUser(User)` ==> `Server.members.get(User).properties` (retrieving a member gives a GuildMember object)
* `Client.joinVoiceChannel(voicechannel)` => `VoiceChannel.join()`

A couple more important details: 

* `Client.loginWithToken("token")` ==> `client.login("token")`
* `Client.servers.length` ==> `client.guilds.size` (all instances of `server` are now `guild`)

## Callbacks

Version 9.0 eschews callbacks in favour of Promises. This means all code relying on callbacks must be changed.

For example, the following code: 

```js
bot.getChannelLogs(channel, 100, function(messages) {
  console.log(`${messages.length} messages found`);
});
```

```js
msg.channel.getMessages({limit: 100})
.then(messages => {
  console.log(`${messages.length} messages found`);
});
```
