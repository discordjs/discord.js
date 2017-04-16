/**
 * Represents an error from Discord's HTTP Gateway
 */
class DiscordHTTPError extends Error {
  constructor(error) {
    const flatErrors = error.errors ? this.constructor.flattenErrors(error.errors).join('\n') : '';
    super(`${error.message}\n${flatErrors}`.trim());
    this.name = `DiscordHTTPError ${this.code}`;
    
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

module.exports = DiscordHTTPError;
