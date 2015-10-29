var Embed = require("./Embed.js");

class VideoEmbed extends Embed{
	constructor(data){
		super(data);
		this.video = data.video;
		//width
		//height
		//url
	}
}

module.exports = VideoEmbed;