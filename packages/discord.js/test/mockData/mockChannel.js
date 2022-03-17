'use strict';

const { ChannelType } = require('discord-api-types/v10');

module.exports.mockChannel = mergeData => ({
  id: '123243431553',
  name: 'testChannel',
  type: ChannelType.GuildText,
  ...mergeData,
});
