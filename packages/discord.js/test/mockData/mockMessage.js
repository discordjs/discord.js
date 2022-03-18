'use strict';

const { mergeable } = require('./mergeable');
const { mockChannel } = require('./mockChannel');

module.exports.mockMessage = mergeable({
  id: '123456',
  channel_id: mockChannel().id,
  content: 'test',
});
