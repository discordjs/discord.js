<div align="center">

  [<img src="https://discord.js.org/static/logo.svg" width="546" alt="discord.js" />](https://discord.js.org)
  
  [![Discord server](https://discordapp.com/api/guilds/222078108977594368/embed.png)](https://discord.gg/bRCvFy9)
  [![NPM version](https://img.shields.io/npm/v/discord.js.svg?maxAge=3600)](https://www.npmjs.com/package/discord.js)
  [![NPM downloads](https://img.shields.io/npm/dt/discord.js.svg?maxAge=3600)](https://www.npmjs.com/package/discord.js)
  [![Build status](https://travis-ci.org/discordjs/discord.js.svg)](https://travis-ci.org/discordjs/discord.js)
  [![Dependencies](https://img.shields.io/david/discordjs/discord.js.svg?maxAge=3600)](https://david-dm.org/discordjs/discord.js)
  [![Patreon](https://img.shields.io/badge/donate-patreon-F96854.svg)](https://www.patreon.com/discordjs)
  [![npm install info](https://nodei.co/npm/discord.js.png?downloads=true&stars=true)](https://nodei.co/npm/discord.js/)
</div>

## About

discord.js is a powerful [Node.js](https://nodejs.org) module that allows you to interact with the
[Discord API](https://discordapp.com/developers/docs/intro) very easily.

- Object-oriented
- Predictable abstractions
- Performant
- 100% coverage of the Discord API

## Installation

**Node.js 8.0.0 or newer is required.**  
Ignore any warnings about unmet peer dependencies, as they're all optional.

### NPM

```bash
# Without voice support
npm install discord.js

# With voice support
npm install discord.js node-opus
# or
npm install discord.js opusscript
```

### Yarn

```bash
# Without voice support
yarn add discord.js

# With voice support
yarn add discord.js node-opus
# or
yarn add discord.js opusscript
```

### Audio engines

The preferred audio engine is node-opus, as it performs significantly better than opusscript. When both are available, discord.js will automatically choose node-opus.
Using opusscript is only recommended for development environments where node-opus is tough to get working.
For production bots, using node-opus should be considered a necessity, especially if they're going to be running on multiple servers.

### Optional packages

- [zlib-sync](https://www.npmjs.com/package/zlib-sync) for significantly faster WebSocket data inflation (`npm install zlib-sync`)
- [erlpack](https://github.com/discordapp/erlpack) for significantly faster WebSocket data (de)serialisation (`npm install discordapp/erlpack`)
- One of the following packages can be installed for faster voice packet encryption and decryption:
  - [sodium](https://www.npmjs.com/package/sodium) (`npm install sodium`)
  - [libsodium.js](https://www.npmjs.com/package/libsodium-wrappers) (`npm install libsodium-wrappers`)
- [uws](https://www.npmjs.com/package/@discordjs/uws) for a much faster WebSocket connection (`npm install @discordjs/uws`)
- [bufferutil](https://www.npmjs.com/package/bufferutil) for a much faster WebSocket connection when *not* using uws (`npm install bufferutil`)

## Example usage

```js
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
});

client.login('token');
```

## Links

- [Website](https://discord.js.org/) ([source](https://github.com/discordjs/website))
- [Documentation](https://discord.js.org/#/docs)
- [Guide](https://discordjs.guide/) ([source](https://github.com/discordjs/guide))
- [Discord.js Discord server](https://discord.gg/bRCvFy9)
- [Discord API Discord server](https://discord.gg/discord-api)
- [GitHub](https://github.com/discordjs/discord.js)
- [NPM](https://www.npmjs.com/package/discord.js)
- [Related libraries](https://discordapi.com/unofficial/libs.html)

### Extensions

- [RPC](https://www.npmjs.com/package/discord-rpc) ([source](https://github.com/discordjs/RPC))

## Contributing

Before creating an issue, please ensure that it hasn't already been reported/suggested, and double-check the
[documentation](https://discord.js.org/#/docs).  
See [the contribution guide](https://github.com/discordjs/discord.js/blob/master/.github/CONTRIBUTING.md) if you'd like to submit a PR.

## Help

If you don't understand something in the documentation, you are experiencing problems, or you just need a gentle
nudge in the right direction, please don't hesitate to join our official [Discord.js Server](https://discord.gg/bRCvFy9).
