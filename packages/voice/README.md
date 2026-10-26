<div align="center">
	<br />
	<p>
		<a href="https://discord.js.org"><img src="https://discord.js.org/static/logo.svg" width="546" alt="discord.js" /></a>
	</p>
	<p>
		<a href="https://github.com/Davidooff/discordjs-voice-video-fork"><img src="https://img.shields.io/badge/fork-video%20receive%20%2B%20DAVE%20E2EE-5865F2?logo=github" alt="fork badge" /></a>
		<img src="https://img.shields.io/badge/verified-live%20against%20Discord%20DAVE%20v1-brightgreen" alt="verified badge" />
		<img src="https://img.shields.io/badge/base-%40discordjs%2Fvoice%20v0.19.2-blue" alt="base version" />
	</p>
</div>

## About

A fork of [`@discordjs/voice`](https://github.com/discordjs/discord.js) (v0.19.2) that adds **receiving video streams (user cameras and screen shares) from Discord voice channels** — including channels protected by **DAVE end-to-end encryption**, which Discord has made mandatory for all voice since March 2026.

> [!IMPORTANT]
> **This works.** It was verified live against production Discord (DAVE v1, MLS epoch participation): ~2,000 video frames decrypted across two sessions, 1280x720 AV1 at 25 fps recovered and re-encoded to MP4. See [Verification](#verification).

Video receive is **not documented** by Discord, and DAVE video is not implemented in any public Node.js library. Everything below was established from the [libdave](https://github.com/discord/libdave) source, the libwebrtc AV1 RTP packetizer/depacketizer source, and live protocol analysis.

## What is implemented

| Area                            | Status | Notes                                                                                                   |
| ------------------------------- | ------ | ------------------------------------------------------------------------------------------------------- |
| Voice gateway v8 video opcodes  | ✅     | op 12 (video broadcast) with replay on join, op 15 (media sink wants), op 13 (client disconnect)        |
| Video-capable IDENTIFY          | ✅     | `video: true` + stream descriptors are **required** or the SFU forwards nothing and never replays op 12 |
| Codec negotiation               | ✅     | H264 / H265 / VP8 / VP9 / AV1 offered in `SELECT_PROTOCOL`                                              |
| SSRC ↔ user mapping             | ✅     | op 12 streams + RTX SSRCs + fallback discovery via sequential allocation (audio N, video N+1, rtx N+2)  |
| Keyframe requests               | ✅     | RTCP PLI on subscribe + every 2 s per active stream                                                     |
| Receiver reports                | ✅     | RTCP RR every 5 s per received stream (an SFU that never hears from a sink stops forwarding to it)      |
| RTX retransmission              | ✅     | OSN unwrap, sequence dedup, padding/probe filtering                                                     |
| DAVE E2EE (MLS)                 | ✅     | full epoch participation, transitions, key ratchets — via `@snazzah/davey`                              |
| DAVE audio decryption           | ✅     | verified live (real Opus speech frames)                                                                 |
| **DAVE video decryption (AV1)** | ✅     | **verified live — the main achievement of this fork**                                                   |
| AV1 RTP depacketizer            | ✅     | RFC 9494 / libwebrtc-compatible, sender-exact frame reconstruction                                      |
| H264 / H265 / VP8 / VP9 decryption | ✅  | RFC 6184 / RFC 7798 (single, AP, FU; 4-byte start codes as libdave writes them) and VP8/VP9 descriptor stripping |
| Sending video                   | ❌     | receive only                                                                                            |

## Verification

Live-tested on production Discord (October 2026, guild voice channel with DAVE v1):

```
videoStats: successes ≈ 2000, failures 80-149 (only the pre-keyframe window), passthroughs 0
audioStats: successes 500+, failures 0
```

- Joining **mid-stream works**: after the first PLI-triggered keyframe arrives, every frame decrypts. The failures above are exactly the delta frames that arrived between joining and that keyframe (the DAVE ratchet has already advanced past them).
- Recovered output: `1280x720, 25 fps, AV1` decoded by dav1d → MP4 (45 s and 17 s recordings captured in two sessions, from two different join points).
- Decrypted frame heads are valid AV1 (`0a 0b 00 00 00 05 4c ff …` = OBU_SEQUENCE_HEADER + OBU_FRAME_HEADER …), confirming byte-exact reconstruction of what the sender encrypted.

## How the DAVE video pipeline works

This is the part that made every other implementation fail — the frame the sender encrypted is **not** the concatenation of RTP payloads.

1. **Sender side** (Discord client, from `libdave` source):
   - The AV1 encoder frame is processed OBU-by-OBU: temporal delimiters / tile lists / padding OBUs are dropped.
   - Every remaining OBU keeps its header + canonical LEB128 size **unencrypted**; the payload is AEAD-encrypted (AES-GCM, 8-byte truncated tag).
   - The **last OBU's size field is removed** (size bit flipped) so the DAVE trailer can ride inside its payload.
   - The trailer is appended: `[tag (8B)][truncated nonce (LEB128)][unencrypted ranges (LEB128 pairs)][total size (1B)][0xFA FA]`. The ranges mark where the unencrypted OBU headers sit, e.g. `(0,2),(13,2),(31,1)` for a keyframe.
2. **RTP packetization** (libwebrtc `RtpPacketizerAv1`):
   - Each packet gets a 1-byte aggregation header: `Z` (continuation), `Y` (ends with fragment), `W` (element count, ≤ 3).
   - OBU elements are length-prefixed with LEB128 **in the RTP payload**, and each OBU's own size field is stripped and its size bit cleared.
3. **This fork reverses all of that** (`src/networking/av1.ts`):
   - `parseAv1Obus` — port of libwebrtc's `VideoRtpDepacketizerAv1::ParseObus` (aggregation headers, element sizes, Z/Y fragment chaining).
   - `serializeAv1Obus(..., senderLayout)` — rebuilds the **byte-exact frame the sender encrypted**: OBU headers get their size bit and canonical size back, the final OBU stays sizeless with the trailer inside its payload.
   - The reconstructed frame goes to davey, which parses the trailer, splits authenticated/ciphertext bytes by the ranges and runs the AEAD decryption.
   - For consumers, `depacketizeAv1FrameNormalized` emits a decoder-ready OBU stream instead.

If you concatenate RTP payloads and try to decrypt (what every naive implementation does), GCM authentication fails with `NoValidCryptorFound` — that was this fork's bug for most of its development, and the reason a byte-exact depacketizer is required.

### Voice gateway opcodes (v8)

| Op  | Name              | Payload / purpose                                                                                                            |
| --- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 0   | IDENTIFY          | requires `video: true` and `streams: [{ type, rid, quality }]` or video never flows                                          |
| 2   | SELECT_PROTOCOL   | `codecs` array negotiates receive payload types (AV1 = 109)                                                                  |
| 5   | SPEAKING          | audio SSRC → user map (used for discovery fallback)                                                                          |
| 12  | VIDEO             | `{ user_id, audio_ssrc, streams: [{ ssrc, rtx_ssrc, active, quality, rid, type, … }] }`, replayed on join for active streams |
| 13  | CLIENT_DISCONNECT | user left — drop their streams                                                                                               |
| 15  | MEDIA_SINK_WANTS  | `{ any: 100 }` after identify (server ≥ v5, tracked from HELLO) — otherwise no forwarding                                    |

## Usage

### Installation

```sh
npm install Davidooff/discordjs-voice-video-fork
```

Requires Node.js 22.12.0+; `ffmpeg` for the example/recorder.

### Receiving video (library)

```ts
import { joinVoiceChannel } from '@discordjs/voice';

const connection = joinVoiceChannel({
	guildId: GUILD_ID,
	channelId: CHANNEL_ID,
	adapterCreator: guild.voiceAdapterCreator,
	selfDeaf: false, // the SFU does not forward streams to deafened connections
});

connection.videoReceiver.on('video', (userId, streams) => {
	console.log('user streams:', userId, streams);
});

const video = connection.videoReceiver.subscribe(USER_ID);
video.on('data', (packet) => {
	// With DAVE active (always, on current Discord) each packet is one fully
	// decrypted AV1 frame in libdave layout: OBU headers/sizes present, but
	// the final OBU is sizeless and there is no temporal delimiter.
	//
	// To make it decodable: prepend a temporal delimiter (0x12 0x00) and give
	// the final OBU an explicit size — see `decodeableAv1()` in record-live.mjs.
});
```

### Recorder harness (verified end-to-end)

`record-live.mjs` in the repo root is the harness used for verification: it joins a channel with a **user token**, subscribes to whoever turns on their camera, writes decoder-ready AV1 frames to `recordings/*.obu`, converts to MP4 via ffmpeg (`-f obu`), and keeps a raw transport-decrypted packet log for analysis.

```sh
cp .env.example .env   # DISCORD_TOKEN, GUILD_ID, CHANNEL_ID
npm run build && node record-live.mjs
```

> [!WARNING]
> Automating a user account violates Discord's ToS; the harness exists because bots cannot see DAVE media the same way in all contexts. Use your own account and judgment. Recording people without consent may be illegal in your jurisdiction.

### Complete example

[`examples/record-camera.ts`](examples/record-camera.ts) — bot-token example that records a user's camera to MP4 (written for the pre-DAVE transport-only path with H264; kept for reference).

## Architecture

```
src/
├─ networking/
│  ├─ video.ts        # v8 opcodes, codec tables, identify/select payloads
│  ├─ Networking.ts   # video identify, codec negotiation, sink wants, RTCP
│  ├─ av1.ts          # RFC 9494 depacketizer + sender-layout serializer
│  ├─ rtcp.ts         # PLI builder, RTCP detection
│  └─ DAVESession.ts  # MLS/E2EE session glue (davey), decrypt audio+video
├─ receive/
│  ├─ VideoReceiver.ts  # op 12 mapping, subscriptions, PLI timer, RTX,
│  │                    # frame assembly (per timestamp/marker), DAVE decrypt
│  └─ VideoReceiveStream.ts
└─ VoiceConnection.ts   # exposes .videoReceiver
```

Tests: `__tests__/av1.test.ts` round-trips frames through a port of libwebrtc's packetizer and asserts byte-exact sender-layout reconstruction; `__tests__/VideoReceiver.test.ts` covers op 12 handling, RTX, discovery and assembly.

## Limitations & known issues

- **DAVE key ratchet**: frames are encrypted with a per-frame advancing ratchet. Frames from before your first keyframe (joined mid-stream) cannot authenticate — expected, and bounded (~1-2 s at 25 fps). A single undecryptable frame does **not** desync the stream; the ratchet window covers it.
- **Codecs**: AV1 (PT 109), H264 (PT 101), H265 (PT 103), VP8 (PT 105) and VP9 (PT 107) are depacketized into the sender layout DAVE encrypted, then decrypted. Frames are assembled in RTP sequence order (retransmissions arrive out of place) and a frame with a sequence gap is dropped.
- Screen shares may use simulcast — you receive every layer; filter by `quality`/`rid` from the `video` event.
- The `VideoRtpPacket.payload` for DAVE frames is libdave-layout AV1, not a plain bitstream — normalize before decoding (see usage).
- 3 unit-test failures on Node 26 are environmental only (missing `@discordjs/opus` native prebuilds; pre-existing upstream).

## Development

```sh
npm install
npm run build     # tsc + tsup (ESM/CJS + types)
npm test          # vitest
npm run lint      # eslint + prettier
```

## Credits & legal

- Base library: [discord.js](https://github.com/discordjs/discord.js) / `@discordjs/voice` v0.19.2 (MIT).
- DAVE MLS implementation: [@snazzah/davey](https://github.com/snazzah/davey); protocol reference: [discord/libdave](https://github.com/discord/libdave).
- Protocol facts verified against [libwebrtc](https://webrtc.googlesource.com/src) `rtp_packetizer_av1.cc` / `video_rtp_depacketizer_av1.cc` and live Discord traffic.

For lawful research, education, interoperability, and use with the consent of everyone being recorded.
