<div align="center">
  <br />
  <p>
    <a href="https://discord.js.org"><img src="https://i.imgur.com/260XFXQ.png" width="546" alt="discord.js" /></a>
  </p>
  <br />
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

## About
discord.js is a powerful node.js module that allows you to interact with the [Discord API](https://discordapp.com/developers/docs/intro) very easily.
It takes a much more object-oriented approach than most other JS Discord libraries, making your bot's code significantly tidier and easier to comprehend.
Usability and performance are key focuses of discord.js, and it also has nearly 100% coverage of the Discord API.

## Installation
**Node.js 6.0.0 or newer is required.**

Without voice support: `npm install discord.js --save`  
With voice support ([node-opus](https://www.npmjs.com/package/node-opus)): `npm install discord.js node-opus --save`  
With voice support ([opusscript](https://www.npmjs.com/package/opusscript)): `npm install discord.js opusscript --save`

The preferred audio engine is node-opus, as it performs significantly better than opusscript. When both are available, discord.js will automatically choose node-opus.
Using opusscript is only recommended for development environments where node-opus is tough to get working.
For production bots, using node-opus should be considered a necessity, especially if they're going to be running on multiple servers.

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

A bot template using discord.js can be generated using [generator-discordbot](https://www.npmjs.com/package/generator-discordbot).

## Web distributions
Web builds of discord.js that are fully capable of running in browsers are available [here](https://github.com/hydrabolt/discord.js/tree/webpack).
These are built by [Webpack 2](https://webpack.js.org/). The API is identical, but rather than using `require('discord.js')`,
the entire `Discord` object is available as a global (on the `window` object).
The ShardingManager and any voice-related functionality is unavailable in these builds.

## Links
* [Website](https://discord.js.org/)
* [Discord.js server](https://discord.gg/bRCvFy9)
* [Discord API server](https://discord.gg/rV4BwdK)
* [Documentation](https://discord.js.org/#/docs)
* [Legacy (v8) documentation](http://discordjs.readthedocs.io/en/8.2.0/docs_client.html)
* [Examples](https://github.com/hydrabolt/discord.js/tree/master/docs/custom/examples)
* [GitHub](https://github.com/hydrabolt/discord.js)
* [NPM](https://www.npmjs.com/package/discord.js)
* [Related libraries](https://discordapi.com/unofficial/libs.html)

## Contributing
Before creating an issue, please ensure that it hasn't already been reported/suggested, and double-check the
[documentation](https://discord.js.org/#/docs).  
See [the contributing guide](CONTRIBUTING.md) if you'd like to submit a PR.

## Help
If you don't understand something in the documentation, you are experiencing problems, or you just need a gentle
nudge in the right direction, please don't hesitate to join our official [Discord.js Server](https://discord.gg/bRCvFy9).
