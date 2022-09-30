<div align="center">
	<br />
	<p>
		<a href="https://discord.js.org"><img src="https://discord.js.org/static/logo.svg" width="546" alt="discord.js" /></a>
	</p>
	<br />
	<p>
		<a href="https://discord.gg/djs"><img src="https://img.shields.io/discord/222078108977594368?color=5865F2&logo=discord&logoColor=white" alt="Discord server" /></a>
		<a href="https://hub.docker.com/r/discordjs/proxy"><img src="https://img.shields.io/docker/v/discordjs/proxy.svg?sort=semver&maxAge=3600" alt="dockerhub version" /></a>
		<a href="https://hub.docker.com/r/discordjs/proxy"><img src="https://img.shields.io/docker/pulls/discordjs/proxy.svg?maxAge=3600" alt="dockerhub pulls" /></a>
		<a href="https://github.com/discordjs/discord.js/actions"><img src="https://github.com/discordjs/discord.js/actions/workflows/test.yml/badge.svg" alt="Build status" /></a>
	</p>
	<p>
		<a href="https://vercel.com/?utm_source=discordjs&utm_campaign=oss"><img src="https://raw.githubusercontent.com/discordjs/discord.js/main/.github/powered-by-vercel.svg" alt="Vercel" /></a>
	</p>
</div>

## About

`@discordjs/proxy-container` - Lightweight HTTP proxy for Discord's API, brought to you as a container 📦

## Usage

Quickly spin up an instance:

`docker run -d --restart unless-stopped --name proxy -p 127.0.0.1:8080:8080 -e DISCORD_TOKEN=abc discordjs/proxy`

Use it:

```ts
import { Client } from 'discord.js';

const client = new Client({
	// other options,
	rest: {
		api: 'http://localhost:8080/api',
	},
});
```

Or with just `@discordjs/rest`:

```ts
import { REST } from '@discordjs/rest';

const rest = new REST({
	api: 'http://localhost:8080/api',
});
```

## Links

- [Website](https://discord.js.org/) ([source](https://github.com/discordjs/website))
- [discord.js Discord server](https://discord.gg/djs)
- [GitHub](https://github.com/discordjs/discord.js/tree/main/packages/proxy-container)
- [Docker Hub](https://hub.docker.com/r/discordjs/proxy)

## Contributing

Before creating an issue, please ensure that it hasn't already been reported/suggested.
See [the contribution guide](https://github.com/discordjs/discord.js/blob/main/.github/CONTRIBUTING.md) if you'd like to submit a PR.

## Help

If you don't understand something in the documentation, you are experiencing problems, or you just need a gentle
nudge in the right direction, please don't hesitate to join our official [discord.js Server](https://discord.gg/djs).
