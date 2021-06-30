'use strict';

/**
 * Represents a HTTP error from a request.
 * @extends Error
 */
class HTTPError extends Error {
  constructor(message, name, code, request) {
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
    this.code = code ?? 500;

    /**
     * The HTTP method used for the request
     * @type {string}
     */
    this.method = request.method;

    /**
     * The path of the request relative to the HTTP endpoint
     * @type {string}
     */
    this.path = request.path;

    /**
     * The HTTP data that was sent to Discord
     * @typedef {Object} HTTPErrorData
     * @property {*} json The JSON data that was sent
     * @property {HTTPAttachmentData[]} files The files that were sent with this request, if any
     */

    /**
     * The attachment data that is sent to Discord
     * @typedef {Object} HTTPAttachmentData
     * @property {string|Buffer|Stream} attachment The source of this attachment data
     * @property {string} name The file name
     * @property {Buffer|Stream} file The file buffer
     */

    /**
     * The data associated with the request that caused this error
     * @type {HTTPErrorData}
     */
    this.requestData = {
      json: request.options.data,
      files: request.options.files ?? [],
    };
  }
}

module.exports = HTTPError;
