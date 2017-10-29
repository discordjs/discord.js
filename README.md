<div align="center">
  <br />
  <p>
    <a href="https://discord.js.org"><img src="https://discord.js.org/static/logo.svg" width="546" alt="discord.js" /></a>
  </p>
  <br />
  <p>
    <a href="https://discord.gg/bRCvFy9"><img src="https://discordapp.com/api/guilds/222078108977594368/embed.png" alt="Discord server" /></a>
    <a href="https://www.npmjs.com/package/discord.js"><img src="https://img.shields.io/npm/v/discord.js.svg?maxAge=3600" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/discord.js"><img src="https://img.shields.io/npm/dt/discord.js.svg?maxAge=3600" alt="NPM downloads" /></a>
    <a href="https://travis-ci.org/hydrabolt/discord.js"><img src="https://travis-ci.org/hydrabolt/discord.js.svg" alt="Build status" /></a>
    <a href="https://david-dm.org/hydrabolt/discord.js"><img src="https://img.shields.io/david/hydrabolt/discord.js.svg?maxAge=3600" alt="Dependencies" /></a>
    <a href="https://www.patreon.com/discordjs"><img src="https://img.shields.io/badge/donate-patreon-F96854.svg" alt="Patreon" /></a>
  </p>
  <p>
    <a href="https://nodei.co/npm/discord.js/"><img src="https://nodei.co/npm/discord.js.png?downloads=true&stars=true" alt="NPM info" /></a>
  </p>
</div>

## About
discord.js is a powerful [node.js](https://nodejs.org) module that allows you to interact with the
[Discord API](https://discordapp.com/developers/docs/intro) very easily.

- Object-oriented
- Predictable abstractions
- Performant
- 100% coverage of the Discord API

## Installation
**Node.js 8.0.0 or newer is required.**  
Ignore any warnings about unmet peer dependencies, as they're all optional.

Without voice support: `npm i discord.js`  
With voice support ([node-opus](https://www.npmjs.com/package/node-opus)): `npm i discord.js node-opus`  
With voice support ([opusscript](https://www.npmjs.com/package/opusscript)): `npm i discord.js opusscript`

### Audio engines
The preferred audio engine is node-opus, as it performs significantly better than opusscript. When both are available, discord.js will automatically choose node-opus.
Using opusscript is only recommended for development environments where node-opus is tough to get working.
For production bots, using node-opus should be considered a necessity, especially if they're going to be running on multiple servers.

### Optional packages
- [zlib-sync](https://www.npmjs.com/package/zlib-sync) for significantly faster WebSocket data inflation (`npm i zlib-sync`) 
- [erlpack](https://github.com/discordapp/erlpack) for significantly faster WebSocket data (de)serialisation (`npm i discordapp/erlpack`)
- One of the following packages can be installed for faster voice packet encryption and decryption:
    - [sodium](https://www.npmjs.com/package/sodium) (`npm i sodium`)
    - [libsodium.js](https://www.npmjs.com/package/libsodium-wrappers) (`npm i libsodium-wrappers`)
- [uws](https://www.npmjs.com/package/uws) for a much faster WebSocket connection (`npm i uws`)
- [bufferutil](https://www.npmjs.com/package/bufferutil) for a much faster WebSocket connection when *not* using uws (`npm i bufferutil`)

## Example usage
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
* [Website](https://discord.js.org/) ([source](https://github.com/hydrabolt/discord.js-site))
* [Documentation](https://discord.js.org/#/docs)
* [Discord.js Discord server](https://discord.gg/bRCvFy9)
* [Discord API Discord server](https://discord.gg/discord-api)
* [GitHub](https://github.com/hydrabolt/discord.js)
* [NPM](https://www.npmjs.com/package/discord.js)
* [Related libraries](https://discordapi.com/unofficial/libs.html)

### Extensions
* [discord-rpc](https://www.npmjs.com/package/discord-rpc) ([github](https://github.com/devsnek/discord-rpc))

## Contributing
Before creating an issue, please ensure that it hasn't already been reported/suggested, and double-check the
[documentation](https://discord.js.org/#/docs).  
See [the contribution guide](https://github.com/hydrabolt/discord.js/blob/master/.github/CONTRIBUTING.md) if you'd like to submit a PR.

## Help
If you don't understand something in the documentation, you are experiencing problems, or you just need a gentle
nudge in the right direction, please don't hesitate to join our official [Discord.js Server](https://discord.gg/bRCvFy9).
