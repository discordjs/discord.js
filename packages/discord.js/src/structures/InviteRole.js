'use strict';

const { BaseRole } = require('./BaseRole.js');

/**
 * Represents a role received from an invite
 *
 * @extends {BaseRole}
 */
class InviteRole extends BaseRole {}

exports.InviteRole = InviteRole;
