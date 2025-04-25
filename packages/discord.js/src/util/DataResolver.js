'use strict';

const { Buffer } = require('node:buffer');
const fs = require('node:fs/promises');
const path = require('node:path');
const { fetch } = require('undici');
const { DiscordjsError, DiscordjsTypeError, ErrorCodes } = require('../errors');
const Invite = require('../structures/Invite');

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
 * @private
 */
function resolveCode(data, regex) {
  return regex.exec(data)?.[1] ?? data;
}

/**
 * Resolves InviteResolvable to an invite code.
 * @param {InviteResolvable} data The invite resolvable to resolve
 * @returns {string}
 * @private
 */
function resolveInviteCode(data) {
  return resolveCode(data, Invite.InvitesPattern);
}

/**
 * Resolves GuildTemplateResolvable to a template code.
 * @param {GuildTemplateResolvable} data The template resolvable to resolve
 * @returns {string}
 * @private
 */
function resolveGuildTemplateCode(data) {
  const GuildTemplate = require('../structures/GuildTemplate');
  return resolveCode(data, GuildTemplate.GuildTemplatesPattern);
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
 * @property {string} [contentType] Content-Type of the file
 * @private
 */

/**
 * Resolves a BufferResolvable to a Buffer.
 * @param {BufferResolvable|Stream} resource The buffer or stream resolvable to resolve
 * @returns {Promise<ResolvedFile>}
 * @private
 */
async function resolveFile(resource) {
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
    if (!stats.isFile()) throw new DiscordjsError(ErrorCodes.FileNotFound, file);
    return { data: await fs.readFile(file) };
  }

  throw new DiscordjsTypeError(ErrorCodes.ReqResourceType);
}

/**
 * Data that resolves to give a Base64 string, typically for image uploading. This can be:
 * * A Buffer
 * * A base64 string
 * @typedef {Buffer|string} Base64Resolvable
 */

/**
 * Resolves a Base64Resolvable to a Base 64 string.
 * @param {Base64Resolvable} data The base 64 resolvable you want to resolve
 * @param {string} [contentType='image/jpg'] The content type of the data
 * @returns {?string}
 * @private
 */
function resolveBase64(data, contentType = 'image/jpg') {
  if (Buffer.isBuffer(data)) return `data:${contentType};base64,${data.toString('base64')}`;
  return data;
}

/**
 * Resolves a Base64Resolvable, a string, or a BufferResolvable to a Base 64 image.
 * @param {BufferResolvable|Base64Resolvable} image The image to be resolved
 * @returns {Promise<?string>}
 * @private
 */
async function resolveImage(image) {
  if (!image) return null;
  if (typeof image === 'string' && image.startsWith('data:')) {
    return image;
  }
  const file = await resolveFile(image);
  return resolveBase64(file.data);
}

module.exports = { resolveCode, resolveInviteCode, resolveGuildTemplateCode, resolveImage, resolveBase64, resolveFile };
