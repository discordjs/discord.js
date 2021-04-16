/* eslint-disable strict */
const { SnowflakeUtil } = require('../src');

beforeAll(() => {
  const NOW = new Date('2020-01-01T00:00:00.000+00:00').getTime();
  Date.now = jest.fn().mockImplementation(() => NOW);
});

describe('SnowflakeUtil unit tests', () => {
  test('Snowflake#generate', () => {
    const flake = SnowflakeUtil.generate();
    expect(flake).toStrictEqual('661720242585731072');
  });

  test('Snowflake#deconstruct', () => {
    const flake = SnowflakeUtil.deconstruct('661720242585735168');
    expect(flake).toStrictEqual({
      binary: '0000100100101110111001110000111000000000000000100001000000000000',
      date: new Date('2020-01-01T00:00:00.000Z'),
      increment: 0,
      processID: 1,
      timestamp: 1577836800000,
      workerID: 1,
    });
  });
});
