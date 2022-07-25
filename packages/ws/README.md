<div align="center">
  <br />
  <p>
    <a href="https://discord.js.org"><img src="https://discord.js.org/static/logo.svg" width="546" alt="discord.js" /></a>
  </p>
  <br />
  <p>
    <a href="https://discord.gg/djs"><img src="https://img.shields.io/discord/222078108977594368?color=5865F2&logo=discord&logoColor=white" alt="Discord server" /></a>
    <a href="https://www.npmjs.com/package/@discordjs/ws"><img src="https://img.shields.io/npm/v/@discordjs/ws.svg?maxAge=3600" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/@discordjs/ws"><img src="https://img.shields.io/npm/dt/@discordjs/ws.svg?maxAge=3600" alt="npm downloads" /></a>
    <a href="https://github.com/discordjs/discord.js/actions"><img src="https://github.com/discordjs/discord.js/actions/workflows/test.yml/badge.svg" alt="Build status" /></a>
    <a href="https://codecov.io/gh/discordjs/discord.js" ><img src="https://codecov.io/gh/discordjs/discord.js/branch/main/graph/badge.svg?precision=2&flag=ws" alt="Code coverage" /></a>
  </p>
</div>

## About

`@discordjs/ws` is a powerful wrapper around Discord's gateway.

## Installation

**Node.js 16.9.0 or newer is required.**

```sh-session
npm install @discordjs/ws
yarn add @discordjs/ws
pnpm add @discordjs/ws
```

## Example usage

```ts
import { WebSocketManager, WebSocketShardEvents } from '@discordjs/ws';
import { REST } from '@discordjs/rest';

const rest = new REST().setToken(process.env.DISCORD_TOKEN);
// This example will spawn Discord's recommended shard count, all under the current process.
const manager = new WebSocketManager({
	token: process.env.DISCORD_TOKEN,
	intents: 0, // for no intents
	rest,
});

await manager.connect();
```

### Specify shards

```ts
// Spawn 4 shards
const manager = new WebSocketManager({
	token: process.env.DISCORD_TOKEN,
	intents: 0,
	rest,
	shardCount: 4,
});

// The manager also supports being responsible for only a subset of your shards:

// Your bot will run 8 shards overall
// This manager will only take care of 0, 2, 4, and 6
const manager = new WebSocketManager({
	token: process.env.DISCORD_TOKEN,
	intents: 0,
	rest,
	shardCount: 8,
	shardIds: [0, 2, 4, 6],
});

// Alternatively, if your shards are consecutive, you can pass in a range
const manager = new WebSocketManager({
	token: process.env.DISCORD_TOKEN,
	intents: 0,
	rest,
	shardCount: 8,
	shardIds: {
		start: 0,
		end: 4,
	},
});
```

### Specify `worker_threads`

You can also have the shards spawn in worker threads:

```ts
import { WebSocketManager, WebSocketShardEvents, WorkerShardingStrategy } from '@discordjs/ws';

const manager = new WebSocketManager({
	token: process.env.DISCORD_TOKEN,
	intents: 0,
	rest,
	shardCount: 6,
});

// This will cause 3 workers to spawn, 2 shards per each
manager.setStrategy(new WorkerShardingStrategy(manager, { shardsPerWorker: 2 }));
// Or maybe you want all your shards under a single worker
manager.setStrategy(new WorkerShardingStrategy(manager, { shardsPerWorker: 'all' }));
```

## Links

- [Website](https://discord.js.org/) ([source](https://github.com/discordjs/discord.js/tree/main/packages/website))
- [Documentation](https://discord.js.org/#/docs/ws)
- [Guide](https://discordjs.guide/) ([source](https://github.com/discordjs/guide))
  See also the [Update Guide](https://discordjs.guide/additional-info/changes-in-v14.html), including updated and removed items in the library.
- [discord.js Discord server](https://discord.gg/djs)
- [Discord API Discord server](https://discord.gg/discord-api)
- [GitHub](https://github.com/discordjs/discord.js/tree/main/packages/ws)
- [npm](https://www.npmjs.com/package/@discordjs/ws)
- [Related libraries](https://discord.com/developers/docs/topics/community-resources#libraries)

## Contributing

Before creating an issue, please ensure that it hasn't already been reported/suggested, and double-check the
[documentation](https://discord.js.org/#/docs/ws).  
See [the contribution guide](https://github.com/discordjs/discord.js/blob/main/.github/CONTRIBUTING.md) if you'd like to submit a PR.

## Help

If you don't understand something in the documentation, you are experiencing problems, or you just need a gentle
nudge in the right direction, please don't hesitate to join our official [discord.js Server](https://discord.gg/djs).
