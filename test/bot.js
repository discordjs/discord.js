/*

*/

var Discord = require("../");
var mybot = new Discord.Client();

mybot.login("email", "password").then(success).catch(error);

function success(){
	console.log("login successful");
	process.exit(0);
}

function error(){
	console.log("login error, but the API works");
	process.exit(0);
}