'use strict';

const process = require('node:process');
const { token } = require('./auth');
const Discord = require('../src');

const sharder = new Discord.ShardingManager(`${process.cwd()}/test/shard.js`, { token, respawn: false });

sharder.on('launch', shard => console.log(`launched ${shard.id}`));

sharder.spawn();
