'use strict';

const Base = require('./Base');
const { SKUFlagsBitField } = require('../util/SKUFlagsBitField');

/**
 * Represents a premium application SKU.
 * @extends {Base}
 */
class SKU extends Base {
  constructor(client, data) {
    super(client);

    /**
     * The id of the SKU
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The type of the SKU
     * @type {SKUType}
     */
    this.type = data.type;

    /**
     * The id of the parent application
     * @type {Snowflake}
     */
    this.applicationId = data.application_id;

    /**
     * The customer-facing name of the premium offering
     * @type {string}
     */
    this.name = data.name;

    /**
     * The system-generated URL slug based on this SKU's name
     * @type {string}
     */
    this.slug = data.slug;

    /**
     * Flags that describe the SKU
     * @type {Readonly<SKUFlagsBitField>}
     */
    this.flags = new SKUFlagsBitField(data.flags).freeze();
  }
}

exports.SKU = SKU;
