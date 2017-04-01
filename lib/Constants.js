"use strict";

module.exports.DefaultAvatarHashes = [
    "6debd47ed13483642cf09e832ed0bc1b",
    "322c936a8c8be1b803cd94861bdfa868",
    "dd4dbc0016779df1378e7812eabaa04d",
    "0e291f67c9274a1abdddeb3fd919cbaa",
    "1cbd08c76f8af6dddce02c5138971129"
];

module.exports.ImageFormats = [
    "jpg",
    "png",
    "webp",
    "gif"
];

module.exports.ImageSizes = [
    128,
    256,
    512,
    1024,
    2048
];

module.exports.GatewayOPCodes = {
    EVENT:              0,
    HEARTBEAT:          1,
    IDENTIFY:           2,
    STATUS_UPDATE:      3,
    VOICE_STATE_UPDATE: 4,
    VOICE_SERVER_PING:  5,
    RESUME:             6,
    RECONNECT:          7,
    GET_GUILD_MEMBERS:  8,
    INVALID_SESSION:    9,
    HELLO:             10,
    HEARTBEAT_ACK:     11,
    SYNC_GUILD:        12,
    SYNC_CALL:         13
};

module.exports.GATEWAY_VERSION = 6;

module.exports.Permissions = {
    createInstantInvite: 1,
    kickMembers:         1 << 1,
    banMembers:          1 << 2,
    administrator:       1 << 3,
    manageChannels:      1 << 4,
    manageGuild:         1 << 5,
    addReactions:        1 << 6,
    readMessages:        1 << 10,
    sendMessages:        1 << 11,
    sendTTSMessages:     1 << 12,
    manageMessages:      1 << 13,
    embedLinks:          1 << 14,
    attachFiles:         1 << 15,
    readMessageHistory:  1 << 16,
    mentionEveryone:     1 << 17,
    externalEmojis:      1 << 18,
    voiceConnect:        1 << 20,
    voiceSpeak:          1 << 21,
    voiceMuteMembers:    1 << 22,
    voiceDeafenMembers:  1 << 23,
    voiceMoveMembers:    1 << 24,
    voiceUseVAD:         1 << 25,
    changeNickname:      1 << 26,
    manageNicknames:     1 << 27,
    manageRoles:         1 << 28,
    manageWebhooks:      1 << 29,
    manageEmojis:        1 << 30,
    all:      0b1111111111101111111110000111111,
    allGuild: 0b1111100000000000000000000111111,
    allText:  0b0110000000001111111110000010001,
    allVoice: 0b0110011111100000000000000010001
};

module.exports.VoiceOPCodes = {
    IDENTIFY:            0,
    SELECT_PROTOCOL:     1,
    HELLO:               2,
    HEARTBEAT:           3,
    SESSION_DESCRIPTION: 4,
    SPEAKING:            5
};
