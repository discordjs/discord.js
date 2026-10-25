export const RTP_OPUS_PAYLOAD_TYPE = 0x78;

/**
 * The RTP payload types that can carry video, as negotiated by the library
 * (see VIDEO_CODEC_NEGOTIATION). Used to detect video packets for streams
 * that have not been mapped yet.
 */
export const RTP_VIDEO_PAYLOAD_TYPES = [101, 102, 103, 104, 105, 106, 107, 108, 109, 110];
