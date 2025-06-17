---
title: Interactions
---

# Component interactions

Every button click or select menu selection on a component sent by your bot fires an `interaction`, triggering the <DocsLink path="Client:Class#interactionCreate" /> event. How you decide to handle this will likely depend on the purpose of the components. Options include:

- Waiting for a single interaction via `awaitMessageComponent()` on a channel or a message.
- Listening for multiple interactions over a period of time using an <DocsLink path="InteractionCollector:Class" />.
- Creating a permanent component handler in the <DocsLink path="Client:Class#interactionCreate" /> event.

::: tip
This page is a follow-up to the [slash commands](/slash-commands/advanced-creation) section, and assumes you have created either [buttons](/interactive-components/buttons) or [select menus](/interactive-components/select-menus) as detailed in this guide. Please carefully read those pages first so that you can understand the methods used here.
:::

## Responding to component interactions

As with all other interactions message components interactions require a response within 3 seconds, else Discord will treat them as failed.

Like slash commands, all types of message component interactions support the `reply()`, `deferReply()`, `editReply()` and `followUp()` methods, with the option for these responses to be ephemeral. These function identically to how they do for slash commands, so refer to the page on [slash command response methods](/slash-commands/response-methods) for information on those.

Component interactions also support two additional methods of response, detailed below and demonstrated in examples later on the page.

### Updates

Responding to a component interaction via the `update()` method acknowledges the interaction by editing the message on which the component was attached. This method should be preferred to calling `editReply()` on the original interaction which sent the components. Like `editReply()`, `update()` cannot be used to change the ephemeral state of a message.

Once `update()` has been called, future messages can be sent by calling `followUp()` or edits can be made by calling `editReply()` on the component interaction.

### Deferred updates

Responding to a component interaction via the `deferUpdate()` method acknowledges the interaction and resets the message state. This method can be used to suppress the need for further responses, however it's encouraged to provide meaningful feedback to users via an `update()` or ephemeral `reply()` at least.

Once `deferUpdate()` has been called, future messages can be sent by calling `followUp()` or edits can be made by calling `editReply()` on the component interaction.

## Awaiting components

If you followed our [buttons](/interactive-components/buttons) guide, the confirmation workflow for the `ban` command is a good example of a situation where your bot is expecting to receive a single response, from either the Confirm or Cancel button.

Begin by adding `withResponse` to the options, and then calling <DocsLink path="Message:Class#awaitMessageComponent" type="method" /> on the message. This method returns a [Promise](/additional-info/async-await.md) that resolves when any interaction passes its filter (if one is provided), or throws if none are received before the timeout. If this happens, remove the components and notify the user.

```js {1,4,7-12}
const response = await interaction.reply({
	content: `Are you sure you want to ban ${target.username} for reason: ${reason}?`,
	components: [row],
	withResponse: true,
});

const collectorFilter = (i) => i.user.id === interaction.user.id;

try {
	const confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
} catch {
	await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
}
```

:::tip
The filter applied here ensures that only the user who triggered the original interaction can use the buttons.
:::

With the confirmation collected, check which button was clicked and perform the appropriate action.

```js {11-16}
const response = await interaction.reply({
	content: `Are you sure you want to ban ${target.username} for reason: ${reason}?`,
	components: [row],
	withResponse: true,
});

const collectorFilter = (i) => i.user.id === interaction.user.id;
try {
	const confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

	if (confirmation.customId === 'confirm') {
		await interaction.guild.members.ban(target);
		await confirmation.update({ content: `${target.username} has been banned for reason: ${reason}`, components: [] });
	} else if (confirmation.customId === 'cancel') {
		await confirmation.update({ content: 'Action cancelled', components: [] });
	}
} catch {
	await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
}
```

## Component collectors

For situations where you want to collect multiple interactions, the Collector approach is better suited than awaiting singular interactions. Following on from the [select menus](/interactive-components/select-menus) guide, you're going to extend that example to use an <DocsLink path="InteractionCollector:Class"/> to listen for multiple <DocsLink path="StringSelectMenuInteraction:Class"/>s.

Begin by adding `withResponse` to the options, and then calling <DocsLink path="Message:Class#createMessageComponentCollector" type="method" /> on this instance. This method returns an InteractionCollector that will fire its <DocsLink path="InteractionCollector:Class#collect" /> event whenever an interaction passes its filter (if one is provided).

In the `collect` event, each interaction is a <DocsLink path="StringSelectMenuInteraction:Class" /> thanks to the `componentType: ComponentType.StringSelect` option provided to the collector (and because that was the only type of component in the message). The selected value(s) are available via the <DocsLink path="StringSelectMenuInteraction:Class#values" /> property.

```js
const response = await interaction.reply({
	content: 'Choose your starter!',
	components: [row],
	withResponse: true,
});

const collector = response.resource.message.createMessageComponentCollector({
	componentType: ComponentType.StringSelect,
	time: 3_600_000,
});

collector.on('collect', async (i) => {
	const selection = i.values[0];
	await i.reply(`${i.user} has selected ${selection}!`);
});
```

## The Client#interactionCreate event

Third and finally, you may wish to have a listener setup to respond to permanent button or select menu features of your guild. For this, returning to the <DocsLink path="Client:Class#interactionCreate" /> event is the best approach.

If your event handling has been setup in multiple files as per our [event handling](/creating-your-bot/event-handling) guide, you should already have an `events/interactionCreate.js` file that looks something like this.

```js {6}
const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
		}
	},
};
```

The way this was previously set up returns from the `execute` function whenever it encounters an interaction that is not a `ChatInputCommandInteraction`, as shown on the highlighted line above. The first change that needs to be made is to invert this logic, without actually changing the functionality.

```js {6,20}
const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}
		}
	},
};
```

Now that the logic is setup to run code when something _is_ a `ChatInputCommandInteraction`, rather than to stop and exit when it isn't, you can add handling for additional interaction types via simple `if...else` logic.

```js {20-24}
const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}
		} else if (interaction.isButton()) {
			// respond to the button
		} else if (interaction.isStringSelectMenu()) {
			// respond to the select menu
		}
	},
};
```
