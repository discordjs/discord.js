const Discord = require('../src');

const { owner, token, webhookChannel, webhookToken } = require('./auth.js');

const client = new Discord.Client();
const hook = new Discord.WebhookClient(webhookChannel, webhookToken);

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const util = require('util');

const fill = c => Array(4).fill(c.repeat(1000));
const buffer = l => fetch(l).then(res => res.buffer());
const read = util.promisify(fs.readFile);
const readStream = fs.createReadStream;
const wait = util.promisify(setTimeout);

const linkA = 'https://lolisafe.moe/iiDMtAXA.png';
const linkB = 'https://lolisafe.moe/9hSpedPh.png';
const fileA = path.join(__dirname, 'blobReach.png');

const embed = () => new Discord.MessageEmbed();
const attach = (attachment, name) => new Discord.MessageAttachment(attachment, name);

const tests = [
  () => hook.send('x'),
  () => hook.send(['x', 'y']),

  () => hook.send('x', { code: true }),
  () => hook.send('1', { code: 'js' }),
  () => hook.send('x', { code: '' }),

  () => hook.send(fill('x'), { split: true }),
  () => hook.send(fill('1'), { code: 'js', split: true }),
  m => hook.send(fill('x'), { reply: m.author, code: 'js', split: true }),
  () => hook.send(fill('xyz '), { split: { char: ' ' } }),

  () => hook.send('x', { embed: { description: 'a' } }),
  () => hook.send({ embeds: [{ description: 'a' }] }),
  () => hook.send({ files: [{ attachment: linkA }] }),
  () => hook.send({
    embeds: [{ description: 'a' }],
    files: [{ attachment: linkA, name: 'xyz.png' }],
  }),

  () => hook.send('x', embed().setDescription('a')),
  () => hook.send(embed().setDescription('a')),
  () => hook.send({ embeds: [embed().setDescription('a')] }),
  () => hook.send([embed().setDescription('a'), embed().setDescription('b')]),

  () => hook.send('x', attach(linkA)),
  () => hook.send(attach(linkA)),
  () => hook.send({ files: [linkA] }),
  () => hook.send({ files: [attach(linkA)] }),
  async () => hook.send(attach(await buffer(linkA))),
  async () => hook.send({ files: [await buffer(linkA)] }),
  async () => hook.send({ files: [{ attachment: await buffer(linkA) }] }),
  () => hook.send([attach(linkA), attach(linkB)]),

  () => hook.send({ embed: { description: 'a' } }),
  () => hook.send(embed().setDescription('a')),
  () => hook.send({ embed: embed().setDescription('a') }),

  () => hook.send({ embeds: [{ description: 'a' }] }),
  () => hook.send(embed().setDescription('a')),

  () => hook.send(['x', 'y'], [embed().setDescription('a'), attach(linkB)]),
  () => hook.send(['x', 'y'], [attach(linkA), attach(linkB)]),

  () => hook.send([embed().setDescription('a'), attach(linkB)]),
  () => hook.send({
    embeds: [embed().setImage('attachment://two.png')],
    files: [attach(linkB, 'two.png')],
  }),
  () => hook.send({
    embeds: [
      embed()
        .setImage('attachment://two.png')
        .attachFiles([attach(linkB, 'two.png')]),
    ],
  }),
  async () => hook.send(['x', 'y', 'z'], {
    code: 'js',
    embeds: [
      embed()
        .setImage('attachment://two.png')
        .attachFiles([attach(linkB, 'two.png')]),
    ],
    files: [{ attachment: await buffer(linkA) }],
  }),

  () => hook.send('x', attach(fileA)),
  () => hook.send({ files: [fileA] }),
  () => hook.send(attach(fileA)),
  async () => hook.send({ files: [await read(fileA)] }),
  async m => hook.send(fill('x'), {
    reply: m.author,
    code: 'js',
    split: true,
    embeds: [embed().setImage('attachment://zero.png')],
    files: [attach(await buffer(linkA), 'zero.png')],
  }),

  () => hook.send('x', attach(readStream(fileA))),
  () => hook.send({ files: [readStream(fileA)] }),
  () => hook.send({ files: [{ attachment: readStream(fileA) }] }),
  async m => hook.send(fill('xyz '), {
    reply: m.author,
    code: 'js',
    split: { char: ' ', prepend: 'hello! ', append: '!!!' },
    embeds: [embed().setImage('attachment://zero.png')],
    files: [linkB, attach(await buffer(linkA), 'zero.png'), readStream(fileA)],
  }),

  () => hook.send('Done!'),
];


client.on('message', async message => {
  if (message.author.id !== owner) return;
  const match = message.content.match(/^do (.+)$/);
  if (match && match[1] === 'it') {
    /* eslint-disable no-await-in-loop */
    for (const [i, test] of tests.entries()) {
      await message.channel.send(`**#${i}**\n\`\`\`js\n${test.toString()}\`\`\``);
      await test(message).catch(e => message.channel.send(`Error!\n\`\`\`\n${e}\`\`\``));
      await wait(1000);
    }
    /* eslint-enable no-await-in-loop */
  } else if (match) {
    const n = parseInt(match[1]) || 0;
    const test = tests.slice(n)[0];
    const i = tests.indexOf(test);
    await message.channel.send(`**#${i}**\n\`\`\`js\n${test.toString()}\`\`\``);
    await test(message).catch(e => message.channel.send(`Error!\n\`\`\`\n${e}\`\`\``));
  }
});

client.login(token);
