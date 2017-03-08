const Discord = require("./src");
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.channel.sendFile('dank.png');
  }
});

client.login('MjgyNjQxNDA0Mzk0NzMzNTc5.C6EbXg.JYxsp0YbRuvJnVmbvNSXxygwMQE');