module.exports = {
	Client : require("./Client/Client.js")
}

var a = new module.exports.Client();
a.on("debug", (m) => console.log("[debug]",m));

a.on("message", m => {
	if(m.content === "$$$")
		a.getChannelLogs(m).then( logs => {
			for(var item of logs){
				console.log(item.author.username + "> " + item.content);
			}
		});
});

a.login(process.env["discordEmail"], process.env["discordPass"]).catch((e)=>console.log(e));