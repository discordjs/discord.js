'use strict';

const { mockApplication } = require('./mockApplication');
const { mockChannel } = require('./mockChannel');
const { InteractionType, ApplicationCommandOptionType } = require('../../src');

module.exports.mockInteraction = mergeData => ({
  id: '1234589303',
  type: InteractionType.ApplicationCommand,
  application_id: mockApplication().id,
  data: {
    options: [
      {
        id: '12345678',
        name: 'test',
        type: ApplicationCommandOptionType.Integer,
        value: 1,
        channel_id: mockChannel().id,
      },
    ],
  },
  ...mergeData,
});
