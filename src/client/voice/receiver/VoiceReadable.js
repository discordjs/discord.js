const { Readable } = require('stream');

class VoiceReadable extends Readable { _read() {} } // eslint-disable-line no-empty-function

module.exports = VoiceReadable;
