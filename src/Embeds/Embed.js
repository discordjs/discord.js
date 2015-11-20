class Embed{
	constructor(data){
		this.url = data.url;
		this.type = data.type;
		this.title = data.title;
		this.thumbnail = data.thumbnail;
			//width
			//height
			//url
			//proxy_url
		this.provider = data.provider;
			//url
			//name
		this.description = data.description;
		this.author = data.author;
			//url
			//name
	}
}

module.exports = Embed;