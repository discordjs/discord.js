'use strict';

/**
 * Role connection metadata object for an application.
 */
class ApplicationRoleConnectionMetadata {
  constructor(data) {
    /**
     * The name of this metadata field
     * @type {string}
     */
    this.name = data.name;

    /**
     * The name localizations for this metadata field
     * @type {?Object<Locale, string>}
     */
    this.nameLocalizations = data.nameLocalizations ?? null;

    /**
     * The description of this metadata field
     * @type {string}
     */
    this.description = data.description;

    /**
     * The description localizations for this metadata field
     * @type {?Object<Locale, string>}
     */
    this.descriptionLocalizations = data.descriptionLocalizations ?? null;

    /**
     * The dictionary key for this metadata field
     * @type {string}
     */
    this.key = data.key;

    /**
     * The type of this metadata field
     * @type {ApplicationRoleConnectionMetadataType}
     */
    this.type = data.type;
  }
}

exports.ApplicationRoleConnectionMetadata = ApplicationRoleConnectionMetadata;
