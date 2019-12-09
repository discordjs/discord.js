const { Client, Collection } = require("discord.js");
const db = require("quick.db");
const fetch = require("node-fetch");
const conf = require("./human 62.js");
const fs = require("fs");
const { config } = require("dotenv");
const bot = new Client({
  disableEveryone: true
});
bot.commands = new Collection();
bot.aliases = new Collection();
bot.categories = fs.readdirSync("./commands/");
module.exports = { bot: bot }
config({
    path: __dirname + "/.env"
});
["events"].forEach(handler => {
    require(`./handlers/${handler}`)(bot);
});
["server"].forEach(file => {
  require(`./${file}`)(bot)
});
bot.login(conf.token)

bot.on("ready", async () => {
  var guild = bot.guilds.get("618618433948352514");
  var rrstaff = guild.roles.find(r => r.id === "618619289150423041");
  var rmember = rrstaff.members
  var schannel = guild.channels.get("620284785260232714");
  console.log(`Login Sebagai ${bot.user.username} Di ${bot.guilds.size} Server, ${bot.guilds.map(z => `${z.id} | ${z.name}` )}`)
  console.log(`${rmember.map(user => `${user.user.tag}`).join(' ')}`)
  bot.user.setPresence({
    game: {
      name: "https://human62-web.glitch.me",
      type: "WATCHING"
    },
    status: "idle"
  });
  bot.fetchApplication('@me').then(y => {
    console.log(`Owner ID: ${y.owner.id} `)
  });
  console.log(`Human +62: ${guild.iconURL} `)
});

bot.on("message", async (msg) => {
  
  var rguild = bot.guilds.get("618618433948352514");
  var rrstaff = rguild.roles.find(r => r.id === "618619289150423041");
  var rmember = rrstaff.members
  module.exports = {
    rstaff: rmember
  }
  if (msg.author.bot) return;
  if (!msg.guild) return;
  let prefix = ".";
  if (!msg.content.startsWith(prefix)) return;
  if (!msg.member) msg.member = await msg.guild.fetchMember(msg);

  const args = msg.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
    
  if (cmd.length === 0) return;
    
  let command = bot.commands.get(cmd);
  if (!command) command = bot.commands.get(bot.aliases.get(cmd));

  if (command) 
    command.run(bot, msg, args);
});