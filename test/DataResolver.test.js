/* eslint-disable strict */
const { readFile } = require('fs/promises');
const { join } = require('path');
const { REACH_B64 } = require('./constants');
const { DataResolver } = require('../src');

const reachPath = join(__dirname, 'manual', 'blobReach.png');

describe('DataResolver unit tests', () => {
  describe('DataResolver#resolveInviteCode', () => {
    test('discord.gg', () => {
      expect(DataResolver.resolveInviteCode('discord.gg/djs')).toStrictEqual('djs');
    });

    test('discord.com/invite', () => {
      expect(DataResolver.resolveInviteCode('discord.com/invite/djs')).toStrictEqual('djs');
    });

    test('discordapp.com/invite', () => {
      expect(DataResolver.resolveInviteCode('discordapp.com/invite/djs')).toStrictEqual('djs');
    });
  });

  test('DataResolver#resolveGuildTemplateCode', () => {
    expect(DataResolver.resolveGuildTemplateCode('discord.new/ZXzkJKCDVckU')).toStrictEqual('ZXzkJKCDVckU');
  });

  test('DataResolver#resolveImage', async () => {
    const resolved = await DataResolver.resolveImage(reachPath);
    expect(resolved).toStrictEqual(REACH_B64);
  });

  test('DataResolver#resolveFile', async () => {
    const file = await readFile(reachPath);

    const resolved = await DataResolver.resolveFile(reachPath);
    const data = [];
    for await (const chunk of resolved) data.push(chunk);
    const buf = Buffer.concat(data);

    expect(buf).toStrictEqual(file);
  });

  test('DataResolver#resolveBase64', async () => {
    const file = await readFile(reachPath);
    const resolved = DataResolver.resolveBase64(file);
    expect(resolved).toStrictEqual(REACH_B64);
  });
});
