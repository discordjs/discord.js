'use strict';

const BaseGuild = require('./BaseGuild');
const { VerificationLevels, NSFWLevels } = require('../util/Constants');

/**
 * Bundles common attributes and methods between {@link Guild} and {@link InviteGuild}
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
       * @type {?string}
       */
      this.splash = data.splash;
    }

    if ('banner' in data) {
      /**
       * The hash of the guild banner
       * @type {?string}
       */
      this.banner = data.banner;
    }

    if ('description' in data) {
      /**
       * The description of the guild, if any
       * @type {?string}
       */
      this.description = data.description;
    }

    if ('verification_level' in data) {
      /**
       * The verification level of the guild
       * @type {VerificationLevel}
       */
      this.verificationLevel = VerificationLevels[data.verification_level];
    }

    if ('vanity_url_code' in data) {
      /**
       * The vanity invite code of the guild, if any
       * @type {?string}
       */
      this.vanityURLCode = data.vanity_url_code;
    }

    if ('nsfw_level' in data) {
      /**
       * The NSFW level of this guild
       * @type {NSFWLevel}
       */
      this.nsfwLevel = NSFWLevels[data.nsfw_level];
    }
  }

  /**
   * The URL to this guild's banner.
   * @param {StaticImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  bannerURL({ format, size } = {}) {
    return this.banner && this.client.rest.cdn.Banner(this.id, this.banner, format, size);
  }

  /**
   * The URL to this guild's invite splash image.
   * @param {StaticImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  splashURL({ format, size } = {}) {
    return this.splash && this.client.rest.cdn.Splash(this.id, this.splash, format, size);
  }
}

module.exports = AnonymousGuild;
