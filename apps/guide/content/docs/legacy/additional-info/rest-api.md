---
title: REST APIs
---

# Using a REST API

REST APIs are extremely popular on the web and allow you to freely grab a site's data if it has an available API over an HTTP connection.

## Making HTTP requests with Node

In these examples, we will be using [undici](https://www.npmjs.com/package/undici), an excellent library for making HTTP requests.

To install undici, run the following command:

```sh tab="npm"
npm i install undici
```

```sh tab="yarn"
yarn add undici
```

```sh tab="pnpm"
pnpm add undici
```

## Skeleton code

To start off, you will be using the following skeleton code. Since both the commands you will be adding in this section require an interaction with external APIs, you will defer the reply, so your application responds with a "thinking..." state. You can then edit the reply once you got the data you need:

<!-- eslint-disable require-await -->

```js
const { Client, EmbedBuilder, Events, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;
	await interaction.deferReply();
	// ...
});

client.login('your-token-goes-here');
```

::: tip
We're taking advantage of [destructuring](/additional-info/es6-syntax.md#destructuring) in this tutorial to maintain readability.
:::

## Using undici

Undici is a Promise-based HTTP/1.1 client, written from scratch for Node.js. If you aren't already familiar with Promises, you should read up on them [here](/additional-info/async-await.md).

In this tutorial, you will be making a bot with two API-based commands using the [random.cat](https://aws.random.cat) and [Urban Dictionary](https://www.urbandictionary.com) APIs.

On top of your file, import the library function you will be using:

```js
const { request } = require('undici');
```

### Random Cat

Random cat's API is available at [https://aws.random.cat/meow](https://aws.random.cat/meow) and returns a [JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON) response. To actually fetch data from the API, you're going to do the following:

```js
const catResult = await request('https://aws.random.cat/meow');
const { file } = await catResult.body.json();
```

If you just add this code, it will seem like nothing happens. What you do not see, is that you are launching a request to the random.cat server, which responds some JSON data. The helper function parses the response data to a JavaScript object you can work with. The object will have a `file` property with the value of a link to a random cat image.

Next, you will implement this approach into an application command:

```js {3-7}
client.on(Events.InteractionCreate, async (interaction) => {
	// ...
	if (commandName === 'cat') {
		const catResult = await request('https://aws.random.cat/meow');
		const { file } = await catResult.body.json();
		interaction.editReply({ files: [file] });
	}
});
```

So, here's what's happening in this code:

1. Your application sends a `GET` request to random.cat.
2. random.cat sees the request and gets a random file url from their database.
3. random.cat then sends that file's URL as a JSON object in a stringified form that contains a link to the image.
4. undici receives the response and you parse the body to a JSON object.
5. Your application then attaches the image and sends it in Discord.

### Urban Dictionary

Urban Dictionary's API is available at [https://api.urbandictionary.com/v0/define](https://api.urbandictionary.com/v0/define), accepts a `term` parameter, and returns a JSON response.

The following code will fetch data from this api:

```js {1,5-11}
// ...
client.on(Events.InteractionCreate, async (interaction) => {
	// ...
	if (commandName === 'urban') {
		const term = interaction.options.getString('term');
		const query = new URLSearchParams({ term });

		const dictResult = await request(`https://api.urbandictionary.com/v0/define?${query}`);
		const { list } = await dictResult.body.json();
	}
});
```

Here, you are using JavaScript's native [URLSearchParams class](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) to create a [query string](https://en.wikipedia.org/wiki/Query_string) for the URL so that the Urban Dictionary server can parse it and know what you want to look up.

If you were to do `/urban hello world`, then the URL would become https://api.urbandictionary.com/v0/define?term=hello%20world since the string `"hello world"` is encoded.

You can get the respective properties from the returned JSON. If you were to view it in your browser, it usually looks like a bunch of mumbo jumbo. If it doesn't, great! If it does, then you should get a JSON formatter/viewer. If you're using Chrome, [JSON Formatter](https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa) is one of the more popular extensions. If you're not using Chrome, search for "JSON formatter/viewer &lt;your browser&gt;" and get one.

Now, if you look at the JSON, you can see that it has a `list` property, which is an array of objects containing various definitions for the term (maximum 10). Something you always want to do when making API-based commands is to handle the case when no results are available. So, if you throw a random term in there (e.g. `njaksdcas`) and then look at the response the `list` array should be empty. Now you are ready to start writing!

As explained above, you'll want to check if the API returned any answers for your query, and send back the definition if that's the case:

```js {3-5,7}
if (commandName === 'urban') {
	// ...
	if (!list.length) {
		return interaction.editReply(`No results found for **${term}**.`);
	}

	interaction.editReply(`**${term}**: ${list[0].definition}`);
}
```

Here, you are only getting the first object from the array of objects called `list` and grabbing its `definition` property.

If you've followed the tutorial, you should have something like this:

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				:command="true"
			>urban</DiscordInteraction>
		</template>
		<DiscordMention :highlight="true" profile="user" />, No results for <strong>njaksdcas</strong>
	</DiscordMessage>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				:command="true"
			>urban</DiscordInteraction>
		</template>
		<strong>hello world</strong>: The easiest, and first program any newbie would write. Applies for any language. Also what you would see in the first chapter of most programming books.
	</DiscordMessage>
</DiscordMessages>

Now, you can make it an [embed](/popular-topics/embeds.md) for easier formatting.

You can define the following helper function at the top of your file. In the code below, you can use this function to truncate the returned data and make sure the embed doesn't error, because field values exceed 1024 characters.

```js
const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);
```

And here is how you can build the embed from the API data:

```js
const [answer] = list;

const embed = new EmbedBuilder()
	.setColor(0xefff00)
	.setTitle(answer.word)
	.setURL(answer.permalink)
	.addFields(
		{ name: 'Definition', value: trim(answer.definition, 1_024) },
		{ name: 'Example', value: trim(answer.example, 1_024) },
		{ name: 'Rating', value: `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.` },
	);

interaction.editReply({ embeds: [embed] });
```

Now, if you execute that same command again, you should get this:

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				:command="true"
			>urban</DiscordInteraction>
		</template>
		<template #embeds>
			<DiscordEmbed border-color="#EFFF00" embed-title="hello world" url="https://www.urbandictionary.com/define.php?term=hello%20world">
				<template #fields>
					<DiscordEmbedFields>
						<DiscordEmbedField field-title="Definition">
							The easiest, and first program any newbie would write. Applies for any language. Also what you would see in the first chapter of most programming books. 
						</DiscordEmbedField>
						<DiscordEmbedField field-title="Example">
							programming noob: Hey I just attended my first programming lesson earlier! <br>
							.NET Veteran: Oh? What can you do? <br>
							programming noob: I could make a dialog box pop up which says "Hello World!" !!! <br>
							.NET Veteran: lmao.. hey guys! look.. check out this "hello world" programmer <br><br>
							Console.WriteLine("Hello World")
						</DiscordEmbedField>
						<DiscordEmbedField field-title="Rating">
							122 thumbs up. <br>
							42 thumbs down.
						</DiscordEmbedField>
					</DiscordEmbedFields>
				</template>
			</DiscordEmbed>
		</template>
	</DiscordMessage>
</DiscordMessages>

## Resulting code

<ResultingCode />
