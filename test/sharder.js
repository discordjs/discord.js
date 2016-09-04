const Discord = require('../');

const sharder = new Discord.ShardingManager(`${process.cwd()}/test/shard.js`);

sharder.on('launch', id => console.log(`launched ${id}`));

sharder.spawn(5);
