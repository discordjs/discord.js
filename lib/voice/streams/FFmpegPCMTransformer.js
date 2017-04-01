"use strict";

const FFmpegDuplex = require("./FFmpegDuplex");

module.exports = function(options) {
    options = options || {};
    if(!options.command) {
        throw new Error("Invalid converter command");
    }
    if(options.samplingRate === undefined) {
        options.samplingRate = 48000;
    }
    var inputArgs = [
        "-analyzeduration", "0",
        "-loglevel", "24"
    ].concat(options.inputArgs || [],
        "-i", options.input || "-",
        "-vn"
    );
    var outputArgs = [
        "-f", "s16le",
        "-ar", "" + options.samplingRate,
        "-ac", "2",
        "-"
    ];
    return FFmpegDuplex.spawn(options.command, inputArgs.concat(options.encoderArgs || [], outputArgs));
};
