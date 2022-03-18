'use strict';

const { ChannelType } = require('discord-api-types/v10');
const { mergeable } = require('./mergeable');

module.exports.mockChannel = mergeable({
  id: '123243431553',
  name: 'testChannel',
  type: ChannelType.GuildText,
});
