/**
 * Represents an error from the Discord API
 */
class DiscordAPIError extends Error {
  constructor(error) {
    super();
    const flattened = error.errors ? `\n${this.constructor.flattenErrors(error.errors).join('\n')}` : '';
    this.name = `DiscordAPIError ${this.code}`;
    this.message = `${error.message}${flattened}`;
    
    /**
     * The error code from Discord
     * @type {number}
     */
    this.code = error.code;
  }
  
  static flattenErrors(obj, key = '') {
    let messages = [];
    for (const k of Object.keys(obj)) {
      const newKey = key ? isNaN(parseInt(k)) ? `${key}.${k}` : `${key}[${k}]` : k;
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
