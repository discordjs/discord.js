---
title: Buttons
---

# Buttons

The first type of interactive component we'll cover creating is a Button. Buttons are available in a variety of styles and can be used to provide permanent interfaces, temporary confirmation workflows, and other forms of additional interaction with your bot.

::: tip
This page is a follow-up to the [slash commands](/slash-commands/advanced-creation) section and [action rows](/interactive-components/action-rows) page. Please carefully read those pages first so that you can understand the methods used here.
:::

## Building buttons

Buttons are one of the `MessageComponent` classes, which can be sent via messages or interaction responses.

For this example, you're going to expand on the `ban` command that was previously covered on the [parsing options](/slash-commands/parsing-options.md) page with a confirmation workflow.

To create your buttons, use the <DocsLink section="builders" path="ButtonBuilder:Class"/> class, defining at least the `customId`, `style` and `label`.

```js {1,9-17}
const { ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

module.exports = {
	// data: new SlashCommandBuilder()...
	async execute(interaction) {
		const target = interaction.options.getUser('target');
		const reason = interaction.options.getString('reason') ?? 'No reason provided';

		const confirm = new ButtonBuilder().setCustomId('confirm').setLabel('Confirm Ban').setStyle(ButtonStyle.Danger);

		const cancel = new ButtonBuilder().setCustomId('cancel').setLabel('Cancel').setStyle(ButtonStyle.Secondary);
	},
};
```

::: tip
The custom id is a developer-defined string of up to 100 characters. Use this field to ensure you can uniquely define all incoming interactions from your buttons!
:::

## Sending buttons

To send your buttons, create an action row and add the buttons as components. Then, send the row in the `components` property of <DocsLink path="InteractionReplyOptions:Interface" /> (extends <DocsLink path="BaseMessageOptions:Interface" />).

```js {1,19-20,24}
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

module.exports = {
	// data: new SlashCommandBuilder()...
	async execute(interaction) {
		const target = interaction.options.getUser('target');
		const reason = interaction.options.getString('reason') ?? 'No reason provided';

		const confirm = new ButtonBuilder().setCustomId('confirm').setLabel('Confirm Ban').setStyle(ButtonStyle.Danger);

		const cancel = new ButtonBuilder().setCustomId('cancel').setLabel('Cancel').setStyle(ButtonStyle.Secondary);

		const row = new ActionRowBuilder().addComponents(cancel, confirm);

		await interaction.reply({
			content: `Are you sure you want to ban ${target} for reason: ${reason}?`,
			components: [row],
		});
	},
};
```

Restart your bot and then send the command to a channel your bot has access to. If all goes well, you should see something like this:

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ban</DiscordInteraction>
		</template>
		Are you sure you want to ban <DiscordMention :highlight="true" profile="user" /> for reason: trolling?
		<template #actions>
			<DiscordButtons>
				<DiscordButton type="secondary">Cancel</DiscordButton>
				<DiscordButton type="danger">Confirm Ban</DiscordButton>
			</DiscordButtons>
		</template>
	</DiscordMessage>
</DiscordMessages>

## Button styles

You'll notice in the above example that two different styles of buttons have been used, the grey Secondary style and the red Danger style. These were chosen specifically to support good UI/UX principles. In total, there are five button styles that can be used as appropriate to the action of the button:

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">buttons</DiscordInteraction>
		</template>
		<template #actions>
			<DiscordButtons>
				<DiscordButton type="primary">Primary</DiscordButton>
				<DiscordButton type="secondary">Secondary</DiscordButton>
				<DiscordButton type="success">Success</DiscordButton>
				<DiscordButton type="danger">Danger</DiscordButton>
				<DiscordButton type="link" url="https://discord.js.org">Link</DiscordButton>
			</DiscordButtons>
		</template>
	</DiscordMessage>
</DiscordMessages>

- `Primary` style buttons are blue. These are suitable for most general purpose actions, where it's the primary or most significant action expected.
- `Secondary` style buttons are grey. Use these for less important actions like the "Cancel" button in the example above.
- `Success` style buttons are green. Similar to the Primary button, these are a good choice for "positive" confirmation actions.
- `Danger` style buttons are red. Where the action being confirmed is "destructive", such a ban or delete, using a red button helps alert the user to the risk of the action.
- `Link` style buttons are also grey, but are tagged with the "external link" symbol. These buttons will open the provided link in the browser without sending an interaction to the bot.

## Link buttons

Link buttons are a little different to the other styles. `Link` buttons _must_ have a `url`, _cannot_ have a `customId` and _do not_ send an interaction event when clicked.

```js {3}
const button = new ButtonBuilder()
	.setLabel('discord.js docs')
	.setURL('https://discord.js.org')
	.setStyle(ButtonStyle.Link);
```

## Disabled buttons

If you want to prevent a button from being used, but not remove it from the message, you can disable it with the <DocsLink section="builders" path="ButtonBuilder:Class#setDisabled" type="method"/> method:

```js {5}
const button = new ButtonBuilder()
	.setCustomId('disabled')
	.setLabel('Click me?')
	.setStyle(ButtonStyle.Primary)
	.setDisabled(true);
```

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">button</DiscordInteraction>
		</template>
		Are you even able to 
		<template #actions>
			<DiscordButtons>
				<DiscordButton :disabled="true">Click me?</DiscordButton>
			</DiscordButtons>
		</template>
	</DiscordMessage>
</DiscordMessages>

## Emoji buttons

If you want to use a guild emoji within a <DocsLink path="ButtonBuilder:Class"/>, you can use the <DocsLink path="ButtonBuilder:Class#setEmoji" type="method"/> method:

```js {5}
const button = new ButtonBuilder()
	.setCustomId('primary')
	.setLabel('Primary')
	.setStyle(ButtonStyle.Primary)
	.setEmoji('123456789012345678');
```

#### Next steps

That's everything you need to know about building and sending buttons! From here you can learn about the other type of message component, [select menus](/interactive-components/select-menus), or have your bot start listening to [component interactions](/interactive-components/interactions) from your buttons.
