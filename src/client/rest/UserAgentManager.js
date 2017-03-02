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

  get _current() {
    return {
      url: this._override.url || this._default.url,
      version: this._override.version || this._default.version,
    };
  }

  get userAgent() {
    return `DiscordBot (${this._current.url}, ${this._current.version}) Node.js/${process.version}`;
  }
}

module.exports = UserAgentManager;
