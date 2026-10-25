import { Buffer } from 'node:buffer';
import { EventEmitter } from 'node:events';
import type { VoiceReceivePayload } from 'discord-api-types/voice/v8';
import { VoiceOpcodes } from 'discord-api-types/voice/v8';
import { VoiceConnectionStatus, type VoiceConnection } from '../VoiceConnection';
import type { DAVESession } from '../networking/DAVESession';
import { NetworkingStatusCode, type ConnectionData, type Networking } from '../networking/Networking';
import { depacketizeAv1Frame, depacketizeAv1FrameNormalized } from '../networking/av1';
import { createPLI, isRTCPPacket } from '../networking/rtcp';
import { VideoGatewayOpcodes, type MediaSinkWantsPayload, type VoiceVideoPayload } from '../networking/video';
import { RTP_VIDEO_PAYLOAD_TYPES } from '../util/constants';
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

interface FrameAssembler {
	chunks: Buffer[];
	lastPayloadType: number;
	lastSequence: number;
	retransmitted: boolean;
	timestamp: number;
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
	 * Buffers used to reassemble RTP packets into frames for DAVE decryption.
	 */
	private readonly frameAssemblers: Map<number, FrameAssembler>;

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
		this.frameAssemblers = new Map();
		this.audioSSRCByUserId = new Map();
		this.recentSequences = new Map();

		this.onWsPacket = this.onWsPacket.bind(this);
		this.onUdpMessage = this.onUdpMessage.bind(this);
		this.sendPLIs = this.sendPLIs.bind(this);
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
			this.frameAssemblers.delete(stream.ssrc);
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

		const daveSession =
			this.voiceConnection.state.status === VoiceConnectionStatus.Ready &&
			(this.voiceConnection.state.networking.state.code === NetworkingStatusCode.Ready ||
				this.voiceConnection.state.networking.state.code === NetworkingStatusCode.Resuming)
				? this.voiceConnection.state.networking.state.dave
				: undefined;

		// A DAVE session with protocol version 0 is in passthrough mode: the
		// channel is transport-only encrypted, so packets carry no end-to-end
		// trailer and need no (or passthrough) decryption. They are forwarded
		// per packet, as received.
		const e2eeSession = daveSession?.protocolVersion ? daveSession : undefined;
		if (!e2eeSession) {
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

		// DAVE encrypts video frame-by-frame: reassemble packets into frames
		// (packets of a frame share a timestamp, the last one has the marker bit)
		// and decrypt the whole frame at once.
		const assembler = this.frameAssemblers.get(mediaSSRC);
		if (assembler && assembler.timestamp !== timestamp) {
			this.flushFrame(stream, mediaSSRC, userId, assembler, e2eeSession);
		}

		if (!this.frameAssemblers.has(mediaSSRC)) {
			this.frameAssemblers.set(mediaSSRC, {
				chunks: [],
				timestamp,
				lastSequence: sequence,
				lastPayloadType: payloadType,
				retransmitted,
			});
		}

		const current = this.frameAssemblers.get(mediaSSRC)!;
		current.chunks.push(payload);
		current.lastSequence = sequence;
		// Retransmissions arrive with the RTX payload type; keep the media
		// payload type of the stream so consumers see the codec actually used.
		if (!retransmitted) current.lastPayloadType = payloadType;

		if (marker) {
			this.flushFrame(stream, mediaSSRC, userId, current, e2eeSession);
		}
	}

	/**
	 * Decrypts and pushes a reassembled frame for a DAVE session.
	 */
	private flushFrame(
		stream: VideoReceiveStream,
		ssrc: number,
		userId: string,
		assembler: FrameAssembler,
		daveSession: DAVESession | undefined,
	) {
		this.frameAssemblers.delete(ssrc);

		// DAVE encrypts the encoded (depacketized) frame and appends its
		// supplemental trailer bytes to it before RTP packetization. The
		// trailer (ending with the 0xFAFA magic marker) rides along inside the
		// payload of the frame's final, sizeless OBU, so depacketizing with
		// the sender layout reproduces the exact bytes that were encrypted.
		const payloads = [...assembler.chunks];
		const isAv1 = assembler.lastPayloadType === 109;
		if (!isAv1 && daveSession) {
			// Only the AV1 depacketizer is implemented; other codecs cannot be
			// reconstructed (and thus not decrypted) in DAVE channels for now.
			return;
		}

		const encryptedFrame = isAv1 ? depacketizeAv1Frame(payloads) : Buffer.concat(payloads);
		if (!encryptedFrame) return;

		// Sanity check the DAVE trailer marker before attempting decryption.
		const hasTrailer =
			encryptedFrame.length >= 3 &&
			encryptedFrame[encryptedFrame.length - 2] === 0xfa &&
			encryptedFrame[encryptedFrame.length - 1] === 0xfa;

		if (daveSession && hasTrailer) {
			let frame: Buffer | null;
			try {
				frame = daveSession.decryptVideo(encryptedFrame, userId);
			} catch {
				// DAVE decryption failures (e.g. after a lost frame ratchets the
				// key forward) are handled inside the session; drop the frame
				// without tearing down the subscription.
				return;
			}

			if (!frame) return;

			this.pushVideoPacket(stream, {
				ssrc,
				sequence: assembler.lastSequence,
				timestamp: assembler.timestamp,
				payloadType: assembler.lastPayloadType,
				marker: true,
				retransmitted: assembler.retransmitted,
				payload: frame,
			});
			return;
		}

		// Passthrough (transport-only) or undecryptable frames: emit the
		// normalized OBU bitstream decoders expect.
		const normalized = isAv1 ? depacketizeAv1FrameNormalized(payloads) : encryptedFrame;
		if (!normalized) return;

		this.pushVideoPacket(stream, {
			ssrc,
			sequence: assembler.lastSequence,
			timestamp: assembler.timestamp,
			payloadType: assembler.lastPayloadType,
			marker: true,
			retransmitted: assembler.retransmitted,
			payload: normalized,
		});
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
