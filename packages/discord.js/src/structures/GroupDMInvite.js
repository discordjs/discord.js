'use strict';

const { BaseInvite } = require('./BaseInvite.js');

/**
 * A channel invite leading to a group direct message channel.
 * @extends {BaseInvite}
 */
class GroupDMInvite extends BaseInvite {
  constructor(client, data) {
    super(client, data);

    /**
     * The approximate total number of members of in the group direct message channel.
     * <info>This is only available when the invite was fetched through {@link Client#fetchInvite}.</info>
     * @name GroupDMInvite#approximateMemberCount
     * @type {?number}
     */

    this._patch(data);
  }

  _patch(data) {
    super._patch(data);
  }
}

exports.GroupDMInvite = GroupDMInvite;
