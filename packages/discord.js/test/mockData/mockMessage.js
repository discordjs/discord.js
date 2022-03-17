'use strict';

const { mockChannel } = require('./mockChannel');

module.exports.mockMessage = mergeData => ({
  id: '123456',
  channel_id: mockChannel().id,
  content: 'test',
  ...mergeData,
});
