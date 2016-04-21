<p align="center">
  <a href="https://hydrabolt.github.io/discord.js">
    <img alt="discord.js" src="http://hydrabolt.github.io/discord.js/res/logo.png" width="546">
  </a>
</p>

[![Build Status](https://travis-ci.org/hydrabolt/discord.js.svg)](https://travis-ci.org/hydrabolt/discord.js) [![Documentation Status](https://readthedocs.org/projects/discordjs/badge/?version=latest)](http://discordjs.readthedocs.org/en/latest/?badge=latest)

[![NPM](https://nodei.co/npm/discord.js.png?downloads=true&stars=true)](https://nodei.co/npm/discord.js/)


discord.js is a node module used as a way of interfacing with [Discord](https://discordapp.com/). It is a very useful module for creating bots.

### Installation

**Requires node 0.12+**

`npm install --save discord.js`

If you don't need voice support:

`npm install --save --no-optional discord.js`

---

### Example: ping-pong
```js
var Discord = require("discord.js");

var mybot = new Discord.Client();

mybot.on("message", function(message) {
	if(message.content === "ping") {
		mybot.reply(message, "pong");
    }
});

mybot.loginWithToken("token");
// If you still need to login with email and password, use mybot.login("email", "password");
```
---

### Contributing

Feel free to contribute! Just clone the repo and edit the files in the **src folder, not the lib folder.**

Whenever you come to making a pull request, make sure it's to the *indev* branch and that you have built the lib files by running `grunt --dev`

---

### Related Projects

A list of other Discord API libraries [can be found here](https://discordapi.com/unofficial/libs.html)

---

### Links
**[Documentation](http://discordjs.readthedocs.org/en/latest/)**

**[GitHub](https://github.com/discord-js/discord.js)**

**[Wiki](https://github.com/discord-js/discord.js/wiki)**

**[Website](http://hydrabolt.github.io/discord.js/)**

**[NPM](http://npmjs.com/package/discord.js)**

---

### Contact

If you have an issue or want to know if a feature exists, [read the documentation](http://discordjs.readthedocs.org/en/latest/) before contacting me about any issues! If it's badly/wrongly implemented, let me know!


If you would like to contact me, you can create an issue on the GitHub repo, e-mail me via the one available on my NPM profile.

Alternatively, you could just send a DM to **hydrabolt** in [**Discord API**](https://discord.gg/0SBTUU1wZTYd2XyW).
