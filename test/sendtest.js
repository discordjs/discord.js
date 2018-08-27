const Discord = require('../src');
const { owner, token } = require('./auth.js');

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const util = require('util');

const client = new Discord.Client();

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
  m => m.channel.send('x'),
  m => m.channel.send(['x', 'y']),

  m => m.channel.send('x', { code: true }),
  m => m.channel.send('1', { code: 'js' }),
  m => m.channel.send('x', { code: '' }),

  m => m.channel.send(fill('x'), { split: true }),
  m => m.channel.send(fill('1'), { code: 'js', split: true }),
  m => m.channel.send(fill('x'), { reply: m.author, code: 'js', split: true }),
  m => m.channel.send(fill('xyz '), { split: { char: ' ' } }),

  m => m.channel.send('x', { embed: { description: 'a' } }),
  m => m.channel.send({ embed: { description: 'a' } }),
  m => m.channel.send({ files: [{ attachment: linkA }] }),
  m => m.channel.send({
    embed: { description: 'a' },
    files: [{ attachment: linkA, name: 'xyz.png' }],
  }),

  m => m.channel.send('x', embed().setDescription('a')),
  m => m.channel.send(embed().setDescription('a')),
  m => m.channel.send({ embed: embed().setDescription('a') }),
  m => m.channel.send([embed().setDescription('a'), embed().setDescription('b')]),

  m => m.channel.send('x', attach(linkA)),
  m => m.channel.send(attach(linkA)),
  m => m.channel.send({ files: [linkA] }),
  m => m.channel.send({ files: [attach(linkA)] }),
  async m => m.channel.send(attach(await buffer(linkA))),
  async m => m.channel.send({ files: [await buffer(linkA)] }),
  async m => m.channel.send({ files: [{ attachment: await buffer(linkA) }] }),
  m => m.channel.send([attach(linkA), attach(linkB)]),

  m => m.channel.send({ embed: { description: 'a' } }).then(m2 => m2.edit('x')),
  m => m.channel.send(embed().setDescription('a')).then(m2 => m2.edit('x')),
  m => m.channel.send({ embed: embed().setDescription('a') }).then(m2 => m2.edit('x')),

  m => m.channel.send('x').then(m2 => m2.edit({ embed: { description: 'a' } })),
  m => m.channel.send('x').then(m2 => m2.edit(embed().setDescription('a'))),
  m => m.channel.send('x').then(m2 => m2.edit({ embed: embed().setDescription('a') })),

  m => m.channel.send({ embed: { description: 'a' } }).then(m2 => m2.edit({ embed: null })),
  m => m.channel.send(embed().setDescription('a')).then(m2 => m2.edit({ embed: null })),

  m => m.channel.send(['x', 'y'], [embed().setDescription('a'), attach(linkB)]),
  m => m.channel.send(['x', 'y'], [attach(linkA), attach(linkB)]),

  m => m.channel.send([embed().setDescription('a'), attach(linkB)]),
  m => m.channel.send({
    embed: embed().setImage('attachment://two.png'),
    files: [attach(linkB, 'two.png')],
  }),
  m => m.channel.send({
    embed: embed()
      .setImage('attachment://two.png')
      .attachFiles([attach(linkB, 'two.png')]),
  }),
  async m => m.channel.send(['x', 'y', 'z'], {
    code: 'js',
    embed: embed()
      .setImage('attachment://two.png')
      .attachFiles([attach(linkB, 'two.png')]),
    files: [{ attachment: await buffer(linkA) }],
  }),

  m => m.channel.send('x', attach(fileA)),
  m => m.channel.send({ files: [fileA] }),
  m => m.channel.send(attach(fileA)),
  async m => m.channel.send({ files: [await read(fileA)] }),
  async m => m.channel.send(fill('x'), {
    reply: m.author,
    code: 'js',
    split: true,
    embed: embed().setImage('attachment://zero.png'),
    files: [attach(await buffer(linkA), 'zero.png')],
  }),

  m => m.channel.send('x', attach(readStream(fileA))),
  m => m.channel.send({ files: [readStream(fileA)] }),
  m => m.channel.send({ files: [{ attachment: readStream(fileA) }] }),
  async m => m.channel.send(fill('xyz '), {
    reply: m.author,
    code: 'js',
    split: { char: ' ', prepend: 'hello! ', append: '!!!' },
    embed: embed().setImage('attachment://zero.png'),
    files: [linkB, attach(await buffer(linkA), 'zero.png'), readStream(fileA)],
  }),

  m => m.channel.send('Done!'),
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

// eslint-disable-next-line no-console
process.on('unhandledRejection', console.error);
