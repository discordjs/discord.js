<div align="center">
  <br />
  <p>
    <a href="https://discord.js.org"><img src="https://discord.js.org/static/logo.svg" width="546" alt="discord.js" /></a>
  </p>
  <br />
  <p>
    <a href="https://discord.gg/bRCvFy9"><img src="https://discordapp.com/api/guilds/222078108977594368/embed.png" alt="Discord server" /></a>
    <a href="https://www.npmjs.com/package/discord.js"><a href="#backers" alt="sponsors on Open Collective"><img src="https://opencollective.com/discordjs/backers/badge.svg" /></a> <a href="#sponsors" alt="Sponsors on Open Collective"><img src="https://opencollective.com/discordjs/sponsors/badge.svg" /></a> <img src="https://img.shields.io/npm/v/discord.js.svg?maxAge=3600" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/discord.js"><img src="https://img.shields.io/npm/dt/discord.js.svg?maxAge=3600" alt="NPM downloads" /></a>
    <a href="https://travis-ci.org/hydrabolt/discord.js"><img src="https://travis-ci.org/hydrabolt/discord.js.svg" alt="Build status" /></a>
    <a href="https://david-dm.org/hydrabolt/discord.js"><img src="https://img.shields.io/david/hydrabolt/discord.js.svg?maxAge=3600" alt="Dependencies" /></a>
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

Without voice support: `npm install discord.js --save`  
With voice support ([node-opus](https://www.npmjs.com/package/node-opus)): `npm install discord.js node-opus --save`  
With voice support ([opusscript](https://www.npmjs.com/package/opusscript)): `npm install discord.js opusscript --save`

### Audio engines
The preferred audio engine is node-opus, as it performs significantly better than opusscript. When both are available, discord.js will automatically choose node-opus.
Using opusscript is only recommended for development environments where node-opus is tough to get working.
For production bots, using node-opus should be considered a necessity, especially if they're going to be running on multiple servers.

### Optional packages
- [bufferutil](https://www.npmjs.com/package/bufferutil) to greatly speed up the WebSocket when *not* using uws (`npm install bufferutil --save`)
- [erlpack](https://github.com/hammerandchisel/erlpack) for significantly faster WebSocket data (de)serialisation (`npm install hammerandchisel/erlpack --save`)
- One of the following packages can be installed for faster voice packet encryption and decryption:
    - [sodium](https://www.npmjs.com/package/sodium) (`npm install sodium --save`)
    - [libsodium.js](https://www.npmjs.com/package/libsodium-wrappers) (`npm install libsodium-wrappers --save`)
- [uws](https://www.npmjs.com/package/uws) for a much faster WebSocket connection (`npm install uws --save`)

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
* [Discord.js server](https://discord.gg/bRCvFy9)
* [Discord API server](https://discord.gg/rV4BwdK)
* [GitHub](https://github.com/hydrabolt/discord.js)
* [NPM](https://www.npmjs.com/package/discord.js)
* [Related libraries](https://discordapi.com/unofficial/libs.html) (see also [discord-rpc](https://www.npmjs.com/package/discord-rpc))

## Contributing
Before creating an issue, please ensure that it hasn't already been reported/suggested, and double-check the
[documentation](https://discord.js.org/#/docs).  
See [the contribution guide](https://github.com/hydrabolt/discord.js/blob/master/.github/CONTRIBUTING.md) if you'd like to submit a PR.

## Help
If you don't understand something in the documentation, you are experiencing problems, or you just need a gentle
nudge in the right direction, please don't hesitate to join our official [Discord.js Server](https://discord.gg/bRCvFy9).


## Backers

Support us with a monthly donation and help us continue our activities. [[Become a backer](https://opencollective.com/discord.js#backer)]

<a href="https://opencollective.com/discordjs/backer/0/website" target="_blank"><img src="https://opencollective.com/discordjs/backer/0/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/backer/1/website" target="_blank"><img src="https://opencollective.com/discordjs/backer/1/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/backer/2/website" target="_blank"><img src="https://opencollective.com/discordjs/backer/2/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/backer/3/website" target="_blank"><img src="https://opencollective.com/discordjs/backer/3/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/backer/4/website" target="_blank"><img src="https://opencollective.com/discordjs/backer/4/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/backer/5/website" target="_blank"><img src="https://opencollective.com/discordjs/backer/5/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/backer/6/website" target="_blank"><img src="https://opencollective.com/discordjs/backer/6/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/backer/7/website" target="_blank"><img src="https://opencollective.com/discordjs/backer/7/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/backer/8/website" target="_blank"><img src="https://opencollective.com/discordjs/backer/8/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/backer/9/website" target="_blank"><img src="https://opencollective.com/discordjs/backer/9/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/backer/10/website" target="_blank"><img src="https://opencollective.com/discordjs/backer/10/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/backer/11/website" target="_blank"><img src="https://opencollective.com/discordjs/backer/11/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/backer/12/website" target="_blank"><img src="https://opencollective.com/discordjs/backer/12/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/backer/13/website" target="_blank"><img src="https://opencollective.com/discordjs/backer/13/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/backer/14/website" target="_blank"><img src="https://opencollective.com/discordjs/backer/14/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/backer/15/website" target="_blank"><img src="https://opencollective.com/discordjs/backer/15/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/backer/16/website" target="_blank"><img src="https://opencollective.com/discordjs/backer/16/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/backer/17/website" target="_blank"><img src="https://opencollective.com/discordjs/backer/17/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/backer/18/website" target="_blank"><img src="https://opencollective.com/discordjs/backer/18/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/backer/19/website" target="_blank"><img src="https://opencollective.com/discordjs/backer/19/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/backer/20/website" target="_blank"><img src="https://opencollective.com/discordjs/backer/20/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/backer/21/website" target="_blank"><img src="https://opencollective.com/discordjs/backer/21/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/backer/22/website" target="_blank"><img src="https://opencollective.com/discordjs/backer/22/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/backer/23/website" target="_blank"><img src="https://opencollective.com/discordjs/backer/23/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/backer/24/website" target="_blank"><img src="https://opencollective.com/discordjs/backer/24/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/backer/25/website" target="_blank"><img src="https://opencollective.com/discordjs/backer/25/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/backer/26/website" target="_blank"><img src="https://opencollective.com/discordjs/backer/26/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/backer/27/website" target="_blank"><img src="https://opencollective.com/discordjs/backer/27/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/backer/28/website" target="_blank"><img src="https://opencollective.com/discordjs/backer/28/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/backer/29/website" target="_blank"><img src="https://opencollective.com/discordjs/backer/29/avatar.svg"></a>


## Sponsors

Become a sponsor and get your logo on our README on Github with a link to your site. [[Become a sponsor](https://opencollective.com/discord.js#sponsor)]

<a href="https://opencollective.com/discordjs/sponsor/0/website" target="_blank"><img src="https://opencollective.com/discordjs/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/sponsor/1/website" target="_blank"><img src="https://opencollective.com/discordjs/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/sponsor/2/website" target="_blank"><img src="https://opencollective.com/discordjs/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/sponsor/3/website" target="_blank"><img src="https://opencollective.com/discordjs/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/sponsor/4/website" target="_blank"><img src="https://opencollective.com/discordjs/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/sponsor/5/website" target="_blank"><img src="https://opencollective.com/discordjs/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/sponsor/6/website" target="_blank"><img src="https://opencollective.com/discordjs/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/sponsor/7/website" target="_blank"><img src="https://opencollective.com/discordjs/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/sponsor/8/website" target="_blank"><img src="https://opencollective.com/discordjs/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/discordjs/sponsor/9/website" target="_blank"><img src="https://opencollective.com/discordjs/sponsor/9/avatar.svg"></a>

