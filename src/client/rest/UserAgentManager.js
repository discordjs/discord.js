const Constants = require('../../util/Constants');

class UserAgentManager {
  constructor() {
    this._override = {};
  }

  set({ url, version } = {}) {
    this._override.url = url;
    this._override.version = version;
  }

  get userAgent() {
    const default = this.constructor.DEFAULT;
    const url = this._override.url || default.url;
    const version = this._override.version || default.version;
    return `DiscordBot (${url}, ${version}) Node.js/${process.version}`;
  }
}

UserAgentManager.DEFAULT = {
  url: Constants.Package.homepage.split('#')[0],
  version: Constants.Package.version,
};

module.exports = UserAgentManager;
