'use strict';

const { mockUser } = require('./mockUser');

const mockMember = mergeData => ({
  user: mockUser(),
  nick: 'awesome nickname',
  avatar: null,
  roles: '12345679',
  joined_at: new Date().toISOString(),
  deaf: false,
  mute: false,
  pending: false,
  communication_disable_until: null,
  ...mergeData,
});

const mockInteractionMember = mergeData => ({
  ...mockMember(),
  permissions: '8',
  ...mergeData,
});

module.exports = { mockMember, mockInteractionMember };
