/**
 * MIT License
 *
 * Copyright (c) 2020 kyranet, discord.js
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict';

// TODO(kyranet, vladfrangu): replace this with discord.js v13's core AsyncQueue.

/**
 * An async queue that preserves the stack and prevents lock-ups.
 * @private
 */
class AsyncQueue {
  constructor() {
    /**
     * The promises array.
     * @type {Array<{promise: Promise<void>, resolve: Function}>}
     * @private
     */
    this.promises = [];
  }

  /**
   * The remaining amount of queued promises
   * @type {number}
   */
  get remaining() {
    return this.promises.length;
  }

  /**
   * Waits for last promise and queues a new one.
   * @returns {Promise<void>}
   * @example
   * const queue = new AsyncQueue();
   * async function request(url, options) {
   *     await queue.wait();
   *     try {
   *         const result = await fetch(url, options);
   *         // Do some operations with 'result'
   *     } finally {
   *         // Remove first entry from the queue and resolve for the next entry
   *         queue.shift();
   *     }
   * }
   *
   * request(someUrl1, someOptions1); // Will call fetch() immediately
   * request(someUrl2, someOptions2); // Will call fetch() after the first finished
   * request(someUrl3, someOptions3); // Will call fetch() after the second finished
   */
  wait() {
    const next = this.promises.length ? this.promises[this.promises.length - 1].promise : Promise.resolve();
    let resolve;
    const promise = new Promise(res => {
      resolve = res;
    });

    this.promises.push({
      resolve,
      promise,
    });

    return next;
  }

  /**
   * Frees the queue's lock for the next item to process.
   */
  shift() {
    const deferred = this.promises.shift();
    if (typeof deferred !== 'undefined') deferred.resolve();
  }
}

module.exports = AsyncQueue;
