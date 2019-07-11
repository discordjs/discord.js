const { MembershipStates } = require('../util/Constants');

/**
 * Represents a Client OAuth2 Application Team Member.
 */
class TeamMember {
  constructor(client, team, data) {
    /**
     * The client that instantiated the Team Member
     * @name TeamMember#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    /**
     * The Team this member is part of
     * @type {Team}
     */
    this.team = team;

    this._patch(data);
  }

  _patch(data) {
    /**
     * The permissions this Team Member has with regard to the team
     * @type {string[]}
     */
    this.permissions = data.permissions;

    /**
     * The membership state this Team Member has with regard to the team
     * @type {MembershipStates}
     */
    this.membershipState = MembershipStates[data.membership_state];

    /**
     * The user for this Team Member
     * @type {User}
     */
    this.user = this.client.dataManager.newUser(data.user);
  }

  /**
   * The ID of the Team Member
   * @type {Snowflake}
   * @readonly
   */
  get id() {
    return this.user.id;
  }

  /**
   * When concatenated with a string, this automatically returns the team members's mention instead of the
   * TeamMember object.
   * @returns {string}
   * @example
   * // Logs: Team Member's mention: <@123456789>
   * console.log(`Team Member's mention: ${teamMember}`);
   */
  toString() {
    return this.user.toString();
  }
}

module.exports = TeamMember;
