const Discord = require('../');

const sharder = new Discord.ShardingManager(`${process.cwd()}/test/shard.js`, 5, false);

sharder.on('launch', shard => console.log(`launched ${shard.id}`));

sharder.spawn(5);
