'use strict';

const DiscordAPIError = require('./DiscordAPIError');
const HTTPError = require('./HTTPError');
const Util = require('../util/Util');
const { Events: { RATE_LIMIT }, browser } = require('../util/Constants');

function parseResponse(res) {
  if (res.headers.get('content-type').startsWith('application/json')) return res.json();
  if (browser) return res.blob();
  return res.buffer();
}

function getAPIOffset(serverDate) {
  return new Date(serverDate).getTime() - Date.now();
}

function calculateReset(reset, serverDate) {
  return new Date(Number(reset) * 1000).getTime() - getAPIOffset(serverDate);
}

class RequestHandler {
  constructor(manager) {
    this.manager = manager;
    this.busy = false;
    this.queue = [];
    this.reset = -1;
    this.remaining = -1;
    this.limit = -1;
    this.retryAfter = -1;
  }

  push(request) {
    if (this.busy) {
      this.queue.push(request);
      return this.run();
    } else {
      return this.execute(request);
    }
  }

  run() {
    if (this.queue.length === 0) return Promise.resolve();
    return this.execute(this.queue.shift());
  }

  get limited() {
    return (this.manager.globalTimeout || this.remaining <= 0) && Date.now() < this.reset;
  }

  get _inactive() {
    return this.queue.length === 0 && !this.limited && this.busy !== true;
  }

  /* eslint-disable-next-line complexity */
  async execute(item) {
    // Insert item back to the beginning if currently busy
    if (this.busy) {
      this.queue.unshift(item);
      return null;
    }

    this.busy = true;
    const { reject, request, resolve } = item;

    // After calculations and requests have been done, pre-emptively stop further requests
    if (this.limited) {
      const timeout = this.reset + this.manager.client.options.restTimeOffset - Date.now();

      if (this.manager.client.listenerCount(RATE_LIMIT)) {
        /**
         * Emitted when the client hits a rate limit while making a request
         * @event Client#rateLimit
         * @param {Object} rateLimitInfo Object containing the rate limit info
         * @param {number} rateLimitInfo.timeout Timeout in ms
         * @param {number} rateLimitInfo.limit Number of requests that can be made to this endpoint
         * @param {string} rateLimitInfo.method HTTP method used for request that triggered this event
         * @param {string} rateLimitInfo.path Path used for request that triggered this event
         * @param {string} rateLimitInfo.route Route used for request that triggered this event
         */
        this.manager.client.emit(RATE_LIMIT, {
          timeout,
          limit: this.limit,
          method: request.method,
          path: request.path,
          route: request.route,
        });
      }

      if (this.manager.globalTimeout) {
        await this.manager.globalTimeout;
      } else {
        // Wait for the timeout to expire in order to avoid an actual 429
        await Util.delayFor(timeout);
      }
    }

    // Perform the request
    let res;
    try {
      res = await request.make();
    } catch (error) {
      // NodeFetch error expected for all "operational" errors, such as 500 status code
      this.busy = false;
      return reject(
        new HTTPError(error.message, error.constructor.name, error.status, request.method, request.path)
      );
    }

    if (res && res.headers) {
      const serverDate = res.headers.get('date');
      const limit = res.headers.get('x-ratelimit-limit');
      const remaining = res.headers.get('x-ratelimit-remaining');
      const reset = res.headers.get('x-ratelimit-reset');
      const retryAfter = res.headers.get('retry-after');

      this.limit = limit ? Number(limit) : Infinity;
      this.remaining = remaining ? Number(remaining) : 1;
      this.reset = reset ? calculateReset(reset, serverDate) : Date.now();
      this.retryAfter = retryAfter ? Number(retryAfter) : -1;

      // https://github.com/discordapp/discord-api-docs/issues/182
      if (item.request.route.includes('reactions')) {
        this.reset = new Date(serverDate).getTime() - getAPIOffset(serverDate) + 250;
      }

      // Handle global ratelimit
      if (res.headers.get('x-ratelimit-global')) {
        // Set the manager's global timeout as the promise for other requests to "wait"
        this.manager.globalTimeout = Util.delayFor(this.retryAfter);

        // Wait for the global timeout to resolve before continuing
        await this.manager.globalTimeout;

        // Clean up global timeout
        this.manager.globalTimeout = null;
      }
    }

    // Finished handling headers, safe to unlock manager
    this.busy = false;

    if (res.ok) {
      const success = await parseResponse(res);
      // Nothing wrong with the request, proceed with the next one
      resolve(success);
      return this.run();
    } else if (res.status === 429) {
      // A ratelimit was hit - this should never happen
      this.queue.unshift(item);
      this.manager.client.emit('debug', `429 hit on route ${item.request.route}`);
      await Util.delayFor(this.retryAfter);
      return this.run();
    } else if (res.status >= 500 && res.status < 600) {
      // Retry the specified number of times for possible serverside issues
      if (item.retries === this.manager.client.options.retryLimit) {
        return reject(
          new HTTPError(res.statusText, res.constructor.name, res.status, item.request.method, request.path)
        );
      } else {
        item.retries++;
        this.queue.unshift(item);
        return this.run();
      }
    } else {
      // Handle possible malformed requests
      try {
        const data = await parseResponse(res);
        if (res.status >= 400 && res.status < 500) {
          return reject(new DiscordAPIError(request.path, data, request.method, res.status));
        }
        return null;
      } catch (err) {
        return reject(
          new HTTPError(err.message, err.constructor.name, err.status, request.method, request.path)
        );
      }
    }
  }
}

module.exports = RequestHandler;
