'use strict';

/* eslint-env jest */

const { resolveGuildTemplateCode } = require('../src');

describe('resolveGuildTemplateCode', () => {
  test('basic', () => {
    expect(resolveGuildTemplateCode('https://discord.new/abc')).toEqual('abc');
  });
});
