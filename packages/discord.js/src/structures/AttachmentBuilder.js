'use strict';

const { AttachmentBuilder: BuildersAttachment } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');

/**
 * Represents an attachment builder.
 * @extends {BuildersAttachment}
 */
class AttachmentBuilder extends BuildersAttachment {
    constructor({ ...data } = {}) {
        super(
            ...Transformers.toSnakeCase(data),
        );
    }
}

module.exports = AttachmentBuilder;

/**
 * @external BuildersAttachment
 * @see {@link https://discord.js.org/#/docs/builders/main/class/AttachmentBuilder}
 */
