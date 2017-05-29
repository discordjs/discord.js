const auth = require('./auth.js');
const CommandClient = require('../src/commands/CommandClient');

const client = new CommandClient({
  prefix: 'c!',
  mentionable: true,
});

client.command('say', '<meme> <words...>', ctx => {
  ctx.send(`${ctx.args.words} ${ctx.args.meme}`);
}, 'say stuff');

client.command('avatar', '<user: User>', ctx => {
  ctx.send(ctx.args.user.displayAvatarURL);
}, 'get user avatar');

client.command('ship', '<mem1: Member> <mem2: Member>', ctx => {
  const { mem1, mem2 } = ctx.args;
  ctx.reply(`A lovely pairing~ ${mem1.displayName} ♥️ ${mem2.displayName}`);
}, 'ship people');

client.on('debug', console.log);

client.login(auth.token);
