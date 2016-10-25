'use strict';

const Discord = require('../');
const request = require('superagent');
const fs = require('fs');

const client = new Discord.Client({ fetchAllMembers: false, apiRequestMethod: 'sequential' });

const { email, password, token, usertoken, song } = require('./auth.json');

client.login(token).then(atoken => console.log('logged in with token ' + atoken)).catch(console.error);

client.ws.on('send', console.log);

client.on('ready', () => {
  console.log('ready!');
});

client.on('userUpdate', (o, n) => {
  console.log(o.username, n.username);
});

client.on('guildMemberAdd', (g, m) => console.log(`${m.user.username} joined ${g.name}`));

client.on('channelCreate', channel => {
  console.log(`made ${channel.name}`);
});

client.on('error', m => console.log('debug', m));
client.on('reconnecting', m => console.log('debug', m));

client.on('message', message => {
  if (true) {
    if (message.content === 'makechann') {
      if (message.channel.guild) {
        message.channel.guild.createChannel('hi', 'text').then(console.log);
      }
    }

    if (message.content === 'imma queue pls') {
      let count = 0;
      let ecount = 0;
      for(let x = 0; x < 4000; x++) {
        message.channel.sendMessage(`this is message ${x} of 3999`)
          .then(m => {
            count++;
            console.log('reached', count, ecount);
          })
          .catch(m => {
            console.error(m);
            ecount++;
            console.log('reached', count, ecount);
          });
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
          client.user.setAvatar(res.body).catch(console.error)
            .then(user => message.channel.sendMessage('Done!'));
        });
    }

    if (message.content.startsWith('gn')) {
      message.guild.setName(message.content.substr(3))
        .then(guild => console.log('guild updated to', guild.name))
        .catch(console.error);
    }

    if (message.content === 'leave') {
      message.guild.leave().then(guild => console.log('left guild', guild.name)).catch(console.error);
    }

    if (message.content === 'stats') {
      let m = '';
      m += `I am aware of ${message.guild.channels.size} channels\n`;
      m += `I am aware of ${message.guild.members.size} members\n`;
      m += `I am aware of ${client.channels.size} channels overall\n`;
      m += `I am aware of ${client.guilds.size} guilds overall\n`;
      m += `I am aware of ${client.users.size} users overall\n`;
      message.channel.sendMessage(m).then(msg => msg.edit('nah')).catch(console.error);
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
      }).catch(console.error);
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
      }).catch(console.error);
    }
  }
});

function nameLoop(user) {
  // user.setUsername(user.username + 'a').then(nameLoop).catch(console.error);
}

function chanLoop(channel) {
  channel.setName(channel.name + 'a').then(chanLoop).catch(console.error);
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

let disp, con;

client.on('message', msg => {
  if (msg.content.startsWith('/play')) {
    console.log('I am now going to play', msg.content);
    const chan = msg.content.split(' ').slice(1).join(' ');
    con.playStream(ytdl(chan, {filter : 'audioonly'}), { passes : 4 });
  }
  if (msg.content.startsWith('/join')) {
    const chan = msg.content.split(' ').slice(1).join(' ');
    msg.channel.guild.channels.get(chan).join()
      .then(conn => {
        con = conn;
        msg.reply('done');
        disp = conn.playStream(ytdl(song, {filter:'audioonly'}), { passes : 3 });
        conn.player.on('debug', console.log);
        conn.player.on('error', err => console.log(123, err));
      })
      .catch(console.error);
  }
})
