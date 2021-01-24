'use strict';

const APIRequest = require('./APIRequest');
const routeBuilder = require('./APIRouter');
const RequestHandler = require('./RequestHandler');
const { Error } = require('../errors');
const Collection = require('../util/Collection');
const { Endpoints } = require('../util/Constants');

/**
 * Manages REST requests to the Discord API
 */
class RESTManager {
  /**
   *
   * @param {Client} client The Discord client
   * @param {?string} [tokenPrefix='Bot'] The token prefix for the Authorization header
   * @param {?string} [token=client.token] The token to perform requests with
   */
  constructor(client, tokenPrefix = 'Bot', token = client.token) {
    /**
     * The client whose configuration & utilities to use
     * @type {Client}
     * @readonly
     * @private
     */
    this.client = client;

    /**
     * The token used to perform requests
     * @type {string}
     * @readonly
     * @private
     */
    Object.defineProperty(this, 'token', { value: token, writable: true });

    /**
     * All current Requesthandlers
     * @type {Collection<string, RequestHandler>}
     * @readonly
     * @private
     */
    this.handlers = new Collection();

    /**
     * The token prefix for the Authorization header
     * @type {string}
     * @private
     * @readonly
     */
    this.tokenPrefix = tokenPrefix;

    /**
     * Whether or not to include the API version in requests
     * @type {boolean}
     * @private
     * @readonly
     */
    this.versioned = true;

    /**
     * The current global timeout, if any.
     * @type {Promise<void>|null}
     * @private
     */
    this.globalTimeout = null;

    if (client.options.restSweepInterval > 0) {
      client.setInterval(() => {
        this.handlers.sweep(handler => handler._inactive);
      }, client.options.restSweepInterval * 1000);
    }
  }

  /**
   * Returns the route builder for crafting and eventually performing API requests.
   * @example
   * const manager = new RESTManager(client, 'Bearer', 'the bearer token');
   * manager.api.users('@me').get().then(console.log);
   * @example
   * // returns an array of the authorized user's guilds
   * manager.api.users('@me').guilds.get().then(console.log);
   * @type {Object}
   */
  get api() {
    return routeBuilder(this);
  }

  /**
   * Creates the Authorization header value
   * @returns {string}
   */
  getAuth() {
    if (this.token) return `${this.tokenPrefix} ${this.token}`;
    throw new Error('TOKEN_MISSING');
  }

  /**
   * Returns various functions for creating CDN links
   * @type {Object}
   */
  get cdn() {
    return Endpoints.CDN(this.client.options.http.cdn);
  }

  /**
   * Options for performing a REST request
   * @typedef RequestOptions
   * @type {Object}
   * @property {URLSearchParams|object} [query] The querystring for this request
   * @property {boolean} [versioned] Whether or not to include the API version in request url
   * @property {boolean} [auth] Whether or not this request requires authorization
   * @property {string} [reason] The value for the X-Audit-Log-Reason header the guild audit log
   * @property {Object} [headers] The headers for the request. Content-Type and Authorization are handled internally
   * @property {Object} [data] The request body
   */

  /**
   * Performs a request
   * @param {string} method The HTTP method to perform
   * @param {string} url The url to request
   * @param {?RequestOptions} options The options for the request
   * @returns {Collection<string, *> | Buffer}
   */
  request(method, url, options = {}) {
    const apiRequest = new APIRequest(this, method, url, options);
    let handler = this.handlers.get(apiRequest.route);

    if (!handler) {
      handler = new RequestHandler(this);
      this.handlers.set(apiRequest.route, handler);
    }

    return handler.push(apiRequest);
  }

  /**
   * The base url for API requests
   * @type {string}
   */
  get endpoint() {
    return this.client.options.http.api;
  }

  set endpoint(endpoint) {
    this.client.options.http.api = endpoint;
  }
}

module.exports = RESTManager;
