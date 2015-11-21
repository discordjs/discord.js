/* global process */

var Discord = require("../../");
var bot = new Discord.Client();
var auth = require("../auth.json");
var request = require("superagent");

var loose = false;

bot.on("message", msg => {

	if (~msg.content.indexOf("https://discord.gg/")) {
		bot.joinServer(msg.content.substr(msg.content.indexOf("https://discord.gg/"), "https://discord.gg/".length + 16));
	}

	if (!msg.content.startsWith("$")) return;

	msg.content = msg.content.substr(1);

	if (msg.content === "stats") {
		msg.reply([
			"I am connected/have access to:",
			`${bot.servers.length} servers`,
			`${bot.channels.length} channels`,
			`${bot.users.length} users`,
		].join("\n"));
	}

	if (msg.content.startsWith("startplaying")) {
		var game = msg.content.split(" ").slice(1).join(" ");
		bot.setPlayingGame(game);
	}

	if (msg.content.startsWith("setname") && loose) {
		bot.setUsername(msg.content.split(" ").slice(1).join(" ")).then(() => {
			msg.reply("done!");
		});
	}
	
	if (msg.content === "updateav") {
		request
		.get("https://api.github.com/search/repositories?q=discord.js")
		.end((err, res) => {
			if (err) {
				return;
			}
			
			var text = res.body.items[0].stargazers_count
			
			bot.updateDetails({
				username : "d.js star bot - " + text,
				avatar: getStars(text)
			}).then(() => {
				msg.reply("success!");
			});
		});
	}

	if (msg.content.startsWith("setavatar") && loose) {
		request
			.get(msg.content.split(" ")[1])
			.end((err, res) => {
				bot.updateDetails({
					avatar: getStars(text)
				}).then(() => {

					msg.reply("done!");

				});
			});
	}

	if (msg.content === "away") {
		bot.setStatusIdle();
	}

	if (msg.content === "here") {
		bot.setStatusOnline();
	}

	if (msg.content === "randomUser") {
		var random = bot.users.random();
		msg.reply([
			random.username,
			"avatar: ", random.avatarURL
		].join("\n"));
	}

	if (msg.content.startsWith("mimic") && loose) {
		var toMimic = msg.mentions[0];

		if (!toMimic) {
			return;
		}

		if (!toMimic.avatar) {
			bot.updateDetails({
				username: toMimic.username,
				avatar: null
			});
			return;
		}

		request
			.get(toMimic.avatarURL)
			.end((err, res) => {
				bot.updateDetails({
					username: toMimic.username,
					avatar: res.body
				}).then(() => {

					msg.reply("done!");

				});
			});
	}


});

setInterval(() => {

	request
		.get("https://api.github.com/search/repositories?q=discord.js")
		.end((err, res) => {
			if (err) {
				return;
			}
			
			var text = res.body.items[0].stargazers_count
			
			bot.updateDetails({
				username : "d.js star bot - " + text,
				avatar: getStars(text)
			}).then(() => {
				console.log("many successes");
			});
		});

}, 60000);

bot.on("disconnected", () => {
	console.log("Disconnected, exiting!");
	process.exit();
})

bot.login(auth.email, auth.password);

function getStars(text) {
	var Canvas = require('canvas')
		, Image = Canvas.Image
		, canvas = new Canvas(90, 90)
		, ctx = canvas.getContext('2d');

	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, 90, 90);
		
	ctx.font = '45px Arial';
	ctx.fillStyle = "white";
	ctx.fillText(text, (ctx.measureText(text).width / 2) - 5, 60);

	ctx.strokeStyle = 'rgb(255,255,255)';

	return canvas.toDataURL();
}