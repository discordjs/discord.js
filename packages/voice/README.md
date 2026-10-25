<div align="center">
	<br />
	<p>
		<a href="https://discord.js.org"><img src="https://discord.js.org/static/logo.svg" width="546" alt="discord.js" /></a>
	</p>
	<br />
	<p>
		<a href="https://discord.gg/djs"><img src="https://img.shields.io/badge/join_us-on_discord-5865F2?logo=discord&logoColor=white" alt="Discord server" /></a>
		<a href="https://www.npmjs.com/package/@discordjs/voice"><img src="https://img.shields.io/npm/v/@discordjs/voice.svg?maxAge=3600" alt="npm version" /></a>
		<a href="https://www.npmjs.com/package/@discordjs/voice"><img src="https://img.shields.io/npm/dt/@discordjs/voice.svg?maxAge=3600" alt="npm downloads" /></a>
		<a href="https://github.com/discordjs/discord.js/actions"><img src="https://github.com/discordjs/discord.js/actions/workflows/tests.yml/badge.svg" alt="Build status" /></a>
		<a href="https://github.com/discordjs/discord.js/commits/main/packages/voice"><img alt="Last commit." src="https://img.shields.io/github/last-commit/discordjs/discord.js?logo=github&logoColor=ffffff&path=packages%2Fvoice" /></a>
		<a href="https://opencollective.com/discordjs"><img src="https://img.shields.io/opencollective/backers/discordjs?maxAge=3600&logo=opencollective" alt="backers" /></a>
		<a href="https://codecov.io/gh/discordjs/discord.js"><img src="https://codecov.io/gh/discordjs/discord.js/branch/main/graph/badge.svg?precision=2&flag=voice" alt="Code coverage" /></a>
	</p>
	<p>
		<a href="https://vercel.com/?utm_source=discordjs&utm_campaign=oss"><img src="https://raw.githubusercontent.com/discordjs/discord.js/main/.github/powered-by-vercel.svg" alt="Vercel" /></a>
		<a href="https://www.cloudflare.com"><img src="https://raw.githubusercontent.com/discordjs/discord.js/main/.github/powered-by-workers.png" alt="Cloudflare Workers" height="44" /></a>
	</p>
</div>

## About

`@discordjs/voice` is a TypeScript implementation of the Discord Voice API for Node.js.

> [!IMPORTANT]
> This is a **fork** of [`@discordjs/voice`](https://github.com/discordjs/discord.js) (based on v0.19.2) that adds support for
> **receiving video streams (user cameras and screen shares)** from Discord voice channels - see
> [Receiving video](#receiving-video-camera--screen-capture) below.

**Features:**

- Send and receive\* audio in Discord voice-based channels
- **Receive video\* from users' cameras and screen shares (this fork)**
- A strong focus on reliability and predictable behavior
- Horizontal scalability and libraries other than [discord.js](https://discord.js.org/) are supported with custom adapters
- A robust audio processing system that can handle a wide range of audio sources

\*_Audio and video receive are not documented by Discord so stable support is not guaranteed_

## Installation

**Node.js 24.17.0 or newer is required.**

Install the fork directly from git (drop-in replacement for the npm package):

```sh
npm install github:<your-user>/discordjs_fork
```

Or from the registry, if you have published it:

```sh
npm install @discordjs/voice
```

## Dependencies

This library has several optional dependencies to support a variety
of different platforms. Install one dependency from each of the
categories shown below. The dependencies are listed in order of
preference for performance. If you can't install one of the options,
try installing another.

**Encryption Libraries (npm install):**

> [!NOTE]
> You only need to install one of these libraries if your system does not support `aes-256-gcm` (verify by running `require('node:crypto').getCiphers().includes('aes-256-gcm')`).

- `sodium-native`: ^3.3.0
- `sodium`: ^3.0.2
- `@stablelib/xchacha20poly1305`: ^2.0.0
- `@noble/ciphers`: ^1.0.0
- `libsodium-wrappers`: ^0.7.9

**DAVE Protocol Libraries (e2ee)**

> [!NOTE]
> At this time, `@snazzah/davey` is the only supported DAVE protocol library in this package, and comes pre-installed. In the future, we may support other libraries once they are created.

- `@snazzah/davey`: ^0.1.6

**Opus Libraries (npm install):**

- `@discordjs/opus`: ^0.4.0
- `opusscript`: ^0.0.7

**FFmpeg:**

- [`FFmpeg`](https://ffmpeg.org/) (installed and added to environment)
- `ffmpeg-static`: ^4.2.7 (npm install)

## Examples

The [voice-examples][voice-examples] repository contains examples on how to use this package. Feel free to check them out if you need a nudge in the right direction.

A complete example for recording a user's camera to MP4 (via ffmpeg) is included in [`examples/record-camera.ts`](examples/record-camera.ts).

## Receiving video (camera / screen capture)

This fork adds a `videoReceiver` to every `VoiceConnection`, mirroring the audio `receiver`:

```ts
import { joinVoiceChannel } from '@discordjs/voice';

const connection = joinVoiceChannel({
	guildId: '...',
	channelId: '...',
	adapterCreator: guild.voiceAdapterCreator,
	// The voice server only forwards streams to connections that are not deafened
	selfDeaf: false,
});

// Be notified when users start/stop their camera or screen share
connection.videoReceiver.on('video', (userId, streams) => {
	console.log(`User ${userId} streams:`, streams);
	// streams: [{ ssrc, type: 'video' | 'screen', quality, rtxSSRC, ... }]
});

// Subscribe to a user's video. The stream is in object mode and emits one
// entry per received RTP packet (or per frame when DAVE e2ee is active).
const videoStream = connection.videoReceiver.subscribe(userId);

videoStream.on('data', (packet) => {
	// packet: { ssrc, sequence, timestamp, payloadType, marker, retransmitted, payload }
	// packet.payload contains raw codec data (usually H264), still in RTP
	// packetized form - pipe it into ffmpeg or another RTP-aware decoder.
});
```

What the fork does for you under the hood:

- **Codec negotiation** - the connection negotiates H264/VP8/VP9/AV1/H265 receive support in `SELECT_PROTOCOL`, which is required before the voice server will route video to you.
- **Media sink wants (opcode 15)** - sent automatically once the session is ready (`{ any: 100 }`), telling Discord's SFU to forward all video streams to your connection. Without this, no video packets arrive at all.
- **SSRC mapping (opcode 12)** - video RTP packets arrive on separate SSRCs per user; the receiver maps them via the `video` broadcasts (including RTX retransmission SSRCs).
- **Keyframe requests** - RTCP picture loss indications (PLI) are sent every 2 seconds for every subscribed stream, so the H264 stream stays decodable.
- **RTX recovery** - retransmissions arriving on the RTX SSRC are unpacked and delivered with their original sequence number.
- **DAVE (end-to-end encryption)** - when the channel uses DAVE, video frames are decrypted frame-by-frame after RTP reassembly; in that case the stream emits one packet per frame (with `marker: true`).

Notes and limitations:

- Video only flows from users that have their camera or screen share enabled; subscriptions stay open and pick up automatically when they do.
- **DAVE (E2EE) channels**: audio and video are end-to-end encrypted; the fork performs full MLS participation and decrypts both. Streams that **started after** your connection joined decrypt reliably. A stream that has been running for a long time before you joined uses a video key ratchet thousands of generations ahead - those frames cannot be authenticated until the sender restarts video (camera off/on) or the group re-keys. This matches the behavior of other DAVE implementations; ask the user to toggle their camera if you join mid-stream.
- Screen shares may use simulcast; you will receive every active layer. Filter by `quality`/`rid` from the `video` event if you only want one.
- Recording people without their consent may be illegal depending on your jurisdiction - get consent first.

## How it works / further reading

- Discord developer docs: [Voice Connections](https://discord.com/developers/docs/topics/voice-connections) (encryption modes, DAVE protocol)
- The undocumented video opcodes were verified against the official Discord web client and community implementations such as [discord-video-stream](https://github.com/gabrielmaialva33/discord-video-stream).

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
[documentation]: https://discord.js.org/docs/packages/voice/stable
[guide]: https://discordjs.guide
[guide-source]: https://github.com/discordjs/discord.js/tree/main/apps/guide
[guide-update]: https://discordjs.guide/legacy/additional-info/changes-in-v14
[discord]: https://discord.gg/djs
[discord-developers]: https://discord.gg/discord-developers
[source]: https://github.com/discordjs/discord.js/tree/main/packages/voice
[npm]: https://www.npmjs.com/package/@discordjs/voice
[related-libs]: https://discord.com/developers/docs/topics/community-resources#libraries
[contributing]: https://github.com/discordjs/discord.js/blob/main/.github/CONTRIBUTING.md
[voice-examples]: https://github.com/discordjs/voice-examples
