# Moderation

In here, you'll see some basic examples for kicking and banning a member.

## Kicking a member

Let's say you have a member that you'd like to kick. Here is an example of how you *can* do it.

```js
// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

// Add here your user ID
const adminID = "your user ID";

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  // Ignore messages that aren't from a guild
  if (!message.guild) return;

  // If the message content starts with "!kick" and the message author ID is your user ID
  if (message.content.startsWith('!kick') && message.author.id === adminID) {
    // Assuming we mention someone in the message, this will return the member
    // Read more about mentions over at https://discord.js.org/#/docs/main/master/class/MessageMentions
    const member = message.mentions.members.first();
    // If we have a member mentioned
    if (member) {
        /**
         * Kick the member
         * Make sure you run this on a member, not a user!
         * There are big differences between a user and a member
         */
        member.kick('Optional reason that will display in the audit logs').then(() => {
          // We let the message author know we were able to kick the person
          message.reply(`Successfully kicked ${member.user.tag}`);
        }).catch(err => {
          // An error happened
          // This is generally due to the bot not being able to kick the member,
          // either due to missing permissions or role hierarchy
          message.reply('I was unable to kick the member');
          // Log the error
          console.error(err);
        });
    // Otherwise, if no user was mentioned
    } else {
      message.reply('You didn\'t mention the user to kick!');
    }
  }
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login('your token here');
```

And the result is:

![Image showing the result](/static/kick-example.png)

## Banning a member

Banning works the same way as kicking, but it has slightly more options that can be changed.

```js
// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

// Add here your user ID
const adminID = "your user ID";

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  // Ignore messages that aren't from a guild
  if (!message.guild) return;

  // If the message content starts with "!ban" and the message author ID is your user ID
  if (message.content.startsWith('!ban') && message.author.id === adminID) {
    // Assuming we mention someone in the message, this will return the member
    // Read more about mentions over at https://discord.js.org/#/docs/main/master/class/MessageMentions
    const member = message.mentions.members.first();
    // If we have a member mentioned
    if (member) {
        /**
         * Ban the member
         * Make sure you run this on a member, not a user!
         * There are big differences between a user and a member
         */
        member.ban({
          reason: 'They were bad'
          }).then(() => {
          // We let the message author know we were able to kick the person
          message.reply(`Successfully banned ${member.user.tag}`);
        }).catch(err => {
          // An error happened
          // This is generally due to the bot not being able to ban the member,
          // either due to missing permissions or role hierarchy
          message.reply('I was unable to ban the member');
          // Log the error
          console.error(err);
        });
    // Otherwise, if no user was mentioned
    } else {
      message.reply('You didn\'t mention the user to ban!');
    }
  }
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login('your token here');
```

And the result is:

![Image showing the result](/static/ban-example.png)
