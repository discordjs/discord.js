'use strict';

/**
 * Represents a HTTP error from a request.
 * @extends Error
 */
class HTTPError extends Error {
  constructor(message, name, code, method, path) {
    super(message);

    /**
     * The name of the error
     * @type {string}
     */
    this.name = name;

    /**
     * HTTP error code returned from the request
     * @type {number}
     */
    this.code = code || 500;

    /**
     * The HTTP method used for the request
     * @type {string}
     */
    this.method = method;

    /**
     * The path of the request relative to the HTTP endpoint
     * @type {string}
     */
    this.path = path;
  }
}

module.exports = HTTPError;
