'use strict';

const { mergeable } = require('./mergeable');
const { mockApplication } = require('./mockApplication');
const { mockChannel } = require('./mockChannel');
const { mockInteractionMember } = require('./mockMember');
const {
  InteractionType,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ComponentType,
  ButtonStyle,
} = require('../../src');

const mockApplicationCommandData = mergeable({
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
});

const mockButtonComponentData = mergeable({
  component_type: ComponentType.Button,
  label: 'test',
  custom_id: 'button',
  disabled: false,
  style: ButtonStyle.Primary,
});

const mockSelectMenuComponentData = mergeable({
  component_type: ComponentType.SelectMenu,
  custom_id: 'selectMenu',
  values: ['one', 'two,'],
});

const mockInteraction = mergeable({
  id: '1234589303',
  type: InteractionType.ApplicationCommand,
  application_id: mockApplication().id,
  data: mockApplicationCommandData(),
  member: mockInteractionMember(),
});

module.exports = { mockInteraction, mockApplicationCommandData, mockButtonComponentData, mockSelectMenuComponentData };
