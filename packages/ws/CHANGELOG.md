# Changelog

All notable changes to this project will be documented in this file.

# [@discordjs/ws@1.0.1](https://github.com/discordjs/discord.js/compare/@discordjs/ws@1.0.0...@discordjs/ws@1.0.1) - (2023-08-17)

## Documentation

- Update Node.js requirement to 16.11.0 (#9764) ([188877c](https://github.com/discordjs/discord.js/commit/188877c50af70f0d5cffb246620fa277435c6ce6))

# [@discordjs/ws@1.0.0](https://github.com/discordjs/discord.js/compare/@discordjs/ws@0.8.3...@discordjs/ws@1.0.0) - (2023-07-31)

## Bug Fixes

- **WebSocketShard:** Close errors not being catchable (#9704) ([8c782bf](https://github.com/discordjs/discord.js/commit/8c782bfd52b1d7bbfbf1dfd39d0c45828298e285))
- **WebSocketManager:** Always cache result of fetchGatewayInformation (#9611) ([df8b6e9](https://github.com/discordjs/discord.js/commit/df8b6e9934af5b21aa2701ce54244c38a5f133e0))
- **WebSocketShard:** Handle initial connect being a resume (#9549) ([4dcc9c5](https://github.com/discordjs/discord.js/commit/4dcc9c50f83cd234cb2c2ede47fb505ffb75eef2))

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

## Refactor

- **WebSocketShard:** Throttling error handling (#9701) ([ceab07b](https://github.com/discordjs/discord.js/commit/ceab07bec85c8d678958b8023a9c1902136f9f83))
- **rest:** Switch api to fetch-like and provide strategies (#9416) ([cdaa0a3](https://github.com/discordjs/discord.js/commit/cdaa0a36f586459f1e5ede868c4250c7da90455c))
  - **BREAKING CHANGE:** NodeJS v18+ is required when using node due to the use of global `fetch`
  - **BREAKING CHANGE:** The raw method of REST now returns a web compatible `Respone` object.
  - **BREAKING CHANGE:** The `parseResponse` utility method has been updated to operate on a web compatible `Response` object.
  - **BREAKING CHANGE:** Many underlying internals have changed, some of which were exported.
  - **BREAKING CHANGE:** `DefaultRestOptions` used to contain a default `agent`, which is now set to `null` instead.

# [@discordjs/ws@0.8.3](https://github.com/discordjs/discord.js/compare/@discordjs/ws@0.8.2...@discordjs/ws@0.8.3) - (2023-05-06)

## Bug Fixes

- **WebSocketShard:** Wait a little before reconnecting (#9517) ([00da44a](https://github.com/discordjs/discord.js/commit/00da44a120fb0eeb2bdc3a03670836a544dc5418))

## Testing

- **ws:** Fix tests (#9520) ([3e80f0b](https://github.com/discordjs/discord.js/commit/3e80f0b384ea2dc14c1b60b5897e90040cab9a24))

# [@discordjs/ws@0.8.2](https://github.com/discordjs/discord.js/compare/@discordjs/ws@0.8.1...@discordjs/ws@0.8.2) - (2023-05-01)

## Documentation

- Generate static imports for types with api-extractor ([98a76db](https://github.com/discordjs/discord.js/commit/98a76db482879f79d6bb2fb2e5fc65ac2c34e2d9))

# [@discordjs/ws@0.8.1](https://github.com/discordjs/discord.js/compare/@discordjs/ws@0.8.0...@discordjs/ws@0.8.1) - (2023-04-16)

## Bug Fixes

- Fix external links (#9313) ([a7425c2](https://github.com/discordjs/discord.js/commit/a7425c29c4f23f1b31f4c6a463107ca9eb7fd7e2))

## Refactor

- Abstract identify throttling and correct max_concurrency handling (#9375) ([02dfaf1](https://github.com/discordjs/discord.js/commit/02dfaf1aa2c798315d0dd7f809cc469771b36ffc))
- **WebSocketShard:** WaitForEvent and its error handling (#9282) ([dcf58d8](https://github.com/discordjs/discord.js/commit/dcf58d81401387a5e157b20829aa56638e106e9d))

# [@discordjs/ws@1.0.0](https://github.com/discordjs/discord.js/compare/@discordjs/ws@0.8.3...@discordjs/ws@1.0.0) - (2023-07-31)

## Bug Fixes

- **WebSocketShard:** Close errors not being catchable (#9704) ([8c782bf](https://github.com/discordjs/discord.js/commit/8c782bfd52b1d7bbfbf1dfd39d0c45828298e285))
- **WebSocketManager:** Always cache result of fetchGatewayInformation (#9611) ([df8b6e9](https://github.com/discordjs/discord.js/commit/df8b6e9934af5b21aa2701ce54244c38a5f133e0))
- **WebSocketShard:** Handle initial connect being a resume (#9549) ([4dcc9c5](https://github.com/discordjs/discord.js/commit/4dcc9c50f83cd234cb2c2ede47fb505ffb75eef2))

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

## Refactor

- **WebSocketShard:** Throttling error handling (#9701) ([ceab07b](https://github.com/discordjs/discord.js/commit/ceab07bec85c8d678958b8023a9c1902136f9f83))
- **rest:** Switch api to fetch-like and provide strategies (#9416) ([cdaa0a3](https://github.com/discordjs/discord.js/commit/cdaa0a36f586459f1e5ede868c4250c7da90455c))
  - **BREAKING CHANGE:** NodeJS v18+ is required when using node due to the use of global `fetch`
  - **BREAKING CHANGE:** The raw method of REST now returns a web compatible `Respone` object.
  - **BREAKING CHANGE:** The `parseResponse` utility method has been updated to operate on a web compatible `Response` object.
  - **BREAKING CHANGE:** Many underlying internals have changed, some of which were exported.
  - **BREAKING CHANGE:** `DefaultRestOptions` used to contain a default `agent`, which is now set to `null` instead.

# [@discordjs/ws@0.8.3](https://github.com/discordjs/discord.js/compare/@discordjs/ws@0.8.2...@discordjs/ws@0.8.3) - (2023-05-06)

## Bug Fixes

- **WebSocketShard:** Wait a little before reconnecting (#9517) ([00da44a](https://github.com/discordjs/discord.js/commit/00da44a120fb0eeb2bdc3a03670836a544dc5418))

## Testing

- **ws:** Fix tests (#9520) ([3e80f0b](https://github.com/discordjs/discord.js/commit/3e80f0b384ea2dc14c1b60b5897e90040cab9a24))

# [@discordjs/ws@0.8.2](https://github.com/discordjs/discord.js/compare/@discordjs/ws@0.8.1...@discordjs/ws@0.8.2) - (2023-05-01)

## Documentation

- Generate static imports for types with api-extractor ([98a76db](https://github.com/discordjs/discord.js/commit/98a76db482879f79d6bb2fb2e5fc65ac2c34e2d9))

# [@discordjs/ws@0.8.1](https://github.com/discordjs/discord.js/compare/@discordjs/ws@0.8.0...@discordjs/ws@0.8.1) - (2023-04-16)

## Bug Fixes

- Fix external links (#9313) ([a7425c2](https://github.com/discordjs/discord.js/commit/a7425c29c4f23f1b31f4c6a463107ca9eb7fd7e2))

## Refactor

- Abstract identify throttling and correct max_concurrency handling (#9375) ([02dfaf1](https://github.com/discordjs/discord.js/commit/02dfaf1aa2c798315d0dd7f809cc469771b36ffc))
- **WebSocketShard:** WaitForEvent and its error handling (#9282) ([dcf58d8](https://github.com/discordjs/discord.js/commit/dcf58d81401387a5e157b20829aa56638e106e9d))

# [@discordjs/ws@0.8.3](https://github.com/discordjs/discord.js/compare/@discordjs/ws@0.8.2...@discordjs/ws@0.8.3) - (2023-05-06)

## Bug Fixes

- **WebSocketShard:** Wait a little before reconnecting (#9517) ([00da44a](https://github.com/discordjs/discord.js/commit/00da44a120fb0eeb2bdc3a03670836a544dc5418))

## Testing

- **ws:** Fix tests (#9520) ([3e80f0b](https://github.com/discordjs/discord.js/commit/3e80f0b384ea2dc14c1b60b5897e90040cab9a24))

# [@discordjs/ws@0.8.2](https://github.com/discordjs/discord.js/compare/@discordjs/ws@0.8.1...@discordjs/ws@0.8.2) - (2023-05-01)

## Documentation

- Generate static imports for types with api-extractor ([98a76db](https://github.com/discordjs/discord.js/commit/98a76db482879f79d6bb2fb2e5fc65ac2c34e2d9))

# [@discordjs/ws@0.8.1](https://github.com/discordjs/discord.js/compare/@discordjs/ws@0.8.0...@discordjs/ws@0.8.1) - (2023-04-16)

## Bug Fixes

- Fix external links (#9313) ([a7425c2](https://github.com/discordjs/discord.js/commit/a7425c29c4f23f1b31f4c6a463107ca9eb7fd7e2))

## Refactor

- Abstract identify throttling and correct max_concurrency handling (#9375) ([02dfaf1](https://github.com/discordjs/discord.js/commit/02dfaf1aa2c798315d0dd7f809cc469771b36ffc))
- **WebSocketShard:** WaitForEvent and its error handling (#9282) ([dcf58d8](https://github.com/discordjs/discord.js/commit/dcf58d81401387a5e157b20829aa56638e106e9d))

# [@discordjs/ws@0.8.2](https://github.com/discordjs/discord.js/compare/@discordjs/ws@0.8.1...@discordjs/ws@0.8.2) - (2023-05-01)

## Documentation

- Generate static imports for types with api-extractor ([98a76db](https://github.com/discordjs/discord.js/commit/98a76db482879f79d6bb2fb2e5fc65ac2c34e2d9))

# [@discordjs/ws@0.8.1](https://github.com/discordjs/discord.js/compare/@discordjs/ws@0.8.0...@discordjs/ws@0.8.1) - (2023-04-16)

## Bug Fixes

- Fix external links (#9313) ([a7425c2](https://github.com/discordjs/discord.js/commit/a7425c29c4f23f1b31f4c6a463107ca9eb7fd7e2))

## Refactor

- Abstract identify throttling and correct max_concurrency handling (#9375) ([02dfaf1](https://github.com/discordjs/discord.js/commit/02dfaf1aa2c798315d0dd7f809cc469771b36ffc))
- **WebSocketShard:** WaitForEvent and its error handling (#9282) ([dcf58d8](https://github.com/discordjs/discord.js/commit/dcf58d81401387a5e157b20829aa56638e106e9d))

# [@discordjs/ws@0.8.1](https://github.com/discordjs/discord.js/compare/@discordjs/ws@0.8.0...@discordjs/ws@0.8.1) - (2023-04-16)

## Bug Fixes

- Fix external links (#9313) ([a7425c2](https://github.com/discordjs/discord.js/commit/a7425c29c4f23f1b31f4c6a463107ca9eb7fd7e2))

## Refactor

- Abstract identify throttling and correct max_concurrency handling (#9375) ([02dfaf1](https://github.com/discordjs/discord.js/commit/02dfaf1aa2c798315d0dd7f809cc469771b36ffc))
- **WebSocketShard:** WaitForEvent and its error handling (#9282) ([dcf58d8](https://github.com/discordjs/discord.js/commit/dcf58d81401387a5e157b20829aa56638e106e9d))

# [@discordjs/ws@0.8.0](https://github.com/discordjs/discord.js/compare/@discordjs/ws@0.7.0...@discordjs/ws@0.8.0) - (2023-04-01)

## Bug Fixes

- **scripts:** Accessing tsComment ([d8d5f31](https://github.com/discordjs/discord.js/commit/d8d5f31d3927fd1de62f1fa3a1a6e454243ad87b))
- **WebSocketShard:** Don't await #destroy in error bubbling logic (#9276) ([519825a](https://github.com/discordjs/discord.js/commit/519825a651fe22042a73046824d12f03f56ca9e2))
- **WebSocketShard:** Don't close in #destroy when status is connecting (#9254) ([c76b17d](https://github.com/discordjs/discord.js/commit/c76b17d3b327fb55ef76770d4825e02ab8f26ad1))
- **WebSocketShard:** Cancel initial heartbeat in destroy (#9244) ([9842082](https://github.com/discordjs/discord.js/commit/98420826bc2296fc392f17e8254cf4ad743ff5af))

## Features

- **website:** Render syntax and mdx on the server (#9086) ([ee5169e](https://github.com/discordjs/discord.js/commit/ee5169e0aadd7bbfcd752aae614ec0f69602b68b))

# [@discordjs/ws@0.7.0](https://github.com/discordjs/discord.js/compare/@discordjs/ws@0.6.0...@discordjs/ws@0.7.0) - (2023-03-12)

## Bug Fixes

- **WebSocketShard:** #send race condition due to ready state (#9226) ([a99fc64](https://github.com/discordjs/discord.js/commit/a99fc64e3f73c3976617a7ed825fa7d6e9fb3b53))
- **WebSocketShard:** Wait for hello rather than ready in connect (#9178) ([27e0b32](https://github.com/discordjs/discord.js/commit/27e0b32c5f0fe605f152e6ba67ce3f596137ff01))
- **WebSocketShard:** Proper error bubbling (#9119) ([9681f34](https://github.com/discordjs/discord.js/commit/9681f348770b0e2ff9b7c96b1c30575dd950e2ed))
- Ws typo (#9056) ([05a1cbf](https://github.com/discordjs/discord.js/commit/05a1cbfe5479195b0bc9b6f0971fe39f6af6fd77))

## Documentation

- Fix typos (#9127) ([1ba1f23](https://github.com/discordjs/discord.js/commit/1ba1f238f04221ec890fc921678909b5b7d92c26))
- Fix version export (#9049) ([8b70f49](https://github.com/discordjs/discord.js/commit/8b70f497a1207e30edebdecd12b926c981c13d28))
- Updated @discordjs/ws README.md to include optional packages (#8973) ([4ee00b6](https://github.com/discordjs/discord.js/commit/4ee00b6534fad39da1fe54fb2c1766b264a020ca))

## Features

- **WebSocketShard:** Heartbeat jitter (#9223) ([6ecff26](https://github.com/discordjs/discord.js/commit/6ecff26ec65ce1d559a3406b396b3190868b1961))
- **website:** Add support for source file links (#9048) ([f6506e9](https://github.com/discordjs/discord.js/commit/f6506e99c496683ee0ab67db0726b105b929af38))
- **ws:** Custom workers (#9004) ([828a13b](https://github.com/discordjs/discord.js/commit/828a13b526dde1334e8879e76e664584bdb5db73))
- **ws:** Metrics (#9005) ([0ff67d8](https://github.com/discordjs/discord.js/commit/0ff67d8e7adee43ff82bbf072dac9a4c7c9fe8c2))

## Refactor

- **WebSocketManager:** Passing in strategy (#9122) ([5c5a583](https://github.com/discordjs/discord.js/commit/5c5a5832b94cd4d371cc99c4f9c3384523dabeeb))

## Styling

- Run prettier (#9041) ([2798ba1](https://github.com/discordjs/discord.js/commit/2798ba1eb3d734f0cf2eeccd2e16cfba6804873b))

# [@discordjs/ws@0.6.0](https://github.com/discordjs/discord.js/compare/@discordjs/ws@0.5.0...@discordjs/ws@0.6.0) - (2022-12-16)

## Bug Fixes

- **WebSocketShard:** Send ratelimit handling (#8887) ([40b504a](https://github.com/discordjs/discord.js/commit/40b504a2088effc6a467f40ac3cf2a6d736ab209))

## Features

- **core:** Add support for role connections (#8930) ([3d6fa24](https://github.com/discordjs/discord.js/commit/3d6fa248c07b2278504bbe8bafa17a3294971fd9))

## Refactor

- **WebSocketShard:** Identify throttling (#8888) ([8f552a0](https://github.com/discordjs/discord.js/commit/8f552a0e17c0eca71063e7a4353b9b351bcdf9fd))

# [@discordjs/ws@0.5.0](https://github.com/discordjs/discord.js/compare/@discordjs/ws@0.4.1...@discordjs/ws@0.5.0) - (2022-11-28)

## Bug Fixes

- Pin @types/node version ([9d8179c](https://github.com/discordjs/discord.js/commit/9d8179c6a78e1c7f9976f852804055964d5385d4))

## Documentation

- Remove unused imports (#8744) ([179392d](https://github.com/discordjs/discord.js/commit/179392d6d7d634c6d10f6abb20c072516c1c1d43))

## Features

- New select menus (#8793) ([5152abf](https://github.com/discordjs/discord.js/commit/5152abf7285581abf7689e9050fdc56c4abb1e2b))

# [@discordjs/ws@0.4.1](https://github.com/discordjs/discord.js/compare/@discordjs/ws@0.4.0...@discordjs/ws@0.4.1) - (2022-10-10)

## Bug Fixes

- **WebSocketShard:** Dispatch race condition (#8731) ([c2b6777](https://github.com/discordjs/discord.js/commit/c2b677759b905d6eb3ebcefcec2cb04eb38436bb))

# [@discordjs/ws@0.4.0](https://github.com/discordjs/discord.js/compare/@discordjs/ws@0.3.0...@discordjs/ws@0.4.0) - (2022-10-08)

## Bug Fixes

- Ws package.json path (#8720) ([7af3c3b](https://github.com/discordjs/discord.js/commit/7af3c3b6f1517a5d14372b5aa0ef3a2ed8633f6f))
- **WebSocketShard:** Add ready data parameter to ready event (#8705) ([a7eab50](https://github.com/discordjs/discord.js/commit/a7eab50ee3e286ca10e37107d695385251bd044d))
- Footer / sidebar / deprecation alert ([ba3e0ed](https://github.com/discordjs/discord.js/commit/ba3e0ed348258fe8e51eefb4aa7379a1230616a9))

## Documentation

- Change name (#8604) ([dd5a089](https://github.com/discordjs/discord.js/commit/dd5a08944c258a847fc4377f1d5e953264ab47d0))

## Features

- Web-components (#8715) ([0ac3e76](https://github.com/discordjs/discord.js/commit/0ac3e766bd9dbdeb106483fa4bb085d74de346a2))
- Add `@discordjs/util` (#8591) ([b2ec865](https://github.com/discordjs/discord.js/commit/b2ec865765bf94181473864a627fb63ea8173fd3))

## Refactor

- Website components (#8600) ([c334157](https://github.com/discordjs/discord.js/commit/c3341570d983aea9ecc419979d5a01de658c9d67))
- Use `eslint-config-neon` for packages. (#8579) ([edadb9f](https://github.com/discordjs/discord.js/commit/edadb9fe5dfd9ff51a3cfc9b25cb242d3f9f5241))

# [@discordjs/ws@0.3.0](https://github.com/discordjs/discord.js/compare/@discordjs/ws@0.2.0...@discordjs/ws@0.3.0) - (2022-08-22)

## Bug Fixes

- **WebSocketShard#destroy:** Wait for close and cleanup listeners (#8479) ([acdafe6](https://github.com/discordjs/discord.js/commit/acdafe60c7aa1ac5a3d358934c055c297080a944))
- **WebSocketManager#connect:** Check if we have enough sessions (#8481) ([4fd4252](https://github.com/discordjs/discord.js/commit/4fd42528fea6127e6468a651f9544913c19ade4d))
- **WebSocketShard:** Always reconnect on disconnected with 1000 (#8405) ([359f688](https://github.com/discordjs/discord.js/commit/359f6885558fcfb3151971ab589077a89ee71a01))
- **WebSocketShard:** Emit errors directly instead of objects (#8406) ([3161e1a](https://github.com/discordjs/discord.js/commit/3161e1a1acfbf929ecf33958fa1657553dd9bc1e))

## Documentation

- Fence examples in codeblocks ([193b252](https://github.com/discordjs/discord.js/commit/193b252672440a860318d3c2968aedd9cb88e0ce))

## Features

- **website:** Show `constructor` information (#8540) ([e42fd16](https://github.com/discordjs/discord.js/commit/e42fd1636973b10dd7ed6fb4280ee1a4a8f82007))
- **website:** Render `@defaultValue` blocks (#8527) ([8028813](https://github.com/discordjs/discord.js/commit/8028813825e7708915ea892760c1003afd60df2f))
- **website:** Render tsdoc examples (#8494) ([7116647](https://github.com/discordjs/discord.js/commit/7116647947e413da59fbf493ed5251ddcd710ce7))
- **WebSocketShard:** Support new resume url (#8480) ([bc06cc6](https://github.com/discordjs/discord.js/commit/bc06cc638d2f57ab5c600e8cdb6afc8eb2180166))

## Refactor

- **website:** Adjust typography (#8503) ([0f83402](https://github.com/discordjs/discord.js/commit/0f834029850d2448981596cf082ff59917018d66))
- Docs design (#8487) ([4ab1d09](https://github.com/discordjs/discord.js/commit/4ab1d09997a18879a9eb9bda39df6f15aa22557e))

# [@discordjs/ws@0.2.0](https://github.com/discordjs/discord.js/tree/@discordjs/ws@0.2.0) - (2022-07-30)

## Bug Fixes

- **WebSocketShard:** Account code 1000 with no prior indication (#8399) ([5137bfc](https://github.com/discordjs/discord.js/commit/5137bfc17d763488083b76ee9008611df333272a))
- **WebSocketShard:** Use correct import (#8357) ([78d4295](https://github.com/discordjs/discord.js/commit/78d4295a40b83ea4f7cc830ff81927cba2d1d3f0))

## Features

- @discordjs/ws (#8260) ([748d727](https://github.com/discordjs/discord.js/commit/748d7271c45796479a29d8ed3101421de09ef867))
