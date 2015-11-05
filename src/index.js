module.exports = {
	Client : require("./Client/Client.js")
}

var a = new module.exports.Client();
a.on("debug", (m) => console.log("[debug]",m));
a.on("warn", (m) => console.log("[warn]", m));
var start = Date.now();
a.on("message", m => {
	console.log("msgmsgmsg");
	if(m.content === "$$$"){
		a.createServer("pongping", "london")
			.then( server => {
				a.createChannel(server, "pingpong", "text")
					.then( channel => {
						a.sendMessage(channel, "$$$")
							.then( msg => {
								a.leaveServer(msg.channel.server)
									.then(() => {
										console.log("!!! " + (Date.now() - start));
									});
							})
							.catch(error);
					})
					.catch(error);	
			})
			.catch(error)
	}
});
a.on("userTypingStart", (user, chan) => {
	console.log(user.username + " typing");
});
a.on("userTypingStop", (user, chan) => {
	console.log(user.username + " stopped typing");
});
a.on("ready", () => {
	for(var server of a.internal.servers){
		if(server.name === "craptown"){
			a.leaveServer(server);
		}
	}
});

function error(e){
	throw e;
	process.exit(0);
}


a.login(process.env["discordEmail"], process.env["discordPass"]).catch((e)=>console.log(e));