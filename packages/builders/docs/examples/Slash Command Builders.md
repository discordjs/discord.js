# Slash Command Builders

## Ping command

```ts
import { SlashCommandBuilder } from '@discordjs/builders';

// Create a slash command builder
const pingCommand = new SlashCommandBuilder().setName('ping').setDescription('Check if this interaction is responsive');

// Get the raw data that can be sent to Discord
const rawData = pingCommand.toJSON();
```

## Arguments

```ts
import { SlashCommandBuilder } from '@discordjs/builders';

// Creates a boop command
const boopCommand = new SlashCommandBuilder()
	.setName('boop')
	.setDescription('Boops the specified user, as many times as you want')
	.addUserOption((option) => option.setName('user').setDescription('The user to boop').setRequired(true))

	// Adds an integer option
	.addIntegerOption((option) =>
		option.setName('boop_amount').setDescription('How many times should the user be booped (defaults to 1)'),
	)

	// Supports choices too!
	.addIntegerOption((option) =>
		option
			.setName('boop_reminder')
			.setDescription('How often should we remind you to boop the user')
			.addChoices({ name: 'Every day', value: 1 }, { name: 'Weekly', value: 7 }),
	);

// Get the final raw data that can be sent to Discord
const rawData = boopCommand.toJSON();
```

## Subcommands and subcommand groups

```ts
import { SlashCommandBuilder } from '@discordjs/builders';

const pointsCommand = new SlashCommandBuilder()
	.setName('points')
	.setDescription('Lists or manages user points')

	// Add a manage group
	.addSubcommandGroup((group) =>
		group
			.setName('manage')
			.setDescription('Shows or manages points in the server')
			.addSubcommand((subcommand) =>
				subcommand
					.setName('user_points')
					.setDescription("Alters a user's points")
					.addUserOption((option) =>
						option.setName('user').setDescription('The user whose points to alter').setRequired(true),
					)
					.addStringOption((option) =>
						option
							.setName('action')
							.setDescription('What action should be taken with the users points?')
							.addChoices(
								{ name: 'Add points', value: 'add' },
								{ name: 'Remove points', value: 'remove' },
								{ name: 'Reset points', value: 'reset' },
							)
							.setRequired(true),
					)
					.addIntegerOption((option) => option.setName('points').setDescription('Points to add or remove')),
			),
	)

	// Add an information group
	.addSubcommandGroup((group) =>
		group
			.setName('info')
			.setDescription('Shows information about points in the guild')
			.addSubcommand((subcommand) =>
				subcommand.setName('total').setDescription('Tells you the total amount of points given in the guild'),
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName('user')
					.setDescription("Lists a user's points")
					.addUserOption((option) =>
						option.setName('user').setDescription('The user whose points to list').setRequired(true),
					),
			),
	);

// Get the final raw data that can be sent to Discord
const rawData = pointsCommand.toJSON();
```
