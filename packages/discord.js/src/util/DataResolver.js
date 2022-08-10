'use strict';

const { Buffer } = require('node:buffer');
const fs = require('node:fs/promises');
const path = require('node:path');
const { fetch } = require('undici');
const { Error: DiscordError, TypeError, ErrorCodes } = require('../errors');
const Invite = require('../structures/Invite');

/**
 * The DataResolver identifies different objects and tries to resolve a specific piece of information from them.
 * @private
 */
class DataResolver extends null {
  /**
   * Data that can be resolved to give an invite code. This can be:
   * * An invite code
   * * An invite URL
   * @typedef {string} InviteResolvable
   */

  /**
   * Data that can be resolved to give a template code. This can be:
   * * A template code
   * * A template URL
   * @typedef {string} GuildTemplateResolvable
   */

  /**
   * Resolves the string to a code based on the passed regex.
   * @param {string} data The string to resolve
   * @param {RegExp} regex The RegExp used to extract the code
   * @returns {string}
   */
  static resolveCode(data, regex) {
    return regex.exec(data)?.[1] ?? data;
  }

  /**
   * Resolves InviteResolvable to an invite code.
   * @param {InviteResolvable} data The invite resolvable to resolve
   * @returns {string}
   */
  static resolveInviteCode(data) {
    return this.resolveCode(data, Invite.InvitesPattern);
  }

  /**
   * Resolves GuildTemplateResolvable to a template code.
   * @param {GuildTemplateResolvable} data The template resolvable to resolve
   * @returns {string}
   */
  static resolveGuildTemplateCode(data) {
    const GuildTemplate = require('../structures/GuildTemplate');
    return this.resolveCode(data, GuildTemplate.GuildTemplatesPattern);
  }

  /**
   * Resolves a Base64Resolvable, a string, or a BufferResolvable to a Base 64 image.
   * @param {BufferResolvable|Base64Resolvable} image The image to be resolved
   * @returns {Promise<?string>}
   */
  static async resolveImage(image) {
    if (!image) return null;
    if (typeof image === 'string' && image.startsWith('data:')) {
      return image;
    }
    const file = await this.resolveFile(image);
    return this.resolveBase64(file.data);
  }

  /**
   * Data that resolves to give a Base64 string, typically for image uploading. This can be:
   * * A Buffer
   * * A base64 string
   * @typedef {Buffer|string} Base64Resolvable
   */

  /**
   * Resolves a Base64Resolvable to a Base 64 image.
   * @param {Base64Resolvable} data The base 64 resolvable you want to resolve
   * @returns {?string}
   */
  static resolveBase64(data) {
    if (Buffer.isBuffer(data)) return `data:image/jpg;base64,${data.toString('base64')}`;
    return data;
  }

  /**
   * Data that can be resolved to give a Buffer. This can be:
   * * A Buffer
   * * The path to a local file
   * * A URL <warn>When provided a URL, discord.js will fetch the URL internally in order to create a Buffer.
   * This can pose a security risk when the URL has not been sanitized</warn>
   * @typedef {string|Buffer} BufferResolvable
   */

  /**
   * @external Stream
   * @see {@link https://nodejs.org/api/stream.html}
   */

  /**
   * @typedef {Object} ResolvedFile
   * @property {Buffer} data Buffer containing the file data
   * @property {string} [contentType] Content type of the file
   */

  /**
   * Resolves a BufferResolvable to a Buffer.
   * @param {BufferResolvable|Stream} resource The buffer or stream resolvable to resolve
   * @returns {Promise<ResolvedFile>}
   */
  static async resolveFile(resource) {
    if (Buffer.isBuffer(resource)) return { data: resource };

    if (typeof resource[Symbol.asyncIterator] === 'function') {
      const buffers = [];
      for await (const data of resource) buffers.push(Buffer.from(data));
      return { data: Buffer.concat(buffers) };
    }

    if (typeof resource === 'string') {
      if (/^https?:\/\//.test(resource)) {
        const res = await fetch(resource);
        return { data: Buffer.from(await res.arrayBuffer()), contentType: res.headers.get('content-type') };
      }

      const file = path.resolve(resource);

      const stats = await fs.stat(file);
      if (!stats.isFile()) throw new DiscordError(ErrorCodes.FileNotFound, file);
      return { data: await fs.readFile(file) };
    }

    throw new TypeError(ErrorCodes.ReqResourceType);
  }
}

module.exports = DataResolver;
