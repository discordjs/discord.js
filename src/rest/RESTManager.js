const APIRequest = require('./APIRequest');
const routeBuilder = require('./APIRouter');
const RequestBucket = require('./RequestBucket');
const { Error } = require('../errors');
const { Endpoints } = require('../util/Constants');
const Collection = require('../util/Collection');

/**
 * Rest manager.
 * @private
 */
class RESTManager {
  constructor(client, tokenPrefix = 'Bot') {
    /**
     * @type {Client}
     */
    this.client = client;

    /**
     * Request buckets, mapped by bucket
     * @type {Collection<string, RequestHandler>}
     */
    this.buckets = new Collection();

    /**
     * Whether we're globally limited
     * @type {boolean}
     */
    this.globallyRateLimited = false;

    /**
     * The token prefix to use when generating authorization headers
     * @type {string}
     */
    this.tokenPrefix = tokenPrefix;

    /**
     * Whether to use a versioned endpoint. Default to true.
     * @type {boolean}
     */
    this.versioned = true;

    if (client.options.restSweepInterval > 0) {
      client.setInterval(() => {
        this.buckets.sweep(handler => handler.queue.idle());
      }, client.options.restSweepInterval * 1000);
    }
  }


  /**
   * The authorization header to use
   * @readonly
   * @type {string}
   */
  get auth() {
    const token = this.client.token || this.client.accessToken;
    const prefixed = !!this.client.application || (this.client.user && this.client.user.bot);
    if (token) {
      if (prefixed) return `${this.tokenPrefix} ${token}`;
      return token;
    } else {
      throw new Error('TOKEN_MISSING');
    }
  }

  /**
   * Make a new API router
   * @readonly
   * @type {APIRouter}
   */
  get api() {
    return routeBuilder(this);
  }

  /**
   * The CDN endpoint
   * @readonly
   * @type {string}
   */
  get cdn() {
    return Endpoints.CDN(this.client.options.http.cdn);
  }

  /**
   * Make a request
   * @param {string} method The HTTP verb to use
   * @param {string} url The Discord URL
   * @param {*} options Options to send
   * @returns {Promise<any>}
   */
  request(method, url, options = {}) {
    const req = new APIRequest(this, method, url, options);
    let bucket = this.buckets.get(req.route);

    if (!bucket) {
      bucket = new RequestBucket(this, req.route);
      this.buckets.set(req.route, bucket);
    }

    return bucket.enqueue(req);
  }
}

module.exports = RESTManager;
