const request = require('snekfetch');
const BaseClient = require('../BaseClient');
const transports = require('./transports');
const Snowflake = require('../util/Snowflake');
const OAuth2Application = require('../structures/OAuth2Application');
const User = require('../structures/User');
const Guild = require('../structures/Guild');
const { RPCCommands, RPCEvents } = require('../util/Constants');
const Collection = require('../util/Collection');

/**
 * @typedef {RPCClientOptions}
 * @extends {ClientOptions}
 * @prop {string} transport RPC transport. one of `ipc` or `websocket`
 */

/**
 * The main hub for interacting with Discord RPC
 * @extends {BaseClient}
 */
class RPCClient extends BaseClient {
  /**
   * @param {RPCClientOptions} [options] Options for the client
   * You must provide a transport
   */
  constructor(options = {}) {
    super(Object.assign({ _tokenType: 'Bearer' }, options));
    this.accessToken = null;
    this.clientID = null;

    this.application = null;
    this.user = null;

    this.transport = new transports[options.transport](this);
    this.transport.on('message', this._onMessage.bind(this));
    this._expecting = new Map();
    this.subscriptions = [];
  }

  /**
   * @typedef {RPCLoginOptions}
   * @param {string} [clientSecret] Client secret
   * @param {string} [accessToken] Access token
   * @param {string} [rpcToken] RPC token
   * @param {string} [tokenEndpoint] Token endpoint
   */

  /**
   * Log in
   * @param {string} clientID Client ID
   * @param {RPCLoginOptions} options Options for authentication. You must provide at least one of the props to log in.
   * @example client.login('1234567', { clientSecret: 'abcdef123' });
   * @returns {Promise<RPCClient>}
   */
  login(clientID, options) {
    return new Promise((resolve, reject) => {
      this.clientID = clientID;
      this.options._login = options;
      const timeout = setTimeout(() => reject(new Error('connection timeout')), 10e3);
      this.once('connected', () => {
        clearTimeout(timeout);
        resolve(this);
        if (options.accessToken) this.authenticate(options.accessToken);
      });
      this.transport.connect({ client_id: this.clientID });
    }).then(() => {
      if (options.accessToken) return this.authenticate(options.accessToken);
      return this.authorize(options);
    });
  }

  /**
   * Request
   * @param {string} cmd Command
   * @param {Object} [args={}] Arguments
   * @param {string} [evt] Event
   * @returns {Promise}
   * @private
   */
  request(cmd, args = {}, evt) {
    return new Promise((resolve, reject) => {
      const nonce = Snowflake.generate();
      this.transport.send({
        cmd, args, evt, nonce,
      });
      this._expecting.set(nonce, { resolve, reject });
    });
  }

  /**
   * Message handler
   * @param {Object} message message
   * @private
   */
  _onMessage(message) {
    if (message.cmd === RPCCommands.DISPATCH && message.evt === RPCEvents.READY) {
      this.emit('connected');
    } else if (this._expecting.has(message.nonce)) {
      const { resolve, reject } = this._expecting.get(message.nonce);
      if (message.evt === 'ERROR') reject(new Error(message.data.message));
      else resolve(message.data);
      this._expecting.delete(message.nonce);
    }
  }

  /**
   * Authorize
   * @param {Object} options options
   * @returns {Promise}
   * @private
   */
  async authorize({ rpcToken, scopes, clientSecret, tokenEndpoint }) {
    if (tokenEndpoint) rpcToken = await request.get(tokenEndpoint).then(r => r.body.rpc_token);
    const { code } = await this.request('AUTHORIZE', {
      client_id: this.clientID,
      scopes,
      rpc_token: rpcToken,
    });
    if (tokenEndpoint) {
      return request.post(tokenEndpoint)
        .send({ code })
        .then(r => this.authenticate(r.body.access_token));
    } else if (clientSecret) {
      return this.api.oauth2.token.post({
        query: {
          client_id: this.clientID,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
        },
        auth: false,
      }).then(({ access_token }) => this.authenticate(access_token));
    }
    return { code };
  }

  /**
   * Authenticate
   * @param {string} accessToken access token
   * @returns {Promise}
   * @private
   */
  authenticate(accessToken) {
    this.accessToken = accessToken;
    return this.request('AUTHENTICATE', { access_token: accessToken })
      .then(({ application, user }) => {
        this.application = new OAuth2Application(this, application);
        this.user = new User(this, user);
        this.emit('ready');
        return this;
      });
  }


  /**
   * Fetch a guild
   * @param {Snowflake} id Guild ID
   * @param {number} [timeout] Timeout request
   * @returns {Promise<Guild>}
   */
  getGuild(id, timeout) {
    return this.request(RPCCommands.GET_GUILD, { guild_id: id, timeout })
      .then(({ guild }) => new Guild(this, guild));
  }

  /**
   * Fetch all guilds
   * @param {number} [timeout] Timeout request
   * @returns {Promise<Collection<Snowflake, Guild>>}
   */
  getGuilds(timeout) {
    return this.request(RPCCommands.GET_GUILDS, { timeout })
      .then(({ guilds }) => {
        const c = new Collection();
        for (const guild of guilds) c.set(guild.id, new Guild(this, guild));
        return c;
      });
  }

  /**
   * Get a channel
   * @param {Snowflake} id Channel id
   * @param {number} [timeout] Timeout request
   * @returns {Promise<Channel>}
   */
  getChannel(id, timeout) {
    return this.request(RPCCommands.GET_CHANNEL, { channel_id: id, timeout })
      // This will be changed to make a channel after the category pr get merged
      .then(({ channel }) => channel);
  }

  /**
   * Get all channels
   * @param {number} [timeout] Timeout request
   * @returns {Promise<Collection<Snowflake, Channel>>}
   */
  getChannels(timeout) {
    return this.request(RPCCommands.GET_CHANNELS, { timeout })
      .then(({ channels }) => {
        const c = new Collection();
        // This will be changed to make channels after the category pr get merged
        for (const channel of channels) c.set(channel.id, channel);
        return c;
      });
  }

  setUserVoiceSettings(args) {
    return this.request(RPCCommands.SET_USER_VOICE_SETTINGS, args);
  }

  selectVoiceChannel(id, { timeout, force = false } = {}) {
    return this.request(RPCCommands.SELECT_VOICE_CHANNEL, { channel_id: id, timeout, force });
  }

  selectTextChannel(id, { timeout, force = false } = {}) {
    return this.request(RPCCommands.SELECT_TEXT_CHANNEL, { channel_id: id, timeout, force });
  }

  getVoiceSettings() {
    return this.request(RPCCommands.GET_VOICE_SETTINGS);
  }

  setVoiceSettings(args) {
    return this.request(RPCCommands.SET_VOICE_SETTINGS, args);
  }

  subscribe(event, args, callback) {
    return this.request(RPCCommands.SUBSCRIBE, args, event).then(() => {
      this.subscriptions.push({ event, args, callback });
      return { unsubscribe: () => this.unsubscribe(event, args) };
    });
  }

  unsubscribe(event, args) {
    return this.request(RPCCommands.UNSUBSCRIBE, args, event);
  }
}

module.exports = RPCClient;
