const Discord = require('./');

module.exports = Discord;
if (typeof window !== 'undefined') window.Discord = Discord; // eslint-disable-line no-undef
// eslint-disable-next-line no-console
else console.warn('Warning: using browser version of Discord.js in a non-browser environment');
