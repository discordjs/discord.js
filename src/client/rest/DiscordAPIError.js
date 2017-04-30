/**
 * Represents an error from the Discord API.
 */
class DiscordAPIError extends Error {
  constructor(error) {
    super();
    const flattened = error.errors ? `\n${this.constructor.flattenErrors(error.errors).join('\n')}` : '';
    this.name = 'DiscordAPIError';
    this.message = `${error.message}${flattened}`;

    /**
     * HTTP error code returned by Discord
     * @type {number}
     */
    this.code = error.code;
  }

  /**
   * Flattens an errors object returned from the API into an array.
   * @param {Object} obj Discord errors object
   * @param {string} [key] idklol
   * @returns {string[]}
   */
  static flattenErrors(obj, key = '') {
    let messages = [];
    for (const k of Object.keys(obj)) {
      const newKey = key ? isNaN(k) ? `${key}.${k}` : `${key}[${k}]` : k;
      if (obj[k]._errors) {
        messages.push(`${newKey}: ${obj[k]._errors.map(e => e.message).join(' ')}`);
      } else {
        messages = messages.concat(this.flattenErrors(obj[k], newKey));
      }
    }

    return messages;
  }
}

module.exports = DiscordAPIError;
