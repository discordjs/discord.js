'use strict';

const { mergeable } = require('./mergeable');

module.exports.mockUser = mergeable({
  id: '1234567891011121324',
  username: 'fakeuser',
  discriminator: '1234',
  avatar: null,
  bot: true,
  system: false,
  email: 'testuser@test.com',
});
