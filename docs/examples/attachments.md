# Sending Attachments

In here you'll see a few examples showing how you can send an attachment using discord.js.

## Sending an attachment using a URL

There are a few ways you can do this, but we'll show you the easiest.

The following examples use [MessageAttachment](/#/docs/main/master/class/MessageAttachment).

```js
// Extract the required classes from the discord.js module
const { Client, MessageAttachment } = require('discord.js');

// Create an instance of a Discord client
const client = new Client();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  // If the message is '!rip'
  if (message.content === '!rip') {
    // Create the attachment using MessageAttachment
    const attachment = new MessageAttachment('https://i.imgur.com/w3duR07.png');
    // Send the attachment in the message channel
    message.channel.send(attachment);
  }
});

// Log our bot in using the token from https://discord.com/developers/applications
client.login('your token here');
```

And here is the result:

![Image showing the result](/static/attachment-example1.png)

But what if you want to send an attachment with a message content? Fear not, for it is easy to do that too! We'll recommend reading [the TextChannel's "send" function documentation](/#/docs/main/master/class/TextChannel?scrollTo=send) to see what other options are available.

```js
// Extract the required classes from the discord.js module
const { Client, MessageAttachment } = require('discord.js');

// Create an instance of a Discord client
const client = new Client();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  // If the message is '!rip'
  if (message.content === '!rip') {
    // Create the attachment using MessageAttachment
    const attachment = new MessageAttachment('https://i.imgur.com/w3duR07.png');
    // Send the attachment in the message channel with a content
    message.channel.send(`${message.author},`, attachment);
  }
});

// Log our bot in using the token from https://discord.com/developers/applications
client.login('your token here');
```

And here's the result of this one:

![Image showing the result](/static/attachment-example2.png)

## Sending a local file or buffer

Sending a local file isn't hard either! We'll be using [MessageAttachment](/#/docs/main/master/class/MessageAttachment) for these examples too.

```js
// Extract the required classes from the discord.js module
const { Client, MessageAttachment } = require('discord.js');

// Create an instance of a Discord client
const client = new Client();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  // If the message is '!rip'
  if (message.content === '!rip') {
    // Create the attachment using MessageAttachment
    const attachment = new MessageAttachment('./rip.png');
    // Send the attachment in the message channel with a content
    message.channel.send(`${message.author},`, attachment);
  }
});

// Log our bot in using the token from https://discord.com/developers/applications
client.login('your token here');
```

The results are the same as the URL examples:

![Image showing result](/static/attachment-example2.png)

But what if you have a buffer from an image? Or a text document? Well, it's the same as sending a local file or a URL!

In the following example, we'll be getting the buffer from a `memes.txt` file, and send it in the message channel.
You can use any buffer you want, and send it. Just make sure to overwrite the filename if it isn't an image!

```js
// Extract the required classes from the discord.js module
const { Client, MessageAttachment } = require('discord.js');

// Import the native fs module
const fs = require('fs');

// Create an instance of a Discord client
const client = new Client();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  // If the message is '!memes'
  if (message.content === '!memes') {
    // Get the buffer from the 'memes.txt', assuming that the file exists
    const buffer = fs.readFileSync('./memes.txt');

    /**
     * Create the attachment using MessageAttachment,
     * overwritting the default file name to 'memes.txt'
     * Read more about it over at
     * http://discord.js.org/#/docs/main/master/class/MessageAttachment
     */
    const attachment = new MessageAttachment(buffer, 'memes.txt');
    // Send the attachment in the message channel with a content
    message.channel.send(`${message.author}, here are your memes!`, attachment);
  }
});

// Log our bot in using the token from https://discord.com/developers/applications
client.login('your token here');
```

And of course, the results are:

![Attachment File example 3](/static/attachment-example3.png)
