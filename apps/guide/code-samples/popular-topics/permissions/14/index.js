const util = require('node:util');
const { ChannelType, Client, codeBlock, Events, GatewayIntentBits, PermissionsBitField } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	if (!interaction.channel.permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages)) return;

	const { commandName } = interaction;

	const botPerms = [
		PermissionsBitField.Flags.ManageMessages,
		PermissionsBitField.Flags.KickMembers,
		PermissionsBitField.Flags.ManageRoles,
		PermissionsBitField.Flags.ManageChannels,
	];

	if (!interaction.guild.members.me.permissions.has(botPerms)) {
		return interaction.reply(`I need the permissions ${botPerms.join(', ')} for this demonstration to work properly`);
	}

	if (commandName === 'mod-everyone') {
		const everyonePerms = new Permissions(interaction.guild.roles.everyone.permissions);
		const newPerms = everyonePerms.add([
			PermissionsBitField.Flags.ManageMessages,
			PermissionsBitField.Flags.KickMembers,
		]);

		interaction.guild.roles.everyone
			.setPermissions(newPerms.bitfield)
			.then(() => interaction.reply('Added mod permissions to `@everyone`.'))
			.catch(console.error);
	} else if (commandName === 'unmod-everyone') {
		const everyonePerms = new PermissionsBitField(interaction.guild.roles.everyone.permissions);
		const newPerms = everyonePerms.remove([
			PermissionsBitField.Flags.ManageMessages,
			PermissionsBitField.Flags.KickMembers,
		]);

		interaction.guild.roles.everyone
			.setPermissions(newPerms.bitfield)
			.then(() => interaction.reply('Removed mod permissions from `@everyone`.'))
			.catch(console.error);
	} else if (commandName === 'create-mod') {
		if (interaction.guild.roles.cache.some((role) => role.name === 'Mod')) {
			return interaction.reply('A role with the name "Mod" already exists on this server.');
		}

		interaction.guild.roles
			.create({
				name: 'Mod',
				permissions: [PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.KickMembers],
			})
			.then(() => interaction.reply('Created Mod role.'))
			.catch(console.error);
	} else if (commandName === 'check-mod') {
		if (interaction.member.roles.cache.some((role) => role.name === 'Mod')) {
			return interaction.reply('You do have a role called Mod.');
		}

		interaction.reply("You don't have a role called Mod.");
	} else if (commandName === 'can-kick') {
		if (interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
			return interaction.reply('You can kick members.');
		}

		interaction.reply('You cannot kick members.');
	} else if (commandName === 'make-private') {
		if (!interaction.channel.permissionsFor(client.user).has(PermissionsBitField.Flags.ManageRoles)) {
			return interaction.reply('Please make sure I have the `Manage Roles` permission in this channel and retry.');
		}

		interaction.channel.permissionOverwrites
			.set([
				{
					id: interaction.guildId,
					deny: [PermissionsBitField.Flags.ViewChannel],
				},
				{
					id: client.user.id,
					allow: [PermissionsBitField.Flags.ViewChannel],
				},
				{
					id: interaction.user.id,
					allow: [PermissionsBitField.Flags.ViewChannel],
				},
			])
			.then(() => interaction.reply(`Made channel ${interaction.channel} private.`))
			.catch(console.error);
	} else if (commandName === 'create-private') {
		interaction.guild.channels
			.create({
				name: 'private',
				type: ChannelType.GuildText,
				permissionOverwrites: [
					{
						id: interaction.guildId,
						deny: [PermissionsBitField.Flags.ViewChannel],
					},
					{
						id: interaction.user.id,
						allow: [PermissionsBitField.Flags.ViewChannel],
					},
					{
						id: client.user.id,
						allow: [PermissionsBitField.Flags.ViewChannel],
					},
				],
			})
			.then(() => interaction.reply('Created a private channel.'))
			.catch(console.error);
	} else if (commandName === 'unprivate') {
		if (!interaction.channel.permissionsFor(client.user).has(PermissionsBitField.Flags.ManageRoles)) {
			return interaction.reply('Please make sure I have the `Manage Roles` permission in this channel and retry.');
		}

		interaction.channel.permissionOverwrites
			.delete(interaction.guildId)
			.then(() => interaction.reply(`Made channel ${interaction.channel} public.`))
			.catch(console.error);
	} else if (commandName === 'my-permissions') {
		const finalPermissions = interaction.channel.permissionsFor(interaction.member);

		interaction.reply({ content: codeBlock(util.inspect(finalPermissions.serialize())) });
	} else if (commandName === 'lock-permissions') {
		if (!interaction.channel.parent) {
			return interaction.reply('This channel is not placed under a category.');
		}

		if (!interaction.channel.permissionsFor(client.user).has(PermissionsBitField.Flags.ManageRoles)) {
			return interaction.reply('Please make sure I have the `Manage Roles` permission in this channel and retry.');
		}

		interaction.channel
			.lockPermissions()
			.then(() => {
				interaction.reply(
					`Synchronized overwrites of ${interaction.channel} with the \`${interaction.channel.parent.name}\` category.`,
				);
			})
			.catch(console.error);
	} else if (commandName === 'role-permissions') {
		const roleFinalPermissions = interaction.channel.permissionsFor(interaction.member.roles.highest);

		interaction.reply({ content: codeBlock(util.inspect(roleFinalPermissions.serialize())) });
	}
});

client.login('your-token-goes-here');
