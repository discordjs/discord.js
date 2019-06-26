const Snowflake = require('../util/Snowflake');
const Collection = require('../util/Collection');
const TeamMember = require('./TeamMember');
const Constants = require('../util/Constants');

/**
 * Represents a Client OAuth2 Application Team.
 */
class Team {
  constructor(client, data) {
    /**
     * The client that instantiated the team
     * @name Team#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

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
      const member = new TeamMember(this.client, this, memberData);
      this.members.set(member.id, member);
    }
  }

  /**
   * The owner of the team
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
    return Snowflake.deconstruct(this.id).timestamp;
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
   * @type {?string}
   * @readonly
   */
  get iconURL() {
    if (!this.icon) return null;
    return Constants.Endpoints.CDN(this.client.options.http.cdn).TeamIcon(this.id, this.icon);
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
}

module.exports = Team;
