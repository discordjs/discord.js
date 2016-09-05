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

discord.js is a a powerful node.js module that allows you to interact with the [Discord API](https://discordapp.com/developers/docs/intro).

# Welcome!
Welcome to the discord.js rewrite documentation. The rewrite has taken a lot of time, but it should be much more
stable and performant than previous versions.

## Installation
**Requires node 6.0.0 and above**
```bash
npm install --save discord.js
# or, if you don't want voice support:
npm install --save --no-optional discord.js
```

By default, discord.js uses [opusscript](https://www.npmjs.com/package/opusscript) when playing audio over voice connections.
If you're looking to play over multiple voice connections, it might be better to install [node-opus](https://www.npmjs.com/package/node-opus).
discord.js will automatically prefer node-opus over opusscript.
