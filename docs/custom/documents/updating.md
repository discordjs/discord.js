# About Version 9
The version 9 (v9) rewrite takes a much more object-oriented approach than previous versions,
which allows your code to be much more readable and manageable.
It's been rebuilt from the ground up and should be much more stable, fixing caching issues that affected
older versions. It also has support for newer Discord Features, such as emojis.

## Upgrading your code
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

## Callbacks
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
