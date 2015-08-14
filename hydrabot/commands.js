var Authority = require("./authority.js");

Commands = [];

Commands["info"] = {
    oplevel : 0,
    fn : function(bot, params, message){

        bot.reply(message, "Info!");

    }
}

exports.Commands = Commands;
