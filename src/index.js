module.exports = {
	Client : require("./Client/Client.js")
}

var a = new module.exports.Client();
a.on("debug", (m) => console.log("[debug]",m));
a.on("warn", (m) => console.log("[warn]", m));

a.on("message", m => {
	if(m.content === "$$$")
		a.reply(m, "I have you cached as being " + m.author.status);
});
a.on("serverMemberRemoved", (r, s) => {
	console.log(r, s);
});

a.login(process.env["discordEmail"], process.env["discordPass"]).catch((e)=>console.log(e));