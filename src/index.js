module.exports = {
	Client : require("./Client/Client.js")
}

var a = new module.exports.Client();
a.on("debug", (m) => console.log("[debug]",m));

a.on("message", m => {
	if(m.content === "$$$")
		a.reply(m, "hi man!")
			.then( m => {
				a.updateMessage(m, "!!!").then( m => {
					a.updateMessage(m, "the old content was " + m.content);	
				});
			});
});

a.login(process.env["discordEmail"], process.env["discordPass"]).catch((e)=>console.log(e));