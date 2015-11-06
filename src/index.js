module.exports = {
	Client : require("./Client/Client.js")
}

var a = new module.exports.Client();
a.on("debug", (m) => console.log("[debug]",m));
a.on("warn", (m) => console.log("[warn]", m));
var start = Date.now();
a.on("message", m => {
	if(m.content === "$$$"){
		a.internal.overwritePermissions(m.channel, m.author, {
			manageRoles : true
		}).catch(error).then(()=>console.log("hihihihihi!"));
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