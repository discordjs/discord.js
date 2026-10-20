import process from 'node:process';
import { token } from './auth.js';
import { ShardingManager } from '../src/index.js';

const sharder = new ShardingManager(`${process.cwd()}/test/shard.js`, { token, respawn: false });

sharder.on('launch', shard => console.log(`launched ${shard.id}`));

sharder.spawn();
