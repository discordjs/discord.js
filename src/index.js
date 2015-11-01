module.exports = {
	Client : require("./Client/Client.js")
}

var a = new module.exports.Client();
a.on("debug", (m) => console.log("[debug]",m));
a.on("warn", (m) => console.log("[warn]", m));

a.on("message", m => {
	if(m.content === "$$$")
		a.internal.createServer("H a h").then(srv => {
			console.log(srv);
			a.reply(m, srv);
		});
});
a.on("channelUpdated", (o, n) => {
	a.sendMessage(o, o.name + " v " + n.name);
});

a.login(process.env["discordEmail"], process.env["discordPass"]).catch((e)=>console.log(e));