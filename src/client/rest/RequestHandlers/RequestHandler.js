/**
 * A base class for different types of rate limiting handlers for the REST API.
 * @private
 */
module.exports = class RequestHandler {
  constructor(restManager) {
    /**
     * The RESTManager that instantiated this RequestHandler
     * @type {RESTManager}
     */
    this.restManager = restManager;

    /**
     * A list of requests that have yet to be processed.
     * @type {Array<APIRequest>}
     */
    this.queue = [];
  }

  /**
   * Push a new API request into this bucket
   * @param {APIRequest} request the new request to push into the queue
   */
  push(request) {
    this.queue.push(request);
  }

  /**
   * Attempts to get this RequestHandler to process its current queue
   */
  handle() {

  }
};
