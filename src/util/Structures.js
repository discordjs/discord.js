'use strict';

/**
 * Allows for the extension of built-in Discord.js structures that are instantiated by {@link DataStore DataStores}.
 */
class Structures {
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
  }

  /**
   * Retrieves a structure class.
   * @param {string} structure Name of the structure to retrieve
   * @returns {Function}
   */
  static get(structure) {
    if (typeof structure === 'string') return structures[structure];
    throw new TypeError(`"structure" argument must be a string (received ${typeof structure})`);
  }

  /**
   * Extends a structure.
   * @param {string} structure Name of the structure class to extend
   * @param {Function} extender Function that takes the base class to extend as its only parameter and returns the
   * extended class/prototype
   * @returns {Function} Extended class/prototype returned from the extender
   * @example
   * const { Structures } = require('discord.js');
   *
   * Structures.extend('Guild', Guild => {
   *   class CoolGuild extends Guild {
   *     constructor(client, data) {
   *       super(client, data);
   *       this.cool = true;
   *     }
   *   }
   *
   *   return CoolGuild;
   * });
   */
  static extend(structure, extender) {
    if (!structures[structure]) throw new RangeError(`"${structure}" is not a valid extensible structure.`);
    if (typeof extender !== 'function') {
      const received = `(received ${typeof extender})`;
      throw new TypeError(
        `"extender" argument must be a function that returns the extended structure class/prototype ${received}`
      );
    }

    const extended = extender(structures[structure]);
    if (typeof extended !== 'function') {
      throw new TypeError('The extender function must return the extended structure class/prototype.');
    }
    if (Object.getPrototypeOf(extended) !== structures[structure]) {
      throw new Error(
        'The class/prototype returned from the extender function must extend the existing structure class/prototype.'
      );
    }

    structures[structure] = extended;
    return extended;
  }
}

const structures = {
  GuildEmoji: require('../structures/GuildEmoji'),
  DMChannel: require('../structures/DMChannel'),
  GroupDMChannel: require('../structures/GroupDMChannel'),
  TextChannel: require('../structures/TextChannel'),
  VoiceChannel: require('../structures/VoiceChannel'),
  CategoryChannel: require('../structures/CategoryChannel'),
  GuildChannel: require('../structures/GuildChannel'),
  GuildMember: require('../structures/GuildMember'),
  Guild: require('../structures/Guild'),
  Message: require('../structures/Message'),
  MessageReaction: require('../structures/MessageReaction'),
  Presence: require('../structures/Presence').Presence,
  ClientPresence: require('../structures/ClientPresence'),
  VoiceState: require('../structures/VoiceState'),
  Role: require('../structures/Role'),
  User: require('../structures/User'),
};

module.exports = Structures;
