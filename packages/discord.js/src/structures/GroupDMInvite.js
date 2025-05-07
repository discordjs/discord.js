'use strict';

const { BaseInvite } = require('./BaseInvite.js');

/**
 * A channel invite leading to a group direct message channel.
 * @extends {BaseInvite}
 */
class GroupDMInvite extends BaseInvite {
  /**
   * The approximate total number of members of in the group direct message channel.
   * <info>This is only available when the invite was fetched through {@link Client#fetchInvite}.</info>
   * @name GroupDMInvite#approximateMemberCount
   * @type {?number}
   */
}

exports.GroupDMInvite = GroupDMInvite;
