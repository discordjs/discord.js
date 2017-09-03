/**
 * Represents an error from the Discord API.
 * @extends Error
 */
class DiscordAPIError extends Error {
  constructor(path, error) {
    super();
    const flattened = this.constructor.flattenErrors(error.errors || error).join('\n');
    this.name = 'DiscordAPIError';
    this.message = error.message && flattened ? `${error.message}\n${flattened}` : error.message || flattened;

    /**
     * The path of the request relative to the HTTP endpoint
     * @type {string}
     */
    this.path = path;

    /**
     * HTTP error code returned by Discord
     * @type {number}
     */
    this.code = error.code;
  }

  /**
   * Flattens an errors object returned from the API into an array.
   * @param {Object} obj Discord errors object
   * @param {string} [key] Used internally to determine key names of nested fields
   * @returns {string[]}
   * @private
   */
  static flattenErrors(obj, key = '') {
    let messages = [];

    for (const k of Object.keys(obj)) {
      if (k === 'message') continue;
      const newKey = key ? isNaN(k) ? `${key}.${k}` : `${key}[${k}]` : k;

      if (obj[k]._errors) {
        messages.push(`${newKey}: ${obj[k]._errors.map(e => e.message).join(' ')}`);
      } else if (obj[k].code || obj[k].message) {
        messages.push(`${obj[k].code ? `${obj[k].code}: ` : ''}: ${obj[k].message}`.trim());
      } else if (typeof obj[k] === 'string') {
        messages.push(obj[k]);
      } else {
        messages = messages.concat(this.flattenErrors(obj[k], newKey));
      }
    }

    return messages;
  }
}

module.exports = DiscordAPIError;
