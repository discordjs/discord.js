/**
 * Allows for the extension of built-in Discord.js structures that are instantiated by {@link DataStore DataStores}.
 */
class Structures {
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
  }

  /**
   * Retrieves a structure class.
   * @param {string|Function} structure Name of the structure or a class/prototype function to use the name of
   * @returns {Function}
   */
  static get(structure) {
    if (typeof structure === 'string') return structures[structure];
    if (typeof structure === 'function') return structures[structure.name];
    throw new TypeError(`Structure to retrieve must be a string or class/prototype function, not ${typeof structure}.`);
  }

  /**
   * Extends a structure.
   * @param {string} name Name of the structure class to extend
   * @param {Function} extender Function that takes the base class to extend as its only parameter and returns the
   * extended class/prototype
   * @returns {Function} Extended class/prototype returned from the extender
   * @example
   * const { Structures } = require('discord.js');
   *
   * Structures.extend('Guild', Guild =>
   *   class CoolGuild extends Guild {
   *     constructor(client, data) {
   *       super(client, data);
   *       this.cool = true;
   *     }
   *   }
   * );
   */
  static extend(name, extender) {
    if (!structures[name]) throw new RangeError(`"${name}" is not a valid extensible structure.`);
    if (typeof extender !== 'function') {
      throw new TypeError('The extender must be a function that returns the extended structure class/prototype.');
    }

    const custom = extender(structures[name]);
    if (typeof custom !== 'function') {
      throw new TypeError('The extender function must return the extended structure class/prototype.');
    }
    if (Object.getPrototypeOf(custom) !== structures[name]) {
      throw new Error(
        "The class/prototype returned from the extender function doesn't extend the existing structure class/prototype."
      );
    }

    structures[name] = custom;
    return custom;
  }
}

const structures = {
  Channel: require('../structures/Channel'),
  Emoji: require('../structures/Emoji'),
  GuildChannel: require('../structures/GuildChannel'),
  GuildMember: require('../structures/GuildMember'),
  Guild: require('../structures/Guild'),
  Message: require('../structures/Message'),
  MessageReaction: require('../structures/MessageReaction'),
  Presence: require('../structures/Presence').Presence,
  Role: require('../structures/Role'),
  User: require('../structures/User'),
};

module.exports = Structures;
