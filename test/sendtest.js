const Discord = require('../src');
const { owner, token } = require('./auth.js');

const client = new Discord.Client();

const fill = c => Array(100).fill(Array(100).fill(c).join(''));
const fetch = l => require('node-fetch')(l).then(res => res.buffer());
const read = require('util').promisify(require('fs').readFile);
const wait = require('util').promisify(setTimeout);

const linkA = 'https://lolisafe.moe/iiDMtAXA.png';
const linkB = 'https://lolisafe.moe/9hSpedPh.png';
const fileA = './test/blobReach.png';

const Embed = Discord.MessageEmbed;
const Attachment = Discord.MessageAttachment;

const tests = [
  m => m.channel.send('x'),
  m => m.channel.send(['x', 'y']),
  m => m.channel.send('x', { code: true }),
  m => m.channel.send('1', { code: 'js' }),
  m => m.channel.send('x', { code: '' }),
  m => m.channel.send(fill('x').join('\n'), { split: true }),
  m => m.channel.send(fill('1').join('\n'), { code: 'js', split: true }),
  m => m.channel.send(fill('x').join('\n'), { reply: m.author, code: 'js', split: true }),
  m => m.channel.send('x', { embed: { description: 'a' } }),
  m => m.channel.send({ embed: { description: 'a' } }),
  m => m.channel.send({ files: [{ attachment: linkA }] }),
  m => m.channel.send({
    embed: { description: 'a' },
    files: [{ attachment: linkA, name: 'xyz.png' }],
  }),
  m => m.channel.send(new Embed().setDescription('a')),
  m => m.channel.send([new Embed().setDescription('a'), new Embed().setDescription('b')]),
  m => m.channel.send('x', new Embed().setDescription('a')),
  m => m.channel.send(new Attachment(linkA)),
  m => m.channel.send([new Attachment(linkA), new Attachment(linkB)]),
  m => m.channel.send('x', new Attachment(linkA)),
  m => m.channel.send([new Embed().setDescription('a'), new Attachment(linkB)]),
  m => m.channel.send('x').then(m2 => m2.edit(new Embed().setDescription('a'))),
  m => m.channel.send(new Embed().setDescription('a')).then(m2 => m2.edit('x')),
  m => m.channel.send('x').then(m2 => m2.edit({ embed: { description: 'a' } })),
  m => m.channel.send({ embed: { description: 'a' } }).then(m2 => m2.edit('x')),
  m => m.channel.send({ embed: { description: 'a' } }).then(m2 => m2.edit({ embed: null })),
  m => m.channel.send(['x', 'y'], [new Attachment(linkA), new Attachment(linkB)]),
  m => m.channel.send(['x', 'y'], [new Embed().setDescription('a'), new Attachment(linkB)]),
  async m => m.channel.send(new Attachment(await fetch(linkA))),
  m => m.channel.send({ files: [linkA] }),
  m => m.channel.send({ files: [new Attachment(linkA)] }),
  m => m.channel.send({ embed: new Embed().setDescription('a') }),
  m => m.channel.send({ embeds: [new Embed().setDescription('a')] }),
  async m => m.channel.send({ files: [await fetch(linkA)] }),
  async m => m.channel.send({ files: [{ attachment: await fetch(linkA) }] }),
  m => m.channel.send({
    embed: new Embed().setImage('attachment://two.png'),
    files: [new Attachment(linkB, 'two.png')],
  }),
  m => m.channel.send({
    embed: new Embed()
      .setImage('attachment://two.png')
      .attachFiles([new Attachment(linkB, 'two.png')]),
  }),
  async m =>
    m.channel.send(['x', 'y', 'z'], {
      code: 'js',
      embed: new Embed()
        .setImage('attachment://two.png')
        .attachFiles([new Attachment(linkB, 'two.png')]),
      files: [{ attachment: await fetch(linkA) }],
    }),
  async m => m.channel.send({ files: [await read(fileA)] }),
];

client.on('message', async message => {
  if (!(message.author.id === owner && message.content === 'do it')) return;
  for (const [i, test] of tests.entries()) {
    await message.channel.send(`**#${i}**\n\`\`\`js\n${test.toString()}\`\`\``);
    await test(message);
    await wait(1000);
  }
});

client.login(token);

// eslint-disable-next-line no-console
process.on('unhandledRejection', console.error);
