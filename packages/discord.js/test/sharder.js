import process from 'node:process';
import { ShardingManager } from '../src/index.js';
import { token } from './auth.js';

const sharder = new ShardingManager(`${process.cwd()}/test/shard.js`, { token, respawn: false });

sharder.on('launch', shard => console.log(`launched ${shard.id}`));

sharder.spawn();
