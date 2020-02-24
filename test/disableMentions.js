const Discord = require('../src');
const { token, prefix } = require('./auth');

const client = new Discord.Client({
    // To see a difference, comment out disableMentions and run the same tests using disableEveryone
    // You will notice that all messages will mention @everyone
    //disableEveryone: true
    disableMentions: true
});

const tests = [
    // Test 1
    // See https://github.com/discordapp/discord-api-docs/issues/1189
    '@\u202eeveryone',

    // Test 2
    // See https://github.com/discordapp/discord-api-docs/issues/1241
    // TL;DR: Characters like \u0300 will only be stripped if more than 299 are present
    '\u0300@'.repeat(150) + '@\u0300everyone',

    // Test 3
    // Normal @everyone mention
    '@everyone',
];



client.on('ready', () => console.log('Ready!'));

client.on('message', message => {
    const command = message.content.substr(prefix.length);
    
    if (command === 'test1')
        message.reply(tests[0]);
    else if (command === 'test2')
        message.reply(tests[1]);
    else if (command === 'test3')
        message.reply(tests[2]);
});

client.login(token).catch(console.error);