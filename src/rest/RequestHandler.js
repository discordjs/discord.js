'use strict';

const BucketLock = require('./BucketLock');
const DiscordAPIError = require('./DiscordAPIError');
const HTTPError = require('./HTTPError');
const Collection = require('../util/Collection');
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

function checkBucketUsable(bucket) {
  return bucket.remaining <= 0;
}

function checkBucketReset(bucket) {
  return Date.now() < bucket.reset;
}

class RequestHandler {
  constructor(restManager, normalizedPath) {
    Object.defineProperty(this, 'restManager', { value: restManager });
    this.normalizedPath = normalizedPath;

    this.busy = false;
    this.requestQueue = [];

    this.bucketHashes = new Collection();
  }

  get isInactive() {
    return !this.requestQueue.length && !this.limited() && !this.busy;
  }

  limited(bucket) {
    return (this.restManager.globalTimeout ||
      bucket ? checkBucketUsable(bucket) : this.bucketHashes.some(hash =>
        checkBucketUsable(this.restManager.buckets.get(hash)))
    ) &&
      bucket ? checkBucketReset(bucket) : this.bucketHashes.some(hash =>
        checkBucketReset(this.restManager.buckets.get(hash)));
  }

  bucketFor(method) {
    const methodHash = this.bucketHashes.get(method) || null;
    let bucket = this.restManager.buckets.get(methodHash);

    if (!bucket) {
      bucket = new BucketLock(methodHash);
      this.restManager.buckets.set(methodHash, bucket);
    }

    return bucket;
  }

  debug(message, method = '') {
    return this.restManager.debug(message, `${method ? `${method}:` : ''}${this.normalizedPath}`);
  }

  queue(request) {
    this.requestQueue.push(request);
    if (this.busy) return request.promise;
    return this.run();
  }

  /* eslint-disable-next-line complexity */
  async run() {
    if (!this.requestQueue.length) return null;

    const requestData = this.requestQueue.shift();

    this.busy = true;
    const { request, resolve, reject, retries, stack } = requestData;
    const oldBucketHash = this.bucketHashes.get(request.method) || null;
    let bucket = this.bucketFor(request.method);

    // Check if we are limited before requesting again
    if (this.limited(bucket)) {
      const restOffset = this.restManager.client.options.restTimeOffset;
      const timeout = bucket.reset + (restOffset < 0 ? -restOffset : restOffset) - Date.now();

      if (this.restManager.client.listenerCount(RATE_LIMIT)) {
        /**
         * Emitted when the client hits a rate limit while making a request
         * @event Client#rateLimit
         * @param {Object} rateLimitInfo Object containing the rate limit info
         * @param {number} rateLimitInfo.timeout Timeout in ms
         * @param {string} rateLimitInfo.method HTTP method used for request that triggered this event
         * @param {string} rateLimitInfo.path Path used for request that triggered this event
         * @param {string} rateLimitInfo.route Route used for request that triggered this event
         * @param {Object} bucket The ratelimit bucket
         * @param {string} bucket.hash The bucket hash
         * @param {number} bucket.limit Number of requests that can be made to this endpoint
         * @param {number} bucket.reset UNIX timestamp when the bucket resets
         */
        this.restManager.client.emit(RATE_LIMIT, {
          timeout,
          bucket: {
            hash: bucket.hash,
            limit: bucket.limit,
            reset: bucket.reset,
          },
          method: request.method,
          path: request.path,
          route: this.normalizedPath,
        });
      }

      if (this.restManager.globalTimeout) {
        await this.restManager.globalTimeout;
      } else {
        // Wait for the timeout to expire in order to avoid an actual 429
        await Util.delayFor(timeout);
      }
    }

    // Wait for the bucket lock to be done
    await bucket.waitLock();

    const release = bucket.acquireLock();

    let res;

    try {
      res = await request.make();
    } catch (error) {
      // NodeFetch error expected for all "operational" errors, such as 500 status code
      reject(
        new HTTPError(error.message, error.constructor.name, error.status, request.method, request.path, stack)
      );
    }

    if (res) {
      if (res.headers) {
        const serverDate = res.headers.get('date');
        const limit = res.headers.get('x-ratelimit-limit');
        const remaining = res.headers.get('x-ratelimit-remaining');
        const reset = res.headers.get('x-ratelimit-reset');
        const retryAfter = res.headers.get('retry-after');
        const bucketHash = res.headers.get('x-ratelimit-bucket');
        const resetAfter = res.headers.get('x-ratelimit-reset-after');

        if (oldBucketHash !== bucketHash) {
          this.debug(
            `Received bucket hash
    Old      : ${oldBucketHash}
    New      : ${bucketHash}
    Remaining: ${remaining}
    Limit    : ${limit}
    Reset    : ${resetAfter} seconds`,
            request.method
          );
          this.bucketHashes.set(request.method, bucketHash);
          bucket = this.bucketFor(request.method);
        }

        bucket._patch(
          limit ? Number(limit) : bucket.limit || Infinity,
          remaining ? Number(remaining) : bucket.remaining || 1,
          reset ? calculateReset(reset, serverDate) : Date.now(),
          retryAfter ? Number(retryAfter) : -1
        );

        // https://github.com/discordapp/discord-api-docs/issues/182
        if (this.normalizedPath.includes('reactions')) {
          bucket.reset = new Date(serverDate).getTime() - getAPIOffset(serverDate) + 250;
        }

        // Handle global ratelimit
        if (res.headers.get('x-ratelimit-global')) {
          this.restManager.debug(`Encountered a global ratelimit; continuing requests in ${bucket.retryAfter}ms`);
          // Set the manager's global timeout as the promise for other requests to "wait"
          this.restManager.globalTimeout = Util.delayFor(bucket.retryAfter);

          // Wait for the global timeout to resolve before continuing
          await this.restManager.globalTimeout;

          // Clean up global timeout
          this.restManager.globalTimeout = null;
        }
      }

      if (res.ok) {
        const data = await parseResponse(res);
        // Nothing wrong with the request, proceed with the next one
        resolve(data);
      } else if (res.status === 429) {
        // A ratelimit was hit - this should never happen
        this.requestQueue.unshift(requestData);
        this.debug(
          `Encountered a 429. Retrying in ${bucket.retryAfter}ms
    [Bucket Info]
    Hash       : ${bucket.hash}
    Limit      : ${bucket.limit}
    Reset      : ${new Date(bucket.reset).toISOString()}
    Retry After: ${bucket.retryAfter}`);
        await Util.delayFor(bucket.retryAfter);
      } else if (res.status >= 500 && res.status <= 600) {
        // Retry the specified number of times for possible serverside issues
        if (retries === this.restManager.client.options.retryLimit) {
          reject(
            new HTTPError(
              res.statusText, res.constructor.name, res.status, requestData.request.method, request.path, stack
            )
          );
        } else {
          requestData.retries++;
          this.requestQueue.unshift(requestData);
        }
      } else {
        // Handle possible malformed requests
        try {
          const data = await parseResponse(res);
          if (res.status >= 400 && res.status < 500) {
            reject(new DiscordAPIError(request.path, data, request.method, res.status, stack));
          }
        } catch (err) {
          reject(
            new HTTPError(err.message, err.constructor.name, err.status, request.method, request.path, stack)
          );
        }
      }
    }

    this.busy = false;
    release();

    return this.run();
  }
}

module.exports = RequestHandler;
