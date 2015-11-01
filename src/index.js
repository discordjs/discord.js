module.exports = {
	Client : require("./Client/Client.js")
}

var a = new module.exports.Client();
a.on("debug", (m) => console.log("[debug]",m));

a.on("message", m => {
});

a.login(process.env["discordEmail"], process.env["discordPass"]).catch((e)=>console.log(e));