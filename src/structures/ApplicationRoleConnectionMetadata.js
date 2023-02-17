'use strict';

const { ApplicationRoleConnectionMetadataTypes } = require('../util/Constants');

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
    this.nameLocalizations = data.name_localizations ?? null;

    /**
     * The description of this metadata field
     * @type {string}
     */
    this.description = data.description;

    /**
     * The description localizations for this metadata field
     * @type {?Object<Locale, string>}
     */
    this.descriptionLocalizations = data.description_localizations ?? null;

    /**
     * The dictionary key for this metadata field
     * @type {string}
     */
    this.key = data.key;

    /**
     * The type of this metadata field
     * @type {ApplicationRoleConnectionMetadataType}
     */
    this.type = typeof data.type === 'number' ? ApplicationRoleConnectionMetadataTypes[data.type] : data.type;
  }
}

exports.ApplicationRoleConnectionMetadata = ApplicationRoleConnectionMetadata;
