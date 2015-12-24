/*
    credits to izy521 for the colour list
    https://github.com/izy521/discord.io/blob/master/docs/colors.md
*/
exports.DEFAULT = 0;
exports.AQUA = 1752220;
exports.GREEN= 3066993;
exports.BLUE= 3447003;
exports.PURPLE= 10181046;
exports.GOLD= 15844367;
exports.ORANGE= 15105570;
exports.RED= 15158332;
exports.GREY= 9807270;
exports.DARKER_GREY= 8359053;
exports.NAVY= 3426654;
exports.DARK_AQUA= 1146986;
exports.DARK_GREEN= 2067276;
exports.DARK_BLUE= 2123412;
exports.DARK_PURPLE= 7419530;
exports.DARK_GOLD= 12745742;
exports.DARK_ORANGE= 11027200;
exports.DARK_RED= 10038562;
exports.DARK_GREY= 9936031;
exports.LIGHT_GREY= 12370112;
exports.DARK_NAVY= 2899536;

exports.toDec = function (data) {
    var hextest = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;

    var num;

    if(!data)
        return 0;

    if (hextest.test(data)) {
        // it's a hex number with a # in front

        // there's a bug in discord as of 28/10/15, where any
        // hex colors beginning with a 0 do not render properly.
        // this is a temporary fix, and it does mean that you won't
        // get correct colors all the time, although it is barely noticeable.
        if(data.charAt(1) === "0"){
            var tdata = data.split("");
            tdata[1] = 1;
            data = tdata.join("");
        }

        num = parseInt(data.substr(1), 16).toString(10);
    } else if (hextest.test("#" + data)) {
        // it's a hex number with no # in front
        if(data.charAt(0) === "0"){
            var tdata = data.split("");
            tdata[0] = 1;
            data = tdata.join("");
        }
        num = parseInt(data, 16);
    } else {
        num = data.toString(10);
    }

    return parseInt(num);
}

exports.toHex = function (data) {

    var text = data.toString(16);

    while(text.length < 6){
        text = "0" + text;
    }

    return "#" + text;

}