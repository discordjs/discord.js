'use strict';

const { promises: fs } = require('fs');
const { inspect } = require('util');
const { Client } = require('../../src/index');
const { token } = require('../auth.json');

const client = new Client({
  presence: { status: 'invisible' },
  restTimeOffset: 0,
});
const cache = new Map();

client.on('debug', message => {
  if (/(Sending a heartbeat|Latency of)/i.test(message)) return null;
  console.log(message);
  if (/Encountered a 429/i.test(message)) {
    if (new RegExp('/emojis').test(message)) {
      console.log('Ratelimited while testing emojis. Thanks Discord.');
      return null;
    }
    console.log('\n\n');
    console.log('Buckets\n', inspect(client.rest.buckets, false, 4));
    console.log('\n\n');
    console.log('Handlers\n', inspect(client.rest.handlers, false, 4));
    process.exit(-420);
  }
  return null;
});

client.on('rateLimit', data => {
  console.log('Handling ratelimit');
  console.log(data);
});

async function main() {
  await client.login(token);
  const suites = await fs.readdir('./suites');

  for (const suiteName of suites) {
    const suite = require(`./suites/${suiteName}`);
    console.log(`[REST Test] Running suite '${suiteName}'`);
    const result = await suite(client, cache);

    if (result) {
      cache.set(suiteName, result);
    }

    console.log(`[REST Test] Suite '${suiteName}' finished running`);
  }
}

main();
