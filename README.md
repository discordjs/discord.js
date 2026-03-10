<div align="center">
  <br />
  <p>
    <a href="https://discord.js.org"><img src="https://discord.js.org/static/logo.svg" width="546" alt="discord.js" /></a>
  </p>
</div>

> [!CAUTION]
> **The use of this module under a different name on NPM (or another source besides this GitHub) is not associated with this library.**
> **When using these libraries, you accept the risk of exposing your Discord Token.**

## About

<strong>Welcome to `@discord-selfbot-sdk/bot`, based on `discord.js@14` monorepo architecture</strong>

- A [Node.js](https://nodejs.org) module that allows user accounts to interact with the Discord API.

<div align="center">
  <p>
    <a href="https://www.npmjs.com/package/@discord-selfbot-sdk/bot"><img src="https://img.shields.io/npm/v/@discord-selfbot-sdk/bot.svg" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/@discord-selfbot-sdk/bot"><img src="https://img.shields.io/npm/dt/@discord-selfbot-sdk/bot.svg" alt="npm downloads" /></a>
    <a href="https://github.com/Dijnie/discord.js-self/actions"><img src="https://github.com/Dijnie/discord.js-self/actions/workflows/tests.yml/badge.svg" alt="Tests status" /></a>
  </p>
</div>

> [!WARNING]
> **I don't take any responsibility for blocked Discord accounts that used this module.**

> [!CAUTION]
> **Using this on a user account is prohibited by the [Discord TOS](https://discord.com/terms) and can lead to the account block.**

## Key Differences from discord.js

- **Auth**: Raw user token — no "Bot " prefix
- **Gateway**: Uses `/gateway` instead of `/gateway/bot`, capabilities instead of intents
- **Headers**: Browser-like headers (X-Super-Properties, Sec-CH-UA, Chrome User-Agent)
- **Identify**: Super properties + capabilities bitfield, no intents/shard array
- **Sharding**: Disabled — user accounts are single-shard only

## Packages

- `@discord-selfbot-sdk/bot` ([source][bot-source]) - Main client library (replaces `discord.js`)
- `@discord-selfbot-sdk/core` ([source][core-source]) - Core utilities
- `@discord-selfbot-sdk/rest` ([source][rest-source]) - REST client with selfbot auth and browser headers
- `@discord-selfbot-sdk/util` ([source][util-source]) - Shared utilities
- `@discord-selfbot-sdk/ws` ([source][ws-source]) - Gateway WebSocket with user-style IDENTIFY

## Installation

> [!NOTE]
> **Node.js 20.18.0 or newer is required**

```sh-session
npm install @discord-selfbot-sdk/bot@latest
```

## Example

```js
const { Client } = require('@discord-selfbot-sdk/bot');
const client = new Client();

client.on('ready', async () => {
	console.log(`${client.user.username} is ready!`);
});

client.login('token');
```

## Get Token ?

<strong>Run code (Discord Console - [Ctrl + Shift + I])</strong>

```js
window.webpackChunkdiscord_app.push([
	[Symbol()],
	{},
	(req) => {
		if (!req.c) return;
		for (let m of Object.values(req.c)) {
			try {
				if (!m.exports || m.exports === window) continue;
				if (m.exports?.getToken) return copy(m.exports.getToken());
				for (let ex in m.exports) {
					if (m.exports?.[ex]?.getToken && m.exports[ex][Symbol.toStringTag] !== 'IntlMessagesProxy')
						return copy(m.exports[ex].getToken());
				}
			} catch {}
		}
	},
]);

window.webpackChunkdiscord_app.pop();
console.log('%cWorked!', 'font-size: 50px');
console.log(`%cYou now have your token in the clipboard!`, 'font-size: 16px');
```

## Contributing

- Before creating an issue, please ensure that it hasn't already been reported/suggested.
- See [the contribution guide][contributing] if you'd like to submit a PR.

## Need help?

GitHub Discussion: [Here](https://github.com/Dijnie/discord.js-self/discussions)

## Credits

- [discord.js](https://github.com/discordjs/discord.js) — original bot library
- [discord.py-self](https://github.com/dolfies/discord.py-self) — protocol details (super properties, capabilities, identify payload)
- [discord.js-selfbot-v13](https://github.com/aiko-chan-ai/discord.js-selfbot-v13) — Node.js selfbot patterns

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Dijnie/discord.js-self&type=Date)](https://star-history.com/#Dijnie/discord.js-self&Date)

[source]: https://github.com/Dijnie/discord.js-self
[contributing]: https://github.com/Dijnie/discord.js-self/blob/main/.github/CONTRIBUTING.md
[bot-source]: https://github.com/Dijnie/discord.js-self/tree/main/packages/bot
[core-source]: https://github.com/Dijnie/discord.js-self/tree/main/packages/core
[rest-source]: https://github.com/Dijnie/discord.js-self/tree/main/packages/rest
[util-source]: https://github.com/Dijnie/discord.js-self/tree/main/packages/util
[ws-source]: https://github.com/Dijnie/discord.js-self/tree/main/packages/ws
