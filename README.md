<p align="center">
  <a href="https://hydrabolt.github.io/discord.js">
    <img alt="discord.js" src="http://hydrabolt.github.io/discord.js/res/logo.png" width="546">
  </a>
</p>

# Did v5.0.0 break your code? [Look here.](http://discordjs.readthedocs.org/en/rewrite-docs/migrating.html)

[![Build Status](https://travis-ci.org/hydrabolt/discord.js.svg)](https://travis-ci.org/hydrabolt/discord.js) [![Documentation Status](https://readthedocs.org/projects/discordjs/badge/?version=latest)](http://discordjs.readthedocs.org/en/latest/?badge=latest)
    

discord.js is a node module used as a way of interfacing with
[Discord](https://discordapp.com/). It is a very useful module for creating
bots.

**The examples in the repo are in ES6, either update your node or compile them down to babel yourself if you want to use them!**

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

### What's new in 5.0.0?

Stability in general! The API has been rewritten completely for much better stability, and it seems to have worked! There are now no random crashes and everything caches properly. The API is also a bit cleaner!

However, it is a breaking change if you are updating (potentially, basic code should be fine) you should look [here](http://discordjs.readthedocs.org/en/rewrite-docs/migrating.html) for help updating.

---

### Related Projects

Here is a list of other Discord APIs:

#### Java:
[Discord4J](https://github.com/nerd/Discord4J)
#### .NET:
[Discord.Net](https://github.com/RogueException/Discord.Net)

[DiscordSharp](https://github.com/Luigifan/DiscordSharp)
#### NodeJS
[discord.io](https://github.com/izy521/node-discord) (similar to discord.js but lower level)

#### PHP
[DiscordPHP](https://github.com/teamreflex/DiscordPHP)

#### Python
[discord.py](https://github.com/Rapptz/discord.py)

#### Ruby
[discordrb](https://github.com/meew0/discordrb)

---

### Links
**[Documentation](http://discordjs.readthedocs.org/en/latest/)**

**[GitHub](https://github.com/discord-js/discord.js)**

**[Wiki](https://github.com/discord-js/discord.js/wiki)**

**[Website](http://discord-js.github.io/)**

**[NPM](npmjs.com/package/discord.js)**

---

### Contact

If you have an issue or want to know if a feature exists, [read the documentation](http://discordjs.readthedocs.org/en/latest/) before contacting me about any issues! If it's badly/wrongly implemented, let me know!


If you would like to contact me, you can create an issue on the GitHub repo, e-mail me via the one available on my NPM profile.
Or you could just send a DM to **hydrabolt** in [**Discord API**](https://discord.gg/0SBTUU1wZTYd2XyW).