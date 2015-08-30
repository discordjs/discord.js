# discord.js

[![Build Status](https://travis-ci.org/hydrabolt/discord.js.svg)](https://travis-ci.org/hydrabolt/discord.js)

discord.js is a node module used as a way of interfacing with
[Discord](https://discordapp.com/). It is a very useful module for creating
bots.

**Updating to 3.1.1 is essential as it has new changes to be compatible with Discord's API,
and to make sure your application still works an update is a good idea.**

### Installation
`npm install --save discord.js`

---

### Example
```js
var Discord = require("discord.js");

var mybot = new Discord.Client();

mybot.on("message", function(message){
	
	if(message.content === "ping")
		mybot.reply(message, "pong");
	
});

mybot.login("email", "password");
```
---

### Related Projects

Here is a list of other Discord APIs:

#### Java:
[Discord4J](https://github.com/nerd/Discord4J)
#### .NET:
[Discord.Net](https://github.com/RogueException/Discord.Net)

[DiscordSharp](https://github.com/Luigifan/DiscordSharp)
#### NodeJS
[node-discord](https://github.com/izy521/node-discord) (similar to discord.js but lower level)

#### PHP
[DiscordPHP](https://github.com/teamreflex/DiscordPHP)

#### Python
[discord.py](https://github.com/Rapptz/discord.py)

#### Ruby
[discordrb](https://github.com/meew0/discordrb)

---

### Changes in 3.1.4

No, not π. But instead, pseduo-synchronous messaging was added! This means that
you can tell your Client to make a queue of "actions" per channel, and it will
work through them one by one. This is a really useful tool if you need to send
messages in a specific order without callback hell.

It also allows you to store responses - such as created messages - in the returned
promise - named action. Example:

```js
var mybot = new Discord.Client({
    	queue : true //enable queueing, disabled by default
});

mybot.on("message", function(msg){
	
	mybot.sendMessage(msg.channel, "this is message 1");
	var action = mybot.sendMessage(msg.channel, "this is message 2");
	mybot.sendMessage(msg.channel, "this is message 3").then(rmv);
	
	function rmv(){
	    if(!action.error){
			mybot.deleteMessage(action.message);	
		}	
	}
	
});
```

This is still in development, and will see many more enhancements in future.

---

### Links
**[Documentation](https://github.com/discord-js/discord.js/wiki/Documentation)**

**[GitHub](https://github.com/discord-js/discord.js)**

**[Wiki](https://github.com/discord-js/discord.js/wiki)**

**[Website](http://discord-js.github.io/)**

**[NPM](npmjs.com/package/discord.js)**

---

### Contact

If you would like to contact me, you can create an issue on the GitHub repo
or send a DM to **hydrabolt** in [Discord API](https://discord.gg/0SBTUU1wZTYd2XyW).
