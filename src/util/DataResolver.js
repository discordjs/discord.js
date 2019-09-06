'use strict';

const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const Util = require('../util/Util');
const { Error: DiscordError, TypeError } = require('../errors');
const { browser } = require('../util/Constants');

/**
 * The DataResolver identifies different objects and tries to resolve a specific piece of information from them.
 * @private
 */
class DataResolver {
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
  }

  /**
   * Data that can be resolved to give an invite code. This can be:
   * * An invite code
   * * An invite URL
   * @typedef {string} InviteResolvable
   */

  /**
   * Resolves InviteResolvable to an invite code.
   * @param {InviteResolvable} data The invite resolvable to resolve
   * @returns {string}
   */
  static resolveInviteCode(data) {
    const inviteRegex = /discord(?:app\.com\/invite|\.gg(?:\/invite)?)\/([\w-]{2,255})/i;
    const match = inviteRegex.exec(data);
    if (match && match[1]) return match[1];
    return data;
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
   * * A URL
   * @typedef {string|Buffer} BufferResolvable
   */

  /**
   * @external Stream
   * @see {@link https://nodejs.org/api/stream.html}
   */

  /**
   * Resolves a BufferResolvable to a Buffer.
   * @param {BufferResolvable|Stream} resource The buffer or stream resolvable to resolve
   * @returns {Promise<Buffer>}
   */
  static resolveFile(resource) {
    if (!browser && Buffer.isBuffer(resource)) return Promise.resolve(resource);
    if (browser && resource instanceof ArrayBuffer) return Promise.resolve(Util.convertToBuffer(resource));

    if (typeof resource === 'string') {
      if (/^https?:\/\//.test(resource)) {
        return fetch(resource).then(res => browser ? res.blob() : res.buffer());
      } else if (!browser) {
        return new Promise((resolve, reject) => {
          const file = browser ? resource : path.resolve(resource);
          fs.stat(file, (err, stats) => {
            if (err) return reject(err);
            if (!stats || !stats.isFile()) return reject(new DiscordError('FILE_NOT_FOUND', file));
            fs.readFile(file, (err2, data) => {
              if (err2) reject(err2);
              else resolve(data);
            });
            return null;
          });
        });
      }
    } else if (typeof resource.pipe === 'function') {
      return new Promise((resolve, reject) => {
        const buffers = [];
        resource.once('error', reject);
        resource.on('data', data => buffers.push(data));
        resource.once('end', () => resolve(Buffer.concat(buffers)));
      });
    }

    return Promise.reject(new TypeError('REQ_RESOURCE_TYPE'));
  }
}

module.exports = DataResolver;
