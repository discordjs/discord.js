'use strict';

const { BaseGuild } = require('./BaseGuild.js');

/**
 * Bundles common attributes and methods between {@link Guild} and {@link InviteGuild}
 *
 * @extends {BaseGuild}
 * @abstract
 */
class AnonymousGuild extends BaseGuild {
  constructor(client, data, immediatePatch = true) {
    super(client, data);
    if (immediatePatch) this._patch(data);
  }

  _patch(data) {
    if ('features' in data) this.features = data.features;

    if ('splash' in data) {
      /**
       * The hash of the guild invite splash image
       *
       * @type {?string}
       */
      this.splash = data.splash;
    }

    if ('banner' in data) {
      /**
       * The hash of the guild banner
       *
       * @type {?string}
       */
      this.banner = data.banner;
    }

    if ('description' in data) {
      /**
       * The description of the guild, if any
       *
       * @type {?string}
       */
      this.description = data.description;
    }

    if ('verification_level' in data) {
      /**
       * The verification level of the guild
       *
       * @type {GuildVerificationLevel}
       */
      this.verificationLevel = data.verification_level;
    }

    if ('vanity_url_code' in data) {
      /**
       * The vanity invite code of the guild, if any
       *
       * @type {?string}
       */
      this.vanityURLCode = data.vanity_url_code;
    }

    if ('nsfw_level' in data) {
      /**
       * The NSFW level of this guild
       *
       * @type {GuildNSFWLevel}
       */
      this.nsfwLevel = data.nsfw_level;
    }

    if ('premium_subscription_count' in data) {
      /**
       * The total number of boosts for this server
       *
       * @type {?number}
       */
      this.premiumSubscriptionCount = data.premium_subscription_count;
    } else {
      this.premiumSubscriptionCount ??= null;
    }
  }

  /**
   * The URL to this guild's banner.
   *
   * @param {ImageURLOptions} [options={}] Options for the image URL
   * @returns {?string}
   */
  bannerURL(options = {}) {
    return this.banner && this.client.rest.cdn.banner(this.id, this.banner, options);
  }

  /**
   * The URL to this guild's invite splash image.
   *
   * @param {ImageURLOptions} [options={}] Options for the image URL
   * @returns {?string}
   */
  splashURL(options = {}) {
    return this.splash && this.client.rest.cdn.splash(this.id, this.splash, options);
  }
}

exports.AnonymousGuild = AnonymousGuild;
