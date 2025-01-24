'use strict';

const { ThreadOnlyChannel } = require('./ThreadOnlyChannel.js');

/**
 * Represents a media channel.
 * @extends {ThreadOnlyChannel}
 */
class MediaChannel extends ThreadOnlyChannel {}

exports.MediaChannel = MediaChannel;
