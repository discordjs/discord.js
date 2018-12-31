/**
 * Add a role to the user when the user joins the guild/server.
 */

 //Import Discord from node_modules
 const Discord = require("discord.js")

 //Create client instance
 const Client = new Discord.Client()

 /**
  * Vital, bot starts reacting to input from discord after this.
  */
 Client.on("ready", () => {
     console.log(`Logged In as:`)
     console.log(Client.user.username)
 })

 /**
  * This is REALLY vital to add the role on join
  */
 Client.on("guildMemberAdd", async (gMember) => {
     let role = gMember.guild.roles.find(r => r.name === "Role Name Here")
     gMember.addRole(role).then(gMember => {
         console.log(gMember.user.username + " now has role " + role.name)
     })
 })

 /**
  * Log into discord, their API, and start processing information ;)
  */
 Client.login("Bot Token Here")
