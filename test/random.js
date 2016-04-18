'use strict';

const Discord = require('../');

let client = new Discord.Client();

client.login(require('./auth.json').token).then(token => console.log('ready!')).catch(console.log);

client.on('ready', () => {
});

client.on('guildCreate', (guild) => {
	console.log(guild);
});
client.on('guildDelete', (guild) => {
	console.log(guild);
});
client.on('guildUpdate', (old, guild) => {
	console.log(old.name, guild.name);
});
client.on('channelCreate', channel => {
	console.log(channel);
});
client.on('channelDelete', channel => {
	console.log(channel);
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
	if (message.author.username === 'hydrabolt')
	console.log(message.author.username, 'said', message.content, 'in', message.channel.name);
});

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
