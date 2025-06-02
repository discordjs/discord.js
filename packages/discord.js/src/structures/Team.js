'use strict';

const { Collection } = require('@discordjs/collection');
const { DiscordSnowflake } = require('@sapphire/snowflake');
const { Base } = require('./Base.js');
const { TeamMember } = require('./TeamMember.js');

/**
 * Represents a Client OAuth2 Application Team.
 *
 * @extends {Base}
 */
class Team extends Base {
  constructor(client, data) {
    super(client);
    this._patch(data);
  }

  _patch(data) {
    /**
     * The Team's id
     *
     * @type {Snowflake}
     */
    this.id = data.id;

    if ('name' in data) {
      /**
       * The name of the Team
       *
       * @type {string}
       */
      this.name = data.name;
    }

    if ('icon' in data) {
      /**
       * The Team's icon hash
       *
       * @type {?string}
       */
      this.icon = data.icon;
    } else {
      this.icon ??= null;
    }

    if ('owner_user_id' in data) {
      /**
       * The Team's owner id
       *
       * @type {?Snowflake}
       */
      this.ownerId = data.owner_user_id;
    } else {
      this.ownerId ??= null;
    }

    /**
     * The Team's members
     *
     * @type {Collection<Snowflake, TeamMember>}
     */
    this.members = new Collection();

    for (const memberData of data.members) {
      const member = new TeamMember(this, memberData);
      this.members.set(member.id, member);
    }
  }

  /**
   * The owner of this team
   *
   * @type {?TeamMember}
   * @readonly
   */
  get owner() {
    return this.members.get(this.ownerId) ?? null;
  }

  /**
   * The timestamp the team was created at
   *
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return DiscordSnowflake.timestampFrom(this.id);
  }

  /**
   * The time the team was created at
   *
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * A link to the team's icon.
   *
   * @param {ImageURLOptions} [options={}] Options for the image URL
   * @returns {?string}
   */
  iconURL(options = {}) {
    return this.icon && this.client.rest.cdn.teamIcon(this.id, this.icon, options);
  }

  /**
   * When concatenated with a string, this automatically returns the Team's name instead of the
   * Team object.
   *
   * @returns {string}
   * @example
   * // Logs: Team name: My Team
   * console.log(`Team name: ${team}`);
   */
  toString() {
    return this.name;
  }

  toJSON() {
    return super.toJSON({ createdTimestamp: true });
  }
}

exports.Team = Team;
