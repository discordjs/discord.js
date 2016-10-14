<p align="center">
  <a href="https://hydrabolt.github.io/discord.js">
    <img alt="discord.js" src="http://i.imgur.com/sPOLh9y.png" width="546"><br />
  </a>
</p>

[![Discord](https://discordapp.com/api/guilds/222078108977594368/embed.png)](https://discord.gg/bRCvFy9)
[![npm](https://img.shields.io/npm/v/discord.js.svg?maxAge=2592000)](https://www.npmjs.com/package/discord.js)
[![npm](https://img.shields.io/npm/dt/discord.js.svg?maxAge=2592000)](https://www.npmjs.com/package/discord.js)
[![Build Status](https://travis-ci.org/hydrabolt/discord.js.svg)](https://travis-ci.org/hydrabolt/discord.js)
[![David](https://img.shields.io/david/hydrabolt/discord.js.svg?maxAge=2592000)](https://david-dm.org/hydrabolt/discord.js)

[![NPM](https://nodei.co/npm/discord.js.png?downloads=true&stars=true)](https://nodei.co/npm/discord.js/)

discord.js is a powerful node.js module that allows you to interact with the [Discord API](https://discordapp.com/developers/docs/intro).

# Welcome!
Welcome to the discord.js v9 documentation. The v9 rewrite has taken a lot of time, but it should be much more
stable and performant than previous versions.

## Installation
**Node.js 6.0.0 or newer is required.**  
Without voice support: `npm install discord.js --save --production`  
With voice support ([node-opus](https://www.npmjs.com/package/node-opus)): `npm install discord.js node-opus --save --production`  
With voice support ([opusscript](https://www.npmjs.com/package/opusscript)): `npm install discord.js opusscript --save --production`  
If both audio packages are installed, discord.js will automatically prefer node-opus.

The preferred audio engine is node-opus, as it performs significantly better than opusscript.
Using opusscript is only recommended for development on Windows, since getting node-opus to build there can be a bit of a challenge.
For production bots, using node-opus should be considered a necessity, especially if they're going to be running on multiple servers.

## Guides
* [LuckyEvie's general guide](https://eslachance.gitbooks.io/discord-js-bot-guide/content/)
* [York's v9 upgrade guide](https://yorkaargh.wordpress.com/2016/09/03/updating-discord-js-bots/)

## Links
* [Website](http://hydrabolt.github.io/discord.js/)
* [Discord.js server](https://discord.gg/bRCvFy9)
* [Discord API server](https://discord.gg/rV4BwdK)
* [Documentation](http://hydrabolt.github.io/discord.js/#!/docs/tag/master)
* [Legacy (v8) documentation](http://discordjs.readthedocs.io/en/8.2.0/docs_client.html)
* [Examples](https://github.com/hydrabolt/discord.js/tree/master/docs/custom/examples)
* [GitHub](https://github.com/hydrabolt/discord.js)
* [NPM](https://www.npmjs.com/package/discord.js)
* [Related libraries](https://discordapi.com/unofficial/libs.html)

## Help
If you don't understand something in the documentation, you are experiencing problems, or you just need a gentle
nudge in the right direction, please don't hesitate to join our official [Discord.js Server](https://discord.gg/bRCvFy9).
