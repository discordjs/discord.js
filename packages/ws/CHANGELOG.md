# Changelog

All notable changes to this project will be documented in this file.

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

# [@discordjs/ws@0.2.0](https://github.com/discordjs/discord.js/compare/@discordjs/ws@0.1.0...@discordjs/ws@0.2.0) - (2022-07-30)

## Bug Fixes

- **WebSocketShard:** Account code 1000 with no prior indication (#8399) ([5137bfc](https://github.com/discordjs/discord.js/commit/5137bfc17d763488083b76ee9008611df333272a))

# [@discordjs/ws@0.1.0](https://github.com/discordjs/discord.js/tree/@discordjs/ws@0.1.0) - (2022-07-27)

## Bug Fixes

- **WebSocketShard:** Use correct import (#8357) ([78d4295](https://github.com/discordjs/discord.js/commit/78d4295a40b83ea4f7cc830ff81927cba2d1d3f0))

## Features

- @discordjs/ws (#8260) ([748d727](https://github.com/discordjs/discord.js/commit/748d7271c45796479a29d8ed3101421de09ef867))
