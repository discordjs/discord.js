<div align="center">
	<br />
	<p>
		<a href="https://discord.js.org"><img src="https://discord.js.org/static/logo.svg" width="546" alt="discord.js" /></a>
	</p>
	<br />
	<p>
		<a href="https://discord.gg/djs"><img src="https://img.shields.io/badge/join_us-on_discord-5865F2?logo=discord&logoColor=white" alt="Discord server" /></a>
		<a href="https://www.npmjs.com/package/@discordjs/rpc"><img src="https://img.shields.io/npm/v/@discordjs/rpc.svg?maxAge=3600" alt="npm version" /></a>
		<a href="https://www.npmjs.com/package/@discordjs/rpc"><img src="https://img.shields.io/npm/dt/@discordjs/rpc.svg?maxAge=3600" alt="npm downloads" /></a>
		<a href="https://github.com/discordjs/discord.js/actions"><img src="https://github.com/discordjs/discord.js/actions/workflows/tests.yml/badge.svg" alt="Tests status" /></a>
		<a href="https://github.com/discordjs/discord.js/commits/main/packages/rpc"><img alt="Last commit." src="https://img.shields.io/github/last-commit/discordjs/discord.js?logo=github&logoColor=ffffff&path=packages%2Frpc" /></a>
		<a href="https://opencollective.com/discordjs"><img src="https://img.shields.io/opencollective/backers/discordjs?maxAge=3600&logo=opencollective" alt="backers" /></a>
		<a href="https://codecov.io/gh/discordjs/discord.js"><img src="https://codecov.io/gh/discordjs/discord.js/branch/main/graph/badge.svg?precision=2&flag=rpc" alt="Code coverage" /></a>
	</p>
	<p>
		<a href="https://vercel.com/?utm_source=discordjs&utm_campaign=oss"><img src="https://raw.githubusercontent.com/discordjs/discord.js/main/.github/powered-by-vercel.svg" alt="Vercel" /></a>
		<a href="https://www.cloudflare.com"><img src="https://raw.githubusercontent.com/discordjs/discord.js/main/.github/powered-by-workers.png" alt="Cloudflare Workers" height="44" /></a>
	</p>
</div>

## About

`@discordjs/rpc` is a simple RPC client for Discord. It connects to the Discord desktop client running on the same machine over IPC, letting your application set a Rich Presence, react to client events, and call any [RPC command](https://docs.discord.com/developers/topics/rpc).

## Installation

**Node.js 24.17.0 or newer is required.**

```sh
npm install @discordjs/rpc
yarn add @discordjs/rpc
pnpm add @discordjs/rpc
bun add @discordjs/rpc
```

## Examples

### Setting user activity for a game

```ts
const client = new RPCClient();
const startTimestamp = Date.now();

async function setActivity(): Promise<void> {
	await client.setActivity({
		details: `Playing with friends :3`,
		state: 'in the silly lobby',
		timestamps: { start: startTimestamp },
		instance: true,
	});
}

client.once(Events.ApplicationReady, async () => {
	await setActivity();

	setInterval(async () => {
		await setActivity();
	}, 15e3);
});

client.login({ clientId: env.CLIENT_ID }).catch(console.error);
```

### Logging messages of importance for the current user

```ts
const client = new RPCClient({ scopes: [OAuth2Scopes.MessagesRead] });
const startTimestamp = Date.now();

client.subscribe(RPCEvents.MessageCreate, { channel_id: env.CHANNEL_ID });

client.on(RPCEvents.MessageCreate, async ({ channel_id: channelId, message }) => {
	if (message.content.startsWith('IMPORTANT!'))
		console.log(`Important message from ${message.author.username}: ${message.content}`);
});

client.login({ clientId: env.CLIENT_ID, clientSecret: env.CLIENT_SECRET }).catch(console.error);
```

## Links

- [Website][website] ([source][website-source])
- [Documentation][documentation]
- [Guide][guide] ([source][guide-source])
  Also see the v13 to v14 [Update Guide][guide-update], which includes updated and removed items from the library.
- [discord.js Discord server][discord]
- [Discord Developers Discord server][discord-developers]
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
[documentation]: https://discord.js.org/docs/packages/rpc/stable
[guide]: https://discordjs.guide
[guide-source]: https://github.com/discordjs/discord.js/tree/main/apps/guide
[guide-update]: https://discordjs.guide/legacy/additional-info/changes-in-v14
[discord]: https://discord.gg/djs
[discord-developers]: https://discord.gg/discord-developers
[source]: https://github.com/discordjs/discord.js/tree/main/packages/rpc
[npm]: https://www.npmjs.com/package/@discordjs/rpc
[related-libs]: https://docs.discord.com/developers/developer-tools/community-resources#libraries
[contributing]: https://github.com/discordjs/discord.js/blob/main/.github/CONTRIBUTING.md
