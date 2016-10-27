<div align="center">
  <p>
    <a href="https://discord.js.org"><img src="https://i.imgur.com/StEGtEh.png" width="546" alt="discord.js" /></a>
  </p>
  <p>
    <a href="https://discord.gg/bRCvFy9"><img src="https://discordapp.com/api/guilds/222078108977594368/embed.png" alt="Discord server" /></a>
    <a href="https://www.npmjs.com/package/discord.js"><img src="https://img.shields.io/npm/v/discord.js.svg?maxAge=3600" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/discord.js"><img src="https://img.shields.io/npm/dt/discord.js.svg?maxAge=3600" alt="NPM downloads" /></a>
    <a href="https://travis-ci.org/hydrabolt/discord.js"><img src="https://travis-ci.org/hydrabolt/discord.js.svg" alt="Build status" /></a>
    <a href="https://david-dm.org/hydrabolt/discord.js"><img src="https://img.shields.io/david/hydrabolt/discord.js.svg?maxAge=3600" alt="Dependencies" /></a>
  </p>
  <p>
    <a href="https://nodei.co/npm/discord.js/"><img src="https://nodei.co/npm/discord.js.png?downloads=true&stars=true" alt="NPM info" /></a>
  </p>
</div>

# Welcome!
Welcome to the discord.js v10 documentation.
v10 is just a more consistent and stable iteration over v9, and contains loads of new and improved features, optimisations, and bug fixes.

## About
discord.js is a powerful node.js module that allows you to interact with the [Discord API](https://discordapp.com/developers/docs/intro) very easily.
It takes a much more object-oriented approach than most other JS Discord libraries, making your bot's code significantly tidier and easier to comprehend.
Usability and performance are key focuses of discord.js. It also has nearly 100% coverage of the Discord API.

## Installation
**Node.js 6.0.0 or newer is required.**

Without voice support: `npm install discord.js --save`  
With voice support ([node-opus](https://www.npmjs.com/package/node-opus)): `npm install discord.js node-opus --save`  
With voice support ([opusscript](https://www.npmjs.com/package/opusscript)): `npm install discord.js opusscript --save`

The preferred audio engine is node-opus, as it performs significantly better than opusscript. When both are available, discord.js will automatically choose node-opus.
Using opusscript is only recommended for development on Windows, since getting node-opus to build there can be a bit of a challenge.
For production bots, using node-opus should be considered a necessity, especially if they're going to be running on multiple servers.

## Guides
* [LuckyEvie's general guide](https://eslachance.gitbooks.io/discord-js-bot-guide/content/)
* [York's v9 upgrade guide](https://yorkaargh.wordpress.com/2016/09/03/updating-discord-js-bots/)

## Links
* [Website](http://discord.js.org/)
* [Discord.js server](https://discord.gg/bRCvFy9)
* [Discord API server](https://discord.gg/rV4BwdK)
* [Documentation](http://discord.js.org/#!/docs)
* [Legacy (v8) documentation](http://discordjs.readthedocs.io/en/8.2.0/docs_client.html)
* [Examples](https://github.com/hydrabolt/discord.js/tree/master/docs/custom/examples)
* [GitHub](https://github.com/hydrabolt/discord.js)
* [NPM](https://www.npmjs.com/package/discord.js)
* [Related libraries](https://discordapi.com/unofficial/libs.html)

## Help
If you don't understand something in the documentation, you are experiencing problems, or you just need a gentle
nudge in the right direction, please don't hesitate to join our official [Discord.js Server](https://discord.gg/bRCvFy9).
