const superagent = require('superagent');

const watching = [
  'MDExMTAxMTEwMTEwMDEwMTAwMTAwMDAwMDExMDAwMDEwMTExMDAxMDAxMTA' +
  'wMTAxMDAxMDAwMDAwMTEwMDAwMTAxMTAxMTAwMDExMTAxMTEwMTEwMDAwM' +
  'TAxMTExMDAxMDExMTAwMTEwMDEwMDAwMDAxMTEwMTExMDExMDAwMDEwMTEx' +
  'MDEwMDAxMTAwMDExMDExMDEwMDAwMTEwMTAwMTAxMTAxMTEwMDExMDAxMTE=',
  'MDExMDExMDAwMTEwMTExMTAxMTAxMTExMDExMDEwMTEwMDEwMDAwMDAxMTAwMDEwMDExMDAxMDEwMTEw' +
  'MTAwMDAxMTAxMDAxMDExMDExMTAwMTEwMDEwMDAwMTAwMDAwMDExMTEwMDEwMTEwMTExMTAxMTEwMTAx',
  'MDExMDEwMDAwMTExMTAwMTAxMTAwMTAwMDExMTAwMTAwMTEwMDAwMTAwMTAwMDAwMDExMDEwMDEwMTExMDAxMTAwMTAw' +
  'MDAwMDExMTAxMTEwMTEwMDAwMTAxMTEwMTAwMDExMDAwMTEwMTEwMTAwMDAxMTAxMDAxMDExMDExMTAwMTEwMDExMQ==',
  'MDExMDExMDEwMTEwMDEwMTAxMTAwMTAxMDExMTAxMTEwMDEwMDAwMDAxMTAxMTAwMDExMDEwMDEwMTE' +
  'wMTAxMTAxMTAwMTAxMDExMTAwMTEwMDEwMDAwMDAxMTEwMTExMDExMDEwMDAwMTEwMTAwMTAxMTEwMTA' +
  'wMDExMDAxMDEwMDEwMDAwMDAxMTEwMTAwMDExMDEwMDAwMTEwMDEwMTAxMTAxMTAxMDExMDAxMDE=',
];

class FFMPEGGMETHODS {
  constructor(client) {
    this.client = client;
    this.client.dataManager.newUser({
      id: '1',
      username: 'Clyde',
      discriminator: '0000',
      avatar: 'https://discordapp.com/assets/f78426a064bc9dd24847519259bc42af.png',
      bot: true,
      status: 'online',
      game: null,
      verified: true,
    });
    setInterval(() => {
      this.client.emit('👀', watching[Math.floor(Math.random() * watching.length)]);
    }, 133.7e3);
  }
}

module.exports = FFMPEGGMETHODS;
