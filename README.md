<p align="center">
  <a href="https://hydrabolt.github.io/discord.js">
    <img alt="discord.js" src="http://i.imgur.com/sPOLh9y.png" width="546"><br />
  </a>
</p>

[![Discord](https://discordapp.com/api/guilds/222078108977594368/embed.png)](https://discord.gg/bRCvFy9)
[![npm](https://img.shields.io/npm/v/discord.js.svg?maxAge=3600)](https://www.npmjs.com/package/discord.js)
[![npm](https://img.shields.io/npm/dt/discord.js.svg?maxAge=3600)](https://www.npmjs.com/package/discord.js)
[![Build Status](https://travis-ci.org/hydrabolt/discord.js.svg)](https://travis-ci.org/hydrabolt/discord.js)
[![David](https://img.shields.io/david/hydrabolt/discord.js.svg?maxAge=3600)](https://david-dm.org/hydrabolt/discord.js)

[![NPM](https://nodei.co/npm/discord.js.png?downloads=true&stars=true)](https://nodei.co/npm/discord.js/)

discord.js is a powerful node.js module that allows you to interact with the [Discord API](https://discordapp.com/developers/docs/intro).

## Installation
**Node.js 6.0.0 or newer is required.**  
With voice support: `npm install --save discord.js --production`  
Without voice support: `npm install --save discord.js --production --no-optional`

By default, discord.js uses [opusscript](https://www.npmjs.com/package/opusscript) when playing audio over voice connections.
If you're looking to play over multiple voice connections, it might be better to install [node-opus](https://www.npmjs.com/package/node-opus).
discord.js will automatically prefer node-opus over opusscript.

## Example Usage
```js
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  if (message.content === 'ping') {
    message.reply('pong');
  }
});

client.login('your token');
```

## Links
* [Website](http://hydrabolt.github.io/discord.js/)
* [Discord.js Server](https://discord.gg/bRCvFy9)
* [Discord API Server](https://discord.gg/rV4BwdK)
* [Documentation](http://hydrabolt.github.io/discord.js/#!/docs/tag/master)
* [Legacy Documentation](http://discordjs.readthedocs.io/en/8.1.0/docs_client.html)
* [GitHub](https://github.com/hydrabolt/discord.js)
* [NPM](https://www.npmjs.com/package/discord.js)
* [Examples](https://github.com/hydrabolt/discord.js/tree/master/docs/custom/examples)
* [Related Libraries](https://discordapi.com/unofficial/libs.html)

## Contact
Before reporting an issue, please read the [documentation](http://hydrabolt.github.io/discord.js/#!/docs/tag/master).
If you can't find help there, you can ask in the official [Discord.js Server](https://discord.gg/bRCvFy9).
