const buildRoute = require('../client/rest/APIRouter');
const APIRequest = require('../client/rest/APIRequest');
const DiscordAPIError = require('../client/rest/DiscordAPIError');
const UserAgentManager = require('../client/rest/UserAgentManager');
const Shared = require('../structures/Shared');
const Constants = require('../util/Constants');

function Interop({ token }) {
  const client = {
    interop: true,
    token, options: Constants.DefaultOptions,
    get api() {
      return buildRoute(restManager);
    },
  };
  const restManager = {
    client,
    userAgentManager: new UserAgentManager(),
    request(method, url, options = {}) {
      return new APIRequest(this, method, url, options).gen()
        .end((err, res) => {
          if (err) {
            if (err.status >= 400 && err.status < 500) throw new DiscordAPIError(res.request.path, res.body);
            else throw err;
          }
          return res.body;
        });
    },
  };
  return {
    TextChannel(id) {
      return {
        id, client,
        send(content, options) {
          if (content && typeof content === 'object') {
            options = content;
            content = null;
          }
          return Shared.sendMessage(this, Object.assign({ content }, options));
        },
      };
    },
  };
}

module.exports = Interop;
