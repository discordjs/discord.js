'use strict';

const Base = require('./Base');
const { MembershipStates } = require('../util/Constants');

/**
 * Represents a Client OAuth2 Application Team Member.
 * @extends {Base}
 */
class TeamMember extends Base {
  constructor(client, team, data) {
    super(client);

    /**
     * The Team
     * @type {Team}
     */
    this.team = team;

    this._patch(data);
  }

  _patch(data) {
    /**
     * The ID of the Team Member
     * @type {Snowflake}
     */
    this.id = data.user.id;

    /**
     * The permissions this Team Member has with reguard to the team
     * @type {string[]}
     */
    this.permissions = data.permissions;

    /**
     * The permissions this Team Member has with reguard to the team
     * @type {string}
     */
    this.membershipState = MembershipStates[data.membership_state];

    /**
     * The user for this Team Member
     * @type {User}
     */
    this.user = this.client.users.add(data.user);
  }

  /**
   * When concatenated with a string, this automatically returns the team members's name instead of the
   * TeamMember object.
   * @returns {string}
   * @example
   * // Logs: Team Member's username: Hydrabolt
   * console.log(`Team Member's name: ${teamMember}`);
   */
  toString() {
    return this.user.username;
  }

  toJSON() {
    return super.toJSON();
  }
}

module.exports = TeamMember;
