import { Buffer } from 'node:buffer';
import { EventEmitter } from 'node:events';
import type { VoiceReceivePayload } from 'discord-api-types/voice/v8';
import { VoiceOpcodes } from 'discord-api-types/voice/v8';
import { VoiceConnectionStatus, type VoiceConnection } from '../VoiceConnection';
import { NetworkingStatusCode, type ConnectionData, type Networking } from '../networking/Networking';
import { depacketizeAv1Frame, depacketizeAv1FrameNormalized } from '../networking/av1';
import { depacketizeH264Frame } from '../networking/h264';
import { depacketizeH265Frame } from '../networking/h265';
import { createNACK, createPLI, createREMB, createReceiverReport, isRTCPPacket } from '../networking/rtcp';
import { VideoGatewayOpcodes, type MediaSinkWantsPayload, type VoiceVideoPayload } from '../networking/video';
import { depacketizeVp8Frame, depacketizeVp9Frame } from '../networking/vp8';
import { RTP_VIDEO_PAYLOAD_TYPES } from '../util/constants';
import { FrameBuffer, type BufferedPacket } from './FrameBuffer';
import {
	VideoReceiveStream,
	createDefaultVideoReceiveStreamOptions,
	type VideoReceiveStreamOptions,
	type VideoRtpPacket,
} from './VideoReceiveStream';
import { decryptRtpPayload, stripExtensionBody, stripRtpPadding } from './decrypt';

/**
 * Information about a single incoming video stream (simulcast layer) of a user.
 */
export interface VideoStreamInfo {
	/**
	 * The simulcast quality of the stream (0-100), if advertised.
	 */
	quality?: number;

	/**
	 * The RTP stream id of the simulcast layer, if advertised.
	 */
	rid?: string;

	/**
	 * The SSRC used for retransmissions of this stream, if advertised.
	 */
	rtxSSRC?: number;

	/**
	 * The media SSRC of the stream.
	 */
	ssrc: number;

	/**
	 * The kind of stream: `video` for camera, `screen` for screen share.
	 */
	type: 'screen' | 'test' | 'video';

	/**
	 * The id of the user this stream belongs to.
	 */
	userId: string;
}

/**
 * How often (in milliseconds) picture loss indications are sent for streams
 * with an active subscription, to keep the streams decodable.
 */
const PLI_INTERVAL = 2_000;

/**
 * How often (in milliseconds) RTCP receiver reports are sent for the streams this connection receives. An SFU
 * that never hears from a sink stops treating it as live (cameras stall mid-stream until toggled).
 */
const RR_INTERVAL = 5_000;

/**
 * RTX payload type → its media payload type (the fork's codec table: H264, H265, VP8, VP9, AV1).
 */
const RTX_TO_MEDIA_PAYLOAD_TYPE: Record<number, number> = { 102: 101, 104: 103, 106: 105, 108: 107, 110: 109 };

/**
 * The depacketizer per media payload type: the sender-layout frame DAVE encrypted.
 */
const DEPACKETIZERS: Record<number, (payloads: Buffer[]) => Buffer | undefined> = {
	109: depacketizeAv1Frame,
	101: depacketizeH264Frame,
	103: depacketizeH265Frame,
	105: depacketizeVp8Frame,
	107: depacketizeVp9Frame,
};

/**
 * Counters of the video receive path, per payload type where it matters (diagnostics: where frames get lost).
 */
export interface VideoReceiveStats {
	/**
	 * Frames depacketized, but DAVE did not authenticate them.
	 */
	decryptFailed: Record<number, number>;
	/**
	 * Frames emitted (decrypted, or passthrough).
	 */
	frames: Record<number, number>;
	/**
	 * Frames whose packets did not depacketize (malformed, or a fragment missing).
	 */
	malformed: Record<number, number>;
	/**
	 * Missing packets asked for again (RTCP NACK).
	 */
	nacked: number;
	/**
	 * Media packets received (not counting retransmissions).
	 */
	packets: Record<number, number>;
	/**
	 * Packets recovered from RTX.
	 */
	retransmitted: number;
	/**
	 * Receiver reports sent (liveness for the SFU).
	 */
	rrSent: number;
	/**
	 * REMB packets sent (rembKbps > 0).
	 */
	rembSent?: number;
	/**
	 * Frames of a codec without a depacketizer.
	 */
	unsupported: Record<number, number>;
}


export interface VideoReceiver extends EventEmitter {
	/**
	 * Emitted whenever the video streams of a user change (camera/screen share
	 * turned on or off, quality changed, ...).
	 *
	 * @eventProperty
	 */
	on(event: 'video', listener: (userId: string, streams: VideoStreamInfo[]) => void): this;
}

/**
 * Attaches to a VoiceConnection, allowing you to receive video (camera and
 * screen share) streams from other users.
 *
 * @remarks
 * Receiving video requires the voice server to forward the streams to you. The
 * receiver takes care of this by sending a media sink wants (opcode 15) payload
 * when the connection becomes ready, and by periodically requesting keyframes
 * via RTCP picture loss indications for any stream you are subscribed to.
 * @beta
 */
export class VideoReceiver extends EventEmitter {
	/**
	 * The attached connection of this receiver.
	 */
	public readonly voiceConnection: VoiceConnection;

	/**
	 * The current video subscriptions of this receiver, keyed by user id.
	 */
	public readonly subscriptions: Map<string, VideoReceiveStream>;

	/**
	 * The connection data of the receiver.
	 *
	 * @internal
	 */
	public connectionData: Partial<ConnectionData>;

	/**
	 * All currently active incoming video streams, keyed by user id.
	 */
	public readonly activeStreams: Map<string, VideoStreamInfo[]>;

	/**
	 * Maps media SSRCs to the user id they belong to.
	 */
	private readonly userIdBySSRC: Map<number, string>;

	/**
	 * Maps RTX SSRCs to their media SSRC.
	 */
	private readonly mediaSSRCByRTXSSRC: Map<number, number>;

	/**
	 * Per media SSRC: packets reassembled into frames by sequence number (DAVE, or assembleFrames subscriptions).
	 */
	private readonly frameBuffers: Map<number, FrameBuffer>;

	/**
	 * Gives up frames that waited too long for a retransmission (runs while frame buffers exist).
	 */
	private frameBufferTimer?: NodeJS.Timeout | undefined;

	/**
	 * Counters of the receive path since the receiver was created.
	 */
	/**
	 * When above 0, a REMB with this bitrate (kbit/s) goes out with every receiver report: the SFU (and through it
	 * the camera's sender) otherwise has no bandwidth estimate for this receiver and keeps it on a low layer/bitrate.
	 */
	public rembKbps = 0;

	public readonly stats: VideoReceiveStats = {
		packets: {},
		frames: {},
		malformed: {},
		decryptFailed: {},
		unsupported: {},
		retransmitted: 0,
		nacked: 0,
		rrSent: 0,
	};

	/**
	 * Audio SSRCs by user id, as advertised in opcode 12 payloads.
	 */
	private readonly audioSSRCByUserId: Map<string, number>;

	/**
	 * Recently seen RTP sequence numbers per media SSRC, used to drop
	 * retransmissions of packets that were already processed.
	 */
	private readonly recentSequences: Map<number, Set<number>>;

	/**
	 * The extended (32-bit) highest sequence number received per media SSRC, for receiver report blocks.
	 */
	private readonly extHighestSequence: Map<number, { cycles: number; last: number }>;

	/**
	 * The interval sending RTCP receiver reports for the streams this connection receives.
	 */
	private readonly rrTimer?: NodeJS.Timeout | undefined;

	/**
	 * The interval sending picture loss indications for subscribed streams.
	 */
	private pliTimer?: NodeJS.Timeout | undefined;

	public constructor(voiceConnection: VoiceConnection) {
		super();
		this.voiceConnection = voiceConnection;
		this.subscriptions = new Map();
		this.activeStreams = new Map();
		this.connectionData = {};
		this.userIdBySSRC = new Map();
		this.mediaSSRCByRTXSSRC = new Map();
		this.frameBuffers = new Map();
		this.audioSSRCByUserId = new Map();
		this.recentSequences = new Map();
		this.extHighestSequence = new Map();

		this.onWsPacket = this.onWsPacket.bind(this);
		this.onUdpMessage = this.onUdpMessage.bind(this);
		this.sendPLIs = this.sendPLIs.bind(this);
		this.rrTimer = setInterval(this.sendRRs.bind(this), RR_INTERVAL);
		this.rrTimer.unref();
	}

	/**
	 * The networking instance of the attached connection, if connected.
	 */
	private get networking(): Networking | undefined {
		if (this.voiceConnection.state.status !== VoiceConnectionStatus.Ready) return;
		return this.voiceConnection.state.networking;
	}

	/**
	 * Builds a media sink wants payload in the same shape the official client
	 * sends: a wildcard `any` level plus explicit levels for every known
	 * stream, so the SFU knows exactly which (simulcast) streams to forward.
	 */
	private buildSinkWants(): MediaSinkWantsPayload {
		const wants: MediaSinkWantsPayload = { any: 100 };
		for (const [userId] of this.activeStreams) {
			const audioSSRC = this.audioSSRCByUserId.get(userId);
			if (audioSSRC) wants[String(audioSSRC)] = 100;
			for (const stream of this.activeStreams.get(userId) ?? []) wants[String(stream.ssrc)] = 100;
		}

		return wants;
	}

	/**
	 * Sends the current media sink wants payload to the voice server.
	 */
	private sendSinkWants() {
		this.networking?.sendMediaSinkWants(this.buildSinkWants());
	}

	/**
	 * Called when the underlying networking instance becomes ready.
	 *
	 * @remarks
	 * Tells the voice server to forward all video streams to this connection.
	 * @internal
	 */
	public onNetworkingReady() {
		this.sendSinkWants();
	}

	/**
	 * Called when a packet is received on the attached connection's WebSocket.
	 *
	 * @param packet - The received packet
	 * @internal
	 */
	public onWsPacket(packet: VoiceReceivePayload) {
		if ((packet.op as number) === VideoGatewayOpcodes.Video) {
			this.handleVideoState(packet.d as unknown as VoiceVideoPayload);
		} else if (packet.op === VoiceOpcodes.ClientDisconnect) {
			this.removeUserStreams(packet.d.user_id);
		}
	}

	/**
	 * Processes an opcode 12 (video) broadcast, updating the SSRC to user mappings.
	 *
	 * @param payload - The video state payload
	 */
	private handleVideoState(payload: VoiceVideoPayload) {
		const { user_id: userId, streams = [], audio_ssrc: audioSSRC } = payload;

		if (audioSSRC && audioSSRC > 0) this.audioSSRCByUserId.set(userId, audioSSRC);

		// Remove the user's previous streams, then re-add all active ones.
		this.removeUserStreams(userId);

		const activeStreams: VideoStreamInfo[] = [];
		for (const stream of streams) {
			if ((stream.type ?? 'video') === 'audio') continue;
			if (!stream.active || !stream.ssrc || stream.ssrc <= 0) continue;

			const info: VideoStreamInfo = {
				userId,
				ssrc: stream.ssrc,
				type: (stream.type ?? 'video') as VideoStreamInfo['type'],
				...(stream.rtx_ssrc === undefined ? {} : { rtxSSRC: stream.rtx_ssrc }),
				...(stream.quality === undefined ? {} : { quality: stream.quality }),
				...(stream.rid === undefined ? {} : { rid: stream.rid }),
			};

			activeStreams.push(info);
			this.userIdBySSRC.set(info.ssrc, userId);
			if (info.rtxSSRC !== undefined && info.rtxSSRC > 0) {
				this.mediaSSRCByRTXSSRC.set(info.rtxSSRC, info.ssrc);
			}
		}

		if (activeStreams.length > 0) {
			this.activeStreams.set(userId, activeStreams);
		}

		// Tell the SFU which streams we want, mirroring the official client
		// (wildcard level plus explicit per-stream levels).
		this.sendSinkWants();

		// Request a keyframe right away for streams we are subscribed to.
		if (this.subscriptions.has(userId)) {
			for (const stream of activeStreams) this.sendPLI(stream.ssrc);
			this.startPLITimer();
		}

		this.emit('video', userId, activeStreams);
	}

	/**
	 * Tracks a sequence number for a stream, returning whether it has not been
	 * seen before (and should therefore be processed).
	 *
	 * @param ssrc - The media SSRC
	 * @param sequence - The RTP sequence number
	 */
	private trackSequence(ssrc: number, sequence: number): boolean {
		let seen = this.recentSequences.get(ssrc);
		if (!seen) {
			seen = new Set();
			this.recentSequences.set(ssrc, seen);
		}

		if (seen.has(sequence)) return false;
		seen.add(sequence);
		// Keep the set bounded; RTP ordering means a small window is enough.
		if (seen.size > 1_024) {
			for (const value of seen) {
				seen.delete(value);
				if (seen.size <= 512) break;
			}
		}

		return true;
	}

	/**
	 * Tracks the extended highest sequence number of a media SSRC (receiver report blocks).
	 *
	 * @param ssrc - The media SSRC
	 * @param sequence - The RTP sequence number just received for it
	 */
	private trackExtSequence(ssrc: number, sequence: number) {
		const state = this.extHighestSequence.get(ssrc);
		if (!state) {
			this.extHighestSequence.set(ssrc, { cycles: 0, last: sequence });
			return;
		}

		// Only a step forward moves the highest sequence; one that passes 65535 starts a new cycle. A step backwards
		// is a retransmission or reorder and changes nothing (it used to count as a wrap, so after the first wrap the
		// reports claimed a highest sequence 65536 too far: a huge loss to the SFU).
		const forward = ((sequence - state.last + 0x1_00_00) & 0xffff) < 0x8000;
		if (!forward || sequence === state.last) return;
		if (sequence < state.last) state.cycles++;
		state.last = sequence;
	}

	/**
	 * Sends receiver reports for every stream this connection receives video from.
	 */
	private sendRRs() {
		if (this.extHighestSequence.size === 0) return;
		if (this.voiceConnection.state.status !== VoiceConnectionStatus.Ready) return;
		const senderSSRC = this.connectionData.ssrc;
		if (!senderSSRC) return;

		const sources = [...this.extHighestSequence].map(([ssrc, state]) => ({
			ssrc,
			extHighestSequence: ((state.cycles << 16) | state.last) >>> 0,
		}));
		for (let index = 0; index < sources.length; index += 31) {
			this.voiceConnection.state.networking.sendRTCP(createReceiverReport(senderSSRC, sources.slice(index, index + 31)));
			this.stats.rrSent++;
		}

		if (this.rembKbps > 0) {
			this.voiceConnection.state.networking.sendRTCP(createREMB(senderSSRC, sources.map((source) => source.ssrc), this.rembKbps * 1_000));
			this.stats.rembSent = (this.stats.rembSent ?? 0) + 1;
		}
	}

	/**
	 * Tries to resolve the user an unknown video SSRC belongs to.
	 *
	 * @remarks
	 * Discord allocates each user's stream SSRCs sequentially
	 * (audio: N, video: N+1, rtx: N+2), and audio SSRCs are learned from
	 * opcode 5 (speaking) events. The voice gateway does not replay video
	 * state (opcode 12) for streams that were already active when this
	 * connection joined, so this heuristic is used to bootstrap video
	 * capture mid-stream. Mappings are replaced by authoritative opcode 12
	 * broadcasts whenever those arrive.
	 * @param ssrc - The unknown video SSRC
	 */
	private discoverStream(ssrc: number): string | undefined {
		const userData = this.voiceConnection.receiver.ssrcMap.get(ssrc - 1);
		return userData?.userId;
	}

	/**
	 * Registers a discovered video stream for a user.
	 *
	 * @param userId - The id of the user the stream belongs to
	 * @param ssrc - The media SSRC of the stream
	 * @param rtxSSRC - The RTX SSRC of the stream (ssrc + 1 by allocation)
	 */
	private registerDiscoveredStream(userId: string, ssrc: number, rtxSSRC?: number) {
		const info: VideoStreamInfo = {
			userId,
			ssrc,
			type: 'video',
			...(rtxSSRC === undefined ? {} : { rtxSSRC }),
		};

		const streams = this.activeStreams.get(userId) ?? [];
		streams.push(info);
		this.activeStreams.set(userId, streams);
		this.userIdBySSRC.set(ssrc, userId);
		if (rtxSSRC !== undefined && rtxSSRC > 0) this.mediaSSRCByRTXSSRC.set(rtxSSRC, ssrc);

		this.sendSinkWants();
		if (this.subscriptions.has(userId)) {
			this.sendPLI(ssrc);
			this.startPLITimer();
		}

		this.emit('video', userId, streams);
	}

	/**
	 * Removes all stream mappings of a user.
	 *
	 * @param userId - The id of the user
	 */
	private removeUserStreams(userId: string) {
		const streams = this.activeStreams.get(userId);
		if (!streams) return;

		for (const stream of streams) {
			this.userIdBySSRC.delete(stream.ssrc);
			if (stream.rtxSSRC !== undefined) this.mediaSSRCByRTXSSRC.delete(stream.rtxSSRC);
			this.frameBuffers.delete(stream.ssrc);
			this.extHighestSequence.delete(stream.ssrc);
		}

		this.activeStreams.delete(userId);
		this.sendSinkWants();
	}

	/**
	 * Sends a picture loss indication for a media SSRC, requesting a keyframe.
	 *
	 * @param ssrc - The media SSRC to request a keyframe for
	 */
	private sendPLI(ssrc: number) {
		this.networking?.sendRTCP(createPLI(ssrc));
	}

	/**
	 * Sends picture loss indications for every subscribed stream.
	 */
	private sendPLIs() {
		if (this.subscriptions.size === 0) {
			this.stopPLITimer();
			return;
		}

		for (const [userId] of this.subscriptions) {
			for (const stream of this.activeStreams.get(userId) ?? []) {
				this.sendPLI(stream.ssrc);
			}
		}
	}

	/**
	 * Starts the periodic picture loss indication timer, if it isn't running.
	 */
	private startPLITimer() {
		if (this.pliTimer) return;
		this.pliTimer = setInterval(this.sendPLIs.bind(this), PLI_INTERVAL);
		this.pliTimer.unref();
	}

	/**
	 * Stops the periodic picture loss indication timer.
	 */
	private stopPLITimer() {
		if (!this.pliTimer) return;
		clearInterval(this.pliTimer);
		this.pliTimer = undefined;
	}

	/**
	 * Called when the UDP socket of the attached connection receives a message.
	 *
	 * @param msg - The received message
	 * @internal
	 */
	public onUdpMessage(msg: Buffer) {
		if (msg.length <= 12) return;
		if (isRTCPPacket(msg)) return;

		// Ignore packets not in RTP version 2
		if (msg[0]! >> 6 !== 2) return;

		const ssrc = msg.readUInt32BE(8);

		const payloadType = msg[1]! & 0x7f;

		let userId = this.userIdBySSRC.get(ssrc);
		let mediaSSRC = ssrc;
		let retransmitted = false;
		if (userId === undefined) {
			// Not a known media SSRC - check whether this is an RTX retransmission.
			const originalSSRC = this.mediaSSRCByRTXSSRC.get(ssrc);
			if (originalSSRC !== undefined) {
				userId = this.userIdBySSRC.get(originalSSRC);
				if (userId === undefined) return;
				mediaSSRC = originalSSRC;
				retransmitted = true;
			} else if (RTP_VIDEO_PAYLOAD_TYPES.includes(payloadType)) {
				// Unknown SSRC carrying a video payload type - try to bootstrap
				// the mapping from the sequential SSRC allocation.
				const discoveredUser = this.discoverStream(ssrc);
				if (discoveredUser === undefined) return;
				this.registerDiscoveredStream(discoveredUser, ssrc, ssrc + 1);
				userId = discoveredUser;
			} else {
				return;
			}
		}

		const stream = this.subscriptions.get(userId);
		if (!stream) return;

		if (!this.connectionData.encryptionMode || !this.connectionData.nonceBuffer || !this.connectionData.secretKey) {
			return;
		}

		const sequence = msg.readUInt16BE(2);
		const timestamp = msg.readUInt32BE(4);
		const marker = Boolean(msg[1]! & 0x80);

		// Drop padding-only packets.
		if (msg[0]! & 0b10_0000) return;
		this.trackExtSequence(mediaSSRC, sequence);

		let payload: Buffer;
		try {
			payload = decryptRtpPayload(
				msg,
				this.connectionData.encryptionMode,
				this.connectionData.nonceBuffer,
				this.connectionData.secretKey,
			);
			payload = stripRtpPadding(payload, msg);
			payload = stripExtensionBody(payload, msg);
		} catch (error) {
			stream.destroy(error as Error);
			return;
		}

		const daveSession =
			this.voiceConnection.state.status === VoiceConnectionStatus.Ready &&
			(this.voiceConnection.state.networking.state.code === NetworkingStatusCode.Ready ||
				this.voiceConnection.state.networking.state.code === NetworkingStatusCode.Resuming)
				? this.voiceConnection.state.networking.state.dave
				: undefined;

		// A DAVE session with protocol version 0 is in passthrough mode: the
		// channel is transport-only encrypted, so packets carry no end-to-end
		// trailer and need no (or passthrough) decryption.
		const e2eeSession = daveSession?.protocolVersion ? daveSession : undefined;
		// Frames are assembled under DAVE (it encrypts whole frames) and for subscriptions that ask for frames;
		// otherwise packets are forwarded one by one, as received (the original behaviour).
		const assemble = Boolean(e2eeSession) || stream.assembleFrames;

		if (retransmitted) {
			// RTX payloads carry the original sequence number, followed by the
			// original payload. Padding-only RTX packets (used for keep-alives)
			// and retransmissions of already processed packets are dropped.
			if (payload.length < 2) return;
			// Only accept RTX packets with a negotiated (re)transmission payload
			// type; the RTX SSRC also carries padding/probe packets with other
			// payload types.
			if (!RTP_VIDEO_PAYLOAD_TYPES.includes(payloadType)) return;
			const originalSequence = payload.readUInt16BE(0);
			payload = payload.subarray(2);
			if (payload.length === 0) return;
			if (!this.trackSequence(mediaSSRC, originalSequence)) return;
			this.trackExtSequence(mediaSSRC, originalSequence);
			this.stats.retransmitted++;
			if (assemble) {
				// Into the frame it belongs to, under the media stream's payload type.
				this.frameBuffer(stream, mediaSSRC, userId).push({
					sequence: originalSequence,
					timestamp,
					marker,
					payloadType: RTX_TO_MEDIA_PAYLOAD_TYPE[payloadType] ?? payloadType,
					retransmitted,
					payload,
				});
				return;
			}

			this.pushVideoPacket(stream, {
				ssrc: mediaSSRC,
				sequence: originalSequence,
				timestamp,
				payloadType,
				marker,
				retransmitted,
				payload,
			});
			return;
		}

		// Drop packets that were already processed (e.g. duplicates re-sent by
		// the server).
		if (!this.trackSequence(mediaSSRC, sequence)) return;
		this.stats.packets[payloadType] = (this.stats.packets[payloadType] ?? 0) + 1;

		if (!assemble) {
			this.pushVideoPacket(stream, {
				ssrc: mediaSSRC,
				sequence,
				timestamp,
				payloadType,
				marker,
				retransmitted,
				payload,
			});
			return;
		}

		this.frameBuffer(stream, mediaSSRC, userId).push({ sequence, timestamp, marker, payloadType, retransmitted, payload });
	}

	/**
	 * The frame buffer of a media SSRC (created on first use): frames by sequence number, NACKs for gaps.
	 */
	private frameBuffer(stream: VideoReceiveStream, ssrc: number, userId: string): FrameBuffer {
		let buffer = this.frameBuffers.get(ssrc);
		if (!buffer) {
			buffer = new FrameBuffer({
				maxWaitMs: 300,
				onNack: (sequences) => {
					this.stats.nacked += sequences.length;
					if (this.voiceConnection.state.status === VoiceConnectionStatus.Ready) {
						this.voiceConnection.state.networking.sendRTCP(createNACK(ssrc, sequences));
					}
				},
				onFrame: (packets) => this.emitFrame(stream, ssrc, userId, packets),
			});
			this.frameBuffers.set(ssrc, buffer);
			this.frameBufferTimer ??= setInterval(() => {
				if (this.frameBuffers.size === 0) {
					clearInterval(this.frameBufferTimer);
					this.frameBufferTimer = undefined;
					return;
				}

				for (const frameBuffer of this.frameBuffers.values()) frameBuffer.tick();
			}, 50);
			this.frameBufferTimer.unref?.();
		}

		return buffer;
	}

	/**
	 * Depacketizes a complete frame (its packets in sequence order), decrypts it under DAVE, and pushes it.
	 */
	private emitFrame(stream: VideoReceiveStream, ssrc: number, userId: string, packets: BufferedPacket[]) {
		const last = packets.at(-1)!;
		const payloadType = packets.find((packet) => !packet.retransmitted)?.payloadType ?? last.payloadType;
		const payloads = packets.map((packet) => packet.payload);
		const daveSession =
			this.voiceConnection.state.status === VoiceConnectionStatus.Ready &&
			(this.voiceConnection.state.networking.state.code === NetworkingStatusCode.Ready ||
				this.voiceConnection.state.networking.state.code === NetworkingStatusCode.Resuming)
				? this.voiceConnection.state.networking.state.dave
				: undefined;
		const e2eeSession = daveSession?.protocolVersion ? daveSession : undefined;
		const meta = {
			ssrc,
			sequence: last.sequence,
			timestamp: last.timestamp,
			payloadType,
			marker: true,
			retransmitted: packets.some((packet) => packet.retransmitted),
		};

		// The sender-layout frame per codec: what DAVE encrypted (and, for codecs other than AV1, also what decoders
		// read): AV1 (109), H264 (101: Annex-B, 4-byte start codes), H265 (103: Annex-B), VP8 (105) and VP9 (107: descriptors stripped).
		const depacketizer = DEPACKETIZERS[payloadType];
		if (!depacketizer) {
			// No depacketizer for this codec: it cannot be reconstructed, thus not decrypted.
			this.stats.unsupported[payloadType] = (this.stats.unsupported[payloadType] ?? 0) + 1;
			if (e2eeSession) return;
			this.pushVideoPacket(stream, { ...meta, payload: Buffer.concat(payloads) });
			return;
		}

		const encryptedFrame = depacketizer(payloads);
		if (!encryptedFrame) {
			this.stats.malformed[payloadType] = (this.stats.malformed[payloadType] ?? 0) + 1;
			return;
		}

		// Sanity check the DAVE trailer marker before attempting decryption.
		const hasTrailer =
			encryptedFrame.length >= 3 &&
			encryptedFrame[encryptedFrame.length - 2] === 0xfa &&
			encryptedFrame[encryptedFrame.length - 1] === 0xfa;

		if (e2eeSession && hasTrailer) {
			let frame: Buffer | null;
			try {
				frame = e2eeSession.decryptVideo(encryptedFrame, userId);
			} catch {
				// DAVE decryption failures (e.g. after a lost frame ratchets the
				// key forward) are handled inside the session; drop the frame
				// without tearing down the subscription.
				this.stats.decryptFailed[payloadType] = (this.stats.decryptFailed[payloadType] ?? 0) + 1;
				return;
			}

			if (!frame) {
				this.stats.decryptFailed[payloadType] = (this.stats.decryptFailed[payloadType] ?? 0) + 1;
				return;
			}

			this.stats.frames[payloadType] = (this.stats.frames[payloadType] ?? 0) + 1;
			this.pushVideoPacket(stream, { ...meta, payload: frame });
			return;
		}

		// Passthrough (transport-only) or undecryptable frames: emit the
		// normalized bitstream decoders expect.
		const normalized = payloadType === 109 ? depacketizeAv1FrameNormalized(payloads) : encryptedFrame;
		if (!normalized) return;
		this.stats.frames[payloadType] = (this.stats.frames[payloadType] ?? 0) + 1;
		this.pushVideoPacket(stream, { ...meta, payload: normalized });
	}

	/**
	 * Pushes a video packet into a subscription stream, destroying the stream on error.
	 */
	private pushVideoPacket(stream: VideoReceiveStream, packet: VideoRtpPacket) {
		try {
			if (!stream.push(packet)) {
				// The stream's internal buffer is full - drop this packet rather
				// than blocking the UDP socket handling. Consumers should pause
				// subscription streams they cannot keep up with.
				stream.read();
			}
		} catch (error) {
			stream.destroy(error as Error);
		}
	}

	/**
	 * Creates a video subscription for the given user id.
	 *
	 * @remarks
	 * Video only flows while the target user has their camera (or screen share)
	 * enabled. The returned stream emits one {@link VideoRtpPacket} per received
	 * RTP packet (or per frame, when the channel uses DAVE end-to-end encryption).
	 * @param userId - The id of the user to subscribe to
	 * @param options - Options for the receive stream
	 * @returns A readable stream of video packets received from the target
	 */
	public subscribe(userId: string, options?: Partial<VideoReceiveStreamOptions>) {
		const existing = this.subscriptions.get(userId);
		if (existing) return existing;

		const stream = new VideoReceiveStream({
			...createDefaultVideoReceiveStreamOptions(),
			...options,
		});

		stream.once('close', () => {
			this.subscriptions.delete(userId);
			for (const info of this.activeStreams.get(userId) ?? []) {
				this.frameBuffers.delete(info.ssrc);
				this.extHighestSequence.delete(info.ssrc);
			}

			if (this.subscriptions.size === 0) this.stopPLITimer();
		});

		this.subscriptions.set(userId, stream);

		// Re-assert that we want to receive video, then request keyframes.
		this.sendSinkWants();
		for (const info of this.activeStreams.get(userId) ?? []) this.sendPLI(info.ssrc);
		this.startPLITimer();

		return stream;
	}
}
