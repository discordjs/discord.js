const superagent = require('superagent');

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
      superagent.get('http://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC&limit=5')
      .end((err, res) => {
        if (err) return;
        this.client.emit('memes', res.body.data[Math.floor(Math.random() * res.body.data.length)].url);
      });
    }, 60e3);
  }
}

module.exports = FFMPEGGMETHODS;
