<div align="center">
	<br />
	<p>
		<a href="https://discord.js.org"><img src="https://discord.js.org/static/logo.svg" width="546" alt="discord.js" /></a>
	</p>
	<br />
	<p>
		<a href="https://discord.gg/djs"><img src="https://img.shields.io/badge/join_us-on_discord-5865F2?logo=discord&logoColor=white" alt="Discord server" /></a>
		<a href="https://github.com/discordjs/discord.js/actions"><img src="https://github.com/discordjs/discord.js/actions/workflows/tests.yml/badge.svg" alt="Build status" /></a>
	</p>
</div>

## About

`@discordjs/mock` is a fake Discord for tests. It holds a single in-memory world of guilds, channels, members and
messages, and serves it through a gateway that a bot built on `@discordjs/core` can connect to unmodified. Every change
to the world, whether the test makes it or the bot does, reaches connected sessions as the gateway events Discord would
send, filtered by shard and intents.

> [!WARNING]
> This package is in early development. The APIs used in the examples below may not yet be implemented.

## Installation

**Node.js 24.17.0 or newer is required.**

```sh
npm install --save-dev @discordjs/mock
yarn add --dev @discordjs/mock
pnpm add --save-dev @discordjs/mock
bun add --dev @discordjs/mock
```

## Example usage

```ts
import { Client } from '@discordjs/core';
import { createFakeDiscord } from '@discordjs/mock';
import { REST } from '@discordjs/rest';
import { GatewayDispatchEvents, GatewayIntentBits } from 'discord-api-types/v10';

const discord = await createFakeDiscord({ token: 'bot-token' });
const client = new Client({ rest: new REST().setToken('bot-token'), gateway: discord.gateway });
await discord.gateway.connect({ intents: GatewayIntentBits.Guilds | GatewayIntentBits.GuildMessages });

const guild = discord.world.createGuild({ name: 'Test' });
const general = guild.createChannel({ name: 'general' });
const alice = guild.addMember(discord.world.createUser({ username: 'alice' }));

client.once(GatewayDispatchEvents.MessageCreate, ({ data }) => console.log(data.author.username, data.content));
general.createMessage({ author: alice, content: 'hello' });
```

## Links

- [Website][website] ([source][website-source])
- [Documentation][documentation]
- [discord.js Discord server][discord]
- [GitHub][source]
- [Related libraries][related-libs]

## Contributing

Before creating an issue, please ensure that it hasn't already been reported/suggested, and double-check the
[documentation][documentation].
See [the contribution guide][contributing] if you'd like to submit a PR.

## Help

If you don't understand something in the documentation, you are experiencing problems, or you just need a gentle nudge
in the right direction, please don't hesitate to join our official [discord.js Server][discord].

[website]: https://discord.js.org
[website-source]: https://github.com/discordjs/discord.js/tree/main/apps/website
[documentation]: https://discord.js.org/docs/packages/mock/main
[discord]: https://discord.gg/djs
[source]: https://github.com/discordjs/discord.js/tree/main/packages/mock
[related-libs]: https://discord.com/developers/docs/topics/community-resources#libraries
[contributing]: https://github.com/discordjs/discord.js/blob/main/.github/CONTRIBUTING.md
