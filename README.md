<div align="center">
	<br />
	<p>
		<a href="https://discord.js.org"><img src="https://discord.js.org/static/logo.svg" width="546" alt="discord.js" /></a>
	</p>
	<br />
	<p>
		<a href="https://discord.gg/djs"><img src="https://img.shields.io/discord/222078108977594368?color=5865F2&logo=discord&logoColor=white" alt="Discord server" /></a>
		<a href="https://www.npmjs.com/package/discord.js"><img src="https://img.shields.io/npm/v/discord.js.svg?maxAge=3600" alt="npm version" /></a>
		<a href="https://www.npmjs.com/package/discord.js"><img src="https://img.shields.io/npm/dt/discord.js.svg?maxAge=3600" alt="npm downloads" /></a>
		<a href="https://github.com/discordjs/discord.js/actions"><img src="https://github.com/discordjs/discord.js/actions/workflows/test.yml/badge.svg" alt="Tests status" /></a>
		<a href="https://codecov.io/gh/discordjs/discord.js" ><img src="https://codecov.io/gh/discordjs/discord.js/branch/main/graph/badge.svg?precision=2" alt="Code coverage" /></a>
	</p>
	<p>
		<a href="https://vercel.com/?utm_source=discordjs&utm_campaign=oss"><img src="https://raw.githubusercontent.com/discordjs/discord.js/main/.github/powered-by-vercel.svg" alt="Vercel" /></a>
	</p>
</div>

## About

This repository contains multiple packages with separate [releases][github-releases]. You can find the assembled Discord API wrapper at [`discord.js`][source]. It is a powerful [Node.js](https://nodejs.org/en) module that allows you to easily interact with the [Discord API](https://discord.com/developers/docs/intro).

## Getting started

To get started with a package, navigate to its directory (packages/{packagename}) and follow the instructions in its README file. You can also find links to the documentation, guide, and other resources in the [Links](#links) section.

### Packages

- `discord.js` ([source][source]) - A powerful Node.js module for interacting with the Discord API
- `@discordjs/brokers` ([source][brokers-source]) - A collection of brokers for use with discord.js
- `@discordjs/builders` ([source][builders-source]) - A utility package for easily building Discord API payloads
- `@discordjs/collection` ([source][collection-source]) - A powerful utility data structure
- `@discordjs/core` ([source][core-source]) - A thinly abstracted wrapper around the core components of the Discord API
- `@discordjs/formatters` ([source][formatters-source]) - A collection of functions for formatting strings
- `@discordjs/proxy` ([source][proxy-source]) - A wrapper around `@discordjs/rest` for running an HTTP proxy
- `@discordjs/rest` ([source][rest-source]) - A module for interacting with the Discord REST API
- `@discordjs/voice` ([source][voice-source]) - A module for interacting with the Discord Voice API
- `@discordjs/util` ([source][util-source]) - A collection of utility functions
- `@discordjs/ws` ([source][ws-source]) - A wrapper around Discord's gateway

### Optional packages

- [zlib-sync](https://www.npmjs.com/package/zlib-sync) for WebSocket data compression and inflation (`npm install zlib-sync`)
- [erlpack](https://github.com/discord/erlpack) for significantly faster WebSocket data (de)serialisation (`npm install discord/erlpack`)
- [bufferutil](https://www.npmjs.com/package/bufferutil) for a much faster WebSocket connection (`npm install bufferutil`)
- [utf-8-validate](https://www.npmjs.com/package/utf-8-validate) in combination with `bufferutil` for much faster WebSocket processing (`npm install utf-8-validate`)
- [@discordjs/voice](https://www.npmjs.com/package/@discordjs/voice) for interacting with the Discord Voice API (`npm install @discordjs/voice`)

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

### Extensions

- [RPC][rpc] ([source][rpc-source])

## Contributing

Please read through our [contribution guidelines][contributing] before starting a pull request. We welcome contributions of all kinds, not just code! If you're stuck for ideas, look for the [good first issue][good-first-issue] label on issues in the repository. If you have any questions about the project, feel free to ask them on [Discord][discord]. Before creating your own issue or pull request, always check to see if one already exists! Don't rush contributions, take your time and ensure you're doing it correctly.

## Help

If you don't understand something in the documentation, you are experiencing problems, or you just need a gentle nudge in the right direction, please join our [Discord server][discord].

[website]: https://discord.js.org/
[website-source]: https://github.com/discordjs/discord.js/tree/main/apps/website
[documentation]: https://discordjs.dev/docs/packages
[guide]: https://discordjs.guide/
[guide-source]: https://github.com/discordjs/guide
[guide-update]: https://discordjs.guide/additional-info/changes-in-v14.html
[discord]: https://discord.gg/djs
[discord-api]: https://discord.gg/discord-api
[source]: https://github.com/discordjs/discord.js/tree/main/packages/discord.js
[npm]: https://www.npmjs.com/package/discord.js
[related-libs]: https://discord.com/developers/docs/topics/community-resources#libraries
[rpc]: https://www.npmjs.com/package/discord-rpc
[rpc-source]: https://github.com/discordjs/RPC
[contributing]: https://github.com/discordjs/discord.js/blob/main/.github/CONTRIBUTING.md
[github-releases]: https://github.com/discordjs/discord.js/releases
[brokers-source]: https://github.com/discordjs/discord.js/tree/main/packages/brokers
[builders-source]: https://github.com/discordjs/discord.js/tree/main/packages/builders
[collection-source]: https://github.com/discordjs/discord.js/tree/main/packages/collection
[core-source]: https://github.com/discordjs/discord.js/tree/main/packages/core
[formatters-source]: https://github.com/discordjs/discord.js/tree/main/packages/formatters
[proxy-source]: https://github.com/discordjs/discord.js/tree/main/packages/proxy
[rest-source]: https://github.com/discordjs/discord.js/tree/main/packages/rest
[voice-source]: https://github.com/discordjs/discord.js/tree/main/packages/voice
[util-source]: https://github.com/discordjs/discord.js/tree/main/packages/util
[ws-source]: https://github.com/discordjs/discord.js/tree/main/packages/ws
[good-first-issue]: https://github.com/discordjs/discord.js/contribute
