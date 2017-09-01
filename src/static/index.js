const buildRoute = require('../client/rest/APIRouter');
const APIRequest = require('../client/rest/APIRequest');
const DiscordAPIError = require('../client/rest/DiscordAPIError');
const UserAgentManager = require('../client/rest/UserAgentManager');
const Constants = require('../util/Constants');
const User = require('../structures/User');

const InteropTextChannel = require('./TextChannel');

function Interop({ token }) {
  const client = {
    static: true,
    token, options: Constants.DefaultOptions,
    get api() {
      return buildRoute(restManager);
    },
    users: { create: data => new User(this, data) },
    channels: { create: data => {} },
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
    TextChannel: id => InteropTextChannel(client, id),
    Message: (channelID, id) => InteropTextChannel(client, id).Message(id),
  };
}

module.exports = Interop;
