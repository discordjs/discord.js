'use strict';

const { Buffer } = require('node:buffer');
const fs = require('node:fs');
const path = require('node:path');
const stream = require('node:stream');
const fetch = require('node-fetch');
const { Error: DiscordError, TypeError } = require('../errors');
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
    return data.matchAll(regex).next().value?.[1] ?? data;
  }

  /**
   * Resolves InviteResolvable to an invite code.
   * @param {InviteResolvable} data The invite resolvable to resolve
   * @returns {string}
   */
  static resolveInviteCode(data) {
    return this.resolveCode(data, Invite.INVITES_PATTERN);
  }

  /**
   * Resolves GuildTemplateResolvable to a template code.
   * @param {GuildTemplateResolvable} data The template resolvable to resolve
   * @returns {string}
   */
  static resolveGuildTemplateCode(data) {
    const GuildTemplate = require('../structures/GuildTemplate');
    return this.resolveCode(data, GuildTemplate.GUILD_TEMPLATES_PATTERN);
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
    const file = await this.resolveFileAsBuffer(image);
    return DataResolver.resolveBase64(file);
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
   * Resolves a BufferResolvable to a Buffer or a Stream.
   * @param {BufferResolvable|Stream} resource The buffer or stream resolvable to resolve
   * @returns {Promise<Buffer|Stream>}
   */
  static async resolveFile(resource) {
    if (Buffer.isBuffer(resource) || resource instanceof stream.Readable) return resource;
    if (typeof resource === 'string') {
      if (/^https?:\/\//.test(resource)) {
        const res = await fetch(resource);
        return res.body;
      }

      return new Promise((resolve, reject) => {
        const file = path.resolve(resource);
        fs.stat(file, (err, stats) => {
          if (err) return reject(err);
          if (!stats.isFile()) return reject(new DiscordError('FILE_NOT_FOUND', file));
          return resolve(fs.createReadStream(file));
        });
      });
    }

    throw new TypeError('REQ_RESOURCE_TYPE');
  }

  /**
   * Resolves a BufferResolvable to a Buffer.
   * @param {BufferResolvable|Stream} resource The buffer or stream resolvable to resolve
   * @returns {Promise<Buffer>}
   */
  static async resolveFileAsBuffer(resource) {
    const file = await this.resolveFile(resource);
    if (Buffer.isBuffer(file)) return file;

    const buffers = [];
    for await (const data of file) buffers.push(data);
    return Buffer.concat(buffers);
  }
}

module.exports = DataResolver;
