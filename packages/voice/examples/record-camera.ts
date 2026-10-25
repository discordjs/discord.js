/**
 * Example: capture the camera (or screen share) stream of Discord users to an MP4 file.
 *
 * Setup:
 *   1. npm run build
 *   2. npm install discord.js
 *   3. Make sure `ffmpeg` is available on your PATH.
 *   4. npx tsx examples/record-camera.ts
 *
 * Environment:
 *   DISCORD_TOKEN - your bot token (bot must be able to join the voice channel).
 *   GUILD_ID      - the id of the guild with the voice channel.
 *   CHANNEL_ID    - the id of the voice channel to join.
 *   USER_ID       - optional, the id of the user whose camera to record.
 *                   If omitted, records whoever starts their camera first.
 *
 * Note: video only flows from users that have their camera (or screen share)
 * enabled, and recording conversations may require the consent of the
 * participants depending on your jurisdiction.
 */
import { createSocket } from 'node:dgram';
import { writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { Client, Events, GatewayIntentBits } from 'discord.js';
// In your own project this import would simply be `@discordjs/voice`
// (this fork installed from git).
import { joinVoiceChannel, type VideoRtpPacket, type VideoReceiveStream } from '../dist/index.js';

const { DISCORD_TOKEN, GUILD_ID, CHANNEL_ID, USER_ID } = process.env as Record<string, string>;

if (!DISCORD_TOKEN || !GUILD_ID || !CHANNEL_ID) {
	console.error('Missing DISCORD_TOKEN, GUILD_ID or CHANNEL_ID environment variable');
	process.exit(1);
}

// A local UDP port that we forward reconstructed RTP packets to, so that
// ffmpeg can demux and decode them with its RTP/H264 support.
const RTP_LOCAL_PORT = 50_04;
const PAYLOAD_TYPE = 101; // H264, as negotiated by the library

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

const udp = createSocket('udp4');

/**
 * Rebuilds a 12-byte RTP header around a payload received from VideoReceiveStream.
 */
function toRtpPacket(packet: VideoRtpPacket): Buffer {
	const header = Buffer.alloc(12);
	header[0] = 0x80;
	header[1] = (packet.marker ? 0x80 : 0) | packet.payloadType;
	header.writeUInt16BE(packet.sequence & 0xffff, 2);
	header.writeUInt32BE(packet.timestamp >>> 0, 4);
	header.writeUInt32BE(packet.ssrc >>> 0, 8);
	return Buffer.concat([header, packet.payload]);
}

function startRecording(stream: VideoReceiveStream, ssrc: number, label: string) {
	const output = `recording-${label}-${Date.now()}.mp4`;

	// An SDP describing the stream we forward to ffmpeg over localhost UDP.
	const sdp = [
		'v=0',
		'o=- 0 0 IN IP4 127.0.0.1',
		's=Discord camera capture',
		'c=IN IP4 127.0.0.1',
		't=0 0',
		`m=video ${RTP_LOCAL_PORT} RTP/AVP ${PAYLOAD_TYPE}`,
		`a=rtpmap:${PAYLOAD_TYPE} H264/90000`,
		'',
	].join('\r\n');
	writeFileSync('session.sdp', sdp);

	const ffmpeg = spawn('ffmpeg', [
		'-protocol_whitelist',
		'file,udp,rtp',
		'-i',
		'session.sdp',
		'-c:v',
		'libx264',
		'-preset',
		'veryfast',
		'-pix_fmt',
		'yuv420p',
		output,
	]);
	ffmpeg.stderr.on('data', (chunk: Buffer) => process.stderr.write(chunk));

	stream.on('data', (packet: VideoRtpPacket) => {
		udp.send(toRtpPacket(packet), RTP_LOCAL_PORT, '127.0.0.1');
	});

	console.log(`Recording ${label} (ssrc ${ssrc}) to ${output}`);
}

client.once(Events.ClientReady, async (c) => {
	console.log(`Logged in as ${c.user.tag}`);

	const connection = joinVoiceChannel({
		guildId: GUILD_ID,
		channelId: CHANNEL_ID,
		adapterCreator: c.guilds.cache.get(GUILD_ID)!.voiceAdapterCreator,
		// Important: selfDeaf=false so the voice server forwards streams to us.
		selfDeaf: false,
	});

	// The video receiver emits a 'video' event whenever a user starts or stops
	// their camera/screen share.
	connection.videoReceiver.on('video', (userId, streams) => {
		if (streams.length === 0) {
			console.log(`User ${userId} stopped their video`);
			return;
		}

		console.log(`User ${userId} started video:`, streams);
		if (USER_ID && userId !== USER_ID) return;

		const stream = connection.videoReceiver.subscribe(userId);
		// Only start one ffmpeg per connection for the example's sake.
		if (stream.listenerCount('data') > 0) return;
		startRecording(stream, streams[0]!.ssrc, userId);
	});

	if (USER_ID) {
		// Subscribe immediately; packets flow once the user enables their camera.
		connection.videoReceiver.subscribe(USER_ID);
	}
});

client.login(DISCORD_TOKEN);
