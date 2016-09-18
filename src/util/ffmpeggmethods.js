class FFMPEGGMETHODS {
  constructor(i) {
    this.client = i.client;
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
  }
}

module.exports = FFMPEGGMETHODS;
