/*
	An example of how you can send embeds
*/

// Extract the required classes from the discord.js module
const { Client, MessageEmbed } = require('discord.js');

// Create an instance of a Discord client
const client = new Client();

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  // If the message is "how to embed"
  if (message.content === 'how to embed') {
    // We can create embeds using the MessageEmbed constructor
    // Read more about all that you can do with the constructor in the docs
    const embed = new MessageEmbed()
      .setTitle(`A slick little embed`) // Set the author of the field
      .setColor('RANDOM') // Set the color of the embed
      .setDescription(`Hello, this is a slick embed!`); // Set the main content of the embed
    // Send the embed to the same channel as the message
    message.channel.send(embed);
    // Otherwise, if the message is "how to embed using objects"
  } else if (message.content === 'how to embed using objects') {
    // Send an embed to the same channel as the message, replying to the message author
    // All properties in the embed are optional, but at least one must be present to be able to send the message
    // See all the properties an embed can have @ https://discordapp.com/developers/docs/resources/channel#embed-object
    message.reply({
      embed: {
        // Sets the color, either in format "0xXXXXXX" or in number form
        color: 0xFF00FF,
        // The title of the embed
        title: `Did you know.. ~~some markdown~~ works here too!`,
        // The main description of the embed
        description: `Hey, we have markdown here too! **Just type it out!**`,
        // The URL, allows the title to be clickable,
        url: `https://discord.js.org/`,
        // Fields are arrays of objects
        fields: [
          {
            // The field title
            name: `Hey, this is a field title`,
            // The field content
            value: `Hey, this is a value! Valuable`,
            // If the field should be inline.
            // Depending on the size of the content the field has,
            // fields can be up to 3 inline, per line
            inline: false,
          },
        ],
      },
    });
  }
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(`your token here`);
