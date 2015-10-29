"use strict";

var ImageEmbed = require("./ImageEmbed.js"),
    VideoEmbed = require("./VideoEmbed.js"),
    LinkEmbed = require("./LinkEmbed.js");

exports.createEmbed = function (data) {
	switch (data.type) {
		case "image":
			return new ImageEmbed(data);
			break;
		case "video":
			return new VideoEmbed(data);
			break;
		case "link":
			return new LinkEmbed(data);
			break;
	}
};