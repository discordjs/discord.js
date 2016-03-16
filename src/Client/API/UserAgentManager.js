const Constants = require('../../util/Constants');

class UserAgentManager {
	constructor(clientAPI) {
		this.clientAPI = clientAPI;
		this._userAgent = {
			url: 'https://github.com/hydrabolt/discord.js',
			version: Constants.Package.version,
		};
	}

	set(info) {
		this._userAgent.url = info.url || 'https://github.com/hydrabolt/discord.js';
		this._userAgent.version = info.version || Constants.Package.version;
	}

	get full() {
		return `DiscordBot (${this._userAgent.url}, ${this._userAgent.version})`;
	}
}

module.exports = UserAgentManager;
