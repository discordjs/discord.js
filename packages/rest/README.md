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
  </p>
</div>

## Installation

**Node.js 16.9.0 or newer is required.**

```sh-session
npm install @discordjs/rest
yarn add @discordjs/rest
pnpm add @discordjs/rest
```

## Examples

Install all required dependencies:

```sh-session
npm install @discordjs/rest discord-api-types
yarn add @discordjs/rest discord-api-types
pnpm add @discordjs/rest discord-api-types
```

Send a basic message:

```js
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

const rest = new REST({ version: '10' }).setToken('token');

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

const rest = new REST({ version: '10' }).setToken('token');

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

## Links

- [Website](https://discord.js.org/) ([source](https://github.com/discordjs/website))
- [Documentation](https://discord.js.org/#/docs/rest)
- [Guide](https://discordjs.guide/) ([source](https://github.com/discordjs/guide))
  See also the [Update Guide](https://discordjs.guide/additional-info/changes-in-v13.html), including updated and removed items in the library.
- [discord.js Discord server](https://discord.gg/djs)
- [Discord API Discord server](https://discord.gg/discord-api)
- [GitHub](https://github.com/discordjs/discord.js/tree/main/packages/rest)
- [npm](https://www.npmjs.com/package/@discordjs/rest)
- [Related libraries](https://discord.com/developers/docs/topics/community-resources#libraries)

## Contributing

Before creating an issue, please ensure that it hasn't already been reported/suggested, and double-check the
[documentation](https://discord.js.org/#/docs/rest).  
See [the contribution guide](https://github.com/discordjs/discord.js/blob/main/.github/CONTRIBUTING.md) if you'd like to submit a PR.

## Help

If you don't understand something in the documentation, you are experiencing problems, or you just need a gentle nudge in the right direction, please don't hesitate to join our official [discord.js Server](https://discord.gg/djs).
