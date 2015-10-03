/*
	this file should be used for travis builds only
*/

var Discord = require("../");
var mybot = new Discord.Client();

var server, channel, message, sentMessage = false;

function init(){
	console.log("preparing...");
}

mybot.on("ready", function(){
	console.log("ready! beginning tests");
	success1();
});

function success1(){ //make server
	mybot.createServer("test-server", "london").then(success2).catch(error);
}

function success2(_server){ //make channel
	console.log("test 1 successful");
	server = _server;
	mybot.createChannel(server, "test-channel", "text").then(success3).catch(error);
}

function success3(_channel){ //send message
	console.log("test 2 successful");
	channel = _channel;
	mybot.sendMessage(channel, [mybot.user.avatarURL, "an", "array", "of", "messages"]).then(success4).catch(error);
}

function success4(_message){ //delete message
	console.log("test 3 successful");
	message = _message;
	mybot.deleteMessage(message).then(success5).catch(error);
}

function success5(){ //send ping
	console.log("test 4 successful");
	mybot.sendMessage(channel, "ping").then(function(msg){
		message = msg;
	}).catch(error);
	setTimeout(checkError, 30 * 1000);
}

function success7(){
	console.log("test 6 successful");
	mybot.deleteChannel(channel).then(success8).catch(error);
}

function success8(){
	console.log("test 7 successful");
	mybot.createInvite(server).then(success9).catch(error);
}

function success9(invite){
	console.log("test 8 successful");
	if(invite.code){
		success10();
	}else{
		error("reference error");
	}
}

function success10(){
	console.log("test 9 succesful");
	mybot.leaveServer(server).then(success11).catch(error);
}

function success11(){
	console.log("test 10 succesful");
	mybot.joinServer(process.env["ds_invite"]).then(success12).catch(error);
}

function success12(_server){
	console.log("test 11 successful");
	server = mybot.getServer("id", _server.id);
	if(server){
		success13();
	}else{
		error("reference error");
	}
}

function success13(){
	console.log("test 12 successful");
	mybot.sendFile(server, "./test/image.png").then(function(msg){
		mybot.deleteMessage(msg).then(success14).catch(error);
	}).catch(error);
}

function success14(msg){
	console.log("test 13 successful");
	mybot.leaveServer(server).then(success15).catch(error);
}

function success15(){
	console.log("test 14 successful");
	mybot.logout().then(done).catch(error);
}

function done(){
	console.log("All tests completed succesfully.");
	process.exit(0);
}

function checkError(){
	if(!sentMessage){
		error("failure receiving messages");
	}
}

function error(err){
	console.log("error", err);
	process.exit(1);
}

mybot.on("message", function(message){
	
	if(message.channel.equals(channel)){
		if(message.content === "ping"){
			console.log("test 5 successful");
			sentMessage = true;
			
			mybot.updateMessage(message, "pong").then(success7).catch(error);
		}
	}
	
});

mybot.login(process.env["ds_email"], process.env["ds_password"]).then(init).catch(error);