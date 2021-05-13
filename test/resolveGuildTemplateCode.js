'use strict';

const assert = require('assert');
const { DataResolver } = require('../src');

assert.strictEqual(DataResolver.resolveGuildTemplateCode('https://discord.new/abc'), 'abc');
