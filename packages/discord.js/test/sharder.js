'use strict';

const process = require('node:process');
const { token } = require('./auth');
const { ShardingManager } = require('../src');

const sharder = new ShardingManager(`${process.cwd()}/test/shard.js`, { token, respawn: false });

sharder.on('launch', shard => console.log(`launched ${shard.id}`));

sharder.spawn();
