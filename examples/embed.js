const Eris = require("eris");

var bot = new Eris("BOT_TOKEN");
// Replace BOT_TOKEN with your bot account's token

bot.on("ready", () => { // When the bot is ready
    console.log("Ready!"); // Log "Ready!"
});

bot.on("messageCreate", (msg) => { // When a message is created
    if(msg.content === "!embed") { // If the message content is "!embed"
        bot.createMessage(msg.channel.id, {
            embed: {
                title: "I'm an embed!", // Title of the embed
                description: "Here is some more info, with **awesome** formatting.\nPretty *neat*, huh?",
                author: { // Author property
                    name: msg.author.username,
                    icon_url: msg.author.avatarURL
                },
                color: 0x008000, // Color, either in hex (show), or a base-10 integer
                fields: [ // Array of field objects
                    {
                        name: "Some extra info.", // Field title
                        value: "Some extra value.", // Field
                        inline: true // Whether you want multiple fields in same line
                    },
                    {
                        name: "Some more extra info.",
                        value: "Another extra value.",
                        inline: true
                    }
                ],
                footer: { // Footer text
                    text: "Created with Eris."
                }
            }
        });
    }
});

bot.connect(); // Get the bot to connect to Discord
