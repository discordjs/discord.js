'use strict';

const Base = require('./Base');
const TeamMember = require('./TeamMember');
const Collection = require('../util/Collection');
const SnowflakeUtil = require('../util/SnowflakeUtil');

/**
 * Represents a Client OAuth2 Application Team.
 * @extends {Base}
 */
class Team extends Base {
  constructor(client, data) {
    super(client);
    this._patch(data);
  }

  _patch(data) {
    /**
     * The ID of the Team
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The name of the Team
     * @type {string}
     */
    this.name = data.name;

    /**
     * The Team's icon hash
     * @type {?string}
     */
    this.icon = data.icon || null;

    /**
     * The Team's owner id
     * @type {?string}
     */
    this.ownerID = data.owner_user_id || null;

    /**
     * The Team's members
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
   * @type {?TeamMember}
   * @readonly
   */
  get owner() {
    return this.members.get(this.ownerID) || null;
  }

  /**
   * The timestamp the team was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return SnowflakeUtil.deconstruct(this.id).timestamp;
  }

  /**
   * The time the team was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * A link to the teams's icon.
   * @param {ImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string} URL to the icon
   */
  iconURL({ format, size } = {}) {
    if (!this.icon) return null;
    return this.client.rest.cdn.TeamIcon(this.id, this.icon, { format, size });
  }

  /**
   * When concatenated with a string, this automatically returns the Team's name instead of the
   * Team object.
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

module.exports = Team;
