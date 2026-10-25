import type { VoiceIdentifyData, VoiceSelectProtocolData } from 'discord-api-types/voice/v8';

/**
 * Voice gateway opcodes that are not (yet) part of discord-api-types.
 *
 * @remarks
 * The numbering below is for voice gateway version 8 and was verified against
 * the official Discord web client. Note that the numbering differs from the
 * legacy (v3/v4) numbering that is sometimes quoted in older resources:
 * 11 = clients connect, 12 = video, 13 = client disconnect.
 */
export const VideoGatewayOpcodes = {
	/**
	 * Broadcast whenever a user's video state (camera/screen share) changes.
	 */
	Video: 12,
	/**
	 * Session updates (e.g. negotiated codec changes).
	 */
	SessionUpdate: 14,
	/**
	 * Media sink wants - tells the SFU which streams (and qualities) you want to receive.
	 * Only supported by voice servers speaking gateway version 5 or newer.
	 */
	MediaSinkWants: 15,
} as const;

/**
 * A single stream (layer) as advertised in opcode 12 (video) payloads.
 */
export interface VoiceVideoStream {
	/**
	 * Whether the stream is currently active.
	 */
	active?: boolean;
	/**
	 * The maximum bitrate of the stream.
	 */
	max_bitrate?: number;
	/**
	 * The maximum framerate of the stream.
	 */
	max_framerate?: number;
	/**
	 * The maximum resolution of the stream.
	 */
	max_resolution?: {
		/**
		 * The height of the stream.
		 */
		height: number;
		/**
		 * The kind of resolution limit.
		 */
		type: string;
		/**
		 * The width of the stream.
		 */
		width: number;
	};
	/**
	 * The simulcast quality of the stream (0-100).
	 */
	quality?: number;
	/**
	 * The RTP stream id (simulcast layer id), e.g. "100".
	 */
	rid?: string;
	/**
	 * The SSRC used for RTX (retransmissions) of this stream.
	 */
	rtx_ssrc?: number;
	/**
	 * The SSRC of this stream. 0 or absent when the stream is not active.
	 */
	ssrc?: number;
	/**
	 * The kind of stream.
	 */
	type?: 'audio' | 'screen' | 'test' | 'video';
}

/**
 * The payload of the opcode 12 (video) broadcast.
 */
export interface VoiceVideoPayload {
	/**
	 * The audio SSRC of the user.
	 */
	audio_ssrc?: number;
	/**
	 * The streams currently active for this user (simulcast layers).
	 */
	streams?: VoiceVideoStream[];
	/**
	 * The id of the user this update is about.
	 */
	user_id: string;
	/**
	 * The (primary) video SSRC of the user, 0 when no video is active.
	 */
	video_ssrc?: number;
}

/**
 * The payload accepted by opcode 15 (media sink wants).
 *
 * @remarks
 * Either `{ any: 100 }` to receive every stream at the highest available
 * quality, or a map of SSRC (as string) to a quality level between 0 and 100.
 */
export type MediaSinkWantsPayload = Record<string, number>;

/**
 * The full opcode 15 (media sink wants) send payload.
 */
export interface MediaSinkWantsSendPayload {
	/**
	 * The sink wants payload.
	 */
	d: MediaSinkWantsPayload;
	/**
	 * The opcode (15).
	 */
	op: typeof VideoGatewayOpcodes.MediaSinkWants;
}

/**
 * Codec descriptions sent in opcode 1 (select protocol) to make the voice
 * server treat this connection as video-capable.
 *
 * @remarks
 * Payload types match the ones negotiated by the official Discord client.
 * `decode` tells the SFU that we are able to receive this codec. Video
 * RTP packets are routed by SSRC, so the payload types are only used for
 * negotiation and RTX detection.
 */
export const VIDEO_CODEC_NEGOTIATION = [
	{ name: 'opus', type: 'audio', priority: 1_000, payload_type: 120 },
	{
		name: 'H264',
		type: 'video',
		priority: 1_000,
		payload_type: 101,
		rtx_payload_type: 102,
		encode: true,
		decode: true,
	},
	{ name: 'VP8', type: 'video', priority: 999, payload_type: 105, rtx_payload_type: 106, encode: true, decode: true },
	{ name: 'VP9', type: 'video', priority: 998, payload_type: 107, rtx_payload_type: 108, encode: true, decode: true },
	{ name: 'AV1', type: 'video', priority: 997, payload_type: 109, rtx_payload_type: 110, encode: true, decode: true },
	{ name: 'H265', type: 'video', priority: 996, payload_type: 103, rtx_payload_type: 104, encode: true, decode: true },
] as const;

/**
 * The stream parameters sent in identify to declare the video simulcast
 * ladder this connection supports (mirrors the official client, which always
 * sends these for video-capable connections).
 */
export const VIDEO_IDENTIFY_STREAMS = [{ type: 'video', rid: '100', quality: 100 }] as const;

/**
 * An identify payload that additionally declares video capability.
 *
 * @remarks
 * The voice server only forwards video RTP to connections that identified
 * with `video: true` - audio-only sessions never receive video packets.
 */
export interface VideoIdentifyData extends VoiceIdentifyData {
	/**
	 * The video stream parameters (simulcast ladder).
	 */
	streams: typeof VIDEO_IDENTIFY_STREAMS;
	/**
	 * Whether this connection supports video.
	 */
	video: boolean;
}

/**
 * A select protocol payload that additionally advertises video codec support.
 */
export interface VideoSelectProtocolData extends VoiceSelectProtocolData {
	/**
	 * The codecs to negotiate.
	 */
	codecs: typeof VIDEO_CODEC_NEGOTIATION;
}
