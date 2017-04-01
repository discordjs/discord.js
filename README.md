Eris [![NPM version](https://img.shields.io/npm/v/eris.svg?style=flat-square)](https://npmjs.com/package/eris) [![Dependency Status](https://img.shields.io/david/abalabahaha/eris.svg?style=flat-square)](https://david-dm.org/abalabahaha/eris)
====

A NodeJS wrapper for interfacing with Discord.

Installing
----------

You will need NodeJS 4+. If you need voice support you will also need Python 2.7 and a C++ compiler. Refer to [the Getting Started section of the docs](https://abal.moe/Eris/docs.html) for more details.

```
npm install --no-optional eris
```

If you need voice support, remove the `--no-optional`

Ping Pong Example
-----------------

```js
const Eris = require("eris");

var bot = new Eris("BOT_TOKEN");
// Replace BOT_TOKEN with your bot account's token

bot.on("ready", () => { // When the bot is ready
    console.log("Ready!"); // Log "Ready!"
});

bot.on("messageCreate", (msg) => { // When a message is created
    if(msg.content === "!ping") { // If the message content is "!ping"
        bot.createMessage(msg.channel.id, "Pong!");
        // Send a message in the same channel with "Pong!"
    } else if(msg.content === "!pong") { // Otherwise, if the message is "!pong"
        bot.createMessage(msg.channel.id, "Ping!");
        // Respond with "Ping!"
    }
});

bot.connect(); // Get the bot to connect to Discord
```

More examples can be found in [the examples folder](https://github.com/abalabahaha/eris/tree/master/examples).

Useful Links
------------

[The website](https://abal.moe/Eris) includes more detailed information on getting started, as well as documentation for the different components.

[The Discord channel](https://discordapp.com/invite/n2g6BQP) is the best place to get support/contact me.

[The GitHub repo](https://github.com/abalabahaha/eris) has the most updated code.

[The NPM package](https://npmjs.com/package/eris)

License
-------

Refer to the [LICENSE](LICENSE) file.
