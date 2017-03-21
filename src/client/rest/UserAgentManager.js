const Constants = require('../../util/Constants');

class UserAgentManager {
  constructor() {
    this._build(Object.assign({}, this.constructor.DEFAULT));
  }

  set({ url, version } = {}) {
    this._build({
      url: url || this.constructor.DFEAULT.url,
      version: version || this.constructor.DEFAULT.version,
    });
  }
  
  _build(ua) {
    this.userAgent = `DiscordBot (${ua.url}, ${ua.version}) Node.js/${process.version}`;
  }
}

UserAgentManager.DEFAULT = {
  url: Constants.Package.homepage.split('#')[0],
  version: Constants.Package.version,
};

module.exports = UserAgentManager;
