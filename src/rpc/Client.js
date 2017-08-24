const request = require('snekfetch');
const BaseClient = require('../BaseClient');
const transports = require('./transports');
const Snowflake = require('../util/Snowflake');
const ClientApplication = require('../structures/ClientApplication');
const User = require('../structures/User');
const Guild = require('../structures/Guild');
const Channel = require('../structures/Channel');
const { RPCCommands, RPCEvents } = require('../util/Constants');
const Collection = require('../util/Collection');
const Constants = require('../util/Constants');
const Util = require('../util/Util');
const { Error } = require('../errors');

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

    /**
     * Application used in this client
     * @type {?ClientApplication}
     */
    this.application = null;

    /**
     * User used in this application
     * @type {?User}
     */
    this.user = null;

    const Transport = transports[options.transport];
    if (!Transport || (this.browser && options.transport === 'ipc')) {
      throw new Error('RPC_INVALID_TRANSPORT', options.transport);
    }

    /**
     * Raw transport userd
     * @type {RPCTransport}
     */
    this.transport = new Transport(this);
    this.transport.on('message', this._onRpcMessage.bind(this));

    /**
     * Map of nonces being expected from the transport
     * @type {Map}
     * @private
     */
    this._expecting = new Map();

    /**
     * Map of current subscriptions
     * @type {Map}
     * @private
     */
    this._subscriptions = new Map();

    /**
     * Polyfill data manager
     * @type {Object}
     * @private
     */
    this.dataManager = {
      newUser: data => new User(this, data),
      newChannel: (data, guild) => Channel.create(this, data, guild),
    };
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
      });
      this.transport.connect({ client_id: this.clientID });
    }).then(() => {
      if (!this.clientID) return true;
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
  request(cmd, args, evt) {
    return new Promise((resolve, reject) => {
      const nonce = Snowflake.generate();
      this.transport.send({ cmd, args, evt, nonce });
      this._expecting.set(nonce, { resolve, reject });
    });
  }

  /**
   * Message handler
   * @param {Object} message message
   * @private
   */
  _onRpcMessage(message) {
    if (message.cmd === RPCCommands.DISPATCH && message.evt === RPCEvents.READY) {
      this.emit('connected');
    } else if (this._expecting.has(message.nonce)) {
      const { resolve, reject } = this._expecting.get(message.nonce);
      if (message.evt === 'ERROR') reject(new Error(message.data.message));
      else resolve(message.data);
      this._expecting.delete(message.nonce);
    } else {
      const subid = subKey(message.evt, message.args);
      if (this._subscriptions.has(subid)) this._subscriptions.get(subid)(message.data);
    }
  }

  /**
   * Authorize
   * @param {Object} options options
   * @returns {Promise}
   * @private
   */
  async authorize({ rpcToken, scopes, clientSecret, tokenEndpoint }) {
    if (tokenEndpoint && !rpcToken) {
      rpcToken = await request.get(tokenEndpoint).then(r => r.body.rpc_token);
    } else if (clientSecret && rpcToken === true) {
      rpcToken = await this.api.oauth2.token.rpc.post({
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: {
          client_id: this.clientID,
          client_secret: clientSecret,
        },
      });
    }
    return this.request('AUTHORIZE', {
      client_id: this.clientID,
      scopes,
      rpc_token: rpcToken,
    }).then(({ code }) => {
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
    });
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
        this.application = new ClientApplication(this, application);
        this.user = this.dataManager.newUser(user);
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
      .then(guild => new Guild(this, guild));
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
      .then(channel => {
        if (channel.guild_id) {
          return this.getGuild(channel.guild_id).then(g => this.dataManager.newChannel(channel, g));
        }
        return Channel.create(this, channel);
      });
  }

  /**
   * Get all channels
   * @param {number} [timeout] Timeout request
   * @returns {Promise<Collection<Snowflake, Channel>>}
   */
  getChannels(timeout) {
    return this.request(RPCCommands.GET_CHANNELS, { timeout })
      .then(async({ channels }) => {
        const guilds = new Collection();
        const c = new Collection();
        for (const channel of channels) {
          const guild_id = channel.guild_id;
          // eslint-disable-next-line no-await-in-loop
          if (guild_id && !guilds.has(guild_id)) guilds.set(guild_id, await this.getGuild(guild_id));
          c.set(channel.id, this.dataManager.newChannel(channel, guilds.get(channel.guild_id)));
        }
        return c;
      });
  }

  /**
   * @typedef {UserVoiceSettings}
   * @prop {Snowflake} id ID of the user these settings apply to
   * @prop {?Object} [pan] Pan settings, an object with `left` and `right` set between 0.0 and 1.0, inclusive
   * @prop {?number} [volume=100] The volume
   * @prop {bool} [mute] If the user is muted
   */

  /**
   * Set the voice settings for a uer, by id
   * @param {Snowflake} id ID of the user to set
   * @param {UserVoiceSettings} settings Settings
   * @returns {Promise}
   */
  setUserVoiceSettings(id, settings) {
    return this.request(RPCCommands.SET_USER_VOICE_SETTINGS, {
      user_id: id,
      pan: settings.pan,
      mute: settings.mute,
      volume: settings.volume,
    });
  }

  /**
   * Move the user to a voice channel
   * @param {Snowflake} id ID of the voice channel
   * @param {Object} [options] Options
   * @param {number} [options.timeout] Timeout for the command
   * @param {boolean} [options.force] Force the move, should only be done if you have explicit permission from the user.
   * @returns {Promise}
   */
  selectVoiceChannel(id, { timeout, force = false } = {}) {
    return this.request(RPCCommands.SELECT_VOICE_CHANNEL, { channel_id: id, timeout, force });
  }

  /**
   * Move the user to a text channel
   * @param {Snowflake} id ID of the voice channel
   * @param {Object} [options] Options
   * @param {number} [options.timeout] Timeout for the command
   * @param {boolean} [options.force] Force the move, should only be done if you have explicit permission from the user.
   * @returns {Promise}
   */
  selectTextChannel(id, { timeout, force = false } = {}) {
    return this.request(RPCCommands.SELECT_TEXT_CHANNEL, { channel_id: id, timeout, force });
  }

  /**
   * Get current voice settings
   * @returns {Promise}
   */
  getVoiceSettings() {
    return this.request(RPCCommands.GET_VOICE_SETTINGS)
      .then(s => ({
        automaticGainControl: s.automatic_gain_control,
        echoCancellation: s.echo_cancellation,
        noiseSuppression: s.noise_suppression,
        qos: s.qos,
        silenceWarning: s.silence_warning,
        deaf: s.deaf,
        mute: s.mute,
        input: {
          availableDevices: s.input.available_devices,
          device: s.input.device_id,
          volume: s.input.volume,
        },
        output: {
          availableDevices: s.output.available_devices,
          device: s.output.device_id,
          volume: s.output.volume,
        },
        mode: {
          type: s.mode.type,
          autoThreshold: s.mode.auto_threshold,
          threshold: s.mode.threshold,
          shortcut: s.mode.shortcut.map(sc => ({
            name: sc.name, code: sc.code,
            type: Object.keys(Constants.KeyTypes)[sc.type],
          })),
          delay: s.mode.delay,
        },
      }));
  }

  /**
   * Set current voice settings, overriding the current settings until this session disconnects. Also locks the settings
   * for any other rpc sessions which may be connected
   * @param {Object} args Settings
   * @returns {Promise}
   */
  setVoiceSettings(args) {
    return this.request(RPCCommands.SET_VOICE_SETTINGS, {
      automatic_gain_control: args.automaticGainControl,
      echo_cancellation: args.echoCancellation,
      noise_suppression: args.noiseSuppression,
      qos: args.qos,
      silence_warning: args.silenceWarning,
      deaf: args.deaf,
      mute: args.mute,
      input: args.input ? {
        device_id: args.input.device,
        volume: args.input.volume,
      } : undefined,
      output: args.output ? {
        device_id: args.output.device,
        volume: args.output.volume,
      } : undefined,
      mode: args.mode ? {
        mode: args.mode.type,
        auto_threshold: args.mode.autoThreshold,
        threshold: args.mode.threshold,
        shortcut: args.mode.shortcut.map(sc => ({
          name: sc.name, code: sc.code,
          type: Constants.KeyTypes[sc.type.toUpperCase()],
        })),
        delay: args.mode.delay,
      } : undefined,
    });
  }

  /**
   * Capture a shortcut using the client
   * The callback takes (key, stop) where `stop` is a function that will stop capturing.
   * This `stop` function must be called before disconnecting or else the user will have
   * to restart their client.
   * @param {Function} callback Callback handling keys
   * @returns {Promise<Function>}
   */
  captureShortcut(callback) {
    const subid = subKey(RPCEvents.CAPTURE_SHORTCUT_CHANGE);
    const stop = () => {
      this._subscriptions.delete(subid);
      return this.request(RPCCommands.CAPTURE_SHORTCUT, { action: 'STOP' });
    };
    this._subscriptions.set(subid, ({ shortcut }) => {
      const keys = shortcut.map(sc => ({
        name: sc.name, code: sc.code,
        type: Object.keys(Constants.KeyTypes)[sc.type],
      }));
      callback(keys, stop);
    });
    return this.request(RPCCommands.CAPTURE_SHORTCUT, { action: 'START' })
      .then(() => stop);
  }


  // Purposely undocumented, in private beta
  setActivity(args) {
    return this.request(RPCCommands.SET_ACTIVITY, Util.snakeCaseObject(args));
  }

  // Purposely undocumented, only available for browser @ *.discordapp.com origin
  deepLink(args) {
    return this.request(RPCCommands.DEEP_LINK, args);
  }

  // Purposely undocumented, only available for browser @ *.discordapp.com origin
  invite(code) {
    return this.request(RPCCommands.INVITE_BROWSER, { code });
  }

  /**
   * Subscribe to an event
   * @param {string} event Name of event e.g. `MESSAGE_CREATE`
   * @param {Object} [args] Args for event e.g. `{ channel_id: '1234' }`
   * @param {Function} callback Callback when an event for the subscription is triggered
   * @returns {Promise<Object>}
   */
  subscribe(event, args, callback) {
    if (!callback && typeof args === 'function') {
      callback = args;
      args = undefined;
    }
    return this.request(RPCCommands.SUBSCRIBE, args, event).then(() => {
      const subid = subKey(event, args);
      this._subscriptions.set(subid, callback);
      return {
        unsubscribe: () => this.request(RPCCommands.UNSUBSCRIBE, args, event)
          .then(() => this._subscriptions.delete(subid)),
      };
    });
  }

  /**
   * Destroy the client
   */
  destroy() {
    super.destroy();
    this.transport.close();
  }
}

function subKey(event, args) {
  return `${event}${JSON.stringify(args)}`;
}

module.exports = RPCClient;
