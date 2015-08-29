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

### Links
**[Documentation](https://github.com/discord-js/discord.js/wiki/Documentation)**

**[GitHub](https://github.com/discord-js/discord.js)**

**[Wiki](https://github.com/discord-js/discord.js/wiki)**

**[Website](http://discord-js.github.io/)**

**[NPM](npmjs.com/package/discord.js)**

---

### Contact

If you would like to contact me, you can create an issue on the GitHub repo
or send a DM to **hydrabolt** in [Discord API](https://discord.gg/0SBTUU1wZTY66OLO).