# discord.js
Discord.js is a node module that allows you to interface with the [Discord](https://discordapp.com/) API for creation of things such as bots or loggers.

The aim of this API is to make it *really* simple to start developing your bots. This API has server, channel and user tracking, as well as tools to make identification really simple.

**[For more information, click here.](https://github.com/hydrabolt/discord.js/wiki)**

### Installation
``npm install discord.js``

### Example usage
```js
var Discord = require("discord.js");

var myBot = new Discord.Client();

myBot.login("discord email", "discord password", function(e) {

    if(e){
        console.log("Couldn't log in");
        return;
    }

    myBot.on("disconnected", function() {
        console.log("Disconnected!");
        process.exit(0);
    });

    myBot.on("ready", function(e) {
        console.log("Ready to go!");
    });

    myBot.on("message", function(message) {

        if(message.content === "Ping!"){

            myBot.sendMessage(message.channel, "Pong!");

        }

    }

}

```
### TODO
* Documentation
* Better error handling
* Being able to cache new servers and channels as well as ones that are deleted - this is currently only done when a bot is created
