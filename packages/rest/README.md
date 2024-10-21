<div align="center">
	<br />
	<p>
		<a href="https://discord.js.org"><img src="https://discord.js.org/static/logo.svg" width="546" alt="discord.js" /></a>
	</p>
	<br />
	<p>
		<a href="https://discord.gg/djs"><img src="https://img.shields.io/discord/222078108977594368?color=5865F2&logo=discord&logoColor=white" alt="Discord server" /></a>
		<a href="https://www.npmjs.com/package/@discordjs/rest"><img src="https://img.shields.io/npm/v/@discordjs/rest.svg?maxAge=3600" alt="npm version" /></a>
		<a href="https://www.npmjs.com/package/@discordjs/rest"><img src="https://img.shields.io/npm/dt/@discordjs/rest.svg?maxAge=3600" alt="npm downloads" /></a>
		<a href="https://github.com/discordjs/discord.js/actions"><img src="https://github.com/discordjs/discord.js/actions/workflows/test.yml/badge.svg" alt="Tests status" /></a>
		<a href="https://codecov.io/gh/discordjs/discord.js" ><img src="https://codecov.io/gh/discordjs/discord.js/branch/main/graph/badge.svg?precision=2&flag=rest" alt="Code coverage" /></a>
	</p>
	<p>
		<a href="https://vercel.com/?utm_source=discordjs&utm_campaign=oss"><img src="https://raw.githubusercontent.com/discordjs/discord.js/main/.github/powered-by-vercel.svg" alt="Vercel" /></a>
		<a href="https://www.cloudflare.com"><img src="https://raw.githubusercontent.com/discordjs/discord.js/main/.github/powered-by-workers.png" alt="Cloudflare Workers" height="44" /></a>
	</p>
</div>

## About

`@discordjs/rest` is a module that allows you to easily make REST requests to the Discord API.

## Installation

**Node.js 18 or newer is required.**

```sh
npm install @discordjs/rest
yarn add @discordjs/rest
pnpm add @discordjs/rest
bun add @discordjs/rest
```

## Examples

Install all required dependencies:

```sh
npm install @discordjs/rest discord-api-types
yarn add @discordjs/rest discord-api-types
pnpm add @discordjs/rest discord-api-types
bun add @discordjs/rest discord-api-types
```

Send a basic message:

```js
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

const rest = new REST({ version: '10' }).setToken(TOKEN);

try {
	await rest.post(Routes.channelMessages(CHANNEL_ID), {
		body: {
			content: 'A message via REST!',
		},
	});
} catch (error) {
	console.error(error);
}
```

Create a thread from an existing message to be archived after 60 minutes of inactivity:

```js
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

const rest = new REST({ version: '10' }).setToken(TOKEN);

try {
	await rest.post(Routes.threads(CHANNEL_ID, MESSAGE_ID), {
		body: {
			name: 'Thread',
			auto_archive_duration: 60,
		},
	});
} catch (error) {
	console.error(error);
}
```

Send a basic message in an edge environment:

```js
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

const rest = new REST({ version: '10', makeRequest: fetch }).setToken(TOKEN);

try {
	await rest.post(Routes.channelMessages(CHANNEL_ID), {
		body: {
			content: 'A message via REST from the edge!',
		},
	});
} catch (error) {
	console.error(error);
}
```

## Links

- [Website][website] ([source][website-source])
- [Documentation][documentation]
- [Guide][guide] ([source][guide-source])
  Also see the v13 to v14 [Update Guide][guide-update], which includes updated and removed items from the library.
- [discord.js Discord server][discord]
- [Discord API Discord server][discord-api]
- [GitHub][source]
- [npm][npm]
- [Related libraries][related-libs]

## Contributing

Before creating an issue, please ensure that it hasn't already been reported/suggested, and double-check the
[documentation][documentation].  
See [the contribution guide][contributing] if you'd like to submit a PR.

## Help

If you don't understand something in the documentation, you are experiencing problems, or you just need a gentle nudge in the right direction, please don't hesitate to join our official [discord.js Server][discord].

[website]: https://discord.js.org
[website-source]: https://github.com/discordjs/discord.js/tree/main/apps/website
[documentation]: https://discord.js.org/docs/packages/rest/stable
[guide]: https://discordjs.guide/
[guide-source]: https://github.com/discordjs/guide
[guide-update]: https://discordjs.guide/additional-info/changes-in-v14.html
[discord]: https://discord.gg/djs
[discord-api]: https://discord.gg/discord-api
[source]: https://github.com/discordjs/discord.js/tree/main/packages/rest
[npm]: https://www.npmjs.com/package/@discordjs/rest
[related-libs]: https://discord.com/developers/docs/topics/community-resources#libraries
[contributing]: https://github.com/discordjs/discord.js/blob/main/.github/CONTRIBUTING.md
