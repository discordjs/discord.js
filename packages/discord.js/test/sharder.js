'use strict';

const process = require('node:process');
const { token } = require('./auth.js');
const { ShardingManager } = require('../src/index.js');

const sharder = new ShardingManager(`${process.cwd()}/test/shard.js`, { token, respawn: false });

sharder.on('launch', shard => console.log(`launched ${shard.id}`));

sharder.spawn();
