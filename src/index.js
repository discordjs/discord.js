module.exports = {
	Client : require("./Client/Client.js")
}

var a = new module.exports.Client();
a.on("debug", (m) => console.log("[debug]",m));
a.on("warn", (m) => console.log("[warn]", m));

a.on("message", m => {
	if(m.content === "$$$"){
		a.createRole(m.channel.server, {
			name : "a_role!",
			color : 0xFF0000,
			hoist : true,
			permissions : [
				"manageRoles"
			]
		}).then( role => {
			a.addMemberToRole(m.author, role).then(() => {
				a.reply(m, "added!");
			}).catch( e => {
			console.log(e.stack)
		});
		}).catch( e => {
			console.log(e.stack)
		});
	}
});
a.on("userTypingStart", (user, chan) => {
	console.log(user.username + " typing");
});
a.on("userTypingStop", (user, chan) => {
	console.log(user.username + " stopped typing");
});


a.login(process.env["discordEmail"], process.env["discordPass"]).catch((e)=>console.log(e));