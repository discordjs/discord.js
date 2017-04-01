const Eris = require("eris");
const FS = require("fs");

var bot = new Eris("BOT_TOKEN");
// Replace BOT_TOKEN with your bot account's token
var playCommand = "!play";

bot.on("ready", () => { // When the bot is ready
    console.log("Ready!"); // Log "Ready!"
});

bot.on("messageCreate", (msg) => { // When a message is created
    if(msg.content.startsWith(playCommand)) { // If the message content starts with "!play "
        if(msg.content.length <= playCommand.length + 1) { // Check if a filename was specified
            bot.createMessage(msg.channel.id, "Please specify a filename.");
            return;
        }
        if(!msg.channel.guild) { // Check if the message was sent in a guild
            bot.createMessage(msg.channel.id, "This command can only be run in a server.");
            return;
        }
        if(!msg.member.voiceState.channelID) { // Check if the user is in a voice channel
            bot.createMessage(msg.channel.id, "You are not in a voice channel.");
            return;
        }
        var filename = msg.content.substring(playCommand.length + 1); // Get the filename
        bot.joinVoiceChannel(msg.member.voiceState.channelID).catch((err) => { // Join the user's voice channel
            bot.createMessage(msg.channel.id, "Error joining voice channel: " + err.message); // Notify the user if there is an error
            console.log(err); // Log the error
        }).then((connection) => {
            if(connection.playing) { // Stop playing if the connection is playing something
                connection.stopPlaying();
            }
            connection.play(filename); // Play the file and notify the user
            bot.createMessage(msg.channel.id, `Now playing **${filename}**`);
            connection.once("end", () => {
                bot.createMessage(msg.channel.id, `Finished **${filename}**`); // Say when the file has finished playing
            });
        });
    }
});

bot.connect(); // Get the bot to connect to Discord
