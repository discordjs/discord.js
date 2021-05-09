<div align="center">
  <br />
  <p>
    <a href="https://discord.js.org"><img src="https://discord.js.org/static/logo.svg" width="546" alt="discord.js" /></a>
  </p>
  <br />
  <p>
    <a href="https://discord.gg/bRCvFy9"><img src="https://img.shields.io/discord/222078108977594368?color=7289da&logo=discord&logoColor=white" alt="Discord server" /></a>
    <a href="https://www.npmjs.com/package/discord.js"><img src="https://img.shields.io/npm/v/discord.js.svg?maxAge=3600" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/discord.js"><img src="https://img.shields.io/npm/dt/discord.js.svg?maxAge=3600" alt="NPM downloads" /></a>
    <a href="https://github.com/discordjs/discord.js/actions"><img src="https://github.com/discordjs/discord.js/workflows/Testing/badge.svg" alt="Build status" /></a>
    <a href="https://david-dm.org/discordjs/discord.js"><img src="https://img.shields.io/david/discordjs/discord.js.svg?maxAge=3600" alt="Dependencies" /></a>
    <a href="https://www.patreon.com/discordjs"><img src="https://img.shields.io/badge/donate-patreon-F96854.svg" alt="Patreon" /></a>
  </p>
  <p>
    <a href="https://nodei.co/npm/discord.js/"><img src="https://nodei.co/npm/discord.js.png?downloads=true&stars=true" alt="npm installnfo" /></a>
  </p>
</div>

## Table of contents

- [относно](#относно)
- [Инсталация](#Инсталация)
  - [Audio engines](#audio-engines)
  - [Optional packages](#optional-packages)
- [Пример за използване](#Пример-за-използване)
- [Links](#links)
  - [Разширения](#extensions)
- [допринасящ](#contributing)
- [Помощ](#help)

## относно

discord.js е мощен модул, който ви позволява лесно да взаимодействате с:
[Discord API](https://discord.com/developers/docs/intro).

- Обектно ориентиран
- Предсказуеми абстракции
- производителност
- 100% покритие на Discord API

## Инсталация

** Изисква се Node.js 14.0.0 или по-нова. **
Пренебрегвайте всякакви предупреждения за незадоволени връстници, тъй като всички те са по избор.


Без гласова поддръжка: `npm install discord.js`  
С гласова поддръжка ([@discordjs/opus](https://www.npmjs.com/package/@discordjs/opus)): `npm install discord.js @discordjs/opus`  
С гласова поддръжка ([opusscript](https://www.npmjs.com/package/opusscript)): `npm install discord.js opusscript`

### Audio engines

Предпочитаният звуков механизъм е @ discordjs / opus, тъй като се представя значително по-добре от opusscript. Когато и двете са налични, discord.js автоматично ще избере @ discordjs / opus.
Използването на opusscript се препоръчва само за среди за разработка, където @ discordjs / opus е трудно да се работи.
За производствените ботове използването на @ discordjs / opus трябва да се счита за необходимост, особено ако те ще работят на 

### Optional packages

- [zlib-sync](https://www.npmjs.com/package/zlib-sync) за WebSocket компресия на данни и инфлация (`npm install zlib-sync`)
- [erlpack](https://github.com/discord/erlpack) за значително по-бърза сериализация на данни WebSocket (`npm install discord/erlpack`)
- Може да се инсталира един от следните пакети за по-бързо криптиране и декриптиране на гласов пакет:
  - [sodium](https://www.npmjs.com/package/sodium) (`npm install sodium`)
  - [libsodium.js](https://www.npmjs.com/package/libsodium-wrappers) (`npm install libsodium-wrappers`)
- [bufferutil](https://www.npmjs.com/package/bufferutil) за много по-бърза връзка WebSocket (`npm install bufferutil`)
- [utf-8-validate](https://www.npmjs.com/package/utf-8-validate) in combination with `bufferutil` for much faster WebSocket processing (`npm install utf-8-validate`)

## Пример за използване

```js
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.channel.send('pong');
  }
});

client.login('token');
```

## Links

- [Website](https://discord.js.org/) ([source](https://github.com/discordjs/website))
- [Документация](https://discord.js.org/#/docs/main/master/general/welcome)
- [гид](https://discordjs.guide/) ([source](https://github.com/discordjs/guide)) - това все още е за стабилно  
  See also the [гид] за актуализация](https://discordjs.guide/additional-info/changes-in-v12.html),включително актуализирани и премахнати елементи в библиотеката. 
- [Discord.js Discord server](https://discord.gg/bRCvFy9)
- [Discord API Discord server](https://discord.gg/discord-api)
- [GitHub](https://github.com/discordjs/discord.js)
- [NPM](https://www.npmjs.com/package/discord.js)
- [Свързани библиотеки](https://discordapi.com/unofficial/libs.html)

### Разширения

- [RPC](https://www.npmjs.com/package/discord-rpc) ([source](https://github.com/discordjs/RPC))

## допринасящ

Преди да създадете проблем, моля, уверете се, че той все още не е докладван / предложен и проверете отново

[documentation](https://discord.js.org/#/docs).  
Виж [ръководството за принос](https://github.com/discordjs/discord.js/blob/master/.github/CONTRIBUTING.md) if you'd like to submit a PR.

## Помощ

Ако не разбирате нещо от документацията, имате проблеми или просто се нуждаете от нежно
бутайте в правилната посока, моля не се колебайте да се присъедините към нашия официален [Discord.js Server](https://discord.gg/bRCvFy9).
