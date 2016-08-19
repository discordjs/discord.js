'use strict';

const Discord = require('../');
const request = require('superagent');

const client = new Discord.Client();

client.login(require('./auth.json').token).then(token => console.log('logged in with token ' + token)).catch(console.log);

client.on('ready', () => {
  console.log('ready!');
});

client.on('guildCreate', (guild) => {
  console.log(guild);
});
client.on('guildDelete', (guild) => {
  console.log('guilddel', guild.name);
});
client.on('guildUpdate', (old, guild) => {
  console.log('guildupdate', old.name, guild.name);
});
client.on('channelCreate', channel => {
  // console.log(channel);
});
client.on('channelDelete', channel => {
  console.log('channDel', channel.name);
});

client.on('channelUpdate', (old, chan) => {
  console.log('chan update', old.name, chan.name);
});

client.on('guildMemberAdd', (guild, user) => {
  console.log('new guild member', user.user.username, 'in', guild.name);
});

client.on('guildMemberRemove', (guild, user) => {
  console.log('dead guild member', user.user.username, 'in', guild.name);
});

client.on('guildRoleCreate', (guild, role) => {
  console.log('new role', role.name, 'in', guild.name);
  role.edit({
    permissions: ['DEAFEN_MEMBERS'],
    name: 'deafen',
  }).then(role2 => {
    console.log('role replace from ' + role.name + ' to ' + role2.name);
  }).catch(console.log);
});

client.on('guildRoleDelete', (guild, role) => {
  console.log('dead role', role.name, 'in', guild.name);
});

client.on('guildRoleUpdate', (guild, old, newRole) => {
  console.log('updated role', old.name, 'to', newRole.name, 'in', guild.name);
});

client.on('presenceUpdate', (oldUser, newUser) => {
  // console.log('presence from', oldUser.username, 'to', newUser.username);
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
  console.log('voiceState', oldMember.user.username, oldMember.voiceChannel + '', newMember.voiceChannel + '');
});

client.on('typingStart.', (channel, user) => {
  if (user.username === 'hydrabolt')
    console.log(user.username, 'started typing in', channel.name);
});

client.on('typingStop.', (channel, user, data) => {
  if (user.username === 'hydrabolt')
    console.log(user.username, 'stopped typing in', channel.name, 'after', data.elapsedTime + 'ms');
});

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
      m += `I am aware of ${message.guild.members.size} members`;
      message.channel.sendMessage(m);
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

client.on('messageDelete', message => {
  console.log('Message deleted by', message.author.username);
});

client.on('messageUpdate', (old, message) => {
  if (message.author.username === 'hydrabolt')
    console.log('Message updated from', old.content, 'to', message.content);
});

client.on('message', message => {
  if (message.content === '?perms?') {
    console.log(message.author.username, 'asked for perms in', message.channel.name, ':');
    console.log(message.channel.permissionsFor(message.author).serialize());
  }
});
