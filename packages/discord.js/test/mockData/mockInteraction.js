'use strict';

const { mergeable } = require('./mergeable');
const { mockApplication } = require('./mockApplication');
const { mockChannel } = require('./mockChannel');
const { mockInteractionMember } = require('./mockMember');
const { InteractionType, ApplicationCommandOptionType, ApplicationCommandType } = require('../../src');

module.exports.mockInteraction = mergeable({
  id: '1234589303',
  type: InteractionType.ApplicationCommand,
  application_id: mockApplication().id,
  data: {
    type: ApplicationCommandType.ChatInput,
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
  member: mockInteractionMember(),
});
