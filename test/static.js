const Discord = require('../');
const auth = require('./auth');

const client = Discord.static({ token: `Bot ${auth.token}` });

(async function test() {
  const m = await client.TextChannel('222079895583457280').send('this is a test of the early warning alert system');
  m.delete();
}());

process.on('unhandledRejection', console.log);
