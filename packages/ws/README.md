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
	<p>
		<a href="https://vercel.com/?utm_source=discordjs&utm_campaign=oss"><img src="https://raw.githubusercontent.com/discordjs/discord.js/main/.github/powered-by-vercel.svg" alt="Vercel" /></a>
		<a href="https://www.cloudflare.com"><img src="https://raw.githubusercontent.com/discordjs/discord.js/main/.github/powered-by-workers.png" alt="Cloudflare Workers" height="44" /></a>
	</p>
</div>

## About

`@discordjs/ws` is a powerful wrapper around Discord's gateway.

## Installation

**Node.js 18.12.0 or newer is required.**

```sh
npm install @discordjs/ws
yarn add @discordjs/ws
pnpm add @discordjs/ws
```

### Optional packages

- [zlib-sync](https://www.npmjs.com/package/zlib-sync) for WebSocket data compression and inflation (`npm install zlib-sync`)
- [bufferutil](https://www.npmjs.com/package/bufferutil) for a much faster WebSocket connection (`npm install bufferutil`)
- [utf-8-validate](https://www.npmjs.com/package/utf-8-validate) in combination with `bufferutil` for much faster WebSocket processing (`npm install utf-8-validate`)

## Example usage

```ts
import { WebSocketManager, WebSocketShardEvents, CompressionMethod } from '@discordjs/ws';
import { REST } from '@discordjs/rest';

const rest = new REST().setToken(process.env.DISCORD_TOKEN);
// This example will spawn Discord's recommended shard count, all under the current process.
const manager = new WebSocketManager({
	token: process.env.DISCORD_TOKEN,
	intents: 0, // for no intents
	rest,
	// uncomment if you have zlib-sync installed and want to use compression
	// compression: CompressionMethod.ZlibStream,
});

manager.on(WebSocketShardEvents.Dispatch, (event) => {
	// Process gateway events here.
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
import { WebSocketManager, WorkerShardingStrategy } from '@discordjs/ws';
import { REST } from '@discordjs/rest';

const rest = new REST().setToken(process.env.DISCORD_TOKEN);
const manager = new WebSocketManager({
	token: process.env.DISCORD_TOKEN,
	intents: 0,
	rest,
	shardCount: 6,
	// This will cause 3 workers to spawn, 2 shards per each
	buildStrategy: (manager) => new WorkerShardingStrategy(manager, { shardsPerWorker: 2 }),
	// Or maybe you want all your shards under a single worker
	buildStrategy: (manager) => new WorkerShardingStrategy(manager, { shardsPerWorker: 'all' }),
});
```

**Note**: By default, this will cause the workers to effectively only be responsible for the WebSocket connection, they simply pass up all the events back to the main process for the manager to emit. If you want to have the workers handle events as well, you can pass in a `workerPath` option to the `WorkerShardingStrategy` constructor:

```ts
import { WebSocketManager, WorkerShardingStrategy } from '@discordjs/ws';
import { REST } from '@discordjs/rest';

const rest = new REST().setToken(process.env.DISCORD_TOKEN);
const manager = new WebSocketManager({
	token: process.env.DISCORD_TOKEN,
	intents: 0,
	rest,
	buildStrategy: (manager) =>
		new WorkerShardingStrategy(manager, {
			shardsPerWorker: 2,
			workerPath: './worker.js',
		}),
});
```

And your `worker.ts` file:

```ts
import { WorkerBootstrapper, WebSocketShardEvents } from '@discordjs/ws';

const bootstrapper = new WorkerBootstrapper();
void bootstrapper.bootstrap({
	// Those will be sent to the main thread for the manager to emit
	forwardEvents: [
		WebSocketShardEvents.Closed,
		WebSocketShardEvents.Debug,
		WebSocketShardEvents.Hello,
		WebSocketShardEvents.Ready,
		WebSocketShardEvents.Resumed,
	],
	shardCallback: (shard) => {
		shard.on(WebSocketShardEvents.Dispatch, (event) => {
			// Process gateway events here however you want (e.g. send them through a message broker)
			// You also have access to shard.id if you need it
		});
	},
});
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
[documentation]: https://discord.js.org/docs/packages/ws/stable
[guide]: https://discordjs.guide/
[guide-source]: https://github.com/discordjs/guide
[guide-update]: https://discordjs.guide/additional-info/changes-in-v14.html
[discord]: https://discord.gg/djs
[discord-api]: https://discord.gg/discord-api
[source]: https://github.com/discordjs/discord.js/tree/main/packages/ws
[npm]: https://www.npmjs.com/package/@discordjs/ws
[related-libs]: https://discord.com/developers/docs/topics/community-resources#libraries
[contributing]: https://github.com/discordjs/discord.js/blob/main/.github/CONTRIBUTING.md
