# Changelog

All notable changes to this project will be documented in this file.

# [@discordjs/util@1.0.1](https://github.com/discordjs/discord.js/compare/@discordjs/util@1.0.0...@discordjs/util@1.0.1) - (2023-08-17)

## Documentation

- Update Node.js requirement to 16.11.0 (#9764) ([188877c](https://github.com/discordjs/discord.js/commit/188877c50af70f0d5cffb246620fa277435c6ce6))

# [@discordjs/util@1.0.0](https://github.com/discordjs/discord.js/compare/@discordjs/util@0.3.1...@discordjs/util@1.0.0) - (2023-07-31)

## Features

- No-de-no-de, now with extra buns (#9683) ([386f206](https://github.com/discordjs/discord.js/commit/386f206caf74a04c426799af9796ca96dcb37056))
  - **BREAKING CHANGE:** The REST and RequestManager classes now extend AsyncEventEmitter
from `@vladfrangu/async_event_emitter`, which aids in cross-compatibility
between Node, Deno, Bun, CF Workers, Vercel Functions, etc.
  - **BREAKING CHANGE:** DefaultUserAgentAppendix has been adapted to support multiple
different platforms (previously mentioned Deno, Bun, CF Workers, etc)
  - **BREAKING CHANGE:** the entry point for `@discordjs/rest` will now differ
in non-node-like environments (CF Workers, etc.)
  - **Co-authored-by:** Suneet Tipirneni <77477100+suneettipirneni@users.noreply.github.com>
  - **Co-authored-by:** Jiralite <33201955+Jiralite@users.noreply.github.com>
  - **Co-authored-by:** suneettipirneni <suneettipirneni@icloud.com>

# [@discordjs/util@0.3.1](https://github.com/discordjs/discord.js/compare/@discordjs/util@0.3.0...@discordjs/util@0.3.1) - (2023-05-01)

## Refactor

- **ShardClientUtil:** Logic de-duplication (#9491) ([a9f2bff](https://github.com/discordjs/discord.js/commit/a9f2bff82a18c6a3afdee99e5830e1d7b4da65dc))

# [@discordjs/util@0.3.0](https://github.com/discordjs/discord.js/compare/@discordjs/util@0.2.0...@discordjs/util@0.3.0) - (2023-05-01)

## Bug Fixes

- Fix external links (#9313) ([a7425c2](https://github.com/discordjs/discord.js/commit/a7425c29c4f23f1b31f4c6a463107ca9eb7fd7e2))
- **scripts:** Accessing tsComment ([d8d5f31](https://github.com/discordjs/discord.js/commit/d8d5f31d3927fd1de62f1fa3a1a6e454243ad87b))

## Documentation

- Generate static imports for types with api-extractor ([98a76db](https://github.com/discordjs/discord.js/commit/98a76db482879f79d6bb2fb2e5fc65ac2c34e2d9))

## Features

- **website:** Render syntax and mdx on the server (#9086) ([ee5169e](https://github.com/discordjs/discord.js/commit/ee5169e0aadd7bbfcd752aae614ec0f69602b68b))

# [@discordjs/util@1.0.0](https://github.com/discordjs/discord.js/compare/@discordjs/util@0.3.1...@discordjs/util@1.0.0) - (2023-07-31)

## Features

- No-de-no-de, now with extra buns (#9683) ([386f206](https://github.com/discordjs/discord.js/commit/386f206caf74a04c426799af9796ca96dcb37056))
  - **BREAKING CHANGE:** The REST and RequestManager classes now extend AsyncEventEmitter
from `@vladfrangu/async_event_emitter`, which aids in cross-compatibility
between Node, Deno, Bun, CF Workers, Vercel Functions, etc.
  - **BREAKING CHANGE:** DefaultUserAgentAppendix has been adapted to support multiple
different platforms (previously mentioned Deno, Bun, CF Workers, etc)
  - **BREAKING CHANGE:** the entry point for `@discordjs/rest` will now differ
in non-node-like environments (CF Workers, etc.)
  - **Co-authored-by:** Suneet Tipirneni <77477100+suneettipirneni@users.noreply.github.com>
  - **Co-authored-by:** Jiralite <33201955+Jiralite@users.noreply.github.com>
  - **Co-authored-by:** suneettipirneni <suneettipirneni@icloud.com>

# [@discordjs/util@0.3.1](https://github.com/discordjs/discord.js/compare/@discordjs/util@0.3.0...@discordjs/util@0.3.1) - (2023-05-01)

## Refactor

- **ShardClientUtil:** Logic de-duplication (#9491) ([a9f2bff](https://github.com/discordjs/discord.js/commit/a9f2bff82a18c6a3afdee99e5830e1d7b4da65dc))

# [@discordjs/util@0.3.0](https://github.com/discordjs/discord.js/compare/@discordjs/util@0.2.0...@discordjs/util@0.3.0) - (2023-05-01)

## Bug Fixes

- Fix external links (#9313) ([a7425c2](https://github.com/discordjs/discord.js/commit/a7425c29c4f23f1b31f4c6a463107ca9eb7fd7e2))
- **scripts:** Accessing tsComment ([d8d5f31](https://github.com/discordjs/discord.js/commit/d8d5f31d3927fd1de62f1fa3a1a6e454243ad87b))

## Documentation

- Generate static imports for types with api-extractor ([98a76db](https://github.com/discordjs/discord.js/commit/98a76db482879f79d6bb2fb2e5fc65ac2c34e2d9))

## Features

- **website:** Render syntax and mdx on the server (#9086) ([ee5169e](https://github.com/discordjs/discord.js/commit/ee5169e0aadd7bbfcd752aae614ec0f69602b68b))

# [@discordjs/util@0.3.1](https://github.com/discordjs/discord.js/compare/@discordjs/util@0.3.0...@discordjs/util@0.3.1) - (2023-05-01)

## Refactor

- **ShardClientUtil:** Logic de-duplication (#9491) ([a9f2bff](https://github.com/discordjs/discord.js/commit/a9f2bff82a18c6a3afdee99e5830e1d7b4da65dc))

# [@discordjs/util@0.3.0](https://github.com/discordjs/discord.js/compare/@discordjs/util@0.2.0...@discordjs/util@0.3.0) - (2023-05-01)

## Bug Fixes

- Fix external links (#9313) ([a7425c2](https://github.com/discordjs/discord.js/commit/a7425c29c4f23f1b31f4c6a463107ca9eb7fd7e2))
- **scripts:** Accessing tsComment ([d8d5f31](https://github.com/discordjs/discord.js/commit/d8d5f31d3927fd1de62f1fa3a1a6e454243ad87b))

## Documentation

- Generate static imports for types with api-extractor ([98a76db](https://github.com/discordjs/discord.js/commit/98a76db482879f79d6bb2fb2e5fc65ac2c34e2d9))

## Features

- **website:** Render syntax and mdx on the server (#9086) ([ee5169e](https://github.com/discordjs/discord.js/commit/ee5169e0aadd7bbfcd752aae614ec0f69602b68b))

# [@discordjs/util@0.3.0](https://github.com/discordjs/discord.js/compare/@discordjs/util@0.2.0...@discordjs/util@0.3.0) - (2023-05-01)

## Bug Fixes

- Fix external links (#9313) ([a7425c2](https://github.com/discordjs/discord.js/commit/a7425c29c4f23f1b31f4c6a463107ca9eb7fd7e2))
- **scripts:** Accessing tsComment ([d8d5f31](https://github.com/discordjs/discord.js/commit/d8d5f31d3927fd1de62f1fa3a1a6e454243ad87b))

## Documentation

- Generate static imports for types with api-extractor ([98a76db](https://github.com/discordjs/discord.js/commit/98a76db482879f79d6bb2fb2e5fc65ac2c34e2d9))

## Features

- **website:** Render syntax and mdx on the server (#9086) ([ee5169e](https://github.com/discordjs/discord.js/commit/ee5169e0aadd7bbfcd752aae614ec0f69602b68b))

# [@discordjs/util@0.2.0](https://github.com/discordjs/discord.js/compare/@discordjs/util@0.1.0...@discordjs/util@0.2.0) - (2023-03-12)

## Bug Fixes

- Pin @types/node version ([9d8179c](https://github.com/discordjs/discord.js/commit/9d8179c6a78e1c7f9976f852804055964d5385d4))

## Features

- **website:** Add support for source file links (#9048) ([f6506e9](https://github.com/discordjs/discord.js/commit/f6506e99c496683ee0ab67db0726b105b929af38))
- **core:** Implement some ws send events (#8941) ([816aed4](https://github.com/discordjs/discord.js/commit/816aed478e3035060697092d52ad2b58106be0ee))
- Web-components (#8715) ([0ac3e76](https://github.com/discordjs/discord.js/commit/0ac3e766bd9dbdeb106483fa4bb085d74de346a2))

# [@discordjs/util@0.1.0](https://github.com/discordjs/discord.js/tree/@discordjs/util@0.1.0) - (2022-10-03)

## Features

- Add `@discordjs/util` (#8591) ([b2ec865](https://github.com/discordjs/discord.js/commit/b2ec865765bf94181473864a627fb63ea8173fd3))
