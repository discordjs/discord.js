const Constants = require('../../util/Constants');

class UserAgentManager {
  constructor() {
    this._default = {
      url: Constants.Package.homepage.split('#')[0],
      version: Constants.Package.version,
    };
    this._override = {};
  }

  set({ url, version } = {}) {
    this._override.url = url;
    this._override.version = version;
  }

  get userAgent() {
    const url = this._override.url || this._default.url;
    const version = this._override.version || this._default.version;
    return `DiscordBot (${url}, ${version}) Node.js/${process.version}`;
  }
}

module.exports = UserAgentManager;
