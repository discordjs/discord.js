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
     * The permissions this Team Member has with reguard to the team
     * @type {string[]}
     */
    this.permissions = data.permissions;

    /**
     * The permissions this Team Member has with reguard to the team
     * @type {MembershipStates}
     */
    this.membershipState = MembershipStates[data.membership_state];

    /**
     * The user for this Team Member
     * @type {User}
     */
    this.user = this.client.users.add(data.user);

    /**
     * The ID of the Team Member
     * @type {Snowflake}
     */
    this.id = this.user.id;
  }

  /**
   * When concatenated with a string, this automatically returns the team members's tag instead of the
   * TeamMember object.
   * @returns {string}
   * @example
   * // Logs: Team Member's tag: @Hydrabolt
   * console.log(`Team Member's tag: ${teamMember}`);
   */
  toString() {
    return this.user.toString();
  }
}

module.exports = TeamMember;
