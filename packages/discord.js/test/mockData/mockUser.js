'use strict';

module.exports.mockUser = mergeData => ({
  id: '1234567891011121324',
  username: 'fakeuser',
  discriminator: '1234',
  avatar: null,
  bot: true,
  system: false,
  email: 'testuser@test.com',
  ...mergeData,
});
