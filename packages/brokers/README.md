<div align="center">
	<br />
	<p>
		<a href="https://discord.js.org"><img src="https://discord.js.org/static/logo.svg" width="546" alt="discord.js" /></a>
	</p>
	<br />
	<p>
		<a href="https://discord.gg/djs"><img src="https://img.shields.io/discord/222078108977594368?color=5865F2&logo=discord&logoColor=white" alt="Discord server" /></a>
		<a href="https://www.npmjs.com/package/@discordjs/brokers"><img src="https://img.shields.io/npm/v/@discordjs/brokers.svg?maxAge=3600" alt="npm version" /></a>
		<a href="https://www.npmjs.com/package/@discordjs/brokers"><img src="https://img.shields.io/npm/dt/@discordjs/brokers.svg?maxAge=3600" alt="npm downloads" /></a>
		<a href="https://github.com/discordjs/discord.js/actions"><img src="https://github.com/discordjs/discord.js/actions/workflows/test.yml/badge.svg" alt="Build status" /></a>
		<a href="https://codecov.io/gh/discordjs/discord.js" ><img src="https://codecov.io/gh/discordjs/discord.js/branch/main/graph/badge.svg?precision=2&flag=brokers" alt="Code coverage" /></a>
	</p>
	<p>
		<a href="https://vercel.com/?utm_source=discordjs&utm_campaign=oss"><img src="https://raw.githubusercontent.com/discordjs/discord.js/main/.github/powered-by-vercel.svg" alt="Vercel" /></a>
	</p>
</div>

## About

`@discordjs/brokers` is a powerful set of message brokers

## Installation

**Node.js 16.9.0 or newer is required.**

```sh
npm install @discordjs/brokers
yarn add @discordjs/brokers
pnpm add @discordjs/brokers
```

## Example usage

### pub sub

```ts
// publisher.js
import { PubSubRedisBroker } from '@discordjs/brokers';
import Redis from 'ioredis';

const broker = new PubSubRedisBroker({ redisClient: new Redis() });

await broker.publish('test', 'Hello World!');
await broker.destroy();

// subscriber.js
import { PubSubRedisBroker } from '@discordjs/brokers';
import Redis from 'ioredis';

const broker = new PubSubRedisBroker({ redisClient: new Redis() });
broker.on('test', ({ data, ack }) => {
	console.log(data);
	void ack();
});

await broker.subscribe('subscribers', ['test']);
```

### RPC

```ts
// caller.js
import { RPCRedisBroker } from '@discordjs/brokers';
import Redis from 'ioredis';

const broker = new RPCRedisBroker({ redisClient: new Redis() });

console.log(await broker.call('testcall', 'Hello World!'));
await broker.destroy();

// responder.js
import { RPCRedisBroker } from '@discordjs/brokers';
import Redis from 'ioredis';

const broker = new RPCRedisBroker({ redisClient: new Redis() });
broker.on('testcall', ({ data, ack, reply }) => {
	console.log('responder', data);
	void ack();
	void reply(`Echo: ${data}`);
});

await broker.subscribe('responders', ['testcall']);
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

If you don't understand something in the documentation, you are experiencing problems, or you just need a gentle
nudge in the right direction, please don't hesitate to join our official [discord.js Server][discord].

[website]: https://discord.js.org/
[website-source]: https://github.com/discordjs/discord.js/tree/main/apps/website
[documentation]: https://discord.js.org/#/docs/brokers
[guide]: https://discordjs.guide/
[guide-source]: https://github.com/discordjs/guide
[guide-update]: https://discordjs.guide/additional-info/changes-in-v14.html
[discord]: https://discord.gg/djs
[discord-api]: https://discord.gg/discord-api
[source]: https://github.com/discordjs/discord.js/tree/main/packages/brokers
[npm]: https://www.npmjs.com/package/@discordjs/brokers
[related-libs]: https://discord.com/developers/docs/topics/community-resources#libraries
[contributing]: https://github.com/discordjs/discord.js/blob/main/.github/CONTRIBUTING.md
