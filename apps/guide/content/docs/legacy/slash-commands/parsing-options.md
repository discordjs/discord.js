---
title: Parsing Options
---

# Parsing options

## Command options

In this section, we'll cover how to access the values of a command's options. Consider the following `ban` command example with two options:

```js {7-15}
const { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Select a member and ban them.')
		.addUserOption((option) => option.setName('target').setDescription('The member to ban').setRequired(true))
		.addStringOption((option) => option.setName('reason').setDescription('The reason for banning'))
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.setContexts(InteractionContextType.Guild),
};
```

In the execute method, you can retrieve the value of these two options from the `CommandInteractionOptionResolver` as shown below:

```js {4-8}
module.exports = {
	// data: new SlashCommandBuilder()...
	async execute(interaction) {
		const target = interaction.options.getUser('target');
		const reason = interaction.options.getString('reason') ?? 'No reason provided';

		await interaction.reply(`Banning ${target.username} for reason: ${reason}`);
		await interaction.guild.members.ban(target);
	},
};
```

Since `reason` isn't a required option, the example above uses the `??` [nullish coalescing operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator) to set a default value in case the user does not supply a value for `reason`.

If the target user is still in the guild where the command is being run, you can also use `.getMember('target')` to get their `GuildMember` object.

::: tip
If you want the Snowflake of a structure instead, grab the option via `get()` and access the Snowflake via the `value` property. Note that you should use `const { value: name } = ...` here to [destructure and rename](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) the value obtained from the <DocsLink path="CommandInteractionOption:Interface" /> structure to avoid identifier name conflicts.
:::

In the same way as the above examples, you can get values of any type using the corresponding `CommandInteractionOptionResolver#get_____()` method. `String`, `Integer`, `Number` and `Boolean` options all provide the respective primitive types, while `User`, `Channel`, `Role`, and `Mentionable` options will provide either the respective discord.js class instance if your application has a bot user in the guild or a raw API structure for commands-only deployments.

### Choices

If you specified preset choices for your String, Integer, or Number option, getting the selected choice is exactly the same as the free-entry options above. Consider the [gif command](/slash-commands/advanced-creation.html#choices) example you looked at earlier:

```js {11-15,17}
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gif')
		.setDescription('Sends a random gif!')
		.addStringOption((option) =>
			option
				.setName('category')
				.setDescription('The gif category')
				.setRequired(true)
				.addChoices(
					{ name: 'Funny', value: 'gif_funny' },
					{ name: 'Meme', value: 'gif_meme' },
					{ name: 'Movie', value: 'gif_movie' },
				),
		),
	async execute(interaction) {
		const category = interaction.options.getString('category');
		// category must be one of 'gif_funny', 'gif_meme', or 'gif_movie'
	},
};
```

Notice that nothing changes - you still use `getString()` to get the choice value. The only difference is that in this case, you can be sure it's one of only three possible values.

### Subcommands

If you have a command that contains subcommands, the `CommandInteractionOptionResolver#getSubcommand()` will tell you which subcommand was used. You can then get any additional options of the selected subcommand using the same methods as above.

The snippet below uses the same `info` command from the [subcommand creation guide](/slash-commands/advanced-creation.md#subcommands) to demonstrate how you can control the logic flow when replying to different subcommands:

```js {4,12}
module.exports = {
	// data: new SlashCommandBuilder()...
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'user') {
			const user = interaction.options.getUser('target');

			if (user) {
				await interaction.reply(`Username: ${user.username}\nID: ${user.id}`);
			} else {
				await interaction.reply(`Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`);
			}
		} else if (interaction.options.getSubcommand() === 'server') {
			await interaction.reply(
				`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`,
			);
		}
	},
};
```
