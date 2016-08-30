const Discord = require('../');

const sharder = new Discord.ShardingManager(`${process.cwd()}/test/shard.js`, 5);

sharder.on('launch', id => console.log(`launched ${id}`));
