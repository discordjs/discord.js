---
title: Advanced Command Creation
---

# Advanced command creation

The examples we've covered so far have all been fairly simple commands, such as `ping`, `server`, and `user` which all have standard static responses. However, there's much more you can do with the full suite of slash command tools!

## Adding options

Application commands can have additional `options`. Think of these options as arguments to a function, and as a way for the user to provide the additional information the command requires.

::: tip
If you've already added options to your commands and need to know how to receive and parse them, refer to the [Parsing options](/slash-commands/parsing-options.md) page in this section of the guide.
:::

Options require at minimum a name and description. The same restrictions apply to option names as slash command names - 1-32 characters containing no capital letters, spaces, or symbols other than `-` and `_`. You can specify them as shown in the `echo` command below, which prompt the user to enter a String for the `input` option.

```js {6-8}
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('echo')
	.setDescription('Replies with your input!')
	.addStringOption((option) => option.setName('input').setDescription('The input to echo back'));
```

## Option types

By specifying the `type` of an `ApplicationCommandOption` using the corresponding method you are able to restrict what the user can provide as input, and for some options, leverage the automatic parsing of options into proper objects by Discord.

The example above uses `addStringOption`, the simplest form of standard text input with no additional validation. By leveraging additional option types, you could change the behavior of this command in many ways, such as using a Channel option to direct the response to a specific channel:

```js {9-11}
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('echo')
	.setDescription('Replies with your input!')
	.addStringOption((option) => option.setName('input').setDescription('The input to echo back'))
	.addChannelOption((option) => option.setName('channel').setDescription('The channel to echo into'));
```

Or a Boolean option to give the user control over making the response ephemeral.

```js {9-11}
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('echo')
	.setDescription('Replies with your input!')
	.addStringOption((option) => option.setName('input').setDescription('The input to echo back'))
	.addBooleanOption((option) =>
		option.setName('ephemeral').setDescription('Whether or not the echo should be ephemeral'),
	);
```

Listed below is a short description of the different types of options that can be added. For more information, refer to the `add_____Option` methods in the <DocsLink section="builders" path="SlashCommandBuilder:Class" /> documentation.

- `String`, `Integer`, `Number` and `Boolean` options all accept primitive values of their associated type.
  - `Integer` only accepts whole numbers.
  - `Number` accepts both whole numbers and decimals.
- `User`, `Channel`, `Role` and `Mentionable` options will show a selection list in the Discord interface for their associated type, or will accept a Snowflake (id) as input.
- `Attachment` options prompt the user to make an upload along with the slash command.
- `Subcommand` and `SubcommandGroup` options allow you to have branching pathways of subsequent options for your commands - more on that later on this page.

::: tip
Refer to the Discord API documentation for detailed explanations on the [`SUB_COMMAND` and `SUB_COMMAND_GROUP` option types](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups).
:::

## Required options

With option types covered, you can start looking at additional forms of validation to ensure the data your bot receives is both complete and accurate. The simplest addition is making options required, to ensure the command cannot be executed without a required value. This validation can be applied to options of any type.

Review the `echo` example again and use `setRequired(true)` to mark the `input` option as required.

```js {9}
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('echo')
	.setDescription('Replies with your input!')
	.addStringOption((option) => option.setName('input').setDescription('The input to echo back').setRequired(true));
```

## Choices

The `String`, `Number`, and `Integer` option types can have `choices`. If you would prefer users select from predetermined values rather than free entry, `choices` can help you enforce this. This is particularly useful when dealing with external datasets, APIs, and similar, where specific input formats are required.

::: warning
If you specify `choices` for an option, they'll be the **only** valid values users can pick!
:::

Specify choices by using the `addChoices()` method from within the option builder, such as <DocsLink section="builders" path="SlashCommandBuilder:Class#addStringOption" type="method" />. Choices require a `name` which is displayed to the user for selection, and a `value` that your bot will receive when that choice is selected, as if the user had typed it into the option manually.

The `gif` command example below allows users to select from predetermined categories of gifs to send:

```js {10-14}
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
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
	);
```

If you have too many choices to display (the maximum is 25), you may prefer to provide dynamic choices based on what the user has typed so far. This can be achieved using [autocomplete](/slash-commands/autocomplete.md).

## Further validation

Even without predetermined choices, additional restrictions can still be applied on otherwise free inputs.

- For `String` options, `setMaxLength()` and `setMinLength()` can enforce length limitations.
- For `Integer` and `Number` options, `setMaxValue()` and `setMinValue()` can enforce range limitations on the value.
- For `Channel` options, `addChannelTypes()` can restrict selection to specific channel types, e.g. `ChannelType.GuildText`.

We'll use these to show you how to enhance your `echo` command from earlier with extra validation to ensure it won't (or at least shouldn't) break when used:

```js {9-10, 14-15}
const { SlashCommandBuilder, ChannelType } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('echo')
	.setDescription('Replies with your input!')
	.addStringOption((option) =>
		option
			.setName('input')
			.setDescription('The input to echo back')
			// Ensure the text will fit in an embed description, if the user chooses that option
			.setMaxLength(2_000),
	)
	.addChannelOption((option) =>
		option
			.setName('channel')
			.setDescription('The channel to echo into')
			// Ensure the user can only select a TextChannel for output
			.addChannelTypes(ChannelType.GuildText),
	)
	.addBooleanOption((option) => option.setName('embed').setDescription('Whether or not the echo should be embedded'));
```

## Subcommands

Subcommands are available with the `.addSubcommand()` method. This allows you to branch a single command to require different options depending on the subcommand chosen.

With this approach, you can merge the `user` and `server` information commands from the previous section into a single `info` command with two subcommands. Additionally, the `user` subcommand has a `User` type option for targeting other users, while the `server` subcommand has no need for this, and would just show info for the current guild.

```js {6-14}
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('info')
	.setDescription('Get info about a user or a server!')
	.addSubcommand((subcommand) =>
		subcommand
			.setName('user')
			.setDescription('Info about a user')
			.addUserOption((option) => option.setName('target').setDescription('The user')),
	)
	.addSubcommand((subcommand) => subcommand.setName('server').setDescription('Info about the server'));
```

## Localizations

The names and descriptions of slash commands can be localized to the user's selected language. You can find the list of accepted locales on the [discord API documentation](https://discord.com/developers/docs/reference#locales).

Setting localizations with `setNameLocalizations()` and `setDescriptionLocalizations()` takes the format of an object, mapping location codes (e.g. `pl` and `de`) to their localized strings.

<!-- eslint-skip -->

```js {5-8,10-12,18-25}
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('dog')
	.setNameLocalizations({
		pl: 'pies',
		de: 'hund',
	})
	.setDescription('Get a cute picture of a dog!')
	.setDescriptionLocalizations({
		pl: 'Słodkie zdjęcie pieska!',
		de: 'Poste ein niedliches Hundebild!',
	})
	.addStringOption((option) =>
		option
			.setName('breed')
			.setDescription('Breed of dog')
			.setNameLocalizations({
				pl: 'rasa',
				de: 'rasse',
			})
			.setDescriptionLocalizations({
				pl: 'Rasa psa',
				de: 'Hunderasse',
			}),
	);
```

#### Next steps

For more information on receiving and parsing the different types of options covered on this page, refer to [Parsing options](/slash-commands/parsing-options.md), or for more general information on how you can respond to slash commands, check out [Response methods](/slash-commands/response-methods.md).
