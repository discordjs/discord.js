import { inspect } from 'node:util';
import { Client, Events, codeBlock, GatewayIntentBits } from '../src/index.js';
import { token, owner } from './auth.js';

const client = new Client({
  intents: GatewayIntentBits.Guilds | GatewayIntentBits.GuildMessages | GatewayIntentBits.GuildMessagePolls,
});

client.on('raw', console.log);

client.on(Events.ClientReady, async () => {
  const channel = client.channels.cache.get('1220510756286631968');

  // const message = await channel.messages.fetch('1220680560414818325');
  // console.dir(message.poll, { depth: Infinity });

  // const answer = message.poll.answers.first();
  // const voters = await answer.voters.fetch();
  // console.dir(voters);

  const message = await channel.send({
    poll: {
      question: {
        text: 'What is your favorite color?',
      },
      answers: [{ text: 'Red' }, { text: 'Green' }, { text: 'Blue' }, { text: 'Yellow' }],
      duration: 8,
      allowMultiselect: false,
    },
  });

  console.log(message.poll);
});

client.on(Events.MessagePollVoteAdd, (answer, userId) => {
  console.log(`User ${userId} voted for answer ${answer.id}`);
});

client.on(Events.MessagePollVoteRemove, (answer, userId) => {
  console.log(`User ${userId} removed their vote for answer ${answer.id}`);
});

client.on(Events.MessageUpdate, async (_oldMessage, newMessage) => {
  if (!newMessage.poll) return;

  console.log('Poll was updated', newMessage.poll);
});

client.on(Events.MessageCreate, async message => {
  const prefix = `<@${client.user.id}> `;

  if (message.author.id !== owner || !message.content.startsWith(prefix)) return;
  let res;
  try {
    // eslint-disable-next-line no-eval
    res = await eval(message.content.slice(prefix.length));
    if (typeof res !== 'string') res = inspect(res);
  } catch (error) {
    console.error(error.stack);
    res = error.message;
  }

  if (res.length > 2_000) {
    console.log(res);
    res = 'Output too long, check the console.';
  }

  await message.channel.send(codeBlock('js', res));
});

client.login(token);
