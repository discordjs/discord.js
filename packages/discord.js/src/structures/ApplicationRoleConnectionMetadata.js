'use strict';

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
    if ('name_localizations' in data) {
      this.nameLocalizations = data.name_localizations;
    } else {
      this.nameLocalizations ??= null;
    }

    /**
     * The description of this metadata field
     * @type {string}
     */
    this.description = data.description;

    /**
     * The description localizations for this metadata field
     * @type {?Object<Locale, string>}
     */
    if ('description_localizations' in data) {
      this.descriptionLocalizations = data.description_localizations;
    } else {
      this.descriptionLocalizations ??= null;
    }

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
