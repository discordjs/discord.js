'use strict';

const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const { setTimeout: sleep } = require('node:timers/promises');
const { describe, it, mock } = require('node:test');
const { Collection } = require('@discordjs/collection');
const { Sweepers } = require('../src/util/Sweepers.js');

// Sweeper intervals are given in seconds, this keeps the tests fast
const INTERVAL = 0.01;
const WAIT = 100;

function createClient() {
  const client = new EventEmitter();
  client.users = {
    cache: new Collection([
      ['1', { id: '1' }],
      ['2', { id: '2' }],
      ['3', { id: '3' }],
    ]),
  };
  return client;
}

describe('Sweepers with asynchronous filters', () => {
  it('sweeps with a function resolved from a promise', async () => {
    const client = createClient();
    const sweepers = new Sweepers(client, {
      users: { interval: INTERVAL, filter: async () => user => user.id !== '2' },
    });

    await sleep(WAIT);
    sweepers.destroy();

    assert.deepEqual([...client.users.cache.keys()], ['2']);
  });

  it('still supports synchronous filters', async () => {
    const client = createClient();
    const sweepers = new Sweepers(client, {
      users: { interval: INTERVAL, filter: () => user => user.id === '1' },
    });

    await sleep(WAIT);
    sweepers.destroy();

    assert.deepEqual([...client.users.cache.keys()], ['2', '3']);
  });

  it('skips sweeping when the promise resolves to null', async () => {
    const client = createClient();
    const filter = mock.fn(async () => null);
    const sweepers = new Sweepers(client, { users: { interval: INTERVAL, filter } });

    await sleep(WAIT);
    sweepers.destroy();

    assert.ok(filter.mock.callCount() > 0);
    assert.equal(client.users.cache.size, 3);
  });

  it('does not start a new run while the previous filter is pending', async () => {
    const client = createClient();
    let release;
    const filter = mock.fn(
      () =>
        new Promise(resolve => {
          release = () => resolve(() => true);
        }),
    );
    const sweepers = new Sweepers(client, { users: { interval: INTERVAL, filter } });

    await sleep(WAIT);
    assert.equal(filter.mock.callCount(), 1);

    release();
    await sleep(WAIT);
    sweepers.destroy();

    assert.equal(client.users.cache.size, 0);
    assert.ok(filter.mock.callCount() > 1);
  });

  it('does not sweep when destroyed while the filter is pending', async () => {
    const client = createClient();
    let release;
    const sweepers = new Sweepers(client, {
      users: {
        interval: INTERVAL,
        filter: () =>
          new Promise(resolve => {
            release = () => resolve(() => true);
          }),
      },
    });

    await sleep(WAIT);
    sweepers.destroy();
    release();
    await sleep(WAIT);

    assert.equal(client.users.cache.size, 3);
    assert.equal(sweepers.intervals.users, null);
  });
});
