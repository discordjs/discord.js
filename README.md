<p align="center">
  <a href="https://hydrabolt.github.io/discord.js">
    <img alt="discord.js" src="http://hydrabolt.github.io/discord.js/res/logo.png" width="546">
  </a>
</p>

## Welcome to the rewrite branch!

The rewrite branch was created as a way of completely rewriting the API (once again) for complete stability. Versions <= 4.1.1 of the API would _always_ eventually crash for one reason or another.

So far, the rewrite branch seems to have achieved what was wanted, as it is much more stable and can handle mass joining and leaving of servers. Users, channels and servers are always cached properly, and the only time of expected crashes are when an error occurs in the WebSocket.

You can start using the rewrite branch, but it is a breaking change. The documentation isn't done, but H
here is the main notable change:

```js
// old method:
client.getUser("id", 12);
client.getChannel("id", 12);
client.getServer("id", 12);
	// etc...
	
// new method:
client.users.get("id", 12);
client.channels.get("id", 12);
client.servers.get("id", 12);
```