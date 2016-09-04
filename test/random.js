'use strict';

const Discord = require('../');
const request = require('superagent');
const fs = require('fs');

const client = new Discord.Client({ fetch_all_members: false });

const { email, password, token } = require('./auth.json');

client.login(token).then(atoken => console.log('logged in with token ' + atoken)).catch(console.log);

client.on('ready', () => {
  console.log('ready!');
});

client.on('debug', console.log);

client.on('message', message => {
  if (true) {
    if (message.content === 'makechann') {
      if (message.channel.guild) {
        message.channel.guild.createChannel('hi', 'text').then(console.log);
      }
    }

    if (message.content === 'myperms?') {
      message.channel.sendMessage('Your permissions are:\n' +
        JSON.stringify(message.channel.permissionsFor(message.author).serialize(), null, 4));
    }

    if (message.content === 'delchann') {
      message.channel.delete().then(chan => console.log('selfDelChann', chan.name));
    }

    if (message.content.startsWith('setname')) {
      message.channel.setName(message.content.substr(8));
    }

    if (message.content.startsWith('botname')) {
      client.user.setUsername(message.content.substr(8));
    }

    if (message.content.startsWith('botavatar')) {
      request
        .get('url')
        .end((err, res) => {
          client.user.setAvatar(res.body).catch(console.log)
            .then(user => message.channel.sendMessage('Done!'));
        });
    }

    if (message.content.startsWith('gn')) {
      message.guild.setName(message.content.substr(3))
        .then(guild => console.log('guild updated to', guild.name))
        .catch(console.log);
    }

    if (message.content === 'leave') {
      message.guild.leave().then(guild => console.log('left guild', guild.name)).catch(console.log);
    }

    if (message.content === 'stats') {
      let m = '';
      m += `I am aware of ${message.guild.channels.size} channels\n`;
      m += `I am aware of ${message.guild.members.size} members\n`;
      m += `I am aware of ${client.channels.size} channels overall\n`;
      m += `I am aware of ${client.guilds.size} guilds overall\n`;
      m += `I am aware of ${client.users.size} users overall\n`;
      message.channel.sendMessage(m).then(msg => msg.edit('nah')).catch(console.log);
    }

    if (message.content === 'messageme!') {
      message.author.sendMessage('oh, hi there!').catch(e => console.log(e.stack));
    }

    if (message.content === 'don\'t dm me') {
      message.author.deleteDM();
    }

    if (message.content.startsWith('kick')) {
      message.guild.member(message.mentions[0]).kick().then(member => {
        console.log(member);
        message.channel.sendMessage('Kicked!' + member.user.username);
      }).catch(console.log);
    }

    if (message.content === 'ratelimittest') {
      let i = 1;
      while (i <= 20) {
        message.channel.sendMessage(`Testing my rates, item ${i} of 20`);
        i++;
      }
    }

    if (message.content === 'makerole') {
      message.guild.createRole().then(role => {
        message.channel.sendMessage(`Made role ${role.name}`);
      }).catch(console.log);
    }
  }
});

function nameLoop(user) {
  // user.setUsername(user.username + 'a').then(nameLoop).catch(console.log);
}

function chanLoop(channel) {
  channel.setName(channel.name + 'a').then(chanLoop).catch(console.log);
}

client.on('message', msg => {
  if (msg.content.startsWith('?raw')) {
    msg.channel.sendMessage('```' + msg.content + '```');
  }

  if (msg.content.startsWith('#eval') && msg.author.id === '66564597481480192') {
    try {
      const com = eval(msg.content.split(" ").slice(1).join(" "));
      msg.channel.sendMessage('```\n' + com + '```');
    } catch(e) {
      msg.channel.sendMessage('```\n' + e + '```');
    }
  }
});

const ytdl = require('ytdl-core');

let disp;

client.on('message', msg => {
  if (msg.content.startsWith('/join')) {
    const chan = msg.content.split(' ').slice(1).join(' ');
    msg.channel.guild.channels.get(chan).join()
      .then(conn => {
        msg.reply('done');
        disp = conn.player.playStream(ytdl('https://www.youtube.com/watch?v=nbXgHAzUWB0', {filter : 'audioonly'}));
        conn.player.on('debug', console.log);
        conn.player.on('error', err => console.log(123, err));
        const receiver = conn.createReceiver();
        const out = fs.createWriteStream('C:/Users/Amish/Desktop/output.pcm');
        conn.once('speaking', (user, speaking) => {
          if (speaking) {
            msg.reply(`${user.username} start`);
            const str = receiver.createPCMStream(user);
            str.pipe(out);
            str.on('end', () => msg.reply(`${user.username} end`));
          }
        });
        disp.on('error', err => console.log(123, err));
      })
      .catch(console.log);
  }
})
