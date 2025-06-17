const { ShardingManager } = require('discord.js');

const manager = new ShardingManager('./bot.js', { token: 'your-token-goes-here' });

manager.on('shardCreate', (shard) => console.log(`Launched shard ${shard.id}`));

manager.spawn();
