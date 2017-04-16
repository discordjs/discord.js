const kCode = Symbol('code');

/**
 * Represents an error from Discord's HTTP Gateway
 */
class DiscordHTTPError extends Error {
  constructor(error) {
    const flatErrors = error.errors ? makeFlatErrors(error.errors).join('\n') : '';
    super(`${error.message}\n${flatErrors}`.trim());
    this[kCode] = error.code;
  }

  /**
   * The name of this error
   * @type {string}
   */
  get name() {
    return `DiscordHTTPError ${this[kCode]}`;
  }

  /**
   * The error code from Discord
   * @type {number}
   */
  get code() {
    return this[kCode];
  }
}

function makeFlatErrors(obj, key = '') {
  let messages = [];
  for (const [k, v] of Object.entries(obj)) {
    const newKey = key ? isNaN(parseInt(k)) ? `${key}.${k}` : `${key}[${k}]` : k;
    if (v._errors) {
      messages.push(`${newKey}: ${v._errors.map(e => e.message).join(' ')}`);
    } else {
      messages = messages.concat(makeFlatErrors(v, newKey));
    }
  }

  return messages;
}


module.exports = DiscordHTTPError;
