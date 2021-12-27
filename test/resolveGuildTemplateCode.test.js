'use strict';

/* eslint-env jest */

const { DataResolver } = require('../src');

describe('resolveGuildTemplateCode', () => {
  test('basic', () => {
    expect(DataResolver.resolveGuildTemplateCode('https://discord.new/abc')).toBe('abc');
  });
});
