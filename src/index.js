module.exports = {
	Client : require("./Client/Client.js")
}

var a = new module.exports.Client();
a.on("debug", (m) => console.log("[debug]",m));
a.on("warn", (m) => console.log("[warn]", m));

a.on("message", m => {
	if(m.content === "$$$"){
		a.createInvite(m.channel).then(invite => a.reply(m, invite)).catch(e => console.log(e.stack));
	}
});
a.on("userTypingStart", (user, chan) => {
	console.log(user.username + " typing");
});
a.on("userTypingStop", (user, chan) => {
	console.log(user.username + " stopped typing");
});


a.login(process.env["discordEmail"], process.env["discordPass"]).catch((e)=>console.log(e));