/*
    credits to izy521 for the colour list
    https://github.com/izy521/discord.io/blob/master/docs/colors.md
*/
module.exports = {
	DEFAULT: 0,
    AQUA: 1752220,
    GREEN: 3066993,
    BLUE: 3447003,
    PURPLE: 10181046,
    GOLD: 15844367,
    ORANGE: 15105570,
    RED: 15158332,
    GREY: 9807270,
    DARKER_GREY: 8359053,
    NAVY: 3426654,
    DARK_AQUA: 1146986,
    DARK_GREEN: 2067276,
    DARK_BLUE: 2123412,
    DARK_PURPLE: 7419530,
    DARK_GOLD: 12745742,
    DARK_ORANGE: 11027200,
    DARK_RED: 10038562,
    DARK_GREY: 9936031,
    LIGHT_GREY: 12370112,
    DARK_NAVY: 2899536
}

exports.toDec = function(data){
    var hextest = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/;
    
    var num;
    
    if(hextest.test(data)){
        // it's a hex number with a # in front
        num = data.substr(1).toString(10);
    }else if(hextest.test("#" + data)){
        // it's a hex number with no # in front
        num = data.toString(10);
    }else{
        num = data.toString(10);
    }
    return num;
}

exports.toHex = function(data){
    
    return "#" + data.toString(16);
    
}