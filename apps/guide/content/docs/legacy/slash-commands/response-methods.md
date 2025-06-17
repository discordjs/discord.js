---
title: Command Responses
---

# Command response methods

There are multiple ways of responding to a slash command; each of these are covered in the following segments. Using an interaction response method confirms to Discord that your bot successfully received the interaction, and has responded to the user. Discord enforces this to ensure that all slash commands provide a good user experience (UX). Failing to respond will cause Discord to show that the command failed, even if your bot is performing other actions as a result.

The most common way of sending a response is by using the `ChatInputCommandInteraction#reply()` method, as you have done in earlier examples. This method acknowledges the interaction and sends a new message in response.

```js {6}
module.exports = {
	data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
```

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		Pong!
	</DiscordMessage>
</DiscordMessages>

::: warning
Initially an interaction token is only valid for three seconds, so that's the timeframe in which you are able to use the `ChatInputCommandInteraction#reply()` method. Responses that require more time ("Deferred Responses") are explained later in this page.
:::

## Ephemeral responses

You may not always want everyone who has access to the channel to see a slash command's response. Previously, you would have had to DM the user to achieve this, potentially encountering the high rate limits associated with DM messages, or simply being unable to do so, if the user's DMs were disabled.

Thankfully, Discord provides a way to hide response messages from everyone but the executor of the slash command. This is called an ephemeral message and can be set by providing `flags: MessageFlags.Ephemeral` in the `InteractionReplyOptions`, as follows:

```js {5}
client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply({ content: 'Secret Pong!', flags: MessageFlags.Ephemeral });
	}
});
```

Now when you run your command again, you should see something like this:

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				:command="true"
				:ephemeral="true"
			>ping</DiscordInteraction>
		</template>
		Secret Pong!
	</DiscordMessage>
</DiscordMessages>

Ephemeral responses are _only_ available for interaction responses; another great reason to use the new and improved slash command user interface.

## Editing responses

After you've sent an initial response, you may want to edit that response for various reasons. This can be achieved with the `ChatInputCommandInteraction#editReply()` method:

::: warning
After the initial response, an interaction token is valid for 15 minutes, so this is the timeframe in which you can edit the response and send follow-up messages. You also **cannot** edit the ephemeral state of a message, so ensure that your first response sets this correctly.
:::

```js {1,8-9}
const wait = require('node:timers/promises').setTimeout;

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
		await wait(2_000);
		await interaction.editReply('Pong again!');
	}
});
```

In fact, editing your interaction response is necessary to [calculate the ping](/popular-topics/faq#how-do-i-check-the-bot-s-ping) properly for this command.

## Deferred responses

As previously mentioned, Discord requires an acknowledgement from your bot within three seconds that the interaction was received. Otherwise, Discord considers the interaction to have failed and the token becomes invalid. But what if you have a command that performs a task which takes longer than three seconds before being able to reply?

In this case, you can make use of the `ChatInputCommandInteraction#deferReply()` method, which triggers the `<application> is thinking...` message. This also acts as the initial response, to confirm to Discord that the interaction was received successfully and gives you a 15-minute timeframe to complete your tasks before responding.

<!--- TODO: Thinking... message, once available in components -->

```js {7-9}
const wait = require('node:timers/promises').setTimeout;

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.deferReply();
		await wait(4_000);
		await interaction.editReply('Pong!');
	}
});
```

If you have a command that performs longer tasks, be sure to call `deferReply()` as early as possible.

Note that if you want your response to be ephemeral, utilize `flags` from `InteractionDeferReplyOptions` here:

<!-- eslint-skip -->

```js
await interaction.deferReply({ flags: MessageFlags.Ephemeral });
```

It is not possible to edit a reply to change its ephemeral state once sent.

::: tip
If you want to make a proper ping command, one is available in our [FAQ](/popular-topics/faq.md#how-do-i-check-the-bot-s-ping).
:::

## Follow-ups

The `reply()` and `deferReply()` methods are both _initial_ responses, which tell Discord that your bot successfully received the interaction, but cannot be used to send additional messages. This is where follow-up messages come in. After having initially responded to an interaction, you can use `ChatInputCommandInteraction#followUp()` to send additional messages:

::: warning
After the initial response, an interaction token is valid for 15 minutes, so this is the timeframe in which you can edit the response and send follow-up messages.
:::

```js {6}
client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
		await interaction.followUp('Pong again!');
	}
});
```

If you run this code you should end up having something that looks like this:

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		Pong!
	</DiscordMessage>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="bot">Pong!</DiscordInteraction>
		</template>
		Pong again!
	</DiscordMessage>
</DiscordMessages>

You can also pass the ephemeral flag to the `InteractionReplyOptions`:

<!-- eslint-skip -->

```js
await interaction.followUp({ content: 'Pong again!', flags: MessageFlags.Ephemeral });
```

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		Pong!
	</DiscordMessage>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="bot" :ephemeral="true">Pong!</DiscordInteraction>
		</template>
		Pong again!
	</DiscordMessage>
</DiscordMessages>

Note that if you use `followUp()` after a `deferReply()`, the first follow-up will edit the `<application> is thinking` message rather than sending a new one.

That's all, now you know everything there is to know on how to reply to slash commands!

::: tip
Interaction responses can use masked links (e.g. `[text](http://site.com)`) in the message content.
:::

## Fetching and deleting responses

In addition to replying to a slash command, you may also want to delete the initial reply. You can use `ChatInputCommandInteraction#deleteReply()` for this:

<!-- eslint-skip -->

```js {2}
await interaction.reply('Pong!');
await interaction.deleteReply();
```

Lastly, you may require the `Message` object of a reply for various reasons, such as adding reactions. Pass `withResponse: true` to obtain the <DocsLink path="InteractionCallbackResponse:Class" />. You can then access the `Message` object like so:

```js
const response = await interaction.reply({ content: 'Pong!', withResponse: true });
console.log(response.resource.message);
```

You can also use the `ChatInputCommandInteraction#fetchReply()` method to fetch the `Message` instance. Do note that this incurs an extra API call in comparison to `withResponse: true`:

```js
await interaction.reply('Pong!');
const message = await interaction.fetchReply();
console.log(message);
```

## Localized responses

In addition to the ability to provide localized command definitions, you can also localize your responses. To do this, get the locale of the user with `ChatInputCommandInteraction#locale` and respond accordingly:

```js
client.on(Events.InteractionCreate, (interaction) => {
	const locales = {
		pl: 'Witaj Świecie!',
		de: 'Hallo Welt!',
	};
	interaction.reply(locales[interaction.locale] ?? 'Hello World (default is english)');
});
```
